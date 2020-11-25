import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { UrlReporte } from '../models/entity/Urlreporte';
import { Empresas } from '../models/entity/Empresas';
import { Sucursal } from '../models/entity/Sucursal';
import { environment } from '../../environments/environment';
//import { AsignaBodega } from '../models/entity/AsignaBodega';

@Injectable()
export class InfdoctosingresadosService {
    public urldoctoing     : string = environment.URLServiciosRest.URLConexionInformes.concat('/obtieneurlinfdocumentosingresados');//"http://172.25.108.236:8194/obtieneurlinfajustesprecios";
    public urlbuscaempresa : string = environment.URLServiciosRest.URLConexion.concat('/buscaempresa');//"http://172.25.108.236:8181/buscaempresa";
    public urlbuscasucursal: string = environment.URLServiciosRest.URLConexion.concat('/buscasucursal');//"http://172.25.108.236:8181/buscasucursal"
       
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

    RPTInfDoctoIngresado(tiporeport: string,fechaini:string,fechafin:string,tipomov:number,
        tiporeg:string, hdgcodigo:number,esacodigo:number,cmecodigo:number):Observable<UrlReporte[]> {

        return this._http.post<UrlReporte[]>(this.urldoctoing, {
            'tiporeport': tiporeport,
            'fechaini'  : fechaini,
            'fechafin'  : fechafin,
            'tipomov'   : tipomov,
            'tiporeg'   : tiporeg,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo
        });
    }  
    
}