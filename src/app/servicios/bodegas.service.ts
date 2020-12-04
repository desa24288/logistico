import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BodegaDestino } from '../models/entity/BodegaDestino'; 
import { BodegaCargo } from '../models/entity/BodegaCargo';
import { BodegasTodas } from '../models/entity/BodegasTodas';
import { BodegasrelacionadaAccion } from '../models/entity/BodegasRelacionadas';
import { Bodegas }  from '../models/entity/Bodegas';
import { Servicio } from '../models/entity/Servicio';
import { ParamGrabaproductosaBodega } from '../models/entity/ParamGrabaProductosaBodega';
import { Plantillas } from 'src/app/models/entity/PlantillasBodegas';
import { BodegasDespachadoras } from '../models/entity/BodegasDespachadoras';
import { ProductoAFraccionar } from '../models/entity/ProductoAFraccionar';
import { ProductoFraccionado } from '../models/entity/ProductoFraccionado';
import { GrabaProductoFraccionado } from '../models/entity/GrabaProductoFraccionado';
import { EliminaProductoFraccionado } from '../models/entity/EliminaProductoFraccionado';
import { BodegasPorServicio } from '../models/entity/BodegasPorServcio';
import { EstructuraBodega } from '../models/entity/estructura-bodega';
import { TipoParametro }   from '../models/entity/tipo-parametro';
import { ServicioUnidadBodegas } from '../models/entity/servicio-unidad-bodegas';
import { ProductosBodegas } from '../models/entity/productos-bodegas';
import { BodegaSolicitante } from '../models/entity/bodega-solicitante';
import { ControlStockMinimo } from '../models/entity/control-stock-minimo';
import { RetornaMensaje } from '../models/entity/RetornaMensaje';
import { BodegasControladas } from '../models/entity/BodegasControladas';
import { UsuariosBodegas } from '../models/entity/usuarios-bodegas';
import { TipoRelacionBodega } from '../models/entity/tipo-relacion-bodega';
import { EstructuraRelacionBodega } from '../models/entity/estructura-relacion-bodega';
import { LibroControlado } from '../models/entity/LibroControlado';
import { EstructuraBodegaServicio } from '../models/entity/estructura-bodega-servicio';


@Injectable()
  
export class BodegasService {

  public urltodos: string = environment.URLServiciosRest.URLConexion.concat('/bodegascargo');
  public urlbodegacargo: string = environment.URLServiciosRest.URLConexion.concat('/selbodegasolicitante');
  public urlbodegadestino: string = environment.URLServiciosRest.URLConexion.concat('/selbodegasuministro');
  public urlbodegasTodas: string = environment.URLServiciosRest.URLConexion.concat('/selbodegasolicitante');

  public urlbodegasSuministro: string = environment.URLServiciosRest.URLConexion.concat('/selbodegasuministro');
  public urlSuminostroaorigen: string = environment.URLServiciosRest.URLConexion.concat('/selsuministroaorigen');
  
  public urlprodxbodega      : string = environment.URLServiciosRest.URLConexion.concat('/productosxbodega');
  public urlservicio         : string = environment.URLServiciosRest.URLConexion.concat('/servicios');
  public urlgrababodeganueva : string = environment.URLServiciosRest.URLConexion.concat('/grababodega');
  public urlasociabodservi   : string = environment.URLServiciosRest.URLConexion.concat('/asociaservicioabodega');

  public urlgrabaprodabod    : string = environment.URLServiciosRest.URLConexion.concat('/grabarproductosabod');
  public urlcreaplantilla :string =  environment.URLServiciosRest.URLConexion.concat('/grabarplantillas');
  
  public urlbuscaplant :string =  environment.URLServiciosRest.URLConexion.concat('/buscaplantillas');
  public urlbuscaplantillascabecera :string =  environment.URLServiciosRest.URLConexion.concat('/buscaplantillascabecera');
  

  public urlbuscaboddespachadora: string = environment.URLServiciosRest.URLConexion.concat('/bodegasdespachadoras');
  public urlproductosafraccionar: string = environment.URLServiciosRest.URLConexion.concat('/productosafraccionar');
  public urlproductosafraccionados : string = environment.URLServiciosRest.URLConexion.concat('/productosfraccionados');
  public urlfraccion   :string = environment.URLServiciosRest.URLConexion.concat('/grabafraccionados');
  public urleliminafraccionado : string = environment.URLServiciosRest.URLConexion.concat('/eliminafraccionados');
  public urlajustestock     : string = environment.URLServiciosRest.URLConexion.concat('/creaajustestockmanual');
  public urlbodegaxservicio : string = environment.URLServiciosRest.URLConexion.concat('/traebodegasxservicios');
  
