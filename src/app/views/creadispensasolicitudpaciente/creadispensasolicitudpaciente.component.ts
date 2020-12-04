import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../../environments/environment';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { DatePipe } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
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
import { ModalpacienteComponent } from '../modalpaciente/modalpaciente.component';
import { BusquedasolicitudpacientesComponent } from '../busquedasolicitudpacientes/busquedasolicitudpacientes.component';
import { BusquedaplantillasbodegaComponent } from '../busquedaplantillasbodega/busquedaplantillasbodega.component'
/*Services */
import { DocidentificacionService } from '../../servicios/docidentificacion.service';
import { SolicitudService } from '../../servicios/Solicitudes.service';
import { TipoambitoService } from '../../servicios/tiposambito.service';
import { EventosSolicitudComponent } from '../eventos-solicitud/eventos-solicitud.component';
import { EventosDetallesolicitudComponent } from '../eventos-detallesolicitud/eventos-detallesolicitud.component';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BodegasService } from '../../servicios/bodegas.service';
import { BodegasTodas } from 'src/app/models/entity/BodegasTodas';
import { BodegasrelacionadaAccion } from 'src/app/models/entity/BodegasRelacionadas';
import { InformesService } from '../../servicios/informes.service';
import { Plantillas } from 'src/app/models/entity/PlantillasBodegas';
import { DetallePlantillaBodega } from '../../models/entity/DetallePlantillaBodega';
import { Permisosusuario } from '../../permisos/permisosusuario';
import { DespachoDetalleSolicitud } from 'src/app/models/entity/DespachoDetalleSolicitud';
import { DispensarsolicitudesService } from 'src/app/servicios/dispensarsolicitudes.service';
import { BusquedaproductosService } from 'src/app/servicios/busquedaproductos.service';
import { Detalleproducto } from '../../models/producto/detalleproducto';

