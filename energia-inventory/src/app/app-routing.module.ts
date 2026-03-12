import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { ConsumoComponent } from './pages/consumo/consumo.component';
import { InventarioAguaComponent } from './pages/inventario-agua/inventario-agua.component';
import { AjustesComponent } from './pages/ajustes/ajustes.component';
import { InicioComponent } from './pages/inicio/inicio.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: 'inventario/:empresaId', component: InventarioComponent },
  { path: 'consumo', component: ConsumoComponent },
  { path: 'consumo/:empresaId', component: ConsumoComponent },
  { path: 'agua', component: DashboardComponent },
  { path: 'agua/:empresaId', component: InventarioAguaComponent },
  { path: 'ajustes', component: AjustesComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
