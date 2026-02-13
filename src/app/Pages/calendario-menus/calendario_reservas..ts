import { Component, signal, OnInit, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Router } from '@angular/router';
import { ReservaService } from '../../Services/reserva-service';

@Component({
  selector: 'app-calendario-menus',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendario_reservas.html',
  styleUrl: './calendario_reservas.css',
})
export class CalendarioMenus implements OnInit {
  private reservasService = inject(ReservaService);
  private router = inject(Router);

  // Señal para controlar si el usuario es administrador
  isAdmin = signal(false);

  calendarOptions = signal<any>({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es', 
    firstDay: 1,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    events: [],
    eventClick: (info: any) => {
      console.log('Detalle de reserva ID:', info.event.id);
    }
  });

  async ngOnInit() {
    // 1. Detectamos el rol desde localStorage para el botón de volver
    const role = localStorage.getItem('user_role');
    this.isAdmin.set(role === 'admin');

    try {
      // 2. Cargamos las reservas desde el servicio
      const reservas = await this.reservasService.getallReservas(); 
      
      // 3. Mapeamos los datos al formato de FullCalendar
      const events = reservas.map((r: any) => ({
        id: r.id.toString(),
        title: `${r.hora} - Mesa #${r.mesa_id} (${r.party_size} pers.)`, 
        start: r.fecha, 
        backgroundColor: r.estado === 'confirmada' ? '#28a745' : '#ffc107',
        borderColor: '#333',
        textColor: r.estado === 'confirmada' ? '#fff' : '#000'
      }));

      this.calendarOptions.update(options => ({ ...options, events }));
    } catch (error) {
      console.error("Error cargando las reservas en el calendario", error);
    }
  }

  // Función para navegar hacia atrás según el rol
  volver() {
    if (this.isAdmin()) {
      // Cambia esta ruta por la de tu Dashboard Admin real
      this.router.navigate(['/admin/reservas']); 
    } else {
      // Cambia esta ruta por la de tu panel de usuario real
      this.router.navigate(['/mis-reservas']);
    }
  }
}