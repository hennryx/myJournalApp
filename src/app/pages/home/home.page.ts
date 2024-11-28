import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonFab, IonFabButton, IonIcon, IonTabButton, IonAlert } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { add, pencilOutline, trashOutline } from 'ionicons/icons';
import { FormComponent } from "./form/form.component";
import { RestApiService } from 'src/app/services/rest-api.service';
import { FormMomentComponent } from "./form-moment/form-moment.component";
import { FormAchievementsComponent } from "./form-achievements/form-achievements.component";
import { FormInspirationComponent } from './form-inspiration/form-inspiration.component';
import { ViewMdComponent } from "./view-md/view-md.component";
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: true,
    imports: [IonAlert, IonIcon, IonFabButton, IonFab, IonContent, IonHeader, CommonModule, FormsModule, FormComponent, FormMomentComponent, FormAchievementsComponent, FormInspirationComponent, ViewMdComponent]
})
export class HomePage implements OnInit {
    isMdFormOpen: boolean = false;
    isMomentFormOpen: boolean = false;
    isAchievementFormOpen: boolean = false;
    isInspirationFormOpen: boolean = false;
    isOpenView: boolean = false;
    isAlertOpen: boolean = false;

    allMd: any = []
    allMoment: any = []
    allAchievements: any = []
    allInspiration: any = []
    momentsToday: any = [];
    groupedMomentsArray: any = [];
    monthToday: Date = new Date();
    selectedMd: any = {}

    currentItemIdToDelete: number = 0

    month = this.monthToday.toLocaleString('default', { month: 'long' });
    year = this.monthToday.getFullYear();

    constructor(private ApiService: RestApiService, private toastController: ToastController) {
        addIcons({ add, trashOutline, pencilOutline });
    }

    public alertButtons = [
        {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                console.log('Alert canceled');
            },
        },
        {
            text: 'OK',
            role: 'confirm',
            handler: () => {
                console.log('Alert confirmed');
            },
        },
    ];



    ngOnInit() {
        this.getMd();
        this.getMoment();
        this.getAchievements();
        this.getInspiration();
    }

    /* md */
    getMd() {
        let _allMd = this.ApiService.getAll('Myday');
        console.log(this.allMd);
        this.allMd = _allMd.map(item => {
            const { dayOfWeek, dayOfMonth, hours, month, year, minutes, amPm } = this.formatDate(new Date(item.date));

            return {
                ...item,
                dayOfWeek,
                dayOfMonth,
                hours,
                minutes,
                month: this.getMonthName(month),
                year,
                amPm
            }
        })
    }

    handleFormMd() {
        console.log("hey");
        this.isMdFormOpen = !this.isMdFormOpen;
    }

    handleSubmitMd(event: Event) {
        this.ApiService.create(event, "Myday");
        this.isMdFormOpen = false;
        this.getMd();
    }

    handleDelete(ev: any) {
        this.ApiService.delete(ev, "Myday")
        this.getMd();
        this.handleCloseMd()
        this.toastHandler("Myday deleted successfully!")
    }

    /* momment */
    getMoment() {
        const allMoments = this.ApiService.getAll('Moment');
        if (!allMoments) return;

        let _momentsToday = allMoments.filter(d => this.isToday(new Date(d.date)));

        this.momentsToday = _momentsToday.map(item => {
            const { dayOfWeek, dayOfMonth, hours, minutes, amPm } = this.formatDate(new Date(item.date));

            return {
                ...item,
                dayOfWeek,
                dayOfMonth,
                hours,
                minutes,
                amPm
            }
        })

        this.allMoment = allMoments.map(item => {
            const { dayOfWeek, dayOfMonth, month, year, hours, minutes, amPm } = this.formatDate(new Date(item.date));

            return {
                ...item,
                dayOfWeek,
                dayOfMonth,
                month: this.getMonthName(month),
                year,
                hours,
                minutes,
                amPm
            };
        });

        this.groupMomentsByDate();

        console.log(this.allMoment);

    }

    groupMomentsByDate() {
        const groupedMoments = this.allMoment.reduce((groups: any, item: any) => {
            const dateKey = `${item.dayOfMonth}-${item.month}-${item.year}`;

            if (!groups[dateKey]) {
                groups[dateKey] = {
                    key: dateKey,
                    month: item.month,
                    year: item.year,
                    moments: [],
                };
            }

            groups[dateKey].moments.push(item);

            return groups;
        }, {});

        this.groupedMomentsArray = Object.values(groupedMoments);
    }

    handleFormMoment() {
        this.isMomentFormOpen = !this.isMomentFormOpen;
    }

    handleSubmitMoment(event: Event) {
        this.ApiService.create(event, "Moment");
        this.isMomentFormOpen = false;
        this.getMoment();
    }

    /* achivements */
    getAchievements() {
        const _allAchievements = this.ApiService.getAll('Achievements');
        this.allAchievements = _allAchievements.map((item: any) => {
            const { dayOfWeek, dayOfMonth, month, year, hours, minutes, amPm } = this.formatDate(new Date(item.date));

            return {
                ...item,
                dayOfWeek,
                dayOfMonth,
                hours,
                minutes,
                amPm,
                month: this.getMonthName(month),
                year
            }
        })
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
        const __allInspiration = this.ApiService.getAll('Inspiration');

        this.allInspiration = __allInspiration.map((item: any) => {
            const { dayOfWeek, dayOfMonth, month, year, hours, minutes, amPm } = this.formatDate(new Date(item.date));

            return {
                ...item,
                dayOfWeek,
                dayOfMonth,
                hours,
                minutes,
                amPm,
                month: this.getMonthName(month),
                year
            }
        })
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

    showDeleteConfirmation(itemId: number): void {
        this.currentItemIdToDelete = itemId;
        this.isAlertOpen = true;
    }

    handleDeleteInspiration(ev: any) {
        if (this.currentItemIdToDelete === 0) return

        if (ev.detail.role === "confirm") {
            this.ApiService.delete(this.currentItemIdToDelete, "Inspiration");
            this.getInspiration();
            this.toastHandler("Inspiration Successfully deleted")
            this.isAlertOpen = false;

        }
    }
    /* 
        handleUpdateInspiration(id: any) {
    
        } */

    /* other functions */
    isToday(date: Date) {
        const currentDate = new Date()

        return date.getFullYear() === currentDate.getFullYear() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getDate() === currentDate.getDate()
    }

    formatDate(date: Date) {
        const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
        const dayOfWeek = days[date.getDay()];
        const dayOfMonth = date.getDate();

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const amPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return { dayOfWeek, dayOfMonth, month, year, hours, minutes, amPm };
    }

    getMonthName(month: number): string {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[month - 1];
    }

    openView(item: any) {
        this.selectedMd = item
        this.isOpenView = !this.isOpenView;
    }

    handleCloseMd() {
        this.isOpenView = !this.isOpenView;
    }


    async toastHandler(message: string, isCustom = true) {

        const toast = await this.toastController.create({
            icon: 'checkmark-circle-outline',
            message: message,
            cssClass: 'custom-toast',
            duration: 3000,
            position: "top",
        });

        toast.present();
    }
}