  public urleliminaprodabod     : string = environment.URLServiciosRest.URLConexion.concat('/eliminarproductosabod');

  public urlbuscarEstructuraBodegas : string = environment.URLServiciosRest.URLConexion.concat('/buscarEstructuraBodegas');
  public urlbuscarCabeceraBodegas : string = environment.URLServiciosRest.URLConexion.concat('/buscarcabecerabodegas'); 

  public urlguardarEstructuraBodegas: string = environment.URLServiciosRest.URLConexion.concat('/grabarestructurabodega')
  public urllistatipobodega         : string = environment.URLServiciosRest.URLConexion.concat('/listatipobodega');
  public urllistatipoproducto       : string = environment.URLServiciosRest.URLConexion.concat('/listatipoproducto');
  public urlbuscabodcontrolada      : string = environment.URLServiciosRest.URLConexion.concat('/bodegascontrolados');
  public urldesasociaServicioBodega : string = environment.URLServiciosRest.URLConexion.concat('/desasociaservicioabodega');

  public urlbuscabodegacontrolSyckminimo : string = environment.URLServiciosRest.URLConexion.concat('/buscabodegacontrolstockminimo');

  public urldesasociaUsuarioBodega: string = environment.URLServiciosRest.URLConexion.concat('/desasociausuarioabodega');

  public urlistaTipoRelacionBodega: string = environment.URLServiciosRest.URLConexion.concat('/listartiporelacionbodegas');

  public urldesasociaRelacionBodega: string = environment.URLServiciosRest.URLConexion.concat('/desasociarelacionbodega');
  public urlprodbodegakardex  : string = environment.URLServiciosRest.URLConexion.concat('/selcierrekardexbodinv');
  
  public urlbodegadespachareceta : string = environment.URLServiciosRest.URLConexion.concat('/selbodegadespachareceta');

  public urlListaEstructuraServicioBodegas : string = environment.URLServiciosRest.URLConexion.concat('/ListaEstructuraServicioBodegas');



  constructor(private _http: HttpClient) {

  }


  ListaEstructuraServicioBodegas(BodegaServivio: EstructuraBodegaServicio): Observable<EstructuraBodegaServicio[]> {
    return this._http.post<EstructuraBodegaServicio[]>(this.urlListaEstructuraServicioBodegas,BodegaServivio);   
}

  
  listarTipoRelacionBodegas(hdgcodigo:number,cmecodigo : number,servidor : string, usuario:string): Observable<TipoRelacionBodega[]> {
    return this._http.post<TipoRelacionBodega[]>(this.urlistaTipoRelacionBodega,{
    hdgcodigo: hdgcodigo,
    cmecodigo: cmecodigo,
    usuario:usuario,
    servidor : servidor
    });
  }

  buscabodegacontrolstockminimo(hdgcodigo:number, esacodigo:number,cmecodigo:number,usuario:string,servidor:string,fechainicio:string,fechatermino:string,idbodegasolicita:number, idbodegasuministro:number,idarticulo:number): 
  Observable<ControlStockMinimo[]> { return  this._http.post<ControlStockMinimo[]>(this.urlbuscabodegacontrolSyckminimo,{ 
    hdgcodigo: hdgcodigo,
    esacodigo: esacodigo,
    cmecodigo: cmecodigo,
    usuario : usuario ,
    servidor : servidor,
    fechainicio : fechainicio,
    fechatermino : fechatermino,
    idbodegasolicita : idbodegasolicita,
    idbodegasuministro: idbodegasuministro,
    idarticulo : idarticulo,
  });
}


desasociaBodegaEstructuraBodegas(hdgcodigo:number,cmecodigo : number,codbodegaorigen : number,codbodegarelacion:number, servidor : string, usuario:string): Observable<EstructuraRelacionBodega[]> {
  return this._http.post<EstructuraRelacionBodega[]>(this.urldesasociaRelacionBodega,{
  hdgcodigo: hdgcodigo,
  cmecodigo: cmecodigo,
  codbodegaorigen: codbodegaorigen,
  codbodegarelacion:codbodegarelacion,
  usuario:usuario,
  servidor : servidor
  });
}


desasociaUsuarioEstructuraBodegas(hdgcodigo:number,cmecodigo : number,bodegacodigo : number,userid : number, bouid:number, servidor : string, usuario:string): Observable<UsuariosBodegas[]> {
  return this._http.post<UsuariosBodegas[]>(this.urldesasociaUsuarioBodega,{
  hdgcodigo: hdgcodigo,
  cmecodigo: cmecodigo,
  bodegacodigo: bodegacodigo,
  userid: userid,
  bouid:bouid,
  usuario:usuario,
  servidor : servidor
  });
}


