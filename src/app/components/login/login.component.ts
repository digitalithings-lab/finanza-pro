import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, Eye, EyeOff, Lock, User } from 'lucide-angular';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ThemeToggleComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = '';
  showPassword = false;
  isLoading = false;
  readonly Lock = Lock;
  readonly User = User;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.isLoading) {
      return;
    }

    this.error = '';
    this.isLoading = true;
    const data = {
      user: this.username,
      password: this.password
    };

    this.authService.login(data).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          localStorage.removeItem('role'); // limpiar sesión anterior
          localStorage.setItem('id', resp.usuario.id);
          localStorage.setItem('idcreador', resp.usuario.idcreador);

          localStorage.setItem('nombre', resp.usuario.nombre);
          if (resp.usuario.role) {
            localStorage.setItem('role', resp.usuario.role);
          }
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Usuario o contraseña incorrectos';
        }
      },
      error: () => {
        this.error = 'Usuario o contraseña incorrectos';
      }
    });
  }
}
