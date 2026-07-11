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
  Clock,
  Tag,
  FolderOpen
} from 'lucide-angular';
import { DataService, Client, Document, Transaction, Category } from '../../services/data.service';
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
  public ids:any
  public datos:any
  // Accounting form
  newDescription = '';
  newAmount = 0;
  newCategorySelected: any = null;

  // Categories
  categories: Category[] = [];
  newCategoryName = '';
  newCategoryTipo: 'Ingreso' | 'Gasto' | 'Activo' | 'Pasivo' = 'Ingreso';
  showCategoryForm = false;

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
  readonly Tag = Tag;
  readonly FolderOpen = FolderOpen;

  isGeneratingReport = false;
newCategory: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    
  ) {}

  ngOnInit() {
    this.ids = this.route.snapshot.paramMap.get('id');
    this.obtenercliente();
    this.documentos();
    this.getCategoriesByTipo();
    this.dataService.getCategoriesByClient(this.ids).subscribe(cats => {
      this.categories = cats;
    });
  }

  obtenercliente(){
    const data={
      id:this.ids
    }

    this.dataService.getclientbyid(data).subscribe((resp=>{
console.log(resp);
if(resp.success === true){
 this.datos = resp.data[0]
}

    }))
  }



public data:any
  async documentos() {
  
  
    const data = {
      iduser: this.ids
    };
  
    console.log(data);
  
    this.dataService.archivos(data).subscribe({
      next: async (resp) => {
        console.log(resp);
        if (resp.ok === true) {
          this.data = resp.data;
          console.log(resp);
          
        } else {
          this.data = [];
        }
      },
      error: async (err) => {
        console.error(err);
        this.data = [];
      }
    });
  }

  descargar(doc: any) {
    const data={
      ruta:doc.ruta
    }
    this.dataService.descargararchivo(data).subscribe({
      next: (blob: Blob) => {
    
        const url = window.URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.nombre}`;    
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    
        window.URL.revokeObjectURL(url);


        const data={
          nombre:doc.nombre
        }

        this.dataService.actualizarestado(data).subscribe((resp=>{
          console.log(resp);
          
        }))
    
      },
      error: (err:any) => {
        console.error(err);
      }
    });
    
    }




  // Category Methods
  addCategory() {
    const data={
      nombre:this.newCategoryName,
      idcreador:localStorage.getItem('id'),
      idcliente:this.ids,
      tipo:this.newCategoryTipo
    }
    console.log(data);
    

    this.dataService.insertarcategoria(data).subscribe((resp=>{
      console.log(resp);
      if(resp.ok === true){
        this.getCategoriesByTipo();
       
      }
      
    }))
   }


   

  deleteCategory(id: string) {
    this.dataService.deleteCategory(id);
  }
public count:any
public filter:any
public datas:any
  getCategoriesByTipo() {
    const data={
      idcliente:this.ids,
      idcreador:localStorage.getItem('id')
    }
    this.dataService.gettype(data).subscribe((resp=>{
      console.log(resp);
      this.count =resp.data.length
      this.datas= resp.data

      
    }))
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

 
  // Accounting Methods
  addEntry() {
    if (!this.newCategorySelected || !this.newDescription || !this.newAmount) return;

    const entry: Transaction = {
      id: 't' + Date.now(),
      clientId: this.ids,
      date: new Date().toISOString().split('T')[0],
      description: this.newDescription,
      category: this.newCategorySelected.nombre,
      tipo: this.newCategorySelected.tipo,
      amount: this.newAmount
    };

    const data = {
      idcliente: this.ids,
      idcreador: localStorage.getItem('id'),
      descripcion: this.newDescription,
      monto: this.newAmount,
      idcategoria: this.newCategorySelected.id,
      tipo: this.newCategorySelected.tipo
    };
    this.dataService.insertarmovimiento(data).subscribe(resp => {
      console.log(resp);
      if(resp.ok === true){
   this.getmovimientos()
      }
    });

    this.dataService.addTransaction(entry);
    this.newDescription = '';
    this.newAmount = 0;
    this.newCategorySelected = null;
  }
  getmovimientos() {
    const data = {
      idcliente: this.ids,
      idcreador: localStorage.getItem('id')
    };
    this.dataService.getmovimientos(data).subscribe((resp) => {
      console.log(resp);
      if (resp.ok === true) {
        this.transactions = resp.data.map((row: any) => ({
          id:          String(row.id),
          clientId:    String(this.ids),
          date:        row.fecha,
          description: row.descripcion,
          category:    row.nombre_categoria,
          tipo:        row.tipo,
          amount:      Number(row.monto)
        }));
      }
    });
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

  // Totals
  get totalIngresos() {
    return this.transactions.filter(t => t.tipo === 'Ingreso').reduce((acc, t) => acc + t.amount, 0);
  }

  get totalGastos() {
    return this.transactions.filter(t => t.tipo === 'Gasto').reduce((acc, t) => acc + t.amount, 0);
  }

  get utilidadNeta() {
    return this.totalIngresos - this.totalGastos;
  }

  get totalBalance() {
    return this.utilidadNeta;
  }

  get totalAssets() {
    return this.transactions.filter(t => t.tipo === 'Activo').reduce((acc, t) => acc + t.amount, 0);
  }

  get totalLiabilities() {
    return this.transactions.filter(t => t.tipo === 'Pasivo').reduce((acc, t) => acc + t.amount, 0);
  }

  // Estado de Resultados: agrupa por categoría nombre
  get estadoIngresos(): { nombre: string; total: number }[] {
    const grouped: { [k: string]: number } = {};
    this.transactions.filter(t => t.tipo === 'Ingreso').forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });
    return Object.entries(grouped).map(([nombre, total]) => ({ nombre, total }));
  }

  get estadoGastos(): { nombre: string; total: number }[] {
    const grouped: { [k: string]: number } = {};
    this.transactions.filter(t => t.tipo === 'Gasto').forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });
    return Object.entries(grouped).map(([nombre, total]) => ({ nombre, total }));
  }
}
