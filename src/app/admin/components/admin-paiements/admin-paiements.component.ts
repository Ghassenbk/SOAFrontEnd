import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var bootstrap: any;

@Component({
  selector: 'app-admin-paiements',
  templateUrl: './admin-paiements.component.html',
  styleUrls: ['./admin-paiements.component.css']
})
export class AdminPaiementsComponent implements OnInit {

  paiements: any[] = [];
  filteredPaiements: any[] = [];
  total: number = 0;
  selectedPaiement: any;

  // Filtres
  searchTerm: string = '';
  sortOrder: 'asc' | 'desc' | 'none' = 'none';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPaiements();
  }

  loadPaiements(): void {
    this.http.get<any[]>('http://localhost:9090/paiements/all-detailed').subscribe(
      data => {
        this.paiements = data;
        this.filteredPaiements = [...data];
        this.calculateTotalPayed();
        this.applyFilters();
      },
      error => {
        console.error('Error fetching paiements:', error);
      }
    );
  }

  // Recherche par nom OU email
  onSearch(): void {
    this.applyFilters();
  }

  // Tri par prix
  toggleSort(): void {
    if (this.sortOrder === 'none' || this.sortOrder === 'desc') {
      this.sortOrder = 'asc';
    } else if (this.sortOrder === 'asc') {
      this.sortOrder = 'desc';
    } else {
      this.sortOrder = 'none';
    }
    this.applyFilters();
  }

  // Applique les deux filtres
  applyFilters(): void {
    let filtered = [...this.paiements];

    // 1. Recherche nom ou email
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.userName.toLowerCase().includes(term) ||
        p.userEmail.toLowerCase().includes(term)
      );
    }

    // 2. Tri par prix
    if (this.sortOrder === 'asc') {
      filtered.sort((a, b) => a.totalPayed - b.totalPayed);
    } else if (this.sortOrder === 'desc') {
      filtered.sort((a, b) => b.totalPayed - a.totalPayed);
    }

    this.filteredPaiements = filtered;
    this.calculateTotalPayed(); // Recalcule sur les éléments affichés
  }

  calculateTotalPayed(): void {
    this.total = this.filteredPaiements.reduce((sum, p) => sum + p.totalPayed, 0);
  }

  openReceiptModal(paiement: any): void {
    this.selectedPaiement = paiement;
    const modal = new bootstrap.Modal(document.getElementById('receiptModal'));
    modal.show();
  }

  deleteAllPaiements(): void {
    if (confirm('Are you sure you want to delete ALL payments?')) {
      this.http.delete('http://localhost:9090/paiements/all').subscribe(() => {
        this.paiements = [];
        this.filteredPaiements = [];
        this.total = 0;
      });
    }
  }

  deletePaiement(id: number): void {
    if (confirm('Delete this payment?')) {
      this.http.delete(`http://localhost:9090/paiements/${id}`).subscribe(() => {
        this.paiements = this.paiements.filter(p => p.id !== id);
        this.applyFilters();
      });
    }
  }
}