import { Component, inject, OnInit } from '@angular/core'; // Añadido OnInit
import { Menus } from '../../Services/menus';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Añadido RouterLink
import { IVinculoPlato } from '../../Interfaces/IMenuDetalle';
import { IPlato } from '../../Interfaces/IPlatos';
import Swal from 'sweetalert2';
import { UpperCasePipe } from '@angular/common';
import { Platos } from '../../Services/platos';

@Component({
  selector: 'app-asignar-platos',
  standalone: true,
  imports: [UpperCasePipe, RouterLink], // Añadido RouterLink para el botón cancelar
  templateUrl: './asignar-platos.html',
  styleUrl: './asignar-platos.css',
})
export class AsignarPlatos implements OnInit { // Implementamos OnInit

  private menuService = inject(Menus); // PARA VINCULAR PLATOS 
  private platosService = inject(Platos)// PARA TARER LOS PLATOS 
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  menuId!: number;
  listaPlatosDB: IPlato[] = []; 
  platosParaAsignar: IVinculoPlato[] = []; 

  // --- PASO 1: CARGAR LOS DATOS AL ENTRAR ---
  async ngOnInit() {
    // Obtenemos el ID de la URL ###TODO: ESTA PRIMERA PARTE ME LA DICE GEEMINI Y NO SE SI ES OK O SEA NO ENTIENDDO EL SNAPSHOT
    const idParam = this.route.snapshot.paramMap.get('id');
    this.menuId = Number(idParam);
    console.log('ID del menú capturado:', this.menuId);

    try {
      // Cargamos todos los platos disponibles de la DB
      // Asegúrate de que este método existe en tu servicio de Menus
      const response = await this.platosService.getAll();
      console.log('Platos cargados en el componente:', this.listaPlatosDB);
      this.listaPlatosDB = response;
    } catch (error) {
      console.error('Error al cargar platos:', error);
      Swal.fire('Error', 'No se pudieron cargar los platos del sistema', 'error');
    }
  }

  // --- PASO 2: GESTIONAR LA SELECCIÓN ---
  onRoleChange(plato: IPlato, event: any) {
    const rolElegido = event.target.value;

    if (rolElegido === "") {
      this.platosParaAsignar = this.platosParaAsignar.filter(p => p.plato_id !== plato.id);
    } else {
      const nuevoVinculo: IVinculoPlato = {
        menu_id: this.menuId,
        plato_id: plato.id,
        rol: rolElegido as 'entrante' | 'principal' | 'postre'
      };

      const index = this.platosParaAsignar.findIndex(p => p.plato_id === plato.id);
      if (index > -1) {
        this.platosParaAsignar[index] = nuevoVinculo;
      } else {
        this.platosParaAsignar.push(nuevoVinculo);
      }
    }
    console.log('Platos listos para enviar:', this.platosParaAsignar);
  }

  // --- PASO 3: GUARDAR EN LA BASE DE DATOS ---
  async confirmarAsignacion() {
  
    if (this.platosParaAsignar.length === 0) {
        Swal.fire('Aviso', 'Selecciona al menos un plato antes de guardar', 'info');
        return;
    }

    try {
      // Enviamos cada vínculo a la tabla intermedia
      for (const vinculo of this.platosParaAsignar) {
        await this.menuService.vincularPlato(vinculo); 
      }

      await Swal.fire({
        title: '¡Enlazado!',
        text: 'Los platos se han guardado en el menú correctamente',
        icon: 'success',
        confirmButtonColor: '#ffc107'
      });

      this.router.navigate(['/admin']); 

    } catch (error) {
      console.error('Error al vincular:', error);
      Swal.fire('Error', 'No se pudieron guardar los platos. Revisa la consola.', 'error');
    }
  }

  
}