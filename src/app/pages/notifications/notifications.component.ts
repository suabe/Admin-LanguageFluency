import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { UserProfileService } from 'src/app/core/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNotificationComponent } from '../add-notification/add-notification.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  cargando = false;
  notificationList = [];

  constructor(
    private fbstore: AngularFirestore,
    public userService: UserProfileService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.userService.applyPermissions();
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Notificaciones', active: true }];
    this.getNotifications();
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
      }
    };
  }

  newNotification() {
    const modalRef = this.modalService.open(AddNotificationComponent)
  }

  async getNotifications() {
    try {
      await this.fbstore.collection('notifications').snapshotChanges()
      .subscribe( data => {
        this.notificationList = data.map( result => {
          return {
            notiId: result.payload.doc.id,
            title: result.payload.doc.data()['title'],
            message: result.payload.doc.data()['message'],
            created: result.payload.doc.data()['created']
          }
        });
        this.dtTrigger.next();
        setTimeout(() => {
          this.cargando = false;
        }, 2000);
      });
    } catch (error) {
      console.log(error.message);
    }
  }

}
