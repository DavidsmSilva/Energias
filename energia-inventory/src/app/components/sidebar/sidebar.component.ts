import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="menu-item">🏠 Energia</a>
        </div>
        
        <div class="menu-seccion">
          <div class="menu-titulo">Gestión</div>
          
          <a routerLink="/inventario" routerLinkActive="active" class="menu-item">📦 Inventario</a>
          <a routerLink="/consumo" routerLinkActive="active" class="menu-item">⚡ Consumo</a>
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
    
    @media (max-width: 768px) {
      .sidebar { width: 60px; padding: 15px 10px; }
      .logo { justify-content: center; }
      .logo-text { display: none; }
      .menu-seccion { align-items: center; }
      .menu-titulo { display: none; }
      .menu-item { padding: 12px; justify-content: center; }
      .menu-item span { display: none; }
    }
  `]
})
export class SidebarComponent {
  constructor(private router: Router) {}
}
