
import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BusquedasolicitudpacientesComponent } from '../busquedasolicitudpacientes/busquedasolicitudpacientes.component';
import { Solicitud } from '../../models/entity/Solicitud';
import { DispensarsolicitudesService } from '../../servicios/dispensarsolicitudes.service';
import { DocIdentificacion } from '../../models/entity/DocIdentificacion';
import { DocidentificacionService } from '../../servicios/docidentificacion.service';
import { DetalleSolicitud } from 'src/app/models/entity/DetalleSolicitud';

import { DespachoDetalleSolicitud } from 'src/app/models/entity/DespachoDetalleSolicitud';
import { DespachoSolicitud } from '../../models/entity/DespachoSolicitud';
import { EventosSolicitudComponent } from '../eventos-solicitud/eventos-solicitud.component';
import { EventosDetallesolicitudComponent } from '../eventos-detallesolicitud/eventos-detallesolicitud.component';
import { SolicitudService } from 'src/app/servicios/Solicitudes.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Detallelote } from '../../models/entity/Detallelote';
import { InformesService } from '../../servicios/informes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Permisosusuario } from '../../permisos/permisosusuario';

@Component({
  selector: 'app-dispensarsolicitudpaciente',
  templateUrl: './dispensarsolicitudpaciente.component.html',
  styleUrls: ['./dispensarsolicitudpaciente.component.css'],
  providers: [DispensarsolicitudesService, InformesService]
})
export class DispensarsolicitudpacienteComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public modelopermisos: Permisosusuario = new Permisosusuario();
  public hdgcodigo: number;
  public esacodigo: number;
  public cmecodigo: number;
  public servidor = environment.URLServiciosRest.ambiente;
  public usuario = environment.privilegios.usuario;
  ctaid: number = 0;
  cliid: number = 0;
  estid: number = 0;
  public validacombolote: boolean = false;
  public validadato: boolean = false;
  public lote: string;
  public fechavto: string;
  public tiporegistro: string;
  public locale = 'es';
  public bsConfig: Partial<BsDatepickerConfig>;
  public colorTheme = 'theme-blue';
  public FormDispensaSolicitudPaciente: FormGroup;
  public FormDispensaDetalle: FormGroup;
  public docsidentis: Array<DocIdentificacion> = [];
  public DispensaSolicitud: DespachoSolicitud;
  detallesolicitudpaciente: DetalleSolicitud[] = [];
  detallesolicitudpacientepaginacion: DetalleSolicitud[] = [];
  public varDespachoDetalleSolicitud: DespachoDetalleSolicitud;
  paramdespachos: DespachoDetalleSolicitud[] = [];
  public varListaDetalleDespacho: DetalleSolicitud;
  public detallessolicitudes: Array<DespachoDetalleSolicitud> = [];
  public temporaldetallesolicitudes: Array<DespachoDetalleSolicitud> = [];
  public detallessolicitudespaginacion: Array<DespachoDetalleSolicitud> = [];
  public solicitudpaciente: Solicitud;
  public detalleslotes: Detallelote[] = [];

  private _BSModalRef: BsModalRef;
  public codambito = 0;
  public codexiste: boolean = false;

  public existsolicitud = false;
  public activabtnagrega: boolean = false;
  /**Activa btn Imprimir */
  public btnImprime = false;
  public activabtndispensar = false;
  public btnagregar : boolean = false;


  constructor(
    public _BsModalService: BsModalService,
    public formBuilder: FormBuilder,
    private DocidentificacionService: DocidentificacionService,
    public datePipe: DatePipe,
    public localeService: BsLocaleService,
    public _buscasolicitudService: SolicitudService,
    private _imprimesolicitudService: InformesService,
    private dispensasolicitudService: DispensarsolicitudesService,
    private router: Router,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {

    this.setDate();
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();


    this.FormDispensaSolicitudPaciente = this.formBuilder.group({
      tipodoc: [{ value: null, disabled: true }, Validators.required],
      numidentificacion: [{ value: null, disabled: true }, Validators.required],
      apellidopaterno: [{ value: null, disabled: true }, Validators.required],
      ppn: [{ value: null, disabled: true }, Validators.required],
      numcuenta: [{ value: null, disabled: true }, Validators.required],
      numestadia: [{ value: null, disabled: true }, Validators.required],
      nombrepaciente: [{ value: null, disabled: true }, Validators.required],
      edad: [{ value: null, disabled: true }, Validators.required],
      unidad: [{ value: null, disabled: true }, Validators.required],
      sexo: [{ value: null, disabled: true }, Validators.required],
      convenio: [{ value: null, disabled: true }, Validators.required],
      diagnostico: [{ value: null, disabled: true }, Validators.required],
      numsolicitud: [{ value: null, disabled: true }, Validators.required],
      fecha: [{ value: null, disabled: true }, Validators.required],
      ambito: [{ value: null, disabled: true }, Validators.required],
      estadoorden: [{ value: null, disabled: true }, Validators.required],
      ubicacion: [{ value: null, disabled: true }, Validators.required],
      medico: [{ value: null, disabled: true }, Validators.required],
      pieza: [{ value: null, disabled: true }, Validators.required],
      cama: [{ value: null, disabled: true }, Validators.required],


    });

    this.FormDispensaDetalle = this.formBuilder.group({
      codigo: [{ value: null, disabled: false }, Validators.required],
      cantidad: [{ value: null, disabled: false }, Validators.required],
      lote: [{ value: null, disabled: false }, Validators.required],
      fechavto: [{ value: null, disabled: false }, Validators.required]
    });

    this.DocidentificacionService.list(this.usuario, this.servidor).subscribe(
      data => {
        this.docsidentis = data;
      }, err => {

      }
    );


    this.route.paramMap.subscribe(param => {
      if (param.has("id_solicitud")) {

        this.CargaSolicitud(parseInt(param.get("id_solicitud"), 10));
      }
    })

  }


  async CargaSolicitud(ID_Solicigtud: number) {
    var nombrepaciente: string;
    var cantpendiente: number;

    this.detallessolicitudespaginacion = [];
    this.detallessolicitudes = [];

    await this.getCodambito();

    this._buscasolicitudService.BuscaSolicitud(ID_Solicigtud, this.hdgcodigo,
      this.esacodigo, this.cmecodigo, 0, null, null, 0, 0, null, this.servidor, 0, 3, 0, 0, 0, 0, "",0).subscribe(
        response => {

          this.solicitudpaciente = response[0];

          this.FormDispensaSolicitudPaciente.get('tipodoc').setValue(this.solicitudpaciente.glstipidentificacion);
          this.FormDispensaSolicitudPaciente.get('numidentificacion').setValue(this.solicitudpaciente.numdocpac);
          this.FormDispensaSolicitudPaciente.get('ppn').setValue(this.solicitudpaciente.ppnpaciente);
          this.FormDispensaSolicitudPaciente.get('numcuenta').setValue(this.solicitudpaciente.cuentanumcuenta);
          this.FormDispensaSolicitudPaciente.get('numestadia').setValue(this.solicitudpaciente.estid);
          nombrepaciente = this.solicitudpaciente.nombrespac + " " + this.solicitudpaciente.apepaternopac + " " + this.solicitudpaciente.apematernopac;
          this.FormDispensaSolicitudPaciente.get('nombrepaciente').setValue(nombrepaciente);

          this.FormDispensaSolicitudPaciente.get('edad').setValue(this.solicitudpaciente.edad);
          this.FormDispensaSolicitudPaciente.get('sexo').setValue(this.solicitudpaciente.glsexo);
          this.FormDispensaSolicitudPaciente.get('convenio').setValue(this.solicitudpaciente.convenio);
          this.FormDispensaSolicitudPaciente.get('diagnostico').setValue(this.solicitudpaciente.diagnostico);
          this.FormDispensaSolicitudPaciente.get('unidad').setValue(this.solicitudpaciente.undglosa);
          this.FormDispensaSolicitudPaciente.get('pieza').setValue(this.solicitudpaciente.pzagloza);
          this.FormDispensaSolicitudPaciente.get('cama').setValue(this.solicitudpaciente.camglosa);

          this.FormDispensaSolicitudPaciente.get('numsolicitud').setValue(this.solicitudpaciente.soliid);
          this.FormDispensaSolicitudPaciente.get('fecha').setValue(this.solicitudpaciente.fechacreacion);
          this.FormDispensaSolicitudPaciente.get('ambito').setValue(this.solicitudpaciente.glsambito);
          this.FormDispensaSolicitudPaciente.get('estadoorden').setValue(this.solicitudpaciente.estadosolicitudde);
          this.FormDispensaSolicitudPaciente.get('ubicacion').setValue(this.solicitudpaciente.camglosa);
          this.FormDispensaSolicitudPaciente.get('medico').setValue(this.solicitudpaciente.nombremedico);

          this.detallesolicitudpaciente = response[0].solicitudesdet;
          this.detallesolicitudpacientepaginacion = this.detallesolicitudpaciente.slice(0, 20);
          this.detallesolicitudpaciente.forEach(element => {
            element.backgroundcolor = (element.tienelote == "N") ? 'gris' : 'amarillo';
            cantpendiente = element.cantsoli - element.cantdespachada;
            element.cantadespachar = cantpendiente;
            if (element.tienelote == "N" && cantpendiente > 0) {
              this.detallessolicitudes.unshift(element);
              this.detallessolicitudespaginacion = this.detallessolicitudes.slice(0, 20);
              this.activabtndispensar = true;
            }

          });
        },
        error => {

          this.alertSwalError.title = "Error al Buscar solicitudes, puede que no exista";
          this.alertSwalError.show();
        }
      )

  }


  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.detallesolicitudpacientepaginacion = this.detallesolicitudpaciente.slice(startItem, endItem);
  }

  pageChangedDespacho(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.detallessolicitudespaginacion = this.detallessolicitudes.slice(startItem, endItem);
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  verificaCod(codigo: string) {
    /** Verifica si codigo existe //@MLobos*/
    const indx = this.detallessolicitudespaginacion.findIndex(x => x.codmei === codigo, 1);
    if (indx >= 0) {
      this.alertSwalError.title = "Código ya existe en planilla";
      this.alertSwalError.show();
      this.FormDispensaDetalle.reset();
      this.FormDispensaDetalle.controls.cantidad.setValue(null);
      this.codexiste = true;
    } else {
      return
    }
  }

  codigo_ingresado(datosIngresados: any) {
    /* */
    // 
    const codmei = datosIngresados.codigo;
    /* Si existe el código en la solicitud se propone la cantidad */
    this.detallesolicitudpaciente.forEach(async element => {
      if (element.codmei.trim() == datosIngresados.codigo.trim()) {
        this.validadato = true;
        await this.verificaCod(codmei);
        // if((element.cantsoli-element.cantdespachada)==0){
        //   this.alertSwalAlert.title = "Este código no tiene mas cantidad para dispensar";
        //   this.alertSwalAlert.show();
        //   // this.activabtnagrega = true;
        // }else{

        // this.activabtnagrega = false;
        if (this.codexiste == false) {

          this.FormDispensaDetalle.get('cantidad').setValue(element.cantsoli - element.cantdespachada);
        }

        // if (element.tiporegmein == "M") {
          this.validacombolote = true;
          this.validadato = true;
          // this.tiporegistro = "M";

          this._buscasolicitudService.BuscaLotesProductosxPac(this.servidor, this.hdgcodigo, this.esacodigo,
            this.cmecodigo, datosIngresados.codigo, this.solicitudpaciente.bodorigen,
            this.solicitudpaciente.boddestino, this.cliid).subscribe(response => {
              this.detalleslotes = response;
              if (this.detalleslotes.length == 1) {
                this.FormDispensaDetalle.get('fechavto').setValue(this.datePipe.transform(this.detalleslotes[0].fechavto, 'dd-MM-yyyy'));
                this.FormDispensaDetalle.get('lote').setValue(this.detalleslotes[0].lote);
                this.lote = this.detalleslotes[0].lote;
                this.fechavto = this.detalleslotes[0].fechavto;
              }
            }
            )
        // } else {
        //   this.validacombolote = false;
        //   this.validadato = true;
        //   this.tiporegistro = "I";
        // }
        // }
      } else {
        // this.validadato= false;
      }

    })
    if (this.validadato == false) {
      this.FormDispensaDetalle.reset();
      this.alertSwalError.title = "El valor del Código Ingresado No pertenece a la Solicitud";
      this.alertSwalError.show();

    }
  }

  LlamaFecha(event: any) {
    this.detalleslotes.forEach(element => {
      if (event == element.lote) {
        this.FormDispensaDetalle.get('fechavto').setValue(this.datePipe.transform(element.fechavto, 'dd-MM-yyyy'));
        this.fechavto = element.fechavto;
      }
    })
  }

  valida_cantidad(cantidad: number, datoingresado: any) {

    this.alertSwalError.title = null;
    this.alertSwalAlert.text = null;
    this.detallesolicitudpaciente.forEach(element => {

      if (element.codmei.trim() == datoingresado.codigo.trim()) {

        if (cantidad > element.cantsoli - element.cantdespachada) { // || cantidad <0){
          // console.log("cantidad es mayor que pendiente");
          // this.FormDispensaDetalle.get('cantidad').setValue(element.cantsoli - element.cantdespachada);
          this.alertSwalAlert.text = "La cantidad a despachar debe ser menor o igual a la cantidad Pendiente";
          this.alertSwalAlert.show();
          this.FormDispensaDetalle.get("cantidad").setValue(element.cantsoli - element.cantdespachada);
        } else {
          if (cantidad <= 0) {// || cantidad >0){
            // console.log("cantidad <=0")
            this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
            this.alertSwalAlert.show();
            this.FormDispensaDetalle.get("cantidad").setValue(element.cantsoli - element.cantdespachada); 
          } else {
            if (cantidad <= element.cantsoli - element.cantdespachada) {// || cantidad >0){
              // console.log("cantidad >0 y menor que pendiente")
            }
          }


        }
      }
    })
  }

  validacantidadgrilla(id: number, registrodespacho: DespachoDetalleSolicitud) {
    // console.log("valida cantidad de la grilla",id,registrodespacho);
    this.alertSwalError.title = null;
    this.alertSwalAlert.text = null;
    var idg = 0;

    if (registrodespacho.sodeid > 0) {
      if (this.IdgrillaDispensacion(registrodespacho) >= 0) {
        idg = this.IdgrillaDispensacion(registrodespacho)

        if (this.detallessolicitudes[idg].cantadespachar > this.detallessolicitudes[idg].cantsoli - this.detallessolicitudes[idg].cantdespachada) {


          this.alertSwalAlert.text = "La cantidad a despachar debe ser menor o igual a la cantidad Pendiente";
          this.alertSwalAlert.show();
          this.FormDispensaDetalle.get("cantidad").setValue(this.detallessolicitudes[idg].cantsoli - this.detallessolicitudes[idg].cantdespachada);
          this.detallessolicitudes[idg].cantadespachar = this.detallessolicitudes[idg].cantsoli - this.detallessolicitudes[idg].cantdespachada ;
          this.detallessolicitudespaginacion[idg].cantadespachar = this.detallessolicitudes[idg].cantadespachar ;


        } else {
          if (this.detallessolicitudes[idg].cantadespachar <= 0) {// || cantidad >0){

            this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
            this.alertSwalAlert.show();
            this.detallessolicitudes[idg].cantadespachar = this.detallessolicitudes[idg].cantsoli - this.detallessolicitudes[idg].cantdespachada ;
            this.detallessolicitudespaginacion[idg].cantadespachar = this.detallessolicitudes[idg].cantadespachar ;
          } else {
            if (this.detallessolicitudes[idg].cantadespachar < this.detallessolicitudes[idg].cantsoli - this.detallessolicitudes[idg].cantdespachada || this.detallessolicitudes[idg].cantadespachar > 0) {

            }
          }
        }

      }
    }
  }

  IdgrillaDispensacion(registro: DetalleSolicitud) {

    let indice = 0;
    for (const articulo of this.detallessolicitudes) {
      if (registro.codmei === articulo.codmei) {

        return indice;
      }
      indice++;
    }
    return -1;
  }

  BuscarSolicitudes() {
    this.detallessolicitudes = [];
    this.detallessolicitudespaginacion = [];
    var nombrepaciente;
    var edadunidad;
    var cantpendiente;

    this._BSModalRef = this._BsModalService.show(BusquedasolicitudpacientesComponent, this.setModalBusquedaSolicitudPaciente());
    this._BSModalRef.content.onClose.subscribe((RetornoSolicitudes: Solicitud) => {

      /* Verifica si el retorno de Modal viene con datos o no //@MLobos*/
      if (RetornoSolicitudes !== undefined) {

        // console.log("RetornoSolicitudes",RetornoSolicitudes);

        this._buscasolicitudService.BuscaSolicitud(RetornoSolicitudes.soliid, this.hdgcodigo, this.esacodigo, this.cmecodigo, 0, "", "", 0, 0, 0, this.servidor, 0, -1, 0, 0, 0, 0, "",0).subscribe(
          response => {
  
            this.solicitudpaciente = response[0];

           console.log("solictu",this.solicitudpaciente)
            this.FormDispensaSolicitudPaciente.get('tipodoc').setValue(this.solicitudpaciente.glstipidentificacion);
            this.FormDispensaSolicitudPaciente.get('numidentificacion').setValue(this.solicitudpaciente.numdocpac);
            this.FormDispensaSolicitudPaciente.get('ppn').setValue(this.solicitudpaciente.ppnpaciente);
            this.FormDispensaSolicitudPaciente.get('numcuenta').setValue(this.solicitudpaciente.cuentanumcuenta);
            this.FormDispensaSolicitudPaciente.get('numestadia').setValue(this.solicitudpaciente.estid);
            nombrepaciente = this.solicitudpaciente.nombrespac + " " + this.solicitudpaciente.apepaternopac + " " + this.solicitudpaciente.apematernopac;
            this.FormDispensaSolicitudPaciente.get('nombrepaciente').setValue(nombrepaciente);
            edadunidad = this.solicitudpaciente.edadpac + " " + this.solicitudpaciente.tipoedad;
            this.FormDispensaSolicitudPaciente.get('edad').setValue(this.solicitudpaciente.edad);
            this.FormDispensaSolicitudPaciente.get('sexo').setValue(this.solicitudpaciente.glsexo);
            this.FormDispensaSolicitudPaciente.get('convenio').setValue(this.solicitudpaciente.convenio);
            this.FormDispensaSolicitudPaciente.get('diagnostico').setValue(this.solicitudpaciente.diagnostico);
            this.FormDispensaSolicitudPaciente.get('unidad').setValue(this.solicitudpaciente.undglosa);
            this.FormDispensaSolicitudPaciente.get('pieza').setValue(this.solicitudpaciente.pzagloza);
            this.FormDispensaSolicitudPaciente.get('cama').setValue(this.solicitudpaciente.camglosa);

            this.FormDispensaSolicitudPaciente.get('numsolicitud').setValue(this.solicitudpaciente.soliid);
            this.FormDispensaSolicitudPaciente.get('fecha').setValue(this.datePipe.transform(this.solicitudpaciente.fechacreacion, 'dd-MM-yyyy HH:mm:ss'));// this.solicitudpaciente.fechacreacion);
            this.FormDispensaSolicitudPaciente.get('ambito').setValue(this.solicitudpaciente.glsambito);
            this.FormDispensaSolicitudPaciente.get('estadoorden').setValue(this.solicitudpaciente.estadosolicitudde);
            this.FormDispensaSolicitudPaciente.get('ubicacion').setValue(this.solicitudpaciente.camglosa);
            this.FormDispensaSolicitudPaciente.get('medico').setValue(this.solicitudpaciente.nombremedico);

            this.ctaid = this.solicitudpaciente.ctaid;
            this.cliid = this.solicitudpaciente.cliid;
            this.estid = this.solicitudpaciente.estid;
            this.detallesolicitudpaciente = this.solicitudpaciente.solicitudesdet;
            this.detallesolicitudpacientepaginacion = this.detallesolicitudpaciente.slice(0, 20)
            if(this.solicitudpaciente.estadosolicitud == 50){
              this.FormDispensaDetalle.controls.codigo.disable();
              this.FormDispensaDetalle.controls.cantidad.disable();
              this.FormDispensaDetalle.controls.lote.disable();
              this.FormDispensaDetalle.controls.fechavto.disable();
              this.btnagregar = true;
            }else{
              this.FormDispensaDetalle.controls.codigo.enable();
              this.FormDispensaDetalle.controls.cantidad.enable();
              this.FormDispensaDetalle.controls.lote.enable();
              this.FormDispensaDetalle.controls.fechavto.enable();
              this.btnagregar = false;
            }
            // 
            this.detallesolicitudpaciente.forEach(element => {
              element.backgroundcolor = (element.tienelote == "N") ? 'gris' : 'amarillo';
              cantpendiente = element.cantsoli - element.cantdespachada;
              element.cantadespachar = cantpendiente;
              if (element.tienelote == "N" && cantpendiente > 0) {
                this.detallessolicitudes.unshift(element);
                this.detallessolicitudespaginacion = this.detallessolicitudes.slice(0, 20);
                
              }
            });
            if(this.detallessolicitudes.length>0){
           
              this.activabtndispensar= true;
            }
            this.detallesolicitudpacientepaginacion = this.detallesolicitudpaciente;
            this.FormDispensaDetalle.reset();
          });

      }
    });

  }

  setModalBusquedaSolicitudPaciente() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Solicitudes de Pacientes', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        tipo_busqueda: 'Todo-Medico',
        id_Bodega: 0,
        ambito: 3,
        nombrepaciente: null,
        apepaternopac: null,
        apematernopac: null,
        codservicioactual: 0,
        tipodocumento: null,
        numeroidentificacion: null,
        buscasolicitud: "Dipensar_Solicitud"

      }
    };
    return dtModal;
  }

  Limpiar() {
    this.FormDispensaSolicitudPaciente.reset();
    this.FormDispensaDetalle.reset();
    this.detallesolicitudpaciente = [];
    this.detallesolicitudpacientepaginacion = [];
    this.detallessolicitudespaginacion = [];
    this.detallessolicitudes = [];
    this.detalleslotes = [];
    this.validadato = false;
    this.btnImprime = false;//Desactiva btn Imprimir //@ML
    this.codexiste = false;
    this.activabtndispensar = false;
    this.btnagregar = false;
    this.FormDispensaDetalle.controls.codigo.enable();
    this.FormDispensaDetalle.controls.cantidad.enable();
    this.FormDispensaDetalle.controls.lote.enable();
    this.FormDispensaDetalle.controls.fechavto.enable();
  }

  addArticuloGrillaDispensacion(dispensacion: any) {
    this.alertSwalAlert.title = null;
    if (dispensacion.cantidad == 0) {
      this.alertSwalAlert.title = "Este producto ya fue dispensado";
      this.alertSwalAlert.show();
    } else {
      if (dispensacion.cantidad > 0) {
        this.detallesolicitudpaciente.forEach(element => {
          if (element.codmei.trim() == dispensacion.codigo.trim()) {

            var temporal = new DetalleSolicitud
            temporal.codmei = this.FormDispensaDetalle.value.codigo;
            temporal.meindescri = element.meindescri;
            temporal.fechavto = this.fechavto;//this.FormDispensaDetalle.value.fechavto//this.datePipe.transform(this.FormDispensaDetalle.value.fechavto, 'dd-MM-yyyy');
            // this.fechavto           = this.datePipe.transform(this.FormDispensaDetalle.value.fechavto, 'yyyy-MM-dd');
            temporal.lote = this.FormDispensaDetalle.value.lote;
            temporal.cantadespachar = this.FormDispensaDetalle.value.cantidad;
            temporal.soliid = element.soliid;
            temporal.sodeid = element.sodeid;
            temporal.meinid = element.meinid;
            temporal.cantdespachada = element.cantdespachada;
            temporal.cantsoli = element.cantsoli;
            temporal.observaciones = element.observaciones;
            temporal.cantdevolucion = element.cantdevolucion;

            this.detallessolicitudes.unshift(temporal);
            this.detallessolicitudespaginacion = this.detallessolicitudes.slice(0,20)
            this.activabtndispensar = true;
          }

        });
      }
    }
    // 
    this.FormDispensaDetalle.reset();
    this.detalleslotes = [];
    this.validadato = false;
  }

  ConfirmaDispensarSolicitud(datos: any) {
    const Swal = require('sweetalert2');

    Swal.fire({
      title: '¿ Dispensar a paciente ?',
      text: "Confirmar el despacho al paciente",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {

        this.DispensarSolicitud(datos);
      }
    })
  }

  DispensarSolicitud(datos) {

    // this.detallesolicitudpacientepaginacion=[]; 
    // this.detallesolicitudpaciente=[];
    this.paramdespachos = [];
    var fechavto = null;

    this.detallessolicitudes.forEach(element => {
      var temporal = new DespachoDetalleSolicitud;

      temporal.soliid = element.soliid;
      temporal.hdgcodigo = this.hdgcodigo;
      temporal.esacodigo = this.esacodigo;
      temporal.cmecodigo = this.cmecodigo;
      temporal.sodeid = element.sodeid;
      temporal.codmei = element.codmei;
      temporal.meinid = element.meinid;
      temporal.cantsoli = element.cantsoli;
      temporal.cantadespachar = element.cantadespachar;
      temporal.cantdespachada = element.cantdespachada;
      temporal.observaciones = element.observaciones;
      temporal.usuariodespacha = this.usuario;
      temporal.estid = this.estid;
      temporal.ctaid = this.ctaid;
      temporal.cliid = this.cliid;
      temporal.valcosto = 0;
      temporal.valventa = 0;
      temporal.unidespachocod = 0;
      temporal.unicompracod = 0;
      temporal.incobfon = null;
      temporal.numdocpac = null;
      temporal.cantdevolucion = element.cantdevolucion;
      temporal.tipomovim = "C";
      temporal.servidor = this.servidor;
      temporal.lote = element.lote;
      fechavto = this.datePipe.transform(element.fechavto, 'yyyy-MM-dd');
      temporal.fechavto = fechavto;
      temporal.bodorigen = this.solicitudpaciente.bodorigen;
      temporal.boddestino = this.solicitudpaciente.boddestino;
      temporal.codservicioori = this.solicitudpaciente.codservicioori //this.solicitudpaciente.codservicioori;
      temporal.codservicioactual = this.solicitudpaciente.codservicioactual;

      this.paramdespachos.unshift(temporal);
    });

    this.dispensarSol();

  }

  dispensarSol() {
    var nombrepaciente;
    var cantpendiente;
    this.getCodambito();
    this.dispensasolicitudService.GrabaDispensacion(this.paramdespachos).subscribe(
      async response => {
        this.alertSwal.title = "Dispensación a paciente exitosa"; //mensaje a mostrar
        this.alertSwal.show(); // para que aparezca
        this.detallessolicitudespaginacion = [];
        this.detallessolicitudes = [];
        this.btnImprime = true;
        this.activabtndispensar = false;
        this._buscasolicitudService.BuscaSolicitud(this.solicitudpaciente.soliid, this.hdgcodigo,
          this.esacodigo, this.cmecodigo, 0, null, null, 0, 0, null, this.servidor, 0,
          this.codambito, 0, 0, 0, 0, "",0).subscribe(
            response => {
              this.solicitudpaciente = response[0];
              this.FormDispensaSolicitudPaciente.get('tipodoc').setValue(response[0].glstipidentificacion);
              this.FormDispensaSolicitudPaciente.get('numidentificacion').setValue(this.solicitudpaciente.numdocpac);
              this.FormDispensaSolicitudPaciente.get('ppn').setValue(this.solicitudpaciente.ppnpaciente);
              this.FormDispensaSolicitudPaciente.get('numcuenta').setValue(this.solicitudpaciente.cuentanumcuenta);
              this.FormDispensaSolicitudPaciente.get('numestadia').setValue(this.solicitudpaciente.estid);
              nombrepaciente = this.solicitudpaciente.nombrespac + " " + this.solicitudpaciente.apepaternopac + " " + this.solicitudpaciente.apematernopac;
              this.FormDispensaSolicitudPaciente.get('nombrepaciente').setValue(nombrepaciente);

              this.FormDispensaSolicitudPaciente.get('edad').setValue(this.solicitudpaciente.edad);
              this.FormDispensaSolicitudPaciente.get('sexo').setValue(this.solicitudpaciente.glsexo);
              this.FormDispensaSolicitudPaciente.get('convenio').setValue(this.solicitudpaciente.convenio);
              this.FormDispensaSolicitudPaciente.get('diagnostico').setValue(this.solicitudpaciente.diagnostico);
              this.FormDispensaSolicitudPaciente.get('unidad').setValue(this.solicitudpaciente.undglosa);
              this.FormDispensaSolicitudPaciente.get('pieza').setValue(this.solicitudpaciente.pzagloza);
              this.FormDispensaSolicitudPaciente.get('cama').setValue(this.solicitudpaciente.camglosa);

              this.FormDispensaSolicitudPaciente.get('numsolicitud').setValue(this.solicitudpaciente.soliid);
              //console.log("fecha *******",this.solicitudpaciente.fechacreacion);     
              this.FormDispensaSolicitudPaciente.get('fecha').setValue(this.datePipe.transform(this.solicitudpaciente.fechacreacion, 'dd-MM-yyyy HH:mm:ss'));
              //this.FormDispensaSolicitudPaciente.get('fecha').setValue(this.solicitudpaciente.fechacreacion);
              this.FormDispensaSolicitudPaciente.get('ambito').setValue(this.solicitudpaciente.glsambito);
              this.FormDispensaSolicitudPaciente.get('estadoorden').setValue(this.solicitudpaciente.estadosolicitudde);
              this.FormDispensaSolicitudPaciente.get('ubicacion').setValue(this.solicitudpaciente.camglosa);
              this.FormDispensaSolicitudPaciente.get('medico').setValue(this.solicitudpaciente.nombremedico);
              if(this.solicitudpaciente.estadosolicitud == 50){
                this.FormDispensaDetalle.controls.codigo.disable();
                this.FormDispensaDetalle.controls.cantidad.disable();
                this.FormDispensaDetalle.controls.lote.disable();
                this.FormDispensaDetalle.controls.fechavto.disable();
                this.btnagregar = true;
              }else{
                this.FormDispensaDetalle.controls.codigo.enable();
                this.FormDispensaDetalle.controls.cantidad.enable();
                this.FormDispensaDetalle.controls.lote.enable();
                this.FormDispensaDetalle.controls.fechavto.enable();
                this.btnagregar = false;
              }
              this.detallesolicitudpaciente = response[0].solicitudesdet;
              this.detallesolicitudpacientepaginacion = this.detallesolicitudpaciente.slice(0, 20);
              this.detallesolicitudpaciente.forEach(element => {
                element.backgroundcolor = (element.tienelote == "N") ? 'gris' : 'amarillo';
                cantpendiente = element.cantsoli - element.cantdespachada;
                element.cantadespachar = cantpendiente;
              });
            },
            error => {

              this.alertSwalError.title = "Error al Buscar solicitudes, puede que no exista";
              this.alertSwalError.show();
            }
          )
      },
      error => {

        this.alertSwalError.title = "Eror al intentar dispensar a paciente"; //mensaje a mostrar
        this.alertSwalError.show();// para que aparezca

      }
    );
  }

  eventosSolicitud() {

    // sE CONFIRMA Eliminar Solicitud
    this._BSModalRef = this._BsModalService.show(EventosSolicitudComponent, this.setModalEventoSolicitud());
    this._BSModalRef.content.onClose.subscribe((Respuesta: any) => {
    })
  }

  setModalEventoSolicitud() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Eventos Solicitud', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        _Solicitud: this.solicitudpaciente,
      }
    };
    return dtModal;
  }

  eventosDetalleSolicitud(registroDetalle: DetalleSolicitud) {

    this.varListaDetalleDespacho = new (DetalleSolicitud);
    this.varListaDetalleDespacho = registroDetalle;

    this._BSModalRef = this._BsModalService.show(EventosDetallesolicitudComponent, this.setModalEventoDetalleSolicitud());
    this._BSModalRef.content.onClose.subscribe((Respuesta: any) => {
    })
  }

  setModalEventoDetalleSolicitud() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Eventos Detalle Solicitud', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        _Solicitud: this.solicitudpaciente,
        _DetalleSolicitud: this.varListaDetalleDespacho,
      }
    };
    return dtModal;
  }

  onImprimir() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Dispensación De Solicitud ?',
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

    this._imprimesolicitudService.RPTImprimeSolicitudDespachada(this.servidor, this.hdgcodigo, this.esacodigo,
      this.cmecodigo, "pdf", this.FormDispensaSolicitudPaciente.value.numsolicitud,
      this.solicitudpaciente.codambito).subscribe(
        response => {
          window.open(response[0].url, "", "", true);
          // this.alertSwal.title = "Reporte Impreso Correctamente";
          // this.alertSwal.show();
        },
        error => {

          this.alertSwalError.title = "Error al Imprimir Despacho Solicitud Paciente";
          this.alertSwalError.show();
          this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
          })
        }
      );
  }

  salir() {


    this.route.paramMap.subscribe(param => {
      if (param.has("id_solicitud")) {
        this.router.navigate(['monitorejecutivo']);
      } else {
        this.router.navigate(['home']);
      }
    })


  }
  cambio_cantidad(id: number, property: string, registro: DespachoDetalleSolicitud) {
    if (this.detallessolicitudespaginacion[id]["sodeid"] == 0) {
      this.detallessolicitudespaginacion[id]["acciond"] = "I";
    }
    if (this.detallessolicitudespaginacion[id]["sodeid"] > 0) {
      this.detallessolicitudespaginacion[id]["acciond"] = "M";
    }
    this.detallessolicitudespaginacion[id][property] = this.detallessolicitudespaginacion[id][property]

  }

  async getCodambito() {

    let descambito = this.FormDispensaSolicitudPaciente.controls.ambito.value;
    switch (descambito) {
      case 'Ambulatorio':
        this.codambito = 1;
        break;
      case 'Urgencia':
        this.codambito = 2;
        break;

      case 'Hospitalario':
        this.codambito = 3;
        break;
    }
    return;
  }
}