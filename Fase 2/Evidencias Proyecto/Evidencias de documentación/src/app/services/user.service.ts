import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, collection, getDocs, getDoc, deleteDoc, updateDoc, addDoc } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Cliente } from 'src/models/cliente.model';
import { arrayUnion } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) { }


  // Método para actualizar el perfil del cliente
  async updateClient(clienteId: string, updatedData: Partial<Cliente>) {
    try {
      const clienteDocRef = doc(this.firestore, `clientes/${clienteId}`);
      await setDoc(clienteDocRef, updatedData, { merge: true });
      console.log('Perfil de cliente actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el perfil de cliente: ', error);
    }
  }
  
  // Método para obtener todos los clientes excluyendo al que está logueado
  async getClientesExcluyendo(clienteId: string): Promise<Cliente[]> {
    try {
      const clientesSnapshot = await getDocs(collection(this.firestore, 'clientes'));
      return clientesSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() as Cliente }))
        .filter(cliente => clienteId !== cliente.id); // Filtra el cliente logueado
    } catch (error) {
      console.error('Error al obtener los clientes: ', error);
      return [];
    }
  }

  // Método para obtener un cliente por ID
  async obtenerCliente(clienteId: string): Promise<Cliente | null> {
    const docRef = doc(this.firestore, `clientes/${clienteId}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Cliente) : null;
  }

  // Método para eliminar la cuenta de un cliente
  async eliminarCliente(clienteId: string): Promise<void> {
    try {
      const clienteDocRef = doc(this.firestore, `clientes/${clienteId}`);
      await deleteDoc(clienteDocRef);
      console.log('Cliente eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar el cliente: ', error);
    }
  }

  // Método para actualizar el número de teléfono del cliente
  async updateTelefono(clienteId: string, nuevoTelefono: string): Promise<void> {
    const clienteRef = doc(this.firestore, `clientes/${clienteId}`);
    await updateDoc(clienteRef, {
      telefono: nuevoTelefono
    });
  }

  // Método para subir una foto adicional del cliente
  async subirFotoAdicional(clienteId: string, archivo: File): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, `clientes/${clienteId}/fotosAdicionales/${archivo.name}`);
    await uploadBytes(storageRef, archivo);
    const fotoURL = await getDownloadURL(storageRef);

    // Actualizar el documento del cliente en Firestore con la URL de la foto adicional
    const clienteRef = doc(this.firestore, `clientes/${clienteId}`);
    await updateDoc(clienteRef, {
      fotosAdicionales: arrayUnion(fotoURL)
    });

    return fotoURL;
  }

}
