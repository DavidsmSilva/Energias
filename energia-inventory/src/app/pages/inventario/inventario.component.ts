import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatosService, RegistroInventario } from '../../services/datos.service';
import { EmpresaService } from '../../services/empresa.service';

interface Empresa {
  id: number;
  nombre: string;
}

interface RegistroInventarioLocal {
  tipoEnergia: string;
  mes: string;
  ano: string;
  cantidad?: number;
  numeroMeses?: number;
  costo?: number;
  tipoCombustible?: string;
  cantidadCombustible?: number;
  poderCalorifico?: number;
  tipoBiomasa?: string;
  tipoFuente?: string;
}

interface EmpresaResumen {
  id: number;
  nombre: string;
  registros: RegistroInventarioLocal[];
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contenido">
      <!-- Vista de todas las empresas -->
      <div class="tabla-container" *ngIf="!empresaId">
        <h3>Inventario - Todas las Empresas</h3>
        <table class="tabla-datos">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>N° Meses</th>
              <th>Costo</th>
              <th>Combustible</th>
              <th>Biomasa</th>
              <th>Fuente</th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let emp of empresasResumen">
              <tr *ngFor="let reg of emp.registros; let first = first" [class.first-row]="first">
                <td *ngIf="first" [attr.rowspan]="emp.registros.length" class="empresa-cell">{{ emp.nombre }}</td>
                <td>{{ getNombreTipo(reg.tipoEnergia) }}</td>
                <td>{{ reg.mes }} / {{ reg.ano }}</td>
                <td>{{ reg.cantidad || '-' }}</td>
                <td>{{ reg.numeroMeses || '-' }}</td>
                <td>{{ reg.costo ? '$' + reg.costo : '-' }}</td>
                <td>{{ reg.tipoCombustible || '-' }}</td>
                <td>{{ reg.tipoBiomasa || '-' }}</td>
                <td>{{ reg.tipoFuente || '-' }}</td>
              </tr>
              <tr *ngIf="emp.registros.length === 0">
                <td class="empresa-cell">{{ emp.nombre }}</td>
                <td colspan="8" class="sin-datos">Sin registros</td>
              </tr>
            </ng-container>
            <tr *ngIf="empresasResumen.length === 0">
              <td colspan="9" class="sin-datos">No hay empresas registradas</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Vista de una empresa específica -->
      <div class="formulario" *ngIf="empresaId">
        <div class="filters">
          <div class="filter-group">
            <label>Tipo de energía:</label>
            <select class="filter-select" [(ngModel)]="tipoEnergia">
              <option value="electrica">Energía eléctrica del servicio público</option>
              <option value="renovable">Energías renovables</option>
              <option value="combustibles">Energía a partir de combustibles (plantas eléctricas)</option>
              <option value="biomasa_electrica">Energía a partir de biomasa u otros materiales para generar energía eléctrica</option>
              <option value="biomasa_calor">Energía a partir de biomasa u otros materiales para generar calor</option>
            </select>
          </div>
        </div>

        <!-- Energía eléctrica del servicio público -->
        <div class="form-section" *ngIf="tipoEnergia === 'electrica'">
          <div class="form-title">Energía eléctrica del servicio público</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDataelectrica.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDataelectrica.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad Consumida</label>
              <input type="number" [(ngModel)]="formDataelectrica.cantidad" placeholder="0.00">
            </div>
            <div class="form-group">
              <label>Número de Meses</label>
              <input type="number" [(ngModel)]="formDataelectrica.numeroMeses" placeholder="0">
            </div>
            <div class="form-group">
              <label>Costo Total al Mes ($)</label>
              <input type="number" [(ngModel)]="formDataelectrica.costo" placeholder="0.00">
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarElectrica()">Guardar</button>
        </div>

        <!-- Energías renovables -->
        <div class="form-section" *ngIf="tipoEnergia === 'renovable'">
          <div class="form-title">Energías renovables</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDatarenovable.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDatarenovable.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad Consumida</label>
              <input type="number" [(ngModel)]="formDatarenovable.cantidad" placeholder="0.00">
            </div>
            <div class="form-group">
              <label>Número de Meses</label>
              <input type="number" [(ngModel)]="formDatarenovable.numeroMeses" placeholder="0">
            </div>
            <div class="form-group">
              <label>Tipo de Fuente</label>
              <select [(ngModel)]="formDatarenovable.tipoFuente">
                <option>Solar</option><option>Eólica</option><option>Hidráulica</option><option>Geotérmica</option>
              </select>
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarRenovable()">Guardar</button>
        </div>

