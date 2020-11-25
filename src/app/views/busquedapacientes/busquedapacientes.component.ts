import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PacientesService }  from '../../servicios/pacientes.service'
import { environment } from 'src/environments/environment';
import { ListaPacientes } from 'src/app/models/entity/ListaPacientes';
import { PageChangedEvent } from 'ngx-bootstrap';
import  { TipodocumentoidentService } from '../../servicios/tipodocumentoident.service';
import  { TipoDocumentoIdentificacion } from '../../models/entity/TipoDocumentoIdentificacion';


// uso de fechas 
import { DatePipe } from '@angular/common';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { Servicio } from 'src/app/models/entity/Servicio';
import { EstructuraunidadesService } from '../../servicios/estructuraunidades.service';
import { Piezas } from '../../models/entity/Piezas';
import { Camas } from '../../models/entity/Camas';
import { Paciente } from '../../models/entity/Paciente';
import { Unidades } from '../../models/entity/Unidades';

 
@Component({
  selector: 'app-busquedapacientes',
  templateUrl: './busquedapacientes.component.html',
  styleUrls: ['./busquedapacientes.component.css']
})

export class BusquedapacientesComponent implements OnInit {
  @Input() hdgcodigo: number;
  @Input() esacodigo: number;
  @Input() cmecodigo: number;
  @Input() titulo   : string;
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  @ViewChild('alertSwalConfirmar', { static: false }) alertSwalConfirmar: SwalComponent;

  // para manejo de fechas
  public locale = 'es';
  public bsConfig: Partial<BsDatepickerConfig>;
  public colorTheme = 'theme-blue';
  public loading = false;
  public lForm: FormGroup;
  public uForm: FormGroup;
  public hForm: FormGroup;
  public movimfarid: number = 0;
  public movimfecha: string;
  public onClose: Subject<ListaPacientes>;
  public estado: boolean = false;
  public servidor = environment.URLServiciosRest.ambiente;
  public usuario  = environment.privilegios.usuario;

  public arreglotipodocumentoidentificacion: Array<TipoDocumentoIdentificacion> =[];
  public servicios : Array<Servicio> = [];
  public piezas: Array<Piezas> = [];
  public camas: Array<Camas> = [];
  public filtrohosp = false;
  public paterno = null;
  public materno = null;
  public nombres = null;
  public listadopacienteshosp: Array<Paciente> = [];
  public listadopacienteshosppaginacion: Array<Paciente> = [];
  public pacientes_urgencia_paginacion: Array<Paciente> = [];
  public pacientes_urgencia: Array<Paciente> = [];
  public listadopacientes: Array<Paciente> = [];
  public listadopacientespaginacion: Array<Paciente> = [];

  
  public unidades: Array<Unidades> = [];
  public filtrourg = false;
  public piezasurg: Array<any> = [];
  public filtroamb = false;


  constructor(
    public bsModalRef: BsModalRef,
    public formBuilder: FormBuilder,
    public _PacientesService: PacientesService,
    public _TipodocumentoidentService : TipodocumentoidentService, 
  // para manejo de fechas
    public datePipe: DatePipe,
    public localeService: BsLocaleService,
    public estructuraunidadesService: EstructuraunidadesService

   ) 
    {
    this.lForm = this.formBuilder.group({
      tipoidentificacion: [{ value: null, disabled: false }, Validators.required],
      numeroidentificacion: [{ value: null, disabled: false }, Validators.required],
      apellidopaterno: [{ value: null, disabled: false }, Validators.required],
      apellidomaterno: [{ value: null, disabled: false }, Validators.required],
      nonbrespaciente: [{ value: null, disabled: false }, Validators.required],

     }
    );

    this.uForm = this.formBuilder.group({
      servicio: [{ value: null, disabled: false }, Validators.required],
      pieza: [{ value: null, disabled: true }, Validators.required],

     }
    );

    this.hForm = this.formBuilder.group({
      apellidopaterno: [{ value: null, disabled: false }, Validators.required],
      apellidomaterno: [{ value: null, disabled: false }, Validators.required],
      nombrespaciente: [{ value: null, disabled: false }, Validators.required],
      servicio       : [{ value: null, disabled: false }, Validators.required],
      pieza          : [{ value: null, disabled: true }, Validators.required],
      cama           : [{ value: null, disabled: true }, Validators.required],
    }
    );
  }


  ngOnInit() 
  {

    this.onClose = new Subject();
    this.setDate();
    this.ListarEstUnidades();
    this.ListarEstServicios();

    this._TipodocumentoidentService.list(this.usuario,this.servidor).subscribe(
      data => {
        this.arreglotipodocumentoidentificacion = data;
      }, err => {
        console.log(err.error);
      }
    );

    this.BuscarPaciente('urgencia');

    
  }

  onCerrar(pacienteseleccionado:  ListaPacientes) {

    this.estado = true;
    this.onClose.next(pacienteseleccionado);
    this.bsModalRef.hide();
  };

