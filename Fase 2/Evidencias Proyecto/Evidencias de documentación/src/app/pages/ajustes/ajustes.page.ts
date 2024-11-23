import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ToastController, AlertController, IonButton, IonFooter, IonButtons, IonInput, IonLabel, IonItem, IonList, IonBackButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonItem, IonLabel, IonButtons, IonFooter, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput]
})
export class AjustesPage implements OnInit {

  modoOscuro: boolean = false;
  telefonoAntiguo: string = ''; // Guardar el número antiguo
  nuevoTelefono: string = ''; // Guardar el nuevo número

  constructor(
    private auth: Auth,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private userService: UserService // Añadir el UserService aquí
  ) { }

  ngOnInit() {
    this.modoOscuro = document.body.classList.contains('dark');
    const user = this.auth.currentUser;
    if (user) {
      // Supongamos que tienes un método para obtener el cliente y su número de teléfono
      this.userService.obtenerCliente(user.uid).then(cliente => {
        if (cliente) {
          this.telefonoAntiguo = cliente.telefono; // Asigna el teléfono antiguo
        }
      });
    }
  }

  async confirmarCerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar tu sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cierre de sesión cancelado');
          }
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.cerrarSesion();
          }
        }
      ]
    });
    await alert.present();
  }

  async cerrarSesion() {
    try {
      await this.auth.signOut();
      await this.presentToast('Sesión cerrada exitosamente');
      this.router.navigate(['/log-in']); // Redirige a la página de inicio de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      await this.presentToast('Error al cerrar sesión');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  alternarModoOscuro() {
    this.modoOscuro = !this.modoOscuro;
    document.body.classList.toggle('dark', this.modoOscuro);
  }

  irAlPerfil() {
    this.router.navigate(['/perfil']);
  }

  irAInicio() {
    this.router.navigate(['/inicio']);
  }

  irAMensajeria() {
    this.router.navigate(['/mensajeria']);
  }

  async confirmarEliminacion() {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación de cuenta cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const user = this.auth.currentUser; // Obtén el usuario actual
            if (user) {
              await this.userService.eliminarCliente(user.uid); // Llama al método de eliminación
              await this.presentToast('Cuenta eliminada exitosamente');
              await this.auth.signOut(); // Cierra sesión después de eliminar la cuenta
              this.router.navigate(['/log-in']); // Redirige a la página de inicio de sesión
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async actualizarTelefono() {
    const user = this.auth.currentUser;
    if (user) {
      const alert = await this.alertController.create({
        header: 'Actualizar número de teléfono',
        message: `¿Confirmas que deseas cambiar tu número de ${this.telefonoAntiguo} a ${this.nuevoTelefono}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Actualizar',
            handler: async () => {
              await this.userService.updateTelefono(user.uid, this.nuevoTelefono);
              this.telefonoAntiguo = this.nuevoTelefono; // Actualiza el número antiguo
              this.nuevoTelefono = ''; // Limpia el campo de nuevo teléfono
              await this.presentToast('Número de teléfono actualizado exitosamente');
            }
          }
        ]
      });
      await alert.present();
    }
  }


  

  
}
