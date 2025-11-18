import { Component,OnInit } from '@angular/core';
import { ContactService } from '../../services/conactservice/contact.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../Default/services/companyinfo/company.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.css'
})

export class ContactusComponent implements OnInit {

  contactForm!: FormGroup;
  successMessage: string | null = null; 
  companyInfo: any = {
    name: '',
    address: '',
    gmaps: '',
    phone: '',
    email: '',
    facebookurl: '',
    instagramurl: '',
    twitterurl: '',
    iframe: ''
  };
  companyId: number = 2; // You can set this dynamically based on your requirement


  constructor(private fb: FormBuilder, private contactService: ContactService,private companyService: CompanyService) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', [Validators.required]],
    });
    this.companyService.getCompanyInfo(this.companyId).subscribe((data: any[]) => {
      this.companyInfo = data;
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
