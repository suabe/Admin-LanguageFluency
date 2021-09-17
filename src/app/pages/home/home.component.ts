import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProfileService } from '../../core/services/user.service';

import { speakerContry, pieChart, newSpeaker, customPieChart, donughnutChart, barChart } from './data';
import { ChartType } from './home.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  lengthSpeaker: number = 0;
  lengthImprover: number = 0;
  lengthScheduledCalls: number = 0;
  lengthSpeakerAwaitingApp: number = 0;
  pieChart: ChartType;
  newSpeaker: ChartType;
  userLanguage: ChartType;
  canceledLanguage: ChartType;
  incidenciasMes: ChartType;
  constructor(
    private fbstore: AngularFirestore,
    public userService: UserProfileService
  ) { 
    
   }

  ngOnInit(): void {
    this._fetchData();
    this.userService.applyPermissions();
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Dashboard', active: true }];
    this.fbstore.collection('perfiles', ref => ref.where('role', '==', 'conversador')).snapshotChanges()
    .subscribe(data => {
      this.lengthSpeaker = data.length;
    });

    this.fbstore.collection('perfiles', ref => ref.where('role', '==', 'cliente')).snapshotChanges()
    .subscribe(data => {
      this.lengthImprover = data.length;
    });

    this.fbstore.collection('calls').snapshotChanges()
    .subscribe(data => {
      this.lengthScheduledCalls = data.length;
    });

    this.fbstore.collection('potenciales').snapshotChanges()
    .subscribe(data => {
      this.lengthSpeakerAwaitingApp = data.length;
    });
  }

  private _fetchData() {
    this.pieChart = speakerContry
    this.newSpeaker = newSpeaker
    this.userLanguage = customPieChart
    this.canceledLanguage = donughnutChart
    this.incidenciasMes = barChart
  }

}
