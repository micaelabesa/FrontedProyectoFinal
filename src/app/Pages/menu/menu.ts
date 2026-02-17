

import { Component, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IMenu } from "../../Interfaces/IMenu";
import { Menus } from "../../Services/menus";

@Component({
  selector: "app-menu",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./menu.html",
  styleUrl: "./menu.css",
})
export class Menu {
  arrMenu = signal<IMenu[]>([]);
  private MenuService = inject(Menus);

  async ngOnInit() {
    try {
      const response = await this.MenuService.getAll();
      this.arrMenu.set(response);
    } catch (error) {
      console.error("Error al cargar menús", error);
    }
  }
}