import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { BodegaCargo } from '../../models/entity/BodegaCargo';
import { BodegaDestino } from '../../models/entity/BodegaDestino';
import { Solicitud } from 'src/app/models/entity/Solicitud';
import { ParamDetDevolBodega } from '../../models/entity/ParamDetDevolBodega';
import { Detallelote } from '../../models/entity/Detallelote';
import { ProductoRecepcionBodega } from 'src/app/models/entity/ProductoRecepcionBodega';
import { DetalleSolicitud } from 'src/app/models/entity/DetalleSolicitud';
import { DespachoDetalleSolicitud } from 'src/app/models/entity/DespachoDetalleSolicitud';
import { ParamDevolBodega } from '../../models/entity/ParamDevolBodega';

import { BusquedasolicitudesComponent } from '../busquedasolicitudes/busquedasolicitudes.component';
import { EventosSolicitudComponent } from '../eventos-solicitud/eventos-solicitud.component';
import { EventosDetallesolicitudComponent } from '../eventos-detallesolicitud/eventos-detallesolicitud.component';
import { Permisosusuario } from '../../permisos/permisosusuario';

import { BodegasService } from '../../servicios/bodegas.service';
import { SolicitudService } from 'src/app/servicios/Solicitudes.service';
import { InformesService } from '../../servicios/informes.service';
import { RecepcionsolicitudesService } from '../../servicios/recepcioinsolicitudes.service';

import { element } from 'protractor';

