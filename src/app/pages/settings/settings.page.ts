import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToggle, IonLabel, IonCheckbox, IonIcon, IonAlert } from '@ionic/angular/standalone';
import { RestApiService } from 'src/app/services/rest-api.service';
import { ActionSheetController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ellipsisVerticalOutline } from 'ionicons/icons';
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
    standalone: true,
    imports: [IonAlert, IonIcon, IonCheckbox, IonLabel, IonToggle, IonContent, IonHeader, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {
    darkMode = false;
    selectAll = false;
    trash: any = [];
    itemTodelete: number = 0;
    selectedItems: Set<number> = new Set();
    isAlertOpen: boolean = false;
    name: string = ""

    constructor(private restApi: RestApiService, private actionSheetController: ActionSheetController, private toastController: ToastController, private cdr: ChangeDetectorRef) {
        addIcons({ ellipsisVerticalOutline });
    }
    ngOnInit(): void {
        this.getTrash();
        this.getName();

        if (localStorage.getItem('dark')) {
            const dark = JSON.parse(localStorage.getItem('dark') || "")
            document.body.classList.toggle('dark', dark);
            this.darkMode = dark
        }
    }

    public alertButtons = [
        {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                console.log('Alert canceled');
            },
        },
        {
            text: 'OK',
            role: 'confirm',
            handler: () => {
                console.log('Alert confirmed');
            },
        },
    ];

    getName() {
        const storedName = localStorage.getItem('userName');
        this.name = storedName || "";
        console.log('Retrieved name:', this.name);
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark', this.darkMode);
        localStorage.setItem('dark', JSON.stringify(this.darkMode))
    }

    getTrash() {
        this.trash = this.restApi.getAll('delete');
        this.cdr.detectChanges();
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


    async showActionSheet(item: any, category: string) {
        const actionSheet = await this.actionSheetController.create({
            header: 'Actions',
            buttons: [
                {
                    text: 'Restore',
                    icon: 'pencil-outline',
                    handler: () => {
                        this.restoreItem(item, category);
                    },
                },
                {
                    text: 'Delete',
                    role: 'destructive',
                    icon: 'trash-outline',
                    handler: () => {
                        this.deleteItem(item, category);
                    },
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: 'close-outline',
                },
            ],
        });
        await actionSheet.present();
    }

    restoreItem(item: any, category: string) {
        this.restApi.restoreItem(item.id)
        this.toastHandler("Restored Successfully")
        this.getTrash();
        this.selectedItems.clear();
        this.selectAll = false;
        this.itemTodelete = 0;
        this.isAlertOpen = false;
    }

    deleteItem(item: any, category: string) {
        this.isAlertOpen = true;
        this.itemTodelete = item.id;
    }

    handleDeleteItem(ev: any) {
        if(this.itemTodelete === 0) return
        if (ev.detail.role === "confirm") {
            this.restApi.deletePermanent(this.itemTodelete, 'delete');
            this.getTrash();
            this.toastHandler("Permanently deleted")
            this.selectedItems.clear();
            this.selectAll = false;
            this.itemTodelete = 0;
            this.isAlertOpen = false;
        }
    }

    async toastHandler(message: string, isCustom = true) {

        const toast = await this.toastController.create({
            icon: 'checkmark-circle-outline',
            message: message,
            cssClass: 'custom-toast',
            duration: 3000,
            position: "top",
        });

        toast.present();
    }
}
