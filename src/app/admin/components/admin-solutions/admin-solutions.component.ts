import { Component ,OnInit} from '@angular/core';
import { SolutionService } from '../../../Default/services/solutionservices/solution.service';


@Component({
  selector: 'app-admin-solutions',
  templateUrl: './admin-solutions.component.html',
  styleUrl: './admin-solutions.component.css'
})
export class AdminSolutionsComponent implements OnInit {
  solutions: any[] = [];
  newSolution = {
    id: 0, // Ajout de l'id
    name: '',
    description: '',
    prix: 0,
    image: '',
    devis: ''
  };
  
  errorMessage: string = ''; // Error message for duplicate names

  constructor(private solutionService: SolutionService) {}

  ngOnInit(): void {
    this.solutionService.getSolutions().subscribe((data: any[]) => {
      this.solutions = data;
    });
  }

  deleteSolution(id: number): void {
    if (confirm('Are you sure you want to delete this solution?')) {
      this.solutionService.deleteSolution(id).subscribe(
        () => {
          this.solutions = this.solutions.filter(solution => solution.id !== id);
        },
        error => {
          console.error('Error deleting solution:', error);
        }
      );
    }
  }
  resetNewSolution(): void {
    this.newSolution = {
      id: 0, // Ajout de l'id
      name: '',
      description: '',
      prix: 0,
      image: '',
      devis: ''
    };
  }

  selectedFile: File | null = null;
  selectedPdfFile: File | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newSolution.image = e.target.result; // Show the image preview instantly
        
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onPdfFileSelected(event: any) {
    this.selectedPdfFile = event.target.files[0];
  }


  

  addSolution(): void {
    this.errorMessage = '';
  
    if (!this.selectedFile || !this.selectedPdfFile) {
      this.errorMessage = 'Please select both an image file and a PDF file.';
      return;
    }
  
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('name', this.newSolution.name);
    formData.append('description', this.newSolution.description);
    formData.append('prix', this.newSolution.prix.toString());
    formData.append('devis', this.selectedPdfFile, this.selectedPdfFile.name);
  
    this.solutionService.addSolution(formData).subscribe(
      (data) => {
        this.resetNewSolution();
        location.reload();
      },
      (error) => {
        this.errorMessage = 'An error occurred.';
        console.error(error);
      }
    );
  }




editSolution(solution: any): void {
  this.newSolution = { ...solution }; // Copie l'objet complet avec l'ID
}


updateSolution(): void {
  this.errorMessage = '';

  const formData = new FormData();

  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  if (this.selectedPdfFile) {
    formData.append('devis', this.selectedPdfFile, this.selectedPdfFile.name);
  }

  if (this.newSolution.name) {
    formData.append('name', this.newSolution.name);
  }

  if (this.newSolution.description) {
    formData.append('description', this.newSolution.description);
  }

  if (this.newSolution.prix !== undefined && this.newSolution.prix !== null) {
    formData.append('prix', this.newSolution.prix.toString());
  }

  this.solutionService.updateSolution(formData, this.newSolution.id).subscribe(
    () => {
      this.resetNewSolution();
      location.reload();
    },
    (error) => {
      if (error.status === 400) {
        this.errorMessage = 'Solution name already exists.';
      } else if (error.status === 404) {
        this.errorMessage = 'Solution not found.';
      } else {
        this.errorMessage = 'An error has occurred.';
      }

      setTimeout(() => { this.errorMessage = ''; }, 5000);
    }
  );
}


  
  


}


