import { Component, OnInit, ViewChild,HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../../environments/environment';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CreacionReceta } from 'src/app/models/entity/CreacionReceta';
import { DetalleReceta } from 'src/app/models/entity/DetalleReceta';
import { validateRUT } from 'validar-rut';

/* Models */
import { DocIdentificacion } from '../../models/entity/DocIdentificacion';
import { Solicitud } from '../../models/entity/Solicitud';
import { DetalleSolicitud } from '../../models/entity/DetalleSolicitud';
import { Articulos } from '../../models/entity/mantencionarticulos';
import { TipoAmbito } from '../../models/entity/TipoAmbito';
import { EstadoSolicitud } from '../../models/entity/EstadoSolicitud';
import { DevuelveDatosUsuario } from '../../models/entity/DevuelveDatosUsuario';
import { StockProducto } from 'src/app/models/entity/StockProducto';
import { DespachoDetalleSolicitud } from 'src/app/models/entity/DespachoDetalleSolicitud';
import { EstadoRecetaProg } from 'src/app/models/entity/EstadoRecetaProg';
import { Receta } from 'src/app/models/entity/receta';
import { Paciente } from 'src/app/models/entity/Paciente';
import { Detallelote } from '../../models/entity/Detallelote';
import { BodegasTodas } from 'src/app/models/entity/BodegasTodas';
import { ListaCobros } from 'src/app/models/entity/ListaCobro';

/*Components */
import { BusquedaproductosComponent } from '../busquedaproductos/busquedaproductos.component';
import { EventosSolicitudComponent } from '../eventos-solicitud/eventos-solicitud.component';
import { EventosDetallesolicitudComponent } from '../eventos-detallesolicitud/eventos-detallesolicitud.component';
import { BusquedapacientesComponent } from '../busquedapacientes/busquedapacientes.component';
import { BusquedaSolicitudPacienteAmbulatorioComponent } from '../busqueda-solicitud-paciente-ambulatorio/busqueda-solicitud-paciente-ambulatorio.component';
import { Permisosusuario } from '../../permisos/permisosusuario';
import { BusquedarecetasComponent } from '../busquedarecetas/busquedarecetas.component';

/** modals */
import { ModalbusquedaprofesionalComponent } from '../modalbusquedaprofesional/modalbusquedaprofesional.component';

/*Services */
import { DocidentificacionService } from '../../servicios/docidentificacion.service';
import { SolicitudService } from '../../servicios/Solicitudes.service';
import { TipoambitoService } from '../../servicios/tiposambito.service';
import { DispensarsolicitudesService } from '../../servicios/dispensarsolicitudes.service';
import { PacientesService } from '../../servicios/pacientes.service';
import { BodegasService } from '../../servicios/bodegas.service';
import { InformesService } from '../../servicios/informes.service';
import { BusquedaproductosService } from 'src/app/servicios/busquedaproductos.service';
import { CreasolicitudesService } from '../../servicios/creasolicitudes.service';
import { DatosProfesional } from 'src/app/models/entity/DatosProfesional';

@Component({
  selector: 'app-despacho-recetas-ambulatoria',
  templateUrl: './despacho-recetas-ambulatoria.component.html',
  styleUrls: ['./despacho-recetas-ambulatoria.component.css'],
  providers: [DispensarsolicitudesService,InformesService, CreasolicitudesService],
})
export class DespachoRecetasAmbulatoriaComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  @ViewChild('alertSwalConfirmar', { static: false }) alertSwalConfirmar: SwalComponent;

  public modelopermisos : Permisosusuario = new Permisosusuario();
  public locale         = 'es';
  public bsConfig       : Partial<BsDatepickerConfig>;
  public colorTheme     = 'theme-blue';


  //Array
  public alerts                          : Array<any> = [];

  public articulos2                      : Articulos;
  public docsidentis                     : Array<DocIdentificacion> = [];
  public tipoambitos                     : Array<TipoAmbito> = [];
  public estadosolicitudes               : Array<EstadoSolicitud> = [];
  public arrdetalleSolicitud             : Array<DetalleSolicitud> = [];
  public arrdetalleSolicitudMed          : Array<DetalleSolicitud> = [];
  public arrdetalleSolicitudIns          : Array<DetalleSolicitud> = [];
  public arrdetalleDispensarMed          : Array<DetalleSolicitud> = [];
  public arrdetalleDispensarIns          : Array<DetalleSolicitud> = [];
  public arrdetalleSolicitudPaginacion   : Array<DetalleSolicitud> = [];
  public arrdetalleSolicitudMedPaginacion: Array<DetalleSolicitud> = [];
  public arrdetalleSolicitudInsPaginacion: Array<DetalleSolicitud> = [];
  public arrdetalleSolicitudMedPaginacion_aux: Array<DetalleSolicitud> = [];
  public arrdetalleSolicitudMed_aux      : Array<DetalleSolicitud> = [];
  public arrdetalleSolicitudMed_2        : Array<DetalleSolicitud> = [];
  public estadorecetasprogs              : Array<EstadoRecetaProg> = [];
  public arrdetalleSolicitudMedMOD       : Array<DetalleSolicitud> = [];
  public paramdespachos                  : Array<DespachoDetalleSolicitud> = [];
  public bodegasSolicitantes    : Array<BodegasTodas> = [];
  //Obj
  public FormDatosPaciente      : FormGroup;
  public FormDatosProducto      : FormGroup;
  private _BSModalRef           : BsModalRef;
  public dataPacienteSolicitud  : Solicitud = new Solicitud();
  public _Solicitud             : Solicitud = new Solicitud();
  public varListaDetalleDespacho: DetalleSolicitud = new DetalleSolicitud();

  //Var
  public servidor           = environment.URLServiciosRest.ambiente;
  public usuario            = environment.privilegios.usuario;
  public hdgcodigo          : number;
  public esacodigo          : number;
  public cmecodigo          : number;
  public existpaciente      = false;

  public existsolicitud     = false;
  public vacios             = true;
  public nuevasolicitud     = false;
  public tipobusqueda       = "Paciente";
  public modificar          = false;
  public loading            = false;
  public agregarproducto    = false;
  public accion             = 'I';
  public pacientehosp       : Paciente = new Paciente();
  public activacomboentrega : boolean = false;
  public checkgrilla        : boolean = true;
  public cantentregas       : number = 0;
  public diasentrega        : number = 0;
  public solid              : number = 0;
  public resid              : number = 0;
  public _Receta            : Receta = null;
  public _RecetaMOD         : Receta = new (Receta);
  public ambito             : boolean = true;
  public codambito          : number = 3;
  public Receta             : Receta = new Receta();
  public recetaactiva       : boolean = false;
  public recetademonitor    : boolean = false;
  public btnimprime         : boolean = false;
  public detalleslotes      : Detallelote[] = [];
  public bloqueacamposgrilla: boolean = false;
  public validagrilla       : boolean = false;
  public bloqueacamposgrilla2: boolean = false;
  public btnmodificar       : boolean = false;
  public btncrea            : boolean = false;
  public btneliminagrilla   : boolean = false;
  public numreceta          : number ;
  public codprod            = null;
  public desactivabtnelim   : boolean = false;
  public vaciolote          : boolean = true;
  public ActivaBotonLimpiaBusca : boolean = false;
  public ActivaBotonBuscaGrilla : boolean = false;
  public lotesMedLength     : number;
  public cantidad           : number = 0;
  public IDSol              : number = 0;
  public glsambito          : string = '';
  public glsbtnmodifica     : string = 'CREAR RECETA';
  public glsMensajeMod      : string = 'Crear Receta';
  public glsMensajeResp     : string = 'Creada';
  public listacobros        : Array<ListaCobros> = [];
  /** Var para controlar columnas y btn  */
  public tiporeceta     = null;
  public coladispensar  = true;
  public colLoteprod    = true;
  /** Usado para la funcion logicavacios() */
  public verificanull   = false;
  public bandera_aux    : number = 0;
  public btnbuscareceta : boolean = true;
  public bodegacontrolado : string;
  public btnlimpiar     : boolean = true; /** sin logica */
  public modificable    : boolean = false;
  public ambulatorio    : boolean = false;
  public bloqueabuscapac: boolean = true;
  public valida         : boolean;
  public respPermiso    : string;
  public retira         : boolean = false;
  /** usados para controlar productos en bodega controlados */
  public codbodega      : number = 0;
  public isbodegacontrolado : boolean = false;

  public detalleconstock: Array<DetalleSolicitud> = [];

  /** busqueda medico */
  public activabtnbuscaprof = false;
  public datosprofesional : DatosProfesional = new DatosProfesional();

  /** botones */
  public btnEliminar = true;
  public btnDispensar = false;

  /** indica si esta pagada  */
  public recenopagada = false;

  /** control no eliminar */
  public nopagada = true;

  /** filtra si es una receta creada anteriormente */
  public modificareceta = false;

  /** indica si fue eliminada */
  public iseliminada = false;

  constructor(
    public datePipe                   : DatePipe,
    public localeService              : BsLocaleService,
    public DocidentificacionService   : DocidentificacionService,
    public formBuilder                : FormBuilder,
    public _BsModalService            : BsModalService,
    public _solicitudService          : SolicitudService,
    public _tipoambitoService         : TipoambitoService,
    public _estadosolicitudesService  : SolicitudService,
    private router                    : Router,
    private route                     : ActivatedRoute,
    public _PacientesService          : PacientesService,
    private _dispensasolicitudService : DispensarsolicitudesService,
    public _BodegasService            : BodegasService,
    private _buscasolicitudService    : SolicitudService,
    private _imprimesolicitudService  : InformesService,
    public _BusquedaproductosService  : BusquedaproductosService,
    public _creaService               : CreasolicitudesService,

  ) {
    this.FormDatosPaciente = this.formBuilder.group({
      tipodocumento           : [{ value: null, disabled: true }, Validators.required],
      numidentificacion       : [{ value: null, disabled: true }, Validators.required],
      numcuenta               : [{ value: null, disabled: true }, Validators.required],
      nombrepaciente          : [{ value: null, disabled: true }, Validators.required],
      tipodocumentomed        : [{ value: null, disabled: true}, Validators.required],
      numidentificacionmedico : [{ value: null, disabled: true }, Validators.required],
      nombremedico            : [{ value: null, disabled: true }, Validators.required],
      apellidopatemedico      : [{ value: null, disabled: true }, Validators.required],
      apellidomatemedico      : [{ value: null, disabled: true }, Validators.required],
      edad                    : [{ value: null, disabled: true }, Validators.required],
      unidad                  : [{ value: null, disabled: true }, Validators.required],
      sexo                    : [{ value: null, disabled: true }, Validators.required],
      ambito                  : [{ value: 3, disabled: false }, Validators.required],
      estado                  : [{ value: 10, disabled: true }, Validators.required],
      numsolicitud            : [{ value: null, disabled: true }, Validators.required],
      pieza                   : [{ value: null, disabled: true }, Validators.required],
      cama                    : [{ value: null, disabled: true }, Validators.required],
      fechahora               : [new Date(), Validators.required],
      ubicacion               : [{ value: null, disabled: true }, Validators.required],
      medico                  : [{ value: null, disabled: true }, Validators.required],
      numeroboleta            : [{ value: null, disabled: false }, Validators.required],
      numeroreceta            : [{ value: null, disabled: false }, Validators.required],
      comprobantecaja         : [{ value: null, disabled: false }, Validators.required],
      estadocomprobantecaja   : [{ value: 10, disabled: false }, Validators.required],
      entrega                 : [{ value: null, disabled: false }, Validators.required],
      marcacheck              : [{ value: null, disabled: false }, Validators.required],
      codigodiasentrega       : [{ value: null, disabled: false }, Validators.required],
      bodcodigo               : [{ value: null, disabled: false }, Validators.required],
      servicio                : [{ value: null, disabled: true }, Validators.required],
      retiro                  : [{ value: null, disabled: false }, Validators.required],
      tipodocumentoretira     : [{ value: null, disabled: false }, Validators.required],
      rutretira               : [{ value: null, disabled: false }, Validators.required],
      nombreretira            : [{ value: null, disabled: false }, Validators.required],
      cobroincluido           : [{ value: null, disabled: false }, Validators.required]
    });
    this.FormDatosProducto = this.formBuilder.group({
      codigo  : [{ value: null, disabled: false }, Validators.required],
      cantidad: [{ value: null, disabled: false }, Validators.required]
    });

  }

  ngOnInit() {

    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();

    this.FormDatosPaciente.controls.fechahora.disable();
    this.FormDatosPaciente.controls.cobroincluido.disable();

    this.setDate();
    this.datosUsuario();
    this.getParametros();
    this.BuscaBodegaSolicitante();
    this.BuscaListaCobros();

    this.resid = 0;
    this.solid = 0;
    this.codambito = 3;
    this.ambito = true;
    this.FormDatosPaciente.controls.bodcodigo.disable();

    this.route.paramMap.subscribe(param => {
      if (param.has("soliid")) {

        this.solid = parseInt(param.get("soliid"), 10);
        this.codambito = parseInt(param.get("ambito"),10);
      }
    })

    this.route.paramMap.subscribe(param => {
      if (param.has("id_reseta")) {
        this.resid = parseInt(param.get("id_reseta"), 10);
      }
    })

    if (this.solid != 0) {
      this.CargaPacienteSolicitud(this.solid,this.codambito);
    } else {
      if (this.resid != 0  )
      this.CargaPacienteReceta(this.resid);
    }

  }

  ngOnDestroy(){
    if(this.bandera_aux != undefined){
      if(this.bandera_aux != 2){
        this.ValidaEstadoSolicitud(1,'destroy');
      }
    }

  }

  async CargaPacienteReceta(resid: number) {
    this.loading = true;
    // Cargando recetas apcientes
    this._Receta = new (Receta);
    this._Receta.receid = resid;
    this._Receta.hdgcodigo = this.hdgcodigo;
    this._Receta.esacodigo = this.esacodigo;
    this._Receta.cmecodigo = this.cmecodigo;
    this._Receta.servidor  = this.servidor;

    this.arrdetalleDispensarMed = [];
    this.arrdetalleSolicitudMed = [];
    this.arrdetalleSolicitudMedPaginacion = [];
    this.arrdetalleSolicitudMed_aux = [];
    this.arrdetalleSolicitudMedPaginacion_aux = [];
    this.arrdetalleSolicitudMedMOD = [];
    this.modificable = false;
    this.glsbtnmodifica = 'MODIFICAR RECETA';
    this.glsMensajeMod = 'Modificar Receta';
    this.glsMensajeResp = 'Modificada';
    this._buscasolicitudService.buscarestructurarecetas(this._Receta).subscribe(
      response => {
        if (response != null){
            if (response.length > 0) {
              this.alertSwalAlert.title = null;
              this.alertSwalAlert.text = null;
              this.recetademonitor = true;
              this._Receta = response[0];
              if (this._Receta.recesolid > 0) {
                this.alertSwalAlert.title = "La receta N° " + this._Receta.receid+" ya fue dispensada en la solicitud: "+ this._Receta.recesolid;
                this.alertSwalAlert.show();
                this.CargaPacienteSolicitud(this._Receta.recesolid,this._Receta.receambito);

                this.logicaEstadosreceta();

                /** 27/01/22:habilita btn imprimir.(@mlobosh) */
                this.btnimprime = true;

                return;
              } else {
                this.bandera_aux = this._Receta.bandera;
                if(this._Receta.recesolid === 0 && this._Receta.receestadodespacho != 50 || this._Receta.receestadodespacho !== 40){
                  this.bloqueacamposgrilla = true;
                  this.btneliminagrilla = true;
                  this.btnbuscareceta = false;
                  this.btncrea = true;
                  this.tiporeceta = 'Monitor';
                  this.btnimprime = true;
                  if(this._Receta.recesolid > 0 && this._Receta.receestadodespacho === 40){
                    this.FormDatosPaciente.get('numsolicitud').setValue(this._Receta.recesolid);
                    this.FormDatosPaciente.get('estado').setValue(this._Receta.receestadodespacho);
                  } else {
                    this.FormDatosPaciente.get('estado').setValue(this._Receta.receestadodespacho);
                  }

                  /**
                   * 26/1/22: si receta es eliminada, desactiva btn Eliminar. (@mlobosh)
                   */
                  if( this._Receta.receestadodespacho === 110 ) {

                    this.iseliminada = true;
                    this.btnEliminar = false;

                  }
                  this.FormDatosPaciente.get('tipodocumento').setValue(this._Receta.recetipdocpacglosa);
                  this.FormDatosPaciente.get('numidentificacion').setValue(this._Receta.recedocumpac);
                  this.FormDatosPaciente.get('nombrepaciente').setValue(this._Receta.recenombrepaciente);
                  this.FormDatosPaciente.get('sexo').setValue(response[0].glsexo);
                  this.FormDatosPaciente.get('edad').setValue(response[0].edad);
                  this.FormDatosPaciente.get('numcuenta').setValue(this._Receta.ctanumcta);
                  this.FormDatosPaciente.get('numeroreceta').setValue(this._Receta.receid);
                  this.FormDatosPaciente.get('pieza').setValue(this._Receta.receglosapieza .concat(" ").concat( this._Receta.receglosacama));
                  this.FormDatosPaciente.get('comprobantecaja').setValue(this._Receta.cajanumerocomprobante.toString(10));
                  this.FormDatosPaciente.get('estadocomprobantecaja').setValue(parseInt(this._Receta.codigoestadocomprobante))
                  this.FormDatosPaciente.get('tipodocumentomed').setValue(this._Receta.recetipdocprof);
                  this.FormDatosPaciente.get('numidentificacionmedico').setValue(this._Receta.recedocumprof);
                  this.FormDatosPaciente.get('nombremedico').setValue(this._Receta.profnombre);
                  this.FormDatosPaciente.get('apellidopatemedico').setValue(this._Receta.profapepaterno);
                  this.FormDatosPaciente.get('apellidomatemedico').setValue(this._Receta.profapematerno);
                  this.FormDatosPaciente.get('servicio').setValue(this._Receta.receglosaservicio);
                  this.FormDatosPaciente.get('bodcodigo').setValue(this._Receta.rececodbodega);
                  this.FormDatosPaciente.get('cobroincluido').setValue(this._Receta.codcobroincluido);
                  this.bodegaisnull(this._Receta.rececodbodega);
                  this.FormDatosPaciente.controls.numeroreceta.disable();
                  switch (this._Receta.receambito) {
                    case 1:
                      this.codambito = this._Receta.receambito;
                      this.glsambito = 'Ambulatorio';
                      this.ambito = false;
                      this.ambulatorio = true;
                      this.bloqueabuscapac = false;
                      this.logicaReambulatorio();
                      if( this.FormDatosPaciente.controls.numsolicitud.value > 0){
                        this.activabtnbuscaprof = false;
                      } else {
                        this.activabtnbuscaprof = true;
                      }

                      if(this._Receta.codcobroincluido === 0){
                        if (this._Receta.cajanumerocomprobante === 0 && this._Receta.recesubreceta !=0) {
                          this.agregarproducto = false;
                          // this.FormDatosPaciente.controls.bodcodigo.disable();
                          this.bodegaisnull(this._Receta.rececodbodega);
                          this.FormDatosPaciente.controls.numeroboleta.disable();
                          this.FormDatosPaciente.controls.comprobantecaja.disable();
                          this.arrdetalleSolicitudMed.forEach(x=>{
                            x.bloqcampogrilla = true;
                          });
                          this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0,20);

                          if( !this.iseliminada ){
                            this.alertSwalAlert.title = "La receta aún no se paga";
                            this.alertSwalAlert.text = "Debe estar pagada para poder dispensarla";
                            this.alertSwalAlert.show();
                          }
                          this.logicaBodega();

                          /** bloquear bodega para no pagadas ( incidencia nº257 ) */
                          /** 27-01-22: debe bloquear bodega pero solo asociada al no pago de la receta.(@mlobosh) */
                          this.FormDatosPaciente.controls.bodcodigo.disable();

                          this.recenopagada = true;
                          this.logicaEstadosreceta();

                        } else {
                          this.btnmodificar = false;
                        }
                      }else{

                        this.FormDatosPaciente.controls.bodcodigo.enable();
                        this.ambito = true;
                        this.btnmodificar = false;
                      }
                      break;
                    case 2:
                      this.codambito = this._Receta.receambito;
                      this.glsambito = 'Urgencia';
                      this.ambito = false;
                      this.ambulatorio = false;
                      if( this.FormDatosPaciente.controls.numsolicitud.value > 0){
                        this.activabtnbuscaprof = false;
                      } else {
                        this.activabtnbuscaprof = true;
                        this.habilitaMedico(true);

                      }
                      if (this._Receta.ctanumcta === 0) {
                        this.agregarproducto = false;
                        if( !this.iseliminada ){
                          this.alertSwalAlert.title = "La receta aún no se paga";
                          this.alertSwalAlert.text = "Debe estar pagada para poder dispensarla";
                          this.alertSwalAlert.show();
                        }

                        this.recenopagada = true;
                        this.logicaEstadosreceta();

                      } else {
                        this.btnmodificar = false;
                      }
                      break;
                    case 3:
                      this.codambito = this._Receta.receambito;
                      this.glsambito = 'Hospitalario';
                      this.ambito = true;
                      this.ambulatorio = false;
                      if( this.FormDatosPaciente.controls.numsolicitud.value > 0){
                        this.activabtnbuscaprof = false;
                      } else {
                        this.activabtnbuscaprof = true;
                      }
                      if (this._Receta.ctanumcta === 0) {
                        this.agregarproducto = false;
                        if( !this.iseliminada ){
                          this.alertSwalAlert.title = "La receta aún no se paga";
                          this.alertSwalAlert.text = "Debe estar pagada para poder dispensarla";
                          this.alertSwalAlert.show();
                        }

                        this.recenopagada = true;
                        this.logicaEstadosreceta();

                      } else {
                        this.btnmodificar = false;
                      }
                      break;
                    default:
                      this.glsambito = ''
                      break;
                  }

                  if(this._Receta.recetadetalle != null){
                    this._Receta.recetadetalle.forEach(element => {
                      var detreceta = new DetalleSolicitud;
                      detreceta.codmei         = element.redemeincodmei;
                      detreceta.meindescri     = element.redemeindescri;
                      detreceta.dosis          = element.rededosis;
                      detreceta.formulacion    = element.redeveces;
                      detreceta.dias           = element.redetiempo;
                      detreceta.redeid         = element.redeid;
                      detreceta.cantsoli       = element.redecantidadsolo;
                      detreceta.cantdespachada = element.redecantidadadesp;
                      detreceta.cantadespachar = element.redecantidadsolo - element.redecantidadadesp;
                      detreceta.cantadespacharresp = detreceta.cantadespachar;
                      detreceta.acciond        = "M";
                      detreceta.meinid         = element.meinid;
                      detreceta.controlado     = element.meincontrolado;
                      detreceta.tiporegmein    = element.meintiporeg;
                      detreceta.posologia      = element.redeglosaposologia;
                      if (this._Receta.cajanumerocomprobante === 0 || this._Receta.ctanumcta === 0) {
                        detreceta.bloqcampogrilla  = true;
                        detreceta.bloqcampogrilla2 = false;
                        detreceta.bloqcampogrilla3 = true;
                        detreceta.bloqcampogrilla4 = true;
                      } else {
                        detreceta.bloqcampogrilla  = false;
                        detreceta.bloqcampogrilla2 = true;
                        detreceta.bloqcampogrilla3 = false;
                        detreceta.bloqcampogrilla4 = true;
                      }
                      if(this._Receta.receambito === 1 && this._Receta.cajanumerocomprobante === 0){
                        detreceta.bloqcampogrilla  = false;
                        detreceta.bloqcampogrilla2 = false;
                        detreceta.bloqcampogrilla3 = true;
                        detreceta.bloqcampogrilla4 = true;
                      }else{
                        detreceta.bloqcampogrilla  = true;
                        detreceta.bloqcampogrilla2 = false;
                        detreceta.bloqcampogrilla3 = true;
                        detreceta.bloqcampogrilla4 = true;
                      }
                      if(this._Receta.codcobroincluido != 0) {
                        detreceta.cantidadpagadacaja = element.redecantidadsolo;
                      } else {
                        detreceta.cantidadpagadacaja = element.cantidadpagadacaja;
                      }
                      if(element.meincontrolado === 'S'){
                        if(this.esacodigo === 2){
                          this.FormDatosPaciente.get('bodcodigo').setValue(6);
                          this.FormDatosPaciente.get('retiro').setValue(1);
                          this.FormDatosPaciente.controls.retiro.enable();
                          this.FormDatosPaciente.controls.bodcodigo.disable();
                          this.FormDatosPaciente.controls.numeroboleta.disable();
                          this.FormDatosPaciente.controls.comprobantecaja.disable();
                        }else{
                          this.FormDatosPaciente.get('bodcodigo').setValue(78);
                          this.FormDatosPaciente.get('retiro').setValue(1);
                          this.FormDatosPaciente.controls.retiro.enable();
                          this.FormDatosPaciente.controls.bodcodigo.disable();
                          this.FormDatosPaciente.controls.numeroboleta.disable();
                          this.FormDatosPaciente.controls.comprobantecaja.disable();
                        }
                        this.agregarproducto = false;
                      }
                      this.dataPacienteSolicitud.cliid         = this._Receta.rececliid;
                      this.dataPacienteSolicitud.tipodocpac    = this._Receta.recetipdocpac;
                      this.dataPacienteSolicitud.numdocpac     = this._Receta.recedocumpac;
                      this.dataPacienteSolicitud.descidentificacion = this._Receta.recetipdocpacglosa;
                      this.dataPacienteSolicitud.apepaternopac = this._Receta.cliapepaterno;
                      this.dataPacienteSolicitud.apematernopac = this._Receta.cliapematerno;
                      this.dataPacienteSolicitud.nombrespac    = this._Receta.clinombres;
                      this.dataPacienteSolicitud.codambito     = this._Receta.receambito;
                      this.codambito = this._Receta.receambito;
                      this.dataPacienteSolicitud.ctaid         = this._Receta.recectaid;
                      this.dataPacienteSolicitud.codservicioactual = this._Receta.rececodservicio;
                      this.dataPacienteSolicitud.undglosa      = this._Receta.receglosaunidad;
                      this.dataPacienteSolicitud.camglosa      = this._Receta.receglosacama;
                      this.dataPacienteSolicitud.pzagloza      = this._Receta.receglosapieza;
                      this.dataPacienteSolicitud.tipodocprof   = this._Receta.recetipdocprof;
                      this.dataPacienteSolicitud.numdocprof    = this._Receta.recedocumprof;
                      this.dataPacienteSolicitud.nombremedico  = this._Receta.recenombremedico;
                      this.dataPacienteSolicitud.estid         = this._Receta.pestid;
                      this.dataPacienteSolicitud.solirecetipo  = this._Receta.recetipo;
                      this.dataPacienteSolicitud.receid        = this._Receta.receid;
                      this.dataPacienteSolicitud.numeroreceta  = this._Receta.receid;
                      this.dataPacienteSolicitud.cuentanumcuenta = this._Receta.ctanumcta.toString();

                      this.arrdetalleSolicitudMed.unshift(detreceta);
                      this.arrdetalleSolicitud.unshift(detreceta);
                      this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0,20);
                    });
                  }

                  this.arrdetalleSolicitudMed_aux = this.arrdetalleSolicitudMed;
                  this.arrdetalleSolicitudMedMOD = this.arrdetalleSolicitudMed;
                  this.arrdetalleSolicitudMedPaginacion_aux = this.arrdetalleSolicitudMedPaginacion
                  this.ActivaBotonBuscaGrilla = true;
                  if(this.FormDatosPaciente.controls.bodcodigo.value>0){
                    this.LoadComboLotesGrillaCompleta();
                  }

                  if(this.FormDatosPaciente.controls.bodcodigo.value != null){
                    this.nuevasolicitud = true;
                  }
                  this.recetaactiva = true;
                  this.loading = false;
                }
                this._RecetaMOD = this._Receta;
                if(this._RecetaMOD.recetadetalle != null){
                  this._RecetaMOD.recetadetalle.forEach(element => {
                    element.acciond = 'M';
                  });
                }
                if(this._Receta.bandera === 2){
                  this.verificanull = true;
                  this.btnDispensar = true;
                  this.agregarproducto = false;
                  this.FormDatosPaciente.disable();
                  if(this.arrdetalleSolicitudMed != null){
                    this.arrdetalleSolicitudMed.forEach(x=>{
                      x.bloqcampogrilla = false;
                      x.bloqcampogrilla3 = false;
                      x.bloqcampogrilla4 = false;
                    });
                  }
                  this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice( 0,20);
                  this.alertSwalAlert.title = "Receta en preparación";
                  this.alertSwalAlert.text = "No puede ser modificada";


                  this.alertSwalAlert.show();

                  this.logicaBodega();

                  this.desactivaAccion();

                }else{
                  this.ValidaEstadoSolicitud(2,'CargaPacienteReceta');

                  this.activaAccion();

                }

                if(this._Receta.recesubreceta === 0){
                  this.alertSwalAlert.title = "La receta no puede ser modificada";
                  this.alertSwalAlert.show();
                  this.FormDatosPaciente.disable();
                  this.arrdetalleSolicitudMed.forEach(x=>{
                    x.bloqcampogrilla = false;
                  })
                  this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0,20);

                  this.logicaBodega();

                  this.desactivaAccion();

                }
              }
            }
          }
          this.logicaEstadosreceta();
          this.loading = false;

          this.logicaVacios();
      },
      error => {
        this.alertSwalError.title = "Error al Buscar Receta";
        this.alertSwalError.text = "Se ha producido un error al buscar las recetas";
        this.alertSwalError.show();
        this.loading = false;

      });

  }

  ValidaEstadoSolicitud(bandera: number, nada:string){
    var recetaid : number = 0;
    var soliid   : number = 0;
    if(this.dataPacienteSolicitud != undefined){
      if(this.dataPacienteSolicitud.soliid === undefined){
        soliid = 0;
      }else{
        soliid = this.dataPacienteSolicitud.soliid;
      }
    } else {
      soliid = 0;
    }

    if(this._Receta != undefined){
      if(this._Receta.receid === undefined){
        recetaid = 0;
      }else{
        recetaid = this._Receta.receid;
      }
    } else {
      recetaid = 0;
    }

    this._solicitudService.ValidaEstadoSolicitudCargada(soliid,0,this.servidor,
      ' ',recetaid,bandera).subscribe(
      response => { });
  }

  BuscaBodegaSolicitante() {
    this._BodegasService.listaBodegaDespachoReceta(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor).subscribe(
      response => {
        if (response != null){
          this.bodegasSolicitantes = response;
        }
      },
      error => {
        alert("Error al Buscar Bodegas de cargo");
      }
    );
  }

  BuscaListaCobros() {
    this._BodegasService.listaCobros(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor).subscribe(
      response => {
        if (response != null){
          this.listacobros = response;
        }
      },
      error => {
        alert("Error al Buscar Bodegas de cargo");
      }
    );
  }

  SeleccionaBodegaActivaBtnAgregar(bodcodigo: number) {
    if (this._Receta != undefined) {
      if (this._Receta.cajanumerocomprobante === 0 && this.dataPacienteSolicitud.cuentanumcuenta === '0') {
        if(this.ambulatorio === true){
          this.FormDatosPaciente.controls.retiro.enable();
          this.agregarproducto = false;
        }else{
          this.agregarproducto = true;
        }
      }else{
        if(this.ambulatorio === true){
          this.FormDatosPaciente.controls.retiro.enable();
          this.agregarproducto = false;
        }else{
          this.agregarproducto = true;
        }
        this.LoadComboLotesGrillaCompleta();
      }
    } else {
      this.agregarproducto = true;
    }

    if (this.dataPacienteSolicitud.cuentanumcuenta > '0' && this._Solicitud !== null){
      if(this.ambulatorio === true){
        this.FormDatosPaciente.controls.retiro.enable();
        this.agregarproducto = false;
      }else{
        this.agregarproducto = true;
      }
    }

    if(this.recetaactiva == true){
      this.nuevasolicitud = true;
    }else{
      if(this.recetaactiva == false){
        this.nuevasolicitud = false;
      }
    }

    /** asigna código bodega para usar logica bodegas */
    this.codbodega = bodcodigo;
    this.logicaBodega();
    this.logicaVacios();

  }

  SeleccionaRetiro(retiro: string){
    if(retiro === '1'){
      this.FormDatosPaciente.controls.rutretira.disable();
      this.FormDatosPaciente.controls.nombreretira.disable();
      this.FormDatosPaciente.controls.tipodocumentoretira.disable();
      this.FormDatosPaciente.get('tipodocumentoretira').setValue(null);
      this.FormDatosPaciente.get('rutretira').setValue(null);
      this.FormDatosPaciente.get('nombreretira').setValue(null);
      this.logicaVacios();
    }else{
      if(retiro === '2'){
        this.FormDatosPaciente.controls.tipodocumentoretira.enable();
        this.FormDatosPaciente.controls.rutretira.enable();
        this.FormDatosPaciente.controls.nombreretira.enable();
        this.logicaVacios();
      }
    }

  }

  SeleccionaTipodocRetira(){
    this.logicaVacios();
    this.FormDatosPaciente.controls.rutretira.enable();
  }

  IngresoRutRetira(){
    this.FormDatosPaciente.controls.nombreretira.enable();
    this.validaRut();
    this.logicaVacios();
  }

  IngresoNombreRetira(){
    this.logicaVacios();
  }

  LoadComboLotesGrillaCompleta(){
    this.alertSwalAlert.title = null;
    this.alertSwalAlert.text = null;
    this.arrdetalleSolicitudMed.forEach(element => {
      this._buscasolicitudService.BuscaLotesProductosxBod(this.servidor, this.hdgcodigo, this.esacodigo,
      this.cmecodigo, element.codmei,0,  this.FormDatosPaciente.controls.bodcodigo.value  ).subscribe(
        response => {
          if (response == undefined || response=== null || response.length == 0){
            element.detallelote = [];
            element.lote = null;
            element.fechavto = null;
            element.bloqcampogrilla2 = false;
            this.logicaVacios();
          } else {
            element.detallelote = response

            if(response.length ===1){
              element.lote = response[0].lote;
              element.fechavto = response[0].fechavto;
              element.lote = response[0].lote;
              element.fechavto = response[0].fechavto;
              element.bloqcampogrilla2 = false;
              this.logicaVacios();
            }
            this.detalleslotes = response;
            if (response.length > 1) {
              element.bloqcampogrilla2 = true;
              this.logicaVacios();
            }

            if(this.ambulatorio === true){
              this.agregarproducto = false;

            }else{
              this.agregarproducto = true;

            }

          }
        }
      )
    });
  }

  async setLote(value: string, indx: number, detalle: DetalleSolicitud ) {

    this.alertSwalAlert.title = null;
    this.alertSwalAlert.text = null;
    const fechaylote = value.split('/');
    const fechav = fechaylote[0];
    const loteprod = fechaylote[1];
    const cantidad = fechaylote[2];
    const codmei = fechaylote[3];
    this.arrdetalleSolicitudMed[indx].fechavto = fechav;
    this.arrdetalleSolicitudMed[indx].lote = loteprod;

    await detalle.detallelote.forEach(dat=>{
      if(this.arrdetalleSolicitudMed[indx].codmei == dat.codmei && this.arrdetalleSolicitudMed[indx].lote== dat.lote && this.arrdetalleSolicitudMed[indx].fechavto== dat.fechavto){
        if(detalle.cantadespachar > dat.cantidad){
          this.alertSwalAlert.title ="La cantidad a despachar es mayor al saldo del lote "+ this.arrdetalleSolicitudMed[indx].lote +", "+ this.arrdetalleSolicitudMed[indx].fechavto;
          this.alertSwalAlert.text = "El saldo del lote tiene "+ dat.cantidad;
          this.alertSwalAlert.show();

          this.arrdetalleSolicitudMed.forEach(dt=>{
            if(detalle.codmei == dt.codmei && detalle.lote== dt.lote && detalle.fechavto== dt.fechavto){

              this._buscasolicitudService.BuscaLotesProductosxBod(this.servidor, this.hdgcodigo, this.esacodigo,
                this.cmecodigo, dt.codmei,0,  this.FormDatosPaciente.controls.bodcodigo.value  ).subscribe(
                  response => {
                    if (response == undefined || response=== null || response.length ==0){
                      this.arrdetalleSolicitudMed[indx].detallelote = null;
                      this.arrdetalleSolicitudMedPaginacion[indx].detallelote = this.arrdetalleSolicitudMed[indx].detallelote;
                      this.arrdetalleSolicitudMed[indx].fechavto = null;
                    }
                    else {
                      if (response.length >= 1) {
                        if(detalle.codmei == dat.codmei && detalle.lote == dat.lote && detalle.fechavto == dat.fechavto){
                          this.arrdetalleSolicitudMed[indx].detallelote = response;
                          this.arrdetalleSolicitudMedPaginacion[indx].detallelote = this.arrdetalleSolicitudMed[indx].detallelote;
                          this.arrdetalleSolicitudMed[indx].fechavto = null;
                        }
                      }
                    }
                  }
                )
            }
          })
        }else{
          this.arrdetalleSolicitudMed.forEach(element=>{

            if(detalle.codmei == element.codmei && loteprod== element.lote && fechav== element.fechavto){

              this.alertSwalAlert.title ="El  lote "+detalle.lote +" ya existe en la grilla, seleccione otro.";
              this.alertSwalAlert.text = "Si el producto tiene un solo lote, debe eliminar producto de la grilla"
              this.alertSwalAlert.show();
              this._buscasolicitudService.BuscaLotesProductosxBod(this.servidor, this.hdgcodigo, this.esacodigo,
                this.cmecodigo, detalle.codmei,0,  this.FormDatosPaciente.controls.bodcodigo.value  ).subscribe(
                  response => {
                    if (response == undefined || response=== null || response.length ==0){
                      this.arrdetalleSolicitudMed[indx].detallelote = null;
                      this.arrdetalleSolicitudMedPaginacion[indx].detallelote = this.arrdetalleSolicitudMed[indx].detallelote;
                      this.arrdetalleSolicitudMed[indx].fechavto = null;
                    }
                    else {
                      if (response.length >= 1) {

                        if(detalle.codmei == dat.codmei && detalle.lote == dat.lote && detalle.fechavto == dat.fechavto){
                          this.arrdetalleSolicitudMed[indx].detallelote = response;
                          this.arrdetalleSolicitudMedPaginacion[indx].detallelote = this.arrdetalleSolicitudMed[indx].detallelote;
                          this.arrdetalleSolicitudMed[indx].fechavto = null;

                        }
                      }
                    }
                  }
                )
            }else{
              return -1;
            }
              })
            }
          }
    })

  }

  cambiaLotemedicamento(value: string, indx: number,detalle: DetalleSolicitud) {

    this.alertSwalAlert.title = null;
    this.alertSwalAlert.text = null;
    const fechalote = value.split('/');
    const fechav = fechalote[0];
    const loteprod = fechalote[1];
    const cantidad = fechalote[2];
    const codmei = fechalote[3];
    this.validaLotemedicamento(loteprod, codmei,fechav,detalle.detallelote).then( async(res) =>{
      if(res) {
        this.arrdetalleSolicitudMed[indx].fechavto = fechav;
        this.arrdetalleSolicitudMed[indx].lote = loteprod;
        this.arrdetalleSolicitudMed[indx].stockorigen = parseInt(cantidad);
        await this.logicaVacios();
        if(detalle.cantadespachar > detalle.cantsoli-detalle.cantdespachada){
          if(loteprod !=""){
            this.arrdetalleSolicitudMed[indx].cantadespachar = this.arrdetalleSolicitudMed[indx].cantadespacharresp;
            this.arrdetalleSolicitudMedPaginacion[indx].cantadespachar = this.arrdetalleSolicitudMed[indx].cantadespachar;
            this.alertSwalAlert.title = "Cantidad a despachar es mayor a cantidad pendiente";
            this.alertSwalAlert.show();
            this.logicaVacios();
          }
        }else{
          if(detalle.cantadespachar <0){
            if(loteprod !=""){

              this.arrdetalleSolicitudMed[indx].cantadespachar = this.arrdetalleSolicitudMed[indx].cantadespacharresp;
              this.arrdetalleSolicitudMedPaginacion[indx].cantadespachar = this.arrdetalleSolicitudMed[indx].cantadespachar;
              this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
              this.alertSwalAlert.show();
            }
          }

          if(detalle.cantadespachar > parseInt(cantidad)){
            if(loteprod != ""){
              this.alertSwalAlert.title ="La cantidad a despachar es mayor al saldo del lote";
              this.alertSwalAlert.text = "El saldo del lote "+detalle.lote+" tiene "+ cantidad +", ingresar cantidad menor";
              this.alertSwalAlert.show();
              this._solicitudService.BuscaLotesProductosxBod(this.servidor, this.hdgcodigo, this.esacodigo,
                this.cmecodigo, codmei, 0,  this.FormDatosPaciente.controls.bodcodigo.value   ).subscribe(
                response => {
                  if (response == undefined || response=== null){
                    this.arrdetalleSolicitudMed[indx].detallelote = [];
                  }else {
                    this.arrdetalleSolicitudMed[indx].detallelote = [];
                    this.arrdetalleSolicitudMed[indx].detallelote = response;
                    this.arrdetalleSolicitudMed[indx].lote = response[0].lote;
                    this.arrdetalleSolicitudMed[indx].fechavto = response[0].fechavto;
                    this.arrdetalleSolicitudMed[indx].stockorigen = response[0].cantidad;
                    this.logicaVacios();
                  }
                }
              );

            }
          }
        }
      }else {

        let codigo_bodega_lote = this.FormDatosPaciente.controls.bodcodigo.value;
        this._solicitudService.BuscaLotesProductosxBod(this.servidor, this.hdgcodigo, this.esacodigo,
        this.cmecodigo, codmei, 0,  codigo_bodega_lote  ).subscribe(
        response => {
          if (response == undefined || response=== null){
            this.arrdetalleSolicitudMed[indx].detallelote = [];
            }else {

              this.arrdetalleSolicitudMed[indx].detallelote = [];
              this.arrdetalleSolicitudMed[indx].detallelote = response;
              this.arrdetalleSolicitudMed[indx].lote = response[0].lote;
              this.arrdetalleSolicitudMed[indx].fechavto = response[0].fechavto;
              this.arrdetalleSolicitudMed[indx].stockorigen = response[0].cantidad;
              this.logicaVacios();
            }
        });
        return;
      }
    });
  }

  async validaLotemedicamento(lote: string, codmei: string,fechavto: string,detallelote: any) {

    this.alertSwalAlert.title = null;
    this.alertSwalAlert.text = null;
    let validaok = false;
    for(let d of this.arrdetalleSolicitudMed) {
      if(d.codmei === codmei && d.lote === lote && d.fechavto === fechavto) {

        this.alertSwalAlert.title = `El Lote  ${d.lote} ya existe en la grilla`;
        this.alertSwalAlert.text = `Seleccione otro lote disponible`;
        this.alertSwalAlert.show();
        validaok = false;

        break;
      }
      else {
        validaok = true;

      }
    }
    return validaok;
  }

  datosUsuario() {
    var datosusuario = new DevuelveDatosUsuario();
    datosusuario = JSON.parse(sessionStorage.getItem('Login'));
    this.hdgcodigo = datosusuario[0].hdgcodigo;
    this.esacodigo = datosusuario[0].esacodigo;
    this.cmecodigo = datosusuario[0].cmecodigo;
  }

  CargaPacienteSolicitud(soliid: number,codambito: number) {
    let indice = 0;
    indice = 0;
    this._solicitudService.BuscaSolicitud(soliid, this.hdgcodigo,this.esacodigo, this.cmecodigo, 0, null,
    null, 0, 0, null, this.servidor,0, codambito, 0, 0, 0, 0, null,70,"","").subscribe((Retorno: any) => {

      this.dataPacienteSolicitud = Retorno[0];
      this._Solicitud = Retorno[0];
      this.existsolicitud = true;
      this.agregarproducto = true;
      this.btnmodificar = true;
      this.modificable = false;

      this.bandera_aux = this._Solicitud.bandera;
      this.FormDatosPaciente.get('estado').setValue(this.dataPacienteSolicitud.estadosolicitud);
      this.FormDatosPaciente.get('tipodocumento').setValue(this.dataPacienteSolicitud.glstipidentificacion);
      this.FormDatosPaciente.get('numidentificacion').setValue(this.dataPacienteSolicitud.numdocpac);
      this.FormDatosPaciente.get('nombrepaciente').setValue(this.dataPacienteSolicitud.apepaternopac.concat(" ")
        .concat(this.dataPacienteSolicitud.apematernopac).concat(" ")
        .concat(this.dataPacienteSolicitud.nombrespac));
      this.FormDatosPaciente.get('sexo').setValue(this.dataPacienteSolicitud.glsexo);
      this.FormDatosPaciente.get('edad').setValue(this.dataPacienteSolicitud.edad);
      this.FormDatosPaciente.get('numsolicitud').setValue(this.dataPacienteSolicitud.soliid);
      this.FormDatosPaciente.get('numeroreceta').setValue(this.dataPacienteSolicitud.numeroreceta);
      this.FormDatosPaciente.get('numeroboleta').setValue(this.dataPacienteSolicitud.boleta);
      this.FormDatosPaciente.get('comprobantecaja').setValue(this.dataPacienteSolicitud.comprobantecaja);
      this.FormDatosPaciente.get('estadocomprobantecaja').setValue(this.dataPacienteSolicitud.estadocomprobantecaja);
      this.FormDatosPaciente.get('entrega').setValue(this.dataPacienteSolicitud.diasentregacodigo);
      this.FormDatosPaciente.get('bodcodigo').setValue(this.dataPacienteSolicitud.bodorigen);
      this.FormDatosPaciente.get('numidentificacionmedico').setValue(this.dataPacienteSolicitud.numdocprof);
      this.FormDatosPaciente.get('nombremedico').setValue(this.dataPacienteSolicitud.nombremedico);
      this.FormDatosPaciente.get('numcuenta').setValue(this.dataPacienteSolicitud.cuentanumcuenta);
      this.FormDatosPaciente.get('fechahora').setValue(new Date(this.dataPacienteSolicitud.fechacreacion));
      switch (this.dataPacienteSolicitud.codambito) {
        case 1:
          this.codambito = this.dataPacienteSolicitud.codambito;
          this.glsambito = 'Ambulatorio';
          this.logicaReambulatorio();
          break;
        case 2:
          this.codambito = this.dataPacienteSolicitud.codambito;
          this.glsambito = 'Urgencia';
          break;
        case 3:
          this.codambito = this.dataPacienteSolicitud.codambito;
          this.glsambito = 'Hospitalario';
          break;
        default:
          this.glsambito = ''
          break;
      }
      if (this.dataPacienteSolicitud.recetaentregaprog == "S") {
        this.FormDatosPaciente.get('marcacheck').setValue(true);
        let indx = this.dataPacienteSolicitud.solicitudesdet.findIndex(t=>{t.marcacheckgrilla === false ,1})

      }
      this.loading = false;
      if(this.dataPacienteSolicitud.estadosolicitud == 50){
        /** desactiva btn eliminar */
        this.tiporeceta = 'Total';
        this.FormDatosPaciente.get('bodcodigo').disable();
        this.bloqueacamposgrilla = false;
        this.bloqueacamposgrilla2 = false;
        this.btneliminagrilla = false;

      }else{
        this.tiporeceta = null;
        this.bloqueacamposgrilla = false;
        this.bloqueacamposgrilla2 = true;
        this.btneliminagrilla = false;

      }

      this.dataPacienteSolicitud.solicitudesdet.forEach(element => {
        if(this.dataPacienteSolicitud.recetaentregaprog == "S"){
          this.bloqueacamposgrilla = false;
          element.marcacheckgrilla = false;

        }else{
          if(this.dataPacienteSolicitud.recetaentregaprog == "N"){
            this.bloqueacamposgrilla = true;

          }
        }
        if(this.dataPacienteSolicitud.estadosolicitud == 40){
          this.tiporeceta = 'Parcial';
          element.bloqcampogrilla = false;
          element.marcacheckgrilla = false;
        }

        element.cantadespachar = element.cantsoli - element.cantdespachada;
        element.cantadespacharresp = element.cantadespachar;
        element.detallelote.forEach(dl=>{

          element.lote = dl.lote;
          element.fechavto = dl.fechavto;
        })
        if (element.tiporegmein == "M") {
          if (element.recetaentregaprogdet == "S") {
            element.marcacheckgrilla = true;
          }

          this.arrdetalleSolicitudMed.unshift(element);
          this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0, 20);

          this.arrdetalleSolicitudMed_aux = this.arrdetalleSolicitudMed;
          this.arrdetalleSolicitudMedPaginacion_aux = this.arrdetalleSolicitudMedPaginacion;

          this.ActivaBotonBuscaGrilla = true;

          this.logicaBodega();

        } else {
          if (element.tiporegmein == "I") {
            this.arrdetalleSolicitudIns.unshift(element);
            this.arrdetalleSolicitudInsPaginacion = this.arrdetalleSolicitudIns.slice(0, 20);
          }
        }
        this.arrdetalleSolicitud = this.arrdetalleSolicitudMed
        this.logicaVaciosModifica();
        this.logicaVacios();
      });
      if (this.dataPacienteSolicitud.bodorigen > 0) {
        this.SeleccionaBodegaActivaBtnAgregar(this.dataPacienteSolicitud.bodorigen);
        this.bodegaisnull(this.dataPacienteSolicitud.bodorigen);


      }
      if (this.dataPacienteSolicitud.soliid > 0){
        this.FormDatosPaciente.disable();
      }

      if(this.dataPacienteSolicitud.bandera === 2){
        this.verificanull = false;
        this.FormDatosProducto.disable();
        if(this.arrdetalleSolicitudMed.length >0){
          this.arrdetalleSolicitudMed.forEach(x=>{
            x.bloqcampogrilla = false;
            x.bloqcampogrilla2 = false;
          })
          this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed;
          this.alertSwalAlert.title = "Solicitud en preparación";
          this.alertSwalAlert.text = "No puede ser modificada";

          this.alertSwalAlert.show();

          this.logicaBodega();

          this.desactivaAccion();

        }

      }else{
        this.ValidaEstadoSolicitud(2,'BuscaSolicitudes');

        this.activaAccion();

      }
    });
  }

  async getParametros() {
    try {
      this.loading = true;
      this.docsidentis = await this.DocidentificacionService.list(this.usuario, this.servidor)
        .toPromise();
      this.tipoambitos = await this._tipoambitoService.list(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor)
        .toPromise();
      this.estadosolicitudes = await this._estadosolicitudesService.list(this.usuario, this.servidor)
        .toPromise();
      this.estadorecetasprogs = await this._estadosolicitudesService.EntregaRecetaProg(this.usuario, this.servidor)
        .toPromise();
    } catch (err) {
      this.loading = false;
      this.uimensaje('danger', err.message, 7000);
    }
    this.loading = false;
  }

  cambio_check(texto: string, evento: any) {
    if (evento.target.checked == true) {
      this.activacomboentrega = true;
    } else {
      if (evento.target.checked == false) {

        this.activacomboentrega = false;
        this.FormDatosPaciente.value.entrega = null;
      }
    }

  }

  SeleccionaCombo(evento: any, entrega: number) {
    if (entrega == 1) {
      this.cantentregas = 2;
      this.diasentrega = 30;
    } else {
      if (entrega == 2) {
        this.cantentregas = 3;
        this.diasentrega = 60;
      } else {
        if (entrega == 3) {
          this.cantentregas = 4;
          this.diasentrega = 90;
        } else {
          if (entrega == 4) {
            this.cantentregas = 5;
            this.diasentrega = 120;
          }
        }
      }
    }
  }

  async cargaSolicitud(soliid: number) {
    this.arrdetalleSolicitud = [];
    this.arrdetalleSolicitudIns = [];
    this.arrdetalleSolicitudInsPaginacion = [];
    this.arrdetalleSolicitudMed = [];
    this.arrdetalleSolicitudMedPaginacion = [];
    this.cantidad++;
    this.loading = true;

    this.IDSol = soliid;

    this._solicitudService.BuscaSolicitud(this.IDSol, this.hdgcodigo,
      this.esacodigo, this.cmecodigo, 0, null, null, 0, 0, null, this.servidor,
      0, this.dataPacienteSolicitud.codambito, 0, 0, 0, 0, null,70,"","").subscribe(
        response => {
          if(response != null){
            this.dataPacienteSolicitud = response[0];

            this.loading = false;
            this.existpaciente = true;//Habilita boton Producto
            this.existsolicitud = true;
            this.btneliminagrilla = false;
            this.nuevasolicitud = false;
            this.btnimprime = true;
            this.bandera_aux = this.dataPacienteSolicitud.bandera;
            this.FormDatosPaciente.get('estado').disable();
            this.FormDatosPaciente.get('estado').setValue(this.dataPacienteSolicitud.estadosolicitud);
            this.arrdetalleSolicitud = this.dataPacienteSolicitud.solicitudesdet;
            this.FormDatosPaciente.get('numsolicitud').setValue(this.dataPacienteSolicitud.soliid);
            this.FormDatosPaciente.get('numeroreceta').setValue(this.dataPacienteSolicitud.numeroreceta);
            this.FormDatosPaciente.get('numeroboleta').setValue(this.dataPacienteSolicitud.boleta);
            this.FormDatosPaciente.get('comprobantecaja').setValue(this.dataPacienteSolicitud.comprobantecaja);
            this.FormDatosPaciente.get('estadocomprobantecaja').setValue(this.dataPacienteSolicitud.estadocomprobantecaja);
            this.FormDatosPaciente.get('entrega').setValue(this.dataPacienteSolicitud.diasentregacodigo);
            this.FormDatosPaciente.get('bodcodigo').setValue(this.dataPacienteSolicitud.bodorigen);
            this.FormDatosPaciente.get('numcuenta').setValue(this.dataPacienteSolicitud.cuentanumcuenta);
            this.FormDatosPaciente.get('fechahora').setValue(new Date(this.dataPacienteSolicitud.fechacreacion));
            this.FormDatosPaciente.controls.numeroreceta.disable();
            if (this.dataPacienteSolicitud.recetaentregaprog == "S") {
              this.FormDatosPaciente.get('marcacheck').setValue(true);
              this.colLoteprod = false;
              this.coladispensar = false;
            } else {
              this.colLoteprod = true;
              this.coladispensar = true;
            }

            if(this.dataPacienteSolicitud.estadosolicitud == 50){
              this.tiporeceta = 'Total';
              this.bloqueacamposgrilla = false;
              this.bloqueacamposgrilla2 = false;
              this.btnmodificar = false;
              this.agregarproducto = false;
              this.verificanull = false;
              this.FormDatosPaciente.disable();
              this.arrdetalleSolicitudMed.forEach(x=>{
                x.bloqcampogrilla = false;
                x.bloqcampogrilla3 = false;
              })
              this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice( 0,20);

              this.logicaBodega();

            }
            if(this.dataPacienteSolicitud.estadosolicitud == 40){
              this.tiporeceta = 'Parcial';
              this.btnmodificar = true;
              this.bloqueacamposgrilla = false;
              this.bloqueacamposgrilla2 = true;
            }else{
              this.bloqueacamposgrilla = true;
              this.bloqueacamposgrilla2 = true;
            }
            if(this.FormDatosPaciente.controls.estado.value === 10){
              this.logicaVacios();
            }

            this.loading = false;
            this.arrdetalleSolicitud.forEach(element => {
              element.cantadespachar = element.cantsoli - element.cantdespachada;
              element.cantadespacharresp = element.cantadespachar;
              if(this.dataPacienteSolicitud.estadosolicitud == 40){
                this.tiporeceta = 'Parcial';
                element.bloqcampogrilla = false;
                element.marcacheckgrilla = false;
              }
              element.detallelote.forEach(dl=>{

                element.lote = dl.lote;
                element.fechavto = dl.fechavto;
              })

              if (element.tiporegmein == "M") {
                if (element.recetaentregaprogdet == "S") {
                  element.cantadespachar = 0;
                  element.cantadespacharresp = element.cantadespachar;
                  element.bloqcampogrilla2 = false;

                }
                this.arrdetalleSolicitudMed.push(element);
                this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0,20);
                this.arrdetalleSolicitudMed_aux = this.arrdetalleSolicitudMed;
                this.arrdetalleSolicitudMedPaginacion_aux = this.arrdetalleSolicitudMedPaginacion;

                this.logicaBodega();

              } else {
                if (element.tiporegmein == "I") {
                  element.cantadespachar = element.cantsoli - element.cantdespachada;
                  this.arrdetalleSolicitudIns.push(element);
                  this.arrdetalleSolicitudInsPaginacion = this.arrdetalleSolicitudIns.slice(0, 20);
                }
              }
              this.ActivaBotonBuscaGrilla = true;
            });
            if (this.FormDatosPaciente.controls.bodcodigo.value > 0
            && (this.FormDatosPaciente.controls.numsolicitud.value === undefined
              || this.FormDatosPaciente.controls.numsolicitud.value === null)) {
              this.LoadComboLotesGrillaCompleta();
              this.FormDatosPaciente.controls.bodcodigo.disable();
            }
            if (this.dataPacienteSolicitud.soliid > 0){
              this.FormDatosPaciente.disable();
            }

            if(this.dataPacienteSolicitud.bandera === 2){
              this.verificanull = false;
              this.agregarproducto = false;
              this.arrdetalleSolicitudMed.forEach(x=>{
                x.bloqcampogrilla = false;
                x.bloqcampogrilla3 = false;
              })
              this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice( 0,20);
              this.alertSwalAlert.title = "Solicitud en preparación";
              this.alertSwalAlert.text = "No puede ser modificada";

              this.alertSwalAlert.show();

              this.logicaBodega();

              this.desactivaAccion();

              this.logicaEstadosreceta();

            }else{
              this.ValidaEstadoSolicitud(2,'cargaSolicitud');

              this.activaAccion();

            }
          }else{

          }

          this.logicaVacios();
        },
        error => {
          this.loading = false;
          this.alertSwalError.title = "Error: Carga Solicitud ( "+this.cantidad+" )";
          this.alertSwalError.text = error.message;
          this.alertSwalError.show();
        });
  }

  BuscarSolicitud() {
    var pasoparemetro: string;
    pasoparemetro = this.FormDatosPaciente.get("nombrepaciente").value;
    if(this.bandera_aux != undefined){
      if(this.bandera_aux === 1){  //Si bandera es =2 solicitud tomada
        this.ValidaEstadoSolicitud(1,'BuscaSolicitudes');
      }
    }
    this._BSModalRef = this._BsModalService.show(BusquedaSolicitudPacienteAmbulatorioComponent, this.setModal("Busqueda Solicitudes Paciente: ".concat(pasoparemetro)));
    this._BSModalRef.content.onClose.subscribe((Retorno: any) => {
      if (Retorno !== undefined) {
        this.existsolicitud = true;
        this.agregarproducto = true;
        this.cargaSolicitud(Retorno.soliid);
      }else{
        this.ValidaEstadoSolicitud(2,'BuscaSolicitudes');
      }
    })
  }

  BuscarPaciente() {
    this.arrdetalleSolicitudMed = [];
    this.arrdetalleSolicitudMedPaginacion = [];
    this.arrdetalleSolicitud = [];
    this.arrdetalleSolicitudPaginacion =[];

    this._BSModalRef = this._BsModalService.show(BusquedapacientesComponent, this.setModal("Busqueda de Paciente"));
    this._BSModalRef.content.onClose.subscribe(async (Retorno: any) => {
      if (Retorno !== undefined) {

        this.FormDatosPaciente.reset();
        this.FormDatosPaciente.controls["estadocomprobantecaja"].setValue(10);
        this.FormDatosPaciente.get('fechahora').setValue(new Date());
        this.FormDatosPaciente.controls["estado"].setValue(10);

        switch (Retorno.codambito) {
          case 1:
            this.glsambito = 'Ambulatorio';
            this.codambito = Retorno.codambito;
            this.ambito = false;

            this.logicaReambulatorio();

            this.dataPacienteSolicitud = new Solicitud();
            this.FormDatosPaciente.controls.bodcodigo.enable();
            this.dataPacienteSolicitud.cliid = Retorno.cliid;
            this.dataPacienteSolicitud.tipodocpac = Retorno.tipoidentificacion;
            this.dataPacienteSolicitud.numdocpac = Retorno.docuidentificacion;
            this.dataPacienteSolicitud.descidentificacion = Retorno.descidentificacion;
            this.dataPacienteSolicitud.apepaternopac = Retorno.apepaternopac;
            this.dataPacienteSolicitud.apematernopac = Retorno.apematernopac;
            this.dataPacienteSolicitud.nombrespac = Retorno.nombrespac;
            this.dataPacienteSolicitud.codambito = 1;
            this.dataPacienteSolicitud.edad = Retorno.edad;
            this.dataPacienteSolicitud.codsexo = Retorno.codsexo;
            this.dataPacienteSolicitud.ppnpaciente = Retorno.cliid;
            this.dataPacienteSolicitud.ctaid = Retorno.ctaid;
            this.dataPacienteSolicitud.estid = Retorno.estid;
            this.dataPacienteSolicitud.glsexo = Retorno.glsexo;
            this.dataPacienteSolicitud.solirecetipo = 'MANUAL';
            this.dataPacienteSolicitud.glstipidentificacion = Retorno.glstipidentificacion;
            this.FormDatosPaciente.get('tipodocumento').setValue(this.dataPacienteSolicitud.descidentificacion);
            this.FormDatosPaciente.get('numidentificacion').setValue(this.dataPacienteSolicitud.numdocpac);
            this.FormDatosPaciente.get('nombrepaciente').setValue(this.dataPacienteSolicitud.apepaternopac.concat(" ")
            .concat(this.dataPacienteSolicitud.apematernopac).concat(" ")
            .concat(this.dataPacienteSolicitud.nombrespac));
            this.FormDatosPaciente.get('sexo').setValue(this.dataPacienteSolicitud.glsexo);
            this.FormDatosPaciente.get('edad').setValue(this.dataPacienteSolicitud.edad);
            if( this.FormDatosPaciente.controls.numsolicitud.value > 0){
              this.activabtnbuscaprof = false;
            } else {
              this.activabtnbuscaprof = true;
            }
            break;
          case 2:
            this.glsambito = 'Urgencia';

            this.codambito = Retorno.codambito;

            this.ambito = true;

            this.dataPacienteSolicitud = new Solicitud();
            this.dataPacienteSolicitud.cliid = Retorno.cliid;
            this.FormDatosPaciente.controls.bodcodigo.disable();
            this.dataPacienteSolicitud.tipodocpac = Retorno.tipodocpac;
            this.dataPacienteSolicitud.numdocpac = Retorno.numdocpac;

            this.dataPacienteSolicitud.descidentificacion = Retorno.descidentificacion;
            this.dataPacienteSolicitud.apepaternopac = Retorno.apepaternopac;
            this.dataPacienteSolicitud.apematernopac =Retorno.apematernopac;
            this.dataPacienteSolicitud.nombrespac =  Retorno.nombrespac;
            this.dataPacienteSolicitud.codambito = 2;
            this.dataPacienteSolicitud.edad = Retorno.edad;
            this.dataPacienteSolicitud.codsexo = Retorno.codsexo;
            this.dataPacienteSolicitud.ppnpaciente = Retorno.cliid;
            this.dataPacienteSolicitud.ctaid = Retorno.ctaid;
            this.dataPacienteSolicitud.estid = Retorno.estid;
            this.dataPacienteSolicitud.glsexo = Retorno.glsexo;
            this.dataPacienteSolicitud.glstipidentificacion = Retorno.glstipidentificacion;
            this.dataPacienteSolicitud.cuentanumcuenta = Retorno.cuentanumcuenta;
            this.dataPacienteSolicitud.camglosa = Retorno.camglosa;
            this.dataPacienteSolicitud.undglosa = Retorno.undglosa;
            this.dataPacienteSolicitud.codservicioactual = Retorno.codservicioactual;
            this.dataPacienteSolicitud.solirecetipo = 'MANUAL';
            this.FormDatosPaciente.get('tipodocumento').setValue(Retorno.glstipidentificacion);
            this.FormDatosPaciente.get('numidentificacion').setValue(Retorno.numdocpac);
            this.FormDatosPaciente.get('nombrepaciente').setValue(this.dataPacienteSolicitud.apepaternopac.concat(" ")
              .concat(this.dataPacienteSolicitud.apematernopac).concat(" ")
              .concat(this.dataPacienteSolicitud.nombrespac));
            this.FormDatosPaciente.get('numcuenta').setValue(this.dataPacienteSolicitud.cuentanumcuenta);
            this.FormDatosPaciente.get('sexo').setValue(this.dataPacienteSolicitud.glsexo);
            this.FormDatosPaciente.get('edad').setValue(this.dataPacienteSolicitud.edad);
            this.FormDatosPaciente.get('pieza').setValue(this.dataPacienteSolicitud.camglosa);
            this.FormDatosPaciente.get('servicio').setValue(this.dataPacienteSolicitud.undglosa);
            this.FormDatosPaciente.get('bodcodigo').setValue(this.dataPacienteSolicitud.bodorigen);

            /** habilita campos medico, boton buscar y setea combo a rut */
            this.FormDatosPaciente.get('tipodocumentomed').setValue(1);
            this.habilitaMedico(true);
            this.getMedicoTipoDoc();
            if( this.FormDatosPaciente.controls.numsolicitud.value > 0){
              this.activabtnbuscaprof = false;
            } else {
              this.activabtnbuscaprof = true;
            }
            break;
          case 3:
            this.glsambito = 'Hospitalario';
            this.codambito = Retorno.codambito;
            this.ambito = true;
            this.pacientehosp = Retorno;

            this.dataPacienteSolicitud = new Solicitud();
            this.dataPacienteSolicitud = Retorno;
            this.FormDatosPaciente.controls.bodcodigo.disable();
            this.dataPacienteSolicitud.solirecetipo = 'MANUAL';
            this.dataPacienteSolicitud.codservicioactual = Retorno.codservicioactual;
            this.FormDatosPaciente.get('tipodocumento').setValue(this.dataPacienteSolicitud.glstipidentificacion);
            this.FormDatosPaciente.get('numidentificacion').setValue(this.dataPacienteSolicitud.numdocpac);
            this.FormDatosPaciente.get('nombrepaciente').setValue(this.dataPacienteSolicitud.apepaternopac.concat(" ")
              .concat(this.dataPacienteSolicitud.apematernopac).concat(" ")
              .concat(this.dataPacienteSolicitud.nombrespac));
            this.FormDatosPaciente.get('sexo').setValue(this.dataPacienteSolicitud.glsexo);
            this.FormDatosPaciente.get('edad').setValue(this.dataPacienteSolicitud.edad);
            this.FormDatosPaciente.get('numcuenta').setValue(this.pacientehosp.cuentanumcuenta);
            this.FormDatosPaciente.get('servicio').setValue(this.pacientehosp.undglosa);
            this.FormDatosPaciente.get('pieza').setValue(this.pacientehosp.pzagloza.concat(" ").concat(this.pacientehosp.camglosa));
            this.FormDatosPaciente.get('bodcodigo').setValue(this.pacientehosp.rececodbodega);

            await this.FormDatosPaciente.get('numidentificacionmedico').setValue(
              this.pacientehosp.numdocprof===null?this.pacientehosp.numdocprof:this.pacientehosp.numdocprof.trim());
            /** habilita campos medico, boton buscar y setea combo a rut */
            this.FormDatosPaciente.get('tipodocumentomed').setValue(1);
            this.habilitaMedico(true);
            this.getMedicoTipoDoc();

            if( this.FormDatosPaciente.controls.numsolicitud.value > 0){
              this.activabtnbuscaprof = false;
            } else {
              this.activabtnbuscaprof = true;
            }
            break;
          default:
            this.glsambito = ''
            break;
        }

        this.existpaciente = true;
        this.existsolicitud = false;
        this.nuevasolicitud = false;

      }else{
        this.ValidaEstadoSolicitud(2,'BuscaPacientes');
      }
    });
  }

  onBuscarProducto() {
    this.alertSwalAlert.text = null;
    this.alertSwalAlert.title = null;
    var validacodigo = false;
    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModal("Búsqueda de Productos"));
    this._BSModalRef.content.onClose.subscribe((RetornoProductos: any) => {
      if (RetornoProductos !== undefined) {
          this.articulos2 = RetornoProductos;
          if(this.FormDatosPaciente.controls.estado.value == 40){
            this.tiporeceta = 'Parcial';
            this.arrdetalleSolicitudMed.forEach(p=>{
              if(this.articulos2.codigo == p.codmei){
                validacodigo= true;
              }
            });
            if(validacodigo == true){
              this.bloqueacamposgrilla= true;
              this.bloqueacamposgrilla2 = true;
              this.btneliminagrilla = true;
              this.setArray(this.articulos2);
            }
            else{
              if(validacodigo == false){
                this.alertSwalAlert.text = "Debe agregar productos que ya existan en la solicitud ";
                this.alertSwalAlert.show();
              }
            }
          }else{
            this.bodegasSolicitantes.forEach(x=>{
              if(this.FormDatosPaciente.controls.bodcodigo.value === x.bodcodigo){
                this.bodegacontrolado = x.bodcontrolado;
                return;
              }
            })
            if(this.bodegacontrolado ==='N'){
              if(this.articulos2.controlado === 'N'){
                this.bloqueacamposgrilla= true;
                this.bloqueacamposgrilla2 = true;
                this.btncrea = true;
                this.FormDatosPaciente.controls.bodcodigo.disable();
                this.setArray(this.articulos2);
              }else{
                this.alertSwalAlert.title = "No puede ingresar medicamentos controlados";
                this.alertSwalAlert.show();
              }
            }else{
              if(this.bodegacontrolado ==='S'){
                if(this.articulos2.controlado === 'S'){
                  this.bloqueacamposgrilla= true;
                  this.bloqueacamposgrilla2 = true;
                  this.btncrea = true;
                  this.FormDatosPaciente.controls.bodcodigo.disable();
                  this.setArray(this.articulos2);
                }else{
                  this.alertSwalAlert.title = "Debe ingresar medicamentos controlados";
                  this.alertSwalAlert.show();
                }
              }
            }
          }

        if (this.existsolicitud == false) {
          this.nuevasolicitud = true;
        }
      }
      else {

      }
    });
  }

  EliminaProductoDeLaGrilla(registro: DetalleSolicitud, id: number) {
    if (registro.acciond == "I" && id >= 0 && registro.sodeid == undefined || registro.sodeid == 0) {
      // Eliminar registro nuevo la grilla
      this.arrdetalleSolicitudMed.splice(id, 1);
      this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0,20);
      this.arrdetalleSolicitud.splice(id, 1);

      this.logicaBodega();

    } else {
      if (registro.acciond == "E" && id >= 0 && registro.sodeid == undefined || registro.sodeid ==0) {
        this.arrdetalleSolicitudMed.splice(id, 1);
        this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0,20);
        this.arrdetalleSolicitud.splice(id, 1);

        this.logicaBodega();

      }else{
      // elimina uno que ya existe
      this.arrdetalleSolicitudMed[id].acciond = 'E';
      }
    }
    this.logicaVacios();
  }

   /* Calculo formulación grilla Productos*/
  setCantidadsolicitada(detalle: DetalleSolicitud) {
    this.alertSwalAlert.title = null;
    let dosis, dias, total: number = 0;
    dosis = detalle.dosis;
    dias = detalle.dias;
    total = dosis * detalle.formulacion;
    detalle.cantsoli = total * dias;
    if(dosis <0){
      this.alertSwalAlert.title = "La dosis debe ser mayor a 0";
      this.alertSwalAlert.show();
      detalle.dosis = 0;
    }
    if(dias < 0){
      this.alertSwalAlert.title = "Los días a ingresar deben ser mayor a 0";
      this.alertSwalAlert.show();
      detalle.dias = 0;
    }
    if(detalle.formulacion < 0){
      this.alertSwalAlert.title = "Las veces al día deben ser mayor a 0";
      this.alertSwalAlert.show();
      detalle.formulacion = 0;
    }
    if(detalle.cantsoli < 0){
      this.alertSwalAlert.title = "La cantidad a dispensar debe ser mayor a 0";
      this.alertSwalAlert.show();
    }

    if( detalle.detallelote != undefined ){
      if(detalle.detallelote.length !=0){

        detalle.detallelote.forEach(det=>{
          if(detalle.lote == det.lote && det.codmei == detalle.codmei && detalle.fechavto == det.fechavto){
            if(detalle.cantadespachar > det.cantidad){
              detalle.dosis = 0;
              detalle.formulacion = 0;
              detalle.dias = 0;
              detalle.cantsoli = 0;
              this.verificalote(detalle);
              this.errorMsg("El saldo del lote "+detalle.lote+" tiene "+ detalle.stockorigen +", ingresar cantidad menor");
            }
          }
        });

        detalle.cantadespachar = detalle.cantsoli- detalle.cantdespachada;
        detalle.cantadespacharresp = detalle.cantadespachar;
        /* Si la busqueda es 'Solicitud'..
        si acciond=I (inserta) entonces mantiene..
        de lo contrario acciond=M (modifica) */
        if (this.tipobusqueda == 'Solicitud') {
          if (detalle.acciond !== 'I') {
            detalle.acciond = 'M';
          }
        }
        /** Verifica check Progr. */
        if (detalle.marcacheckgrilla == true) {
          detalle.dias = this.diasentrega;
          detalle.cantsoli = total * detalle.dias;
          detalle.cantadespachar = Math.round((detalle.cantsoli - detalle.cantdespachada) / this.cantentregas);
          detalle.recetaentregaprogdet = "S";
          detalle.cantadespacharresp = detalle.cantadespachar;
        } else if (detalle.marcacheckgrilla == false) {
          detalle.recetaentregaprogdet = "N";
          detalle.diasentregacodigodet = 0;
        }
        this.verificalote(detalle);
        this.logicaVaciosModifica();
      }else{
        this.logicaVaciosModifica();
      }

    }else{
      detalle.cantadespachar = detalle.cantsoli- detalle.cantdespachada;
      detalle.cantadespacharresp = detalle.cantadespachar;
      /* Si la busqueda es 'Solicitud'..
      si acciond=I (inserta) entonces mantiene..
      de lo contrario acciond=M (modifica) */
      if (this.tipobusqueda == 'Solicitud') {
        if (detalle.acciond !== 'I') {
          detalle.acciond = 'M';
        }
      }
      /** Verifica check Progr. */
      if (detalle.marcacheckgrilla == true) {
        detalle.dias = this.diasentrega;
        detalle.cantsoli = total * detalle.dias;
        detalle.cantadespachar = Math.round((detalle.cantsoli - detalle.cantdespachada) / this.cantentregas);
        detalle.recetaentregaprogdet = "S";
        detalle.cantadespacharresp = detalle.cantadespachar;
      } else if (detalle.marcacheckgrilla == false) {
        detalle.dias = 0;
        detalle.recetaentregaprogdet = "N";
        detalle.diasentregacodigodet = 0;
      }

      this.logicaVaciosModifica();
    }

    switch (this.codambito) {
      case 1:
        this._RecetaMOD.recetadetalle.forEach(element => {
          if (element.meinid === detalle.meinid && element.redeid === detalle.redeid) {
            element.redeid = detalle.redeid;
            element.redemeincodmei = detalle.codmei;
            element.redemeindescri = detalle.meindescri;
            element.rededosis = detalle.dosis;
            element.redeveces = detalle.formulacion;
            element.redetiempo = detalle.dias;
            element.redecantidadsolo = detalle.cantsoli;
            element.redecantidadadesp = detalle.cantdespachada;
          }
        });
        break;
      case 2:
        this.arrdetalleSolicitudMed.forEach(element => {
          if (element.meinid === detalle.meinid && element.redeid === detalle.redeid) {
            element.redeid = detalle.redeid;
            element.codmei = detalle.codmei;
            element.meindescri = detalle.meindescri;
            element.dosis = detalle.dosis;
            element.formulacion = detalle.formulacion;
            element.dias = detalle.dias;
            element.cantsoli = detalle.cantsoli;
            element.cantdespachada = detalle.cantdespachada;
          }
        });
        break;
      case 3:
        this.arrdetalleSolicitudMed.forEach(element => {
          if (element.meinid === detalle.meinid && element.redeid === detalle.redeid) {
            element.redeid = detalle.redeid;
            element.codmei = detalle.codmei;
            element.meindescri = detalle.meindescri;
            element.dosis = detalle.dosis;
            element.formulacion = detalle.formulacion;
            element.dias = detalle.dias;
            element.cantsoli = detalle.cantsoli;
            element.cantdespachada = detalle.cantdespachada;
          }
        });
        break;
      default:
        break;
    }
    this.logicaVacios();

  }

  verificalote(detalle: DetalleSolicitud) {
    detalle.lote = detalle.lote === undefined || detalle.lote === null? '' : detalle.lote;
    if (detalle.lote.length) {
      this.logicaVaciosModifica();
    } else {
      this.verificanull = false;
    }
  }

  errorMsg(mensaje) {
    this.alertSwalError.text = `Error: ${mensaje}`;
    this.alertSwalError.show();
    this.loading = false;
  }

  validacantidadgrilla(despacho: DetalleSolicitud){
    var idg =0;
    this.alertSwalAlert.text = null;
    this.alertSwalAlert.title = null;
    if(this.IdgrillaDespacho(despacho)>=0){
      idg = this.IdgrillaDespacho(despacho);
      if(despacho.cantadespachar == 0){
        this.logicaVacios();
      }
      if(this.arrdetalleSolicitudMed[idg].cantadespachar > this.arrdetalleSolicitudMed[idg].cantsoli- this.arrdetalleSolicitudMed[idg].cantdespachada ){
        this.alertSwalAlert.text = "La cantidad a Dispensar debe ser menor o igual a la cantidad Pendiente";
        this.alertSwalAlert.show();
        this.arrdetalleSolicitudMed[idg].cantadespachar = this.arrdetalleSolicitudMed[idg].cantadespacharresp;
        this.arrdetalleSolicitudMedPaginacion[idg].cantadespachar = this.arrdetalleSolicitudMed[idg].cantadespachar;
        this.logicaVacios();
      }else{
        if(this.arrdetalleSolicitudMed[idg].cantadespachar <0){
          this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
          this.alertSwalAlert.show();
          this.arrdetalleSolicitudMed[idg].cantadespachar = 0;
          this.arrdetalleSolicitudMedPaginacion[idg].cantadespachar = this.arrdetalleSolicitudMed[idg].cantadespachar;
          this.logicaVacios();
        }
        if(despacho.cantadespachar < despacho.cantsoli- despacho.cantdespachada || despacho.cantadespachar >0){
          this.logicaVacios();
          if(this.dataPacienteSolicitud.soliid == null ){
            this.arrdetalleSolicitudMed[idg].detallelote.forEach(det=>{
              if(this.arrdetalleSolicitudMed[idg].codmei == det.codmei && this.arrdetalleSolicitudMed[idg].lote == det.lote && this.arrdetalleSolicitudMed[idg].fechavto == det.fechavto){
                if(this.arrdetalleSolicitudMed[idg].cantadespachar >det.cantidad){
                  this.alertSwalAlert.text = "El saldo del lote tiene "+ det.cantidad +", ingresar cantidad menor";
                  this.alertSwalAlert.show();
                  this.arrdetalleSolicitudMed[idg].cantadespachar = this.arrdetalleSolicitudMed[idg].cantadespacharresp;
                  this.arrdetalleSolicitudMedPaginacion[idg].cantadespachar = this.arrdetalleSolicitudMed[idg].cantadespacharresp ;
                  this.logicaVacios();
                }
              }
            });
          }else{
            if(this.dataPacienteSolicitud.soliid >0){

              this._buscasolicitudService.BuscaLotesProductosxBod(this.servidor, this.hdgcodigo, this.esacodigo,
              this.cmecodigo, this.arrdetalleSolicitudMed[idg].codmei,0, this.FormDatosPaciente.controls.bodcodigo.value  ).subscribe(
                response => {
                  if (response == undefined || response=== null){
                    this.arrdetalleSolicitudMed[idg].detallelote = [];
                  }
                  else {
                    this.detalleslotes = response;

                    this.logicaVacios();
                    response.forEach(d=>{
                      if(this.arrdetalleSolicitudMed[idg].codmei == d.codmei && this.arrdetalleSolicitudMed[idg].lote == d.lote && this.arrdetalleSolicitudMed[idg].fechavto == d.fechavto){

                        if(this.arrdetalleSolicitudMed[idg].cantadespachar >d.cantidad){
                          this.alertSwalAlert.text = "El saldo del lote tiene "+ d.cantidad +", ingresar cantidad menor";
                          this.alertSwalAlert.show();
                          this.arrdetalleSolicitudMed[idg].cantadespachar = this.arrdetalleSolicitudMed[idg].cantadespacharresp;
                          this.arrdetalleSolicitudMedPaginacion[idg].cantadespachar = this.arrdetalleSolicitudMed[idg].cantadespacharresp ;
                          this.logicaVacios();
                        }else{

                        }
                      }
                    });
                  }
                }
              )
            }
          }
        }
      }
    }
  }

  IdgrillaDespacho(registro: DetalleSolicitud) {
    let indice = 0;
    for (const articulo of this.arrdetalleSolicitudMed) {
      if (registro.codmei === articulo.codmei) {

        return indice;
      }
      indice++;
    }
    return -1;
  }

  limpiar() {
    if(this.bandera_aux != undefined){
      if(this.bandera_aux != 2){
        this.ValidaEstadoSolicitud(1,'limpiar');
      }
    }
    this.loading = true;
    this.dataPacienteSolicitud = new Solicitud();
    this.FormDatosPaciente.reset();
    this.FormDatosProducto.reset();
    this.arrdetalleSolicitud = [];
    this.arrdetalleSolicitudPaginacion = [];
    this.arrdetalleSolicitudMed = [];
    this.arrdetalleSolicitudMedPaginacion = [];
    this.arrdetalleSolicitudIns = [];
    this.arrdetalleSolicitudInsPaginacion = [];
    this.arrdetalleSolicitudMedMOD = [];
    this._Receta = null;
    this._Solicitud = new Solicitud();
    this.FormDatosPaciente.controls["ambito"].setValue(1);
    this.FormDatosPaciente.controls["estado"].setValue(10);
    this.FormDatosPaciente.controls["estadocomprobantecaja"].setValue(10);
    this.FormDatosPaciente.get('fechahora').setValue(new Date());
    this.existpaciente = false;
    this.existsolicitud = false;
    this.nuevasolicitud = false;
    this.agregarproducto = false;
    this.loading = false;
    this.existsolicitud = false;
    this.activacomboentrega = false;
    this.ambito = true;
    this.recetaactiva = false;
    this.recetademonitor = false;
    this.btnimprime = false;
    this.bloqueacamposgrilla = false;
    this.FormDatosPaciente.controls.bodcodigo.disable();
    this.bloqueacamposgrilla2 = false;
    this.btncrea = false;
    this.btnmodificar = false;
    this.btneliminagrilla = false;
    this.numreceta = null;
    /** nuevos campos para validacion columnas y btn eliminar */
    this.colLoteprod = true;
    this.coladispensar = true;
    this.tiporeceta = null;
    this.FormDatosPaciente.controls.numeroreceta.enable();
    this.desactivabtnelim = false;
    this.verificanull = false;
    this.ActivaBotonBuscaGrilla = false;
    this.glsambito = '';
    this.modificable = false;
    this.btnbuscareceta = true;
    this.glsbtnmodifica = 'CREAR RECETA'
    this.glsMensajeMod = 'Crear Receta'
    this.glsMensajeResp = 'Creada';
    this.FormDatosPaciente.controls.retiro.disable();
    this.FormDatosPaciente.controls.nombreretira.disable();
    this.FormDatosPaciente.controls.rutretira.disable();
    this.FormDatosPaciente.controls.cobroincluido.disable();
    this.FormDatosPaciente.controls.tipodocumentoretira.disable();
    this.bloqueabuscapac = true;
    this.ambulatorio = false;
    this.activabtnbuscaprof = false;

    this.habilitaMedico(false);

    this.btnEliminar = false;
    this.btnDispensar= false;

    this.modificareceta = false;

    this.iseliminada = false;

  }

  async setArray(art: Articulos) {
    let indice : number;
    this.alertSwalAlert.title = null;
    this.alertSwalAlert.text = null;

    var detalleSolicitud = new DetalleSolicitud;
    detalleSolicitud.sodeid = 0;
    detalleSolicitud.soliid = 0; //num solicitud
    detalleSolicitud.repoid = 0;
    detalleSolicitud.codmei = art.codigo;
    detalleSolicitud.meinid = art.mein;
    detalleSolicitud.dosis = 0;
    detalleSolicitud.formulacion = 0;
    detalleSolicitud.dias = 0;
    detalleSolicitud.cantsoli = 0;
    detalleSolicitud.pendientedespacho = 0;
    detalleSolicitud.cantdespachada = 0;
    detalleSolicitud.cantdevolucion = 0;
    detalleSolicitud.estado = 1; // Solicitado
    detalleSolicitud.observaciones = null;
    detalleSolicitud.fechamodifica = null;
    detalleSolicitud.usuariomodifica = null;
    detalleSolicitud.fechaelimina = null;
    detalleSolicitud.usuarioelimina = null;
    detalleSolicitud.viaadministracion = null;
    detalleSolicitud.meindescri = art.descripcion;
    detalleSolicitud.stockorigen = null;
    detalleSolicitud.stockdestino = null;
    detalleSolicitud.acciond = this.accion;
    detalleSolicitud.marca = null;
    detalleSolicitud.fechavto = null;
    detalleSolicitud.lote = null;
    detalleSolicitud.cantadespachar = 0;
    detalleSolicitud.descunidadmedida = null;
    detalleSolicitud.unidaddespacho = art.unidaddespacho;
    detalleSolicitud.glosaunidaddespacho = art.glosaunidaddespacho;
    detalleSolicitud.tiporegmein = art.tiporegistro;
    detalleSolicitud.controlado = art.controlado;
    detalleSolicitud.consignacion = art.consignacion;
    detalleSolicitud.bloqcampogrilla = true;
    detalleSolicitud.bloqcampogrilla2 = false;
    detalleSolicitud.bloqcampogrilla3 = true;
    detalleSolicitud.bloqcampogrilla4 = false;
    this.verificanull = false;
    this.modificable = true;
    // Busca lotes para el producto
    await this._buscasolicitudService.BuscaLotesProductosxBod(this.servidor, this.hdgcodigo, this.esacodigo,
    this.cmecodigo, art.codigo,0,  this.FormDatosPaciente.controls.bodcodigo.value  ).subscribe(
      response => {
        if (response == undefined || response === null){
          detalleSolicitud.detallelote = [];
          const indx = this.arrdetalleSolicitudMed.findIndex(x => x.codmei === this.articulos2.codigo, 1);
          if (indx >= 0) {
            this.alertSwalError.title = "Código ya existe en la grilla";
            this.alertSwalError.text = null;
            this.alertSwalError.show();
          } else {
            this.arrdetalleSolicitudMed.unshift(detalleSolicitud);
            detalleSolicitud.acciond = 'I';
            this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0, 20);
            this.logicaVaciosModifica();

            this.logicaBodega();

          }
        }
        else {
          this.detalleslotes = response;
          this.lotesMedLength = this.detalleslotes.length
          if(this.detalleslotes.length ===1){
            detalleSolicitud.lote = this.detalleslotes[0].lote;
            detalleSolicitud.fechavto = this.detalleslotes[0].fechavto;
          }else{
            detalleSolicitud.detallelote = [];
            detalleSolicitud.detallelote = response;
          }
          if (detalleSolicitud.tiporegmein == "M") {
            detalleSolicitud.acciond = 'I';
            if(response.length === 2 || response.length === 1){
              detalleSolicitud.detallelote = [];
              detalleSolicitud.detallelote = response;
              if(response.length === 2){
                detalleSolicitud.lote = response[1].glscombo;
              }
              const indx = this.arrdetalleSolicitudMed.findIndex(x => x.codmei === this.articulos2.codigo, 1);
              this.logicaVaciosModifica();
              if (indx >= 0) {
                this.alertSwalError.title = "Código ya existe en la grilla";
                this.alertSwalError.text = null;
                this.alertSwalError.show();
              }else{
                  this.arrdetalleSolicitudMed.unshift(detalleSolicitud);
              }
            }else{
              if(response.length>2){
                this.arrdetalleSolicitudMed.unshift(detalleSolicitud);
                this.arrdetalleSolicitudMedMOD.unshift(detalleSolicitud);
                this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0, 20);
                this.ActivaBotonBuscaGrilla = true;
                this.logicaVaciosModifica();

                this.logicaBodega();

              }
              var cuentacod = 0;
              this.arrdetalleSolicitudMed.forEach(x=>{
                if(x.codmei ===art.codigo){
                  cuentacod ++;
                }
              });
              if(cuentacod  >this.lotesMedLength -1  ){
                const indxmeds = this.arrdetalleSolicitudMed.findIndex(x => x.codmei === art.codigo, 1);
                this.arrdetalleSolicitudMed.splice(indxmeds,1);
                this.alertSwalError.title = "Código ya existe en la grilla";
                this.alertSwalError.text = "Ya no puede ingresar el Producto, no hay lotes disponibles para asignar";
                this.alertSwalError.show();
              }
            }
          } else {
            if (detalleSolicitud.tiporegmein == "I") {
              detalleSolicitud.acciond = 'I';
              this.arrdetalleSolicitudIns.unshift(detalleSolicitud);
              this.arrdetalleSolicitudInsPaginacion = this.arrdetalleSolicitudIns.slice(0, 20);
              this.logicaVaciosModifica();
              this.nuevasolicitud = true;

              this.logicaBodega();

            }
          }
          this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0, 20);
          this.arrdetalleSolicitudMed_aux = this.arrdetalleSolicitudMed;
          this.arrdetalleSolicitudMedPaginacion_aux = this.arrdetalleSolicitudMedPaginacion;

        }
      });
      this.FormDatosProducto.reset();
  }

  /**
   * Actualización
   * fecha: 27/12/2021
   * cambios:
   *  filtro que no considera cantidadpagadacaja = 0
   *  poder eliminar las cantidadpagadacaja = 0
   * autor: miguel.lobos@sonda.com
   */
  async grabarSolicitud() {
    this.alertSwalAlert.text = null;
    this.alertSwalAlert.title = null;
    var fechaactual = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    var es_controlado = this.arrdetalleSolicitud.find(element => element.controlado == 'S');
    var es_consignacion = this.arrdetalleSolicitud.find(element => element.consignacion == 'S');
    var es_validacionlote = this.arrdetalleSolicitudMed.find(element => element.lote != null)
    this.validagrilla= false;
      if(es_validacionlote != undefined){
        this.arrdetalleSolicitud.forEach(d=>{
          if(d.lote == null || d.lote == "" || d.fechavto == null || d.fechavto == "" ){
            this.validagrilla = true;
          }
        });
      }
      if(this.validagrilla){
        this.alertSwalAlert.text = "Debe Seleccionar un lote para Dispensar";
        this.alertSwalAlert.show();
        this.loading = false;
      }else{
        try {
          this.validagrilla = false
          this._Solicitud = new Solicitud();
          if(es_controlado == undefined){
            this._Solicitud.controlado = 'N';
          }else{
            this._Solicitud.controlado = 'S';
          }
          if(es_consignacion == undefined){
            this._Solicitud.consignacion = 'N';
          }else{
            this._Solicitud.consignacion = 'S';
          }
          this._Solicitud.hdgcodigo = this.hdgcodigo;
          this._Solicitud.esacodigo = this.esacodigo;
          this._Solicitud.cmecodigo = this.cmecodigo;
          this._Solicitud.cliid = this.dataPacienteSolicitud.cliid;
          this._Solicitud.tipodocpac = this.dataPacienteSolicitud.tipodocpac;
          if (this.dataPacienteSolicitud.numdocpac == undefined) {
            this._Solicitud.numdocpac ='';
          } else {
            this._Solicitud.numdocpac = this.dataPacienteSolicitud.numdocpac.trim();
          }
          this._Solicitud.descidentificacion = null;
          this._Solicitud.apepaternopac       = this.dataPacienteSolicitud.apepaternopac;
          this._Solicitud.apematernopac       = this.dataPacienteSolicitud.apematernopac;
          this._Solicitud.nombrespac          = this.dataPacienteSolicitud.nombrespac;
          this._Solicitud.codambito           = this.dataPacienteSolicitud.codambito;
          this._Solicitud.estid               = this.dataPacienteSolicitud.estid;
          this._Solicitud.ctaid               = this.dataPacienteSolicitud.ctaid;
          this._Solicitud.cuentanumcuenta     = this.dataPacienteSolicitud.cuentanumcuenta;
          this._Solicitud.boleta              = this.dataPacienteSolicitud.boleta;
          this._Solicitud.edadpac             = this.dataPacienteSolicitud.edadpac;
          this._Solicitud.tipoedad            = null;
          this._Solicitud.codsexo             = this.dataPacienteSolicitud.codsexo;
          this._Solicitud.codservicioori      = this.dataPacienteSolicitud.codservicioori;
          this._Solicitud.codservicioactual   = this.dataPacienteSolicitud.codservicioactual;
          this._Solicitud.codserviciodes      = 0;
          this._Solicitud.bodorigen           = this.FormDatosPaciente.controls.bodcodigo.value;
          this._Solicitud.boddestino          = this.FormDatosPaciente.controls.bodcodigo.value;
          this.bodegasSolicitantes.forEach(element => {
            if (element.bodcodigo === this._Solicitud.bodorigen) {
              this._Solicitud.tipobodorigen   = element.bodtipobodega;
              this._Solicitud.tipoboddestino  = element.bodtipobodega;
            }
          });
          this._Solicitud.tipoproducto        = 0;
          this._Solicitud.tipomovim           = 'C';
          this._Solicitud.tiposolicitud       = 70;
          this._Solicitud.estadosolicitud     = parseInt(this.FormDatosPaciente.controls['estado'].value);
          this._Solicitud.prioridadsoli       = 0;
          this._Solicitud.tipodocprof         = this.dataPacienteSolicitud.tipodocprof;
          this._Solicitud.numdocprof          = this.dataPacienteSolicitud.numdocprof;
          this._Solicitud.alergias            = null;
          this._Solicitud.cama                = null;
          this._Solicitud.fechacreacion       = fechaactual;
          this._Solicitud.usuariocreacion     = this.usuario;
          this._Solicitud.fechamodifica       = null;
          this._Solicitud.usuariomodifica     = null;
          this._Solicitud.fechaelimina        = null;
          this._Solicitud.usuarioelimina      = null;
          this._Solicitud.fechacierre         = null;
          this._Solicitud.usuariocierre       = null;
          this._Solicitud.observaciones       = null;
          this._Solicitud.ppnpaciente         = null;
          this._Solicitud.convenio            = null;
          this._Solicitud.diagnostico         = null;
          this._Solicitud.nombremedico        = this.dataPacienteSolicitud.nombremedico;
          this._Solicitud.cuentanumcuenta     = this.dataPacienteSolicitud.cuentanumcuenta;
          this._Solicitud.bodorigendesc       = null;
          this._Solicitud.boddestinodesc      = null;
          this._Solicitud.usuario             = this.usuario;
          this._Solicitud.servidor            = this.servidor;
          this._Solicitud.origensolicitud     = 70;
          this._Solicitud.estadosolicitudde   = null;
          this._Solicitud.desprioridadsoli    = null;
          this._Solicitud.desorigensolicitud  = null;
          this._Solicitud.codpieza            = null;
          this._Solicitud.camid               = 0;
          this._Solicitud.piezaid             = 0;
          this._Solicitud.glsexo              = this.dataPacienteSolicitud.glsexo;
          this._Solicitud.glstipidentificacion= this.dataPacienteSolicitud.glstipidentificacion;
          this._Solicitud.glsambito           = this.dataPacienteSolicitud.glsambito;
          this._Solicitud.undglosa            = this.dataPacienteSolicitud.undglosa;
          this._Solicitud.camglosa            = this.dataPacienteSolicitud.camglosa;
          this._Solicitud.pzagloza            = this.dataPacienteSolicitud.pzagloza;
          this._Solicitud.edad                = this.dataPacienteSolicitud.edad;                    this._Solicitud.solicitudesdet      = this.arrdetalleSolicitudMed;
          this.loading = false;
          if(this.codambito === 1){
            this.logicaNopagados();
          }
          this._Solicitud.tiporeceta          = null;
          this._Solicitud.numeroreceta        = parseInt(this.FormDatosPaciente.controls.numeroreceta.value);
          this._Solicitud.comprobantecaja     = this.FormDatosPaciente.value.comprobantecaja;
          this._Solicitud.estadocomprobantecaja= this.FormDatosPaciente.value.estadocomprobantecaja;
          this._Solicitud.solitiporeg         = "M";
          this._Solicitud.solirecetipo        = this.dataPacienteSolicitud.solirecetipo;
          this._Solicitud.boleta = parseInt(this.FormDatosPaciente.value.numeroboleta);
          if (this.checkgrilla == false) {
            this._Solicitud.diasentregacodigo = this.FormDatosPaciente.value.entrega;
            this._Solicitud.recetaentregaprog = "S"
          } else {
            if (this.checkgrilla == true) {
              this._Solicitud.diasentregacodigo = 0;
              this._Solicitud.recetaentregaprog = "N"
            }
          }
          if (this.dataPacienteSolicitud.soliid > 0) {
            this.modificar = true;
            this._Solicitud.accion = 'M'
            this._Solicitud.soliid = this.dataPacienteSolicitud.soliid;
            this._Solicitud.solicitudesdet.forEach(element => {
              element.acciond ="M";
              element.usuariomodifica = this.usuario;
            });
            this.loading = false;
            this.modalconfirmar("Modificar Solicitud y Dispensación","Modifica");
          } else {
            this._Solicitud.soliid = 0;
            this.modificar = false;
            this._Solicitud.accion = 'I';
            this._Solicitud.solicitudesdet.forEach(element => {
              if(element.cantidadpagadacaja > 0){
                element.cantadespachar = element.cantidadpagadacaja;
              }
                element.sodeid  = 0;
                element.soliid  = 0;
                element.acciond = 'I';
            });
            this.loading = false;
            this.modalconfirmar("Creación Solicitud y Dispensación a Paciente","Crea");
          }
        } catch (err) {
          this.alertSwalError.title = "Error";
          this.alertSwalError.text = err.message;
          this.alertSwalError.show();
          this.loading = false;
        }
        this.loading = false;
      }
  }

  async modalconfirmar(mensaje: string, accion: string) {    this.validaSinstock(func=>{
     if(!this.valida){
        this.limpialistado();
        return;
      }else {
        const Swal = require('sweetalert2');
        Swal.fire({
          title: '¿'.concat(mensaje).concat('?'),
          text: "Confirmar la acción",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar'
        }).then(async (result) => {
          if (result.value) {
            if(this.valida){
              this.loading = true;
              try {
                let IDSolciitud: any;
                this.arrdetalleDispensarMed = [];
                this.arrdetalleDispensarIns = [];
                this.arrdetalleDispensarMed = this.arrdetalleSolicitudMed;
                this.arrdetalleDispensarIns = this.arrdetalleSolicitudIns;
                IDSolciitud = await this._solicitudService.crearSolicitud(this._Solicitud).toPromise();
                this.alertSwal.title = mensaje.concat(" Exitosa N°").concat(IDSolciitud['solbodid']);
                this.alertSwal.show().then( async val => {
                  if(val.value) {
                    this.loading = false;
                    this.IDSol = IDSolciitud['solbodid'];
                    let salida: any;
                    if(accion=="Crea"){
                      this.btncrea = false;
                    }else{
                      if(accion== "Modifica"){
                        this.btnmodificar = false;
                      }
                    }
                    salida = await this.DispensarSolicitud();
                    this.loading = false;
                  }
                });
              } catch (err) {
                this.loading = false;
                this.alertSwalError.text = err.message;
                this.alertSwalError.show();
              };
            } else {
              this.limpialistado();
            }
          }
        });
      }

    });

  }

  validaSinstock( _callback ) {
    let stock : StockProducto[];
    this.detalleconstock = [];
    this.respPermiso = '';
    let index : number = 0;

    this.valida = true;
    for( let articulo of this.arrdetalleSolicitudMedPaginacion ){

      this._creaService.BuscaStockProd(articulo.meinid,
        this.FormDatosPaciente.controls.bodcodigo.value, this.usuario,
        this.servidor).subscribe(res => {
        stock = res;

        index++;

        if( articulo.cantadespachar > stock[0].stockactual ) {

          if (index === 0) {
            this.respPermiso = "<p>Saldo del Artículo <strong>" +
              articulo.codmei + "</strong> es " + stock[0].stockactual + "</p>";
          } else {
            this.respPermiso = this.respPermiso +
            "<p>Saldo del Artículo <strong>" + articulo.codmei + "</strong> es " + stock[0].stockactual + "</p>";
          }

          this.valida = false;
          _callback()

        }else {
          this.detalleconstock.push(articulo);
          _callback()

        }
      });

    }

  }

  setModal(titulo: string) {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo        : titulo,
        hdgcodigo     : this.hdgcodigo,
        esacodigo     : this.esacodigo,
        cmecodigo     : this.cmecodigo,
        tipo_busqueda : 'Medicamentos',
        id_Bodega     : this.FormDatosPaciente.controls.bodcodigo.value,
        cliid         : this.dataPacienteSolicitud.cliid,
        ambito        : this.dataPacienteSolicitud.codambito,
        tipodocumeto  : this.dataPacienteSolicitud.tipodocpac,
        numeroidentificacion: this.dataPacienteSolicitud.numdocpac,
        origen        : 'Solicitud_Receta',
        codprod       : this.FormDatosProducto.controls.codigo.value,
        pagina        : 'Despacho'
      }
    };
    return dtModal;
  }

  async DispensarSolicitud() {
    this.paramdespachos = [];
    var indice: number;
    indice = 0;

    this._solicitudService.BuscaSolicitud(this.IDSol, this.hdgcodigo,
      this.esacodigo, this.cmecodigo, 0, null, null, 0, 0, null, this.servidor,
      0, this.dataPacienteSolicitud.codambito, 0, 0, 0, 0, null,70,"","").subscribe(
        response => {
          if (response != null){
            this.dataPacienteSolicitud = response[0];
            this.Dispensar();
          }
        });
  }

  async Dispensar(){
    const productos = this.dataPacienteSolicitud.solicitudesdet;
    if (productos !== undefined || !productos.length) {
      productos.forEach(element => {
        var producto: DespachoDetalleSolicitud = new DespachoDetalleSolicitud;
        producto.soliid    = element.soliid
        producto.hdgcodigo = this.hdgcodigo;
        producto.esacodigo = this.esacodigo;
        producto.cmecodigo = this.cmecodigo;
        producto.sodeid = element.sodeid;
        producto.codmei = element.codmei;
        producto.meinid = element.meinid;
        producto.cantsoli = element.cantsoli;
        producto.cantdespachada = element.cantdespachada;
        producto.observaciones = element.observaciones;
        producto.usuariodespacha = this.usuario;
        producto.estid = this.dataPacienteSolicitud.estid;
        producto.ctaid = this.dataPacienteSolicitud.ctaid;
        producto.cliid = this.dataPacienteSolicitud.cliid;
        producto.valcosto = 0;
        producto.valventa = 0;
        producto.unidespachocod = 0;
        producto.unicompracod = 0;
        producto.incobfon = null;
        producto.numdocpac = null;
        producto.cantdevolucion = element.cantdevolucion;
        producto.tipomovim = "C";
        producto.servidor = this.servidor;
        if(element.tiporegmein==='M'){
          this.arrdetalleDispensarMed.forEach(x=>{
            if(element.codmei === x.codmei){
              producto.cantadespachar = x.cantadespachar;
              producto.lote = x.lote;
              producto.fechavto = this.datePipe.transform(x.fechavto, 'dd-MM-yyyy');
            }
          });
        }
        producto.bodorigen = this.dataPacienteSolicitud.bodorigen;
        producto.boddestino = this.dataPacienteSolicitud.boddestino;
        producto.codservicioori = this.dataPacienteSolicitud.codservicioori;
        producto.codservicioactual = this.dataPacienteSolicitud.codservicioactual;
        if(this._Receta != undefined){
          producto.recetipo  = this._Receta.recetipo;
          producto.recenumero= this._Receta.receid;
          producto.codcobroincluido = this.FormDatosPaciente.controls.cobroincluido.value;
          producto.retira = this.FormDatosPaciente.controls.retiro.value;
          producto.codtipidentificacionretira = this.FormDatosPaciente.controls.tipodocumentoretira.value;
          producto.numidentificacionretira = this.FormDatosPaciente.controls.rutretira.value;
          producto.nombresretira = this.FormDatosPaciente.controls.nombreretira.value;
        }else{
          producto.recetipo = this.dataPacienteSolicitud.solirecetipo;
          if(this.dataPacienteSolicitud.numeroreceta != undefined){
            producto.recenumero = 0;
          }else{
            producto.recenumero = this.dataPacienteSolicitud.numeroreceta;
          }
        }
        if(this.recetademonitor == true){
          producto.receid    = this._Receta.receid;
        }else{
          if(this.recetademonitor == false){
            producto.receid    = 0;
          }
        }
        this.paramdespachos.unshift(producto);
      });

      await this._dispensasolicitudService.GrabaDispensacion(this.paramdespachos).subscribe(async response => {
        if (response != undefined || response=== null) {
          await this.cargaSolicitud(this.paramdespachos[0].soliid);
        }
      });
    }
  }

  eventosSolicitud() {
    this._BSModalRef = this._BsModalService.show(EventosSolicitudComponent, this.setModalEventoSolicitud());
    this._BSModalRef.content.onClose.subscribe();
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
        _Solicitud: this.dataPacienteSolicitud
      }
    };
    return dtModal;
  }

  eventosDetalleSolicitud(registroDetalle: DetalleSolicitud) {
    this.varListaDetalleDespacho = new (DetalleSolicitud);
    this.varListaDetalleDespacho = registroDetalle;
    this._BSModalRef = this._BsModalService.show(EventosDetallesolicitudComponent, this.setModalEventoDetalleSolicitud());
    this._BSModalRef.content.onClose.subscribe((Respuesta: any) => {
    });
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
        _Solicitud: this.dataPacienteSolicitud,
        _DetalleSolicitud: this.varListaDetalleDespacho,
      }
    };
    return dtModal;
  }

  /* Función búsqueda con paginación */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(startItem, endItem);
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  uimensaje(status: string, texto: string, time: number = 0) {
    this.alerts = [];
    if (time !== 0) {
      this.alerts.push({
        type: status,
        msg: texto,
        timeout: time
      });
    } else {
      this.alerts.push({
        type: status,
        msg: texto
      });
    }
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  Salir() {
    if(this.bandera_aux != undefined){
      if(this.bandera_aux != 2){
        this.ValidaEstadoSolicitud(1,'salir');
      }
    }

    this.route.paramMap.subscribe(param => {
      if (param.has("retorno_pagina")) {
        switch (param.get("retorno_pagina")) {
          case "consultarecetasambulatoria":
            this.router.navigate(['consultarecetasambulatoria']);
            break;
            case "monitorejecutivo":
              this.router.navigate(['monitorejecutivo']);
              break;
          default:
            this.router.navigate(['home']);
        }
      } else {
        this.router.navigate(['home']);
      }
    });
  }

  onImprimir() {
    var tipo, soliid, receid : number;
    var titulo : string;
    if(this.FormDatosPaciente.controls.numsolicitud.value != null){
      tipo = 1;
      soliid = this.FormDatosPaciente.controls.numsolicitud.value;
      receid = 0;
      titulo = "¿Desea Imprimir la Dispensación?";
    }else{
      tipo = 2;
      soliid = 0;
      receid = this._Receta.receid;
      titulo = "¿Desea Imprimir la Receta?";
    }
    const Swal = require('sweetalert2');
    Swal.fire({
      title: titulo,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.ImprimirSolicitud(soliid,tipo,receid);
      }
    });
  }

  ImprimirSolicitud(soliid: number,tipo:number,receid:number) {
    this._imprimesolicitudService.RPTImprimeSolicitudDespachoReceta(this.servidor,this.usuario,
    this.hdgcodigo, this.esacodigo,this.cmecodigo, "pdf",tipo ,soliid,receid).subscribe(
      response => {
        if (response != null){
          window.open(response[0].url, "", "");
        }
      },
      error => {
        this.alertSwalError.title = "Error al Imprimir Despacho Solicitud";
        this.alertSwalError.show();
        this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
        })
      }
    );
  }

  getRecetas(numeroreceta: string){
    const Swal = require('sweetalert2');
    this.numreceta = parseInt(numeroreceta);
    if(this.numreceta === null || this.numreceta === NaN ||numeroreceta ===null){
      this.BuscarRecetas();
    }
    else{
      this._Receta = new (Receta);
      this._Receta.recenumero = this.numreceta;
      this._Receta.hdgcodigo = this.hdgcodigo;
      this._Receta.esacodigo = this.esacodigo;
      this._Receta.cmecodigo = this.cmecodigo;
      this._Receta.servidor  = this.servidor;
      this._buscasolicitudService.buscarestructurarecetas(this._Receta).subscribe(
        response => {
          if( response !== null ) {
            if (response.length == 0) {
              this.alertSwalAlert.title = "El número de receta buscada no existe";
              this.alertSwalAlert.show();
            } else {
              if (response.length > 0) {
                this.arrdetalleSolicitudMedPaginacion = [];
                this.arrdetalleSolicitudMed = [];
                switch (response[0].receambito) {
                  case 1: // Ambulatorio
                    this.CargaPacienteReceta(response[0].receid);
                    break;
                  case 2: // Urgencia
                    if(response[0].ctanumcta === 0){
                      Swal.fire({
                        title: 'RECETA DE URGENCIA NO TIENE CUENTA ASOCIADA',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                      }).then((result) => {
                        return;
                      });
                    } else {
                      this.CargaPacienteReceta(response[0].receid);
                    }
                    break;
                  case 3: // Hospitalario
                    if(response[0].ctanumcta === 0){
                      Swal.fire({
                        title: 'RECETA HOSPITALARIA NO TIENE CUENTA ASOCIADA',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                      }).then((result) => {
                        return;
                      });
                    } else {
                      this.CargaPacienteReceta(response[0].receid);
                    }
                    break;
                  default:
                    break;
                }
              }
            }
          } else {
            this.FormDatosPaciente.controls.numeroreceta.reset();
            return;
         }
        },
        error => {
            this.alertSwalError.title = "Error al buscar Receta";
            this.alertSwalError.show();
            this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
          });
        });
    }
  }

  BuscarRecetas() {
    var pasoparemetro: string;
    pasoparemetro = this.FormDatosPaciente.get("nombrepaciente").value;
    if(pasoparemetro === null){
      pasoparemetro = " ";
    }
    const Swal = require('sweetalert2');
    if(this.bandera_aux != undefined){
      if(this.bandera_aux != 2){
        this.ValidaEstadoSolicitud(1,'limpiar');
      }
    }
    this._BSModalRef = this._BsModalService.show(BusquedarecetasComponent, this.setModal("Busqueda Recetas: ".concat(pasoparemetro)));
    this._BSModalRef.content.onClose.subscribe((Retorno: Receta) => {
      if (Retorno !== undefined) {
        this.existsolicitud = true;
        this.agregarproducto = true;
        switch (Retorno.receambito) {
          case 1: // Ambulatorio
            this.CargaPacienteReceta(Retorno.receid);
          break;
          case 2: // Urgencia
            if(Retorno.ctanumcta === 0){
              Swal.fire({
                title: 'RECETA DE URGENCIA NO TIENE CUENTA ASOCIADA',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              }).then((result) => {
                return;
              });
            } else {
              this.CargaPacienteReceta(Retorno.receid);
            }
          break;
          case 3: // Hospitalario
            if(Retorno.ctanumcta === 0){
              Swal.fire({
                title: 'RECETA HOSPITALARIA NO TIENE CUENTA ASOCIADA',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              }).then((result) => {
                return;
              });
            } else {
              this.CargaPacienteReceta(Retorno.receid);
            }
          break;
          default:
            break;
        }
      }
    });
  }

  getProducto() {
    this.alertSwalAlert.title = null;
    this.alertSwalAlert.text = null;
    this.codprod = this.FormDatosProducto.controls.codigo.value;
    var validacodigo = false;
    if (this.codprod === null || this.codprod === '') {
      this.onBuscarProducto();
    } else {
      this.loading = true;
      const tipodeproducto = 'MIM';
      const controlado = '';
      const controlminimo = '';
      const idBodega = this.FormDatosPaciente.controls.bodcodigo.value;
      const consignacion = '';

      this._BusquedaproductosService.BuscarArticulosFiltros(this.hdgcodigo, this.esacodigo,
        this.cmecodigo, this.codprod, null, null, null, null, tipodeproducto, idBodega, controlminimo, controlado, consignacion
        , this.usuario, null, this.servidor).subscribe(
          response => {
            if (response != null){
              if (!response.length) {
                this.loading = false;
              } else if (response.length) {
                if(response.length > 1){
                  this.onBuscarProducto();
                  this.loading = false;
                }else{
                  if(response.length == 1){
                    this.loading = false;
                    this.articulos2 = response[0];
                    this.FormDatosProducto.reset();

                    if(Number(response[0].saldo) <1){
                      this.alertSwalAlert.title = "El producto tiene saldo 0, por lo que no puede cargarse";
                      this.alertSwalAlert.show();
                      this.loading = false;
                    }else{
                      if(this.FormDatosPaciente.controls.estado.value == 40){
                        this.tiporeceta = 'Parcial';
                        this.arrdetalleSolicitudMed.forEach(p=>{

                          if(this.articulos2.codigo == p.codmei){

                            validacodigo= true;

                          }
                        })

                        if(validacodigo == true){

                          this.bloqueacamposgrilla= true;
                          this.bloqueacamposgrilla2 = true;
                          this.btneliminagrilla = true;
                          this.setArray(this.articulos2);
                        }
                        else{
                          if(validacodigo == false){

                            this.alertSwalAlert.text = "Debe agregar productos que ya existan en la solicitud ";
                            this.alertSwalAlert.show();
                          }
                        }

                      }else{

                        this.bodegasSolicitantes.forEach(x=>{
                          if(this.FormDatosPaciente.controls.bodcodigo.value === x.bodcodigo){
                            this.bodegacontrolado = x.bodcontrolado;
                            return
                          }
                        })
                        if(this.bodegacontrolado ==='N'){
                          if(this.articulos2.controlado === 'N'){
                            this.bloqueacamposgrilla= true;
                            this.bloqueacamposgrilla2 = true;
                            this.btncrea = true;
                            this.FormDatosPaciente.controls.bodcodigo.disable();
                            this.setArray(this.articulos2);
                          }else{
                            this.alertSwalAlert.title = "No puede ingresar medicamentos controlados";
                            this.alertSwalAlert.show();
                          }
                        }else{
                          if(this.bodegacontrolado ==='S'){
                            if(this.articulos2.controlado === 'S'){
                              this.bloqueacamposgrilla= true;
                              this.bloqueacamposgrilla2 = true;
                              this.btncrea = true;
                              this.FormDatosPaciente.controls.bodcodigo.disable();
                              this.setArray(this.articulos2);
                            }else{
                              this.alertSwalAlert.title = "Debe ingresar medicamentos controlados";
                              this.alertSwalAlert.show();
                            }
                          }
                        }

                      }
                    }
                  }
                }
              }
            } else {
              this.loading = false;
            }
          }, error => {
            this.loading = false;
          }
        );
    }
  }

  async logicaVaciosModifica(){

    switch (this.codambito) {
      case 1:
        if(this._Receta != undefined){
          if (this._Receta.cajanumerocomprobante === 0) {
            await this.vaciosProductos();
            if (this.vacios === true ) {
              this.btnmodificar = false;
            }else{
              this.btnmodificar = true;
            }
          }
        }

        if (this._Solicitud.soliid > 0 || this._Receta.cajanumerocomprobante > 0) {
          this.btnmodificar = false;

        }
        break;
      case 2:
        if(this.dataPacienteSolicitud != undefined){
          if (this.dataPacienteSolicitud.cuentanumcuenta > '0' &&
            (this.dataPacienteSolicitud.soliid === 0 || this.dataPacienteSolicitud.soliid === undefined)) {
            await this.vaciosProductos();
            if (this.vacios === true ) {
              this.btnmodificar = false;
            }else{
              this.btnmodificar = true;
            }
          }
        }

        if (this.dataPacienteSolicitud.soliid > 0 && this.dataPacienteSolicitud.cuentanumcuenta > '0') {
          this.btnmodificar = false;
        }
        break;
      case 3:
        if(this.dataPacienteSolicitud != undefined){
          if (this.dataPacienteSolicitud.cuentanumcuenta > '0' &&
             (this.dataPacienteSolicitud.soliid === 0 || this.dataPacienteSolicitud.soliid === undefined)) {
            await this.vaciosProductos();
            if (this.vacios === true ) {
              this.btnmodificar = false;
            }else{
              this.btnmodificar = true;
            }
          }
        }

        if (this.dataPacienteSolicitud.soliid > 0 ) {
          this.btnmodificar = false;
        }
        break;
      default:
        break;
    }

  }

  /**
   * valida si hay campos vacios grilla desactiva btn guarda/modificar
   * @miguel.lobos
   * 16-03-2021
  */
   async logicaVacios() {
      if (this.FormDatosPaciente.controls.bodcodigo.value === null ||
      this.FormDatosPaciente.controls.bodcodigo.value === 0 ){
        this.verificanull = false;
        this.btnDispensar = false;
      } else {
      if(this.FormDatosPaciente.controls.numsolicitud.value === null){
        await this.vaciosProductos();
        await this.vaciosRetira();
        if(this.modificable){
          this.btnmodificar = true;
          this.verificanull = false;
          this.btnDispensar = false;
        }else{
          await this.logicaVaciosLote();
          if (this.vacios && this.vaciolote) {
            this.verificanull = false;
            this.btnDispensar = false;
          }else{
            if (this.vacios && !this.vaciolote){
              this.verificanull = false;
              this.btnDispensar = false;
            }else {
              if(!this.vacios && this.vaciolote){
                // Verificanull = true, cuando el medicamento no valida lotes, (no trae lotes), en momento
                // de que se valide que el medicamento valide que tenga lote, verificall = false;
                switch (this._Receta.receambito) {
                  case 1:
                    if(this._Receta.codcobroincluido != 0){
                      if(this.retira){
                        this.verificanull = true;
                        this.btnDispensar = true;
                      } else {
                        this.verificanull = false;
                        this.btnDispensar = false;
                      }
                    } else {
                      if(this.retira){
                        if (this.FormDatosPaciente.controls.comprobantecaja.value === '0') {
                          this.verificanull = false;
                          this.btnDispensar = false;
                        } else {
                          this.verificanull = true;
                          this.btnDispensar = true;
                        }
                      } else {
                        this.verificanull = false;
                        this.btnDispensar = false;
                      }
                    }
                    break;
                  case 2:
                    this.verificanull = true;
                    this.btnDispensar = true;
                    break;
                  case 3:
                    this.verificanull = true;
                    this.btnDispensar = true;
                    break;
                  default:
                    break;
                }
              }else{
                if(this.modificable){
                  this.btnmodificar = true;
                  this.verificanull = false;
                  this.btnDispensar = false;
                }else{
                  this.btnmodificar = false;
                  this.verificanull = true;
                  this.btnDispensar = true;
                }
              }
            }
          }
        }
      }else{
        if(this._Receta != undefined){
          if (this._Receta.recesolid > 0) {
            if(this._Receta.bandera != 2){
              await this.vaciosProductos();
              await this.logicaVaciosLote();
              if (this.vacios === true && this.vaciolote === true) {
                this.verificanull = false;
                this.btnDispensar = false;
              }else{
                if (this._Solicitud.estadosolicitud != 50) {
                  if (this.vacios === true && this.vaciolote === false){
                    this.verificanull = false;
                    this.btnDispensar = false;
                  }else {
                    if(this.vacios === false && this.vaciolote === true){

                      this.verificanull = false;
                      this.btnDispensar = false;
                    }else{
                      this.verificanull = true;
                      this.btnDispensar = true;
                    }
                  }
                } else {
                  this.verificanull = false;
                  this.btnDispensar = false;
                }
              }
            } else {
              this.verificanull = true;
              this.btnDispensar = true;
            }
          }
        }
        if(this.dataPacienteSolicitud != undefined){
          if (this.dataPacienteSolicitud.soliid > 0) {
            if (this.dataPacienteSolicitud.estadosolicitud === 50 ){
              this.verificanull = false;
              this.btnDispensar = false;
            }else{
              if (this.bandera_aux != 2){
                await this.vaciosProductos();
                await this.logicaVaciosLote();
                if (this.vacios === true && this.vaciolote === true) {
                  this.verificanull = false;
                  this.btnDispensar = false;
                }else{
                  if (this._Solicitud.estadosolicitud != 50) {
                    if (this.vacios === true && this.vaciolote === false){
                      this.verificanull = false;
                      this.btnDispensar = false;
                    }else {
                      if(this.vacios === false && this.vaciolote === true){
                        this.verificanull = false;
                        this.btnDispensar = false;
                      }else{
                        this.verificanull = true;
                        this.btnDispensar = true;
                      }
                    }
                  } else {
                    this.verificanull = false;
                    this.btnDispensar = false;
                  }
                }
              } else {
                this.verificanull = false;
                this.btnDispensar = false;
              }
            }
          }
        }
      }
    }
  }

  vaciosProductos() {
    if (this.arrdetalleSolicitudMedPaginacion.length) {
      for (var data of this.arrdetalleSolicitudMedPaginacion) {
        if (data.dosis <= 0 || data.formulacion <= 0 || data.dias <= 0 ||
           data.dosis === null || data.formulacion === null ||
          data.dias === null || data.cantadespachar <= 0 || data.cantadespachar === null) {
          this.vacios = true;
          return;
        } else {
            this.vacios = false;
            return
        }
      }
    }
  }

  logicaVaciosLote(){
    if (this.arrdetalleSolicitudMedPaginacion.length) {
      for (var data of this.arrdetalleSolicitudMedPaginacion) {
        if (data.lote === null || data.lote === "" || data.lote === undefined){
          this.vaciolote = true;
          return
        }else{
          this.vaciolote = false;
        }
      }
    }
  }

  vaciosRetira() {
    switch (this.FormDatosPaciente.controls.retiro.value) {
      case '0':
        this.retira = false;
        break;
      case '1':
        this.retira = true;
        break;
      case '2':
        if(this.FormDatosPaciente.controls.tipodocumentoretira.value != 0 &&
          this.FormDatosPaciente.controls.tipodocumentoretira.value != null &&
          (this.FormDatosPaciente.controls.rutretira.value != undefined &&
           this.FormDatosPaciente.controls.rutretira.value != null &&
           this.FormDatosPaciente.controls.rutretira.value != '') &&
           (this.FormDatosPaciente.controls.nombreretira.value != undefined &&
            this.FormDatosPaciente.controls.nombreretira.value != null &&
            this.FormDatosPaciente.controls.nombreretira.value != '')){
              this.retira = true;
        } else {
          this.retira = false;
        }
        break;
      default:
        this.retira = true;
        break;
    }
  }

  checkLote(registro: DetalleSolicitud) {
    if(registro.lote ==undefined || registro.lote==""){
      this.alertSwalAlert.text = "Debe seleccionar lote";
      this.alertSwalAlert.show();
    }
  }

  async CambioCheck(registro: DetalleSolicitud,id:number,event:any,marcacheckgrilla: boolean){
    if(event.target.checked){
      registro.marcacheckgrilla = true;
      this.desactivabtnelim = true;
      await this.isEliminaInsGrilla(registro)
      await this.arrdetalleSolicitudMed.forEach(d=>{
        if(d.marcacheckgrilla === true){
          this.desactivabtnelim = true;

        }
      })
    }else{
      registro.marcacheckgrilla = false;
      this.desactivabtnelim = false;
      await this.isEliminaInsGrilla(registro);
      await this.arrdetalleSolicitudMed.forEach(d=>{
        if(d.marcacheckgrilla === true){
          this.desactivabtnelim = true;
        }
      })
    }
  }

  isEliminaInsGrilla(registro: DetalleSolicitud) {

    let indice = 0;
    for (const articulo of this.arrdetalleSolicitudMed) {
      if (registro.codmei === articulo.codmei && registro.sodeid === articulo.sodeid) {
        articulo.marcacheckgrilla = registro.marcacheckgrilla;
        return indice;
      }
      indice++;
    }
    return -1;
  }

  ConfirmaEliminaProductoDeLaGrilla2() {

    this.alertSwalConfirmar.title = '¿ Confirme eliminación de producto de la solicitud ?';
    this.alertSwalConfirmar.text = 'Confirmar la eliminación del producto';
    this.alertSwalConfirmar.show().then( res => {
      if( res.value ){
        this.EliminaProductoDeLaGrilla2();
        this.btnmodificar = true;
      } else { return; }
    });
  }
  /**
   * Actualización
   * fecha: 3/1/2022
   * cambios:
   *  - desactiva boton tras eliminar
   * autor: miguel.lobos@sonda.com
   */
  async EliminaProductoDeLaGrilla2() {

    await this.arrdetalleSolicitudMedPaginacion.forEach((dat, index) =>{
      if (dat.acciond === "I"  && dat.redeid === 0 || dat.redeid === undefined) {
        if(dat.marcacheckgrilla ===true){
          const indx = this.arrdetalleSolicitudMed.findIndex( index =>
            index.codmei === dat.codmei);
          if( indx <0){
            this.logicaVaciosModifica();
          }else{
            if( this._RecetaMOD.recetadetalle !== undefined ){
              this._RecetaMOD.recetadetalle.forEach(element => {
                if(dat.meinid === element.meinid){
                  element.acciond = 'E';
                }
              });
            }
            this.desactivabtnelim = false;
            this.arrdetalleSolicitudMed.splice(indx, 1);
            this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0, 20);
            this.logicaVaciosModifica();
            this.logicaBodega();
            /** desactiva btn eliminar grilla tras accion */
            this.desactivabtnelim = false;
          }
        }else{
          this.logicaVaciosModifica();
        }
      }else{
        if(dat.acciond === "M"  && dat.redeid > 0 ) {
          if(dat.marcacheckgrilla ===true){
            let indx = null;
            indx = this.arrdetalleSolicitudMed.findIndex(x => x.codmei === dat.codmei);
            this.arrdetalleSolicitudMedPaginacion_aux[index].acciond = 'E';
            this.arrdetalleSolicitudMed.splice(indx, 1);
            /** desactiva btn eliminar grilla tras accion */
            this.desactivabtnelim = false;
          }
        }
      }
    });
    this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0, 20);
    this.arrdetalleSolicitudMedMOD = this.arrdetalleSolicitudMedPaginacion_aux;
    this.logicaBodega();
  }

  async findArticuloGrilla() {
    this.loading = true;
    if ( this.FormDatosProducto.controls.codigo.touched &&
        this.FormDatosProducto.controls.codigo.status !== 'INVALID') {
        var codProdAux = this.FormDatosProducto.controls.codigo.value.toString();
      if(this.FormDatosPaciente.controls.numsolicitud.value >0){

        this.arrdetalleSolicitudMed = [];
        this.arrdetalleSolicitudMedPaginacion = [];

        let arrSolicitudes: Array<Solicitud> = [];

        arrSolicitudes = await this._solicitudService.BuscaSolicitud(this.FormDatosPaciente.controls.numsolicitud.value,
        this.hdgcodigo,this.esacodigo, this.cmecodigo, 0, null, null, 0, 0, null, this.servidor,
        0, this.dataPacienteSolicitud.codambito, 0, 0, 0, 0, null,70,codProdAux,"").toPromise();

          this.dataPacienteSolicitud = arrSolicitudes[0];
          this.loading = false;
          this.existpaciente = true;//Habilita boton Producto
          this.existsolicitud = true;
          this.btneliminagrilla = false;
          this.nuevasolicitud = false;
          this.btnimprime = true;

          this.FormDatosPaciente.get('estado').disable();
          this.FormDatosPaciente.get('estado').setValue(this.dataPacienteSolicitud.estadosolicitud);
          this.arrdetalleSolicitud = this.dataPacienteSolicitud.solicitudesdet;
          this.FormDatosPaciente.get('numsolicitud').setValue(this.dataPacienteSolicitud.soliid);
          this.FormDatosPaciente.get('numeroreceta').setValue(this.dataPacienteSolicitud.numeroreceta);
          this.FormDatosPaciente.get('numeroboleta').setValue(this.dataPacienteSolicitud.boleta);
          this.FormDatosPaciente.get('comprobantecaja').setValue(this.dataPacienteSolicitud.comprobantecaja);
          this.FormDatosPaciente.get('estadocomprobantecaja').setValue(this.dataPacienteSolicitud.estadocomprobantecaja);
          this.FormDatosPaciente.get('entrega').setValue(this.dataPacienteSolicitud.diasentregacodigo);
          this.FormDatosPaciente.get('bodcodigo').setValue(this.dataPacienteSolicitud.bodorigen);
          this.FormDatosPaciente.get('numcuenta').setValue(this.dataPacienteSolicitud.cuentanumcuenta);
          this.FormDatosPaciente.get('fechahora').setValue(new Date(this.dataPacienteSolicitud.fechacreacion));
          this.FormDatosPaciente.controls.numeroreceta.disable();
          if (this.dataPacienteSolicitud.recetaentregaprog == "S") {
            this.FormDatosPaciente.get('marcacheck').setValue(true);

            this.colLoteprod = false;
            this.coladispensar = false;
          } else {
            this.colLoteprod = true;
            this.coladispensar = true;
          }

          if(this.dataPacienteSolicitud.estadosolicitud == 50){
            this.tiporeceta = 'Total';
            this.FormDatosPaciente.get('bodcodigo').disable();
            this.bloqueacamposgrilla = false;
            this.bloqueacamposgrilla2 = false;
            this.btnmodificar = false;
            this.agregarproducto = false;

          }else{
            if(this.dataPacienteSolicitud.estadosolicitud == 40){

              this.tiporeceta = 'Parcial';
              this.btnmodificar = true;
              this.bloqueacamposgrilla = false;
              this.bloqueacamposgrilla2 = true;
            }
            else{

              this.bloqueacamposgrilla = true;
              this.bloqueacamposgrilla2 = true;

            }
          }

          this.loading = false;
          this.dataPacienteSolicitud.solicitudesdet.forEach(element => {

            element.cantadespachar = element.cantsoli - element.cantdespachada;
            element.cantadespacharresp = element.cantadespachar;

            if(this.dataPacienteSolicitud.estadosolicitud == 40){
              this.tiporeceta = 'Parcial';
              element.bloqcampogrilla = false;
              element.marcacheckgrilla = false;
            }

            element.detallelote.forEach(dl=>{
              element.lote = dl.lote;
              element.fechavto = dl.fechavto;
            })

            if (element.tiporegmein == "M") {
              if (element.recetaentregaprogdet == "S") {

                //el cantadespachar se deja en 0, para que no pueda despacharse nuevmente y se dejan bloqueados
                //los campos cantadespahcar y lotes
                element.cantadespachar = 0;
                element.cantadespacharresp = element.cantadespachar;
                element.bloqcampogrilla2 = false;
              }
              this.arrdetalleSolicitudMed.push(element);
              this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0,20);

              this.logicaBodega();

            } else {
              if (element.tiporegmein == "I") {
                element.cantadespachar = element.cantsoli - element.cantdespachada;
                this.arrdetalleSolicitudIns.push(element);
                this.arrdetalleSolicitudInsPaginacion = this.arrdetalleSolicitudIns.slice(0, 20);
              }
            }
            this.ActivaBotonBuscaGrilla = true;
            this.ActivaBotonLimpiaBusca = true;
            this.logicaVacios();
          });
        this.loading = false;
        return;
      }else{ //Cuando la plantilla aún no se crea
        this.arrdetalleSolicitudMed_2 = [];

        this._solicitudService.BuscarProductoPorLike(this.hdgcodigo, this.esacodigo,
          this.cmecodigo,codProdAux,1,this.usuario,this.servidor,
          this.arrdetalleSolicitudMed,null,null,null,null).subscribe(response => {
          if(response != null){
            this.arrdetalleSolicitudMed_2=response;

            this.arrdetalleSolicitudMed = [];
            this.arrdetalleSolicitudMedPaginacion = [];

            this.arrdetalleSolicitudMed = this.arrdetalleSolicitudMed_2;
            this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0,20);
            this.ActivaBotonLimpiaBusca = true;
            this.loading = false;

            this.logicaBodega();

          }else{
            this.FormDatosProducto.reset();
            this.loading = false;
          }
        });
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

    this.arrdetalleSolicitudMed = [];
    this.arrdetalleSolicitudMedPaginacion = [];

    // Llenar Array Auxiliares
    this.arrdetalleSolicitudMed = this.arrdetalleSolicitudMed_aux;
    this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMedPaginacion_aux;
    this.ActivaBotonLimpiaBusca = false;
    this.loading = false;
    this.logicaBodega();
  }

  inicioModificar(){
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea '.concat(this.glsMensajeMod).concat(' de ').concat(this.glsambito).concat('?'),
      text: "Confirmar la acción",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.value) {
        if(this._Receta !== null){
          if (this._Receta.receid > 0 && this._Solicitud.receid === undefined) {
            this.modificareceta = true;
            this.modificarReceta();
          }
          if (this._Receta.receid === 0 && this.dataPacienteSolicitud.soliid > 0) {
            this.grabarSolicitud();
          }
          if (this._Receta.receid > 0 && this.dataPacienteSolicitud.soliid > 0) {
            this.modificarReceta();
            this.grabarSolicitud();
          }
        }
        if (this._Receta === null && this._Solicitud !== null) {

          this._RecetaMOD = new Receta();
          this._RecetaMOD.receid = 0;
          this._RecetaMOD.esacodigo = this.esacodigo;
          this._RecetaMOD.cmecodigo = this.cmecodigo;
          this._RecetaMOD.receambito = this.codambito;
          this._RecetaMOD.recetipo = 'MANUAL';
          if (this.FormDatosPaciente.controls.numeroreceta.value > 0 ||
            this.FormDatosPaciente.controls.numeroreceta.value != undefined){

            this._RecetaMOD.recenumero = this.FormDatosPaciente.controls.numeroreceta.value;
            }else{

              this._RecetaMOD.recenumero = 0;
            }

          this._RecetaMOD.recesubreceta = 1;
          this._RecetaMOD.recefecha = ' ';
          this._RecetaMOD.cajanumerocomprobante = 0;
          this._RecetaMOD.recefechaentrega = ' ';
          this._RecetaMOD.fichapaci = 0;
          this._RecetaMOD.recectaid = this.dataPacienteSolicitud.ctaid;
          this._RecetaMOD.receurgid = 0;
          this._RecetaMOD.recedau = 0;
          this._RecetaMOD.rececliid = this.dataPacienteSolicitud.cliid;
          this._RecetaMOD.recetipdocpac = this.dataPacienteSolicitud.tipodocpac;
          this._RecetaMOD.recedocumpac = this.FormDatosPaciente.controls.numidentificacion.value;
          this._RecetaMOD.recenombrepaciente = this.FormDatosPaciente.controls.nombrepaciente.value;
          this._RecetaMOD.recetipdocprof = this.dataPacienteSolicitud.tipodocprof;
          if(this.dataPacienteSolicitud.numdocprof === '' || this.dataPacienteSolicitud.numdocprof === undefined){

            this._RecetaMOD.recedocumprof = ' ';
          }else{

            this._RecetaMOD.recedocumprof = this.dataPacienteSolicitud.numdocprof;
          }
          if(this.dataPacienteSolicitud.nombremedico === '' ){

            this._RecetaMOD.recenombremedico = ' ';
          }else{

            this._RecetaMOD.recenombremedico = this.dataPacienteSolicitud.nombremedico;
          }

          this._RecetaMOD.receespecialidad = ' ';
          this._RecetaMOD.recerolprof = ' ';
          this._RecetaMOD.rececodunidad = this.dataPacienteSolicitud.codservicioactual;
          this._RecetaMOD.receglosaunidad = this.dataPacienteSolicitud.undglosa;
          this._RecetaMOD.rececodservicio = this.dataPacienteSolicitud.codservicioactual;
          this._RecetaMOD.receglosaservicio = this.dataPacienteSolicitud.undglosa;
          this._RecetaMOD.rececodigocama = this.dataPacienteSolicitud.cama;
          if(this.dataPacienteSolicitud.camglosa != ''){

            this._RecetaMOD.receglosacama = ' ';
          }else{

            this._RecetaMOD.receglosacama = this.dataPacienteSolicitud.camglosa;
          }
          this._RecetaMOD.rececodigopieza = this.dataPacienteSolicitud.codpieza;
          this._RecetaMOD.receglosapieza = ' ';
          this._RecetaMOD.servidor = this.servidor;
          this._RecetaMOD.receobservacion = ' ';

          this.modificarReceta();
        }
      }

    });

    this.loading = false;
  }

  async modificarReceta() {

    this.loading = true;

    if( !this.modificareceta ){
      this.arrdetalleSolicitudMedMOD = this.arrdetalleSolicitudMedPaginacion;
    }
    let _DetalleAux :Array <DetalleReceta> = [];
      var CreaRecetas = new CreacionReceta();
      CreaRecetas.receid = this._RecetaMOD.receid;
      CreaRecetas.esacodigo = this._RecetaMOD.esacodigo;
      CreaRecetas.cmecodigo = this._RecetaMOD.cmecodigo;
      CreaRecetas.ambito = this._RecetaMOD.receambito;
      CreaRecetas.tipo = this._RecetaMOD.recetipo;
      CreaRecetas.numero = this._RecetaMOD.receid;
      CreaRecetas.subreceta = this._RecetaMOD.recesubreceta;
      CreaRecetas.fecha = this._RecetaMOD.recefecha;
      CreaRecetas.fechaentrega = this._RecetaMOD.recefechaentrega;
      CreaRecetas.fichapaci = this._RecetaMOD.fichapaci;
      CreaRecetas.ctaid = this._RecetaMOD.recectaid;
      CreaRecetas.urgid = this._RecetaMOD.receurgid;
      CreaRecetas.dau = this._RecetaMOD.recedau;
      CreaRecetas.clid = this._RecetaMOD.rececliid;
      CreaRecetas.tipdocpac = this._RecetaMOD.recetipdocpac;
      CreaRecetas.documpac = this._RecetaMOD.recedocumpac.trim();
      CreaRecetas.nombrepaciente = this._RecetaMOD.recenombrepaciente
      CreaRecetas.tipdocprof = this._RecetaMOD.recetipdocprof;
      CreaRecetas.documprof = this._RecetaMOD.recedocumprof.trim();
      CreaRecetas.nombremedico = this._RecetaMOD.recenombremedico;
      CreaRecetas.especialidad = this._RecetaMOD.receespecialidad;
      CreaRecetas.rolprof = this._RecetaMOD.recerolprof;
      CreaRecetas.codunidad = this._RecetaMOD.rececodunidad;
      CreaRecetas.glosaunidad = this._RecetaMOD.receglosaunidad;
      CreaRecetas.codservicio = this._RecetaMOD.rececodservicio;
      CreaRecetas.glosaservicio = this._RecetaMOD.receglosaservicio;
      CreaRecetas.codcama = this._RecetaMOD.rececodigocama;
      CreaRecetas.camglosa = this._RecetaMOD.receglosacama;
      CreaRecetas.codpieza = this._RecetaMOD.rececodigopieza;
      CreaRecetas.pzagloza = this._RecetaMOD.receglosapieza;
      CreaRecetas.tipoprevision = null;
      CreaRecetas.glosaprevision = null;
      CreaRecetas.previsionpac = null;
      CreaRecetas.glosaprevpac = null;
      CreaRecetas.estadoreceta = 'PE';
      CreaRecetas.servidor = this.servidor;
      CreaRecetas.receobservacion = ' ';
      CreaRecetas.codbodega = this.FormDatosPaciente.controls.bodcodigo.value;

      this._RecetaMOD.recetadetalle = this.arrdetalleSolicitudMedMOD;

      this.arrdetalleSolicitudMedMOD.forEach(element => {
        var _Detalle = new DetalleReceta;

        if (element.acciond !== 'I'){
          _Detalle.redeid         = element.redeid;
          _Detalle.acciond        = element.acciond;

        } else {
          _Detalle.redeid         = 0;
        }
        _Detalle.codigoprod     = element.codmei;
        _Detalle.descriprod     = element.meindescri;
        _Detalle.dosis          = element.dosis;
        _Detalle.veces          = element.formulacion;
        _Detalle.tiempo         = element.dias;
        _Detalle.glosaposo      = element.posologia;
        _Detalle.cantidadsolici = element.cantsoli;
        _Detalle.cantidadadespa = element.cantadespachar;
        _Detalle.estadoprod     = ' ';
        _Detalle.acciond        = element.acciond;

        _DetalleAux.unshift(_Detalle)

      });
      CreaRecetas.recetadetalle = _DetalleAux;

      this._solicitudService.CrearReceta(CreaRecetas).subscribe(response => {
        if (response != null){
          this.alertSwal.title = 'Receta ' + response + ' ' + this.glsMensajeResp + ' Con Éxito';
          this.alertSwal.show();
          this.ValidaEstadoSolicitud(1,'modificareceta');
          this.limpiar();
          this.CargaPacienteReceta(Number(response));
          this.loading=false;
        } else {
          this.loading = false;
        }
      });
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {​​​​​​​​

    if(this.bandera_aux != undefined){
      if(this.bandera_aux != 2){
        this.ValidaEstadoSolicitud(1,'HostListener');
      }
    }

  }​​​​​​​​

  validaRut(){
    this.alertSwalAlert.title = null;
    this.alertSwalAlert.text = null;
    if (this.FormDatosPaciente.controls.rutretira.value != undefined &&
      this.FormDatosPaciente.controls.rutretira.value != null &&
      this.FormDatosPaciente.controls.rutretira.value != " " &&
      this.FormDatosPaciente.controls.rutretira.value != ""){
      const newRut = this.FormDatosPaciente.controls.rutretira.value.replace(/\./g,'').replace(/\-/g, '').trim().toLowerCase();
        const lastDigit = newRut.substr(-1, 1);
        const rutDigit = newRut.substr(0, newRut.length-1);
        let format = '';
        for (let i = rutDigit.length; i > 0; i--) {
          const e = rutDigit.charAt(i-1);
          format = e.concat(format);
          if (i % 3 === 0){
            format = ''.concat(format);
          }
        }

        this.FormDatosPaciente.get('rutretira').setValue(format.concat('-').concat(lastDigit));
        if( !validateRUT(this.FormDatosPaciente.controls.rutretira.value)){
          this.alertSwalAlert.title = 'Rut no válido';
          this.alertSwalAlert.text = 'Favor validar el rut de la persona que retira';
          this.alertSwalAlert.show();
        }
    }

  }

  limpialistado() {
    const Swal = require('sweetalert2');
    var text = "`<h2>No puede Generar Despacho</h2><br/>" + this.respPermiso + "`";
    Swal.fire({
      html: text
    });
  }

  SeleccionaBodegaActiva(){}

  inicioEliminar(){
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Eliminar la Receta de '.concat(this.glsambito).concat('?'),
      text: "Confirmar la acción",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.value) {
        this.loading = true;
        if(this._Receta != null){

          this.modificarReceta();
          // return;
          if (this._Receta.receid > 0 && this._Solicitud.receid === undefined) {

            this.eliminarReceta();
            // this.modificarReceta();
          }
        }

        if (this._Receta === null && this._Solicitud !== null) {
        this._RecetaMOD = new Receta();
        this._RecetaMOD.receid = 0;
        this._RecetaMOD.esacodigo = this.esacodigo;
        this._RecetaMOD.cmecodigo = this.cmecodigo;
        this._RecetaMOD.receambito = this.codambito;
        this._RecetaMOD.recetipo = 'MANUAL';
        if (this.FormDatosPaciente.controls.numeroreceta.value > 0 ||
          this.FormDatosPaciente.controls.numeroreceta.value != undefined){
          this._RecetaMOD.recenumero = this.FormDatosPaciente.controls.numeroreceta.value;
          }else{
            this._RecetaMOD.recenumero = 0;
          }
        this._RecetaMOD.recesubreceta = 1;
        this._RecetaMOD.recefecha = ' ';
        this._RecetaMOD.cajanumerocomprobante = 0;
        this._RecetaMOD.recefechaentrega = ' ';
        this._RecetaMOD.fichapaci = 0;
        this._RecetaMOD.recectaid = this.dataPacienteSolicitud.ctaid;
        this._RecetaMOD.receurgid = 0;
        this._RecetaMOD.recedau = 0;
        this._RecetaMOD.rececliid = this.dataPacienteSolicitud.cliid;
        this._RecetaMOD.recetipdocpac = this.dataPacienteSolicitud.tipodocpac;
        this._RecetaMOD.recedocumpac = this.FormDatosPaciente.controls.numidentificacion.value;
        this._RecetaMOD.recenombrepaciente = this.FormDatosPaciente.controls.nombrepaciente.value;
        this._RecetaMOD.recetipdocprof = this.dataPacienteSolicitud.tipodocprof;
        if(this.dataPacienteSolicitud.numdocprof === '' || this.dataPacienteSolicitud.numdocprof === undefined){
          this._RecetaMOD.recedocumprof = ' ';
        }else{
          this._RecetaMOD.recedocumprof = this.dataPacienteSolicitud.numdocprof;
        }
        if(this.dataPacienteSolicitud.nombremedico === '' ){
          this._RecetaMOD.recenombremedico = ' ';
        }else{
          this._RecetaMOD.recenombremedico = this.dataPacienteSolicitud.nombremedico;
        }
        this._RecetaMOD.receespecialidad = ' ';
        this._RecetaMOD.recerolprof = ' ';
        this._RecetaMOD.rececodunidad = this.dataPacienteSolicitud.codservicioactual;
        this._RecetaMOD.receglosaunidad = this.dataPacienteSolicitud.undglosa;
        this._RecetaMOD.rececodservicio = this.dataPacienteSolicitud.codservicioactual;
        this._RecetaMOD.receglosaservicio = this.dataPacienteSolicitud.undglosa;
        this._RecetaMOD.rececodigocama = this.dataPacienteSolicitud.cama;
        if(this.dataPacienteSolicitud.camglosa != ''){
          this._RecetaMOD.receglosacama = ' ';
        }else{
          this._RecetaMOD.receglosacama = this.dataPacienteSolicitud.camglosa;
        }
        this._RecetaMOD.rececodigopieza = this.dataPacienteSolicitud.codpieza;
        this._RecetaMOD.receglosapieza = ' ';
        this._RecetaMOD.servidor = this.servidor;
        this._RecetaMOD.receobservacion = ' ';

        this.modificarReceta();
      }
    }});

    this.loading = false;
  }

  eliminarReceta() {

    let _DetalleAux :Array <DetalleReceta> = [];
    if ( this._Receta.cajanumerocomprobante === 0 ) {
        var CreaRecetas = new CreacionReceta();
        CreaRecetas.receid = this._Receta.receid;
        CreaRecetas.esacodigo = this._Receta.esacodigo;
        CreaRecetas.cmecodigo = this._Receta.cmecodigo;
        CreaRecetas.ambito = this._Receta.receambito;
        CreaRecetas.tipo = this._Receta.recetipo;
        CreaRecetas.numero = this._Receta.receid;
        CreaRecetas.subreceta = this._Receta.recesubreceta;
        CreaRecetas.fecha = this._Receta.recefecha;
        CreaRecetas.fechaentrega = this._Receta.recefechaentrega;
        CreaRecetas.fichapaci = this._Receta.fichapaci;
        CreaRecetas.ctaid = this._Receta.recectaid;
        CreaRecetas.urgid = this._Receta.receurgid;
        CreaRecetas.dau = this._Receta.recedau;
        CreaRecetas.clid = this._Receta.rececliid;
        CreaRecetas.tipdocpac = this._Receta.recetipdocpac;
        CreaRecetas.documpac = this._Receta.recedocumpac;
        CreaRecetas.nombrepaciente = this._Receta.recenombrepaciente
        CreaRecetas.tipdocprof = this._Receta.recetipdocprof;
        CreaRecetas.documprof = this._Receta.recedocumprof;
        CreaRecetas.nombremedico = this._Receta.recenombremedico;
        CreaRecetas.especialidad = this._Receta.receespecialidad;
        CreaRecetas.rolprof = this._Receta.recerolprof;
        CreaRecetas.codunidad = this._Receta.rececodunidad;
        CreaRecetas.glosaunidad = this._Receta.receglosaunidad;
        CreaRecetas.codservicio = this._Receta.rececodservicio;
        CreaRecetas.glosaservicio = this._Receta.receglosaservicio;
        CreaRecetas.codcama = this._Receta.rececodigocama;
        CreaRecetas.camglosa = this._Receta.receglosacama;
        CreaRecetas.codpieza = this._Receta.rececodigopieza;
        CreaRecetas.pzagloza = this._Receta.receglosapieza;
        CreaRecetas.tipoprevision = 0;
        CreaRecetas.glosaprevision = ' ';
        CreaRecetas.previsionpac = 0;
        CreaRecetas.glosaprevpac = ' ';
        CreaRecetas.estadoreceta = 'PE';
        CreaRecetas.servidor = this.servidor;
        CreaRecetas.receobservacion = ' ';

        this._Receta.recetadetalle = this.arrdetalleSolicitudMed;

        this.arrdetalleSolicitudMed.forEach(element => {
          var _Detalle = new DetalleReceta;
          _Detalle.redeid         = element.redeid;
          _Detalle.acciond        = element.acciond;
          _Detalle.codigoprod     = element.codmei;
          _Detalle.descriprod     = element.meindescri;
          _Detalle.dosis          = element.dosis;
          _Detalle.veces          = element.formulacion;
          _Detalle.tiempo         = element.dias;
          _Detalle.glosaposo      = element.posologia;
          _Detalle.cantidadsolici = element.cantsoli;
          _Detalle.cantidadadespa = element.cantadespachar;
          _Detalle.estadoprod     = ' ';
          _Detalle.acciond        = 'E';

          _DetalleAux.unshift(_Detalle)

        });
        CreaRecetas.recetadetalle = _DetalleAux;
        this.loading=false;

        this._solicitudService.EliminarReceta(CreaRecetas).subscribe(async response => {
          if (response != null){
            this.alertSwal.title = 'Receta eliminada con Éxito';
            this.alertSwal.show();
            this.ValidaEstadoSolicitud(1,'modificareceta');
            this.limpiar();
            this.iseliminada = true;
            await this.CargaPacienteReceta(Number(response));
            this.loading=false;

          } else {
            this.loading = false;
          }
        });
    } else {
      this.alertSwal.title = "Receta";
      this.alertSwal.text = "No puede ser Eliminada";
      this.alertSwal.show();
    }
  }

  /** no permite agregar mas de 1 producto para bodega controlados */
  logicaBodega() {

    if( this.codbodega === 6 &&
        this.arrdetalleSolicitudMedPaginacion.length > 0 ) {

      this.isbodegacontrolado = true;
      this.FormDatosProducto.disable();

    }else {
      this.FormDatosProducto.enable();
      this.isbodegacontrolado = false;
    }

  }

  SeleccionTipoDoc() {}

  async getMedicoTipoDoc() {

    const tipodocumentomed: any = this.FormDatosPaciente.controls.tipodocumentomed.value;
    const numidentificacionmedico = this.FormDatosPaciente.controls.numidentificacionmedico.value;
    const apellidopatemedico = null;
    const apellidomatemedico = null;
    const nombremedico = null;
    let retorno = null;

    retorno = await this._solicitudService.BuscaProfesional(this.servidor,
      parseInt(tipodocumentomed),
      numidentificacionmedico,
      apellidopatemedico,
      apellidomatemedico,
      nombremedico).toPromise();

    if( retorno !== null ){
        if( retorno.length > 1 ){
          this.BuscaProfesional();

        }else if( retorno.length === 1 ) {
            this.datosprofesional = retorno[0];
            this.setDatosmedico();

        }else {
          return;

        }

    }

  }

  BuscaProfesional() {
    this._BSModalRef = this._BsModalService.show(ModalbusquedaprofesionalComponent,
      this.setModalBuscaProfesional("Busqueda Profesionales: "));
    this._BSModalRef.content.onClose.subscribe((Retorno: DatosProfesional) => {

      this.datosprofesional = Retorno;

      this.setDatosmedico();

    });

  }

  setDatosmedico() {

    this.FormDatosPaciente.get('tipodocumentomed').setValue(this.datosprofesional.codtipidentificacion);
    this.FormDatosPaciente.get('numidentificacionmedico').setValue(this.datosprofesional.clinumidentificacion);
    this.FormDatosPaciente.get('nombremedico').setValue(this.datosprofesional.nombreprof);
    this.FormDatosPaciente.get('apellidopatemedico').setValue(this.datosprofesional.paternoprof);
    this.FormDatosPaciente.get('apellidomatemedico').setValue(this.datosprofesional.maternoprof);

    this.dataPacienteSolicitud.tipodocprof = this.datosprofesional.codtipidentificacion;
    this.dataPacienteSolicitud.numdocprof = this.datosprofesional.clinumidentificacion;
    this.dataPacienteSolicitud.nombremedico = this.datosprofesional.nombreprof," ",this.datosprofesional.paternoprof," ",this.datosprofesional.maternoprof;

    this.FormDatosPaciente.controls.bodcodigo.enable();

  }

  setModalBuscaProfesional(titulo: string) {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo        : titulo,
        tipodocumento : this.FormDatosPaciente.controls.tipodocumentomed.value,
        numidentificacion: this.FormDatosPaciente.controls.numidentificacionmedico.value,
        nombres       : this.FormDatosPaciente.controls.nombremedico.value,
        apepaterno    : this.FormDatosPaciente.controls.apellidopatemedico.value,
        apematerno    : this.FormDatosPaciente.controls.apellidomatemedico.value,
      }
    };
    return dtModal;
  }

  bodegaisnull( bodcodigo: any ) {

    if( bodcodigo === null || bodcodigo === 0 ) {
        this.FormDatosPaciente.controls.bodcodigo.enable();

    }else {
        this.FormDatosPaciente.controls.bodcodigo.disable();

    }

  }

  habilitaMedico( activa: boolean) {

    if(activa) {
      this.FormDatosPaciente.controls.tipodocumentomed.enable();
      this.FormDatosPaciente.controls.nombremedico.enable();
      this.FormDatosPaciente.controls.numidentificacionmedico.enable();
      this.FormDatosPaciente.controls.apellidopatemedico.enable();
      this.FormDatosPaciente.controls.apellidomatemedico.enable();

    }else {
      this.FormDatosPaciente.controls.tipodocumentomed.disable();
      this.FormDatosPaciente.controls.nombremedico.disable();
      this.FormDatosPaciente.controls.numidentificacionmedico.disable();
      this.FormDatosPaciente.controls.apellidopatemedico.disable();
      this.FormDatosPaciente.controls.apellidomatemedico.disable();

    }


  }

  async getMedicoNombres() {

    const tipodocumentomed: any = this.FormDatosPaciente.controls.tipodocumentomed.value;
    const numidentificacionmedico = null;
    const apellidopatemedico = this.FormDatosPaciente.controls.apellidopatemedico.value;
    const apellidomatemedico = this.FormDatosPaciente.controls.apellidomatemedico.value;
    const nombremedico = this.FormDatosPaciente.controls.nombremedico.value;
    let retorno = null;

    retorno = await this._solicitudService.BuscaProfesional(this.servidor,
        parseInt(tipodocumentomed),
        numidentificacionmedico,
        apellidopatemedico,
        apellidomatemedico,
        nombremedico).toPromise();

    if( retorno !== null ){
        if( retorno.length > 1 ){

          this.BuscaProfesional();

        }else if( retorno.length === 1 ) {
            this.datosprofesional = retorno[0];
            this.setDatosmedico();

        }else {
          return;

        }

    }

  }

  desactivaAccion() {
    this.btnEliminar = false;
    this.btnDispensar = false;
    this.verificanull = false;

  }

  verificaDispensar(despacho: DetalleSolicitud) {

    const indx = this.arrdetalleSolicitudMedPaginacion.findIndex(x => x.codmei === despacho.codmei);

    if( despacho.cantadespachar > despacho.cantsoli ) {
      this.alertSwalAlert.title = 'Supera el máximo a dispensar';
      this.alertSwalAlert.show();

      this.arrdetalleSolicitudMedPaginacion[indx].cantadespachar = despacho.cantsoli;


    }

  }

  activaAccion() {
    this.btnEliminar = true;
    // this.btnDispensar = true;

  }


  /**
   * controla acciones segun estado
   */
  logicaEstadosreceta() {

    if( this._Receta.cajanumerocomprobante > 0 ||
      this._Receta.codcobroincluido > 0 ){
      /**
       * Si tiene comprobante u cobro incluido:
       * SI dispensar pero NO modificar/eliminar grilla
       * Actualización 27/12/2021: se podran eliminar de grilla
       *  productos con cantidadpagadacaja = 0
       */
      this.arrdetalleSolicitudMed.forEach(x=>{
        x.bloqcampogrilla = false;
        x.bloqcampogrilla2 = false;

        // check eliminar
        if( x.cantidadpagadacaja > 0 ){
          x.bloqcampogrilla3 = false;

        }else{
          x.bloqcampogrilla3 = true;

        }

        x.bloqcampogrilla4 = false;

      });
    }

    if( this.recenopagada ) {
      /** permite modificar pero NO dispensar */
      this.btnDispensar = false;
      this.verificanull = false;

      this.arrdetalleSolicitudMed.forEach(x=>{
        x.bloqcampogrilla = true;
        x.bloqcampogrilla2 = true;
        x.bloqcampogrilla3 = true;
        x.bloqcampogrilla4 = true;

      });

    }

    let ispagado = true;
    /**
     * condicion si receta esta dispensada
     */
    if( this._Receta.recesolid > 0 ){

      /**
       * condicion si receta esta pagada
       */
        if( this.dataPacienteSolicitud.comprobantecaja !== undefined ){
        if( parseInt(this.dataPacienteSolicitud.comprobantecaja) > 0 ){
          ispagado = true;

        }

      } else if(this._Receta.cajanumerocomprobante > 0) {
        ispagado = true;

      }

      /**
       * condicion si receta No esta pagada
       */
      if( this.dataPacienteSolicitud.comprobantecaja !== undefined ){
        if( parseInt(this.dataPacienteSolicitud.comprobantecaja) === 0 ){
          ispagado = false;

        }

      } else if(this._Receta.cajanumerocomprobante === 0) {
        ispagado = false;

      }

      this.logicaDispensadopagado(ispagado);

    }
    /**
     *  condicion si receta No esta dispensada
     */
    else if( this._Receta.recesolid === 0 ) {

      /**
       * condicion si receta esta pagada
       */
      if( this.dataPacienteSolicitud.comprobantecaja !== undefined ){
        if( parseInt(this.dataPacienteSolicitud.comprobantecaja) > 0 ){
          ispagado = true;

        }

      } else if(this._Receta.cajanumerocomprobante > 0) {
        ispagado = true;

      }



      /**
       * condicion si receta No esta pagada
       */
      if( this.dataPacienteSolicitud.comprobantecaja !== undefined ){
        if( parseInt(this.dataPacienteSolicitud.comprobantecaja) === 0 ){
          ispagado = false;

        }

      } else if(this._Receta.cajanumerocomprobante === 0) {
        ispagado = false;

      }
      this.logicaDispensadopagado(ispagado);

    }

  }

  logicaNopagados() {
    let detalle: Array<DetalleSolicitud> = [];
    for(let producto of this._Solicitud.solicitudesdet ) {

      if( producto.cantidadpagadacaja > 0 ){
        detalle.push(producto);

      }

    }

    this._Solicitud.solicitudesdet = detalle;
  }

  logicaReambulatorio() {
      if( this._Receta.recesolid > 0 ){
        this.FormDatosPaciente.controls.retiro.disable();
        this.FormDatosPaciente.controls.tipodocumentoretira.disable();
        this.FormDatosPaciente.controls.rutretira.disable();
        this.FormDatosPaciente.controls.nombreretira.disable();


      }


  }

  logicaDispensadopagado( ispagado: boolean ) {
    switch (ispagado) {
      case true:
        /**
           * desactiva btnEliminar
           */
         this.btnEliminar = true;
         this.nopagada = false;

         /**
          * desactiva Agregar Producto
          */
         this.agregarproducto = false;
         this.logicaBodega();
      break;

      case false:
        /**
           * activa btnEliminar
           */
         this.btnEliminar = true;
         this.nopagada = true;

         /**
          * activa Agregar Producto
          */
         this.agregarproducto = true;
         this.logicaBodega();
      break;

    }

  }

}
