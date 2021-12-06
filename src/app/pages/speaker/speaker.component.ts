import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetalleUsuario } from '../../core/models/usuario.model';
import { SpeakersService } from '../../core/services/speakers.service';
import { UserProfileService } from '../../core/services/user.service';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { element } from 'protractor';

@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.component.html',
  styleUrls: ['./speaker.component.scss']
})
export class SpeakerComponent implements OnInit {
  usuario: DetalleUsuario = {};
  grades: any;
  totalGrades = [];
  getMonths = [];
  collectGetmonths:Array<{}>;
  ldfid: any;
  tstars: String;
  llamadas= [];
  breadCrumbItems: Array<{}>;
  payments: Array<{}>;
  referidos: Array<{}>;
  year: any = new Date().getFullYear();
  selectMonth: any = (new Date().getMonth() + 1);
  selectYear: any = this.year;
  yearMonthSelect: any = this.selectMonth + "/1/" + this.selectYear;
  yearMonth: any = (new Date().getMonth() + 1) + "/1/" + this.year;
  AVGtotal = 0;
  constructor(
    private route: ActivatedRoute,
    public _user: SpeakersService,
    public userService: UserProfileService,
    public _speaker: SpeakersService,
    private fbstore: AngularFirestore,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.userService.applyPermissions();
    this.route.params.subscribe( parametros => {
      this._user.getSpeaker(parametros['id']).subscribe( usuario =>{
        
        this.usuario = usuario.payload.data();
        this.usuario['id'] = parametros['id'];
        this.getCalls(parametros['id']);
        this.usuario['foto'] = ((this.usuario['foto'] === undefined || this.usuario['foto'] == '') ? '../../../assets/images/error-img.png' : this.usuario['foto']);
        this.usuario['birthDate'] = new Date(((this.usuario['birthDate'] === undefined) ? this.usuario['birthDtate'] : this.usuario['birthDate'])).toLocaleDateString('es-MX');
        this.ldfid = this.usuario['LFId'];
        this._user.getReferidos(this.ldfid).subscribe(refer => {
          this.referidos = refer.map( result => {
            return {
              fullName: result.payload.doc.data()['name']+" "+result.payload.doc.data()['lastName'],
              email: result.payload.doc.data()['email'],
              gender: result.payload.doc.data()['gender'],
            }
          })
        })
      })
      
      this._user.getPayments(parametros['id']).subscribe(pagos => {
        this.payments = pagos.map( result => {
          return {
            amount: result.payload.doc.data()['amount_paid'],
            dateCreated: new Date(result.payload.doc.data()['created']).toLocaleString('en-US'),
            pdfInvoice: result.payload.doc.data()['pdfInvoice']
          }
        })
      })
    })
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

  selectMonths(event){
    let monthDate = event.target.value;
    this.selectMonth = (new Date(monthDate).getMonth() + 1);
    this.selectYear = new Date(monthDate).getFullYear();
    console.log(this.selectMonth, this.selectYear);
    this.getCalls(this.usuario['id']);
    
  }

  async getCalls(uid) {
    try {
      await this.fbstore.collection('calls', ref => ref.where('speId','==', uid)).snapshotChanges()
      .subscribe( data => {
        this.llamadas = data.map(result => {
          return {
            calificacion: result.payload.doc.data()['calSpe'],
            create: result.payload.doc.data()['create'],
            sid: result.payload.doc.data()['sid'],
            speId: result.payload.doc.data()['speId'],
            inmpId: result.payload.doc.data()['inmpId'],
            uri: result.payload.doc.data()['uri'],
            recordings: result.payload.doc.data()['recordings'],
          }
        });
         this.llamadas.forEach( (element) => {
          this._speaker.getName(element.inmpId).subscribe(data => {
            element.spe = data.payload.data()
          })
          this.grades= element.calificacion;
          let estrellas: any = "Sin calificar";
          let promedio = 0;
          if(this.grades != undefined){
            promedio+=this.grades.avg;
            this.AVGtotal = promedio/this.llamadas.length
            var suma = this.grades.avg;
            this.totalGrades.push(suma);
            if(suma >= 5){
              estrellas = '<span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span>';
            }
            else if(suma >= 4 && suma < 5){
              estrellas = '<span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star"></span>';
            }
            else if(suma >= 3 && suma < 4){
              estrellas = '<span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span>';
            }
            else if(suma >= 2 && suma < 3){
              estrellas = '<span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span>';
            }
            else if(suma >= 1 && suma < 2){
              estrellas = '<span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span>';
            }
            else if(suma >= 0 && suma < 1){
              estrellas = '<span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span>';
            }
          }
          element.stars = estrellas;
          this.getInfoTwilio(element.sid).subscribe(data2 => {
            //console.log('comp =>', data2);
            
            element.complemento = data2
          })

          this.recordings(element.sid).subscribe(data3 => {
            let grab = data3
            element.audio = "https://api.twilio.com/2010-04-01/Accounts/AC22ae1dad8bd832a2ecd25b28742feddc/Recordings/"+grab['recordings'][0]['sid']+".mp3"
          })
        })

        console.log(this.llamadas);
        
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  getInfoTwilio(uri){
    var url = 'https://api.twilio.com/2010-04-01/Accounts/AC22ae1dad8bd832a2ecd25b28742feddc/Calls/'+uri+'.json';

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa('AC22ae1dad8bd832a2ecd25b28742feddc:6d0d6f07eba5f803bff62351433f8fc5')
      })
    }
    return this.http.get(url, httpOptions);
  }

  recordings(uri:string){
    var url = 'https://api.twilio.com/2010-04-01/Accounts/AC22ae1dad8bd832a2ecd25b28742feddc/Calls/'+uri+'/Recordings.json';

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa('AC22ae1dad8bd832a2ecd25b28742feddc:6d0d6f07eba5f803bff62351433f8fc5')
      })
    }
    return this.http.get(url,httpOptions);
  }


}
