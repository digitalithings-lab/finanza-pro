import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users, Building2, User, UserCog } from 'lucide-angular';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loadingClientes = true;
  loadingPersonal = true;

  clientsCount = 0;
  naturalCount = 0;
  juridicaCount = 0;
  personalCount = 0;
  clientesRecientes: any[] = [];

  readonly Users = Users;
  readonly Building2 = Building2;
  readonly User = User;
  readonly UserCog = UserCog;

  get nombreUsuario(): string {
    return localStorage.getItem('nombre') || 'Usuario';
  }

  get faltantesParaAnaliticas(): number {
    return Math.max(0, 10 - this.clientsCount);
  }

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.cargarClientes();
    this.cargarPersonal();
  }

  cargarClientes() {
    const data = { id: localStorage.getItem('id') };
    this.dataService.getclients(data).subscribe({
      next: (resp) => {
        this.loadingClientes = false;
        if (resp.success === true) {
          const clientes = resp.data || [];
          this.clientsCount = clientes.length;
          this.naturalCount = clientes.filter((c: any) => c.tipo === 'natural').length;
          this.juridicaCount = clientes.filter((c: any) => c.tipo === 'juridica').length;
          this.clientesRecientes = clientes.slice(-5).reverse();
        }
      },
      error: () => {
        this.loadingClientes = false;
      }
    });
  }

  cargarPersonal() {
    const data = { id: localStorage.getItem('id') };
    this.dataService.getpersonal(data).subscribe({
      next: (resp) => {
        this.loadingPersonal = false;
        if (resp.success === true) {
          this.personalCount = (resp.data || []).length;
        }
      },
      error: () => {
        this.loadingPersonal = false;
      }
    });
  }
}
