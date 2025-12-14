import { Routes } from '@angular/router';
import { ClientsComponent } from './clients/clients';
import { FacturesComponent } from './factures/factures';
import { ProduitsComponent } from './produits/produits';

export const routes: Routes = [
   { path: 'factures', component: FacturesComponent },
  { path: 'clients', component: ClientsComponent },
   { path: 'produits', component: ProduitsComponent },
  { path: '', redirectTo: '/factures', pathMatch: 'full' } 
];