@Component({
  selector: 'app-creadispensasolicitudpaciente',
  templateUrl: './creadispensasolicitudpaciente.component.html',
  styleUrls: ['./creadispensasolicitudpaciente.component.css'],
  providers: [InformesService, DispensarsolicitudesService]
})
export class CreadispensasolicitudpacienteComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  @ViewChild('alertSwalConfirmar', { static: false }) alertSwalConfirmar: SwalComponent;
  /**Para uso dinamico de tabs */
  @ViewChild('tabProducto', { static: false }) tabProductoTabs: TabsetComponent;

  public modelopermisos: Permisosusuario = new Permisosusuario();
  //Array
  public alerts: Array<any> = [];
  public docsidentis: Array<DocIdentificacion> = [];
  public tipoambitos: Array<TipoAmbito> = [];
  public estadosolicitudes: Array<EstadoSolicitud> = [];
  public arrdetalleMedicamentos: Array<DetalleSolicitud> = [];
  public medicamentosadispensar: Array<DetalleSolicitud> = [];
  public arrMedicamentopaginacion: Array<DetalleSolicitud> = [];
  public arrdetalleInsumos: Array<DetalleSolicitud> = [];
  public insumosadispensar: Array<DetalleSolicitud> = [];
  public arrInsumospaginacion: Array<DetalleSolicitud> = [];
  public grillaMedicamentos: Array<DetalleSolicitud> = [];
  public grillaInsumos: Array<DetalleSolicitud> = [];
  //Obj
  public FormDatosPaciente: FormGroup;
  public FormDatosProducto: FormGroup;
  private _BSModalRef: BsModalRef;
  public dataPacienteSolicitud: Solicitud = new Solicitud();// Guarda datos de la busqueda
  public solmedicamento: Solicitud = new Solicitud();
  public solinsumo: Solicitud = new Solicitud();
  public solicitudMedicamento: Solicitud = new Solicitud();
  public solicitudInsumo: Solicitud = new Solicitud();
  public varListaDetalleDespacho: DetalleSolicitud = new DetalleSolicitud();
  //Var
  public servidor = environment.URLServiciosRest.ambiente;
  public usuario = environment.privilegios.usuario;
  public hdgcodigo: number;
  public esacodigo: number;
  public cmecodigo: number;
  public numsolins: number;
  public numsolicitud = 0;
  public bodorigen: string;
  public boddestino: string;
  /**Usado para la funcion logicavacios()//@ML */
  public btnCrearsol = false;
  /**/
  public vacios = true;
  public tipobusqueda = null;
  public loading = false;
  public solmedic: boolean = false;
  public solins: boolean = false;
  public imprimesolins: boolean = false;
  public accionsolicitud = 'I';
  public locale = 'es';
  public bsConfig: Partial<BsDatepickerConfig>;
  public colorTheme = 'theme-blue';
  public bodegassuministro: Array<BodegasrelacionadaAccion> = [];
  public solic1: string;
  public solic2: string;
  public fechaactual: string;
  public nomplantilla: string;
  public es_controlado: string;
  public es_consignacion: string;
  public numsolmedicamento = null;
  public numsolinsumo = null;
  public paramdespachos: Array<DespachoDetalleSolicitud> = [];
  public doblesolicitud = false;
  public codprod = null;
  idplantilla: number;
  public codambito = 0;
  esmedicamento: boolean;
  // public desactivabtneliminar : boolean = false; 

  constructor(
    public datePipe: DatePipe,
    public localeService: BsLocaleService,
    public DocidentificacionService: DocidentificacionService,
    public formBuilder: FormBuilder,
    public _BsModalService: BsModalService,
    public _solicitudService: SolicitudService,
    public _tipoambitoService: TipoambitoService,
    public _estadosolicitudesService: SolicitudService,
    public _BodegasService: BodegasService,
    private _imprimesolicitudService: InformesService,
    private dispensasolicitudService: DispensarsolicitudesService,
    public _BusquedaproductosService: BusquedaproductosService,
  ) {
    this.FormDatosPaciente = this.formBuilder.group({
      tipodocumento: [{ value: null, disabled: true }, Validators.required],
      numidentificacion: [{ value: null, disabled: true }, Validators.required],
      numcuenta: [{ value: null, disabled: true }, Validators.required],
      nombrepaciente: [{ value: null, disabled: true }, Validators.required],
      edad: [{ value: null, disabled: true }, Validators.required],
      unidad: [{ value: null, disabled: true }, Validators.required],
      sexo: [{ value: null, disabled: true }, Validators.required],
      ambito: [{ value: 3, disabled: false }, Validators.required],
      estado: [{ value: 10, disabled: false }, Validators.required],
      numsolicitud: [{ value: null, disabled: true }, Validators.required],
      pieza: [{ value: null, disabled: true }, Validators.required],
      cama: [{ value: null, disabled: true }, Validators.required],
      fechahora: [{ value: new Date(), disabled: true }, Validators.required],
      ubicacion: [{ value: null, disabled: true }, Validators.required],
      medico: [{ value: null, disabled: true }, Validators.required],
      bodcodigo: [{ value: null, disabled: false }, Validators.required],
      codbodegasuministro: [{ value: null, disabled: false }, Validators.required],
    });
    this.FormDatosProducto = this.formBuilder.group({
      codigo: [{ value: null, disabled: false }, Validators.required],
      cantidad: [{ value: null, disabled: false }, Validators.required]
    });
  }

  ngOnInit() {
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();
    this.datosUsuario();
    /* completa combobox */
    this.getParametros();
    this.setDate();
  }

  ngAfterViewInit() {
    setTimeout(() => {
    });
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  datosUsuario() {
    var datosusuario = new DevuelveDatosUsuario();
    datosusuario = JSON.parse(sessionStorage.getItem('Login'));
    this.hdgcodigo = datosusuario[0].hdgcodigo;
    this.esacodigo = datosusuario[0].esacodigo;
    this.cmecodigo = datosusuario[0].cmecodigo;
  }

  BuscaBodegasSuministro(codigobodegasolicitante: number) {

    this.bodegassuministro = [];
    this._BodegasService.listaBodegaRelacionadaAccion(this.hdgcodigo, this.esacodigo, this.cmecodigo,
      this.usuario, this.servidor, codigobodegasolicitante, 1).subscribe(
        data => {
          this.bodegassuministro = data;
        }, err => {
        }
      );
  }

  async getParametros() {
    try {
      this.docsidentis = await this.DocidentificacionService.list(this.usuario, this.servidor)
        .toPromise();
      this.tipoambitos = await this._tipoambitoService.list(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor)
        .toPromise();
      this.estadosolicitudes = await this._estadosolicitudesService.list(this.usuario, this.servidor)
        .toPromise();
    } catch (err) {
      this.alertSwalAlert.text = err.message;
      this.alertSwalAlert.show();
    }
  }

  cargaSolicitud(soliid: number) {
    this.arrdetalleMedicamentos = [];
    this.arrMedicamentopaginacion = [];
    this.arrdetalleInsumos = [];
    this.arrInsumospaginacion = [];
    /* Tras Crear nueva Solicitud, obtiene datos recien creados y cambia tipo busqueda a 'Solicitud'*/
    this.tipobusqueda = 'Solicitud';
    this._solicitudService.BuscaSolicitud(soliid, this.hdgcodigo, this.esacodigo, this.cmecodigo, null,
      null, null, null, null, null, this.servidor, null, this.codambito, null, null, null, null, null,0).subscribe(
        response => {
          // this.tipobusqueda = "Solicitud";
          response.forEach(data => {
            this.dataPacienteSolicitud = data;
          });
          this.loading = false;
          this.setDatos();
        },
        error => {
          this.loading = false;
          this.alertSwalError.title = "Error";
          this.alertSwalError.text = error.message;
          this.alertSwalError.show();
        }
      );
  }

  cargaSolicitudadispensar(soliid: number, doblesol: boolean) {
    /* Tras Crear nueva Solicitud, obtiene datos recien creados y cambia tipo busqueda a 'Imprimir'*/
    // this.tipobusqueda = 'Imprimir';
    this._solicitudService.BuscaSolicitud(soliid, this.hdgcodigo, this.esacodigo, this.cmecodigo, null,
      null, null, null, null, null, this.servidor, null, 3, null, null, null, null, null,0).subscribe(
        response => {
          response.forEach(async data => {
            this.dataPacienteSolicitud = data;
            
            //** */
            this.DispensarSolicitud(doblesol);

            //** */
          });
          // this.loading = false;
          // this.setDatos();
        },
        error => {
          this.loading = false;
          this.alertSwalError.title = "Error";
          this.alertSwalError.text = error.message;
          this.alertSwalError.show();
        }
      );
  }


  // Carga datos tras crear doble solicitud M y I
  async cargaDoblesolicitud(soliid: number) {
    this._solicitudService.BuscaSolicitud(soliid, this.hdgcodigo, this.esacodigo, this.cmecodigo, null,
      null, null, null, null, null, this.servidor, null, this.codambito, null, null, null, null, null,0).subscribe(
        response => {
          this.btnCrearsol = false;
          response.forEach(data => {
            this.dataPacienteSolicitud = data;
          });
          // this.loading = false;
          // this.tipobusqueda = null;
          this.dataPacienteSolicitud.solicitudesdet.forEach(element => {
            if (element.tiporegmein == "I") {
              this.solins = true;
              this.arrdetalleInsumos = this.dataPacienteSolicitud.solicitudesdet
              this.arrInsumospaginacion = this.arrdetalleInsumos.slice(0, 20);
              this.loading = false;
            } else {
              if (element.tiporegmein == "M") {
                this.solmedic = true;
                this.arrdetalleMedicamentos = this.dataPacienteSolicitud.solicitudesdet;
                this.arrMedicamentopaginacion = this.arrdetalleMedicamentos.slice(0, 20)
                this.loading = false;
              }
            }
          })
        },
        error => {
          this.loading = false;
          this.alertSwalError.title = "Error";
          this.alertSwalError.text = error.message;
          this.alertSwalError.show();
        }
      );
  }

  onBuscar(busqueda: string) {
    this.loading = false;
    if (this.hdgcodigo == null || this.esacodigo == null || this.cmecodigo == null) {
      this.alertSwalAlert.text = "Debe agregar Empresa y Sucursal";
      this.alertSwalAlert.show();
      return;
    }
    switch (busqueda) {
      case 'Paciente':
        this._BSModalRef = this._BsModalService.show(ModalpacienteComponent, this.setModal("Busqueda de ".concat(busqueda)));
        this._BSModalRef.content.onClose.subscribe((Retorno: any) => {
          if (Retorno !== undefined) {

            /* 1-Limpia 2-asigna variable tipobusqueda 3-Aplica logica vacios 4-setea datos buscados//comentarios @MLobos*/

            this.limpiar();
            this.dataPacienteSolicitud = Retorno
           
            this.tipobusqueda = busqueda;
            this.logicaVacios();
            this.setDatos();

          }
        });
        break;
        break;
      case 'Solicitud':
        this._BSModalRef = this._BsModalService.show(BusquedasolicitudpacientesComponent, this.setModal("Busqueda de ".concat(busqueda)));
        this._BSModalRef.content.onClose.subscribe((Retorno: any) => {
          if (Retorno !== undefined) {

            /* 1-Limpia 2-asigna variable tipobusqueda 3-Aplica logica vacios 4-setea datos buscados//comentarios @MLobos*/

            this._solicitudService.BuscaSolicitud(Retorno.soliid, this.hdgcodigo, this.esacodigo, this.cmecodigo, 0, "", "", 0, 0, 0, this.servidor, 0, -1, 0, 0, 0, 0, "",0).subscribe(
              response => {
                this.limpiar();
                this.dataPacienteSolicitud = response[0];
                // if(this.dataPacienteSolicitud.estadosolicitud != 10){
                //   this.desactivabtneliminar= true;
                // }
                this.BuscaBodegaDeServicio(Retorno.codservicioori)
                this.tipobusqueda = busqueda;
                this.logicaVacios();
                this.setDatos();
              });

          }
        }
        );
        break;
    }

  }

  desactivabtneliminar(){
    if ( this.dataPacienteSolicitud.estadosolicitud !== 10 
    // && this.solicitudesgrilla.length >0
    ) {
     return true
    
    } else {
     return false
    
    }
    
  }

  BuscaBodegaDeServicio(codservicioori: number) {
    this._BodegasService.BuscaBodegaporServicio(this.hdgcodigo, this.esacodigo, this.cmecodigo,
      codservicioori, this.usuario, this.servidor).subscribe(
        response => {
          if (response.length == 0) {
          } else {
            this.FormDatosPaciente.get('bodcodigo').setValue(response[0].boddescodigo);
            this.BuscaBodegasSuministro(response[0].boddescodigo);
          }
        },
        error => {
          this.loading = false;
          this.uimensaje('danger', 'Error al buscar Bodega de Servicio', 3000);
        }
      );
  }

  /* Metodo que agrega un nuevo producto */
  onBuscarProducto() {

    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModal("Busqueda de Productos"));
    this._BSModalRef.content.onClose.subscribe((RetornoProductos: Articulos) => {
      if (RetornoProductos !== undefined) {
        
        const resultado = this.arrdetalleMedicamentos.find( registro => registro.codmei === RetornoProductos.codigo );
        if  ( resultado != undefined )
        {
          this.alertSwalError.title = "Código de artículo repetido";
          this.alertSwalError.show();
          return
        }
        this.setProducto(RetornoProductos);
        this.logicaVacios();
      }
    });
  }

  async onBuscarPlantillas() {
    this._BSModalRef = this._BsModalService.show(BusquedaplantillasbodegaComponent, this.setModalBusquedaPlantilla());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) {
        return;
      }
      else {
        this._BodegasService.BuscaPlantillas(this.servidor, sessionStorage.getItem('Usuario'), this.hdgcodigo, this.esacodigo,
        this.cmecodigo, response.planid, '', '', '', 0, 0, '', '', 2).subscribe(
          response_plantilla => {
            if (response_plantilla.length == 0) {
            } else {
              this.loading = true;
              if (response_plantilla.length > 0) {
                let arrPlantillas: Plantillas = new Plantillas();
                arrPlantillas = response_plantilla[0];
                this.nomplantilla = arrPlantillas.plandescrip;
                arrPlantillas.plantillasdet.forEach(res => {
                  this.setPlantilla(res);
                  this.logicaVacios();
                });
                this.getLote();
              }
            }
            this.loading = false;
          });
        }
      });
  }

  /**Funcion que devuelve lotes de productos en plantilla */
  async getLote() {
    await this.setSolicitud();
    this._solicitudService.buscarLotedetalleplantilla(this.solicitudMedicamento).subscribe(dat => {
      this.setLotemedicamento(dat);
      this.setLoteinsumo(dat);
    }, err => {
      this.alertSwalError.title = 'Error al buscar Lotes';
      this.alertSwalError.show();
    });
  }

  /**agrega los lotes y fecha vto a la grilla Medicamentos */
  async setLotemedicamento(data: any) {
    var lotes: Array<Detalleproducto> = data;
    this.arrdetalleMedicamentos.forEach(res => {
        lotes.forEach(x => {
          if (res.codmei === x.codmei) {
            res.detallelote = x.detallelote;
            if (x.detallelote.length) {
              res.fechavto = x.detallelote[0].fechavto;
              res.lote = x.detallelote[0].lote;
            } else {
              // no tiene lote
            }
          }
        });
      });
  }

  /**agrega los lotes y fecha vto a la grilla Insumos */
  async setLoteinsumo(data: any) {
    var lotes: Array<Detalleproducto> = data;
    this.arrdetalleInsumos.forEach(res => {
        lotes.forEach(x => {
          if (res.codmei === x.codmei) {
            res.detallelote = x.detallelote;
            if (x.detallelote.length) {
              res.fechavto = x.detallelote[0].fechavto;
              res.lote = x.detallelote[0].lote;
            } else {
              // no tiene lote
            }
          }
        });
      });
  }

  /* Carga datos busqueda en pantalla */
  async setDatos() {
    this.numsolicitud = this.dataPacienteSolicitud.soliid;
    this.FormDatosPaciente.get('tipodocumento').setValue(this.dataPacienteSolicitud.glstipidentificacion);
    this.FormDatosPaciente.get('numidentificacion').setValue(this.dataPacienteSolicitud.numdocpac);
    this.FormDatosPaciente.get('nombrepaciente').setValue(this.dataPacienteSolicitud.apepaternopac.concat(" ")
      .concat(this.dataPacienteSolicitud.apematernopac).concat(" ")
      .concat(this.dataPacienteSolicitud.nombrespac));
    this.FormDatosPaciente.get('sexo').setValue(this.dataPacienteSolicitud.glsexo);
    this.FormDatosPaciente.get('edad').setValue(this.dataPacienteSolicitud.edad);//<- FALTA
    this.FormDatosPaciente.get('numcuenta').setValue(this.dataPacienteSolicitud.cuentanumcuenta);
    this.FormDatosPaciente.get('medico').setValue(this.dataPacienteSolicitud.nombremedico);
    this.FormDatosPaciente.get('ubicacion').setValue(this.dataPacienteSolicitud.pzagloza);
    this.FormDatosPaciente.get('bodcodigo').setValue(this.dataPacienteSolicitud.bodorigen);
    this.FormDatosPaciente.get('codbodegasuministro').setValue(this.dataPacienteSolicitud.boddestino);
    this.FormDatosPaciente.get('numsolicitud').setValue(this.dataPacienteSolicitud.soliid);
    this.FormDatosPaciente.get('unidad').setValue(this.dataPacienteSolicitud.undglosa);
    this.FormDatosPaciente.get('pieza').setValue(this.dataPacienteSolicitud.pzagloza);
    this.FormDatosPaciente.get('cama').setValue(this.dataPacienteSolicitud.camglosa);
    if (this.tipobusqueda === "Paciente") {
      this.FormDatosPaciente.get('fechahora').setValue(new Date());
    } else if (this.tipobusqueda === "Solicitud") {
      this.FormDatosPaciente.get('fechahora').setValue(this.datePipe.transform(this.dataPacienteSolicitud.fechacreacion, 'dd-MM-yyyy HH:mm:ss'));
      this.FormDatosPaciente.get('ambito').disable();
      this.FormDatosPaciente.get('estado').disable();
      this.FormDatosPaciente.get('ambito').setValue(this.dataPacienteSolicitud.codambito);
      this.FormDatosPaciente.get('estado').setValue(this.dataPacienteSolicitud.estadosolicitud);
      if (this.dataPacienteSolicitud.solicitudesdet.length) {
        //**Si tiene detalle de producto ejecuta funcion //@Mlobos */
        this.cargaGrillaproductos();
      }
    }
    this.checkSoleliminada();
    this.loading = false;
  }

  checkSoleliminada() {
    if (this.dataPacienteSolicitud.estadosolicitudde === 'ELIMINADA') {
      this.arrdetalleMedicamentos = [];
      this.arrMedicamentopaginacion = [];
      this.arrdetalleInsumos = [];
      this.arrInsumospaginacion = [];
      this.tipobusqueda = null;
    }
  }

  cargaGrillaproductos() {
    this.dataPacienteSolicitud.solicitudesdet.forEach(element => {
      if (element.tiporegmein == "I") {
        this.tipobusqueda = "Imprimir";
        this.solins = true;

      } else {
        if (element.tiporegmein == "M") {
          this.tipobusqueda = "Solicitud";
          this.solmedic = true;

        }
      }
    }
    );
    if (this.solins == true) {

      this.arrdetalleInsumos = this.dataPacienteSolicitud.solicitudesdet
      this.arrInsumospaginacion = this.arrdetalleInsumos.slice(0, 20); // <- Llamar Función paginación
      this.solins = false;
      this.solmedic = false;
    } else {
      if (this.solmedic == true) {
        this.arrdetalleMedicamentos = this.dataPacienteSolicitud.solicitudesdet;
        this.arrMedicamentopaginacion = this.arrdetalleMedicamentos.slice(0, 20)
        this.solins = false;
        this.solmedic = false;

      }
    }
  }

  /* Calculo formulación grilla Productos //@MLobos*/
  cantidadsolicitada(detalle: DetalleSolicitud, id:number,property: string ) {
    
    let dosis, dias, total: number = 0;

    dosis = detalle.dosis;

    if (dosis <= 0) {
          this.alertSwalError.title = "Dosis debe ser mayor a cero";
          this.alertSwalError.show();
          
          return

    }

    if (detalle.formulacion <= 0) {
      this.alertSwalError.title = "Formulación debe ser mayor a cero";
      this.alertSwalError.show();
      
      return

    }

    if (detalle.dias <= 0) {
      this.alertSwalError.title = "Veces al día debe ser mayor a cero";
      this.alertSwalError.show();
      
      return

    }

    

    // formulacion = Math.round(24 / detalle.formulacion);
    dias = detalle.dias;
    total = dosis * detalle.formulacion;
    detalle.cantsoli = total * dias;
    /* Si la busqueda es 'Solicitud'.. 
      si acciond=I (inserta) entonces mantiene..
      de lo contrario acciond=M (modifica) */
    if (this.tipobusqueda == 'Solicitud') {
      if (detalle.acciond !== 'I') {
        detalle.acciond = 'M';
      }
    }
    this.logicaVacios();

    if (detalle.cantsoli <= 0) {
      this.alertSwalError.title = "Total solicitado debe ser mayor a cero";
      this.alertSwalError.show();
      
      return

    }


  }

  cantidadInsumo(detalle: DetalleSolicitud) {
    if (this.tipobusqueda == 'Solicitud') {
      if (detalle.acciond !== 'I') {
        detalle.acciond = 'M';
      }
    }
    this.logicaVacios();
  }

  limpiar() {
    this.dataPacienteSolicitud = new Solicitud();
    this.accionsolicitud = 'I';
    this.fechaactual = null;
    this.nomplantilla = null;
    this.FormDatosPaciente.reset();
    this.arrdetalleMedicamentos = [];
    this.arrMedicamentopaginacion = [];
    this.arrdetalleInsumos = [];
    this.arrInsumospaginacion = [];
    this.grillaMedicamentos = [];
    this.grillaInsumos = [];
    this.solicitudMedicamento = new Solicitud();
    this.solicitudInsumo = new Solicitud();
    this.tipobusqueda = null;
    this.FormDatosPaciente.controls["ambito"].setValue(3);
    this.FormDatosPaciente.controls["estado"].setValue(10);
    this.FormDatosPaciente.get('ambito').enable();
    this.FormDatosPaciente.get('estado').enable();
    this.solmedic = false;
    this.solins = false;
    this.imprimesolins = false;
    this.FormDatosPaciente.get('fechahora').setValue(new Date());
    /* Desactivan btn barra inferior //@MLobosh*/
    this.btnCrearsol = false;
    this.vacios = true;
    /** */
    this.doblesolicitud = false
  }

  limpiarGrillamedicamento() {
    if (this.arrdetalleMedicamentos.length) {
      this.alertSwalAlert.title = '¿Borrar todos los elementos en la tabla?';
      this.alertSwalAlert.show().then(resp => {
        if (resp.value) {
          this.arrdetalleMedicamentos = [];
          this.arrMedicamentopaginacion = [];

          this.grillaMedicamentos = [];
        }
        this.logicaVacios();
      }
      );
    }
  }

  limpiarGrillainsumo() {
    if (this.arrdetalleInsumos.length) {
      this.alertSwalAlert.title = '¿Borrar todos los elementos en la tabla?';
      this.alertSwalAlert.show().then(resp => {
        if (resp.value) {
          this.arrdetalleInsumos = [];
          this.arrInsumospaginacion = [];
          this.grillaInsumos = [];
        }
        this.logicaVacios();
      }
      );
    }
  }

  /**Si hay campos vacios grilla desactiva Crear Sol//@Mlobos */
  async logicaVacios() {
    this.vaciosProductos()
    if (this.vacios === true) {
      this.btnCrearsol = false;
    }
    else {
      this.btnCrearsol = true;
    }
  }

  vaciosProductos() {
    if (this.arrMedicamentopaginacion.length) {
      for (var data of this.arrMedicamentopaginacion) {
        if (data.dosis === 0 || data.formulacion === 0 || data.dias === 0 ||
          data.dosis === null || data.formulacion === null || data.dias === null) {
          this.vacios = true;
          return;
        } else {
          this.vacios = false;
        }
      }
    }
    if (this.arrInsumospaginacion.length) {
      for (var data of this.arrInsumospaginacion) {
        if (data.cantsoli === 0 || data.cantsoli === null) {
          this.vacios = true;
          return;
        } else {
          this.vacios = false;
        }
      }
    }
  }

  async setPlantilla(art: DetallePlantillaBodega) {
    this.idplantilla = art.planid;

    var detalleSolicitud = new DetalleSolicitud;
    detalleSolicitud.sodeid = 0;
    detalleSolicitud.soliid = 0;
    detalleSolicitud.repoid = 0;
    detalleSolicitud.codmei = art.codmei;
    detalleSolicitud.meinid = art.meinid;
    detalleSolicitud.dosis = 1;
    detalleSolicitud.formulacion = 1;
    detalleSolicitud.dias = 1;
    detalleSolicitud.cantsoli = art.cantsoli;
    detalleSolicitud.pendientedespacho = 0;
    detalleSolicitud.cantdespachada = 0;
    detalleSolicitud.cantdevolucion = 0;
    detalleSolicitud.estado = 1;
    detalleSolicitud.observaciones = null;
    detalleSolicitud.fechamodifica = null;
    detalleSolicitud.usuariomodifica = null;
    detalleSolicitud.fechaelimina = null;
    detalleSolicitud.usuarioelimina = null;
    detalleSolicitud.viaadministracion = null;
    detalleSolicitud.meindescri = art.meindescri;
    detalleSolicitud.stockorigen = null;
    detalleSolicitud.stockdestino = null;
    detalleSolicitud.acciond = null;
    detalleSolicitud.marca = null;
    detalleSolicitud.fechavto = null;
    detalleSolicitud.lote = null;
    detalleSolicitud.cantadespachar = 0;
    detalleSolicitud.descunidadmedida = null;
    detalleSolicitud.tiporegmein = art.tiporegmein;
    detalleSolicitud.acciond = 'I';
    detalleSolicitud.nomplantilla = this.nomplantilla;
    if (detalleSolicitud.tiporegmein == "M") {
      this.arrdetalleMedicamentos.unshift(detalleSolicitud);
      this.arrMedicamentopaginacion = this.arrdetalleMedicamentos.slice(0, 20);
    } else {
      if (detalleSolicitud.tiporegmein == "I") {
        this.arrdetalleInsumos.unshift(detalleSolicitud);
        this.arrInsumospaginacion = this.arrdetalleInsumos.slice(0,20);
      }
    }
  }


  setProducto(art: Articulos) {
    const cantidad = parseInt(this.FormDatosProducto.controls.cantidad.value);
    var detalleSolicitud = new DetalleSolicitud;
    detalleSolicitud.sodeid = 0;
    detalleSolicitud.soliid = 0;
    detalleSolicitud.repoid = 0;
    detalleSolicitud.codmei = art.codigo;
    detalleSolicitud.meinid = art.mein;
    detalleSolicitud.dosis = 0;
    detalleSolicitud.formulacion = 0;
    detalleSolicitud.dias = 0;
    detalleSolicitud.cantsoli = cantidad;
    detalleSolicitud.pendientedespacho = 0;
    detalleSolicitud.cantdespachada = 0;
    detalleSolicitud.cantdevolucion = 0;
    detalleSolicitud.estado = 1;
    detalleSolicitud.observaciones = null;
    detalleSolicitud.fechamodifica = null;
    detalleSolicitud.usuariomodifica = null;
    detalleSolicitud.fechaelimina = null;
    detalleSolicitud.usuarioelimina = null;
    detalleSolicitud.viaadministracion = null;
    detalleSolicitud.meindescri = art.descripcion;
    detalleSolicitud.stockorigen = null;
    detalleSolicitud.stockdestino = null;
    detalleSolicitud.acciond = null;
    detalleSolicitud.marca = null;
    detalleSolicitud.fechavto = null;
    detalleSolicitud.lote = null;
    detalleSolicitud.cantadespachar = 0;
    detalleSolicitud.descunidadmedida = art.desunidaddespacho;
    detalleSolicitud.tiporegmein = art.tiporegistro;
    detalleSolicitud.nomplantilla = null;
    this.es_controlado = art.controlado;
    this.es_consignacion = art.consignacion;
    detalleSolicitud.controlado = this.es_controlado;
    detalleSolicitud.consignacion = this.es_consignacion;
    detalleSolicitud.acciond = 'I';
    if (detalleSolicitud.tiporegmein == "M") {
      /** Cambia a tab Medicamento */
      this.tabProductoTabs.tabs[0].active = true;
      /** */
      this.arrdetalleMedicamentos.unshift(detalleSolicitud);

      this.arrMedicamentopaginacion = this.arrdetalleMedicamentos.slice(0,20)

    } else if (detalleSolicitud.tiporegmein == "I") {
      /** Cambia a tab Insumo */
      this.tabProductoTabs.tabs[1].active = true;
      /** */
      this.arrdetalleInsumos.unshift(detalleSolicitud);
      this.arrInsumospaginacion = this.arrdetalleInsumos.slice(0, 20)
    }
  }

  setDetallemedicamentos() {
    this.arrdetalleMedicamentos.forEach(element => {
      var objProducto = new DetalleSolicitud;
      if (this.numsolicitud > 0) {
        objProducto.soliid = this.numsolicitud;
        objProducto.sodeid = element.sodeid;
        objProducto.acciond = element.acciond;
      } else if (this.accionsolicitud == 'M' || this.accionsolicitud == 'E') {
        objProducto.soliid = this.FormDatosPaciente.controls.numsolicitud.value;
        objProducto.sodeid = element.sodeid;
        objProducto.acciond = element.acciond;
        objProducto.fechamodifica = this.fechaactual;
        objProducto.usuariomodifica = this.usuario;
      } else {
        objProducto.soliid = 0;
        objProducto.sodeid = 0;
        objProducto.acciond = element.acciond;
      }
      objProducto.repoid = 0;
      objProducto.codmei = element.codmei;
      objProducto.meinid = element.meinid;
      objProducto.dosis = element.dosis;
      objProducto.formulacion = element.formulacion;
      objProducto.dias = element.dias;
      objProducto.cantsoli = element.cantsoli;
      objProducto.pendientedespacho = 0;
      objProducto.cantdespachada = 0;
      objProducto.cantdevolucion = 0;
      objProducto.estado = 1;
      objProducto.observaciones = null;
      objProducto.fechamodifica = null;
      objProducto.usuariomodifica = null;
      objProducto.fechaelimina = null;
      objProducto.usuarioelimina = null;
      objProducto.viaadministracion = null;
      objProducto.meindescri = element.meindescri;
      objProducto.stockorigen = null;
      objProducto.stockdestino = null;
      objProducto.marca = null;
      objProducto.fechavto = null;
      objProducto.lote = null;
      objProducto.cantadespachar = 0;
      objProducto.descunidadmedida = null;
      objProducto.tiporegmein = element.tiporegmein;
      this.grillaMedicamentos.push(objProducto);
    });

  }

  async setCabeceramedicamentos() {
    let cabeceraSolicitud = new Solicitud();
    /**set variables a null */
    for (var key in cabeceraSolicitud) {
      if (cabeceraSolicitud.hasOwnProperty(key)) {
        cabeceraSolicitud[key] = null;
      }
    }
    /**set var necesarias */
    cabeceraSolicitud.hdgcodigo = this.hdgcodigo;
    cabeceraSolicitud.esacodigo = this.esacodigo;
    cabeceraSolicitud.cmecodigo = this.cmecodigo;
    cabeceraSolicitud.cliid = this.dataPacienteSolicitud.cliid;
    cabeceraSolicitud.tipodocpac = this.dataPacienteSolicitud.tipodocpac;
    cabeceraSolicitud.numdocpac = this.dataPacienteSolicitud.numdocpac.trim();
    cabeceraSolicitud.apepaternopac = this.dataPacienteSolicitud.apepaternopac;
    cabeceraSolicitud.apematernopac = this.dataPacienteSolicitud.apematernopac;
    cabeceraSolicitud.nombrespac = this.dataPacienteSolicitud.nombrespac;
    cabeceraSolicitud.codambito = parseInt(this.FormDatosPaciente.controls['ambito'].value);
    cabeceraSolicitud.estid = this.dataPacienteSolicitud.estid;
    cabeceraSolicitud.ctaid = this.dataPacienteSolicitud.ctaid;
    cabeceraSolicitud.edadpac = 0;
    cabeceraSolicitud.codsexo = this.dataPacienteSolicitud.codsexo;
    cabeceraSolicitud.codservicioactual = this.dataPacienteSolicitud.codservicioactual;
    cabeceraSolicitud.codservicioori = this.dataPacienteSolicitud.codservicioori;
    cabeceraSolicitud.codserviciodes = 0;
    cabeceraSolicitud.boddestino = this.FormDatosPaciente.value.bodcodigo;
    cabeceraSolicitud.bodorigen = this.FormDatosPaciente.value.bodcodigo;
    cabeceraSolicitud.tipoproducto = 0;
    cabeceraSolicitud.numeroreceta = 0;
    cabeceraSolicitud.tipomovim = 'C';
    cabeceraSolicitud.tiposolicitud = 40;
    cabeceraSolicitud.estadosolicitud = parseInt(this.FormDatosPaciente.controls['estado'].value);
    cabeceraSolicitud.prioridadsoli = 1;
    cabeceraSolicitud.tipodocprof = this.dataPacienteSolicitud.tipodocprof;
    cabeceraSolicitud.numdocprof = this.dataPacienteSolicitud.numdocprof;
    cabeceraSolicitud.fechacreacion = this.fechaactual;
    cabeceraSolicitud.usuariocreacion = this.usuario;
    cabeceraSolicitud.nombremedico = this.dataPacienteSolicitud.nombremedico;
    cabeceraSolicitud.cuentanumcuenta = this.dataPacienteSolicitud.cuentanumcuenta;
    cabeceraSolicitud.usuario = this.usuario;
    cabeceraSolicitud.servidor = this.servidor;
    cabeceraSolicitud.origensolicitud = 40;
    /* Datos paciente */
    cabeceraSolicitud.codpieza = this.dataPacienteSolicitud.codpieza;
    cabeceraSolicitud.camid = this.dataPacienteSolicitud.camid;
    cabeceraSolicitud.piezaid = this.dataPacienteSolicitud.piezaid;
    cabeceraSolicitud.glsexo = this.dataPacienteSolicitud.glsexo;
    cabeceraSolicitud.glstipidentificacion = this.dataPacienteSolicitud.glstipidentificacion;
    cabeceraSolicitud.glsambito = this.dataPacienteSolicitud.glsambito;
    cabeceraSolicitud.undglosa = this.dataPacienteSolicitud.undglosa;
    cabeceraSolicitud.camglosa = this.dataPacienteSolicitud.camglosa;
    cabeceraSolicitud.pzagloza = this.dataPacienteSolicitud.pzagloza;
    cabeceraSolicitud.edad = this.dataPacienteSolicitud.edad;
    cabeceraSolicitud.controlado = this.es_controlado;
    cabeceraSolicitud.consignacion = this.es_consignacion;
    cabeceraSolicitud.solitiporeg = "M";
    cabeceraSolicitud.idplantilla = this.idplantilla;

    /** asigna grilla medicamentos */
    this.setGrillamedicamentos();
    cabeceraSolicitud.solicitudesdet = this.grillaMedicamentos;
    this.solicitudMedicamento = cabeceraSolicitud;
  }

  async setGrillamedicamentos() {
    this.grillaMedicamentos = [];

    this.arrdetalleMedicamentos.forEach(element => {

      var medicamento = new DetalleSolicitud;
      if (this.numsolicitud > 0) {
        if (this.accionsolicitud == 'M') {
          medicamento.soliid = this.FormDatosPaciente.controls.numsolicitud.value;
          medicamento.sodeid = element.sodeid;
          medicamento.acciond = element.acciond;
          medicamento.fechamodifica = this.fechaactual;
          medicamento.usuariomodifica = this.usuario;
        }
        if (this.accionsolicitud == 'E') {
          medicamento.soliid = this.FormDatosPaciente.controls.numsolicitud.value;
          medicamento.sodeid = element.sodeid;
          medicamento.acciond = this.accionsolicitud;
          medicamento.fechaelimina = this.fechaactual;
          medicamento.usuarioelimina = this.usuario;
        }
      } else {
        if (this.accionsolicitud = 'I') {
          medicamento.soliid = 0;
          medicamento.sodeid = 0;
          medicamento.acciond = this.accionsolicitud;
        }
      }
      medicamento.repoid = 0;
      medicamento.codmei = element.codmei;
      medicamento.meinid = element.meinid;
      medicamento.dosis = element.dosis;
      medicamento.formulacion = element.formulacion;
      medicamento.dias = element.dias;
      medicamento.cantsoli = element.cantsoli;
      medicamento.pendientedespacho = 0;
      medicamento.cantdespachada = 0;
      medicamento.cantdevolucion = 0;
      medicamento.estado = 1;
      medicamento.observaciones = null;
      medicamento.fechamodifica = null;
      medicamento.usuariomodifica = null;
      medicamento.fechaelimina = null;
      medicamento.usuarioelimina = null;
      medicamento.viaadministracion = null;
      medicamento.meindescri = element.meindescri;
      medicamento.stockorigen = null;
      medicamento.stockdestino = null;
      medicamento.marca = null;
      medicamento.fechavto = element.fechavto;
      medicamento.lote = element.lote;
      medicamento.cantadespachar = 0;
      medicamento.descunidadmedida = null;
      medicamento.tiporegmein = element.tiporegmein;
      medicamento.idplantilla = this.idplantilla;
      this.grillaMedicamentos.push(medicamento);
    });
    this.medicamentosadispensar = this.arrdetalleMedicamentos;
  }

  async setCabecerainsumos() {
    let cabeceraSolicitud = new Solicitud();
    /**set variables a null */
    for (var key in cabeceraSolicitud) {
      if (cabeceraSolicitud.hasOwnProperty(key)) {
        cabeceraSolicitud[key] = null;
      }
    }
    /**set var necesarias */
    cabeceraSolicitud.hdgcodigo = this.hdgcodigo;
    cabeceraSolicitud.esacodigo = this.esacodigo;
    cabeceraSolicitud.cmecodigo = this.cmecodigo;
    cabeceraSolicitud.cliid = this.dataPacienteSolicitud.cliid;
    cabeceraSolicitud.tipodocpac = this.dataPacienteSolicitud.tipodocpac;
    cabeceraSolicitud.numdocpac = this.dataPacienteSolicitud.numdocpac.trim();
    cabeceraSolicitud.apepaternopac = this.dataPacienteSolicitud.apepaternopac;
    cabeceraSolicitud.apematernopac = this.dataPacienteSolicitud.apematernopac;
    cabeceraSolicitud.nombrespac = this.dataPacienteSolicitud.nombrespac;
    /** Setea codambito para luego llamar al servicio Cargasolicitud */
    this.codambito = this.FormDatosPaciente.controls.ambito.value;
    cabeceraSolicitud.codambito = parseInt(this.FormDatosPaciente.controls['ambito'].value);
    cabeceraSolicitud.estid = this.dataPacienteSolicitud.estid;
    cabeceraSolicitud.ctaid = this.dataPacienteSolicitud.ctaid;
    cabeceraSolicitud.edadpac = 0;
    cabeceraSolicitud.codsexo = this.dataPacienteSolicitud.codsexo;
    cabeceraSolicitud.codservicioactual = this.dataPacienteSolicitud.codservicioactual;
    cabeceraSolicitud.codservicioori = this.dataPacienteSolicitud.codservicioori;
    cabeceraSolicitud.codserviciodes = 0;
    cabeceraSolicitud.boddestino = this.FormDatosPaciente.value.bodcodigo;
    cabeceraSolicitud.bodorigen = this.FormDatosPaciente.value.bodcodigo;
    cabeceraSolicitud.tipoproducto = 0;
    cabeceraSolicitud.numeroreceta = 0;
    cabeceraSolicitud.tipomovim = 'C';
    cabeceraSolicitud.tiposolicitud = 40;
    cabeceraSolicitud.estadosolicitud = parseInt(this.FormDatosPaciente.controls['estado'].value);
    cabeceraSolicitud.prioridadsoli = 1;
    cabeceraSolicitud.tipodocprof = this.dataPacienteSolicitud.tipodocprof;
    cabeceraSolicitud.numdocprof = this.dataPacienteSolicitud.numdocprof;
    cabeceraSolicitud.fechacreacion = this.fechaactual;
    cabeceraSolicitud.usuariocreacion = this.usuario;
    cabeceraSolicitud.nombremedico = this.dataPacienteSolicitud.nombremedico;
    cabeceraSolicitud.cuentanumcuenta = this.dataPacienteSolicitud.cuentanumcuenta;
    cabeceraSolicitud.usuario = this.usuario;
    cabeceraSolicitud.servidor = this.servidor;
    cabeceraSolicitud.origensolicitud = 40;
    /* Datos paciente */
    cabeceraSolicitud.codpieza = this.dataPacienteSolicitud.codpieza;
    cabeceraSolicitud.camid = this.dataPacienteSolicitud.camid;
    cabeceraSolicitud.piezaid = this.dataPacienteSolicitud.piezaid;
    cabeceraSolicitud.glsexo = this.dataPacienteSolicitud.glsexo;
    cabeceraSolicitud.glstipidentificacion = this.dataPacienteSolicitud.glstipidentificacion;
    cabeceraSolicitud.glsambito = this.dataPacienteSolicitud.glsambito;
    cabeceraSolicitud.undglosa = this.dataPacienteSolicitud.undglosa;
    cabeceraSolicitud.camglosa = this.dataPacienteSolicitud.camglosa;
    cabeceraSolicitud.pzagloza = this.dataPacienteSolicitud.pzagloza;
    cabeceraSolicitud.edad = this.dataPacienteSolicitud.edad;
    cabeceraSolicitud.controlado = this.es_controlado;
    cabeceraSolicitud.consignacion = this.es_consignacion;
    cabeceraSolicitud.solitiporeg = "M";
    /** asigna grilla medicamentos */
    this.setGrillainsumos();
    cabeceraSolicitud.solicitudesdet = this.grillaInsumos;
    this.solicitudInsumo = cabeceraSolicitud;
  }

  async setGrillainsumos() {
    this.grillaInsumos = [];
    this.arrdetalleInsumos.forEach(element => {
      var insumo = new DetalleSolicitud;
      if (this.numsolicitud > 0) {
        if (this.accionsolicitud == 'M') {
          insumo.soliid = this.FormDatosPaciente.controls.numsolicitud.value;
          insumo.sodeid = element.sodeid;
          insumo.acciond = element.acciond;
          insumo.fechamodifica = this.fechaactual;
          insumo.usuariomodifica = this.usuario;
        }
        if (this.accionsolicitud == 'E') {
          insumo.soliid = this.FormDatosPaciente.controls.numsolicitud.value;
          insumo.sodeid = element.sodeid;
          insumo.acciond = this.accionsolicitud;
          insumo.fechaelimina = this.fechaactual;
          insumo.usuarioelimina = this.usuario;
        }
      } else {
        if (this.accionsolicitud = 'I') {
          insumo.soliid = 0;
          insumo.sodeid = 0;
          insumo.acciond = this.accionsolicitud;
        }
      }
      insumo.repoid = 0;
      insumo.codmei = element.codmei;
      insumo.meinid = element.meinid;
      insumo.dosis = 0;
      insumo.formulacion = 0;
      insumo.dias = 0;
      insumo.cantsoli = element.cantsoli;
      insumo.pendientedespacho = 0;
      insumo.cantdespachada = 0;
      insumo.cantdevolucion = 0;
      insumo.estado = 1;
      insumo.observaciones = null;
      insumo.fechamodifica = null;
      insumo.usuariomodifica = null;
      insumo.fechaelimina = null;
      insumo.usuarioelimina = null;
      insumo.viaadministracion = null;
      insumo.meindescri = element.meindescri;
      insumo.stockorigen = null;
      insumo.stockdestino = null;
      insumo.marca = null;
      insumo.fechavto = element.fechavto;
      insumo.lote = element.lote;
      insumo.cantadespachar = 0;
      insumo.descunidadmedida = null;
      insumo.tiporegmein = element.tiporegmein;
      this.grillaInsumos.push(insumo);
    });
    this.insumosadispensar = this.arrdetalleInsumos;
  }

  async setSolicitud() {

    this.fechaactual = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    /**Seteamos variables cabecera Solicitud //@Mlobos */
    try {
      await this.setCabeceramedicamentos();

      await this.setCabecerainsumos();
    } catch (err) {
      this.alertSwalError.title = "Error";
      this.alertSwalError.text = err.message;
      this.alertSwalError.show();
    }
  }

  async onGrabar() {
    this.accionsolicitud = 'I';
    this.modalconfirmar("Crear");
  }

  async onModificar() {
    this.accionsolicitud = 'M';
    this.numsolicitud = this.FormDatosPaciente.controls.numsolicitud.value;
    this.modalconfirmar("Modificar");
  }

  async onEliminarSolicitud() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Eliminar Solicitud?',
      text: "Confirma eliminación",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.value) {
        this.loading = true;

        if (this.arrdetalleMedicamentos.length > 0) {
          this.arrdetalleMedicamentos.forEach(element => {
            element.acciond = "E";
            element.usuarioelimina = this.usuario;
          })
          await this.setSolicitud();
          this.solicitudMedicamento.usuarioelimina = this.usuario;
          this.solicitudMedicamento.estadosolicitud = 110;
          this.solicitudMedicamento.soliid = this.dataPacienteSolicitud.soliid// this.FormSolicitudPaciente.value.numsolicitud;
          this.solicitudMedicamento.accion = "E";
          this.solicitudMedicamento.solicitudesdet = this.arrdetalleMedicamentos;

          this._solicitudService.crearSolicitud(this.solicitudMedicamento).subscribe(data => {
            this.alertSwal.title = "Solicitud Eliminada";
            this.alertSwal.show();
            this.loading = false;
          }, err => {
            this.loading = false;
            this.alertSwalError.title = "Error";
            this.alertSwalError.text = err.message;
            this.alertSwalError.show();
          }
          );
        } else {
          if (this.arrdetalleInsumos.length > 0) {
            this.arrdetalleInsumos.forEach(element => {
              element.acciond = "E";
              element.usuarioelimina = this.usuario;
            })
            await this.setSolicitud();
            this.solicitudInsumo.usuarioelimina = this.usuario;
            this.solicitudInsumo.estadosolicitud = 110;
            this.solicitudInsumo.soliid = this.dataPacienteSolicitud.soliid// this.FormSolicitudPaciente.value.numsolicitud;
            this.solicitudInsumo.accion = "E";
            this.solicitudInsumo.solicitudesdet = this.arrdetalleInsumos;
            this._solicitudService.crearSolicitud(this.solicitudInsumo).subscribe(data => {
              this.alertSwal.title = "Solicitud Eliminada";
              this.alertSwal.show();
              this.loading = false;
            }, err => {
              this.loading = false;
              this.alertSwalError.title = "Error";
              this.alertSwalError.text = err.message;
              this.alertSwalError.show();
            }
            );
          }
        }
      }
    });
  }

  //Elimina medicamento desde la grilla
  async onEliminarMed(detalle: DetalleSolicitud, id: number) {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Eliminar?',
      text: "Confirmar acción",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.value) {
        this.loading = true;
        if (detalle.soliid == 0 && detalle.sodeid == 0) {
          detalle.acciond = 'I';
          if (detalle.acciond == "I" && id >= 0 && detalle.sodeid == 0) {
            // Eliminar registro nuevo la grilla
            this.arrdetalleMedicamentos.splice(id, 1);
            this.arrMedicamentopaginacion = this.arrdetalleMedicamentos.slice(0, 20);
            this.logicaVacios();
            this.loading = false;
            this.alertSwal.title = "Producto eliminado exitosamente";
            this.alertSwal.show();
          }
        }
        else {
          if (detalle.soliid > 0 && detalle.sodeid > 0) {
            this.accionsolicitud = 'M';
            await this.setCabeceramedicamentos();
            this.solicitudMedicamento.accion = "M"
            this.solicitudMedicamento.soliid = detalle.soliid;
            this.solicitudMedicamento.usuariomodifica = this.usuario;
            this.solicitudMedicamento.usuariocreacion = null;
            this.solicitudMedicamento.fechacreacion = null;
            this.solicitudMedicamento.solicitudesdet[id].acciond = 'E';
            this.solicitudMedicamento.solicitudesdet[id].codmei = detalle.codmei;
            this.solicitudMedicamento.solicitudesdet[id].meindescri = detalle.meindescri;
            this.solicitudMedicamento.solicitudesdet[id].meinid = detalle.meinid;
            this.solicitudMedicamento.solicitudesdet[id].sodeid = detalle.sodeid;
            this.solicitudMedicamento.solicitudesdet[id].soliid = detalle.soliid;
            this.solicitudMedicamento.solicitudesdet[id].usuarioelimina = this.usuario;
            this.loading = false;
            /** Luego de setear el producto a eliminar procede a grabar solicitud//@ML */
            this.guardaProdeliminado(this.solicitudMedicamento);
          }
        }
      } else {
        detalle.acciond = null;
      }
    });
  }

  guardaProdeliminado(solicitud: Solicitud) {
    this.alertSwal.title = null;
    this.alertSwal.text = null;
    this._solicitudService.crearSolicitud(solicitud).subscribe(data => {

      this.loading = false;
      this.alertSwal.title = "Producto eliminado exitosamente";
      this.alertSwal.show();
      this.cargaSolicitud(this.numsolicitud);
    }, err => {
      this.loading = false;
      this.alertSwalError.title = "Error";
      this.alertSwalError.text = err.message;
      this.alertSwalError.show();
    }
    );
  }

  // Elimina Insumo desde la Grilla
  async onEliminarIns(detalle: DetalleSolicitud, id: number) {
    this.alertSwal.title = null;
    this.alertSwal.text = null;
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Eliminar?',
      text: "Confirmar acción",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.value) {
        this.loading = true;
        if (detalle.soliid == 0 && detalle.sodeid == 0) {
          detalle.acciond = 'I';
          if (detalle.acciond == "I" && id >= 0 && detalle.sodeid == 0) {
            // Eliminar registro nuevo la grilla
            this.arrdetalleInsumos.splice(id, 1);
            this.arrInsumospaginacion = this.arrdetalleInsumos.slice(0, 20);
            this.logicaVacios();
            this.loading = false;
            this.alertSwal.title = "Producto eliminado exitosamente";
            this.alertSwal.show();
          }
        }
        else {
          if (detalle.soliid > 0 && detalle.sodeid > 0) {
            this.accionsolicitud = 'M';
            await this.setCabecerainsumos();
            this.solicitudInsumo.accion = "M";
            this.solicitudInsumo.soliid = detalle.soliid
            this.solicitudInsumo.usuariomodifica = this.usuario;
            this.solicitudInsumo.usuariocreacion = null;
            this.solicitudInsumo.fechacreacion = null;
            this.solicitudInsumo.solicitudesdet[id].acciond = 'E';
            this.solicitudInsumo.solicitudesdet[id].codmei = detalle.codmei;
            this.solicitudInsumo.solicitudesdet[id].meindescri = detalle.meindescri;
            this.solicitudInsumo.solicitudesdet[id].meinid = detalle.meinid;
            this.solicitudInsumo.solicitudesdet[id].sodeid = detalle.sodeid;
            this.solicitudInsumo.solicitudesdet[id].soliid = detalle.soliid;
            this.solicitudInsumo.solicitudesdet[id].usuarioelimina = this.usuario;
            /** Luego de setear el producto a eliminar procede a grabar solicitud//@ML */
            this.guardaProdeliminado(this.solicitudInsumo);
          }
        }
      } else {
        detalle.acciond = null;
      }
    });
  }

  async modalconfirmar(mensaje: string) {
    this.alertSwal.title = null;
    this.alertSwal.text = null;
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Desea '.concat(mensaje).concat(' la Solicitud?'),
      text: "Confirmar acción",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {

      if (result.value) {
        this.loading = true;
        /**Define Solicitud antes de enviar */
        await this.setSolicitud();

        /** Modificar */
        if (this.accionsolicitud == 'M') {
          this.solicitudMedicamento.accion = 'M';
          this.solicitudInsumo.accion = "M";
          this.solicitudMedicamento.usuariomodifica = this.usuario;
          this.solicitudInsumo.usuariomodifica = this.usuario;
          if (this.numsolicitud > 0 && this.numsolins > 0) {
            this.solicitudMedicamento.soliid = this.numsolicitud;
            this.solicitudInsumo.soliid = this.numsolins;

          } else {
            this.solicitudMedicamento.soliid = this.dataPacienteSolicitud.soliid;
            this.solicitudInsumo.soliid = this.dataPacienteSolicitud.soliid;
          }
        } else {
          if (this.accionsolicitud == 'I') {
            this.solicitudMedicamento.soliid = 0; // id Medicamentos
            this.solicitudInsumo.soliid = 0; // id Insumo
            this.solicitudMedicamento.accion = 'I'; //insertar
            this.solicitudInsumo.accion = 'I';
          }
        }
        this.numsolicitud = 0;
        this.numsolins = 0;
        if (this.solicitudInsumo.solicitudesdet.length == 0 && this.solicitudMedicamento.solicitudesdet.length >= 1) {
          await this._solicitudService.crearSolicitud(this.solicitudMedicamento).subscribe(data => {
            this.alertSwal.title = "Dispensación Medicamentos exitosamente, N°: " + data.solbodid;
            this.alertSwal.text = "";
            this.alertSwal.show();
            this.solmedic = true;
            this.numsolicitud = data.solbodid;
            this.btnCrearsol = true;
            // this.medicamentosadispensar = this.arrdetalleMedicamentos;
            this.arrdetalleMedicamentos = [];
            this.arrMedicamentopaginacion = [];
            this.cargaSolicitudadispensar(data.solbodid, false);
          }, err => {
            this.loading = false;
            this.alertSwalError.title = "Error";
            this.alertSwalError.text = err.message;
            this.alertSwalError.show();
          });
        } else {
          if (this.solicitudMedicamento.solicitudesdet.length == 0 && this.solicitudInsumo.solicitudesdet.length >= 1) {

            await this._solicitudService.crearSolicitud(this.solicitudInsumo).subscribe(data => {
              this.alertSwal.title = "Dispensación Insumos exitosamente, N°: " + data.solbodid;
              this.alertSwal.text = "";
              this.alertSwal.show();
              this.solins = true;
              this.numsolins = data.solbodid;
              this.btnCrearsol = true;
              this.insumosadispensar = this.arrdetalleInsumos;
              this.arrdetalleInsumos = [];
              this.arrInsumospaginacion = [];
              this.cargaSolicitudadispensar(data.solbodid, false);
            }, err => {
              this.loading = false;
              this.alertSwalError.title = "Error";
              this.alertSwalError.text = err.message;
              this.alertSwalError.show();
            });
          } else {
            if (this.solicitudMedicamento.solicitudesdet.length >= 1 && this.solicitudInsumo.solicitudesdet.length >= 1) {
              try {
                await this.grabadobleSolInsumo();
              } catch {
                this.loading = false;
                this.alertSwalError.title = "Error al Crear Solicitud de Insumos";
                this.alertSwalError.show();
              }
            }
          }
        }
      }
    });
  }

  /** Graba y busca solicitud Insumo a dispensar */
  async grabadobleSolInsumo() {
    /** declara que es una doble solicitud */
    this.doblesolicitud = true;
    this._solicitudService.crearSolicitud(this.solicitudInsumo).subscribe(async data => {
      this.insumosadispensar = this.arrdetalleInsumos;
      this.numsolinsumo = data.solbodid;
      this.solmedic = true;
      this.numsolins = data.solbodid;
      this.btnCrearsol = true;
      this.imprimesolins = true;
      this.arrdetalleInsumos = [];
      this.arrInsumospaginacion = [];
      this.tipobusqueda = "Imprimir";
      await this._solicitudService.BuscaSolicitud(this.numsolinsumo, this.hdgcodigo, this.esacodigo, this.cmecodigo, null,
        null, null, null, null, null, this.servidor, null, 3, null, null, null, null, null,0).subscribe(
          response => {
            response.forEach(async data => {
              this.dataPacienteSolicitud = data;
              this.DispensarSolicitud(true);
            });
          });

    });
  }

  /** Graba y busca solicitud Medicamento a dispensar */
  async grabadobleSolMedicamento() {
    this._solicitudService.crearSolicitud(this.solicitudMedicamento).subscribe(async data => {
      this.medicamentosadispensar = this.arrdetalleMedicamentos;
      this.numsolmedicamento = data.solbodid;
      this.solmedic = true;
      this.numsolicitud = data.solbodid;
      this.arrdetalleMedicamentos = [];
      this.arrMedicamentopaginacion = [];
      await this._solicitudService.BuscaSolicitud(this.numsolmedicamento, this.hdgcodigo, this.esacodigo, this.cmecodigo, null,
        null, null, null, null, null, this.servidor, null, 3, null, null, null, null, null,0).subscribe(
          response => {
            response.forEach(async data => {
              this.dataPacienteSolicitud = data;
              /**se manda parametro 'false' para evitar que devuelva a funcion grabadobleSolMedicamento() */
              this.DispensarSolicitud(false);
              this.confirmadobleSolicitud();
              /**termina proceso Doble Dispensacion */
            });
          });
    });
  }


