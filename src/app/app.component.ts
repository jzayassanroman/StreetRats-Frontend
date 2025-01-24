// src/app/app.component.ts
import { Component } from '@angular/core';
import {CrearCuentaComponent} from './features/crear-cuenta/crear-cuenta.component';
import {RouterOutlet} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    CrearCuentaComponent,
    RouterOutlet,
    HttpClientModule
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'StreetRatsFront';
}
