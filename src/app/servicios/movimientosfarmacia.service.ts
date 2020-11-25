import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { MovimientosFarmacia } from '../models/entity/MovimientosFarmacia';
import { HttpClient } from '@angular/common/http';
import { BodegaCargo } from '../models/entity/BodegaCargo';
import { BodegaDestino } from '../models/entity/BodegaDestino';
import { environment } from '../../environments/environment';
import { EnvioMovimientosDevolucion } from '../models/entity/EnvioMovimientosFarmaciaDetDevol'
import { ValidaCantidadDevuelta } from '../models/entity/ValidaCantidadDevuelta';


@Injectable()

export class MovimientosfarmaciaService {
    public url                  : string = environment.URLServiciosRest.URLConexion.concat('/movimientosfarmacia');
    public url_guardaMovimiento : string = environment.URLServiciosRest.URLConexion.concat('/grabarmovimientos');
    public urlbodegacargo       : string = environment.URLServiciosRest.URLConexion.concat('/bodegascargo');
    public urlbodegadestino     : string = environment.URLServiciosRest.URLConexion.concat('/bodegasdestino');
    public urlRecuperaMovimiento: string = environment.URLServiciosRest.URLConexion.concat('/buscamovimientos');
    public urlguardarDetalleDevolucuines : string = environment.URLServiciosRest.URLConexion.concat('/grabarmovimientosdevol');
    public urlloteprod          : string = environment.URLServiciosRest.URLConexion.concat('/lotesdelprodpac');
    public urlvalidacantdevolver: string = environment.URLServiciosRest.URLConexion.concat('/validacantdevuelvepac');
    public urlguardaMovimiento : string = environment.URLServiciosRest.URLConexion.concat('/grabarmovimientosfarmacia');
    public urlloteprodbod       : string = environment.URLServiciosRest.URLConexion.concat('/lotesdelprodbod');
    public urlvalidacantdevolverbod : string = environment.URLServiciosRest.URLConexion.concat('/validacantdevuelvebod');

    constructor(public _http: HttpClient) {

    }  

    BodegasCargo(hdgcodigo: number, esacodigo: number,cmecodigo:number,usuario:string,servidor:string
        ):Observable<BodegaCargo[]> {
        
        return this._http.post<BodegaCargo[]>(this.urlbodegacargo, {
            'hdgcodigo': hdgcodigo,
            'esacodigo': esacodigo,
            'cmecodigo': cmecodigo,
            'usuario'  : usuario,
            'servidor' : servidor
        });
    }

    BodegasDestino(hdgcodigo: number, esacodigo: number,cmecodigo:number,usuario:string,servidor:string):Observable<BodegaDestino[]> {
       
        return this._http.post<BodegaDestino[]>(this.urlbodegadestino, {
            'hdgcodigo': hdgcodigo,
            'esacodigo': esacodigo,
            'cmecodigo': cmecodigo,
            'usuario'  : usuario,
            'servidor' : servidor
        });
    }

    BuscaListaMovimietos(hdgcodigo: number, esacodigo: number,cmecodigo:number,tipomov: number,
        fechamovdesde: string, fechamovhasta: string, movimfarid: number, movimfecha: string, cliid :number,
        usuario:string,servidor:string): Observable<MovimientosFarmacia[]> {
        return this._http.post<MovimientosFarmacia[]>(this.url, {
            'hdgcodigo'     : hdgcodigo,
            'esacodigo'     : esacodigo,
            'cmecodigo'     : cmecodigo,
            'tipomov'       : tipomov,
            'fechamovdesde' : fechamovdesde,
            'fechamovhasta' : fechamovhasta,
            'movimfarid'    : movimfarid,
            'movimfecha'    : movimfecha,
            'cliid'         : cliid, 
            'usuario'       : usuario,
            'servidor'      : servidor
        });
    }

