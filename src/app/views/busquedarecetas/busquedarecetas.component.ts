import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DatePipe } from '@angular/common';
import { PageChangedEvent } from 'ngx-bootstrap';
import { environment } from '../../../environments/environment';
import { Receta } from 'src/app/models/entity/receta';
import { TipoDocumentoIdentificacion } from '../../models/entity/TipoDocumentoIdentificacion';
import { Camas } from '../../models/entity/Camas';
import { Piezas } from '../../models/entity/Piezas';
import { Unidades } from '../../models/entity/Unidades';
import { Servicio } from 'src/app/models/entity/Servicio';
import { TipodocumentoidentService } from '../../servicios/tipodocumentoident.service';
import { EstructuraunidadesService } from '../../servicios/estructuraunidades.service';
import { SolicitudService } from '../../servicios/Solicitudes.service';

import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';

@Component({
  selector: 'app-busquedarecetas',
  templateUrl: './busquedarecetas.component.html',
  styleUrls: ['./busquedarecetas.component.css']
})
export class BusquedarecetasComponent implements OnInit {
  @Input() hdgcodigo: number;
  @Input() esacodigo: number;
  @Input() cmecodigo: number;
  @Input() titulo   : string;
  @Input() pagina   : string;
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  @ViewChild('alertSwalConfirmar', { static: false }) alertSwalConfirmar: SwalComponent;
  public FormBuscaRecetasAmbulatorias: FormGroup;
  public FormBuscaRecetasUrgencia: FormGroup;
  public FormBuscaRecetasHospitalizadas: FormGroup;
  public _Receta            : Receta;
  public servidor           = environment.URLServiciosRest.ambiente;
  public usuario            = environment.privilegios.usuario;
  public onClose: Subject<Receta>;

  public loading = false;
  public ambito             : boolean = false;
  public recetademonitor    : boolean = false;
  public arreglotipodocumentoidentificacion: Array<TipoDocumentoIdentificacion> =[];
  public listarecetasambulatorias: Array<Receta> = [];
  public listarecetasambulatoriasPaginacion: Array<Receta> = [];

  public listarecetashospitalizados: Array<Receta> = [];
  public listarecetashospitalizadosPaginacion: Array<Receta> = [];

  public listarecetasurgencia: Array<Receta> = [];
  public listarecetasurgenciaPaginacion: Array<Receta> = [];
  public cantidad_recetas_hospitalizados: number;
  public cantidad_recetas_ambulatorio: number;
  public cantidad_recetas_urgencia: number;
  public estado: boolean = false;
  public camas: Array<Camas> = [];
  public piezas: Array<Piezas> = [];
  public unidades: Array<Unidades> = [];
  public servicios : Array<Servicio> = [];
  public filtrohosp = false;
  public filtroamb = false;
  public filtrourg = false;
  public activatipobusquedahospurgamb : boolean = true;
  public activatipobusquedaamb  : boolean = true;

  constructor(
    public bsModalRef: BsModalRef,
    public formBuilder: FormBuilder,
    private _buscasolicitudService    : SolicitudService,
    public datePipe: DatePipe,
    public _TipodocumentoidentService : TipodocumentoidentService,
    public estructuraunidadesService: EstructuraunidadesService,

  ) {

    this.FormBuscaRecetasAmbulatorias = this.formBuilder.group({
      numreceta : [{ value: null, disabled: false }, Validators.required],
      tipoidentificacion: [{ value: null, disabled: false }, Validators.required],
      numeroidentificacion: [{ value: null, disabled: true }, Validators.required],
      apellidopaterno: [{ value: null, disabled: false }, Validators.required],
      apellidomaterno: [{ value: null, disabled: false }, Validators.required],
      nombrespaciente: [{ value: null, disabled: false }, Validators.required],
     }
    );

    this.FormBuscaRecetasUrgencia = this.formBuilder.group({
      numreceta : [{ value: null, disabled: false }, Validators.required],
      tipoidentificacion: [{ value: null, disabled: false }, Validators.required],
      numeroidentificacion: [{ value: null, disabled: true }, Validators.required],
      apellidopaterno: [{ value: null, disabled: false }, Validators.required],
      apellidomaterno: [{ value: null, disabled: false }, Validators.required],
      nombrespaciente: [{ value: null, disabled: false }, Validators.required],
      servicio: [{ value: null, disabled: false }, Validators.required],
      pieza: [{ value: null, disabled: true }, Validators.required],
     }
    );

    this.FormBuscaRecetasHospitalizadas = this.formBuilder.group({
      numreceta           : [{ value: null, disabled: false }, Validators.required],
      tipoidentificacion  : [{ value: null, disabled: false }, Validators.required],
      numeroidentificacion: [{ value: null, disabled: true }, Validators.required],
      apellidopaterno     : [{ value: null, disabled: false }, Validators.required],
      apellidomaterno     : [{ value: null, disabled: false }, Validators.required],
      nombrespaciente     : [{ value: null, disabled: false }, Validators.required],
      servicio            : [{ value: null, disabled: false }, Validators.required],
      pieza               : [{ value: null, disabled: true }, Validators.required],
      cama                : [{ value: null, disabled: true }, Validators.required],
    }
    );
  }

