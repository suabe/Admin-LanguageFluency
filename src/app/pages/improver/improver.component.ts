import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImproversService } from '../../core/services/improvers.service';
import { DetalleUsuario } from '../../core/models/usuario.model';
import * as firebase from 'firebase/app';
import { SpeakersService } from '../../core/services/speakers.service';
import { UserProfileService } from '../../core/services/user.service';

@Component({
  selector: 'app-improver',
  templateUrl: './improver.component.html',
  styleUrls: ['./improver.component.scss']
})
export class ImproverComponent implements OnInit {
  usuario: DetalleUsuario = {};
  breadCrumbItems: Array<{}>;
  llamadas:  Array<{}>;
  speakers:  {};
  speaker: {};
  constructor(
    private route: ActivatedRoute,
    public _user: ImproversService,
    public _speaker: SpeakersService,
    public userService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.userService.applyPermissions();


    this.route.params.subscribe( parametros => {
      // console.log(parametros);
      this._user.getImprover(parametros['id']).subscribe( usuario =>{
        this.usuario = usuario.payload.data();
        this.usuario['id'] = parametros['id'];
        this.usuario['foto'] = ((this.usuario['foto'] === undefined || this.usuario['foto'] == '') ? '../../../assets/images/error-img.png' : this.usuario['foto']);
        this.usuario['birthDate'] = new Date(((this.usuario['birthDate'] === undefined) ? this.usuario['birthDtate'] : this.usuario['birthDate'])).toLocaleDateString('es-MX');
        // console.log(this.usuario);
      })

      this._user.getCalls(parametros['id']).subscribe(calls => {
        this.llamadas = calls.map( result => {
          return {
            sid: result.payload.doc.data()['sid'],
            speId: result.payload.doc.data()['speId'],
            uri: result.payload.doc.data()['uri'],
            recordings: result.payload.doc.data()['recordings'],
            date: firebase.firestore.FieldValue.serverTimestamp(),
          }
        })
        for (let index = 0; index < this.llamadas.length; index++) {
          this._speaker.getName(this.llamadas[index]['speId']).subscribe(data => {
            this.llamadas[index]['spe']= data.payload.data()
          })
          console.log(this.llamadas);
        }
      })

    })
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Improver', active: true }];


  }

}
