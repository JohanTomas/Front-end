import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { CasaService } from "../../services/casa.service";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { Casa } from "../../../../interface/casa.interface";
import Swal from "sweetalert2";

@Component({
  selector: "app-form-casa",
  templateUrl: "./form-casa.component.html",
  styleUrls: ["./form-casa.component.css"],
  standalone: true,
  providers: [CasaService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class FormCasaComponent implements OnInit {
  casaForm?: FormGroup;
  step = 1;
  formData: any = null;

  constructor(
    private fb: FormBuilder,
    private casaService: CasaService,
    private dialogRef: MatDialogRef<FormCasaComponent>
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // No es necesario hacer nada aquí
  }

  initializeForm(): void {
    this.casaForm = this.fb.group({
      nombre: new FormControl(
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')] // Solo letras y espacios
      ),
      direccion: new FormControl(
        '',
        [Validators.required, Validators.pattern('^[A-Za-z0-9\\s,.-]+$')] // Formato de dirección válido
      ),
      estado: new FormControl('A', [Validators.required]), // Por defecto, "Activo"
    });

    if (this.formData) {
      this.casaForm.patchValue(this.formData);
    }
  }

  private showValidationMessage(field: string, errorKey: string): void {
    const errorMessages: { [key: string]: string } = {
      'nombre:required': 'El nombre es obligatorio.',
      'nombre:pattern': 'El nombre solo debe contener letras y espacios.',
      'direccion:required': 'La dirección es obligatoria.',
      'direccion:pattern':
        'La dirección debe contener letras, números y un formato válido (Ej: Av. Central 678, Ciudad).',
    };

    Swal.fire(
      'Formato Inválido',
      errorMessages[`${field}:${errorKey}`] || 'Por favor verifica los campos.',
      'warning'
    );
  }

  validateForm(): boolean {
    const controls = this.casaForm?.controls;

    for (const field in controls) {
      const control = controls[field];
      if (control && control.invalid) {
        const errors = control.errors;
        if (errors) {
          for (const errorKey in errors) {
            this.showValidationMessage(field, errorKey);
            return false;
          }
        }
      }
    }

    return true; // Si todo está válido
  }

  submitForm(): void {
    if (this.casaForm?.valid && this.validateForm()) {
      const { nombre, direccion, estado } = this.casaForm.value;
      const casaData = { nombre, direccion, estado };

      this.casaService.registerCasa(casaData).subscribe({
        next: () => {
          Swal.fire(
            'Registro Exitoso',
            'La casa ha sido registrada correctamente.',
            'success'
          );
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          Swal.fire(
            'Error',
            'No se pudo registrar la casa. Intenta nuevamente.',
            'error'
          );
          console.error('Error al registrar la casa:', error);
        },
      });
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  nextStep(): void {
    if (this.step < 1 && this.casaForm) {
      this.formData = this.casaForm.value;
      this.step++;
    }
  }

  previousStep(): void {
    if (this.step > 1 && this.casaForm) {
      this.step--;
      this.casaForm.patchValue(this.formData);
    }
  }
}
