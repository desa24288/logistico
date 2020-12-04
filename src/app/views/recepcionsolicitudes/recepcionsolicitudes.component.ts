import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { environment } from '../../../environments/environment';
import { SolicitudService } from 'src/app/servicios/Solicitudes.service';
import { BodegaCargo } from '../../models/entity/BodegaCargo';
import { BodegaDestino } from '../../models/entity/BodegaDestino';
import { BodegasService } from '../../servicios/bodegas.service';
import { RecepcionsolicitudesService } from '../../servicios/recepcioinsolicitudes.service';
import { BusquedasolicitudesComponent } from '../busquedasolicitudes/busquedasolicitudes.component';
import { DetalleSolicitud } from 'src/app/models/entity/DetalleSolicitud';
import { DespachoDetalleSolicitud } from 'src/app/models/entity/DespachoDetalleSolicitud';
import { EventosSolicitudComponent } from '../eventos-solicitud/eventos-solicitud.component';
import { EventosDetallesolicitudComponent } from '../eventos-detallesolicitud/eventos-detallesolicitud.component';
import { Solicitud } from 'src/app/models/entity/Solicitud';
import { ParamDetDevolBodega } from '../../models/entity/ParamDetDevolBodega';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Detallelote } from '../../models/entity/Detallelote';
import { ProductoRecepcionBodega } from 'src/app/models/entity/ProductoRecepcionBodega';
import { InformesService } from '../../servicios/informes.service';
import { ParamDevolBodega } from '../../models/entity/ParamDevolBodega';
import { element } from 'protractor';
import { Router, ActivatedRoute } from '@angular/router';
import { Permisosusuario } from '../../permisos/permisosusuario';

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
  public listaDetalleDespachopaginacion : Array<DespachoDetalleSolicitud> = [];  
  public listaDetalleDespacho           : Array<DespachoDetalleSolicitud> = []; 
  public productosrecepcionadospaginacion: Array<ParamDetDevolBodega> =[];
  public productosrecepcionados         : Array<ParamDetDevolBodega> =[];
  public solicitudseleccion             : Array<ProductoRecepcionBodega> = [];
  
  
  paramrecepcion                        : DespachoDetalleSolicitud[]=[];

  public detallessolicitudes            : Array<DespachoDetalleSolicitud> = [];  
  public detallessolicitudespaginacion  : Array<DespachoDetalleSolicitud> = []; 
  public _Solicitud              : Solicitud;
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
      codigoproducto: [{ value: null, disabled: false }, Validators.required]
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


  CargaSolicitud(ID_Solicitud:number) {

    this._buscasolicitudService.BuscaSolicitud(ID_Solicitud, this.hdgcodigo, this.esacodigo, this.cmecodigo, null, null, null, null, null, null, this.servidor, 0, 0, 0, 0, 0, 0, "",0).subscribe(
      Response => {

        this._Solicitud = Response[0];
    
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
            }
            
                      
            // this.solicitudseleccion.unshift(element)
            
            // console.log("grilla2",this.listaDetalleDespacho,"this.solicituseleccion",this.solicitudseleccion)
          }
          // if(element.detallelote.length <=1){
          //   element.cantidadarecepcionar =element.cantdespachada;
          //   this.listaDetalleDespacho.unshift(element);
          //   this.solicitudseleccion.unshift(element)
          //   this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice(0,8);
          // }
        })
        this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(0, 20);
      })


  }
  
  
  BuscarSolicitudes() {
    this.listaDetalleDespacho =[];
    this.listaDetalleDespachopaginacion =[];
    this._BSModalRef = this._BsModalService.show(BusquedasolicitudesComponent, this.setModalBusquedaSolicitud());
    this._BSModalRef.content.onClose.subscribe((RetornoSolicitudes: Solicitud) => {
      if (RetornoSolicitudes == undefined) { }
      else {
        
              this._SolicitudService.BuscaSolicitud(RetornoSolicitudes.soliid, this.hdgcodigo,
                this.esacodigo, this.cmecodigo, 0,"","", 0,0,0,this.servidor, 0,0,0,0,0,0,"",0).subscribe(
                response => {
                        this._Solicitud = response[0];

                        this.FormRecepcionSolicitud.get('numsolicitud').setValue(this._Solicitud.soliid);
                        if(this._Solicitud.soliid >0){
                          // this.numsolic =true;
                          this.bodorigen = this._Solicitud.bodorigen;
                          this.boddestino = this._Solicitud.boddestino;
                          this.codservicioori = this._Solicitud.codservicioori;
                        }
                        this.FormRecepcionSolicitud.get('boddestino').setValue(this._Solicitud.boddestinodesc);
                        this.FormRecepcionSolicitud.get('bodorigen').setValue(this._Solicitud.bodorigendesc);
                        this.FormRecepcionSolicitud.get('fechamostrar').setValue(new Date(this._Solicitud.fechacreacion));
                        this.FormRecepcionSolicitud.get('estadosolicitudde').setValue(this._Solicitud.estadosolicitudde);
                        this.FormRecepcionSolicitud.get('prioridad').setValue(this._Solicitud.desprioridadsoli);

                        this.detallesolicitud = this._Solicitud.solicitudesdet;
                        
                        this.detallesolicitud.forEach(element=>{
                          element.backgroundcolor =(element.tienelote == "N")?'gris':'amarillo';
                          if(element.tienelote == "N"){

                            if((element.cantdespachada-element.cantrecepcionado)>0){
                              this.numsolic = true;
                              element.cantidadarecepcionar = element.cantdespachada- element.cantrecepcionado;
                              this.listaDetalleDespacho.unshift(element);
                              this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice(0,20);
                            }
                            
                                      
                            // this.solicitudseleccion.unshift(element)
                            
                            // console.log("grilla2",this.listaDetalleDespacho,"this.solicituseleccion",this.solicitudseleccion)
                          }
                          // if(element.detallelote.length <=1){
                          //   element.cantidadarecepcionar =element.cantdespachada;
                          //   this.listaDetalleDespacho.unshift(element);
                          //   this.solicitudseleccion.unshift(element)
                          //   this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice(0,8);
                          // }
                        })
                        this.listaDetalleSolicitud = response[0].solicitudesdet;
                        this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(0, 20);
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
        this.bodegascargo = response;
      },
      error => {
        console.log(error);
        alert("Error al Buscar Bodegas de cargo");
      }
    );
  }

  BuscaBodegaDestino() {
    this._BodegasService.listaBodegaDestinoSucursal(this.hdgcodigo,this.esacodigo,this.cmecodigo,this.usuario,this.servidor).subscribe(
      response => {
        this.bodegasdestino = response;
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

  BuscaproductoaRecepcionar(productos:any){
    console.log("prod ",productos)
    this.listaDetalleSolicitud.forEach(element => {      

      if (element.codmei.trim() == productos.codigoproducto.trim()) {
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
      this.servidor,this._Solicitud.soliid,this.FormRecepcionDetalle.value.codigoproducto,
      this.lote,this.fechavto).subscribe(
      response => {
        // if(response.length == 0){
        //   this.alertSwalError.title = "El Código No tiene Datos para recepcionar";
        //   this.alertSwalError.show();
        // }
        console.log(response)
        if(response.length >1){
          this.alertSwalGrilla.reverseButtons = true;
          this.alertSwalGrilla.title = 'Seleccione Producto a Recepcionar';
          this.alertSwalGrilla.show();
          this.productosrecepcionados= response;
          console.log("producto a recepcionar",this.productosrecepcionados)
          this.productosrecepcionadospaginacion = this.productosrecepcionados.slice(0,20);
        }else{
          if(response.length==1){
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
    this.FormRecepcionDetalle.reset();
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
    // this.solicitudseleccion=[];
    if (event.target.checked) {
     
      // if (this.inArray( productorecepcionado) < 0) {
  
        this.solicitudseleccion.unshift(productorecepcionado);
     
      // } else { 
        
          
          // return;
      // }
    } else {
    
      this.solicitudseleccion.splice(this.inArray( productorecepcionado), 1);
    }
  }



  onConfirm() {
   
    this.solicitudseleccion.forEach(element =>{
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
    })
    
    this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice(0,20);
    this.numsolic = true;
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
          if(this.listaDetalleDespacho[idg].cantidadarecepcionar <0){
            this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
            this.alertSwalAlert.show();
          }else{
            if(despacho.cantidadarecepcionar < despacho.cantdespachada- despacho.cantrecepcionada || despacho.cantidadarecepcionar >0){
              
            }
          }        

        }
      }
    }

    // this.listaDetalleSolicitud.forEach(element => {
    //   console.log("busca en el detalle de la solicitud",element.cantidadarecepcionar,element.cantrecepcionado)
    //   // if (element.codmei.trim() == datoingresado.codigoproducto.trim()) {
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
    //   this.servidor,this._Solicitud.soliid,this.FormRecepcionDetalle.value.codigoproducto,
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
        this.alertSwal.title = "Solicitud Recepcionda Correctamente".concat();
        this.alertSwal.show();
        this._buscasolicitudService.BuscaSolicitud(this._Solicitud.soliid, this.hdgcodigo, 
        this.esacodigo,this.cmecodigo, null, null, null, null, null, null, this.servidor,0,0,0,0,0,0,"",0).subscribe(
          response => {
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
          },
          error => {
            console.log(error);
            this.alertSwalError.title="Error al Buscar la Solicitud, puede que no exista";
            this.alertSwalError.text = error;
            this.alertSwalError.show();
          }
        )        
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
        this.alertSwal.title = "Solicitud Recepcionda Correctamente".concat();
        this.alertSwal.show();
        this._buscasolicitudService.BuscaSolicitud(this._Solicitud.soliid, this.hdgcodigo, 
        this.esacodigo,this.cmecodigo, null, null, null, null, null, null, this.servidor,0,0,0,0,0,0,"",0).subscribe(
          response => {
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
            this.numsolic= false;
            this.activabtnevento = true;
          },
          error => {
            console.log(error);
            this.alertSwalError.title="Error al Buscar la Solicitud, puede que no exista";
            this.alertSwalError.text = error;
            this.alertSwalError.show();
          }
        )        
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

    this._imprimesolicitudService.RPTImprimeSolicitudRecepcionDespBodega(this.servidor,this.hdgcodigo,
    this.esacodigo, this.cmecodigo,"pdf",this._Solicitud.soliid).subscribe(
      response => {

        window.open(response[0].url, "", "", true);
        // this.alertSwal.title = "Reporte Impreso Correctamente";
        // this.alertSwal.show();
      },
      error => {
        console.log(error);
        this.alertSwalError.title = "Error al Imprimir Listado";
        this.alertSwalError.show();
        this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
        })
      }
    );
  }

  salir(){

    
    this.route.paramMap.subscribe(param=>{
      if (param.has("id_solicitud")) {
        this.router.navigate(['monitorejecutivo']);
      } else {
        this.router.navigate(['home']);
      }
  })
  }


}