  ngOnInit() {

    if(this.pagina === 'Despacho'){
      this.activatipobusquedahospurgamb = true;
      this.activatipobusquedaamb = true;
    }else{
      this.activatipobusquedaamb = true;
      this.activatipobusquedahospurgamb = false;
    }

    this.onClose = new Subject();
    this.ListarEstUnidades();
    this.ListarEstServicios();

    this._TipodocumentoidentService.list(this.usuario,this.servidor).subscribe(
      data => {
        this.arreglotipodocumentoidentificacion = data;
      }

    );
  }

  onCerrar(recetaamb:  Receta) {

    this.estado = true;
    this.onClose.next(recetaamb);
    this.bsModalRef.hide();
  };

  onCerrarSalir() {
    this.estado = false;
    this.bsModalRef.hide();
  };

  async ListarEstServicios() {
    try {
      this.loading = true;

      this.estructuraunidadesService.BuscarServicios(
        this.hdgcodigo,
        this.esacodigo,
        this.cmecodigo,
        this.usuario,
        this.servidor,
        3,
        ''
      ).subscribe( resp => {
        this.servicios = resp;
        this.quitavacioservicio();

      });

      this.loading = false;
    } catch (err) {
      alert(err.message);
      this.loading = false;
    }
  }

  async ListarEstUnidades() {
    try {
      this.loading = true;
      this.unidades = await this.estructuraunidadesService.BuscarUnidades(
        this.hdgcodigo,
        this.esacodigo,
        this.cmecodigo,
        this.usuario,
        this.servidor
      ).toPromise();

      this.loading = false;
    } catch (err) {
      alert(err.message);
      this.loading = false;
    }
  }

  onSelectServicio(codservicio: string) {

      this.filtrohosp = true;
      this.piezas = [];
      this.camas = [];
      this.FormBuscaRecetasHospitalizadas.controls['pieza'].setValue(null);
      this.FormBuscaRecetasHospitalizadas.controls['cama'].setValue(null);
      this.FormBuscaRecetasHospitalizadas.controls['cama'].disable();

      this.FormBuscaRecetasHospitalizadas.controls['pieza'].enable();
      this.ListarPiezas(codservicio);

  }

  async ListarPiezas(serviciocod: string) {
    this.piezas = await this.estructuraunidadesService.BuscarPiezas(
      this.hdgcodigo,
      this.esacodigo,
      this.cmecodigo,
      0,
      this.usuario,
      this.servidor,
      serviciocod
    ).toPromise();
  }

  onSelectPieza(event: any) {
    this.loading = true;
    this.camas = [];
    this.FormBuscaRecetasHospitalizadas.controls['cama'].setValue(null);
    const idpieza = parseInt(event);
    this.FormBuscaRecetasHospitalizadas.controls['cama'].enable();
    this.ListarCamas(idpieza);
  }

  async ListarCamas(idpieza: number) {
    this.camas = await this.estructuraunidadesService.BuscarCamas(
      this.hdgcodigo,
      this.esacodigo,
      this.cmecodigo,
      idpieza,
      this.usuario,
      this.servidor
    ).toPromise();
    this.loading = false;
  }

  onValidafiltro(event: any, lugar: number) {

    let numid = event;
    switch (lugar) {
      case 1:
        if (numid.length > 0) {
          this.filtroamb = true;
        } else {
          this.filtroamb = false;
        }
        break;
      case 2:
        if (numid.length > 0) {
          this.filtrohosp = true;
        } else {
          this.filtrohosp = false;
        }
        break;
      case 3:
        if (numid.length > 0) {
          this.filtrourg = true;
        } else {
          this.filtrourg = false;
        }
        break;
    }
  }

