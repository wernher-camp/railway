import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-cliente',
  standalone: true,
  templateUrl: './registrar-cliente.component.html',
  styleUrls: ['./registrar-cliente.component.css'],
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule]
})
export class RegistrarClienteComponent {
  clienteForm: FormGroup;
  loading = false;
  submitSuccess = false;
  errorMessage = '';

  private apiUrl = 'https://micro-factura-demo-production.up.railway.app/api/registrarEmpleado';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18)]],
      puesto: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

  onSubmit() {
    if (!this.clienteForm.valid) return;

    const empleadoData = {
      nombreEmpleado: this.clienteForm.value.nombre,
      direccion: this.clienteForm.value.direccion,
      edad: this.clienteForm.value.edad,
      puesto: this.clienteForm.value.puesto
    };

    this.loading = true;
    this.errorMessage = '';
    this.submitSuccess = false;

    this.http.post(this.apiUrl, empleadoData)
      .pipe(
        catchError(error => {
          this.loading = false;
          this.errorMessage = 'Error al registrar empleado. Por favor intenta nuevamente.';
          return throwError(error);
        })
      )
      .subscribe({
        next: () => {
          this.loading = false;
          this.submitSuccess = true;
          this.clienteForm.reset();
          setTimeout(() => this.submitSuccess = false, 3000);
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}
