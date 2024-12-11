import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonFab, IonFabButton, IonBadge, IonLabel } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { home, documentOutline, settings, search, bookSharp, listOutline, journalOutline, settingsOutline, calendarOutline, camera, compass, chatbubbles, notifications, person } from 'ionicons/icons'

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonLabel, IonIcon, IonTabButton, IonTabBar, IonTabs, CommonModule, FormsModule]
})
export class TabsPage implements OnInit {

  constructor() { 
    addIcons({camera,compass,chatbubbles,notifications,person,listOutline,journalOutline,calendarOutline,settingsOutline,home,documentOutline,settings,search,bookSharp});
  }

  ngOnInit() {
  }
}