  desasociaServicioEstructuraBodegas(hdgcodigo:number,cmecodigo : number,codbodega : number,idservicio : number, servidor : string, usuario:string): Observable<ServicioUnidadBodegas[]> {
    return this._http.post<ServicioUnidadBodegas[]>(this.urldesasociaServicioBodega,{
    hdgcodigo: hdgcodigo,
    cmecodigo: cmecodigo,
    codbodega: codbodega,
    idservicio: idservicio,
    usuario:usuario,
    servidor : servidor
    });
  }
  

  listatipobodega(hdgcodigo:number,usuario : string, servidor : string): Observable<TipoParametro[]> {
    return this._http.post<TipoParametro[]>(this.urllistatipobodega,{
    hdgcodigo: hdgcodigo,
    usuario: usuario,
    servidor : servidor
    });
  }

  listatipoproducto(hdgcodigo:number,usuario : string, servidor : string): Observable<TipoParametro[]> {
    return this._http.post<TipoParametro[]>(this.urllistatipoproducto,{
    hdgcodigo: hdgcodigo,
    usuario: usuario,
    servidor : servidor
    });
  }

  listaEstructuraBodegas(hdgcodigo:number,cmecodigo : number,codbodega : number,desbodega : string,estado : string,tipoproducto : string,tipobodega : string, usaurio : string,servidor : string
    ): Observable<EstructuraBodega[]> {
    return this._http.post<EstructuraBodega[]>(this.urlbuscarEstructuraBodegas,{
    hdgcodigo: hdgcodigo,
    cmecodigo: cmecodigo,
    codbodega: codbodega,
    desbodega: desbodega,
    estado   : estado,
    tipoproducto : tipoproducto,
    tipobodega : tipobodega,
    usuario   : usaurio,
    servidor : servidor
    });
  }


  listaCabeceraBodegas(hdgcodigo:number,cmecodigo : number,codbodega : number,desbodega : string,estado : string,tipoproducto : string,tipobodega : string, usaurio : string,servidor : string
    ): Observable<EstructuraBodega[]> {
    return this._http.post<EstructuraBodega[]>(this.urlbuscarCabeceraBodegas,{
    hdgcodigo: hdgcodigo,
    cmecodigo: cmecodigo,
    codbodega: codbodega,
    desbodega: desbodega,
    estado   : estado,
    tipoproducto : tipoproducto,
    tipobodega : tipobodega,
    usuario   : usaurio,
    servidor : servidor
    });
  }

  guardarEstructuraBodegas(Bodega: EstructuraBodega): Observable<any> {
    return this._http.post(this.urlguardarEstructuraBodegas,Bodega);   
}




  grabaEstructuraBodegas(hdgcodigo:number,cmecodigo : number,codbodega : number,desbodega : string,estado : string,tipoproducto : string,tipobodega : string, servidor : string
    ): Observable<EstructuraBodega[]> {
    return this._http.post<EstructuraBodega[]>(this.urlbuscarEstructuraBodegas,{
    hdgcodigo: hdgcodigo,
    cmecodigo: cmecodigo,
    codbodega: codbodega,
    desbodega: desbodega,
    estado   : estado,
    tipoproducto : tipoproducto,
    tipobodega : tipobodega,
    servidor : servidor
    });
  }



  listaBodegaCargoTodas(usuario: string, servidor: string): Observable<BodegaCargo[]> {
    return this._http.post<BodegaCargo[]>(this.urltodos, {
      'usuario': usuario,
      'servidor': servidor
    });
  }


