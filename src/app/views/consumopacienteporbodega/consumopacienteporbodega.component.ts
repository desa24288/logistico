import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../../environments/environment';
import { esLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { DatePipe } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Permisosusuario } from '../../permisos/permisosusuario';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DocIdentificacion } from '../../models/entity/DocIdentificacion';
import { BodegasTodas } from 'src/app/models/entity/BodegasTodas';
import { ConsultaPacientePorBodegas } from 'src/app/models/entity/ConsultaPacientePorBodegas';
import { Solicitud } from '../../models/entity/Solicitud';
import { ModalpacienteComponent } from '../modalpaciente/modalpaciente.component';
import { PacientesService } from '../../servicios/pacientes.service';
import { DocidentificacionService } from '../../servicios/docidentificacion.service';
import { BodegasService } from '../../servicios/bodegas.service';
import { InformesService } from '../../servicios/informes.service';

@Component({
  selector: 'app-consumopacienteporbodega',
  templateUrl: './consumopacienteporbodega.component.html',
  styleUrls: ['./consumopacienteporbodega.component.css'],
  providers : [InformesService]
})
export class ConsumopacienteporbodegaComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  @ViewChild('alertSwalConfirmar', { static: false }) alertSwalConfirmar: SwalComponent;

  public modelopermisos           : Permisosusuario = new Permisosusuario();
  public FormConsumoPacienteBodega: FormGroup;
  public servidor                 = environment.URLServiciosRest.ambiente;
  public usuario                  = environment.privilegios.usuario;
  public hdgcodigo                : number;
  public esacodigo                : number;
  public cmecodigo                : number;
  public locale                   = 'es';
  public bsConfig                 : Partial<BsDatepickerConfig>;
  public colorTheme               = 'theme-blue';
  public detalleConsultaPacienteBodegas : Array<ConsultaPacientePorBodegas> = [];
  public detalleConsultaPacienteBodegasPaginacion : Array<ConsultaPacientePorBodegas> = [];
  public docsidentis              : Array<DocIdentificacion> = [];
  public bodegasSolicitantes      : Array<BodegasTodas> = [];
  public dataPacienteSolicitud    : Solicitud = new Solicitud();
  public activabodega             : boolean = false;
  public activabtnbuscar          : boolean = false;
  private _BSModalRef             : BsModalRef;
  public loading                  = false;
  public imprime                  : boolean = false;
  public alerts                   : Array<any> = [];

  constructor(
    public datePipe                 : DatePipe,
    public localeService            : BsLocaleService,
    public DocidentificacionService : DocidentificacionService,
    public formBuilder              : FormBuilder,
    public _BsModalService          : BsModalService,
    public _BodegasService          : BodegasService,
    private _imprimesolicitudService: InformesService,
    public _PacientesService        : PacientesService,
  ) {

    this.FormConsumoPacienteBodega = this.formBuilder.group({

      hdgcodigo     : [{ value: null, disabled: false }, Validators.required],
      esacodigo     : [{ value: null, disabled: false }, Validators.required],
      cmecodigo     : [{ value: null, disabled: false }, Validators.required],
      tipodocumento : [{ value: null, disabled: false }, Validators.required],
      numidentificacion: [{ value: null, disabled: false }, Validators.required],
      apematerno    : [{ value: null, disabled: false }, Validators.required],
      apepaterno    : [{ value: null, disabled: false }, Validators.required],
      nombres       : [{ value: null, disabled: false }, Validators.required],
      nombrepaciente: [{ value: null, disabled: true }, Validators.required],
      fechadesde    : [null, Validators.required],
      fechahasta    : [new Date(), Validators.required],

      bodcodigo     : [{ value: null, disabled: false }, Validators.required],
      servicio      : [{ value: 1, disabled: false }, Validators.required],

      numsolicitud  : [{ value: null, disabled: false}, Validators.required],
    });
   }

  ngOnInit() {

    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();

    this.FormConsumoPacienteBodega.controls.bodcodigo.disable();
    // this.FormConsumoPacienteBodega.controls.numidentificacion.disable();
    // this.FormConsumoPacienteBodega.controls.apepaterno.disable();
    // this.FormConsumoPacienteBodega.controls.apematerno.disable();
    // this.FormConsumoPacienteBodega.controls.nombres.disable();
    // this.FormConsumoPacienteBodega.controls.fechadesde.disable();
    // this.FormConsumoPacienteBodega.controls.fechahasta.disable();
    this.getParametros();
    this.setDate();
    this.BuscaBodegaSolicitante();
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme,  isAnimated: true });
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  async getParametros() {
    try {
      this.docsidentis = await this.DocidentificacionService.list(this.usuario, this.servidor)
        .toPromise();
        console.log("tiposdoc:",this.docsidentis)
      // this.tipoambitos = await this._tipoambitoService.list(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor)
      //   .toPromise();
      // this.estadosolicitudes = await this._estadosolicitudesService.list(this.usuario, this.servidor)
      //   .toPromise();
    } catch (err) {
      this.alertSwalAlert.text = err.message;
      this.alertSwalAlert.show();
    }
  }

  BuscaBodegaSolicitante() {
    this._BodegasService.listaBodegaTodasSucursal(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor).subscribe(
      response => {
        if (response != null){
          this.bodegasSolicitantes = response;
        }
      },
      error => {
        alert("Error al Cargar Bodegas");
      }
    );
  }

  SeleccionTipoDoc(){
    this.FormConsumoPacienteBodega.controls.numidentificacion.enable();
    this.FormConsumoPacienteBodega.controls.apepaterno.enable();
    this.FormConsumoPacienteBodega.controls.apematerno.enable();
    this.FormConsumoPacienteBodega.controls.nombres.enable();
    this.FormConsumoPacienteBodega.controls.fechadesde.enable();
    this.FormConsumoPacienteBodega.controls.fechahasta.enable();
  }

  getPacienteTipoDoc(){
    this.loading = true;

    this._PacientesService.BuscaPacientesAmbito(this.hdgcodigo, this.cmecodigo, this.esacodigo,
      this.FormConsumoPacienteBodega.controls.tipodocumento.value,
      this.FormConsumoPacienteBodega.controls.numidentificacion.value,
      this.FormConsumoPacienteBodega.controls.apepaterno.value,
      this.FormConsumoPacienteBodega.controls.apematerno.value,
      this.FormConsumoPacienteBodega.controls.nombres.value,null,null,null,
      this.servidor,null,0).subscribe(
        response => {
          if (response != null){
            if(response.length === 1){
              this.dataPacienteSolicitud = response[0];
              this.FormConsumoPacienteBodega.get('tipodocumento').setValue(this.dataPacienteSolicitud.tipodocpac);
              this.FormConsumoPacienteBodega.get('numidentificacion').setValue(this.dataPacienteSolicitud.numdocpac);
              this.FormConsumoPacienteBodega.get('apepaterno').setValue(this.dataPacienteSolicitud.apepaternopac);
              this.FormConsumoPacienteBodega.get('apematerno').setValue(this.dataPacienteSolicitud.apematernopac);
              this.FormConsumoPacienteBodega.get('nombres').setValue( this.dataPacienteSolicitud.nombrespac);
              this.FormConsumoPacienteBodega.controls.bodcodigo.enable();
              this.FormConsumoPacienteBodega.controls.numidentificacion.disable();
              this.FormConsumoPacienteBodega.controls.apepaterno.disable();
              this.FormConsumoPacienteBodega.controls.apematerno.disable();
              this.FormConsumoPacienteBodega.controls.nombres.disable();
              this.loading = false;
            }else{
              if(response.length >0){
                // console.log("LEvanta modal busqueda aciente");
                var valida = false;
                response.forEach(x=>{
                  response.forEach(z=>{
                    if(x.cliid != z.cliid){
                      valida = true;
                    }
                  });
                });
                if(valida){
                  this.BuscarPaciente();
                }else{
                  this.dataPacienteSolicitud = response[0];
                  this.FormConsumoPacienteBodega.get('tipodocumento').setValue(this.dataPacienteSolicitud.tipodocpac);
                  this.FormConsumoPacienteBodega.get('numidentificacion').setValue(this.dataPacienteSolicitud.numdocpac);
                  this.FormConsumoPacienteBodega.get('apepaterno').setValue(this.dataPacienteSolicitud.apepaternopac);
                  this.FormConsumoPacienteBodega.get('apematerno').setValue(this.dataPacienteSolicitud.apematernopac);
                  this.FormConsumoPacienteBodega.get('nombres').setValue( this.dataPacienteSolicitud.nombrespac)

                  this.FormConsumoPacienteBodega.controls.bodcodigo.enable();

                  this.FormConsumoPacienteBodega.controls.numidentificacion.disable();
                  this.FormConsumoPacienteBodega.controls.apepaterno.disable();
                  this.FormConsumoPacienteBodega.controls.apematerno.disable();
                  this.FormConsumoPacienteBodega.controls.nombres.disable();
                  this.loading = false;
                }

              }
              if(response.length===0){
                this.alertSwalAlert.title = "No existe Paciente";
                this.alertSwalAlert.show();
                this.loading = false;
              }
            }
          } else {
            this.loading = false;
          }
        });
  }

  ActivaBotonBuscar(){
    this.activabtnbuscar = true;
  }

  BuscarPaciente() {

    this._BSModalRef = this._BsModalService.show(ModalpacienteComponent, this.setModal("Búsqueda de ".concat('Paciente')));
    this._BSModalRef.content.onClose.subscribe((Retorno: any) => {

      if (Retorno !== undefined) {
        this.loading = false;
        this.dataPacienteSolicitud = Retorno;
        this.FormConsumoPacienteBodega.get('tipodocumento').setValue(this.dataPacienteSolicitud.tipodocpac);
        this.FormConsumoPacienteBodega.get('numidentificacion').setValue(this.dataPacienteSolicitud.numdocpac);
        this.FormConsumoPacienteBodega.get('apepaterno').setValue(this.dataPacienteSolicitud.apepaternopac);
        this.FormConsumoPacienteBodega.get('apematerno').setValue(this.dataPacienteSolicitud.apematernopac);
        this.FormConsumoPacienteBodega.get('nombres').setValue(this.dataPacienteSolicitud.nombrespac)

        this.FormConsumoPacienteBodega.controls.bodcodigo.enable();
        this.FormConsumoPacienteBodega.controls.numidentificacion.disable();
        this.FormConsumoPacienteBodega.controls.apepaterno.disable();
        this.FormConsumoPacienteBodega.controls.apematerno.disable();
        this.FormConsumoPacienteBodega.controls.nombres.disable();
      }
    })
  }

  setModal(titulo: string) {
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
        //ambito: this.FormDatosPaciente.controls.ambito.value, //this.FormDatosPaciente.value.ambito,
        nombrepaciente: this.FormConsumoPacienteBodega.controls.nombres.value,
        apepaternopac:  this.FormConsumoPacienteBodega.controls.apepaterno.value,
        apematernopac: this.FormConsumoPacienteBodega.controls.apematerno.value,
        // codservicioactual: this.dataPacienteSolicitud.codservicioactual,
        tipodocpac: this.FormConsumoPacienteBodega.controls.tipodocumento.value,
        numdocpac: this.FormConsumoPacienteBodega.controls.numidentificacion.value,
        buscasolicitud: "Solicitud_Paciente",
        // descprod: this.descprod,
        // codprod: this.codprod
      }
    };
    return dtModal;
  }

  limpiar(){
    this.activabtnbuscar = false;
    this.FormConsumoPacienteBodega.controls.bodcodigo.enable();
    this.FormConsumoPacienteBodega.controls.numidentificacion.enable();
    this.FormConsumoPacienteBodega.controls.apepaterno.enable();
    this.FormConsumoPacienteBodega.controls.apematerno.enable();
    this.FormConsumoPacienteBodega.controls.nombres.enable();
    this.FormConsumoPacienteBodega.controls.fechadesde.enable();
    this.FormConsumoPacienteBodega.controls.fechahasta.enable();
    this.FormConsumoPacienteBodega.reset();
    this.FormConsumoPacienteBodega.get('fechahasta').setValue(new Date());
    this.FormConsumoPacienteBodega.get('fechadesde').setValue(null);
    this.imprime = false;
    this.detalleConsultaPacienteBodegas = [];
    this.detalleConsultaPacienteBodegasPaginacion = [];
  }

  BuscarConsumo(){
    // console.log("Busca el consumo del paciente:",this.FormConsumoPacienteBodega.controls.tipodocumento.value,
    // this.FormConsumoPacienteBodega.controls.numidentificacion.value,
    // this.FormConsumoPacienteBodega.controls.apepaterno.value,
    // this.FormConsumoPacienteBodega.controls.apematerno.value,
    // this.FormConsumoPacienteBodega.controls.nombres.value,
    // this.datePipe.transform( this.FormConsumoPacienteBodega.controls.fechahasta.value, 'yyyy-MM-dd'),
    // this.datePipe.transform(this.FormConsumoPacienteBodega.controls.fechadesde.value, 'yyyy-MM-dd'),
    // this.FormConsumoPacienteBodega.controls.bodcodigo.value)

    this.loading = true;

    this._PacientesService.ConsumoPacientesPorBodegas(this.servidor,this.hdgcodigo,
      this.esacodigo,this.cmecodigo,
      this.datePipe.transform(this.FormConsumoPacienteBodega.controls.fechadesde.value, 'yyyy-MM-dd'),
      this.datePipe.transform( this.FormConsumoPacienteBodega.controls.fechahasta.value, 'yyyy-MM-dd'),
      this.FormConsumoPacienteBodega.controls.numidentificacion.value,
      this.FormConsumoPacienteBodega.controls.nombres.value,
      this.FormConsumoPacienteBodega.controls.apepaterno.value,
      this.FormConsumoPacienteBodega.controls.apematerno.value, null,null,null,null,null,null,
      this.FormConsumoPacienteBodega.controls.tipodocumento.value,
      this.FormConsumoPacienteBodega.controls.bodcodigo.value
      ).subscribe(
        response => {
          if (response != null) {
            if(response.length >0){
              this.detalleConsultaPacienteBodegas = response;
              this.detalleConsultaPacienteBodegasPaginacion = this.detalleConsultaPacienteBodegas.slice(0,20);
              // console.log("response:",this.detalleConsultaPacienteBodegas);
              this.imprime = true;
              this.loading = false;
            }else{
              this.alertSwalAlert.title ="No hay información para los datos ingresados";
              this.alertSwalAlert.show();
              this.loading = false;
            }
          }
          this.loading = false;
        },
        error => {
          console.log(error);
          this.alertSwalError.title = 'Error '.concat(error.message);
          this.alertSwalError.show();
          this.loading = false;
        });

  }

  /* Función búsqueda con paginación */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.detalleConsultaPacienteBodegasPaginacion = this.detalleConsultaPacienteBodegas.slice(startItem, endItem);
  }

  onImprimir(){
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Consulta ?',
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

    // this._imprimesolicitudService.RPTImprimeConsumoPacienteXBodegas(this.servidor,this.hdgcodigo,
    // this.esacodigo, this.cmecodigo,"pdf",this._Solicitud.soliid).subscribe(
    //   response => {

    //     window.open(response[0].url, "", "", true);
    //     // this.alertSwal.title = "Reporte Impreso Correctamente";
    //     // this.alertSwal.show();
    //   },
    //   error => {
    //     console.log(error);
    //     this.alertSwalError.title = "Error al Imprimir Listado";
    //     this.alertSwalError.show();
    //     this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
    //     })
    //   }
    // );
  }

}
