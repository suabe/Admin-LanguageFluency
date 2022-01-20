import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { UserProfileService } from '../../core/services/user.service';
import Swal from 'sweetalert2';
import { ExcellService } from '../../core/services/excell.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.scss']
})
export class SpeakersComponent implements OnInit {
  usuarioLogeado;
  userList = [];
  cargando = false;
  breadCrumbItems: Array<{}>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  getMonths = [];
  collectGetmonths:Array<{}>;
  year: any = new Date().getFullYear();
  selectMonth: any = (new Date().getMonth() + 1);
  selectYear: any = this.year;
  yearMonthSelect: any = this.selectMonth + "/1/" + this.selectYear;
  yearMonth: any = (new Date().getMonth() + 1) + "/1/" + this.year;
  typeUser: any = "Speakers";
  constructor(
    private fbstore: AngularFirestore,
    public userService: UserProfileService,
    private excelService:ExcellService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.userService.applyPermissions();
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Speakers', active: true }];
    this.getSpeakers();
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,
      retrieve: true,
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ &eacute;l&eacute;ments",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      },
      dom: 'Bfrtip',
      scrollX: true,
      buttons: [
        {
            extend: 'excelHtml5',
            title: 'Reporte general speakers'
        },
        {
          extend: 'copyHtml5',
          title: 'Reporte general speakers'
        }
      ],
      
    };

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

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.dtTrigger.unsubscribe();
  }

  async exportReporte() {
    await this.fbstore.collection('perfiles', ref => ref.where('role', '==', 'conversador')).snapshotChanges()
    .subscribe(data => {
      const usuarios = data.map( result => {
        let today: any = new Date();
          let birthDate = new Date(new Date((result.payload.doc.data()['birthDate'] === undefined) ? result.payload.doc.data()['birthDtate'] : result.payload.doc.data()['birthDate']).toLocaleString('en-US'));
          let birthday = +birthDate;
          birthday = ~~((today - birthday) / (31557600000));
          let bday = new Date(birthDate).toLocaleDateString();
          return {
            userId: result.payload.doc.id,
            LFID: result.payload.doc.data()['LFId'],
            Nombre: result.payload.doc.data()['name'],
            Apellidos: result.payload.doc.data()['lastName'],
            Email: result.payload.doc.data()['email'],
            Genero: result.payload.doc.data()['gender'],
            Pais: result.payload.doc.data()['country'],
            Telefono: result.payload.doc.data()['code'],
            FechaNacimiento: bday,
            Estatus: result.payload.doc.data()['status'],
            Registrado: new Date(result.payload.doc.data()['creado']).toLocaleDateString('en-Us')
          }

      } )
      this.excelService.exportAsExcelFile(usuarios,'General Speakers')
      console.log(usuarios);
      
    })
  }

  async getSpeakers() {
    try {
      await this.fbstore.collection('perfiles', ref => ref.where('role', '==', 'conversador')).snapshotChanges()
      .subscribe(data => {
        //console.log(data);
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
            userGender: result.payload.doc.data()['gender'],
            userLfNumber: result.payload.doc.data()['LFId'],
            userCountry: result.payload.doc.data()['country'],
            userLanguage: result.payload.doc.data()['idioma'],
            userBirthDate: birthday,
            userStatus: result.payload.doc.data()['status'],
            userPhone: result.payload.doc.data()['code'],
            userDayOfBirth: bday,
            userCreatedAt: new Date(result.payload.doc.data()['creado']).toLocaleDateString('en-Us'),
            userCalls: '',
            amountCallsMade: 0,
            referralAmount: 0,
            totalAmount: 0,
          }
          // this.cargando = false;
        });

        this.userList.forEach((element) => {
          this.fbstore.collection('calls', ref => ref.where('speId', '==', element.userId)).snapshotChanges()
          .subscribe(doc => {
            let numberCalls = 0;
            let minutes: number = 0;
            element.userCalls = "<b class='text-info'>" + numberCalls + "</b> llamadas<br>" + "<b class='text-info'>" + minutes.toFixed(2) + "</b> minutos";

            doc.map(result2 => {
              this.getInfoTwilio(result2.payload.doc.data()['sid']).subscribe(data2 => {
                //console.log(element.userId, data2['date_created']);
                let callMonth = (new Date(data2['date_created']).getMonth() + 1);
                let callYear = new Date(data2['date_created']).getFullYear();
                //console.log(callMonth, callYear, this.selectMonth, this.selectYear);
                if (this.selectMonth == callMonth && this.selectYear == callYear) {
                  numberCalls++;
                  element.amountCallsMade = numberCalls * 15;
                  element.referralAmount = 0 * 0;
                  element.totalAmount = (element.amountCallsMade + element.referralAmount).toFixed(2);
                  console.warn("Mismo mes");
                  minutes += (parseInt(data2['duration']) / 60);
                  element.userCalls = "<b class='text-info'>" + numberCalls + "</b> llamadas<br>" + "<b class='text-info'>" + minutes.toFixed(2) + "</b> minutos";
                }
                else{
                  console.log("Diferente mes");
                }
              });
            });

          });
        });
        // this.cargando = false;
        this.dtTrigger.next();
        setTimeout(() => {
          this.cargando = false;
        }, 2000);
      });

    } catch (error) {
      console.log(error.message);

    }
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
      text: '¿Está seguro que quiere '+estado+' este speaker?',
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

  selectMonths(event){
    let monthDate = event.target.value;
    this.selectMonth = (new Date(monthDate).getMonth() + 1);
    this.selectYear = new Date(monthDate).getFullYear();
    //console.log(this.selectMonth, this.selectYear);

    this.getSpeakers()
  }

  getInfoTwilio(uri){
    var url = 'https://api.twilio.com/2010-04-01/Accounts/9aa31c2d0d5d07a9ff66af0b2be1e969/Calls/'+uri+'.json';

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa('9aa31c2d0d5d07a9ff66af0b2be1e969:f59fe5f034ce4cac5ebc6aebe9d3aad2')
      })
    }
    return this.http.get(url, httpOptions);
  }
}
