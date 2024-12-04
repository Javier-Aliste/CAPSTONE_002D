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
  nombreRealDelOtroUsuario?: string; 
  mostrarNombreReal?: boolean;
  ultimoMensaje?: string;             
  fechaUltimoMensaje?: string;        
}