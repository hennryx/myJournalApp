import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { NotesPage } from './pages/notes/notes.page';
import { SettingsPage } from './pages/settings/settings.page';
import { TabsPage } from './tabs/tabs.page';
import { HeroPage } from './hero/hero.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/hero',
    pathMatch: 'full',
  },
  {
    path: 'hero',
    component: HeroPage,
  },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        component: HomePage,
      },
      {
        path: 'notes',
        component: NotesPage,
      },
      {
        path: 'settings',
        component: SettingsPage,
      },
      {
        path: 'view',
        component: SettingsPage,
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
];
