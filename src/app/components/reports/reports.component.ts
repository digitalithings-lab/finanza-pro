import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, FileText, Download, Eye, Clock } from 'lucide-angular';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  reports = [
    { id: 1, name: 'Balance Consolidado - Mayo 2024', type: 'Balance', date: '2024-05-14', status: 'Finalizado' },
    { id: 2, name: 'Estado de Resultados Q1', type: 'P&L', date: '2024-04-30', status: 'Finalizado' },
    { id: 3, name: 'Reporte de Impuestos Anual', type: 'Tax', date: '2024-03-15', status: 'Archivado' },
  ];

  readonly FileText = FileText;
  readonly Download = Download;
  readonly Eye = Eye;
  readonly Clock = Clock;

  notification: string | null = null;

  viewReport(report: any) {
    this.showNotification(`Visualizando ${report.name}...`);
  }

  downloadReport(report: any) {
    this.showNotification(`Iniciando descarga de ${report.name}...`);
  }

  configureAutomatedReport() {
    this.showNotification(`Configuración de reportes automáticos actualizada.`);
  }

  private showNotification(message: string) {
    this.notification = message;
    setTimeout(() => this.notification = null, 3000);
  }
}
