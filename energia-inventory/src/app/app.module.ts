import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmpresaListComponent } from './empresa-list/empresa-list.component';
import { SlidesDialogComponent } from './shared/slides-dialog/slides-dialog.component';
import { HeaderComponent } from './components/header/header.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EmpresaListComponent,
    SlidesDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    HeaderComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
