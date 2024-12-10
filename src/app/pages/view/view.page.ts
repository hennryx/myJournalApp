import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ViewPage implements OnInit {

  itemDetails: any = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: RestApiService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const category = params['category'];

      if (id && category) {
        this.fetchItemDetails(id, category);
      }
    });
  }

  fetchItemDetails(id: string, category: string) {
    // Fetch all items from the specific category
    const items = this.apiService.getAll(category);
    
    // Find the specific item
    this.itemDetails = items.find((item: any) => item.id === parseInt(id));
  }

}
