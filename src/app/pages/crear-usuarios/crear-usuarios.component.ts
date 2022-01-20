import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ExcellService } from 'src/app/core/services/excell.service';
import { UserProfileService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-crear-usuarios',
  templateUrl: './crear-usuarios.component.html',
  styleUrls: ['./crear-usuarios.component.scss']
})
export class CrearUsuariosComponent implements OnInit {
  cargando = false;
  breadCrumbItems: Array<{}>;
  listaUsuarios = [];
  constructor(
    private fbstore: AngularFirestore,
    public userService: UserProfileService,
    private excelService: ExcellService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Cobros', active: true }];
    //this.cargarImprovers()
  }

  async cargarImprovers() {
    this.http.get('/assets/improvers.json').subscribe((usuarios:Array<[]>) => {
      this.listaUsuarios = usuarios;
      this.listaUsuarios.forEach(usuario => {
        let ori = usuario['cumpleanos']
        let date1 = ori.split('/')
        let date2 = date1[1]+'/'+date1[0]+'/'+date1[2]
        let time = new Date(date2).getTime()        
        
        this.http.post('https://us-central1-ejemplocrud-e7eb1.cloudfunctions.net/regAdmin',{
          email: usuario['correo'],
          name: usuario['nombre'],
          lastName: usuario['apellido'],
          password: "usuario"+usuario['nombre']
        }).subscribe((data:any) => {
          let user = {
            birthDate: time,
            code:     usuario['telefono'],
            country:  usuario['Pais'],
            email:    usuario['correo'] ,
            gender:   'hombre',
            horario:  '8',
            name:     usuario['nombre'],
            lastName: usuario['apellido'],
            phone:    usuario['telefono'],
            role:     'cliente',
            status:   'active'
          }
          this.fbstore.collection('perfiles').doc(data.uid).set(user).then(res => {
            console.log('Perfil creado=>', res);
          })
          let plans = {
            activa: true,
            price: 'price_1IiLcPFjLGC5FmHqDAZZskyw',
            enllamada: false,
            creada: new Date().getTime(),
            uid: data.uid,
            status: 'active',
            start_date: new Date().getTime(),
            customer: data.uid,
            idioma: usuario['idioma'],
            start: 8,
            end: 'aa'
          }
          let d = Date.now().toString();
          this.fbstore.collection('plans').doc(d).set(plans).then( plan => {
            console.log('Plan creado=>', plan);
            
          })
        })
      })
    })
  }

  async cargarSpeakers() {
    this.http.get('/assets/speaker.json').subscribe((usuarios:Array<[]>) => {
      this.listaUsuarios = usuarios;
      this.listaUsuarios.forEach(usuario => {
        let ori = usuario['cumpleanos']
        let date1 = ori.split('/')
        let date2 = date1[1]+'/'+date1[0]+'/'+date1[2]
        let time = new Date(date2).getTime()        
        //console.log(usuario['idioma']);
        
        this.http.post('https://us-central1-ejemplocrud-e7eb1.cloudfunctions.net/regAdmin',{
          email: usuario['correo'],
          name: usuario['nombre'],
          lastName: usuario['apellido'],
          password: "usuario"+usuario['nombre']
        }).subscribe((data:any) => {
          let user = {
            birthDate:  time,
            code:       usuario['telefono'],
            country:    usuario['pais'],
            email:      usuario['correo'] ,
            gender:     'hombre',
            horario:    '8',
            name:       usuario['nombre'],
            lastName:   usuario['apellido'],
            phone:      usuario['telefono'],
            idioma:     usuario['idioma'],
            role:       'conversador',
            status:     'active',
            creado:     new Date().toString()
          }
          this.fbstore.collection('perfiles').doc(data.uid).set(user).then(res => {
            console.log('Perfil creado=>', res);
          })
          
        })
      })
    })
  }

  async updateImprovers() {
    this.http.get('/assets/speaker.json').subscribe((usuarios:Array<[]>) => {
      this.listaUsuarios = usuarios;
      this.listaUsuarios.forEach(usuario => {
        let ori = usuario['registro']
        let date1 = ori.split('/')
        let date2 = date1[1]+'/'+date1[0]+'/'+date1[2]
        let time = new Date(date2).getTime() 
        let users = {
          creado: time,
          creadoDate: new Date(date2)
        }
        let uid
        this.fbstore.collection('perfiles', ref => ref.where('email', '==', usuario['correo'])).snapshotChanges()
        .subscribe(user => {
          uid = user.map(result => {
            return {
              id: result.payload.doc.id
            }
          })
            this.fbstore.collection('perfiles').doc(uid[0].id).update(users).then(() => {
            console.log(uid[0].id);
          }) 
        })
        //console.log(uid);
        
               
        
      })
    })
  }

}
