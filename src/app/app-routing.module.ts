import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Default/components/home/home.component';
import { ContactusComponent } from './Default/components/contactus/contactus.component';
import { SolutionsComponent } from './Default/components/solutions/solutions.component';
import { FormationsComponent } from './Default/components/formations/formations.component';
import { PaiementComponent } from './Default/components/paiement/paiement.component';
import { DashheaderComponent } from './admin/components/dashheader/dashheader.component';
import { AdminSolutionsComponent } from './admin/components/admin-solutions/admin-solutions.component';
import { AdminContactusComponent } from './admin/components/admin-contactus/admin-contactus.component';
import { AdminFormationsComponent } from './admin/components/admin-formations/admin-formations.component';
import { AdminPaiementsComponent } from './admin/components/admin-paiements/admin-paiements.component';
import { AdminSettingsComponent } from './admin/components/admin-settings/admin-settings.component';
import { AdminUsersComponent } from './admin/components/admin-users/admin-users.component';
import { UserFormationsComponent } from './Default/components/user-formations/user-formations.component';
import { UserSettingsComponent } from './Default/components/user-settings/user-settings.component';
import { AdminFournisseursComponent } from './admin/components/admin-fournisseurs/admin-fournisseurs.component';
import { AdminCategoriesComponent } from './admin/components/admin-categories/admin-categories.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'contact',component:ContactusComponent},
  {path:'solutions',component:SolutionsComponent},
  {path:'formations',component:FormationsComponent},
  {path:'paiement',component:PaiementComponent},
  {path:'admin_solution',component:AdminSolutionsComponent},
  {path:'admin_contactus',component:AdminContactusComponent},
  {path:'admin_formations',component:AdminFormationsComponent},
  {path:'admin_paiements',component:AdminPaiementsComponent},
  {path:'admin_settings',component:AdminSettingsComponent},
  {path:'admin_user',component:AdminUsersComponent},
  {path:'admin_fournisseurs',component:AdminFournisseursComponent},
  {path:'admin_categories',component:AdminCategoriesComponent},
  {path:'user_formations',component:UserFormationsComponent},
  {path:'user_settings',component:UserSettingsComponent},
  {path:'**',redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
