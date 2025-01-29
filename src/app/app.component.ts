import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from './features/navbar/navbar.component';
import {AboutUsComponent} from './features/about-us/about-us.component';
import {FooterComponent} from './features/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent
  ],
})
export class AppComponent {
  title = 'StreetRatsFront';
}
