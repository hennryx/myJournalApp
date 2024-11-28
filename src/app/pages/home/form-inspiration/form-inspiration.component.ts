import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton } from "@ionic/angular/standalone";
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';

@Component({
    selector: 'FormInspiration',
    templateUrl: './form-inspiration.component.html',
    styleUrls: ['./form-inspiration.component.scss'],
    standalone: true,
    imports: [IonButton, CommonModule, FormsModule]
})
export class FormInspirationComponent {
    @Output() handleClose = new EventEmitter<void>()
    @Output() handleSubmit = new EventEmitter<any>()

    title: string = '';
    description: string = "";

    constructor(private toastController: ToastController) {
        addIcons({ checkmarkCircleOutline });
    }

    async onSubmit(event: Event): Promise<void> {
        event.preventDefault();
        if (this.title && this.description) {
            const newItem = {
                id: Date.now(),
                title: this.title,
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
        this.description = '';
    }

    closeForm() {
        this.resetForm()
        this.handleClose.emit();
    }
}
