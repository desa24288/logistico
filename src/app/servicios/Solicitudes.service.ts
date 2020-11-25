import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Solicitud } from '../models/entity/Solicitud';
import { DespachoSolicitud } from '../models/entity/DespachoSolicitud';
import { EventoSolicitud } from '../models/entity/EventoSolicitud';
import { OrigenSolicitud } from '../models/entity/OrigenSolicitud';
import { EventoDetalleSolicitud } from '../models/entity/EventoDetalleSolicitud';
import { EstadoSolicitud } from '../models/entity/EstadoSolicitud';
import { DespachoDetalleSolicitud } from '../models/entity/DespachoDetalleSolicitud';
import { ProductoRecepcionBodega } from '../models/entity/ProductoRecepcionBodega';
import { ParamDevolBodega } from '../models/entity/ParamDevolBodega';
import { MovimientosFarmacia } from '../models/entity/MovimientosFarmacia';
import { EstructuraReglas } from '../models/entity/estructura-reglas';
import { EstadoRecetaProg } from '../models/entity/EstadoRecetaProg';
import { ConsultaRecetaProgramada } from '../models/entity/ConsultaRecetaProgramada';
import { Receta } from '../models/entity/receta';
import { DetalleSolicitud } from '../models/entity/DetalleSolicitud';
import { Detalleproducto } from '../models/producto/detalleproducto';

@Injectable()  
export class SolicitudService {
    public urlGenerarSolicitud   : string = environment.URLServiciosRest.URLConexion.concat('/grabarsolicitudes'); 

    public urlbuscasolic         : string = environment.URLServiciosRest.URLConexion.concat('/buscasolicitudes');
    public urlbuscasolicitudcabecera : string = environment.URLServiciosRest.URLConexion.concat('/buscasolicitudescabecera');
    
    public urlDespachosolicitud  : string = environment.URLServiciosRest.URLConexion.concat('/despachosolicitudbodega'); 
    public urlgrabarecepcion   : string = environment.URLServiciosRest.URLConexion.concat('/recepciondespachobodega');
    public urlDevolucionSolicitud : string = environment.URLServiciosRest.URLConexion.concat('/grabadevoluciones'); 
    public urlRecepcionDevolucion: string = environment.URLServiciosRest.URLConexion.concat('/recepciondevolucionbodega');
    public urlseleventosolicitud : string = environment.URLServiciosRest.URLConexion.concat('/seleventosolicitud');
    public urlselOrigensolicitud : string = environment.URLServiciosRest.URLConexion.concat('/selorigensolicitud');
    public urlseleventodetallesolicitud : string = environment.URLServiciosRest.URLConexion.concat('/seldeteventosolicitud');
    public urlprodrecepcionbodega : string = environment.URLServiciosRest.URLConexion.concat('/productosrecepcionbodega');
    public urlproddevuelvebodega  : string = environment.URLServiciosRest.URLConexion.concat('/productosdevolucionbodega');
    public urlproddespachobodega : string = environment.URLServiciosRest.URLConexion.concat('/productosdespachobodega');
    private target_url = environment.URLServiciosRest.URLConexion.concat('/estadosolicitud');
    public urlloteprodbod : string = environment.URLServiciosRest.URLConexion.concat('/lotesdelproddespachar');
    public urlloteprodpac   : string = environment.URLServiciosRest.URLConexion.concat('/lotesdelproddispensar');
    public urlbuscarreglas   : string = environment.URLServiciosRest.URLConexion.concat('/buscareglas');
    public urlentrerecptog  : string = environment.URLServiciosRest.URLConexion.concat('/seldiasentregarecetaprog');
    public urlconsultarecetaprog : string = environment.URLServiciosRest.URLConexion.concat('/selconsultarecetaprog');
    public urlbuscarrecetasficha : string = environment.URLServiciosRest.URLConexion.concat('/buscarrecetasficha');
    public urlbuscarrecetas      : string = environment.URLServiciosRest.URLConexion.concat('/buscarestructurarecetas');
    public urlbuscalotesfecha      : string = environment.URLServiciosRest.URLConexion.concat('/buscarLotedetalleplantilla');

    constructor(public _http: HttpClient) {
    }

    buscarestructurarecetas(_Receta: Receta): Observable<Receta[]> {
        return this._http.post<Receta[]>(this.urlbuscarrecetas, _Receta)
       
    }
    
    buscarEncabezadoRecetas(_Receta: Receta): Observable<Receta[]> {
        return this._http.post<Receta[]>(this.urlbuscarrecetasficha, _Receta)
       
    }


