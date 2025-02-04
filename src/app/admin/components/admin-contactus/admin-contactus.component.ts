import { Component,OnInit } from '@angular/core';
import { AvisService } from '../../../Default/services/contactservice/avis.service';

@Component({
  selector: 'app-admin-contactus',
  templateUrl: './admin-contactus.component.html',
  styleUrl: './admin-contactus.component.css'
})
export class AdminContactusComponent  implements OnInit{
  avis: any[] = [];
  constructor(private avisService: AvisService) {}
  ngOnInit(): void {
    this.avisService.getAvis().subscribe((data: any[]) => {
      this.avis = data;
    });
  }
  deleteAvis(id: number): void {
      this.avisService.deleteAvis(id).subscribe(
        () => {
          this.avis = this.avis.filter(avis => avis.id !== id);
        },
        error => {
          console.error('Error deleting solution:', error);
        }
      );
  }
  markAsRead(id: number): void {
    this.avisService.updateStatus(id).subscribe(
      (updatedAvis) => {
        const avisIndex = this.avis.findIndex(av => av.id === id);
        if (avisIndex !== -1) {
          this.avis[avisIndex].status = updatedAvis.status; // Update status locally
        }
      },
      error => {
        console.error('Error updating status:', error);
      }
    );
  }

  deleteAllAvis(): void {
    if (confirm('Are you sure you want to delete all avis?')) {
      this.avisService.deleteAllAvis().subscribe(() => {
        this.avis = []; // Clear the local array after deletion
      });
    }
  }

  markAllAsRead(): void {
    if (confirm('Are you sure you want to mark all as read?')) {
      this.avisService.markAllAsRead().subscribe(
        () => {
          // Update all avis' statuses locally
          this.avis.forEach(avis => avis.status = 1);
        },
        error => {
          console.error('Error marking all as read:', error);
        }
      );
    }
  }
  

  







}
