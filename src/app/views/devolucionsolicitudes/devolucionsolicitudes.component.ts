import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { environment } from '../../../environments/environment';
import { BusquedasolicitudesComponent } from '../busquedasolicitudes/busquedasolicitudes.component';
import { DetalleSolicitud } from 'src/app/models/entity/DetalleSolicitud';
import { DevolucionDetalleSolicitud } from 'src/app/models/entity/DevolucionDetalleSolicitud';
import { SolicitudService } from 'src/app/servicios/Solicitudes.service';
import { EventosDetallesolicitudComponent } from '../eventos-detallesolicitud/eventos-detallesolicitud.component';
import { Solicitud } from 'src/app/models/entity/Solicitud';
import { EventosSolicitudComponent } from '../eventos-solicitud/eventos-solicitud.component';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DespachoDetalleSolicitud } from 'src/app/models/entity/DespachoDetalleSolicitud';
import { Detallelote } from '../../models/entity/Detallelote';
import { ProductoRecepcionBodega } from 'src/app/models/entity/ProductoRecepcionBodega';
import { ParamDetDevolBodega } from '../../models/entity/ParamDetDevolBodega';
import { ParamDevolBodega } from '../../models/entity/ParamDevolBodega';
import { InformesService } from '../../servicios/informes.service';
import { Permisosusuario } from '../../permisos/permisosusuario';

