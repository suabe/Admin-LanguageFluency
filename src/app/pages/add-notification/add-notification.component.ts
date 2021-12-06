import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.scss']
})
export class AddNotificationComponent implements OnInit {
  addNotiForm: FormGroup;
  submit: boolean;
  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private fbstore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.addNotiForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      message: ['', [Validators.required]],
      grupo: ['', [Validators.required]]
    });
    this.submit = false;
  }

  get form() {
    return this.addNotiForm.controls;
  }

  onSubmit() {
    const dataNoti = this.addNotiForm.value
    dataNoti['created'] = new Date().getTime()
    this.fbstore.collection('notifications').add(dataNoti).then(noti => {
      console.log('Notificacion enviada =>', noti);
      this.activeModal.close("Submit");
    }).catch(error => {
      Swal.fire({
        title: 'Hay un problema',
        text: error.message,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#5438dc'
      })
    })
    
  }

}