  onCerrarSalir() {
    this.estado = false;
    this.bsModalRef.hide();
  };

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
    });
  }


  async BuscarPacienteFiltro(in_tipodocuemto:number,in_numerodocumento: string, in_paterno : string,
  in_materno: string, in_nombres : string )
  {  
    this.loading = true;

    if (in_numerodocumento == null ) {
    } else {in_numerodocumento = in_numerodocumento.toUpperCase() };
    if (in_paterno == null ) {
    } else {in_paterno = in_paterno.toUpperCase() };

    if (in_materno == null ) {
    } else {in_materno = in_materno.toUpperCase() };

    if (in_nombres == null ) {
    } else {in_nombres = in_nombres.toUpperCase() };
         
    if (in_nombres == null ) {
    } else {in_nombres = in_nombres.toUpperCase() };
          
    let respuesta:any;

    try {
      respuesta = await this._PacientesService.BuscaListaPacientes(this.hdgcodigo  , this.cmecodigo
      ,in_tipodocuemto,in_numerodocumento, in_paterno, in_materno, in_nombres
      ,this.usuario,this.servidor).toPromise();
   
      this.listadopacientes = respuesta;
      this.listadopacientespaginacion = this.listadopacientes.slice(0, 8);

      this.loading = false;

    } catch (error) {
      this.alertSwalError.text = error.message;
      this.alertSwalError.show();
      this.loading = false;

    }
  }               
   
  /* Función búsqueda con paginación */

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listadopacientespaginacion = this.listadopacientes.slice(startItem, endItem);
  }

  pageChangedhosp(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listadopacienteshosppaginacion = this.listadopacienteshosp.slice(startItem, endItem);
  }

  // seteo de fechas

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  Limpiar() {
    this.lForm.reset();
    this.listadopacientes= [];
    this.listadopacientespaginacion = [];
    
  }

  async ListarEstServicios() {
    try {
      this.loading = true;
      this.servicios = await this.estructuraunidadesService.BuscarServicios(
        this.hdgcodigo,
        this.esacodigo,
        this.cmecodigo,
        this.usuario,
        this.servidor,
        3,
        ''
      ).toPromise();
      
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

  onSelectServicio(event: any) {
    // this.loading = true;
    // console.log(event)
    this.filtrohosp = true;
    this.piezas = [];
    this.camas = [];
    this.hForm.controls['pieza'].setValue(null);
    this.hForm.controls['cama'].setValue(null);
    this.hForm.controls['cama'].disable();
    const codservicio = event;

    this.hForm.controls['pieza'].enable();
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
    this.hForm.controls['cama'].setValue(null);
    const idpieza = parseInt(event);
    this.hForm.controls['cama'].enable();
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

  //Busca paciente hospitalizado
  BuscarPaciente(tipo: string) {
    switch (tipo) {
      case 'hospitalizado':
     
        this.paterno = this.hForm.controls['apellidopaterno'].value;
        this.materno = this.hForm.controls['apellidomaterno'].value;
        this.nombres = this.hForm.controls['nombrespaciente'].value;
        var idservicio = parseInt(this.hForm.controls['servicio'].value);
        var idpieza = parseInt(this.hForm.controls['pieza'].value);
        var idcama = parseInt(this.hForm.controls['cama'].value);
        this.loading = true;
        this._PacientesService.BuscaPacientesAmbito(this.hdgcodigo, this.cmecodigo, this.esacodigo, this.paterno,
          this.materno, this.nombres, idservicio, idpieza, idcama, this.servidor,
          this.hForm.value.servicio,3).subscribe(
            response => {
              this.listadopacienteshosp = response;
              this.listadopacienteshosppaginacion = this.listadopacienteshosp.slice(0, 8);
              this.loading = false;
            },
            error => {
              console.log(error);
              this.alertSwalError.title = 'Error '.concat(error.message);
              this.alertSwalError.show();
              this.loading = false;
            });
        break;
      case 'urgencia':

          this.loading = true;
          this._PacientesService.BuscaPacientesAmbito(this.hdgcodigo, this.cmecodigo, this.esacodigo,'', '', '', 0, 0, 0, this.servidor,'',2).subscribe(
              response => {
           
                this.pacientes_urgencia = response;
                this.pacientes_urgencia_paginacion = this.pacientes_urgencia.slice(0, 8);
                this.loading = false;
              },
              error => {
                console.log(error);
                this.alertSwalError.title = 'Error '.concat(error.message);
                this.alertSwalError.show();
                this.loading = false;
              });
          break;
 
    }
  }

   /* Función búsqueda con paginación */

   pageChanged2(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listadopacienteshosppaginacion = this.listadopacienteshosp.slice(startItem, endItem);
  }

  pageChangedUrgencia(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pacientes_urgencia_paginacion = this.pacientes_urgencia.slice(startItem, endItem);
  }
  

  onSelectServioUgencia(event: any) {
    this.loading = true;
    this.filtrourg = true;
    this.piezasurg = [];
    const idunidadurg = parseInt(event);
    this.uForm.controls['pieza'].setValue(null);
    this.uForm.controls['pieza'].enable();
    this.ListarPiezasUrg(idunidadurg);
  }

  async ListarPiezasUrg(idunidadurg: number) {
    this.loading = true;
    this.piezasurg = await this.estructuraunidadesService.BuscarPiezas(
      this.hdgcodigo,
      this.esacodigo,
      this.cmecodigo,
      idunidadurg,
      this.usuario,
      this.servidor,
      ''
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
}