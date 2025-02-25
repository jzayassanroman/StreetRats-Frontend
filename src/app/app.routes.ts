import { Routes } from '@angular/router';
import {AboutUsComponent} from './features/about-us/about-us.component';
import {AppComponent} from './app.component';
import {HomeComponent} from './features/home/home.component';
import {AdminProductosComponent} from './features/admin-productos/admin-productos.component';
import {LoginComponent} from './features/login/login.component';
import {CrearCuentaComponent} from './features/crear-cuenta/crear-cuenta.component';
import {ProductosComponent} from './features/productos/productos.component';
import {VerificacionComponent} from './features/verificacion/verificacion.component';
import {ProductoinComponent} from './features/productoin/productoin.component';
import {PaymentComponent} from './features/payment/payment.component';
import {EditarClienteComponent} from './features/editar-cliente/editar-cliente.component';
import {roleGuardGuard} from './services/role-guard';
import {Rol} from './entity/Rol';




import { TiendasComponent } from './features/tiendas/tiendas.component';
import { AdminDashboardComponent } from './features/admin-dashboard/admin-dashboard.component';
import {HistorialPedidosComponent} from './features/historial-pedidos/historial-pedidos.component';
import {GestionPedidosComponent} from './features/gestion-pedidos/gestion-pedidos.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tiendas', component: TiendasComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'crear-cuenta', component: CrearCuentaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'listadoproducto', component: ProductosComponent },
  { path: 'verificar', component: VerificacionComponent },
  { path: 'productoin/:id', component: ProductoinComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'editar-cliente', component: EditarClienteComponent},
  {path: 'historial-pedidos',component:HistorialPedidosComponent},
  {path: 'productos-filtrados', component: ProductosFiltradosComponent}

  //Rutas de Admin
  {
    path: 'admindashboard',
    component: AdminDashboardComponent,
    canActivate: [roleGuardGuard], // Usa el guard
    data: { roles: ['Admin'] } // Solo admin puede acceder
  },

  {
    path: 'gestion',
    component: GestionPedidosComponent,
    canActivate: [roleGuardGuard], // Usa el guard
    data: { roles: ['Admin'] } // Solo admin puede acceder
  },


  { path: 'payment', component: PaymentComponent },
  { path: 'adminproductos', component: AdminProductosComponent }
];
