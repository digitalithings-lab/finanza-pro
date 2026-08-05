import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Plus, Trash2, X, UserCog, CheckCircle } from 'lucide-angular';
import { DataService } from '../../services/data.service';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  usuario: string;
  correo: string;
  rol: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  searchTerm = '';

  nombre = '';
  apellido = '';
  correo = '';
  usuario = '';
  password = '';
  rol = 'Administrador';

  roles = ['Administrador', 'Gerente', 'Cajero', 'Vendedor', 'Soporte'];

  showModal = false;
  saving = false;
  notification: string | null = null;
  notificationType: 'success' | 'error' = 'success';

  readonly Search = Search;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly X = X;
  readonly UserCog = UserCog;
  readonly CheckCircle = CheckCircle;

  get filteredUsuarios(): Usuario[] {
    if (!this.searchTerm) return this.usuarios;
    const term = this.searchTerm.toLowerCase();
    return this.usuarios.filter(u =>
      u.nombre?.toLowerCase().includes(term) ||
      u.apellido?.toLowerCase().includes(term) ||
      u.usuario?.toLowerCase().includes(term) ||
      u.correo?.toLowerCase().includes(term)
    );
  }

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getUsuarios();
  }

  toggleModal() {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.nombre = '';
      this.apellido = '';
      this.correo = '';
      this.usuario = '';
      this.password = '';
      this.rol = 'Administrador';
    }
  }

  getUsuarios() {
    const data = {
      idcreador: localStorage.getItem('id')
    };
    this.dataService.getUsuarios(data).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          this.usuarios = resp.data;
        }
      }
    });
  }

  saveUsuario() {
    if (!this.nombre || !this.apellido || !this.usuario || !this.password) {
      this.showNotification('Completa todos los campos obligatorios', 'error');
      return;
    }
    this.saving = true;
    const data = {
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      user: this.usuario,
      password: this.password,
      rol: this.rol,
      idcreador: localStorage.getItem('id')
    };

    this.dataService.addUsuario(data).subscribe({
      next: (resp) => {
        this.saving = false;
        if (resp.success === true) {
          this.toggleModal();
          this.showNotification('Usuario creado correctamente', 'success');
          this.getUsuarios();
        } else {
          this.showNotification('Error al crear el usuario', 'error');
        }
      },
      error: () => {
        this.saving = false;
        this.showNotification('Error de conexión al crear el usuario', 'error');
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success') {
    this.notification = message;
    this.notificationType = type;
    setTimeout(() => this.notification = null, 3500);
  }
}
