import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonIcon, IonFabButton, IonFab, IonAlert } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { ToastController } from '@ionic/angular';
import { FormComponent } from "./form/form.component";
import { RestApiService } from 'src/app/services/rest-api.service';


@Component({
    selector: 'app-notes',
    templateUrl: './notes.page.html',
    styleUrls: ['./notes.page.scss'],
    standalone: true,
    imports: [IonAlert, IonFab, IonFabButton, IonContent, IonHeader, CommonModule, FormsModule, IonIcon, FormComponent]
})
export class NotesPage implements OnInit {
    notes: any = []
    selectedNote: any = {}
    isNotesOpen: boolean = false;
    isAlertOpen: boolean = false;
    currentItemIdToDelete: any = 0
    isOpenEditModal: boolean = false;

    constructor(private restApi: RestApiService, private toastController: ToastController) {
        addIcons({ add });
    }

    ngOnInit(): void {
        addIcons({ add })
        if (localStorage.getItem('dark')) {
            const dark = JSON.parse(localStorage.getItem('dark') || "")
            document.body.classList.toggle('dark', dark);
        }

        this.getNotes()
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

    handleFormNotes(event: Event) {
        if(this.isOpenEditModal) {
            this.restApi.update(this.selectedNote.id, event, 'notes')
        }else {
            this.restApi.create(event, 'notes')
        }
        this.getNotes();
        this.handleClose()
    }


    handleOpenAddNotes() {
        this.isNotesOpen = !this.isNotesOpen;
        this.isOpenEditModal = false;
    }

    handleClose() {
        this.isNotesOpen = false;
        this.isOpenEditModal = false;
    }

    editNote(item: any) {
        this.selectedNote = item;
        this.isOpenEditModal = true;
    }
    handleDeleteItem(ev: any) {
        if (this.currentItemIdToDelete === 0) return

        if (ev.detail.role === "confirm") {
            this.restApi.delete(this.currentItemIdToDelete, 'notes')
            this.getNotes();
            this.toastHandler("Note Successfully deleted")
        }

    }
    trashNote(id: number) {
        this.currentItemIdToDelete = id;
        this.isAlertOpen = true;
    }

    getNotes() {
        this.notes = this.restApi.getAll('notes');
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
