export interface Mensaje {
  id?: string;
  remitenteId: string;
  contenido: string;
  fechaEnvio: string;
  leido: boolean;
}

export interface Conversacion {
  id?: string;
  participantes: string[];            
  mensajes: Mensaje[];                
  fechaCreacion: string;              
  aliasDelOtroUsuario?: string;       
  ultimoMensaje?: string;             
  fechaUltimoMensaje?: string;        
}