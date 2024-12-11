import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonFab, IonFabButton, IonIcon, IonAlert, IonPopover, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, pencilOutline, searchOutline, trashOutline, ellipsisVerticalOutline, close, chevronForward, search, closeCircleOutline, chevronBackOutline } from 'ionicons/icons';
import { FormComponent } from "./form/form.component";
import { RestApiService } from 'src/app/services/rest-api.service';
import { FormMomentComponent } from "./form-moment/form-moment.component";
import { FormAchievementsComponent } from "./form-achievements/form-achievements.component";
import { FormInspirationComponent } from './form-inspiration/form-inspiration.component';
import { ViewMdComponent } from "./view-md/view-md.component";
import { ToastController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: true,
    imports: [IonPopover, IonAlert, IonIcon, IonFabButton, IonFab, IonContent, IonHeader, CommonModule, FormsModule, FormComponent, FormMomentComponent, FormAchievementsComponent, FormInspirationComponent, ViewMdComponent]
})
export class HomePage implements OnInit {
    formattedDate: string = '';
    daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    isMdFormOpen: boolean = false;
    isMomentFormOpen: boolean = false;
    isAchievementFormOpen: boolean = false;
    isInspirationFormOpen: boolean = false;
    isOpenView: boolean = false;
    isAlertOpen: boolean = false;
    isEditMode: boolean = false;

    allMoods: any = [];
    allMd: any = [];
    allMoment: any = [];
    allAchievements: any = [];
    allInspiration: any = [];
    momentsToday: any = [];
    groupedMomentsArray: any = [];
    monthToday: Date = new Date();
    selectedMd: any = {};

    currentItemIdToDelete: number = 0;
    currentItemCategoryToDelete: string = "";
    currentItemToUpdate: any = {};

    month = this.monthToday.toLocaleString('default', { month: 'long' });
    year = this.monthToday.getFullYear();

    isPopupOpen = false;
    selectedDay: string | null = null;

    isPopupSearchOpen = false;
    searchQuery: string = '';
    searchResults: any[] = [];

