import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environments';
export interface Client {
  id: string;
  name: string;
  email: string;
  type: 'Individual' | 'Empresa';
  status: 'Activo' | 'Pendiente';
  lastActivity: string;
}

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  usuario: string;
  correo: string;
  rol_id: number;
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
  category: string;  // nombre de la categoría personalizada
  tipo: 'Ingreso' | 'Gasto' | 'Activo' | 'Pasivo';  // tipo derivado de la categoría
  amount: number;
}

export interface Category {
  id: string;
  clientId: string;
  nombre: string;
  codigo?: string;
  tipo: 'Ingreso' | 'Gasto' | 'Activo' | 'Pasivo' | 'Patrimonio' | 'Costo' | 'Grupo';
}

export interface Invoice {
  id: string;
  idcliente: string;
  idcreador: string;
  cliente_final: string;
  concepto: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  subtotal: number;
  iva_porcentaje: number;
  iva_monto: number;
  total: number;
  estado: 'Pendiente' | 'Pagada' | 'Vencida' | 'Anulada';
  fecha_pago: string | null;
}

export interface Employee {
  id: string;
  idcliente: string;
  idcreador: string;
  nombre: string;
  apellido: string;
  cargo: string;
  salario_base: number;
  fecha_ingreso: string;
  estado: 'Activo' | 'Inactivo';
}

export interface PayrollPayment {
  id: string;
  idempleado: string;
  idcliente: string;
  idcreador: string;
  nombre?: string;
  apellido?: string;
  periodo_inicio: string;
  periodo_fin: string;
  salario_bruto: number;
  deducciones: number;
  salario_neto: number;
  fecha_pago: string;
  idmovimiento: string | null;
}

export interface TaxConfig {
  idcliente: string;
  idcreador: string;
  iva_porcentaje: number;
  retencion_porcentaje: number;
}

export type EtapaProceso = 'documentos' | 'registro' | 'revision' | 'cierre' | 'declaracion';

export interface ProcesoContable {
  idcliente: string;
  idcreador: string;
  etapa: EtapaProceso;
  nota: string | null;
  fecha_actualizacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = environment.url

