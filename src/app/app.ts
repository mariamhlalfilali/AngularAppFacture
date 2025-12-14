import { Component, signal } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ClientsComponent } from './clients/clients';
import { routes } from './app.routes'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,            
    ClientsComponent,
    RouterLink           
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('facture-app');
}
