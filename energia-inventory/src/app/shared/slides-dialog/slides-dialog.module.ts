import { NgModule } from '@angular/core';
import { SlidesDialogComponent } from './slides-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SlidesDialogComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [SlidesDialogComponent]
})
export class SlidesDialogModule { }
