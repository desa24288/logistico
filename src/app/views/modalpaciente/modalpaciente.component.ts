import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject} from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PageChangedEvent } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
//import { exists } from 'fs';
/* Models*/
import { ListaPacientes } from 'src/app/models/entity/ListaPacientes';
import { Paciente } from '../../models/entity/Paciente';
import { TipoDocumentoIdentificacion } from '../../models/entity/TipoDocumentoIdentificacion';
import { Unidades } from '../../models/entity/Unidades';
import { Piezas } from '../../models/entity/Piezas';
import { Camas } from '../../models/entity/Camas';

/* Services*/
import { PacientesService } from '../../servicios/pacientes.service'
import { TipodocumentoidentService } from '../../servicios/tipodocumentoident.service';
import { EstructuraunidadesService } from '../../servicios/estructuraunidades.service';
import { Servicio } from 'src/app/models/entity/Servicio';

@Component({
  selector: 'app-modalpacienteComponent',
  templateUrl: './modalpaciente.component.html',
  styleUrls: ['./modalpaciente.component.css']
})

export class ModalpacienteComponent implements OnInit {
  @Input() hdgcodigo: number;
  @Input() esacodigo: number;
  @Input() cmecodigo: number;
  @Input() titulo: string;
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  //Arr
  public listadopacientes: Array<ListaPacientes> = [];
  public listadopacientespaginacion: Array<Paciente> = [];
  public pacientes_urgencia: Array<Paciente> = [];
  public pacientes_urgencia_paginacion: Array<Paciente> = [];
  public ambulatoriopacientes: Array<ListaPacientes> = [];
  public arreglotipodocumentoidentificacion: Array<TipoDocumentoIdentificacion> = [];
  public unidades: Array<Unidades> = [];
  public servicios : Array<Servicio> = [];
  public piezas: Array<Piezas> = [];
  public camas: Array<Camas> = [];
  public piezasurg: Array<any> = [];
  public pacientes: Array<Paciente> = [];
  //Obj
  public bsConfig: Partial<BsDatepickerConfig>;
  public hForm: FormGroup;
  public uForm: FormGroup;
  //Var
  public servidor = environment.URLServiciosRest.ambiente;
  public usuario = environment.privilegios.usuario;
  public locale = 'es';
  public colorTheme = 'theme-blue';
  public estado: boolean = false;
  public onClose: Subject<ListaPacientes>;
  public tipodoc = null;
  public filtroamb = false;
  public filtrohosp = false;
  public filtrourg = false;
  public paterno = null;
  public materno = null;
  public nombres = null;
  public loading = false;

  constructor(
    public bsModalRef: BsModalRef,
    public formBuilder: FormBuilder,
    public _PacientesService: PacientesService,
    public _TipodocumentoidentService: TipodocumentoidentService,
    public datePipe: DatePipe,
    public localeService: BsLocaleService,
    public estructuraunidadesService: EstructuraunidadesService
  ) {
    //tab Hospitalizado
    this.hForm = this.formBuilder.group({
      apellidopaterno: [{ value: null, disabled: false }, Validators.required],
      apellidomaterno: [{ value: null, disabled: false }, Validators.required],
      nombrespaciente: [{ value: null, disabled: false }, Validators.required],
      servicio: [{ value: null, disabled: false }, Validators.required],
      pieza: [{ value: null, disabled: true }, Validators.required],
      cama: [{ value: null, disabled: true }, Validators.required],
    }
    );
    //tab Urgencia
    this.uForm = this.formBuilder.group({
      servicio: [{ value: null, disabled: false }, Validators.required],
      pieza: [{ value: null, disabled: true }, Validators.required],
    }
    );
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.setDate();
    this.ListarEstUnidades();
    this.ListarEstServicios();
    this.BuscarPaciente("urgencia");

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

  onSelectServicio(event: any) {
    // this.loading = true;
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

  onSelectPieza(event: any) {
    this.loading = true;
    this.camas = [];
    this.hForm.controls['cama'].setValue(null);
    const idpieza = parseInt(event);
    this.hForm.controls['cama'].enable();
    this.ListarCamas(idpieza);
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

  onCerrar(pacienteseleccionado: ListaPacientes) {
    this.estado = true;
    this.onClose.next(pacienteseleccionado);
    this.bsModalRef.hide();
  };

  onCerrarSalir() {
    this.estado = false;
    this.bsModalRef.hide();
  };

  BuscarPaciente(tipo: string) {
    if (this.hdgcodigo > 0 && this.cmecodigo > 0 &&
      this.esacodigo > 0) {
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
                  this.pacientes = response;
                  this.listadopacientespaginacion = this.pacientes.slice(0, 8);
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
            this._PacientesService.BuscaPacientesAmbito(this.hdgcodigo, this.cmecodigo, this.esacodigo, this.paterno,
              this.materno, this.nombres, idservicio, idpieza, idcama, this.servidor,
              this.hForm.value.servicio,2).subscribe(
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
  }

  Limpiar() {
    this.pacientes = [];
    this.listadopacientespaginacion = [];
    this.hForm.reset();
    this.uForm.reset();
    this.hForm.controls['pieza'].disable();
    this.hForm.controls['cama'].disable();
    this.uForm.controls['pieza'].disable();
    this.ListarEstUnidades();

  }

  /* Función búsqueda con paginación */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    // this.listadopacientespaginacion = this.listadopacientes.slice(startItem, endItem);
    this.listadopacientespaginacion = this.pacientes.slice(startItem, endItem);
  }

  pageChangedUrgencia(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    // this.listadopacientespaginacion = this.listadopacientes.slice(startItem, endItem);
    this.pacientes_urgencia_paginacion = this.pacientes_urgencia.slice(startItem, endItem);
  }


  // seteo de fechas
  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }
}