    BuscarReglas(hdgcodigo: number,cmecodigo:number,reglatipo:string,reglatipobodega:string,
        bodegacodigo:number,idproducto:number,servidor:string):Observable<any>{
        return this._http.post<EstructuraReglas[]>(this.urlbuscarreglas, {
            'hdgcodigo' :hdgcodigo,
	        'cmecodigo' :cmecodigo,
	        'reglatipo':reglatipo,
	        'reglatipobodega' :reglatipobodega,
	        'bodegacodigo' :bodegacodigo,
	        'idproducto':idproducto,
	        'servidor' :servidor,
            });
    }

    crearSolicitud(varSolicitud: Solicitud): Observable<any> {
        return this._http.post(this.urlGenerarSolicitud, varSolicitud);
       
    }

    ModificaSolicitud(varSolicitud: Solicitud): Observable<any> {
        return this._http.post(this.urlGenerarSolicitud, varSolicitud              
        );
       
    }

    EliminarSolicitud(varSolicitud: Solicitud): Observable<any> {
        return this._http.post(this.urlGenerarSolicitud, varSolicitud              
        );
       
    }

    RecepcionaDispensacion(paramdespachos: DespachoDetalleSolicitud[]): Observable<DespachoDetalleSolicitud[]> {
        return this._http.post<DespachoDetalleSolicitud[]>(this.urlgrabarecepcion, {
            'paramdespachos': paramdespachos
        });
    } 
 
    DespacharSolicitud(varDespachoSolicitud: DespachoSolicitud): Observable<any> {
        return this._http.post(this.urlDespachosolicitud, varDespachoSolicitud              
        );
    }

    DevolucionSolicitud(paramdespachos: ParamDevolBodega): Observable<ParamDevolBodega> {
        return this._http.post( this.urlDevolucionSolicitud,paramdespachos);
    }

    RecepcionDevolucionBodegas(paramdespachos: ParamDevolBodega): Observable<ParamDevolBodega> {
        return this._http.post(this.urlRecepcionDevolucion,paramdespachos);
    }
    

    BuscaSolicitudCabecera(psbodid: number,phdgcodigo:number,pesacodigo:number,pcmecodigo:number,
        ptiposolicitud:number,pfechaini:string,pfechacfin:string,pbodegaorigen:number,
        pbodegadestino:number,pestcod:number, servidor: string,prioridad:number,
        ambito:number, unidadid:number, piezaid:number,camid:number,tipodocid:number,numdocpac:string,
        filtrodenegocio:string,soliorigen: number
        ):Observable<Solicitud[]>{
            console.log("this.filtrodenegocio metodo",filtrodenegocio);
        return this._http.post<Solicitud[]>(this.urlbuscasolicitudcabecera, {
            'psbodid'       : psbodid,
            'phdgcodigo'    : phdgcodigo,
            'pesacodigo'    : pesacodigo,
            'pcmecodigo'    : pcmecodigo,
            'ptiposolicitud': ptiposolicitud,
            'pfechaini'     : pfechaini,
            'pfechacfin'    : pfechacfin,
            'pbodegaorigen' : pbodegaorigen,
            'pbodegadestino': pbodegadestino,
            'pestcod'       : pestcod, 
            'servidor'      : servidor,
            'prioridad'     : prioridad,
            'ambito'        : ambito,   
            'unidadid'      : unidadid,
            'piezaid'       : piezaid,
            'camid'        : camid,
            'TipDocId'      : tipodocid,
            'numdocpac'     : numdocpac,
            'filtrodenegocio': filtrodenegocio,
            'soliorigen'    : soliorigen
            });
    }


    BuscaSolicitud(psbodid: number,phdgcodigo:number,pesacodigo:number,pcmecodigo:number,
        ptiposolicitud:number,pfechaini:string,pfechacfin:string,pbodegaorigen:number,
        pbodegadestino:number,pestcod:number, servidor: string,prioridad:number,
        ambito:number, unidadid:number, piezaid:number,camid:number,tipodocid:number,numdocpac:string,
        solorigen: number):Observable<Solicitud[]>{
        return this._http.post<Solicitud[]>(this.urlbuscasolic, {
            'psbodid'       : psbodid,
            'phdgcodigo'    : phdgcodigo,
            'pesacodigo'    : pesacodigo,
            'pcmecodigo'    : pcmecodigo,
            'ptiposolicitud': ptiposolicitud,
            'pfechaini'     : pfechaini,
            'pfechacfin'    : pfechacfin,
            'pbodegaorigen' : pbodegaorigen,
            'pbodegadestino': pbodegadestino,
            'pestcod'       : pestcod, 
            'servidor'      : servidor,
            'prioridad'     : prioridad,
            'ambito'        : ambito,   
            'unidadid'      : unidadid,
            'piezaid'       : piezaid,
            'camid'         : camid,
            'TipDocId'      : tipodocid,
            'numdocpac'     : numdocpac,
            'soliorigen'    : solorigen

            });
    }

