import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-hero',
  templateUrl: 'hero.page.html',
  styleUrls: ['hero.page.scss'],
  standalone: true,
  imports: [IonContent, RouterModule, CommonModule],
})
export class HeroPage implements OnInit {
  username: string | null = null;
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.username = localStorage.getItem('userName');
  }

  handleNavigate() {
    this.username = localStorage.getItem('userName') || "";
    const nameInput = document.getElementById('name') as HTMLInputElement;
    
    console.log("ey");
    if(this.username) {
      this.router.navigate(['tabs/home']);
      return
    }
    
    if (nameInput) {
      localStorage.setItem('userName', nameInput.value);
      this.username = nameInput.value;
      this.router.navigate(['tabs/home']);
    } else {
      alert('Please enter your name before proceeding.');
    }
  }
}
