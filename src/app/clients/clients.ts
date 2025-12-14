import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DbService, Client } from '../../database/db.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './clients.html'
})
export class ClientsComponent implements OnInit {

  nom = '';
  email = '';
  clients: Client[] = [];
  editingId: number | null = null;
  message: string = ''; 

  constructor(
    private db: DbService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  async loadClients() {
    this.clients = await this.db.getClients();
    this.cdr.detectChanges();
  }

  async saveClient() {
    
    if (!this.nom || !this.email) {
      this.message = 'Le nom et l’email sont requis.';
      return;
    }

   
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(this.email)) {
      this.message = 'L’email doit se terminer par @gmail.com';
      return;
    }

    this.message = ''; 

    if (this.editingId === null) {
      await this.db.addClient({ nom: this.nom, email: this.email });
    } else {
      await this.db.updateClient(this.editingId, {
        nom: this.nom,
        email: this.email
      });
    }

    this.resetForm();
    await this.loadClients();
  }

  editClient(client: Client) {
    this.editingId = client.id!;
    this.nom = client.nom;
    this.email = client.email;
    this.message = '';
  }

  async deleteClient(id?: number) {
    if (id) {
      await this.db.deleteClient(id);
      await this.loadClients();
    }
  }

  resetForm() {
    this.nom = '';
    this.email = '';
    this.editingId = null;
    this.message = '';
  }
}
