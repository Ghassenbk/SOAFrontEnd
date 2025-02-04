import { Component,OnInit } from '@angular/core';
import { UserService } from '../../services/userservices/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.css'
})
export class PaiementComponent implements OnInit  {
  cartItems: any[] = [];
  totalPrice: number = 0;
  userId: number;

   // Model variables for form binding
   ccName: string = '';
   ccNumber: string = '';
   ccExpiration: string = '';
   ccCvv: string = '';
   

  constructor(private userService: UserService,private http: HttpClient) {
    const user = this.userService.getUserFromLocalStorage();
    this.userId = user?.id; 
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.userService.getUserPanier(this.userId).subscribe((panier) => {
      this.cartItems = panier.solutions;
      this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.prix, 0);
    });
  }

  removeFromCart(solutionId: number) {
    this.userService.removeSolutionFromPanier(this.userId, solutionId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.id !== solutionId);
      this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.prix, 0);
    });
  }
  processPayment() {
    const paymentMethod = this.getSelectedPaymentMethod();  // Getting the selected method
  
    const paymentData = {
      card: paymentMethod,  // Make sure to use 'card' instead of 'paymentMethod'
    };
  
    this.http.post(`http://localhost:9090/paiements/pay/${this.userId}`, paymentData)
      .subscribe({
        next: (response) => {
          alert('Paiement réussi ! Merci pour votre achat.');
          this.cartItems = []; // Clear cart after payment
          this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.prix, 0);
          window.location.reload(); // Reload the page to update the UI

        },
        error: (error) => {
          alert('Erreur lors du paiement : ' + error.error);
        }
      });
  }
  
  getSelectedPaymentMethod(): string {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked') as HTMLInputElement;
    return selectedMethod ? selectedMethod.value : '';  // Return the value of the selected radio button
  }
  

}
