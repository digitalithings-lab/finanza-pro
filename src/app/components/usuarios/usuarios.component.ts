import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Search, Plus, Trash2, X, UserCog, CheckCircle, Eye, EyeOff } from 'lucide-angular';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  usuario: string;
  correo: string;
  rol: string;
  es_master?: boolean;
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
  esMaster = false;
  showPassword = false;

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
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

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

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isMaster()) {
      this.router.navigate(['/dashboard']);
      return;
    }
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
      this.esMaster = false;
      this.showPassword = false;
    }
  }

  getUsuarios() {
    const data = {
      idcreador: localStorage.getItem('id')
    };
    this.dataService.getUsuarios(data).subscribe({
      next: (resp) => {
        if (resp.success === true && Array.isArray(resp.data)) {
          this.usuarios = resp.data.map((u: any) => {
            const isMaster = Boolean(u.es_master || String(u.usuario || '').toLowerCase() === 'admin');
            return {
              ...u,
              es_master: isMaster,
              rol: isMaster ? 'Admin Maestro / Socio' : 'Administrador SaaS'
            };
          });
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
      es_master: this.esMaster,
      rol: this.esMaster ? 'Admin Maestro / Socio' : 'Administrador SaaS',
      idcreador: localStorage.getItem('id')
    };

    this.dataService.addUsuario(data).subscribe({
      next: (resp) => {
        this.saving = false;
        if (resp.success === true) {
          this.toggleModal();
          this.showNotification('Administrador creado correctamente', 'success');
          this.getUsuarios();
        } else {
          this.showNotification(resp.mensaje || 'Error al crear el administrador', 'error');
        }
      },
      error: (err) => {
        this.saving = false;
        this.showNotification(err?.error?.mensaje || 'Error de conexión al crear el administrador', 'error');
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success') {
    this.notification = message;
    this.notificationType = type;
    setTimeout(() => this.notification = null, 3500);
  }
}
