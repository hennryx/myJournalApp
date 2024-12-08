import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonIcon, IonFabButton, IonFab } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { FormComponent } from "./form/form.component";
import { RestApiService } from 'src/app/services/rest-api.service';


@Component({
    selector: 'app-notes',
    templateUrl: './notes.page.html',
    styleUrls: ['./notes.page.scss'],
    standalone: true,
    imports: [IonFab, IonFabButton, IonContent, IonHeader, CommonModule, FormsModule, IonIcon, FormComponent]
})
export class NotesPage implements OnInit {
    notes: any = []
    isNotesOpen: boolean = false;

    constructor(private restApi: RestApiService) {}

    ngOnInit(): void {
        addIcons({ add })
        if (localStorage.getItem('dark')) {
            const dark = JSON.parse(localStorage.getItem('dark') || "")
            document.body.classList.toggle('dark', dark);
        }

        this.getNotes()
    }

    handleFormNotes(event: Event) {
        this.restApi.create(event, 'notes')
        this.getNotes();
        this.handleOpenAddNotes()
    }
    

    handleOpenAddNotes() {
        this.isNotesOpen = !this.isNotesOpen
    }

    editNote(id: number) {

    }

    trashNote(id: number) {

    }

    getNotes() {
        this.notes = this.restApi.getAll('notes');
        console.log(this.notes);
    }

    getTimeAgo(date: Date): string {
        const now = new Date();
        const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
        const intervals = [
          { label: 'year', seconds: 31536000 },
          { label: 'month', seconds: 2592000 },
          { label: 'week', seconds: 604800 },
          { label: 'day', seconds: 86400 },
          { label: 'hour', seconds: 3600 },
          { label: 'minute', seconds: 60 },
        ];
    
        for (const interval of intervals) {
          const count = Math.floor(seconds / interval.seconds);
          if (count > 0) {
            return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
          }
        }
    
        return 'just now';
      }
      getNoteStatusClass(note: any): string {
      switch (note.status) {
        case 'To Do':
          return 'note-status-todo';
        case 'In Progress':
          return 'note-status-inprogress';
        case 'Done':
          return 'note-status-done';
        case 'For Review':
          return 'note-status-forreview';
        case 'Reference':
          return 'note-status-reference';
        case 'On Hold':
          return 'note-status-onhold';
        default:
          return ''; // No special class
      }
    }

    openNoteDetails(note: any) {
        
    }
}
