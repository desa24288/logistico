import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { environment } from '../../../environments/environment';
import { BusquedasolicitudesComponent } from '../busquedasolicitudes/busquedasolicitudes.component';
import { DetalleSolicitud } from 'src/app/models/entity/DetalleSolicitud';
import { DespachoSolicitud } from '../../models/entity/DespachoSolicitud';
import { DespachoDetalleSolicitud } from 'src/app/models/entity/DespachoDetalleSolicitud';
import { SolicitudService } from 'src/app/servicios/Solicitudes.service';
import { Solicitud } from 'src/app/models/entity/Solicitud';
import { EventosSolicitudComponent } from '../eventos-solicitud/eventos-solicitud.component';
import { EventosDetallesolicitudComponent } from '../eventos-detallesolicitud/eventos-detallesolicitud.component';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Detallelote } from '../../models/entity/Detallelote';
import { InformesService } from '../../servicios/informes.service';
import { Permisosusuario } from '../../permisos/permisosusuario';

@Component({
  selector: 'app-despachosolicitudes',
  templateUrl: './despachosolicitudes.component.html',
  styleUrls: ['./despachosolicitudes.component.css'],
  providers: [InformesService]
})
export class DespachosolicitudesComponent implements OnInit {

  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public modelopermisos                 : Permisosusuario = new Permisosusuario();
  public FormDespachoSolicitud          : FormGroup;
  public FormDespachoSolicitud2         : FormGroup;
  public hdgcodigo                      : number;
  public esacodigo                      : number;
  public cmecodigo                      : number;
  public lote                           : string;
  public fechavto                       : string;
  public tiporegistro                   : string;
  public DespachoSolicitud              : DespachoSolicitud;
  public varListaDetalleDespacho        : DetalleSolicitud;
  public varDespachoDetalleSolicitud    : DespachoDetalleSolicitud;
  public numsolic                       : boolean = false;
  public validacombolote                : boolean = false;
  public validadato                     : boolean = false;
  public listaDetalleSolicitud          : Array<DetalleSolicitud> = [];
  public listaDetalleSolicitudpaginacion: Array<DetalleSolicitud> = [];
  public listaDetalleDespachopaginacion : Array<DespachoDetalleSolicitud> = [];
  public listaDetalleDespacho           : Array<DespachoDetalleSolicitud> = [];
  public _Solicitud                     : Solicitud;
  public _DetalleSolicitud              : DetalleSolicitud;
  public usuario                        = environment.privilegios.usuario;
  public servidor                       = environment.URLServiciosRest.ambiente;
  public locale                         = 'es';
  public bsConfig                       : Partial<BsDatepickerConfig>;
  public colorTheme                     = 'theme-blue';
  private _BSModalRef                   : BsModalRef;
  public detalleslotes                  : Detallelote[] = [];

  cantpendiente           : number = 10;
  retornosolicitud        : any;
  retornosolicituddetalle : any;
  onClose                 : any;
  bsModalRef              : any;
  editField               : any;
  activabtndespacho       : boolean = false;
  activabtnimprime        : boolean = false;
  asignacolor             : boolean = false;
  asignacolor2            : boolean = false;

  constructor(
    private formBuilder           : FormBuilder,
    private router                : Router,
    private route                 : ActivatedRoute,
    public _BsModalService        : BsModalService,
    public datePipe               : DatePipe,
    public localeService          : BsLocaleService,
    public _SolicitudService      : SolicitudService,
    public _buscasolicitudService: SolicitudService,
    private _imprimesolicitudService: InformesService

  ) {

    this.FormDespachoSolicitud = this.formBuilder.group({
      numsolicitud: [{ value: null, disabled: true }, Validators.required],
      esticod     : [{ value: null, disabled: true }, Validators.required],
      hdgcodigo   : [{ value: null, disabled: false }, Validators.required],
      esacodigo   : [{ value: null, disabled: false }, Validators.required],
      cmecodigo   : [{ value: null, disabled: false }, Validators.required],
      prioridad   : [{ value: null, disabled: true }, Validators.required],
      fecha       : [{ value: null, disabled: false }, Validators.required],
      fechamostrar: [{ value: new Date(), disabled: true }, Validators.required],
      bodorigen   : [{ value: null, disabled: true }, Validators.required],
      boddestino  : [{ value: null, disabled: true }, Validators.required]
    });

    this.FormDespachoSolicitud2 = this.formBuilder.group({
      codigoproducto: [{ value: null, disabled: false }, Validators.required],
      cantidad      : [{ value: null, disabled: false }, Validators.required],
      lote          : [{ value: null, disabled: false }, Validators.required],
      fechavto      : [{ value: null, disabled: false }, Validators.required]
    });

  }

