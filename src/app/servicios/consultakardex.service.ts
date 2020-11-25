import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { ConsultaKardex } from '../../app/models/entity/ConsultaKardex';
import { DetalleKardex } from '../../app/models/entity/DetalleKardex';
import { HttpClient } from '@angular/common/http';
import { Empresas } from '../models/entity/Empresas';
import { Sucursal } from '../models/entity/Sucursal';
import { BodegaVigente } from '../models/entity/BodegaVigente';
import { environment } from '../../environments/environment';


@Injectable()
export class ConsultakardexService {
    public urlbuscaporcodigo     : string = environment.URLServiciosRest.URLConexion.concat('/buscaprodporcodigo');//"http://172.25.108.236:8182/buscaprodporcodigo"; //buscaproductos por codigo
    public urlbuscapordescripcion: string = environment.URLServiciosRest.URLConexion.concat('/buscaprodpordescripcion');//"http://172.25.108.236:8182/buscaprodpordescripcion"; //buscaproductos por descripcion
    public urlkardex             : string = environment.URLServiciosRest.URLConexion.concat('/movimientoskardex');//"http://172.25.108.236:8185/movimientoskardex"; //Busca datos kardex
    public urlDetalleKardex      : string = environment.URLServiciosRest.URLConexion.concat('/buscadatoskardex');//"http://172.25.108.236:8185/buscadatoskardex"; //Busca detalle Kardex
    public urlbuscaempresa       : string = environment.URLServiciosRest.URLConexion.concat('/buscaempresa');//"http://172.25.108.236:8181/buscaempresa";
    public urlbuscasucursal      : string = environment.URLServiciosRest.URLConexion.concat('/buscasucursal');//"http://172.25.108.236:8181/buscasucursal"
    public buscabodega           : string = environment.URLServiciosRest.URLConexion.concat('/bodegas');//'http://172.25.108.236:8189/bodegas';
    

    constructor(public _http: HttpClient) {
    }

    BuscaEmpresa(hdgcodigo: number,usuario:string,servidor: string):Observable<Empresas[]> {

        return this._http.post<Empresas[]>(this.urlbuscaempresa, {
            'hdgcodigo': hdgcodigo,
            'usuario'  : usuario,
            'servidor' : servidor
        });
    }

    BuscaSucursal(hdgcodigo: number, esacodigo: number,usuario:string,servidor: string):Observable<Sucursal[]> {
    
        return this._http.post<Sucursal[]>(this.urlbuscasucursal, {
            'hdgcodigo': hdgcodigo,
            'esacodigo': esacodigo,
            'usuario'  : usuario,
            'servidor' : servidor
        });
    }

    BodegasVigentes(hdgcodigo: number, esacodigo: number,cmecodigo:number,usuario:string,servidor:string):Observable<BodegaVigente[]> {
    
        return this._http.post<BodegaVigente[]>(this.buscabodega, {
            'hdgcodigo': hdgcodigo,
            'esacodigo': esacodigo,
            'cmecodigo': cmecodigo,
            'usuario'  : usuario,
            'servidor' : servidor
        });
    }

    BuscaProductosporcodigo(codigo: string,usuario:string,servidor:string): Observable<ConsultaKardex[]> {
  
        return this._http.post<ConsultaKardex[]>(this.urlbuscaporcodigo, {
            'codigo': codigo,
            'usuario'     : usuario,
            'servidor'    : servidor
        });
    }
    BuscaProductos(descripcion: string,usuario:string,servidor:string): Observable<ConsultaKardex[]> {
        return this._http.post<ConsultaKardex[]>(this.urlbuscapordescripcion, {
            'descripcion': descripcion,
            'usuario'     : usuario,
            'servidor'    : servidor
        });
    }

    BuscaDatosKardex(periodo:string, bodegavigente:number, codigo:string,usuario:string,servidor:string): Observable<ConsultaKardex[]> {
        return this._http.post<ConsultaKardex[]>(this.urlkardex, {
            'periodo'       : periodo,
            'bodegavigente' : bodegavigente,
            'codigo'        : codigo,
            'usuario'       : usuario,
            'servidor'      : servidor
        });
    }

    BuscaDetalleKardex(idmovimdet: number ,idmovimdevol:number,idmovimdevptmo:number,idmovimpaciente:number,idmovimprestamos:number,idmovimdajustes:number,usuario:string,servidor:string): Observable<DetalleKardex[]>{
        return this._http.post<DetalleKardex[]>(this.urlDetalleKardex, {
            'idmovimdet'      : idmovimdet,
            'idmovimdevol'    : idmovimdevol,
            'idmovimdevptmo'  : idmovimdevptmo,
            'idmovimpaciente' : idmovimpaciente,
            'idmovimprestamos': idmovimprestamos,
            'idmovimdajustes' : idmovimdajustes,
            'servidor'        : servidor,
            'usuario'         : usuario
        });
    }
}