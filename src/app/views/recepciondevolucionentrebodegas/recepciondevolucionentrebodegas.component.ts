import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { environment } from '../../../environments/environment';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SolicitudService } from 'src/app/servicios/Solicitudes.service';
import { Solicitud } from 'src/app/models/entity/Solicitud';
import { DetalleSolicitud } from 'src/app/models/entity/DetalleSolicitud';
import { MovimientosFarmacia } from '../../models/entity/MovimientosFarmacia'
import { MovimientosFarmaciaDet } from '../../models/entity/MovimientosFarmaciaDet'
import { MovimientosfarmaciaService } from '../../servicios/movimientosfarmacia.service';
import { EventosSolicitudComponent } from '../eventos-solicitud/eventos-solicitud.component';
import { EventosDetallesolicitudComponent } from '../eventos-detallesolicitud/eventos-detallesolicitud.component';
import { DespachoDetalleSolicitud } from 'src/app/models/entity/DespachoDetalleSolicitud';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { BusquedasolicitudesComponent } from '../busquedasolicitudes/busquedasolicitudes.component';
import { Detallelote } from '../../models/entity/Detallelote';
import { ProductoRecepcionBodega } from 'src/app/models/entity/ProductoRecepcionBodega';
import { ParamDetRecepDevolBodega } from '../../models/entity/ParamDetRecepDevolBodega';
import { ParamRecepDevolBodega } from '../../models/entity/ParamRecepDevolBodega';
import { InformesService } from '../../servicios/informes.service';
import { Permisosusuario } from '../../permisos/permisosusuario';

