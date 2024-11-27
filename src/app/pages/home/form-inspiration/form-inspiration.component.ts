import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton } from "@ionic/angular/standalone";

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

  constructor() { }

  onSubmit(event: Event): void {
      event.preventDefault();
      if (this.title && this.description) {
          const newItem = {
              id: Date.now(),
              title: this.title,
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
      this.description = '';
  }

  closeForm() {
      this.resetForm()
      this.handleClose.emit();
  }
}
