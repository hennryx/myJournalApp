import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, imageOutline } from 'ionicons/icons';

@Component({
    selector: 'MdForm',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: true,
    imports: [IonIcon, IonButton, CommonModule, FormsModule]
})
export class FormComponent {
    @Output() handleClose = new EventEmitter<void>();
    @Output() handleSubmit = new EventEmitter<any>();

    imagePreview: string | null = null;
    title: string = '';
    selectedCardIndex: number | null = null;
    cards: string[] = ['morning meditation', 'evening meditation', 'new year resolution', 'Christmas wish']; 

    constructor(private toastController: ToastController) {
        addIcons({ checkmarkCircleOutline, imageOutline });
    }

    triggerFileInput(): void {
        const inputElement = document.getElementById('image') as HTMLInputElement;
        inputElement.click();
    }

    onImageSelect(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    selectCard(card: string, index: number): void {
        this.selectedCardIndex = index;
        this.title = card;  // Update the title to the selected card
    }

    async onSubmit(event: Event): Promise<void> {
        event.preventDefault();
        if (this.title && this.imagePreview ) {
            const newItem = {
                id: Date.now(),
                title: this.title,
                image: this.imagePreview,
                date: new Date()
            };
            this.handleSubmit.emit(newItem);

            const toast = await this.toastController.create({
                icon: 'checkmark-circle-outline',
                message: 'Item added successfully!',
                cssClass: 'custom-toast',
                duration: 3000,
                position: "top",
            });

            toast.present();
            this.resetForm();
        } else {
            const toast = await this.toastController.create({
                message: 'Please fill in all fields.',
                duration: 3000,
                position: "top",
            });

            await toast.present();
        }
    }

    resetForm(): void {
        this.title = '';
        this.imagePreview = null;
        this.selectedCardIndex = null;
    }

    closeForm() {
        this.resetForm();
        this.handleClose.emit();
    }
}
