import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonTextarea, IonSelect, IonSelectOption, IonBackButton, IonButtons, IonCol, IonRow, IonGrid } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { UserService } from 'src/app/services/user.service';
import { Cliente } from 'src/models/cliente.model'; 
import { AlertController } from '@ionic/angular';  

@Component({
  selector: 'app-interesycualidad',
  templateUrl: './interesycualidad.page.html',
  styleUrls: ['./interesycualidad.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonContent,
    CommonModule,
    FormsModule,
    IonButton,
    IonItem,
    IonLabel,
    IonTextarea,
    IonSelect,
    IonSelectOption 
  ]
})
export class InteresycualidadPage implements OnInit {

  cliente: Cliente = {
    telefono: '',
    nombreReal: '',
    nombreAlias: '',
    fechaNacimiento: '',
    generoSeleccionado: '',
    descripcion: '',
    intereses: [],
    cualidades: [],
  };

  intereses = ['Viajar', 'Deportes', 'Música', 'Cine', 'Tecnología', 'Gastronomía', 'Lectura', 'Arte', 'Juegos'];
  cualidades = ['Honesto', 'Amable', 'Divertido', 'Creativo', 'Respetuoso', 'Optimista', 'Sociable', 'Inteligente', 'Aventurero'];

  clienteId: string = ''; 
  puedeContinuar = false;

  constructor(
    private router: Router, 
    private userService: UserService,
    private alertController: AlertController  
  ) { }

  ngOnInit() {
    const auth = getAuth();
    auth.onAuthStateChanged(user => {
      if (user) {
        this.clienteId = user.uid;  
        console.log('Usuario autenticado:', this.clienteId); 
      } else {
        console.error('No hay usuario autenticado');
      }
    });
  }

  validarSeleccion() {
    this.puedeContinuar = this.cliente.descripcion.trim() !== '' &&
                          this.cliente.intereses.length > 0 &&
                          this.cliente.cualidades.length > 0;
  }

  async continuar() {
    if (this.cliente.descripcion && this.cliente.intereses.length > 0 && this.cliente.cualidades.length > 0) {
      const updatedData: Partial<Cliente> = {
        descripcion: this.cliente.descripcion,
        intereses: this.cliente.intereses,
        cualidades: this.cliente.cualidades
      };

      await this.userService.updateClient(this.clienteId, updatedData); 

  
      const alert = await this.alertController.create({
        header: '¡Felicidades!',
        message: 'Tu perfil ha sido creado exitosamente. Ahora puedes disfrutar de "Más que un Match".',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigate(['/inicio']);
          }
        }]
      });

      await alert.present();  

    } else {
      console.error('Por favor completa todos los campos necesarios.');
    }
  }
}
