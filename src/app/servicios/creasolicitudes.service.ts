import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BodegaVigente } from '../models/entity/BodegaVigente';
import { StockProducto } from '../models/entity/StockProducto';
import { GrabaSolicitud } from '../models/entity/GrabaSolicitud';
import { environment } from '../../environments/environment';
import { Grabadetallesolicitudbod } from '../models/entity/Grabadetallesolicitudbod';
import { BodegaCargo } from '../models/entity/BodegaCargo';


@Injectable()
export class CreasolicitudesService {
    
    public buscabodega            : string = environment.URLServiciosRest.URLConexion.concat('/bodegas');//'http://172.25.108.236:8189/bodegas';
    public urlBuscastock          : string = environment.URLServiciosRest.URLConexion.concat('/buscastock');//"http://172.25.108.236:8193/buscastock";
    public urlgrabasolic          : string = environment.URLServiciosRest.URLConexion.concat('/grabarencabsolicitudbod');
    public urlgrabadetallesolic   : string = environment.URLServiciosRest.URLConexion.concat('/grabardetasolicitudbod');
    public urlretornasolic        : string = environment.URLServiciosRest.URLConexion.concat('/retornaencsolicitudbod');
    public urlbuscabodegaorigen   : string = environment.URLServiciosRest.URLConexion.concat('/bodegascargo');
    

    constructor(public _http: HttpClient) {
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

    BodegasOrigen(hdgcodigo: number, esacodigo: number,cmecodigo:number,usuario:string,servidor:string):Observable<BodegaCargo[]> {
     
        return this._http.post<BodegaCargo[]>(this.urlbuscabodegaorigen, {
            'hdgcodigo': hdgcodigo,
            'esacodigo': esacodigo,
            'cmecodigo': cmecodigo,
            'usuario'  : usuario,
            'servidor' : servidor
        });
    }




 BuscaStockProd(meinid: number, bodegaorigen: number,usuario:string,servidor:string): Observable<StockProducto[]> {
        return this._http.post<StockProducto[]>(this.urlBuscastock, {
           'meinid'       : meinid,
           'bodegaorigen' : bodegaorigen,
           'usuario'      : usuario,
           'servidor'     : servidor
        });
    }
    
    GrabaCreacionSolicitud(sboid: number,hdgcodigo:number,esacodigo:number,cmecodigo:number,
        bodegaorigen:number, bodegadestino:number, prioridadcod:number,esticod:number,
        usuariocrea:string,fechacrea:string,usuariomodif:string,fechamodif:string,usuarioelimina:string,
        fechaelimina:string, servidor:string): Observable<GrabaSolicitud[]> {
        return this._http.post<GrabaSolicitud[]>(this.urlgrabasolic, {
            'sboid'         : sboid,
            'hdgcodigo'     : hdgcodigo,
            'esacodigo'     : esacodigo,
            'cmecodigo'     : cmecodigo,
            'bodegaorigen'  : bodegaorigen, 
            'bodegadestino' : bodegadestino, 
            'prioridadcod'  : prioridadcod,
            'esticod'       : esticod,
            'usuariocrea'   : usuariocrea,
            'fechacrea'     : fechacrea,
            'usuariomodif'  : usuariomodif,
            'fechamodif'    : fechamodif,
            'usuarioelimina': usuarioelimina,
            'fechaelimina'  : fechaelimina,
            'servidor'      : servidor
        });
    }

    GrabaCreacionDetalleSolicitud(grabadetsolicitudbod):Observable<Grabadetallesolicitudbod[]>{
        console.log("Se enviará a grabar el detalle");
        return this._http.post<Grabadetallesolicitudbod[]>(this.urlgrabadetallesolic, {
            'grabadetsolicitudbod': grabadetsolicitudbod
        });
    }

    retornaSolicitud(solbodid: number, servidor: string):Observable<GrabaSolicitud[]>{
        console.log("Se enviará a grabar el detalle");
        return this._http.post<GrabaSolicitud[]>(this.urlretornasolic, {
            'solbodid': solbodid,
            'servidor': servidor
        });
    }
}