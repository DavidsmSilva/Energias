import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface SlidesDialogData {
  company: any;
}

@Component({
  selector: 'slides-dialog',
  templateUrl: './slides-dialog.component.html',
  styleUrls: ['./slides-dialog.component.css']
})
export class SlidesDialogComponent {
  slides = [
    { id: 1, title: 'Diapositiva 1', label: 'Inventario', content: 'Vista de Inventario para la empresa' },
    { id: 2, title: 'Diapositiva 2', label: 'Consumo', content: 'Vista de Consumo para la empresa' }
  ];
  current = 0;

  constructor(
    public dialogRef: MatDialogRef<SlidesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SlidesDialogData
  ) {}

  prev() {
    this.current = (this.current - 1 + this.slides.length) % this.slides.length;
  }

  next() {
    this.current = (this.current + 1) % this.slides.length;
  }

  close(): void {
    this.dialogRef.close();
  }
}
