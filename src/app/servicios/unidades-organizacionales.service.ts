import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UnidadesOrganizacionales } from '../models/entity/unidades-organizacionales';

@Injectable({
  providedIn: 'root'
})
export class UnidadesOrganizacionalesService {
  
  private url_buscarunidadesorganizacionales = environment.URLServiciosRest.URLConexionSolicitudConsumo.concat('/buscarunidadesorganizacionales');

  constructor(public httpClient: HttpClient) { }

  
  public buscarCentroCosto( accion:string, correlativo:number,unortype:string,descripcion:string,codigoflexible:string,unorcorrelativo:number,
                            codigosucursal:number,codigooficina:number,rutficticio:number,vigente:string,usuario:string,servidor:string): Observable<UnidadesOrganizacionales[]> 
                            {
                          return this.httpClient.post<UnidadesOrganizacionales[]>(this.url_buscarunidadesorganizacionales,{

        accion:accion,
        correlativo:correlativo,
        unortype:unortype,
        descripcion:descripcion,
        codigoflexible:codigoflexible,
        unorcorrelativo:unorcorrelativo,
        codigosucursal:codigosucursal,
        codigooficina:codigooficina,
        rutficticio:rutficticio,
        vigente:vigente,
        usuario:usuario,
        servidor:servidor
    });
  }



}
