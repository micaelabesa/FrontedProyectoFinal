import { Menu } from './Pages/menu/menu';
import { Routes } from '@angular/router';
import { Home } from './Pages/home/home';
import { Login } from './Pages/login/login';
import { Registro } from './Pages/registro/registro';
import { Reserva } from './Pages/reservas/reservas';
import { Pedidos } from './Pages/pedidos/pedidos';
import { ListaPlatos } from './Pages/lista-platos/lista-platos';
import { AdminDashboard } from './Pages/admin-dashboard/admin-dashboard';
import { authGuard } from './guards/auth-guard';
import { CreateMenu } from './Components/create-menu/create-menu';
import { AsignarPlatos } from './Pages/asignar-platos/asignar-platos';
import { NotFound } from './Pages/not-found/not-found';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'landing', component: Home },
    { path: 'menus', component: Menu },
    { path: 'login', component: Login },
    { path: 'registro', component: Registro },
    { path: 'pedidos', component: Pedidos, canActivate: [authGuard] },
    { path: 'lista_platos', component: ListaPlatos },
    { path: 'admin', component: AdminDashboard, canActivate: [authGuard] },
    { path: 'menus/:id', component: Menu },
    { path: 'reserva', component: Reserva, canActivate: [authGuard] },
    { path: 'admin/create-menu', component: CreateMenu },
    { path: 'admin/asignar-platos/:id', component: AsignarPlatos },
    { path: '**', component: NotFound }

    
];

