import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton } from "@ionic/angular/standalone";
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';

@Component({
    selector: 'FormInspiration',
    templateUrl: './form-inspiration.component.html',
    styleUrls: ['./form-inspiration.component.scss'],
    standalone: true,
    imports: [IonButton, CommonModule, FormsModule, ReactiveFormsModule]
})
export class FormInspirationComponent implements OnChanges{
    @Output() handleClose = new EventEmitter<void>()
    @Output() handleSubmit = new EventEmitter<any>()
    @Input() itemToUpdate: any = {};
    @Input() isUpdateMode: boolean = false;
    title: string = '';
    description: string = "";
    form: FormGroup;

    constructor(private toastController: ToastController) {
        addIcons({ checkmarkCircleOutline });

        this.form = new FormGroup({
            title: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
          });
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['itemToUpdate'] && Object.keys(this.itemToUpdate).length > 0) {
            this.form.patchValue({
                id: this.itemToUpdate.id,
                title: this.itemToUpdate.title,
                description: this.itemToUpdate.description,
            })
        }
    }

    async onSubmit(event: Event): Promise<void> {
        event.preventDefault();
        if (this.form.valid) {
            const newItem = {
                ...this.form.value,
                id: Object.keys(this.itemToUpdate).length > 0 ? this.itemToUpdate.id : Date.now(),
                date: new Date()
            };
            console.log(newItem);
            
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
        this.form.reset()
    }

    closeForm() {
        this.resetForm()
        this.handleClose.emit();
    }

    isEmptyObject(obj: any): boolean {
        return obj && Object.keys(obj).length === 0;
    }
}
