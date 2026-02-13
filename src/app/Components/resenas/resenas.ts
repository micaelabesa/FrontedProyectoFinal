import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Resenas as ResenasService } from '../../Services/resenas'; 
import { IResena } from '../../Interfaces/Iresena';
import { DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [DatePipe, NgClass],
  templateUrl: './resenas.html',
  styleUrl: './resenas.css',
})
export class ResenasComponent implements OnInit { 
  
  private resenasService = inject(ResenasService);
  private cdr = inject(ChangeDetectorRef);

  listaResenas: IResena[] = [];
  isAdmin: boolean = false;
  userId: number | null = null;
   router = inject(Router);

  async ngOnInit() {
    // LEEMOS COMO GUARDA EL LOGIN:
    const role = localStorage.getItem('user_role');
    const idStored = localStorage.getItem('user_id'); // Asegúrate de que el login guarde 'user_id'

    this.isAdmin = role === 'admin';
    this.userId = idStored ? parseInt(idStored) : null;

    await this.cargarResenas();
  }

  async cargarResenas() {
    try {
      // Llamamos al servicio (aquí el Interceptor ya debería estar pegando el token)
      const todas: IResena[] = await this.resenasService.getResenas();
      
      if (this.isAdmin) {
        this.listaResenas = todas;
      } else {
        this.listaResenas = todas.filter((r: IResena) => r.usuario_id === this.userId);
      }
      this.cdr.markForCheck(); // Forzamos la actualización de la vista
    } catch (error) {
      console.error('Error al traer reseñas:', error);
    }
  }

    volver() {
    if (this.isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/perfil-usuario']);
    }
  }
}