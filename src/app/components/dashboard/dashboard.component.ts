import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  Loader2
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule, ThemeToggleComponent, ForcePasswordModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  @ViewChild('userMenuContainer') userMenuContainer?: ElementRef<HTMLElement>;

  isSidebarOpen = true;
  showUserMenu = false;
  showSettingsModal = false;
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

  constructor(public authService: AuthService) {}

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
    this.confirmDeleteAccount = false;
    this.deleteAccountError = '';
  }

  closeSettings() {
    if (this.deletingAccount) return;
    this.showSettingsModal = false;
    this.confirmDeleteAccount = false;
    this.deleteAccountError = '';
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
