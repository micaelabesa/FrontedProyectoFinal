import { IMenuDetalle } from './../Interfaces/IMenuDetalle';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IMesa } from '../Interfaces/IMesa';
import { IReserva, ReservaResponse } from '../Interfaces/IReserva';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  
  private http = inject(HttpClient);
  private base_url = 'https://upgradehubfinalproject-production.up.railway.app';

  getMesas() {
    return firstValueFrom(
      this.http.get<IMesa[]>(`${this.base_url}/mesas`)
    )
  
  }
  createReserva(reserva: IReserva) {
    return firstValueFrom(
      this.http.post<ReservaResponse>(`${this.base_url}/reservas`, reserva )
   )
 }
  







}
