import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PageChangedEvent } from 'ngx-bootstrap';
import { EstadoSolicitudBodega } from '../../models/entity/EstadoSolicitudBodega';
import { EstadosolicitudbodegaService } from '../../servicios/estadosolicitudbodega.service';
import { Prioridades } from '../../models/entity/Prioridades';
import { PrioridadesService } from '../../servicios/prioridades.service';
import { Solicitud } from 'src/app/models/entity/Solicitud';

//Manejo de fechas
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SolicitudConsumoService } from 'src/app/servicios/solicitud-consumo.service';
import { UnidadesOrganizacionalesService } from 'src/app/servicios/unidades-organizacionales.service';
import { UnidadesOrganizacionales } from 'src/app/models/entity/unidades-organizacionales';
import { SolicitudConsumo } from 'src/app/models/entity/solicitud-consumo';


@Component({
  selector: 'app-busqueda-solicitud-consumo',
  templateUrl: './busqueda-solicitud-consumo.component.html',
  styleUrls: ['./busqueda-solicitud-consumo.component.css']
})
export class BusquedaSolicitudConsumoComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  @Input() hdgcodigo: number;
  @Input() esacodigo: number;
  @Input() cmecodigo: number;
  @Input() titulo: string;
  @Input() usuario: string;

  public onClose: Subject<Solicitud>;
  public estado: boolean = false;
  public lForm: FormGroup;
  public prioridades: Array<Prioridades> = [];
  public estadossolbods: Array<EstadoSolicitudBodega> = [];
  public listasolicitudes: Array<SolicitudConsumo> = [];
  public listasolicitudespaginacion: Array<SolicitudConsumo> = [];
  public loading = false;
  public servidor = environment.URLServiciosRest.ambiente;
  public ccostosolicitante: Array<UnidadesOrganizacionales> = [];
  //fechas
  public locale = 'es';
  public bsConfig: Partial<BsDatepickerConfig>;
  public colorTheme = 'theme-blue';


  constructor(
    public bsModalRef: BsModalRef,
    public formBuilder: FormBuilder,
    private EstadoSolicitudBodegaService: EstadosolicitudbodegaService,
    private PrioridadesService: PrioridadesService,
    public datePipe: DatePipe,
    public localeService: BsLocaleService,
    public _solicitudConsumoService: SolicitudConsumoService,
    public _unidadesorganizacionaes: UnidadesOrganizacionalesService,) {

    this.lForm = this.formBuilder.group({
      numerosolicitud: [{ value: null, disabled: false }, Validators.required],
      centrocosto: [{ value: null, disabled: false }, Validators.required],
      prioridad: [{ value: null, disabled: false }, Validators.required],
      estado: [{ value: null, disabled: false }, Validators.required],
      fechadesde: [new Date(), Validators.required],
      fechahasta: [new Date(), Validators.required],
      tiposolicitud: [{ value: null, disabled: false }, Validators.required],
    });


  }

  ngOnInit() {

    this.setDate();
    this.onClose = new Subject();

    this.BuscaCentroCostoSolicitante();

    this.PrioridadesService.list(this.usuario, this.servidor).subscribe(
      data => {
        this.prioridades = data;
      }, err => {
      }
    );

    this.EstadoSolicitudBodegaService.list(this.usuario, this.servidor).subscribe(
      data => {
        this.estadossolbods = data;
      }, err => {
      }
    );

  }

  onCerrar(SolicitudSeleccionada: SolicitudConsumo) {
    this.estado = true;
    this.onClose.next(SolicitudSeleccionada);
    this.bsModalRef.hide();
  };

  onCerrarSalir() {
    this.estado = true;
    this.onClose.next();
    this.bsModalRef.hide();
  };

  buscarSolictudesConsumofiltros() {

    if (this.lForm.value.numerosolicitud != null && this.lForm.value.numerosolicitud  >0 ) {
      var fechadesde = '';
      var fechahasta = '';
    } else {
      var fechadesde = this.datePipe.transform(this.lForm.value.fechadesde, 'yyyy-MM-dd');
      var fechahasta = this.datePipe.transform(this.lForm.value.fechahasta, 'yyyy-MM-dd');

    }
    this.loading = true;
    this._solicitudConsumoService.buscarsolicitudconsumocabecera(this.lForm.value.numerosolicitud, this.hdgcodigo, this.esacodigo, this.cmecodigo,  this.lForm.value.centrocosto, 0, 0, 0, this.lForm.value.estado, this.lForm.value.prioridad, "", "", this.usuario, this.servidor, fechadesde, fechahasta).subscribe(
      respuestasolicitud => {
        /** if para que no genere error */
        if(respuestasolicitud === null) {
          return;
        }

        if (respuestasolicitud.length == 0) {
          this.loading = false;
          this.alertSwalAlert.title = "Buscar Solicitudes de Consumo";
          this.alertSwalAlert.text = "No encuentra Solicitudes de consumo para este criterio. Favor intentar nuevamente";
          this.alertSwalAlert.show();
        }
        else {

          this.listasolicitudes = respuestasolicitud;
          this.listasolicitudespaginacion = this.listasolicitudes.slice(0, 8);
        }
      },
      error => {
        this.loading = false;
        this.alertSwalError.title = "Error al Buscar Solicitudes de Consumo";
        this.alertSwalError.text = "No encuentra Solicitudes, puede que no existan. Favor intentar nuevamente";
        this.alertSwalError.show();
      }

    )
    this.loading = false;
  }

  /* Función búsqueda con paginación */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listasolicitudespaginacion = this.listasolicitudes.slice(startItem, endItem);
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }


  BuscaCentroCostoSolicitante() {
    this._unidadesorganizacionaes.buscarCentroCosto("", 0, "CCOS", "", "", 0, this.cmecodigo, 0, 0, "S", this.usuario, null, this.servidor).subscribe(
      response => {
        if (response != null){
          this.ccostosolicitante = response;
        }
      },
      error => {
        alert("Error al Buscar Bodegas de cargo");
      }
    );
  }


  Limpiar() {
    this.lForm.reset();
    this.lForm.get('fechadesde').setValue(new Date());
    this.lForm.get('fechahasta').setValue(new Date());
    this.listasolicitudespaginacion = [];
    this.listasolicitudes = [];
  }



  getHdgcodigo(event: any) {
    this.hdgcodigo = event.hdgcodigo;
  }

  getEsacodigo(event: any) {
    this.esacodigo = event.esacodigo;
  }

  getCmecodigo(event: any) {
    this.cmecodigo = event.cmecodigo;
  }

  getSolicitud(solicitud:any){
    this.loading = true;
    if (this.lForm.value.numerosolicitud != null && this.lForm.value.numerosolicitud  >0 ) {
      var fechadesde = '';
      var fechahasta = '';
    } else {
      var fechadesde = this.datePipe.transform(this.lForm.value.fechadesde, 'yyyy-MM-dd');
      var fechahasta = this.datePipe.transform(this.lForm.value.fechahasta, 'yyyy-MM-dd');

    }
    this._solicitudConsumoService.buscarsolicitudconsumocabecera(parseInt(solicitud), this.hdgcodigo, this.esacodigo, this.cmecodigo, 0, 0, 0, 0, 0, 0, "", "", this.usuario, this.servidor, fechadesde, fechahasta).subscribe(
      respuestasolicitud => {
        if (respuestasolicitud.length == 0) {
          this.loading = false;
          this.alertSwalError.title = "Error al Buscar Solicitudes de Consumo";
          this.alertSwalError.text = "No encuentra Solicitudes de consumo para este criterio. Favor intentar nuevamente";
          this.alertSwalError.show();
        }
        else {

          this.listasolicitudes = respuestasolicitud;
          this.listasolicitudespaginacion = this.listasolicitudes.slice(0, 8);
        }
      },
      error => {

        this.loading = false;
        this.alertSwalError.title = "Error al Buscar Solicitudes de Consumo";
        this.alertSwalError.text = "No encuentra Solicitudes, puede que no existan. Favor intentar nuevamente";
        this.alertSwalError.show();
      }

    )
    this.loading = false;
  }

  msgAlert( title: any, error: any) {
    this.alertSwalAlert.title = title;
    this.alertSwalAlert.text = error;
    this.alertSwalAlert.show();
    return;

  }

  msgError( title: any, error: any) {
    this.alertSwalError.title = title;
    this.alertSwalError.text = error;
    this.alertSwalError.show();
    return;

  }
}
