import { Component,OnInit } from '@angular/core';
import { ContactService } from '../../services/conactservice/contact.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.css'
})

export class ContactusComponent implements OnInit {

  contactForm!: FormGroup;
  successMessage: string | null = null; 
  

  constructor(private fb: FormBuilder, private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.contactService.sendMessage(this.contactForm.value).subscribe(
        (response) => {
          this.successMessage = 'Message sent successfully!';
          console.log(response);
          this.contactForm.reset();

          // Hide the success message after 5 seconds
          setTimeout(() => {
            this.successMessage = null;
          }, 5000); // 5000 milliseconds = 5 seconds
        },
        (error) => {
          console.error('Error sending message:', error);
        }
      );
    } else {
      console.log('Form is invalid!');
    }
  }
  

}
