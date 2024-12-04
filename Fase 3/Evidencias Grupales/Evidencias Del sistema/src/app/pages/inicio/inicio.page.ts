import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { getAuth } from 'firebase/auth';
import { Cliente } from 'src/models/cliente.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  clientes: Cliente[] = [];
  clienteId: string | undefined;

  constructor(private userService: UserService, private router: Router) {}

  async ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      this.clienteId = user.uid; 
      this.clientes = await this.userService.getClientesExcluyendo(this.clienteId);
    } else {
      console.error('No hay usuario autenticado');
    }
  }

  irAVerTarjeta(clienteId: string) {
    this.router.navigate(['/vertarjeta', clienteId]);
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


  calcularEdad(fechaNacimiento: string): number {
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mesDiff = hoy.getMonth() - fechaNac.getMonth();
    
 
    if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    return edad;
  }
}
