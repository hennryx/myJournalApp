import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToggle, IonLabel, IonToolbar, IonTitle, IonCheckbox } from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonCheckbox, IonLabel, IonToggle, IonContent, IonHeader, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {
  darkMode = false;
  selectAll = false;

  constructor() {}
  ngOnInit(): void {

    if(localStorage.getItem('dark')) {
      const dark = JSON.parse(localStorage.getItem('dark') || "")
      document.body.classList.toggle('dark', dark);
      this.darkMode = dark
    }
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark', this.darkMode);
    localStorage.setItem('dark', JSON.stringify(this.darkMode))
  }


}
