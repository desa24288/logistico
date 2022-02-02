
import { Component, HostListener, OnInit, ViewChild, ɵConsole } from '@angular/core';
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
import { SaldoLoteBodega } from '../../models/entity/SaldoLoteBodega';
import { StockProducto } from 'src/app/models/entity/StockProducto';
import { CreasolicitudesService } from 'src/app/servicios/creasolicitudes.service';
import { delay, map,  tap } from "rxjs/operators";
import { async } from '@angular/core/testing';
import { validateRUT, getCheckDigit, generateRandomRUT } from 'validar-rut'

@Component({
  selector: 'app-dispensarsolicitudpaciente',
  templateUrl: './dispensarsolicitudpaciente.component.html',
  styleUrls: ['./dispensarsolicitudpaciente.component.css'],
  providers: [DispensarsolicitudesService, InformesService,CreasolicitudesService]
})
export class DispensarsolicitudpacienteComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public modelopermisos               : Permisosusuario = new Permisosusuario();
  public hdgcodigo                    : number;
  public esacodigo                    : number;
  public cmecodigo                    : number;
  public servidor                     = environment.URLServiciosRest.ambiente;
  public usuario                      = environment.privilegios.usuario;
  public ctaid                        : number = 0;
  public cliid                        : number = 0;
  public estid                        : number = 0;
  public validacombolote              : boolean = false;
  public validadato                   : boolean = false;
  public lote                         : string;
  public fechavto                     : string;
  public tiporegistro                 : string;
  public locale                       = 'es';
  public bsConfig                     : Partial<BsDatepickerConfig>;
  public colorTheme                   = 'theme-blue';
  public FormDispensaSolicitudPaciente: FormGroup;
  public FormDispensaDetalle          : FormGroup;
  public FormDatosProducto            : FormGroup;
  public docsidentis                  : Array<DocIdentificacion> = [];
  public DispensaSolicitud            : DespachoSolicitud;
  detallesolicitudpaciente            : DetalleSolicitud[] = [];
  detallesolicitudpacientepaginacion  : DetalleSolicitud[] = [];
  public detallesolicitudpacientepaginacion_aux: DetalleSolicitud[] = [];
  public detallesolicitudpaciente_aux : DetalleSolicitud[] = [];
  public detallesolicitudpaciente_2   : DetalleSolicitud[] = [];
  public varDespachoDetalleSolicitud  : DespachoDetalleSolicitud;
  paramdespachos                      : DespachoDetalleSolicitud[] = [];
  public varListaDetalleDespacho      : DetalleSolicitud;
  public detallessolicitudes          : Array<DespachoDetalleSolicitud> = [];
  public temporaldetallesolicitudes   : Array<DespachoDetalleSolicitud> = [];
  public detallessolicitudespaginacion: Array<DespachoDetalleSolicitud> = [];
  public solicitudpaciente            : Solicitud;
  public detalleslotes                : Detallelote[] = [];
  public loteparagrilla               : SaldoLoteBodega[] = [];
  public vacios                       : boolean = true;
  public loading                      = false;
  public ActivaBotonLimpiaBusca       : boolean = false;
  public ActivaBotonBuscaGrilla       : boolean = false;

  private _BSModalRef : BsModalRef;
  public codambito    = 0;
  public codexiste    : boolean = false;

  public existsolicitud = false;
  public activabtnagrega: boolean = false;
  /**Activa btn Imprimir */
  public btnImprime         = false;
  public activabtndispensar = false;
  public btnagregar         : boolean = false;
  public btnAgregar         = true;
  public validasumatoria    = true;
  public estado_aux         : number;

  public valida             : boolean;
  public respPermiso        : string;
  public desactivabtnelim   : boolean = false;

  public detalleconstock: Array<DespachoDetalleSolicitud> = [];

  /** botones */
  public btnEliminar = true;
  public btnDispensar = true;

  /** indica tipo de solicitud */
  /**
   * 30 = bodegas
   * 0 = Paciente
   * 70 = Recetas
   */
  public solicitud = 0;

  constructor(
    public _BsModalService          : BsModalService,
    public formBuilder              : FormBuilder,
    private DocidentificacionService: DocidentificacionService,
    public datePipe                 : DatePipe,
    public localeService            : BsLocaleService,
    public _buscasolicitudService   : SolicitudService,
    private _imprimesolicitudService: InformesService,
    private dispensasolicitudService: DispensarsolicitudesService,
    private router                  : Router,
    private route                   : ActivatedRoute,
    public _creaService             : CreasolicitudesService,

  ) { }

  ngOnInit() {

    this.setDate();
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario   = sessionStorage.getItem('Usuario').toString();


    this.FormDispensaSolicitudPaciente = this.formBuilder.group({
      tipodoc           : [{ value: null, disabled: true }, Validators.required],
      numidentificacion : [{ value: null, disabled: true }, Validators.required],
      apellidopaterno   : [{ value: null, disabled: true }, Validators.required],
      ppn               : [{ value: null, disabled: true }, Validators.required],
      numcuenta         : [{ value: null, disabled: true }, Validators.required],
      numestadia        : [{ value: null, disabled: true }, Validators.required],
      nombrepaciente    : [{ value: null, disabled: true }, Validators.required],
      edad              : [{ value: null, disabled: true }, Validators.required],
      unidad            : [{ value: null, disabled: true }, Validators.required],
      sexo              : [{ value: null, disabled: true }, Validators.required],
      convenio          : [{ value: null, disabled: true }, Validators.required],
      diagnostico       : [{ value: null, disabled: true }, Validators.required],
      numsolicitud      : [{ value: null, disabled: true }, Validators.required],
      fecha             : [{ value: null, disabled: true }, Validators.required],
      ambito            : [{ value: null, disabled: true }, Validators.required],
      estadoorden       : [{ value: null, disabled: true }, Validators.required],
      ubicacion         : [{ value: null, disabled: true }, Validators.required],
      medico            : [{ value: null, disabled: true }, Validators.required],
      pieza             : [{ value: null, disabled: true }, Validators.required],
      cama              : [{ value: null, disabled: true }, Validators.required],


    });

    this.FormDispensaDetalle = this.formBuilder.group({
      codigo  : [{ value: null, disabled: false }, Validators.required],
      cantidad: [{ value: null, disabled: false }, Validators.required],
      lote    : [{ value: null, disabled: false }, Validators.required],
      fechavto: [{ value: null, disabled: false }, Validators.required]
    });

    this.FormDatosProducto = this.formBuilder.group({
      codigo  : [{ value: null, disabled: false }, Validators.required]
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

  ngOnDestroy(){
    if(this.solicitudpaciente != undefined){
      if(this.solicitudpaciente.bandera != 2){
        this.ValidaEstadoSolicitud(1,'destroy');
      }
    }
  }

  async CargaSolicitud(ID_Solicigtud: number) {
    var nombrepaciente: string;
    var cantpendiente: number;

    this.detallessolicitudespaginacion = [];
    this.detallessolicitudes = [];
    this.loading = true;
    await this.getCodambito();

    this._buscasolicitudService.BuscaSolicitud(ID_Solicigtud, this.hdgcodigo,
      this.esacodigo, this.cmecodigo, 0, null, null, 0, 0, null, this.servidor, 0, 3, 0, 0,
      0, 0, "",0,"","").subscribe(
        response => {
          if (response != null) {
            this.solicitudpaciente = response[0];
            this.detalleslotes = [];
            this.estado_aux = this.solicitudpaciente.estadosolicitud;
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
            this.detallesolicitudpaciente_aux = this.detallesolicitudpaciente;
            this.detallesolicitudpacientepaginacion_aux = this.detallesolicitudpacientepaginacion;
            this.detallesolicitudpaciente.forEach(element => {
              element.backgroundcolor = (element.tienelote == "N") ? 'gris' : 'amarillo';
              cantpendiente = element.cantsoli - element.cantdespachada;
              element.cantadespachar = cantpendiente;
              element.cantadespacharresp = element.cantadespachar;
              if (element.tienelote == "N" && cantpendiente > 0) {
                this.detallessolicitudes.unshift(element);
                this.detallessolicitudespaginacion = this.detallessolicitudes.slice(0, 20);
                this.logicaVacios();
              }
            });
            this.ActivaBotonBuscaGrilla = true;
            this.loading = false;
            if(this.solicitudpaciente.bandera === 2){
              this.activabtndispensar = false;
              this.btnagregar = false;
              this.FormDispensaDetalle.disable();
              if(this.detallessolicitudes.length >0){
                this.detallessolicitudes.forEach(x=>{
                  x.bloqcampogrilla = false;
                  x.bloqcampogrilla2 = false;
                });
                this.detallessolicitudespaginacion = this.detallessolicitudes.slice( 0,20);
                this.alertSwalAlert.title = "Solicitud en preparación";
                this.alertSwalAlert.text = "No puede ser modificada";
                this.alertSwalAlert.show();
                this.desactivaAccion();
              }
            }else{
              this.ValidaEstadoSolicitud(2,'BuscaSolicitudes');
              this.activaAccion();
            }
          }
        }, error => {
          this.alertSwalError.title = "Error al Buscar solicitudes, puede que no exista";
          this.alertSwalError.show();
        }
      );

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
    let codproducto = datosIngresados.codigo;
    this.alertSwalAlert.title = null;
    this.alertSwalAlert.text = null;
    this.alertSwalError.title = null;

    /* Si existe el código en la solicitud se propone la cantidad */
    this.detallesolicitudpaciente.forEach(async element => {
      if(codproducto!== null) {

        if (element.codmei.trim() == datosIngresados.codigo.trim()) {
          this.validadato = true;

          this.FormDispensaDetalle.get('cantidad').setValue(element.cantsoli - element.cantdespachada);
          this.btnagregar = true;

            this.validacombolote = true;
            this.validadato = true;


            this._buscasolicitudService.BuscaLotesProductosxPac(this.servidor, this.hdgcodigo, this.esacodigo,
              this.cmecodigo, datosIngresados.codigo, this.solicitudpaciente.bodorigen,
              this.solicitudpaciente.boddestino, this.cliid).subscribe(response => {
                if (response != null) {
                  var index = 0;
                    response.forEach(x => {
                      x.row = index;
                      this.detalleslotes.push(x);
                      index++;
                    });
                  if (this.detalleslotes.length == 1) {

                    if(this.FormDispensaDetalle.value.cantidad <= this.detalleslotes[0].cantidad){
                      this.FormDispensaDetalle.get('lote').setValue(this.detalleslotes[0].lote);
                      this.FormDispensaDetalle.get('fechavto').setValue(this.datePipe.transform(this.detalleslotes[0].fechavto, 'dd-MM-yyyy'));
                      this.btnagregar = true;
                      this.lote = this.detalleslotes[0].lote;
                      this.fechavto = this.detalleslotes[0].fechavto;

                    }else{
                      this.fechavto = this.detalleslotes[0].fechavto;
                      this.FormDispensaDetalle.get('lote').setValue(this.detalleslotes[0].lote);
                      this.FormDispensaDetalle.get('fechavto').setValue(this.datePipe.transform(this.detalleslotes[0].fechavto, 'dd-MM-yyyy'));
                      this.alertSwalAlert.title ="El lote seleccionado tiene disponible"+" "+ this.detalleslotes[0].cantidad+" para dispensar";
                      this.alertSwalAlert.show();
                    }

                  }
                  this.detallessolicitudes.forEach(x=>{
                    if(this.FormDispensaDetalle.value.codigo == x.codmei && this.FormDispensaDetalle.value.lote == x.lote){
                      this.alertSwalAlert.title = "Este producto ya tiene este lote ingresado en la grilla";
                      this.alertSwalAlert.show();
                      this.btnagregar = false;
                    }else{
                      this.btnagregar = true;
                    }
                  });
                }
              });

        } else {

        }
      } else { return; }
    })
    if (this.validadato == false) {
      if(datosIngresados.codigo != null){
        this.FormDispensaDetalle.reset();
        this.alertSwalError.title = "El valor del Código Ingresado No pertenece a la Solicitud";
        this.alertSwalError.show();
      }
    }
  }

  LlamaFecha(loteyfecha: any) {
    const fechaylote = loteyfecha.split('/');
    const fechav = fechaylote[0];
    const loteprod = fechaylote[1];

    this.alertSwalAlert.title = null;
    this.alertSwalAlert.text = null;
    this.detalleslotes.forEach(element => {
      if (loteprod == element.lote && fechav == element.fechavto) {
        if(loteprod == ""){
          this.alertSwalAlert.text = "Debe Seleccionar lote";
          this.alertSwalAlert.show();
          this.FormDispensaDetalle.get('fechavto').setValue(null);
          this.btnagregar = false;
        }else{
        if(this.FormDispensaDetalle.value.cantidad <= element.cantidad ){
          this.FormDispensaDetalle.get('fechavto').setValue(this.datePipe.transform(element.fechavto, 'dd-MM-yyyy'));
          this.fechavto = element.fechavto;
          this.btnagregar = true;
        }else{
          this.alertSwalAlert.title ="El lote seleccionado tiene disponible"+" "+element.cantidad+" para dispensar";//  La cantidad debe ser menor o igual al saldo del lote seleccionado:"+" " +element.cantidad;
          this.alertSwalAlert.show();
          this.btnagregar = false;
          this.FormDispensaDetalle.get('lote').setValue(0);
          this.FormDispensaDetalle.get('fechavto').setValue(null);
        }
        }
      }
      this.detallessolicitudes.forEach(x=>{
        if(this.FormDispensaDetalle.value.codigo == x.codmei && loteprod == x.lote){
          this.alertSwalAlert.title = "Este producto ya tiene este lote ingresado en la grilla";
          this.alertSwalAlert.show();
          this.btnagregar = false;
        }
      });
    });
  }

  valida_cantidad(cantidad: number, datoingresado: any) {
    this.alertSwalAlert.text = null;
    this.alertSwalAlert.title = null;

    let codproducto = datoingresado.codigo;
    let cantidadprod = cantidad;
    if(cantidadprod !== null) {
      if(!this.detallessolicitudes.length) {
        this.detallesolicitudpaciente.forEach(element => {
          if (element.codmei.trim() == datoingresado.codigo.trim()) {
            if(cantidad > element.cantsoli - element.cantdespachada){
              this.alertSwalAlert.text = "La cantidad a despachar debe ser menor o igual a la cantidad Pendiente";
              this.alertSwalAlert.show();
              this.btnagregar = false;
            }else{
              if(cantidad < 0) {
                this.FormDispensaDetalle.get('cantidad').setValue(element.cantsoli - element.cantdespachada);
                this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
                this.alertSwalAlert.show();
                this.btnagregar = false;

              }else{
                if(cantidad <= element.cantsoli - element.cantdespachada) {
                  this.btnagregar = true;
                }
              }
            }
          }
        });
      } else {
        this.sumatoriaProductoagregar(codproducto, cantidadprod);
      }
    } else { return; }
  }

  sumatoriaProductoagregar(codprod: string, cantprod: number) {
    let sumacantdespachar = cantprod;
    var loteprod =null
    if(this.FormDispensaDetalle.value.lote !=null){
      const fechaylote = this.FormDispensaDetalle.value.lote.split('/');
    const fechav = fechaylote[0];
    loteprod = fechaylote[1];
    }
    this.detallessolicitudes.forEach(dat => {
      if(codprod === dat.codmei) {

        sumacantdespachar =  sumacantdespachar + dat.cantadespachar;
        let pendiente = dat.cantsoli - dat.cantdespachada;
        if(sumacantdespachar > pendiente) {
          this.alertSwalAlert.text = "La cantidad excede lo solicitado";
          this.alertSwalAlert.show();
          this.btnagregar = false;
        } else {
          this.detallessolicitudes.forEach(x=>{
            if(this.FormDispensaDetalle.value.codigo == x.codmei && loteprod == x.lote){
              this.alertSwalAlert.title = "Este producto ya tiene este lote ingresado en la grilla";
              this.alertSwalAlert.show();
              this.btnagregar = false;
            }else{
              if(cantprod < 0) {
                this.FormDispensaDetalle.get('cantidad').setValue(0);
                this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
                this.alertSwalAlert.show();
              }
              this.btnagregar = true;
            }
          });
        }
      }
    });
  }

  validacantidadgrilla(id: number, registrodespacho: DespachoDetalleSolicitud) {
    this.alertSwalAlert.text = null;
    var idg =0;
    var cantmayorpendiente = true;
    if(registrodespacho.sodeid>0){
      if(this.IdgrillaRecepcion(registrodespacho)>=0){
        idg = this.IdgrillaRecepcion(registrodespacho)
        if(this.detallessolicitudes[idg].cantadespachar > this.detallessolicitudes[idg].cantsoli- this.detallessolicitudes[idg].cantdespachada){

          this._buscasolicitudService.BuscaSaldoLoteBodega(this.servidor, this.hdgcodigo,
            this.cmecodigo,this.solicitudpaciente.boddestino,this.detallessolicitudes[idg].meinid,
            this.detallessolicitudes[idg].lote,this.detallessolicitudes[idg].fechavto).subscribe(
            response => { });

          this.alertSwalAlert.text = "La cantidad a recepcionar debe ser menor o igual a la cantidad Pendiente";
          this.alertSwalAlert.show();
          this.detallessolicitudes[idg].cantadespachar = this.detallessolicitudes[idg].cantadespacharresp
          this.detallessolicitudespaginacion[idg].cantadespachar = this.detallessolicitudes[idg].cantadespachar ;
          this.logicaVacios();
        }else{
          if(this.detallessolicitudes[idg].cantadespachar <0) {
            this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0. Ingrese cantidad nuevamente.";
            this.alertSwalAlert.show();
            this.detallessolicitudes[idg].cantadespachar = registrodespacho.cantadespacharresp
            this.detallessolicitudespaginacion[idg].cantadespachar = this.detallessolicitudes[idg].cantadespachar ;
            this.logicaVacios();
          }else{
            if(this.detallessolicitudes[idg].cantadespachar < this.detallessolicitudes[idg].cantsoli- this.detallessolicitudes[idg].cantdespachada || this.detallessolicitudes[idg].cantadespachar>0){
              this._buscasolicitudService.BuscaSaldoLoteBodega(this.servidor, this.hdgcodigo,
                this.cmecodigo,this.solicitudpaciente.boddestino,this.detallessolicitudes[idg].meinid,
                this.detallessolicitudes[idg].lote,this.detallessolicitudes[idg].fechavto).subscribe(
                response => {
                  if (response != null) {
                    this.loteparagrilla = response;
                    if(this.loteparagrilla.length>0){
                      if( this.detallessolicitudes[idg].cantadespachar > this.loteparagrilla[0].saldo ){
                        this.alertSwalAlert.text = "El saldo del lote tiene "+ this.loteparagrilla[0].saldo+", ingresar cantidad menor";
                        this.alertSwalAlert.show();
                        this.detallessolicitudes[idg].cantadespachar = this.detallessolicitudes[idg].cantadespacharresp; //this.detallessolicitudes[idg].cantsoli - this.detallessolicitudes[idg].cantdespachada ;
                        this.detallessolicitudespaginacion[idg].cantadespachar = this.detallessolicitudes[idg].cantadespacharresp ;
                        this.activabtndispensar = false;
                        this.logicaVacios();
                      }else{
                        this.logicaVacios();
                      }
                    }
                  }
                });
            }
          }
        }
      }
    } this.logicaVacios();
  }


  IdgrillaRecepcion(registro: DetalleSolicitud) {

    let indice = 0;
    for (const articulo of this.detallessolicitudes) {
      if (registro.codmei === articulo.codmei) {
        if(registro.lote == articulo.lote){
          return indice;
        }
      }
      indice++;
    }
    return -1;
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
    if(this.solicitudpaciente != undefined){
      if(this.solicitudpaciente.bandera === 1){  //Si bandera es =2 solicitud tomada
        this.ValidaEstadoSolicitud(1,'BuscaSolicitudes');
      }
    }

    this._BSModalRef = this._BsModalService.show(BusquedasolicitudpacientesComponent, this.setModalBusquedaSolicitudPaciente());
    this._BSModalRef.content.onClose.subscribe((RetornoSolicitudes: Solicitud) => {

      /* Verifica si el retorno de Modal viene con datos o no //@MLobos*/
      if (RetornoSolicitudes !== undefined) {
        this._buscasolicitudService.BuscaSolicitud(RetornoSolicitudes.soliid, this.hdgcodigo,
          this.esacodigo, this.cmecodigo, 0, "", "", 0, 0, 0, this.servidor, 0, -1, 0, 0, 0, 0,
          "",0,"","").subscribe(
          response => {
            if (response != null) {
              this.solicitudpaciente = response[0];
              this.detalleslotes = [];
              this.estado_aux = this.solicitudpaciente.estadosolicitud;
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
              this.detallesolicitudpaciente.forEach(element => {
                element.backgroundcolor = (element.tienelote == "N") ? 'gris' : 'amarillo';
                cantpendiente = element.cantsoli - element.cantdespachada;
                element.cantadespachar = cantpendiente;
                element.cantadespacharresp = element.cantadespachar;

                if (element.tienelote == "N" && cantpendiente > 0) {
                  this.detallessolicitudes.unshift(element);
                  this.detallessolicitudes.forEach(x=>{
                    x.bloqcampogrilla = true;
                  })
                  this.detallessolicitudespaginacion = this.detallessolicitudes.slice(0, 20);
                }
              });
              this.logicaVacios();
              this.detallesolicitudpacientepaginacion = this.detallesolicitudpaciente;
              this.ActivaBotonBuscaGrilla = true;
              this.detallesolicitudpaciente_aux = this.detallesolicitudpaciente;
              this.detallesolicitudpacientepaginacion_aux = this.detallesolicitudpacientepaginacion;
              this.FormDispensaDetalle.reset();

              if(this.solicitudpaciente.bandera === 2){  //Si bandera es =2 solicitud tomada
                this.activabtndispensar = false;
                this.btnagregar = false;
                this.FormDispensaDetalle.disable();
                if(this.detallessolicitudes.length >0){
                  this.detallessolicitudes.forEach(x=>{
                    x.bloqcampogrilla = false;
                    x.bloqcampogrilla2 = false;
                  })
                  this.detallessolicitudespaginacion = this.detallessolicitudes.slice( 0,20);
                  this.alertSwalAlert.title = "Solicitud en preparación";
                  this.alertSwalAlert.text = "No puede ser modificada";
                  this.alertSwalAlert.show();

                  this.desactivaAccion();

                }else{
                  this.detallessolicitudespaginacion = this.detallessolicitudes.slice( 0,20);
                  this.alertSwalAlert.title = "Solicitud en preparación";
                  this.alertSwalAlert.text = "No puede ser modificada";
                  this.alertSwalAlert.show();

                  this.desactivaAccion();

                }
              }else{
                this.ValidaEstadoSolicitud(2,'BuscaSolicitudes');

                this.activaAccion();

              }
            }
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
        buscasolicitud: "Dipensar_Solicitud",
        paginaorigen: 8,
        solicitudorigen: this.solicitud

      }
    };
    return dtModal;
  }

  Limpiar() {
    if(this.solicitudpaciente != undefined){
      if(this.solicitudpaciente.bandera != 2){
        this.ValidaEstadoSolicitud(1,'limpiar');
      }
    }
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
    this.detallesolicitudpaciente_aux = [];
    this.detallesolicitudpacientepaginacion_aux = [];
    this.ActivaBotonBuscaGrilla = false;
    this.solicitudpaciente = undefined;
  }

  addArticuloGrillaDispensacion(dispensacion: any) {
    this.alertSwalAlert.title = null;
    this.alertSwalAlert.text = null;
    var fechaylote = null;
    var fechav = null;
    var loteprod = null;
    if (this.detalleslotes.length) {
      fechaylote = dispensacion.lote.split('/');
      fechav = fechaylote[0];
      loteprod = fechaylote[1];
    }

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
            if(loteprod === undefined || loteprod === null){
              temporal.lote = dispensacion.lote;
            }else{
              temporal.lote         = loteprod;
            }
            temporal.fechavto = dispensacion.fechavto;

            temporal.cantadespachar = this.FormDispensaDetalle.value.cantidad;
            temporal.cantadespacharresp = dispensacion.cantidad;
            temporal.soliid = element.soliid;
            temporal.sodeid = element.sodeid;
            temporal.meinid = element.meinid;
            temporal.cantdespachada = element.cantdespachada;
            temporal.cantsoli = element.cantsoli;
            temporal.observaciones = element.observaciones;
            temporal.cantdevolucion = element.cantdevolucion;

            this.detallessolicitudes.unshift(temporal);
            this.detallessolicitudespaginacion = this.detallessolicitudes.slice(0,20)

            this.logicaVacios();
          }

        });
      }
    }

    this.FormDispensaDetalle.reset();
    this.detalleslotes = [];
    this.validadato = false;
  }

  async ConfirmaDispensarSolicitud(datos: any) {
    this.alertSwalAlert.title = null;
    await this.sumatoriaProductogrilla();

    if(this.validasumatoria) {
      const Swal = require('sweetalert2');
      Swal.fire({
        title: '¿ Dispensar a paciente ?',
        text: "Confirmar el despacho al paciente",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
      }).then(  result => {

        if (result.value) {

          this.validaSinstock();

        }
      });
    } else {
      return;
    }

  }


  async validaSinstock() {
    let stock : StockProducto[];
    let index : number = 0;
    let indexdetalle = this.detallessolicitudes.length;
    this.detalleconstock = [];
    this.respPermiso = '';

    await this.detallessolicitudes.forEach(async element =>  {

      this._creaService.BuscaStockProd(element.meinid,
        this.solicitudpaciente.boddestino, this.usuario, this.servidor).subscribe(res => {
          stock = res;
          index++;

          if(element.cantadespachar > stock[0].stockactual) {

            if (index === 0) {
              this.respPermiso = "<p>Saldo del Artículo <strong>" + element.codmei + "</strong> es " + stock[0].stockactual + "</p>";
            } else {
              this.respPermiso = this.respPermiso + "<p>Saldo del Artículo <strong>" + element.codmei + "</strong> es " + stock[0].stockactual + "</p>";
            }

            this.valida = false;

          }else {
            this.valida = true;

            this.detalleconstock.push(element);
          }

          /** indica fin ciclo  */
          if( index === indexdetalle ) {
            this.limpialistado();

          }
        });

    });

  }

  DispensarSolicitud() {
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
      temporal.fechavto = element.fechavto;
      temporal.bodorigen = this.solicitudpaciente.bodorigen;
      temporal.boddestino = this.solicitudpaciente.boddestino;
      temporal.codservicioori = this.solicitudpaciente.codservicioori;
      temporal.codservicioactual = this.solicitudpaciente.codservicioactual;

      this.paramdespachos.unshift(temporal);
    });
    this.dispensarSol();

  }

  dispensarSol() {
    var nombrepaciente;
    var cantpendiente;
    this.getCodambito();

    if(this.solicitudpaciente != undefined){
      if(this.solicitudpaciente.bandera != 2){
        this.ValidaEstadoSolicitud(1,'dispensarSol');
      }
    }

    this.dispensasolicitudService.GrabaDispensacion(this.paramdespachos).subscribe(
      async response => {
        if (response != null) {
          this.alertSwal.title = "Dispensación a paciente exitosa"; //mensaje a mostrar
          this.alertSwal.show(); // para que aparezca
          this.detallessolicitudespaginacion = [];
          this.detallessolicitudes = [];
          this.btnImprime = true;
          this._buscasolicitudService.BuscaSolicitud(this.solicitudpaciente.soliid, this.hdgcodigo,
            this.esacodigo, this.cmecodigo, 0, null, null, 0, 0, null, this.servidor, 0,
            this.codambito, 0, 0, 0, 0, "",0,"","").subscribe(
            response => {
              if (response != null) {
                this.solicitudpaciente = response[0];
                this.estado_aux = this.solicitudpaciente.estadosolicitud;
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
                this.FormDispensaSolicitudPaciente.get('fecha').setValue(this.datePipe.transform(this.solicitudpaciente.fechacreacion, 'dd-MM-yyyy HH:mm:ss'));
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
                  element.cantadespacharresp = element.cantadespachar;
                });
                this.logicaVacios();
                if(this.solicitudpaciente.bandera === 2){
                  this.activabtndispensar = false;
                  this.btnagregar = false;
                  this.FormDispensaDetalle.disable();
                  if(this.detallessolicitudes.length >0){
                    this.detallessolicitudes.forEach(x=>{
                      x.bloqcampogrilla = false;
                      x.bloqcampogrilla2 = false;
                    })
                    this.detallessolicitudespaginacion = this.detallessolicitudes.slice( 0,20);
                    this.alertSwalAlert.title = "Solicitud en preparación";
                    this.alertSwalAlert.text = "No puede ser modificada";

                    this.alertSwalAlert.show();

                    this.desactivaAccion();

                  }

                }else{
                  this.ValidaEstadoSolicitud(2,'BuscaSolicitudes');

                  this.activaAccion();

                }
              }
            },error => {

              this.alertSwalError.title = "Error al Buscar solicitudes, puede que no exista";
              this.alertSwalError.show();
            });
        }
      },
      error => {

        this.alertSwalError.title = "Error al intentar dispensar a paciente"; //mensaje a mostrar
        this.alertSwalError.show();// para que aparezca

      }
    );
  }

  async sumatoriaProductogrilla() {
    var holder = {};
    this.detallessolicitudes.forEach(d => {
      if (holder.hasOwnProperty(d.codmei)) {
        holder[d.codmei] = holder[d.codmei] + d.cantadespachar;
      } else {
        holder[d.codmei] = d.cantadespachar;
      }
    });
    var obj2 = [];
    for (var prop in holder) {
      obj2.push({ codmei: prop, cantadespachar: holder[prop] });
    }
    /** */
    for(let e of obj2){
      this.validasumatoriagrilla(e.codmei, e.cantadespachar).then(x => {
        if(x) {
          this.validasumatoria = true;
          return;
        } else {
          this.alertSwalAlert.title = "La cantidad excede lo solicitado";
          this.alertSwalAlert.text = `Codigo: ${e.codmei} Cantidad a despachar: ${e.cantadespachar}`;
          this.alertSwalAlert.show();
          this.validasumatoria = false;
          return;
        }
      });
    }
  }

  async validasumatoriagrilla(codprod: string, sumatoriaprod: number) {
    let sumacantdespachar = sumatoriaprod;
    for(let dat of this.detallessolicitudes) {
      if(codprod === dat.codmei) {
        let pendiente = dat.cantsoli - dat.cantdespachada;
        if(sumacantdespachar > pendiente) {
          return false;
        } else {
          return true;
        }
      }
    }
  }

  eventosSolicitud() {

    // SE CONFIRMA Eliminar Solicitud
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
          if (response != null) {
            window.open(response[0].url, "", "");
          }
        },
        error => {
          this.alertSwalError.title = "Error al Imprimir Despacho Solicitud Paciente";
          this.alertSwalError.show();
          this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
          });
        }
      );
  }

  salir() {
    if(this.solicitudpaciente != undefined){
      if(this.solicitudpaciente.bandera != 2){
        this.ValidaEstadoSolicitud(1,'salir');
      }
    }

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

  async logicaVacios() {
    this.vaciosProductos();
    if (this.vacios === true) {
      this.activabtndispensar = false;
    }
    else {
      this.activabtndispensar = true;
    }

  }

  vaciosProductos() {
    if (this.detallessolicitudespaginacion.length) {
      for (var data of this.detallessolicitudespaginacion) {

        if (data.cantadespachar <= 0 || data.cantadespachar === null) {
          this.vacios = true;
          return;
        }else{
          this.vacios = false;
        }
      }
    }else{
      this.vacios = true;
    }
  }

  async findArticuloGrilla() {
    var nombrepaciente: string;
    var cantpendiente: number;
    var edadunidad;
    this.loading = true;
    if ( this.FormDatosProducto.controls.codigo.touched &&
        this.FormDatosProducto.controls.codigo.status !== 'INVALID') {
        var codProdAux = this.FormDatosProducto.controls.codigo.value.toString();
      if(this.FormDispensaSolicitudPaciente.controls.numsolicitud.value >0){

        this.detallesolicitudpaciente = [];
        this.detallesolicitudpacientepaginacion = [];
        this._buscasolicitudService.BuscaSolicitud(this.FormDispensaSolicitudPaciente.controls.numsolicitud.value,
        this.hdgcodigo, this.esacodigo, this.cmecodigo, 0, "", "", 0, 0, 0, this.servidor,
          0, -1, 0, 0, 0, 0, "",0,codProdAux,"").subscribe(response => {
            if (response != null) {
              this.solicitudpaciente = response[0];
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
              this.FormDispensaSolicitudPaciente.get('fecha').setValue(this.datePipe.transform(this.solicitudpaciente.fechacreacion, 'dd-MM-yyyy HH:mm:ss'));
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
              this.detallesolicitudpaciente.forEach(element => {
                element.backgroundcolor = (element.tienelote == "N") ? 'gris' : 'amarillo';
                cantpendiente = element.cantsoli - element.cantdespachada;
                element.cantadespachar = cantpendiente;
                element.cantadespacharresp = element.cantadespachar;
                if (element.tienelote == "N" && cantpendiente > 0) {
                  this.detallessolicitudes.unshift(element);
                  this.detallessolicitudespaginacion = this.detallessolicitudes.slice(0, 20);
                }
              });
              this.logicaVacios();
              this.ActivaBotonBuscaGrilla = true;
              this.ActivaBotonLimpiaBusca = true;
              this.detallesolicitudpacientepaginacion = this.detallesolicitudpaciente;
              this.FormDispensaDetalle.reset();
            }
          });
      }
    }else{
      this.limpiarCodigo();
      this.loading = false;
      return;
    }
  }

  limpiarCodigo() {
    this.loading = true;

    this.FormDatosProducto.controls.codigo.reset();
    var codProdAux = '';

    this.detallesolicitudpaciente = [];
    this.detallesolicitudpacientepaginacion = [];


    // Llenar Array Auxiliares
    this.detallesolicitudpaciente = this.detallesolicitudpaciente_aux;
    this.detallesolicitudpacientepaginacion = this.detallesolicitudpacientepaginacion_aux;
    this.ActivaBotonLimpiaBusca = false;

    this.loading = false;
  }

  ValidaEstadoSolicitud(bandera: number, nada:string){
    var recetaid : number = 0;
    var soliid   : number = 0;
    if(this.solicitudpaciente != undefined){
      if(this.solicitudpaciente.soliid === undefined){
        soliid = 0;
      }else{
        soliid = this.solicitudpaciente.soliid;
      }
    } else {
      soliid = 0;
    }

    this._buscasolicitudService.ValidaEstadoSolicitudCargada(soliid,0,this.servidor,
      ' ',recetaid,bandera).subscribe(
      response => {  });

  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {​​​​​​​​
    if(this.solicitudpaciente != undefined){
      if(this.solicitudpaciente.bandera != 2){
        this.ValidaEstadoSolicitud(1,'HostListener');
      }
    }
  }​​​​​​​​

  async CambioCheck(registro: DespachoDetalleSolicitud,id:number,event:any,marcacheckgrilla: boolean){

    if(event.target.checked){
      registro.marcacheckgrilla = true;
      this.desactivabtnelim = true;
      await this.isEliminaIdGrilla(registro)
      await this.detallessolicitudes.forEach(d=>{
        if(d.marcacheckgrilla === true){
          this.desactivabtnelim = true;
        }
      });
     }else{
      registro.marcacheckgrilla = false;
      this.desactivabtnelim = false;
      await this.isEliminaIdGrilla(registro);
      await this.detallessolicitudes.forEach(d=>{
        if(d.marcacheckgrilla === true){
          this.desactivabtnelim = true;
        }
      });
    }
  }

  async isEliminaIdGrilla(registro: DespachoDetalleSolicitud) {

    let indice = 0;
    for (const articulo of this.detallessolicitudes) {
      if (registro.codmei === articulo.codmei && registro.sodeid === articulo.sodeid) {
        articulo.marcacheckgrilla = registro.marcacheckgrilla;
        return indice;
      }
      indice++;
    }
    return -1;
  }

  ConfirmaEliminaProductoDeLaGrilla2() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirme eliminación de producto de la fila ?',
      text: "Confirmar la eliminación del producto",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.EliminaProductoDeLaGrilla2();
      }
    })
  }

  EliminaProductoDeLaGrilla2() {
    this.detallessolicitudespaginacion.forEach(registro=>{
      if (registro.acciond == "" && this.IdgrillaRecepcion(registro) >= 0 && registro.sodeid > 0) {
        // Elominar registro nuevo la grilla
        if(registro.marcacheckgrilla === true){
          this.desactivabtnelim = false;
          this.detallessolicitudes.splice(this.IdgrillaRecepcion(registro), 1);
          this.detallessolicitudespaginacion = this.detallessolicitudes.slice(0, 20);
          this.logicaVacios();
        }
      } else {
        // elimina uno nuevo pero que se ha modificado la cantidad
        if(registro.marcacheckgrilla === true){
          this.desactivabtnelim = false;
          this.detallessolicitudes.splice(this.IdgrillaRecepcion(registro), 1);
          this.detallessolicitudespaginacion = this.detallessolicitudes.slice(0, 20);
          this.logicaVacios();

        }
      }
    });
  }

  limpialistado() {

    this.detallesolicitudpacientepaginacion = this.detalleconstock;
    this.detallessolicitudespaginacion = this.detalleconstock;
    this.detallessolicitudes = this.detalleconstock;

    if(this.valida){
      this.DispensarSolicitud();

    }else{
      const Swal = require('sweetalert2');
      var text = "`<h2>No puede Generar Despacho</h2><br/>" + this.respPermiso + "`";
      Swal.fire({
        html: text
      });
    }

  }

  mensajealert( title: string, msg: string ) {
    this.alertSwalAlert.title = title;
    this.alertSwalAlert.text = msg;
    this.alertSwalAlert.show();
    return;

  }

  desactivaAccion() {
    this.btnDispensar = false;

  }

  activaAccion() {
    this.btnDispensar = true;

  }


}
