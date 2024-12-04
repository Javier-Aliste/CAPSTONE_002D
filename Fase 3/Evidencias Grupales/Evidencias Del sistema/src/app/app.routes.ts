import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'sign-up',
    pathMatch: 'full',
  },
  {
    path: 'log-in',
    loadComponent: () => import('./pages/auth/log-in/log-in.page').then( m => m.LogInPage)
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/auth/sign-up/sign-up.page').then( m => m.SignUpPage)
  },
  {
    path: 'numero-telefonico',
    loadComponent: () => import('./pages/numero-telefonico/numero-telefonico.page').then( m => m.NumeroTelefonicoPage)
  },
  {
    path: 'datos-personales',
    loadComponent: () => import('./pages/datos-personales/datos-personales.page').then( m => m.DatosPersonalesPage)
  },
 
  {
    path: 'interesycualidad',
    loadComponent: () => import('./pages/interesycualidad/interesycualidad.page').then( m => m.InteresycualidadPage)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
  },

  {
    path: 'vertarjeta/:clienteId', // Ruta con parámetro para el id del cliente
    loadComponent: () => import('./pages/vertarjeta/vertarjeta.page').then(m => m.VertarjetaPage)
  },
  {
    path: 'ajustes',
    loadComponent: () => import('./pages/ajustes/ajustes.page').then( m => m.AjustesPage)
  },


  {
    path: 'mensajeria',
    loadComponent: () => import('./pages/mensajeria/mensajeria.page').then( m => m.MensajeriaPage)
  },
  {
    path: 'chat/:conversacionId',
    loadComponent: () => import('./pages/chat/chat.page').then(m => m.ChatPage)
  },

  {
    path: 'nivel',
    loadComponent: () => import('./pages/nivel/nivel.page').then( m => m.NivelPage)
  },




];