  async BuscarRecetasFiltroAmbulatorio() {
    var fecha_desde = new Date();
    var fecha_hasta = new Date();

    fecha_hasta.setDate(fecha_desde.getDate() + 5);
    fecha_desde.setDate(fecha_desde.getDate() - 10);

    this.listarecetasambulatorias = [];
    this.listarecetasambulatoriasPaginacion = [];
    this.listarecetashospitalizados = [];
    this.listarecetashospitalizadosPaginacion = [];
    this.listarecetasurgencia = [];
    this.listarecetasurgenciaPaginacion = [];
    // Cargando recetas apcientes
    this._Receta = new (Receta);

    this._Receta.servidor = this.servidor;

    this._Receta.fechainicio = null;
    this._Receta.fechahasta = null;

    this._Receta.receid = 0;
    this._Receta.hdgcodigo = this.hdgcodigo;
    this._Receta.esacodigo = this.esacodigo;
    this._Receta.cmecodigo = this.cmecodigo;
    this._Receta.receambito = 0;

    this._Receta.recenumero =  parseInt(this.FormBuscaRecetasAmbulatorias.controls.numreceta.value);
    this._Receta.recetipdocpac = this.FormBuscaRecetasAmbulatorias.controls.tipoidentificacion.value;
    this._Receta.recedocumpac = this.FormBuscaRecetasAmbulatorias.controls.numeroidentificacion.value;
    this._Receta.clinombres = this.FormBuscaRecetasAmbulatorias.controls.nombrespaciente.value;
    this._Receta.cliapepaterno = this.FormBuscaRecetasAmbulatorias.controls.apellidopaterno.value;
    this._Receta.cliapematerno = this.FormBuscaRecetasAmbulatorias.controls.apellidomaterno.value;


    this._Receta.recesubreceta = 0;
    //this._Receta.recefecha   ?: string,
    //this._Receta.recefechaentrega   ?: string,
    this._Receta.fichapaci = 0;
    this._Receta.recectaid = 0;
    this._Receta.receurgid = 0;
    this._Receta.recedau = 0;
    this._Receta.rececliid = 0;

    this._Receta.recetipdocprof = 0;
    this._Receta.recedocumprof = '';
    this._Receta.receespecialidad = '';
    this._Receta.recerolprof = '';
    this._Receta.recesolid = 0
    this._Receta.receestadodespacho = 0;
    this._Receta.recenombrepaciente = '';
    this._Receta.recenombremedico = '';
    this._Receta.rececodunidad = ''
    this._Receta.rececodservicio = '';
    this._Receta.receglosaunidad = ''
    this._Receta.receglosaservicio = '';

    this.loading = true;
    this._buscasolicitudService.buscarEncabezadoRecetas(this._Receta).subscribe(
      response => {
        if (response != null){
          this.listarecetasambulatorias = [];
          this.listarecetasambulatoriasPaginacion = [];
          this.cantidad_recetas_ambulatorio = 0;
          if( response===null||response===undefined ) {
            this.loading = false;
            return;

          }
          else {
            if (response.length > 0) {
              response.forEach(element => {
                switch (element.receambito) {
                  case 1: {
                    this.listarecetasambulatorias.push(element);
                    break;
                  }
                  default: {
                    break;
                  }
                }
              });

              this.listarecetasambulatoriasPaginacion = this.listarecetasambulatorias.slice(0, 8);
              this.cantidad_recetas_ambulatorio = this.listarecetasambulatorias.length;
            }
          }
          this.cantidad_recetas_hospitalizados = this.listarecetashospitalizadosPaginacion.length;
          this.cantidad_recetas_urgencia = this.listarecetasurgenciaPaginacion.length;
          this.loading = false;
          return;
        } else {
          this.loading = false;
        }
      },

      error => {
        this.alertSwalError.title = "Error al Buscar Recetas";
        this.alertSwalError.text = "Se ha producido un error al buscar las recetas";
        this.alertSwalError.show();
        this.loading = false;
      }
    );
  }

