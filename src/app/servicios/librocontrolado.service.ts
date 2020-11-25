import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { LibroControlado } from '../models/entity/LibroControlado';
import { RetornaMensaje } from '../models/entity/RetornaMensaje';
import { PeriodoMedControlado } from '../models/entity/PeriodoMedControlado';
import { ConsultaLibroControlado } from '../models/entity/ConsultaLibroControlado';


@Injectable()
  
export class LibrocontroladoService {

  public urlprodbodegacontrol: string = environment.URLServiciosRest.URLConexion.concat('/selbodinvmedcontrolados');
  public urlgrabacierre      : string = environment.URLServiciosRest.URLConexion.concat('/creacierrelibromedcontrolados');
  public urlperprodcontrol   : string = environment.URLServiciosRest.URLConexion.concat('/selperimedcontrolados');
  public urlconsultalibcontrol: string= environment.URLServiciosRest.URLConexion.concat('/selcierrelibromedcontrolados')
  
  constructor(private _http: HttpClient) {

  }

  BuscaProductoBodegaControl(servidor: string,hdgcodigo: number,esacodigo: number,cmecodigo: number,
    codbodegacontrolados:number):Observable<LibroControlado[]>{
    return this._http.post<LibroControlado[]>(this.urlprodbodegacontrol, {
      'servidor'      : servidor,
      'hdgcodigo'     : hdgcodigo,
      'esacodigo'     : esacodigo,
      'cmecodigo'     : cmecodigo,
      'codbodegacontrolados': codbodegacontrolados
      
    });
  }

  GrabaCierreLibroControlado(hdgcodigo: number,esacodigo: number,cmecodigo: number,servidor: string,
    usuario:string,codbodegacontrolados:number):Observable<RetornaMensaje[]>{
    return this._http.post<RetornaMensaje[]>(this.urlgrabacierre, {
      'hdgcodigo' : hdgcodigo,
      'esacodigo' : esacodigo,
      'cmecodigo' : cmecodigo,
      'servidor'  : servidor,
      'usuario'   : usuario,
      'codbodegacontrolados': codbodegacontrolados
      
    });
  }

  BuscaPeriodoMedControlados(hdgcodigo: number,esacodigo: number,cmecodigo: number,servidor: string,
    usuario:string,codbodegacontrolados:number):Observable<PeriodoMedControlado[]>{
    return this._http.post<PeriodoMedControlado[]>(this.urlperprodcontrol, {
      'hdgcodigo'     : hdgcodigo,
      'esacodigo'     : esacodigo,
      'cmecodigo'     : cmecodigo,
      'servidor'      : servidor,
      'usuario'       : usuario,
      'codbodegacontrolados': codbodegacontrolados
      
    });
  }

  ConsultaLibroControlado(hdgcodigo: number,esacodigo: number,cmecodigo: number,
    servidor: string, usuario:string,libcid:number, codbodegacontrolados:number,
    meinid:number):Observable<ConsultaLibroControlado[]>{
    return this._http.post<ConsultaLibroControlado[]>(this.urlconsultalibcontrol, {
      'hdgcodigo'     : hdgcodigo,
      'esacodigo'     : esacodigo,
      'cmecodigo'     : cmecodigo,
      'servidor'      : servidor,
      'usuario'       : usuario,
      'libcid'        : libcid,
      'codbodegacontrolados': codbodegacontrolados,
      'meinid'        : meinid      
    });
  }

}