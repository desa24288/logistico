import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocIdentificacion } from '../models/entity/DocIdentificacion';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocidentificacionService {

  private target_url = sessionStorage.getItem('enlace').toString().concat('/docidentificacion');//'http://172.25.108.236:8189/docidentificacion';

  constructor(public httpClient: HttpClient) {

  }

  public list(usuario:string,servidor:string): Observable<DocIdentificacion[]> {
    return this.httpClient.post<DocIdentificacion[]>(this.target_url,{
      'usuario' : usuario,
      'servidor': servidor
    });
  }

}