import { Component, OnInit, ViewChild } from '@angular/core';
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


/* Models */
import { DocIdentificacion } from '../../models/entity/DocIdentificacion';
import { Solicitud } from '../../models/entity/Solicitud';
import { DetalleSolicitud } from '../../models/entity/DetalleSolicitud';
import { Articulos } from '../../models/entity/mantencionarticulos';
import { TipoAmbito } from '../../models/entity/TipoAmbito';
import { EstadoSolicitud } from '../../models/entity/EstadoSolicitud';
import { DevuelveDatosUsuario } from '../../models/entity/DevuelveDatosUsuario';
/*Components */
import { BusquedaproductosComponent } from '../busquedaproductos/busquedaproductos.component';


/*Services */
import { DocidentificacionService } from '../../servicios/docidentificacion.service';
import { SolicitudService } from '../../servicios/Solicitudes.service';
import { TipoambitoService } from '../../servicios/tiposambito.service';
import { EventosSolicitudComponent } from '../eventos-solicitud/eventos-solicitud.component';
import { EventosDetallesolicitudComponent } from '../eventos-detallesolicitud/eventos-detallesolicitud.component';
import { BusquedapacientesComponent } from '../busquedapacientes/busquedapacientes.component';
import { ListaPacientes } from 'src/app/models/entity/ListaPacientes';
import { BusquedaSolicitudPacienteAmbulatorioComponent } from '../busqueda-solicitud-paciente-ambulatorio/busqueda-solicitud-paciente-ambulatorio.component';
import { DespachoDetalleSolicitud } from 'src/app/models/entity/DespachoDetalleSolicitud';
import { analyzeAndValidateNgModules } from '@angular/compiler';
//import { SSL_OP_CISCO_ANYCONNECT } from 'constants';
import { DispensarsolicitudesService } from '../../servicios/dispensarsolicitudes.service';
import { EstadoRecetaProg } from 'src/app/models/entity/EstadoRecetaProg';
import { Router, ActivatedRoute } from '@angular/router';
import { PacientesService } from '../../servicios/pacientes.service'
import { BodegasTodas } from 'src/app/models/entity/BodegasTodas';
import { BodegasService } from '../../servicios/bodegas.service';
import { Receta } from 'src/app/models/entity/receta';
import { Paciente } from 'src/app/models/entity/Paciente';
import { BusquedaServiciosComponent } from '../busqueda-servicios/busqueda-servicios.component';
import { Permisosusuario } from '../../permisos/permisosusuario';
import { DetalleRecetas } from 'src/app/models/entity/detalle-recetas';
import { DISPENSACIONRECETAS } from 'src/app/models/entity/dispensacion-recetas';
import { InterfacesService } from 'src/app/servicios/interfaces.service';

