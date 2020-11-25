import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { UrlReporte } from '../models/entity/Urlreporte';
import { environment } from '../../environments/environment';

@Injectable()
export class InformesService {
    public urlrptinforme             : string = environment.URLServiciosRest.URLConexionInformes.concat('/obtieneurlinfexistenciasvalorizadas');//"http://172.25.108.236:8194/obtieneurlinfexistenciasvalorizadas";
    public urlrptcomprobante         : string = environment.URLServiciosRest.URLConexionInformes.concat('/obtieneurlinflistaconteoinventario');
    public urlinfdespachobodegas     : string = environment.URLServiciosRest.URLConexionInformes.concat('/obtieneurlinfdespachobodegas');
    public urlrptsolicitud           : string = environment.URLServiciosRest.URLConexionInformes.concat('/geturladministracionsolicpac');
    public urlrptsolicituddesppac    : string = environment.URLServiciosRest.URLConexionInformes.concat('/geturldispensarsolicpac');
    public urlrptsolicitudbod        : string = environment.URLServiciosRest.URLConexionInformes.concat('/geturladministracionsolicbod');
    public urlrptsolicituddespbod    : string = environment.URLServiciosRest.URLConexionInformes.concat('/geturldespacharsolicbod');
    public urlrptsolicitudrecepbod   : string = environment.URLServiciosRest.URLConexionInformes.concat('/geturlrecepcionarsolicbod');
    public urlrptsolicituddevol      : string = environment.URLServiciosRest.URLConexionInformes.concat('/geturldevolversolicbod');
    public urlrptsolicitudrecepdevol : string = environment.URLServiciosRest.URLConexionInformes.concat('/geturlrecepdevolsolicbod');
    public urlrptcierrelibrocontrolado: string= environment.URLServiciosRest.URLConexionInformes.concat('/geturlstocklibcontrolados');
    public urlrptlibrocontrolado     : string = environment.URLServiciosRest.URLConexionInformes.concat('/geturlconsultalibcontrolados');
    public urlrptconsultarecambu     : string = environment.URLServiciosRest.URLConexionInformes.concat('/geturlconsultarecetaprog');
    public urlrptrecepdevolpac       : string = environment.URLServiciosRest.URLConexionInformes.concat('');
    public urlrptmovimiento          : string = environment.URLServiciosRest.URLConexionInformes.concat('/geturlmovimientos');
    public urlrptstockbodega         : string = environment.URLServiciosRest.URLConexionInformes.concat('/geturlstockdebodega')
    public urlrptcierrekardex        : string = environment.URLServiciosRest.URLConexionInformes.concat('/geturlstockcierrekardex');
    public urlrptconsultakardex      : string = environment.URLServiciosRest.URLConexionInformes.concat('/geturlconsultacierrekardex');

    constructor(public _http: HttpClient) {

    }

    RPTListadoInventario(tiporeport: string,codigo:number,tiporeg:string,hdgcodigo:number,esacodigo:number,cmecodigo:number):Observable<UrlReporte[]> {
        console.log("datos para imprimir",tiporeport,codigo,tiporeg,hdgcodigo,esacodigo,cmecodigo)
        return this._http.post<UrlReporte[]>(this.urlrptcomprobante, {
            'tiporeport': tiporeport,
            'codigo'    : codigo,
            'tiporeg'   : tiporeg,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo
        });
    }
    
    RPTInformeExistencias(tiporeport: string, codigobod:number,tiporeg:string,fecha:string,hdgcodigo:number,
        esacodigo:number,cmecodigo:number):Observable<UrlReporte[]> {
        console.log("Buscará Reporte informe valorizado")
        return this._http.post<UrlReporte[]>(this.urlrptinforme, {
            'tiporeport': tiporeport,
            'codigobod' : codigobod,
            'tiporeg'   : tiporeg,
            'fecha'     : fecha,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo
        });
    }

