import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AjusteValores } from '../models/entity/AjusteValores';
import { HttpClient } from '@angular/common/http';
import { StockProducto } from '../models/entity/StockProducto';
import { TraeAjustes } from '../models/entity/TraeAjustes';
import { Empresas } from '../models/entity/Empresas';
import { Sucursal } from '../models/entity/Sucursal';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AjustevaloresService {

  public urlBuscarproducto      : string = environment.URLServiciosRest.URLConexion.concat('/buscavaloresmamein');//'http://172.25.108.236:8195/buscavaloresmamein'; //Busca productos x codigo
 //public urlBuscarpordescripcion: string = environment.URLServiciosRest.URLConexion.concat('/buscaprodpordescripcion');// 'http://172.25.108.236:8182/buscaprodpordescripcion'; //Busca productos x descripcion
  public urlgrabaajustevalor    : string = environment.URLServiciosRest.URLConexion.concat('/grabaajustesstock'); //"http://172.25.108.236:8195/grabaajustesstock";
  public urlbuscavalores        : string = environment.URLServiciosRest.URLConexion.concat('/buscaajustevalores');//"http://172.25.108.236:8195/buscaajustevalores";
  public urlbuscaempresa        : string = environment.URLServiciosRest.URLConexion.concat('/buscaempresa');//"http://172.25.108.236:8181/buscaempresa";
  public urlbuscasucursal       : string = environment.URLServiciosRest.URLConexion.concat('/buscasucursal');//"http://172.25.108.236:8181/buscasucursal";

  constructor(private httpClient: HttpClient,
    public _http: HttpClient) {

  }

  /*public list(usuario:string,servidor:string): Observable<AjusteValores[]> {
    return this.httpClient.post<AjusteValores[]>(this.target_url,{
      'usuario' : usuario,
      'servidor': servidor
    });
  }*/

  BuscaEmpresa(hdgcodigo: number,usuario:string, servidor:String):Observable<Empresas[]> {
    console.log("Buscará producto por descripcion")
    return this._http.post<Empresas[]>(this.urlbuscaempresa, {
        'hdgcodigo': hdgcodigo,
        'usuario'  : usuario,
        'servidor' : servidor
    });
  }

  BuscaSucursal(hdgcodigo: number, esacodigo: number,usuario:string, servidor:String):Observable<Sucursal[]> {
      console.log("Buscará producto por descripcion")
      return this._http.post<Sucursal[]>(this.urlbuscasucursal, {
          'hdgcodigo': hdgcodigo,
          'esacodigo': esacodigo,
          'usuario'  : usuario,
          'servidor' : servidor
      });
  }

  BuscarProducto(hdgcodigo:number,esacodigo:number,cmecodigo:number, productotipo: string,productodesc: string,productocodi: string,usuario:string,servidor:string  ): Observable<AjusteValores[]> {
    console.log("Se realizará búsqueda por código:",productotipo,productodesc,productocodi,)
    return this._http.post<AjusteValores[]>(this.urlBuscarproducto, {
      'hdgcodigo'   : hdgcodigo,
      'esacodigo'   : esacodigo,
      'cmecodigo'   : cmecodigo,
      'productotipo': productotipo,
      'productodesc': productodesc,
      'productocodi': productocodi,
      'usuario'     : usuario,
      'servidor'    : servidor
    });
  }

  GrabaNuevosValores(paramajustestock): Observable<StockProducto[]> {
    return this._http.post<StockProducto[]>(this.urlgrabaajustevalor, {
       'paramajustestock': paramajustestock
    });
  }

  BuscaValores(fechaajusteini: string,fechaajustefin:string,responsable: string,productotipo:string,
    tipomotivoajus: string,usuario:string,servidor:string): Observable<TraeAjustes[]> {
      console.log("Busca los ajustes");
    return this._http.post<TraeAjustes[]>(this.urlbuscavalores, {
      'fechaajusteini'  : fechaajusteini,
      'fechaajustefin'  : fechaajustefin,
      'responsable'     : responsable,
      'productotipo'    : productotipo,
      'tipomotivoajus'  : tipomotivoajus,
      'usuario'         : usuario,
      'servidor'        : servidor
    });
   
  }
  /*BuscarProductosporDescripcion(descripcion: string, tipodeproducto: string): Observable<AjusteValores[]> {
    return this._http.post<AjusteValores[]>(this.urlBuscarpordescripcion, {
      'descripcion'   : descripcion,
      'tipodeproducto': tipodeproducto
    });
  }*/ 

}