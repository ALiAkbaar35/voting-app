import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppwriteService } from '../../appwrite.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  winningCandidates = [
    { position: 'President', candidate: 'John Doe', votes: 1200 },
    { position: 'Vice President', candidate: 'Jane Smith', votes: 1100 },
    // Add more candidates as needed
  ];
  selectedRoute: string | null = '';
  userData: any = null;
  error: string | null = null;

  constructor(
    private appwriteService: AppwriteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  onSelect(route: string | null): void {
    console.log(route);
    if (route) {
      this.router.navigate([route]);
    }
    this.selectedRoute = route;
  }

  async loadUserData(): Promise<void> {
      this.userData = await this.appwriteService.getUser();
      if (!this.userData) {
        this.router.navigate(['/login']);
      }
  }

  async logout(): Promise<void> {
    try {
      await this.appwriteService.logout();
      this.userData = null;
      this.router.navigate(['/login']);
      console.log('Logged out successfully');
    } catch (error: any) {
      this.error = error.message || 'An error occurred during logout.';
      console.error('Logout error:', error);
    }
  }
}
