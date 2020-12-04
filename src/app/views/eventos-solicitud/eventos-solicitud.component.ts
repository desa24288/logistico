import { Component, OnInit, Input } from '@angular/core';
import { Solicitud } from 'src/app/models/entity/Solicitud';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, BsDatepickerConfig, defineLocale, esLocale, PageChangedEvent } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { EstadosolicitudbodegaService } from 'src/app/servicios/estadosolicitudbodega.service';
import { BodegasService } from 'src/app/servicios/bodegas.service';
import { SolicitudService } from 'src/app/servicios/Solicitudes.service';
import { PrioridadesService} from '../../servicios/prioridades.service';
import { Prioridades } from 'src/app/models/entity/Prioridades';
import { EstadoSolicitudBodega } from 'src/app/models/entity/EstadoSolicitudBodega';
import { EventoSolicitud } from 'src/app/models/entity/EventoSolicitud';
import { OrigenSolicitud } from 'src/app/models/entity/OrigenSolicitud';
import { BodegasTodas } from 'src/app/models/entity/BodegasTodas';
import { BodegasrelacionadaAccion } from 'src/app/models/entity/BodegasRelacionadas';


@Component({
  selector: 'app-eventos-solicitud',
  templateUrl: './eventos-solicitud.component.html',
  styleUrls: ['./eventos-solicitud.component.css']
})
export class EventosSolicitudComponent implements OnInit {
  @Input() hdgcodigo: number;
  @Input() esacodigo: number;
  @Input() cmecodigo: number;
  @Input() titulo   : string;
  @Input() _Solicitud: Solicitud;

  public onClose: Subject<any>; 
  public lForm: FormGroup;
  public locale = 'es';
  public bsConfig: Partial<BsDatepickerConfig>;
  public colorTheme = 'theme-blue';
  public prioridades                        : Array<Prioridades> = [];
  public ListaOrigenSolicitud               : Array<OrigenSolicitud> = [];
  public estadossolbods                     : Array<EstadoSolicitudBodega> = [];
  public listaEventosSolicitud              : Array<EventoSolicitud> = [];
  public listaEventosSolicitudPaginacion    : Array<EventoSolicitud> = [];
  public bodegassuministro                  : Array<BodegasrelacionadaAccion> = [];
  public bodegasSolicitantes                : Array<BodegasTodas> = [];
  public usuario                            : string;
  public servidor                           : string;

  constructor(
    public bsModalRef                      : BsModalRef,
    public formBuilder                     : FormBuilder,
    public _SolicitudService               : SolicitudService,
    public datePipe                        : DatePipe,
    public localeService                   : BsLocaleService,
    private EstadoSolicitudBodegaService   : EstadosolicitudbodegaService,
    private PrioridadesService             : PrioridadesService,
    public _BodegasService                 : BodegasService,
    public _solicitudService               : SolicitudService,
          
    ) { 

      this.lForm = this.formBuilder.group({
        estadosolicitudde: [{ value: null, disabled: false }, Validators.required],
        tiposolicitud : [{ value: null, disabled: false }, Validators.required],
        numerosolicitud: [{ value: null, disabled: false }, Validators.required],
        esticod       : [{ value: null, disabled: false }, Validators.required],
        hdgcodigo     : [{ value: null, disabled: false }, Validators.required],
        esacodigo     : [{ value: null, disabled: false }, Validators.required],
        cmecodigo     : [{ value: null, disabled: false }, Validators.required],
        desprioridadsoli: [{ value: null, disabled: false }, Validators.required],
        fecha         : [new Date(), Validators.required],
        bodcodigo     : [{ value: null, disabled: false }, Validators.required],
        codbodegasuministro    : [{ value: null, disabled: false }, Validators.required],
        codorigensolicitud: [{ value: null, disabled: false }, Validators.required],
        desorigensolicitud:  [{ value: null, disabled: false }, Validators.required],
        bodorigendesc:  [{ value: null, disabled: false }, Validators.required],
        boddestinodesc:  [{ value: null, disabled: false }, Validators.required],
        
      });
    }

  ngOnInit() {
    this.onClose = new Subject();
    
    this.setDate();

    this.usuario = environment.privilegios.usuario;
    this.servidor = environment.URLServiciosRest.ambiente; 
    this.lForm.get('desorigensolicitud').setValue(this._Solicitud.desorigensolicitud); 

    this.lForm.get('tiposolicitud').setValue(this._Solicitud.tiposolicitud);
    this.lForm.get('numerosolicitud').setValue(this._Solicitud.soliid);
    this.lForm.get('desprioridadsoli').setValue(this._Solicitud.desprioridadsoli);
    this.lForm.get('bodorigendesc').setValue(this._Solicitud.bodorigendesc);
    this.lForm.get('boddestinodesc').setValue(this._Solicitud.boddestinodesc);
    this.lForm.get('estadosolicitudde').setValue(this._Solicitud.estadosolicitudde);
    this.lForm.get('fecha').setValue(new Date(this._Solicitud.fechacreacion)); 

    this.BuscaEventosSolictudes();
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  onCerrarSalir() {
 
    this.onClose.next();
    this.bsModalRef.hide();
  };

  getHdgcodigo(event: any) {
    this.hdgcodigo = event.hdgcodigo;
  }

  getEsacodigo(event: any) {
    this.esacodigo = event.esacodigo;
  }

  getCmecodigo(event: any) {
    this.cmecodigo = event.cmecodigo;
  }

  BuscaEventosSolictudes () {
    this._solicitudService.BuscaEventosSolicitud(this._Solicitud.soliid, this.servidor).subscribe(
      response => {
        this.listaEventosSolicitud = response;
        this.listaEventosSolicitudPaginacion = this.listaEventosSolicitud.slice(0,8)
      },
      error => {
        alert("Error al Buscar Eventos")
      }
    );
  }

   /* Función búsqueda con paginación */

   pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listaEventosSolicitudPaginacion = this.listaEventosSolicitud.slice(startItem, endItem);
  }
}