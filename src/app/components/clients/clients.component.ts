import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Filter, Plus, Ellipsis, ChevronRight, Trash2, X } from 'lucide-angular';
import { DataService, Client } from '../../services/data.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm = '';
  
  // Modal state
  showModal = false;
  newClient: Partial<Client> = {
    name: '',
    email: '',
    type: 'Individual'
  };

  readonly Search = Search;
  readonly Filter = Filter;
  readonly Plus = Plus;
  readonly MoreHorizontal = Ellipsis;
  readonly ChevronRight = ChevronRight;
  readonly Trash2 = Trash2;
  readonly X = X;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getClients().subscribe(data => {
      this.clients = data;
      this.applyFilter();
    });
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredClients = this.clients;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredClients = this.clients.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.email.toLowerCase().includes(term)
      );
    }
  }

  notification: string | null = null;

  toggleModal() {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.newClient = { name: '', email: '', type: 'Individual' };
    }
  }

  saveClient() {
    if (this.newClient.name && this.newClient.email) {
      const client: Client = {
        id: Date.now().toString(),
        name: this.newClient.name,
        email: this.newClient.email,
        type: this.newClient.type as any,
        status: 'Activo',
        lastActivity: new Date().toISOString().split('T')[0]
      };
      this.dataService.addClient(client);
      this.toggleModal();
      this.showNotification('Cliente guardado exitosamente');
    }
  }

  deleteClient(event: Event, id: string) {
    event.stopPropagation();
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.dataService.deleteClient(id);
      this.showNotification('Cliente eliminado');
    }
  }

  private showNotification(message: string) {
    this.notification = message;
    setTimeout(() => this.notification = null, 3000);
  }
}