  async BuscarRecetasFiltrohospitalizado() {
    var fecha_desde = new Date();
    var fecha_hasta = new Date();

    fecha_hasta.setDate(fecha_desde.getDate() + 5);
    fecha_desde.setDate(fecha_desde.getDate() - 10);

    this.listarecetasambulatorias = [];
    this.listarecetasambulatoriasPaginacion = [];
    this.listarecetashospitalizados = [];
    this.listarecetashospitalizadosPaginacion = [];
    this.listarecetasurgencia = [];
    this.listarecetasurgenciaPaginacion = [];

    // Cargando recetas apcientes
    this._Receta = new (Receta);

    this._Receta.servidor = this.servidor;

    this._Receta.fechainicio = null;
    this._Receta.fechahasta = null;

    this._Receta.receid = 0;
    this._Receta.hdgcodigo = this.hdgcodigo;
    this._Receta.esacodigo = this.esacodigo;
    this._Receta.cmecodigo = this.cmecodigo;
    this._Receta.receambito = 0;

    this._Receta.recenumero = this.FormBuscaRecetasHospitalizadas.controls.numreceta.value==null?0:parseInt(this.FormBuscaRecetasHospitalizadas.controls.numreceta.value);
    this._Receta.recetipdocpac = this.FormBuscaRecetasHospitalizadas.controls.tipoidentificacion.value;
    this._Receta.recedocumpac = this.FormBuscaRecetasHospitalizadas.controls.numeroidentificacion.value;
    this._Receta.clinombres = this.FormBuscaRecetasHospitalizadas.controls.nombrespaciente.value;
    this._Receta.cliapepaterno = this.FormBuscaRecetasHospitalizadas.controls.apellidopaterno.value;
    this._Receta.cliapematerno = this.FormBuscaRecetasHospitalizadas.controls.apellidomaterno.value;

    this._Receta.recesubreceta = 0;
    this._Receta.fichapaci = 0;
    this._Receta.recectaid = 0;
    this._Receta.receurgid = 0;
    this._Receta.recedau = 0;
    this._Receta.rececliid = 0;

    this._Receta.recetipdocprof = 0;
    this._Receta.recedocumprof = '';
    this._Receta.receespecialidad = '';
    this._Receta.recerolprof = '';
    this._Receta.recesolid = 0
    this._Receta.receestadodespacho = 0;
    this._Receta.recenombrepaciente = '';
    this._Receta.recenombremedico = '';
    this._Receta.rececodunidad = ''
    this._Receta.rececodservicio = '';
    this._Receta.receglosaunidad = ''
    this._Receta.receglosaservicio = '';

    this._buscasolicitudService.buscarEncabezadoRecetas(this._Receta).subscribe(
      response => {
        if( response===null||response===undefined ) { return; }
        else {
          if (response.length > 0) {
            response.forEach(element => {

              switch (element.receambito) {
                case 3: {
                  this.listarecetashospitalizados.push(element);
                  break;
                }
                default: {
                  break;
                }
              }
            });

            this.listarecetashospitalizadosPaginacion = this.listarecetashospitalizados.slice(0, 8);
            this.cantidad_recetas_hospitalizados = this.listarecetashospitalizados.length;
          }


        }
        this.cantidad_recetas_hospitalizados = this.listarecetashospitalizadosPaginacion.length;
        this.cantidad_recetas_urgencia = this.listarecetasurgenciaPaginacion.length;

        return;
      },

      error => {
        this.alertSwalError.title = "Error al Buscar Recetas";
        this.alertSwalError.text = "Se ha producido un error al buscar las recetas";
        this.alertSwalError.show();
        this.loading = false;
      }
    );
  }

