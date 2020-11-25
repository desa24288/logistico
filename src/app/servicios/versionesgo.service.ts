import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Usuarios } from '../models/entity/Usuarios';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Versiones } from '../models/entity/Versiones';
 
@Injectable({
  providedIn: 'root'
})
export class VersionesService {

  private target_url = environment.URLServiciosRest.URLConexion.concat('/getversionrest');

  constructor(private httpClient: HttpClient) {

  }

  public VersionGoInformes(pinroversion: string): Observable<Versiones[]> {
    return this.httpClient.post<Versiones[]>(this.target_url,{
     'pinroversion' : pinroversion
    });
  }

}