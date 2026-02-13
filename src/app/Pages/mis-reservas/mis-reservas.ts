import { Component, signal, OnInit, inject } from '@angular/core';
import { IReserva } from '../../Interfaces/IReserva';
import { IResena } from '../../Interfaces/Iresena';
import { ReservaService } from '../../Services/reserva-service';
import { Resenas } from '../../Services/resenas';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.css',
})
export class MisReservas implements OnInit {
  reservas = signal<IReserva[]>([]);
  loading = signal(true);
  error = signal('');

  private reservaService = inject(ReservaService);
  private resenaService = inject(Resenas);

  async ngOnInit() {
    await this.cargarReservas();
  }

  async cargarReservas() {
    this.loading.set(true);
    try {
      // 1. Traemos las reservas
      const reservas = await this.reservaService.getMisReservas();
      // 2. Traemos las reseñas para saber cuáles ya existen
      let reviews: IResena[] = [];
      try {
        reviews = await this.resenaService.getResenas();
      } catch (err) {
        console.warn('No se pudieron cargar las reseñas (acceso restringido):', err);
        // Si falla por permisos, continuamos mostrando las reservas sin el cruce de datos
      }

      // 3. Cruzamos la información: Si una reserva tiene reseña, le pegamos los datos
      const reservasMapeadas = reservas.map(r => {
        const reviewEncontrada = reviews.find(rev => rev.reserva_id === r.id);
        if (reviewEncontrada) {
          return { ...r, resena_id: reviewEncontrada.id, comentario_resena: reviewEncontrada.comentario, puntuacion: reviewEncontrada.puntuacion };
        }
        return r;
      });

      this.reservas.set(reservasMapeadas);
    } catch (e) {
      console.error(e);
      this.error.set('Error al cargar reservas.');
    } finally {
      this.loading.set(false);
    }
  }

  async cancelar(r: IReserva) {
    if (!r.id) return;
    const result = await Swal.fire({
      title: '¿Anular reserva?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d4af37',
      confirmButtonText: 'Sí, cancelar',
      background: '#1a1a1a',
      color: '#e6dcc9'
    });

    if (result.isConfirmed) {
      try {
        await this.reservaService.cancelarReserva(r.id);
        await this.cargarReservas();
        Swal.fire('Cancelada', 'Tu reserva ha sido anulada.', 'success');
      } catch (e) {
        Swal.fire('Error', 'No se pudo cancelar.', 'error');
      }
    }
  }

  manejarResena(r: IReserva) {
    if (!this.esFechaPasada(r)) {
      Swal.fire({
        title: '¡Aún no!',
        text: 'Podrás escribir la reseña tras disfrutar de tu reserva.',
        icon: 'info',
        confirmButtonColor: '#d4af37',
        background: '#1a1a1a',
        color: '#e6dcc9'
      });
      return;
    }
    this.abrirModalResena(r);
  }

  esFechaPasada(r: IReserva): boolean {
    const [y, m, d] = r.fecha.split('-').map(Number);
    const fecha = new Date(y, m - 1, d);
    const segs = typeof r.hora === 'number' ? r.hora : 0;
    fecha.setSeconds(fecha.getSeconds() + segs);
    return fecha.getTime() < Date.now();
  }

  async abrirModalResena(r: IReserva) {
    const esEdicion = !!r.resena_id;
    const userId = Number(localStorage.getItem('user_id')) || r.usuario_id || 0;

    const { value: formValues } = await Swal.fire({
      title: esEdicion ? 'Editar mi opinión' : 'Nueva Reseña',
      background: '#1a1a1a',
      color: '#e6dcc9',
      html: `
        <select id="swal-rating" class="swal2-input" style="background: #333; color: white; border: 1px solid #d4af37;">
          <option value="5" ${r.puntuacion === 5 ? 'selected' : ''}>⭐⭐⭐⭐⭐</option>
          <option value="4" ${r.puntuacion === 4 ? 'selected' : ''}>⭐⭐⭐⭐</option>
          <option value="3" ${r.puntuacion === 3 ? 'selected' : ''}>⭐⭐⭐</option>
          <option value="2" ${r.puntuacion === 2 ? 'selected' : ''}>⭐⭐</option>
          <option value="1" ${r.puntuacion === 1 ? 'selected' : ''}>⭐</option>
        </select>
        <textarea id="swal-comment" class="swal2-textarea" style="background: #333; color: white; border: 1px solid #d4af37;">${r.comentario_resena || ''}</textarea>
      `,
      showCancelButton: true,
      confirmButtonText: esEdicion ? 'Actualizar' : 'Enviar',
      confirmButtonColor: '#d4af37',
      preConfirm: () => ({
        puntuacion: parseInt((document.getElementById('swal-rating') as HTMLSelectElement).value),
        comentario: (document.getElementById('swal-comment') as HTMLTextAreaElement).value
      })
    });

    if (formValues) {
      try {
        const datosResena: IResena = {
          reserva_id: r.id!,
          usuario_id: userId, 
          comentario: formValues.comentario,
          puntuacion: formValues.puntuacion,
          fecha: new Date().toISOString().split('T')[0]
        };

       if (esEdicion) {
          await this.resenaService.updateResena(r.resena_id!, datosResena);
          Swal.fire('¡Actualizada!', 'Tu reseña se ha modificado correctamente.', 'success');
        } else {
          await this.resenaService.createResena(datosResena);
          Swal.fire('¡Creada!', 'Gracias por tu reseña.', 'success');
        }

        await this.cargarReservas(); 
        
      } catch (e: any) {
        const msg = e.error?.detail || 'Error al procesar la reseña.';
        Swal.fire('Atención', msg, 'warning');
      }
    }
  }

  formatearHora(h: string | number) {
    if (typeof h === 'string') return h;
    const hh = Math.floor(Number(h) / 3600);
    const mm = Math.floor((Number(h) % 3600) / 60);
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }

  estadoLabel(e?: string) {
    const l: any = { confirmada: 'Confirmada', cancelada: 'Cancelada' };
    return l[e || ''] || e;
  }
}