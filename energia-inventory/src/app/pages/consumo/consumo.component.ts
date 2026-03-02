import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatosService, RegistroConsumo } from '../../services/datos.service';
import { EmpresaService } from '../../services/empresa.service';

interface Empresa {
  id: number;
  nombre: string;
}

interface RegistroConsumoLocal {
  tipoEnergia: string;
  mes: string;
  ano: string;
  cantidad?: number;
  tipoGas?: string;
  cantidadGas?: number;
  poderCalorifico?: number;
  unidadKwh?: number;
}

interface EmpresaResumen {
  id: number;
  nombre: string;
  registros: RegistroConsumoLocal[];
}

@Component({
  selector: 'app-consumo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contenido">
      <!-- Vista de todas las empresas -->
      <div class="tabla-container" *ngIf="!empresaId">
        <h3>Consumo - Todas las Empresas</h3>
        <table class="tabla-datos">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>Tipo Gas</th>
              <th>Cant. Gas</th>
              <th>P. Calorífico</th>
              <th>Unidad KWh</th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let emp of empresasResumen">
              <tr *ngFor="let reg of emp.registros; let first = first" [class.first-row]="first">
                <td *ngIf="first" [attr.rowspan]="emp.registros.length" class="empresa-cell">{{ emp.nombre }}</td>
                <td>{{ getNombreTipo(reg.tipoEnergia) }}</td>
                <td>{{ reg.mes }} / {{ reg.ano }}</td>
                <td>{{ reg.cantidad ? reg.cantidad + ' kWh' : '-' }}</td>
                <td>{{ reg.tipoGas || '-' }}</td>
                <td>{{ reg.cantidadGas || '-' }}</td>
                <td>{{ reg.poderCalorifico ? reg.poderCalorifico + ' kJ/unidad' : '-' }}</td>
                <td>{{ reg.unidadKwh || '-' }}</td>
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

      <!-- Vista de una empresa específica -->
      <div class="formulario" *ngIf="empresaId">
        <div class="filters">
          <div class="filter-group">
            <label>Tipo de energía:</label>
            <select class="filter-select" [(ngModel)]="tipoEnergia">
              <option value="gas_electrica">Energía a partir de gases para generar energía eléctrica</option>
              <option value="gas_calor">Energía a partir de gases para generar calor</option>
              <option value="vendida">Energía Vendida</option>
              <option value="recibida">Energía Recibida</option>
              <option value="cedida">Energía Cedida en Transferencia</option>
            </select>
          </div>
        </div>

        <!-- Energía a partir de gases para generar energía eléctrica -->
        <div class="form-section" *ngIf="tipoEnergia === 'gas_electrica'">
          <div class="form-title">Energía a partir de gases para generar energía eléctrica</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDatagas_electrica.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDatagas_electrica.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Tipo de Gas</label>
              <select [(ngModel)]="formDatagas_electrica.tipoGas">
                <option>Gas Natural</option><option>GLP</option><option>Gas de Biogás</option>
                <option>Gas de Coal</option><option>Gas Licuado</option>
              </select>
            </div>
            <div class="form-group">
              <label>Unidad de Medida</label>
              <select>
                <option>m³</option><option>lb</option><option>kg</option>
                <option>Cilindro 100 lb</option><option>Cilindro 40 lb</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad de Gas</label>
              <input type="number" [(ngModel)]="formDatagas_electrica.cantidadGas" placeholder="0.00">
            </div>
            <div class="form-group">
              <label>Poder Calorífico (kJ/unidad)</label>
              <input type="number" [(ngModel)]="formDatagas_electrica.poderCalorifico" placeholder="0.00">
            </div>
            <div class="form-group">
              <label>Unidad KWh</label>
              <input type="number" [(ngModel)]="formDatagas_electrica.unidadKwh" placeholder="0.00">
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarGasElectrica()">Guardar</button>
        </div>

        <!-- Energía a partir de gases para generar calor -->
        <div class="form-section" *ngIf="tipoEnergia === 'gas_calor'">
          <div class="form-title">Energía a partir de gases para generar calor</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDatagas_calor.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDatagas_calor.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Tipo de Gas</label>
              <select [(ngModel)]="formDatagas_calor.tipoGas">
                <option>Gas Natural</option><option>GLP</option><option>Gas de Biogás</option>
                <option>Gas de Coal</option><option>Gas Licuado</option>
              </select>
            </div>
            <div class="form-group">
              <label>Unidad de Medida</label>
              <select>
                <option>m³</option><option>lb</option><option>kg</option>
                <option>Cilindro 100 lb</option><option>Cilindro 40 lb</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad de Gas</label>
              <input type="number" [(ngModel)]="formDatagas_calor.cantidadGas" placeholder="0.00">
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarGasCalor()">Guardar</button>
        </div>

        <!-- Energía Vendida -->
        <div class="form-section" *ngIf="tipoEnergia === 'vendida'">
          <div class="form-title">Energía Vendida</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDatavendida.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDatavendida.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad de Energía Vendida (kWh)</label>
              <input type="number" [(ngModel)]="formDatavendida.cantidad" placeholder="0.00">
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarVendida()">Guardar</button>
        </div>

        <!-- Energía Recibida -->
        <div class="form-section" *ngIf="tipoEnergia === 'recibida'">
          <div class="form-title">Energía Recibida</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDatarecibida.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDatarecibida.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad de Energía Recibida (kWh)</label>
              <input type="number" [(ngModel)]="formDatarecibida.cantidad" placeholder="0.00">
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarRecibida()">Guardar</button>
        </div>

        <!-- Energía Cedida -->
        <div class="form-section" *ngIf="tipoEnergia === 'cedida'">
          <div class="form-title">Energía Cedida en Transferencia</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Mes</label>
              <select [(ngModel)]="formDatacedida.mes">
                <option>Enero</option><option>Febrero</option><option>Marzo</option>
                <option>Abril</option><option>Mayo</option><option>Junio</option>
                <option>Julio</option><option>Agosto</option><option>Septiembre</option>
                <option>Octubre</option><option>Noviembre</option><option>Diciembre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Año</label>
              <select [(ngModel)]="formDatacedida.ano">
                <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad de Energía Cedida (kWh)</label>
              <input type="number" [(ngModel)]="formDatacedida.cantidad" placeholder="0.00">
            </div>
          </div>
          <button class="btn-guardar" (click)="guardarCedida()">Guardar</button>
        </div>
      </div>

      <div class="tabla-container">
        <table class="tabla-datos">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>Tipo Gas</th>
              <th>Cant. Gas</th>
              <th>P. Calorífico</th>
              <th>Unidad KWh</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let reg of registros">
              <td>{{ getNombreTipo(reg.tipoEnergia) }}</td>
              <td>{{ reg.mes }} / {{ reg.ano }}</td>
              <td>{{ reg.cantidad ? reg.cantidad + ' kWh' : '-' }}</td>
              <td>{{ reg.tipoGas || '-' }}</td>
              <td>{{ reg.cantidadGas || '-' }}</td>
              <td>{{ reg.poderCalorifico ? reg.poderCalorifico + ' kJ/unidad' : '-' }}</td>
              <td>{{ reg.unidadKwh || '-' }}</td>
            </tr>
            <tr *ngIf="registros.length === 0">
              <td colspan="7" class="sin-datos">No hay registros de consumo</td>
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
export class ConsumoComponent implements OnInit {
  tipoEnergia: string = 'gas_electrica';
  registros: RegistroConsumoLocal[] = [];
  empresaId: number = 1;
  empresas: Empresa[] = [];
  registroExpandido: number | null = null;

  formDatagas_electrica = { mes: 'Enero', ano: '2026', tipoGas: 'Gas Natural', cantidadGas: 0, poderCalorifico: 0, unidadKwh: 0 };
  formDatagas_calor = { mes: 'Enero', ano: '2026', tipoGas: 'Gas Natural', cantidadGas: 0 };
  formDatavendida = { mes: 'Enero', ano: '2026', cantidad: 0 };
  formDatarecibida = { mes: 'Enero', ano: '2026', cantidad: 0 };
  formDatacedida = { mes: 'Enero', ano: '2026', cantidad: 0 };

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
    this.datosService.consumo$.subscribe(() => {
      this.actualizarRegistros();
      this.actualizarResumen();
    });
  }

  actualizarResumen() {
    this.empresasResumen = this.empresas.map(emp => ({
      id: emp.id,
      nombre: emp.nombre,
      registros: this.datosService.getConsumoPorEmpresa(emp.id).map(r => ({
        tipoEnergia: r.tipoEnergia,
        mes: r.mes,
        ano: r.ano,
        cantidad: r.cantidad,
        tipoGas: r.tipoGas,
        cantidadGas: r.cantidadGas,
        poderCalorifico: r.poderCalorifico,
        unidadKwh: r.unidadKwh
      }))
    }));
  }

  onEmpresaChange() {
    this.empresaService.setEmpresa(this.empresaId);
    this.actualizarRegistros();
  }

  actualizarRegistros() {
    this.registros = this.datosService.getConsumoPorEmpresa(this.empresaId).map(r => ({
      tipoEnergia: r.tipoEnergia,
      mes: r.mes,
      ano: r.ano,
      cantidad: r.cantidad,
      tipoGas: r.tipoGas,
      cantidadGas: r.cantidadGas,
      poderCalorifico: r.poderCalorifico,
      unidadKwh: r.unidadKwh
    }));
  }

  guardarGasElectrica() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'gas_electrica', ...this.formDatagas_electrica };
    this.datosService.agregarConsumo(registro);
  }

  guardarGasCalor() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'gas_calor', ...this.formDatagas_calor };
    this.datosService.agregarConsumo(registro);
  }

  guardarVendida() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'vendida', ...this.formDatavendida };
    this.datosService.agregarConsumo(registro);
  }

  guardarRecibida() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'recibida', ...this.formDatarecibida };
    this.datosService.agregarConsumo(registro);
  }

  guardarCedida() {
    const registro = { empresaId: this.empresaId, tipoEnergia: 'cedida', ...this.formDatacedida };
    this.datosService.agregarConsumo(registro);
  }

  eliminarRegistro(index: number) {
    this.datosService.eliminarConsumo(this.empresaId, index);
  }

  toggleExpand(index: number) {
    this.registroExpandido = this.registroExpandido === index ? null : index;
  }

  getNombreTipo(tipo: string): string {
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
