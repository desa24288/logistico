import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { MotivoAjuste } from '../models/entity/MotivoAjuste';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MotivoAjusteService {

  private target_url = sessionStorage.getItem('enlace').toString().concat('/tiposdeajustesinv');//'http://172.25.108.236:8187/tiposdeajustesinv';

  constructor(private httpClient: HttpClient) {

  }

  public list(usuario:string,servidor: string): Observable<MotivoAjuste[]> {
    return this.httpClient.post<MotivoAjuste[]>(this.target_url,{
      'usuario' : usuario,
      'servidor': servidor
    });
  }

}