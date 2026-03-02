import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SlidesDialogComponent } from '../shared/slides-dialog/slides-dialog.component';
import { Empresa } from '../models/empresa.model';

@Component({
  selector: 'app-empresa-list',
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.css']
})
export class EmpresaListComponent implements OnInit {
  empresas: Empresa[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.empresas = [
      { id: '1', nombre: 'Acme Technologies S.A.' },
      { id: '2', nombre: 'NovaCorp Ltda.' },
      { id: '3', nombre: 'Soluciones Globales' }
    ];
  }

  openSlides(company: Empresa): void {
    this.dialog.open(SlidesDialogComponent, { data: { company } });
  }
}
