import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Default/components/home/home.component';
import { HeaderComponent } from './Default/components/header/header.component';
import { FooterComponent } from './Default/components/footer/footer.component';
import { ContactusComponent } from './Default/components/contactus/contactus.component';
import { SolutionsComponent } from './Default/components/solutions/solutions.component';
import { FormationsComponent } from './Default/components/formations/formations.component';
import { PaiementComponent } from './Default/components/paiement/paiement.component';
import { DashheaderComponent } from './admin/components/dashheader/dashheader.component';
import { AdminSolutionsComponent } from './admin/components/admin-solutions/admin-solutions.component';
import { AdminContactusComponent } from './admin/components/admin-contactus/admin-contactus.component';
import { AdminFormationsComponent } from './admin/components/admin-formations/admin-formations.component';
import { DatePipe } from '@angular/common';
import { AdminPaiementsComponent } from './admin/components/admin-paiements/admin-paiements.component';
import { AdminUsersComponent } from './admin/components/admin-users/admin-users.component';
import { AdminSettingsComponent } from './admin/components/admin-settings/admin-settings.component';
import { UserFormationsComponent } from './Default/components/user-formations/user-formations.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserSettingsComponent } from './Default/components/user-settings/user-settings.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ContactusComponent,
    SolutionsComponent,
    FormationsComponent,
    PaiementComponent,
    DashheaderComponent,
    AdminSolutionsComponent,
    AdminContactusComponent,
    AdminFormationsComponent,
    AdminPaiementsComponent,
    AdminUsersComponent,
    AdminSettingsComponent,
    UserFormationsComponent,
    UserSettingsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
  ],
  providers: [
    provideClientHydration(),
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
