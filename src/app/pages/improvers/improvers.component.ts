import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProfileService } from '../../core/services/user.service';
import Swal from 'sweetalert2';
import { ExcellService } from '../../core/services/excell.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Handsontable from 'handsontable/base';
import { HandsontableCellType } from 'handsontable/cellTypes';
import {starsRenderer} from './rendere.model';
import { HandsontableEditor } from 'handsontable/editors';


@Component({
  selector: 'app-improvers',
  templateUrl: './improvers.component.html',
  styleUrls: ['./improvers.component.scss']
})
export class ImproversComponent implements OnInit {
  usuarioLogeado;
  userList = [];
  cargando = false;
  breadCrumbItems: Array<{}>;
  
  getMonths = [];
  collectGetmonths:Array<{}>;
  year: any = new Date().getFullYear();
  selectMonth: any = (new Date().getMonth() + 1);
  selectYear: any = this.year;
  yearMonthSelect: any = this.selectMonth + "/1/" + this.selectYear;
  yearMonth: any = (new Date().getMonth() + 1) + "/1/" + this.year;
  typeUser: any = "Speakers";
  hotSettings = {}
  /**
   * Config-Tabla
  */
   hotInstance: Handsontable;
   public onAfterInit = (hotInstance) => {
    this.hotInstance = hotInstance;
  }
   renderClass = starsRenderer
   hiddenColumns = {
     indicators: true
   };
   licenseKey = "non-commercial-and-evaluation";
   totalImprover = 0;
   totalbyStatus = [];
  constructor(
    private fbstore: AngularFirestore,
    public userService: UserProfileService,
    private excelService: ExcellService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.userService.applyPermissions();
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Improvers', active: true }];
    this.getClientes();
    

    var limitMonth = new Date().getMonth();
    var limitYear = new Date().getFullYear();
    var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    var mesesSelected = ""
    for (let index = 0; index <= limitMonth; index++) {
      var fechaOutPut = '1/'+limitMonth+'/'+limitYear;
      if(index == limitMonth){
        mesesSelected = "selected";
      }
      this.getMonths.push({mes:meses[index],fecha:fechaOutPut,selectMonth:mesesSelected,year:limitYear});
    }
    this.collectGetmonths = this.getMonths;
  }

 
  


  async exportReporte() {
    let hot = this.hotInstance;
    let exportPlugin1 = hot.getPlugin('exportFile');
    exportPlugin1.downloadFile('csv', {
      bom: false,
      columnDelimiter: ',',
      columnHeaders: true,
      exportHiddenColumns: true,
      exportHiddenRows: true,
      fileExtension: 'csv',
      filenme: 'Reporte-Improvers_[YYYY]-[MM]-[DD]',
      mimeType: 'text/csv',
      rowDelimiter: '\r\n',
      rowHeaders: true
    });
  }

