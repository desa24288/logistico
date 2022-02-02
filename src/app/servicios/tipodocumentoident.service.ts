import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TipoDocumentoIdentificacion } from '../models/entity/TipoDocumentoIdentificacion'

@Injectable()
export class TipodocumentoidentService {

  private target_url = sessionStorage.getItem('enlace').toString().concat('/tipodocumentoident');

  constructor(private httpClient: HttpClient)
   { }


   public list(usuario:string, servidor:string): Observable<TipoDocumentoIdentificacion[]> {
    return this.httpClient.post<TipoDocumentoIdentificacion[]>(this.target_url,{
      'usuario' : usuario,
      'servidor': servidor
    });
  }

}



