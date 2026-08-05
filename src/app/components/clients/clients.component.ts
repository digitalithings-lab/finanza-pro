import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Filter, Plus, ChevronRight, Trash2, X, UserPlus, CheckCircle } from 'lucide-angular';
import { DataService, User } from '../../services/data.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];

  searchTerm = '';
  nombre = '';
  apellido = '';
  correo = '';
  usuario = '';
  password = '';
  rol_id = 2;
public users2:any
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

  constructor(private dataService: DataService) {}

  ngOnInit() {
  this.getusers();
  this.getpersonal()
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(u =>
        u.nombre.toLowerCase().includes(term) ||
        u.apellido.toLowerCase().includes(term) ||
        u.usuario.toLowerCase().includes(term) ||
        u.correo.toLowerCase().includes(term)
      );
    }
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

  public tabla:any
  getusers(){
    const data={
      id:localStorage.getItem('id')
    }

    this.dataService.getclients(data).subscribe((resp=>{
      if(resp.success === true){
    this.tabla = resp.data
    console.log(resp);
    
      }
      
    }))
  }
public rol:any
  saveUser() {
    if(this.rol_id === 1){
      this.rol= 'natural'
    }else{
      this.rol='juridica'
    }
    const data={
      nombre:this.nombre,
      apellido:this.apellido,
      user:this.usuario,
      password:this.password,
      idcreador:localStorage.getItem('id'),
      correo:this.correo,
      tipo:this.rol

    }
    console.log(data);
    

    this.dataService.addClient(data).subscribe({
      next: (resp) => {
        console.log(resp);
        if (resp.success === true) {
          this.toggleModal();
          this.showNotification('Cliente creado correctamente', 'success');
          this.getusers();
        } else {
          this.showNotification('Error al crear un usuario', 'error');
        }
      },
      error: () => {
        this.showNotification('Error de conexión al crear el usuario', 'error');
      }
    });
  }
public data:any

  getpersonal(){

    const id = localStorage.getItem('id')
    const data={

      id:id
    }


    this.dataService.getpersonal(data).subscribe((resp=>{
      console.log(resp);
      if(resp.success === true){
        this.personalAsignado=resp.data
        this.loadingPersonal = false;


      }else{
        this.loadingPersonal = false;

      }
      
    }))

  }

  openAsignarModal(client: any) {
    this.selectedClient = client;
    this.personalAsignado = [];
    this.showAsignarModal = true;
    this.loadingPersonal = true;
    const data = {
      idcliente: client.id,
      idcreador: localStorage.getItem('id')
    };

this.getpersonal()
   
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
      idcreador: localStorage.getItem('id')
    };
    this.dataService.asignarcliente(data).subscribe({
      next: (resp) => {
        this.asignando = false;
        if (resp.ok) {
          this.showNotification('Cliente asignado correctamente', 'success');
          this.closeAsignarModal();
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
   
    this.showNotification('Usuario eliminado');
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success') {
    this.notification = message;
    this.notificationType = type;
    setTimeout(() => this.notification = null, 3500);
  }
}
