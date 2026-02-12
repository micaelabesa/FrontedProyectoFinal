
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IUsuario } from '../../Interfaces/IUsuario';
import { IReserva } from '../../Interfaces/IReserva';
import { ReservaService } from '../../Services/reserva-service';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-usuario.html',
  styleUrls: ['./perfil-usuario.css'],
})
export class PerfilUsuario implements OnInit {

  usuario: IUsuario | null = null;

  reservas = signal<IReserva[]>([]);
  loading = true;
  error = '';

  constructor(private reservaService: ReservaService) {}

  async ngOnInit() {
    this.usuario = this.getUsuarioLocal();
    await this.cargarReservas();
  }

  private getUsuarioLocal(): IUsuario | null {
    try {
      const raw = localStorage.getItem('user');
      return raw ? (JSON.parse(raw) as IUsuario) : null;
    } catch {
      return null;
    }
  }

  async cargarReservas() {
    this.loading = true;
    this.error = '';

    try {
      const response = await this.reservaService.getMisReservas();
      this.reservas.set(response);
      console.log('Reservas cargadas:', this.reservas());
    } catch (e) {
      console.log(e);
      this.error = 'No se pudieron cargar tus reservas. ¿Has iniciado sesión?';
    } finally {
      this.loading = false;
    }
  }

  estadoLabel(estado?: IReserva['estado']) {
    if (!estado) return '—';
    if (estado === 'confirmada') return 'Confirmada';
    if (estado === 'cancelada') return 'Cancelada';
    if (estado === 'completada') return 'Completada';
    return estado;
  }

  puedeResenar(r: IReserva): boolean {
    // no reseñamos si está cancelada
    if (r.estado === 'cancelada') return false;

    // reseña solo si fecha+hora ya pasó
    const fechaHora = new Date(`${r.fecha}T${r.hora}`);
    return fechaHora.getTime() < Date.now();
  }

  async cancelar(r: IReserva) {
    if (!r.id) return;

    const ok = confirm('¿Seguro que quieres cancelar esta reserva?');
    if (!ok) return;

    try {
      await this.reservaService.cancelarReserva(r.id);
      // quita de la lista sin recargar todo
      this.reservas.set(this.reservas().filter(x => x.id !== r.id));
    } catch (e) {
      alert('No se pudo cancelar la reserva.');
    }
  }

  async resenar(r: IReserva) {
    if (!r.id) return;

    const resena = prompt('Escribe tu reseña:');
    if (!resena) return;

    try {
      await this.reservaService.enviarReview({ reserva_id: r.id, resena });
      alert('¡Gracias por tu reseña! 🍣');
      // refleja en UI
      r.resena = resena;
    } catch (e) {
      alert('No se pudo enviar la reseña.');
    }
  }
}

