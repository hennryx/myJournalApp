import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-hero',
  templateUrl: 'hero.page.html',
  styleUrls: ['hero.page.scss'],
  standalone: true,
  imports: [IonContent, RouterModule],
})
export class HeroPage {
  constructor(private router: Router) {}

  handleNavigate() {
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const name = nameInput.value.trim();

    if (name) {
      localStorage.setItem('userName', name);
      this.router.navigate(['tabs/home']);
    } else {
      alert('Please enter your name before proceeding.');
    }
  }
}
