import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToggle, IonLabel, IonCheckbox } from '@ionic/angular/standalone';
import { RestApiService } from 'src/app/services/rest-api.service';

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
    trash: any = [];
    selectedItems: Set<number> = new Set();

    constructor(private restApi: RestApiService) { }
    ngOnInit(): void {
        this.getTrash();

        if (localStorage.getItem('dark')) {
            const dark = JSON.parse(localStorage.getItem('dark') || "")
            document.body.classList.toggle('dark', dark);
            this.darkMode = dark
        }
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark', this.darkMode);
        localStorage.setItem('dark', JSON.stringify(this.darkMode))
    }

    getTrash() {
        this.trash = this.restApi.getAll('delete');
        console.log(this.trash);
        
    }

    toggleSelectAll() {
        this.selectAll = !this.selectAll;
    
        if (this.selectAll) {
          this.trash.forEach((item: any) => this.selectedItems.add(item.id));
        } else {
          this.selectedItems.clear();
        }
    }

    toggleItemSelection(itemId: number) {
        if (this.selectedItems.has(itemId)) {
          this.selectedItems.delete(itemId);
        } else {
          this.selectedItems.add(itemId);
        }
    
        this.selectAll = this.selectedItems.size === this.trash.length;
      }
    
      removeSelected() {
        this.selectedItems.forEach(id => this.restApi.deletePermanent(id, 'delete'));
        this.getTrash(); 
        this.selectedItems.clear();
        this.selectAll = false;
      }
    
      clearTrash() {
        this.trash.forEach((item: any) => this.restApi.deletePermanent(item.id, 'delete'));
        this.getTrash(); 
        this.selectedItems.clear();
        this.selectAll = false;
      }
}
