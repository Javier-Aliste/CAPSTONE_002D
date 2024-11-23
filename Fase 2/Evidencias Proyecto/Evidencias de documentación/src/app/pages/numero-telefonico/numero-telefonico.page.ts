import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-numero-telefonico',
  templateUrl: './numero-telefonico.page.html',
  styleUrls: ['./numero-telefonico.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NumeroTelefonicoPage {
  telefono: string = '';  
  clienteId: string | undefined; // UID del cliente
  telefonoValido: boolean = true; // Variable para indicar si el teléfono es válido

  constructor(private router: Router, private userService: UserService) {
    const auth = getAuth();
  
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.clienteId = user.uid; 
      } else {
        this.router.navigate(['/log-in']); 
      }
    });
  }

  async onSubmit() {

    if (!/^[0-9]{8,15}$/.test(this.telefono)) {
      this.telefonoValido = false; 
      return;
    }

    this.telefonoValido = true; 

    if (this.telefono) {
      console.log('Número telefónico ingresado:', this.telefono);

      if (this.clienteId) { 
        // Actualizamos el cliente con su número telefónico
        await this.userService.updateClient(this.clienteId, { telefono: this.telefono });
        this.router.navigate(['/datos-personales']); // Navegar a otra página
      } else {
        console.error('El cliente ID no está disponible.');
      }
    }
  }
}
