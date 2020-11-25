import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrincAct } from '../models/entity/PrincAct';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrincActService {

  private target_url = environment.URLServiciosRest.URLConexion.concat('/principioactivo');

  constructor(public httpClient: HttpClient) {

  }

  public list(usuario:string,servidor:string): Observable<PrincAct[]> {
    return this.httpClient.post<PrincAct[]>(this.target_url,{
      'usuario' : usuario,
      'servidor': servidor
    });
  }
}