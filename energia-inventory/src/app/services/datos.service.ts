import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface RegistroInventario {
  empresaId: number;
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

export interface RegistroConsumo {
  empresaId: number;
  tipoEnergia: string;
  mes: string;
  ano: string;
  cantidad?: number;
  tipoGas?: string;
  cantidadGas?: number;
  poderCalorifico?: number;
  unidadKwh?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private inventarioSubject = new BehaviorSubject<RegistroInventario[]>([]);
  private consumoSubject = new BehaviorSubject<RegistroConsumo[]>([]);

  inventario$ = this.inventarioSubject.asObservable();
  consumo$ = this.consumoSubject.asObservable();

  agregarInventario(registro: RegistroInventario) {
    const actuales = this.inventarioSubject.value;
    this.inventarioSubject.next([...actuales, registro]);
  }

  agregarConsumo(registro: RegistroConsumo) {
    const actuales = this.consumoSubject.value;
    this.consumoSubject.next([...actuales, registro]);
  }

  getInventarioPorEmpresa(empresaId: number): RegistroInventario[] {
    return this.inventarioSubject.value.filter(r => r.empresaId === empresaId);
  }

  getConsumoPorEmpresa(empresaId: number): RegistroConsumo[] {
    return this.consumoSubject.value.filter(r => r.empresaId === empresaId);
  }

  getTodosInventario(): RegistroInventario[] {
    return this.inventarioSubject.value;
  }

  getTodosConsumo(): RegistroConsumo[] {
    return this.consumoSubject.value;
  }

  eliminarInventario(empresaId: number, index: number) {
    const registros = this.inventarioSubject.value.filter(r => r.empresaId === empresaId);
    const registroAEliminar = registros[index];
    if (registroAEliminar) {
      const todos = this.inventarioSubject.value;
      const indiceGlobal = todos.indexOf(registroAEliminar);
      const nuevos = [...todos];
      nuevos.splice(indiceGlobal, 1);
      this.inventarioSubject.next(nuevos);
    }
  }

  eliminarConsumo(empresaId: number, index: number) {
    const registros = this.consumoSubject.value.filter(r => r.empresaId === empresaId);
    const registroAEliminar = registros[index];
    if (registroAEliminar) {
      const todos = this.consumoSubject.value;
      const indiceGlobal = todos.indexOf(registroAEliminar);
      const nuevos = [...todos];
      nuevos.splice(indiceGlobal, 1);
      this.consumoSubject.next(nuevos);
    }
  }
}
