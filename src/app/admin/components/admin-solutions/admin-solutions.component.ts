import { Component, OnInit } from '@angular/core';
import { SolutionService } from '../../../Default/services/solutionservices/solution.service';
import { CategorieService } from '../../../Default/services/categorie/categorie.service';
import { FournisseurService } from '../../../Default/services/fournisseur/fournisseur.service';

@Component({
  selector: 'app-admin-solutions',
  templateUrl: './admin-solutions.component.html',
  styleUrl: './admin-solutions.component.css'
})
export class AdminSolutionsComponent implements OnInit {

  solutions: any[] = [];
  newSolution: any = { id: 0, name: '', description: '', prix: 0, image: '', devis: '' };
  errorMessage = '';
  selectedFile: File | null = null;
  selectedPdfFile: File | null = null;
  categories: any[] = [];
  fournisseurs: any[] = [];

  filterName: string = '';
  filterMaxPrice: number | null = null;
  sortCategory: number | null = null;
  sortBy: string = 'name';

  // Palette de couleurs pour les catégories (même couleur pour même catégorie)
  private categoryColors: Map<number, string> = new Map();
  private colorPalette = [
    '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3',
    '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a',
    '#cddc39', '#ffc107', '#ff9800', '#ff5722', '#795548'
  ];

filteredSolutions: any[] = [];

  constructor(private solutionService: SolutionService,
              private categorieService:CategorieService,
              private fournisseurService:FournisseurService
  ) {}

  ngOnInit(): void {
    this.loadSolutions();
    this.loadCategories();
    this.loadFournisseurs();
  }

// Après avoir chargé les solutions
loadSolutions(): void {
  this.solutionService.getSolutions().subscribe({
    next: (data) => {
      this.solutions = data;
      this.filteredSolutions = [...data];
      this.assignCategoryColors();
      this.applyFilters();
    },
    error: (err) => console.error('Failed to load solutions', err)
  });
}
// Assigne une couleur fixe par catégorie
  assignCategoryColors() {
    this.categories.forEach((cat, index) => {
      if (!this.categoryColors.has(cat.id)) {
        this.categoryColors.set(cat.id, this.colorPalette[index % this.colorPalette.length]);
      }
    });
  }
  getCategoryColor(categoryId: number): string {
    return this.categoryColors.get(categoryId) || '#6c757d';
  }// Applique tous les filtres et tris
applyFilters() {
  let filtered = [...this.solutions];

  // Filtre par nom
  if (this.filterName.trim()) {
    const term = this.filterName.toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(term) ||
      (s.description && s.description.toLowerCase().includes(term))
    );
  }

  if (this.filterMaxPrice !== null && this.filterMaxPrice > 0) {
    filtered = filtered.filter(s => s.prix <= this.filterMaxPrice!);
  }

  // Filtre par catégorie
  if (this.sortCategory !== null) {
    filtered = filtered.filter(s => s.categorie?.id === this.sortCategory);
  }

  // Tri
  filtered.sort((a, b) => {
    switch (this.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-asc':
        return a.prix - b.prix;
      case 'price-desc':
        return b.prix - a.prix;
      case 'fournisseur':
        const fa = a.fournisseur?.nom || '';
        const fb = b.fournisseur?.nom || '';
        return fa.localeCompare(fb);
      default:
        return 0;
    }
  });

  this.filteredSolutions = filtered;
}

  resetNewSolution(): void {
    this.newSolution = { id: 0, name: '', description: '', prix: 0, image: '', devis: '' };
    this.selectedFile = null;
    this.selectedPdfFile = null;
    this.errorMessage = '';
  }
  loadCategories() {
  this.categorieService.getAll().subscribe(data => this.categories = data);
  }

loadFournisseurs() {
  this.fournisseurService.getAll().subscribe(data => this.fournisseurs = data);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  onPdfFileSelected(event: any): void {
    this.selectedPdfFile = event.target.files[0] || null;
  }

  addSolution(): void {
    this.errorMessage = '';

    if (!this.selectedFile || !this.selectedPdfFile) {
      this.errorMessage = 'Please select both image and PDF file';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newSolution.name);
    formData.append('description', this.newSolution.description);
    formData.append('prix', this.newSolution.prix.toString());
    formData.append('image', this.selectedFile);
    formData.append('devis', this.selectedPdfFile);
    formData.append('categorieId', this.newSolution.categorie?.id || '');
    formData.append('fournisseurId', this.newSolution.fournisseur?.id || '');
    this.solutionService.addSolution(formData).subscribe({
      next: (data) => {
        this.solutions.push(data);
        this.resetNewSolution();
        window.location.reload();

      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to add solution';
      }
    });
  }

  editSolution(solution: any): void {
    this.newSolution = { ...solution };
    this.selectedFile = null;
    this.selectedPdfFile = null;
    this.errorMessage = '';
  }

 updateSolution(): void {
  this.errorMessage = '';

  const formData = new FormData();

  // Always send these (even if unchanged)
  if (this.newSolution.name) formData.append('name', this.newSolution.name);
  if (this.newSolution.description) formData.append('description', this.newSolution.description);
  if (this.newSolution.prix) formData.append('prix', this.newSolution.prix.toString());

  // CRITICAL: Send categorieId and fournisseurId
  const categorieId = this.newSolution.categorie?.id;
  const fournisseurId = this.newSolution.fournisseur?.id;

  if (categorieId) {
    formData.append('categorieId', categorieId.toString());
  } else {
    formData.append('categorieId', ''); // sends null → removes category
  }

  if (fournisseurId) {
    formData.append('fournisseurId', fournisseurId.toString());
  } else {
    formData.append('fournisseurId', ''); // sends null → removes fournisseur
  }

  // Optional file updates
  if (this.selectedFile) formData.append('image', this.selectedFile);
  if (this.selectedPdfFile) formData.append('devis', this.selectedPdfFile);

  this.solutionService.updateSolution(formData, this.newSolution.id).subscribe({
    next: () => {
      this.loadSolutions();
      this.resetNewSolution();
      window.location.reload();
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'Update failed';
    }
  });
}
  deleteSolution(id: number): void {
    if (confirm('Delete this solution?')) {
      this.solutionService.deleteSolution(id).subscribe({
        next: () => this.solutions = this.solutions.filter(s => s.id !== id),
        error: () => alert('Delete failed')
      });
    }
  }

private closeModal(modalId: string): void {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    backdrop?.remove();
    modal.style.display = 'none';
  }
}
getImageUrl(path: string): string {
  if (!path) {
    return 'no-image.jpg'; // Create this file!
  }
  return 'http://localhost:9090' + path;
}
}