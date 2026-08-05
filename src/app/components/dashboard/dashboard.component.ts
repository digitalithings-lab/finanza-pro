import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  LucideAngularModule,
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  UserCog
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isSidebarOpen = true;

  readonly LayoutDashboard = LayoutDashboard;
  readonly Users = Users;
  readonly FileText = FileText;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly X = X;
  readonly UserCog = UserCog;

  constructor(public authService: AuthService) {}

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

  logout() {
    this.authService.logout();
  }
}
