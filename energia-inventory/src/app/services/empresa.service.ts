import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private empresaIdSubject = new BehaviorSubject<number>(1);
  empresaId$ = this.empresaIdSubject.asObservable();

  private empresasSubject = new BehaviorSubject<{ [key: number]: string }>({
    1: 'EcoEnergy',
    2: 'GasNatural SA',
    3: 'PowerGreen'
  });
  empresas$ = this.empresasSubject.asObservable();

  empresas: { [key: number]: string } = {
    1: 'EcoEnergy',
    2: 'GasNatural SA',
    3: 'PowerGreen'
  };

  setEmpresa(id: number) {
    this.empresaIdSubject.next(id);
  }

  getEmpresaId(): number {
    return this.empresaIdSubject.value;
  }

  getNombreEmpresa(id: number): string {
    return this.empresas[id] || 'EcoEnergy';
  }

  getEmpresas(): { [key: number]: string } {
    return this.empresas;
  }

  agregarEmpresa(id: number, nombre: string) {
    this.empresas[id] = nombre;
    this.empresasSubject.next({ ...this.empresas });
  }
}
