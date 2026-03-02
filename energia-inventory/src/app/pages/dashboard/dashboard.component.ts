import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DatosService, RegistroInventario, RegistroConsumo } from '../../services/datos.service';
import { EmpresaService } from '../../services/empresa.service';

interface Empresa {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="header-botones">
        <button class="btn-empresas" routerLink="/empresas">🏢 Empresas</button>
      </div>
      <div class="contenido-panel">
        <div class="resumen-todas">
          <h2>Resumen de {{ empresaFiltro ? empresaFiltro.nombre : 'Todas las Empresas' }}</h2>
          
          <button *ngIf="empresaFiltro" class="btn-volver" (click)="empresaFiltro = null">← Ver todas las empresas</button>
          
          <div class="resumen-grid" *ngIf="!empresaFiltro">
            <div class="resumen-empresa" *ngFor="let emp of empresasResumen">
              <div class="empresa-card" (click)="seleccionarEmpresaFiltro(emp)">
                <div class="empresa-card-header">
                  <span class="empresa-icon">{{ getIcono(emp.id) }}</span>
                  <h3>{{ emp.nombre }}</h3>
                </div>
                <div class="empresa-card-body">
                  <div class="stat">
                    <span class="stat-label">📦 Inventario</span>
                    <span class="stat-value">{{ emp.registrosInv }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">⚡ Consumo</span>
                    <span class="stat-value">{{ emp.registrosCons }}</span>
                  </div>
                  <div class="stat total">
                    <span class="stat-label">Total</span>
                    <span class="stat-value">{{ emp.registrosInv + emp.registrosCons }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="detalle-empresa" *ngIf="empresaFiltro">
            <div class="tabs">
              <button class="tab" [class.active]="tabActiva === 'inventario'" (click)="tabActiva = 'inventario'">📦 Inventario</button>
              <button class="tab" [class.active]="tabActiva === 'consumo'" (click)="tabActiva = 'consumo'">⚡ Consumo</button>
            </div>

            <div class="tabla-container" *ngIf="tabActiva === 'inventario'">
              <div class="filter-tipo">
                <label>Filtrar por tipo:</label>
                <select [(ngModel)]="filtroTipoInventario" (change)="filtroTipoInventario = filtroTipoInventario">
                  <option value="">Todos</option>
                  <option value="electrica">Energía eléctrica del servicio público</option>
                  <option value="renovable">Energías renovables</option>
                  <option value="combustibles">Energía a partir de combustibles</option>
                  <option value="biomasa_electrica">Biomasa para energía eléctrica</option>
                  <option value="biomasa_calor">Biomasa para generar calor</option>
                </select>
              </div>
              <table class="tabla-datos">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let reg of getInventarioEmpresaFiltrado()" (click)="abrirDetalleInventario(reg)" class="fila-clickable">
                    <td>{{ getNombreTipoInventario(reg.tipoEnergia) }}</td>
                    <td>{{ reg.mes }} / {{ reg.ano }}</td>
                  </tr>
                  <tr *ngIf="getInventarioEmpresaFiltrado().length === 0">
                    <td colspan="2" class="sin-datos">Sin registros</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="tabla-container tabla-consumo" *ngIf="tabActiva === 'consumo'">
              <div class="filter-tipo">
                <label>Filtrar por tipo:</label>
                <select [(ngModel)]="filtroTipoConsumo" (change)="filtroTipoConsumo = filtroTipoConsumo">
                  <option value="">Todos</option>
                  <option value="gas_electrica">Gas para energía eléctrica</option>
                  <option value="gas_calor">Gas para generar calor</option>
                  <option value="vendida">Energía Vendida</option>
                  <option value="recibida">Energía Recibida</option>
                  <option value="cedida">Energía Cedida</option>
                </select>
              </div>
              <table class="tabla-datos">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let reg of getConsumoEmpresaFiltrado()" (click)="abrirDetalleConsumo(reg)" class="fila-clickable">
                    <td>{{ getNombreTipoConsumo(reg.tipoEnergia) }}</td>
                    <td>{{ reg.mes }} / {{ reg.ano }}</td>
                  </tr>
                  <tr *ngIf="getConsumoEmpresaFiltrado().length === 0">
                    <td colspan="2" class="sin-datos">Sin registros</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Modal de Detalle -->
          <div class="modal-overlay" *ngIf="mostrarModal" (click)="cerrarModal()">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h2>{{ tipoDetalle === 'inventario' ? 'Inventario' : 'Consumo' }}</h2>
                <button class="modal-close" (click)="cerrarModal()">×</button>
              </div>
              <div class="modal-body">
                <!-- Inventario -->
                <div class="detalle-grid" *ngIf="tipoDetalle === 'inventario' && registroDetalle">
                  <div class="detalle-item"><strong>Tipo:</strong> {{ getNombreTipoInventario(registroDetalle.tipoEnergia) }}</div>
                  <div class="detalle-item"><strong>Fecha:</strong> {{ registroDetalle.mes }} / {{ registroDetalle.ano }}</div>
                  
                  <!-- Energía eléctrica -->
                  <ng-container *ngIf="registroDetalle.tipoEnergia === 'electrica'">
                    <div class="detalle-item" *ngIf="registroDetalle.cantidad"><strong>Cantidad:</strong> {{ registroDetalle.cantidad }}</div>
                    <div class="detalle-item" *ngIf="registroDetalle.numeroMeses"><strong>N° Meses:</strong> {{ registroDetalle.numeroMeses }}</div>
                    <div class="detalle-item" *ngIf="registroDetalle.costo"><strong>Costo:</strong> {{ '$' + registroDetalle.costo }}</div>
                  </ng-container>
                  
                  <!-- Renovables -->
                  <ng-container *ngIf="registroDetalle.tipoEnergia === 'renovable'">
                    <div class="detalle-item" *ngIf="registroDetalle.cantidad"><strong>Cantidad:</strong> {{ registroDetalle.cantidad }}</div>
                    <div class="detalle-item" *ngIf="registroDetalle.numeroMeses"><strong>N° Meses:</strong> {{ registroDetalle.numeroMeses }}</div>
                    <div class="detalle-item" *ngIf="registroDetalle.tipoFuente"><strong>Tipo de Fuente:</strong> {{ registroDetalle.tipoFuente }}</div>
                  </ng-container>
                  
                  <!-- Combustibles -->
                  <ng-container *ngIf="registroDetalle.tipoEnergia === 'combustibles'">
                    <div class="detalle-item" *ngIf="registroDetalle.cantidad"><strong>Cantidad:</strong> {{ registroDetalle.cantidad }}</div>
                    <div class="detalle-item" *ngIf="registroDetalle.tipoCombustible"><strong>Tipo de Combustible:</strong> {{ registroDetalle.tipoCombustible }}</div>
                    <div class="detalle-item" *ngIf="registroDetalle.cantidadCombustible"><strong>Cantidad de Combustible:</strong> {{ registroDetalle.cantidadCombustible }}</div>
                    <div class="detalle-item" *ngIf="registroDetalle.poderCalorifico"><strong>Poder Calorífico:</strong> {{ registroDetalle.poderCalorifico }}</div>
                  </ng-container>
                  
                  <!-- Biomasa eléctrica -->
                  <ng-container *ngIf="registroDetalle.tipoEnergia === 'biomasa_electrica'">
                    <div class="detalle-item" *ngIf="registroDetalle.cantidad"><strong>Cantidad:</strong> {{ registroDetalle.cantidad }}</div>
                    <div class="detalle-item" *ngIf="registroDetalle.tipoBiomasa"><strong>Tipo de Biomasa:</strong> {{ registroDetalle.tipoBiomasa }}</div>
                    <div class="detalle-item" *ngIf="registroDetalle.poderCalorifico"><strong>Poder Calorífico:</strong> {{ registroDetalle.poderCalorifico }}</div>
                  </ng-container>
                  
                  <!-- Biomasa calor -->
                  <ng-container *ngIf="registroDetalle.tipoEnergia === 'biomasa_calor'">
                    <div class="detalle-item" *ngIf="registroDetalle.cantidad"><strong>Cantidad:</strong> {{ registroDetalle.cantidad }}</div>
                    <div class="detalle-item" *ngIf="registroDetalle.tipoBiomasa"><strong>Tipo de Biomasa:</strong> {{ registroDetalle.tipoBiomasa }}</div>
                  </ng-container>
                </div>
                
                <!-- Consumo -->
                <div class="detalle-grid" *ngIf="tipoDetalle === 'consumo' && registroDetalle">
                  <div class="detalle-item"><strong>Tipo:</strong> {{ getNombreTipoConsumo(registroDetalle.tipoEnergia) }}</div>
                  <div class="detalle-item"><strong>Fecha:</strong> {{ registroDetalle.mes }} / {{ registroDetalle.ano }}</div>
                  
                  <!-- Gas eléctrica -->
                  <ng-container *ngIf="registroDetalle.tipoEnergia === 'gas_electrica'">
                    <div class="detalle-item" *ngIf="registroDetalle.tipoGas"><strong>Tipo de Gas:</strong> {{ registroDetalle.tipoGas }}</div>
                    <div class="detalle-item" *ngIf="registroDetalle.cantidadGas"><strong>Cantidad de Gas:</strong> {{ registroDetalle.cantidadGas }}</div>
                    <div class="detalle-item" *ngIf="registroDetalle.poderCalorifico"><strong>Poder Calorífico:</strong> {{ registroDetalle.poderCalorifico }} kJ/unidad</div>
                    <div class="detalle-item" *ngIf="registroDetalle.unidadKwh"><strong>Unidad KWh:</strong> {{ registroDetalle.unidadKwh }}</div>
                  </ng-container>
                  
                  <!-- Gas calor -->
                  <ng-container *ngIf="registroDetalle.tipoEnergia === 'gas_calor'">
                    <div class="detalle-item" *ngIf="registroDetalle.tipoGas"><strong>Tipo de Gas:</strong> {{ registroDetalle.tipoGas }}</div>
                    <div class="detalle-item" *ngIf="registroDetalle.cantidadGas"><strong>Cantidad de Gas:</strong> {{ registroDetalle.cantidadGas }}</div>
                  </ng-container>
                  
                  <!-- Energía Vendida -->
                  <ng-container *ngIf="registroDetalle.tipoEnergia === 'vendida'">
                    <div class="detalle-item" *ngIf="registroDetalle.cantidad"><strong>Cantidad:</strong> {{ registroDetalle.cantidad }} kWh</div>
                  </ng-container>
                  
                  <!-- Energía Recibida -->
                  <ng-container *ngIf="registroDetalle.tipoEnergia === 'recibida'">
                    <div class="detalle-item" *ngIf="registroDetalle.cantidad"><strong>Cantidad:</strong> {{ registroDetalle.cantidad }} kWh</div>
                  </ng-container>
                  
                  <!-- Energía Cedida -->
                  <ng-container *ngIf="registroDetalle.tipoEnergia === 'cedida'">
                    <div class="detalle-item" *ngIf="registroDetalle.cantidad"><strong>Cantidad:</strong> {{ registroDetalle.cantidad }} kWh</div>
                  </ng-container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { display: flex; flex-direction: column; min-height: calc(100vh - 60px); }
    .header-botones { display: flex; justify-content: flex-end; padding: 16px 24px 0; }
    .btn-empresas { background: #1B5E20; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; }
    .btn-empresas:hover { background: #2E7D32; }
    
    .empresas-panel {
      width: 280px;
      background: #1B5E20;
      padding: 20px;
      box-sizing: border-box;
    }
    
    .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .panel-header h2 { color: white; margin: 0; font-size: 18px; }
    .btn-add { background: rgba(255,255,255,0.2); border: none; color: white; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-size: 18px; }
    .btn-add:hover { background: rgba(255,255,255,0.3); }
    
    .form-crear { background: white; border-radius: 8px; padding: 12px; margin-bottom: 16px; }
    .form-crear input { width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px; box-sizing: border-box; }
    .form-botones { display: flex; gap: 8px; }
    .btn-crear { flex: 1; background: #4CAF50; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 13px; }
    .btn-cancelar { flex: 1; background: #ddd; color: #333; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 13px; }
    
    .empresas-list { display: flex; flex-direction: column; gap: 4px; cursor: default; }
    .empresa-item { display: flex; align-items: center; padding: 12px; color: white; border-radius: 6px; cursor: pointer; transition: all 0.2s; position: relative; }
    .empresa-item:hover { background: rgba(255,255,255,0.1); }
    .empresa-item.active { background: rgba(255,255,255,0.2); }
    .empresa-info-click { display: flex; align-items: center; gap: 10px; flex: 1; }
    .empresa-icon { font-size: 20px; }
    .menu-dots { background: none; border: none; color: white; cursor: pointer; font-size: 20px; padding: 2px 8px; border-radius: 4px; font-weight: bold; }
    .menu-dots:hover { background: rgba(255,255,255,0.2); }
    .dropdown { position: absolute; right: 8px; top: 100%; background: #fff; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); min-width: 150px; z-index: 1000; display: block; }
    .dropdown-item { padding: 10px 14px; color: #333; font-size: 14px; cursor: pointer; }
    .dropdown-item:hover { background: #f5f5f5; }
    
    .contenido-panel { flex: 1; padding: 20px; background: #f5f5f5; }
    
    .resumen-todas { }
    .resumen-todas h2 { margin: 0 0 20px; color: #333; font-size: 20px; }
    .btn-volver { background: #1B5E20; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; margin-bottom: 20px; }
    .btn-volver:hover { background: #145214; }
    .detalle-empresa { margin-top: 30px; }
    .resumen-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .resumen-empresa { }
    .empresa-card { background: white; border-radius: 8px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); cursor: pointer; transition: all 0.2s; }
    .empresa-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
    .empresa-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .empresa-card-header .empresa-icon { font-size: 24px; }
    .empresa-card-header h3 { margin: 0; font-size: 16px; color: #333; }
    .empresa-card-body { display: flex; flex-direction: column; gap: 8px; }
    .stat { display: flex; justify-content: space-between; align-items: center; }
    .stat-label { font-size: 13px; color: #666; }
    .stat-value { font-size: 14px; font-weight: 600; color: #333; }
    .stat.total { border-top: 1px solid #eee; padding-top: 8px; margin-top: 4px; }
    .stat.total .stat-value { color: #4CAF50; }
    
    .tabs { display: flex; gap: 8px; margin-bottom: 16px; }
    .tab { padding: 10px 20px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.2s; }
    .tab:hover { background: #f5f5f5; }
    .tab.active { background: #4CAF50; color: white; border-color: #4CAF50; }
    
    .tabla-container { background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow-x: auto; margin-bottom: 20px; }
    .tabla-datos { width: 100%; border-collapse: collapse; font-size: 13px; }
    .tabla-datos th { background: #4CAF50; color: white; padding: 12px; text-align: left; font-weight: 600; white-space: nowrap; }
    .tabla-consumo .tabla-datos th { background: #2196F3; }
    .tabla-consumo .empresa-separator td { border-top-color: #2196F3; }
    .tabla-consumo .tab .active { background: #2196F3; border-color: #2196F3; }
    .tabla-datos td { padding: 10px 12px; border-bottom: 1px solid #eee; color: #333; }
    .tabla-datos tr:hover { background: #f9f9f9; }
    .empresa-cell { font-weight: 600; background: #f5f5f5; }
    .empresa-separator td { border-top: 3px solid #1B5E20; }
    .sin-datos { text-align: center; color: #999; padding: 20px; }
    
    .empresa-seleccionada { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .empresa-header { display: flex; align-items: center; gap: 16px; }
    .empresa-icon-grande { font-size: 48px; }
    .empresa-info { flex: 1; }
    .empresa-info h2 { margin: 0 0 4px; color: #333; }
    .empresa-info p { margin: 0; color: #666; font-size: 14px; }
    .empresa-acciones { display: flex; gap: 10px; }
    .btn-accion { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; }
    .btn-inventario { background: #4CAF50; color: white; }
    .btn-consumo { background: #2196F3; color: white; }
    
    .resumen-panel { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .resumen-panel h3 { margin: 0 0 16px; color: #333; }
    
    .tabla-resumen { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .tabla-resumen th, .tabla-resumen td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    .tabla-resumen th { background: #f9f9f9; color: #666; font-size: 14px; }
    .total-row { font-weight: 700; color: #4CAF50; }
    .total-row td { border-top: 2px solid #4CAF50; }
    
    .tabs { display: flex; gap: 8px; margin-bottom: 12px; }
    .tab { padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; }
    .tab.active { background: #4CAF50; color: white; border-color: #4CAF50; }
    
    .registros-lista { display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto; }
    .registro-card { background: #f5f5f5; padding: 12px; border-radius: 6px; border-left: 3px solid #4CAF50; }
    .reg-tipo { font-weight: 600; color: #4CAF50; margin-bottom: 8px; font-size: 13px; }
    .reg-datos { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: #666; }
    .reg-datos span { display: flex; gap: 4px; }
    .reg-datos strong { color: #333; min-width: 140px; }
    
    .bienvenida { text-align: center; padding: 60px; color: #999; }
    .bienvenida h2 { margin: 0 0 8px; color: #666; }
    .bienvenida p { margin: 0; }
    
    @media (max-width: 1024px) {
      .empresas-panel { width: 240px; }
      .empresa-header { flex-wrap: wrap; }
      .empresa-acciones { width: 100%; margin-top: 12px; }
      .empresa-acciones .btn-accion { flex: 1; }
    }
    
    @media (max-width: 768px) {
      .dashboard { flex-direction: column; }
      .empresas-panel { width: 100%; padding: 15px; }
      .empresas-list { flex-direction: row; flex-wrap: wrap; gap: 8px; }
      .empresa-item { flex: 1 1 calc(50% - 4px); min-width: 140px; }
      .dropdown { right: 0; }
      .contenido-panel { padding: 15px; }
      .empresa-seleccionada { padding: 15px; }
      .empresa-header { flex-direction: column; text-align: center; }
      .empresa-acciones { width: 100%; }
      .empresa-acciones .btn-accion { padding: 8px 12px; font-size: 13px; }
      .tabla-resumen { font-size: 13px; }
      .tabla-resumen th, .tabla-resumen td { padding: 8px; }
    }
    
    @media (max-width: 480px) {
      .empresa-item { flex: 1 1 100%; }
      .resumen-panel { padding: 15px; }
      .tabs { flex-wrap: wrap; }
      .tab { flex: 1 1 45%; text-align: center; }
    }
    
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 2000; padding: 20px; }
    .modal-content { background: white; border-radius: 8px; width: 100%; max-width: 1000px; max-height: 90vh; display: flex; flex-direction: column; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #eee; }
    .modal-header h2 { margin: 0; font-size: 18px; color: #333; }
    .modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #666; padding: 0; line-height: 1; }
    .modal-close:hover { color: #333; }
    .modal-body { padding: 20px; overflow: auto; }
    .tabla-container { overflow-x: auto; }
    .tabla-detalle { width: 100%; border-collapse: collapse; font-size: 12px; }
    .tabla-detalle th, .tabla-detalle td { padding: 10px 8px; text-align: left; border-bottom: 1px solid #eee; white-space: nowrap; }
    .tabla-detalle th { background: #4CAF50; color: white; font-weight: 600; position: sticky; top: 0; }
    .tabla-detalle tr:hover { background: #f9f9f9; }
    .tabla-detalle .sin-datos { text-align: center; color: #999; padding: 20px; }
    .fila-clickable { cursor: pointer; }
    .fila-clickable:hover { background: #f5f5f5 !important; }
    .detalle-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .detalle-item { padding: 8px; background: #f9f9f9; border-radius: 4px; font-size: 14px; }
    .detalle-item strong { color: #333; }
    .filter-tipo { margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
    .filter-tipo label { font-size: 14px; color: #666; }
    .filter-tipo select { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; min-width: 250px; }
    
    @media (max-width: 768px) {
      .modal-content { max-height: 85vh; }
      .tabla-detalle { font-size: 11px; }
      .tabla-detalle th, .tabla-detalle td { padding: 8px 4px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  empresas: Empresa[] = [];
  empresaSeleccionada: number = 1;
  empresaActual: Empresa | null = null;
  
  inventario: RegistroInventario[] = [];
  consumo: RegistroConsumo[] = [];
  
  mostrandoFormulario: boolean = false;
  nuevaEmpresa: { nombre: string; correo: string } = { nombre: '', correo: '' };
  tabActiva: 'inventario' | 'consumo' = 'inventario';
  dropdownAbierto: number | null = null;
  
  mostrarModal: boolean = false;
  tipoModal: 'inventario' | 'consumo' = 'inventario';
  
  tipoDetalle: 'inventario' | 'consumo' = 'inventario';
  registroDetalle: any = null;
  
  filtroTipoInventario: string = '';
  filtroTipoConsumo: string = '';
  
  empresasResumen: { id: number; nombre: string; registrosInv: number; registrosCons: number }[] = [];
  inventarioTotal: { nombre: string; registros: any[] }[] = [];
  consumoTotal: { nombre: string; registros: any[] }[] = [];
  
  empresaFiltro: { id: number; nombre: string } | null = null;
  empresaFiltroId: number = 0;
  
  private iconos = ['🌱', '🔥', '⚡', '🏭', '🏬', '🏪', '🏫', '🏩', '🏢', '🌟'];

  constructor(
    private datosService: DatosService,
    private empresaService: EmpresaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.empresaService.empresas$.subscribe(empresas => {
      this.empresas = Object.entries(empresas).map(([id, nombre]) => ({
        id: Number(id),
        nombre: nombre
      }));
      this.actualizarResumen();
    });

    this.datosService.inventario$.subscribe(data => {
      this.inventario = data;
      this.actualizarResumen();
    });
    this.datosService.consumo$.subscribe(data => {
      this.consumo = data;
      this.actualizarResumen();
    });
  }

  actualizarResumen() {
    this.empresasResumen = this.empresas.map(emp => ({
      id: emp.id,
      nombre: emp.nombre,
      registrosInv: this.inventario.filter(r => r.empresaId === emp.id).length,
      registrosCons: this.consumo.filter(r => r.empresaId === emp.id).length
    }));

    const empresasFiltrar = this.empresaFiltro 
      ? this.empresas.filter(e => e.id === this.empresaFiltro.id)
      : this.empresas;

    this.inventarioTotal = empresasFiltrar.map(emp => ({
      nombre: emp.nombre,
      registros: this.inventario.filter(r => r.empresaId === emp.id)
    }));

    this.consumoTotal = empresasFiltrar.map(emp => ({
      nombre: emp.nombre,
      registros: this.consumo.filter(r => r.empresaId === emp.id)
    }));
  }

  getIcono(id: number): string {
    const index = id % this.iconos.length;
    return this.iconos[index];
  }

  seleccionarEmpresaFiltro(emp: { id: number; nombre: string }) {
    this.empresaFiltro = emp;
    this.empresaFiltroId = emp.id;
    this.actualizarResumen();
  }

  getInventarioEmpresa(): any[] {
    if (!this.empresaFiltro) return [];
    return this.inventario.filter(r => r.empresaId === this.empresaFiltro.id);
  }

  getInventarioEmpresaFiltrado(): any[] {
    const regs = this.getInventarioEmpresa();
    if (!this.filtroTipoInventario) return regs;
    return regs.filter(r => r.tipoEnergia === this.filtroTipoInventario);
  }

  getConsumoEmpresa(): any[] {
    if (!this.empresaFiltro) return [];
    return this.consumo.filter(r => r.empresaId === this.empresaFiltro.id);
  }

  getConsumoEmpresaFiltrado(): any[] {
    const regs = this.getConsumoEmpresa();
    if (!this.filtroTipoConsumo) return regs;
    return regs.filter(r => r.tipoEnergia === this.filtroTipoConsumo);
  }

  abrirDetalleInventario(reg: any) {
    this.tipoDetalle = 'inventario';
    this.registroDetalle = reg;
    this.mostrarModal = true;
  }

  abrirDetalleConsumo(reg: any) {
    this.tipoDetalle = 'consumo';
    this.registroDetalle = reg;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.registroDetalle = null;
  }

  mostrarFormulario() {
    this.mostrandoFormulario = true;
    this.nuevaEmpresa = { nombre: '', correo: '' };
  }

  cancelar() {
    this.mostrandoFormulario = false;
  }

  guardarEmpresa() {
    if (this.nuevaEmpresa.nombre.trim()) {
      const nuevoId = Math.max(...this.empresas.map(e => e.id), 0) + 1;
      this.empresaService.agregarEmpresa(nuevoId, this.nuevaEmpresa.nombre);
      this.mostrandoFormulario = false;
      this.seleccionarEmpresa(nuevoId);
    }
  }

  seleccionarEmpresa(id: number) {
    this.empresaSeleccionada = id;
    this.empresaService.setEmpresa(id);
    this.empresaActual = this.empresas.find(e => e.id === id) || null;
    this.tabActiva = 'inventario';
    this.dropdownAbierto = null;
  }

  toggleDropdown(event: Event, empresaId: number) {
    event.stopPropagation();
    this.dropdownAbierto = this.dropdownAbierto === empresaId ? null : empresaId;
  }

  onClickOutside() {
    this.dropdownAbierto = null;
  }

  irAInventario(empresaId?: number) {
    if (empresaId) {
      this.empresaService.setEmpresa(empresaId);
      this.empresaSeleccionada = empresaId;
      this.empresaActual = this.empresas.find(e => e.id === empresaId) || null;
    }
    this.router.navigate(['/inventario']);
  }

  irAConsumo(empresaId?: number) {
    if (empresaId) {
      this.empresaService.setEmpresa(empresaId);
      this.empresaSeleccionada = empresaId;
      this.empresaActual = this.empresas.find(e => e.id === empresaId) || null;
    }
    this.router.navigate(['/consumo']);
  }

  mostrarDetalle(tipo: 'inventario' | 'consumo') {
    this.tipoModal = tipo;
    this.mostrarModal = true;
  }

  getCountInventario(): number {
    return this.inventario.filter(r => r.empresaId === this.empresaSeleccionada).length;
  }

  getCountConsumo(): number {
    return this.consumo.filter(r => r.empresaId === this.empresaSeleccionada).length;
  }

  getInventario(): RegistroInventario[] {
    return this.inventario.filter(r => r.empresaId === this.empresaSeleccionada);
  }

  getConsumo(): RegistroConsumo[] {
    return this.consumo.filter(r => r.empresaId === this.empresaSeleccionada);
  }

  getNombreTipoInventario(tipo: string): string {
    const tipos: { [key: string]: string } = {
      'electrica': 'Energía eléctrica del servicio público',
      'renovable': 'Energías renovables',
      'combustibles': 'Energía a partir de combustibles',
      'biomasa_electrica': 'Biomasa para energía eléctrica',
      'biomasa_calor': 'Biomasa para generar calor'
    };
    return tipos[tipo] || tipo;
  }

  getNombreTipoConsumo(tipo: string): string {
    const tipos: { [key: string]: string } = {
      'gas_electrica': 'Gas para energía eléctrica',
      'gas_calor': 'Gas para generar calor',
      'vendida': 'Energía Vendida',
      'recibida': 'Energía Recibida',
      'cedida': 'Energía Cedida'
    };
    return tipos[tipo] || tipo;
  }
}
