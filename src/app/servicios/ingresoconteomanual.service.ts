import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';
//import { DistribucionComprasEspeciales } from '../models/entity/DistribucionComprasEspeciales';
import { Observable } from 'rxjs';
import { IngresoConteoManual } from '../models/entity/IngresoConteoManual';
import { InventarioDetalle } from '../models/entity/InventarioDetalle';
import { environment } from '../../environments/environment';
import { StockProducto } from '../models/entity/StockProducto';


@Injectable()
export class IngresoconteomanualService {
    public urlperiodoinv         : string = environment.URLServiciosRest.URLConexion.concat('/periodosinventarios');//"http://172.25.108.236:8187/periodosinventarios";
    public urlbuscainventario    : string = environment.URLServiciosRest.URLConexion.concat('/ConsultaInventario');//"http://172.25.108.236:8195/ConsultaInventario";
    public urlgrabainventario    : string = environment.URLServiciosRest.URLConexion.concat('/grabarinvmanual');//"http://172.25.108.236:8195/grabarinvmanual";
    public urlactualizainventario: string = environment.URLServiciosRest.URLConexion.concat('/actualizainv');//"http://172.25.108.236:8195/actualizainv";
    public urlBuscastock          : string = environment.URLServiciosRest.URLConexion.concat('/buscastock');
       
    constructor(public _http: HttpClient) {

    }

    BuscaPeriodo(bodegainv: number,usuario:string,servidor: string): Observable<IngresoConteoManual[]> {
     
        return this._http.post<IngresoConteoManual[]>(this.urlperiodoinv, {
            'bodegainv': bodegainv,
            'usuario'  : usuario,
            'servidor' : servidor
        });
    }

    BuscaDetalleInventario(fechagenerainv: string, bodegainv: number, tipoproductoinv: string,usuario:string,servidor:string): Observable<InventarioDetalle[]> {

        return this._http.post<InventarioDetalle[]>(this.urlbuscainventario, {
            'fechagenerainv' : fechagenerainv,
            'bodegainv'      : bodegainv,
            'tipoproductoinv': tipoproductoinv,
            'usuario'        : usuario,
            'servidor'       : servidor

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

    GrabaConteoManual(paraminvmanual): Observable<InventarioDetalle[]> {
 
        return this._http.post<InventarioDetalle[]>(this.urlgrabainventario, {
            'paraminvmanual': paraminvmanual

        });
    }

    ActualizaInventario(paraminvactualiza): Observable<InventarioDetalle[]> {
        
        return this._http.post<InventarioDetalle[]>(this.urlactualizainventario, {
            'paraminvactualiza': paraminvactualiza

        });
    }

}