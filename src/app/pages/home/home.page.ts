import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { FormComponent } from "./form/form.component";
import { RestApiService } from 'src/app/services/rest-api.service';
import { FormMomentComponent } from "./form-moment/form-moment.component";
import { FormAchievementsComponent } from "./form-achievements/form-achievements.component";
import { FormInspirationComponent } from './form-inspiration/form-inspiration.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: true,
    imports: [IonIcon, IonFabButton, IonFab, IonContent, IonHeader, CommonModule, FormsModule, FormComponent, FormMomentComponent, FormAchievementsComponent, FormInspirationComponent]
})
export class HomePage implements OnInit {
    isMdFormOpen: boolean = false;
    isMomentFormOpen: boolean = false;
    isAchievementFormOpen: boolean = false;
    isInspirationFormOpen: boolean = false;
    allMd: any = []
    allMoment: any = []
    allAchievements: any = []
    allInspiration: any = []

    constructor(private ApiService: RestApiService) {
        addIcons({ add });
    }

    ngOnInit() {
        this.getMd();
        this.getMoment();
        this.getAchievements();
    }

    /* md */
    getMd() {
        this.allMd = this.ApiService.getAll('Myday');
        console.log(this.allMd);
    }

    handleFormMd() {
        console.log("hey");
        this.isMdFormOpen = !this.isMdFormOpen;
    }

    handleSubmitMd(event: Event) {
        console.log(event);
        this.ApiService.create(event, "Myday");
        this.isMdFormOpen = false;
        this.getMd();
    }

    /* momment */
    getMoment() {
        this.allMoment = this.ApiService.getAll('Moment');
        console.log(this.allMoment);
    }

    handleFormMoment() {
        console.log("hey");
        this.isMomentFormOpen = !this.isMomentFormOpen;
    }

    handleSubmitMoment(event: Event) {
        console.log(event);
        this.ApiService.create(event, "Moment");
        this.isMomentFormOpen = false;
        this.getMoment();
    }

    /* achivements */
    getAchievements() {
        this.allAchievements = this.ApiService.getAll('Achievements');
        console.log(this.allAchievements);
    }

    handleFormAchievements() {
        this.isAchievementFormOpen = !this.isAchievementFormOpen;
    }

    handleSubmitAchievement(event: Event) {
        console.log(event);
        this.ApiService.create(event, "Achievements");
        this.isAchievementFormOpen = false;
        this.getAchievements();
    }

    /* Inspirations */
    getInspiration() {
        this.allInspiration = this.ApiService.getAll('Inspiration');
        console.log(this.allInspiration);
    }

    handleFormInspiration() {
        this.isInspirationFormOpen = !this.isInspirationFormOpen;
    }

    handleSubmitInspiration(event: Event) {
        console.log(event);
        this.ApiService.create(event, "Inspiration");
        this.isInspirationFormOpen = false;
        this.getInspiration();
    }
}
