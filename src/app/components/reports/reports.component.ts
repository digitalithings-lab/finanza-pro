import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, FileText, Download, Clock } from 'lucide-angular';
import { DataService } from '../../services/data.service';

interface ReportCard {
  key: 'estadoresultados' | 'balance' | 'flujocaja' | 'facturas';
  name: string;
  needsDateRange: boolean;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  clients: any[] = [];
  selectedClientId: string | null = null;

  fechaInicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  fechaFin = new Date().toISOString().split('T')[0];

  reportCards: ReportCard[] = [
    { key: 'estadoresultados', name: 'Estado de Resultados', needsDateRange: true },
    { key: 'balance', name: 'Balance', needsDateRange: false },
    { key: 'flujocaja', name: 'Flujo de Caja', needsDateRange: false },
    { key: 'facturas', name: 'Facturas', needsDateRange: false },
  ];

  readonly FileText = FileText;
  readonly Download = Download;
  readonly Clock = Clock;

  notification: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getclients({ id: localStorage.getItem('id') }).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          this.clients = resp.data;
          if (this.clients.length > 0) this.selectedClientId = this.clients[0].id;
        }
      },
      error: () => { this.clients = []; }
    });
  }

  private baseData() {
    return {
      idcliente: this.selectedClientId,
      idcreador: localStorage.getItem('id'),
      fecha_inicio: this.fechaInicio,
      fecha_fin: this.fechaFin
    };
  }

  private descargarBlob(obs: any, filename: string) {
    if (!this.selectedClientId) {
      this.showNotification('Selecciona un cliente primero.');
      return;
    }
    obs.subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.showNotification('Error al generar el archivo.');
      }
    });
  }

  exportPDF(card: ReportCard) {
    const data = this.baseData();
    switch (card.key) {
      case 'estadoresultados':
        this.descargarBlob(this.dataService.exportEstadoResultadosPDF(data), 'estado_resultados.pdf');
        break;
      case 'balance':
        this.descargarBlob(this.dataService.exportBalancePDF(data), 'balance.pdf');
        break;
      case 'flujocaja':
        this.descargarBlob(this.dataService.exportFlujoCajaPDF(data), 'flujo_caja.pdf');
        break;
      case 'facturas':
        this.descargarBlob(this.dataService.exportFacturasPDF(data), 'facturas.pdf');
        break;
    }
  }

  exportExcel(card: ReportCard) {
    const data = this.baseData();
    switch (card.key) {
      case 'estadoresultados':
        this.descargarBlob(this.dataService.exportEstadoResultadosExcel(data), 'estado_resultados.xlsx');
        break;
      case 'balance':
        this.descargarBlob(this.dataService.exportBalanceExcel(data), 'balance.xlsx');
        break;
      case 'flujocaja':
        this.descargarBlob(this.dataService.exportFlujoCajaExcel(data), 'flujo_caja.xlsx');
        break;
      case 'facturas':
        this.descargarBlob(this.dataService.exportFacturasExcel(data), 'facturas.xlsx');
        break;
    }
  }

  private showNotification(message: string) {
    this.notification = message;
    setTimeout(() => this.notification = null, 3000);
  }
}
