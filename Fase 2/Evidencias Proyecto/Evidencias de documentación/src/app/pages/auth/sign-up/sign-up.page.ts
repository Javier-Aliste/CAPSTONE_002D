import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';  
import { FirebaseService } from '../../../services/firebase.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SignUpPage {
  email: string = '';   
  password: string = '';

  constructor(private firebase: FirebaseService, private router: Router) {}

  signUp() {
    if (!this.email || !this.password) {
      console.error('Por favor, ingresa un correo y una contraseña');
      return;
    }
    this.firebase.signUp(this.email, this.password).subscribe({
      next: (res) => {
        console.log('Registro exitoso', res);
        this.router.navigate(['/numero-telefonico']); // Redirigir después del registro
      },
      error: (err) => {
        console.error('Error en el registro', err);
        alert('Error en el registro. Intenta nuevamente.');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/log-in']); 
  }
}