@Component({
  selector: 'app-despacho-recetas-ambulatoria',
  templateUrl: './despacho-recetas-ambulatoria.component.html',
  styleUrls: ['./despacho-recetas-ambulatoria.component.css'],
  providers: [DispensarsolicitudesService],
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
  public articulos                       : Array<Articulos> = [];
  public articulos2                      : Articulos;
  public docsidentis                     : Array<DocIdentificacion> = [];
  public tipoambitos                     : Array<TipoAmbito> = [];
  public estadosolicitudes               : Array<EstadoSolicitud> = [];
  public arrdetalleSolicitud             : Array<DetalleSolicitud> = [];
  public DespachoArrdetalleSolicitud     : Array<DetalleSolicitud> = [];
  public arrdetalleSolicitudMed          : Array<DetalleSolicitud> = [];
  public arrdetalleSolicitudIns          : Array<DetalleSolicitud> = [];
  public arrdetalleSolicitudPaginacion   : Array<DetalleSolicitud> = [];
  public arrdetalleSolicitudMedPaginacion: Array<DetalleSolicitud> = [];
  public arrdetalleSolicitudInsPaginacion: Array<DetalleSolicitud> = [];
  public estadorecetasprogs              : Array<EstadoRecetaProg> = [];
  //Obj
  public FormDatosPaciente: FormGroup;

  public bodegasSolicitantes    : Array<BodegasTodas> = [];
  private _BSModalRef           : BsModalRef;
  public dataPacienteSolicitud  : Solicitud = new Solicitud();
  public _Solicitud             : Solicitud = new Solicitud();
  public varListaDetalleDespacho: DetalleSolicitud = new DetalleSolicitud();
  public PacienteSolicitud      : Solicitud = new Solicitud();
  //public datosusuario: DevuelveDatosUsuario = new DevuelveDatosUsuario();
  //Var
  public servidor           = environment.URLServiciosRest.ambiente;
  public usuario            = environment.privilegios.usuario;
  public hdgcodigo          : number;
  public esacodigo          : number;
  public cmecodigo          : number;
  public existpaciente      = false;
  public existarticulo      = false;
  public existsolicitud     = false;
  public vacios             = false;
  public nuevasolicitud     = false;
  public tipobusqueda       = "Paciente";
  public modificar          = false;
  public loading            = false;
  public agregarproducto    = false;
  public accion             = 'I';
  public _paciente          : ListaPacientes = new ListaPacientes();
  public pacientehosp       : Paciente = new Paciente();
  public activacomboentrega : boolean = false;
  public checkgrilla        : boolean = true;
  public cantentregas       : number = 0;
  public diasentrega        : number = 0;
  public coddiaentrega      : number = 0;
  public solid              : number = 0;
  public resid              : number = 0;
  public _Receta            : Receta;
  public ambito             : boolean = false;
  public codambito          : number;
  public Receta             : Receta = new Receta();
  public bodselec           : boolean = false;
  public recetaactiva       : boolean = false;
  public recetademonitor    : boolean = false;


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
    private _InterfaceService        : InterfacesService,

  ) {
    this.FormDatosPaciente = this.formBuilder.group({
      tipodocumento           : [{ value: null, disabled: true }, Validators.required],
      numidentificacion       : [{ value: null, disabled: true }, Validators.required],
      numcuenta               : [{ value: null, disabled: true }, Validators.required],
      nombrepaciente          : [{ value: null, disabled: true }, Validators.required],
      numidentificacionmedico : [{ value: null, disabled: true }, Validators.required],
      nombremedico            : [{ value: null, disabled: true }, Validators.required],
      edad                    : [{ value: null, disabled: true }, Validators.required],
      unidad                  : [{ value: null, disabled: true }, Validators.required],
      sexo                    : [{ value: null, disabled: true }, Validators.required],
      ambito                  : [{ value: 3, disabled: false }, Validators.required],
      estado                  : [{ value: 10, disabled: false }, Validators.required],
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
      
    });


  }

  ngOnInit() {

    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();

    this.setDate();
    this.datosUsuario();
    this.getParametros();
    this.BuscaBodegaSolicitante();

    this.resid = 0;
    this.solid = 0

    this.route.paramMap.subscribe(param => {
      if (param.has("soliid")) {
       
        this.solid = parseInt(param.get("soliid"), 10);
        this.codambito = parseInt(param.get("ambito"),10);
      }
    })

    this.route.paramMap.subscribe(param => {
      if (param.has("id_reseta")) {
        // console.log("SIIIIIIII", parseInt(param.get("id_reseta"), 10));
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

  CargaPacienteReceta(resid: number) {
 
   this.loading = true;

    // Cargando recetas apcientes
    this._Receta = new (Receta);
    this._Receta.receid = resid;
    this._Receta.hdgcodigo = this.hdgcodigo;
    this._Receta.esacodigo = this.esacodigo;
    this._Receta.cmecodigo = this.cmecodigo;
    this._Receta.servidor  = this.servidor;
     
    this._buscasolicitudService.buscarestructurarecetas(this._Receta).subscribe(
      response => {
        if (response.length == 0) {
        } else {
          if (response.length > 0) {

            console.log("CARGA PACIENTE RECETA", response);
            this.recetademonitor = true;
            this._Receta = response[0];
            if(this._Receta.receambito == 1){
              this.ambito = false;
            }else{
              if(this._Receta.receambito == 3){
                this.ambito = true;
              }
            }

            this.FormDatosPaciente.get('tipodocumento').setValue(this._Receta.recetipdocpacglosa);
            this.FormDatosPaciente.get('numidentificacion').setValue(this._Receta.recedocumpac);
            this.FormDatosPaciente.get('nombrepaciente').setValue(this._Receta.recenombrepaciente);
            // this.FormDatosPaciente.get('sexo').setValue(response[0].recetipdocpac);
            // this.FormDatosPaciente.get('edad').setValue(response[0].recetipdocpac);
            // this.FormDatosPaciente.get('numcuenta').setValue(this._Receta.recetipdocpac);
            this.FormDatosPaciente.get('numeroreceta').setValue(this._Receta.recenumero);
            // this.FormDatosPaciente.get('numeroboleta').setValue(this._Receta.recetipdocpac);
            this.FormDatosPaciente.get('pieza').setValue(this._Receta.receglosapieza .concat(" ").concat( this._Receta.receglosacama));
            this.FormDatosPaciente.get('comprobantecaja').setValue(this._Receta.cajanumerocomprobante.toString(10));
            this.FormDatosPaciente.get('estadocomprobantecaja').setValue(parseInt(this._Receta.codigoestadocomprobante))
            this.FormDatosPaciente.get('numidentificacionmedico').setValue(this._Receta.recedocumprof)
            this.FormDatosPaciente.get('nombremedico').setValue(this._Receta.recenombremedico);
            this.FormDatosPaciente.get('servicio').setValue(this._Receta.receglosaservicio);

            // console.log("receta_detalleDetalle receta",this._Receta.recetadetalle)
            this._Receta.recetadetalle.forEach(element => {
              var detreceta = new DetalleSolicitud;
              detreceta.codmei         = element.redemeincodmei;
              detreceta.meindescri     = element.redemeindescri;
              detreceta.dosis          = element.rededosis;
              detreceta.formulacion    = element.redeveces;
              detreceta.dias           = element.redetiempo;
              detreceta.cantsoli       = element.redecantidadsolo;
              detreceta.cantdespachada = element.redecantidadadesp;
              detreceta.cantadespachar = element.redecantidadsolo - element.redecantidadadesp;
              detreceta.acciond        = "I";
              detreceta.meinid         = element.meinid;
              detreceta.controlado     = element.meincontrolado;
              detreceta.tiporegmein    = element.meintiporeg

              this.dataPacienteSolicitud.cliid         = this._Receta.rececliid;
              this.dataPacienteSolicitud.tipodocpac    = this._Receta.recetipdocpac;
              this.dataPacienteSolicitud.numdocpac     = this._Receta.recedocumpac;
              this._Solicitud.descidentificacion       = null;
              this.dataPacienteSolicitud.apepaternopac = this._Receta.cliapepaterno;
              this.dataPacienteSolicitud.apematernopac = this._Receta.cliapematerno;
              this.dataPacienteSolicitud.nombrespac    = this._Receta.clinombres;
              this.dataPacienteSolicitud.codambito     = this._Receta.receambito;
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
              this.dataPacienteSolicitud.numeroreceta  = this._Receta.recenumero;

              this.arrdetalleSolicitudMed.unshift(detreceta);
              this.arrdetalleSolicitud.unshift(detreceta);
              this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0,50);
              // console.log("datos pacientesolicitud",this.dataPacienteSolicitud)
            })
            
            if(this.FormDatosPaciente.value.bodcodigo != null){
              this.nuevasolicitud = true;
            }
            this.recetaactiva = true;
            this.loading = false;
          }
        }
      },

      error => {
        console.log(error);
        this.alertSwalError.title = "Error al Buscar Receta";
        this.alertSwalError.text = "Se ha producido un error al buscar las recetas";
        this.alertSwalError.show();
        this.loading = false;
      }
    )
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

  SeleccionaBodegaActivaBtnAgregar(bodcodigo: number) {
    this.agregarproducto = true;
    if(this.recetaactiva == true){
      this.nuevasolicitud = true;
    }else{
      if(this.recetaactiva == false){
        this.nuevasolicitud = false;
      }
    }
    this.bodselec = true;
  }

  datosUsuario() {
    var datosusuario = new DevuelveDatosUsuario();
    datosusuario = JSON.parse(sessionStorage.getItem('Login'));
    this.hdgcodigo = datosusuario[0].hdgcodigo;
    this.esacodigo = datosusuario[0].esacodigo;
    this.cmecodigo = datosusuario[0].cmecodigo;
  }

  CargaPacienteSolicitud(soliid: number,codambito: number) {
    // console.log("busca solic desde consulta",soliid, this.hdgcodigo,
    // this.esacodigo, this.cmecodigo, 0, null, null, 0, 0, null, this.servidor,
    // 0, codambito, 0, 0, 0, 0, null)
    this._solicitudService.BuscaSolicitud(soliid, this.hdgcodigo,this.esacodigo, this.cmecodigo, 0, null,
    null, 0, 0, null, this.servidor,0, codambito, 0, 0, 0, 0, null,70).subscribe((Retorno: any) => {

      // console.log("solicitu busca",Retorno)
      this.dataPacienteSolicitud = Retorno[0];
      this.existsolicitud = true;
      this.agregarproducto = true;
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

      if (this.dataPacienteSolicitud.recetaentregaprog == "S") {
        this.FormDatosPaciente.get('marcacheck').setValue(true);
      }
      this.loading = false;

      this.dataPacienteSolicitud.solicitudesdet.forEach(element => {
        if (element.tiporegmein == "M") {
          if (element.recetaentregaprogdet == "S") {
            element.marcacheckgrilla = true;
          }
          this.arrdetalleSolicitudMed.unshift(element);
          this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0, 50);

        } else {
          if (element.tiporegmein == "I") {
            this.arrdetalleSolicitudIns.unshift(element);
            this.arrdetalleSolicitudInsPaginacion = this.arrdetalleSolicitudIns.slice(0, 50);
          }
        }
        this.arrdetalleSolicitud = this.arrdetalleSolicitudMed
      })
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
    this.loading = true;
    try {
      let arrSolicitudes: Array<Solicitud> = [];

      arrSolicitudes = await this._solicitudService.BuscaSolicitud(soliid, this.hdgcodigo,
        this.esacodigo, this.cmecodigo, 0, null, null, 0, 0, null, this.servidor,
        0, this.dataPacienteSolicitud.codambito, 0, 0, 0, 0, null,70).toPromise();
      this.dataPacienteSolicitud = arrSolicitudes[0];
      this.loading = false;
      this.existpaciente = true;//Habilita boton Producto
      this.existsolicitud = true;
      this.nuevasolicitud = false;
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
      if (this.dataPacienteSolicitud.recetaentregaprog == "S") {
        this.FormDatosPaciente.get('marcacheck').setValue(true);
      }
      this.loading = false;
      this.dataPacienteSolicitud.solicitudesdet.forEach(element => {
        element.cantadespachar = element.cantsoli - element.cantdespachada;
        if (element.tiporegmein == "M") {
          if (element.recetaentregaprogdet == "S") {
            element.marcacheckgrilla = true;
            element.cantadespachar = element.cantsoli - element.cantdespachada;
          }
          this.arrdetalleSolicitudMed.unshift(element);
          this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0,50);
        } else {
          if (element.tiporegmein == "I") {
            element.cantadespachar = element.cantsoli - element.cantdespachada;
            this.arrdetalleSolicitudIns.unshift(element);
            this.arrdetalleSolicitudInsPaginacion = this.arrdetalleSolicitudIns.slice(0, 50);
          }
        }
      })
    } catch (error) {
      this.loading = false;
      this.alertSwalError.title = "Error";
      this.alertSwalError.text = error.message;
      this.alertSwalError.show();
    }

  }

  BuscarSolicitud() {
    var pasoparemetro: string;
    pasoparemetro = this.FormDatosPaciente.get("nombrepaciente").value;

    this._BSModalRef = this._BsModalService.show(BusquedaSolicitudPacienteAmbulatorioComponent, this.setModal("Busqueda Solicitudes Paciente: ".concat(pasoparemetro)));
    this._BSModalRef.content.onClose.subscribe((Retorno: any) => {
      if (Retorno !== undefined) {
        this.existsolicitud = true;
        this.agregarproducto = true;
        // console.log("Solicitud buscada", Retorno)
        this.cargaSolicitud(Retorno.soliid);
      }
    })
  }

  BuscarPaciente() {
    this.arrdetalleSolicitudMed = [];
    this.arrdetalleSolicitudMedPaginacion = [];
    this.arrdetalleSolicitud = [];
    this.arrdetalleSolicitudPaginacion =[];
    
    this._BSModalRef = this._BsModalService.show(BusquedapacientesComponent, this.setModal("Busqueda de Paciente"));
    this._BSModalRef.content.onClose.subscribe((Retorno: any) => {
      if (Retorno !== undefined) {
      //  console.log("paciente",Retorno)
        this.FormDatosPaciente.reset();
        this.FormDatosPaciente.controls["estadocomprobantecaja"].setValue(10);
        this.FormDatosPaciente.get('fechahora').setValue(new Date());
        this.FormDatosPaciente.controls["estado"].setValue(10);
   
        if(Retorno.codambito == 1){
          
          this.ambito = false;
          this._paciente = Retorno
          // console.log("thi.pacien",this._paciente)
          this.dataPacienteSolicitud = new Solicitud();
          this.dataPacienteSolicitud.cliid = this._paciente.cliid;
          this.dataPacienteSolicitud.tipodocpac = this._paciente.tipoidentificacion;
          this.dataPacienteSolicitud.numdocpac = this._paciente.docuidentificacion;
          this.dataPacienteSolicitud.descidentificacion = this._paciente.descidentificacion;
          this.dataPacienteSolicitud.apepaternopac = this._paciente.paterno;
          this.dataPacienteSolicitud.apematernopac = this._paciente.materno;
          this.dataPacienteSolicitud.nombrespac = this._paciente.nombres;
          this.dataPacienteSolicitud.codambito = 1;
          this.dataPacienteSolicitud.edad = this._paciente.edad;
          this.dataPacienteSolicitud.codsexo = this._paciente.codsexo;
          this.dataPacienteSolicitud.ppnpaciente = this._paciente.cliid;
          this.dataPacienteSolicitud.ctaid = this._paciente.ctaid;
          this.dataPacienteSolicitud.estid = this._paciente.estid;
          this.dataPacienteSolicitud.glsexo = this._paciente.sexo;
          this.dataPacienteSolicitud.glstipidentificacion = this._paciente.descidentificacion;
          this.FormDatosPaciente.get('tipodocumento').setValue(this.dataPacienteSolicitud.descidentificacion);
          this.FormDatosPaciente.get('numidentificacion').setValue(this.dataPacienteSolicitud.numdocpac);
          this.FormDatosPaciente.get('nombrepaciente').setValue(this.dataPacienteSolicitud.apematernopac.concat(" ")
          .concat(this.dataPacienteSolicitud.apepaternopac).concat(" ")
          .concat(this.dataPacienteSolicitud.nombrespac));
          this.FormDatosPaciente.get('sexo').setValue(this.dataPacienteSolicitud.glsexo);
          this.FormDatosPaciente.get('edad').setValue(this.dataPacienteSolicitud.edad);
          
        }else{
          if(Retorno.codambito == 3){
           
            this.ambito = true;
            this.pacientehosp = Retorno;
            console.log("valida pac hosp",this.pacientehosp);
            this.dataPacienteSolicitud = new Solicitud();
            this.dataPacienteSolicitud = Retorno;
            // this.dataPacienteSolicitud.cliid = this.pacientehosp.cliid;
            // this.dataPacienteSolicitud.tipodocpac = this.pacientehosp.tipodocpac;
            // this.dataPacienteSolicitud.numdocpac = this.pacientehosp.numdocpac;
            // this.dataPacienteSolicitud.descidentificacion = this.pacientehosp.descidentificacion;
            // this.dataPacienteSolicitud.apepaternopac = this.pacientehosp.apepaternopac;
            // this.dataPacienteSolicitud.apematernopac = this.pacientehosp.apematernopac;
            // this.dataPacienteSolicitud.nombrespac = this.pacientehosp.nombrespac;
            // this.dataPacienteSolicitud.codambito = 3;
            // this.dataPacienteSolicitud.edad = this.pacientehosp.edad;
            // this.dataPacienteSolicitud.codsexo = this.pacientehosp.codsexo;
            // this.dataPacienteSolicitud.ppnpaciente = this.pacientehosp.cliid;
            // this.dataPacienteSolicitud.ctaid = this._paciente.ctaid;
            // this.dataPacienteSolicitud.estid = this._paciente.estid;
            // this.dataPacienteSolicitud.glsexo = this.pacientehosp.glsexo;
            // this.dataPacienteSolicitud.cuentanumcuenta = this.pacientehosp.cuentanumcuenta;
            // this.dataPacienteSolicitud.glstipidentificacion = this.pacientehosp.glstipidentificacion;
            // this.dataPacienteSolicitud.codservicioactual = this.pacientehosp.codservicioactual;
            this.FormDatosPaciente.get('tipodocumento').setValue(this.dataPacienteSolicitud.glstipidentificacion);
            this.FormDatosPaciente.get('numidentificacion').setValue(this.dataPacienteSolicitud.numdocpac);
            this.FormDatosPaciente.get('nombrepaciente').setValue(this.dataPacienteSolicitud.apematernopac.concat(" ")
              .concat(this.dataPacienteSolicitud.apepaternopac).concat(" ")
              .concat(this.dataPacienteSolicitud.nombrespac));
            this.FormDatosPaciente.get('sexo').setValue(this.dataPacienteSolicitud.glsexo);
            this.FormDatosPaciente.get('edad').setValue(this.dataPacienteSolicitud.edad);
            this.FormDatosPaciente.get('numcuenta').setValue(this.pacientehosp.cuentanumcuenta);
            this.FormDatosPaciente.get('servicio').setValue(this.pacientehosp.undglosa)
            this.FormDatosPaciente.get('pieza').setValue(this.pacientehosp.pzagloza.concat(" ").concat(this.pacientehosp.camglosa))
            this.FormDatosPaciente.get('numidentificacionmedico').setValue(this.pacientehosp.numdocprof)
            this.FormDatosPaciente.get('nombremedico').setValue(this.pacientehosp.nombremedico)
            console.log("llena datapacisolic",this.dataPacienteSolicitud)
           
          } else {
 
            this.ambito = true;
            this._paciente = Retorno

            this.dataPacienteSolicitud = new Solicitud();
            this.dataPacienteSolicitud.cliid = Retorno.cliid;
            this.dataPacienteSolicitud.tipodocpac = Retorno.tipoidentificacion;
            this.dataPacienteSolicitud.numdocpac = Retorno.docuidentificacion;
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
            // this.dataPacienteSolicitud.cuentanumcuenta = Retorno.cuenta
            this.dataPacienteSolicitud.glsexo = Retorno.glsexo;
            this.dataPacienteSolicitud.glstipidentificacion = Retorno.glstipidentificacion;

            this.FormDatosPaciente.get('tipodocumento').setValue(this.dataPacienteSolicitud.descidentificacion);
            this.FormDatosPaciente.get('numidentificacion').setValue(this.dataPacienteSolicitud.numdocpac);
           this.FormDatosPaciente.get('nombrepaciente').setValue(this.dataPacienteSolicitud.apematernopac.concat(" ")
              .concat(this.dataPacienteSolicitud.apepaternopac).concat(" ")
              .concat(this.dataPacienteSolicitud.nombrespac));
            this.FormDatosPaciente.get('sexo').setValue(this.dataPacienteSolicitud.glsexo);
            this.FormDatosPaciente.get('edad').setValue(this.dataPacienteSolicitud.edad);

          }
        }        

        this.existpaciente = true;
        this.existsolicitud = false;
        // this.agregarproducto = true;
        this.nuevasolicitud = false;
      }
    })
  }

  /* Metodo que agrega un nuevo producto */
  onBuscarProducto() {
    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModal("Busqueda de Productos"));
    this._BSModalRef.content.onClose.subscribe((RetornoProductos: any) => {
      if (RetornoProductos !== undefined) {
        if (this.isProducto(RetornoProductos) < 0) {
          this.articulos.unshift(RetornoProductos);
          this.articulos2 = RetornoProductos;
          // console.log("detalle prod",this.articulos2);
          this.setArray(this.articulos2);
        } else {
          this.articulos.splice(this.isProducto(RetornoProductos), 1);
          this.articulos.unshift(RetornoProductos);
        }
        this.existarticulo = true;//Habilita boton Crear si existe Productos
        if (this.existsolicitud == false) {
          this.nuevasolicitud = true;
        }
      }
      else {
        this.existarticulo = false;
      }
      

    });
  }
  /* Verifica si el producto seleccionado existe y devuelve un indice */
  isProducto(articuloseleccion: Articulos) {
    let indice = 0;
    for (const articulo of this.articulos) {
      if (articuloseleccion.codigo === articulo.codigo) {
        return indice;
      }
      indice++;
    }
    return -1;
  }

  ConfirmaBorraProductoMed(detalle: DetalleSolicitud, id: number) {
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
        this.EliminaProductoDeLaGrilla(detalle, id);
      }
    })
  }

  EliminaProductoDeLaGrilla(registro: DetalleSolicitud, id: number) {
    // console.log("id y registro a eliminar", id,registro)
    if (registro.acciond == "I" && id >= 0 && registro.sodeid == 0) {
      // Eliminar registro nuevo la grilla
      // console.log("Entra a eliminar el registro antes de crear la solicitud", registro)

      if(this.isEliminaMed(registro)<0){
        // console.log("entra al if")
      }else{
        // console.log("no pasa al if")
        this.arrdetalleSolicitudMed.splice(this.isEliminaMed(registro), 1);
        this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0,50);
        this.arrdetalleSolicitud.splice(this.isEliminaMed(registro), 1);
      }
      
      // console.log("grilla post eliminacion a grabar",this.arrdetalleSolicitud);
      // console.log("grilla post eliminacion ",this.arrdetalleSolicitudMedPaginacion);

      // this.articulos.splice(this.isProducto(RetornoProductos), 1);
      // this.articulos.unshift(RetornoProductos);
    } else {
      // elimina uno que ya existe
      this.arrdetalleSolicitudMed[id].acciond = 'E';
      // this.ModificarSolicitud("M");
    }
  }

  isEliminaMed(registro: DetalleSolicitud) {
    // console.log("articulo a comprar",registro)
    let indice = 0;
    for (const articulo of this.articulos) {
      if (registro.codmei === articulo.codigo) {
        
        return indice;
      }
      indice++;
    }
    return -1;
  }

  ConfirmaBorraProductoIns(detalle: DetalleSolicitud, id: number) {
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
        this.EliminaProductoDeLaGrillaIns(detalle, id);
      }
    })
  }

  EliminaProductoDeLaGrillaIns(registro: DetalleSolicitud, id: number) {
    if (registro.acciond == "I" && id >= 0 && registro.sodeid == 0) {
      // Eliminar registro nuevo la grilla
      this.arrdetalleSolicitudIns.splice(id, 1);
      this.arrdetalleSolicitudInsPaginacion = this.arrdetalleSolicitudIns.slice(0,50);
      this.arrdetalleSolicitud.splice(id, 1);
    } else {
      // elimina uno que ya existe
      // this.arrdetalleSolicitudIns[id].acciond = 'E';
      this.arrdetalleSolicitud[id].acciond = 'E';
      // this.arrdetalleSolicitud.push(registro);
      this.grabarSolicitud();
      // this.ModificarSolicitud("M");
    }
  }

  borraProducto(detalle: DetalleSolicitud, id: number) {
    // console.log("dato a borrar",detalle,id);
    this.articulos.splice(this.isElimina(detalle), 1);
    this.arrdetalleSolicitud.splice(this.isDetalle(detalle), 1);

  }
  /*Devuelve un id del producto encontrado para eliminar en array articulos */
  isElimina(detalleseleccion: DetalleSolicitud) {
    let indice = 0;
    for (const articulo of this.articulos) {
      if (detalleseleccion.codmei === articulo.codigo) {
        return indice;
      }
      indice++;
    }
    return -1;
  }

  /*Ya seteado array Articulos con DetalleSolicitud, verifica si existe */
  isDetalle(detalleseleccion: DetalleSolicitud) {
    let indice = 0;
    for (const arr of this.arrdetalleSolicitud) {
      if (detalleseleccion.codmei === arr.codmei) {
        return indice;
      }
      indice++;
    }
    return -1;
  }

  BuscaReceta(numeroreceta: number) {
    // console.log("Busca el numero receta:",numeroreceta)
  }


  /* Calculo formulación grilla Articulos */
  cantidadsolicitada(detalle: DetalleSolicitud) {
    //detalle.acciond = 'M';
    let dosis, formulacion, dias, total: number = 0;
    dosis = detalle.dosis;
    // formulacion = Math.round(24 / detalle.formulacion);
    dias = detalle.dias;
    total = dosis * detalle.formulacion;
    detalle.cantsoli = total * dias;
    detalle.cantadespachar = detalle.cantsoli- detalle.cantdespachada;
    // Este código es cuando se activa el check marca de la cabecera. NO borrar mientras
    // if(this.activacomboentrega == true){
    //   detalle.dias = this.diasentrega;
    //   detalle.cantsoli = total * detalle.dias;
    //   detalle.cantadespachar = Math.round((detalle.cantsoli-detalle.cantdespachada)/this.cantentregas);
    // }else{
    //   if(this.activacomboentrega == false){
    //     detalle.dias = 0;
    //     // detalle.cantadespachar = round (detalle.cantsoli-detalle.cantdespachada)/this.cantentregas;
    //   }
    // }

    // if(this.checkgrilla == false){
    if (detalle.marcacheckgrilla == true) {
      detalle.dias = this.diasentrega;
      detalle.cantsoli = total * detalle.dias;
      detalle.cantadespachar = Math.round((detalle.cantsoli - detalle.cantdespachada) / this.cantentregas);
      detalle.recetaentregaprogdet = "S";
      // detalle.diasentregacodigodet = this.coddiaentrega
      // console.log("var dias entrega, chec activado",this.diasentrega,detalle.cantsoli,detalle.cantadespachar,
      // this.checkgrilla);

    } else {
      // if(this.checkgrilla == true){
      if (detalle.marcacheckgrilla == false) {
        detalle.dias = 0;
        detalle.recetaentregaprogdet = "N";
        detalle.diasentregacodigodet = 0;
        // console.log("el checj desactivado",detalle.dias,detalle.marcacheckgrilla,detalle.cantsoli,
        // detalle.cantadespachar,this.checkgrilla)
      }
    }
    if (detalle.cantsoli == detalle.cantdespachada) {
      detalle.cantadespachar = 0;
    }
    // this.checkgrilla = true;
    // console.log("cant a despachar",detalle.cantadespachar,detalle.cantsoli)
  }

  validacantidadgrilla(despacho: DetalleSolicitud){
    var idg =0;
    console.log("Valida cantidad",despacho)
   
      if(this.IdgrillaDespacho(despacho)>=0){
        idg = this.IdgrillaDespacho(despacho)
       
        if(this.arrdetalleSolicitudMed[idg].cantadespachar > this.arrdetalleSolicitudMed[idg].cantsoli- this.arrdetalleSolicitudMed[idg].cantdespachada ){
          this.alertSwalAlert.text = "La cantidad a Dispensar debe ser menor o igual a la cantidad Pendiente";
          this.alertSwalAlert.show();
          // this.listaDetalleDespacho[idg].cantidadarecepcionar = this.listaDetalleDespacho[idg].cantdespachada- this.listaDetalleDespacho[idg].cantrecepcionada;

        }else{
          if(this.arrdetalleSolicitudMed[idg].cantadespachar <0){
            this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
            this.alertSwalAlert.show();
          }else{
            if(despacho.cantadespachar < despacho.cantsoli- despacho.cantdespachada || despacho.cantadespachar >0){
              // console.log("cantidad >0 y menor que pendiente")
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

  cambio_checkGrilla(id: number, event: any, detalle: DetalleSolicitud) {
    if (event.target.checked == true) {

      // this.arrdetalleSolicitudMedPaginacion[id].marcacheckgrilla = true;
      // if(this.arrdetalleSolicitudMedPaginacion[id].marcacheckgrilla == true){
      detalle.marcacheckgrilla = true;
      this.checkgrilla = false;
      // }else{
      //   this.checkgrilla = true;
      //   detalle.marcacheckgrilla = false;
      // }
      this.arrdetalleSolicitudMedPaginacion[id].recetaentregaprogdet = "S";
      // this.arrdetalleSolicitudMedPaginacion[id].diasentregacodigodet = 0;
      // console.log("chec activado grilla",this.checkgrilla,
      // this.arrdetalleSolicitudMedPaginacion[id].recetaentregaprogdet,
      // this.arrdetalleSolicitudMedPaginacion[id].marcacheckgrilla,detalle.marcacheckgrilla)

    } else {
      if (event.target.checked == false) {
        this.checkgrilla = true;
        detalle.marcacheckgrilla = false;
        this.arrdetalleSolicitudMedPaginacion[id].cantadespachar = this.arrdetalleSolicitudMedPaginacion[id].cantsoli - this.arrdetalleSolicitudMedPaginacion[id].cantdespachada;
        this.arrdetalleSolicitudMedPaginacion[id].recetaentregaprogdet = "N";
        this.arrdetalleSolicitudMedPaginacion[id].diasentregacodigodet = 0;
        this.arrdetalleSolicitudMed[id].cantadespachar = this.arrdetalleSolicitudMed[id].cantsoli - this.arrdetalleSolicitudMed[id].cantdespachada;
        this.arrdetalleSolicitudMed[id].recetaentregaprogdet = "N";
        this.arrdetalleSolicitudMed[id].diasentregacodigodet = 0;
      }
    }
  }

  SeleccionaComboGrilla(event: any, id: number, diasentrega: number, detalle: DetalleSolicitud) {

    // if(event.target.value=="30 Días"){
    if (detalle.diasentregacodigodet == 1 && this.arrdetalleSolicitudMedPaginacion[id].marcacheckgrilla == true) {
      this.diasentrega = 30;
      this.cantentregas = 2;
      // this.coddiaentrega = diasentrega;
      this.arrdetalleSolicitudMed[id].diasentregacodigodet = diasentrega;
      this.arrdetalleSolicitudMedPaginacion[id].diasentregacodigodet = this.arrdetalleSolicitudMed[id].diasentregacodigodet;
      this.arrdetalleSolicitudMed[id].dias = 30;
      this.arrdetalleSolicitudMedPaginacion[id].dias = this.arrdetalleSolicitudMed[id].dias;
      this.arrdetalleSolicitudMed[id].cantsoli = this.arrdetalleSolicitudMed[id].dosis* this.arrdetalleSolicitudMed[id].formulacion * this.arrdetalleSolicitudMed[id].dias;
      this.arrdetalleSolicitudMedPaginacion[id].cantsoli = this.arrdetalleSolicitudMedPaginacion[id].dosis* this.arrdetalleSolicitudMedPaginacion[id].formulacion * this.arrdetalleSolicitudMedPaginacion[id].dias;
      this.arrdetalleSolicitudMed[id].cantadespachar =  Math.round((this.arrdetalleSolicitudMed[id].cantsoli - this.arrdetalleSolicitudMed[id].cantdespachada) / this.cantentregas);
      this.arrdetalleSolicitudMedPaginacion[id].cantadespachar =  Math.round((this.arrdetalleSolicitudMedPaginacion[id].cantsoli - this.arrdetalleSolicitudMedPaginacion[id].cantdespachada) / this.cantentregas);
      // detalle.dias= 30
      // console.log("Seleciona 30 dias",this.diasentrega,this.cantentregas,
      // this.arrdetalleSolicitudMed[id].diasentregacodigodet,
      // this.arrdetalleSolicitudMedPaginacion[id].diasentregacodigodet)
    } else {
      if (detalle.diasentregacodigodet == 2 && this.arrdetalleSolicitudMedPaginacion[id].marcacheckgrilla == true) {
        // detalle.dias= 60
        this.diasentrega = 60;
        this.cantentregas = 3;
        // this.coddiaentrega = diasentrega//2;
        this.arrdetalleSolicitudMed[id].diasentregacodigodet = diasentrega;
        this.arrdetalleSolicitudMedPaginacion[id].diasentregacodigodet = this.arrdetalleSolicitudMed[id].diasentregacodigodet;
        this.arrdetalleSolicitudMed[id].dias = 60;
        this.arrdetalleSolicitudMedPaginacion[id].dias = this.arrdetalleSolicitudMed[id].dias;
        this.arrdetalleSolicitudMed[id].cantsoli = this.arrdetalleSolicitudMed[id].dosis* this.arrdetalleSolicitudMed[id].formulacion * this.arrdetalleSolicitudMed[id].dias;
        this.arrdetalleSolicitudMedPaginacion[id].cantsoli = this.arrdetalleSolicitudMedPaginacion[id].dosis* this.arrdetalleSolicitudMedPaginacion[id].formulacion * this.arrdetalleSolicitudMedPaginacion[id].dias;
        this.arrdetalleSolicitudMed[id].cantadespachar =  Math.round((this.arrdetalleSolicitudMed[id].cantsoli - this.arrdetalleSolicitudMed[id].cantdespachada) / this.cantentregas);
        this.arrdetalleSolicitudMedPaginacion[id].cantadespachar =  Math.round((this.arrdetalleSolicitudMedPaginacion[id].cantsoli - this.arrdetalleSolicitudMedPaginacion[id].cantdespachada) / this.cantentregas);
      } else {
        if (detalle.diasentregacodigodet == 3 && this.arrdetalleSolicitudMedPaginacion[id].marcacheckgrilla == true) {
          // detalle.dias= 90
          this.diasentrega = 90;
          this.cantentregas = 4;
          // this.coddiaentrega = diasentrega //3;
          this.arrdetalleSolicitudMed[id].diasentregacodigodet = diasentrega;
          this.arrdetalleSolicitudMedPaginacion[id].diasentregacodigodet = this.arrdetalleSolicitudMed[id].diasentregacodigodet;
          this.arrdetalleSolicitudMed[id].dias = 90;
          this.arrdetalleSolicitudMedPaginacion[id].dias = this.arrdetalleSolicitudMed[id].dias;
          this.arrdetalleSolicitudMed[id].cantsoli = this.arrdetalleSolicitudMed[id].dosis* this.arrdetalleSolicitudMed[id].formulacion * this.arrdetalleSolicitudMed[id].dias;
          this.arrdetalleSolicitudMedPaginacion[id].cantsoli = this.arrdetalleSolicitudMedPaginacion[id].dosis* this.arrdetalleSolicitudMedPaginacion[id].formulacion * this.arrdetalleSolicitudMedPaginacion[id].dias;
          this.arrdetalleSolicitudMed[id].cantadespachar =  Math.round((this.arrdetalleSolicitudMed[id].cantsoli - this.arrdetalleSolicitudMed[id].cantdespachada) / this.cantentregas);
          this.arrdetalleSolicitudMedPaginacion[id].cantadespachar =  Math.round((this.arrdetalleSolicitudMedPaginacion[id].cantsoli - this.arrdetalleSolicitudMedPaginacion[id].cantdespachada) / this.cantentregas);
        } else {
          if (detalle.diasentregacodigodet == 4 && this.arrdetalleSolicitudMedPaginacion[id].marcacheckgrilla == true) {
            // detalle.dias= 120
            this.diasentrega = 120;
            this.cantentregas = 5;
            // this.coddiaentrega = diasentrega//4;
            this.arrdetalleSolicitudMed[id].diasentregacodigodet = diasentrega;
            this.arrdetalleSolicitudMedPaginacion[id].diasentregacodigodet = this.arrdetalleSolicitudMed[id].diasentregacodigodet;
            this.arrdetalleSolicitudMed[id].dias = 120;
            this.arrdetalleSolicitudMedPaginacion[id].dias = this.arrdetalleSolicitudMed[id].dias;
            this.arrdetalleSolicitudMed[id].cantsoli = this.arrdetalleSolicitudMed[id].dosis* this.arrdetalleSolicitudMed[id].formulacion * this.arrdetalleSolicitudMed[id].dias;
            this.arrdetalleSolicitudMedPaginacion[id].cantsoli = this.arrdetalleSolicitudMedPaginacion[id].dosis* this.arrdetalleSolicitudMedPaginacion[id].formulacion * this.arrdetalleSolicitudMedPaginacion[id].dias;
            this.arrdetalleSolicitudMed[id].cantadespachar =  Math.round((this.arrdetalleSolicitudMed[id].cantsoli - this.arrdetalleSolicitudMed[id].cantdespachada) / this.cantentregas);
            this.arrdetalleSolicitudMedPaginacion[id].cantadespachar =  Math.round((this.arrdetalleSolicitudMedPaginacion[id].cantsoli - this.arrdetalleSolicitudMedPaginacion[id].cantdespachada) / this.cantentregas);
            // console.log("Seleciona 120 dias",this.diasentrega,this.cantentregas,
            // this.arrdetalleSolicitudMed[id].diasentregacodigodet,
            // this.arrdetalleSolicitudMedPaginacion[id].diasentregacodigodet)
          }
        }
      }
    }
  }

  limpiar() {
    this.loading = true;
    this.dataPacienteSolicitud = new Solicitud();;
    this.FormDatosPaciente.reset();
    this.arrdetalleSolicitud = [];
    this.arrdetalleSolicitudPaginacion = [];
    this.arrdetalleSolicitudMed = [];
    this.arrdetalleSolicitudMedPaginacion = [];
    this.arrdetalleSolicitudIns = [];
    this.arrdetalleSolicitudInsPaginacion = [];
    this.articulos = [];
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
    this.ambito = false;
    this.recetaactiva = false;
    this.recetademonitor = false;
  }

  logicaVacios() {
    /* verifica si los campos Dosis, Formulación C/H y cantdias estan vacios */
    this.arrdetalleSolicitud.forEach(data => {
      if (data.dosis == 0 || data.formulacion == 0 || data.dias == 0 ||
        data.dosis == null || data.formulacion == null || data.dias == null) {
        this.vacios = true;
        return;
      } else {
        this.vacios = false;
      }
    });
  }

  setArray(art: Articulos) {
    // for (const arr of art) {
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

    if (this.isDetalle(detalleSolicitud) < 0) {
      if (detalleSolicitud.tiporegmein == "M") {
        detalleSolicitud.acciond = 'I';
        this.arrdetalleSolicitudMed.unshift(detalleSolicitud);
        this.arrdetalleSolicitudMedPaginacion = this.arrdetalleSolicitudMed.slice(0, 50)
        // console.log("DEtalle grilla, med ingresado",this.arrdetalleSolicitudMed,this.arrdetalleSolicitudMedPaginacion)
      } else {
        if (detalleSolicitud.tiporegmein == "I") {
          detalleSolicitud.acciond = 'I'; 
          this.arrdetalleSolicitudIns.unshift(detalleSolicitud);
          this.arrdetalleSolicitudInsPaginacion = this.arrdetalleSolicitudIns.slice(0, 50)
          this.nuevasolicitud = true;
        }
      }

      this.arrdetalleSolicitud.unshift(detalleSolicitud);
      this.arrdetalleSolicitudPaginacion = this.arrdetalleSolicitud.slice(0, 50);
      // console.log("Detalle solicitud",this.arrdetalleSolicitud)
    } else { /* Si el Producto existe, no realizara ninguna accion*/ }
    // }
  }

  grabarSolicitud() {
    var fechaactual = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    var es_controlado = this.arrdetalleSolicitud.find(element => element.controlado == 'S');
    var es_consignacion = this.arrdetalleSolicitud.find(element => element.consignacion == 'S');
    
    try {
  

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
     
      this._Solicitud.numdocpac = this.dataPacienteSolicitud.numdocpac.trim();
      this._Solicitud.descidentificacion = null;
      this._Solicitud.apepaternopac = this.dataPacienteSolicitud.apepaternopac;
      this._Solicitud.apematernopac = this.dataPacienteSolicitud.apematernopac;
      this._Solicitud.nombrespac = this.dataPacienteSolicitud.nombrespac;
      this._Solicitud.codambito = this.dataPacienteSolicitud.codambito;
      this._Solicitud.estid = this.dataPacienteSolicitud.estid;
      this._Solicitud.ctaid = this.dataPacienteSolicitud.ctaid;
      this._Solicitud.boleta = this.dataPacienteSolicitud.boleta;
      this._Solicitud.edadpac = this.dataPacienteSolicitud.edadpac;
      this._Solicitud.tipoedad = null;
      this._Solicitud.codsexo = this.dataPacienteSolicitud.codsexo;
      this._Solicitud.codservicioori = this.dataPacienteSolicitud.codservicioori;
      this._Solicitud.codservicioactual = this.dataPacienteSolicitud.codservicioactual;
      this._Solicitud.codserviciodes = 0;
      this._Solicitud.bodorigen = this.FormDatosPaciente.value.bodcodigo;
      this._Solicitud.boddestino = this.FormDatosPaciente.value.bodcodigo;
      this._Solicitud.tipoproducto = 0;
      this._Solicitud.tipomovim = 'C';
      this._Solicitud.tiposolicitud = 70;
      this._Solicitud.estadosolicitud = parseInt(this.FormDatosPaciente.controls['estado'].value);
      this._Solicitud.prioridadsoli = 0;
      this._Solicitud.tipodocprof = this.dataPacienteSolicitud.tipodocprof;
      this._Solicitud.numdocprof = this.dataPacienteSolicitud.numdocprof;
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
      this._Solicitud.ppnpaciente = null;
      this._Solicitud.convenio = null;
      this._Solicitud.diagnostico = null;
      this._Solicitud.nombremedico = this.dataPacienteSolicitud.nombremedico;
      this._Solicitud.cuentanumcuenta = this.dataPacienteSolicitud.cuentanumcuenta;
      this._Solicitud.bodorigendesc = null;
      this._Solicitud.boddestinodesc = null;
      this._Solicitud.usuario = this.usuario;
      this._Solicitud.servidor = this.servidor;
      this._Solicitud.origensolicitud = 70;
      this._Solicitud.estadosolicitudde = null;
      this._Solicitud.desprioridadsoli = null;
      this._Solicitud.desorigensolicitud = null;
      this._Solicitud.codpieza = null;
      this._Solicitud.camid = 0;
      this._Solicitud.piezaid = 0;
      this._Solicitud.glsexo = this.dataPacienteSolicitud.glsexo;
      this._Solicitud.glstipidentificacion = this.dataPacienteSolicitud.glstipidentificacion;
      this._Solicitud.glsambito = this.dataPacienteSolicitud.glsambito;
      this._Solicitud.undglosa = this.dataPacienteSolicitud.undglosa;
      this._Solicitud.camglosa = this.dataPacienteSolicitud.camglosa;
      this._Solicitud.pzagloza = this.dataPacienteSolicitud.pzagloza;
      this._Solicitud.edad = this.dataPacienteSolicitud.edad;
      this._Solicitud.solicitudesdet = this.arrdetalleSolicitud;
      this._Solicitud.tiporeceta = null;
      this._Solicitud.numeroreceta = parseInt(this.FormDatosPaciente.value.numeroreceta);
      this._Solicitud.comprobantecaja = this.FormDatosPaciente.value.comprobantecaja;
      this._Solicitud.estadocomprobantecaja = this.FormDatosPaciente.value.estadocomprobantecaja;
      this._Solicitud.solitiporeg = "M";
      this._Solicitud.solirecetipo = this.dataPacienteSolicitud.solirecetipo;
      this._Solicitud.boleta = parseInt(this.FormDatosPaciente.value.numeroboleta);
      if (this.activacomboentrega == true) {
        this._Solicitud.diasentregacodigo = this.FormDatosPaciente.value.entrega;
        this._Solicitud.recetaentregaprog = "S"
      } else {
        if (this.activacomboentrega == false) {
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
        })
        this.modalconfirmar("Modificar Solicitud y Dispensación");
        // console.log("Solic a modif :",this._Solicitud);
      } else {
        this._Solicitud.soliid = 0;
        this.modificar = false;
        this._Solicitud.accion = 'I'
        // console.log("Creará solicitud",this._Solicitud)
        this.modalconfirmar("Creación Solicitud y Dispensación a Paciente");
        
      }

    } catch (err) {
      console.log("error:",err)
      this.alertSwalError.title = "Error";
      this.alertSwalError.text = err.message;
      this.alertSwalError.show();
    }
  }

  modalconfirmar(mensaje: string) {
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

        this.loading = true;

        try {
          let IDSolciitud: any;
          let IDSol: number;
          
          IDSolciitud = await this._solicitudService.crearSolicitud(this._Solicitud).toPromise();
          this.alertSwal.title = mensaje.concat(" Exitosa N°").concat(IDSolciitud['solbodid']);
          this.alertSwal.show();
          this.loading = false;

          IDSol = IDSolciitud['solbodid'];

          let salida: any;

          salida = await this.cargaSolicitud(IDSol);

          salida = await this.DispensarSolicitu();

          salida = await this.cargaSolicitud(IDSol);
          this.loading = false;
        } catch (err) {
          this.loading = false;
          // alert("Error : " + err)
          this.alertSwalError.text = err.message;
          this.alertSwalError.show();
        };

      }
    });
  }

  // setModalProductos() {
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
  //       tipo_busqueda: 'Todo-Medico',
  //       id_Bodega: 0
  //     }
  //   };
  //   return dtModal;
  // }


  setModal(titulo: string) {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: titulo,
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        tipo_busqueda: 'Medicamentos',
        id_Bodega: this.FormDatosPaciente.value.bodcodigo,
        cliid: this.dataPacienteSolicitud.cliid,
        ambito: this.dataPacienteSolicitud.codambito,
        tipodocumeto: this.dataPacienteSolicitud.tipodocpac,
        numeroidentificacion: this.dataPacienteSolicitud.numdocpac,
        origen: 'Solicitud_Receta'

      }
    };
    return dtModal;
  }

  async DispensarSolicitu() {

    var _DespachoDetalleSolicitud: Array<DespachoDetalleSolicitud> = [];
    var elemetoDespacho: DespachoDetalleSolicitud;
    var indice: number;
    indice = 0;

    this._Solicitud.solicitudesdet.forEach(element => {
      if (element.cantadespachar > 0) {

        elemetoDespacho = element
        elemetoDespacho.hdgcodigo = this.hdgcodigo;
        elemetoDespacho.esacodigo = this.esacodigo;
        elemetoDespacho.cmecodigo = this.cmecodigo;
        elemetoDespacho.cliid     = this.dataPacienteSolicitud.cliid;
        elemetoDespacho.estid     = this.dataPacienteSolicitud.estid;
        elemetoDespacho.ctaid     = this.dataPacienteSolicitud.ctaid;
        elemetoDespacho.soliid    = this.dataPacienteSolicitud.solicitudesdet[indice].soliid;
        elemetoDespacho.sodeid    = this.dataPacienteSolicitud.solicitudesdet[indice].sodeid;
        elemetoDespacho.servidor  = this.servidor;
        elemetoDespacho.usuariodespacha = this.usuario;
        elemetoDespacho.bodorigen = this.dataPacienteSolicitud.bodorigen;
        elemetoDespacho.boddestino= this.dataPacienteSolicitud.boddestino;
        elemetoDespacho.recetipo  = this.dataPacienteSolicitud.solirecetipo; 
        if(this.recetademonitor == true){
          elemetoDespacho.receid    = this._Receta.receid;
        }else{
          if(this.recetademonitor == false){
            elemetoDespacho.receid    = 0;
          }
        }
        
        elemetoDespacho.recenumero= parseInt(this.FormDatosPaciente.value.numeroreceta);// this.dataPacienteSolicitud.numeroreceta;

        _DespachoDetalleSolicitud.unshift(elemetoDespacho);
      }
      indice++;
    });

    try {
      let Retorno: any;
      let _DISPENSACIONRECETAS : DISPENSACIONRECETAS;
      console.log("datos a dispensar",_DespachoDetalleSolicitud)
      Retorno = await this._dispensasolicitudService.GrabaDispensacion(_DespachoDetalleSolicitud).toPromise();
      // Llamamos a integración con Legado para informar que ya se dispensó la receta.
    
    
 
 //     _DISPENSACIONRECETAS = new(DISPENSACIONRECETAS);

//      _DISPENSACIONRECETAS.hdgcodigo =  Number(sessionStorage.getItem('hdgcodigo').toString());
//      _DISPENSACIONRECETAS.servidor = this.servidor
//      _DISPENSACIONRECETAS.receid   = this._Receta.receid;



//      this._InterfaceService.dispensacionRecetalegado(_DISPENSACIONRECETAS).subscribe(
//        response => {

//            console.log(response);
//        },
//        error => {
//          alert("Error informar a sistema legado");
//        }
//      );
       
     } catch (error) {
      alert("Error : " + error)
      this.alertSwalError.text = error.message;
      this.alertSwalError.show();
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
    })
  }
}