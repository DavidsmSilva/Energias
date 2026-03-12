import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DatosService, RegistroInventario } from '../../services/datos.service';
import { EmpresaService } from '../../services/empresa.service';

interface Empresa {
  id: number;
  nombre: string;
}

interface RegistroAgua {
  tipoFuente: string;
  mes: string;
  ano: string;
  cantidad?: number;
  numeroMeses?: number;
  costo?: number;
  tipoTratamiento?: string;
  calidadAgua?: string;
  volumen?: number;
}

interface EmpresaResumen {
  id: number;
  nombre: string;
  registros: RegistroAgua[];
}

@Component({
  selector: 'app-fuentes-agua',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="contenido">
      <div class="tabla-container" *ngIf="!empresaId">
        <h3>Fuentes de Agua - Todas las Empresas</h3>
        <table class="tabla-datos">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Fuente de Captación</th>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>N° Meses</th>
              <th>Costo</th>
              <th>Tratamiento</th>
              <th>Calidad</th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let emp of empresasResumen; trackBy: trackByEmpresaId">
              <tr *ngFor="let reg of emp.registros; let first = first" [class.first-row]="first">
                <td *ngIf="first" [attr.rowspan]="emp.registros.length" class="empresa-cell">{{ emp.nombre }}</td>
                <td>{{ getNombreTipo(reg.tipoFuente) }}</td>
                <td>{{ reg.mes }} / {{ reg.ano }}</td>
                <td>{{ reg.cantidad || '-' }}</td>
                <td>{{ reg.numeroMeses || '-' }}</td>
                <td>{{ reg.costo ? '$' + reg.costo : '-' }}</td>
                <td>{{ reg.tipoTratamiento || '-' }}</td>
                <td>{{ reg.calidadAgua || '-' }}</td>
              </tr>
              <tr *ngIf="emp.registros.length === 0">
                <td class="empresa-cell">{{ emp.nombre }}</td>
                <td colspan="7" class="sin-datos">Sin registros</td>
              </tr>
            </ng-container>
            <tr *ngIf="empresasResumen.length === 0">
              <td colspan="8" class="sin-datos">No hay empresas registradas</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="formulario" *ngIf="empresaId">
        <div class="filters">
          <div class="filter-group">
            <label>Fuente de Captación:</label>
            <select class="filter-select" [(ngModel)]="tipoFuente">
              <option value="acueducto">Agua de Acueducto</option>
              <option value="superficial">Agua de Fuente Superficial</option>
              <option value="lluvia">Agua Lluvia</option>
              <option value="reuso">Agua Reuso</option>
              <option value="subterranea">Agua de Fuente Subterránea</option>
              <option value="distrito_riego">Agua de Distrito de Riego</option>
              <option value="carrotanque">Agua de Carrotanque</option>
            </select>
          </div>
        </div>

        <!-- Agua de Acueducto -->
        <div class="form-section" *ngIf="tipoFuente === 'acueducto'">
          <div class="form-title">Agua de Acueducto</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDataacueducto.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDataacueducto.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad Consumida (mes)</label>
              <input type="number" [(ngModel)]="formDataacueducto.cantidad" placeholder="0">
            </div>
            <div class="form-group">
              <label>Cantidad (m³)</label>
              <input type="number" [(ngModel)]="formDataacueducto.unidad" placeholder="0">
            </div>
            <div class="form-group">
              <label>Costo Total al Mes ($)</label>
              <input type="number" [(ngModel)]="formDataacueducto.costo" placeholder="0.00">
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarAcueducto()">Guardar</button>
        </div>

        <!-- Agua de Fuente Superficial -->
        <div class="form-section" *ngIf="tipoFuente === 'superficial'">
          <div class="form-title">Agua de Fuente Superficial</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDatasuperficial.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDatasuperficial.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Tipo de Fuente</label>
              <select [(ngModel)]="formDatasuperficial.tipoFuente">
                <option>Arroyo</option><option>Canal</option><option>Caño</option>
                <option>Cienaga</option><option>Embalse</option><option>Estuario</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad Consumida (mes)</label>
              <input type="number" [(ngModel)]="formDatasuperficial.cantidad" placeholder="0">
            </div>
            <div class="form-group">
              <label>Cantidad (m³)</label>
              <input type="number" [(ngModel)]="formDatasuperficial.unidad" placeholder="0">
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarSuperficial()">Guardar</button>
        </div>

        <!-- Agua Lluvia -->
        <div class="form-section" *ngIf="tipoFuente === 'lluvia'">
          <div class="form-title">Agua Lluvia</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDatalluvia.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDatalluvia.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad Consumida (mes)</label>
              <input type="number" [(ngModel)]="formDatalluvia.cantidad" placeholder="0">
            </div>
            <div class="form-group">
              <label>Cantidad (m³)</label>
              <input type="number" [(ngModel)]="formDatalluvia.unidad" placeholder="0">
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarLluvia()">Guardar</button>
        </div>

        <!-- Agua Reuso -->
        <div class="form-section" *ngIf="tipoFuente === 'reuso'">
          <div class="form-title">Agua Reuso</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDatareuso.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDatareuso.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Fuente de donde Proveniene el Agua</label>
              <input type="text" [(ngModel)]="formDatareuso.fuenteReuso" placeholder="Fuente de origen">
            </div>
            <div class="form-group">
              <label>Cantidad de Agua Consumida</label>
              <input type="number" [(ngModel)]="formDatareuso.cantidad" placeholder="0">
            </div>
            <div class="form-group">
              <label>Unidad (m³)</label>
              <input type="number" [(ngModel)]="formDatareuso.unidad" placeholder="0">
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarReuso()">Guardar</button>
        </div>

        <!-- Agua de Fuente Subterránea -->
        <div class="form-section" *ngIf="tipoFuente === 'subterranea'">
          <div class="form-title">Agua de Fuente Subterránea</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDatasubterranea.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDatasubterranea.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Tipo</label>
              <select [(ngModel)]="formDatasubterranea.tipoSubterranea">
                <option>Aljibe</option><option>Manantial</option><option>Pozo</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad Consumida (mes)</label>
              <input type="number" [(ngModel)]="formDatasubterranea.cantidad" placeholder="0">
            </div>
            <div class="form-group">
              <label>Cantidad (m³)</label>
              <input type="number" [(ngModel)]="formDatasubterranea.unidad" placeholder="0">
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarSubterranea()">Guardar</button>
        </div>

        <!-- Agua de Distrito de Riego -->
        <div class="form-section" *ngIf="tipoFuente === 'distrito_riego'">
          <div class="form-title">Agua de Distrito de Riego</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDatadistrito_riego.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDatadistrito_riego.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad Consumida (mes)</label>
              <input type="number" [(ngModel)]="formDatadistrito_riego.cantidad" placeholder="0">
            </div>
            <div class="form-group">
              <label>Cantidad (m³)</label>
              <input type="number" [(ngModel)]="formDatadistrito_riego.unidad" placeholder="0">
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarDistritoRiego()">Guardar</button>
        </div>

        <!-- Agua de Carrotanque -->
        <div class="form-section" *ngIf="tipoFuente === 'carrotanque'">
          <div class="form-title">Agua de Carrotanque</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDatacarrotanque.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDatacarrotanque.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad Consumida (mes)</label>
              <input type="number" [(ngModel)]="formDatacarrotanque.cantidad" placeholder="0">
            </div>
            <div class="form-group">
              <label>Cantidad (m³)</label>
              <input type="number" [(ngModel)]="formDatacarrotanque.unidad" placeholder="0">
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarCarrotanque()">Guardar</button>
        </div>
      </div>

      <div class="tabla-container">
        <table class="tabla-datos">
          <thead>
            <tr>
              <th>Fuente de Captación</th>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>N° Meses</th>
              <th>Costo</th>
              <th>Tratamiento</th>
              <th>Calidad</th>
              <th>Volumen</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let reg of registros; trackBy: trackByRegistro">
              <td>{{ getNombreTipo(reg.tipoFuente) }}</td>
              <td>{{ reg.mes }} / {{ reg.ano }}</td>
              <td>{{ reg.cantidad || '-' }}</td>
              <td>{{ reg.numeroMeses || '-' }}</td>
              <td>{{ reg.costo ? '$' + reg.costo : '-' }}</td>
              <td>{{ reg.tipoTratamiento || '-' }}</td>
              <td>{{ reg.calidadAgua || '-' }}</td>
              <td>{{ reg.volumen || '-' }}</td>
            </tr>
            <tr *ngIf="registros.length === 0">
              <td colspan="8" class="sin-datos">No hay registros de inventario de agua</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .contenido { display: flex; flex-direction: column; gap: 20px; }
    .tabla-container { background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow-x: auto; }
    .tabla-datos { width: 100%; border-collapse: collapse; font-size: 13px; }
    .tabla-datos th { background: #2196F3; color: white; padding: 12px; text-align: left; font-weight: 600; white-space: nowrap; }
    .tabla-datos td { padding: 10px 12px; border-bottom: 1px solid #eee; color: #333; }
    .tabla-datos tr:hover { background: #f9f9f9; }
    .sin-datos { text-align: center; color: #999; padding: 20px; }
    .filters { display: flex; gap: 12px; margin-bottom: 20px; }
    .selector-empresa { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; background: white; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .selector-empresa label { font-weight: 600; color: #333; }
    .selector-empresa select { padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; min-width: 200px; }
    .filter-group { display: flex; align-items: center; gap: 8px; }
    .filter-group label { font-size: 14px; color: #666; }
    .filter-select { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; background: white; min-width: 280px; }
    .form-section { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .form-title { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #333; }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 13px; color: #666; }
    .form-group input, .form-group select { padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: #2196F3; }
    .btn-guardar { background: #2196F3; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; margin-top: 16px; }
    .btn-guardar:hover { background: #1976D2; }
    
    .tabla-container h3 { margin: 0 0 16px; color: #333; }
    .empresa-cell { font-weight: 600; background: #f5f5f5; }
    .first-row { border-top: 2px solid #2196F3; }
    .sin-datos { text-align: center; color: #999; padding: 20px; }
    
    @media (max-width: 1024px) {
      .contenido { flex-direction: column; }
      .formulario { width: 100%; }
      .registros { max-width: 100%; }
      .form-grid { grid-template-columns: repeat(2, 1fr); }
    }
    
    @media (max-width: 768px) {
      .contenido { padding: 10px; gap: 15px; }
      .selector-empresa { flex-direction: column; align-items: stretch; }
      .selector-empresa select { width: 100%; }
      .filter-select { min-width: auto; width: 100%; }
      .filters { flex-direction: column; }
      .form-grid { grid-template-columns: 1fr; }
      .form-section { padding: 15px; }
      .registros { padding: 15px; }
    }
    
    @media (max-width: 480px) {
      .contenido { padding: 8px; }
      .form-title { font-size: 14px; }
      .form-group label { font-size: 12px; }
      .form-group input, .form-group select { padding: 8px; font-size: 13px; }
      .btn-guardar { width: 100%; }
      .registro-item { padding: 8px; }
      .registro-tipo { font-size: 12px; }
      .registro-fecha { font-size: 11px; }
    }
  `]
})
export class InventarioAguaComponent implements OnInit, OnDestroy {
  tipoFuente: string = 'acueducto';
  registros: RegistroAgua[] = [];
  empresaId: number = 1;
  empresas: Empresa[] = [];
  registroExpandido: number | null = null;

  formDataacueducto = { mes: 'Enero', ano: '2026', cantidad: 0, numeroMeses: 0, unidad: 0, costo: 0 };
  formDatasuperficial = { mes: 'Enero', ano: '2026', cantidad: 0, numeroMeses: 0, unidad: 0, tipoFuente: 'Arroyo' };
  formDatalluvia = { mes: 'Enero', ano: '2026', cantidad: 0, numeroMeses: 0, unidad: 0 };
  formDatareuso = { mes: 'Enero', ano: '2026', cantidad: 0, unidad: 0, fuenteReuso: '' };
  formDatasubterranea = { mes: 'Enero', ano: '2026', cantidad: 0, numeroMeses: 0, unidad: 0, tipoSubterranea: 'Aljibe' };
  formDatadistrito_riego = { mes: 'Enero', ano: '2026', cantidad: 0, numeroMeses: 0, unidad: 0 };
  formDatacarrotanque = { mes: 'Enero', ano: '2026', cantidad: 0, numeroMeses: 0, unidad: 0 };

  empresasResumen: EmpresaResumen[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private datosService: DatosService,
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  private tiposAgua = ['acueducto', 'superficial', 'lluvia', 'reuso', 'subterranea', 'distrito_riego', 'carrotanque'];

  private isTipoAgua(tipo: string): boolean {
    return this.tiposAgua.includes(tipo);
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['empresaId']) {
        this.empresaId = Number(params['empresaId']);
        this.empresaService.setEmpresa(this.empresaId);
      } else {
        this.empresaId = 0;
      }
    });

    this.empresaService.empresas$.pipe(takeUntil(this.destroy$)).subscribe(empresas => {
      this.empresas = Object.entries(empresas).map(([id, nombre]) => ({
        id: Number(id),
        nombre: nombre
      }));
      this.actualizarResumen();
      this.cdr.markForCheck();
    });
    
    this.empresaService.empresaId$.pipe(takeUntil(this.destroy$)).subscribe(id => {
      if (!this.route.snapshot.paramMap.get('empresaId')) {
        this.empresaId = id;
      }
      this.actualizarRegistros();
      this.cdr.markForCheck();
    });

    this.datosService.inventario$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.actualizarRegistros();
      this.actualizarResumen();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByEmpresaId(index: number, item: EmpresaResumen): number {
    return item.id;
  }

  trackByRegistro(index: number, item: RegistroAgua): string {
    return `${item.tipoFuente}-${item.mes}-${item.ano}`;
  }

  actualizarResumen() {
    this.empresasResumen = this.empresas.map(emp => ({
      id: emp.id,
      nombre: emp.nombre,
      registros: this.datosService.getInventarioPorEmpresa(emp.id)
        .filter(r => this.isTipoAgua(r.tipoEnergia))
        .map(r => ({
          tipoFuente: r.tipoEnergia,
          mes: r.mes,
          ano: r.ano,
          cantidad: r.cantidad,
          numeroMeses: r.numeroMeses,
          costo: r.costo,
          tipoTratamiento: r.tipoCombustible,
          calidadAgua: r.tipoBiomasa,
          volumen: r.poderCalorifico
        }))
    }));
  }

  onEmpresaChange() {
    this.empresaService.setEmpresa(this.empresaId);
    this.actualizarRegistros();
  }

  actualizarRegistros() {
    let registrosRaw = this.datosService.getInventarioPorEmpresa(this.empresaId);
    if (this.empresaId === 0) {
      registrosRaw = this.datosService.getTodosInventario();
    }
    this.registros = registrosRaw
      .filter(r => this.isTipoAgua(r.tipoEnergia))
      .map(r => ({
        tipoFuente: r.tipoEnergia,
        mes: r.mes,
        ano: r.ano,
        cantidad: r.cantidad,
        numeroMeses: r.numeroMeses,
        costo: r.costo,
        tipoTratamiento: r.tipoCombustible,
        calidadAgua: r.tipoBiomasa,
        volumen: r.poderCalorifico
      }));
  }

  guardarAcueducto() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'acueducto', ...this.formDataacueducto };
    this.datosService.agregarInventario(registro);
  }

  guardarSuperficial() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'superficial', ...this.formDatasuperficial };
    this.datosService.agregarInventario(registro);
  }

  guardarLluvia() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'lluvia', ...this.formDatalluvia };
    this.datosService.agregarInventario(registro);
  }

  guardarReuso() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'reuso', ...this.formDatareuso };
    this.datosService.agregarInventario(registro);
  }

  guardarSubterranea() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'subterranea', ...this.formDatasubterranea };
    this.datosService.agregarInventario(registro);
  }

  guardarDistritoRiego() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'distrito_riego', ...this.formDatadistrito_riego };
    this.datosService.agregarInventario(registro);
  }

  guardarCarrotanque() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'carrotanque', ...this.formDatacarrotanque };
    this.datosService.agregarInventario(registro);
  }

  eliminarRegistro(index: number) {
    this.datosService.eliminarInventario(this.empresaId, index);
  }

  toggleExpand(index: number) {
    this.registroExpandido = this.registroExpandido === index ? null : index;
  }

  getNombreTipo(tipo: string): string {
    const tipos: { [key: string]: string } = {
      'acueducto': 'Agua de Acueducto',
      'superficial': 'Agua de Fuente Superficial',
      'lluvia': 'Agua Lluvia',
      'reuso': 'Agua Reuso',
      'subterranea': 'Agua de Fuente Subterránea',
      'distrito_riego': 'Agua de Distrito de Riego',
      'carrotanque': 'Agua de Carrotanque'
    };
    return tipos[tipo] || tipo;
  }
}
