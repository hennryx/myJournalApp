import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToggle, IonLabel, IonToolbar, IonTitle, IonCheckbox } from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonCheckbox, IonTitle, IonToolbar, IonLabel, IonToggle, IonContent, IonHeader, CommonModule, FormsModule]
})
export class SettingsPage {
  darkMode = false;
  selectAll = false;

  constructor() {}

  toggleDarkMode() {
    document.body.classList.toggle('dark', this.darkMode);
  }


}
