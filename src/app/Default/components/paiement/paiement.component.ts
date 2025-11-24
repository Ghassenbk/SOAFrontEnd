// src/app/components/paiement/paiement.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/userservices/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.css'
})
export class PaiementComponent implements OnInit {

  cartItems: any[] = [];
  totalPrice: number = 0;
  userId: number = 2; // Change avec ton vrai user ID si besoin

  // LES CHAMPS DE CARTE OBLIGATOIRES
  ccName: string = '';
  ccNumber: string = '';
  ccExpiration: string = '';
  ccCvv: string = '';

  constructor(
    private userService: UserService,
    private http: HttpClient
  ) {
    const user = this.userService.getUserFromLocalStorage();
    if (user?.id) this.userId = user.id;
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.userService.getUserPanier(this.userId).subscribe((data: any) => {
      this.cartItems = data.solutionItems || [];
      this.totalPrice = this.cartItems.reduce((sum: number, item: any) =>
        sum + (item.quantite * item.solution.prix), 0
      );
    });
  }

  removeFromCart(solutionId: number) {
    this.userService.removeSolutionFromPanier(this.userId, solutionId).subscribe(() => {
      this.loadCart();
    });
  }

  processPayment() {
    const selected = document.querySelector('input[name="paymentMethod"]:checked') as HTMLInputElement;
    const card = selected?.value;

    if (!card) {
      alert("Veuillez sélectionner un mode de paiement");
      return;
    }

    this.http.post(`http://localhost:9090/paiements/pay/${this.userId}`, { card })
      .subscribe({
        next: () => {
          alert("Paiement accepté ! Merci pour votre commande !");
          this.cartItems = [];
          this.totalPrice = 0;
        },
        error: (err) => {
          alert("Erreur : " + (err.error || "Paiement refusé"));
        }
      });
  }
}