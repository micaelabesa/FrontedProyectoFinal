import { Component, inject, signal } from "@angular/core";
import { IMenu } from "../../Interfaces/IMenu";
import { Menus } from "../../Services/menus";
import { CardMenu } from "../../Components/card-menu/card-menu";
import { IMenuDetalle } from "../../Interfaces/IMenuDetalle";
import { ActivatedRoute, RouterLink } from '@angular/router'
import Swal from "sweetalert2";
import { Platos } from "../../Services/platos";

 
@Component ({
  selector: 'app-menu',
  standalone: true,
  imports: [CardMenu, RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
 
export class Menu {
 
  private route = inject(ActivatedRoute);
  PlatoService = inject(Platos);
  
    arrMenu = signal<IMenu[]>([]);
    MenuService = inject(Menus);
    menuSeleccionado = signal<IMenuDetalle | null>(null);
  
    isAdmin = signal(false)
  
  //   async ngOnInit() {
  //     const response= await this.MenuService.getAll();
  //     console.log(response);
  //     this.arrMenu.set(response);

  //     //###TODO: preguntar a mario esta parte es porque quiero usar el compinente creado para otro padre. me hizo poner la ruta, el active y esto ) funciona pero tarda
  //     const idParam = this.route.snapshot.paramMap.get('id');
  //       if (idParam) {
  //           this.cargarDetalle(Number(idParam));
  //       }
  // }

  async ngOnInit() {
    const role = localStorage.getItem('user_role')?.replace(/"/g, '');

    console.log('Rol detectado en localStorage:', role);
    if (role === 'admin') {
    this.isAdmin.set(true);
  } else {
    this.isAdmin.set(false);
  }

    try {
      const response = await this.MenuService.getAll();
      this.arrMenu.set(response);

      // Lógica para cargar detalle si viene por URL
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        this.cargarDetalle(Number(idParam));
      }
    } catch (error) {
      console.error("Error al cargar menús", error);
    }
  }
  
//   async cargarDetalle(id: number) {
//     const detalle = await this.MenuService.getMenuId(id);
//     this.menuSeleccionado.set(detalle);
//   }

//   async desvincularPlato(platoId: number) {
//   await this.MenuService.desvincularPlato(platoId);
  
// }

  async cargarDetalle(id: number) {
    try {
      const detalle = await this.MenuService.getMenuId(id);
      this.menuSeleccionado.set(detalle);
      console.log("Detalle cargado:", detalle);
    } catch (error) {
      console.error("Error al cargar el detalle", error);
    }
  }

  // --- FUNCIÓN PARA QUITAR PLATOS ---
  async quitarPlato(platoId: number) {
    const detalle = this.menuSeleccionado();
    if (!detalle) return;

    const confirm = await Swal.fire({
      title: '¿Estás segura?',
      text: "Vas a quitar este plato del menú actual",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffc107',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        // Usamos el ID dinámico del menú seleccionado
        await this.MenuService.desvincularPlato(detalle.menu.id, platoId);
        
        await Swal.fire({
        title: '¡Hecho!',
        text: 'Plato desvinculado correctamente',
        icon: 'success',
        timer: 1500 // Se cierra solo en 1.5 seg
      });
        
        // Refrescamos el detalle para que el plato desaparezca de la lista visualmente
        this.cargarDetalle(detalle.menu.id);
        
      } catch (error) {
        console.error("Error al desvincular", error);
        Swal.fire('Error', 'No se pudo quitar el plato', 'error');
      }
    }
  }

  // Atajo para sacar los platos de la señal y que el HTML sea más limpio
  platosDelMenu() {
    return this.menuSeleccionado()?.platos || [];
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