  ngOnInit() {
    this.setDate();
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();


    this.route.paramMap.subscribe(param => {
      if (param.has("id_solicitud")) {
        this.CargaSolicitud(parseInt(param.get("id_solicitud"), 10));
      }
    })
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  CargaSolicitud(ID_Solicitud: number) {

    this._Solicitud = new (Solicitud);
    this._buscasolicitudService.BuscaSolicitud(ID_Solicitud, this.hdgcodigo, this.esacodigo, this.cmecodigo, null, null, null, null, null, null, this.servidor, 0, 0, 0, 0, 0, 0, "",0).subscribe(
      response => {
        this._Solicitud = response[0];
        this.numsolic = true;
        this.FormDespachoSolicitud.get('numsolicitud').setValue(response[0].soliid);
        this.FormDespachoSolicitud.get('boddestino').setValue(response[0].boddestinodesc);
        this.FormDespachoSolicitud.get('bodorigen').setValue(response[0].bodorigendesc);
        this.FormDespachoSolicitud.get('fechamostrar').setValue(new Date(response[0].fechacreacion));
        this.FormDespachoSolicitud.get('esticod').setValue(response[0].estadosolicitudde);
        this.FormDespachoSolicitud.get('prioridad').setValue(response[0].desprioridadsoli);
        
        this._Solicitud.solicitudesdet.forEach(element =>{
          element.backgroundcolor = (element.tienelote == "N")?'gris':'amarillo';

          if(element.tienelote == "N"){

            if((element.cantsoli-element.cantdespachada)>0){
              
              element.cantadespachar = (element.cantsoli -element.cantdespachada);
              // element.hdgcodigo = this.hdgcodigo;
              // element.esacodigo = this.esacodigo;
              // element.cmecodigo = this.cmecodigo;
              // element.bodorigen =this._Solicitud.bodorigen;
              // element.boddestino = this._Solicitud.boddestino;
              // element.servidor = this.servidor;
              // element.usuariodespacha = this.usuario;
              this.listaDetalleDespacho.unshift(element);
              this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice(0,50);
              this.activabtndespacho = true;
            }              
          }
          
        })

        this.listaDetalleSolicitud = this._Solicitud.solicitudesdet;
        this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(0, 50);
        this.FormDespachoSolicitud2.reset();
      })
  }


  BuscarSolicitudes() {

    let _DetalleDespacho           : DespachoDetalleSolicitud;

    this._BSModalRef = this._BsModalService.show(BusquedasolicitudesComponent, this.setModalBusquedaSolicitud());
    this._BSModalRef.content.onClose.subscribe((RetornoSolicitudes: Solicitud) => {
      if (RetornoSolicitudes == undefined) { }
      else {
               this._SolicitudService.BuscaSolicitud(RetornoSolicitudes.soliid, this.hdgcodigo,
                  this.esacodigo, this.cmecodigo, 0,"","", 0,0,0,this.servidor, 0,0,0,0,0,0,"",0).subscribe(
                  response => {
                                        
                                this.listaDetalleDespachopaginacion=[];
                                
                                this.listaDetalleDespacho = [];
                                this._Solicitud = new (Solicitud);
                                this._Solicitud = response[0];
                              
                                this.FormDespachoSolicitud.get('numsolicitud').setValue(this._Solicitud.soliid);
                                if (this._Solicitud.soliid > 0) {
                                  this.numsolic = true;
                                }
                                this.FormDespachoSolicitud.get('boddestino').setValue(this._Solicitud.boddestinodesc);
                                this.FormDespachoSolicitud.get('bodorigen').setValue(this._Solicitud.bodorigendesc);
                                this.FormDespachoSolicitud.get('fechamostrar').setValue(new Date(this._Solicitud.fechacreacion));
                                this.FormDespachoSolicitud.get('esticod').setValue(this._Solicitud.estadosolicitudde);
                                this.FormDespachoSolicitud.get('prioridad').setValue(this._Solicitud.desprioridadsoli);

                                response[0].solicitudesdet.forEach(element =>{
                                    element.backgroundcolor = (element.tienelote == "N")?'gris':'amarillo';

                                  // if(element.tienelote == "S"){
                                  //   console.log("Tiene lotes a asignar",element)
                                  //   // this.listaDetalleSolicitud.unshift(element);
                                  //   // this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(0, 8);  
                                    
                                  // }
                                  // else{
                                    if(element.tienelote == "N"){
                                  
                                      if((element.cantsoli-element.cantdespachada)>0){
                                        
                                        element.cantadespachar = (element.cantsoli -element.cantdespachada);
                                        if(element.cantadespachar >(element.cantsoli-element.cantdespachada)){
                                    
                                          this.alertSwalAlert.text="El valor a despachar es mayor que la cantidad pendiente";
                                          this.alertSwalAlert.show();
                                        }else{ console.log("valor a despachar menor que pendiente")}
                                        
                                        _DetalleDespacho = new(DespachoDetalleSolicitud);
                                        _DetalleDespacho = element;

                                        _DetalleDespacho.hdgcodigo = this.hdgcodigo;
                                        _DetalleDespacho.esacodigo = this.esacodigo;
                                        _DetalleDespacho.cmecodigo = this.cmecodigo;
                                        _DetalleDespacho.bodorigen =this._Solicitud.bodorigen;
                                        _DetalleDespacho.boddestino = this._Solicitud.boddestino;
                                        _DetalleDespacho.servidor = this.servidor;
                                        _DetalleDespacho.usuariodespacha = this.usuario;

                                        this.listaDetalleDespacho.unshift(_DetalleDespacho);
         
                                        this.activabtndespacho = true;
                                      }            

                                      this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice(0, 50);  
                                    }
                                  // }
                                })
                                
                                this.listaDetalleSolicitud = response[0].solicitudesdet;
                                this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(0, 50);
                              });
      }
    });
  }

  setModalBusquedaSolicitud() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Solicitudes', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        origen : 'Otros'
      }
    };
    return dtModal;
  }

  /* Confiormar guardado de movimiento previamente */
  ConfirmarEnviarDespacho(datos: any) {
    // sE CONFIRMA GURADADO DE REGISTRO
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirma despacho ?',
      text: "Confirmar despacho de la solicitud",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.DespacharSolictud(datos);
      }
    })
  }

  /* Guardar movimimientos */
  DespacharSolictud(datos: any) {
    /* se envía detalle del movimiento */
   
       if (this.listaDetalleDespacho.length > 0) {
      this.DespachoSolicitud = new (DespachoSolicitud);

      this.DespachoSolicitud.paramdespachos = this.listaDetalleDespacho;
      this.DespachoSolicitud.paramdespachos.forEach(element=>{
        element.hdgcodigo = this.hdgcodigo;
        element.esacodigo = this.esacodigo;
        element.cmecodigo = this.cmecodigo;
        element.bodorigen =this._Solicitud.bodorigen;
        element.boddestino = this._Solicitud.boddestino;
        element.servidor = this.servidor;
        element.usuariodespacha = this.usuario;
      })
      try {
      //  console.log(this.DespachoSolicitud)
        this._SolicitudService.DespacharSolicitud(this.DespachoSolicitud).subscribe(
          response => {
            if (response.respuesta == 'OK') {
              this.activabtnimprime = true;
              this.activabtndespacho = false;
              this.alertSwal.title = "Despacho realizado con éxito";
              this.alertSwal.show();

              this._buscasolicitudService.BuscaSolicitud(this._Solicitud.soliid, this.hdgcodigo, this.esacodigo, this.cmecodigo, null, null, null, null, null, null, this.servidor, 0, 0, 0, 0, 0, 0, "",0).subscribe(
                response => {
                  this.FormDespachoSolicitud.get('boddestino').setValue(response[0].boddestinodesc);
                  this.FormDespachoSolicitud.get('bodorigen').setValue(response[0].bodorigendesc);
                  this.FormDespachoSolicitud.get('fechamostrar').setValue(new Date(response[0].fechacreacion));
                  this.FormDespachoSolicitud.get('esticod').setValue(response[0].estadosolicitudde);
                  this.FormDespachoSolicitud.get('prioridad').setValue(response[0].desprioridadsoli);

                  response[0].solicitudesdet.forEach(element =>{
                    element.backgroundcolor = (element.tienelote == "N")?'gris':'amarillo';
        
                  })
                  // element.backgroundcolor = (element.tienelote == "N")?'gris':'amarillo';
                  this.listaDetalleSolicitud = response[0].solicitudesdet;
                  this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(0, 50);
                },
                error => {
                  console.log(error);
                  this.alertSwalError.title = "Error al Buscar solicitudes, puede que no exista";
                  this.alertSwalError.show();
                }
              )
            }
          },
          error => {
            console.log(error);
            this.alertSwalError.title = "Error al Despachar la Solicitud";
            this.alertSwalError.text = error;
            this.alertSwalError.show();

          }
        );

      } catch (err) {
        alert("Error : " + err)
      }
    }
    this.listaDetalleDespacho = []; this.listaDetalleDespachopaginacion = [];
  }

  Limpiar() {
    this.FormDespachoSolicitud.reset();
    this.FormDespachoSolicitud2.reset();
    this.listaDetalleSolicitudpaginacion = [];
    this.listaDetalleSolicitud = [];
    this.listaDetalleDespacho = [];
    this.listaDetalleDespachopaginacion = [];
    this.detalleslotes = [];
  }

  updateList(id: number, property: string, event: any) {
    var editField = event.target.textContent;
    if (property == 'cantadespachar') {
      if (this.listaDetalleSolicitud[id].cantsoli - this.listaDetalleSolicitud[id].cantdespachada >= parseInt(editField)) {
        this.listaDetalleSolicitudpaginacion[id][property] = parseInt(editField);
        this.listaDetalleSolicitud[id][property] = this.listaDetalleSolicitudpaginacion[id][property];
      } else {
        this.listaDetalleSolicitud[id].acciond = 'M';
      }
    }
  }
  cambio_cantidad(id: number, property: string, registro:DespachoDetalleSolicitud ) {
    if (this.listaDetalleDespachopaginacion[id]["sodeid"] == 0) {
      this.listaDetalleDespachopaginacion[id]["acciond"] = "I";
      
    }
    if (this.listaDetalleDespachopaginacion[id]["sodeid"] > 0) {
      this.listaDetalleDespachopaginacion[id]["acciond"] = "M";
    }
    this.listaDetalleDespachopaginacion[id][property] = this.listaDetalleDespachopaginacion[id][property]
    
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  codigo_ingresado(datosIngresados: any) {
      // console.log("Cod buscado",datosIngresados)
    /* Si existe el código   en la solicitud se propone la cantidad */
    this.alertSwalAlert.title = null;
    this.listaDetalleSolicitud.forEach(element => {

      if (element.codmei.trim() == datosIngresados.codigoproducto.trim()) {
        this.validadato = true;
        this.FormDespachoSolicitud2.get('cantidad').setValue(element.cantsoli - element.cantdespachada);
        this.tiporegistro = "M";
        if (element.tiporegmein == "M") {
          this.validacombolote = true;
          this.tiporegistro = "M";
          this._SolicitudService.BuscaLotesProductosxBod(this.servidor, this.hdgcodigo, this.esacodigo,
            this.cmecodigo, datosIngresados.codigoproducto, this._Solicitud.bodorigen, this._Solicitud.boddestino).subscribe(
              response => {
                // console.log("Trae lotes encontrados",response)
                this.detalleslotes = response;
                if (this.detalleslotes.length == 1) {
                  // console.log("2 lote encontrado",this.detalleslotes)
                  this.FormDespachoSolicitud2.get('fechavto').setValue(this.datePipe.transform(this.detalleslotes[0].fechavto, 'dd-MM-yyyy'));
                  this.FormDespachoSolicitud2.get('lote').setValue(this.detalleslotes[0].lote);
                  this.lote = this.detalleslotes[0].lote;
                  this.fechavto = this.detalleslotes[0].fechavto;
                }
              }
            )
        } else {
          this.validacombolote = false;
          this.tiporegistro = "I";
        }
      } else {
        // console.log("No existe el dato en la solicitud")
        // this.validadato= false;
      }
    })
    if (this.validadato == false) {
      this.FormDespachoSolicitud2.reset();
      this.alertSwalAlert.title = "El valor del Código Ingresado No pertenece a la Solicitud";
      this.alertSwalAlert.show();

    }
  }

  LlamaFecha(event: any) {

    this.detalleslotes.forEach(element => {
      if (event == element.lote) {

        this.FormDespachoSolicitud2.get('fechavto').setValue(this.datePipe.transform(element.fechavto, 'dd-MM-yyyy'));
        this.fechavto = element.fechavto;

      }
    })
  }

  valida_cantidad(cantidad: number,datoingresado:any){
    // console.log("Valida cantidad",cantidad,datoingresado)
    this.alertSwalAlert.text = null;
    this.listaDetalleSolicitud.forEach(element => {
      // console.log("busca en el detalle de la solicitud",element)
      if (element.codmei.trim() == datoingresado.codigoproducto.trim()) {
        if(cantidad > element.cantsoli - element.cantdespachada){ // || cantidad <0){
          // console.log("cantidad es mayor que pendiente");
          this.alertSwalAlert.text = "La cantidad a despachar debe ser menor o igual a la cantidad Pendiente";
          this.alertSwalAlert.show();
        }else{
          if(cantidad < 0) {// || cantidad >0){
            // console.log("cantidad <=0")
            this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
            this.alertSwalAlert.show();
          }else{
            if(cantidad <= element.cantsoli - element.cantdespachada) {// || cantidad >0){
              // console.log("cantidad >0 y menor que pendiente")
            }
          }
          

        }
      }
    })
  }

  addArticuloGrillaDespacho(despacho: any) {
    if(despacho.cantidad == 0){
      this.alertSwalAlert.title = "Este producto ya fue despachado";
      this.alertSwalAlert.show();
    }else{
      if(despacho.cantidad >0){
        this.listaDetalleSolicitud.forEach(element => {

          if (element.codmei.trim() == despacho.codigoproducto.trim()) {
            // console.log("element",element, "despacho",despacho.codigoproducto,"despacho lote",despacho.lote)
            this.varDespachoDetalleSolicitud = new (DespachoDetalleSolicitud);
            // this.varDespachoDetalleSolicitud = element;
            this.varDespachoDetalleSolicitud.soliid          = this._Solicitud.soliid;
            this.varDespachoDetalleSolicitud.hdgcodigo       = this.hdgcodigo;
            this.varDespachoDetalleSolicitud.esacodigo       = this.esacodigo;
            this.varDespachoDetalleSolicitud.cmecodigo       = this.cmecodigo;
            this.varDespachoDetalleSolicitud.sodeid          = element.sodeid;
            this.varDespachoDetalleSolicitud.codmei          = element.codmei;
            this.varDespachoDetalleSolicitud.meinid          = element.meinid;
            this.varDespachoDetalleSolicitud.cantsoli        = element.cantsoli;
            this.varDespachoDetalleSolicitud.cantadespachar  = despacho.cantidad;
            this.varDespachoDetalleSolicitud.cantdespachada  = element.cantdespachada;
            this.varDespachoDetalleSolicitud.observaciones   = element.observaciones;
            this.varDespachoDetalleSolicitud.usuariodespacha = element.observaciones;        
            this.varDespachoDetalleSolicitud.stockorigen     = element.stockorigen;
            this.varDespachoDetalleSolicitud.meindescri      = element.meindescri;
            this.varDespachoDetalleSolicitud.bodorigen       = this._Solicitud.bodorigen;
            this.varDespachoDetalleSolicitud.boddestino      = this._Solicitud.boddestino;
            this.varDespachoDetalleSolicitud.lote            = despacho.lote;
            this.varDespachoDetalleSolicitud.acciond         = element.acciond;
            this.varDespachoDetalleSolicitud.cantdevolucion  = element.cantdevolucion;
            // this.varDespachoDetalleSolicitud
            // console.log("this.vardespachodetalee soli.lote",this.varDespachoDetalleSolicitud)
            // console.log("despacho.lote",despacho.lote);
            if (this.tiporegistro == "I") {
              this.varDespachoDetalleSolicitud.fechavto = this.fechavto;//this.datePipe.transform(despacho.fechavto, 'yyyy-MM-dd');
            }
            if (this.tiporegistro == "M") {
              this.varDespachoDetalleSolicitud.fechavto = this.fechavto;//this.datePipe.transform(despacho.fechavto, 'yyyy-MM-dd');//this.fechavto;
            }
            
            this.varDespachoDetalleSolicitud.servidor = this.servidor;
            this.varDespachoDetalleSolicitud.usuariodespacha = this.usuario;
            this.activabtndespacho = true;
            // console.log("mostrar grilla temporal",this.varDespachoDetalleSolicitud)
            // if()
            this.listaDetalleDespacho.unshift(this.varDespachoDetalleSolicitud);
            this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice(0,50);
            
            // return;
          }
          // console.log("grilla cargada",this.listaDetalleDespacho)
          // else{
          //   this.alertSwalAlert.title = "El código ingresado ya existe favor ingrese uno nuevo";
          //   this.alertSwalAlert.show();
          // }
    
        });
      }
    }
    
    this.FormDespachoSolicitud2.reset();
    this.detalleslotes = [];
    this.validadato = false;
  }

  validacantidadgrilla(id:number,registrodespacho: DespachoDetalleSolicitud){
    // console.log("valida cantidad de la grilla",id,registrodespacho);
   
    this.alertSwalAlert.text = null;
    var idg =0;
    // console.log("Valida cantidad",id,registrodespacho)
    if(registrodespacho.sodeid>0){
      if(this.IdgrillaRecepcion(registrodespacho)>=0){
        idg = this.IdgrillaRecepcion(registrodespacho)
        // console.log("id de la grilla", idg,this.listaDetalleDespacho[idg])
        if(this.listaDetalleDespacho[idg].cantadespachar > this.listaDetalleDespacho[idg].cantsoli- this.listaDetalleDespacho[idg].cantdespachada){
          // console.log("cantidad es mayor que pendiente por depachar",this.listaDetalleDespacho[idg].cantadespachar,
          // this.listaDetalleDespacho[idg].cantdespachada, this.listaDetalleDespacho[idg].cantsoli)
          
          this.alertSwalAlert.text = "La cantidad a recepcionar debe ser menor o igual a la cantidad Pendiente";
          this.alertSwalAlert.show();
          this.FormDespachoSolicitud2.get("cantidad").setValue(this.listaDetalleDespacho[idg].cantsoli - this.listaDetalleDespacho[idg].cantdespachada);
          this.listaDetalleDespacho[idg].cantadespachar = this.listaDetalleDespacho[idg].cantsoli - this.listaDetalleDespacho[idg].cantdespachada ;
          this.listaDetalleDespachopaginacion[idg].cantadespachar = this.listaDetalleDespacho[idg].cantadespachar ;

          // this.listaDetalleDespacho[idg].cantidadarecepcionar = this.listaDetalleDespacho[idg].cantdespachada- this.listaDetalleDespacho[idg].cantrecepcionada;

        }else{
          if(this.listaDetalleDespacho[idg].cantadespachar <0) {// || cantidad >0){
            // console.log("cantidad <=0")
            this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
            this.alertSwalAlert.show();
            this.listaDetalleDespacho[idg].cantadespachar = this.listaDetalleDespacho[idg].cantsoli - this.listaDetalleDespacho[idg].cantdespachada ;
            this.listaDetalleDespachopaginacion[idg].cantadespachar = this.listaDetalleDespacho[idg].cantadespachar ;
          }else{
            if(this.listaDetalleDespacho[idg].cantadespachar < this.listaDetalleDespacho[idg].cantsoli- this.listaDetalleDespacho[idg].cantdespachada || this.listaDetalleDespacho[idg].cantadespachar>0){
              // console.log("cantidad >0 y menor que pendiente")
              // this.listaDetalleDespacho[idg].cantadespachar = this.listaDetalleDespacho[idg].cantsoli- this.listaDetalleDespacho[idg].cantdespachada
            }
          }
        } 
        // console.log("no entra al if para comparar datos",this.listaDetalleDespacho[idg].cantadespachar,
        // this.listaDetalleDespacho[idg].cantdespachada, this.listaDetalleDespacho[idg].cantsoli)
      }
    }
  }

  IdgrillaRecepcion(registro: DetalleSolicitud) {
    console.log("articulo a comparar",registro)
    let indice = 0;
    for (const articulo of this.listaDetalleDespacho) {
      if (registro.codmei === articulo.codmei) {
        console.log("revisa y devuelve",indice)
        return indice;
      }
      indice++;
    }
    return -1;
  }

  /* Función búsqueda con paginación */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listaDetalleSolicitudpaginacion = this.listaDetalleSolicitud.slice(startItem, endItem);
  }

  pageChangedDespacho(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice(startItem, endItem);
  }

  ConfirmaEliminaProductoDeLaGrilla(registro: DetalleSolicitud, id: number) {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirma eliminación de Producto ?',
      text: "Confirmar la eliminación de producto de solicitud",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.EliminaProductoDeLaGrilla(registro, id);
      }
    })
  }

  EliminaProductoDeLaGrilla(registro: DetalleSolicitud, id: number) {
    // console.log("Valor a eliminar:",registro,id)
    if (registro.acciond == "" && id >= 0 && registro.sodeid > 0) {
      // Elominar registro nuevo la grilla
      this.listaDetalleDespacho.splice(id, 1);
      this.listaDetalleDespachopaginacion = this.listaDetalleDespacho.slice(0, 50);
    } else {
      // elimina uno que ya existe
      //this.arregloDetalleProductoSolicitud[id].acciond = 'E';
      //this.ModificarSolicitud("M");
    }
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
        _Solicitud: this._Solicitud,
      }
    };
    return dtModal;
  }

  eventosSolicitud() {
    // sE CONFIRMA Eliminar Solicitud
    this._BSModalRef = this._BsModalService.show(EventosSolicitudComponent, this.setModalEventoSolicitud());
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
        _Solicitud: this._Solicitud,
        _DetalleSolicitud: this._DetalleSolicitud,
      }
    };
    return dtModal;
  }

  eventosDetalleSolicitud(registroDetalle: DetalleSolicitud) {
    this._DetalleSolicitud = new (DetalleSolicitud);
    this._DetalleSolicitud = registroDetalle;

    this._BSModalRef = this._BsModalService.show(EventosDetallesolicitudComponent, this.setModalEventoDetalleSolicitud());
    this._BSModalRef.content.onClose.subscribe((Respuesta: any) => {
    })
  }

  salir() {

    this.route.paramMap.subscribe(param => {
      if (param.has("retorno_pagina")) {

        switch (param.get("retorno_pagina")) {
          case "controlstockminimo":
            this.router.navigate([param.get("retorno_pagina"), param.get("id_suministro"), param.get("id_tipoproducto"), param.get("id_solicita"), param.get("fechadesde"), param.get("fechahasta"), param.get("id_articulo"), param.get("desc_articulo")]);

            break;
          case "monitorejecutivo":
            this.router.navigate(['monitorejecutivo']);
            break;
          default:
            this.router.navigate(['home']);
        }

      } else {
        this.router.navigate(['home']);

      }
    })

  }

  onImprimir() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Dispensación De Solicitud ?',
      text: "Confirmar Búsqueda",
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

    this._imprimesolicitudService.RPTImprimeSolicitudDespachoBodega(this.servidor, this.hdgcodigo, this.esacodigo,
      this.cmecodigo, "pdf", this._Solicitud.soliid).subscribe(
        response => {

          window.open(response[0].url, "", "", true);
          // this.alertSwal.title = "Reporte Impreso Correctamente";
          // this.alertSwal.show();
        },
        error => {
          console.log(error);
          this.alertSwalError.title = "Error al Imprimir Despacho Solicitud";
          this.alertSwalError.show();
          this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
          })
        }
      );
  }
}