   listaBodegaCargoSucursal(hdgcodigo: number, esacodigo: number, cmecodigo: number, usuario: string, servidor: string
  ): Observable<BodegaCargo[]> {
        return this._http.post<BodegaCargo[]>(this.urlbodegacargo, {
      'hdgcodigo': hdgcodigo,
      'esacodigo': esacodigo,
      'cmecodigo': cmecodigo,
      'usuario': usuario,
      'servidor': servidor
    });
  }



   listaBodegaDestinoSucursal(hdgcodigo: number, esacodigo: number, cmecodigo: number, usuario: string, servidor: string): Observable<BodegaDestino[]> {
       return this._http.post<BodegaDestino[]>(this.urlbodegasTodas, {//this.urlbodegadestino
      'hdgcodigo': hdgcodigo,
      'esacodigo': esacodigo,
      'cmecodigo': cmecodigo,
      'usuario': usuario,
      'servidor': servidor
    });
  }


  listaBodegaTodasSucursal(hdgcodigo: number, esacodigo: number, cmecodigo: number, usuario: string, servidor: string): Observable<BodegasTodas[]> {
    return this._http.post<BodegasTodas[]>(this.urlbodegasTodas, {
   'hdgcodigo': hdgcodigo,
   'esacodigo': esacodigo,
   'cmecodigo': cmecodigo,
   'usuario': usuario,
   'servidor': servidor
    });
  }

  listaBodegaDespachoReceta(hdgcodigo: number, esacodigo: number, cmecodigo: number, usuario: string, 
    servidor: string,): Observable<BodegasTodas[]> {
    return this._http.post<BodegasTodas[]>(this.urlbodegadespachareceta, {
   'hdgcodigo': hdgcodigo,
   'esacodigo': esacodigo,
   'cmecodigo': cmecodigo,
   'usuario': usuario,
   'servidor': servidor
    });
  }

  listaBodegaRelacionadaAccion(hdgcodigo: number, esacodigo: number, cmecodigo: number, usuario: string, servidor: string, bodcodigosolicita:number, tiporegori:number): Observable<BodegasrelacionadaAccion[]> {
    return this._http.post<BodegasrelacionadaAccion[]>(this.urlbodegasSuministro, {
      'hdgcodigo'         : hdgcodigo,
      'esacodigo'         : esacodigo,
      'cmecodigo'         : cmecodigo,
      'usuario'           : usuario,
      'servidor'          : servidor,
      'bodcodigosolicita' :bodcodigosolicita,
      'tiporegori'        :tiporegori
    });
  }


  
  listaBodegaOrigenAccion(hdgcodigo: number, esacodigo: number, cmecodigo: number, usuario: string, servidor: string, bodcodigosolicita:number, tiporegori:number): Observable<BodegaSolicitante[]> {
    return this._http.post<BodegaSolicitante[]>(this.urlSuminostroaorigen, {
      'hdgcodigo'         : hdgcodigo,
      'esacodigo'         : esacodigo,
      'cmecodigo'         : cmecodigo,
      'usuario'           : usuario,
      'servidor'          : servidor,
      'bodcodigosolicita' :bodcodigosolicita,
      'tiporegori'        :tiporegori
    });
  }


  BuscaProductoporBodega(hdgcodigo:number,esacodigo:number,cmecodigo:number,codbodega: number,
    usuario: string,servidor:string):Observable<Bodegas[]> {
    return this._http.post<Bodegas[]>(this.urlprodxbodega, {
        'hdgcodigo': hdgcodigo,
        'esacodigo': esacodigo,
        'cmecodigo': cmecodigo, 
        'codbodega': codbodega,
        'usuario'  : usuario,
        'servidor' : servidor
    });        
  }

  BuscaServicios(hdgcodigo: number,esacodigo:number,cmecodigo:number, bodegacodigo: number,usuario:string,servidor:string):Observable<Servicio[]> {
    return this._http.post<Servicio[]>(this.urlservicio, {
        'hdgcodigo'   : hdgcodigo,
        'esacodigo'   : esacodigo,
        'cmecodigo'   : cmecodigo, 
        'bodegacodigo': bodegacodigo,
        'usuario'     : usuario,
        'servidor'    : servidor
    });
  }