@Component({
  selector: 'app-devolucionsolicitudes',
  templateUrl: './devolucionsolicitudes.component.html',
  styleUrls: ['./devolucionsolicitudes.component.css'],
  providers: [ InformesService]
})
export class DevolucionsolicitudesComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  @ViewChild('alertSwalGrilla', { static: false }) alertSwalGrilla: SwalComponent;

  public modelopermisos                   : Permisosusuario = new Permisosusuario();
  public FormDevolucionSolicitud          : FormGroup;
  public FormDevolucionDetalle            : FormGroup;
  public arreegloDetalleSolicitud         : Array<DetalleSolicitud> = [];
  public arreegloDetalleSolicitudpaginacion: Array<DetalleSolicitud> = [];
  public listadetallesolicitud            : Array<DetalleSolicitud> = [];
  public DevolucionBodega                 : ParamDevolBodega;
  public arregloDetalleDevolucionSolicitud: Array<DevolucionDetalleSolicitud> = [];
  public ListaDevolucionDetalleSolicitud  : Array<DevolucionDetalleSolicitud> = [];
  public paramdevolucion                  : DespachoDetalleSolicitud[]=[];
  public varDevolucionDetalleSolicitud    : DevolucionDetalleSolicitud;
  public detallessolicitudes              : Array<DespachoDetalleSolicitud> = [];  
  public detallessolicitudespaginacion    : Array<DespachoDetalleSolicitud> = []; 
  public productosrecepcionadospaginacion : Array<ProductoRecepcionBodega> =[];
  public productosrecepcionados           : Array<ParamDetDevolBodega> =[];
  public arrParamDetDevolBodega           : Array<ParamDetDevolBodega> = [];
  public solicitudseleccion               : Array<ProductoRecepcionBodega> = [];
  public detalleslotes                    : Detallelote[]=[];
  public hdgcodigo                        : number;
  public esacodigo                        : number;
  public cmecodigo                        : number;
  public mfdeid                           : number;
  public solicitud                        : number;
  public numsolic                         : boolean = false;
  public existsolicitud                   : boolean = false;
  public validadato                       : boolean = false;
  public servidor                         = environment.URLServiciosRest.ambiente;
  public usuario                          = environment.privilegios.usuario;
  public _DetalleSolicitud                : DetalleSolicitud;
  public _Solicitud                       : Solicitud;
  public _Solicitud2                      : Solicitud[];
  public fechavto                         : string;
  public fechavto1                        : string;
  public lote                             : string;
  public locale                           = 'es';
  public bsConfig                         : Partial<BsDatepickerConfig>;
  public colorTheme                       = 'theme-blue';
  private _BSModalRef                     : BsModalRef;
  public loading                          : boolean= false;
  public activabtnimprime                 : boolean = false;

  cantpendiente           : number = 10;
  retornosolicitud        : any;
  retornosolicituddetalle : any;
  onClose                 : any;
  bsModalRef              : any;
  editField               : any;

  constructor(
    private formBuilder           : FormBuilder,
    public _BsModalService        : BsModalService,
    public datePipe               : DatePipe,
    public localeService          : BsLocaleService,
    public _SolicitudService      : SolicitudService,
    public _buscasolicitudService : SolicitudService,
    private _imprimesolicitudService  : InformesService

  ) {

    this.FormDevolucionSolicitud = this.formBuilder.group({
      numsolicitud  : [{ value: null, disabled: true }, Validators.required],
      esticod       : [{ value: null, disabled: true }, Validators.required],
      hdgcodigo     : [{ value: null, disabled: false }, Validators.required],
      esacodigo     : [{ value: null, disabled: false }, Validators.required],
      cmecodigo     : [{ value: null, disabled: false }, Validators.required],
      prioridad     : [{ value: null, disabled: true }, Validators.required],
      fechamostrar  : [{ value: new Date(), disabled: true}, Validators.required],
      bodorigen     : [{ value: null, disabled: true }, Validators.required],
      boddestino    : [{ value: null, disabled: true }, Validators.required]
    });

    this.FormDevolucionDetalle = this.formBuilder.group({
      codigo  : [{ value: null, disabled: false }, Validators.required],
      
    });
  }

  ngOnInit() {
    this.setDate();
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();

  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  
  BuscarSolicitudes() {
    this.detallessolicitudespaginacion = [];
    this.detallessolicitudes = [];
    this._BSModalRef = this._BsModalService.show(BusquedasolicitudesComponent, this.setModalBusquedaSolicitud());
    this._BSModalRef.content.onClose.subscribe((RetornoSolicitudes: Solicitud) => {
      if (RetornoSolicitudes == undefined) { }
      else {

        
             this._SolicitudService.BuscaSolicitud(RetornoSolicitudes.soliid, this.hdgcodigo,
             this.esacodigo, this.cmecodigo, 0,"","", 0,0,0,this.servidor, 0,0,0,0,0,0,"",0).subscribe(
             response => {
                          this._Solicitud = response[0];
                          if (this._Solicitud.soliid > 0) {
                            this.numsolic = true;
                          }
                        
                          this.existsolicitud = true;
                          var fechacreacion;
                          this.FormDevolucionSolicitud.get('numsolicitud').setValue(this._Solicitud.soliid);
                          this.FormDevolucionSolicitud.get('boddestino').setValue(this._Solicitud.boddestinodesc);
                          this.FormDevolucionSolicitud.get('bodorigen').setValue(this._Solicitud.bodorigendesc);
                          fechacreacion= this.datePipe.transform(this._Solicitud.fechacreacion, 'dd-MM-yyyy');
                          
                          this.FormDevolucionSolicitud.get('fechamostrar').setValue(fechacreacion);
                          this.FormDevolucionSolicitud.get('esticod').setValue(this._Solicitud.estadosolicitudde);
                          this.FormDevolucionSolicitud.get('prioridad').setValue(this._Solicitud.desprioridadsoli);
                          this.solicitud= this._Solicitud.soliid;
                          this.arreegloDetalleSolicitud = response[0].solicitudesdet;
                          this.arreegloDetalleSolicitudpaginacion = this.arreegloDetalleSolicitud.slice(0, 20);
             });
      }
    });
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
        filtrodenegocio:"POR DEVOLVER",
        origen: 'Otros'
      }
    };
    return dtModal;
  }

  BuscaproductoaDevolver(productos:any){
    // console.log("Valida datps ", productos,this.validadato)
    const resultado = this.detallessolicitudes.find( registro => registro.codmei === productos.trim() );
      if  ( resultado != undefined )
      {
        this.alertSwalError.title = "Código Repetido";
        this.alertSwalError.show();
        return
      }




    this.arreegloDetalleSolicitud.forEach(element => {        
      
      if (element.codmei.trim() == productos.trim()) {
        this.validadato= true;
        // console.log("codigo element",element,"dato que llega",productos);
      }
  
      // se valida código epetidos dentro del arreglo
      
     

    });
    if(this.validadato == false){
      // console.log("No existe dato");
      this.FormDevolucionDetalle.reset();
      this.alertSwalError.title = "El valor del Código Ingresado No pertenece a la Solicitud";
      this.alertSwalError.show();

    }

    this.productosrecepcionados=[];
    this._SolicitudService.BuscaProductoRecepcionBodega(this.hdgcodigo,this.esacodigo,this.cmecodigo,
      this.servidor,this.solicitud,this.FormDevolucionDetalle.value.codigo,
      this.lote,this.fechavto).subscribe(
      response => {
        // if(response.length == 0){
        //   this.alertSwalError.title = "El Código No tiene Datos para devolver";
        //   this.alertSwalError.show();
        // }
        if(response.length > 1){
          this.alertSwalGrilla.reverseButtons = true;
          this.alertSwalGrilla.title = 'Seleccione Producto a Devolver';
          this.alertSwalGrilla.show();
          this.productosrecepcionados= response;
          this.productosrecepcionadospaginacion = this.productosrecepcionados.slice(0,20)

        }else{
          if(response.length == 1){
            this.solicitudseleccion=[];
            // console.log("debe cargar el dato en la grilla");
            this.solicitudseleccion=response;
            // console.log("Dato a llenar a la grilla con el producto o lete que venia", this.solicitudseleccion);
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
    this.FormDevolucionDetalle.reset();
    
  }

  onCheck(event: any, productorecepcionado: ProductoRecepcionBodega) {
    this.solicitudseleccion=[];
    if (event.target.checked) {
      if (this.inArray( productorecepcionado) < 0) {
        this.solicitudseleccion.push(productorecepcionado);
      } else { 
          // if(this.inArray(productorecepcionado) ==0)// && productorecepcionado.cantdevuelta< productorecepcionado.cantrecepcionada)
          // {
          //   console.log("Existe",productorecepcionado.cantdevuelta, productorecepcionado.cantrecepcionada)
          //   this.solicitudseleccion.push(productorecepcionado);
          //   console.log("agregar d nuevo", this.solicitudseleccion);
          // }
          // else{
          return;//}
      }
    } else {
      
      this.solicitudseleccion.splice(this.inArray( productorecepcionado), 1);
    }
  }
  onConfirm() {
    this.arreegloDetalleSolicitudpaginacion.forEach(element =>{
     
      if(element.sodeid==this.solicitudseleccion[0].sodeid){
        var temporal = new DespachoDetalleSolicitud;
        temporal.codmei         = element.codmei;
        temporal.meindescri     = element.meindescri;
        temporal.cantrecepcionado= element.cantrecepcionado;
        temporal.cantsoli       = element.cantsoli;
        temporal.cantdespachada = element.cantdespachada;
        temporal.cantdevolucion = element.cantdevolucion;
        temporal.sodeid         = element.sodeid;       
        this.solicitudseleccion.forEach(datos =>{          
          temporal.lote = datos.lote;
          temporal.fechavto     = datos.fechavto;
          temporal.cantidadadevolver= (datos.cantrecepcionada-datos.cantdevuelta);
          temporal.mfdeid         = datos.mfdeid;
          temporal.cantrecepcionada= datos.cantrecepcionada;
          temporal.cantdevuelta   = datos.cantdevuelta;
         
        })

        if (temporal.cantidadadevolver>0){
          this.detallessolicitudes.unshift(temporal);
        } else {
          
          this.alertSwalError.title="Producto no tiene cantidad suficiente para devolver";
          this.alertSwalError.text = "Error"  ;
          this.alertSwalError.show(); 
          return
        }
       

      }
    });
    
    this.detallessolicitudespaginacion = this.detallessolicitudes.slice(0,20);
    this.FormDevolucionDetalle.reset(); this.detalleslotes=[];
    this.productosrecepcionadospaginacion=[]
    this.productosrecepcionados=[]
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

  validacantidadgrilla(id: number,despacho: DetalleSolicitud){
    var idg =0;
    
    if(despacho.sodeid>0){
      if(this.IdgrillaDevolucion(despacho)>=0){
        idg = this.IdgrillaDevolucion(despacho)
        
        if(this.detallessolicitudes[idg].cantidadadevolver > this.detallessolicitudespaginacion[idg].cantrecepcionado- this.detallessolicitudespaginacion[idg].cantdevolucion ){
          
          this.alertSwalAlert.text = "La cantidad a devolver debe ser menor o igual a la cantidad Recepcionada";
          this.alertSwalAlert.show();
          // this.listaDetalleDespacho[idg].cantidadarecepcionar = this.listaDetalleDespacho[idg].cantdespachada- this.listaDetalleDespacho[idg].cantrecepcionada;
          this.detallessolicitudes[idg].cantidadadevolver = this.detallessolicitudespaginacion[idg].cantrecepcionado   - this.detallessolicitudespaginacion[idg].cantdevolucion


        }else{
          if(this.detallessolicitudes[idg].cantidadadevolver <=0){
            this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
            this.alertSwalAlert.show();
            this.detallessolicitudes[idg].cantidadadevolver = this.detallessolicitudespaginacion[idg].cantrecepcionado   - this.detallessolicitudespaginacion[idg].cantdevolucion

          }else{
            if(despacho.cantidadadevolver < despacho.cantrecepcionado- despacho.cantdevolucion || despacho.cantidadarecepcionar >0){
              
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

  /* Confirmar guardado de movimiento previamente */
  ConfirmarEnviarDevolucion(datos: any) {

    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Devolver Productos ?',
      text: "Confirmar la devolución de Productos",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.DevolucionSolictud(this.detallessolicitudes);
      }
    })
  }
  
  /* Guardar movimimientos */
  DevolucionSolictud(datos: any) {
    this.paramdevolucion=[];
    this.detallessolicitudes.forEach(element => { 
      var temporal = new ParamDetDevolBodega  // new DespachoDetalleSolicitud
      temporal.soliid            = this.solicitud;
      temporal.sodeid            = element.sodeid;
      temporal.cantsoli          = element.cantsoli;
      temporal.cantdespachada    = element.cantrecepcionada;
      temporal.cantdevolucion    = element.cantdevolucion;
      temporal.cantrecepcionado  = element.cantrecepcionado;
      temporal.mfdeid            = element.mfdeid;
      temporal.cantrecepcionada  = element.cantrecepcionada;
      temporal.cantdevuelta      = element.cantdevuelta;
      temporal.cantidadadevolver = element.cantidadadevolver;
      temporal.lote              = element.lote;
      temporal.fechavto          = element.fechavto;
      this.paramdevolucion.push(temporal);
    });
    
    this.DevolucionBodega = new (ParamDevolBodega);
    this.DevolucionBodega.hdgcodigo = this.hdgcodigo;
    this.DevolucionBodega.esacodigo = this.esacodigo;
    this.DevolucionBodega.cmecodigo = this.cmecodigo;
    this.DevolucionBodega.servidor = this.servidor;
    this.DevolucionBodega.usuariodespacha = this.usuario;
    
    this.DevolucionBodega.paramdetdevolbodega = this.paramdevolucion;
    try {
      this._SolicitudService.DevolucionSolicitud(this.DevolucionBodega).subscribe(
        response => {
          //if (response.respuesta == 'OK') {
            
            this.alertSwal.title = "Devolución exitosa";
            this.alertSwal.show();
            this.detallessolicitudespaginacion =[];
            this.detallessolicitudes=[];
            this._buscasolicitudService.BuscaSolicitud(this.solicitud, this.hdgcodigo, this.esacodigo, this.cmecodigo, null, null, null, null, null, null, this.servidor, 0, 0, 0, 0, 0, 0, "",0).subscribe(
              response => {
                
                var fechacreacion;
                this.FormDevolucionSolicitud.get('numsolicitud').setValue(response[0].soliid);
                this.FormDevolucionSolicitud.get('boddestino').setValue(response[0].boddestinodesc);
                this.FormDevolucionSolicitud.get('bodorigen').setValue(response[0].bodorigendesc);
                fechacreacion= this.datePipe.transform(response[0].fechacreacion, 'dd-MM-yyyy');
                this.FormDevolucionSolicitud.get('fechamostrar').setValue(fechacreacion);
                this.FormDevolucionSolicitud.get('esticod').setValue(response[0].estadosolicitudde);
                this.FormDevolucionSolicitud.get('prioridad').setValue(response[0].desprioridadsoli);
                this.activabtnimprime = true;
                this.numsolic = false;
                this.arreegloDetalleSolicitud= response[0].solicitudesdet;
                this.arreegloDetalleSolicitudpaginacion = this.arreegloDetalleSolicitud.slice(0,20);
              },
              error => {
                console.log(error);
                this.alertSwalError.title="Error al Buscar la Solicitud, puede que no exista";
                this.alertSwalError.text = error;
                this.alertSwalError.show();
              }
            ); 
         // }
         this.productosrecepcionados=[]; this.productosrecepcionadospaginacion=[];
         this.solicitudseleccion = [];
          this.detallessolicitudes=[];
        },
        error => {
          console.log(error);
          this.alertSwalError.title="Error al Devolver la Solicitud";
          this.alertSwalError.text = error;
          this.alertSwalError.show(); 
        }        
      );
    } 
    catch (err) {
      alert("Error : " + err)
    }
  }

  Limpiar() {
    this.FormDevolucionSolicitud.reset();
    this.FormDevolucionDetalle.reset();
    this.detallessolicitudespaginacion  = [];
    this.detallessolicitudes            = [];
    this.arreegloDetalleSolicitudpaginacion=[];
    this.arreegloDetalleSolicitud       = [];
    this.paramdevolucion                = [];
    this.numsolic                       = false;
    this._Solicitud                     = null;
    this.existsolicitud                 = false;
    this.validadato                     = false;
    this.activabtnimprime               = false;
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
  
  updateList(id: number, property: string, event: any) {
    var editField = event.target.textContent;
    if (property == 'cantidadadevolver') {
      if (this.detallessolicitudes[id].cantdespachada - this.detallessolicitudes[id].cantdevolucion >= parseInt(editField)) {
        this.detallessolicitudespaginacion[id][property] = parseInt(editField);
        this.detallessolicitudes[id][property] = this.detallessolicitudespaginacion[id][property];
       
      } else { console.log("entra al else")

      }
    }
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;

  }

  /* Función búsqueda con paginación */

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.arreegloDetalleSolicitudpaginacion = this.arreegloDetalleSolicitud.slice(startItem, endItem);
  }

  pageChangedDespacho(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.detallessolicitudespaginacion = this.detallessolicitudes.slice(startItem, endItem);
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

  eventosSolicitud() {

    // sE CONFIRMA Eliminar Solicitud
    this._BSModalRef = this._BsModalService.show(EventosSolicitudComponent, this.setModalEventoSolicitud());
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
      title: '¿Desea Imprimir Devolución De Solicitud ?',
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

    this._imprimesolicitudService.RPTImprimeDevolucionSolicitudBodega(this.servidor,this.hdgcodigo,this.esacodigo, 
    this.cmecodigo,"pdf",this._Solicitud.soliid).subscribe(
      response => {
        window.open(response[0].url, "", "", true);
        // this.alertSwal.title = "Reporte Impreso Correctamente";
        // this.alertSwal.show();
      },
      error => {
        console.log(error);
        this.alertSwalError.title = "Error al Imprimir Devolución Solicitud";
        this.alertSwalError.show();
        this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
        })
      }
    );
  }


  ActivaBotonDevolver()
  {
     if (this.detallessolicitudespaginacion.length >0    ) {
      return true
     } else {
      return false
     }        
  }

  
  ActivaBotonImprimir()
  {
    let cantidad_devuelta =0;


    this.arreegloDetalleSolicitudpaginacion.forEach(element => {
      cantidad_devuelta = cantidad_devuelta + element.cantdevolucion
     });

     if (cantidad_devuelta >0) {
      return true
     } else {
      return false
     }
     
    
  }

  ConfirmaEliminaProductoDeLaGrilla(registro: DespachoDetalleSolicitud, id: number) {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirme eliminación de producto de la devolución ?',
      text: "Confirmar la eliminación del producto",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.EliminaProductoDeLaGrilla(registro, id);
      }
    })
  }


  
  EliminaProductoDeLaGrilla(registro: DespachoDetalleSolicitud, id: number) {


        this.detallessolicitudes.splice(id, 1);
        this.detallessolicitudespaginacion = this.detallessolicitudes.slice(0,20);
  }


}