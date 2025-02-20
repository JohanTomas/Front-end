import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { HttpClientModule } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { ConsumoService } from "../services/consumo.service";
import { FormConsumoComponent } from "./form-consumo/form-consumo.component"; // Importa el componente del formulario
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-consumo-interno',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    HttpClientModule,
  ],
  templateUrl: './consumo-interno.component.html',
  styleUrl: './consumo-interno.component.css'
})
export class ConsumoInternoComponent {
  consumo: any[] = [];
  consumoToEdit: any = null;
  displayedColumns: string[] = [
    "id_consumo",
    "fecha",
    "nombre",
    "cantidad",
    "peso",
    "precio",
    "valorventa",
    "estado",
    "acciones",
  ];
  showingActive: boolean = true;

  // Variables para almacenar los totales
  totalCantidad: number = 0;
  totalPeso: number = 0;
  totalPrecio: number = 0;
  totalValorVenta: number = 0;

  constructor(
    private consumoService: ConsumoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadConsumo();// Cargar casas activas al inicializar
  }

  toggleConsumo(): void {
    this.showingActive = !this.showingActive;
    this.loadConsumo();
  }

  editConsumo(consumo: any): void {
    this.consumoToEdit = consumo; // Guarda la casa seleccionada para editar
    const dialogRef = this.dialog.open(FormConsumoComponent, {
      width: "400px",
      data: this.consumoToEdit, // Pasa la casa seleccionada al formulario de edición
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadConsumo(); // Recarga las casas después de editar
      }
    });
  }

  loadConsumo(): void {
    const service = this.showingActive
    ? this.consumoService.listConsumoActivas()
    : this.consumoService.listConsumoInactivas();

    service.subscribe({
      next: (data) => {
        this.consumo = data;
        console.log('Consumo cargadas:', this.consumo);
        this.calculateTotals(); 
      },
      error: (err) => {
        console.log('Error al cargar consumo:', err);
        Swal.fire('Error','No se pudieron cargar los consumo.', 'error');
      },
    });
  }
  
  // Función para calcular los totales de las columnas
  calculateTotals(): void {
    this.totalCantidad = this.consumo.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0);
    this.totalPeso = this.consumo.reduce((sum, item) => sum + (Number(item.peso) || 0), 0);
    this.totalPrecio = this.consumo.reduce((sum, item) => sum + (Number(item.precio) || 0), 0);
    this.totalValorVenta = this.consumo.reduce((sum, item) => sum + (Number(item.valorventa) || 0), 0);
  }

  // ✅ Función para generar y descargar el PDF
  downloadPDF(): void {
    const doc = new jsPDF();
  
    // Encabezado
    doc.setFontSize(18);
    doc.text('Reporte de Consumo Interno', 14, 15);
  
    // Tabla principal
    (doc as any).autoTable({
      startY: 25,
      head: [['ID', 'Fecha', 'Casa', 'Cantidad', 'Peso', 'Precio Uni.', 'Valor Venta']],
      body: this.consumo.map(c => [
        c.id_consumo,
        new Date(c.fecha).toLocaleDateString('es-ES'),
        c.nombre,
        c.cantidad,
        `${c.peso} kg`,
        `S/. ${c.precio.toFixed(2)}`,
        `S/. ${c.valorventa.toFixed(2)}`
      ]),
      theme: 'striped',
      styles: { fontSize: 10 }
    });
  
    // Totales al final
    (doc as any).autoTable({
      startY: (doc as any).autoTable.previous.finalY + 10, // 🔥 Corrección aquí
      body: [
        ['Total :                          ', this.totalCantidad, `${this.totalPeso} kg`, `S/. ${this.totalPrecio.toFixed(2)}`, `S/. ${this.totalValorVenta.toFixed(2)}`]
      ],
      theme: 'grid',
      styles: { fontSize: 12, fontStyle: 'bold' }
    });
  
    // Guardar el PDF
    doc.save('Reporte_Consumo_Interno.pdf');
  }

  toggleConsumoState(id: number, id_casa: number, estado: string): void {
    const isActive = estado === 'A';
    const action = isActive ? 'inactivar' : 'restaurar';

    Swal.fire({
      title: `¿Estas seguro de que seas ${isActive ? 'eliminar' :
      'restaurar'}?`,
      text: isActive
        ? '¡No podrás revertir esta acción!'
        : 'El consumo interno será restaurado.',
      icon: isActive ? 'warning' : 'info',
      showCancelButton: true,
      confirmButtonColor: isActive ? '#d33' : '#3085d6',
      cancelButtonColor: '#aaa',
      confirmButtonText: `Sí, ${isActive ? 'eliminar' : 'restaurar'}`,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const service = isActive
          ? this.consumoService.inactivateConsumo(id)
          : this.consumoService.restoreConsumo(id);

        service.subscribe({
          next: () => {
            Swal.fire(
              `${isActive ? 'Eliminada' : 'Restaurada'}!`,
              `El consumo interno ha sido ${isActive ? 'eliminada' : 'restaurada'} exitosamente.`,
              'success'
            );

            // Actualizar la lista de casas para reflejar el cambio de estado
            this.loadConsumo();
          },
          error: (err) => {
            console.error(`Error al ${action} del consumo interno:`, err);
            Swal.fire(
              'Error',
              `Hubo un problema al ${action} el consumo interno.`,
              'error'
            );
          },
        });
      }
    });
  }


  openFormConsumo(): void {
    const dialogRef = this.dialog.open(FormConsumoComponent, {
      width: '600px', // Ajusta el tamaño del modal
      disableClose: true, // Evita cerrar al hacer clic fuera del modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Formulario enviado:', result);
        // Puedes agregar lógica para guardar o actualizar los datos
        this.loadConsumo(); // Opcional: refresca la lista de casas después de agregar
      }
    });
  }
}
