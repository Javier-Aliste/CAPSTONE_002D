import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption, IonFooter, IonButtons, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonIcon, AlertController } from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user.service';
import { Cliente } from 'src/models/cliente.model';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
     IonButtons, IonFooter, 
    IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, IonButton, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption
  ]
})
export class PerfilPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

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

  clienteId: string = ''; // Inicializa clienteId
  fotosAdicionales: string[] = []; // Array para almacenar URLs de fotos adicionales

  constructor(private userService: UserService, private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    const auth = getAuth();
    auth.onAuthStateChanged(user => {
      if (user) {
        this.clienteId = user.uid;  // Establece el clienteId si el usuario está autenticado
        this.cargarPerfil(this.clienteId); // Cargar el perfil del cliente
      }
    });
  }

  async cargarPerfil(clienteId: string) {
    const clienteObtenido = await this.userService.obtenerCliente(clienteId);
    if (clienteObtenido) {
      this.cliente = clienteObtenido;
      this.fotosAdicionales = clienteObtenido.fotosAdicionales || []; // Carga las fotos adicionales si existen
    }
  }

  async guardarCambios() {
    const updatedData: Partial<Cliente> = {
      nombreAlias: this.cliente.nombreAlias,
      generoSeleccionado: this.cliente.generoSeleccionado,
      descripcion: this.cliente.descripcion,
      intereses: this.cliente.intereses,
      cualidades: this.cliente.cualidades,
      fotosAdicionales: this.fotosAdicionales 
    };

    await this.userService.updateClient(this.clienteId, updatedData); // Usa updateClient para actualizar los datos
    console.log('Cambios guardados con éxito.');
  }

  // Método para cargar una foto adicional
  async subirFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.clienteId) {
      const archivo = input.files[0];
      const fotoURL = await this.userService.subirFotoAdicional(this.clienteId, archivo);
      this.fotosAdicionales.push(fotoURL); // Agregar la URL al array local para mostrarla en el perfil
    }
  }

  async confirmarEliminarFoto(index: number) {
    const alert = await this.alertController.create({
      header: 'Eliminar Foto',
      message: '¿Deseas borrar esta foto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarFoto(index);
          },
        },
      ],
    });

    await alert.present();
  }

  eliminarFoto(index: number) {
    this.fotosAdicionales.splice(index, 1);
  }
  
  agregarNuevaFoto() {
    this.fileInput.nativeElement.click();
  }

  // Métodos de navegación
  irAlPerfil() {
    this.router.navigate(['/perfil']);
  }

  irAInicio() {
    this.router.navigate(['/inicio']);
  }

  irAMensajeria() {
    this.router.navigate(['/mensajeria']);
  }

  irAjustes() {
    this.router.navigate(['/ajustes']);
  }
}
