import { Component, inject, output } from '@angular/core';
import { Menus } from '../../Services/menus';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-menu',
  standalone: true,
  imports: [ReactiveFormsModule], 
  templateUrl: './create-menu.html',
  styleUrl: './create-menu.css',
})
export class CreateMenu {
  menuService = inject(Menus);
  router = inject(Router);

  // Variable de tipo output para avisar al dashboard que recargue la lista
  menuCreado = output(); 

  form = new FormGroup({
    numero: new FormControl(0, [Validators.required]),
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    precio: new FormControl(0, [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    activo: new FormControl(true),
    foto_url: new FormControl('')
  });

  async onSubmit() {
  if (this.form.valid) {
    try {
      // 1. Preparamos los datos (convertimos el boolean a 1 o 0 para el Back)
      const datosParaEnviar = {
        ...this.form.value,
        // numero: 0,
        activo: this.form.value.activo ? 1 : 0
      };

      // 2. Llamada al servicio
      const response = await this.menuService.createMenu(datosParaEnviar as any);
      console.log('Menú creado con éxito:', response);

      // 3. Lanzamos el Swal con los 3 botones
      const result = await Swal.fire({
        title: '¡Menú Creado!',
        text: '¿Qué quieres hacer ahora?',
        icon: 'success',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Asignar Platos',   // Botón Amarillo (Principal)
        denyButtonText: 'Añadir otro menú',    // Botón Oscuro
        cancelButtonText: 'Ir al Dashboard',   // Botón Gris
        confirmButtonColor: '#ffc107',
        denyButtonColor: '#242424',
        cancelButtonColor: '#6c757d',
      });

      // 4. Lógica de navegación según la elección
      if (result.isConfirmed) {
        // Opción: Asignar Platos. Pasamos el ID del menú recién creado
        this.router.navigate(['/admin/asignar-platos', response.id]);
      } 
      else if (result.isDenied) {
        // Opción: Quedarse aquí para añadir otro. Limpiamos el form.
        this.form.reset({ activo: true, numero: 0,precio: 0 });
      } 
      else {
        // Opción: Ir al Dashboard (botón cancelar o cerrar)
        this.router.navigate(['/admin']);
      }

    } catch (error) {
      console.error('Error al guardar el menú:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar el menú. Nº de menu duplicado.',
        icon: 'error',
        confirmButtonColor: '#ffc107'
      });
    }
  }
}
}