@Component({
  selector: 'app-recepciondevolucionentrebodegas',
  templateUrl: './recepciondevolucionentrebodegas.component.html',
  styleUrls: ['./recepciondevolucionentrebodegas.component.css'],
  providers: [SolicitudService, InformesService]
})
export class RecepciondevolucionentrebodegasComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  @ViewChild('alertSwalGrilla', { static: false }) alertSwalGrilla: SwalComponent;

  public modelopermisos                 : Permisosusuario = new Permisosusuario();
  public FormRecepcionDevolucion        : FormGroup;
  public FormRecepcionDevolucionDetalle : FormGroup;
  public hdgcodigo                      : number;
  public esacodigo                      : number;
  public cmecodigo                      : number;
  public solicitud                      : number;
  public usuario                        = environment.privilegios.usuario;
  public servidor                       = environment.URLServiciosRest.ambiente;
  public detallessolicitudes            : Array<DespachoDetalleSolicitud> = [];  
  public detallessolicitudespaginacion  : Array<DespachoDetalleSolicitud> = []; 
  public _Solicitud                     : Solicitud;
  public detalleslotes                  : Detallelote[]=[];
  public _DetalleSolicitud              : DetalleSolicitud;
  public arreegloDetalleSolicitud         : Array<DetalleSolicitud> = [];
  public arreegloDetalleSolicitudpaginacion: Array<DetalleSolicitud> = [];
  public listaDetalleSolicitud          : Array<DetalleSolicitud> = [];
  public listaDetalleSolicitudpaginacion: Array<DetalleSolicitud> = [];
  public numsolic                       : boolean = false;
  public validadato                       : boolean = false;
  _MovimientosFarmacia                  : MovimientosFarmacia;
  public arregloMovimientosFarmaciaDet  : Array<MovimientosFarmaciaDet> = [];
  public arregloMovimientosFarmaciaDetPaginacion: Array<MovimientosFarmaciaDet> = [];
  public alerts                         : Array<any> = [];
  public fechavto                       : string
  public fechavto1                      : string;
  public lote                           : string;
  public paramrecepcion                 : ParamDetRecepDevolBodega[]=[];
  public locale                         = 'es';
  public bsConfig                       : Partial<BsDatepickerConfig>;
  public colorTheme                     = 'theme-blue';
  private _BSModalRef                   : BsModalRef;
  public productosrecepcionadospaginacion : Array<ProductoRecepcionBodega> =[];
  public productosrecepcionados         : Array<ProductoRecepcionBodega> =[];
  public solicitudseleccion             : Array<ProductoRecepcionBodega> = [];
  public RecepcionBodega                : ParamRecepDevolBodega;
  public activabtnrecepdevol            : boolean = false;
  public activabtnimprime               : boolean = false;

  constructor(
    private formBuilder                 : FormBuilder,
    public _BsModalService              : BsModalService,
    public datePipe                     : DatePipe,
    public localeService                : BsLocaleService,
    public _SolicitudService            : SolicitudService,
    public _buscasolicitudService       : SolicitudService,
    public _MovimientosfarmaciaService  : MovimientosfarmaciaService,
    private _imprimesolicitudService    : InformesService
  ) { 
    this.FormRecepcionDevolucion = this.formBuilder.group({
      numsolicitud  : [{ value: null, disabled: true }, Validators.required],
      esticod       : [{ value: null, disabled: true }, Validators.required],
      hdgcodigo     : [{ value: null, disabled: false }, Validators.required],
      esacodigo     : [{ value: null, disabled: false }, Validators.required],
      cmecodigo     : [{ value: null, disabled: false }, Validators.required],
      prioridad     : [{ value: null, disabled: true }, Validators.required],
      fechamostrar  : [{ value: new Date(), disabled: true }, Validators.required],
      bodorigen     : [{ value: null, disabled: true }, Validators.required],
      boddestino    : [{ value: null, disabled: true }, Validators.required],
     
    });

    this.FormRecepcionDevolucionDetalle = this.formBuilder.group({
      codigo  : [{ value: null, disabled: false }, Validators.required],
    });

  }

  ngOnInit() {
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();
    this.setDate();
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  Limpiar(){
    this.FormRecepcionDevolucion.reset();
    this.FormRecepcionDevolucionDetalle.reset();
    this.listaDetalleSolicitudpaginacion =[];
    this.listaDetalleSolicitud =[];
    this.detallessolicitudespaginacion = [];
    this.detallessolicitudes=[];
    this.productosrecepcionadospaginacion =[];
    this.productosrecepcionados =[];
    this.activabtnrecepdevol = false;
    this.activabtnimprime = false;
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(startItem, endItem);
  }

  pageChangedRecepcion(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.detallessolicitudespaginacion = this.detallessolicitudes.slice(startItem, endItem);
  }

  BuscarSolicitud() {

    this._BSModalRef = this._BsModalService.show(BusquedasolicitudesComponent, this.setModalBusquedaSolicitud());
    this._BSModalRef.content.onClose.subscribe((RetornoSolicitudes: Solicitud) => {
      if (RetornoSolicitudes == undefined) { }
      else {

          this._SolicitudService.BuscaSolicitud(RetornoSolicitudes.soliid, this.hdgcodigo,
          this.esacodigo, this.cmecodigo, 0,"","", 0,0,0,this.servidor, 0,0,0,0,0,0,"",0).subscribe(
          response => {
                        this._Solicitud = new (Solicitud);
                        this._Solicitud = response[0];
                        
                        this.FormRecepcionDevolucion.get('numsolicitud').setValue(this._Solicitud.soliid);
                        if (this._Solicitud.soliid > 0) {
                          this.numsolic = true;
                          this.solicitud= this._Solicitud.soliid;
                          this.FormRecepcionDevolucion.get('numsolicitud').setValue(this._Solicitud.soliid);
                          this.FormRecepcionDevolucion.get('boddestino').setValue(this._Solicitud.boddestinodesc);
                          this.FormRecepcionDevolucion.get('bodorigen').setValue(this._Solicitud.bodorigendesc);
                          this.FormRecepcionDevolucion.get('fechamostrar').setValue(new Date(this._Solicitud.fechacreacion));
                          this.FormRecepcionDevolucion.get('esticod').setValue(this._Solicitud.estadosolicitudde);
                          this.FormRecepcionDevolucion.get('prioridad').setValue(this._Solicitud.desprioridadsoli);
                      
                          this.listaDetalleSolicitud = response[0].solicitudesdet;
                          this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(0, 20);
                        }
          });
      }
    }
    );
  }

  LlenaFormulario(Solicitud){
    this.FormRecepcionDevolucion.get('boddestino').setValue(this._Solicitud.boddestinodesc);
    this.FormRecepcionDevolucion.get('bodorigen').setValue(this._Solicitud.bodorigendesc);
    this.FormRecepcionDevolucion.get('fechamostrar').setValue(new Date(this._Solicitud.fechacreacion));
    this.FormRecepcionDevolucion.get('esticod').setValue(this._Solicitud.estadosolicitudde);
    this.FormRecepcionDevolucion.get('prioridad').setValue(this._Solicitud.desprioridadsoli);
  }

  setModalBusquedaSolicitud() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Solicitudes', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        origen: 'Otros'
      }
    };
    return dtModal;
  }

  codigo_ingresado(datosIngresados:any) {
    /* Si existe el código en la solicitud se propone la cantidad */
    this.listaDetalleSolicitud.forEach(element => {
      if (element.codmei.trim() == datosIngresados.codigo.trim()) {
        this.FormRecepcionDevolucionDetalle.get('cantidad').setValue(element.cantdevolucion);
        this.detalleslotes= element.detallelote;
        this.detalleslotes.forEach(element =>{
          this.FormRecepcionDevolucionDetalle.get('lote').setValue(element.lote);
        })
      }
    })
  }

  cambiofecha(lote: string){
    for(let lotes of this.detalleslotes) {
      if(lote == lotes.lote) {
        
        this.fechavto1=this.datePipe.transform(lotes.fechavto, 'dd-MM-yyyy');
        this.fechavto = lotes.fechavto;
        this.FormRecepcionDevolucionDetalle.get('fechavto').setValue(this.fechavto1);
        this.lote = lotes.lote;
      }
    }
  }

  BuscaproductoaRecepcionar(productos:any){
    // console.log("Valida datps ", productos,this.validadato)
    this.listaDetalleSolicitud.forEach(element => {      
      
      if (element.codmei.trim() == productos.codigo.trim()) {
        this.validadato= true;
        // console.log("codigo element",element,"dato que llega",productos);
        // console.log("valida dto", this.validadato)
      }

    });
    if(this.validadato == false){
    
      this.FormRecepcionDevolucionDetalle.reset();
      this.alertSwalError.title = "El valor del Código Ingresado No pertenece a la Solicitud";
      this.alertSwalError.show();

    }

    this.productosrecepcionados = [];
    this._SolicitudService.BuscaProductosDevueltosBodega(this.hdgcodigo,this.esacodigo,this.cmecodigo,
      this.servidor,this.solicitud,this.FormRecepcionDevolucionDetalle.value.codigo,
      this.lote,this.fechavto).subscribe(
      response => {
        if(response.length >1){
          this.alertSwalGrilla.reverseButtons = true;
          this.alertSwalGrilla.title = 'Seleccione Producto Devuelto a Recepcionar';
          this.alertSwalGrilla.show();
          
          this.productosrecepcionados= response;
          this.productosrecepcionadospaginacion = this.productosrecepcionados.slice(0,20)
          
        }else{
          if(response.length ==1){
            this.solicitudseleccion=[];
            
            this.solicitudseleccion=response;
            
            this.onConfirm();
          }
        }
        
      },
      error => {
        console.log(error);
        this.alertSwalError.title="Error al Buscar productos recepcionados";
        this.alertSwalError.text = error;
        this.alertSwalError.show(); 
      }
    );
    this.validadato = false;
    this.FormRecepcionDevolucionDetalle.reset();
    
    
  }

  validacantidadgrilla(id: number,despacho: DetalleSolicitud){
    var idg =0;
    
    if(despacho.sodeid>0){
      if(this.IdgrillaDevolucion(despacho)>=0){
        idg = this.IdgrillaDevolucion(despacho)
        
        if(this.detallessolicitudes[idg].cantdevolarecepcionar > this.detallessolicitudespaginacion[idg].cantdevolucion- this.detallessolicitudespaginacion[idg].sodecantrecepdevo ){

          this.alertSwalAlert.text = "La cantidad a recepcionar debe ser menor o igual a lo Devuelto";
          this.alertSwalAlert.show();
          // this.listaDetalleDespacho[idg].cantidadarecepcionar = this.listaDetalleDespacho[idg].cantdespachada- this.listaDetalleDespacho[idg].cantrecepcionada;

        }else{
          if(this.detallessolicitudes[idg].cantdevolarecepcionar <0){
            this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
            this.alertSwalAlert.show();
          }else{
            if(this.detallessolicitudes[idg].cantdevolarecepcionar < despacho.cantdevolucion- despacho.sodecantrecepdevo || despacho.cantidadarecepcionar >0){
              
            }
          }        

        }
      }
    }
  }

  IdgrillaDevolucion(registro: DetalleSolicitud) {
    
    let indice = 0;
    for (const articulo of this.detallessolicitudes) {
      if (registro.codmei === articulo.codmei) {
        
        return indice;
      }
      indice++;
    }
    return -1;
  }

  onCheck(event: any, productorecepcionado: ProductoRecepcionBodega){// ProductoRecepcionBodega) {

    this.solicitudseleccion=[];
    console.log(this.inArray( productorecepcionado),this.solicitudseleccion);
    if (event.target.checked) {
      console.log(event, this.inArray( productorecepcionado));
      if (this.inArray( productorecepcionado) < 0) {
        
        this.solicitudseleccion.push(productorecepcionado);
        
      } else {
        
        return;
      }
    } else {
      
      this.solicitudseleccion.splice(this.inArray( productorecepcionado), 1);
    }
  }
  onConfirm() {

    this.listaDetalleSolicitudpaginacion.forEach(element =>{
      if(element.sodeid==this.solicitudseleccion[0].sodeid){
        var temporal = new DespachoDetalleSolicitud;
        temporal.codmei         = element.codmei;
        temporal.meinid         = element.meinid;
        temporal.meindescri     = element.meindescri;
        temporal.cantrecepcionado= element.cantrecepcionado;
        temporal.cantsoli       = element.cantsoli;
        temporal.cantdespachada = element.cantdespachada;
        temporal.cantdevolucion = element.cantdevolucion;
        temporal.sodeid         = element.sodeid;
        temporal.sodecantrecepdevo= element.sodecantrecepdevo;       
        this.solicitudseleccion.forEach(datos =>{
          temporal.lote = datos.lote;
          temporal.fechavto     = datos.fechavto;
          temporal.cantdevolarecepcionar= datos.cantdevuelta;// (datos.cantrecepcionada-datos.cantrecepcionada);
          temporal.mfdeid         = datos.mfdeid;
          temporal.movfid         = datos.movfid;
          temporal.mdevid         = datos.mdevid;
          temporal.cantrecepcionada= datos.cantrecepcionada;
          temporal.cantdevuelta   = datos.cantdevuelta;
        })

        this.detallessolicitudes.unshift(temporal);
      }
    });
    this.activabtnrecepdevol = true;
    this.detallessolicitudespaginacion = this.detallessolicitudes.slice(0,20);
    this.FormRecepcionDevolucionDetalle.reset(); this.detalleslotes=[];
  }

  onCancel() {
    this.solicitudseleccion = [];
  }
  
  inArray( seleccion: ProductoRecepcionBodega) {
    let indice = 0;
    for (const objeto of this.solicitudseleccion) {
        if ( seleccion.mdevid === objeto.mdevid ) {
        return indice;
      }
      indice++;
    }
    return -1;
  }

  cambio_cantidad(id: number, property: string, registro:DespachoDetalleSolicitud ) {
    if (this.detallessolicitudespaginacion[id]["sodeid"] == 0) {
      this.detallessolicitudespaginacion[id]["acciond"] = "I";
    }
    if (this.detallessolicitudespaginacion[id]["sodeid"] > 0) {
      this.detallessolicitudespaginacion[id]["acciond"] = "M";
    }
    this.detallessolicitudespaginacion[id][property] = this.detallessolicitudespaginacion[id][property]
  }

  addArticuloGrillaRecepcion(dispensacion: any) {
    
    this.detallessolicitudespaginacion=[];
    this.listaDetalleSolicitud.forEach(element => {
      if (element.codmei.trim() == dispensacion.codigo.trim()) {        
        var temporal = new DetalleSolicitud
        temporal.codmei         = this.FormRecepcionDevolucionDetalle.value.codigo;
        temporal.meindescri     = element.meindescri;
        temporal.fechavto       = this.fechavto;
        temporal.lote           = this.FormRecepcionDevolucionDetalle.value.lote;
        temporal.cantadespachar = 0;
        temporal.soliid         = element.soliid;
        temporal.sodeid         = element.sodeid;
        temporal.meinid         = element.meinid;
        temporal.cantdespachada = element.cantdespachada;
        temporal.cantsoli       = element.cantsoli;
        temporal.stockorigen    = element.stockorigen;
        temporal.observaciones  = element.observaciones;
        temporal.cantdevolucion = element.cantdevolucion;
        temporal.cantrecepcionado= element.cantrecepcionado;
        temporal.cantidadadevolver = 0;
        temporal.cantidadarecepcionar = this.FormRecepcionDevolucionDetalle.value.cantidad;

        this.detallessolicitudes.unshift(temporal);
        this.detallessolicitudespaginacion = this.detallessolicitudes.slice(0,20)
      }
     
    });
    this.FormRecepcionDevolucionDetalle.reset(); this.detalleslotes=[];
  }

  codigo_ingresado1(datosIngresados:any) {

    /* Si existe el código en la solicitud se propone la cantidad */
    this.arreegloDetalleSolicitud.forEach(element => {
      if (element.codmei.trim() == datosIngresados.codigo.trim()) {
        this.FormRecepcionDevolucionDetalle.get('cantidad').setValue(element.cantdespachada);
      }
    })
  }

  ConfirmarEnviarRecepcion(datos:any){
    const Swal = require('sweetalert2');

    Swal.fire({
      title: '¿Desea Recepcionar la Solicitud ?',
      text: "Confirmar Recepción",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.RecepcionarDevolucion(datos);
      }
    })
  }

  RecepcionarDevolucion(datos){
    this.paramrecepcion =[];
    var fecharecepcion =this.datePipe.transform(new Date(), 'yyyy-MM-dd ')//; new Date();
    this.detallessolicitudes.forEach(element => { 
      var temporal = new ParamDetRecepDevolBodega  // new DespachoDetalleSolicitud
      
      temporal.sodeid            = element.sodeid;
      temporal.movfid            = element.movfid;
      temporal.mfdeid            = element.mfdeid;
      temporal.fecharecepcion    = fecharecepcion;
      temporal.lote              = element.lote;
      temporal.fechavto          = element.fechavto;
      temporal.cantrecepcionada  = element.cantrecepcionada;
      temporal.cantdevuelta      = element.cantdevolucion;
      temporal.codmei            = element.codmei;
      temporal.meindescri        = element.meindescri;
      temporal.cantsoli          = element.cantsoli;
      temporal.cantdespachada    = element.cantrecepcionada;
      temporal.cantdevolucion    = element.cantdevolucion;
      temporal.cantrecepcionado  = element.cantrecepcionado;    
      temporal.cantdevolarecepcionar = element.cantdevolarecepcionar;
      temporal.meinid            = element.meinid;
      temporal.mdevid            = element.mdevid;
     
      this.paramrecepcion.push(temporal);
    });

    this.RecepcionBodega = new (ParamRecepDevolBodega);
    this.RecepcionBodega.hdgcodigo = this.hdgcodigo;
    this.RecepcionBodega.esacodigo = this.esacodigo;
    this.RecepcionBodega.cmecodigo = this.cmecodigo;
    this.RecepcionBodega.servidor = this.servidor;
    this.RecepcionBodega.usuariodespacha = this.usuario;
    this.RecepcionBodega.soliid = this.solicitud;
    this.RecepcionBodega.paramdetdevolbodega = this.paramrecepcion;
    
    this._SolicitudService.RecepcionDevolucionBodegas(this.RecepcionBodega).subscribe(
      response => {
        //if (response.respuesta == 'OK') {
          // console.log(response);
          this.alertSwal.title = "Recepción Exitosa";
          this.alertSwal.show();
          this.detallessolicitudespaginacion =[];
          this.detallessolicitudes=[];
          this._buscasolicitudService.BuscaSolicitud(this.solicitud, this.hdgcodigo, this.esacodigo, this.cmecodigo, null, null, null, null, null, null, this.servidor, 0, 0, 0, 0, 0, 0, "",0).subscribe(
            response => {

              this.FormRecepcionDevolucion.get('boddestino').setValue(response[0].boddestinodesc);
              this.FormRecepcionDevolucion.get('bodorigen').setValue(response[0].bodorigendesc);
              this.FormRecepcionDevolucion.get('fechamostrar').setValue(new Date(response[0].fechacreacion));
              this.FormRecepcionDevolucion.get('esticod').setValue(response[0].estadosolicitudde);
              this.FormRecepcionDevolucion.get('prioridad').setValue(response[0].desprioridadsoli);
              this.activabtnimprime = true;
              this.activabtnrecepdevol = false;
              this.listaDetalleSolicitud = response[0].solicitudesdet;
              this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(0, 20);
            },
            error => {
              console.log(error);
              this.alertSwalError.title="Error al Buscar la Solicitud, puede que no exista";
              this.alertSwalError.text = error;
              this.alertSwalError.show();
              
            }
          )
        //}
        this.productosrecepcionados=[]; this.productosrecepcionadospaginacion=[];
      },
      error => {
        console.log(error);
        this.alertSwalError.title="Error al Recepcionar la Solicitud";
        this.alertSwalError.text = error;
        this.alertSwalError.show(); 
      }
    );
  }

  eventosSolicitud() {

    // sE CONFIRMA Eliminar Solicitud
    this._BSModalRef = this._BsModalService.show(EventosSolicitudComponent, this.setModalEventoSolicitud());
    this._BSModalRef.content.onClose.subscribe((Respuesta: any) => {

    })

  }

  setModalEventoSolicitud() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Eventos Solicitud', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        _Solicitud: this._Solicitud,
      }
    };
    return dtModal;
  }

  setModalEventoDetalleSolicitud() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Eventos Detalle Solicitud', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        _Solicitud: this._Solicitud,
        _DetalleSolicitud: this._DetalleSolicitud,
      }
    };
    return dtModal;
  }

  eventosDetalleSolicitud(registroDetalle: DetalleSolicitud) {
    this._DetalleSolicitud = new (DetalleSolicitud);
    this._DetalleSolicitud = registroDetalle;

    this._BSModalRef = this._BsModalService.show(EventosDetallesolicitudComponent, this.setModalEventoDetalleSolicitud());
    this._BSModalRef.content.onClose.subscribe((Respuesta: any) => {
    })
  }

  onImprimir(){
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Recepción Devolución Solicitud ?',
      text: "Confirmar Búsqueda",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.ImprimirSolicitud();
      }
    })    

  }

  ImprimirSolicitud() {

    
    this._imprimesolicitudService.RPTImprimeRecepDevolSolicitudBodega(this.servidor,this.hdgcodigo,this.esacodigo, 
    this.cmecodigo,"pdf", this._Solicitud.soliid,this.usuario).subscribe(
      response => {
        window.open(response[0].url, "", "", true);
        // this.alertSwal.title = "Reporte Impreso Correctamente";
        // this.alertSwal.show();
      },
      error => {
        console.log(error);
        this.alertSwalError.title = "Error al Imprimir Recepción Devolución Solicitud";
        this.alertSwalError.show();
        this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
        })
      }
    );
  }
}