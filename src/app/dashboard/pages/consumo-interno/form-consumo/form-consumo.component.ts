import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  isEditing: boolean = false; // Variable para controlar si es edición

  constructor(
    private fb: FormBuilder,
    private ConsumoService: ConsumoService,
    private dialogRef: MatDialogRef<FormConsumoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inyectamos los datos aquí
  ) {
    this.isEditing = !!data?.id_consumo; // Si tiene ID, es edición
    this.initializeForm(data);
  }

  ngOnInit(): void {
    this.loadCasas(); // Cargar las casas al inicio
  }

  // Inicializar el formulario
  initializeForm(data?: any): void {
    this.consumoForm = this.fb.group({
      id_consumo: new FormControl(data?.id_consumo || null), // ID solo en edición
      fecha: new FormControl(data?.fecha || ''),
      id_casa: new FormControl(data?.id_casa || ''),
      cantidad: new FormControl(data?.cantidad || ''),
      peso: new FormControl(data?.peso || ''),
      precio: new FormControl(data?.precio || ''),
      valorventa: new FormControl(data?.valorventa || ''),
      estado: new FormControl(data?.estado || 'A'),
    });
    if (data) {
      this.consumoForm.patchValue(data);
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


  // Guardar o actualizar consumo
  submitForm(): void {
    if (this.consumoForm) {
      const formData = this.consumoForm.value;
      const formattedFecha = new Date(formData.fecha).toISOString().split('T')[0];
  
      const consumoData = {
        ...formData,
        fecha: formattedFecha,
        id_casa: Number(formData.id_casa),
        cantidad: Number(formData.cantidad),
        peso: parseFloat(formData.peso),
        precio: parseFloat(formData.precio),
        valorventa: parseFloat(formData.valorventa),
      };
  
      // Eliminamos el campo 'nombre' si por algún motivo llega a estar en el objeto
      delete consumoData.nombre;
  
      console.log('Datos enviados: ', consumoData);
  
      if (this.isEditing) {
        this.ConsumoService.updateConsumo(consumoData.id_consumo, consumoData).subscribe({
          next: () => {
            console.log('Consumo actualizado con éxito');
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Error al actualizar el consumo:', error);
          },
        });
      } else {
        this.ConsumoService.registerConsumo(consumoData).subscribe({
          next: () => {
            console.log('Consumo registrado con éxito');
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Error al registrar el consumo:', error);
          },
        });
      }
    }
  }
  

  cancel(): void {
    this.dialogRef.close(false);
  }
}
