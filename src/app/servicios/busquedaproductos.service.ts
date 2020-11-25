
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Articulos } from '../../app/models/entity/mantencionarticulos';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class BusquedaproductosService {
    
    public urlBuscarpordescripcion  : string = environment.URLServiciosRest.URLConexion.concat('/buscaprodpordescripcion');
    public urlBuscarporcodigo       : string = environment.URLServiciosRest.URLConexion.concat('/buscaprodporcodigo');
    public urlBuscarPpoPresForma    : string = environment.URLServiciosRest.URLConexion.concat('/buscaprodporprincipio');
    constructor(public _http: HttpClient) {

    }

    
    
    BuscarArticulosPorCodigo(hdgcodigo: number,esacodigo:number,cmecodigo:number,codigo: string,usuario:string,servidor:string): Observable<Articulos[]> {

        return this._http.post<Articulos[]>(this.urlBuscarporcodigo, {
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'codigo'    : codigo,
            'usuario'   : usuario,
            'servidor'  : servidor
        });
    }                      
    
    
    

    BuscarArituculosFiltros(hdgcodigo: number,esacodigo:number,cmecodigo:number,codigo: string,
        descripcion: string,codpact:number,codpres:number,codffar:number, tipodeproducto:string,
        idbodega:number,controlminimo:string,controlado:string, consignacion:string, usuario:string,
        servidor:string): Observable<Articulos[]> {
        return this._http.post<Articulos[]>(this.urlBuscarpordescripcion, {
            'hdgcodigo'  : hdgcodigo,
            'esacodigo'  : esacodigo,
            'cmecodigo'  : cmecodigo,
            'descripcion': descripcion,
            'tipodeproducto': tipodeproducto,
            'princactivo' :codpact,
            'presentacion':codpres,
            'FormaFarma' : codffar,
            'codigo'     : codigo, 
            'idbodega' : idbodega,
            'controlminimo':controlminimo,
            'controlado': controlado,
            'consignacion': consignacion,
            'usuario'    : usuario,
            'servidor'   : servidor
        });
    }

    BuscarPpoPresForma(hdgcodigo: number,esacodigo:number,cmecodigo:number,descripcion: string,usuario:string,servidor:string): Observable<Articulos[]> {
        return this._http.post<Articulos[]>(this.urlBuscarPpoPresForma, {
            'hdgcodigo'  : hdgcodigo,
            'esacodigo'  : esacodigo,
            'cmecodigo'  : cmecodigo,
            'descripcion': descripcion,
            'usuario'    : usuario,
            'servidor'   : servidor
        });
    }

    
}
