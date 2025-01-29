// src/app/app.component.ts
import { Component } from '@angular/core';
import {CrearCuentaComponent} from './features/crear-cuenta/crear-cuenta.component';
import {RouterOutlet} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './features/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    CrearCuentaComponent,
    RouterOutlet,
    HttpClientModule,
    LoginComponent
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'StreetRatsFront';
}
