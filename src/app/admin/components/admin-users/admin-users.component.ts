import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../Default/services/userservices/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
      console.log('Loaded users:', this.users);
    });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          // Remove the deleted user from the list instantly
          this.users = this.users.filter(user => user.id !== id);
          console.log('Updated users list:', this.users);

          // Explicitly trigger change detection to update the view
          this.cdr.detectChanges();
        },
        error => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  deleteAllUsers(): void {
    if (confirm('Are you sure you want to delete all users?')) {
      this.userService.deleteAllUsers().subscribe(
        () => {
          // Clear the user list instantly after deletion
          this.users = [];
          console.log('All users deleted');
          
          // Explicitly trigger change detection to update the view
          this.cdr.detectChanges();
        },
        error => {
          console.error('Error deleting all users:', error);
        }
      );
    }
  }
}
