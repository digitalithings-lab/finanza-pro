import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, UserPlus, Users, Edit, Trash2, Loader2, X, Eye, EyeOff, CheckCircle } from 'lucide-angular';
import { AuthService } from 'src/app/services/auth.service';

interface Personal {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
  usuario: string;
}

@Component({
  selector: 'app-personalcomponent',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './personalcomponent.component.html',
  styleUrls: ['./personalcomponent.component.css']
})
export class PersonalcomponentComponent implements OnInit {
  personalForm: FormGroup;
  isLoading = false;
  deletingId: number | null = null;

  showEditModal = false;
  isUpdating = false;
  editError = '';
  showEditPassword = false;
  editModel = {
    id: 0,
    nombre: '',
    apellido: '',
    correo: '',
    rol: 'Contador',
    usuario: '',
    password: ''
  };

  notification: string | null = null;
  notificationType: 'success' | 'error' = 'success';
  
  // Lucide icons
  readonly UserPlus = UserPlus;
  readonly Users = Users;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Loader2 = Loader2;
  readonly X = X;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly CheckCircle = CheckCircle;

  roles = ['Contador', 'Gerente', 'Cajero', 'Vendedor', 'Soporte'];

  constructor(private fb: FormBuilder,private service: AuthService) {
    this.personalForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
      usuario: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Initial mock data

    this.getpersonal();
   
  }

  onSubmit() {
    if (this.personalForm.valid) {
      this.isLoading = true;
      const data={
        nombre:this.personalForm.value.nombre,
        apellido:this.personalForm.value.apellido,
        correo:this.personalForm.value.correo,
        user:this.personalForm.value.usuario,
        role:this.personalForm.value.rol,
        password:this.personalForm.value.contrasena,
        idcreador:localStorage.getItem('id')
      }
      console.log(data);

      this.service.personalreg(data).subscribe({
        next: (resp: any) => {
          console.log(resp);
          
          this.isLoading = false;
          if(resp.success === true){
            this.getpersonal();
            this.personalForm.reset({ rol: '' });
          }
          else{
            console.log("error");
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          console.log("error", err);
        }
      });
      
    } else {
      this.personalForm.markAllAsTouched();
    }
  }

  deletePersonal(id: number) {
    if (this.deletingId === id) {
      return;
    }

    this.deletingId = id;
    this.service.deletePersonal({
      id,
      idcreador: localStorage.getItem('id')
    }).subscribe({
      next: (resp: any) => {
        this.deletingId = null;
        if (resp.success === true) {
          this.data = this.data.filter((p: Personal) => p.id !== id);
          this.showNotification('Personal eliminado correctamente', 'success');
        }
      },
      error: (err: any) => {
        this.deletingId = null;
        this.showNotification('Error al eliminar personal', 'error');
        console.error('Error al eliminar personal', err);
      }
    });
  }

  openEditModal(p: Personal) {
    this.editError = '';
    this.showEditPassword = false;
    this.editModel = {
      id: p.id,
      nombre: p.nombre || '',
      apellido: p.apellido || '',
      correo: p.correo || '',
      rol: this.roles.includes(p.rol) ? p.rol : 'Contador',
      usuario: p.usuario || '',
      password: ''
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    if (this.isUpdating) return;
    this.showEditModal = false;
    this.editError = '';
  }

  saveEditPersonal() {
    if (this.isUpdating) return;
    if (!this.editModel.nombre.trim() || !this.editModel.apellido.trim() || !this.editModel.usuario.trim() || !this.editModel.rol) {
      this.editError = 'Nombre, apellido, usuario y rol son obligatorios.';
      return;
    }

    this.isUpdating = true;
    this.editError = '';

    this.service.updatePersonal({
      id: this.editModel.id,
      idcreador: localStorage.getItem('id'),
      nombre: this.editModel.nombre.trim(),
      apellido: this.editModel.apellido.trim(),
      correo: this.editModel.correo.trim(),
      user: this.editModel.usuario.trim(),
      role: this.editModel.rol,
      password: this.editModel.password ? this.editModel.password : undefined
    }).subscribe({
      next: (resp: any) => {
        this.isUpdating = false;
        if (resp?.success === true) {
          this.showEditModal = false;
          this.getpersonal();
          this.showNotification('Personal actualizado correctamente', 'success');
        } else {
          this.editError = resp?.mensaje || 'No se pudo actualizar el personal.';
        }
      },
      error: (err: any) => {
        this.isUpdating = false;
        this.editError = err?.error?.mensaje || 'Error de conexión al actualizar personal.';
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success') {
    this.notification = message;
    this.notificationType = type;
    setTimeout(() => (this.notification = null), 3500);
  }
  public data: Personal[] = [];

  getpersonal(){
    const id = localStorage.getItem('id');
    const data = { id };

    this.service.getpersonal(data).subscribe((resp: any) => {
      if (resp.success === true && Array.isArray(resp.data)) {
        this.data = resp.data.map((p: any) => ({
          ...p,
          usuario: p.usuario ?? p.user ?? '',
          rol: p.rol ?? p.role ?? ''
        }));
      }
    });
  }
}
