import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

// Environments
import { environment } from '../../environments/environment';

// Services
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  public busqueda: string = '';

  constructor(
    private http: HttpClient,
  ) { }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  obtenerHospitales(desde?: number) {
    const url = `${base_url}/hospitales?desde=${desde || 0}`;   
    
    return this.http.get(url, this.headers)
      .pipe(
        map((resp: {ok: boolean, hospitales: Hospital[], total: number}) => {
          return {
            hospitales: resp.hospitales,
            total: resp.total
          }
        })            
      )
  }

  obtenerHospitalesTodos() {
    const url = `${base_url}/hospitales/todos`;   
    
    return this.http.get(url, this.headers)
      .pipe(
        map((resp: {ok: boolean, hospitales: Hospital[]}) => {
          return resp.hospitales;
        })            
      )
  }

  crearHospital(nombre: string) {
    const url = `${base_url}/hospitales`;
    return this.http.post(url, { nombre }, this.headers);
  }

  actualizarHospital(_id: string, nombre: string) {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.put(url, { nombre }, this.headers);
  }

  eliminarHospital(_id: string) {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