        <!-- Combustibles -->
        <div class="form-section" *ngIf="tipoEnergia === 'combustibles'">
          <div class="form-title">Energía a partir de combustibles</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDatacombustibles.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDatacombustibles.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad Consumida</label>
              <input type="number" [(ngModel)]="formDatacombustibles.cantidad" placeholder="0.00">
            </div>
            <div class="form-group">
              <label>Tipo de Combustible</label>
              <select [(ngModel)]="formDatacombustibles.tipoCombustible">
                <option>Diésel</option><option>Gas Natural</option><option>Gasolina</option><option>Fuel Oil</option><option>Carbón</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad de Combustible</label>
              <input type="number" [(ngModel)]="formDatacombustibles.cantidadCombustible" placeholder="0.00">
            </div>
            <div class="form-group">
              <label>Poder Calorífico</label>
              <input type="number" [(ngModel)]="formDatacombustibles.poderCalorifico" placeholder="0.00">
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarCombustibles()">Guardar</button>
        </div>

        <!-- Biomasa eléctrica -->
        <div class="form-section" *ngIf="tipoEnergia === 'biomasa_electrica'">
          <div class="form-title">Biomasa para energía eléctrica</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDatabiomasa_electrica.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDatabiomasa_electrica.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad Consumida</label>
              <input type="number" [(ngModel)]="formDatabiomasa_electrica.cantidad" placeholder="0.00">
            </div>
            <div class="form-group">
              <label>Tipo de Biomasa</label>
              <select [(ngModel)]="formDatabiomasa_electrica.tipoBiomasa">
                <option>Cascarilla de Arroz</option><option>Corteza de Árbol</option><option>Residuos Agrícolas</option><option>Bagazo de Caña</option>
              </select>
            </div>
            <div class="form-group">
              <label>Poder Calorífico</label>
              <input type="number" [(ngModel)]="formDatabiomasa_electrica.poderCalorifico" placeholder="0.00">
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarBiomasaElectrica()">Guardar</button>
        </div>

        <!-- Biomasa calor -->
        <div class="form-section" *ngIf="tipoEnergia === 'biomasa_calor'">
          <div class="form-title">Biomasa para generar calor</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDatabiomasa_calor.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDatabiomasa_calor.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad Consumida</label>
              <input type="number" [(ngModel)]="formDatabiomasa_calor.cantidad" placeholder="0.00">
            </div>
            <div class="form-group">
              <label>Tipo de Biomasa</label>
              <select [(ngModel)]="formDatabiomasa_calor.tipoBiomasa">
                <option>Cascarilla de Arroz</option><option>Corteza de Árbol</option><option>Residuos Agrícolas</option><option>Bagazo de Caña</option>
              </select>
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarBiomasaCalor()">Guardar</button>
        </div>
      </div>

