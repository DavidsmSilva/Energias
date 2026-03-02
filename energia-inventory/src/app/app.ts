import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="app-layout" style="display:flex; height:100vh;">
      <app-sidebar></app-sidebar>
      <main class="main-content" style="flex:1; padding:16px;">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [``]
})
export class App {
}
