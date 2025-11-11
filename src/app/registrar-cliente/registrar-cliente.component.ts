import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
    if (!this.clienteForm.valid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      return;
    }

    const empleadoData = {
      nombreEmpleado: this.clienteForm.value.nombre,
      direccion: this.clienteForm.value.direccion,
      edad: Number(this.clienteForm.value.edad),
      puesto: this.clienteForm.value.puesto
    };

    this.loading = true;
    this.errorMessage = '';
    this.submitSuccess = false;

    this.http.post<any>(this.apiUrl, empleadoData)
      .pipe(
        catchError(error => {
          this.loading = false;
          console.error('Error API:', error);
          this.errorMessage = error.error?.message || 'Error al registrar empleado.';
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Respuesta API:', response);

          if (response?.success) {
            this.submitSuccess = true;
            this.clienteForm.reset();
            setTimeout(() => this.submitSuccess = false, 3000);
          } else {
            this.errorMessage = response?.message || 'No se pudo registrar el empleado.';
          }
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}
