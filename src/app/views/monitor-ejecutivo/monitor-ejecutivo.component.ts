import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { environment } from 'src/environments/environment';
import { SolicitudService } from 'src/app/servicios/Solicitudes.service';
import { DatePipe } from '@angular/common';
import { Solicitud } from 'src/app/models/entity/Solicitud';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService, defineLocale, esLocale, PageChangedEvent } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { Receta } from 'src/app/models/entity/receta';



@Component({
  selector: 'app-monitor-ejecutivo',
  templateUrl: './monitor-ejecutivo.component.html',
  styleUrls: ['./monitor-ejecutivo.component.css']
})
export class MonitorEjecutivoComponent implements OnInit {
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
  public servidor = environment.URLServiciosRest.ambiente;
  public usuario = environment.privilegios.usuario;

  public listasolicitudes: Array<Solicitud> = [];

  public listasolicitudesurgencia: Array<Solicitud> = [];
  public listasolicitudesurgenciapaginacion: Array<Solicitud> = [];

  public listasolicitudespordespachar: Array<Solicitud> = [];
  public listasolicitudespordespacharPaginacion: Array<Solicitud> = [];

  public listasolicitudesporrecepcionar: Array<Solicitud> = [];
  public listasolicitudesporrecepcionarPaginacion: Array<Solicitud> = [];


  public listarecetasambulatorias: Array<Receta> = [];
  public listarecetasambulatoriasPaginacion: Array<Receta> = [];

  public listarecetashospitalizados: Array<Receta> = [];
  public listarecetashospitalizadosPaginacion: Array<Receta> = [];

  public listarecetasurgencia: Array<Receta> = [];
  public listarecetasurgenciaPaginacion: Array<Receta> = [];



  public _PageChangedEvent: PageChangedEvent;


  public canidad_recetas_hospitalizados: number;
  public canidad_recetas_ambulatorio: number;
  public canidad_recetas_urgencia: number;
  public canidad_despachos: number;
  public canidad_recepcion: number;
  public canidad_despacho_urgente: number;

  public opcion_hospitalizado: boolean;
  public opcion_ambulatorio: boolean;
  public opcion_urgencia: boolean;
  public opcion_solicituddespacho: boolean;
  public opcion_solicitudurgente: boolean;
  public opcion_solictudrecepcion: boolean;
  //public tiempo_refresco = interval(120000);
  public _Receta: Receta;





  constructor(
    private _buscasolicitudService: SolicitudService,
    public datePipe               : DatePipe,
    public formBuilder            : FormBuilder,
    private router                : Router,
    public localeService          : BsLocaleService,
  ) {

    this.lForm = this.formBuilder.group({
      fechadesde: [new Date(), Validators.required],
      fechahasta: [new Date(), Validators.required],
    });
  }

