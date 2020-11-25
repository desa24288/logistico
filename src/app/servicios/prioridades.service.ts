import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Periodo } from '../models/entity/Periodo';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Prioridades } from '../models/entity/Prioridades';

@Injectable({
  providedIn: 'root'
})
export class PrioridadesService {

  private target_url = environment.URLServiciosRest.URLConexion.concat('/prioridades');//'http://172.25.108.236:8187/periodos';

  constructor(public httpClient: HttpClient) {

  }

  public list(usuario:string, servidor:string): Observable<Prioridades[]> {
    return this.httpClient.post<Prioridades[]>(this.target_url,{
      'usuario' : usuario,
      'servidor': servidor
    });
  }

}