import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { environment } from '../../../environments/environment';
import { BodegasService } from '../../servicios/bodegas.service';
import { EstadoSolicitud } from '../../models/entity/EstadoSolicitud';
import { TipoRegistro } from '../../models/entity/TipoRegistro';
import { CreasolicitudesService } from '../../servicios/creasolicitudes.service';
import { Prioridades } from '../../models/entity/Prioridades';
import { PrioridadesService } from '../../servicios/prioridades.service';
import { EstadoSolicitudBodega } from '../../models/entity/EstadoSolicitudBodega';
import { EstadosolicitudbodegaService } from '../../servicios/estadosolicitudbodega.service';
import { SolicitudService } from '../../servicios/Solicitudes.service'
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Solicitud } from '../../models/entity/Solicitud';
import { DetalleSolicitud } from 'src/app/models/entity/DetalleSolicitud';
import { BusquedasolicitudesComponent } from '../busquedasolicitudes/busquedasolicitudes.component';
import { BusquedaproductosComponent } from '../busquedaproductos/busquedaproductos.component';
import { EventosSolicitudComponent } from '../eventos-solicitud/eventos-solicitud.component';
import { EventosDetallesolicitudComponent } from '../eventos-detallesolicitud/eventos-detallesolicitud.component';
import { BodegasTodas } from 'src/app/models/entity/BodegasTodas';
import { BodegasrelacionadaAccion } from 'src/app/models/entity/BodegasRelacionadas';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Articulos } from 'src/app/models/entity/mantencionarticulos';
import { InformesService } from '../../servicios/informes.service';
import { StockProducto } from 'src/app/models/entity/StockProducto';
import { Permisosusuario } from '../../permisos/permisosusuario';

declare var $: any;

