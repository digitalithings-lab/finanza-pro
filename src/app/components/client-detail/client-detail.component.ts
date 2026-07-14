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
  FolderOpen,
  Receipt,
  Users,
  Percent,
  TrendingUp
} from 'lucide-angular';
import { DataService, Client, Document, Transaction, Category, Invoice, Employee, PayrollPayment, TaxConfig } from '../../services/data.service';
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
  readonly Receipt = Receipt;
  readonly Users = Users;
  readonly Percent = Percent;
  readonly TrendingUp = TrendingUp;

  isGeneratingReport = false;
newCategory: any;
  readonly Math = Math;

  // Facturación / Cuentas por Cobrar
  invoices: Invoice[] = [];
  showAgingView = false;
  newInvoice = {
    cliente_final: '',
    concepto: '',
    fecha_emision: new Date().toISOString().split('T')[0],
    fecha_vencimiento: '',
    subtotal: 0,
    iva_porcentaje: 0
  };

  // Nómina
  employees: Employee[] = [];
  payrollPayments: PayrollPayment[] = [];
  payrollSubView: 'empleados' | 'pagos' = 'empleados';
  newEmployee = {
    nombre: '',
    apellido: '',
    cargo: '',
    salario_base: 0,
    fecha_ingreso: new Date().toISOString().split('T')[0]
  };
  newPayrollPayment = {
    idempleado: null as any,
    periodo_inicio: '',
    periodo_fin: '',
    salario_bruto: 0,
    deducciones: 0,
    fecha_pago: new Date().toISOString().split('T')[0],
    reflejarEnContabilidad: true
  };

  // Impuestos
  taxConfig: TaxConfig | null = null;
  taxConfigForm = { iva_porcentaje: 0, retencion_porcentaje: 0 };
  taxPeriod = {
    fecha_inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    fecha_fin: new Date().toISOString().split('T')[0]
  };
  taxResult: any = null;

  // Flujo de caja
  cashFlowLoaded = false;

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
      idcreador:localStorage.getItem('idcreador')
      
    }
    console.log(data);
    
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

  // ============ Facturación / Cuentas por Cobrar ============

  onInvoicesTab() {
    this.getFacturas();
    if (!this.taxConfig) this.getConfigImpuestos();
  }

  getFacturas() {
    const data = { idcliente: this.ids, idcreador: localStorage.getItem('id') };
    this.dataService.getFacturas(data).subscribe(resp => {
      if (resp.ok === true) {
        this.invoices = resp.data.map((row: any) => ({
          id: String(row.id),
          idcliente: String(row.idcliente),
          idcreador: String(row.idcreador),
          cliente_final: row.cliente_final,
          concepto: row.concepto,
          fecha_emision: row.fecha_emision,
          fecha_vencimiento: row.fecha_vencimiento,
          subtotal: Number(row.subtotal),
          iva_porcentaje: Number(row.iva_porcentaje),
          iva_monto: Number(row.iva_monto),
          total: Number(row.total),
          estado: row.estado,
          fecha_pago: row.fecha_pago
        }));
      }
    });
  }

  crearFactura() {
    if (!this.newInvoice.cliente_final || !this.newInvoice.concepto || !this.newInvoice.fecha_vencimiento || !this.newInvoice.subtotal) return;

    const data = {
      idcliente: this.ids,
      idcreador: localStorage.getItem('id'),
      cliente_final: this.newInvoice.cliente_final,
      concepto: this.newInvoice.concepto,
      fecha_emision: this.newInvoice.fecha_emision,
      fecha_vencimiento: this.newInvoice.fecha_vencimiento,
      subtotal: this.newInvoice.subtotal,
      iva_porcentaje: this.newInvoice.iva_porcentaje
    };

    this.dataService.crearFactura(data).subscribe(resp => {
      if (resp.ok === true) {
        this.getFacturas();
        this.newInvoice = {
          cliente_final: '',
          concepto: '',
          fecha_emision: new Date().toISOString().split('T')[0],
          fecha_vencimiento: '',
          subtotal: 0,
          iva_porcentaje: this.taxConfigForm.iva_porcentaje
        };
      }
    });
  }

  marcarFacturaPagada(factura: Invoice) {
    this.dataService.marcarFacturaPagada({ id: factura.id }).subscribe(resp => {
      if (resp.ok === true) this.getFacturas();
    });
  }

  anularFactura(factura: Invoice) {
    this.dataService.anularFactura({ id: factura.id }).subscribe(resp => {
      if (resp.ok === true) this.getFacturas();
    });
  }

  descargarFacturaPDF(factura: Invoice) {
    this.dataService.exportFacturaPDF({ id: factura.id }).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura_${factura.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => console.error(err)
    });
  }

  get newInvoiceIvaMonto(): number {
    return Math.round((this.newInvoice.subtotal * this.newInvoice.iva_porcentaje / 100) * 100) / 100;
  }

  get newInvoiceTotal(): number {
    return Math.round((this.newInvoice.subtotal + this.newInvoiceIvaMonto) * 100) / 100;
  }

  get totalFacturado(): number {
    return this.invoices.reduce((acc, f) => acc + f.total, 0);
  }

  get totalCobrado(): number {
    return this.invoices.filter(f => f.estado === 'Pagada').reduce((acc, f) => acc + f.total, 0);
  }

  get totalPendiente(): number {
    return this.invoices.filter(f => f.estado === 'Pendiente').reduce((acc, f) => acc + f.total, 0);
  }

  get totalVencido(): number {
    return this.invoices.filter(f => f.estado === 'Vencida').reduce((acc, f) => acc + f.total, 0);
  }

  get facturasPendientesOVencidas(): Invoice[] {
    return this.invoices.filter(f => f.estado === 'Pendiente' || f.estado === 'Vencida');
  }

  get agingBuckets() {
    const hoy = new Date();
    const buckets = { b0_30: 0, b31_60: 0, b61_90: 0, b90mas: 0 };
    this.facturasPendientesOVencidas.forEach(f => {
      const dias = Math.floor((hoy.getTime() - new Date(f.fecha_vencimiento).getTime()) / 86400000);
      if (dias <= 30) buckets.b0_30 += f.total;
      else if (dias <= 60) buckets.b31_60 += f.total;
      else if (dias <= 90) buckets.b61_90 += f.total;
      else buckets.b90mas += f.total;
    });
    return buckets;
  }

  get totalPorCobrar(): number {
    return this.facturasPendientesOVencidas.reduce((acc, f) => acc + f.total, 0);
  }

  // ============ Nómina ============

  onPayrollTab() {
    this.getEmpleados();
    this.getPagosNomina();
  }

  getEmpleados() {
    const data = { idcliente: this.ids, idcreador: localStorage.getItem('id') };
    this.dataService.getEmpleados(data).subscribe(resp => {
      if (resp.ok === true) {
        this.employees = resp.data.map((row: any) => ({
          id: String(row.id),
          idcliente: String(row.idcliente),
          idcreador: String(row.idcreador),
          nombre: row.nombre,
          apellido: row.apellido,
          cargo: row.cargo,
          salario_base: Number(row.salario_base),
          fecha_ingreso: row.fecha_ingreso,
          estado: row.estado
        }));
      }
    });
  }

  crearEmpleado() {
    if (!this.newEmployee.nombre || !this.newEmployee.apellido || !this.newEmployee.salario_base) return;

    const data = {
      idcliente: this.ids,
      idcreador: localStorage.getItem('id'),
      nombre: this.newEmployee.nombre,
      apellido: this.newEmployee.apellido,
      cargo: this.newEmployee.cargo,
      salario_base: this.newEmployee.salario_base,
      fecha_ingreso: this.newEmployee.fecha_ingreso
    };

    this.dataService.crearEmpleado(data).subscribe(resp => {
      if (resp.ok === true) {
        this.getEmpleados();
        this.newEmployee = {
          nombre: '',
          apellido: '',
          cargo: '',
          salario_base: 0,
          fecha_ingreso: new Date().toISOString().split('T')[0]
        };
      }
    });
  }

  cambiarEstadoEmpleado(empleado: Employee) {
    const nuevoEstado = empleado.estado === 'Activo' ? 'Inactivo' : 'Activo';
    this.dataService.cambiarEstadoEmpleado({ id: empleado.id, estado: nuevoEstado }).subscribe(resp => {
      if (resp.ok === true) this.getEmpleados();
    });
  }

  getPagosNomina() {
    const data = { idcliente: this.ids, idcreador: localStorage.getItem('id') };
    this.dataService.getPagosNomina(data).subscribe(resp => {
      if (resp.ok === true) {
        this.payrollPayments = resp.data.map((row: any) => ({
          id: String(row.id),
          idempleado: String(row.idempleado),
          idcliente: String(row.idcliente),
          idcreador: String(row.idcreador),
          nombre: row.nombre,
          apellido: row.apellido,
          periodo_inicio: row.periodo_inicio,
          periodo_fin: row.periodo_fin,
          salario_bruto: Number(row.salario_bruto),
          deducciones: Number(row.deducciones),
          salario_neto: Number(row.salario_neto),
          fecha_pago: row.fecha_pago,
          idmovimiento: row.idmovimiento != null ? String(row.idmovimiento) : null
        }));
      }
    });
  }

  onEmployeeSelectedForPayroll() {
    const emp = this.employees.find(e => e.id === this.newPayrollPayment.idempleado);
    if (emp) this.newPayrollPayment.salario_bruto = emp.salario_base;
  }

  registrarPagoNomina() {
    if (!this.newPayrollPayment.idempleado || !this.newPayrollPayment.periodo_inicio || !this.newPayrollPayment.periodo_fin || !this.newPayrollPayment.salario_bruto) return;

    const data = {
      idempleado: this.newPayrollPayment.idempleado,
      idcliente: this.ids,
      idcreador: localStorage.getItem('id'),
      periodo_inicio: this.newPayrollPayment.periodo_inicio,
      periodo_fin: this.newPayrollPayment.periodo_fin,
      salario_bruto: this.newPayrollPayment.salario_bruto,
      deducciones: this.newPayrollPayment.deducciones,
      fecha_pago: this.newPayrollPayment.fecha_pago,
      reflejarEnContabilidad: this.newPayrollPayment.reflejarEnContabilidad
    };

    this.dataService.registrarPagoNomina(data).subscribe(resp => {
      if (resp.ok === true) {
        this.getPagosNomina();
        if (this.newPayrollPayment.reflejarEnContabilidad) this.getmovimientos();
        this.newPayrollPayment = {
          idempleado: null,
          periodo_inicio: '',
          periodo_fin: '',
          salario_bruto: 0,
          deducciones: 0,
          fecha_pago: new Date().toISOString().split('T')[0],
          reflejarEnContabilidad: true
        };
      }
    });
  }

  get totalNominaPagada(): number {
    return this.payrollPayments.reduce((acc, p) => acc + p.salario_neto, 0);
  }

  // ============ Impuestos ============

  onTaxesTab() {
    this.getConfigImpuestos();
  }

  getConfigImpuestos() {
    this.dataService.getConfigImpuestos({ idcliente: this.ids }).subscribe(resp => {
      if (resp.ok === true && resp.data) {
        this.taxConfig = {
          idcliente: String(resp.data.idcliente),
          idcreador: String(resp.data.idcreador),
          iva_porcentaje: Number(resp.data.iva_porcentaje),
          retencion_porcentaje: Number(resp.data.retencion_porcentaje)
        };
        this.taxConfigForm = {
          iva_porcentaje: this.taxConfig.iva_porcentaje,
          retencion_porcentaje: this.taxConfig.retencion_porcentaje
        };
        this.newInvoice.iva_porcentaje = this.taxConfig.iva_porcentaje;
      }
    });
  }

  guardarConfigImpuestos() {
    const data = {
      idcliente: this.ids,
      idcreador: localStorage.getItem('id'),
      iva_porcentaje: this.taxConfigForm.iva_porcentaje,
      retencion_porcentaje: this.taxConfigForm.retencion_porcentaje
    };

    this.dataService.guardarConfigImpuestos(data).subscribe(resp => {
      if (resp.ok === true) this.getConfigImpuestos();
    });
  }

  calcularImpuestos() {
    const data = {
      idcliente: this.ids,
      idcreador: localStorage.getItem('id'),
      fecha_inicio: this.taxPeriod.fecha_inicio,
      fecha_fin: this.taxPeriod.fecha_fin
    };

    this.dataService.calcularImpuestos(data).subscribe(resp => {
      if (resp.ok === true) this.taxResult = resp.data;
    });
  }

  // ============ Flujo de Caja ============

  onCashflowTab() {
    if (!this.cashFlowLoaded) {
      this.getFacturas();
      this.getPagosNomina();
      this.cashFlowLoaded = true;
    }
  }

  get cashFlowByMonth(): { mes: string; entradas: number; salidas: number; saldoMes: number; saldoAcumulado: number }[] {
    const map: { [mes: string]: { entradas: number; salidas: number } } = {};

    this.transactions.filter(t => t.tipo === 'Ingreso').forEach(t => {
      const mes = t.date.slice(0, 7);
      if (!map[mes]) map[mes] = { entradas: 0, salidas: 0 };
      map[mes].entradas += t.amount;
    });

    this.invoices.filter(f => f.estado === 'Pagada' && f.fecha_pago).forEach(f => {
      const mes = f.fecha_pago!.slice(0, 7);
      if (!map[mes]) map[mes] = { entradas: 0, salidas: 0 };
      map[mes].entradas += f.total;
    });

    this.transactions.filter(t => t.tipo === 'Gasto').forEach(t => {
      const mes = t.date.slice(0, 7);
      if (!map[mes]) map[mes] = { entradas: 0, salidas: 0 };
      map[mes].salidas += t.amount;
    });

    // Solo se suman los pagos de nómina que NO fueron reflejados en movimientos,
    // para no duplicar el gasto (ese ya viene contado arriba vía tipo 'Gasto').
    this.payrollPayments.filter(p => !p.idmovimiento).forEach(p => {
      const mes = p.fecha_pago.slice(0, 7);
      if (!map[mes]) map[mes] = { entradas: 0, salidas: 0 };
      map[mes].salidas += p.salario_neto;
    });

    const meses = Object.keys(map).sort();
    let acumulado = 0;
    return meses.map(mes => {
      const { entradas, salidas } = map[mes];
      const saldoMes = entradas - salidas;
      acumulado += saldoMes;
      return { mes, entradas, salidas, saldoMes, saldoAcumulado: acumulado };
    });
  }

  get saldoAcumuladoTotal(): number {
    const flujo = this.cashFlowByMonth;
    return flujo.length > 0 ? flujo[flujo.length - 1].saldoAcumulado : 0;
  }

  get maxAbsCashFlow(): number {
    return Math.max(1, ...this.cashFlowByMonth.map(f => Math.abs(f.saldoAcumulado)));
  }

  // ============ Estados Financieros / Balance General (datos reales) ============

  onReportsTab() {
    this.getmovimientos();
    this.getFacturas();
    this.getPagosNomina();
  }

  get cajaYBancos(): number {
    return this.saldoAcumuladoTotal;
  }

  get totalActivosBalance(): number {
    return this.cajaYBancos + this.totalPorCobrar + this.totalAssets;
  }

  get impuestosPorPagarBalance(): number {
    return this.taxResult && !this.taxResult.saldo_a_favor ? Number(this.taxResult.total_a_pagar) : 0;
  }

  get totalPasivosBalance(): number {
    return this.totalLiabilities + this.impuestosPorPagarBalance;
  }

  get patrimonioBalance(): number {
    return this.totalActivosBalance - this.totalPasivosBalance;
  }

  descargarBalancePDF() {
    const data = { idcliente: this.ids, idcreador: localStorage.getItem('id') };
    this.dataService.exportBalancePDF(data).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'balance.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => console.error(err)
    });
  }
}
