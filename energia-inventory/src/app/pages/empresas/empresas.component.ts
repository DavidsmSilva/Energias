import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="empresas-page">
      <div class="page-header">
        <h1>Gestión de Empresas</h1>
        <button class="btn-add" (click)="agregarEmpresa()">+ Nueva Empresa</button>
      </div>

      <div class="table-container">
        <table class="empresas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let empresa of empresasList" [class.active]="empresa.id === empresaService.getEmpresaId()">
              <td>{{ empresa.id }}</td>
              <td>
                <span class="empresa-icon">{{ getIcon(empresa.id) }}</span>
                {{ empresa.nombre }}
              </td>
              <td>
                <button class="btn-action" (click)="seleccionarEmpresa(empresa.id)">Seleccionar</button>
                <button class="btn-dots">⋮</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .empresas-page { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { color: #1B5E20; margin: 0; }
    .btn-add { background: #1B5E20; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; }
    .btn-add:hover { background: #2E7D32; }
    
    .table-container { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
    .empresas-table { width: 100%; border-collapse: collapse; }
    .empresas-table th { background: #f5f5f5; padding: 14px 16px; text-align: left; font-weight: 600; color: #333; border-bottom: 2px solid #e0e0e0; }
    .empresas-table td { padding: 14px 16px; border-bottom: 1px solid #eee; }
    .empresas-table tr:hover { background: #f9f9f9; }
    .empresas-table tr.active { background: #E8F5E9; }
    
    .empresa-icon { margin-right: 8px; }
    .btn-action { background: #1B5E20; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 8px; }
    .btn-action:hover { background: #2E7D32; }
    .btn-dots { background: none; border: none; cursor: pointer; font-size: 18px; padding: 4px 8px; }
  `]
})
export class EmpresasPageComponent {
  empresasList: { id: number; nombre: string }[] = [];

  /* 
  Código guardado para referencia futura (migrado desde app.component.html):
  
  <div class="empresa-item" *ngFor="let empresa of empresas" [class.active]="empresaSeleccionada === empresa.id">
    <span class="empresa-icon">{{ getIcono(empresa.id) }}</span>
    <span class="empresa-nombre">{{ empresa.nombre }}</span>
    <button class="menu-dots" (click)="toggleDropdown($event, empresa.id)">⋮</button>
    <div class="dropdown" *ngIf="dropdownAbierto === empresa.id" (click)="$event.stopPropagation()">
      <div class="dropdown-item" (click)="irAInventarioEmpresa(empresa.id)">📦 Inventario</div>
      <div class="dropdown-item" (click)="irAConsumoEmpresa(empresa.id)">⚡ Consumo</div>
    </div>
  </div>
  */

  constructor(public empresaService: EmpresaService) {
    const empresas = this.empresaService.getEmpresas();
    this.empresasList = Object.entries(empresas).map(([id, nombre]) => ({
      id: Number(id),
      nombre
    }));
  }

  getIcon(id: number): string {
    const icons: { [key: number]: string } = { 1: '🔥', 2: '⚡', 3: '🏭' };
    return icons[id] || '🏢';
  }

  seleccionarEmpresa(id: number): void {
    this.empresaService.setEmpresa(id);
  }

  agregarEmpresa(): void {
    alert('Funcionalidad de agregar empresa en desarrollo');
  }
}
