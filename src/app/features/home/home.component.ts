import { Component } from '@angular/core';
import { Navigation, Pagination } from 'swiper/modules';
import {NgClass, NgFor, NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    NgStyle,
    NgClass,
    NgFor,
    NgIf,
    NgStyle
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  images = [
    'assets/modelo1.webp',
    'assets/modelo2.webp',
    'assets/modelo3.avif'
  ];

  currentIndex = 1; // Iniciamos en 1 para evitar ver la imagen duplicada del inicio
  autoSlideInterval: any;
  smoothTransition = true;

  constructor() {
    this.startAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  prevSlide() {
    this.smoothTransition = true;
    this.currentIndex--;

    if (this.currentIndex === 0) {
      setTimeout(() => {
        this.smoothTransition = false;
        this.currentIndex = this.images.length;
      }, 700);
    }
  }

  nextSlide() {
    this.smoothTransition = true;
    this.currentIndex++;

    if (this.currentIndex === this.images.length + 1) {
      setTimeout(() => {
        this.smoothTransition = false;
        this.currentIndex = 1;
      }, 700);
    }
  }

  ngOnDestroy() {
    clearInterval(this.autoSlideInterval);
  }

}