  ngOnInit() {
    this.setDate();
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();

    this.canidad_recetas_hospitalizados = 0;
    this.canidad_recetas_ambulatorio = 0;
    this.canidad_recetas_urgencia = 0;
    this.canidad_despachos = 0;
    this.canidad_recepcion = 0;
    this.canidad_despacho_urgente = 0;

    this.opcion_hospitalizado = false;
    this.opcion_ambulatorio = false;
    this.opcion_urgencia = false;
    this.opcion_solicituddespacho = false;
    this.opcion_solicitudurgente = false;
    this.opcion_solictudrecepcion = false;

    this.refrescar();

    //this.tiempo_refresco.subscribe((n) => {
    //  this.BuscarSolicitudesFiltro()
    //  this.BuscarRecetasFiltro();
    //});
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  async BuscarRecetasFiltro() {
    this.listarecetasambulatorias = [];
    this.listarecetasambulatoriasPaginacion = [];
    this.listarecetashospitalizados = [];
    this.listarecetashospitalizadosPaginacion = [];
    this.listarecetasurgencia = [];
    this.listarecetasurgenciaPaginacion = [];

    // Cargando recetas apcientes
    this._Receta = new (Receta);

    this._Receta.servidor = this.servidor;
    this._Receta.fechainicio = this.datePipe.transform(this.lForm.controls.fechadesde.value, 'yyyy-MM-dd');
    this._Receta.fechahasta = this.datePipe.transform(this.lForm.controls.fechahasta.value, 'yyyy-MM-dd');
    this._Receta.receid = 0;
    this._Receta.hdgcodigo = this.hdgcodigo;
    this._Receta.esacodigo = this.esacodigo;
    this._Receta.cmecodigo = this.cmecodigo;
    this._Receta.receambito = 0;
    this._Receta.recenumero = 0;
    this._Receta.recesubreceta = 0;
    //this._Receta.recefecha   ?: string,
    //this._Receta.recefechaentrega   ?: string,
    this._Receta.fichapaci = 0;
    this._Receta.recectaid = 0;
    this._Receta.receurgid = 0;
    this._Receta.recedau = 0;
    this._Receta.rececliid = 0;
    this._Receta.recetipdocpac = 0;
    this._Receta.recedocumpac = '';
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

    this._buscasolicitudService.buscarEncabezadoRecetasMonitor(this._Receta).subscribe(
      response => {
        if(response === null){
          this.loading = false;
          return;
        } else{
          if (response.length == 0) {
            this.loading = false;
            return;
          } else {
            if (response.length > 0) {
              response.forEach(element => {
                switch (element.receambito) {
                  case 1: {
                    this.listarecetasambulatorias.push(element);
                    break;
                  }
                  case 2: {
                    this.listarecetasurgencia.push(element);
                    break;
                  }
                  case 3: {
                    this.listarecetashospitalizados.push(element);
                    break;
                  }
                  default: {
                    break;
                  }
                }
              });
              this.listarecetasambulatoriasPaginacion = this.listarecetasambulatorias.slice(0, 20);
              this.canidad_recetas_ambulatorio = this.listarecetasambulatorias.length;
              this.listarecetasurgenciaPaginacion = this.listarecetasurgencia.slice(0, 20);
              this.canidad_recetas_urgencia = this.listarecetasurgencia.length;
              this.listarecetashospitalizadosPaginacion = this.listarecetashospitalizados.slice(0, 20);
              this.canidad_recetas_hospitalizados = this.listarecetashospitalizados.length;
              return;
            }
          }
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

  async refrescar() {
    this.loading = true;
    try{
      await this.BuscarRecetasFiltro();
      await this.BuscarSolicitudesFiltro();
      console.log(this.listarecetasambulatoriasPaginacion);
    } catch(err) {
      this.alertSwalError.title = 'Ocurrio un Error';
      this.alertSwalError.show();
      this.loading = false;
    }
  }

  eleccionopcion(opcion: string) {
    switch (opcion) {
      case 'HOSPITALIZADOS': {
        this.opcion_hospitalizado = true;
        this.opcion_ambulatorio = false;
        this.opcion_urgencia = false;
        this.opcion_solicituddespacho = false;
        this.opcion_solicitudurgente = false;
        this.opcion_solictudrecepcion = false;
        break;
      }
      case 'AMBULATORIOS': {
        this.opcion_hospitalizado = false;
        this.opcion_ambulatorio = true;
        this.opcion_urgencia = false;
        this.opcion_solicituddespacho = false;
        this.opcion_solicitudurgente = false;
        this.opcion_solictudrecepcion = false;
        break;
      }
      case 'URGENCIAS': {
        this.opcion_hospitalizado = false;
        this.opcion_ambulatorio = false;
        this.opcion_urgencia = true;
        this.opcion_solicituddespacho = false;
        this.opcion_solicitudurgente = false;
        this.opcion_solictudrecepcion = false;
        break;
      }
      case 'SOLICITUDDESPACHO': {
        this.opcion_hospitalizado = false;
        this.opcion_ambulatorio = false;
        this.opcion_urgencia = false;
        this.opcion_solicituddespacho = true;
        this.opcion_solicitudurgente = false;
        this.opcion_solictudrecepcion = false;
        break;
      }
      case 'SOLICITUDURGENTE': {
        this.opcion_hospitalizado = false;
        this.opcion_ambulatorio = false;
        this.opcion_urgencia = false;
        this.opcion_solicituddespacho = false;
        this.opcion_solicitudurgente = true;
        this.opcion_solictudrecepcion = false;
        break;
      }
      case 'SOLICITUDRECEPCION': {
        this.opcion_hospitalizado = false;
        this.opcion_ambulatorio = false;
        this.opcion_urgencia = false;
        this.opcion_solicituddespacho = false;
        this.opcion_solicitudurgente = false;
        this.opcion_solictudrecepcion = true;
        break;
      }
      default: {
        this.opcion_hospitalizado = false;
        this.opcion_ambulatorio = false;
        this.opcion_urgencia = false;
        this.opcion_solicituddespacho = false;
        this.opcion_solicitudurgente = false;
        this.opcion_solictudrecepcion = false;
        break;
      }
    }
  }

  EditarDespacho(id_solicitud: number, id_receta: number, id_paciente: number,registro:Receta) {
    const Swal = require('sweetalert2');
    // document.getElementById('side-menu').style.display = 'block';
    if (id_paciente == 0 && id_receta == 0) {
      this.router.navigate(['despachosolicitudes', id_solicitud, 'monitorejecutivo']);
    } else {  //Caso de pacientes
      if (id_paciente != 0 && id_receta == 0) {
        if(registro.ctanumcta === 0){
          Swal.fire({
          title: 'RECETA NO TIENE CUENTA ASOCIADA',
          //text: "¿Seguro que desea Salir sin de guardar?",
          // showCancelButton: true,
          confirmButtonColor: '#3085d6',
          // cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
          }).then((result) => {
          return;
          });
        } else {
          this.router.navigate(['dispensarsolicitudespacientes', id_solicitud]);
        }

      } else {
        if(registro.receambito == 3 || registro.receambito == 2){
          if(registro.ctanumcta === 0){
            Swal.fire({
            title: '¡RECETA NO TIENE CUENTA!',
            //text: "¿Seguro que desea Salir sin de guardar?",
            // showCancelButton: true,
            confirmButtonColor: '#3085d6',
            // cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
            }).then((result) => {
            return;
            });
          } else {
            this.router.navigate(['despachorecetasambulatoria', 0, id_receta, 'monitorejecutivo']);
          }
        }else{
          if(registro.receambito == 1){
            this.router.navigate(['despachorecetasambulatoria', 0, id_receta, 'monitorejecutivo']);
          }
        }



      }

    }
  }

  EditarRecepcion(id_solicitud: number) {
    // document.getElementById('side-menu').style.display = 'block';
    this.router.navigate(['recepcionsolicitudes', id_solicitud]);
  }




  async BuscarSolicitudesFiltro() {
    var servidor = environment.URLServiciosRest.ambiente;
    var indice: number;
    indice = 0;

    this.listasolicitudespordespachar = [];
    this.listasolicitudespordespacharPaginacion = [];
    this.listasolicitudesporrecepcionar = [];
    this.listasolicitudesporrecepcionarPaginacion = [];
    this.listasolicitudesurgencia = [];
    this.listasolicitudesurgenciapaginacion = [];

    // Cargando solicudes de pacientes
    this._buscasolicitudService.BuscaSolicitudCabecera(0, this.hdgcodigo,
      this.esacodigo, this.cmecodigo, 0,
      this.datePipe.transform(this.lForm.controls.fechadesde.value, 'yyyy-MM-dd'),
      this.datePipe.transform(this.lForm.controls.fechahasta.value, 'yyyy-MM-dd'),
      0, 0, 0, servidor, 0, -1, 0, 0, 0, 0, "","",0,this.usuario,"","",0, "").subscribe(
        async response => {
          if (response != null) {
            if (response.length == 0) {
              this.loading = false;
              return;
            } else {
              if (response.length > 0) {

                this.listasolicitudes = response;

                this.listasolicitudes.forEach(element => {

                  if (element.cliid > 0) {
                    this.listasolicitudes[indice].nombrecompletopaciente = element.apepaternopac + " " + element.apematernopac + "," + element.nombrespac;
                    this.listasolicitudes[indice].bodorigendesc = '';
                  }
                  indice++;
                  if ((element.prioridadsoli != 2) && (element.codambito !=1) && (element.estadosolicitud == 10 || element.estadosolicitud == 20 || element.estadosolicitud == 40 || element.estadosolicitud == 120)) {
                    if (element.tipobodsuministro != 'G'){
                      this.listasolicitudespordespachar.push(element);
                    }
                  }
                  if ((element.codambito == 0) && (element.estadosolicitud == 40 || element.estadosolicitud == 50 || element.estadosolicitud == 60 || element.estadosolicitud == 78 || element.estadosolicitud == 51)) {
                    if (element.tipobodsolicitante != 'G'){
                      this.listasolicitudesporrecepcionar.push(element);
                    }
                  }
                  if ((element.prioridadsoli == 2) && (element.estadosolicitud == 10 || element.estadosolicitud == 20 || element.estadosolicitud == 40 || element.estadosolicitud == 120)) {
                    if (element.tipobodsuministro != 'G'){
                      this.listasolicitudesurgencia.push(element);
                    }
                  }

                });
                this.listasolicitudespordespacharPaginacion = this.listasolicitudespordespachar.slice(0, 20);
                this.listasolicitudesporrecepcionarPaginacion = this.listasolicitudesporrecepcionar.slice(0,20);
                this.listasolicitudesurgenciapaginacion = this.listasolicitudesurgencia.slice(0, 20);

                this.canidad_despachos = this.listasolicitudespordespachar.length;
                this.canidad_recepcion = this.listasolicitudesporrecepcionar.length;
                this.canidad_despacho_urgente = this.listasolicitudesurgencia.length;

                this.loading = false;
              }

              return;
            }
          } else {
            this.loading = false;
            return;}
        },
        error => {
          this.alertSwalError.title = "Error al Buscar Solicitudes";
          this.alertSwalError.text = "No encuentra Solicitud, puede que no exista, intentar nuevamente";
          this.alertSwalError.show();
          this.loading = false;
        }
      )
  }

  pageChangedRecetaHospitalizados(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listarecetashospitalizadosPaginacion = this.listarecetashospitalizados.slice(startItem, endItem);
  }
  pageChangedRecetaAmbulatoria(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listarecetasambulatoriasPaginacion = this.listarecetasambulatorias.slice(startItem, endItem);
    console.log(this.listarecetasambulatoriasPaginacion);
  }

  pageChangedRecetaUrgencia(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listarecetasurgenciaPaginacion = this.listarecetasurgencia.slice(startItem, endItem);
  }
  pageChangedSolicitudDespacho(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listasolicitudespordespacharPaginacion = this.listasolicitudespordespachar.slice(startItem, endItem);
  }
  pageChangedRecepcion(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listasolicitudesporrecepcionarPaginacion = this.listasolicitudesporrecepcionar.slice(startItem, endItem);
  }
  pageChangedSolicitudUrgencia(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listasolicitudesurgenciapaginacion = this.listasolicitudesurgencia.slice(startItem, endItem);
  }
}
