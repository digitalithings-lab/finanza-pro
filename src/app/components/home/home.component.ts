import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users, DollarSign, TrendingUp, CircleAlert } from 'lucide-angular';
import { DataService, Client } from '../../services/data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  clientsCount = 0;
  pendingDocs = 5; // Mock
  totalBalance = 45200; // Mock

  readonly Users = Users;
  readonly DollarSign = DollarSign;
  readonly TrendingUp = TrendingUp;
  readonly AlertCircle = CircleAlert;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getClients().subscribe(clients => {
      this.clientsCount = clients.length;
    });
  }

  quickAction(action: string) {
    alert(`Acción: ${action}. Esta funcionalidad estará disponible en la próxima actualización.`);
  }
}
