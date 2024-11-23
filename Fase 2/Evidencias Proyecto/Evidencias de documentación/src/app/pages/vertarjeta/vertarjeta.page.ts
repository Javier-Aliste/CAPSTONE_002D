import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Cliente } from 'src/models/cliente.model';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { AlertController } from "@ionic/angular";
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonFooter } from "@ionic/angular/standalone";
import { ChatService } from 'src/app/services/chat.service';  // Asegúrate de importar el servicio ChatService

@Component({
  selector: 'app-vertarjeta',
  templateUrl: './vertarjeta.page.html',
  styleUrls: ['./vertarjeta.page.scss'],
  standalone: true,
  imports: [IonFooter, IonButton, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonBackButton, IonButtons, IonToolbar, IonTitle, IonHeader,  CommonModule, FormsModule]
})
export class VertarjetaPage implements OnInit {
  clienteId!: string;
  cliente: Cliente | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private alertController: AlertController, // Inyectar AlertController
    private chatService: ChatService  // Inyectar ChatService
  ) {}

  async ngOnInit() {
    this.clienteId = this.route.snapshot.paramMap.get('clienteId') as string;
  
    if (this.clienteId) {
      this.cliente = await this.userService.obtenerCliente(this.clienteId);
      if (!this.cliente) {
        // Redirigir a una página de error o mostrar un mensaje
        this.router.navigate(['/error']);
      }
    } else {
      // Redirigir a la página de inicio si no se pasa el clienteId
      this.router.navigate(['/inicio']);
    }
  }

  async Irchat() {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user && this.clienteId) {
      // Crear la conversación (si no existe)
      const conversacionId = await this.chatService.crearConversacion([user.uid, this.clienteId]);
  
      // Mostrar alerta de confirmación
      const alert = await this.alertController.create({
        header: '¿Deseas iniciar el chat?',
        message: `¿Quieres iniciar el chat con ${this.cliente?.nombreAlias}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Chat no iniciado');
            }
          },
          {
            text: 'Aceptar',
            handler: () => {
              // Navegar a la página de chat con el conversacionId
              this.router.navigate(['/chat', conversacionId]);
            }
          }
        ]
      });
  
      await alert.present();
    }
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
}
