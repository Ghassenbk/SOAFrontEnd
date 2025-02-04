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
      name: '',
      description: '',
      prix: 0,
      image: '',
      devis: ''
    };
  }

  addSolution(): void {
    this.errorMessage = ''; // Clear previous error message
  
    this.solutionService.addSolution(this.newSolution).subscribe(
      (data) => {
        this.newSolution = { name: '', description: '', prix: 0, image: '', devis: '' };
  
        // Close the modal manually only on success
        const modal = document.getElementById('solution-s');
        if (modal) {
          modal.style.display = 'none';
          modal.classList.remove('show');
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
        }
  
        // Reload the page to fetch updated data
        location.reload();
      },
      (error) => {
        if (error.status === 400) {
          this.errorMessage = 'Solution already exists';
  
          // Clear the error message after 5 seconds
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
  
          console.error('Error response:', error); // Show backend error message
        } else {
          console.error('Unexpected error:', error);
        }
      }
    );
  }


  editSolution(formation: any): void {
    this.newSolution = { ...formation }; // Clone the clicked solution's data
  }

  updateSolution(): void {
    this.errorMessage = '';
  
    this.solutionService.updateSolution(this.newSolution).subscribe(
      () => {
        this.newSolution = {
          name: '',
          description: '',
          prix: 0,
          image: '',
          devis: ''
        };
  
        // Close the modal
        const modal = document.getElementById('ModifySolution-s');
        if (modal) {
          modal.style.display = 'none';
          modal.classList.remove('show');
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
        }
  
        // Refresh the list
        this.solutionService.getSolutions().subscribe((data: any[]) => {
          this.solutions = data;
        });
  
        // Reload the page to fetch updated data
        location.reload();
      },
      (error) => {
        if (error.status === 400) {
          this.errorMessage = 'Solution name already exists.';
        } else if (error.status === 404) {
          this.errorMessage = 'Solution not found.';
        } else if (error.status === 500) {
          this.errorMessage = 'An error has occured .';
        } else {
          console.error('Unexpected error:', error);
        }
  
        // Clear the error message after 5 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    );
  }
  
  


}


