import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Familia } from '../models/entity/Familia';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FamiliaService {

  private target_url = environment.URLServiciosRest.URLConexion.concat('/familia');//'http://172.25.108.236:8181/familia';

  constructor(public httpClient: HttpClient) {

  }

  public list(): Observable<Familia[]> {
    return this.httpClient.get<Familia[]>(this.target_url);
  }

}