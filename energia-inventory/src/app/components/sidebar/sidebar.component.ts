import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmpresaService } from '../../services/empresa.service';

interface Empresa {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="logo">
        <span class="logo-icon">🏢</span>
        <span class="logo-text">ENERGÍA</span>
      </div>
      
      <nav class="menu">
        <div class="menu-seccion">
          <div class="menu-titulo">Navegación</div>
          
          <div class="menu-grupo">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="menu-item" (click)="cerrarDropdowns()">
              🏠 Energia
            </a>
            <div class="submenu" *ngIf="empresas.length > 0">
              <div class="empresa-item" *ngFor="let emp of empresas; trackBy: trackByEmpresaId">
                <a class="menu-item submenu-item" [routerLink]="['/inventario', emp.id]" (click)="cerrarDropdowns()">
                  {{ getIcono(emp.id) }} {{ emp.nombre }}
                </a>
                <button class="menu-dots" (click)="toggleDropdownEnergia(emp.id, $event)">⋮</button>
                <div class="dropdown" *ngIf="dropdownEnergiaAbierto === emp.id" (click)="$event.stopPropagation()">
                  <div class="dropdown-header">⚡ Energía</div>
                  <div class="dropdown-item" [routerLink]="['/inventario', emp.id]" (click)="cerrarDropdowns()">📦 Inventario</div>
                  <div class="dropdown-item" [routerLink]="['/consumo', emp.id]" (click)="cerrarDropdowns()">⚡ Consumo</div>
                </div>
              </div>
            </div>
          </div>

          <div class="menu-grupo">
            <a routerLink="/agua" routerLinkActive="active" class="menu-item" (click)="cerrarDropdowns()">
              💧 Agua
            </a>
            <div class="submenu" *ngIf="empresas.length > 0">
              <div class="empresa-item" *ngFor="let emp of empresas; trackBy: trackByEmpresaId">
                <a class="menu-item submenu-item" [routerLink]="['/agua', emp.id]" (click)="cerrarDropdowns()">
                  {{ getIcono(emp.id) }} {{ emp.nombre }}
                </a>
                <button class="menu-dots" (click)="toggleDropdownAgua(emp.id, $event)">⋮</button>
                <div class="dropdown" *ngIf="dropdownAguaAbierto === emp.id" (click)="$event.stopPropagation()">
                  <div class="dropdown-header">💧 Agua</div>
                  <div class="dropdown-item" [routerLink]="['/agua', emp.id]" (click)="cerrarDropdowns()">💧 Fuentes de Agua</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="menu-seccion">
          <div class="menu-titulo">Sistema</div>
          <a routerLink="/ajustes" routerLinkActive="active" class="menu-item">⚙️ Ajustes</a>
        </div>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar { width: 220px; min-height: 100vh; background: #1B5E20; padding: 20px; display: flex; flex-direction: column; position: fixed; left: 0; top: 0; z-index: 1000; box-sizing: border-box; }
    .logo { display: flex; align-items: center; gap: 8px; padding: 8px 0 12px; border-bottom: 1px solid rgba(255,255,255,0.2); box-sizing: border-box; }
    .logo-icon { font-size: 22px; }
    .logo-text { color: white; font-weight: bold; font-size: 18px; flex: 1; }
    .menu { margin-top: 20px; display: flex; flex-direction: column; gap: 20px; }
    .menu-seccion { display: flex; flex-direction: column; gap: 4px; }
    .menu-titulo { color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; margin-bottom: 4px; padding-left: 12px; }
    .menu-item { color: rgba(255,255,255,0.9); text-decoration: none; padding: 10px 12px; border-radius: 6px; display: block; cursor: pointer; transition: all 0.2s; }
    .menu-item:hover { background: rgba(255,255,255,0.1); }
    .menu-item.active { background: rgba(255,255,255,0.2); }
    
    .menu-grupo { margin-bottom: 8px; }
    .submenu { margin-left: 8px; display: flex; flex-direction: column; gap: 2px; }
    .empresa-item { position: relative; display: flex; align-items: center; }
    .submenu-item { padding: 8px 12px; font-size: 14px; }
    .menu-dots { background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer; padding: 4px 8px; font-size: 14px; }
    .menu-dots:hover { color: white; }
    
    .dropdown { position: absolute; left: 100%; top: 0; background: #fff; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); min-width: 160px; z-index: 1001; margin-left: 4px; }
    .dropdown-header { padding: 8px 14px 4px; font-size: 11px; font-weight: 600; color: #999; text-transform: uppercase; border-bottom: 1px solid #eee; }
    .dropdown-item { padding: 10px 14px; color: #333; font-size: 14px; cursor: pointer; }
    .dropdown-item:hover { background: #f5f5f5; }
    
    @media (max-width: 768px) {
      .sidebar { width: 60px; padding: 15px 10px; }
      .logo { justify-content: center; }
      .logo-text { display: none; }
      .menu-seccion { align-items: center; }
      .menu-titulo { display: none; }
      .menu-item { padding: 12px; justify-content: center; }
      .menu-item span { display: none; }
      .submenu { display: none; }
      .menu-dots { display: none; }
    }
  `]
})
export class SidebarComponent implements OnInit {
  empresas: Empresa[] = [];
  dropdownEnergiaAbierto: number | null = null;
  dropdownAguaAbierto: number | null = null;

  constructor(
    private router: Router,
    private empresaService: EmpresaService
  ) {}

  ngOnInit() {
    this.empresaService.empresas$.subscribe(empresas => {
      this.empresas = Object.entries(empresas).map(([id, nombre]) => ({
        id: Number(id),
        nombre: nombre
      }));
    });
  }

  toggleDropdownEnergia(empresaId: number, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.dropdownEnergiaAbierto = this.dropdownEnergiaAbierto === empresaId ? null : empresaId;
    this.dropdownAguaAbierto = null;
  }

  toggleDropdownAgua(empresaId: number, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.dropdownAguaAbierto = this.dropdownAguaAbierto === empresaId ? null : empresaId;
    this.dropdownEnergiaAbierto = null;
  }

  cerrarDropdowns() {
    this.dropdownEnergiaAbierto = null;
    this.dropdownAguaAbierto = null;
  }

  getIcono(id: number): string {
    const iconos = ['🔥', '⚡', '🏭', '💡', '🌿', '⚙️'];
    return iconos[(id - 1) % iconos.length];
  }

  trackByEmpresaId(index: number, item: Empresa): number {
    return item.id;
  }
}
