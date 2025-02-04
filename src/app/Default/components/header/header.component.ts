import { Component } from '@angular/core';
import { UserService } from '../../services/userservices/user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  user = {
    name: '',
    email: '',
    phone: '',
    adresse: '',
    password: '',
    confirmPassword: ''
  };
  message: string = ''; // Variable to hold alert messages
  messageType: string = ''; // To store type of message (success/error)

  loginData = { email: '', password: '' };

  currentUser: any = null;

  constructor(private userService: UserService,private router: Router) {}
  ngOnInit(): void {
    // When the component is initialized, check if the user is logged in
    this.currentUser = this.userService.getUserFromLocalStorage();
  }

  login() {
    this.userService.loginUser(this.loginData).subscribe(
      (response) => {
        console.log('Login successful:', response);
        // Store the user data in localStorage
        localStorage.setItem('user', JSON.stringify(response));
        this.currentUser = response; 
        window.location.reload();
        // Reload the page to update the UI
        // Set the currentUser to the response
      },
      (error) => {
        console.error('Login failed:', error);
        alert('Invalid credentials!');
      }
    );
  }

  logout(): void {
    // Remove the user data from localStorage on logout
    localStorage.removeItem('user');
    this.currentUser = null; // Reset the currentUser to null
    window.location.reload(); // Reload the page to update the UI

  }


  onSubmit(registerForm: NgForm) {

    this.userService.registerUser(this.user).subscribe({
      next: (response) => {
        this.setMessage('Registration successful', 'success');
        console.log('Registration Response:', response);
      },
      error: (err) => {
        console.error('Registration Error:', err);
        if (err.status === 400) {
          this.setMessage('Bad request. Please check your input.', 'error');
        } else if (err.status === 500) {
          this.setMessage('Server error. Please try again later.', 'error');
        } else {
          this.setMessage('Email is already in use', 'error');
        }
      }
    });
  }

  // Helper function to set the message
  setMessage(message: string, type: string) {
    this.message = message;
    this.messageType = type; // 'success' or 'error'
  }

  
}
