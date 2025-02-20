import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ConsumoService } from '../../services/consumo.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-form-consumo',
  templateUrl: './form-consumo.component.html',
  styleUrls: ['./form-consumo.component.css'],
  standalone: true,
  providers: [ConsumoService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class FormConsumoComponent implements OnInit {
  consumoForm?: FormGroup;
  step = 1;
  formData: any = null;
  casas: any[] = []; // Lista de casas

  constructor(
    private fb: FormBuilder,
    private ConsumoService: ConsumoService,
    private dialogRef: MatDialogRef<FormConsumoComponent>
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadCasas(); // Cargar las casas al inicio
  }

  // Inicializar el formulario
  initializeForm(): void {
    this.consumoForm = this.fb.group({
      fecha: new FormControl(''),
      id_casa: new FormControl(''),
      cantidad: new FormControl(''),
      peso: new FormControl(''),
      precio: new FormControl(''),
      valorventa: new FormControl(''),
      estado: new FormControl('A'),
    });

    if (this.formData) {
      this.consumoForm.patchValue(this.formData);
    }
  }

  // Método para cargar las casas
  loadCasas(): void {
    this.ConsumoService.getCasas().subscribe(
      (data) => {
        this.casas = data.filter((casa) => casa.estado === "A"); // Asignar las casas obtenidas al arreglo de casas
      },
      (error) => {
        console.error('Error al cargar las casas', error);
      }
    );
  }

  nextStep(): void {
    if (this.step < 1 && this.consumoForm) {
      this.formData = this.consumoForm.value;
      this.step++;
    }
  }

  previousStep(): void {
    if (this.step > 1 && this.consumoForm) {
      this.step--;
      this.consumoForm.patchValue(this.formData);
    }
  }

  // Función para calcular el peso automáticamente cuando se ingresa la cantidad
  onCantidadChange(): void {
    const cantidad = this.consumoForm?.get('cantidad')?.value;
    if (cantidad) {
      const peso = cantidad / 15.5; // Dividir la cantidad por 15.5
      this.consumoForm?.patchValue({ peso: peso.toFixed(2) });
      this.onPrecioChange(); // Recalcular el valor de venta si el peso cambia
    }
  }

  // Función para calcular el valor de venta automáticamente cuando se ingresa el precio
  onPrecioChange(): void {
    const peso = this.consumoForm?.get('peso')?.value;
    const precio = this.consumoForm?.get('precio')?.value;
    if (peso && precio) {
      const valorventa = peso * precio; // Multiplicar el peso por el precio
      this.consumoForm?.patchValue({ valorventa: valorventa.toFixed(2) });
    }
  }


  submitForm(): void {
    if (this.consumoForm) {
      // Convertir la fecha al formato adecuado
      const fecha = new Date(this.consumoForm.value.fecha);
      const formattedFecha = fecha.toISOString().split('T')[0]; // 'yyyy-MM-dd'

      const consumoData = {
        fecha: formattedFecha,
        id_casa: Number(this.consumoForm.value.id_casa),  // Convierte a número
        cantidad: Number(this.consumoForm.value.cantidad),  // Convierte a número
        peso: Number(this.consumoForm.value.peso),  // Convierte a número
        precio: Number(this.consumoForm.value.precio),  // Convierte a número
        valorventa: Number(this.consumoForm.value.valorventa),  // Convierte a número
        estado: this.consumoForm.value.estado || "A"
      };

      console.log('Datos enviados: ', consumoData);

      // **Mueve el foco antes de cerrar el diálogo**
      document.body.focus();
      
      this.ConsumoService.registerConsumo(consumoData).subscribe({
        next: () => {
          console.log('Formulario enviado con éxito');
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('Error al registrar el consumo:', error);
          console.error('Detalles del error:', error.message);
          console.error('Código de estado:', error.status);
          console.error('Respuesta del servidor:', error.error);
        },
      });
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
