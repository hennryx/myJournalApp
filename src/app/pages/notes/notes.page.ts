import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFabButton, IonFab, IonIcon } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { add, arrowBackOutline, chevronBackOutline, chevronForwardOutline, closeOutline, pencilOutline, trashBinOutline, trashOutline } from 'ionicons/icons'
import { RestApiService } from 'src/app/services/rest-api.service';
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'app-notes',
    templateUrl: './notes.page.html',
    styleUrls: ['./notes.page.scss'],
    standalone: true,
    imports: [IonIcon, IonFab, IonFabButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NotesPage implements OnInit {

    constructor(private apiService: RestApiService, private toastController: ToastController) {
        addIcons({ add, chevronForwardOutline, chevronBackOutline, arrowBackOutline, closeOutline, pencilOutline, trashOutline });
    }

    ngOnInit(): void {
        this.getEvents()
    }

    openViewEvent: boolean = false;
    viewEventData: any = {}
    currentDate = new Date();
    selectedDate: Date | null = null;
    isModalOpen = false;
    isModalAddOpen = false;
    isAddEventForm = false;
    formEvent = { title: '', date: '', description: '' };
    isEditMode = false;

    events: any = [];

    monthStart = this.startOfMonth(this.currentDate);
    monthEnd = this.endOfMonth(this.currentDate);

    calendarDays = this.eachDayOfInterval(this.monthStart, this.monthEnd);

    getEvents() {
        this.events = this.apiService.getAll('events');
    }

    // Date handling functions
    startOfMonth(date: Date): Date {
        const newDate = new Date(date);
        newDate.setDate(1);  // Set to the 1st of the current month
        newDate.setHours(0, 0, 0, 0);  // Set time to midnight
        return newDate;
    }

    endOfMonth(date: Date): Date {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + 1);  // Move to the next month
        newDate.setDate(0);  // Set the date to the last day of the current month
        newDate.setHours(23, 59, 59, 999);  // Set time to the last moment of the day
        return newDate;
    }

    eachDayOfInterval(start: Date, end: Date): Date[] {
        const days = [];
        let currentDate = new Date(start);
        while (currentDate <= end) {
            days.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);  // Move to the next day
        }
        return days;
    }

    isSameMonth(date1: Date, date2: Date): boolean {
        return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
    }

    isToday(date: Date): boolean {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }

    isPast(date: Date): boolean {
        return date < new Date();
    }

    isFuture(date: Date): boolean {
        return date > new Date();
    }

    // Event handling
    getEventsForDate(date: Date | null) {
        if (date) {
            return this.events.filter((event: any) => {
                return new Date(event.date).toDateString() === date.toDateString();
            });
        }
        return [];
    }

    handleDateClick(date: Date) {
        const dateEvents = this.getEventsForDate(date);
        if (dateEvents.length > 0) {
            this.selectedDate = date;
            this.isModalOpen = true;
        }
    }

    closeModal() {
        this.isModalOpen = false;
    }

    // Modal for adding new event
    openAddEventModal() {
        this.selectedDate = new Date(); // Default to today's date
        this.formEvent = { title: '', date: '', description: '' };  // Reset the form fields
        this.isModalAddOpen = true;
        this.isAddEventForm = true;  // Show add event form
    }
    
    handleFormSubmit() {
        if (this.isEditMode) {
            this.updateEvent(this.formEvent);
        } else {
            this.addEvent(this.formEvent);
        }
    }

    addEvent(event: any) {
        if (this.formEvent.title && this.formEvent.date) {
            // Add the new event to the events array
            const data = {
                id: Date.now(),
                title: this.formEvent.title,
                date: this.formEvent.date,
                description: this.formEvent.description,
            }

            this.events.push(data);

            this.apiService.create(data, 'events');
            this.getEvents()

            // Close the modal and reset the form
            this.closeAddModal();
        }
    }

    closeAddModal() {
        this.isModalAddOpen = false;
        this.isAddEventForm = false;  // Reset the form flag
    }

    // Navigate between months
    previousMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
        this.updateCalendar();
    }

    nextMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
        this.updateCalendar();
    }

    updateCalendar() {
        this.monthStart = this.startOfMonth(this.currentDate);
        this.monthEnd = this.endOfMonth(this.currentDate);
        this.calendarDays = this.eachDayOfInterval(this.monthStart, this.monthEnd);
    }

    getEventTextColor(eventDate: string) {
        const date = new Date(eventDate);
        if (this.isPast(date) && !this.isToday(date)) return 'text-red-500';
        if (this.isToday(date)) return 'text-green-500';
        if (this.isFuture(date)) return 'text-orange-500';
        return 'text-gray-700';
    }

    handleViewEvent(event: any) {
        this.openModalEvent()
        this.viewEventData = event;
    }

    openModalEvent() {
        this.openViewEvent = !this.openViewEvent;
    }

    openEditForm(event: any) {
        this.formEvent = event;
        this.isModalAddOpen = true;
        this.isAddEventForm = true;
        this.isEditMode = true;
    }

    async updateEvent(event: any) {
        this.apiService.update(event.id, event, 'events')
            this.getEvents(); 
            this.closeModal();
            this.openModalEvent();
            this.isModalAddOpen = false;
            this.isAddEventForm = false;
            this.isEditMode = false;

        const toast = await this.toastController.create({
            icon: 'checkmark-circle-outline',
            message: 'event updated successfully!',
            cssClass: 'custom-toast',
            duration: 5000,
            position: "top",
        });

        toast.present();
    }

    async deleteEvent(event: any) {
        this.apiService.delete(event.id, "events")
        this.openModalEvent();
        this.getEvents();
        this.closeModal();

        const toast = await this.toastController.create({
            icon: 'checkmark-circle-outline',
            message: 'event deleted successfully!',
            cssClass: 'custom-toast',
            duration: 5000,
            position: "top",
        });

        toast.present();

    }
}
