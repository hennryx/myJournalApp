import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonIcon, IonBackButton, IonAlert } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from 'src/app/services/rest-api.service';
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'app-view',
    templateUrl: './view.page.html',
    styleUrls: ['./view.page.scss'],
    standalone: true,
    imports: [IonAlert, IonBackButton, IonIcon, IonContent, IonHeader, CommonModule, FormsModule]
})
export class ViewPage implements OnInit {

    darkMode = false;
    itemDetails: any = null;
    category: string = '';
    isAlertOpen: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private apiService: RestApiService,
        private toastController: ToastController,
        private router: Router
    ) { }

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


    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const id = params['id'];
            const category = params['category'];

            console.log(id);
            console.log(category);
            

            if (id && category) {
                this.fetchItemDetails(id, category);
            }
        });

        if (localStorage.getItem('dark')) {
            const dark = JSON.parse(localStorage.getItem('dark') || "")
            document.body.classList.toggle('dark', dark);
            this.darkMode = dark
        }
    }

    fetchItemDetails(id: string, category: string) {
        const items = this.apiService.getAll(category);
        this.category = category;
        this.itemDetails = items.find((item: any) => item.id === parseInt(id));
    }

    getCategoryIcon(): string {
        switch (this.category) {
            case 'Myday': return '📓';
            case 'Moment': return '✨';
            case 'Achievements': return '🏆';
            case 'Inspiration': return '💡';
            default: return '📝';
        }
    }

    handleEdit() {
        console.log('Edit', this.itemDetails);
        this.router.navigate(['/tabs/home'], {
            state: {
                item: this.itemDetails,
                category: this.category
            }
        });
    }

    handleDelete() {
        this.isAlertOpen = true;
    }

    handleDeleteItem(ev: any) {
        if (ev.detail.role === "confirm" && this.itemDetails) {
            this.apiService.delete(this.itemDetails.id, this.category);
            this.toastHandler("Inspiration Successfully deleted");
            this.router.navigate(['/tabs/home']);
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
