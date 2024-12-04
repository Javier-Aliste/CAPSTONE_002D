import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonItem, IonCardTitle, IonCard, IonCardContent, IonCardHeader, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-nivel',
  templateUrl: './nivel.page.html',
  styleUrls: ['./nivel.page.scss'],
  standalone: true,
  imports: [IonButtons, IonBackButton, IonCardHeader, IonCardContent, IonCard, IonCardTitle, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NivelPage implements OnInit {
  uid: string | null = null; 
  mostrarNombreReal: boolean = false;
  nombreAlias: string | null = null; 
  nombreReal: string | null = null; 

  constructor(private userService: UserService, private auth: Auth) {}

  ngOnInit() {
    this.obtenerUid();
  }


  obtenerUid() {
    const user = this.auth.currentUser;
    if (user) {
      this.uid = user.uid;
      this.cargarDatosCliente(); 
    } else {
      console.error('No se pudo obtener el UID del cliente logueado.');
    }
  }

  // Método para cargar los datos del cliente logueado
  async cargarDatosCliente() {
    if (!this.uid) return;
    try {
      const cliente = await this.userService.obtenerCliente(this.uid);
      if (cliente) {
        this.nombreAlias = cliente.nombreAlias;
        this.nombreReal = cliente.nombreReal;
        this.mostrarNombreReal = cliente.mostrarNombreReal || false; 
      } else {
        console.error('Cliente no encontrado.');
      }
    } catch (error) {
      console.error('Error al cargar los datos del cliente:', error);
    }
  }

  // Método para actualizar mostrarNombreReal
  async subirDeNivel() {
    if (!this.uid) {
      console.error('No se ha inicializado el UID del cliente.');
      return;
    }

    try {
      this.mostrarNombreReal = true; 
      await this.userService.actualizarMostrarNombreReal(this.uid, true);
      console.log('El cliente ahora muestra su nombre real.');
      alert('¡Ahora tu nombre real será visible para otros usuarios!');
    } catch (error) {
      console.error('Error al intentar subir de nivel:', error);
      alert('Hubo un error al intentar subir de nivel.');
    }
  }

  // Método para obtener el nombre a mostrar en el header
  obtenerNombreAMostrar(): string {
    return this.mostrarNombreReal ? this.nombreReal || '' : this.nombreAlias || '';
  }
}
