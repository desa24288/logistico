import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
//import { ListadoParaInventarios } from '../models/entity/ListadoParaInventarios';
import { HttpClient } from '@angular/common/http';
import { UrlReporte } from '../models/entity/Urlreporte';
import { AsignaBodega } from '../models/entity/AsignaBodega';
import { Empresas } from '../models/entity/Empresas';
import { Sucursal } from '../models/entity/Sucursal';
import { environment } from '../../environments/environment';


@Injectable()
export class ListadobodegasvalorizadasService {

    public urlrptlistado    : string = environment.URLServiciosRest.URLConexionInformes.concat('/obtieneurlinfbodegasvalorizadas');//"http://172.25.108.236:8194/obtieneurlinfbodegasvalorizadas"
    public urlbuscaempresa  : string = environment.URLServiciosRest.URLConexion.concat('/buscaempresa');//"http://172.25.108.236:8181/buscaempresa";
    public urlbuscasucursal : string = environment.URLServiciosRest.URLConexion.concat('/buscasucursal');//"http://172.25.108.236:8181/buscasucursal"
    public urlasignabodega  : string = environment.URLServiciosRest.URLConexion.concat('/bodegasparaasignar');//'http://172.25.108.236:8189/bodegasparaasignar';
    
    constructor(public _http: HttpClient) {

    }

    BuscaEmpresa(hdgcodigo: number,usuario:string,servidor: string): Observable<Empresas[]> {
   
        return this._http.post<Empresas[]>(this.urlbuscaempresa, {
            'hdgcodigo': hdgcodigo,
            'usuario'  : usuario,
            'servidor' : servidor
        });
    }

    BuscaSucursal(hdgcodigo: number, esacodigo: number,usuario:string,servidor: string): Observable<Sucursal[]> {
        
        return this._http.post<Sucursal[]>(this.urlbuscasucursal, {
            'hdgcodigo': hdgcodigo,
            'esacodigo': esacodigo,
            'usuario'  : usuario,
            'servidor' : servidor
        });
    }

    AsignaBodega(hdgcodigo: number, esacodigo: number, cmecodigo: number,usuario:string,servidor:string): Observable<AsignaBodega[]> {
        return this._http.post<AsignaBodega[]>(this.urlasignabodega, {
            'hdgcodigo': hdgcodigo,
            'esacodigo': esacodigo,
            'cmecodigo': cmecodigo,
            'usuario'  : usuario,
            'servidor' : servidor
        });
    }

    RPTListadoBodegasValorizadas(tiporeport: string,codigobod:number,tiporeg:string,hdgcodigo:number,esacodigo:number,cmecodigo:number):Observable<UrlReporte[]> {

        return this._http.post<UrlReporte[]>(this.urlrptlistado, {
            'tiporeport': tiporeport,
            'codigobod' : codigobod,
            'tiporeg'   : tiporeg,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo
        });
    }
    
}