import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { Mensaje } from 'src/models/mensaje.model';
import { getAuth } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonContent, IonToolbar, IonTitle, IonButton, IonFooter, IonButtons, IonBackButton } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [IonBackButton, IonButtons, IonButton, IonTitle, IonToolbar, IonContent, IonHeader, CommonModule, FormsModule],
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  public conversacionId: string = '';
  public mensajes: Mensaje[] = [];
  public contenidoMensaje: string = '';
  private _userId: string = '';
  public aliasDelOtroUsuario: string = '';
  public nombreRealDelOtroUsuario: string = ''; 
  public mostrarNombreReal: boolean = false; 
  private scrollToBottom: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private router: Router,
    private userService: UserService 
  ) {}

  ngOnInit() {
    this.conversacionId = this.route.snapshot.paramMap.get('conversacionId')!;
    const user = getAuth().currentUser;
    if (user) {
      this._userId = user.uid;
    } else {
      console.error('Usuario no autenticado');
    }

    // Escuchar las conversaciones y mensajes
    this.chatService.escucharConversacionesUsuario(this._userId, (conversaciones) => {
      const conversacion = conversaciones.find(c => c.id === this.conversacionId);
      if (conversacion) {
        this.aliasDelOtroUsuario = conversacion.aliasDelOtroUsuario || 'Usuario desconocido';
        this.nombreRealDelOtroUsuario = conversacion.nombreRealDelOtroUsuario || 'Usuario desconocido';
      }
    });

    // Escuchar mensajes nuevos y agregar a la lista
    this.chatService.escucharMensajes(this.conversacionId, (mensaje) => {
      this.mensajes.push(mensaje);
      if (this.scrollToBottom) {
        this.scrollToBottomFn();
      }
    });
    // Cargar mensajes iniciales
    this.cargarMensajes();


    this.userService.obtenerCliente(this._userId).then(cliente => {
      if (cliente) {
        this.mostrarNombreReal = cliente.mostrarNombreReal || false;
      }
    });
  }

  get userId(): string {
    return this._userId;
  }

  // Cargar mensajes anteriores de la conversación
  async cargarMensajes() {
    try {
      const mensajes = await this.chatService.obtenerMensajesDeConversacion(this.conversacionId);
      this.mensajes = mensajes;
    } catch (error) {
      console.error('Error al cargar mensajes', error);
    }
  }

  // Enviar un mensaje
  async enviarMensaje() {
    if (this.contenidoMensaje.trim() === '') {
      return;
    }

    const nuevoMensaje: Mensaje = {
      contenido: this.contenidoMensaje,
      remitenteId: this.userId,
      fechaEnvio: new Date().toISOString(),
      leido: false
    };

    try {
      await this.chatService.agregarMensaje(this.conversacionId, nuevoMensaje);
      this.contenidoMensaje = '';
      this.scrollToBottom = true;
    } catch (error) {
      console.error('Error al enviar mensaje', error);
    }
  }

  // Función para desplazar automáticamente hacia el último mensaje
  scrollToBottomFn() {
    setTimeout(() => {
      const content = document.querySelector('ion-content');
      if (content) {
        content.scrollToBottom(300); 
      }
    });
  }

  // Función para obtener el nombre del otro usuario (según la preferencia de mostrar nombre real)
  obtenerNombreDelOtroUsuario(): string {
    return this.mostrarNombreReal ? this.nombreRealDelOtroUsuario : this.aliasDelOtroUsuario;
  }

  irANivel() {
    this.router.navigate(['/nivel']); 
  }
}
