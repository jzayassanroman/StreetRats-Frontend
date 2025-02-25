import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  private searchTerm = new BehaviorSubject<string>(''); // Estado inicial vacío
  searchTerm$ = this.searchTerm.asObservable(); // Observable para el HomeComponent

  setSearchTerm(term: string) {
    if (this.searchTerm.getValue() !== term) { // Solo emite si es diferente
      console.log("🔄 Nuevo término de búsqueda emitido:", term);
      this.searchTerm.next(term);
    }
  }
}

