import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientDetailComponent } from './components/client-detail/client-detail.component';
import { ReportsComponent } from './components/reports/reports.component';
import { PersonalcomponentComponent } from './components/personalcomponent/personalcomponent.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'clients/:id', component: ClientDetailComponent },
      { path: 'reports', component: ReportsComponent },
      {path:'personal',component: PersonalcomponentComponent}
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