  async getClientes() {
    const toTitleCase = (str: string) =>
      str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        ?.map((x) => x.charAt(0).toUpperCase() + x.slice(1))
        .join(" ");
    try {
      await this.fbstore.collection('perfiles', ref => ref.where('role', '==', 'cliente')).snapshotChanges()
      .subscribe(data => {
        //console.log(data);
        var statusImpro = [];
        this.userList = data.map( result => {
          //console.log(result);
          let today: any = new Date();
          let birthDate = new Date(new Date((result.payload.doc.data()['birthDate'] === undefined) ? result.payload.doc.data()['birthDtate'] : result.payload.doc.data()['birthDate']).toLocaleString('en-US'));

          //let birthDateF = Math.floor((today - new Date(birthDate).getTime()) / 3.15576e+10);
          //console.log(birthDateF);

          let birthday = +birthDate;
          birthday = ~~((today - birthday) / (31557600000));
          let bday = new Date(birthDate).toLocaleDateString();
          return {
            userId: result.payload.doc.id,
            userName: result.payload.doc.data()['name'],
            userLastName: result.payload.doc.data()['lastName'],
            userEmail: result.payload.doc.data()['email'],
            userGender: toTitleCase(result.payload.doc.data()['gender']),
            userLfNumber: result.payload.doc.data()['LFId'],
            userCountry: result.payload.doc.data()['country'],
            userPhone: result.payload.doc.data()['code'],
            userDayOfBirth: bday,
            userBirthDate: birthday,
            userBio: result.payload.doc.data()['bio'],
            userStatus: toTitleCase(result.payload.doc.data()['status']),
            userOption: '<a href="/improver/'+result.payload.doc.id+'">Ver</a>',
            userControl: (result.payload.doc.data()['status'] == 'active')&& '<button (click)="changeStatus("suspended",'+ result.payload.doc.id +')" type="button" class="btn btn-sm btn-success mt-1"><i class="fas fa-check"></i> Suspender</button>',
            userCreatedAt: new Date(result.payload.doc.data()['creado']).toLocaleDateString('en-Us'),
            plans: {},
            totalCalls: 0,
            totalAVG: 0
          }
          // this.cargando = false;
        });
        this.totalImprover = this.userList.length
        var dataStatus = [];
        var nameStatus = [];
        this.userList.forEach((user) => {
          this.fbstore.collection('plans', ref => ref.where('uid','==',user.userId)).get().subscribe(plans => {
            plans.forEach((doc) => {
              //console.log(doc.id, ' => ', doc.data());
              user.plans.price = (doc.data()['price'] == 'price_1IiLcPFjLGC5FmHqDAZZskyw') ? 'Fluency 10/3':'+Fluency',
              user.plans.idioma = toTitleCase(doc.data()['idioma']),
              user.plans.start = doc.data()['start']+' Hrs',
              user.plans.creada = new Date(doc.data()['creada']).toLocaleDateString(),
              user.plans.status = doc.data()['status']
            })
            //user.plans = plans
          })
          this.fbstore.collection('calls', ref => ref.where('inmpId','==',user.userId)).get()
          .subscribe(calls => {
            user.totalCalls = calls.size
            let promedio = 0;
            calls.forEach((doc) => {
              calificacion: doc.data()['calImp'];
              
              promedio+=doc.data()['calImp']['avg']
            })
            user.totalAVG = promedio/calls.size
          })
          if (user.userStatus  != undefined) {
            statusImpro.push(user.userStatus)
          }
          
        })
        let countStatus = {};
          for(let i = 0; i < statusImpro.length; i++) {
            if (countStatus[statusImpro[i]]){
              countStatus[statusImpro[i]] += 1
              } else {
                countStatus[statusImpro[i]] = 1
              }  
          }

          for(let prop in countStatus) {
              if (countStatus[prop] >= 1){
                dataStatus.push({value: countStatus[prop], name:toTitleCase(prop)});
                nameStatus.push(toTitleCase(prop))
            }
          }
          this.totalbyStatus = dataStatus
          console.log('por estustus: ',this.totalbyStatus);
          //console.log(this.userList);
       
        // this.cargando = false;
        //this.dtTrigger.next();
        setTimeout(() => {
          this.cargando = false;
        }, 2000);
      });

    } catch (error) {
      console.log(error.message);

    }
  }

  detalleUsuario(uid: string) {
    console.log(uid);

  }

  changeStatus(status: string, id: string){
    this.usuarioLogeado = JSON.parse(sessionStorage.getItem('authUser'));
    var estado = "";
    if(status == 'canceled'){
      estado = "Cancelar"
    }
    else if(status == 'suspended'){
      estado = "Suspender"
    }
    else if(status == 'active'){
      estado = "Activar"
    }
    Swal.fire({
      title: estado,
      text: '¿Está seguro que quiere '+estado+' este improver?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, '+estado,
      cancelButtonText: 'No, aún no',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Confirme su contraseña para continuar",
          input:'password',
          inputPlaceholder: 'Ingrese su contraseña',
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar'
        }).then((inputValue) => {
          if (inputValue.value) {
            var corecto = false;
            this.fbstore.collection('perfiles').doc(this.usuarioLogeado.uid).ref.get().then(function (doc) {
              if (doc.exists) {
                if (doc.data()['password'] == inputValue.value) {
                  corecto = true;
                }
              } 
              else {
                Swal.fire({
                  icon: 'error',
                  title: 'Lo sentimos...',
                  text: 'Hubo un error. Intentelo más tarde',
                })
              }
            }).then(()=>{
              if(corecto == true){
                this.fbstore.collection('perfiles').doc(id).ref.update({status: status}).then(() => {
                  console.log("Status actualizado");
                });
              }
              else{
                Swal.fire({
                  icon: 'error',
                  title: 'Lo sentimos...',
                  text: 'La contraseña es incorrecta',
                })
              }
            })
          }
        })
      }
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    
    // this.exportReporte().finally()
  }
}
