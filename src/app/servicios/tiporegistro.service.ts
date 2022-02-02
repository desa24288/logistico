import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoRegistro } from '../models/entity/TipoRegistro';
import { TipoReposicion } from '../models/entity/TipoReposicion';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TiporegistroService {

  private target_url = sessionStorage.getItem('enlace').toString().concat('/tipoderegistro');
  private urltiporep = sessionStorage.getItem('enlace').toString().concat('/boxtiporeposicion');


  constructor(public httpClient: HttpClient) {

  }

  public list(usuario:string,servidor: string): Observable<TipoRegistro[]> {
    return this.httpClient.post<TipoRegistro[]>(this.target_url,{
      'usuario': usuario,
      'servidor':servidor                                      
    } );
  }

  public tiporeposicion(usuario:string,servidor: string): Observable<TipoReposicion[]> {
    return this.httpClient.post<TipoReposicion[]>(this.urltiporep,{
      'usuario': usuario,
      'servidor':servidor                                      
    } );
  }

}