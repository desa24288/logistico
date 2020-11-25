import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { MotivoCargo } from '../models/entity/MotivoCargo';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable( )

export class MotivocargoService {

  private target_url = environment.URLServiciosRest.URLConexion.concat('/tipomotivocargo');

  constructor(private httpClient: HttpClient) {

  }

  public list(usuario:string, servidor:string): Observable<MotivoCargo[]> {
    return this.httpClient.post<MotivoCargo[]>(this.target_url,{
      'usuario' : usuario,
      'servidor': servidor
    });
  }

}