  CreaBodegaNueva(hdgcodigo: number,esacodigo: number,cmecodigo:number,codbodega:number, 
    desbodega: string,codnuevo:string,usuario:string,servidor:string): Observable<Bodegas[]> {
    return this._http.post<Bodegas[]>(this.urlgrababodeganueva, {
        'hdgcodigo' : hdgcodigo,
        'esacodigo' : esacodigo,
        'cmecodigo' : cmecodigo,
        'codbodega' : codbodega,
        'desbodega' : desbodega,
        'codnuevo'  : codnuevo,
        'usuario'   : usuario,
        'servidor'  : servidor
    });
  } 

  AsociaBodegaServicio(hdgcodigo: number,esacodigo: number,cmecodigo:number,codbodega: number,
    codserbodperi: number,usuario:string,servidor:string):Observable<Bodegas[]> {
    return this._http.post<Bodegas[]>(this.urlasociabodservi, {
        'hdgcodigo'     : hdgcodigo,
        'esacodigo'     : esacodigo,
        'cmecodigo'     : cmecodigo,
        'codbodega'     : codbodega,
        'codserbodperi' : codserbodperi,
        'usuario'       : usuario,
        'servidor'      : servidor
    });
    
  }


  EliminaProductodeBodega(registroeliminar:ProductosBodegas):Observable<any> {
    return this._http.post(this.urleliminaprodabod, registroeliminar);        
  }

  GrabaProductosaBodega(paramgrabaproductosabod):Observable<ParamGrabaproductosaBodega[]>{
   return this._http.post<ParamGrabaproductosaBodega[]>(this.urlgrabaprodabod, {
        paramgrabaproductosabod
    });

  }

  crearPlantilla(plantillas: Plantillas):Observable<any>{
    return this._http.post(this.urlcreaplantilla, plantillas              
    );
  }  
  


  BuscaPlantillasCabecera(servidor: string,usuario:string,phdgcodigo:number,pesacodigo:number,pcmecodigo:number,
    pplanid: number,pplandescrip:string,
    pfechaini:string,pfechafin:string,pbodegaorigen:number,
    pbodegadestino:number,pplanvigente:string,pserviciocod:string, pplantipo:number
    ):Observable<Plantillas[]>{
    return this._http.post<Plantillas[]>(this.urlbuscaplantillascabecera, {
      'servidor'      : servidor,
      'usuario'       : usuario, 
      'phdgcodigo'    : phdgcodigo,
      'pesacodigo'    : pesacodigo,
      'pcmecodigo'    : pcmecodigo,
      'pplanid'       : pplanid,
      'pplandescrip'  : pplandescrip,
      'pfechaini'     : pfechaini,
      'pfechafin'     : pfechafin,
      'pbodegaorigen' : pbodegaorigen,
      'pbodegadestino': pbodegadestino, 
      'pplanvigente'  : pplanvigente,
      'pserviciocod'  : pserviciocod,
      'pplantipo'     : pplantipo

    });
  }

  BuscaPlantillas(servidor: string,usuario:string,phdgcodigo:number,pesacodigo:number,pcmecodigo:number,
    pplanid: number,pplandescrip:string,
    pfechaini:string,pfechafin:string,pbodegaorigen:number,
    pbodegadestino:number,pplanvigente:string,pserviciocod:string, pplantipo:number
    ):Observable<Plantillas[]>{
    return this._http.post<Plantillas[]>(this.urlbuscaplant, {
      'servidor'      : servidor,
      'usuario'       : usuario, 
      'phdgcodigo'    : phdgcodigo,
      'pesacodigo'    : pesacodigo,
      'pcmecodigo'    : pcmecodigo,
      'pplanid'       : pplanid,
      'pplandescrip'  : pplandescrip,
      'pfechaini'     : pfechaini,
      'pfechafin'     : pfechafin,
      'pbodegaorigen' : pbodegaorigen,
      'pbodegadestino': pbodegadestino, 
      'pplanvigente'  : pplanvigente,
      'pserviciocod'  : pserviciocod,
      'pplantipo'     : pplantipo

    });
  }

  ModificaPlantilla(Plantillas: Plantillas): Observable<any> {
    return this._http.post(this.urlcreaplantilla, Plantillas
    );
  }
  
  EliminarSolicitud(Plantillas: Plantillas): Observable<any> {
      return this._http.post(this.urlcreaplantilla, Plantillas              
      );
    
  }

