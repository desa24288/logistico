import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { TipoMovimiento } from '../models/entity/TipoMovimiento';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable()
export class TipomovimientoService {

  private target_url = environment.URLServiciosRest.URLConexion.concat('/tipomovimientofarmacia');//tipodespacho, ese servicio muestra mas datos en el combo

  constructor(private httpClient: HttpClient) {

  }

  public list(usuario:string, servidor:string): Observable<TipoMovimiento[]> {
    return this.httpClient.post<TipoMovimiento[]>(this.target_url,{
      'usuario' : usuario,
      'servidor': servidor
    });
  }

}




