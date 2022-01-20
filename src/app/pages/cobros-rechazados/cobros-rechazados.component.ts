import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProfileService } from 'src/app/core/services/user.service';
import { ExcellService } from 'src/app/core/services/excell.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cobros-rechazados',
  templateUrl: './cobros-rechazados.component.html',
  styleUrls: ['./cobros-rechazados.component.scss']
})
export class CobrosRechazadosComponent implements OnInit {
  listaCobros = [];
  cargando = false;
  breadCrumbItems: Array<{}>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private fbstore: AngularFirestore,
    public userService: UserProfileService,
    private excelService: ExcellService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getCobros();
    this.userService.applyPermissions();
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Cobros Rechazados', active: true }];
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
            title: 'Reporte general pagos'
        },
        {
          extend: 'copyHtml5',
          title: 'Reporte general pagos'
        }
      ],
      columnDefs: [
        {
          visible: false,
          targets: [5]
        },
        {
          visible: false,
          targets: [7]
        },
        {
          visible: false,
          targets: [10]
        }
      ]
    };
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.dtTrigger.unsubscribe();
  }

  async getCobros() {
    this.cargando = true;
    await this.fbstore.collection('pagos', ref => ref.where('status', '==', 'payment_failed')).snapshotChanges()
    .subscribe( pagos => {
      this.listaCobros = pagos.map(pago => {
        return {
          paid_id: pago.payload.doc.id,
          amount_paid: pago.payload.doc.data()['amount_paid'],
          created: pago.payload.doc.data()['created'],
          subscription: pago.payload.doc.data()['subscription'],
          uid: pago.payload.doc.data()['uid'],
          pdfInvoice: pago.payload.doc.data()['pdfInvoice']
        }
      });
      this.listaCobros.forEach(async (cobro) => {
        await this.fbstore.collection('plans').doc(cobro.subscription).snapshotChanges()
        .subscribe(async plan => {
          await this.fbstore.collection('perfiles').doc(cobro.uid).snapshotChanges()
          .subscribe(user => {
            cobro.idioma = plan.payload.data()['idioma'];
            cobro.price = plan.payload.data()['price'];
            cobro.start_date = plan.payload.data()['start_date'];
            cobro.status = plan.payload.data()['status'];
            cobro.improver = user.payload.data()['name']+' '+user.payload.data()['lastName']
          })
        })
        
      })
      console.log(this.listaCobros);
      
      this.dtTrigger.next();
    })
    setTimeout(() => {
      this.cargando = false;
    }, 2000);
  }

}
