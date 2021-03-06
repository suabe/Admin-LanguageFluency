import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProfileService } from 'src/app/core/services/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ChartType } from './dashboard-speaker.model';

@Component({
  selector: 'app-dashboard-speaker',
  templateUrl: './dashboard-speaker.component.html',
  styleUrls: ['./dashboard-speaker.component.scss']
})
export class DashboardSpeakerComponent implements OnInit {
  lengthImprover: number = 0;
  cargando = false;
  breadCrumbItems: Array<{}>;
  filtroForm: FormGroup;
  getMonths = [];
  collectGetmonths:Array<{}>;
  year: any = new Date().getFullYear();
  selectMonth: any = (new Date().getMonth() + 1);
  selectYear: any = this.year;
  yearMonthSelect: any = this.selectMonth + "/1/" + this.selectYear;
  yearMonth: any = (new Date().getMonth() + 1) + "/1/" + this.year;
  improverPerCountry: ChartType;
  improverPerLanguage: ChartType;
  improverPerGender: ChartType;
  improverPerAge: ChartType;
  improverPerStatus: ChartType;
  improverPerSchedule: ChartType;
  constructor(
    private fbstore: AngularFirestore,
    public userService: UserProfileService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userService.applyPermissions();
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Dashbord Sepakers', active: true }];
    this.filtroForm = this.formBuilder.group({
      ano: [this.selectYear],
      mes: [this.selectMonth]
    })
    var limitMonth = new Date().getMonth();
    var limitYear = new Date().getFullYear();
    var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    var anos = [2021,2022];
    var mesesSelected = ""
    for (let index = 0; index <= 11; index++) {
      var fechaOutPut = index;
      if(index == limitMonth){
        mesesSelected = "selected";
      } else{mesesSelected = "";}
      this.getMonths.push({mes:meses[index],fecha:fechaOutPut+1,selectMonth:mesesSelected});
    }
    this.collectGetmonths = this.getMonths;
    // console.log(this.selectMonth);
    this.getSpeakers()
  }

