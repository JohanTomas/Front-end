import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
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
  isEditing: boolean = false; // Nueva variable para identificar si es edición

  constructor(
    private fb: FormBuilder,
    private casaService: CasaService,
    private dialogRef: MatDialogRef<FormCasaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inyectamos datos aquí
  ) {
    this.isEditing = !!data?.id_casa; // Si tiene un id, significa que es edición
    this.initializeForm(data);
  }

  ngOnInit(): void {
    // No es necesario hacer nada aquí
  }
  initializeForm(data?: any): void {
    this.casaForm = this.fb.group({
      id_casa: new FormControl(data?.id_casa || null), // Si hay ID, es edición
      nombre: new FormControl(data?.nombre || '', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]),
      direccion: new FormControl(data?.direccion || '', [Validators.required, Validators.pattern('^[A-Za-z0-9\\s,.-]+$')]),
      estado: new FormControl(data?.estado || 'A', [Validators.required]),
    });

    if (data) {
      this.casaForm.patchValue(data);
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
    if (this.casaForm?.valid) {
      const casaData = this.casaForm.value;

      console.log("Datos enviados: ", casaData);

      if (this.isEditing) {
        // Si estamos editando, llamamos a la función de actualización
        this.casaService.updateCasa(casaData.id_casa, casaData).subscribe({
          next: () => {
            Swal.fire("Actualización Exitosa", "La casa ha sido actualizada.", "success");
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            Swal.fire("Error", "No se pudo actualizar la casa.", "error");
            console.error("Error al actualizar la casa:", error);
          },
        });
      } else {
        // Si es un nuevo registro
        this.casaService.registerCasa(casaData).subscribe({
          next: () => {
            Swal.fire("Registro Exitoso", "La casa ha sido registrada correctamente.", "success");
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            Swal.fire("Error", "No se pudo registrar la casa.", "error");
            console.error("Error al registrar la casa:", error);
          },
        });
      }
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
