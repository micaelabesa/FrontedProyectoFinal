import { Component, signal, OnInit, inject } from '@angular/core';
import { IReserva } from '../../Interfaces/IReserva';
import { IUsuario } from '../../Interfaces/IUsuario';
import { ReservaService } from '../../Services/reserva-service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2'; // <--- Importamos SweetAlert2

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.css',
})
export class MisReservas implements OnInit {
  usuario: IUsuario | null = null;
  reservas = signal<IReserva[]>([]);
  loading = signal(true);
  error = signal('');

  private reservaService = inject(ReservaService);

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
    this.loading.set(true);
    this.error.set('');
    try {
      const response = await this.reservaService.getMisReservas();
      this.reservas.set(response);
    } catch (e) {
      this.error.set('No se pudieron cargar tus reservas.');
    } finally {
      this.loading.set(false);
    }
  }

  estadoLabel(estado?: IReserva['estado']) {
    const labels: any = {
      confirmada: 'Confirmada',
      cancelada: 'Cancelada',
      completada: 'Completada'
    };
    return labels[estado || ''] || estado || '—';
  }

  // para que sea más legible, formateamos la hora si viene en segundos desde medianoche.
  formatearHora(hora: string | number): string {
    if (typeof hora === 'string') return hora;
    
    const segundos = Number(hora);
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  }

  puedeResenar(r: IReserva): boolean {
    if (r.estado === 'cancelada') return false;
    
    // Crear fecha en zona horaria local
    const [año, mes, día] = r.fecha.split('-').map(Number);
    const fechaHora = new Date(año, mes - 1, día);
    
    // Sumarle los segundos
    const segundos = typeof r.hora === 'number' ? r.hora : 0;
    fechaHora.setSeconds(fechaHora.getSeconds() + segundos);
    
    // Comparar con ahora
    return fechaHora.getTime() < Date.now();
  }

  // --- ALERTA DE CANCELACIÓN ---
  async cancelar(r: IReserva) {
    if (!r.id) return;

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir la cancelación de esta reserva.",
      icon: 'warning',
      showCancelButton: true,
      background: '#1a1a1a',
      color: '#e6dcc9',
      confirmButtonColor: '#d4af37',
      cancelButtonColor: '#333',
      confirmButtonText: 'Sí, cancelar reserva',
      cancelButtonText: 'No, mantener'
    });

    if (result.isConfirmed) {
      try {
        await this.reservaService.cancelarReserva(r.id);
        this.reservas.set(this.reservas().filter(x => x.id !== r.id));
        
        Swal.fire({
          title: '¡Cancelada!',
          text: 'Tu reserva ha sido anulada con éxito.',
          icon: 'success',
          background: '#1a1a1a',
          color: '#e6dcc9',
          confirmButtonColor: '#d4af37'
        });
      } catch (e) {
        Swal.fire('Error', 'No se pudo cancelar la reserva.', 'error');
      }
    }
  }

  // --- ALERTA DE RESEÑA (INPUT) ---
  async resenar(r: IReserva) {
    if (!r.id) return;

    const { value: resena } = await Swal.fire({
      title: 'Tu experiencia en el restaurante',
      input: 'textarea',
      inputLabel: '¿Qué te pareció la comida?',
      inputPlaceholder: 'Escribe tu reseña aquí...',
      inputValue: r.resena || '',
      background: '#1a1a1a',
      color: '#e6dcc9',
      inputAttributes: {
        'aria-label': 'Escribe tu reseña'
      },
      showCancelButton: true,
      confirmButtonColor: '#d4af37',
      cancelButtonColor: '#333',
      confirmButtonText: 'Enviar reseña',
      cancelButtonText: 'Cancelar'
    });

    if (resena) {
      try {
        await this.reservaService.enviarReview({ reserva_id: r.id, resena });
        
        Swal.fire({
          title: '¡Enviada!',
          text: 'Gracias por compartir tu opinión con nosotros. 🍣',
          icon: 'success',
          background: '#1a1a1a',
          color: '#e6dcc9',
          confirmButtonColor: '#d4af37'
        });
        
        // Actualizamos localmente para mostrarla de inmediato
        r.resena = resena;
      } catch (e) {
        Swal.fire('Error', 'No pudimos guardar tu reseña.', 'error');
      }
    }
  }
}