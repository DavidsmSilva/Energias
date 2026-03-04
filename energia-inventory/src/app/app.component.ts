import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EmpresaService } from './services/empresa.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';

interface Empresa {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent]
})
export class AppComponent implements OnInit {
  pageTitle = '';
  rutaActual: string = '/';
  empresas: Empresa[] = [];
  empresaSeleccionada: number | null = null;
  empresaNombre: string = '';
  mostrandoFormulario = false;
  nuevaEmpresa = { nombre: '', correo: '' };
  dropdownAbierto: number | null = null;
  
  constructor(
    private router: Router, 
    private empresaService: EmpresaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.empresaService.empresas$.subscribe(empresas => {
      this.empresas = Object.entries(empresas).map(([id, nombre]) => ({
        id: Number(id),
        nombre: nombre
      }));
      if (this.empresas.length > 0 && !this.empresaSeleccionada) {
        this.empresaSeleccionada = this.empresas[0].id;
        this.empresaNombre = this.empresas[0].nombre;
        this.empresaService.setEmpresa(this.empresas[0].id);
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navEvent = event as NavigationEnd;
      const url = navEvent.urlAfterRedirects;
      this.rutaActual = url;
      
      if (url === '/inicio') {
        this.pageTitle = 'Inicio';
      } else if (url === '/' || url === '') {
        this.pageTitle = 'Energia';
      } else if (url.startsWith('/inventario')) {
        const empresaId = this.getEmpresaIdFromUrl(url);
        if (empresaId) {
          this.empresaSeleccionada = empresaId;
          const empresa = this.empresas.find(e => e.id === empresaId);
          this.empresaNombre = empresa ? empresa.nombre : '';
          this.empresaService.setEmpresa(empresaId);
          this.pageTitle = 'Inventario - ' + this.empresaNombre;
        } else {
          this.pageTitle = 'Inventario';
        }
      } else if (url.startsWith('/consumo')) {
        const empresaId = this.getEmpresaIdFromUrl(url);
        if (empresaId) {
          this.empresaSeleccionada = empresaId;
          const empresa = this.empresas.find(e => e.id === empresaId);
          this.empresaNombre = empresa ? empresa.nombre : '';
          this.empresaService.setEmpresa(empresaId);
          this.pageTitle = 'Consumo - ' + this.empresaNombre;
        } else {
          this.pageTitle = 'Consumo';
        }
      } else if (url.startsWith('/ajustes')) {
        this.pageTitle = 'Ajustes';
      }
    });
  }

  getEmpresaIdFromUrl(url: string): number | null {
    const match = url.match(/\/(\d+)$/);
    return match ? Number(match[1]) : null;
  }

  seleccionarEmpresa(id: number) {
    this.empresaSeleccionada = id;
    const empresa = this.empresas.find(e => e.id === id);
    this.empresaNombre = empresa ? empresa.nombre : '';
    this.empresaService.setEmpresa(id);
  }

  getIcono(id: number): string {
    const iconos = ['🔥', '⚡', '🏭', '💡', '🌿', '⚙️'];
    return iconos[(id - 1) % iconos.length];
  }

  toggleDropdown(event: Event, id: number) {
    event.stopPropagation();
    this.dropdownAbierto = this.dropdownAbierto === id ? null : id;
  }

  onClickOutside() {
    this.dropdownAbierto = null;
  }

  toggleFormulario() {
    this.mostrandoFormulario = !this.mostrandoFormulario;
    if (!this.mostrandoFormulario) {
      this.nuevaEmpresa = { nombre: '', correo: '' };
    }
  }

  guardarEmpresa() {
    if (this.nuevaEmpresa.nombre && this.nuevaEmpresa.correo) {
      const nuevoId = Math.max(...this.empresas.map(e => e.id), 0) + 1;
      this.empresaService.agregarEmpresa(nuevoId, this.nuevaEmpresa.nombre);
      this.nuevaEmpresa = { nombre: '', correo: '' };
      this.mostrandoFormulario = false;
    }
  }

  cancelar() {
    this.nuevaEmpresa = { nombre: '', correo: '' };
    this.mostrandoFormulario = false;
  }

  irAInicio() {
    this.router.navigate(['/inicio']);
  }

  irAEnergia() {
    this.router.navigate(['/']);
  }

  irAInventario() {
    this.router.navigate(['/inventario']);
  }

  irAInventarioEmpresa(id: number) {
    this.seleccionarEmpresa(id);
    this.dropdownAbierto = null;
    this.router.navigate(['/inventario', id]);
  }

  irAConsumo() {
    this.router.navigate(['/consumo']);
  }

  irAConsumoEmpresa(id: number) {
    this.seleccionarEmpresa(id);
    this.dropdownAbierto = null;
    this.router.navigate(['/consumo', id]);
  }

  irAEmpresas() {
    this.router.navigate(['/empresas']);
  }

  irAAjustes() {
    this.router.navigate(['/ajustes']);
  }
}
