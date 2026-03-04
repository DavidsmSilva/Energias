import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inicio-container">
      <div class="bienvenida">
        <h2>Bienvenido</h2>
        <p>Seleccione una opción del menú para comenzar</p>
      </div>
    </div>
  `,
  styles: [`
    .inicio-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 100px);
      padding: 20px;
    }
    .bienvenida {
      text-align: center;
      color: #666;
    }
    .bienvenida h2 {
      margin: 0 0 8px;
      font-size: 24px;
    }
    .bienvenida p {
      margin: 0;
      font-size: 16px;
    }
  `]
})
export class InicioComponent {}
