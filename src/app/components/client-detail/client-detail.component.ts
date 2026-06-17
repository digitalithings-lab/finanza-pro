import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  ArrowLeft, 
  Upload, 
  File, 
  Calculator, 
  ChartBar, 
  Plus, 
  Download,
  Trash2,
  CircleCheck,
  Clock
} from 'lucide-angular';
import { DataService, Client, Document, Transaction } from '../../services/data.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink],
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {
  client: Client | undefined;
  documents: Document[] = [];
  transactions: Transaction[] = [];
  activeTab = 'docs'; // docs, accounting, reports
  today = new Date();
  
  // Calculation form
  newDescription = '';
  newAmount = 0;
  newCategory: 'Ingreso' | 'Gasto' | 'Activo' | 'Pasivo' = 'Ingreso';

  readonly ArrowLeft = ArrowLeft;
  readonly Upload = Upload;
  readonly File = File;
  readonly Calculator = Calculator;
  readonly BarChart = ChartBar;
  readonly Plus = Plus;
  readonly Download = Download;
  readonly Trash2 = Trash2;
  readonly CheckCircle = CircleCheck;
  readonly Clock = Clock;

  isGeneratingReport = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dataService.getClientById(id).subscribe(c => this.client = c);
      this.dataService.getDocumentsByClient(id).subscribe(docs => this.documents = docs);
      this.dataService.getTransactionsByClient(id).subscribe(t => this.transactions = t);
    }
  }

  // Document Methods
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && this.client) {
      const newDoc: Document = {
        id: 'd' + Date.now(),
        clientId: this.client.id,
        name: file.name,
        type: file.type.split('/')[1].toUpperCase() || 'PDF',
        uploadDate: new Date().toISOString().split('T')[0],
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        url: '#'
      };
      this.dataService.addDocument(newDoc);
    }
  }

  deleteDocument(id: string) {
    this.dataService.deleteDocument(id);
  }

  downloadDocument(doc: Document) {
    console.log(`Descargando ${doc.name}...`);
  }

  // Accounting Methods
  addEntry() {
    if (this.client && this.newDescription && this.newAmount) {
      const entry: Transaction = {
        id: 't' + Date.now(),
        clientId: this.client.id,
        date: new Date().toISOString().split('T')[0],
        description: this.newDescription,
        category: this.newCategory,
        amount: this.newAmount
      };
      this.dataService.addTransaction(entry);
      this.newDescription = '';
      this.newAmount = 0;
    }
  }

  deleteEntry(id: string) {
    this.dataService.deleteTransaction(id);
  }

  // Report Methods
  generateReport() {
    this.isGeneratingReport = true;
    setTimeout(() => {
      this.isGeneratingReport = false;
      this.activeTab = 'reports';
    }, 2000);
  }

  get totalBalance() {
    return this.transactions.reduce((acc, t) => {
      if (t.category === 'Ingreso') return acc + t.amount;
      if (t.category === 'Gasto') return acc - t.amount;
      return acc;
    }, 0);
  }

  get totalAssets() {
    return this.transactions.filter(t => t.category === 'Activo').reduce((acc, t) => acc + t.amount, 0);
  }

  get totalLiabilities() {
    return this.transactions.filter(t => t.category === 'Pasivo').reduce((acc, t) => acc + t.amount, 0);
  }
}
