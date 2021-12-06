import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { UserProfileService } from '../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-response-support',
  templateUrl: './response-support.component.html',
  styleUrls: ['./response-support.component.scss']
})
export class ResponseSupportComponent implements OnInit {
  @Input() supportId;
  responseSupportForm: FormGroup;
  supportMessage
  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private fbstore: AngularFirestore,
    private http: HttpClient,
    public userService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.responseSupportForm = this.formBuilder.group({
      message: ['', [Validators.required]],
      email:   ['']
    })
    this.getSupportMessage()
  }

  get form() {
    return this.responseSupportForm.controls;
  }

  async getSupportMessage() {
    const id = this.supportId
    console.log('Llego => ',id);
    
    await this.fbstore.collection('support').doc(id).snapshotChanges()
    .subscribe( data => {
      this.supportMessage = data.payload.data();
      this.fbstore.collection('perfiles').doc(data.payload.data()['from']).snapshotChanges()
      .subscribe( perfil => {
        this.supportMessage.supportName = perfil.payload.data()['name']+" "+perfil.payload.data()['lastName'];
        this.supportMessage.supportEmail = perfil.payload.data()['email'];
        this.supportMessage.supportFrom = perfil.payload.data()['email'] + " | " + ((perfil.payload.data()['role'] == 'conversador') ? 'Speaker': 'Improver');
      })
      console.log(this.supportMessage);
    })
    
  }


  async responseSupport() {//trycatch
    try {
      const dataResponse = this.responseSupportForm.value;
    console.log(dataResponse);
    
     await this.http.post('https://us-central1-ejemplocrud-e7eb1.cloudfunctions.net/sendEmailSupport',{
      email: this.supportMessage.supportEmail,
      response: dataResponse.message
    }).subscribe(async (data: any) => {
      if (data.error) {
        console.log('Error=>', data.error);
        Swal.fire({
          title: 'Hay un problema',
          text: data.error.message,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#5438dc'
        });
        this.activeModal.close("Submit");
      } else {
        console.log(data);
        await this.fbstore.collection('support').doc(this.supportId).update({status: 'answered', response: dataResponse.message}).then(res => {
          console.log('Respuesta enviada=>', res);
          this.activeModal.close("Submit");
        })
      }
    });
    } catch (error) {
      Swal.fire({
        title: 'Hay un problema',
        text: error.message,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#5438dc'
      });
    }
    
    
  }

}
