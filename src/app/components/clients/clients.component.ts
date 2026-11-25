import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Filter, Plus, ChevronRight, Trash2, X, UserPlus, CheckCircle } from 'lucide-angular';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  searchTerm = '';
  filterTipo: 'todos' | 'natural' | 'juridica' = 'todos';

  nombre = '';
  apellido = '';
  correo = '';
  usuario = '';
  password = '';
  rol_id = 2;
  showModal = false;
  notification: string | null = null;

  readonly Search = Search;
  readonly Filter = Filter;
  readonly Plus = Plus;
  readonly ChevronRight = ChevronRight;
  readonly Trash2 = Trash2;
  readonly X = X;
  readonly UserPlus = UserPlus;
  readonly CheckCircle = CheckCircle;

  showAsignarModal = false;
  selectedClient: any = null;
  selectedPersonal: any = null;
  personalAsignado: any[] = [];
  loadingPersonal = false;
  asignando = false;
  notificationType: 'success' | 'error' = 'success';

  get hasRole(): boolean {
    return !!localStorage.getItem('role');
  }

  constructor(private dataService: DataService, private authService: AuthService) {}

  ngOnInit() {
    this.getusers();
    if (!this.hasRole) {
      this.getpersonal();
    }
  }

  get filteredTabla(): any[] {
    let result: any[] = this.tabla || [];

    if (this.filterTipo !== 'todos') {
      result = result.filter((u: any) => u.tipo === this.filterTipo);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter((u: any) =>
        u.nombre?.toLowerCase().includes(term) ||
        u.apellido?.toLowerCase().includes(term) ||
        u.usuario?.toLowerCase().includes(term) ||
        u.correo?.toLowerCase().includes(term)
      );
    }

    return result;
  }

  toggleModal() {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.nombre = '';
      this.apellido = '';
      this.correo = '';
      this.usuario = '';
      this.password = '';
      this.rol_id = 2;
    }
  }

  public tabla: any[] = [];
  getusers() {
    const data = {
      id: this.authService.getTenantId(),
      idpersonal: this.authService.getPersonalId()
    };

    this.dataService.getclients(data).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          this.tabla = resp.data || [];
        } else {
          this.tabla = [];
        }
      },
      error: () => {
        this.tabla = [];
      }
    });
  }
  public rol: any;
  saveUser() {
    if (this.rol_id === 1) {
      this.rol = 'natural';
    } else {
      this.rol = 'juridica';
    }
    const data = {
      nombre: this.nombre,
      apellido: this.apellido,
      user: this.usuario,
      password: this.password,
      idcreador: this.authService.getTenantId(),
      correo: this.correo,
      tipo: this.rol
    };
    

    this.dataService.addClient(data).subscribe({
      next: (resp) => {
        console.log(resp);
        if (resp.success === true) {
          this.toggleModal();
          this.showNotification('Cliente creado correctamente', 'success');
          this.getusers();
        } else {
          this.showNotification('Error al crear el cliente', 'error');
        }
      },
      error: () => {
        this.showNotification('Error de conexión al crear el cliente', 'error');
      }
    });
  }
public data:any

  getpersonal() {
    const id = this.authService.getTenantId();
    const data = { id };

    this.dataService.getpersonal(data).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          this.personalAsignado = resp.data || [];
          const currentAssignedId = this.selectedClient?.personal_asignado?.[0]?.id;
          if (currentAssignedId) {
            this.selectedPersonal = this.personalAsignado.find((p: any) => p.id === currentAssignedId) || null;
          }
        } else {
          this.personalAsignado = [];
        }
        this.loadingPersonal = false;
      },
      error: () => {
        this.personalAsignado = [];
        this.loadingPersonal = false;
      }
    });
  }

  openAsignarModal(client: any) {
    this.selectedClient = client;
    this.selectedPersonal = null;
    this.personalAsignado = [];
    this.showAsignarModal = true;
    this.loadingPersonal = true;
    this.getpersonal();
  }

  closeAsignarModal() {
    this.showAsignarModal = false;
    this.selectedClient = null;
    this.selectedPersonal = null;
    this.personalAsignado = [];
  }

  asignarCliente() {
    if (!this.selectedPersonal || !this.selectedClient || this.asignando) return;
    this.asignando = true;
    const data = {
      idcliente: this.selectedClient.id,
      idpersonal: this.selectedPersonal.id,
      idcreador: this.authService.getTenantId()
    };
    this.dataService.asignarcliente(data).subscribe({
      next: (resp) => {
        this.asignando = false;
        if (resp.ok) {
          this.showNotification('Cliente asignado correctamente', 'success');
          this.closeAsignarModal();
          this.getusers();
        } else {
          this.showNotification('No se pudo asignar el cliente', 'error');
        }
      },
      error: () => {
        this.asignando = false;
        this.showNotification('Error de conexión al asignar', 'error');
      }
    });
  }

  deleteUser(event: Event, id: string) {
   
    this.showNotification('Cliente eliminado');
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success') {
    this.notification = message;
    this.notificationType = type;
    setTimeout(() => this.notification = null, 3500);
  }
}
