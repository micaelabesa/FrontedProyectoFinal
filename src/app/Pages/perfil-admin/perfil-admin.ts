import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-admin',
  imports: [],
  templateUrl: './perfil-admin.html',
  styleUrl: './perfil-admin.css',
})
export class PerfilAdmin {

  private router = inject(Router);
  
  irAGestionarMenus() {
    this.router.navigate(['admin-dashnoard']);
  }

  irAVerResenas() {
    this.router.navigate(['/resenas']);
  }

  irAGestionarReservas() {
    this.router.navigate(['/admin/reservas']);
  }

  irAGestionarPlatos() {
  this.router.navigate(['lista_platos']); 
}

irAGestionarMesas() {
  this.router.navigate(['admin/gestion-mesas']);
}
  logout() {
    localStorage.removeItem('token'); // O tu lógica de logout
    this.router.navigate(['/login']);
  }
}