  getSpeakers() {
    const fechaFiltro = this.selectYear+'-'+this.selectMonth
    console.log(new Date(fechaFiltro));
    console.log(new Date(fechaFiltro).getTime());
    
    const toTitleCase = (str: string) =>
      str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        ?.map((x) => x.charAt(0).toUpperCase() + x.slice(1))
        .join(" ");
    this.fbstore.collection('perfiles', ref => ref.where('role', '==', 'conversador').where('creadoDate','>=',new Date(fechaFiltro))).snapshotChanges()
    .subscribe(data => {
      
      var arCountry = [];
      var dataCountry = [];
      var nameCountry = [];
      var dataEdad = [];
      var dataGenero = [];
      var newImprovers = 0;
      var allimprovers = 0;
      var mes = new Date().getMonth();
      var anio = new Date().getFullYear();
      var arLanguage = [];
      var dataLanguage = [];
      var nameLanguage = [];
      var edadImpro = [];
      var generoImpro = [];
      var dataStatus = [];
      var statusImpro = [];
      var nameGenero = [];
      var nameEdad = [];
      var nameStatus = [];
      data.forEach((countrie: any) => { 
        arCountry.push(countrie.payload.doc.data()['country'].toUpperCase());
        allimprovers = allimprovers+1;
        if(countrie.payload.doc.data()['birthDate'] != undefined){
          let today: any = new Date();
          let birthDate = new Date(new Date((countrie.payload.doc.data()['birthDate'] === undefined) ? countrie.payload.doc.data()['birthDtate'] : countrie.payload.doc.data()['birthDate']).toLocaleString('en-US'));
          let birthday = +birthDate;
          birthday = ~~((today - birthday) / (31557600000));
          let bday = new Date(birthDate).toLocaleDateString();
          edadImpro.push(birthday)          
        }
        if(countrie.payload.doc.data()['idioma'] != undefined){
          arLanguage.push(countrie.payload.doc.data()['idioma'][0].toUpperCase());
        }
        if (countrie.payload.doc.data()['gender'] != undefined) {
          generoImpro.push(countrie.payload.doc.data()['gender'])
        }
        if (countrie.payload.doc.data()['status'] != undefined) {
          statusImpro.push(countrie.payload.doc.data()['status'])
        }
      })

      //console.log('genero', generoImpro);

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
      this.improverPerStatus = {
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        series: [{
            data: dataStatus,
            type: 'pie',
        }],
        color: ['#556ee6', '#34c38f', '#f1b44c', '#50a5f1', '#f46a6a','#593dba','#7c6eac','#575070','#50705e','#d6b81d'],
        legend: {
            x: 'center',
            y: 'bottom',
            data: nameStatus,
        }
      };
      console.log('por estustus: ',dataStatus);
      

      let countGenero = {};
      for(let i = 0; i < generoImpro.length; i++) {
        if (countGenero[generoImpro[i]]){
          countGenero[generoImpro[i]] += 1
          } else {
            countGenero[generoImpro[i]] = 1
          }  
      }

      for(let prop in countGenero) {
          if (countGenero[prop] >= 1){
            dataGenero.push({value: countGenero[prop], name:toTitleCase(prop)});
            nameGenero.push(toTitleCase(prop))
        }
      }
      this.improverPerGender = {
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        series: [{
            data: dataGenero,
            type: 'pie',
        }],
        color: ['#68b6ff','#7c6eac'],
        legend: {
            x: 'center',
            y: 'bottom',
            data: nameGenero,
        }
      };
      console.log('por genero ',dataGenero);
      


      let countEdad = {};
      for (let i = 0; i < edadImpro.length; i++) {
        if (countEdad[edadImpro[i]]){
          countEdad[edadImpro[i]] += 1
          } else {
            countEdad[edadImpro[i]] = 1
          }        
      }
      
      for(let prop in countEdad) {
          if (countEdad[prop] >= 1){
            dataEdad.push({value: countEdad[prop], name:prop+' a??os'});
            nameEdad.push(prop+' a??os')
        }
      }
      this.improverPerAge = {
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        series: [{
            data: dataEdad,
            type: 'pie',
        }],
        color: ['#556ee6', '#34c38f', '#f1b44c', '#50a5f1', '#f46a6a','#593dba','#7c6eac','#575070','#50705e','#d6b81d'],
        legend: {
            x: 'center',
            y: 'bottom',
            data: nameEdad,
        }
      };
      console.log('por edad:',nameEdad);
      
      
      let counts = {};
      for(let i =0; i < arCountry.length; i++){ 
        if (counts[arCountry[i]]){
        counts[arCountry[i]] += 1
        } else {
        counts[arCountry[i]] = 1
        }
      }
      
      for (let prop in counts){
        if (counts[prop] >= 1){
            dataCountry.push({value: counts[prop], name:prop});
            nameCountry.push(prop);
        }
      }
      this.improverPerCountry= {
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        series: [{
            data: dataCountry,
            type: 'pie',
        }],
        color: ['#556ee6', '#34c38f', '#f1b44c', '#50a5f1', '#f46a6a','#593dba','#7c6eac','#575070','#50705e','#d6b81d'],
        legend: {
            x: 'center',
            y: 'bottom',
            data: nameCountry,
        }
      };
      console.log('Por pais',dataCountry);
      

      let countsIdioma = {};
      for(let i =0; i < arLanguage.length; i++){ 
        if (countsIdioma[arLanguage[i]]){
        countsIdioma[arLanguage[i]] += 1
        } else {
        countsIdioma[arLanguage[i]] = 1
        }
      }
      for (let prop in countsIdioma){
        if (countsIdioma[prop] >= 1){
            dataLanguage.push({value: countsIdioma[prop], name:prop});
            nameLanguage.push(prop);
        }
      }
      this.improverPerLanguage = {
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        series: [{
            data: dataLanguage,
            type: 'pie',
        }],
        color: ['#556ee6', '#34c38f', '#f1b44c', '#50a5f1', '#f46a6a','#593dba','#7c6eac','#575070','#50705e','#d6b81d'],
        legend: {
            x: 'center',
            y: 'bottom',
            data: nameLanguage,
        }
      };
      console.log('Por idioma: ', dataLanguage);
      
     
      this.lengthImprover = data.length;
    });
  }

