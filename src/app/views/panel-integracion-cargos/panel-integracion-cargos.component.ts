import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { environment } from 'src/environments/environment';

import { DatePipe } from '@angular/common';

import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap';

import { Receta } from 'src/app/models/entity/receta';
import { MovimientoInterfaz } from 'src/app/models/entity/movimiento-interfaz';
import { InterfacesService } from 'src/app/servicios/interfaces.service';
import { EstadosTraspasosFin700 } from 'src/app/models/entity/EstadosTraspasosFin700';
import { MovimientoInterfazBodegas } from 'src/app/models/entity/movimiento-interfaz-bodegas';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { element } from 'protractor';
import { BodegasTodas } from 'src/app/models/entity/BodegasTodas';
import { Servicio } from 'src/app/models/entity/Servicio';
import { EstructuraunidadesService } from 'src/app/servicios/estructuraunidades.service';



@Component({
  selector: 'app-panel-integracion-cargos',
  templateUrl: './panel-integracion-cargos.component.html',
  styleUrls: ['./panel-integracion-cargos.component.css']
})
export class PanelIntegracionCargosComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public locale = 'es';
  public bsConfig: Partial<BsDatepickerConfig>;
  public colorTheme = 'theme-blue';

  public hdgcodigo: number;
  public esacodigo: number;
  public cmecodigo: number;
  public loading = false;
  public lForm: FormGroup;
  public FormEstadoMovBod: FormGroup;
  public FormFiltroHos: FormGroup;
  public FormFiltroUrg: FormGroup;
  public servidor = environment.URLServiciosRest.ambiente;
  public usuario = environment.privilegios.usuario;
  public estadostraspasos: Array<EstadosTraspasosFin700> = [];

  public listahospitalizados: Array<MovimientoInterfaz> = [];
  public listahospitalizadosPaginacion: Array<MovimientoInterfaz> = [];
  public listahospitalizados2: Array<MovimientoInterfaz> = [];
  public listahospitalizadosPaginacion_aux: Array<MovimientoInterfaz> = [];
  public listahospitalizados_aux: Array<MovimientoInterfaz> = [];

  public listaambulatorio: Array<MovimientoInterfaz> = [];
  public listaambulatorioPaginacion: Array<MovimientoInterfaz> = [];

  public listaurgencia: Array<MovimientoInterfaz> = [];
  public listaurgenciaPaginacion: Array<MovimientoInterfaz> = [];
  public listaurgencia2: Array<MovimientoInterfaz> = [];
  public listaurgenciaPaginacion_aux: Array<MovimientoInterfaz> = [];
  public listaurgencia_aux: Array<MovimientoInterfaz> = [];

  public _PageChangedEvent: PageChangedEvent;


  public canidad_movimiento_hospitalizados: number;
  public canidad_movimiento_ambulatorio: number;
  public canidad_movimiento_urgencia: number;

  public opcion_hospitalizado: boolean;
  public opcion_ambulatorio: boolean;
  public opcion_urgencia: boolean;

  //public tiempo_refresco = interval(120000);

  public _MovimientoInterfaz: MovimientoInterfaz;
  public optHos = "ASC";
  public optUrg = "ASC";
  public bodegasSolicitantes    : Array<BodegasTodas> = [];
  public servicios              : Array<Servicio> = [];

  constructor(
    private _interfacesService       : InterfacesService,
    public datePipe                  : DatePipe,
    public localeService             : BsLocaleService,
    public formBuilder               : FormBuilder,
    public estructuraunidadesService : EstructuraunidadesService,
    ){
      this.lForm = this.formBuilder.group({
        fechadesde: [new Date(), Validators.required],
        fechahasta: [new Date(), Validators.required],
        cuenta: [{ value: null, disabled: false }, Validators.required],
      });

      this.FormEstadoMovBod = this.formBuilder.group({
        estado    : [{ value: null, disabled: false }, Validators.required],
        tipomovim : [{ value: null, disabled: false }, Validators.required]
      });

      this.FormFiltroHos = this.formBuilder.group({
        id             : [{ value: null, disabled: false }, Validators.required],
        soliid         : [{ value: null, disabled: false }, Validators.required],
        fecha          : [{ value: null, disabled: false }, Validators.required],
        tipomovimiento : [{ value: null, disabled: false }, Validators.required],
        receta         : [{ value: null, disabled: false }, Validators.required],
        cuenta         : [{ value: null, disabled: false }, Validators.required],
        rut            : [{ value: null, disabled: false }, Validators.required],
        paciente       : [{ value: null, disabled: false }, Validators.required],
        servicio       : [{ value: null, disabled: false }, Validators.required],
        estado         : [{ value: null, disabled: false }, Validators.required],
      });
    }


    ngOnInit() {

      this.setDate();

      this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
      this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
      this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
      this.usuario = sessionStorage.getItem('Usuario').toString();

      this.canidad_movimiento_hospitalizados = 0;
      this.canidad_movimiento_ambulatorio = 0;
      this.canidad_movimiento_urgencia = 0;

      this.opcion_hospitalizado = false;
      this.opcion_ambulatorio = false;
      this.opcion_urgencia = false;

      this.BuscarMovimientoInterfazCargos();
      this.BuscaEstadosTraspasos();
      this.cargarCombos();
    }
    setDate() {
      defineLocale(this.locale, esLocale);
      this.localeService.use(this.locale);
      this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
    }

    cargarCombos(){
      this.estructuraunidadesService.BuscarServicios(this.hdgcodigo,this.esacodigo,this.cmecodigo,this.usuario,this.servidor,3,'').subscribe(
        response => {
          if (response != null) {
            this.servicios = response;
          }
        },
      error => {
        alert("Error al Buscar Bodegas de cargo");
      });
    }
  BuscarMovimientoInterfazCargos() {

    this.listaambulatorio = [];
    this.listaambulatorioPaginacion = [];
    this.canidad_movimiento_ambulatorio = 0;
    this.listaurgencia = [];
    this.listaurgenciaPaginacion = [];
    this.listaurgencia_aux = [];
    this.listaurgenciaPaginacion_aux = [];
    this.canidad_movimiento_urgencia = 0;
    this.listahospitalizados = [];
    this.listahospitalizadosPaginacion = [];
    this.listahospitalizados_aux = [];
    this.listahospitalizadosPaginacion_aux = [];
    this.canidad_movimiento_hospitalizados =0;

    if (this.lForm.value.numerosolicitud != null && this.lForm.value.numerosolicitud  >0 ) {
      var fechadesde = '';
      var fechahasta = '';
    } else {
      var fechadesde = this.datePipe.transform(this.lForm.value.fechadesde, 'yyyy-MM-dd');
      var fechahasta = this.datePipe.transform(this.lForm.value.fechahasta, 'yyyy-MM-dd');

    }
    this.loading = true;
    this._MovimientoInterfaz = new(MovimientoInterfaz)
    this._MovimientoInterfaz.hdgcodigo =  Number(sessionStorage.getItem('hdgcodigo').toString())
    this._MovimientoInterfaz.esacodigo = Number(sessionStorage.getItem('cmecodigo').toString())
    this._MovimientoInterfaz.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString())
    this._MovimientoInterfaz.fechainicio = fechadesde
    this._MovimientoInterfaz.fechatermino = fechahasta
    this._MovimientoInterfaz.servidor     = this.servidor
    this._MovimientoInterfaz.ctanumcuenta = this.lForm.value.cuenta
    this._interfacesService.listamovimientointerfazcargo(this._MovimientoInterfaz).subscribe(
      response => {
        if (response != null) {
          if (response.length != 0) {
            this.listahospitalizados = [];
            this.listahospitalizadosPaginacion = [];
            this.listahospitalizados_aux = [];
            this.listahospitalizadosPaginacion_aux = [];
            this.listaambulatorioPaginacion = [];
            this.listaambulatorio  = [];
            this.listaambulatorioPaginacion  = [];
            this.canidad_movimiento_ambulatorio = 0;
            this.listaurgencia =  [];
            this.listaurgenciaPaginacion =  [];
            this.listaurgencia_aux = [];
            this.listaurgenciaPaginacion_aux = [];
            this.canidad_movimiento_urgencia = 0;

            response.forEach(element => {
              switch (element.codambito) {
                case 1: {
                  this.listaambulatorio.unshift(element);
                    break;
                  }
                  case 2: {
                    this.listaurgencia.unshift(element);
                    break;
                  }
                  case 3: {
                    this.listahospitalizados.unshift(element);
                    break;
                  }
                  default: {
                    this.listaambulatorio.unshift(element);
                    break;
                  }
                }
              }
            )
          }

          this.listaambulatorioPaginacion = this.listaambulatorio.slice(0, 10);
          this.canidad_movimiento_ambulatorio = this.listaambulatorio.length;

          this.listaurgencia_aux = this.listaurgencia;
          this.listaurgenciaPaginacion_aux = this.listaurgencia_aux.slice(0,20);
          this.listaurgenciaPaginacion = this.listaurgencia.slice(0, 10);

          this.listahospitalizados_aux = this.listahospitalizados;
          this.listahospitalizadosPaginacion_aux = this.listahospitalizados_aux.slice(0,20);
          this.canidad_movimiento_urgencia = this.listaurgencia.length;

          this.listahospitalizadosPaginacion = this.listahospitalizados;//.slice(0, 10);
          this.canidad_movimiento_hospitalizados = this.listahospitalizados.length;
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    this.loading = false
  }

  refrescar() {
    this.BuscarMovimientoInterfazCargos()
  }

  eleccionopcion(opcion: string) {
    switch (opcion) {
      case 'HOSPITALIZADOS': {
        this.opcion_hospitalizado = true;
        this.opcion_ambulatorio = false;
        this.opcion_urgencia = false;
        break;
      }
      case 'AMBULATORIOS': {
        this.opcion_hospitalizado = false;
        this.opcion_ambulatorio = true;
        this.opcion_urgencia = false;

        break;
      }
      case 'URGENCIAS': {
        this.opcion_hospitalizado = false;
        this.opcion_ambulatorio = false;
        this.opcion_urgencia = true;

        break;
      }

      default: {
        this.opcion_hospitalizado = false;
        this.opcion_ambulatorio = false;
        this.opcion_urgencia = false;
        break;
      }
    }
  }




  Enviar(registro: MovimientoInterfaz) {

    registro.usuario = sessionStorage.getItem('Usuario').toString();
    registro.servidor = this.servidor;
    this.alertSwalAlert.title = null;

   // hdgcodigo int, idMovimiento int, idDetalleMovimiento int, servidor string, IDDevolucion int

    this._interfacesService.enviacargossisalud(registro.esacodigo, registro.hdgcodigo,
      registro.movid,registro.detid,registro.devid,registro.servidor).subscribe(
      response => {
        if (response != null) {
          this.alertSwal.title = "Resultado envío de cargo:".concat(response[0].intcargoerror);
          this.alertSwal.show();

          this._interfacesService.listamovimientointerfaz(this._MovimientoInterfaz).subscribe(
            response => { });
          }
      });
      this.refrescar();
    }


  pageChangedCargosHospitalizados(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listahospitalizadosPaginacion = this.listahospitalizados;//.slice(startItem, endItem);
  }

  paginacionAmbulatorio(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listaambulatorioPaginacion = this.listaambulatorio.slice(startItem, endItem);
  }

  pageChangedCargosUrgencia(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listaurgenciaPaginacion = this.listaurgencia.slice(startItem, endItem);
  }


  activaEnviar(registro: MovimientoInterfaz){
    if (registro.intcargoestado.trim() != "TRASPASADO") {
         return(true);
    } else {
      return(false);
    }

  }

  SeleccionaEstadoMovHospitalizado(value: string){
    this.listahospitalizados2 = [];
    var codigo : string ;
    var descripcion : string;
    if(value === '1'){
      this.listahospitalizados = this.listahospitalizados_aux;
      this.listahospitalizadosPaginacion = this.listahospitalizados;//.slice(0,20);
    }else{
      this.estadostraspasos.forEach(estado=>{
        if(Number(value)=== estado.codigo){
          descripcion = estado.descripcion;
          return;
        }
      })

      this.listahospitalizados_aux.forEach(x=>{
        var temporal = new MovimientoInterfaz
        if(x.intcargoestado ===descripcion){
          temporal = x;

          this.listahospitalizados2.unshift(temporal);
        }
      });
      this.listahospitalizados = [];
      this.listahospitalizadosPaginacion = [];
      this.listahospitalizados = this.listahospitalizados2;
      this.listahospitalizadosPaginacion = this.listahospitalizados;//.slice(0,20);
    }
  }

  SeleccionaEstadoMovUrgencia(value: string){
    this.listaurgencia2 = [];
    var codigo : string ;
    var descripcion : string;
    if(value === '1'){
      this.listaurgencia = this.listaurgencia_aux;
      this.listaurgenciaPaginacion = this.listaurgencia.slice(0,20);
    }else{
      this.estadostraspasos.forEach(estado=>{
        if(Number(value)=== estado.codigo){
          descripcion = estado.descripcion;
          return;
        }
      });

      this.listaurgencia_aux.forEach(x=>{
        var temporal = new MovimientoInterfaz
        if(x.intcargoestado ===descripcion){
          temporal = x;
          this.listaurgencia2.unshift(temporal);
        }
      });
      this.listaurgencia = [];
      this.listaurgenciaPaginacion = [];
      this.listaurgencia = this.listaurgencia2;
      this.listaurgenciaPaginacion = this.listaurgencia.slice(0,20);
    }

  }

  BuscaEstadosTraspasos() {
    this._interfacesService.EstadosTraspasosFin700(this.usuario, this.servidor).subscribe(
      response => {
        if (response != null) {
          this.estadostraspasos = response;
        }
      },
      error => {
        alert("Error al Buscar Estados");
      }
    );
  }

  limpiarFiltros(){
    this.FormFiltroHos.reset();
    if(this.listahospitalizados != null){
      this.filtroHos();
    }
  }

  sortbyHos(opt: string){
    var rtn1 : number;
    var rtn2 : number;
    if(this.optHos === "ASC"){
      rtn1 = 1;
      rtn2 = -1;
      this.optHos = "DESC"
    } else {
      rtn1 = -1;
      rtn2 = 1;
      this.optHos = "ASC"
    }

    switch (opt) {
      case 'id':
        this.listahospitalizadosPaginacion.sort(function (a, b) {
          if (a.fdeid > b.fdeid) {
            return rtn1;
          }
          if (a.fdeid < b.fdeid) {
            return rtn2;
          }
          // a must be equal to b
          return 0;
        });
        break;
      case 'soliid':
        this.listahospitalizadosPaginacion.sort(function (a, b) {
          if (a.soliid > b.soliid) {
            return rtn1;
          }
          if (a.soliid < b.soliid) {
            return rtn2;
          }
          // a must be equal to b
          return 0;
        });
        break;
      case 'fecha':
        this.listahospitalizadosPaginacion.sort(function (a, b) {
          if (a.fecha > b.fecha) {
            return rtn1;
          }
          if (a.fecha < b.fecha) {
            return rtn2;
          }
          // a must be equal to b
          return 0;
        });
        break;
        case 'tipomovimiento':
          this.listahospitalizadosPaginacion.sort(function (a, b) {
            if (a.tipomovimiento > b.tipomovimiento) {
              return rtn1;
            }
            if (a.tipomovimiento < b.tipomovimiento) {
              return rtn2;
            }
            // a must be equal to b
            return 0;
          });
          break;
      case 'numeroreceta':
        this.listahospitalizadosPaginacion.sort(function (a, b) {
          if (a.numeroreceta > b.numeroreceta) {
            return rtn1;
          }
          if (a.numeroreceta < b.numeroreceta) {
            return rtn2;
          }
          // a must be equal to b
          return 0;
        });
        break;
      case 'ctanumcuenta':
        this.listahospitalizadosPaginacion.sort(function (a, b) {
          if (a.ctanumcuenta > b.ctanumcuenta) {
            return rtn1;
          }
          if (a.ctanumcuenta < b.ctanumcuenta) {
            return rtn2;
          }
          // a must be equal to b
          return 0;
        });
        break;
      case 'identificacion':
        this.listahospitalizadosPaginacion.sort(function (a, b) {
          if (a.identificacion > b.identificacion) {
            return rtn1;
          }
          if (a.identificacion < b.identificacion) {
            return rtn2;
          }
          // a must be equal to b
          return 0;
        });
        break;
      case 'paciente':
        this.listahospitalizadosPaginacion.sort(function (a, b) {
          if (a.paciente > b.paciente) {
            return rtn1;
          }
          if (a.paciente < b.paciente) {
            return rtn2;
          }
          // a must be equal to b
          return 0;
        });
        break;
      case 'servicio':
        this.listahospitalizadosPaginacion.sort(function (a, b) {
          if (a.servicio > b.servicio) {
            return rtn1;
          }
          if (a.servicio < b.servicio) {
            return rtn2;
          }
          // a must be equal to b
          return 0;
        });
        break;
      case 'interpestado':
        this.listahospitalizadosPaginacion.sort(function (a, b) {
          if (a.interpestado > b.interpestado) {
            return rtn1;
          }
          if (a.interpestado < b.interpestado) {
            return rtn2;
          }
          // a must be equal to b
          return 0;
        });
        break;
      case 'mfdereferenciacontable':
        this.listahospitalizadosPaginacion.sort(function (a, b) {
          if (a.mfdereferenciacontable > b.mfdereferenciacontable) {
            return rtn1;
          }
          if (a.mfdereferenciacontable < b.mfdereferenciacontable) {
            return rtn2;
          }
          // a must be equal to b
          return 0;
        });
        break;
      case 'intcargoerror':
        this.listahospitalizadosPaginacion.sort(function (a, b) {
          if (a.intcargoerror > b.intcargoerror) {
            return rtn1;
          }
          if (a.intcargoerror < b.intcargoerror) {
            return rtn2;
          }
          // a must be equal to b
          return 0;
        });
        break;
      case 'intcargoestado':
        this.listahospitalizadosPaginacion.sort(function (a, b) {
          if (a.intcargoestado > b.intcargoestado) {
            return rtn1;
          }
          if (a.intcargoestado < b.intcargoestado) {
            return rtn2;
          }
          // a must be equal to b
          return 0;
        });
        break;
      default:
        break;
    }
  }

  filtroHos(){
    this.listahospitalizadosPaginacion = [];
    this.listahospitalizadosPaginacion = this.listahospitalizados_aux;
    var valida : boolean = false;
    var id         : number = this.FormFiltroHos.controls.id.value;
    var soliid     : number = this.FormFiltroHos.controls.soliid.value;
    var fecha      : string = this.FormFiltroHos.controls.fecha.value;
    var receta     : number = this.FormFiltroHos.controls.receta.value;
    var cuenta     : number = this.FormFiltroHos.controls.cuenta.value;
    var rut        : string = this.FormFiltroHos.controls.rut.value;
    var paciente   : string = this.FormFiltroHos.controls.paciente.value;
    var servicio   : string = this.FormFiltroHos.controls.servicio.value;
    var estado     : string = this.FormFiltroHos.controls.estado.value;
      // var referencia : number = this.FormFiltroHos.controls.referencia.value;

    var listahospitalizadosFiltro : Array<MovimientoInterfaz> = this.listahospitalizados;
    var listaFiltro : Array<MovimientoInterfaz> = [];

    if(id != null){
      listaFiltro = [];
      valida = true;
      listahospitalizadosFiltro.forEach((element, index) => {
        if(element.fdeid === id){
          listaFiltro.unshift(element);
        }
      });
      listahospitalizadosFiltro = listaFiltro;
    }

    if(soliid != null){
      listaFiltro = [];
      valida = true;
      listahospitalizadosFiltro.forEach((element, index) => {
        if(element.soliid === soliid){
          listaFiltro.unshift(element);
        }
      });
      listahospitalizadosFiltro = listaFiltro;
    }

    if(fecha != null){
      listaFiltro = [];
      valida = true;
      listahospitalizadosFiltro.forEach((element, index) => {
        if(element.fecha.slice(0,-9) === this.datePipe.transform(fecha, 'dd-MM-yyyy')){
          listaFiltro.unshift(element);
        }
      });
      listahospitalizadosFiltro = listaFiltro;
    }

    if(receta != null){
      console.log(receta);
      listaFiltro = [];
      valida = true;
      listahospitalizadosFiltro.forEach((element, index) => {
        if(element.numeroreceta === receta){
          listaFiltro.unshift(element);
        }
      });
      listahospitalizadosFiltro = listaFiltro;
    }

    if(cuenta != null){
      console.log(cuenta);
      listaFiltro = [];
      valida = true;
      listahospitalizadosFiltro.forEach((element, index) => {
        if(element.ctanumcuenta === cuenta){
          listaFiltro.unshift(element);
        }
      });
      listahospitalizadosFiltro = listaFiltro;
    }

    if(rut != "" && rut != null){
      listaFiltro = [];
      valida = true;
      listahospitalizadosFiltro.forEach((element, index) => {
        if(element.identificacion.trim() === rut.trim()){
          listaFiltro.unshift(element);
        }
      });
      listahospitalizadosFiltro = listaFiltro;
    }

    if(paciente != null){
      listaFiltro = [];
      valida = true;
      listahospitalizadosFiltro.forEach((element, index) => {
        let posicion = element.paciente.indexOf(paciente.toUpperCase());
        if (posicion !== -1){
          listaFiltro.unshift(element);
        }
      });
      listahospitalizadosFiltro = listaFiltro;
    }

    if(servicio != "" && servicio != " " && servicio != null){
      listaFiltro = [];
      valida = true;
      listahospitalizadosFiltro.forEach((element, index) => {
        if(element.servicio === servicio){
          listaFiltro.unshift(element);
        }
      });
      listahospitalizadosFiltro = listaFiltro;
    }

    if(estado != "" && estado != " " && estado != null){
      listaFiltro = [];
      valida = true;
      listahospitalizadosFiltro.forEach((element, index) => {
        if(element.interpestado === estado){
          listaFiltro.unshift(element);
        }
      });
      listahospitalizadosFiltro = listaFiltro;
    }

    // if(referencia != null){
    //   listaFiltro = [];
    //   valida = true;
    //   listahospitalizadosFiltro.forEach((element, index) => {
    //     if(element.mfdereferenciacontable === referencia){
    //       listaFiltro.unshift(element);
    //     }
    //   });
    //   listahospitalizadosFiltro = listaFiltro;
    // }

    if (valida) {
      this.listahospitalizadosPaginacion = listaFiltro;//.slice(0,20);
    } else {
      this.listahospitalizadosPaginacion = this.listahospitalizados;//.slice(0,20);
    }
  }
}