setModal(titulo: string) {

let ambito =   this.FormDatosPaciente.get("ambito").value

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
        tipo_busqueda: 'Todo-Medico',
        id_Bodega: 0,
        ambito: ambito, //this.FormDatosPaciente.value.ambito,
        nombrepaciente: this.dataPacienteSolicitud.nombrespac,
        apepaternopac: this.dataPacienteSolicitud.apepaternopac,
        apematernopac: this.dataPacienteSolicitud.apematernopac,
        codservicioactual: this.dataPacienteSolicitud.codservicioactual,
        tipodocumento: this.dataPacienteSolicitud.tipodocpac,
        numeroidentificacion: this.dataPacienteSolicitud.numdocpac,
        buscasolicitud: "Solicitud_Paciente",
        descprod: null,
        codprod: this.codprod

      }
    };
    return dtModal;
  }

  setModalBusquedaPlantilla() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Plantilla Procedimiento',
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        tipoplantilla: false
      }
    };
    return dtModal;
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
        titulo: 'Eventos Detalle Solicitud',
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        _Solicitud: this.dataPacienteSolicitud,
        _DetalleSolicitud: this.varListaDetalleDespacho,
      }
    };
    return dtModal;
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

  pageChangedmedicamento(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.arrMedicamentopaginacion = this.arrdetalleMedicamentos.slice(startItem, endItem);
  }

  pageChangedinsumo(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.arrInsumospaginacion = this.arrdetalleInsumos.slice(startItem, endItem);
  }

  onImprimir() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Solicitud ?',
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
    this.alertSwal.title = null;
    this.alertSwal.text = null;
    if (this.imprimesolins == true) {


      this._imprimesolicitudService.RPTImprimeSolicitud(this.servidor, this.hdgcodigo, this.esacodigo,
        this.cmecodigo, "pdf", this.numsolicitud, this.FormDatosPaciente.value.ambito).subscribe(
          response => {
            this.solic1 = response[0].url;
            this._imprimesolicitudService.RPTImprimeSolicitud(this.servidor, this.hdgcodigo, this.esacodigo,
              this.cmecodigo, "pdf", this.numsolins, this.FormDatosPaciente.value.ambito).subscribe(
                data => {
                  this.solic2 = data[0].url;
                  var i = 0;
                  while (i < 2) {

                    if (i == 0) {

                      window.open(this.solic1, "", "", true);

                    } else
                      if (i == 1) {

                        window.open(this.solic2, "", "", true);

                      }
                    i++;
                  }
                },
                error => {
                  this.alertSwalError.title = "Error al Imprimir Solicitud";
                  this.alertSwalError.show();
                  this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
                  })
                }
              );
          });
    } else {
      this._imprimesolicitudService.RPTImprimeSolicitud(this.servidor, this.hdgcodigo, this.esacodigo,
        this.cmecodigo, "pdf", this.dataPacienteSolicitud.soliid, this.dataPacienteSolicitud.codambito).subscribe(
          response => {
            window.open(response[0].url, "", "", true);
          },
          error => {
            this.alertSwalError.title = "Error al Imprimir Solicitud";
            this.alertSwalError.show();
            this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
            })
          }
        );
    }
  }

  /**funcion revisa si existen codmei duplicados@MLobos */
  async checkDuplicados(esgrabar: boolean) {
    let arrProductos: Array<DetalleSolicitud> = [];
    // une ambas grillas
    arrProductos = this.arrdetalleMedicamentos.concat(this.arrdetalleInsumos);
    // si existen datos
    if (arrProductos.length) {
      // define var locales
      let esDuplicado: boolean;
      let codprod = null;
      var arrValue = arrProductos.map(x => x.codmei);
      arrValue.some((item, idx) => {
        codprod = item;
        return esDuplicado = arrValue.indexOf(item) != idx;
      });
      //si existen devuelve mensaje de alerta //
      if (esDuplicado === true) {
        this.alertSwalAlert.title = `Existen codigo(s) duplicado(s)`;
        this.alertSwalAlert.show().then(ok => {
          if (ok.value) {
            //var esgrabar define si se desea Grabar o Modificar
            if (esgrabar === true) {
              this.onGrabar();
            } else {
              this.onModificar();
            }
          }
        });
      } else {
        if (esgrabar === true) {
          this.onGrabar();
        } else {
          this.onModificar();
        }
      }
    }
  }

  /** Metodo que carga la grilla guardada con lote a la solicitud ya creada ..
   * guardada en el objeto dataPacienteSolicitud 
   * @MLobos*/
  async asignalotegrilla() {
    for(let datosol of this.dataPacienteSolicitud.solicitudesdet) {
      if (datosol.tiporegmein === "I") {
        this.esmedicamento = false;
        this.dataPacienteSolicitud.solicitudesdet = this.insumosadispensar;
        return;
      }else if (datosol.tiporegmein === "M") {
        this.esmedicamento = true;
        this.dataPacienteSolicitud.solicitudesdet = this.medicamentosadispensar;
        return;
      }
    }
  }

  async DispensarSolicitud(doblesol: boolean) {
    await this.asignalotegrilla();
    const productos = this.dataPacienteSolicitud.solicitudesdet;
    this.paramdespachos = [];
    var fechavto = null;
    if (productos !== undefined || !productos.length) {
      productos.forEach(element => {
        var producto = new DespachoDetalleSolicitud;
        if(this.esmedicamento) {
          producto.soliid = this.numsolmedicamento;
        }else {
          producto.soliid = this.numsolinsumo;
        }
        console.log('solid: ', producto.soliid);
        producto.hdgcodigo = this.hdgcodigo;
        producto.esacodigo = this.esacodigo;
        producto.cmecodigo = this.cmecodigo;
        producto.sodeid = element.sodeid;
        producto.codmei = element.codmei;
        producto.meinid = element.meinid;
        producto.cantsoli = element.cantsoli;
        producto.cantadespachar = element.cantsoli;
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
        producto.lote = element.lote;
        fechavto = this.datePipe.transform(element.fechavto, 'yyyy-MM-dd');
        producto.fechavto = fechavto;
        producto.bodorigen = this.dataPacienteSolicitud.bodorigen;
        producto.boddestino = this.dataPacienteSolicitud.boddestino;
        producto.codservicioori = this.dataPacienteSolicitud.codservicioori;
        producto.codservicioactual = this.dataPacienteSolicitud.codservicioactual;

        this.paramdespachos.unshift(producto);
      });

      /**Graba dispensacion */
      await this.dispensasolicitudService.GrabaDispensacion(this.paramdespachos).subscribe(async response => {
        if (!this.doblesolicitud) {
          /**carga solicitud NO doble dispensada */
          this.cargaSolicitud(this.dataPacienteSolicitud.soliid);
        }
        else {
          /** Carga detalle solicitud doble Dispensada  */
          // await this.cargaSoldobledispensada(doblesol);
          await this._solicitudService.BuscaSolicitud(this.dataPacienteSolicitud.soliid, this.hdgcodigo, this.esacodigo, this.cmecodigo, null,
            null, null, null, null, null, this.servidor, null, 3, null, null, null, null, null,0).subscribe(
              async response => {
                this.btnCrearsol = false;
                response.forEach(async data => {
                  this.dataPacienteSolicitud = data;
                  await this.asignalotegrilla();
                });
                this.dataPacienteSolicitud.solicitudesdet.forEach(element => {
                  if (element.tiporegmein == "I") {
                  
                    this.solins = true;
                    this.arrdetalleInsumos = this.dataPacienteSolicitud.solicitudesdet
                    this.arrInsumospaginacion = this.arrdetalleInsumos.slice(0, 20);
                    this.loading = false;
                  } else {
                    if (element.tiporegmein == "M") {
                      this.solmedic = true;
                      this.arrdetalleMedicamentos = this.dataPacienteSolicitud.solicitudesdet;
                      this.arrMedicamentopaginacion = this.arrdetalleMedicamentos.slice(0, 20)
                      this.loading = false;
                    }
                  }
                });
                /** Tras dispensar, Si doblesolicitud=true y doblesol=true, genera una solicitud Medicamento // */
                if (doblesol) {
                  this.grabadobleSolMedicamento();
                }
              });
        }
      });
    }
  }

  async cargaSoldobledispensada(doblesol: boolean) {
    await this._solicitudService.BuscaSolicitud(this.dataPacienteSolicitud.soliid, this.hdgcodigo, this.esacodigo, this.cmecodigo, null,
      null, null, null, null, null, this.servidor, null, 3, null, null, null, null, null,0).subscribe(
        async response => {
          this.btnCrearsol = false;
          response.forEach(async data => {
            this.dataPacienteSolicitud = data;
            await this.asignalotegrilla();
          });
          this.dataPacienteSolicitud.solicitudesdet.forEach(element => {
            if (element.tiporegmein == "I") {
              this.solins = true;
              this.arrdetalleInsumos = this.dataPacienteSolicitud.solicitudesdet
              this.arrInsumospaginacion = this.arrdetalleInsumos.slice(0, 20);
              this.loading = false;
            } else {
              if (element.tiporegmein == "M") {
                this.solmedic = true;
                this.arrdetalleMedicamentos = this.dataPacienteSolicitud.solicitudesdet;
                this.arrMedicamentopaginacion = this.arrdetalleMedicamentos.slice(0, 20)
                this.loading = false;
              }
            }
          });
          /** Tras dispensar, Si doblesolicitud=true y doblesol=true, genera una solicitud Medicamento // */
          if (doblesol) {
            this.grabadobleSolMedicamento();
          }
        });
  }

  grabaSolmedicamento() {
    this._solicitudService.crearSolicitud(this.solicitudMedicamento).subscribe(async data => {
      this.numsolmedicamento = data.solbodid;
      this.solins = true;
      this.numsolicitud = data.solbodid;
      await this.cargaDoblesolicitud(this.numsolmedicamento);
      await this.confirmadobleSolicitud();

    });
    return;
  }

  confirmadobleSolicitud() {
    this.alertSwal.title = null;
    this.alertSwal.text = null;
    this.imprimesolins = true;
    this.FormDatosPaciente.get('numsolicitud').setValue(this.numsolmedicamento + " " + this.numsolinsumo);
    this.alertSwal.title = "Solicitudes Dispensadas Exitosas";
    this.alertSwal.text = "Solicitud de Medicamentos, N°: " + this.numsolmedicamento +
      ".   Solicitud Insumos, N°: " + this.numsolinsumo;
    this.alertSwal.show();
    this.loading = false;
  }

  getProducto() {
    this.codprod = this.FormDatosProducto.controls.codigo.value;

    if (this.codprod === null || this.codprod === '') {
      this.onBuscarProducto();
    } else {
      var tipodeproducto = 'MIM';
      this.loading = true;
      var controlado = '';
      var controlminimo = '';
      var idBodega = 0;
      var consignacion = '';

      this._BusquedaproductosService.BuscarArituculosFiltros(this.hdgcodigo, this.esacodigo,
        this.cmecodigo, this.codprod, null, null, null, null, tipodeproducto, idBodega, controlminimo, controlado, consignacion
        , this.usuario, this.servidor).subscribe(
          response => {
            if (response.length == 0) {

              this.loading = false;
              this.onBuscarProducto();
            }
            else {
              if (response.length > 0) {
                this.loading = false;
                this.setProducto(response[0]);
                this.FormDatosProducto.reset();
                this.logicaVacios()
              }
            }
          }, error => {
            this.loading = false;
            console.log('error');
          }
        );
    }
  }

  /**asigna fecha vencimiento a producto segun seleccion lote en grilla  */
  /** 1= Medicamentos; 2= Insumos */
  setLote(value: string, indx: number, tipo: number) {
    const fechalote = value.split('/');
    const fechav = fechalote[0];
    const loteprod = fechalote[1];
    if(tipo === 1) {
      this.arrdetalleMedicamentos[indx].fechavto = fechav;
      this.arrdetalleMedicamentos[indx].lote = loteprod;
    }else if(tipo === 2) {
      this.arrdetalleInsumos[indx].fechavto = fechav;
      this.arrdetalleInsumos[indx].lote = loteprod;
    }
  }
  
  validaCodigo(valorCodigo:any){
    this.alertSwal.title = null;
    this.alertSwal.text = null;

    const resultado_medicamnto = this.arrdetalleMedicamentos.find( registro => registro.codmei === valorCodigo );
    if  ( resultado_medicamnto != undefined )
    {
      this.alertSwalError.title = "Código de artículo repetido";
      this.alertSwalError.show();
      this.FormDatosProducto.get("codigo").setValue("");
      return
    }

    
    const resultado_insumo = this.grillaInsumos.find( registro => registro.codmei === valorCodigo );
    if  ( resultado_insumo != undefined )
    {
      this.alertSwalError.title = "Código de artículo repetido";
      this.alertSwalError.show();
      this.FormDatosProducto.get("codigo").setValue("");
      return
    }

  
  }

  validaDodificagrillaMedicamentos(id:number, detalle:any){
    this.alertSwal.title = null;
    this.alertSwal.text = null;
    if ( this.arrdetalleMedicamentos[id].cantsoli <= 0) { 
    this.alertSwalError.title = "Cantidad debe ser mayor a cero";
      this.alertSwalError.show();
      this.FormDatosProducto.get("cantidad").setValue(1);
      return
    }
  }
  

  validaCantidadDispensada(cantidad:any){

    this.alertSwal.title = null;
    this.alertSwal.text = null;
    if  ( cantidad <= 0 )
    {
      this.alertSwalError.title = "Cantidad debe ser mayor a cero";
      this.alertSwalError.show();
      this.FormDatosProducto.get("cantidad").setValue(1);
      return
    }


  }




