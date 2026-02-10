import { Component, inject, signal } from '@angular/core';
import { IPlato } from '../../Interfaces/IPlatos';
import { Platos } from '../../Services/platos';

@Component({
  selector: 'app-lista-platos',
  imports: [],
  templateUrl: './lista-platos.html',
  styleUrl: './lista-platos.css',
})
export class ListaPlatos {

  arrPlatos = signal<IPlato[]>([]);
  platoService = inject(Platos);

  indice = signal<number>(0);

  async ngOnInit() {
    const response = await this.platoService.getAll();
    console.log(response);
    this.arrPlatos.set(response);

    // Auto-reproducción cada 3 segundos
    setInterval(() => {
      this.modificarIndice(true);
    }, 5000);
  }

  modificarIndice(siguiente: boolean) {
    const total = this.arrPlatos().length;
    if (total === 0) return;

    this.indice.update(actual => {
      if (siguiente) {
        // Si es el último, vuelve al 0. Si no, suma 1.
        return (actual + 1) % total;
      } else {
        // Si es el primero, va al último. Si no, resta 1.
        return (actual - 1 + total) % total;
      }
    });
  }


  
}
 

