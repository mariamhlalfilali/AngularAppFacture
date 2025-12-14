import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DbService, Produit } from '../../database/db.service';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './produits.html'
})
export class ProduitsComponent implements OnInit {

  nom = '';
  prix: number | null = null;
  quantite: number | null = null;

  produits: Produit[] = [];
  editingId: number | null = null;

  constructor(
    private db: DbService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  async loadProduits() {
    this.produits = await this.db.getProduits();
    this.cdr.detectChanges(); 
  }

  async saveProduit() {
    if (!this.nom || this.prix === null || this.quantite === null) return;

    if (this.editingId === null) {
      await this.db.addProduit({
        nom: this.nom,
        prix: this.prix,
        quantite: this.quantite
      });
    } else {
      await this.db.updateProduit(this.editingId, {
        nom: this.nom,
        prix: this.prix,
        quantite: this.quantite
      });
    }

    this.resetForm();
    await this.loadProduits();
  }

  editProduit(produit: Produit) {
    this.editingId = produit.id!;
    this.nom = produit.nom;
    this.prix = produit.prix;
    this.quantite = produit.quantite;
  }

  async deleteProduit(id?: number) {
    if (id) {
      await this.db.deleteProduit(id);
      await this.loadProduits();
    }
  }

  resetForm() {
    this.nom = '';
    this.prix = null;
    this.quantite = null;
    this.editingId = null;
  }
}
