import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, LogIn, Lock, User } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = '';
  readonly LogIn = LogIn;
  readonly Lock = Lock;
  readonly User = User;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
  }

  onLogin() {
    this.error = '';
    const data={
      user:this.username,
      password:this.password
    }
    console.log(data);

   this.authService.login(data).subscribe({
    next: (resp) => {
      console.log(resp);

      if (resp.success === true){
        localStorage.removeItem('role'); // limpiar sesión anterior
        localStorage.setItem('id', resp.usuario.id);
        localStorage.setItem('idcreador', resp.usuario.idcreador);

        localStorage.setItem('nombre',resp.usuario.nombre)
        if(resp.usuario.role){
          localStorage.setItem('role',resp.usuario.role)
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
