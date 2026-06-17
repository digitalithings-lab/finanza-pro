import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Client {
  id: string;
  name: string;
  email: string;
  type: 'Individual' | 'Empresa';
  status: 'Activo' | 'Pendiente';
  lastActivity: string;
}

export interface Document {
  id: string;
  clientId: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  url: string;
}

export interface Transaction {
  id: string;
  clientId: string;
  date: string;
  description: string;
  category: 'Ingreso' | 'Gasto' | 'Activo' | 'Pasivo';
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private clientsRaw: Client[] = [
    { id: '1', name: 'Juan Pérez', email: 'juan@example.com', type: 'Individual', status: 'Activo', lastActivity: '2024-05-10' },
    { id: '2', name: 'Tech Solutions S.A.', email: 'admin@techsolutions.com', type: 'Empresa', status: 'Activo', lastActivity: '2024-05-12' },
    { id: '3', name: 'María García', email: 'maria@example.com', type: 'Individual', status: 'Pendiente', lastActivity: '2024-05-08' },
  ];

  private documentsRaw: Document[] = [
    { id: 'd1', clientId: '1', name: 'Cedula_Identidad.pdf', type: 'PDF', uploadDate: '2024-05-01', size: '1.2 MB', url: '#' },
    { id: 'd2', clientId: '1', name: 'Factura_Mayo.pdf', type: 'PDF', uploadDate: '2024-05-14', size: '0.5 MB', url: '#' },
  ];

  private transactionsRaw: Transaction[] = [
    { id: 't1', clientId: '1', date: '2024-05-01', description: 'Venta de Servicios', category: 'Ingreso', amount: 1500 },
    { id: 't2', clientId: '1', date: '2024-05-05', description: 'Pago Alquiler', category: 'Gasto', amount: 500 },
    { id: 't3', clientId: '1', date: '2024-05-10', description: 'Compra Equipos', category: 'Activo', amount: 2000 },
  ];

  private clientsSubject = new BehaviorSubject<Client[]>(this.clientsRaw);
  private documentsSubject = new BehaviorSubject<Document[]>(this.documentsRaw);
  private transactionsSubject = new BehaviorSubject<Transaction[]>(this.transactionsRaw);

  getClients(): Observable<Client[]> {
    return this.clientsSubject.asObservable();
  }

  getClientById(id: string): Observable<Client | undefined> {
    return this.clientsSubject.pipe(
      map(clients => clients.find(c => c.id === id))
    );
  }

  getDocumentsByClient(clientId: string): Observable<Document[]> {
    return this.documentsSubject.pipe(
      map(docs => docs.filter(d => d.clientId === clientId))
    );
  }

  getTransactionsByClient(clientId: string): Observable<Transaction[]> {
    return this.transactionsSubject.pipe(
      map(ts => ts.filter(t => t.clientId === clientId))
    );
  }

  // Management Methods
  addClient(client: Client) {
    this.clientsRaw = [...this.clientsRaw, client];
    this.clientsSubject.next(this.clientsRaw);
  }

  deleteClient(id: string) {
    this.clientsRaw = this.clientsRaw.filter(c => c.id !== id);
    this.clientsSubject.next(this.clientsRaw);
  }

  addTransaction(transaction: Transaction) {
    this.transactionsRaw = [...this.transactionsRaw, transaction];
    this.transactionsSubject.next(this.transactionsRaw);
  }

  deleteTransaction(id: string) {
    this.transactionsRaw = this.transactionsRaw.filter(t => t.id !== id);
    this.transactionsSubject.next(this.transactionsRaw);
  }

  addDocument(doc: Document) {
    this.documentsRaw = [...this.documentsRaw, doc];
    this.documentsSubject.next(this.documentsRaw);
  }

  deleteDocument(id: string) {
    this.documentsRaw = this.documentsRaw.filter(d => d.id !== id);
    this.documentsSubject.next(this.documentsRaw);
  }


  
}