    RPTInfDespachoABodegas(tiporeport: string,bodega:number,movimiento:number, tipoprod:string,fechaini:string,
        fechafin:string,hdgcodigo:number,esacodigo:number,cmecodigo:number):Observable<UrlReporte[]> {
        console.log("Buscará Reporte informe valorizado")
        return this._http.post<UrlReporte[]>(this.urlinfdespachobodegas, {
            'tiporeport': tiporeport,
            'bodega'    : bodega,
            'movimiento': movimiento,
            'tipoprod'  : tipoprod,
            'fechaini'  : fechaini,
            'fechafin'  : fechafin,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo
        });
    } 
    
    RPTImprimeSolicitud(servidor: string,hdgcodigo:number,esacodigo:number,cmecodigo:number,
        tiporeport: string, soliid:number,codambito:number):Observable<UrlReporte[]> {
        return this._http.post<UrlReporte[]>(this.urlrptsolicitud, {            
            'servidor'  : servidor,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'tiporeport': tiporeport,
            'soliid'    : soliid,
            'codambito' : codambito
            
        });
    }

    RPTImprimeSolicitudDespachada(servidor: string,hdgcodigo:number,esacodigo:number,cmecodigo:number,
        tiporeport: string, soliid:number,codambito:number):Observable<UrlReporte[]> {
        return this._http.post<UrlReporte[]>(this.urlrptsolicituddesppac, {            
            'servidor'  : servidor,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'tiporeport': tiporeport,
            'soliid'    : soliid,
            'codambito' : codambito
            
        });
    }

    RPTImprimeSolicitudBodega(servidor: string,hdgcodigo:number,esacodigo:number,cmecodigo:number,
        tiporeport: string, soliid:number):Observable<UrlReporte[]> {
        return this._http.post<UrlReporte[]>(this.urlrptsolicitudbod, {            
            'servidor'  : servidor,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'tiporeport': tiporeport,
            'soliid'    : soliid            
        });
    }

    RPTImprimeSolicitudDespachoBodega(servidor: string,hdgcodigo:number,esacodigo:number,cmecodigo:number,
        tiporeport: string, soliid:number):Observable<UrlReporte[]> {
        return this._http.post<UrlReporte[]>(this.urlrptsolicituddespbod, {            
            'servidor'  : servidor,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'tiporeport': tiporeport,
            'soliid'    : soliid            
        });
    }

    RPTImprimeSolicitudRecepcionDespBodega(servidor: string,hdgcodigo:number,esacodigo:number,cmecodigo:number,
        tiporeport: string, soliid:number):Observable<UrlReporte[]> {
        return this._http.post<UrlReporte[]>(this.urlrptsolicitudrecepbod, {            
            'servidor'  : servidor,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'tiporeport': tiporeport,
            'soliid'    : soliid            
        });
    }

    RPTImprimeDevolucionSolicitudBodega(servidor: string,hdgcodigo:number,esacodigo:number,cmecodigo:number,
        tiporeport: string, soliid:number):Observable<UrlReporte[]> {
        return this._http.post<UrlReporte[]>(this.urlrptsolicituddevol, {            
            'servidor'  : servidor,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'tiporeport': tiporeport,
            'soliid'    : soliid            
        });
    }

    RPTImprimeRecepDevolSolicitudBodega(servidor: string,hdgcodigo:number,esacodigo:number,cmecodigo:number,
        tiporeport: string, soliid:number,usuario:string):Observable<UrlReporte[]> {
        return this._http.post<UrlReporte[]>(this.urlrptsolicitudrecepdevol, {            
            'servidor'  : servidor,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'tiporeport': tiporeport,
            'soliid'    : soliid,
            'usuario'   : usuario          
        });
    }

