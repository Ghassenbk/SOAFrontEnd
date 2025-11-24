import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var bootstrap: any;
@Component({
  selector: 'app-admin-fournisseurs',
  templateUrl: './admin-fournisseurs.component.html',
  styleUrls: ['./admin-fournisseurs.component.css']
})
export class AdminFournisseursComponent implements OnInit {

  fournisseurs: any[] = [];
  newFournisseur: any = { id: null, nom: '' };
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
    this.http.get<any[]>('http://localhost:9090/fournisseurs').subscribe({
      next: (data) => this.fournisseurs = data,
      error: () => this.errorMessage = "Impossible de charger les fournisseurs"
    });
  }

  resetNewFournisseur(): void {
    this.newFournisseur = { id: null, nom: '' };
    this.errorMessage = '';
  }

addFournisseur(): void {
  if (!this.newFournisseur.nom?.trim()) {
    this.errorMessage = "Le nom est obligatoire";
    return;
  }

  const payload = { nom: this.newFournisseur.nom.trim() }; // ← plus propre

  this.http.post('http://localhost:9090/fournisseurs', payload).subscribe({
    next: () => {
      this.loadFournisseurs();
       window.location.reload();
      this.resetNewFournisseur();
    },
    error: (err) => {
      this.errorMessage = err.error?.message || "Erreur lors de l'ajout";
    }
  });
}

  editFournisseur(f: any): void {
    this.newFournisseur = { ...f };
  }

  updateFournisseur(): void {
    this.http.put(`http://localhost:9090/fournisseurs/${this.newFournisseur.id}`, this.newFournisseur).subscribe({
      next: () => {
        this.loadFournisseurs();
        window.location.reload();

      },
      error: () => this.errorMessage = "Erreur de mise à jour"

    });
  }

// Variables pour gérer la suppression en cours
private fournisseurIdToDelete: number | null = null;
private fournisseurNomToDelete: string = '';

deleteFournisseur(id: number): void {
  const fournisseur = this.fournisseurs.find(f => f.id === id);
  if (!fournisseur) return;

  this.fournisseurIdToDelete = id;
  this.fournisseurNomToDelete = fournisseur.nom;

  // Met à jour le nom dans le modal
  const nameElement = document.getElementById('deleteFournisseurName');
  if (nameElement) {
    nameElement.textContent = fournisseur.nom;
  }

  // Ouvre le modal personnalisé
  const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal')!);
  modal.show();

  // Gestion du bouton "Oui, supprimer"
  const confirmBtn = document.getElementById('confirmDeleteBtn');
  const handler = () => {
    this.performDelete(id);
    confirmBtn?.removeEventListener('click', handler);
  };
  confirmBtn?.addEventListener('click', handler);
}

private performDelete(id: number): void {
  this.http.delete(`http://localhost:9090/fournisseurs/${id}`).subscribe({
    next: () => {
      this.fournisseurs = this.fournisseurs.filter(f => f.id !== id);
      this.errorMessage = '';
      window.location.reload();
    },
    error: (err) => {
      this.errorMessage = err.error || 'Suppression échouée';

    }
  });
}

  closeModal(id: string): void {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
      document.querySelector('.modal-backdrop')?.remove();
      modal.style.display = 'none';
    }
  }
}