  constructor(private http: HttpClient){

  }
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
    { id: 't1', clientId: '1', date: '2024-05-01', description: 'Venta de Servicios', category: 'Venta de Servicios', tipo: 'Ingreso', amount: 1500 },
    { id: 't2', clientId: '1', date: '2024-05-05', description: 'Pago Alquiler', category: 'Arriendo', tipo: 'Gasto', amount: 500 },
    { id: 't3', clientId: '1', date: '2024-05-10', description: 'Compra Equipos', category: 'Equipos', tipo: 'Activo', amount: 2000 },
  ];

  private usersRaw: User[] = [
    { id: '1', nombre: 'Juan', apellido: 'Pérez', usuario: 'jperez', correo: 'juan@example.com', rol_id: 1 },
    { id: '2', nombre: 'María', apellido: 'García', usuario: 'mgarcia', correo: 'maria@example.com', rol_id: 2 },
  ];

  private categoriesRaw: Category[] = [];

  private clientsSubject = new BehaviorSubject<Client[]>(this.clientsRaw);
  private documentsSubject = new BehaviorSubject<Document[]>(this.documentsRaw);
  private transactionsSubject = new BehaviorSubject<Transaction[]>(this.transactionsRaw);
  private usersSubject = new BehaviorSubject<User[]>(this.usersRaw);
  private categoriesSubject = new BehaviorSubject<Category[]>(this.categoriesRaw);

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
  addClient(client:any) {
    return this.http.post<any>(
      `${this.url}clientes`,
      client
    );  }



    getclients(data:any){
      return this.http.post<any>(
        `${this.url}getclientes`,
        data
      );  }


      getclientbyid(data:any){
        return this.http.post<any>(
          `${this.url}getclientebyid`,
          data
        );
      }

      archivos (data:any){
        return this.http.post<any>(this.url + `archivosclients`, data);
    
      }


      descargararchivo (data:any){
        return this.http.post(
          this.url + 'descargar',
          data,
          {
            responseType: 'blob'
          }
        )
    
      }



      insertarcategoria(data:any){
        return this.http.post<any>(
          this.url + 'insertcatego',
          data
        )
      }

      importarCatalogoCuentas(formData: FormData){
        return this.http.post<any>(
          this.url + 'importarcategorias',
          formData
        )
      }



      insertarmovimiento(data: any) {
        return this.http.post<any>(this.url + 'insertarmovimiento', data);
      }

      getmovimientos(data: any) {
        return this.http.post<any>(this.url + 'getmovimientos', data);
      }

      actualizarestado (data:any){
        return this.http.post<any>(
          this.url + 'actualizar',
          data,
         
        )
    
      }
      getpersonal(data:any){
        return this.http.post<any>(this.url+`getpersonal`,data);

      }

      addUsuario(data:any){
        return this.http.post<any>(this.url + 'usuarios', data);
      }

      getUsuarios(data:any){
        return this.http.post<any>(this.url + 'getusuarios', data);
      }
    
      gettype (data:any){
        return this.http.post<any>(
          this.url + 'getype',
          data,
        )
      }

      getPersonalAsignado(data: any) {
        return this.http.post<any>(this.url + 'getpersonalasignado', data);
      }

      asignarcliente(data: any) {
        return this.http.post<any>(this.url + 'asignacion', data);
      }

      // Facturación / Cuentas por Cobrar
      crearFactura(data: any) {
        return this.http.post<any>(this.url + 'facturas', data);
      }

      getFacturas(data: any) {
        return this.http.post<any>(this.url + 'getfacturas', data);
      }

      marcarFacturaPagada(data: any) {
        return this.http.post<any>(this.url + 'facturas/marcarpagada', data);
      }

      anularFactura(data: any) {
        return this.http.post<any>(this.url + 'facturas/anular', data);
      }

      exportFacturaPDF(data: any) {
        return this.http.post(this.url + 'facturas/pdf', data, { responseType: 'blob' });
      }

      // Nómina
      crearEmpleado(data: any) {
        return this.http.post<any>(this.url + 'empleados', data);
      }

      getEmpleados(data: any) {
        return this.http.post<any>(this.url + 'getempleados', data);
      }

      cambiarEstadoEmpleado(data: any) {
        return this.http.post<any>(this.url + 'empleados/estado', data);
      }

      registrarPagoNomina(data: any) {
        return this.http.post<any>(this.url + 'nomina/pagos', data);
      }

      getPagosNomina(data: any) {
        return this.http.post<any>(this.url + 'nomina/getpagos', data);
      }

      // Impuestos
      guardarConfigImpuestos(data: any) {
        return this.http.post<any>(this.url + 'impuestos/config', data);
      }

      getConfigImpuestos(data: any) {
        return this.http.post<any>(this.url + 'impuestos/getconfig', data);
      }

      calcularImpuestos(data: any) {
        return this.http.post<any>(this.url + 'impuestos/calcular', data);
      }

      // Exportación PDF/Excel
      exportEstadoResultadosPDF(data: any) {
        return this.http.post(this.url + 'export/estadoresultados/pdf', data, { responseType: 'blob' });
      }

      exportEstadoResultadosExcel(data: any) {
        return this.http.post(this.url + 'export/estadoresultados/excel', data, { responseType: 'blob' });
      }

      exportBalancePDF(data: any) {
        return this.http.post(this.url + 'export/balance/pdf', data, { responseType: 'blob' });
      }

      exportBalanceExcel(data: any) {
        return this.http.post(this.url + 'export/balance/excel', data, { responseType: 'blob' });
      }

      exportFlujoCajaPDF(data: any) {
        return this.http.post(this.url + 'export/flujocaja/pdf', data, { responseType: 'blob' });
      }

      exportFlujoCajaExcel(data: any) {
        return this.http.post(this.url + 'export/flujocaja/excel', data, { responseType: 'blob' });
      }

      exportFacturasPDF(data: any) {
        return this.http.post(this.url + 'export/facturas/pdf', data, { responseType: 'blob' });
      }

      exportFacturasExcel(data: any) {
        return this.http.post(this.url + 'export/facturas/excel', data, { responseType: 'blob' });
      }

      // Proceso Contable
      guardarProcesoContable(data: any) {
        return this.http.post<any>(this.url + 'proceso/estado', data);
      }

      getProcesoContable(data: any) {
        return this.http.post<any>(this.url + 'proceso/getestado', data);
      }

  getCategoriesByClient(clientId: string): Observable<Category[]> {
    return this.categoriesSubject.pipe(
      map(cats => cats.filter(c => c.clientId === clientId))
    );
  }

  addCategory(category: Category) {
    this.categoriesRaw = [...this.categoriesRaw, category];
    this.categoriesSubject.next(this.categoriesRaw);
  }

  deleteCategory(id: string) {
    this.categoriesRaw = this.categoriesRaw.filter(c => c.id !== id);
    this.categoriesSubject.next(this.categoriesRaw);
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

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  addUser(user: User) {
    this.usersRaw = [...this.usersRaw, user];
    this.usersSubject.next(this.usersRaw);
  }

  deleteUserById(id: string) {
    this.usersRaw = this.usersRaw.filter(u => u.id !== id);
    this.usersSubject.next(this.usersRaw);
  }


  
}
