import { Component, OnInit , Input, ViewChild} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TipoAmbito } from '../../models/entity/TipoAmbito'
import { TipoambitoService } from '../../servicios/tiposambito.service';
import { DocIdentificacion } from '../../models/entity/DocIdentificacion';
import { DocidentificacionService } from '../../servicios/docidentificacion.service';
import { EstadoSolicitud } from '../../models/entity/EstadoSolicitud';
import { TipoRegistro } from '../../models/entity/TipoRegistro';
import { TiporegistroService } from '../../servicios/tiporegistro.service';
import { ListaPacientes } from 'src/app/models/entity/ListaPacientes';
import { BuscasolicitudespacientesService } from '../../servicios/buscasolicitudespacientes.service'
import { DispensaSolicitud } from 'src/app/models/entity/DispensaSolicitud';
import { DetalleSolicitud } from 'src/app/models/entity/DetalleSolicitud';
import { SolicitudService } from 'src/app/servicios/Solicitudes.service';
import { Prioridades } from '../../models/entity/Prioridades';
import { PrioridadesService } from '../../servicios/prioridades.service';
import { Unidades } from '../../models/entity/Unidades';
import { Piezas } from '../../models/entity/Piezas';
import { Camas } from '../../models/entity/Camas';
import { EstructuraunidadesService } from '../../servicios/estructuraunidades.service';
import { PageChangedEvent } from 'ngx-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-busquedasolicitudpacientes',
  templateUrl: './busquedasolicitudpacientes.component.html',
  styleUrls: ['./busquedasolicitudpacientes.component.css'],
  providers : [BuscasolicitudespacientesService]
})
export class BusquedasolicitudpacientesComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  @Input() hdgcodigo: number;
  @Input() esacodigo: number;
  @Input() cmecodigo: number;
  @Input() titulo: string;
  @Input() cliid: string;
  @Input() ambito: number;
  @Input() tipodocumento: number;
  @Input() numeroidentificacion: string;
  @Input() apepaternopac: string;
  @Input() apematernopac: string;
  @Input() nombrepaciente: string;
  @Input() codservicioactual: string;
  @Input() buscasolicitud : string;
  @Input() filtrodenegocio : string;

  public onClose                     : Subject<ListaPacientes>;
  public loading = false; 

  public FormBusquedaSolPac          : FormGroup;
  public locale                      = 'es';
  public bsConfig                    : Partial<BsDatepickerConfig>;
  public colorTheme                  = 'theme-blue';
  public tiposambitos                : Array<TipoAmbito> = [];
  public docsidentis                 : Array<DocIdentificacion> = [];
  public estadossolicitudes          : Array<EstadoSolicitud> = [];
  public tiposderegistros            : Array<TipoRegistro> = [];
  public prioridades                 : Array<Prioridades> = [];
  public unidades                    : Array<Unidades> = [];
  public piezas                      : Array<Piezas> = [];
  public camas                       : Array<Camas> = [];
  listasolicitudespacientes          : Array<DispensaSolicitud> =[];  
  listasolicitudespacientespaginacion: Array<DetalleSolicitud>=[];
  
  public estado                      : boolean = false;
  public servidor                    = environment.URLServiciosRest.ambiente;
  public usuario                     = environment.privilegios.usuario;
  /* para datepicker */
  public vfechainicio: string;
  public vfechatermino: string;
  constructor(
    public bsModalRef                 : BsModalRef,
    public formBuilder                : FormBuilder,
    public datePipe                   : DatePipe,
    public localeService              : BsLocaleService,
    private TipoambitoService         : TipoambitoService,
    private DocidentificacionService  : DocidentificacionService,
    private EstadosolicitudService    : SolicitudService,
    private TiporegistroService       : TiporegistroService,
    private _buscasolicitudService    : SolicitudService,
    private PrioridadesService        : PrioridadesService,
    public estructuraunidadesService  : EstructuraunidadesService,


  ) {
    this.FormBusquedaSolPac = this.formBuilder.group({
      fechadesde          : [new Date(), Validators.required],
      fechahasta          : [new Date(), Validators.required],
      ambito              : [{ value: null, disabled: false }, Validators.required],
      tiporegistro        : [{ value: null, disabled: false }, Validators.required],
      estado              : [{ value: null, disabled: false }, Validators.required],
      servicio            : [{ value: null, disabled: false }, Validators.required],
      pieza               : [{ value: null, disabled: false }, Validators.required],
      cama                : [{ value: null, disabled: false }, Validators.required],
      tipoidentificacion  : [{ value: null, disabled: false }, Validators.required],
      numeroidentificacion: [{ value: null, disabled: false }, Validators.required],
      prioridad           : [{ value: null, disabled: false }, Validators.required]
     }
    );
   }

  ngOnInit() {

    this.onClose = new Subject();
    this.setDate();
    this.ListarEstUnidades();
    this.FormBusquedaSolPac.value.ambito = 2;
    
    this.TipoambitoService.list(this.hdgcodigo,this.esacodigo,this.cmecodigo,this.usuario,this.servidor).subscribe(
      data => {
        this.tiposambitos = data;
 
      }, err => {
        console.log(err.error);
      }
    );

    this.TiporegistroService.list(this.usuario,this.servidor).subscribe(
      data => {
        this.tiposderegistros = data;

      }, err => {
        console.log(err.error);
      }
    );
    this.PrioridadesService.list(this.usuario,this.servidor).subscribe(
      data => {
        this.prioridades = data;
      }, err => {
        console.log(err.error);
      }
    );
    this.EstadosolicitudService.list(this.usuario,this.servidor).subscribe(
      data => {
        this.estadossolicitudes = data;

      }, err => {
        console.log(err.error);
      }
    );

    this.DocidentificacionService.list(this.usuario,this.servidor).subscribe(
      data => {
        this.docsidentis = data;

      }, err => {
        console.log(err.error);
      }
    );

    
    if(this.buscasolicitud == "Solicitud_Paciente"){
    
      this.FormBusquedaSolPac.get('ambito').setValue(this.ambito)
      this.FormBusquedaSolPac.get('tipoidentificacion').setValue(this.tipodocumento);  
      this.FormBusquedaSolPac.get('numeroidentificacion').setValue(this.numeroidentificacion);
    }else{
      if(this.buscasolicitud == "Dipensar_Solicitud"){
        this.FormBusquedaSolPac.get('ambito').setValue(this.ambito)
        this.tipodocumento = null;
        this.numeroidentificacion = null;
      }
    }
    
    this.BuscarSolicitudesPacientes();
    // this.FormBusquedaSolPac.get('servicio').setValue(this.codservicioactual); 

  }

  async ListarEstUnidades() {
    const esacodigo = 1;
    try {
      this.unidades = await this.estructuraunidadesService.BuscarUnidades(
        this.hdgcodigo,
        //this.esacodigo,
        esacodigo,
        this.cmecodigo,
        this.usuario,
        this.servidor
      ).toPromise();
    } catch (err) {
      alert(err.message);
    } 
  }

  async ListarPiezas(idunidad: number) {
    const esacodigo = 1;
    this.piezas = await this.estructuraunidadesService.BuscarPiezas(
      this.hdgcodigo,
      // this.esacodigo,
      esacodigo,
      this.cmecodigo,
      idunidad,
      this.usuario,
      this.servidor,
      ''
    ).toPromise();
  }

  async ListarCamas(idpieza: number) {
    const esacodigo = 1;
    this.camas = await this.estructuraunidadesService.BuscarCamas(
      this.hdgcodigo,
      // this.esacodigo,
      esacodigo,
      this.cmecodigo,
      idpieza,
      this.usuario,
      this.servidor
    ).toPromise();
  }

  onSelectServicio(event: any) {
    this.piezas = [];
    this.camas = [];
    this.FormBusquedaSolPac.controls['cama'].disable();
    const idunidad = parseInt(event);
    this.FormBusquedaSolPac.controls['pieza'].enable();
    this.ListarPiezas(idunidad);
  }

  onSelectPieza(event: any) {
    this.camas = [];
    const idpieza = parseInt(event);
    this.FormBusquedaSolPac.controls['cama'].enable();
    this.ListarCamas(idpieza);
  }


  onCerrar(pacienteseleccionado:  ListaPacientes) {
    this.estado = true;
    this.onClose.next(pacienteseleccionado);
    this.bsModalRef.hide();
  };

  onSalir()
  {
    this.onClose.next();
    this.bsModalRef.hide();
  };

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }
  

  async BuscarSolicitudesPacientes(){

    this.listasolicitudespacientespaginacion = [];
    this.listasolicitudespacientes = [];
    var fechadesde=this.datePipe.transform(this.FormBusquedaSolPac.value.fechadesde, 'yyyy-MM-dd');
    var fechahasta=this.datePipe.transform(this.FormBusquedaSolPac.value.fechahasta, 'yyyy-MM-dd');

    this.loading = true;


    this._buscasolicitudService.BuscaSolicitudCabecera(0,this.hdgcodigo,
      this.esacodigo,this.cmecodigo,0,fechadesde,fechahasta,0,0, parseInt(this.FormBusquedaSolPac.value.estado),
      this.servidor, parseInt(this.FormBusquedaSolPac.value.prioridad), parseInt(this.FormBusquedaSolPac.controls.ambito.value),
      parseInt(this.FormBusquedaSolPac.value.servicio),parseInt(this.FormBusquedaSolPac.value.pieza),
      parseInt(this.FormBusquedaSolPac.value.cama), parseInt(this.FormBusquedaSolPac.value.tipoidentificacion),
      this.FormBusquedaSolPac.value.numeroidentificacion,this.filtrodenegocio,0).subscribe(
      response => {
        
        this.listasolicitudespacientes= response;
        this.listasolicitudespacientespaginacion = this.listasolicitudespacientes.slice(0,8);
        this.loading = false;
       
      },
      error => {
        console.log(error); 
        this.loading = false;
        this.alertSwalError.title="Error al Buscar Solicitudes";
        this.alertSwalError.text="No encuentra Solicitudes, puede que no existan. Favor intentar nuevamente";
        this.alertSwalError.show();
      } 
    );    
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listasolicitudespacientespaginacion = this.listasolicitudespacientes.slice(startItem, endItem);
  }

  Limpiar(){
    this.FormBusquedaSolPac.reset();
    this.listasolicitudespacientes = [];
    this.listasolicitudespacientespaginacion = [];
    this.FormBusquedaSolPac.get('fechadesde').setValue(new Date());
    this.FormBusquedaSolPac.get('fechahasta').setValue(new Date());

  } 

  onCerrarSalir() {
    this.estado = true;
    this.onClose.next();
    this.bsModalRef.hide();
  };
}