      <div class="tabla-container">
        <table class="tabla-datos">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>N° Meses</th>
              <th>Costo</th>
              <th>Combustible</th>
              <th>Cant. Comb.</th>
              <th>P. Calorífico</th>
              <th>Biomasa</th>
              <th>Fuente</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let reg of registros">
              <td>{{ getNombreTipo(reg.tipoEnergia) }}</td>
              <td>{{ reg.mes }} / {{ reg.ano }}</td>
              <td>{{ reg.cantidad || '-' }}</td>
              <td>{{ reg.numeroMeses || '-' }}</td>
              <td>{{ reg.costo ? '$' + reg.costo : '-' }}</td>
              <td>{{ reg.tipoCombustible || '-' }}</td>
              <td>{{ reg.cantidadCombustible || '-' }}</td>
              <td>{{ reg.poderCalorifico || '-' }}</td>
              <td>{{ reg.tipoBiomasa || '-' }}</td>
              <td>{{ reg.tipoFuente || '-' }}</td>
            </tr>
            <tr *ngIf="registros.length === 0">
              <td colspan="10" class="sin-datos">No hay registros de inventario</td>
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
    .tabla-datos th { background: #4CAF50; color: white; padding: 12px; text-align: left; font-weight: 600; white-space: nowrap; }
    .tabla-datos td { padding: 10px 12px; border-bottom: 1px solid #eee; color: #333; }
    .tabla-datos tr:hover { background: #f9f9f9; }
    .sin-datos { text-align: center; color: #999; padding: 20px; }
    .filters { display: flex; gap: 12px; margin-bottom: 20px; }
    .selector-empresa { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; background: white; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .selector-empresa label { font-weight: 600; color: #333; }
    .selector-empresa select { padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; min-width: 200px; }
    .filter-group { display: flex; align-items: center; gap: 8px; }
    .filter-group label { font-size: 14px; color: #666; }
    .filter-select { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; background: white; min-width: 350px; }
    .form-section { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .form-title { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #333; }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 13px; color: #666; }
    .form-group input, .form-group select { padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: #4CAF50; }
    .btn-guardar { background: #4CAF50; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; margin-top: 16px; }
    .btn-guardar:hover { background: #45a049; }
    
    .tabla-container h3 { margin: 0 0 16px; color: #333; }
    .empresa-cell { font-weight: 600; background: #f5f5f5; }
    .first-row { border-top: 2px solid #4CAF50; }
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
export class InventarioComponent implements OnInit {
  tipoEnergia: string = 'electrica';
  registros: RegistroInventarioLocal[] = [];
  empresaId: number = 1;
  empresas: Empresa[] = [];
  registroExpandido: number | null = null;

  formDataelectrica = { mes: 'Enero', ano: '2026', cantidad: 0, numeroMeses: 1, costo: 0 };
  formDatarenovable = { mes: 'Enero', ano: '2026', cantidad: 0, numeroMeses: 1, tipoFuente: 'Solar' };
  formDatacombustibles = { mes: 'Enero', ano: '2026', cantidad: 0, tipoCombustible: 'Diésil', cantidadCombustible: 0, poderCalorifico: 0 };
  formDatabiomasa_electrica = { mes: 'Enero', ano: '2026', cantidad: 0, tipoBiomasa: 'Cascarilla de Arroz', poderCalorifico: 0 };
  formDatabiomasa_calor = { mes: 'Enero', ano: '2026', cantidad: 0, tipoBiomasa: 'Cascarilla de Arroz' };

  empresasResumen: EmpresaResumen[] = [];

  constructor(
    private datosService: DatosService,
    private empresaService: EmpresaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['empresaId']) {
        this.empresaId = Number(params['empresaId']);
        this.empresaService.setEmpresa(this.empresaId);
      } else {
        this.empresaId = 0;
      }
    });

    this.empresaService.empresas$.subscribe(empresas => {
      this.empresas = Object.entries(empresas).map(([id, nombre]) => ({
        id: Number(id),
        nombre: nombre
      }));
      this.actualizarResumen();
    });
    
    this.empresaService.empresaId$.subscribe(id => {
      if (!this.route.snapshot.paramMap.get('empresaId')) {
        this.empresaId = id;
      }
      this.actualizarRegistros();
    });
    this.datosService.inventario$.subscribe(() => {
      this.actualizarRegistros();
      this.actualizarResumen();
    });
  }

  actualizarResumen() {
    this.empresasResumen = this.empresas.map(emp => ({
      id: emp.id,
      nombre: emp.nombre,
      registros: this.datosService.getInventarioPorEmpresa(emp.id).map(r => ({
        tipoEnergia: r.tipoEnergia,
        mes: r.mes,
        ano: r.ano,
        cantidad: r.cantidad,
        numeroMeses: r.numeroMeses,
        costo: r.costo,
        tipoCombustible: r.tipoCombustible,
        cantidadCombustible: r.cantidadCombustible,
        poderCalorifico: r.poderCalorifico,
        tipoBiomasa: r.tipoBiomasa,
        tipoFuente: r.tipoFuente
      }))
    }));
  }

  onEmpresaChange() {
    this.empresaService.setEmpresa(this.empresaId);
    this.actualizarRegistros();
  }

  actualizarRegistros() {
    this.registros = this.datosService.getInventarioPorEmpresa(this.empresaId).map(r => ({
      tipoEnergia: r.tipoEnergia,
      mes: r.mes,
      ano: r.ano,
      cantidad: r.cantidad,
      numeroMeses: r.numeroMeses,
      costo: r.costo,
      tipoCombustible: r.tipoCombustible,
      cantidadCombustible: r.cantidadCombustible,
      poderCalorifico: r.poderCalorifico,
      tipoBiomasa: r.tipoBiomasa,
      tipoFuente: r.tipoFuente
    }));
  }

  guardarElectrica() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'electrica', ...this.formDataelectrica };
    this.datosService.agregarInventario(registro);
  }

  guardarRenovable() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'renovable', ...this.formDatarenovable };
    this.datosService.agregarInventario(registro);
  }

  guardarCombustibles() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'combustibles', ...this.formDatacombustibles };
    this.datosService.agregarInventario(registro);
  }

  guardarBiomasaElectrica() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'biomasa_electrica', ...this.formDatabiomasa_electrica };
    this.datosService.agregarInventario(registro);
  }

  guardarBiomasaCalor() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'biomasa_calor', ...this.formDatabiomasa_calor };
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
      'electrica': 'Energía eléctrica del servicio público',
      'renovable': 'Energías renovables',
      'combustibles': 'Energía a partir de combustibles',
      'biomasa_electrica': 'Biomasa para energía eléctrica',
      'biomasa_calor': 'Biomasa para generar calor'
    };
    return tipos[tipo] || tipo;
  }
}
