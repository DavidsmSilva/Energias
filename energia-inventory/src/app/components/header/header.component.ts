import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <h1 class="title">{{ pageTitle }}</h1>
    </header>
  `,
  styles: [`
    .header { background: #4CAF50; padding: 12px 24px; color: white; display: flex; align-items: center; box-sizing: border-box; height: 60px; }
    .title { margin: 0; font-size: 20px; font-weight: 500; }
    
    @media (max-width: 768px) {
      .header { padding: 10px 15px; height: 50px; }
      .title { font-size: 16px; }
    }
    
    @media (max-width: 480px) {
      .header { padding: 8px 12px; height: 45px; }
      .title { font-size: 14px; }
    }
  `]
})
export class HeaderComponent {
  @Input() pageTitle = '';
}
