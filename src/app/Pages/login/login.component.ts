import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppwriteService } from '../../appwrite.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  error:any={
    err:'',
    email:'',
    password:'',
  }
  email: string = '';
  password: string = '';

  reset() {
    this.email = '';
    this.password = '';
    this.error = {
      err: '',
      email: '',
      password: '',
    };
  }
  constructor(
    private router: Router,
    private appwriteService: AppwriteService
  ) {}

  async onSubmit() {
    if (!this.email  || this.email.indexOf('@') == -1) {
      this.error.email = 'Please enter a valid email address.';
    } 
    else if (!this.password || this.password.length < 8) {
      this.error.password = 'Password must be at least 8 characters long.';
    } 
    else {
      this.error.err = null;
      try {
        await this.appwriteService.login(this.email, this.password);
        this.router.navigate(['/']);
        this.reset();
      } catch (error: any) {
        this.reset();

        this.error.err = error.message || 'An error occurred during login.';
        console.error('Login error:', error);
      }
    }
  }
}
