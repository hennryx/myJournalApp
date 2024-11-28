import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, imageOutline } from 'ionicons/icons';

@Component({
    selector: 'FormMoment',
    templateUrl: './form-moment.component.html',
    styleUrls: ['./form-moment.component.scss'],
    standalone: true,
    imports: [IonIcon, IonButton, FormsModule, CommonModule]
})
export class FormMomentComponent {

    @Output() handleClose = new EventEmitter<void>()
    @Output() handleSubmit = new EventEmitter<any>()

    imagePreview: string | null = null;
    title: string = '';
    description: string = "";

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

    async onSubmit(event: Event): Promise<void> {
        event.preventDefault();
        if (this.title && this.imagePreview) {
            const newItem = {
                id: Date.now(),
                title: this.title,
                image: this.imagePreview,
                description: this.description,
                date: new Date()
            };
            this.handleSubmit.emit(newItem)

            const toast = await this.toastController.create({
                icon: 'checkmark-circle-outline',
                message: 'Item added successfully!',
                cssClass: 'custom-toast',
                duration: 5000,
                position: "top",
            });

            toast.present();
            this.resetForm();
        } else {
            const toast = await this.toastController.create({
                message: 'Please fill in all fields.',
                duration: 1500,
                position: "top",
            });

            await toast.present();
        }
    }

    resetForm(): void {
        this.title = '';
        this.imagePreview = null;
    }

    closeForm() {
        this.resetForm()
        this.handleClose.emit();
    }
}
