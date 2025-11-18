import { Component } from '@angular/core';
import { CompanyService } from '../../../Default/services/companyinfo/company.service';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.css'
})
export class AdminSettingsComponent {
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
  
  companyId: number = 1; // You can set this dynamically based on your requirement

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    
    this.companyService.getCompanyInfo(this.companyId).subscribe((data: any[]) => {
      this.companyInfo = data;
    });
  
  }

  // Update company info
  updateCompanyInfo(): void {
    this.companyService.updateCompanyInfo(2, this.companyInfo).subscribe(
      response => {
        console.log('Company info updated', response);
        location.reload();

      },
      error => {
        console.error('Error updating company info', error);
      }
    );
  }

    // Mettre à jour les informations de contact
    updateCompanyContacts(): void {
      this.companyService.updateCompanyInfo(2, this.companyInfo).subscribe(
        response => {
          console.log('Informations mises à jour', response);
           // Rafraîchir les données après la mise à jour
           location.reload();
        },
        error => {
          console.error('Erreur lors de la mise à jour', error);
        }
      );
    }







}
