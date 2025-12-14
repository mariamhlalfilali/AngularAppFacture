import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService, Client, Produit, Facture } from '../../database/db.service';

@Component({
  selector: 'app-factures',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './factures.html'
})
export class FacturesComponent implements OnInit {

 
  date = new Date().toISOString().substring(0, 10);
  clientId!: number;
  produitId!: number;
  quantite = 1;

  clients: Client[] = [];
  produits: Produit[] = [];
  factures: Facture[] = [];

  factureEnModificationId?: number;

  
  message = '';
  messageType: 'success' | 'danger' | 'warning' = 'success';

  constructor(private db: DbService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.loadData();
  }

  
  async loadData() {
    this.clients = await this.db.getClients();
    this.produits = await this.db.getProduits();
    this.factures = await this.db.getFactures();
    this.cdr.detectChanges();
  }

  showMessage(msg: string, type: 'success' | 'danger' | 'warning' = 'success') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 4000); 
  }

  async enregistrerFacture() {
    if (!this.clientId || !this.produitId) {
      this.showMessage('Client et produit obligatoires', 'warning');
      return;
    }

    const produit = this.produits.find(p => p.id === Number(this.produitId));
    if (!produit) {
      this.showMessage('Produit introuvable', 'danger');
      return;
    }

    let stockDisponible = produit.quantite;
    if (this.factureEnModificationId) {
      const factureOriginale = this.factures.find(f => f.id === this.factureEnModificationId);
      if (factureOriginale) stockDisponible += factureOriginale.quantite;
    }

    if (this.quantite > stockDisponible) {
      this.showMessage(`Stock insuffisant ! Stock disponible : ${stockDisponible}`, 'warning');
      return;
    }

    if (this.factureEnModificationId) {
    
      await this.db.factures.update(this.factureEnModificationId, {
        clientId: Number(this.clientId),
        produitId: Number(this.produitId),
        quantite: this.quantite,
        date: this.date
      });

      await this.db.updateProduit(produit.id!, {
        quantite: stockDisponible - this.quantite
      });

      this.showMessage('Facture modifiée avec succès', 'success');
      this.factureEnModificationId = undefined;

    } else {
      
      await this.db.addFacture({
        clientId: Number(this.clientId),
        produitId: Number(this.produitId),
        quantite: this.quantite,
        date: this.date
      });

      await this.db.updateProduit(produit.id!, {
        quantite: produit.quantite - this.quantite
      });

      this.showMessage('Facture enregistrée avec succès', 'success');
    }

    await this.loadData();

   
    this.clientId = 0;
    this.produitId = 0;
    this.quantite = 1;
    this.date = new Date().toISOString().substring(0, 10);
  }

  chargerFacturePourModification(facture: Facture) {
    this.clientId = facture.clientId;
    this.produitId = facture.produitId;
    this.quantite = facture.quantite;
    this.date = facture.date;
    this.factureEnModificationId = facture.id;
  }

  async supprimerFacture(facture: Facture) {
    const produit = this.produits.find(p => p.id === facture.produitId);
    if (produit) {
      await this.db.updateProduit(produit.id!, {
        quantite: produit.quantite + facture.quantite
      });
    }

    await this.db.factures.delete(facture.id!);

    this.showMessage(`Facture  supprimée`, 'danger');

    await this.loadData();
  }

 
  getClientName(id: number | string): string {
    const numericId = Number(id);
    const client = this.clients.find(c => c.id === numericId);
    return client ? client.nom : 'Inconnu';
  }

  getProduitName(id: number | string): string {
    const numericId = Number(id);
    const produit = this.produits.find(p => p.id === numericId);
    return produit ? produit.nom : 'Inconnu';
  }

  getProduitPrix(id: number | string): number {
    const numericId = Number(id);
    const produit = this.produits.find(p => p.id === numericId);
    return produit ? produit.prix : 0;
  }

 
getPrixHT(facture: Facture): number {
  const prixUnitaire = this.getProduitPrix(facture.produitId);
  return +(prixUnitaire * facture.quantite).toFixed(2);
}


getTVA(facture: Facture): number {
  const ht = this.getPrixHT(facture);
  return +(ht * 0.2).toFixed(2);
}


getTotalTTC(facture: Facture): number {
  const ht = this.getPrixHT(facture);
  return +(ht * 1.2).toFixed(2);
}
}
