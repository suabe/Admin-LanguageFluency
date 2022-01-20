import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProfileService } from '../../core/services/user.service';
import { ExcellService } from 'src/app/core/services/excell.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cobros',
  templateUrl: './cobros.component.html',
  styleUrls: ['./cobros.component.scss']
})
export class CobrosComponent implements OnInit {
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
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Cobros', active: true }];
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
    await this.fbstore.collection('pagos').snapshotChanges()
    .subscribe( pagos => {
      this.listaCobros = pagos.map(pago => {
        return {
          paid_id: pago.payload.doc.id,
          amount_paid: pago.payload.doc.data()['amount_paid'],
          created: pago.payload.doc.data()['created'],
          subscription: pago.payload.doc.data()['subscription'],
          uid: pago.payload.doc.data()['uid'],
          pdfInvoice: pago.payload.doc.data()['pdfInvoice'],
          idioma: '',
          price: '',
          start_date: '',
          status: '',
          improver: ''
        }
      });
      this.listaCobros.forEach( (cobro) => {
        this.fbstore.collection('plans').doc(cobro.subscription).snapshotChanges()
        .subscribe( plan => {
          this.fbstore.collection('perfiles').doc(cobro.uid).snapshotChanges()
          .subscribe(user => {
            cobro.idioma = plan.payload.data()['idioma'];
            cobro.price = plan.payload.data()['price'];
            cobro.start_date = plan.payload.data()['start_date'];
            cobro.status = plan.payload.data()['status'];
            cobro.improver = user.payload.data()['name']+' '+user.payload.data()['lastName']
          },() => {
            this.dtTrigger.next();
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
