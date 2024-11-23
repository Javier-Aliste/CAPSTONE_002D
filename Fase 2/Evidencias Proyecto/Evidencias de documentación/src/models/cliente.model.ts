export interface Cliente {
  id?: string;
  telefono: string;        
  nombreReal: string;       
  nombreAlias: string;     
  fechaNacimiento: string;  
  generoSeleccionado: string; 
  descripcion: string;     
  intereses: string[];      
  cualidades: string[];   
  fotosAdicionales?: string[];
}
