import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';

  constructor() {
    this.loadTheme();
  }

  toggleTheme(isDarkMode: boolean) {
    const theme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY) || 'light';
    this.applyTheme(savedTheme);
  }

  private applyTheme(theme: string) {
    const rootElement = document.documentElement;
    if (theme === 'dark') {
      rootElement.classList.add('dark');
    } else {
      rootElement.classList.remove('dark');
    }
  }
}
