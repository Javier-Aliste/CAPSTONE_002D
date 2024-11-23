import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonAvatar, IonLabel, IonFooter, IonButtons, IonButton, IonBackButton } from '@ionic/angular/standalone';
import { ChatService } from 'src/app/services/chat.service';
import { Conversacion } from 'src/models/mensaje.model';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mensajeria',
  templateUrl: './mensajeria.page.html',
  styleUrls: ['./mensajeria.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButton, IonButtons, IonFooter, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonAvatar, IonLabel, CommonModule, FormsModule]
})
export class MensajeriaPage implements OnInit {
  conversaciones: Conversacion[] = [];

  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit() {
    this.cargarConversaciones();
  }

  cargarConversaciones() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      this.chatService.escucharConversacionesUsuario(user.uid, (conversaciones: Conversacion[]) => {
        this.conversaciones = conversaciones;
      });
    }
  }

  abrirChat(conversacionId: string) {

    this.router.navigate(['/chat', conversacionId]); 
  }



  irAlPerfil() {
    this.router.navigate(['/perfil']); // Redirige a la página de perfil
  }

  irAInicio() {
    this.router.navigate(['/inicio']); // Redirige a la página de inicio
  }

  irAMensajeria() {
    this.router.navigate(['/mensajeria']); // Redirige a la página de mensajería
  }
}
