import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

// Interfaces
export interface Client { id?: number; nom: string; email: string; }
export interface Produit { id?: number; nom: string; prix: number; quantite: number; }
export interface Facture { id?: number; date: string; clientId: number; produitId: number; quantite: number; }


@Injectable({ providedIn: 'root' })
export class DbService extends Dexie {

  clients!: Table<Client, number>;
  produits!: Table<Produit, number>;
  factures!: Table<Facture, number>;

  constructor() {
    super('FactureDB');

    this.version(1).stores({
      clients: '++id, nom, email',
      produits: '++id, nom, prix, quantite',
      factures: '++id, clientId, produitId, date'
    });

    this.clients = this.table('clients');
    this.produits = this.table('produits');
    this.factures = this.table('factures');
  }

  // Clients
  addClient(client: Client) { return this.clients.add(client); }
  getClients() { return this.clients.toArray(); }
  updateClient(id: number, changes: Partial<Client>) { return this.clients.update(id, changes); }
  deleteClient(id: number) { return this.clients.delete(id); }

  // Produits
  addProduit(produit: Produit) { return this.produits.add(produit); }
  getProduits() { return this.produits.toArray(); }
  updateProduit(id: number, changes: Partial<Produit>) { return this.produits.update(id, changes); }
  deleteProduit(id: number) { return this.produits.delete(id); }


  // ✅ AJOUT IMPORTANT (lecture fiable du stock)
  getProduitById(id: number) {
    return this.produits.get(id);
  }
  // Factures
 addFacture(facture: Facture) { return this.factures.add(facture); }
  getFactures() { return this.factures.toArray(); }

  


}
