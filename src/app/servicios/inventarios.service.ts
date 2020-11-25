import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';
//import { DistribucionComprasEspeciales } from '../models/entity/DistribucionComprasEspeciales';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { GeneraInventarioSistema } from '../models/entity/GeneraInventarioSistema';
import { IngresoConteoManual } from '../models/entity/IngresoConteoManual';
import { InventarioDetalle } from '../models/entity/InventarioDetalle';
import { ConsultaKardex } from '../../app/models/entity/ConsultaKardex';
import { DetalleKardex } from '../../app/models/entity/DetalleKardex';
import { StockProducto } from '../models/entity/StockProducto';
import { RetornaMensaje } from '../models/entity/RetornaMensaje';
import { PeriodoMedControlado } from '../models/entity/PeriodoMedControlado';
import { PeriodoCierreKardex } from '../models/entity/PeriodoCierreKardex';


@Injectable()
export class InventariosService {
    
    public urlgenerainv     : string = environment.URLServiciosRest.URLConexion.concat('/generainventario');
    public urlperiodoinv         : string = environment.URLServiciosRest.URLConexion.concat('/periodosinventarios');
    public urlbuscainventario    : string = environment.URLServiciosRest.URLConexion.concat('/ConsultaInventario');
    public urlgrabainventario    : string = environment.URLServiciosRest.URLConexion.concat('/grabarinvmanual');
    public urlgrabaajuste    : string = environment.URLServiciosRest.URLConexion.concat('/grabaajustes');
    public urlkardex             : string = environment.URLServiciosRest.URLConexion.concat('/movimientoskardex');
    public urlDetalleKardex      : string = environment.URLServiciosRest.URLConexion.concat('/buscadatoskardex');
    public urlBuscastock          : string = environment.URLServiciosRest.URLConexion.concat('/buscastock');
    public urlactualizainventario: string = environment.URLServiciosRest.URLConexion.concat('/actualizainv');
    public urlcierrekardex      : string = environment.URLServiciosRest.URLConexion.concat('/creacierrekardexbodega');
    public urlperocierrekardex  : string = environment.URLServiciosRest.URLConexion.concat('/selperiodoscierrekardex');
    public urlconsultakardex    : string = environment.URLServiciosRest.URLConexion.concat('/selcierrekardexprodbod');

    constructor(public _http: HttpClient) {

    }
    GeneraInventario(fechagenerainv:string,bodegainv:number,tipoproductoinv:string,usuario:string,servidor:string):Observable<GeneraInventarioSistema[]> {

        return this._http.post<GeneraInventarioSistema[]>(this.urlgenerainv, {
            'fechagenerainv' : fechagenerainv,
            'bodegainv'      : bodegainv,
            'tipoproductoinv': tipoproductoinv,
            'usuario'        : usuario,
            'servidor'       : servidor
        });
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

    GrabaConteoManual(paraminvmanual): Observable<InventarioDetalle[]> {
    
        return this._http.post<InventarioDetalle[]>(this.urlgrabainventario, {
            'paraminvmanual': paraminvmanual

        });
    }

    GrabaAjuste(paraminvajuste):Observable<InventarioDetalle[]> {
        
        return this._http.post<InventarioDetalle[]>(this.urlgrabaajuste, {
            'paraminvajuste'  : paraminvajuste                
        });
    }

    GrabaCierreKardex(hdgcodigo:number,esacodigo: number,cmecodigo:number,servidor:string,usuario:string,
        codbodega:number): Observable<RetornaMensaje[]> {
        return this._http.post<RetornaMensaje[]>(this.urlcierrekardex, {
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'servidor'  : servidor,
            'usuario'   : usuario,            
            'codbodega' : codbodega,
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

    BuscaStockProd(meinid: number, bodegaorigen: number,usuario:string,servidor:string): Observable<StockProducto[]> {
        return this._http.post<StockProducto[]>(this.urlBuscastock, {
           'meinid'       : meinid,
           'bodegaorigen' : bodegaorigen,
           'usuario'      : usuario,
           'servidor'     : servidor
        });
    }

    ActualizaInventario(paraminvactualiza): Observable<InventarioDetalle[]> {
    
        return this._http.post<InventarioDetalle[]>(this.urlactualizainventario, {
            'paraminvactualiza': paraminvactualiza

        });
    }

    BuscaPeriodoMedBodegas(hdgcodigo: number,esacodigo: number,cmecodigo: number,servidor: string,
        usuario:string,codbodega:number):Observable<PeriodoCierreKardex[]>{
        return this._http.post<PeriodoCierreKardex[]>(this.urlperocierrekardex, {
          'hdgcodigo': hdgcodigo,
          'esacodigo': esacodigo,
          'cmecodigo': cmecodigo,
          'servidor' : servidor,
          'usuario'  : usuario,
          'codbodega': codbodega
          
        });
    }

    ConsultaKardex(hdgcodigo: number,esacodigo: number,cmecodigo: number,servidor: string, usuario:string,
    kadeid:number, codbodega:number,meinid:number):Observable<ConsultaKardex[]>{
        return this._http.post<ConsultaKardex[]>(this.urlconsultakardex, {
          'hdgcodigo': hdgcodigo,
          'esacodigo': esacodigo,
          'cmecodigo': cmecodigo,
          'servidor' : servidor,
          'usuario'  : usuario,
          'kadeid'   : kadeid,
          'codbodega': codbodega,
          'meinid'   : meinid      
        });
    }

}