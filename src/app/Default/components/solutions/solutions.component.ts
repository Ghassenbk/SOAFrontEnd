import { Component, OnInit } from '@angular/core';
import { SolutionService } from '../../services/solutionservices/solution.service';
import { UserService } from '../../services/userservices/user.service';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.css']
})
export class SolutionsComponent implements OnInit {
  solutions: any[] = [];
  filteredSolutions: any[] = [];
  mot: string = '';

  constructor(private solutionService: SolutionService, private userService: UserService) {}

  ngOnInit(): void {
    this.solutionService.getSolutions().subscribe((data: any[]) => {
      console.log('Solutions loaded:', data); // Debugging
      this.solutions = data;
      this.filteredSolutions = data;  // Initially, display all solutions
    });
  }

  applyFilter(): void {
    if (this.mot.trim() === '') {
      this.filteredSolutions = [...this.solutions];  // Show all solutions if the search term is empty
    } else {
      this.filteredSolutions = this.solutions.filter(solution =>
        solution.name.toLowerCase().includes(this.mot.toLowerCase())
      );
    }
  }

  addToCart(solutionId: number): void {
    const currentUser = this.userService.getUserFromLocalStorage();

    if (!currentUser) {
      alert('Please log in to add items to your cart.');
      return;
    }

    if (currentUser.role === 'ADMIN') {
      alert("You can't add solutions to your cart because you're an ADMIN.");
      return;
    }

    this.userService.addSolutionToCart(currentUser.id, solutionId).subscribe(
      () => {
        alert('Solution added to your cart successfully!');
      },
      (error) => {
        console.error(error);
        alert('Error adding the solution to your cart.');
      }
    );
  }
}