  async BuscarRecetasFiltroUrgencia() {
    var fecha_desde = new Date();
    var fecha_hasta = new Date();

    fecha_hasta.setDate(fecha_desde.getDate() + 5);
    fecha_desde.setDate(fecha_desde.getDate() - 10);

    this.listarecetasambulatorias = [];
    this.listarecetasambulatoriasPaginacion = [];
    this.listarecetashospitalizados = [];
    this.listarecetashospitalizadosPaginacion = [];
    this.listarecetasurgencia = [];
    this.listarecetasurgenciaPaginacion = [];

    // Cargando recetas apcientes
    this._Receta = new (Receta);

    this._Receta.servidor = this.servidor;

    this._Receta.fechainicio = null;
    this._Receta.fechahasta = null;

    this._Receta.receid = 0;
    this._Receta.hdgcodigo = this.hdgcodigo;
    this._Receta.esacodigo = this.esacodigo;
    this._Receta.cmecodigo = this.cmecodigo;
    this._Receta.receambito = 0;

    this._Receta.recenumero = this.FormBuscaRecetasUrgencia.controls.numreceta.value==null?0:parseInt(this.FormBuscaRecetasUrgencia.controls.numreceta.value);
    this._Receta.recetipdocpac = this.FormBuscaRecetasUrgencia.controls.tipoidentificacion.value;
    this._Receta.recedocumpac = this.FormBuscaRecetasUrgencia.controls.numeroidentificacion.value;
    this._Receta.clinombres = this.FormBuscaRecetasUrgencia.controls.nombrespaciente.value;
    this._Receta.cliapepaterno = this.FormBuscaRecetasUrgencia.controls.apellidopaterno.value;
    this._Receta.cliapematerno = this.FormBuscaRecetasUrgencia.controls.apellidomaterno.value;


    this._Receta.recesubreceta = 0;
    this._Receta.fichapaci = 0;
    this._Receta.recectaid = 0;
    this._Receta.receurgid = 0;
    this._Receta.recedau = 0;
    this._Receta.rececliid = 0;

    this._Receta.recetipdocprof = 0;
    this._Receta.recedocumprof = '';
    this._Receta.receespecialidad = '';
    this._Receta.recerolprof = '';
    this._Receta.recesolid = 0
    this._Receta.receestadodespacho = 0;
    this._Receta.recenombrepaciente = '';
    this._Receta.recenombremedico = '';
    this._Receta.rececodunidad = ''
    this._Receta.rececodservicio = '';
    this._Receta.receglosaunidad = ''
    this._Receta.receglosaservicio = '';

    this._buscasolicitudService.buscarEncabezadoRecetas(this._Receta).subscribe(
      response => {
        if( response===null||response===undefined ) { return; }
        else {
          if (response.length > 0) {
            response.forEach(element => {
              switch (element.receambito) {
                case 2: {
                  this.listarecetasurgencia.push(element);
                  break;
                }
                default: {
                  break;
                }
              }
            });
            this.listarecetasurgenciaPaginacion = this.listarecetasurgencia.slice(0, 8);
            this.cantidad_recetas_urgencia = this.listarecetasurgencia.length;
          }
        }
        this.cantidad_recetas_hospitalizados = this.listarecetashospitalizadosPaginacion.length;
        this.cantidad_recetas_urgencia = this.listarecetasurgenciaPaginacion.length;
        return;
      },
      error => {
        this.alertSwalError.title = "Error al Buscar Recetas";
        this.alertSwalError.text = "Se ha producido un error al buscar las recetas";
        this.alertSwalError.show();
        this.loading = false;

      }
    );
  }

  LimpiarAmb(){
    this.FormBuscaRecetasAmbulatorias.reset();
    this.listarecetasambulatoriasPaginacion = [];
    this.listarecetasambulatorias = [];
    this.filtroamb = false;
    this.FormBuscaRecetasAmbulatorias.controls.numeroidentificacion.disable();

  }

  LimpiarHosp(){
    this.FormBuscaRecetasHospitalizadas.reset();
    this.listarecetashospitalizados = [];
    this.listarecetashospitalizadosPaginacion = [];
    this.filtrohosp = false;
    this.FormBuscaRecetasHospitalizadas.controls.numeroidentificacion.disable();
    this.FormBuscaRecetasHospitalizadas.controls.pieza.disable();
    this.FormBuscaRecetasHospitalizadas.controls.cama.disable();

  }
  LimpiarUrg(){
    this.FormBuscaRecetasUrgencia.reset();
    this.listarecetasurgencia = [];
    this.listarecetasurgenciaPaginacion = [];
    this.filtrourg = false;
    this.FormBuscaRecetasUrgencia.controls.numeroidentificacion.disable();
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listarecetasambulatoriasPaginacion = this.listarecetasambulatorias.slice(startItem, endItem);
  }

  pageChangedhosp(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listarecetashospitalizadosPaginacion = this.listarecetashospitalizados.slice(startItem, endItem);
  }

  pageChangedUrgencia(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listarecetasurgenciaPaginacion = this.listarecetasurgencia.slice(startItem, endItem);
  }

