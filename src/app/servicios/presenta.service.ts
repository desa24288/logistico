import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Presenta } from '../models/entity/Presenta'

@Injectable({
  providedIn: 'root'
})
export class PresentaService {

  private target_url = environment.URLServiciosRest.URLConexion.concat('/presentacion');//'http://172.25.108.236:8181/formadepago';

  constructor(private httpClient: HttpClient) {

  }

  public list(usuario:string,servidor:string): Observable<Presenta[]> {
    return this.httpClient.post<Presenta[]>(this.target_url,{
      'usuario' : usuario,
      'servidor': servidor
    });
  }

}