validacantidadgrillaInsumos(id: number) {

    this.alertSwalError.title = null;
    this.alertSwalAlert.text = null;
    var idg = id;

          if (this.arrdetalleInsumos[idg].cantsoli <= 0) {// || cantidad >0){

            this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
            this.alertSwalAlert.show();
            this.arrdetalleInsumos[idg].cantsoli = 1;
            this.arrdetalleInsumos[idg].cantadespachar = this.arrdetalleInsumos[idg].cantsoli ;
    }
}


ActivaBotonDispensar()
{
  // Se activa con las siguientes condiciones
  // Solicitud sin numero, Paciente identificado, grrilla de medicamneto o grilla de insumos con datos
  //  Si no existe un antidad en cero
  

if ( (this.FormDatosPaciente.get('numsolicitud').value == null || this.FormDatosPaciente.get('numsolicitud').value == 0)
      && this.FormDatosPaciente.get('nombrepaciente').value != null
      && this.FormDatosPaciente.get('estado').value != null
      && this.FormDatosPaciente.get('ambito').value != null
      && (this.arrdetalleInsumos.length >0 || this.arrdetalleMedicamentos.length >0)
   ) {
           return true

     } else {
           return false
     }
}


    ActivaBotonModificar()
    {
    
      return false
    
    if ( (this.FormDatosPaciente.get('numsolicitud').value != null && this.FormDatosPaciente.get('numsolicitud').value != 0)
          && this.FormDatosPaciente.get('nombrepaciente').value != null
          && this.FormDatosPaciente.get('estado').value != null
          && this.FormDatosPaciente.get('ambito').value != null
          && (this.arrdetalleInsumos.length >0 || this.arrdetalleMedicamentos.length >0)
       ) {
               return true
    
         } else {
               return false
         }
        }

     ActivaBotoneliminar()
     {
       return false
     }   


     ActivaBotonAgregarProducto()
     {
      if ( (this.FormDatosPaciente.get('numsolicitud').value == null || this.FormDatosPaciente.get('numsolicitud').value == 0)
          && this.FormDatosPaciente.get('nombrepaciente').value != null
          && this.FormDatosPaciente.get('estado').value != null
          && this.FormDatosPaciente.get('ambito').value != null
         ) {
           return true

     } else {
           return false
     }
     }   

     ActivaBotonAgregarPlantilla()
     {
      if ( (this.FormDatosPaciente.get('numsolicitud').value == null || this.FormDatosPaciente.get('numsolicitud').value == 0)
          && this.FormDatosPaciente.get('nombrepaciente').value != null
          && this.FormDatosPaciente.get('estado').value != null
          && this.FormDatosPaciente.get('ambito').value != null
         ) {
           return true

     } else {
           return false
     }
     }   




  }