    RPTImprimeLibroControlado(servidor: string,usuario:string,hdgcodigo:number,
        esacodigo:number,cmecodigo:number, tiporeport: string,libcid:number,
        codbodegacontrolados:number,meinid:number):Observable<UrlReporte[]> {
        return this._http.post<UrlReporte[]>(this.urlrptlibrocontrolado, {            
            'servidor'  : servidor,
            'usuario'   : usuario,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'tiporeport': tiporeport,
            'libcid'    : libcid,
            'codbodegacontrolados': codbodegacontrolados,
            'meinid'    : meinid    
        });
    }
    
    RPTImprimeCierreLibroControlado(servidor: string,usuario:string,hdgcodigo:number,
        esacodigo:number,cmecodigo:number, tiporeport: string,codbodegacontrolados:number
        ):Observable<UrlReporte[]> {
        return this._http.post<UrlReporte[]>(this.urlrptcierrelibrocontrolado, {            
            'servidor'  : servidor,
            'usuario'   : usuario,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'tiporeport': tiporeport,
            'codbodegacontrolados':codbodegacontrolados
        });
    }

    RPTImprimeConsultaRecetaAmbulatoria(servidor: string,usuario:string,hdgcodigo:number,
        esacodigo:number,cmecodigo:number, tiporeport: string,cliid:number
        ):Observable<UrlReporte[]> {
        return this._http.post<UrlReporte[]>(this.urlrptconsultarecambu, {            
            'servidor'  : servidor,
            'usuario'   : usuario,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'tiporeport': tiporeport,
            'cliid'     : cliid
        });
    }

    RPTImprimeRecepcionDevolucionPaciente(servidor: string,hdgcodigo:number,esacodigo:number,cmecodigo:number,
        tiporeport: string, soliid:number):Observable<UrlReporte[]> {
        return this._http.post<UrlReporte[]>(this.urlrptrecepdevolpac, {            
            'servidor'  : servidor,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'tiporeport': tiporeport,
            'soliid'    : soliid            
        });
    }

    RPTImprimeMovimiento(servidor: string, usuario:string,hdgcodigo:number,esacodigo:number,cmecodigo:number,
        tiporeport: string, movfid:number):Observable<UrlReporte[]> {
        return this._http.post<UrlReporte[]>(this.urlrptmovimiento, {            
            'servidor'  : servidor,
            'usuario'   : usuario,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'tiporeport': tiporeport,
            'movfid'    : movfid
            
        });
    }

    RPTImprimeStockBodega(servidor: string, usuario:string,hdgcodigo:number,esacodigo:number,cmecodigo:number,
        tiporeport: string, FbodCodigo:number,FboCodigoBodega: string):Observable<UrlReporte[]> {
        return this._http.post<UrlReporte[]>(this.urlrptstockbodega, {            
            'servidor'  : servidor,
            'usuario'   : usuario,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'tiporeport': tiporeport,
            'FbodCodigo': FbodCodigo,
            'FboCodigoBodega':FboCodigoBodega
            
        });
    }

    RPTImprimeCierreKardex(servidor: string,usuario:string,hdgcodigo:number,
        esacodigo:number,cmecodigo:number, tiporeport: string,codbodega:number
        ):Observable<UrlReporte[]> {
        return this._http.post<UrlReporte[]>(this.urlrptcierrekardex, {            
            'servidor'  : servidor,
            'usuario'   : usuario,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'tiporeport': tiporeport,
            'codbodega' :codbodega
        });
    }

    RPTImprimeConsultaKardex(servidor: string,usuario:string,hdgcodigo:number,
        esacodigo:number,cmecodigo:number, tiporeport: string,ckarid:number,
        codbodega:number,meinid:number):Observable<UrlReporte[]> {
        return this._http.post<UrlReporte[]>(this.urlrptconsultakardex, {            
            'servidor'  : servidor,
            'usuario'   : usuario,
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'tiporeport': tiporeport,
            'ckarid'    : ckarid,
            'codbodega' : codbodega,
            'meinid'    : meinid    
        });
    }

}