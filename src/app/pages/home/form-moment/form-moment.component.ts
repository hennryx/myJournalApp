import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton } from "@ionic/angular/standalone";

@Component({
    selector: 'FormMoment',
    templateUrl: './form-moment.component.html',
    styleUrls: ['./form-moment.component.scss'],
    standalone: true,
    imports: [IonButton, FormsModule, CommonModule]
})
export class FormMomentComponent {

    @Output() handleClose = new EventEmitter<void>()
    @Output() handleSubmit = new EventEmitter<any>()

    imagePreview: string | null = null;
    title: string = '';
    description: string = "";

    constructor() { }

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

    onSubmit(event: Event): void {
        event.preventDefault();
        if (this.title && this.imagePreview) {
            const newItem = {
                id: Date.now(),
                title: this.title,
                image: this.imagePreview,
            };
            this.handleSubmit.emit(newItem)
            alert('Item added successfully!');
            this.resetForm();
        } else {
            alert('Please fill in all fields.');
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
