import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, imageOutline } from 'ionicons/icons';

@Component({
    selector: 'FormAchievements',
    templateUrl: './form-achievements.component.html',
    styleUrls: ['./form-achievements.component.scss'],
    standalone: true,
    imports: [IonIcon, IonButton, CommonModule, FormsModule, ReactiveFormsModule]
})
export class FormAchievementsComponent implements OnChanges {
    @Output() handleClose = new EventEmitter<void>()
    @Output() handleSubmit = new EventEmitter<any>()
    @Input() itemToUpdate: any = {};
    @Input() isUpdateMode: boolean = false;

    imagePreview: string | null = null;
    title: string = '';
    description: string = "";
    form: FormGroup;

    constructor(private toastController: ToastController) {
        addIcons({ checkmarkCircleOutline, imageOutline });
        this.form = new FormGroup({
            title: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            image: new FormControl(null, [Validators.required]),
        });
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['itemToUpdate'] && Object.keys(this.itemToUpdate).length > 0) {
            this.form.patchValue({
                id: this.itemToUpdate.id,
                title: this.itemToUpdate.title,
                description: this.itemToUpdate.description,
                image: this.itemToUpdate.image
            })
            this.imagePreview = this.itemToUpdate.image || null;
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
                    const base64Image = reader.result as string;
                    this.imagePreview = base64Image

                    this.form.patchValue({
                        image: base64Image
                    });
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select a valid image file (PNG, JPG, JPEG).');
            }
        }
    }

    async onSubmit(event: Event): Promise<void> {
        event.preventDefault();
        console.log(this.form.valid);
        console.log(this.form.value);



        if (this.form.valid) {
            const formData = {
                ...this.form.value,
                id: Object.keys(this.itemToUpdate).length > 0 ? this.itemToUpdate.id : Date.now(),
                date: new Date(),
            };
            this.handleSubmit.emit(formData)

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

    isEmptyObject(obj: any): boolean {
        return obj && Object.keys(obj).length === 0;
    }
}
