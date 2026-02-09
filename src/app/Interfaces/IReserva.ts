export interface ReservaCreate {
  fecha: string;
  hora: string;
  mesa_id: number;
  party_size: number;
  resena?: string;
}

export interface ReservaResponse {
    msg: string;
    item: {
        id: number;
        usuario_id: number;
        mesa_id: number;
        fecha: string;
        hora: string;
        party_size: number;
        estado: string;
        resena: string | null;
        created_at: string;
    };
    
}

export interface IReserva {
    id?: number;          // Opcional, lo crea el backend
    usuario_id?: number;  // Lo saca el backend del token
    mesa_id: number;      // Obligatorio
    fecha: string;        // Formato YYYY-MM-DD
    hora: string;         // Formato HH:mm
    party_size: number;   // Cantidad de personas
    estado?: 'confirmada' | 'cancelada' | 'completada';
    resena?: string;      // Observaciones
}