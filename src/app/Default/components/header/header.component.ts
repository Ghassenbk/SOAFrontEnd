import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/userservices/user.service';
import { Router } from '@angular/router';
import { CompanyService } from '../../../Default/services/companyinfo/company.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  registerForm: FormGroup;
  companyInfo: any = {
    name: '',
    address: '',
    gmaps: '',
    phone: '',
    email: '',
    facebookurl: '',
    instagramurl: '',
    twitterurl: '',
    iframe: ''
  };
  companyId: number = 1; // You can set this dynamically based on your requirement

  message: string = ''; // Variable to hold alert messages
  messageType: string = ''; // To store type of message (success/error)

  loginData = { email: '', password: '' };
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private companyService: CompanyService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]], // Only letters allowed
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // Exactly 8 digits
      adresse: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.currentUser = this.userService.getUserFromLocalStorage();
    this.companyService.getCompanyInfo(this.companyId).subscribe((data: any[]) => {
      this.companyInfo = data;
    });
  }

  login() {
    this.userService.loginUser(this.loginData).subscribe(
      (response) => {
        console.log('Login successful: redirection en cours', response);
        localStorage.setItem('user', JSON.stringify(response));
        this.currentUser = response; 
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error) => {
        console.error('Login failed:', error);
        alert('Invalid credentials!');
      }
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUser = null;
    window.location.reload();
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.setMessage('Veuillez remplir tous les champs correctement.', 'error');
      return;
    }
  
    this.userService.registerUser(this.registerForm.value).subscribe({
      next: (response) => {
        this.setMessage('Inscription réussie ! Redirection en cours...', 'success');
  
        setTimeout(() => {
          window.location.reload();
        }, 1200); // Attendre 3 secondes avant de recharger
      },
      error: (err) => {
        console.error('Erreur d\'inscription:', err);
        if (err.status === 400) {
          this.setMessage('Demande invalide. Vérifiez vos informations.', 'error');
        } else if (err.status === 500) {
          this.setMessage('Erreur serveur. Veuillez réessayer plus tard.', 'error');
        } else {
          this.setMessage('Cet e-mail est déjà utilisé.', 'error');
        }
      }
    });
  }
  getLoginEmailError(emailControl: any): string {
    if (emailControl.errors?.['required']) {
      return 'Veuillez entrer votre adresse e-mail';
    }
    if (emailControl.errors?.['pattern']) {
      return 'Adresse e-mail invalide. Exemple: exemple@email.com';
    }
    return '';
  }
  
  
  
  

  // Custom Validator for Matching Passwords
  passwordMatchValidator(group: AbstractControl) {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');
  
    if (!passwordControl || !confirmPasswordControl) return null;
  
    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ notMatching: true });
      return { notMatching: true };
    } else {
      confirmPasswordControl.setErrors(null);
      return null;
    }
  }
  

  // Helper function to get validation messages
  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    
    if (!control) return '';
  
    if (control.hasError('required')) return 'Remplissez le champ';
  
    switch (field) {
      case 'name':
        return control.hasError('pattern') ? 'Le nom ne peut contenir que des lettres' : '';
      case 'email':
        return control.hasError('email') ? 'Entrez une adresse e-mail valide' : '';
      case 'phone':
        return control.hasError('pattern') ? 'Le numéro de téléphone doit comporter 8 chiffres' : '';
      case 'password':
        return control.hasError('minlength') ? 'Le mot de passe doit contenir au moins 6 caractères' : '';
      case 'confirmPassword':
        if (this.registerForm.hasError('notMatching')) {
          return 'Les mots de passe ne correspondent pas';
        }
        return '';
      default:
        return '';
    }
  }
  
  
  // Helper function to set the message
  setMessage(message: string, type: string) {
    this.message = message;
    this.messageType = type;  
  
    // Forcer la mise à jour de l'affichage avec ChangeDetectorRef
    setTimeout(() => {
      this.message = ''; // Effacer le message après 3 secondes
    }, 3000);
  }
  
}
