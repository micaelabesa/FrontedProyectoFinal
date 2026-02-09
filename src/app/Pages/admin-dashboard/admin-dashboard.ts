import { Component, inject, signal } from '@angular/core';
import { IMenu } from '../../Interfaces/IMenu';
import { Menus } from '../../Services/menus';
import { CommonModule } from '@angular/common';
import { IMenuDetalle } from '../../Interfaces/IMenuDetalle';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule ,RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {

  arrMenu = signal<IMenu[]>([]);
  MenuService = inject(Menus);
  menuSeleccionado = signal<IMenuDetalle | null>(null);
  

async ngOnInit() {
      const response= await this.MenuService.getAll();
      console.log(response);
      this.arrMenu.set(response);
  }


}
