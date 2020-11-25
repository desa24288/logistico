import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { ReposicionArticulos } from '../models/entity/ReposicionArticulos';

import { HttpClient } from '@angular/common/http';
import { Empresas } from '../models/entity/Empresas';
import { Sucursal } from '../models/entity/Sucursal';
import { environment } from '../../environments/environment';
import { Solicitud } from '../models/entity/Solicitud';
import { StockCritico } from '../models/entity/StockCritico';

@Injectable()
export class ReposicionArticulosService {
    public urlBuscarpordescripcion  : string = environment.URLServiciosRest.URLConexion.concat('/buscaprodpordescripcion');
    public urlBuscarporcodigo       : string = environment.URLServiciosRest.URLConexion.concat('/buscaprodporcodigo');
    public urlbuscaholding          : string = environment.URLServiciosRest.URLConexion.concat('/buscaholding');
    public urlbuscaempresa          : string = environment.URLServiciosRest.URLConexion.concat('/buscaempresa');
    public urlbuscasucursal         : string = environment.URLServiciosRest.URLConexion.concat('/buscasucursal');
    public urlbuscaregistros        : string = environment.URLServiciosRest.URLConexion.concat('/registrosparareposicion');
    public urlGenerarSolicitud      : string = environment.URLServiciosRest.URLConexion.concat('/grabarsolicitudes'); 


    constructor(public _http: HttpClient) {

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

    BuscaRegistros(hdgcodigo:number, cmecodigo:number, bodegaorigen: number,tiporegmein:string,fechabusqueda:string,fechafin:string,usuario:string,
        servidor:string,tiporeposicion:number):Observable<ReposicionArticulos[]> {
            return this._http.post<ReposicionArticulos[]>(this.urlbuscaregistros, {
                'hdgcodigo'     : hdgcodigo,
                'cmecodigo'     : cmecodigo,
                'bodegaorigen'  : bodegaorigen,
                'tiporegmein'   : tiporegmein,
                'fechainicio'   : fechabusqueda,
                'fechatermino'  : fechafin,
                'usuario'       : usuario,
                'servidor'      : servidor,
                'tiporeposicion':tiporeposicion,
        });
    }

    
    crearSolicitud(varSolicitud: Solicitud): Observable<Solicitud> {
        return this._http.post<Solicitud>(this.urlGenerarSolicitud, varSolicitud);
    }
    
}