    RecuperaMovimiento(movimfarid:number, usuario:string,servidor:string  ): Observable<MovimientosFarmacia[]> {
        return this._http.post<MovimientosFarmacia[]>(this.urlRecuperaMovimiento, {
            'movimfarid'     : movimfarid,
            'usuario'        : usuario,
            'servidor'       : servidor,
           });
    }

    GuardarMovimietos(MovimientosFarmacia:MovimientosFarmacia): Observable<MovimientosFarmacia[]> {
        return this._http.post<MovimientosFarmacia[]>(this.url_guardaMovimiento,MovimientosFarmacia);
    }

    GuardarMovimietosDevoluciones(EnvioMovimientosFarmaciaDetDevol:EnvioMovimientosDevolucion): Observable<EnvioMovimientosDevolucion[]> {
        return this._http.post<EnvioMovimientosDevolucion[]>(this.urlguardarDetalleDevolucuines,EnvioMovimientosFarmaciaDetDevol);
    }

    BuscaLotesProductos(servidor:string,hdgcodigo:number,esacodigo:number,cmecodigo:number,
        codmei:string,bodorigen:number,boddestino:number,cliid:number): Observable<MovimientosFarmacia[]> {
  
        return this._http.post<MovimientosFarmacia[]>(this.urlloteprod, {
            'servidor'      : servidor,
            'hdgcodigo'     : hdgcodigo,
            'esacodigo'     : esacodigo,
            'cmecodigo'     : cmecodigo,
            'codmei'        : codmei,
            'bodorigen'     : bodorigen,
            'boddestino'    : boddestino,
            'cliid'         : cliid
           });
    }

    BuscaLotesProductosBodega(servidor:string,hdgcodigo:number,esacodigo:number,cmecodigo:number,
        codmei:string,bodorigen:number,boddestino:number): Observable<MovimientosFarmacia[]> {
        return this._http.post<MovimientosFarmacia[]>(this.urlloteprodbod, {
            'servidor'      : servidor,
            'hdgcodigo'     : hdgcodigo,
            'esacodigo'     : esacodigo,
            'cmecodigo'     : cmecodigo,
            'codmei'        : codmei,
            'bodorigen'     : bodorigen,
            'boddestino'    : boddestino
           });
    }

    ValidaCantDevolver(servidor:string,hdgcodigo:number,esacodigo:number,cmecodigo:number,cliid:number,
        codmei:string,lote:string,cantidadadevolver:number,): Observable<ValidaCantidadDevuelta> {
        return this._http.post<ValidaCantidadDevuelta>(this.urlvalidacantdevolver, {
            'servidor'      : servidor,
            'hdgcodigo'     : hdgcodigo,
            'esacodigo'     : esacodigo,
            'cmecodigo'     : cmecodigo,
            'codmei'        : codmei,
            'lote'          : lote,
            'cantidadadevolver' : cantidadadevolver,
            'cliid'         : cliid
           });
    }

    ValidaCantDevolverBod(servidor:string,hdgcodigo:number,esacodigo:number,bodorigen:number,
        boddestino:number, cmecodigo:number,codmei:string,lote:string,cantidadadevolver:number,): Observable<ValidaCantidadDevuelta> {
        return this._http.post<ValidaCantidadDevuelta>(this.urlvalidacantdevolverbod, {
            'servidor'      : servidor,
            'hdgcodigo'     : hdgcodigo,
            'esacodigo'     : esacodigo,
            'cmecodigo'     : cmecodigo,
            'codmei'        : codmei,
            'lote'          : lote,
            'cantidadadevolver' : cantidadadevolver,
            'bodorigen'     : bodorigen,
            'boddestino'    : boddestino
           });
    }

    GrabaMovimiento(MovimientosFarmacia:MovimientosFarmacia): Observable<MovimientosFarmacia[]> {
        return this._http.post<MovimientosFarmacia[]>(this.urlguardaMovimiento,MovimientosFarmacia);
    }

  }