  BuscaBodegasDespachadora(hdgcodigo:number,esacodigo:number,cmecodigo:number,usuario: string,
    servidor: string):Observable<BodegasDespachadoras[]>{
    return this._http.post<BodegasDespachadoras[]>(this.urlbuscaboddespachadora, {
      'hdgcodigo' : hdgcodigo,
      'esacodigo' : esacodigo,
      'cmecodigo' : cmecodigo,
      'usuario'   : usuario,
      'servidor'  : servidor
    });
  }

  GrabaFraccionamiento(datosparagrabar: GrabaProductoFraccionado[]):Observable<GrabaProductoFraccionado[]>{
    return this._http.post<GrabaProductoFraccionado[]>(this.urlfraccion, {
        datosparagrabar
    });
  }

  BuscaProductoenlaBodega(hdgcodigo:number,esacodigo:number,cmecodigo:number,boddesp:number,
    codmei:string,descprod:string, usuario: string,
    servidor: string):Observable<ProductoAFraccionar[]>{
    return this._http.post<ProductoAFraccionar[]>(this.urlproductosafraccionar, {
      'hdgcodigo' : hdgcodigo,
      'esacodigo' : esacodigo,
      'cmecodigo' : cmecodigo,
      'boddesp'   : boddesp,
      'codmei'    : codmei,
      'descprod'  : descprod,
      'usuario'   : usuario,
      'servidor'  : servidor
    });
  }

  BuscaProductosFraccionados(meinidori:number, usuario: string,
    servidor: string,boddesp: number):Observable<ProductoFraccionado[]>{
    return this._http.post<ProductoFraccionado[]>(this.urlproductosafraccionados, {
      'meinidori' : meinidori,
      'usuario'   : usuario,
      'servidor'  : servidor,
      'boddesp'   : boddesp
    });
  }

  EliminaProductoFraccionadoDeGrilla(datosparaeliminar: GrabaProductoFraccionado[]):Observable<EliminaProductoFraccionado[]>{

    return this._http.post<EliminaProductoFraccionado[]>(this.urleliminafraccionado, {
        datosparaeliminar
    });

  }

  GrabarAjusteStock(hdgcodigo: number,esacodigo:number, cmecodigo:number,servidor: string,
    usuario: string,bodcodigo:number, meinid:number,meincod:string ,stockanterior:number,
    stocknuevo:number,motivoajuste: number):Observable<RetornaMensaje[]>{

    return this._http.post<RetornaMensaje[]>(this.urlajustestock, {
      'hdgcodigo' : hdgcodigo,
      'esacodigo' : esacodigo,
      'cmecodigo' : cmecodigo,
      'servidor'  : servidor,
      'usuario'   : usuario,
      'bodcodigo' : bodcodigo,
      'meinid'    : meinid,
      'meincod'   : meincod,
      'stockanterior': stockanterior,
      'stocknuevo' : stocknuevo,
      'motivoajuste': motivoajuste
    });
  }

  BuscaBodegaporServicio(hdgcodigo: number,esacodigo: number,cmecodigo: number,serviciocodigo:number,
  usuario: string,servidor: string):Observable<BodegasPorServicio[]>{
    return this._http.post<BodegasPorServicio[]>(this.urlbodegaxservicio, {
      'hdgcodigo'     : hdgcodigo,
      'esacodigo'     : esacodigo,
      'cmecodigo'     : cmecodigo,
      'serviciocodigo': serviciocodigo,
      'usuario'       : usuario,
      'servidor'      : servidor
    });
  }

  BuscaBodegasControlados(hdgcodigo:number,esacodigo:number,cmecodigo:number,usuario: string,
    servidor: string):Observable<BodegasControladas[]>{
    return this._http.post<BodegasControladas[]>(this.urlbuscabodcontrolada, {
      'hdgcodigo' : hdgcodigo,
      'esacodigo' : esacodigo,
      'cmecodigo' : cmecodigo,
      'usuario'   : usuario,
      'servidor'  : servidor
    });
  }

  BuscaProductoBodegaControl(servidor: string,hdgcodigo: number,esacodigo: number,cmecodigo: number,
    codbodega:number):Observable<LibroControlado[]>{
    return this._http.post<LibroControlado[]>(this.urlprodbodegakardex, {
      'servidor' : servidor,
      'hdgcodigo': hdgcodigo,
      'esacodigo': esacodigo,
      'cmecodigo': cmecodigo,
      'codbodega': codbodega
      
    });
  }
}