  getSpeakersAll(month, year, arCountry, newImprovers, allimprovers, mes, anio, arLanguage, dataLanguage, nameLanguage, edadImpro, generoImpro, statusImpro, idimaplan, horarioPlan) {
    const fechaFiltro = year+'-'+month
    console.log(new Date(fechaFiltro));
    console.log(new Date(fechaFiltro).getTime());
    
    const toTitleCase = (str: string) =>
      str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        ?.map((x) => x.charAt(0).toUpperCase() + x.slice(1))
        .join(" ");
    this.fbstore.collection('perfiles', ref => ref.where('role', '==', 'conversador').where('creadoDate','>=',new Date(fechaFiltro))).snapshotChanges()
    .subscribe(data => {
      
      var dataStatus = [];
      var nameStatus = [];
      var dataGenero = [];
      var nameGenero = [];
      var dataEdad = [];
      var nameEdad = [];
      var dataCountry = [];
      var nameCountry = [];
      
      data.forEach((countrie: any) => { 
        arCountry.push(countrie.payload.doc.data()['country'].toUpperCase());
        allimprovers = allimprovers+1;
        if(countrie.payload.doc.data()['birthDate'] != undefined){
          let today: any = new Date();
          let birthDate = new Date(new Date((countrie.payload.doc.data()['birthDate'] === undefined) ? countrie.payload.doc.data()['birthDtate'] : countrie.payload.doc.data()['birthDate']).toLocaleString('en-US'));
          let birthday = +birthDate;
          birthday = ~~((today - birthday) / (31557600000));
          let bday = new Date(birthDate).toLocaleDateString();
          edadImpro.push(birthday)          
        }
        if(countrie.payload.doc.data()['idioma'] != undefined){
          arLanguage.push(countrie.payload.doc.data()['idioma'][0].toUpperCase());
        }
        if (countrie.payload.doc.data()['gender'] != undefined) {
          generoImpro.push(countrie.payload.doc.data()['gender'])
        }
        if (countrie.payload.doc.data()['status'] != undefined) {
          statusImpro.push(countrie.payload.doc.data()['status'])
        }
      })

      //console.log('genero', generoImpro);

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
      this.improverPerStatus = {
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        series: [{
            data: dataStatus,
            type: 'pie',
        }],
        color: ['#556ee6', '#34c38f', '#f1b44c', '#50a5f1', '#f46a6a','#593dba','#7c6eac','#575070','#50705e','#d6b81d'],
        legend: {
            x: 'center',
            y: 'bottom',
            data: nameStatus,
        }
      };
      console.log('por estustus: ',dataStatus);
      

      let countGenero = {};
      for(let i = 0; i < generoImpro.length; i++) {
        if (countGenero[generoImpro[i]]){
          countGenero[generoImpro[i]] += 1
          } else {
            countGenero[generoImpro[i]] = 1
          }  
      }

      for(let prop in countGenero) {
          if (countGenero[prop] >= 1){
            dataGenero.push({value: countGenero[prop], name:toTitleCase(prop)});
            nameGenero.push(toTitleCase(prop))
        }
      }
      this.improverPerGender = {
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        series: [{
            data: dataGenero,
            type: 'pie',
        }],
        color: ['#68b6ff','#7c6eac'],
        legend: {
            x: 'center',
            y: 'bottom',
            data: nameGenero,
        }
      };
      console.log('por genero ',dataGenero);
      


      let countEdad = {};
      for (let i = 0; i < edadImpro.length; i++) {
        if (countEdad[edadImpro[i]]){
          countEdad[edadImpro[i]] += 1
          } else {
            countEdad[edadImpro[i]] = 1
          }        
      }
      
      for(let prop in countEdad) {
          if (countEdad[prop] >= 1){
            dataEdad.push({value: countEdad[prop], name:prop+' a??os'});
            nameEdad.push(prop+' a??os')
        }
      }
      this.improverPerAge = {
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        series: [{
            data: dataEdad,
            type: 'pie',
        }],
        color: ['#556ee6', '#34c38f', '#f1b44c', '#50a5f1', '#f46a6a','#593dba','#7c6eac','#575070','#50705e','#d6b81d'],
        legend: {
            x: 'center',
            y: 'bottom',
            data: nameEdad,
        }
      };
      console.log('por edad:',nameEdad);
      
      
      let counts = {};
      for(let i =0; i < arCountry.length; i++){ 
        if (counts[arCountry[i]]){
        counts[arCountry[i]] += 1
        } else {
        counts[arCountry[i]] = 1
        }
      }
      
      for (let prop in counts){
        if (counts[prop] >= 1){
            dataCountry.push({value: counts[prop], name:prop});
            nameCountry.push(prop);
        }
      }
      this.improverPerCountry= {
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        series: [{
            data: dataCountry,
            type: 'pie',
        }],
        color: ['#556ee6', '#34c38f', '#f1b44c', '#50a5f1', '#f46a6a','#593dba','#7c6eac','#575070','#50705e','#d6b81d'],
        legend: {
            x: 'center',
            y: 'bottom',
            data: nameCountry,
        }
      };
      console.log('Por pais',dataCountry);
      

      let countsIdioma = {};
      for(let i =0; i < arLanguage.length; i++){ 
        if (countsIdioma[arLanguage[i]]){
        countsIdioma[arLanguage[i]] += 1
        } else {
        countsIdioma[arLanguage[i]] = 1
        }
      }
      for (let prop in countsIdioma){
        if (countsIdioma[prop] >= 1){
            dataLanguage.push({value: countsIdioma[prop], name:prop});
            nameLanguage.push(prop);
        }
      }
      this.improverPerLanguage = {
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)"
        },
        series: [{
            data: dataLanguage,
            type: 'pie',
        }],
        color: ['#556ee6', '#34c38f', '#f1b44c', '#50a5f1', '#f46a6a','#593dba','#7c6eac','#575070','#50705e','#d6b81d'],
        legend: {
            x: 'center',
            y: 'bottom',
            data: nameLanguage,
        }
      };
      console.log('Por idioma: ', dataLanguage);
      
     
      this.lengthImprover = data.length;
    });
  }

  filtrar() {
    console.log(this.filtroForm.value);
    let fechaFiltro = this.filtroForm.value;
    this.selectMonth = fechaFiltro.mes;
    this.selectYear = fechaFiltro.ano;

    var arCountry = [];
    var newImprovers = 0;
    var allimprovers = 0;
    var mes = new Date().getMonth();
    var anio = new Date().getFullYear();
    var arLanguage = [];
    var dataLanguage = [];
    var nameLanguage = [];
    var edadImpro = [];
    var generoImpro = [];
    var statusImpro = [];
    var idimaplan = [];
    var horarioPlan = [];

    if(this.selectMonth == "all" || this.selectYear == "all"){
      let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      let years = [2021, 2022];

      if(this.selectMonth == "all" && this.selectYear != "all"){
        months.forEach((m) => {
          this.getSpeakersAll(m, this.selectYear, arCountry, newImprovers, allimprovers, mes, anio, arLanguage, dataLanguage, nameLanguage, edadImpro, generoImpro, statusImpro, idimaplan, horarioPlan);
        });
      }
      else if(this.selectMonth != "all" && this.selectYear == "all"){
        years.forEach((y) => {
          this.getSpeakersAll(this.selectMonth, y, arCountry, newImprovers, allimprovers, mes, anio, arLanguage, dataLanguage, nameLanguage, edadImpro, generoImpro, statusImpro, idimaplan, horarioPlan);
        });
      }
      else if(this.selectMonth == "all" && this.selectYear == "all"){
        years.forEach((y) => {
          months.forEach((m) => {
            this.getSpeakersAll(m, y, arCountry, newImprovers, allimprovers, mes, anio, arLanguage, dataLanguage, nameLanguage, edadImpro, generoImpro, statusImpro, idimaplan, horarioPlan);
          });
        });
      }

    }
    else{
      const fechaFiltror = this.selectYear+'-'+this.selectMonth;
      console.log(new Date(fechaFiltror));
      console.log(new Date(fechaFiltror).getTime());
      this.getSpeakers();
    }
  }

}
