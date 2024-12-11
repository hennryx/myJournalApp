import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, imageOutline } from 'ionicons/icons';

@Component({
    selector: 'NotesForm',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: true,
    imports: [IonIcon, IonButton, CommonModule, FormsModule, ReactiveFormsModule]
})
export class FormComponent implements OnChanges {
    @Input() isOpenEditModal: boolean = false;
    @Input() itemToEdit: any = {}
    @Output() handleClose = new EventEmitter<void>();
    @Output() handleSubmit = new EventEmitter<any>();

    imagePreview: string | null = null;
    notesForm: FormGroup;

    constructor(private toastController: ToastController) {
        addIcons({ checkmarkCircleOutline, imageOutline });

        this.notesForm = new FormGroup({
            id: new FormControl(0),
            title: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
        });
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['itemToEdit'] && this.itemToEdit && this.isOpenEditModal) {
            this.notesForm.patchValue({
                id: this.itemToEdit.id,
                title: this.itemToEdit.title,
                description: this.itemToEdit.description,
            })
            this.imagePreview = this.itemToEdit.image;
        }
    }

    triggerFileInput(): void {
        const inputElement = document.getElementById('image') as HTMLInputElement;
        inputElement.click();
    }

    onImageSelect(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (validImageTypes.includes(file.type)) {
                const reader = new FileReader();
                reader.onload = () => {
                    this.imagePreview = reader.result as string;
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select a valid image file (PNG, JPG, JPEG).');
            }
        }
    }


    async onSubmit(event: Event) {
        event.preventDefault();
        if (this.notesForm.valid) {
            const newItem = {
                ...this.notesForm.value,
                id: Date.now(),
                image: this.imagePreview,
                date: new Date(),
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
        this.notesForm.reset()
    }

    closeForm() {
        this.resetForm();
        this.handleClose.emit();
    }
}
