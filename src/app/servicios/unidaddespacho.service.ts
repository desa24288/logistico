import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { UnidadDespacho } from '../models/entity/UnidadDespacho';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UnidaddespachoService {

  private target_url = sessionStorage.getItem('enlace').toString().concat('/unidaddedespacho');// 'http://172.25.108.236:8181/unidaddedespacho';

  constructor(private httpClient: HttpClient) {

  }

  public list(usuario:string, servidor:string): Observable<UnidadDespacho[]> {
    return this.httpClient.post<UnidadDespacho[]>(this.target_url,{
      'usuario' : usuario,
      'servidor': servidor
    });
  }

}