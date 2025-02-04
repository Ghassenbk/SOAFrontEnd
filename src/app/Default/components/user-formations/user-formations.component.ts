import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/userservices/user.service';
import { FormationService } from '../../services/formationservice/formation.service';

@Component({
  selector: 'app-user-formations',
  templateUrl: './user-formations.component.html',
  styleUrl: './user-formations.component.css'
})
export class UserFormationsComponent implements OnInit {
  formations: any[] = [];
  userId?: number;

  constructor(private userService: UserService,private formationService: FormationService) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  // Load the formations of the logged-in user
  loadFormations(): void {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser?.id) {
      this.userService.getUserFormations(currentUser.id).subscribe(formations => {
        this.formations = formations;
      });
    }
  }

  getFormations(userId: number): void {
    this.userService.getUserFormations(userId).subscribe(
      (data) => {
        this.formations = data;  // Store the formations in the component
      },
      (error) => {
        console.error('Error fetching formations', error);
      }
    );
  }

    // Method to check if the formation is active
    isActive(formation: any): boolean {
      const currentDate = new Date();
      return new Date(formation.dateDebut) <= currentDate && currentDate <= new Date(formation.dateFin);
    }
  
    // Method to check if the current date is before the start date
    isBeforeStart(formation: any): boolean {
      const currentDate = new Date();
      return new Date(formation.dateDebut) > currentDate;
    }
  
    // Method to calculate remaining days before the start date
    getDaysRemaining(formation: any): number {
      const currentDate = new Date();
      const startDate = new Date(formation.dateDebut);
      const timeDifference = startDate.getTime() - currentDate.getTime();
      const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
      return daysRemaining;
    }

      // Handle unsubscribe action
  unsubscribe(formationId: number): void {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser?.id) {
      this.userService.removeFromFormation(currentUser.id, formationId).subscribe(
        response => {
          console.log('User successfully unsubscribed from formation', response);
          this.loadFormations();  // Reload the formations list
        },
        error => {
          console.error('Error unsubscribing from formation', error);
          alert('There was an issue unsubscribing from this formation.');
        }
      );
    }
  }
  



}
