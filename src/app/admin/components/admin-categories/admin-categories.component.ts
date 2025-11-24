import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var bootstrap: any; // ← Important !

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {

  categories: any[] = [];
  newCategorie: any = { id: null, nom: '', produits: [] };
  errorMessage: string = '';
  private categorieIdToDelete: number | null = null;

  private apiUrl = 'http://localhost:9090/categories';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => this.categories = data,
      error: () => this.errorMessage = "Impossible de charger les catégories"
    });
  }

  resetNewCategorie(): void {
    this.newCategorie = { id: null, nom: '', produits: [] };
    this.errorMessage = '';
  }

  addCategorie(): void {
    if (!this.newCategorie.nom?.trim()) {
      this.errorMessage = "Le nom de la catégorie est obligatoire";
      return;
    }

    this.http.post(this.apiUrl, { nom: this.newCategorie.nom.trim() }).subscribe({
      next: () => {
        this.loadCategories();
        window.location.reload();
        this.resetNewCategorie();
      },
      error: (err) => this.errorMessage = err.error?.message || "Cette catégorie existe déjà"
    });
  }

  editCategorie(categorie: any): void {
    this.newCategorie = { ...categorie };
    this.errorMessage = '';
  }

  updateCategorie(): void {
    if (!this.newCategorie.nom?.trim()) {
      this.errorMessage = "Le nom ne peut pas être vide";
      return;
    }

    this.http.put(`${this.apiUrl}/${this.newCategorie.id}`, { nom: this.newCategorie.nom.trim() }).subscribe({
      next: () => {
        this.loadCategories();
        window.location.reload();
      },
      error: (err) => this.errorMessage = err.error?.message || "Erreur lors de la modification"
    });
  }

  // NOUVELLE MÉTHODE PROPRE
  openDeleteModal(id: number, nom: string): void {
    this.categorieIdToDelete = id;
    const nameEl = document.getElementById('deleteCategorieName');
    if (nameEl) nameEl.textContent = nom;

    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteCategorieModal')!);
    modal.show();

    const btn = document.getElementById('confirmDeleteCategorieBtn');
    const handler = () => {
      this.performDelete(id);
      btn?.removeEventListener('click', handler);
    };
    btn?.addEventListener('click', handler);
  }

  private performDelete(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.id !== id);
        this.errorMessage = '';
        window.location.reload();
      },
      error: (err) => {
        this.errorMessage = err.error || 'Suppression impossible : cette catégorie est utilisée';
      }
    });
  }

  closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
      document.querySelector('.modal-backdrop')?.remove();
      modal.style.display = 'none';
    }
  }
}