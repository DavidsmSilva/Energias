import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { ConsumoComponent } from './pages/consumo/consumo.component';
import { AjustesComponent } from './pages/ajustes/ajustes.component';
import { EmpresasPageComponent } from './pages/empresas/empresas.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'empresas', component: EmpresasPageComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: 'inventario/:empresaId', component: InventarioComponent },
  { path: 'consumo', component: ConsumoComponent },
  { path: 'consumo/:empresaId', component: ConsumoComponent },
  { path: 'ajustes', component: AjustesComponent },
  { path: '**', redirectTo: '' }
];
