import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../../../environments/environments';

interface Casa {
  id_casa: number;
  nombre: string;
  direccion: string;
  estado: string;
}

@Injectable({
  providedIn: "root", // Hace que el servicio esté disponible globalmente
})
export class CasaService {
  private baseUrl = environment.apiUrl+"/casas";

  constructor(private http: HttpClient) {}

  // Listar casas activas
  listCasasActivas(): Observable<Casa[]> {
    const url = `${this.baseUrl}/ListaActivos`;
    return this.http.get<Casa[]>(url);
  }

  // Listar casas inactivas
  listCasasInactivas(): Observable<Casa[]> {
    const url = `${this.baseUrl}/ListaInactivos`;
    return this.http.get<Casa[]>(url);
  }

  // Registrar casa
  registerCasa(casaData: any): Observable<any> {
    const url = this.baseUrl; // No necesita /registrar
    return this.http.post(url, casaData);
  }

  // Inactivar casa
  inactivateCasa(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}/inactivar`;
    return this.http.put(url, {});
  }

  // Restaurar casa
  restoreCasa(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}/restore`;
    return this.http.put(url, {});
  }

  // casa.service.ts
  updateCasa(id: number, casaData: Casa): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, casaData);
  }
}
