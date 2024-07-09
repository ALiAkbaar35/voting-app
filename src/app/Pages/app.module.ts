import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router'; 
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { VotingComponent } from './voting/voting.component';
import { PositionsComponent } from './positions/positions.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    CandidatesComponent,
    VotingComponent,
    PositionsComponent,
    DashboardComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule],
  providers: [],
  bootstrap: []
})
export class AppModule { }