    BuscaProductoDespachoBodega(hdgcodigo:number,esacodigo:number,cmecodigo:number,servidor: string,
        soliid:number,codmei:string,lote:string,fechavto:string
        ):Observable<ProductoRecepcionBodega[]>{
        return this._http.post<ProductoRecepcionBodega[]>(this.urlproddespachobodega, {
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'servidor'  : servidor,
            'soliid'    : soliid,            
            'codmei'    : codmei,
            'lote'      : lote,   
            'fechavto'  : fechavto

        });
    }
    BuscaProductoRecepcionBodega(hdgcodigo:number,esacodigo:number,cmecodigo:number,servidor: string,
        soliid:number,codmei:string,lote:string,fechavto:string
        ):Observable<ProductoRecepcionBodega[]>{
          
        return this._http.post<ProductoRecepcionBodega[]>(this.urlprodrecepcionbodega, {
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'servidor'  : servidor,
            'soliid'    : soliid,            
            'codmei'    : codmei,
            'lote'      : lote,   
            'fechavto'  : fechavto

        });
    }

    BuscaProductosDevueltosBodega(hdgcodigo:number,esacodigo:number,cmecodigo:number,servidor: string,
        soliid:number,codmei:string,lote:string,fechavto:string):Observable<ProductoRecepcionBodega[]>{
         
        return this._http.post<ProductoRecepcionBodega[]>(this.urlproddevuelvebodega, {
            'hdgcodigo' : hdgcodigo,
            'esacodigo' : esacodigo,
            'cmecodigo' : cmecodigo,
            'servidor'  : servidor,
            'soliid'    : soliid,            
            'codmei'    : codmei,
            'lote'      : lote,   
            'fechavto'  : fechavto

        });
    }

    
    BuscaEventosSolicitud(solid: number, servidor: string):Observable<EventoSolicitud[]>{
        return this._http.post<EventoSolicitud[]>(this.urlseleventosolicitud, {
            'solid'         : solid,
            'servidor'      : servidor
        });
    }

    BuscaEventoDetalleSolicitud(solid: number, sodeid:number, servidor: string):Observable<EventoDetalleSolicitud[]>{
        return this._http.post<EventoDetalleSolicitud[]>(this.urlseleventodetallesolicitud, {
            'solid'         : solid,
            'sodeid'        : sodeid,  
            'servidor'      : servidor
        });
    }

    public ListaOrigenSolicitud(usuario:string, servidor:string,origen: number): Observable<OrigenSolicitud[]> {
        return this._http.post<OrigenSolicitud[]>(this.urlselOrigensolicitud,{
          'usuario' : usuario,
          'servidor': servidor,
          'origen'  : origen
        });
    }    

    public list(usuario:string,servidor:string): Observable<EstadoSolicitud[]> {
        return this._http.post<EstadoSolicitud[]>(this.target_url,{
          'usuario' : usuario,
          'servidor': servidor
        });
    }
    
    BuscaLotesProductosxBod(servidor:string,hdgcodigo:number,esacodigo:number,cmecodigo:number,
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

    BuscaLotesProductosxPac(servidor:string,hdgcodigo:number,esacodigo:number,cmecodigo:number,
        codmei:string,bodorigen:number,boddestino:number,cliid: number): Observable<MovimientosFarmacia[]> {

        return this._http.post<MovimientosFarmacia[]>(this.urlloteprodpac, {
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

    public EntregaRecetaProg(usuario:string,servidor:string): Observable<EstadoRecetaProg[]> {
        return this._http.post<EstadoRecetaProg[]>(this.urlentrerecptog,{
          'usuario' : usuario,
          'servidor': servidor
        });
    }   
    
    public ConsultaRecetaProgramada(hdgcodigo: number, esacodigo:number,cmecodigo:number,
        servidor:string,usuario:string,cliid: number): Observable<ConsultaRecetaProgramada[]> {
        return this._http.post<ConsultaRecetaProgramada[]>(this.urlconsultarecetaprog,{
          'hdgcodigo': hdgcodigo,
          'esacodigo': esacodigo,
          'cmecodigo': cmecodigo,
          'servidor': servidor,
          'usuario' : usuario,
          'cliid'   : cliid
        });
    }  
    
    public buscarLotedetalleplantilla(_Solicitud: Solicitud): Observable<Detalleproducto[]> {
        console.log('desde buscarLotedetalleplantilla()');
        return this._http.post<Detalleproducto[]>(this.urlbuscalotesfecha, _Solicitud)
    }
}