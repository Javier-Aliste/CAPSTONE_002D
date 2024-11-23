import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, push, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { Conversacion, Mensaje } from 'src/models/mensaje.model';
import { getAuth } from 'firebase/auth';
import { UserService } from './user.service'; // Asegúrate de que esté configurado correctamente
import { Cliente } from 'src/models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private db = getDatabase();

  constructor(private userService: UserService) { }

  // Método para crear una nueva conversación
  async crearConversacion(participantes: string[]): Promise<string> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const nuevoIdConversacion = push(ref(this.db, 'conversaciones')).key;
    const nuevaConversacion: Conversacion = {
      id: nuevoIdConversacion!,
      participantes: participantes,
      mensajes: [],
      fechaCreacion: new Date().toISOString(),
    };

    // Guardar la nueva conversación en la base de datos
    await set(ref(this.db, 'conversaciones/' + nuevoIdConversacion), nuevaConversacion);

    return nuevoIdConversacion!;
  }

  // Método para agregar un mensaje a una conversación
  async agregarMensaje(conversacionId: string, mensaje: Mensaje): Promise<void> {
    const nuevoMensajeRef = push(ref(this.db, 'conversaciones/' + conversacionId + '/mensajes'));
    const mensajeId = nuevoMensajeRef.key;

    const mensajeData: Mensaje = {
      id: mensajeId!,
      ...mensaje
    };

    // Agregar el mensaje a la conversación en la base de datos
    await set(nuevoMensajeRef, mensajeData);
  }

  // Método para escuchar las conversaciones en tiempo real
  escucharConversacionesUsuario(userId: string, callback: (conversaciones: Conversacion[]) => void): void {
    const refConversaciones = ref(this.db, 'conversaciones');
    const conversacionesQuery = query(refConversaciones, orderByChild('fechaCreacion'));

    onValue(conversacionesQuery, (snapshot) => {
      const conversaciones: Conversacion[] = [];

      snapshot.forEach((conversacionSnap) => {
        const data = conversacionSnap.val();
        

        if (data.participantes && Array.isArray(data.participantes) && data.participantes.includes(userId)) {
          // Identificar al otro participante en la conversación
          const otroUsuarioId = data.participantes.find((id: string) => id !== userId);

          // Obtener el nombreAlias 
          if (otroUsuarioId) {
            this.userService.obtenerCliente(otroUsuarioId).then((otroUsuario: Cliente | null) => {
              data.aliasDelOtroUsuario = otroUsuario ? otroUsuario.nombreAlias : 'Usuario desconocido';
              conversaciones.push(data);
              callback(conversaciones); // Actualizamos la lista de conversaciones en tiempo real
            });
          }
        }
      });
    });
  }

  // Método para obtener todos los mensajes de una conversación
  async obtenerMensajesDeConversacion(conversacionId: string): Promise<Mensaje[]> {
    const mensajesRef = ref(this.db, 'conversaciones/' + conversacionId + '/mensajes');
    const snapshot = await get(mensajesRef);
    const mensajes: Mensaje[] = [];

    snapshot.forEach((mensajeSnap) => {
      const mensajeData = mensajeSnap.val();
      mensajes.push(mensajeData);
    });

    return mensajes;
  }

  // Método para escuchar nuevos mensajes en una conversación en tiempo real
  escucharMensajes(conversacionId: string, callback: (mensaje: Mensaje) => void): void {
    const mensajesRef = ref(this.db, 'conversaciones/' + conversacionId + '/mensajes');
    
    // Queremos escuchar solo los mensajes más recientes, para no sobrecargar la interfaz
    const mensajesQuery = query(mensajesRef, orderByChild('fechaEnvio'), limitToLast(20));

    // Mantener un array local de mensajes para evitar duplicados
    const mensajesRecibidos: string[] = [];

    onValue(mensajesQuery, (snapshot) => {
      snapshot.forEach((mensajeSnap) => {
        const mensajeData = mensajeSnap.val();

        // Verificar si el mensaje ya fue recibido
        if (!mensajesRecibidos.includes(mensajeData.id)) {
          mensajesRecibidos.push(mensajeData.id); // Marcar el mensaje como recibido
          callback(mensajeData); // Solo actualizamos si es un nuevo mensaje
        }
      });
    });
  }
  
}
