import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap';
import { MovimientoInterfaz } from 'src/app/models/entity/movimiento-interfaz';
import { InterfacesService } from 'src/app/servicios/interfaces.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { MovimientoInterfazBodegas } from 'src/app/models/entity/movimiento-interfaz-bodegas';
import { EstructuraFin700 } from 'src/app/models/entity/estructura-fin700';
import { Solicitud } from '../../models/entity/Solicitud';
//import { RutValidator } from 'ng2-rut';

@Component({
  selector: 'app-busquedacuentas',
  templateUrl: './busquedacuentas.component.html',
  styleUrls: ['./busquedacuentas.component.css']
})
export class BusquedacuentasComponent implements OnInit {
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
  public FormBusquedapaciente: FormGroup;
  public servidor = environment.URLServiciosRest.ambiente;
  public usuario = environment.privilegios.usuario;
  public listabodegas: Array<MovimientoInterfazBodegas> = [];
  public listabodegasPaginacion: Array<MovimientoInterfazBodegas> = [];
  public listapacientes: Array<MovimientoInterfazBodegas> = [];
  public listapacientesPaginacion: Array<MovimientoInterfazBodegas> = [];
  public _PageChangedEvent: PageChangedEvent;
  public canidad_movimiento_bodegas: number;
  public canidad_movimiento_pacientes: number;
  public opcion_bodegas: boolean;
  public opcion_pacientes: boolean;  
  public _MovimientoInterfazBodegas: MovimientoInterfazBodegas;
  public pageChangedSolicitudpacientes: Array<Solicitud> = [];
  public FormBusquedasolicitud: FormGroup;

  constructor(
    private _interfacesService : InterfacesService,
    public datePipe: DatePipe,
    public localeService: BsLocaleService,
    public formBuilder: FormBuilder,
   // public rutValidator: RutValidator,
    ) {
      this.FormBusquedasolicitud = this.formBuilder.group({
        nrosolicitud: [{ value: null, disabled: false }, Validators.required],
        folio: [{ value: null, disabled: false }],
        ficha: [{ value: null, disabled: false }],
        nroreceta: [{ value: null, disabled: false }],
        codproducto: [{ value: null, disabled: false }],
        nombreproducto: [{ value: null, disabled: false }]
      });
  
      this.FormBusquedapaciente = this.formBuilder.group({
        fechadesde: [new Date(), Validators.required],
        fechahasta: [new Date(), Validators.required],
   //     rutpaciente: [null, [Validators.required, rutValidator]],
        nombrepaciente: [{ value: null, disabled: false }],
        paternopaciente: [{ value: null, disabled: false }],
        maternopaciente: [{ value: null, disabled: false }]
      },
      {
        validator: [
          // DateMenorValidation('fechadesde', 'fechahasta'),
          // DateRangeValidation('fechadesde', 'fechahasta', 31)
        ]
      });
    }

  ngOnInit() {
    this.setDate();
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();
    this.canidad_movimiento_bodegas= 0;
    this.canidad_movimiento_pacientes = 0;
    this.opcion_bodegas = false;
    this.opcion_pacientes = false;
    this.BuscarMovimientoInterfazERP();
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }
  
