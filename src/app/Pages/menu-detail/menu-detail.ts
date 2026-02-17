import { Component, inject, signal } from '@angular/core';
import { IMenuDetalle } from '../../Interfaces/IMenuDetalle';
import { Menus } from '../../Services/menus';
import { ActivatedRoute } from '@angular/router';
import { CardMenu } from '../../Components/card-menu/card-menu';
import Swal from 'sweetalert2';
import { Platos } from '../../Services/platos';

@Component({
  selector: 'app-menu-detail',
  imports: [CardMenu],
  templateUrl: './menu-detail.html',
  styleUrl: './menu-detail.css',
})
export class MenuDetail {

  menuSeleccionado = signal<IMenuDetalle | null>(null);
  MenuService = inject(Menus);
  route = inject(ActivatedRoute);
  PlatoService = inject(Platos);
  
  ngOnInit() {
    // Lógica para cargar detalle si viene por URL
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        this.cargarDetalle(Number(idParam));
      }
  }

  async cargarDetalle(id: number) {
    try {
      const detalle = await this.MenuService.getMenuId(id);
      this.menuSeleccionado.set(detalle);
      console.log("Detalle cargado:", detalle);
    } catch (error) {
      console.error("Error al cargar el detalle", error);
    }
  }

  async verEspecificaciones(id: number) {
      try {
        // Obtenemos el plato desde el servicio
        const plato = await this.PlatoService.getPlatoById(id);
        
        Swal.fire({
          title: plato.nombre,
          html: `
            <div style="text-align: left;">
              <img src="${plato.imagen_url}" style="width:100%; border-radius:10px; margin-bottom:15px; border: 1px solid #333;">
              <p><strong>Descripción:</strong> ${plato.descripcion}</p>
              <p><strong>Ingredientes:</strong> ${plato.ingredientes}</p>
              <p><strong>Alérgenos:</strong> <span class="text-warning">${plato.alergenos}</span></p>
              <p><strong>Precio:</strong> <span style="color: #d4af37; font-weight: bold;">${plato.precio}€</span></p>
            </div>
          `,
          showCloseButton: true,
          focusConfirm: false,
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#d4af37',
          background: '#111214',
          color: '#fff'
        });
      } catch (error) {
        console.error("No se pudo obtener el detalle del plato", error);
        Swal.fire('Error', 'No pudimos cargar los detalles del plato', 'error');
      }
    }

}
