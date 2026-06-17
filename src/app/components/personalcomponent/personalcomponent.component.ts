import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, UserPlus, Users, Edit, Trash2, Loader2 } from 'lucide-angular';
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
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './personalcomponent.component.html',
  styleUrls: ['./personalcomponent.component.css']
})
export class PersonalcomponentComponent implements OnInit {
  personalForm: FormGroup;
  personalList: Personal[] = [];
  isLoading = false;
  
  // Lucide icons
  readonly UserPlus = UserPlus;
  readonly Users = Users;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Loader2 = Loader2;

  roles = ['Administrador', 'Gerente', 'Cajero', 'Vendedor', 'Soporte'];

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
    this.personalList = this.personalList.filter(p => p.id !== id);
  }
  public data:any

  getpersonal(){

    const id = localStorage.getItem('id')
    const data={

      id:id
    }


    this.service.getpersonal(data).subscribe((resp=>{
      console.log(resp);
      this.data=resp.data
      
    }))

  }
}
