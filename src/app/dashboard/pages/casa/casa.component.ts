import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { HttpClientModule } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { CasaService } from "../services/casa.service";
import { FormCasaComponent } from "./form-casa/form-casa.component"; // Importa el componente del formulario

@Component({
  selector: "app-casa",
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
  templateUrl: "./casa.component.html",
  styleUrls: ["./casa.component.css"],
})
export class CasaComponent implements OnInit {
  casas: any[] = []; // Almacena los datos de la API
  casaToEdit: any = null;
  displayedColumns: string[] = [
    "id_casa",
    "nombre",
    "direccion",
    "estado",
    "acciones",
  ];
  showingActive: boolean = true;

  constructor(
    private casaService: CasaService,
    private dialog: MatDialog // Agrega el servicio MatDialog para manejar los modales
  ) {}

  ngOnInit(): void {
    this.loadCasas(); // Cargar casas activas al inicializar
  }

  // Método para alternar entre activos e inactivos
  toggleCasas(): void {
    this.showingActive = !this.showingActive; // Cambiar el estado
    this.loadCasas(); // Recargar los datos según el estado
  }

  // CasaComponent
  editCasa(casa: any): void {
    this.casaToEdit = casa; // Guarda la casa seleccionada para editar
    const dialogRef = this.dialog.open(FormCasaComponent, {
      width: "400px",
      data: this.casaToEdit, // Pasa la casa seleccionada al formulario de edición
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCasas(); // Recarga las casas después de editar
      }
    });
  }

  // Cargar casas activas o inactivas
  loadCasas(): void {
    const service = this.showingActive
      ? this.casaService.listCasasActivas()
      : this.casaService.listCasasInactivas();

    service.subscribe({
      next: (data) => {
        this.casas = data;
        console.log("Casas cargadas:", this.casas); // Log para verificar
      },
      error: (err) => {
        console.error("Error al cargar casas:", err);
        Swal.fire("Error", "No se pudieron cargar las casas.", "error");
      },
    });
  }

  // Alternar entre eliminar y restaurar
  toggleCasaState(id: number, nombre: string, estado: string): void {
    const isActive = estado === "A";
    const action = isActive ? "inactivar" : "restaurar";

    Swal.fire({
      title: `¿Estás seguro de que deseas ${
        isActive ? "eliminar" : "restaurar"
      }?`,
      text: isActive
        ? "¡No podrás revertir esta acción!"
        : "La casa será restaurada.",
      icon: isActive ? "warning" : "info",
      showCancelButton: true,
      confirmButtonColor: isActive ? "#d33" : "#3085d6",
      cancelButtonColor: "#aaa",
      confirmButtonText: `Sí, ${isActive ? "eliminar" : "restaurar"}`,
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const service = isActive
          ? this.casaService.inactivateCasa(id)
          : this.casaService.restoreCasa(id);

        service.subscribe({
          next: () => {
            Swal.fire(
              `${isActive ? "Eliminada" : "Restaurada"}!`,
              `La casa ha sido ${
                isActive ? "eliminada" : "restaurada"
              } exitosamente.`,
              "success"
            );

            // Actualizar la lista de casas para reflejar el cambio de estado
            this.loadCasas();
          },
          error: (err) => {
            console.error(`Error al ${action} la casa:`, err);
            Swal.fire(
              "Error",
              `Hubo un problema al ${action} la casa.`,
              "error"
            );
          },
        });
      }
    });
  }

  // Método para abrir el formulario modal
  openFormCasa(): void {
    const dialogRef = this.dialog.open(FormCasaComponent, {
      width: "600px", // Ajusta el tamaño del modal
      disableClose: true, // Evita cerrar al hacer clic fuera del modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Formulario enviado:", result);
        // Puedes agregar lógica para guardar o actualizar los datos
        this.loadCasas(); // Opcional: refresca la lista de casas después de agregar
      }
    });
  }
}
