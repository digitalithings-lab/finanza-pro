import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { ForcePasswordModalComponent } from '../force-password-modal/force-password-modal.component';
import {
  LucideAngularModule,
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  UserCog,
  Settings,
  ChevronDown,
  TriangleAlert,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  Check,
  Circle,
  User,
  Lock
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule, ThemeToggleComponent, ForcePasswordModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('userMenuContainer') userMenuContainer?: ElementRef<HTMLElement>;

  isSidebarOpen = typeof window !== 'undefined' ? window.innerWidth >= 768 : true;
  showUserMenu = false;
  showSettingsModal = false;
  settingsTab: 'perfil' | 'password' | 'cuenta' = 'perfil';

  // Editar Perfil
  profileNombre = '';
  profileApellido = '';
  profileCorreo = '';
  savingProfile = false;
  profileMessage = '';
  profileMessageType: 'success' | 'error' = 'success';

  // Cambiar Contraseña
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  showCurrentPass = false;
  showNewPass = false;
  showConfirmPass = false;
  savingPassword = false;
  passwordMessage = '';
  passwordMessageType: 'success' | 'error' = 'success';

  // Eliminar Cuenta
  confirmDeleteAccount = false;
  deletingAccount = false;
  deleteAccountError = '';
  mustChangePassword = localStorage.getItem('mustChangePassword') === 'true';

  readonly LayoutDashboard = LayoutDashboard;
  readonly Users = Users;
  readonly FileText = FileText;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly X = X;
  readonly UserCog = UserCog;
  readonly Settings = Settings;
  readonly ChevronDown = ChevronDown;
  readonly TriangleAlert = TriangleAlert;
  readonly Trash2 = Trash2;
  readonly Loader2 = Loader2;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Check = Check;
  readonly Circle = Circle;
  readonly User = User;
  readonly Lock = Lock;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.isSidebarOpen = window.innerWidth >= 768;
    }
  }

  onNavClick(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.isSidebarOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.showUserMenu) return;
    const target = event.target as Node | null;
    if (target && this.userMenuContainer && !this.userMenuContainer.nativeElement.contains(target)) {
      this.showUserMenu = false;
    }
  }

  get hasRole(): boolean {
    return !!localStorage.getItem('role');
  }

  get isMaster(): boolean {
    return this.authService.isMaster();
  }

  get nombreUsuario(): string {
    return localStorage.getItem('nombre') || 'Usuario';
  }

  get rolUsuario(): string {
    return localStorage.getItem('role') || 'Administrador';
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  openSettings() {
    this.showUserMenu = false;
    this.showSettingsModal = true;
    this.settingsTab = 'perfil';
    this.confirmDeleteAccount = false;
    this.deleteAccountError = '';
    this.profileMessage = '';
    this.passwordMessage = '';
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.showCurrentPass = false;
    this.showNewPass = false;
    this.showConfirmPass = false;

    this.profileNombre = localStorage.getItem('nombre') || '';
    const id = localStorage.getItem('id');
    if (id) {
      this.authService.getProfile({ id, role: localStorage.getItem('role') }).subscribe({
        next: (resp) => {
          if (resp?.success === true && resp.data) {
            this.profileNombre = resp.data.nombre || this.profileNombre;
            this.profileApellido = resp.data.apellido || '';
            this.profileCorreo = resp.data.correo || '';
          }
        }
      });
    }
  }

  closeSettings() {
    if (this.deletingAccount || this.savingProfile || this.savingPassword) return;
    this.showSettingsModal = false;
    this.confirmDeleteAccount = false;
    this.deleteAccountError = '';
  }

  saveProfile() {
    if (this.savingProfile || !this.profileNombre.trim()) {
      this.profileMessageType = 'error';
      this.profileMessage = 'El nombre es obligatorio.';
      return;
    }

    const id = localStorage.getItem('id');
    if (!id) return;

    this.savingProfile = true;
    this.profileMessage = '';

    this.authService.updateProfile({
      id,
      role: localStorage.getItem('role'),
      nombre: this.profileNombre.trim(),
      apellido: this.profileApellido.trim(),
      correo: this.profileCorreo.trim()
    }).pipe(
      finalize(() => {
        this.savingProfile = false;
      })
    ).subscribe({
      next: (resp) => {
        if (resp?.success === true) {
          localStorage.setItem('nombre', this.profileNombre.trim());
          this.profileMessageType = 'success';
          this.profileMessage = 'Perfil actualizado correctamente.';
        } else {
          this.profileMessageType = 'error';
          this.profileMessage = resp?.mensaje || 'No se pudo actualizar el perfil.';
        }
      },
      error: (err) => {
        this.profileMessageType = 'error';
        this.profileMessage = err?.error?.mensaje || 'Error de conexión al actualizar el perfil.';
      }
    });
  }

  get passRules() {
    return [
      { label: 'Mínimo 10 caracteres', passed: this.newPassword.length >= 10 },
      { label: 'Mínimo una mayúscula (A–Z)', passed: /[A-Z]/.test(this.newPassword) },
      { label: 'Mínimo un número (0–9)', passed: /[0-9]/.test(this.newPassword) },
      { label: 'Mínimo un carácter especial (. ! ? @ # $ etc.)', passed: /[^A-Za-z0-9\s]/.test(this.newPassword) }
    ];
  }

  get passedPassRulesCount(): number {
    return this.passRules.filter(r => r.passed).length;
  }

  get isNewPassDifferent(): boolean {
    return !this.currentPassword || !this.newPassword || this.newPassword !== this.currentPassword;
  }

  get passConfirmMatches(): boolean {
    return this.confirmPassword.length > 0 && this.newPassword === this.confirmPassword;
  }

  get canSavePassword(): boolean {
    return (
      !this.savingPassword &&
      this.currentPassword.length > 0 &&
      this.passedPassRulesCount === 4 &&
      this.isNewPassDifferent &&
      this.passConfirmMatches
    );
  }

  savePasswordFromSettings() {
    if (!this.canSavePassword) return;
    const id = localStorage.getItem('id');
    if (!id) return;

    this.savingPassword = true;
    this.passwordMessage = '';

    this.authService.changePassword({
      id,
      role: localStorage.getItem('role'),
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).pipe(
      finalize(() => {
        this.savingPassword = false;
      })
    ).subscribe({
      next: (resp) => {
        if (resp?.success === true) {
          this.passwordMessageType = 'success';
          this.passwordMessage = 'Contraseña actualizada correctamente.';
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } else {
          this.passwordMessageType = 'error';
          this.passwordMessage = resp?.mensaje || 'No se pudo actualizar la contraseña.';
        }
      },
      error: (err) => {
        this.passwordMessageType = 'error';
        this.passwordMessage = err?.error?.mensaje || 'No se pudo actualizar la contraseña.';
      }
    });
  }

  deleteMyAccount() {
    if (this.deletingAccount || this.hasRole) return;
    const id = localStorage.getItem('id');
    if (!id) {
      this.deleteAccountError = 'No se encontró el identificador de la cuenta.';
      return;
    }

    this.deletingAccount = true;
    this.deleteAccountError = '';

    this.authService.deleteAccount(id).pipe(
      finalize(() => {
        this.deletingAccount = false;
      })
    ).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          this.showSettingsModal = false;
          this.authService.logout();
        } else {
          this.deleteAccountError = resp.mensaje || 'No se pudo eliminar la cuenta.';
        }
      },
      error: (err) => {
        this.deleteAccountError = err?.error?.mensaje || 'Error de conexión al eliminar la cuenta.';
      }
    });
  }

  onPasswordChanged() {
    this.mustChangePassword = false;
  }

  logout() {
    this.showUserMenu = false;
    this.authService.logout();
  }
}
