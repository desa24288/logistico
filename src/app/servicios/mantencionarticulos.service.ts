import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Articulos } from '../../app/models/entity/mantencionarticulos';
import { Familia } from '../models/entity/Familia';
import { HttpClient } from '@angular/common/http';
import { Empresas } from '../models/entity/Empresas';
import { Sucursal } from '../models/entity/Sucursal';
import { environment } from '../../environments/environment';

@Injectable()
export class MantencionarticulosService {
    public url                      : string = environment.URLServiciosRest.URLConexion.concat('/grabamedicamento');
    public urlBuscarpordescripcion  : string = environment.URLServiciosRest.URLConexion.concat('/buscaprodpordescripcion');
    public urlBuscarporcodigo       : string = environment.URLServiciosRest.URLConexion.concat('/buscaprodporcodigo');
    public urlActualizar            : string = environment.URLServiciosRest.URLConexion.concat('/actualizamedicamento');
    public urlEliminar              : string = environment.URLServiciosRest.URLConexion.concat('/eliminamedicamento');
    public urlbuscafamilia          : string = environment.URLServiciosRest.URLConexion.concat('/familia');
    public urlbuscaholding          : string = environment.URLServiciosRest.URLConexion.concat('/buscaholding');
    public urlbuscaempresa          : string = environment.URLServiciosRest.URLConexion.concat('/buscaempresa');
    public urlbuscasucursal         : string = environment.URLServiciosRest.URLConexion.concat('/buscasucursal');

    constructor(public _http: HttpClient) {

    }

    getMantencionarticulos() {
        return "texto desde el servicio";
    }

    BuscaEmpresa(hdgcodigo: number,usuario:string, servidor:string):Observable<Empresas[]> {
 
        return this._http.post<Empresas[]>(this.urlbuscaempresa, {
            'hdgcodigo': hdgcodigo,
            'usuario'  : usuario,
            'servidor' : servidor
        });
    }

    BuscaSucursal(hdgcodigo: number, esacodigo: number,usuario:string, servidor:string):Observable<Sucursal[]> {
    
        return this._http.post<Sucursal[]>(this.urlbuscasucursal, {
            'hdgcodigo': hdgcodigo,
            'esacodigo': esacodigo,
            'usuario'  : usuario,
            'servidor' : servidor
        });
    }

    AddArticulos(producto: Articulos): Observable<Articulos> {


        return this._http.post<Articulos>(this.url, producto);
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

    BuscarArituculosPorDescripcion(hdgcodigo: number,esacodigo:number,cmecodigo:number,descripcion: string,usuario:string,servidor:string): Observable<Articulos[]> {
        return this._http.post<Articulos[]>(this.urlBuscarpordescripcion, {
            'hdgcodigo'  : hdgcodigo,
            'esacodigo'  : esacodigo,
            'cmecodigo'  : cmecodigo,
            'descripcion': descripcion,
            'usuario'    : usuario,
            'servidor'   : servidor
        });
    }

    EliminaArticulos(mein: number,usuario:string, servidor:string): Observable<any> {
        return this._http.post<any>(this.urlEliminar, {
            'mein'    : mein,
            'usuario' : usuario,
            'servidor': servidor
        });
    }

    UpdateArticulos(producto: Articulos): Observable<Articulos> {
        console.log("entra a ACTUALIZAR")
        console.log(producto);

        return this._http.post<Articulos>(this.urlActualizar, producto);
    }

    BuscaFamilias(tiporegistro: string,usuario:string,servidor:string): Observable<Familia[]> {
        console.log("Buscará producto por descripcion")
        return this._http.post<Familia[]>(this.urlbuscafamilia, {
            'tiporegistro': tiporegistro,
            'usuario'     : usuario,
            'servidor'    : servidor
        });
    }
}