@Component({
  selector: 'app-recepcionsolicitudes',
  templateUrl: './recepcionsolicitudes.component.html',
  styleUrls: ['./recepcionsolicitudes.component.css'],
  providers : [RecepcionsolicitudesService,SolicitudService, InformesService]
})
export class RecepcionsolicitudesComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  @ViewChild('alertSwalGrilla', { static: false }) alertSwalGrilla: SwalComponent;

  public modelopermisos                 : Permisosusuario = new Permisosusuario();
  public FormRecepcionSolicitud         : FormGroup;
  public FormRecepcionDetalle           : FormGroup;
  public FormDatosProducto              : FormGroup;
  public hdgcodigo                      : number;
  public esacodigo                      : number;
  public cmecodigo                      : number;
  public fechavto                       : string;
  public fechavto1                      : string;
  public lote                           : string;
  public servidor                       = environment.URLServiciosRest.ambiente;
  public usuario                        = environment.privilegios.usuario;
  public bodegascargo                   : Array<BodegaCargo> = [];
  public bodegasdestino                 : Array<BodegaDestino> = [];
  public detalleslotes                  : Detallelote[]=[];
  public numsolic                       : boolean = false;
  public listaDetalleSolicitud          : Array<DetalleSolicitud> = [];
  public listaDetalleSolicitudpaginacion: Array<DetalleSolicitud> = [];
  public listaDetalleSolicitud_aux      : Array<DetalleSolicitud> = [];
  public listaDetalleSolicitudpaginacion_aux: Array<DetalleSolicitud> = [];
  public listaDetalleSolicitud_2          : Array<DetalleSolicitud> = [];
  public listaDetalleDespachopaginacion : Array<DespachoDetalleSolicitud> = [];
  public listaDetalleDespacho           : Array<DespachoDetalleSolicitud> = [];
  public productosrecepcionadospaginacion: Array<ParamDetDevolBodega> =[];
  public productosrecepcionados         : Array<ParamDetDevolBodega> =[];
  public solicitudseleccion             : Array<ProductoRecepcionBodega> = [];


  paramrecepcion                        : DespachoDetalleSolicitud[]=[];

  public detallessolicitudes            : Array<DespachoDetalleSolicitud> = [];
  public detallessolicitudespaginacion  : Array<DespachoDetalleSolicitud> = [];
  public _Solicitud                     : Solicitud;
  varListaDetalleDespacho               : DetalleSolicitud;
  ctaid                                 : number = 0;
  cliid                                 : number = 0;
  estid                                 : number = 0;
  public codservicioori                 : number;
  public bodorigen                      : number;
  public boddestino                     : number;

  public locale                         = 'es';
  public bsConfig                       : Partial<BsDatepickerConfig>;
  public colorTheme                     = 'theme-blue';
  private _BSModalRef                   : BsModalRef;
  onClose                               : any;
  bsModalRef                            : any;
  editField                             : any;
  public validadato                     : boolean = false;
  public activabtnimprime               : boolean = false;
  public detallesolicitud               : Array<DetalleSolicitud>=[];
  public activabtnevento                : boolean = false;
  public verificanull                   : boolean = false;
  public vacios                         = true;
  public bloqbtnagregar                 : boolean = false;
  public activabtnimprimedesp           : boolean = false;
  public loading                        = false;
  public ActivaBotonBuscaGrilla         : boolean = false;
  public ActivaBotonLimpiaBusca         : boolean = false;
  public estado_aux                     : number;
  public agregarproducto                = false;

  constructor(
    private router                      : Router,
    private route                       : ActivatedRoute,
    private formBuilder               : FormBuilder,
    public _BsModalService            : BsModalService,
    public _BodegasService            : BodegasService,
    public datePipe                   : DatePipe,
    public localeService              : BsLocaleService,
    public _SolicitudService          : SolicitudService,
    public _buscasolicitudService     : SolicitudService,
    private _imprimesolicitudService  : InformesService,
    private recepcionasolicitudService: SolicitudService
  ) {

    this.FormRecepcionSolicitud = this.formBuilder.group({
      numsolicitud  : [{ value: null, disabled: true }, Validators.required],
      esticod       : [{ value: null, disabled: true }, Validators.required],
      estadosolicitudde: [{ value: null, disabled: true }, Validators.required],
      hdgcodigo     : [{ value: null, disabled: false }, Validators.required],
      esacodigo     : [{ value: null, disabled: false }, Validators.required],
      cmecodigo     : [{ value: null, disabled: false }, Validators.required],
      prioridad     : [{ value: null, disabled: true }, Validators.required],
      fecha         : [{ value: null, disabled: false }, Validators.required],
      fechamostrar  : [{ value: new Date(), disabled: true }, Validators.required],
      bodorigen     : [{ value: null, disabled: true }, Validators.required],
      boddestino    : [{ value: null, disabled: true }, Validators.required]
    });

    this.FormRecepcionDetalle = this.formBuilder.group({
      codmei: [{ value: null, disabled: false }, Validators.required]
    });

    this.FormDatosProducto = this.formBuilder.group({
      codigo  : [{ value: null, disabled: false }, Validators.required]
    });
   }

  ngOnInit() {

    this.setDate();
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.BuscaBodegaCargo();
    this.BuscaBodegaDestino();

    this.route.paramMap.subscribe(param=>{
      if (param.has("id_solicitud")) {

        this.CargaSolicitud( parseInt(param.get("id_solicitud"),10) );
      }
    })
  }

  ngOnDestroy(){
    if(this._Solicitud != undefined){
      if(this._Solicitud.bandera != 2){
        this.ValidaEstadoSolicitud(1,'destroy');
      }
    }

  }

  CargaSolicitud(ID_Solicitud:number) {
    this.loading = true;
    this._buscasolicitudService.BuscaSolicitud(ID_Solicitud, this.hdgcodigo, this.esacodigo, this.cmecodigo, null, null, null, null, null, null, this.servidor, 0, 0, 0, 0, 0, 0, "",0, "","").subscribe(
      Response => {
        if (Response != null) {
          this._Solicitud = Response[0];
          this.activabtnevento = true;
          this.activabtnimprimedesp = true;
          this.estado_aux = this._Solicitud.estadosolicitud;
          this.FormRecepcionSolicitud.get('numsolicitud').setValue(this._Solicitud.soliid);
          if(this._Solicitud.soliid >0){
            this.numsolic =true;
            this.bodorigen = this._Solicitud.bodorigen;
            this.boddestino = this._Solicitud.boddestino;
            this.codservicioori = this._Solicitud.codservicioori;
          }
          this.FormRecepcionSolicitud.get('boddestino').setValue(this._Solicitud.boddestinodesc);
          this.FormRecepcionSolicitud.get('bodorigen').setValue(this._Solicitud.bodorigendesc);
          this.FormRecepcionSolicitud.get('fechamostrar').setValue(new Date(this._Solicitud.fechacreacion));
          this.FormRecepcionSolicitud.get('estadosolicitudde').setValue(this._Solicitud.estadosolicitudde);
          this.FormRecepcionSolicitud.get('prioridad').setValue(this._Solicitud.desprioridadsoli);
          this.listaDetalleSolicitud = Response[0].solicitudesdet;
          this.listaDetalleSolicitud.forEach(element=>{
            element.backgroundcolor =(element.tienelote == "N")?'gris':'amarillo';
            if(element.tienelote == "N"){
              if((element.cantdespachada-element.cantrecepcionado)>0){
                element.cantidadarecepcionar = element.cantdespachada- element.cantrecepcionado;
                this.listaDetalleDespacho.unshift(element);
                this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice(0,20);
                this.logicaVacios();
              }
            }
          });
          this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(0, 20);
          this.listaDetalleSolicitud_aux = this.listaDetalleSolicitud;
          this.listaDetalleSolicitudpaginacion_aux = this.listaDetalleSolicitudpaginacion;
          this.ActivaBotonBuscaGrilla = true;
          this.loading = false;
          this.logicaVacios();

          if(this._Solicitud.estadosolicitud === 39){
            this.verificanull = false;
            this.agregarproducto = false;
            this.bloqbtnagregar = true;
            this.listaDetalleDespacho.forEach(x=>{
              x.bloqcampogrilla = false;
              x.bloqcampogrilla2 = false;
            })
            this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice( 0,20);
            this.alertSwalAlert.title = "Solicitud en preparación";
            this.alertSwalAlert.text = "No puede ser modificada";

            this.alertSwalAlert.show();
          }else{
            this.ValidaEstadoSolicitud(2,'cargaSolicitud');
          }
        } else {
          this.loading = false;
        }
      });

  }

  ValidaEstadoSolicitud(bandera: number, nada:string){
    var recetaid : number = 0;
    var soliid   : number = 0;
    if(this._Solicitud != undefined){
      if(this._Solicitud.soliid === undefined){
        soliid = 0;
      }else{
        soliid = this._Solicitud.soliid;
      }
    } else {
      soliid = 0;
    }

    this._SolicitudService.ValidaEstadoSolicitudCargada(soliid,0,this.servidor,
    ' ',recetaid,bandera).subscribe(
    response => { });
  }

  BuscarSolicitudes() {
    this.listaDetalleDespacho =[];
    this.listaDetalleDespachopaginacion =[];
    this.loading = true;

    if(this._Solicitud != undefined){

      if(this._Solicitud.bandera === 1){  //Si bandera es =2 solicitud tomada
        this.ValidaEstadoSolicitud(1,'BuscaSolicitudes');
      }
    }

    this._BSModalRef = this._BsModalService.show(BusquedasolicitudesComponent, this.setModalBusquedaSolicitud());
    this._BSModalRef.content.onClose.subscribe((RetornoSolicitudes: Solicitud) => {
      if (RetornoSolicitudes == undefined) { }
      else {
        this._SolicitudService.BuscaSolicitud(RetornoSolicitudes.soliid, this.hdgcodigo,
          this.esacodigo, this.cmecodigo, 0, "", "", 0, 0, 0, this.servidor, 0, 0, 0, 0, 0, 0, "", 0, "","").subscribe(
            response => {
              if (response != null) {
                this._Solicitud = response[0];
                this.activabtnevento = true;
                this.activabtnimprimedesp = true;
                this.estado_aux = this._Solicitud.estadosolicitud;
                this.FormRecepcionSolicitud.get('numsolicitud').setValue(this._Solicitud.soliid);
                if (this._Solicitud.soliid > 0) {
                  // this.numsolic =true;
                  this.bodorigen = this._Solicitud.bodorigen;
                  this.boddestino = this._Solicitud.boddestino;
                  this.codservicioori = this._Solicitud.codservicioori;
                }

                if(this._Solicitud.estadosolicitud == 10 || this._Solicitud.estadosolicitud == 70 ||
                  this._Solicitud.estadosolicitud == 75 || this._Solicitud.estadosolicitud == 78 ||
                  this._Solicitud.estadosolicitud == 110){
                  this.bloqbtnagregar = true;
                  this.FormRecepcionDetalle.controls.codmei.disable();
                }else{
                  this.bloqbtnagregar = false;
                  this.FormRecepcionDetalle.controls.codmei.enable();
                }
                this.FormRecepcionSolicitud.get('boddestino').setValue(this._Solicitud.boddestinodesc);
                this.FormRecepcionSolicitud.get('bodorigen').setValue(this._Solicitud.bodorigendesc);
                this.FormRecepcionSolicitud.get('fechamostrar').setValue(new Date(this._Solicitud.fechacreacion));
                this.FormRecepcionSolicitud.get('estadosolicitudde').setValue(this._Solicitud.estadosolicitudde);
                this.FormRecepcionSolicitud.get('prioridad').setValue(this._Solicitud.desprioridadsoli);

                this.detallesolicitud = this._Solicitud.solicitudesdet;

                this.detallesolicitud.forEach(element => {
                  element.backgroundcolor = (element.tienelote == "N") ? 'gris' : 'amarillo';
                  if (element.tienelote == "N") {
                    this._SolicitudService.BuscaProductoDespachoBodega(this.hdgcodigo, this.esacodigo, this.cmecodigo,
                      this.servidor, this._Solicitud.soliid, element.codmei,
                      this.lote, this.fechavto).subscribe(
                        resp => {
                          // if(response.length == 0){
                          //   this.alertSwalError.title = "El Código No tiene Datos para recepcionar";
                          //   this.alertSwalError.show();
                          // }
                          // console.log("PRod con despachobodega", resp)
                          resp.forEach(data => {
                            if (element.codmei == data.codmei) {

                              if ((element.cantdespachada - element.cantrecepcionado) > 0) {
                                this.numsolic = true;

                                var temporal = new DespachoDetalleSolicitud;
                                temporal.soliid = data.soliid;
                                temporal.hdgcodigo = this.hdgcodigo;
                                temporal.esacodigo = this.esacodigo;
                                temporal.cmecodigo = this.cmecodigo;
                                temporal.sodeid = data.sodeid;
                                if(data.fechavto == " "){
                                //   console.log("fecha y lote con espacio ")
                                //   temporal.lote=null;
                                  temporal.fechavto = null;
                                }else{
                                  temporal.lote = data.lote;
                                  temporal.fechavto = data.fechavto;
                                }

                                temporal.cantidadadevolver = (data.cantrecepcionada - data.cantdevuelta);
                                temporal.mfdeid = data.mfdeid;
                                temporal.cantrecepcionada = data.cantrecepcionada;
                                temporal.cantrecepcionado = data.cantrecepcionado;
                                temporal.cantdevuelta = data.cantdevuelta;
                                temporal.cantidadarecepcionar = data.cantdespachada - data.cantrecepcionada;
                                temporal.cantdespachada = data.cantdespachada;
                                temporal.codmei = data.codmei;
                                temporal.cantsoli = data.cantsoli;
                                temporal.meindescri = data.meindescri;
                                temporal.cantdevolucion = data.cantdevolucion;
                                temporal.meinid = data.meinid;

                                // data.cantidadarecepcionar = data.cantdespachada- data.cantrecepcionado;
                                this.listaDetalleDespacho.unshift(temporal);
                                this.verificanull = true;
                                this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice(0, 20);
                                this.logicaVacios();
                              }
                            }
                          })


                        }
                      )
                  }
                });
                this.listaDetalleSolicitud = response[0].solicitudesdet;
                this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(0, 20);
                this.listaDetalleSolicitud_aux = this.listaDetalleSolicitud;
                this.listaDetalleSolicitudpaginacion_aux = this.listaDetalleSolicitudpaginacion;
                this.ActivaBotonBuscaGrilla = true;
                this.loading = false;
                this.logicaVacios();
                if(this._Solicitud.bandera === 2){ //Si bandera es =2 solicitud tomada
                  this.agregarproducto = false;
                  this.bloqbtnagregar = true;
                  this.FormRecepcionDetalle.disable()
                  if(this.listaDetalleDespacho.length >0){
                    this.listaDetalleDespacho.forEach(x=>{
                      x.bloqcampogrilla = false;
                      x.bloqcampogrilla2 = false;
                    })
                    this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice( 0,20);
                    this.alertSwalAlert.title = "Solicitud en preparación";
                    this.alertSwalAlert.text = "No puede ser modificada";
                    this.alertSwalAlert.show();
                  }else{
                    this.alertSwalAlert.title = "Solicitud en preparación";
                    this.alertSwalAlert.text = "No puede ser modificada";
                    this.alertSwalAlert.show();
                  }
                }else{
                  this.ValidaEstadoSolicitud(2,'cargaSolicitud');
                }
              } else {
                this.loading = false;
              }
            });
      }
    });
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  BuscaBodegaCargo() {

    this._BodegasService.listaBodegaCargoSucursal(this.hdgcodigo,this.esacodigo,this.cmecodigo,this.usuario,this.servidor).subscribe(
      response => {
        if (response != null) {
          this.bodegascargo = response;
        }
      },
      error => {
        console.log(error);
        alert("Error al Cargar Bodegas");
      }
    );
  }

  BuscaBodegaDestino() {
    this._BodegasService.listaBodegaDestinoSucursal(this.hdgcodigo,this.esacodigo,this.cmecodigo,this.usuario,this.servidor).subscribe(
      response => {
        if (response != null) {
          this.bodegasdestino = response;
        }
      },
      error => {
        console.log(error);
        alert("Error al Buscar Bodegas de Destino");
      }
    );
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(startItem, endItem);
  }

  pageChangedRecepcion(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice(startItem, endItem);
  }

  Limpiar(){
    if(this._Solicitud != undefined){
      if(this._Solicitud.bandera != 2){
        this.ValidaEstadoSolicitud(1,'limpiar');
      }
    }
    this.FormRecepcionSolicitud.reset();
    this.FormRecepcionDetalle.reset();
    this.listaDetalleDespachopaginacion = [];
    this.listaDetalleDespacho           = [];
    this.listaDetalleSolicitudpaginacion= [];
    this.listaDetalleSolicitud          = [];
    this.numsolic                       = false;
    this.detallessolicitudes            = [];
    this.validadato                     = false;
    this.activabtnevento                = false;
    this.solicitudseleccion             = [];
    this.verificanull                   = false;
    this.FormRecepcionDetalle.controls.codmei.enable();
    this.bloqbtnagregar                 = false;
    this.activabtnimprimedesp           = false;
    this.activabtnimprime               = false;
    this.ActivaBotonBuscaGrilla         = false;
    this._Solicitud                     = undefined;
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
        origen: 'Otros',
        paginaorigen: 3
      }
    };
    return dtModal;
  }

  /**
   * Nota: se modifica función validando código
   * Autor: MLobos miguel.lobos@sonda.com
   * Fecha: 22-12-2020
  */
  BuscaproductoaRecepcionar(productos:any){
    this.validaCodigo(productos.codmei).then((value) => {
      if(value) {
            // console.log("prod ",productos)
    this.listaDetalleSolicitud.forEach(element => {

      if (element.codmei.trim() == productos.codmei.trim()) {
        this.validadato= true;
      }

    });
    if(this.validadato == false){
      this.FormRecepcionDetalle.reset();
      this.alertSwalAlert.title = "El valor del Código Ingresado No pertenece a la Solicitud";
      this.alertSwalAlert.show();

    }
    this.productosrecepcionadospaginacion=[];
    this.productosrecepcionados = [];
    this._SolicitudService.BuscaProductoDespachoBodega(this.hdgcodigo,this.esacodigo,this.cmecodigo,
      this.servidor,this._Solicitud.soliid,this.FormRecepcionDetalle.value.codmei,
      this.lote,this.fechavto).subscribe(
      response => {
        if (response != null) {
          if(response.length >1){
            this.alertSwalGrilla.reverseButtons = true;
            this.alertSwalGrilla.title = 'Seleccione Producto a Recepcionar';
            this.alertSwalGrilla.show();
            this.productosrecepcionados= response;
            this.productosrecepcionados.forEach(element=>{
              if(element.cantpendienterecepcion == 0){
                element.checkgrilla = true;
              }else{
                if(element.cantpendienterecepcion >0){
                  element.checkgrilla =false;
                }
              }
            });
            this.productosrecepcionadospaginacion = this.productosrecepcionados.slice(0,20);
          }else{
            if(response.length==1){
              this.solicitudseleccion=[];
              this.solicitudseleccion=response;
              this.onConfirm();
            }
          }
        }
      },
      error => {
        this.alertSwalError.title="Error al Buscar productos recepcionados";
        this.alertSwalError.text = error;
        this.alertSwalError.show();
      }
    );
    this.validadato = false;
    this.FormRecepcionDetalle.reset();

      }
    });

  }

  cambio_cantidad(id: number, property: string, registro:DespachoDetalleSolicitud ) {
    if (this.listaDetalleDespachopaginacion[id]["sodeid"] == 0) {
      this.listaDetalleDespachopaginacion[id]["acciond"] = "I";
    }
    if (this.listaDetalleDespachopaginacion[id]["sodeid"] > 0) {
      this.listaDetalleDespachopaginacion[id]["acciond"] = "M";
    }
    this.listaDetalleDespachopaginacion[id][property] = this.listaDetalleDespachopaginacion[id][property]

  }

  ConfirmarRecepcion(){

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
        this.RecepcionarSolicitud();
      }
    })
  }


  ConfirmarRecepcionCompleta(){

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
        this.RecepcionarSolicitudCompleta();
      }
    })
  }

  onCheck(event: any, productorecepcionado: ProductoRecepcionBodega) {
    // console.log("proiducchechea",productorecepcionado)
    this.alertSwalAlert.title = null;
    // this.solicitudseleccion=[];
    if (event.target.checked) {

      // if (this.inArray( productorecepcionado) < 0) {
        // if(productorecepcionado.cantpendienterecepcion > 0){
          this.solicitudseleccion.push(productorecepcionado);
          // console.log("produc chec guardados",this.solicitudseleccion)
        // }else{


      // } else {


          // return;
      // }
    } else {

      this.solicitudseleccion.splice(this.inArray( productorecepcionado), 1);
    }
  }

  onConfirm() {

    this.solicitudseleccion.forEach(element =>{
      if(element.cantpendienterecepcion > 0){
        // if(element.lote== " "  && element.fechavto == " "){
        //   console.log("fecha y lote con espacio ")
        //   element.lote=null;
        //   element.fechavto = null;
        // }
        var temporal = new DespachoDetalleSolicitud;
        temporal.soliid               = element.soliid;
        temporal.hdgcodigo            = this.hdgcodigo;
        temporal.esacodigo            = this.esacodigo;
        temporal.cmecodigo            = this.cmecodigo;
        temporal.sodeid               = element.sodeid;
        temporal.lote                 = element.lote;
        temporal.fechavto             = element.fechavto;
        temporal.cantidadadevolver    = (element.cantrecepcionada-element.cantdevuelta);
        temporal.mfdeid               = element.mfdeid;
        temporal.cantrecepcionada     = element.cantrecepcionada;
        temporal.cantrecepcionado     = element.cantrecepcionado;
        temporal.cantdevuelta         = element.cantdevuelta;
        temporal.cantidadarecepcionar = element.cantdespachada- element.cantrecepcionada;
        temporal.cantdespachada       = element.cantdespachada;
        temporal.codmei               = element.codmei;
        temporal.cantsoli             = element.cantsoli;
        temporal.meindescri           = element.meindescri;
        temporal.cantdevolucion       = element.cantdevolucion;
        temporal.meinid               = element.meinid;

        this.detallessolicitudes.unshift(temporal);
        this.listaDetalleDespacho.unshift(temporal);
      }
    })

    // console.log("se agrega  ala grilla princuoa",this.listaDetalleDespacho)
    this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice(0,20);
    this.logicaVacios();
    // this.numsolic = true;
    this.FormRecepcionDetalle.reset(); this.detalleslotes=[];
    this.productosrecepcionadospaginacion=[]
    this.productosrecepcionados=[];
    this.solicitudseleccion=[];
  }

  validacantidadgrilla(id: number,despacho: DetalleSolicitud){
    var idg =0;
    this.alertSwalAlert.text = null;
    if(despacho.sodeid>0){
      if(this.IdgrillaRecepcion(despacho)>=0){
        idg = this.IdgrillaRecepcion(despacho)

        if(this.listaDetalleDespacho[idg].cantidadarecepcionar > this.listaDetalleDespacho[idg].cantdespachada- this.listaDetalleDespacho[idg].cantrecepcionada ){

          this.alertSwalAlert.text = "La cantidad a recepcionar debe ser menor o igual a la cantidad Despachada";
          this.alertSwalAlert.show();
          this.listaDetalleDespacho[idg].cantidadarecepcionar = this.listaDetalleDespacho[idg].cantdespachada - this.listaDetalleDespacho[idg].cantrecepcionada ;
          this.listaDetalleDespachopaginacion[idg].cantidadarecepcionar = this.listaDetalleDespacho[idg].cantidadarecepcionar ;

        }else{
          if(this.listaDetalleDespacho[idg].cantidadarecepcionar <=0){
            this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
            this.alertSwalAlert.show();
            this.listaDetalleDespacho[idg].cantidadarecepcionar = this.listaDetalleDespacho[idg].cantdespachada - this.listaDetalleDespacho[idg].cantrecepcionada ;
            this.listaDetalleDespachopaginacion[idg].cantidadarecepcionar = this.listaDetalleDespacho[idg].cantidadarecepcionar ;

          }else{
            if(despacho.cantidadarecepcionar < despacho.cantdespachada- despacho.cantrecepcionada || despacho.cantidadarecepcionar >0){

            }
          }

        }
      }
    }

    // this.listaDetalleSolicitud.forEach(element => {
    //   console.log("busca en el detalle de la solicitud",element.cantidadarecepcionar,element.cantrecepcionado)
    //   // if (element.codmei.trim() == datoingresado.codmei.trim()) {
    //     if(despacho.cantidadarecepcionar > element.cantdespachada- element.cantrecepcionado || despacho.cantidadarecepcionar <0){
    //       console.log("cantidad es mayor que pendiente por recepcionr",despacho.cantidadarecepcionar, element.cantdespachada, element.cantrecepcionado);
    //       this.alertSwalAlert.text = "La cantidad a recepcionar debe ser menor o igual a la cantidad Despachada";
    //       this.alertSwalAlert.show();
    //       // element.cantidadarecepcionar = element.cantdespachada- element.cantrecepcionada;

    //     }else{
    //       if(despacho.cantidadarecepcionar < element.cantdespachada- element.cantrecepcionado || despacho.cantidadarecepcionar >0){
    //         console.log("cantidad >0 y menor que pendiente")
    //       }

    //     }
    //   // }
    // })
  }

  onCancel() {
    this.solicitudseleccion = [];
  }

  inArray( seleccion: any) {
    /* devuelve index si objeto existe en array
     0= objeto a devolver
     1= objeto verificar/eliminar en seleccion */
    let indice = 0;
    for (const objeto of this.solicitudseleccion) {
      if ( seleccion.mfdeid === objeto.mfdeid ) {

        return indice;
      }
      indice++;
    }
    return -1;
  }

  IdgrillaRecepcion(registro: DetalleSolicitud) {

    let indice = 0;
    for (const articulo of this.listaDetalleDespacho) {
      if (registro.codmei === articulo.codmei) {

        return indice;
      }
      indice++;
    }
    return -1;
  }


  RecepcionarSolicitudCompleta(){
    var cantpendiente;
    this.paramrecepcion=[];
    this.listaDetalleDespacho = [];


    // this._SolicitudService.BuscaProductoDespachoBodega(this.hdgcodigo,this.esacodigo,this.cmecodigo,
    //   this.servidor,this._Solicitud.soliid,this.FormRecepcionDetalle.value.codmei,
    //   this.lote,this.fechavto).subscribe(
    //   response => {
    //     console.log("busca detallelote",response)
    //     if(response.length >1){
    //       this.alertSwalGrilla.reverseButtons = true;
    //       this.alertSwalGrilla.title = 'Seleccione Producto a Recepcionar';
    //       this.alertSwalGrilla.show();
    //       this.productosrecepcionados= response;
    //       this.productosrecepcionadospaginacion = this.productosrecepcionados.slice(0,8);
    //     }else{
    //       if(response.length==1){
    //         this.solicitudseleccion=[];

    //         this.solicitudseleccion=response;

    //         // this.onConfirm();
    //       }
    //     }
    //   })
    // this.listaDetalleDespacho = this.listaDetalleSolicitud;
    this.listaDetalleSolicitud.forEach(element=>{
      var temporal = new DespachoDetalleSolicitud;

      temporal.soliid               = element.soliid;
      temporal.hdgcodigo            = this.hdgcodigo;
      temporal.esacodigo            = this.esacodigo;
      temporal.cmecodigo            = this.cmecodigo;
      temporal.sodeid               = element.sodeid;
      temporal.codmei               = element.codmei;
      temporal.meinid               = element.meinid;
      temporal.cantsoli             = element.cantsoli;
      // temporal.cantadespachar       = element.cantadespachar;
      temporal.cantdespachada       = element.cantdespachada;
      // temporal.observaciones        = element.observaciones;
      temporal.usuariodespacha      = this.usuario;
      temporal.estid                = this.estid;
      temporal.ctaid                = this.ctaid;
      temporal.cliid                = this.cliid;
      temporal.valcosto             = 0;
      temporal.valventa             = 0;
      temporal.unidespachocod       = 0;
      temporal.unicompracod         = 0;
      temporal.incobfon             = null;
      temporal.numdocpac            = null;
      temporal.cantdevolucion       = element.cantdevolucion;
      temporal.tipomovim            = "C";
      temporal.servidor             = this.servidor;
        element.detallelote.forEach(data=>{

          temporal.lote                 = data.lote;
          temporal.fechavto             = data.fechavto;
        })
      temporal.bodorigen            = this.bodorigen;
      temporal.boddestino           = this.boddestino;
      // temporal.cantrecepcionado     = element.cantrecepcionado;
      temporal.cantidadarecepcionar = element.cantdespachada;
      temporal.cantidadadevolver    = 0;
      // temporal.cantdevolarecepcionar= element.cantdevolarecepcionar;
      // temporal.cantdevuelta         = element.cantdevuelta;
      temporal.cantrecepcionada     = element.cantrecepcionada;
      // temporal.codservicioori       = element.codservicioori ;

      this.paramrecepcion.unshift(temporal);
    });

    // console.log("datos a recepc compl",this.paramrecepcion)
    this.recepcionasolicitudService.RecepcionaDispensacion(this.paramrecepcion).subscribe(
      response => {
        if (response != null) {
          if (response.respuesta != 'OK') {
            this.alertSwalAlert.title = response.respuesta;
            this.alertSwalAlert.show();
          } else {
            this.alertSwal.title = "Solicitud Recepcionada Correctamente".concat();
            this.alertSwal.show();
            this._buscasolicitudService.BuscaSolicitud(this._Solicitud.soliid, this.hdgcodigo,
            this.esacodigo,this.cmecodigo, null, null, null, null, null, null, this.servidor,0,0,0,0,0,0,"",0, "","").subscribe(
              response => {
                if (response != null) {
                  this.estado_aux = this._Solicitud.estadosolicitud;
                  this.FormRecepcionSolicitud.get('boddestino').setValue(response[0].boddestinodesc);
                  this.FormRecepcionSolicitud.get('bodorigen').setValue(response[0].bodorigendesc);
                  this.FormRecepcionSolicitud.get('fechamostrar').setValue(new Date(response[0].fechacreacion));
                  this.FormRecepcionSolicitud.get('estadosolicitudde').setValue(response[0].estadosolicitudde);
                  this.FormRecepcionSolicitud.get('prioridad').setValue(response[0].desprioridadsoli);
                  this.listaDetalleSolicitud = response[0].solicitudesdet;
                  this.listaDetalleSolicitud.forEach(element => {
                    element.backgroundcolor = (element.tienelote == "N")?'gris':'amarillo';
                    cantpendiente= element.cantsoli- element.cantdespachada;
                    element.cantadespachar= cantpendiente;
                  });
                  this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(0, 20);
                  this.activabtnimprime = true;
                }
              },
              error => {
                console.log(error);
                this.alertSwalError.title="Error al Buscar la Solicitud, puede que no exista";
                this.alertSwalError.text = error;
                this.alertSwalError.show();
              }
            );
          }
        }
      },
      error => {
        console.log(error);
        this.alertSwalError.title="Error al Recepcionar la Solicitud";
        this.alertSwalError.text = error;
        this.alertSwalError.show();

      }
    );
    this.listaDetalleDespachopaginacion=[];
    this.listaDetalleDespacho=[];
    this.detallessolicitudes =[];
    this.solicitudseleccion =[];

  }

  RecepcionarSolicitud(){
    var cantpendiente;
    this.paramrecepcion=[];
    this.listaDetalleDespacho.forEach(element=>{
      var temporal = new DespachoDetalleSolicitud;

      temporal.soliid               = element.soliid;
      temporal.hdgcodigo            = this.hdgcodigo;
      temporal.esacodigo            = this.esacodigo;
      temporal.cmecodigo            = this.cmecodigo;
      temporal.sodeid               = element.sodeid;
      temporal.codmei               = element.codmei;
      temporal.meinid               = element.meinid;
      temporal.cantsoli             = element.cantsoli;
      temporal.cantadespachar       = element.cantadespachar;
      temporal.cantdespachada       = element.cantdespachada;
      temporal.observaciones        = element.observaciones;
      temporal.usuariodespacha      = this.usuario;
      temporal.estid                = this.estid;
      temporal.ctaid                = this.ctaid;
      temporal.cliid                = this.cliid;
      temporal.valcosto             = 0;
      temporal.valventa             = 0;
      temporal.unidespachocod       = 0;
      temporal.unicompracod         = 0;
      temporal.incobfon             = null;
      temporal.numdocpac            = null;
      temporal.cantdevolucion       = element.cantdevolucion;
      temporal.tipomovim            = "C";
      temporal.servidor             = this.servidor;
      temporal.lote                 = element.lote;
      temporal.fechavto             = element.fechavto;
      temporal.bodorigen            = this.bodorigen;
      temporal.boddestino           = this.boddestino;
      temporal.cantrecepcionado     = element.cantrecepcionado;
      temporal.cantidadarecepcionar = element.cantidadarecepcionar;
      temporal.cantidadadevolver    = 0;
      temporal.codservicioori       = element.codservicioori ;

      this.paramrecepcion.push(temporal);
    });
    // console.log("recep",this.paramrecepcion);
    this.recepcionasolicitudService.RecepcionaDispensacion(this.paramrecepcion).subscribe(
      response => {
        if (response != null) {
          if (response.respuesta != 'OK') {
            this.alertSwalAlert.title = response.respuesta;
            this.alertSwalAlert.show();
          } else {
            this.alertSwal.title = "Solicitud Recepcionada Correctamente".concat();
            this.alertSwal.show();
            this._buscasolicitudService.BuscaSolicitud(this._Solicitud.soliid, this.hdgcodigo,
            this.esacodigo,this.cmecodigo, null, null, null, null, null, null, this.servidor,0,0,0,0,0,0,"",0, "","").subscribe(
              response => {
                if (response != null) {
                  this.FormRecepcionSolicitud.get('boddestino').setValue(response[0].boddestinodesc);
                  this.FormRecepcionSolicitud.get('bodorigen').setValue(response[0].bodorigendesc);
                  this.FormRecepcionSolicitud.get('fechamostrar').setValue(new Date(response[0].fechacreacion));
                  this.FormRecepcionSolicitud.get('estadosolicitudde').setValue(response[0].estadosolicitudde);
                  this.FormRecepcionSolicitud.get('prioridad').setValue(response[0].desprioridadsoli);

                  this.estado_aux = this._Solicitud.estadosolicitud;
                  this.listaDetalleSolicitud = response[0].solicitudesdet;
                  this.listaDetalleSolicitud.forEach(element => {
                    element.backgroundcolor = (element.tienelote == "N")?'gris':'amarillo';
                    cantpendiente= element.cantsoli- element.cantdespachada;
                    element.cantadespachar= cantpendiente;
                  });
                  this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(0, 20);
                  this.activabtnimprime = true;
                  this.numsolic= false;
                  this.activabtnevento = true;
                  this.logicaVacios();

                  if(this._Solicitud.bandera === 2){
                    this.verificanull = false;
                    this.agregarproducto = false;
                    this.FormRecepcionDetalle.disable();
                    if(this.listaDetalleDespacho.length >0){
                      this.listaDetalleDespacho.forEach(x=>{
                        x.bloqcampogrilla = false;
                        x.bloqcampogrilla2 = false;
                      });
                      this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice( 0,20);
                      this.alertSwalAlert.title = "Solicitud en preparación";
                      this.alertSwalAlert.text = "No puede ser modificada";
                      this.alertSwalAlert.show();
                    }
                  }else{
                    this.ValidaEstadoSolicitud(2,'BuscaSolicitudes');
                  }
                }
              },
              error => {
                console.log(error);
                this.alertSwalError.title="Error al Buscar la Solicitud, puede que no exista";
                this.alertSwalError.text = error;
                this.alertSwalError.show();
              }
            )
          }
        }
      },
      error => {
        console.log(error);
        this.alertSwalError.title="Error al Recepcionar la Solicitud";
        this.alertSwalError.text = error;
        this.alertSwalError.show();

      }
    );
    this.listaDetalleDespachopaginacion=[];
    this.listaDetalleDespacho=[];
    this.detallessolicitudes =[];
    this.solicitudseleccion =[];

  }

  eventosSolicitud() {
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

  eventosDetalleSolicitud( registroDetalle : DetalleSolicitud) {

    this.varListaDetalleDespacho = new(DetalleSolicitud);
    this.varListaDetalleDespacho = registroDetalle;

    this._BSModalRef = this._BsModalService.show(EventosDetallesolicitudComponent, this.setModalEventoDetalleSolicitud());
    this._BSModalRef.content.onClose.subscribe((Respuesta: any) => {
    })
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
        _DetalleSolicitud: this.varListaDetalleDespacho,
       }
    };
    return dtModal;
  }

  onImprimir(){
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Recepción De Solicitud ?',
      text: "Confirmar Impresión",
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

    this._imprimesolicitudService.RPTImprimeSolicitudRecepcionDespBodega(this.servidor,this.hdgcodigo,
    this.esacodigo, this.cmecodigo,"pdf",this._Solicitud.soliid).subscribe(
      response => {
        if (response != null) {
          window.open(response[0].url, "", "");
        }
      },
      error => {
        this.alertSwalError.title = "Error al Imprimir Listado";
        this.alertSwalError.show();
        this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
        })
      }
    );
  }

  salir(){

   if(this._Solicitud != undefined){
      if(this._Solicitud.bandera != 2){
        this.ValidaEstadoSolicitud(1,'salir');
      }
    }

    this.route.paramMap.subscribe(param=>{
      if (param.has("id_solicitud")) {
        this.router.navigate(['monitorejecutivo']);
      } else {
        this.router.navigate(['home']);
      }
    })
  }

  /**
   * Nota: se agrega validación código repetido(n°162 Testing_Fusat.xls)
   * Autor: MLobos miguel.lobos@sonda.com
   * Fecha: 22-12-2020
  */
  async validaCodigo(valorCodigo: any){
    this.alertSwal.title = null;
    this.alertSwal.text = null;
    let arrProductos: Array<DespachoDetalleSolicitud> = [];
    arrProductos = this.listaDetalleDespacho;
    const resultado = arrProductos.find( registro => registro.codmei === valorCodigo );
    if  ( resultado != undefined )
    {
      this.alertSwalError.title = "Código de artículo repetido";
      this.alertSwalError.show();
      this.FormRecepcionDetalle.reset();
      return false;
    } else { return true; }
  }

  async logicaVacios() {
    this.vaciosProductos();
    if (this.vacios === true) {
      this.verificanull = false;
    }
    else {
      this.verificanull = true;
    }
    if(this._Solicitud != null){
      if(this._Solicitud.bandera === 2){
        this.verificanull = false;
      }
    }
  }

  vaciosProductos() {
    if (this.listaDetalleDespachopaginacion.length) {
      for (var data of this.listaDetalleDespachopaginacion) {

        if (data.cantidadarecepcionar <= 0 || data.cantidadarecepcionar === null) {
          this.vacios = true;

          return;
        }else{
          this.vacios = false;

        }
      }
    }else{

      this.vacios = true;
    }
  }

  onImprimirDespacho() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir El Despacho De La Solicitud?',
      text: "Confirmar Impresión",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.ImprimirSolicitudDespacho();
      }
    })

  }

  ImprimirSolicitudDespacho() {

    this._imprimesolicitudService.RPTImprimeSolicitudDespachoBodega(this.servidor, this.hdgcodigo, this.esacodigo,
      this.cmecodigo, "pdf", this._Solicitud.soliid).subscribe(
        response => {
          if (response != null) {
            window.open(response[0].url, "", "");
          }
        },
        error => {
          console.log(error);
          this.alertSwalError.title = "Error al Imprimir Despacho Solicitud";
          this.alertSwalError.show();
          this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
          })
        }
      );
  }

  async findArticuloGrilla() {
    this.loading = true;
    let _DetalleDespacho  : DespachoDetalleSolicitud;
    // console.log('this.FormDatosProducto.controls.codigo.value : ' , this.FormDatosProducto.controls.codigo);
    if ( this.FormDatosProducto.controls.codigo.touched &&
        this.FormDatosProducto.controls.codigo.status !== 'INVALID') {
        var codProdAux = this.FormDatosProducto.controls.codigo.value.toString();
      if(this.FormRecepcionSolicitud.controls.numsolicitud.value >0){

        this.listaDetalleSolicitud = [];
        this.listaDetalleSolicitudpaginacion = [];

        // console.log(this.FormRecepcionSolicitud.controls.numsolicitud.value,
        //   this.hdgcodigo,this.esacodigo, this.cmecodigo, 0, "", "", 0, 0, 0, this.servidor, 0, 0,
        //   0, 0, 0, 0, "",0,codProdAux)
        // console.log("prod a buscar en la grilla",codProdAux,this.FormRecepcionSolicitud.controls.numsolicitud.value)

        this._SolicitudService.BuscaSolicitud(this.FormRecepcionSolicitud.controls.numsolicitud.value,
        this.hdgcodigo,this.esacodigo, this.cmecodigo, 0, "", "", 0, 0, 0, this.servidor, 0,
          0, 0, 0, 0, 0, "", 0, codProdAux,"").subscribe(response => {
              this._Solicitud = response[0];
              this.activabtnevento = true;
              this.activabtnimprimedesp = true;
              this.FormRecepcionSolicitud.get('numsolicitud').setValue(this._Solicitud.soliid);
              if (this._Solicitud.soliid > 0) {
                // this.numsolic =true;
                this.bodorigen = this._Solicitud.bodorigen;
                this.boddestino = this._Solicitud.boddestino;
                this.codservicioori = this._Solicitud.codservicioori;
              }

              if(this._Solicitud.estadosolicitud == 10 || this._Solicitud.estadosolicitud == 70 ||
                this._Solicitud.estadosolicitud == 75 || this._Solicitud.estadosolicitud == 78 ||
                this._Solicitud.estadosolicitud == 110){
                this.bloqbtnagregar = true;
                this.FormRecepcionDetalle.controls.codmei.disable();
              }
              this.FormRecepcionSolicitud.get('boddestino').setValue(this._Solicitud.boddestinodesc);
              this.FormRecepcionSolicitud.get('bodorigen').setValue(this._Solicitud.bodorigendesc);
              this.FormRecepcionSolicitud.get('fechamostrar').setValue(new Date(this._Solicitud.fechacreacion));
              this.FormRecepcionSolicitud.get('estadosolicitudde').setValue(this._Solicitud.estadosolicitudde);
              this.FormRecepcionSolicitud.get('prioridad').setValue(this._Solicitud.desprioridadsoli);

              this.detallesolicitud = this._Solicitud.solicitudesdet;

              this.detallesolicitud.forEach(element => {
                element.backgroundcolor = (element.tienelote == "N") ? 'gris' : 'amarillo';
                if (element.tienelote == "N") {
                  this._SolicitudService.BuscaProductoDespachoBodega(this.hdgcodigo, this.esacodigo, this.cmecodigo,
                    this.servidor, this._Solicitud.soliid, element.codmei,
                    this.lote, this.fechavto).subscribe(
                      resp => {
                        // if(response.length == 0){
                        //   this.alertSwalError.title = "El Código No tiene Datos para recepcionar";
                        //   this.alertSwalError.show();
                        // }
                        // console.log("PRod con despachobodega", resp)
                        resp.forEach(data => {
                          if (element.codmei == data.codmei) {
                            if ((element.cantdespachada - element.cantrecepcionado) > 0) {
                              this.numsolic = true;

                              var temporal = new DespachoDetalleSolicitud;
                              temporal.soliid = data.soliid;
                              temporal.hdgcodigo = this.hdgcodigo;
                              temporal.esacodigo = this.esacodigo;
                              temporal.cmecodigo = this.cmecodigo;
                              temporal.sodeid = data.sodeid;
                              // if(data.lote== " "  && data.fechavto == " "){
                              //   console.log("fecha y lote con espacio ")
                              //   temporal.lote=null;
                              //   temporal.fechavto = null;
                              // }else{
                                temporal.lote = data.lote;
                                temporal.fechavto = data.fechavto;
                              // }

                              temporal.cantidadadevolver = (data.cantrecepcionada - data.cantdevuelta);
                              temporal.mfdeid = data.mfdeid;
                              temporal.cantrecepcionada = data.cantrecepcionada;
                              temporal.cantdevuelta = data.cantdevuelta;
                              temporal.cantidadarecepcionar = data.cantdespachada - data.cantrecepcionada;
                              temporal.cantdespachada = data.cantdespachada;
                              temporal.codmei = data.codmei;
                              temporal.cantsoli = data.cantsoli;
                              temporal.meindescri = data.meindescri;
                              temporal.cantdevolucion = data.cantdevolucion;
                              temporal.meinid = data.meinid;

                              // data.cantidadarecepcionar = data.cantdespachada- data.cantrecepcionado;
                              this.listaDetalleDespacho.unshift(temporal);
                              this.verificanull = true;
                              this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice(0, 20);
                              this.logicaVacios();
                            }
                          }
                        })


                      }
                    )
                }

              })
              this.listaDetalleSolicitud = response[0].solicitudesdet;
              this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(0, 20);

              // this.listaDetalleSolicitud_aux = this.listaDetalleSolicitud;
              // this.listaDetalleSolicitudpaginacion_aux = this.listaDetalleSolicitudpaginacion;
              this.loading = false;
              this.logicaVacios();
            })

        this.ActivaBotonBuscaGrilla = true;
        this.ActivaBotonLimpiaBusca = true;
        this.loading = false;
        return;
      }else{ //Cuando la plantilla aún no se crea
        this.listaDetalleSolicitud_2 = [];
        if(this.FormRecepcionSolicitud.controls.numsolicitud.value === null){
          this.listaDetalleSolicitud.forEach(x=>{
            if(x.codmei === codProdAux){
              this.listaDetalleSolicitud_2.unshift(x);
            }
          })
          this.listaDetalleSolicitud = [];
          this.listaDetalleSolicitudpaginacion = [];
          this.listaDetalleSolicitud = this.listaDetalleSolicitud_2;
          this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitudpaginacion.slice(0,20);
          this.ActivaBotonLimpiaBusca = true;
        }
      }
    }else{
      this.limpiarCodigo();
      this.loading = false;
      return;
    }
  }

  limpiarCodigo() {
    this.loading = true;

    this.FormDatosProducto.controls.codigo.reset();
    var codProdAux = '';

    this.listaDetalleSolicitud = [];
    this.listaDetalleSolicitudpaginacion = [];


    // Llenar Array Auxiliares
    this.listaDetalleSolicitud = this.listaDetalleSolicitud_aux;
    this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitudpaginacion_aux;
    this.ActivaBotonLimpiaBusca = false;

    this.loading = false;
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {​​​​​​​​
    console.log("Processing beforeunload...");
    if(this._Solicitud != undefined){
      if(this._Solicitud.bandera != 2){
        this.ValidaEstadoSolicitud(1,'destroy');
      }
    }
  }​​​​​​​​
}
