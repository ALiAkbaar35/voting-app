import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppwriteService } from '../../appwrite.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  errors: any = {
    fullName: '',
    nationalId: '',
    address: '',
    area: '',
    DOB: '',
    email: '',
    password: '',
    confirmPassword: '',
    error:'',
  };
  data: any = {
    fullName: '',
    nationalId: '',
    address: '',
    area: 0,
    DOB: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  constructor(
    private router: Router,
    private appwriteService: AppwriteService
  ) {}
  reset() {
    this.data = {
      fullName: '',
      nationalId: '',
      address: '',
      area: '',
      DOB: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    this.errors = {
      fullName: '',
      nationalId: '',
      address: '',
      area: '',
      DOB: '',
      email: '',
      password: '',
      confirmPassword: '',
      error:'',
    };
  }
  async onSubmit() {
    if (
      !this.data.nationalId ||
      this.data.nationalId.length !== 13 ||
      !this.data.nationalId.match(/^[0-9]+$/)
    ) {
      this.errors.nationalId =
        'National ID should be positive number of 13 digits';
    }
    if (
      !this.data.fullName ||
      this.data.fullName.length < 3 ||
      this.data.fullName.length > 20 ||
      !this.data.fullName.match(/^[a-zA-Z\s]+$/)
    ) {
      this.errors.fullName =
        'Name should be between 3 and 20 characters of letters';
    }
    if (
      !this.data.email ||
      !this.data.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      this.errors.email = 'Valid Email is required';
    }
    if (
      !this.data.address ||
      this.data.address.length < 3 ||
      this.data.address.length > 20 ||
      !this.data.address.match(/^[a-zA-Z-0-9\s]+$/)
    ) {
      this.errors.address =
        'Address should be between 3 and 20 characters of letters';
    }
    if (
      !this.data.area ||
      this.data.area < 0 ||
      this.data.area > 9999999999999999
    ) {
      this.errors.area = 'Area code should be a upositive number';
    }
    if (!this.data.DOB) {
      this.errors.DOB = 'Date of Birth is required';
    }
    const dob = new Date(this.data.DOB);
    const today = new Date();
    const ageDiff = today.getFullYear() - dob.getFullYear();
    const isOver18 =
      ageDiff > 18 ||
      (ageDiff === 18 && today.getMonth() > dob.getMonth()) ||
      (ageDiff === 18 &&
        today.getMonth() === dob.getMonth() &&
        today.getDate() >= dob.getDate());

    if (!isOver18) {
      this.errors.DOB = 'User must be at least 18 years old';
    }

    if (this.data.password !== this.data.confirmPassword) {
      this.errors.confirmPassword = 'Password does not match';
    } 
    else {
      try {
        await this.appwriteService.register(this.data);
        this.router.navigate(['/']);
        this.reset();
      } catch (error: any) {
        this.reset();
        this.errors.error = error.message || 'An error occurred during login.';
        console.error('Login error:', error);
      }
    }
  }
}
