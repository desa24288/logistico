import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Servicio } from '../models/entity/Servicio';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private target_url = sessionStorage.getItem('enlace').toString().concat('/servicios');
  private url_listservicios = sessionStorage.getItem('enlace').toString().concat('/listaservicios');
 
 
 
  constructor(public httpClient: HttpClient) {

  }

  public list(usuario: string, servidor: string): Observable<Servicio[]> {
    return this.httpClient.post<Servicio[]>(this.target_url,{
      'usuario' : usuario,
      'servidor': servidor
    });
  }



  public listaservicios(hdgcodigo:number, esacodigo:number,cmecodigo:number,usuario: string, servidor: string,ambito:number): Observable<Servicio[]> {
    return this.httpClient.post<Servicio[]>(this.url_listservicios,{
      'hdgcodigo' : hdgcodigo,
      'esacodigo' : esacodigo,
      'cmecodigo' : cmecodigo,
      'usuario' : usuario,
      'servidor': servidor,
      'ambito'  : ambito
    });
  }




}