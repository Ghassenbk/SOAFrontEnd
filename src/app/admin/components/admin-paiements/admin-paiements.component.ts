import { Component, OnInit } from '@angular/core';
import { PaiementService } from '../../../Default/services/paiementservice/paiement.service';

@Component({
  selector: 'app-admin-paiements',
  templateUrl: './admin-paiements.component.html',
  styleUrl: './admin-paiements.component.css'
})
export class AdminPaiementsComponent implements OnInit{

 paiements: any[] = [];
 total: number = 0; // Variable to hold the total


  constructor(private paiementService: PaiementService) {}

  ngOnInit(): void {
    this.paiementService.getPaiements().subscribe((data) => {
      console.log(data); // Log the response data
      this.paiements = data;
      this.calculateTotalPayed();
    });
  }
  
  calculateTotalPayed(): void {
    this.total= this.paiements.reduce((sum, paiement) => sum + paiement.totalPayed, 0);
  }

  deleteAllPaiements(): void {
    if (confirm('Are you sure you want to delete all paiements?')) {
      this.paiementService.deleteAllPaiements().subscribe(
        () => {
          // Clear the local array after deletion
          this.paiements = [];
          
          // Recalculate the total after deletion
          this.calculateTotalPayed();
        },
        error => {
          console.error('Error deleting all paiements:', error);
        }
      );
    }
  }
  

  
  deletePaiement(id: number): void {
    this.paiementService.deletePaiement(id).subscribe(
      () => {
        // Filtrer les paiements pour exclure celui avec l'ID donné
        this.paiements = this.paiements.filter(paiement => paiement.id !== id);
        this.calculateTotalPayed();

      },
      error => {
        console.error('Error deleting paiement:', error);
      }
    );
  }
  


}