@Component({
  selector: 'app-solicitudes-manuales',
  templateUrl: './solicitudes-manuales.component.html',
  styleUrls: ['./solicitudes-manuales.component.css'],
  providers: [CreasolicitudesService, DatePipe, InformesService]
})
export class SolicitudesManualesComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public modelopermisos         : Permisosusuario = new Permisosusuario();
  public FormCreaSolicitud      : FormGroup;
  public estadossolbods         : Array<EstadoSolicitudBodega> = [];
  public estadossolicitudes     : Array<EstadoSolicitud> = [];
  public tiposderegistros       : Array<TipoRegistro> = [];
  public prioridades            : Array<Prioridades> = [];
  public bodegasSolicitantes    : Array<BodegasTodas> = [];
  public bodegassuministro      : Array<BodegasrelacionadaAccion> = [];
  public varDetalleSolicitud    : Array<DetalleSolicitud> = [];
  public _Solicitud             : Solicitud;   /* Solictud de creación y modificaicíón */
  public arregloDetalleProductoSolicitudPaginacion: Array<DetalleSolicitud> = [];
  public arregloDetalleProductoSolicitud: Array<DetalleSolicitud> = [];
  public detalleEliminar: any = null;
  public locale                 = 'es';
  public bsConfig               : Partial<BsDatepickerConfig>;
  public colorTheme             = 'theme-blue';
  public usuario                = environment.privilegios.usuario;
  public servidor               = environment.URLServiciosRest.ambiente;
  public elimininaproductogrilla: boolean = false;
  public existesolicitud        : boolean = false;
  public hdgcodigo              : number;
  public esacodigo              : number;
  public cmecodigo              : number;
  public _DetalleSolicitud      : DetalleSolicitud;
  public productoselec          : Articulos;
  tipoproducto                  : number = 0;
  stockbodegasolicitante        : number = 0;
  stockbodegasuministro         : number = 0;
  grabadetallesolicitud         : DetalleSolicitud[] = [];
  private _BSModalRef           : BsModalRef;
  onClose                       : any;
  bsModalRef                    : any;
  editField                     : any;
  public grabadetalle           : DetalleSolicitud[] = [];
  public activabtnlimpiagrill   : boolean = false;
  public activabtncreasolic     : boolean = false;
  public btnimprsolicitud       : boolean = false;
  public btnevento              : boolean = false;
  public activaagregar          : boolean = false;

  constructor(
    private formBuilder             : FormBuilder,
    private EstadoSolicitudBodegaService: EstadosolicitudbodegaService,
    private PrioridadesService      : PrioridadesService,
    public _BsModalService          : BsModalService,
    public localeService            : BsLocaleService,
    public datePipe                 : DatePipe,
    public _BodegasService          : BodegasService,
    public _solicitudService        : SolicitudService,
    public _creaService             : CreasolicitudesService,
    private _imprimesolicitudService: InformesService
  ) {
    this.FormCreaSolicitud = this.formBuilder.group({
      numsolicitud: [{ value: null, disabled: true }, Validators.required],
      esticod   : [{ value: 10, disabled: false }, Validators.required],
      hdgcodigo : [{ value: null, disabled: false }, Validators.required],
      esacodigo : [{ value: null, disabled: false }, Validators.required],
      cmecodigo : [{ value: null, disabled: false }, Validators.required],
      prioridad : [{ value: 1, disabled: false }, Validators.required],
      fecha     : [new Date(), Validators.required],
      bodcodigo : [{ value: null, disabled: false }, Validators.required],
      codbodegasuministro: [{ value: null, disabled: false }, Validators.required],
    });
  }

  ngOnInit() {
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();
    this.BuscaBodegaSolicitante();

    this.setDate();

    this.PrioridadesService.list(this.usuario, this.servidor).subscribe(
      data => {
        this.prioridades = data;
      }, err => {
        console.log(err.error);
      }
    );

    this.EstadoSolicitudBodegaService.list(this.usuario, this.servidor).subscribe(
      data => {
        this.estadossolbods = data;
      }, err => {
        console.log(err.error);
      }
    );
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  BuscaBodegaSolicitante() {
    this._BodegasService.listaBodegaTodasSucursal(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor).subscribe(
      response => {
        this.bodegasSolicitantes = response;
      },
      error => {
        alert("Error al Buscar Bodegas de cargo");
      }
    );
  }

  BuscaBodegaSuministro(codigo_eve_origen: number, codbodega_solicitante: number) {
    this._BodegasService.listaBodegaRelacionadaAccion(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor, codbodega_solicitante, 1).subscribe(
      response => {
        this.bodegassuministro = response;
      },
      error => {
        alert("Error al Buscar Bodegas de Destino");
      }
    );
  }

  BuscarSolicitudes() {
    this._BSModalRef = this._BsModalService.show(BusquedasolicitudesComponent, this.setModalBusquedaSolicitud());
    this._BSModalRef.content.onClose.subscribe((response_cabecera: Solicitud) => {
      if (response_cabecera == undefined) { }
      else {

        this._solicitudService.BuscaSolicitud(response_cabecera.soliid, this.hdgcodigo,
        this.esacodigo, this.cmecodigo, 0, "", "", 0, 0, 0, this.servidor, 0, 0, 0, 0, 0, 0, "",0).subscribe(
          response => {
            this._Solicitud = response[0];
            this.activabtnlimpiagrill = true;
            this.btnimprsolicitud = true;
            this.btnevento = true;
            this.FormCreaSolicitud.get('numsolicitud').setValue(this._Solicitud.soliid);
            this.FormCreaSolicitud.get('bodcodigo').setValue(this._Solicitud.bodorigen);
            this.BuscaBodegasSuministro(this._Solicitud.bodorigen);
            this.FormCreaSolicitud.get('codbodegasuministro').setValue(this._Solicitud.boddestino);
            this.FormCreaSolicitud.get('fecha').setValue(this.datePipe.transform(this._Solicitud.fechacreacion, 'dd-MM-yyyy'));
            this.FormCreaSolicitud.get('esticod').setValue(this._Solicitud.estadosolicitud);
            this.FormCreaSolicitud.get('prioridad').setValue(this._Solicitud.prioridadsoli);
            this.existesolicitud = true;
            console.log("solicitud buscada", this._Solicitud)
            this.arregloDetalleProductoSolicitudPaginacion = [];
            this.arregloDetalleProductoSolicitud = [];

            this.arregloDetalleProductoSolicitud = this._Solicitud.solicitudesdet;
            this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0, 50);
            if (this._Solicitud.estadosolicitud === 10 || this._Solicitud.estadosolicitud == 40) {
              this.existesolicitud = true;
            } else {
              this.existesolicitud = false;
              this.activabtnlimpiagrill = false;
              this.activaagregar = true;

            }
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
        origen: 'Otros'
      }
    };
    return dtModal;
  }

   async addArticuloGrilla() {

    var respuesta:StockProducto[];
    this.stockbodegasolicitante = 0;
    this.stockbodegasuministro  = 0;

    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModalBusquedaProductos());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) { }
      else {

        this.productoselec = response;
        this.StockProducto(this.productoselec.mein);
      }
      
    });


  }

  async StockProducto(mein: number){
    var stock1 :StockProducto[]
    try {
      
      stock1=  await this._creaService.BuscaStockProd(mein, this.FormCreaSolicitud.value.bodcodigo, this.usuario, this.servidor).toPromise()
      this.stockbodegasolicitante =stock1[0].stockactual;
    }
    catch(e) {
      // this.alertSwalAlert.title = "No existe stock en bodega origen para el producto buscado";
      // this.alertSwalAlert.text = "Puede que el producto no exista en la bodega de Solicitante";
      // this.alertSwalAlert.show();
    };

    stock1 = [];
    try {
        
      stock1 =  await  this._creaService.BuscaStockProd(mein, this.FormCreaSolicitud.value.codbodegasuministro, this.usuario, this.servidor).toPromise()
      this.stockbodegasuministro = stock1[0].stockactual;

      
    }
    catch(e) {
      this.alertSwalAlert.title = "No existe stock en bodega Suministro para el producto buscado";
      this.alertSwalAlert.text = "Puede que el producto no exista en la bodega de Suministro";
      this.alertSwalAlert.show();
    };
    const DetalleMovimiento = new (DetalleSolicitud);
    DetalleMovimiento.codmei = this.productoselec.codigo;
    DetalleMovimiento.meindescri = this.productoselec.descripcion;
    DetalleMovimiento.stockorigen = this.stockbodegasolicitante;
    DetalleMovimiento.stockdestino = this.stockbodegasuministro;
    DetalleMovimiento.meinid = this.productoselec.mein;
    DetalleMovimiento.descunidadmedida = this.productoselec.desunidaddespacho;
    DetalleMovimiento.usuariomodifica = this.usuario;
    DetalleMovimiento.cantsoli = null;
    DetalleMovimiento.sodeid = 0;
    DetalleMovimiento.soliid = 0;
    DetalleMovimiento.acciond = "I";
    DetalleMovimiento.cantadespachar = 0;
    DetalleMovimiento.cantdespachada = 0;
    DetalleMovimiento.cantdevolucion = 0;
    DetalleMovimiento.pendientedespacho = 0;
    DetalleMovimiento.dias = 0;
    DetalleMovimiento.dosis = 0;
    DetalleMovimiento.formulacion = 0;
    DetalleMovimiento.marca = "I";

    this.grabadetalle.unshift(DetalleMovimiento);
    this.activabtnlimpiagrill = true;
    this.arregloDetalleProductoSolicitud.unshift(DetalleMovimiento);
    this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0,50);
    console.log("detalle grilla",this.arregloDetalleProductoSolicitud)
    console.log("num solic",this.FormCreaSolicitud.value.numsolicitud )

    if(this.existesolicitud == true){
      this.activabtncreasolic = false;
      console.log("ya existe solicitud",this.activabtncreasolic);
    }else{
      if(this.existesolicitud == false){
        this.activabtncreasolic = true;
        console.log("NO existe solicitud",this.activabtncreasolic);
      }
    }
    // if(DetalleMovimiento.soliid >0){
    //   this.activabtncreasolic = false;
    //   console.log("existe soliciut y no activa btn crea",this.activabtncreasolic)
    // }
    // else{
    //   // if(Deta.soliid == null || this._Solicitud.soliid === undefined){
    //     console.log("")
    //     this.activabtncreasolic = true;
    //   // }
      
    // }
    
    stock1=[];

  }

  setModalBusquedaProductos() {
    // console.log("bod",this.FormCreaSolicitud.value.codbodegasuministro,this.FormCreaSolicitud.value.bodcodigo)
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Productos', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        tipo_busqueda: 'Todo-Medico',
        id_Bodega: this.FormCreaSolicitud.value.codbodegasuministro
      }
    };
    return dtModal;
  }

  // setModalBusquedaProductos() {
  //   let dtModal: any = {};
  //   dtModal = {
  //     keyboard: true,
  //     backdrop: 'static',
  //     class: 'modal-dialog-centered modal-xl',
  //     initialState: {
  //       titulo: 'Búsqueda de Productos', // Parametro para de la otra pantalla
  //       hdgcodigo: this.hdgcodigo,
  //       esacodigo: this.esacodigo,
  //       cmecodigo: this.cmecodigo,
  //     }
  //   };
  //   return dtModal;
  // }

  cambio_cantidad(id: number, property: string, registro: DetalleSolicitud) {
   
    if (this.arregloDetalleProductoSolicitudPaginacion[id]["sodeid"] == 0) {
      this.arregloDetalleProductoSolicitudPaginacion[id]["acciond"] = "I";
      this.arregloDetalleProductoSolicitud[id][property] = this.arregloDetalleProductoSolicitudPaginacion[id][property];
    } else {

      this.arregloDetalleProductoSolicitudPaginacion[id]["acciond"] = "M";
      this.arregloDetalleProductoSolicitud[id][property] = this.arregloDetalleProductoSolicitudPaginacion[id][property];

    }

  }

  limpiar() {
    this.FormCreaSolicitud.reset();
    this.arregloDetalleProductoSolicitudPaginacion = [];
    this.arregloDetalleProductoSolicitud = [];
    this.FormCreaSolicitud.get('fecha').setValue(new Date());
    this.existesolicitud = false;
    this.FormCreaSolicitud.controls["esticod"].setValue(10);
    this.FormCreaSolicitud.controls["prioridad"].setValue(1);
    this.grabadetalle = [];
    this.activabtnlimpiagrill = false;
    this.activabtncreasolic = false;
    this.btnimprsolicitud = false;
    this.btnevento = false;
    this.activaagregar = false;

  }

  ConfirmaEliminaProductoDeLaGrilla(registro: DetalleSolicitud, id: number) {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirme eliminación de producto de la solicitud ?',
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

  EliminaProductoDeLaGrilla(registro: DetalleSolicitud, id: number) {
    if (registro.acciond === "I" && id >= 0 && registro.sodeid === 0) {
      // Eliminar registro nuevo la grilla
      if(this.isEliminaMed(registro)<0){
  
      }else{

        this.arregloDetalleProductoSolicitud.splice(this.isEliminaMed(registro), 1);
        this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0,50);
      }
    } else {
      // elimina uno que ya existe
      this.arregloDetalleProductoSolicitud[this.isEliminaMed(registro)].acciond = 'E';
      this.detalleEliminar = this.isEliminaMed(registro);
      this.grabadetalle = [];
      this.ModificarSolicitud("M");
    }
  }

  isEliminaMed(registro: DetalleSolicitud) {

    let indice = 0;
    for (const articulo of this.arregloDetalleProductoSolicitud) {
      if (registro.codmei === articulo.codmei) {
   
        return indice;
      }
      indice++;
    }
    return -1;
  }

  ConfirmaGenerarSolicitud() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Genera solicitud ?',
      text: "Confirmar la creación de la Solicitud",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.generarSolicitud();
      }
    })
  }

  generarSolicitud() {
    /* vienen seteadas en el ambiente */
    var fechaajuste = new Date();
    var fechaactual = this.datePipe.transform(fechaajuste, 'yyyy-MM-dd');

    this._Solicitud = new Solicitud();
    this._Solicitud.soliid = 0;
    this._Solicitud.hdgcodigo = this.hdgcodigo;
    this._Solicitud.esacodigo = this.esacodigo;
    this._Solicitud.cmecodigo = this.cmecodigo;
    this._Solicitud.cliid = 0;
    this._Solicitud.tipodocpac = 0;
    this._Solicitud.numdocpac = null;
    this._Solicitud.apepaternopac = null;
    this._Solicitud.apematernopac = null;
    this._Solicitud.nombrespac = null;
    this._Solicitud.codambito = 0;
    this._Solicitud.estid = 0;
    this._Solicitud.ctaid = 0;
    this._Solicitud.edadpac = 0;
    this._Solicitud.tipoedad = null;
    this._Solicitud.codsexo = 0;
    this._Solicitud.codservicioori = 0;
    this._Solicitud.codserviciodes = 0;
    this._Solicitud.bodorigen = this.FormCreaSolicitud.value.bodcodigo;
    this._Solicitud.boddestino = this.FormCreaSolicitud.value.codbodegasuministro;
    this._Solicitud.tipoproducto = this.tipoproducto;
    this._Solicitud.tiporeceta = null;
    this._Solicitud.numeroreceta = 0;
    this._Solicitud.tipomovim = 'C';
    this._Solicitud.tiposolicitud = 30;
    this._Solicitud.estadosolicitud = this.FormCreaSolicitud.value.esticod;
    this._Solicitud.prioridadsoli = this.FormCreaSolicitud.value.prioridad;
    this._Solicitud.tipodocprof = 0;
    this._Solicitud.numdocprof = null;
    this._Solicitud.alergias = null;
    this._Solicitud.cama = null;
    this._Solicitud.fechacreacion = fechaactual;
    this._Solicitud.usuariocreacion = this.usuario;
    this._Solicitud.fechamodifica = null;
    this._Solicitud.usuariomodifica = null;
    this._Solicitud.fechaelimina = null;
    this._Solicitud.usuarioelimina = null;
    this._Solicitud.fechacierre = null;
    this._Solicitud.usuariocierre = null;
    this._Solicitud.observaciones = null;
    this._Solicitud.ppnpaciente = 0;
    this._Solicitud.convenio = null;
    this._Solicitud.diagnostico = null;
    this._Solicitud.nombremedico = null;
    this._Solicitud.cuentanumcuenta = 0;
    this._Solicitud.bodorigendesc = null;
    this._Solicitud.boddestinodesc = null;
    this._Solicitud.usuario = this.usuario;
    this._Solicitud.servidor = this.servidor;
    this._Solicitud.accion = "I";
    this._Solicitud.origensolicitud = 30;

    this.grabadetallesolicitud = [];

    this.arregloDetalleProductoSolicitud.forEach(element => {
      var detalleSolicitud = new DetalleSolicitud;
      detalleSolicitud.sodeid = 0;
      detalleSolicitud.soliid = 0; //num solicitud
      detalleSolicitud.codmei = element.codmei;
      detalleSolicitud.meinid = element.meinid;
      detalleSolicitud.dosis = 0;
      detalleSolicitud.formulacion = 0;
      detalleSolicitud.dias = 0;
      detalleSolicitud.cantsoli = element.cantsoli; //cantidad solicitada
      detalleSolicitud.cantdespachada = 0;
      detalleSolicitud.cantdevolucion = 0;
      detalleSolicitud.estado = 1; // Solicitado 
      detalleSolicitud.observaciones = null;
      detalleSolicitud.fechamodifica = null;
      detalleSolicitud.usuariomodifica = null;
      detalleSolicitud.fechaelimina = null;
      detalleSolicitud.usuarioelimina = null;
      detalleSolicitud.viaadministracion = null;
      detalleSolicitud.meindescri = null;
      detalleSolicitud.stockorigen = this.stockbodegasolicitante;
      detalleSolicitud.stockdestino = this.stockbodegasuministro;
      detalleSolicitud.acciond = element.acciond;
      detalleSolicitud.cantadespachar = 0;
      detalleSolicitud.pendientedespacho = 0;
      detalleSolicitud.repoid = 0;
      detalleSolicitud.marca = element.marca;   // S o N      

      this.grabadetallesolicitud.push(detalleSolicitud);

    });

    this._Solicitud.solicitudesdet = this.grabadetallesolicitud;

    this._solicitudService.crearSolicitud(this._Solicitud).subscribe(
      response => {
        this.alertSwal.title = "Solicitud creada N°:".concat(response['solbodid']);
        this.alertSwal.show();

        this._solicitudService.BuscaSolicitud(response.solbodid, this.hdgcodigo, this.esacodigo, this.cmecodigo,
          null, null, null, null, null, null, this.servidor, null, null, null, null, null, null, null,0).subscribe(
            respuestasolicitud => {
              this._Solicitud = respuestasolicitud[0];


              this.FormCreaSolicitud.get('numsolicitud').setValue(this._Solicitud.soliid);
              this.FormCreaSolicitud.get('bodcodigo').setValue(this._Solicitud.bodorigen);
              this.BuscaBodegasSuministro(this._Solicitud.bodorigen);
              this.FormCreaSolicitud.get('codbodegasuministro').setValue(this._Solicitud.boddestino);
              this.FormCreaSolicitud.get('fecha').setValue(this.datePipe.transform(this._Solicitud.fechacreacion, 'dd-MM-yyyy'));
              this.FormCreaSolicitud.get('esticod').setValue(this._Solicitud.estadosolicitud);
              this.FormCreaSolicitud.get('prioridad').setValue(this._Solicitud.prioridadsoli);

              this.existesolicitud= true;
              this.activabtncreasolic = false;
              this.btnimprsolicitud = true;
              this.btnevento = true;
              this.arregloDetalleProductoSolicitudPaginacion = [];
              this.arregloDetalleProductoSolicitud = [];

              this.arregloDetalleProductoSolicitud = this._Solicitud.solicitudesdet;
              this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0,50);
            },
            error => {
              console.log("Error :", error)
            }
          );
      },
      error => {
        console.log(error);
        this.alertSwalError.title = "Error al generar solictud";
        this.alertSwalError.show();
      }
    );
  }

  ConfirmaModificarSolicitud() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Desea modificar la Solicitud ?',
      text: "Confirmar modificación de solicitud",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.detalleEliminar = null;
 
        this.  ModificarSolicitud("M");
      }
    })
  }

  ModificarSolicitud(Accion: String) {
    /* Si se modifica _Solictud ya contiene la información original */
    /* vienen seteadas en el ambiente */
    var fechaactual = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    /* Sólo se setean los valores posoble de actualizar de la cabecera */
    this._Solicitud.bodorigen = this.FormCreaSolicitud.value.bodcodigo;
    this._Solicitud.boddestino = this.FormCreaSolicitud.value.codbodegasuministro;
    this._Solicitud.estadosolicitud = this.FormCreaSolicitud.value.esticod;
    this._Solicitud.prioridadsoli = this.FormCreaSolicitud.value.prioridad;
    this._Solicitud.fechamodifica = fechaactual;
    this._Solicitud.usuariomodifica = this.usuario;
    if (Accion == 'E') {
      this._Solicitud.fechaelimina = fechaactual;
      this._Solicitud.usuarioelimina = this.usuario;
      this._Solicitud.fechacierre = fechaactual;
      this._Solicitud.usuariocierre = this.usuario;
      this._Solicitud.observaciones = "Solicitud eliminada";
      // this._Solicitud.fechamodifica = fechaactual;
      // this._Solicitud.usuariomodifica = this.usuario;
      this._Solicitud.accion = "E";
    }

    if (Accion == 'M') {
      this._Solicitud.accion = "M";
      this._Solicitud.fechamodifica = fechaactual;
      this._Solicitud.usuariomodifica = this.usuario;
    }
    this._Solicitud.usuario = this.usuario;
    this._Solicitud.servidor = this.servidor;
    /* Detalle de solicitu, solo viaja la modificada y eliminada */
    this.grabadetallesolicitud = [];

    this.arregloDetalleProductoSolicitud.forEach(element => {
      var _detalleSolicitud = new DetalleSolicitud;

      _detalleSolicitud = element;

      if (element.acciond == 'M') {
        _detalleSolicitud.codmei = element.codmei;
        _detalleSolicitud.meinid = element.meinid;
        _detalleSolicitud.cantsoli = element.cantsoli; //cantidad solicitada
        _detalleSolicitud.fechamodifica = fechaactual;
        _detalleSolicitud.usuariomodifica = this.usuario;
        _detalleSolicitud.stockorigen = this.stockbodegasolicitante;
        _detalleSolicitud.stockdestino = this.stockbodegasuministro;
        _detalleSolicitud.acciond = "M";
        _detalleSolicitud.marca = element.marca;   // S o N  
        this.grabadetallesolicitud.unshift(_detalleSolicitud); 
      }

      if (element.acciond == 'E') {
        _detalleSolicitud.observaciones = "Registro eliminado";
        // _detalleSolicitud.fechamodifica = fechaactual;
        // _detalleSolicitud.usuariomodifica = this.usuario;
        _detalleSolicitud.fechaelimina = fechaactual;
        _detalleSolicitud.usuarioelimina = this.usuario;
        _detalleSolicitud.marca = element.marca;   // S o N      
        _detalleSolicitud.acciond = "E";
        // _detalleSolicitud.marca = element.marca;   // S o N   
        this.grabadetallesolicitud.unshift(_detalleSolicitud);   
      }

      if (element.acciond == 'I') {
        _detalleSolicitud.observaciones = "Registro eliminado";
        // _detalleSolicitud.fechamodifica = fechaactual;
        // _detalleSolicitud.usuariomodifica = this.usuario;
        _detalleSolicitud.fechaelimina = fechaactual;
        _detalleSolicitud.usuarioelimina = this.usuario;
        _detalleSolicitud.marca = element.marca;   // S o N      
        _detalleSolicitud.acciond = "I";
        // _detalleSolicitud.marca = element.marca;   // S o N   
        this.grabadetallesolicitud.unshift(_detalleSolicitud);   
      }


    });

    /* ajusta parametros al registro a eliminar //@MLobos */
    //if (this.detalleEliminar !== null) {
    //  this.grabadetallesolicitud[this.detalleEliminar].acciond = 'E';
    //  this.grabadetallesolicitud[this.detalleEliminar].observaciones = "Registro eliminado";
    //  this.grabadetallesolicitud[this.detalleEliminar].usuarioelimina = 'E';
   // }
    
    /* cambia a I los registros que coinciden con los guardados en array grabadetalle */
  //  if (this.grabadetalle.length >= 0) {
  //   this.grabadetalle.forEach(x => {
  //      let indx = this.grabadetallesolicitud.findIndex(i => i.codmei === x.codmei);
  //      this.grabadetallesolicitud[indx].acciond = 'I';
  //    });
  //  }

    this._Solicitud.solicitudesdet = this.grabadetallesolicitud;
    console.log("Solicitud modificada",this._Solicitud);
    this._solicitudService.ModificaSolicitud(this._Solicitud).subscribe(
      response => {
        this.alertSwal.title = "Solicitud "+ this._Solicitud.soliid +" modificada";
        this.alertSwal.show();

        this.FormCreaSolicitud.get('numsolicitud').setValue(response.solbodid);

        /* Recarga la solictud para verificar que guardó la información en forma correcta */
        this._solicitudService.BuscaSolicitud(response.solbodid, this.hdgcodigo, this.esacodigo, this.cmecodigo,
          null, null, null, null, null, null, this.servidor, null, null, null, null, null, null, null,0).subscribe(
            respuestasolicitud => {
              this._Solicitud = respuestasolicitud[0];

              this.activabtncreasolic = false;
              this.btnevento = true;
              this.FormCreaSolicitud.get('numsolicitud').setValue(this._Solicitud.soliid);
              this.FormCreaSolicitud.get('bodcodigo').setValue(this._Solicitud.bodorigen);
              this.BuscaBodegasSuministro(this._Solicitud.bodorigen);
              this.FormCreaSolicitud.get('codbodegasuministro').setValue(this._Solicitud.boddestino);
              this.FormCreaSolicitud.get('fecha').setValue(this.datePipe.transform(this._Solicitud.fechacreacion, 'dd-MM-yyyy'));
              this.FormCreaSolicitud.get('esticod').setValue(this._Solicitud.estadosolicitud);
              this.FormCreaSolicitud.get('prioridad').setValue(this._Solicitud.prioridadsoli);

              this.arregloDetalleProductoSolicitudPaginacion = [];
              this.arregloDetalleProductoSolicitud = [];
              this.arregloDetalleProductoSolicitud = this._Solicitud.solicitudesdet;
              this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0,50);
              this.grabadetalle = [];
              if(this._Solicitud.estadosolicitud === 10 || this._Solicitud.estadosolicitud ==40){
                this.existesolicitud =true;
              }else{
                this.existesolicitud = false;
              }
            },
            error => {
              console.log("Error :", error)
            }
          );
      },
      error => {
        console.log(error);
        this.alertSwalError.title = "Error al modificar solictud";
        this.alertSwalError.show();
      }
    );
  }

  ConfirmaEliminarSolicitud() {
    // sE CONFIRMA Eliminar Solicitud    
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Desea Eliminar la Solicitud ?',
      text: "Confirmar eliminación de solicitud",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.ModificarSolicitud("E");
      }
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

  BuscaBodegasSuministro(codigobodegasolicitante: number) {
    var servidor = environment.URLServiciosRest.ambiente;
    var usuario = environment.privilegios.usuario;
    this.bodegassuministro = [];

    this._BodegasService.listaBodegaRelacionadaAccion(this.hdgcodigo, this.esacodigo, this.cmecodigo, usuario, servidor, codigobodegasolicitante,1).subscribe(
      data => {
        this.bodegassuministro = data;
      }, err => {
        console.log(err.error);
      }
    );
  }

  setModalMensajeExitoEliminar(numerotransaccion: number) {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-m',
      initialState: {
        titulo: 'Eliminar Solicitud', // Parametro para de la otra pantalla
        mensaje: 'Solicitud Eliminada Exitosamente',
        informacion: 'La solicitud eliminada es:',
        mostrarnumero: numerotransaccion,
        estado: 'CANCELADO',
      }
    };
    return dtModal;
  }

  setModalMensajeErrorEliminar() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-m',
      initialState: {
        titulo: 'Eliminar Solicitud', // Parametro para de la otra pantalla
        mensaje: 'Solicitud no pudo ser eliminada',
        informacion: 'Intente nuevamente',
        estado: 'CANCELADO',
      }
    };
    return dtModal;
  }


  /* Función búsqueda con paginación */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(startItem, endItem);
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  onImprimir() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Solicitud ?',
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
    this._imprimesolicitudService.RPTImprimeSolicitudBodega(this.servidor, this.hdgcodigo, this.esacodigo,
      this.cmecodigo, "pdf", this._Solicitud.soliid).subscribe(
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

  limpiarGrilla() {
    if (this.arregloDetalleProductoSolicitud.length){
      this.alertSwalAlert.title = '¿Borrar todos los elementos en la tabla?';
      this.alertSwalAlert.show().then(resp => {
        if (resp.value){
          this.arregloDetalleProductoSolicitud = [];
          this.arregloDetalleProductoSolicitudPaginacion = [];
          // this.grillaMedicamentos = [];
        }
        // this.logicaVacios();
      }
      );
    }
  }
}