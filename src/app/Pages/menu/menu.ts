import { Component, inject, signal } from "@angular/core";
import { IMenu } from "../../Interfaces/IMenu";
import { Menus } from "../../Services/menus";
import { CardMenu } from "../../Components/card-menu/card-menu";
import { IMenuDetalle } from "../../Interfaces/IMenuDetalle";
import { ActivatedRoute } from '@angular/router'

 
@Component ({
  selector: 'app-menu',
  standalone: true,
  imports: [CardMenu],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
 
export class Menu {
 
  private route = inject(ActivatedRoute);
  
    arrMenu = signal<IMenu[]>([]);
    MenuService = inject(Menus);
    menuSeleccionado = signal<IMenuDetalle | null>(null);
  
    async ngOnInit() {
      const response= await this.MenuService.getAll();
      console.log(response);
      this.arrMenu.set(response);

      //preguntar a mario esta parte es porque quiero usar el compinente creado para otro padre. me hizo poner la ruta, el active y esto ) funciona pero tarda
      const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.cargarDetalle(Number(idParam));
        }
  }
  
  async cargarDetalle(id: number) {
    const detalle = await this.MenuService.getMenuId(id);
    this.menuSeleccionado.set(detalle);
  }



  //lo comento porque estaba todo perfect pero como estos datos los traigo del back esto no hace falta 
  // menus = [
  //   {
  //     id: 1,
  //     nombre: '',
  //     precio: 0,
  //     descripcion: '',
  //     alergenos: ''
  //   },
 
  //   {
  //     id: 2,
  //     nombre: '',
  //     precio: 0,
  //     descripcion: '',
  //     alergenos: '',
  //   },
 
  //   {
  //     id: 3,
  //     nombre: '',
  //     precio: 0,
  //     descripcion: '',
  //     alergenos: ''
  //   },
 
  //   {
  //     id: 4,
  //     nombre: '',
  //     precio: 0,
  //     descripcion: '',
  //     alergenos: ''
  //   },
    
  //   {
  //     id: 5,
  //     nombre: '',
  //     precio: 0,
  //     descripcion: '',
  //     alergenos: ''
  //   },
 
  //   {
  //     id: 6,
  //     nombre: '',
  //     precio: 0,
  //     descripcion: '',
  //     alergenos: ''
  //   },
    
  //   {
  //     id: 7,
  //     nombre: '',
  //     precio: 0,
  //     descripcion: '',
  //     alergenos: ''
  //   },
  // ];
}