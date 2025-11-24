import { Component, OnInit } from '@angular/core';
import { SolutionService } from '../../services/solutionservices/solution.service';
import { CategorieService } from '../../services/categorie/categorie.service';
import { UserService } from '../../services/userservices/user.service';



@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.css']
})
export class SolutionsComponent implements OnInit {

  solutions: any[] = [];
  categories: any[] = [];
  filteredAndSorted: any[] = [];

  searchTerm: string = '';
  selectedCategory: number | null = null;
  sortOrder: string = 'default';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 8;

  constructor(
    private solutionService: SolutionService,
    private categorieService: CategorieService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadSolutions();
  }

  loadCategories() {
    this.categorieService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: () => console.error('Erreur chargement catégories')
    });
  }

  loadSolutions() {
    this.solutionService.getSolutions().subscribe({
      next: (data: any[]) => {
        this.solutions = data;
        this.filteredAndSorted = [...data];
        this.applyFilters();
      },
      error: (err) => console.error('Erreur chargement solutions', err)
    });
  }

  applyFilters() {
    let list = [...this.solutions];

    // Recherche par nom
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(term) ||
        (s.description && s.description.toLowerCase().includes(term))
      );
    }

    // Filtre par catégorie
    if (this.selectedCategory !== null) {
      list = list.filter(s => s.categorie?.id === this.selectedCategory);
    }

    // Tri par prix
    if (this.sortOrder === 'price-asc') {
      list.sort((a, b) => a.prix - b.prix);
    } else if (this.sortOrder === 'price-desc') {
      list.sort((a, b) => b.prix - a.prix);
    }

    this.filteredAndSorted = list;
    this.currentPage = 1; // Reset pagination
  }

  get totalPages(): number {
    return Math.ceil(this.filteredAndSorted.length / this.itemsPerPage);
  }

  get paginatedSolutions(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredAndSorted.slice(start, end);
  }

  setPage(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addToCart(solutionId: number): void {
    const currentUser = this.userService.getUserFromLocalStorage();

    if (!currentUser) {
      alert('Veuillez vous connecter pour ajouter au panier.');
      return;
    }

    if (currentUser.role === 'ADMIN') {
      alert("Les administrateurs ne peuvent pas ajouter au panier.");
      return;
    }

    this.userService.addSolutionToCart(currentUser.id, solutionId).subscribe({
      next: () => alert('Solution ajoutée au panier !'),
      error: () => alert('Erreur lors de l\'ajout au panier.')
    });
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/no-image.jpg';
    return 'http://localhost:9090' + path;
  }
  // Ajoute cette propriété
selectedSolution: any = null;

// Ajoute ces méthodes
openDetail(solution: any): void {
  this.selectedSolution = solution;
}


}