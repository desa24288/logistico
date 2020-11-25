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
import { BusquedaproductosService } from 'src/app/servicios/busquedaproductos.service';
import { DespachoSolicitud } from '../../models/entity/DespachoSolicitud';
import { DespachoDetalleSolicitud } from 'src/app/models/entity/DespachoDetalleSolicitud';
import { BusquedaplantillasbodegaComponent } from '../busquedaplantillasbodega/busquedaplantillasbodega.component'
import { Plantillas } from 'src/app/models/entity/PlantillasBodegas';
import { DetallePlantillaBodega } from 'src/app/models/entity/DetallePlantillaBodega';

declare var $: any;

@Component({
  selector: 'app-despachocostoservicio',
  templateUrl: './despachocostoservicio.component.html',
  styleUrls: ['./despachocostoservicio.component.css'],
  providers: [CreasolicitudesService, DatePipe, InformesService]
})
export class DespachocostoservicioComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public modelopermisos         : Permisosusuario = new Permisosusuario();
  public FormCreaSolicitud      : FormGroup;
  public FormDespachoSolicitud  : FormGroup;
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
  public detalleEliminar        : any = null;
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
  public tipobusqueda           = null;
  public loading                = false;
  public DespachoSolicitud      : DespachoSolicitud;
  public listaDetalleDespacho   : Array<DespachoDetalleSolicitud> = [];
  public desactivabtnelim       : boolean = false;
  public nomplantilla           : string;
  public codigoingresado        : boolean = false;
  public cantidadingresada      : boolean = false;
  public activabtnprodplant     : boolean = false;
  public codprod                = null;
  public cantmed                : number = 0;
  public activabtncreasolic     : boolean = false;
  paramrecepcion                : DespachoDetalleSolicitud[]=[];
  public activabtnplant         : boolean = false;
  descprod: any;
  public codexiste              : boolean = false;
  public desactivabtnagregar    : boolean = false;


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
    public _BusquedaproductosService: BusquedaproductosService,
    private _imprimesolicitudService: InformesService,
    private recepcionasolicitudService: SolicitudService
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

    this.FormDespachoSolicitud = this.formBuilder.group({
      codigoproducto: [{ value: null, disabled: false }, Validators.required],
      cantidad      : [{ value: null, disabled: false }, Validators.required]
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

  // BuscaBodegaSuministro(codigo_eve_origen: number, codbodega_solicitante: number) {
  //   this._BodegasService.listaBodegaRelacionadaAccion(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor, codbodega_solicitante, 1).subscribe(
  //     response => {
  //       this.bodegassuministro = response;
  //     },
  //     error => {
  //       alert("Error al Buscar Bodegas de Destino");
  //     }
  //   );
  // }

  BuscarSolicitudes() {
    this._BSModalRef = this._BsModalService.show(BusquedasolicitudesComponent, this.setModalBusquedaSolicitud());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) { }
      else {
            
        this._solicitudService.BuscaSolicitud(response.soliid, this.hdgcodigo, this.esacodigo, this.cmecodigo, 0, "", "", 0, 0, 0, this.servidor, 0, -1, 0, 0, 0, 0, "",60).subscribe(
          response_solicitud => {
           
            this._Solicitud = response_solicitud[0];
            this.desactivabtnelim = true;
            this.FormCreaSolicitud.get('numsolicitud').setValue(this._Solicitud.soliid);
            this.FormCreaSolicitud.get('bodcodigo').setValue(this._Solicitud.bodorigen);
            this.BuscaBodegasSuministro(this._Solicitud.bodorigen);
            // this.FormCreaSolicitud.get('codbodegasuministro').setValue(this._Solicitud.boddestino);
            this.FormCreaSolicitud.get('fecha').setValue(this.datePipe.transform(this._Solicitud.fechacreacion, 'dd-MM-yyyy'));
            this.FormCreaSolicitud.get('esticod').setValue(this._Solicitud.estadosolicitud);
            this.FormCreaSolicitud.get('prioridad').setValue(this._Solicitud.prioridadsoli);
            this.existesolicitud = true;
            this.activabtncreasolic =false;

            this.arregloDetalleProductoSolicitudPaginacion = [];
            this.arregloDetalleProductoSolicitud = [];
            // this._Solicitud.solicitudesdet.forEach(element =>{
            //   if(element.tiporegmein == "I"){
            //     var detalle = new DetalleSolicitud()
            //     detalle = element
            //   }
            // })
            this.arregloDetalleProductoSolicitud = this._Solicitud.solicitudesdet;
            this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0, 50);
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
        origen : 'Autopedido'
      }
    };
    return dtModal;
  }

  // codigo_ingresado(codigo: string){
  //   console.log("valid",this.FormDespachoSolicitud2.valid)
  //   if(codigo != null){
  //     this.codigoingresado = true;
  //     console.log("entra al codigo ingresado", this.codigoingresado,codigo)
  //   }else{
  //     // if(codigo == null){
  //       this.codigoingresado = false;
  //       console.log("no tiene al codigo ingresado", this.codigoingresado,codigo)
  //     // }
  //   }      
  // }

    // cantidad_ingresada(cantidad : number){
    //   if(cantidad >0){
    //     this.cantidadingresada = true;
    //     console.log("entra la cantida ingresa", this.cantidadingresada,cantidad)
    //   }else{
    //     if(cantidad==null){
    //       this.cantidadingresada = false;
    //       console.log("No tiene la cantida ingresa", this.cantidadingresada,cantidad)
    //     }
    //   }
      
    //   if(this.codigoingresado == true && this.cantidadingresada == true){
    //     this.activabtnprodplant = true;
    //   }else{
    //     if(this.codigoingresado == false || this.cantidadingresada == false){
    //     this.activabtnprodplant = false;
    //     }
    //   }
    // }

  SeleccionaBodega(codigobodega: number){  
    // console.log("Selecciona bodega",codigobodega)
    if(this.arregloDetalleProductoSolicitud.length >0 ){
      this.activabtncreasolic = true;
    }
  }

  async addArticuloGrilla() {
    this.alertSwalError.title = null;
    this.alertSwalError.text = null;
    if(this.FormCreaSolicitud.value.bodcodigo == null){
      this.alertSwalAlert.title = "Debe Seleccionar la Bodega";
      this.alertSwalAlert.show();
    }else{
    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModalBusquedaProductos());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) { }
      else {
        // console.log("respon",response)
        this.productoselec = response;
        
        this.StockProducto(this.productoselec.mein);
        this.loading = false;
       
      }
    },
    error => {
      this.loading = false;
      this.alertSwalError.title = "Error: ";
      this.alertSwalError.text = "No se encontró producto";
      this.alertSwalError.show();
    }
    )
    
  }

    // this.codprod = this.FormDespachoSolicitud.controls.codigoproducto.value;
    // if(this.codprod === null || this.codprod === ''){
    //   return;
    // } else{
    //   this.stockbodegasolicitante = 0;
    //   this.stockbodegasuministro  = 0;

    //   this.loading = true;

    //   this._BusquedaproductosService.BuscarArituculosFiltros(this.hdgcodigo, this.esacodigo,
    //   this.cmecodigo, this.codprod, null, 0, 0, 0, null, this.FormCreaSolicitud.value.bodcodig, null, null,null,
    //   this.usuario, this.servidor).subscribe(
    //     response => {
    //       if (response.length == 0) {
    //         this.loading = false;
    //         this.alertSwalAlert.title = "Advertencia: ";
    //         this.alertSwalAlert.text = "No existe coincidencia por el criterio buscado";
    //         this.alertSwalAlert.show();
    //         response = [];
    //       }
    //       else {
    //         if (response.length > 0) {
    //           this.productoselec = response[0];
            
    //           this.StockProducto(this.productoselec.mein);
    //           this.loading = false;
    //           }
    //       }
    //     },
    //     error => {
    //       this.loading = false;
    //       this.alertSwalError.title = "Error: ";
    //       this.alertSwalError.text = error.message;
    //       this.alertSwalError.show();
    //     }
    //   );
    // }
  }

  async StockProducto(mein: number){
    var stock1 :StockProducto[]
    this.alertSwalError.title =null;
    this.alertSwalAlert.title = null;
    this.alertSwalAlert.text = null;
  //  console.log("mein a buscar",mein)
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
    this.alertSwalAlert.title = null;
    this.alertSwalAlert.text = null;
    this.codexiste = false;
    const DetalleMovimiento = new (DetalleSolicitud);
    DetalleMovimiento.codmei = this.productoselec.codigo;
    DetalleMovimiento.meindescri = this.productoselec.descripcion;
    DetalleMovimiento.stockorigen = this.stockbodegasolicitante;
    // DetalleMovimiento.stockdestino = this.stockbodegasuministro;
    DetalleMovimiento.meinid = this.productoselec.mein;
    DetalleMovimiento.descunidadmedida = this.productoselec.desunidaddespacho;
    DetalleMovimiento.usuariomodifica = this.usuario;
    DetalleMovimiento.cantsoli = this.FormDespachoSolicitud.value.cantidad;
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
    DetalleMovimiento.cantrecepcionado = 0;
    DetalleMovimiento.marca = "I";
    DetalleMovimiento.tiporegmein = this.productoselec.tiporegistro

    this.grabadetalle.unshift(DetalleMovimiento);
    // console.log("DEtallemovim",DetalleMovimiento)
    // console.log("DEtallprod",this.productoselec)
    if(DetalleMovimiento.tiporegmein == "I"){
      const indx = this.arregloDetalleProductoSolicitud.findIndex(x => x.codmei === this.productoselec.codigo, 1);
      if (indx >= 0) {
        this.alertSwalError.title = "Código ya existe en la grilla";
        this.alertSwalError.show();
        this.codexiste = true;
      }else{
        if (this.codexiste == false){
          this.arregloDetalleProductoSolicitud.unshift(DetalleMovimiento);
          this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0, 50);
          }
        }
    }else{
      if(DetalleMovimiento.tiporegmein =="M"){
        // console.log("es medicamento",DetalleMovimiento.tiporegmein)
        this.alertSwalAlert.title = "Advertencia: ";
        this.alertSwalAlert.text = "Solo debe ingresar Insumos";
        this.alertSwalAlert.show();
      }
    }
    if(this.FormCreaSolicitud.value.bodcodigo !=null){
      this.activabtncreasolic= true;
      // console.log("no está seleccionada la bodega",this.activabtncreasolic);
    }
          

    stock1=[];
   
    this.FormDespachoSolicitud.reset();

  }

  setModalBusquedaProductos() {
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
        id_Bodega: this.FormCreaSolicitud.value.bodcodigo,
        descprod: this.descprod,//
        codprod: this.codprod
      }
    };
    return dtModal;
  }

  getProducto(codigo: any) {
    if(this.FormCreaSolicitud.value.bodcodigo == null){
      this.alertSwalAlert.title = "Debe Seleccionar la Bodega";
      this.alertSwalAlert.show();
    }else{

    
      // var codproducto = this.lForm.controls.codigo.value;
      this.codprod = codigo;
      
      if(this.codprod === null || this.codprod === ''){
        return;
      } else{
        var tipodeproducto = 'MIM';
        this.loading = true;
        var controlado = '';
        var controlminimo = '';
        var idBodega = this.FormCreaSolicitud.value.bodcodigo;
        var consignacion = '';
        // console.log("bodega",idBodega)
        this._BusquedaproductosService.BuscarArituculosFiltros(this.hdgcodigo, this.esacodigo,
          this.cmecodigo, codigo, null, null, null, null, tipodeproducto, idBodega, controlminimo, controlado, consignacion
          , this.usuario, this.servidor).subscribe(
            response => {
              if (response.length == 0) {
                // console.log('no existe el codigo');
                this.loading = false;
                this.addArticuloGrilla();
              }
              else {
                if (response.length > 0) {
                  this.loading = false;
                 
                  this.productoselec = response[0];
                 
                  this.StockProducto(response[0].mein)
                 
                }
              }
            }, error => {
              this.loading = false;
              console.log('error');
            }
          );
      }
    }
  }


  cambio_cantidad(id: number, property: string, registro: DetalleSolicitud) {
   
    if (this.arregloDetalleProductoSolicitudPaginacion[id]["sodeid"] == 0) {
      this.arregloDetalleProductoSolicitudPaginacion[id]["acciond"] = "I";
      this.arregloDetalleProductoSolicitud[id][property] = this.arregloDetalleProductoSolicitudPaginacion[id][property];
    } else {

      this.arregloDetalleProductoSolicitudPaginacion[id]["acciond"] = "M";
      this.arregloDetalleProductoSolicitud[id][property] = this.arregloDetalleProductoSolicitudPaginacion[id][property];

    }

  }

  validacantidadgrilla(id: number,despacho: DetalleSolicitud){
    var idg =0;
    // console.log("Vaida cantidad",despacho)
    // if(despacho.sodeid>0){
      if(this.IdgrillaDevolucion(despacho)>=0){
        idg = this.IdgrillaDevolucion(despacho)
        
        if(this.arregloDetalleProductoSolicitud[idg].cantsoli <0){
          this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
          this.alertSwalAlert.show();
        }else{
        }
      }
    // }
  }

  IdgrillaDevolucion(registro: DetalleSolicitud) {
    
    let indice = 0;
    for (const articulo of this.arregloDetalleProductoSolicitud) {
      if (registro.codmei === articulo.codmei) {
        
        return indice;
      }
      indice++;
    }
    return -1;
  }

  onBuscarPlantillas(){
    this._BSModalRef = this._BsModalService.show(BusquedaplantillasbodegaComponent, this.setModalBusquedaPlantilla());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) {
       }
      else {
        // console.log("plantillas selec",response)
        this._BodegasService.BuscaPlantillas(this.servidor, sessionStorage.getItem('Usuario'), this.hdgcodigo, this.esacodigo,
          this.cmecodigo, response.planid, '', '', '', 0, 0, '', '', 1).subscribe(response_plantilla => {
            if (response_plantilla.length == 0) {
            } else {

              this.loading = true;
              if (response_plantilla.length > 0) {

                let arrPlantillas: Plantillas = new Plantillas();
                arrPlantillas = response_plantilla[0];
                console.log("busqueda 2", arrPlantillas)
                if (arrPlantillas.bodorigen == 0) {
                  this.activabtncreasolic = false;
                }
                this.FormCreaSolicitud.get('bodcodigo').setValue(arrPlantillas.bodorigen);
                this.FormCreaSolicitud.value.bodcodigo = arrPlantillas.bodorigen;
                // console.log("bodega", this.FormCreaSolicitud.value.bodcodigo)
                this.nomplantilla = arrPlantillas.plandescrip;
                arrPlantillas.plantillasdet.forEach(res => {

                  this.setPlantilla(res);
                 
                  this.loading = false;

                });
              }
            }
          });
      }
    });
  }

  setModalBusquedaPlantilla() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Plantilla Procedimiento', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        tipoplantilla: true
      }
    };
    return dtModal;
  }

  async setPlantilla(art: DetallePlantillaBodega) {
  //  console.log("set planilla",art)
    var detalleSolicitud = new DetalleSolicitud;
    detalleSolicitud.sodeid            = 0;
    detalleSolicitud.soliid            = 0; //num solicitud
    detalleSolicitud.repoid            = 0;
    detalleSolicitud.codmei            = art.codmei;
    detalleSolicitud.meinid            = art.meinid;
    detalleSolicitud.dosis             = 1;
    detalleSolicitud.formulacion       = 1;
    detalleSolicitud.dias              = 1;
    detalleSolicitud.cantsoli          = art.cantsoli;
    detalleSolicitud.pendientedespacho = 0;
    detalleSolicitud.cantdespachada    = 0;
    detalleSolicitud.cantdevolucion    = 0;
    detalleSolicitud.estado            = 1; // Solicitado  
    detalleSolicitud.observaciones     = null;
    detalleSolicitud.fechamodifica     = null;
    detalleSolicitud.usuariomodifica   = null;
    detalleSolicitud.fechaelimina      = null;
    detalleSolicitud.usuarioelimina    = null;
    detalleSolicitud.viaadministracion = null;
    detalleSolicitud.meindescri        = art.meindescri;
    detalleSolicitud.stockorigen       = null;
    detalleSolicitud.stockdestino      = null;
    detalleSolicitud.acciond           = null;
    detalleSolicitud.marca             = null;
    detalleSolicitud.fechavto          = null;
    detalleSolicitud.lote              = null;
    detalleSolicitud.cantadespachar    = 0;
    detalleSolicitud.descunidadmedida  = null;
    detalleSolicitud.tiporegmein       = art.tiporegmein;
    detalleSolicitud.acciond           = 'I';
    detalleSolicitud.nomplantilla      = this.nomplantilla;
    detalleSolicitud.cantrecepcionado  = 0;
    
    if (detalleSolicitud.tiporegmein == "I") {
     
      this.arregloDetalleProductoSolicitud.unshift(detalleSolicitud);
      this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0, 50);
      // this.FormCreaSolicitud.value.bodcodigo= arrPlantillas.bodorigen
      
    } else{
      if(detalleSolicitud.tiporegmein =="M"){
        this.cantmed ++;
        this.alertSwalAlert.text = "La plantilla tiene medicamentos ";
        // this.alertSwalAlert.text = "La plantilla tiene "+this.cantmed +"  medicamentos que no serán cargados";
        this.alertSwalAlert.show();
 
      }
    }
    if(this.FormCreaSolicitud.value.bodcodigo >0){
      this.activabtncreasolic= true;
      // console.log("no está seleccionada la bodega",this.activabtncreasolic,this.FormCreaSolicitud.value.bodcodigo);
    }
    // if(i== ){
    // }
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
    this.desactivabtnelim = false;
    this.activabtncreasolic = false;
    this.FormDespachoSolicitud.reset();
    this.activabtnplant = false;
    this.FormDespachoSolicitud.controls.codigoproducto.enable();
    this.FormDespachoSolicitud.controls.cantidad.enable();
    this.desactivabtnagregar= false;

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
        this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0, 50);
      }
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
    this._Solicitud.boddestino = this.FormCreaSolicitud.value.bodcodigo;
    this._Solicitud.tipoproducto = this.tipoproducto;
    this._Solicitud.tiporeceta = null;
    this._Solicitud.numeroreceta = 0;
    this._Solicitud.tipomovim = 'C';
    this._Solicitud.tiposolicitud = 60;
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
    this._Solicitud.origensolicitud = 60;
   
    // console.log("cabecera solic", this._Solicitud)
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
    // console.log("solicitud",this._Solicitud)
    this._solicitudService.crearSolicitud(this._Solicitud).subscribe(
      response => {
       
        this._solicitudService.BuscaSolicitud(response.solbodid, this.hdgcodigo, this.esacodigo, this.cmecodigo,
          null, null, null, null, null, null, this.servidor, null, null, null, null, null, null, null,60).subscribe(
            respuestasolicitud => {
              this._Solicitud = null;
              this._Solicitud = respuestasolicitud[0];
              this.desactivabtnelim = true;
              this.activabtncreasolic = false;
              this.DespacharSolicitud(this._Solicitud.soliid);
              this.FormCreaSolicitud.get('numsolicitud').setValue(this._Solicitud.soliid);
              // this.FormCreaSolicitud.get('bodcodigo').setValue(this._Solicitud.bodorigen);
              // this.BuscaBodegasSuministro(this._Solicitud.bodorigen);
              // this.FormCreaSolicitud.get('codbodegasuministro').setValue(this._Solicitud.boddestino);
              // this.FormCreaSolicitud.get('fecha').setValue(this.datePipe.transform(this._Solicitud.fechacreacion, 'dd-MM-yyyy'));
              // this.FormCreaSolicitud.get('esticod').setValue(this._Solicitud.estadosolicitud);
              // this.FormCreaSolicitud.get('prioridad').setValue(this._Solicitud.prioridadsoli);

              this.existesolicitud= true;
              this.activabtnplant = true;
              this.FormDespachoSolicitud.controls.codigoproducto.disable();
              this.FormDespachoSolicitud.controls.cantidad.disable();
              this.desactivabtnagregar = true;
              this.arregloDetalleProductoSolicitudPaginacion = [];
              this.arregloDetalleProductoSolicitud = [];

              this.arregloDetalleProductoSolicitud = this._Solicitud.solicitudesdet;
              this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0, 8);
              
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

  DespacharSolicitud(soliid:number){
   
    if (this.arregloDetalleProductoSolicitud.length > 0) {
      this.DespachoSolicitud = new (DespachoSolicitud);
      
      this.DespachoSolicitud.paramdespachos = this._Solicitud.solicitudesdet;// this.arregloDetalleProductoSolicitud;
      this.DespachoSolicitud.paramdespachos.forEach(element=>{
        element.hdgcodigo = this.hdgcodigo;
        element.esacodigo = this.esacodigo;
        element.cmecodigo = this.cmecodigo;
        element.bodorigen =this._Solicitud.bodorigen;
        element.boddestino = this._Solicitud.boddestino;
        element.servidor = this.servidor;
        element.cantadespachar = element.cantsoli;
        element.usuariodespacha = this.usuario;
        element.soliid  = soliid;
        element.consumo = "S";

      })
      
      try {

        this._solicitudService.DespacharSolicitud(this.DespachoSolicitud).subscribe(
          response => {
            
            if (response.respuesta == 'OK') {
              // this.existesolicitud = true;
             
              // this.activabtndespacho = false;
              this.alertSwal.title = "Solicitud creada N°:" + soliid +".  Despachada y Recepcionada con éxito";
              this.alertSwal.show();

              this._solicitudService.BuscaSolicitud(this._Solicitud.soliid, this.hdgcodigo, this.esacodigo, this.cmecodigo, null, null, null, null, null, null, this.servidor, 0, 0, 0, 0, 0, 0, "",60).subscribe(
                response => {
                  this._Solicitud = response[0];
                
                  this.FormCreaSolicitud.get('bodcodigo').setValue(response[0].bodorigen);
                  this.FormCreaSolicitud.get('fecha').setValue(new Date(response[0].fechacreacion));
                  this.FormCreaSolicitud.get('esticod').setValue(response[0].estadosolicitud);
                  this.FormCreaSolicitud.get('prioridad').setValue(response[0].prioridadsoli);
                  this.FormCreaSolicitud.get('numsolicitud').setValue(this._Solicitud.soliid);
                  response[0].solicitudesdet.forEach(element =>{
                    element.backgroundcolor = (element.tienelote == "N")?'gris':'amarillo';
        
                  })
                  // element.backgroundcolor = (element.tienelote == "N")?'gris':'amarillo';
                  // this.arregloDetalleProductoSolicitud = response[0].solicitudesdet;
                  // this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0, 50);
                },
                error => {
                  console.log(error);
                  this.alertSwalError.title = "Error al Buscar solicitudes, puede que no exista";
                  this.alertSwalError.show();
                }
              )
            }
          },
          error => {
            console.log(error);
            this.alertSwalError.title = "Error al Despachar la Solicitud";
            this.alertSwalError.text = error;
            this.alertSwalError.show();

          }
        );

      } catch (err) {
        alert("Error : " + err)
      }
    }
    // this.listaDetalleDespacho = []; this.listaDetalleDespachopaginacion = [];
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

  limpiarGrillamedicamento() {
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
