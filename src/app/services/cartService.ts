import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import {environment} from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = environment.baseURL;

  private cart = new BehaviorSubject<any[]>(this.loadCart());
  cart$ = this.cart.asObservable();

  constructor() {}

  private loadCart(): any[] {
    return JSON.parse(localStorage.getItem('carrito') || '[]');
  }

  addToCart(product: any) {
    let currentCart = [...this.cart.value];
    const index = currentCart.findIndex(p => p.id === product.id && p.talla === product.talla);

    if (index !== -1) {
      currentCart[index] = {
        ...currentCart[index],
        cantidad: currentCart[index].cantidad + product.cantidad
      };
    } else {
      currentCart.push(product);
    }

    this.updateCart(currentCart);

    Swal.fire({
      title: "¡Producto añadido!",
      text: `${product.nombre} se ha añadido al carrito.`,
      icon: "success",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000
    });
  }

  removeFromCart(index: number) {
    let currentCart = [...this.cart.value];
    currentCart.splice(index, 1);
    this.updateCart(currentCart);
  }

  private updateCart(cart: any[]) {
    localStorage.setItem('carrito', JSON.stringify(cart));
    this.cart.next(cart); // 🔥 IMPORTANTE: Notificar a los suscriptores (NavbarComponent)
  }

  getCart(): any[] {
    return this.cart.value;
  }
}
