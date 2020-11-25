import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { UnidadCompra } from '../models/entity/UnidadCompra';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UnidadcompraService {

  private target_url = environment.URLServiciosRest.URLConexion.concat('/unidaddecompra');

  constructor(private httpClient: HttpClient) {

  }

  public list(usuario:string, servidor:string): Observable<UnidadCompra[]> {
    return this.httpClient.post<UnidadCompra[]>(this.target_url,{
      'usuario' : usuario,
      'servidor': servidor
    });
  }

}