  getReceta(){
    this._Receta = new (Receta);
    this._Receta.servidor = this.servidor;
    this._Receta.fechainicio = null;
    this._Receta.fechahasta = null;
    this._Receta.receid = 0;
    this._Receta.hdgcodigo = this.hdgcodigo;
    this._Receta.esacodigo = this.esacodigo;
    this._Receta.cmecodigo = this.cmecodigo;
    this._Receta.receambito = 0;

    this._Receta.recenumero =  this.FormBuscaRecetasAmbulatorias.controls.numreceta.value==null?0:parseInt(this.FormBuscaRecetasAmbulatorias.controls.numreceta.value);

    this._Receta.recetipdocpac = this.FormBuscaRecetasAmbulatorias.value.tipoidentificacion;
    this._Receta.recedocumpac = this.FormBuscaRecetasAmbulatorias.value.numeroidentificacion;
    this._Receta.clinombres = this.FormBuscaRecetasAmbulatorias.value.nombrespaciente;
    this._Receta.cliapepaterno = this.FormBuscaRecetasAmbulatorias.value.apellidopaterno;
    this._Receta.cliapematerno = this.FormBuscaRecetasAmbulatorias.value.apellidomaterno;


    this._Receta.recesubreceta = 0;
    this._Receta.fichapaci = 0;
    this._Receta.recectaid = 0;
    this._Receta.receurgid = 0;
    this._Receta.recedau = 0;
    this._Receta.rececliid = 0;

    this._Receta.recetipdocprof = 0;
    this._Receta.recedocumprof = '';
    this._Receta.receespecialidad = '';
    this._Receta.recerolprof = '';
    this._Receta.recesolid = 0
    this._Receta.receestadodespacho = 0;
    this._Receta.recenombrepaciente = '';
    this._Receta.recenombremedico = '';
    this._Receta.rececodunidad = ''
    this._Receta.rececodservicio = '';
    this._Receta.receglosaunidad = ''
    this._Receta.receglosaservicio = '';

    this._buscasolicitudService.buscarEncabezadoRecetas(this._Receta).subscribe(
      response => {
        this.listarecetasambulatorias = [];
        this.listarecetasambulatoriasPaginacion = [];
        this.listarecetasurgencia = [];
        this.listarecetasurgenciaPaginacion = [];
        this.listarecetashospitalizados = [];
        this.listarecetashospitalizadosPaginacion = [];
        if( response===null||response===undefined ) { return; }
        else {
          if (response.length > 0) {
            response.forEach(element => {
              switch (element.receambito) {
                case 1: {
                  this.listarecetasambulatorias.push(element);
                  this.listarecetasambulatoriasPaginacion = this.listarecetasambulatorias.slice(0,8)
                  break;
                }
                case 2: {
                  this.listarecetasurgencia.push(element);
                  this.listarecetasurgenciaPaginacion = this.listarecetasurgencia.slice(0,8);
                  break;
                }
                case 3: {
                  this.listarecetashospitalizados.push(element);
                  this.listarecetashospitalizadosPaginacion = this.listarecetashospitalizados.slice(0,8);
                  break;
                }
                default: {
                  break;
                }
              }
            });
            this.listarecetasurgenciaPaginacion = this.listarecetasurgencia.slice(0, 8);
            this.cantidad_recetas_urgencia = this.listarecetasurgencia.length;
          }
        }
        this.cantidad_recetas_hospitalizados = this.listarecetashospitalizadosPaginacion.length;
        this.cantidad_recetas_urgencia = this.listarecetasurgenciaPaginacion.length;

        return;
      },

      error => {
        this.alertSwalError.title = "Error al Buscar Recetas";
        this.alertSwalError.text = "Se ha producido un error al buscar las recetas";
        this.alertSwalError.show();
        this.loading = false;
      }
    );
  }

  comboTipoidAmb() {
    this.FormBuscaRecetasAmbulatorias.controls.numeroidentificacion.enable();

  }

  comboTipoidHosp() {
    this.FormBuscaRecetasHospitalizadas.controls.numeroidentificacion.enable();

  }

  comboTipoidUrg() {
    this.FormBuscaRecetasUrgencia.controls.numeroidentificacion.enable();

  }

  quitavacioservicio() {
    const codserv = this.servicios.findIndex( x => x.serviciodesc.trim() === '' );
    this.servicios.splice( codserv, 1);

  }

 }
