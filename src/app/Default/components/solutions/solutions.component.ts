import { Component,OnInit } from '@angular/core';
import { SolutionService } from '../../services/solutionservices/solution.service';
import { UserService } from '../../services/userservices/user.service';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrl: './solutions.component.css'
})
export class SolutionsComponent implements OnInit{
  solutions: any[] = [];

  constructor(private solutionService: SolutionService,private userService: UserService) {}

  ngOnInit(): void {
    this.solutionService.getSolutions().subscribe((data: any[]) => {
      this.solutions = data;
    });
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

    // API call to add solution to cart
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
