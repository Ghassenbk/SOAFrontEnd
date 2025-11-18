import { Component,OnInit} from '@angular/core';
import { FormationService } from '../../../Default/services/formationservice/formation.service';

@Component({
  selector: 'app-admin-formations',
  templateUrl: './admin-formations.component.html',
  styleUrl: './admin-formations.component.css'
})
export class AdminFormationsComponent implements OnInit {
  formations: any[] = [];
  newFormation = {

    dateDebut: new Date(),
    dateFin: new Date(),
    description: "",
    prix: 0,
    name: ""
  };
  
  errorMessage: string = ''; // Error message for duplicate names
    constructor(private formationService:FormationService) {}

    ngOnInit(): void {
      this.formationService.getFormation().subscribe((data: any[]) => {
        this.formations = data;
      });
    }
    deleteFormation(id: number): void {
      if (confirm('Are you sure you want to delete this formation?')) {
        this.formationService.deleteFormation(id).subscribe(
          () => {
            this.formations = this.formations.filter(formation => formation.id !== id);
          },
          error => {

            console.error('Error deleting solution:', error);
          }
        );
      }
    }
    resetNewFormation(): void {
      this.newFormation = {
        dateDebut: new Date(),
        dateFin: new Date(),
        description: "",
        prix: 0,
        name: ""
      };
    }

    addFormation(): void {
      this.errorMessage = ''; 
      // Clear previous error message
    
      const currentDate = new Date();
      console.log(currentDate);
      
      // Validate dates
      if (this.newFormation.dateDebut < currentDate) {
        this.errorMessage = 'La date de début doit être supérieure ou égale à la date courante.';
        
        return;
      }
      if (this.newFormation.dateDebut >= this.newFormation.dateFin) {
        this.errorMessage = 'La date de début doit être inférieure à la date de fin.';
        return;
      }
    
      this.formationService.addFormation(this.newFormation).subscribe(
        (data) => {
          this.newFormation = { 
            dateDebut: new Date(),
            dateFin: new Date(),
            description: "",
            prix: 0,
            name: "" 
          };
    
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
          if (error.status == 400) {
            this.errorMessage = 'Formation already exists';
            console.error('Error response:', error); // Show backend error message
          } else {
            console.error('Unexpected error:', error);
          }
        }
      );
    }
    editFormation(formation: any): void {
      this.newFormation = { ...formation }; // Clone the clicked solution's data
    }

    updateFormation(): void {
      
      this.errorMessage = ''; 
    
      const currentDate = new Date();
    
      // Validate dates
      if (this.newFormation.dateDebut < currentDate) {
        this.errorMessage = 'La date de début doit être supérieure ou égale à la date courante.';
        return;
      }
      if (this.newFormation.dateDebut >= this.newFormation.dateFin) {
        this.errorMessage = 'La date de début doit être inférieure à la date de fin.';
        return;
      }
    
      this.formationService.updateFormation(this.newFormation).subscribe(
        () => {
          // Reset the form
          this.newFormation = {
            dateDebut: new Date(),
            dateFin: new Date(),
            description: "",
            prix: 0,
            name: ""
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
          this.formationService.getFormation().subscribe((data: any[]) => {
            this.formations = data;
          });
          // Reload the page to fetch updated data
          location.reload();
        },
        (error) => {
          if (error.status === 500) {
            alert('An error occurred on the server. Please try again later.');
          } else if (error.status === 404) {
            alert('Formation not found.');
          } else if (error.status === 400) {
            alert('Formation name already exists.');
          }else {
            console.error('Unexpected error:', error);
          }
        }
      );
    }
    

}
