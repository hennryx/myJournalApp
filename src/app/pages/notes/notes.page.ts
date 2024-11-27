import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFabButton, IonFab, IonIcon } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons'

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFab, IonFabButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NotesPage {

  constructor() { 
    addIcons({ add });
  }

  currentDate = new Date();
  selectedDate: Date | null = null;
  isModalOpen = false;
  isModalAddOpen = false;
  isAddEventForm = false;
  newEvent = { title: '', date: '', description: '' };

  events = [
      {
          title: "Team Meeting",
          date: "2024-11-08T10:00:00",
          description: "Weekly sync meeting"
      },
  ];

  monthStart = this.startOfMonth(this.currentDate);
  monthEnd = this.endOfMonth(this.currentDate);

  calendarDays = this.eachDayOfInterval(this.monthStart, this.monthEnd);

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
          return this.events.filter(event => {
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
      this.newEvent = { title: '', date: '', description: '' };  // Reset the form fields
      this.isModalAddOpen = true;
      this.isAddEventForm = true;  // Show add event form
  }

  addEvent() {
      if (this.newEvent.title && this.newEvent.date) {
          // Add the new event to the events array
          this.events.push({
              title: this.newEvent.title,
              date: this.newEvent.date,
              description: this.newEvent.description,
          });

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
}
