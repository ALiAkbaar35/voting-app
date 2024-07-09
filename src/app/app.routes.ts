import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { RegistrationComponent } from './Pages/registration/registration.component';
import { LoginComponent } from './Pages/login/login.component';
import { CandidatesComponent } from './Pages/candidates/candidates.component';
import { VotingComponent } from './Pages/voting/voting.component';
import { PositionsComponent } from './Pages/positions/positions.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home/dashboard', pathMatch: 'full' },
  { 
    path: 'home', 
    component: HomeComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'candidates', component: CandidatesComponent },
      { path: 'voting', component: VotingComponent },
      { path: 'positions', component: PositionsComponent },

    ]
  },
  { path: '**', redirectTo: '/home/dashboard' } 
];
