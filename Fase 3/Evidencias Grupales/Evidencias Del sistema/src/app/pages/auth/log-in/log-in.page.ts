import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from '../../../services/firebase.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LogInPage {
  email: string = '';
  password: string = '';

  constructor(private firebase: FirebaseService, private router: Router) {}

  onLogIn() {
    if (!this.email || !this.password) {
      console.error('Por favor, ingresa un correo y una contraseña');
      return;
    }
    this.firebase.logIn(this.email, this.password).subscribe({
      next: (res) => {
        console.log('Inicio de sesión exitoso', res);
        this.router.navigate(['/inicio']); 
      },
      error: (err) => {
        console.error('Error en el inicio de sesión', err);

        alert('Error en el inicio de sesión. Verifica tus credenciales.');
      }
    });
  }
}