    constructor(
        private ApiService: RestApiService,
        private router: Router,
        private toastController: ToastController,
        private actionSheetController: ActionSheetController,
        private cdr: ChangeDetectorRef
    ) {
        addIcons({ searchOutline, chevronBackOutline, search, close, chevronForward, add, ellipsisVerticalOutline, closeCircleOutline, pencilOutline, trashOutline });

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd && event.url === '/tabs/home') {
                this.refreshData();
                this.checkIfUpdate();

            }
        });
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
        console.log("hey");
        this.checkIfUpdate();

        this.isPopupSearchOpen = false;
        this.getMd();
        this.getMoment();
        this.getAchievements();
        this.getInspiration();
        this.getMoods()

        this.formattedDate = this.getFormattedDate(new Date());

        if (localStorage.getItem('dark')) {
            const dark = JSON.parse(localStorage.getItem('dark') || "")
            document.body.classList.toggle('dark', dark);
        }
    }

    checkIfUpdate() {
        const navigation = this.router.getCurrentNavigation();
        const state: any = navigation?.extras?.state;

        if (state && state?.item && state?.category) {
            this.updateItem(state?.item, state?.category);

            this.router.navigate([], {
                replaceUrl: true,
                state: undefined
            });
        }
    }

    refreshData() {
        this.isPopupSearchOpen = false;
        this.searchQuery = "";
        this.searchResults = []
        this.getMd();
        this.getMoment();
        this.getAchievements();
        this.getInspiration();
        this.getMoods();
    }

    performSearch() {
        if (!this.searchQuery.trim()) {
            this.searchResults = [];
            return;
        }

        const categories = ['Moment', 'Achievements', 'Inspiration'];
        let allResults: any[] = [];

        categories.forEach(category => {
            const categoryItems = this.ApiService.getAll(category);
            const filteredItems = categoryItems.filter((item: any) =>
                this.matchSearchQuery(item, this.searchQuery)
            ).map((item: any) => ({
                ...item,
                category: category
            }));

            allResults = [...allResults, ...filteredItems];
        });

        this.searchResults = allResults.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }

    matchSearchQuery(item: any, query: string): boolean {
        const lowercaseQuery = query.toLowerCase().trim();
        return (
            item.title?.toLowerCase().includes(lowercaseQuery) ||
            item.description?.toLowerCase().includes(lowercaseQuery)
        );
    }

    navigateToView(item: any) {
        this.router.navigate(['/view'], {
            queryParams: {
                id: item.id,
                category: item.category
            }
        });
        this.closePopup();
    }

    navigateItemToView(item: any, category: string) {
        console.log(item);
        
        this.router.navigate(['/view'], {
            queryParams: {
                id: item.id,
                category: category
            }
        });
        this.closePopup();
    }

    closeSearch() {
        document.dispatchEvent(new CustomEvent('closeSearch'));
    }


    /* moods */
    openPopup(day: string): void {
        this.selectedDay = day;
        this.isPopupOpen = true;
    }

    handleSearch() {
        this.isPopupSearchOpen = true;
    }

    closePopup(): void {
        this.isPopupSearchOpen = false;
    }

    saveMood(emoji: string, day: string): void {
        const moodEvent = {
            id: Date.now(),
            day: day,
            mood: emoji,
            date: new Date().toISOString()
        };

        const existingMood = this.allMoods.find((item: any) => item.day === day);
        if (existingMood) {
            const updatedMood = {
                ...existingMood,
                mood: emoji,
                date: new Date().toISOString()
            };

            this.ApiService.update(existingMood?.id, updatedMood, 'myMoods');
            this.toastHandler("Moods Updated Successfully")
        } else {
            this.ApiService.create(moodEvent, 'myMoods');
            this.toastHandler("Moods Successfully added")
        }

        this.selectedDay = "";
        this.closePopup();
        this.getMoods();
    }

    getMoods() {
        let _allMoods = this.ApiService.getAll('myMoods');
        const currentDate = new Date();

        _allMoods.forEach((mood: any) => {
            const moodDate = new Date(mood.date);
            const diffTime = Math.abs(currentDate.getTime() - moodDate.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

            if (diffDays > 7) {
                this.ApiService.delete(mood.id, 'myMoods');
            }
        });

        this.allMoods = _allMoods.filter(mood => {
            const moodDate = new Date(mood.date);
            const diffTime = Math.abs(currentDate.getTime() - moodDate.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
            return diffDays <= 7;
        });
        this.cdr.detectChanges();

    }

    hasMood(day: string): boolean {
        return this.allMoods.some((item: any) => item.day === day);
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
        this.cdr.detectChanges();
    }

    handleFormMd() {
        console.log("hey");
        this.isMdFormOpen = !this.isMdFormOpen;
        this.isEditMode = false;
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

        this.cdr.detectChanges();
        console.log(this.allMoment);

    }

    groupMomentsByDate() {
        const sortedMoments = this.allMoment.sort((a: any, b: any) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime();
        });

        console.log(sortedMoments);


        const groupedMoments = sortedMoments.reduce((groups: any, item: any) => {
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
        console.log(groupedMoments);


        this.groupedMomentsArray = Object.values(groupedMoments).sort((a: any, b: any) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime();
        });
        this.cdr.detectChanges();
    }

    handleFormMoment() {
        this.isMomentFormOpen = !this.isMomentFormOpen;
        this.isEditMode = false;
        this.currentItemToUpdate = {}
        this.router.navigate([], {
            replaceUrl: true,
            state: undefined
        });
    }

    handleSubmitMoment(event: Event) {

        if (this.isEditMode) {
            this.ApiService.update(this.currentItemToUpdate.id, event, "Moment");
        } else {
            this.ApiService.create(event, "Moment");
        }
        this.handleReset();
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

        this.cdr.detectChanges();
    }

    handleFormAchievements() {
        this.isAchievementFormOpen = !this.isAchievementFormOpen;
        this.isEditMode = false;
        this.currentItemToUpdate = {}

        this.router.navigate([], {
            replaceUrl: true,
            state: undefined
        });
    }

    handleSubmitAchievement(event: Event) {
        console.log(event);

        if (this.isEditMode) {
            this.ApiService.update(this.currentItemToUpdate.id, event, "Achievements");
        } else {
            this.ApiService.create(event, "Achievements");
        }
        this.handleReset();
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
        this.cdr.detectChanges();
    }

    handleFormInspiration() {
        this.isInspirationFormOpen = !this.isInspirationFormOpen;
        this.isEditMode = false;
        this.currentItemToUpdate = {}

        this.router.navigate([], {
            replaceUrl: true,
            state: undefined
        });
    }

    handleSubmitInspiration(event: Event) {
        console.log(event);

        if (this.isEditMode) {
            this.ApiService.update(this.currentItemToUpdate.id, event, "Inspiration");
        } else {
            this.ApiService.create(event, "Inspiration");
        }
        this.handleReset();
        this.isInspirationFormOpen = false;
        this.getInspiration();
    }

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
        this.isEditMode = false;
        this.currentItemToUpdate = {}
    }


    async toastHandler(message: string) {

        const toast = await this.toastController.create({
            icon: 'checkmark-circle-outline',
            message: message,
            cssClass: 'custom-toast',
            duration: 3000,
            position: "top",
        });

        toast.present();
    }

    getMoodsForDay(day: string) {
        return this.allMoods.filter((mood: any) => mood.day === day);
    }


    async showActionSheet(item: any, category: string) {
        const actionSheet = await this.actionSheetController.create({
            header: 'Actions',
            buttons: [
                {
                    text: 'Update',
                    icon: 'pencil-outline',
                    handler: () => {
                        this.updateItem(item, category);
                    },
                },
                {
                    text: 'Delete',
                    role: 'destructive',
                    icon: 'trash-outline',
                    handler: () => {
                        this.deleteItem(item, category);
                    },
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: 'close-outline',
                },
            ],
        });
        await actionSheet.present();
    }

    updateItem(item: any, category: string) {
        console.log(`Update ${category}`, item);
        this.isEditMode = true;
        if (category === "Moment") { this.isMomentFormOpen = true; }
        if (category === "Achievements") { this.isAchievementFormOpen = true; }
        if (category === "Inspiration") { this.isInspirationFormOpen = true; }

        this.currentItemToUpdate = item;

    }

    /* done */
    deleteItem(item: any, category: string) {
        console.log(`Delete ${category}`, item);
        this.showDeleteConfirmation(item.id, category)
    }

    showDeleteConfirmation(itemId: number, itemCategory: string): void {
        this.currentItemIdToDelete = itemId;
        this.currentItemCategoryToDelete = itemCategory
        this.isAlertOpen = true;
    }

    handleDeleteItem(ev: any) {
        if (this.currentItemIdToDelete === 0) return

        if (ev.detail.role === "confirm") {
            this.ApiService.delete(this.currentItemIdToDelete, this.currentItemCategoryToDelete);
            this.toastHandler("Inspiration Successfully deleted")
            if (this.currentItemCategoryToDelete === "Inspiration") {
                this.getInspiration();
            }

            if (this.currentItemCategoryToDelete === "Moment") {
                this.getMoment();
            }
            if (this.currentItemCategoryToDelete === "Achievements") {
                this.getAchievements();
            }
        }
        this.isAlertOpen = false;
    }


    handleReset() {
        this.isEditMode = false;
        this.currentItemToUpdate = {}
    }

    getFormattedDate(date: Date): string {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const dayOfWeek = firstDayOfMonth.getDay();
        const dayOfMonth = date.getDate();
        const weekNumber = Math.ceil((dayOfMonth + dayOfWeek) / 7);

        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();
        const weekText = this.getOrdinalWeek(weekNumber);

        return `${weekText} Week of ${month} ${day}, ${year}`;
    }

    getOrdinalWeek(weekNumber: number): string {
        const ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
        return ordinals[weekNumber - 1] || `${weekNumber}th`;
    }

}
