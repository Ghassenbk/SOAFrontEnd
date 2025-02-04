import { Component,OnInit} from '@angular/core';
import { FormationService } from '../../services/formationservice/formation.service';
import { UserService } from '../../services/userservices/user.service';
@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrl: './formations.component.css'
})
export class FormationsComponent {

  formations: any[] = [];
  
    constructor(private formationService: FormationService,private userService: UserService) {}

    ngOnInit(): void {
      this.formationService.getFormation().subscribe((data: any[]) => {
        const currentDate = new Date();
  
        // Correction : utiliser 'dateFin' au lieu de 'endDate'
        this.formations = data.filter(formation => {
          const dateFin = new Date(formation.dateFin); 
          return dateFin >= currentDate; // Affiche seulement les formations non terminées
        });
      });
    }

    enrollInFormation(formationId: number): void {
      const currentUser = this.userService.getUserFromLocalStorage();  // Get the logged-in user
  
      if (!currentUser) {
        alert("Please log in to enroll in a formation.");
        return;
      }
  
      if (currentUser.role === 'ADMIN') {
        alert("You're an admin, you cannot enroll in a formation.");
        return;
      }
  
      // Call the backend API to enroll the user in the formation
      this.userService.enrollUserInFormation(currentUser.id, formationId).subscribe(
        (response) => {
          alert('You have successfully enrolled in the formation!');
        },
        (error) => {
          alert('you are already enrolled in this formation!');
        }
      );
    }

}
