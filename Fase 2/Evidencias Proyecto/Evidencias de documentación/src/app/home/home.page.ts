import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'; // Asegúrate de que la ruta sea correcta
import { getAuth } from 'firebase/auth';
import { Cliente } from 'src/models/cliente.model';
import { IonHeader, IonToolbar, IonCard, IonButtons, IonBackButton, IonTitle, IonContent, IonCardHeader, IonCardTitle, IonItem, IonButton, IonList, IonLabel, IonFooter } from "@ionic/angular/standalone";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  clientes: Cliente[] = []; // Almacena la lista de clientes
  clienteId: string | null = null; // Almacena el ID del cliente autenticado

  constructor(private userService: UserService) {}

  ngOnInit() {


  }
}