  BuscarMovimientoInterfazERP() {
          this.listapacientes = [];
          this.listapacientesPaginacion = [];
          this.canidad_movimiento_pacientes = 0;
          this.listabodegas = [];
          this.listabodegasPaginacion = [];
          this.canidad_movimiento_bodegas =0;
          var fechadesde = this.datePipe.transform(this.FormBusquedapaciente.value.fechadesde, 'yyyy-MM-dd');
          var fechahasta = this.datePipe.transform(this.FormBusquedapaciente.value.fechahasta, 'yyyy-MM-dd');
          this.loading = true;
          this._MovimientoInterfazBodegas = new(MovimientoInterfazBodegas)
          this._MovimientoInterfazBodegas.hdgcodigo =  Number(sessionStorage.getItem('hdgcodigo').toString())
          this._MovimientoInterfazBodegas.esacodigo = Number(sessionStorage.getItem('cmecodigo').toString())
          this._MovimientoInterfazBodegas.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString())
          this._MovimientoInterfazBodegas.fechainicio = fechadesde
          this._MovimientoInterfazBodegas.fechatermino = fechahasta
          this._MovimientoInterfazBodegas.servidor     = this.servidor
          this._interfacesService.listamovimientointerfaz(this._MovimientoInterfazBodegas).subscribe(
            response => {
              if (response.length == 0) {
                return;
              } else {
                this.listapacientes = response
              }
              this.listapacientesPaginacion = this.listapacientes.slice(0, 10);
              this.canidad_movimiento_pacientes= this.listapacientes.length;
            });
          this._interfacesService.listarmovimientointerfazbodegas(this._MovimientoInterfazBodegas).subscribe(
            response => {
              if (response.length == 0) {
                return;
              } else {
                this.listabodegas = response;
              }
              this.listabodegasPaginacion = this.listabodegas.slice(0, 10);
              this.canidad_movimiento_bodegas = this.listabodegas.length; 
            });
          this.loading = false
  }

  refrescar() {
    this.BuscarMovimientoInterfazERP()
  }
        
  eleccionopcion(opcion: string) {
    switch (opcion) {
      case 'BODEGAS': {
        this.opcion_bodegas = true;
        this.opcion_pacientes = false;
        break;
      }
      case 'PACIENTES': {
        this.opcion_bodegas = false;
        this.opcion_pacientes = true;

        break;
      }
              
      default: {
        this.opcion_bodegas = false;
        this.opcion_pacientes = true;

        break;
      }
    }
  }
  
  Enviar_bodegas(registro: MovimientoInterfazBodegas) {
    this.alertSwalError.text = '';
    this.alertSwalError.title = '';
    this.alertSwalError.titleText = '';
    registro.usuario = sessionStorage.getItem('Usuario').toString();
    registro.servidor = this.servidor;
    var _EstructuraFin700 = new(EstructuraFin700);
    _EstructuraFin700.hdgcodigo = registro.hdgcodigo;
    _EstructuraFin700.idagrupador = 0;
    _EstructuraFin700.numeromovimiento = registro.id;
    _EstructuraFin700.servidor = this.servidor;
    _EstructuraFin700.tipomovimiento = 0;
    this._interfacesService.enviarErp(_EstructuraFin700).subscribe(
        response => {
          if (response.respuesta > "0") {
            this.alertSwalError.title = "Envío al ERP exitoso";
            this.alertSwalError.show();
            this.loading = false;
            this.refrescar();
            return;
          }
          else {
            this.alertSwalError.title = "Envío al ERP con ERRORES";
            this.alertSwalError.show();
            this.loading = false;
            this.refrescar();
            return;
          }
        });
    }
  


    
    Enviar_pacientes(registro: MovimientoInterfaz) {

      registro.usuario = sessionStorage.getItem('Usuario').toString();
      registro.servidor = this.servidor;

      var _EstructuraFin700 = new(EstructuraFin700)
      
      _EstructuraFin700.hdgcodigo = registro.hdgcodigo
      _EstructuraFin700.idagrupador = 0
      _EstructuraFin700.numeromovimiento = registro.fdeid 
      _EstructuraFin700.servidor = this.servidor
      _EstructuraFin700.tipomovimiento = 0



      this._interfacesService.enviarErp(_EstructuraFin700).subscribe(
        response => {
          if (response.respuesta > "0") {
                     this.alertSwalError.title = "Envío al ERP exitoso";
                      this.alertSwalError.show();
                      this.loading = false;
                      this.refrescar();
                      return;

          }
          else {
            this.alertSwalError.title = "Envío al ERP con ERRORES";
            this.alertSwalError.show();
            this.loading = false;
            this.refrescar();
            return;

          }

        }
      )

    }
  
    pageChangedMovimientosBodegas(event: PageChangedEvent): void {
      const startItem = (event.page - 1) * event.itemsPerPage;
      const endItem = event.page * event.itemsPerPage;
      this.listabodegasPaginacion = this.listabodegas.slice(startItem, endItem);
    }




    pageChangedMovimientosPacientes(event: PageChangedEvent): void {
      const startItem = (event.page - 1) * event.itemsPerPage;
      const endItem = event.page * event.itemsPerPage;
      this.listapacientesPaginacion = this.listapacientes.slice(startItem, endItem);
    }
  
    onCargospaciente() {
      console.log('click onCargospaciente()');
    }

    onLimpiar() {
      console.log('btn Limpiar()');
    }  

    onLimpiarbusqueda() {
      console.log('btn Limpiarbusqueda()');
    }

    onBuscarsolicitudes() {
      var fechadesde = this.datePipe.transform(this.FormBusquedapaciente.value.fechadesde, 'yyyy-MM-dd');
      var fechahasta = this.datePipe.transform(this.FormBusquedapaciente.value.fechahasta, 'yyyy-MM-dd');
      console.log('onBuscarsolicitudes()');
      console.log(fechadesde);
      console.log(fechahasta);
    }

    onSelect(event: any) {
      console.log(event);
    }
}
  