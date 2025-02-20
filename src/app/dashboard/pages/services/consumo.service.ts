import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../../../environments/environments';

interface Consumo {
  id_consumo: number;
  fecha: string;
  id_casa: number;
  nombre: string;
  cantidad: number;
  peso: number;
  precio: number;
  valorventa: number;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsumoService {
  private baseUrl = environment.apiUrl+"/consumo";

  constructor(private http: HttpClient) {}

  listConsumoActivas(): Observable<Consumo[]> {
    const url = `${this.baseUrl}/ListaActivos`;
    return this.http.get<Consumo[]>(url);
  }

  listConsumoInactivas(): Observable<Consumo[]> {
    const url = `${this.baseUrl}/ListaInactivos`;
    return this.http.get<Consumo[]>(url);
  }

  registerConsumo(consumoData: any): Observable<any> {
    const url = this.baseUrl;
    return this.http.post(url, consumoData);
  }

  inactivateConsumo(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}/inactivar`;
    return this.http.put(url, {});
  }

  restoreConsumo(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}/restore`;
    return this.http.put(url, {});
  }

  updateConsumo(id: number, consumoData: Consumo): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, consumoData);
  }

  getCasas(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/casas'); // URL del backend
  }
}
