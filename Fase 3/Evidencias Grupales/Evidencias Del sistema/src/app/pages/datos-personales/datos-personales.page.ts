import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.page.html',
  styleUrls: ['./datos-personales.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DatosPersonalesPage {
  nombreReal: string = '';
  nombreAlias: string = '';
  fechaNacimiento: string = '';
  generoSeleccionado: string = '';
  clienteId: string | undefined;

  constructor(private router: Router, private userService: UserService) {
    const auth = getAuth();
    auth.onAuthStateChanged(user => {
      if (user) {
        this.clienteId = user.uid;  
      } else {
        console.error('No hay usuario autenticado');
      }
    });
  }

  async onSubmit() {
    if (this.clienteId) {
      const updatedData = {
        nombreReal: this.nombreReal,
        nombreAlias: this.nombreAlias,
        fechaNacimiento: this.fechaNacimiento,
        generoSeleccionado: this.generoSeleccionado
      };
      
      try {
        await this.userService.updateClient(this.clienteId, updatedData);
        console.log('Datos personales actualizados correctamente');
        this.router.navigate(['/interesycualidad']);  
      } catch (error) {
        console.error('Error al actualizar los datos personales: ', error);
      }
    } else {
      console.error('El cliente ID no está disponible.');
    }
  }
}
