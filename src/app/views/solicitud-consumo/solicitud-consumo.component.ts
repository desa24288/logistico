import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { environment } from '../../../environments/environment';

import { EstadoSolicitud } from '../../models/entity/EstadoSolicitud';
import { TipoRegistro } from '../../models/entity/TipoRegistro';
import { Prioridades } from '../../models/entity/Prioridades';
import { PrioridadesService } from '../../servicios/prioridades.service';
import { EstadoSolicitudBodega } from '../../models/entity/EstadoSolicitudBodega';
import { EstadosolicitudbodegaService } from '../../servicios/estadosolicitudbodega.service';

import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EventosSolicitudComponent } from '../eventos-solicitud/eventos-solicitud.component';
import { EventosDetallesolicitudComponent } from '../eventos-detallesolicitud/eventos-detallesolicitud.component';

import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Articulos } from 'src/app/models/entity/mantencionarticulos';

import { SolicitudConsumo } from 'src/app/models/entity/solicitud-consumo';
import { DetalleSolicitudConsumo } from 'src/app/models/entity/detalle-solicitud-consumo';
import { SolicitudConsumoService } from 'src/app/servicios/solicitud-consumo.service';
import { UnidadesOrganizacionalesService } from 'src/app/servicios/unidades-organizacionales.service';
import { BusquedaSolicitudConsumoComponent } from '../busqueda-solicitud-consumo/busqueda-solicitud-consumo.component';
import { UnidadesOrganizacionales } from 'src/app/models/entity/unidades-organizacionales';
import { BusquedaProductosConsumoComponent } from '../busqueda-productos-consumo/busqueda-productos-consumo.component';
import { ProductoConsumo } from 'src/app/models/entity/producto-consumo';
import { BusquedaPlantillaConsumoComponent } from '../busqueda-plantilla-consumo/busqueda-plantilla-consumo.component';
import { PlantillaConsumo } from 'src/app/models/entity/plantilla-consumo';
import { Permisosusuario } from '../../permisos/permisosusuario';



@Component({
  selector: 'app-solicitud-consumo',
  templateUrl: './solicitud-consumo.component.html',
  styleUrls: ['./solicitud-consumo.component.css']
})
export class SolicitudConsumoComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public modelopermisos    : Permisosusuario = new Permisosusuario();
  public FormCreaSolicitud: FormGroup;
  public estadossolbods: Array<EstadoSolicitudBodega> = [];
  public estadossolicitudes: Array<EstadoSolicitud> = [];
  public tiposderegistros: Array<TipoRegistro> = [];
  public prioridades: Array<Prioridades> = [];
  public ccostosolicitante: Array<UnidadesOrganizacionales> = [];

  public _SolicitudConsumo: SolicitudConsumo;   /* Solictud de creación y modificaicíón */
  public grabadetallesolicitud: Array<DetalleSolicitudConsumo> = [];
  public arregloDetalleProductoSolicitudPaginacion: Array<DetalleSolicitudConsumo> = [];
  public arregloDetalleProductoSolicitud: Array<DetalleSolicitudConsumo> = [];
  public locale = 'es';
  public bsConfig: Partial<BsDatepickerConfig>;
  public colorTheme = 'theme-blue';
  public usuario = environment.privilegios.usuario;
  public servidor = environment.URLServiciosRest.ambiente;
  public elimininaproductogrilla: boolean = false;
  public existesolicitud: boolean = false;
  public hdgcodigo: number;
  public esacodigo: number;
  public cmecodigo: number;
  public _DetalleSolicitud: DetalleSolicitudConsumo;
  public productoselec: Articulos;
  private _BSModalRef: BsModalRef;
  public BtnSolConsumoGenerSolictud_activado : boolean;
  public activabtnmodificar : boolean = false;
  public activabtncrear     : boolean = false;

  onClose: any;
  bsModalRef: any;
  editField: any;

  constructor(
    private formBuilder: FormBuilder,
    private EstadoSolicitudBodegaService: EstadosolicitudbodegaService,
    private PrioridadesService: PrioridadesService,
    public _BsModalService: BsModalService,
    public localeService: BsLocaleService,
    public datePipe: DatePipe,
    public _solicitudConsumoService: SolicitudConsumoService,
    public _unidadesorganizacionaes: UnidadesOrganizacionalesService,
  ) {
    this.FormCreaSolicitud = this.formBuilder.group({
      numsolicitud  : [{ value: null, disabled: true }, Validators.required],
      esticod       : [{ value: 10, disabled: false }, Validators.required],
      hdgcodigo     : [{ value: null, disabled: false }, Validators.required],
      esacodigo     : [{ value: null, disabled: false }, Validators.required],
      cmecodigo     : [{ value: null, disabled: false }, Validators.required],
      prioridad     : [{ value: 1, disabled: false }, Validators.required],
      fecha         : [{ value: new Date(), disabled: true }, Validators.required],
      centrocosto   : [{ value: null, disabled: false }, Validators.required],
      referenciaerp : [{ value: null, disabled: true }, Validators.required],
      estadoerp     : [{ value: null, disabled: true }, Validators.required],
      glosa         : [{ value: null, disabled: false }, Validators.required],
    });
  }

  ngOnInit() {

    this.setDate();

    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());

    this.PrioridadesService.list(this.usuario, this.servidor).subscribe(
      data => {
        this.prioridades = data;
      }, err => {
        console.log(err.error);
      }
    );

    this.EstadoSolicitudBodegaService.list(this.usuario, this.servidor).subscribe(
      data => {
        this.estadossolbods = data;
      }, err => {
        console.log(err.error);
      }
    );

    this.BuscaCentroCostoSolicitante();

    this.BtnSolConsumoGenerSolictud_activado= true;

  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  BuscaCentroCostoSolicitante() {

    this._unidadesorganizacionaes.buscarCentroCosto("", 0, "CCOS", "", "", 0, this.cmecodigo, 0, 0, "S", sessionStorage.getItem('Usuario'), this.servidor).subscribe(
      response => {
        this.ccostosolicitante = response;
      },
      error => {
        alert("Error al Buscar Bodegas de cargo");
      }
    );
  }


  BuscarSolicitudesConsumo() {
    this._BSModalRef = this._BsModalService.show(BusquedaSolicitudConsumoComponent, this.setModalBusquedaSolicitud());
    this._BSModalRef.content.onClose.subscribe((response: SolicitudConsumo) => {
      if (response == undefined) { }
      else {

        this._SolicitudConsumo = response;
        this.FormCreaSolicitud.get('numsolicitud').setValue(this._SolicitudConsumo.id);
        this.FormCreaSolicitud.get('prioridad').setValue(this._SolicitudConsumo.prioridad);
        this.FormCreaSolicitud.get('glosa').setValue(this._SolicitudConsumo.glosa);
        this.FormCreaSolicitud.get('centrocosto').setValue(this._SolicitudConsumo.centrocosto);
        this.FormCreaSolicitud.get('fecha').setValue(this.datePipe.transform(this._SolicitudConsumo.fechasolicitud, 'dd-MM-yyyy'));
        this.FormCreaSolicitud.get('esticod').setValue(this._SolicitudConsumo.estado);
        this.FormCreaSolicitud.get('referenciaerp').setValue(this._SolicitudConsumo.referenciacontable);

        this.existesolicitud = true;
        this.activabtnmodificar = true;
        this.activabtncrear = false;
        this.arregloDetalleProductoSolicitudPaginacion = [];
        this.arregloDetalleProductoSolicitud = [];

        if (this._SolicitudConsumo.detsolicitudconsumo != null) {
          this.arregloDetalleProductoSolicitud = this._SolicitudConsumo.detsolicitudconsumo;
          this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0, 50);
        }

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
      }
    };
    return dtModal;
  }


  async addArticuloGrilla() {

    this._BSModalRef = this._BsModalService.show(BusquedaProductosConsumoComponent, this.setModalBusquedaProductos());
    this._BSModalRef.content.onClose.subscribe((response: ProductoConsumo) => {
      if (response == undefined) { }
      else {

        const DetalleMovimiento = new (DetalleSolicitudConsumo);
        if (this.FormCreaSolicitud.value.numsolicitud == null) {
          DetalleMovimiento.id = 0;
        } else {
          DetalleMovimiento.id = this.FormCreaSolicitud.value.numsolicitud;
        }

        DetalleMovimiento.iddetalle = 0;
        DetalleMovimiento.servidor = this.servidor;
        DetalleMovimiento.usuario = this.usuario;
        DetalleMovimiento.centrocosto = this.FormCreaSolicitud.value.ccosto;
        DetalleMovimiento.codigoproducto = response.prodcodigo;
        DetalleMovimiento.cantidadsolicitada = 0;
        DetalleMovimiento.cantidadrecepcionada = 0;
        DetalleMovimiento.referenciacontable = 0;
        DetalleMovimiento.operacioncontable = 0;
        DetalleMovimiento.estado = 10;
        DetalleMovimiento.prioridad = 0;
        DetalleMovimiento.usuariosolicita = this.usuario;
        DetalleMovimiento.servidor = this.servidor;
        DetalleMovimiento.usuarioautoriza = '';
        DetalleMovimiento.accion = "I";
        DetalleMovimiento.glosaproducto = response.proddescripcion;
        DetalleMovimiento.glosaunidadconsumo = response.glosaunidadconsumo;
        DetalleMovimiento.idproducto = response.prodid;

        if (this.activabtnmodificar == true) {
          this.activabtncrear = false;
          this.activabtnmodificar = true
        }else{
          this.activabtnmodificar = false;
          this.activabtncrear = true;
        }

        this.arregloDetalleProductoSolicitud.unshift(DetalleMovimiento);
        this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0, 50);


      }
    });


  }


  setModalBusquedaProductos() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Productos Consumo', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        tipo_busqueda: 'Todo-Insumos_No_Medicos',
      }
    };
    return dtModal;
  }



  cambio_cantidad(id: number, property: string, registro: DetalleSolicitudConsumo) {

    if (this.arregloDetalleProductoSolicitudPaginacion[id]["iddetalle"] == 0) {
      this.arregloDetalleProductoSolicitudPaginacion[id]["accion"] = "I";
    }
    if (this.arregloDetalleProductoSolicitudPaginacion[id]["iddetalle"] > 0) {
      this.arregloDetalleProductoSolicitudPaginacion[id]["accion"] = "M";
    }

    this.arregloDetalleProductoSolicitud[id][property] = this.arregloDetalleProductoSolicitudPaginacion[id][property];


  }

  validacantidadgrilla(despacho: DetalleSolicitudConsumo){
    var idg =0;
    console.log("Valida cantidad",despacho)
   
      if(this.IdgrillaDespacho(despacho)>=0){
        idg = this.IdgrillaDespacho(despacho)
       
        // if(this.arregloDetalleProductoSolicitud[idg].cantadespachar > this.arrdetalleSolicitudMed[idg].cantsoli- this.arrdetalleSolicitudMed[idg].cantdespachada ){
        //   this.alertSwalAlert.text = "La cantidad a Dispensar debe ser menor o igual a la cantidad Pendiente";
        //   this.alertSwalAlert.show();
        //   // this.listaDetalleDespacho[idg].cantidadarecepcionar = this.listaDetalleDespacho[idg].cantdespachada- this.listaDetalleDespacho[idg].cantrecepcionada;

        // }else{
          if(this.arregloDetalleProductoSolicitud[idg].cantidadsolicitada <0){
            this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
            this.alertSwalAlert.show();
          }
          // else{
          //   if(despacho.cantadespachar < despacho.cantsoli- despacho.cantdespachada || despacho.cantadespachar >0){
          //     // console.log("cantidad >0 y menor que pendiente")
          //   }
          // }        

        // }
      }
  }

  IdgrillaDespacho(registro: DetalleSolicitudConsumo) {
   
    let indice = 0;
    for (const articulo of this.arregloDetalleProductoSolicitud) {
      if (registro.codigoproducto === articulo.codigoproducto) {
       
        return indice;
      }
      indice++;
    }
    return -1;
  }


  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;

    this.arregloDetalleProductoSolicitudPaginacion[id][property] = parseInt(editField);
    this.arregloDetalleProductoSolicitud[id][property] = this.arregloDetalleProductoSolicitudPaginacion[id][property]

  }

  limpiar() {
    this.FormCreaSolicitud.reset();
    this.arregloDetalleProductoSolicitudPaginacion = [];
    this.arregloDetalleProductoSolicitud = [];
    this.FormCreaSolicitud.get('fecha').setValue(new Date());
    this.existesolicitud = false;
    this.FormCreaSolicitud.get('prioridad').setValue(1);
    this.FormCreaSolicitud.get('esticod').setValue(10);
    this.activabtnmodificar = false;
    this.activabtnmodificar = false;
  }

  ConfirmaEliminaProductoDeLaGrilla(registro: DetalleSolicitudConsumo, id: number) {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirme eliminación de producto de la solicitud ?',
      text: "Confirmar la eliminación del producto",
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

  EliminaProductoDeLaGrilla(registro: DetalleSolicitudConsumo, id: number) {

    if (registro.accion == "I" && id >= 0 && registro.id == 0) {
      // Eliminar registro nuevo la grilla
      this.arregloDetalleProductoSolicitud.splice(id, 1);
      this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0, 50);
    } else {
      // elimina uno que ya existe
      registro.servidor = this.servidor;
      registro.usuario = this.usuario;
      this._solicitudConsumoService.eliminardetallearticulosolicitudconsumo(registro).subscribe(
        response => {
          this._solicitudConsumoService.buscarsolicitudconsumo(registro.id, this.hdgcodigo, this.esacodigo, this.cmecodigo, 0, 0, 0, 0, 0, 0, "", "", this.usuario, this.servidor, "", "").subscribe(
            respuestasolicitud => {
              this._SolicitudConsumo = respuestasolicitud[0];
              this.FormCreaSolicitud.get('numsolicitud').setValue(this._SolicitudConsumo.id);
              this.FormCreaSolicitud.get('centrocosto').setValue(this._SolicitudConsumo.centrocosto);
              this.FormCreaSolicitud.get('fecha').setValue(this.datePipe.transform(this._SolicitudConsumo.fechasolicitud, 'dd-MM-yyyy'));
              this.FormCreaSolicitud.get('prioridad').setValue(this._SolicitudConsumo.estado);
              this.FormCreaSolicitud.get('referenciaerp').setValue(this._SolicitudConsumo.referenciacontable);
              this.FormCreaSolicitud.get('glosa').setValue(this._SolicitudConsumo.glosa);


              this.arregloDetalleProductoSolicitudPaginacion = [];
              this.arregloDetalleProductoSolicitud = [];


              if (this._SolicitudConsumo.detsolicitudconsumo != null) {
                this.arregloDetalleProductoSolicitud = this._SolicitudConsumo.detsolicitudconsumo;
                this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0, 50);
              }
            },
            error => {
              console.log("Error :", error)
            }
          );
          this.alertSwal.title = "Eliminacón del producto realizada con éxito";
          this.alertSwal.show();


        },
        error => {
          console.log("Error :", error)
        }
      )

    }
  }

  ConfirmaGenerarSolicitud() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Genera solicitud ?',
      text: "Confirmar la creación de la Solicitud",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.generarSolicitud();
      }
    })
  }

  generarSolicitud() {

    this._SolicitudConsumo = new SolicitudConsumo();
    this._SolicitudConsumo.fechasolicitud = this.datePipe.transform(this.FormCreaSolicitud.value.fecha, 'yyyy-MM-dd');
    this._SolicitudConsumo.id = 0;
    this._SolicitudConsumo.glosa = this.FormCreaSolicitud.value.glosa;
    this._SolicitudConsumo.hdgcodigo = this.hdgcodigo;
    this._SolicitudConsumo.esacodigo = this.esacodigo;
    this._SolicitudConsumo.cmecodigo = this.cmecodigo;
    this._SolicitudConsumo.centrocosto = this.FormCreaSolicitud.value.centrocosto;
    this._SolicitudConsumo.idpresupuesto = 0;
    this._SolicitudConsumo.referenciacontable = 0;
    this._SolicitudConsumo.operacioncontable = 0;
    this._SolicitudConsumo.estado = this.FormCreaSolicitud.value.esticod;
    this._SolicitudConsumo.accion = "I";
    this._SolicitudConsumo.prioridad = this.FormCreaSolicitud.value.prioridad;
    this._SolicitudConsumo.usuariosolicita = this.usuario;
    this._SolicitudConsumo.usuarioautoriza = '';
    this._SolicitudConsumo.usuario = this.usuario;
    this._SolicitudConsumo.servidor = this.servidor;

    this._SolicitudConsumo.detsolicitudconsumo = this.arregloDetalleProductoSolicitud;
   
    this._solicitudConsumoService.grabarsolicitudconsumo(this._SolicitudConsumo).subscribe(
      response => {
        this.alertSwal.title = "Solicitud creada N°:".concat(response.id);
        this.alertSwal.show();

        this._solicitudConsumoService.buscarsolicitudconsumo(response.id, this.hdgcodigo, this.esacodigo, this.cmecodigo, 0, 0, 0, 0, 0, 0, "", "", this.usuario, this.servidor, "", "").subscribe(
          respuestasolicitud => {
            this._SolicitudConsumo = respuestasolicitud[0];
            this.FormCreaSolicitud.get('numsolicitud').setValue(this._SolicitudConsumo.id);
            this.FormCreaSolicitud.get('centrocosto').setValue(this._SolicitudConsumo.centrocosto);
            this.FormCreaSolicitud.get('fecha').setValue(this.datePipe.transform(this._SolicitudConsumo.fechasolicitud, 'dd-MM-yyyy'));
            this.FormCreaSolicitud.get('prioridad').setValue(this._SolicitudConsumo.prioridad);
            this.FormCreaSolicitud.get('referenciaerp').setValue(this._SolicitudConsumo.referenciacontable);
            this.FormCreaSolicitud.get('glosa').setValue(this._SolicitudConsumo.glosa);
            this.FormCreaSolicitud.get('esticod').setValue(this._SolicitudConsumo.estado);
            this.activabtnmodificar = true;
            this.activabtncrear = false;
            this.arregloDetalleProductoSolicitudPaginacion = [];
            this.arregloDetalleProductoSolicitud = [];


            if (this._SolicitudConsumo.detsolicitudconsumo != null) {
              this.arregloDetalleProductoSolicitud = this._SolicitudConsumo.detsolicitudconsumo;
              this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0, 50);
            }
          },
          error => {
            console.log("Error :", error)
          }
        );
      },
      error => {
        console.log(error);
        this.alertSwalError.title = "Error al generar solictud";
        this.alertSwalError.show();
      }
    );
  }

  ConfirmaModificarSolicitud() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Desea modificar la Solicitud de Consumo ?',
      text: "Confirmar modificación de solicitud",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.ModificarSolicitud("M");
      }
    })
  }

  ModificarSolicitud(Accion: String) {
    /* Si se modifica _Solictud ya contiene la información original */
    /* vienen seteadas en el ambiente */
    var fechaactual = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    /* Sólo se setean los valores posoble de actualizar de la cabecera */

    this._SolicitudConsumo.estado = this.FormCreaSolicitud.value.esticod;
    this._SolicitudConsumo.glosa = this.FormCreaSolicitud.value.glosa;
    this._SolicitudConsumo.prioridad = this.FormCreaSolicitud.value.prioridad;
    this._SolicitudConsumo.centrocosto = this.FormCreaSolicitud.value.centrocosto;
    this._SolicitudConsumo.servidor = this.servidor
    this._SolicitudConsumo.usuario = this.usuario;

    if (Accion == 'M') {
      this._SolicitudConsumo.accion = "M";
    }

    /* Detalle de solicitu, solo viaja la modificada y eliminada */
    this.grabadetallesolicitud = [];

    this.arregloDetalleProductoSolicitud.forEach(element => {
      var _detalleSolicitud = new DetalleSolicitudConsumo;

      _detalleSolicitud = element;

      if (element.accion == 'M') {
        _detalleSolicitud.glosaproducto = element.glosaproducto;
        _detalleSolicitud.idproducto = element.idproducto;
        _detalleSolicitud.codigoproducto = element.codigoproducto;
        _detalleSolicitud.accion = 'M';
        _detalleSolicitud.cantidadsolicitada = element.cantidadsolicitada;
        this.grabadetallesolicitud.unshift(_detalleSolicitud);
      }


      if (element.accion == 'I') {
        _detalleSolicitud.glosaproducto = element.glosaproducto;
        _detalleSolicitud.idproducto = element.idproducto;
        _detalleSolicitud.codigoproducto = element.codigoproducto;
        _detalleSolicitud.accion = 'I';
        _detalleSolicitud.cantidadsolicitada = element.cantidadsolicitada;
        this.grabadetallesolicitud.unshift(_detalleSolicitud);
      }


    });

    this._SolicitudConsumo.detsolicitudconsumo = this.grabadetallesolicitud;

    this._solicitudConsumoService.grabarsolicitudconsumo(this._SolicitudConsumo).subscribe(
      response => {
        this.alertSwal.title = "Solicitud Modificada N°:".concat(response.id);
        this.alertSwal.show();

        this._solicitudConsumoService.buscarsolicitudconsumo(response.id, this.hdgcodigo, this.esacodigo, this.cmecodigo, 0, 0, 0, 0, 0, 0, "", "", this.usuario, this.servidor, "", "").subscribe(
          respuestasolicitud => {
            this._SolicitudConsumo = respuestasolicitud[0];
            this.FormCreaSolicitud.get('numsolicitud').setValue(this._SolicitudConsumo.id);
            this.FormCreaSolicitud.get('centrocosto').setValue(this._SolicitudConsumo.centrocosto);
            this.FormCreaSolicitud.get('fecha').setValue(this.datePipe.transform(this._SolicitudConsumo.fechasolicitud, 'dd-MM-yyyy'));
            this.FormCreaSolicitud.get('prioridad').setValue(this._SolicitudConsumo.prioridad);
            this.FormCreaSolicitud.get('referenciaerp').setValue(this._SolicitudConsumo.referenciacontable);
            this.FormCreaSolicitud.get('glosa').setValue(this._SolicitudConsumo.glosa);


            this.arregloDetalleProductoSolicitudPaginacion = [];
            this.arregloDetalleProductoSolicitud = [];


            if (this._SolicitudConsumo.detsolicitudconsumo != null) {
              this.arregloDetalleProductoSolicitud = this._SolicitudConsumo.detsolicitudconsumo;
              this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0, 50);
            }
          },
          error => {
            console.log("Error :", error)
          }
        );
      },
      error => {
        console.log(error);
        this.alertSwalError.title = "Error al generar solictud";
        this.alertSwalError.show();
      }
    );

  }



  ConfirmaEliminarSolicitud() {
    // sE CONFIRMA Eliminar Solicitud    
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Desea Eliminar la Solicitud ?',
      text: "Confirmar eliminación de solicitud",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.EliminarSolicitud();
      }
    })
  }

  EliminarSolicitud() {
    var numsolic = this._SolicitudConsumo.id;
    if (this.FormCreaSolicitud.value.referenciaerp == null || this.FormCreaSolicitud.value.referenciaerp == 0) {
      
      this._SolicitudConsumo = new (SolicitudConsumo);
      this._SolicitudConsumo.usuario = this.usuario;
      this._SolicitudConsumo.servidor = this.servidor;
      this._SolicitudConsumo.id = numsolic;
      this._solicitudConsumoService.eliminarsolicitudconsumo(this._SolicitudConsumo).subscribe(
        response => {
          this.alertSwal.title = "Solicitud Eliminada N°:".concat(response.id);
          this.alertSwal.show();
          this.limpiar();

        },
        error => {
          this.alertSwal.title = "No fue posible eliminar la solicitud N°:".concat(this.FormCreaSolicitud.value.numsolicitud);
          this.alertSwal.show();
          console.log("Error :", error)
        }
      );
    } else {
      this.alertSwalError.title = "Error, No se puede eliminar solictud aocida en el ERP";
      this.alertSwalError.show();

    }

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
        _SolicitudConsumo: this._SolicitudConsumo,
        _DetalleSolicitud: this._DetalleSolicitud,
      }
    };
    return dtModal;
  }

  eventosDetalleSolicitud(registroDetalle: DetalleSolicitudConsumo) {
    this._DetalleSolicitud = new (DetalleSolicitudConsumo);
    this._DetalleSolicitud = registroDetalle;

    this._BSModalRef = this._BsModalService.show(EventosDetallesolicitudComponent, this.setModalEventoDetalleSolicitud());
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
        _SolicitudConsumo: this._SolicitudConsumo,
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



  setModalMensajeExitoEliminar(numerotransaccion: number, titulo: string, mensaje: string) {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-m',
      initialState: {
        titulo: 'titulo', // Parametro para de la otra pantalla
        mensaje: 'mensaje',
        informacion: 'La solicitud eliminada es:',
        mostrarnumero: numerotransaccion,
        estado: 'CANCELADO',
      }
    };
    return dtModal;
  }

  setModalMensajeErrorEliminar() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-m',
      initialState: {
        titulo: 'Eliminar Solicitud', // Parametro para de la otra pantalla
        mensaje: 'Solicitud no pudo ser eliminada',
        informacion: 'Intente nuevamente',
        estado: 'CANCELADO',
      }
    };
    return dtModal;
  }


  /* Función búsqueda con paginación */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.arregloDetalleProductoSolicitud = this.arregloDetalleProductoSolicitudPaginacion.slice(startItem, endItem);
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  onImprimir() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Solicitud ?',
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


  BuscarPlantillaSolicitudes() {
    this._BSModalRef = this._BsModalService.show(BusquedaPlantillaConsumoComponent, this.setModalBusquedaPlantilla());
    this._BSModalRef.content.onClose.subscribe((response: PlantillaConsumo) => {
      if (response == undefined) { }
      else {
        this.existesolicitud = false;
        this.activabtnmodificar = false;
        this.activabtncrear = true;
        this._SolicitudConsumo = new (SolicitudConsumo);
        this._SolicitudConsumo.accion = 'I';
        //this._SolicitudConsumo.id         =  0; 
        this._SolicitudConsumo.hdgcodigo = this.hdgcodigo;
        this._SolicitudConsumo.esacodigo = this.esacodigo;
        this._SolicitudConsumo.cmecodigo = this.cmecodigo;
        this._SolicitudConsumo.centrocosto = response.centrocosto;
        this._SolicitudConsumo.idpresupuesto = response.idpresupuesto;
        this._SolicitudConsumo.glosa = response.glosa;
        this._SolicitudConsumo.referenciacontable = response.referenciacontable;
        this._SolicitudConsumo.operacioncontable = response.operacioncontable;
        this._SolicitudConsumo.estado = response.estado;
        this._SolicitudConsumo.usuariosolicita = this.usuario;
        this._SolicitudConsumo.detsolicitudconsumo = [];
        this._SolicitudConsumo.usuario = this.usuario;
        this._SolicitudConsumo.servidor = this.servidor;


        response.detplantillaconsumo.forEach(element => {
          var insertaDetalleSolicitud = new (DetalleSolicitudConsumo)
          insertaDetalleSolicitud.accion = "I";
          insertaDetalleSolicitud.iddetalle = 0;
          insertaDetalleSolicitud.id = 0;
          insertaDetalleSolicitud.centrocosto = element.centrocosto;
          insertaDetalleSolicitud.idpresupuesto = element.idpresupuesto;
          insertaDetalleSolicitud.idproducto = element.idproducto;
          insertaDetalleSolicitud.codigoproducto = element.codigoproducto;
          insertaDetalleSolicitud.glosaproducto = element.glosaproducto;
          insertaDetalleSolicitud.cantidadsolicitada = element.cantidadsolicitada;
          insertaDetalleSolicitud.cantidadrecepcionada = 0;
          insertaDetalleSolicitud.referenciacontable = element.referenciacontable;
          insertaDetalleSolicitud.operacioncontable = element.operacioncontable;
          insertaDetalleSolicitud.estado = 1;
          insertaDetalleSolicitud.prioridad = 1;
          insertaDetalleSolicitud.usuariosolicita = this.usuario;
          insertaDetalleSolicitud.usuarioautoriza = " ";
          insertaDetalleSolicitud.usuario = this.usuario;
          insertaDetalleSolicitud.servidor = this.servidor;
          insertaDetalleSolicitud.glosaunidadconsumo = element.glosaunidadconsumo;

          this._SolicitudConsumo.detsolicitudconsumo.push(insertaDetalleSolicitud);

        });

        //this.FormCreaSolicitud.get('numsolicitud').setValue(this._SolicitudConsumo.id);
        this.FormCreaSolicitud.get('centrocosto').setValue(this._SolicitudConsumo.centrocosto);
        //this.FormCreaSolicitud.get('fecha').setValue(this.datePipe.transform(this._SolicitudConsumo.fechasolicitud, 'dd-MM-yyyy'));
        // this.FormCreaSolicitud.get('prioridad').setValue(this._SolicitudConsumo.prioridad);
        this.FormCreaSolicitud.get('referenciaerp').setValue(this._SolicitudConsumo.referenciacontable);
        this.FormCreaSolicitud.get('glosa').setValue(this._SolicitudConsumo.glosa);
        this.FormCreaSolicitud.get('fecha').setValue(new Date());
        // this.FormCreaSolicitud.get('esticod').setValue(this._SolicitudConsumo.estado);

        this.arregloDetalleProductoSolicitudPaginacion = [];
        this.arregloDetalleProductoSolicitud = [];

        if (this._SolicitudConsumo.detsolicitudconsumo != null) {
          this.arregloDetalleProductoSolicitud = this._SolicitudConsumo.detsolicitudconsumo;
          this.arregloDetalleProductoSolicitudPaginacion = this.arregloDetalleProductoSolicitud.slice(0, 50);
        }

      }
    });
  }


  setModalBusquedaPlantilla() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Plantillas de Consumos', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
      }
    };
    return dtModal;
  }

  ImprimirSolicitud() {
  }


ActivarBotonGuardar(){ 
  //console.log(this.FormCreaSolicitud.get('numsolicitud').value ,
  //this.FormCreaSolicitud.get('esticod').value,
  //this.FormCreaSolicitud.get('prioridad').value,
  //this.FormCreaSolicitud.get('centrocosto').value,
  //this.FormCreaSolicitud.get('glosa').value,
  //this.arregloDetalleProductoSolicitud.length,
  //this.FormCreaSolicitud.get('referenciaerp').value);
  
    if (this.FormCreaSolicitud.get('numsolicitud').value == null
      && this.FormCreaSolicitud.get('esticod').value != null
      && this.FormCreaSolicitud.get('prioridad').value != null
      && this.FormCreaSolicitud.get('centrocosto').value != null
      && this.FormCreaSolicitud.get('glosa').value != null
      && this.arregloDetalleProductoSolicitud.length >0
    ) {
      return true

    } else {
      return false
    }
  
}



ActivarBotonModificar(){
  //console.log(this.FormCreaSolicitud.get('numsolicitud').value ,
  //this.FormCreaSolicitud.get('esticod').value,
  //this.FormCreaSolicitud.get('prioridad').value,
  //this.FormCreaSolicitud.get('centrocosto').value,
  //this.FormCreaSolicitud.get('glosa').value,
  //this.arregloDetalleProductoSolicitud.length,
  //this.FormCreaSolicitud.get('referenciaerp').value);
  
      if (this.FormCreaSolicitud.get('numsolicitud').value != null
        && this.FormCreaSolicitud.get('esticod').value != null
        && this.FormCreaSolicitud.get('prioridad').value != null
        && this.FormCreaSolicitud.get('centrocosto').value != null
        && this.FormCreaSolicitud.get('glosa').value != null
        && this.arregloDetalleProductoSolicitud.length >0
        && this.FormCreaSolicitud.get('referenciaerp').value == "0" 
      ) {
        return true
  
      } else {
        return false
      }

}

ActivaBotonAgregar(){
//console.log(this.FormCreaSolicitud.get('numsolicitud').value ,
 // this.FormCreaSolicitud.get('esticod').value,
//  this.FormCreaSolicitud.get('prioridad').value,
//  this.FormCreaSolicitud.get('centrocosto').value,
//  this.FormCreaSolicitud.get('glosa').value,
  //this.arregloDetalleProductoSolicitud.length,
//  this.FormCreaSolicitud.get('referenciaerp').value);
  
  if (this.FormCreaSolicitud.get('esticod').value != null
  && this.FormCreaSolicitud.get('prioridad').value != null
  && this.FormCreaSolicitud.get('centrocosto').value != null
  && this.FormCreaSolicitud.get('glosa').value != null
  //&& this.arregloDetalleProductoSolicitud.length >0
  && (this.FormCreaSolicitud.get('referenciaerp').value == "0"  || this.FormCreaSolicitud.get('referenciaerp').value == null) 
) {
  return true

} else {
  return false
}


}

ActivarBotonEliminar(){

}

ActivarEstadoSolicitud(){

}

ActivarPrioridad() {

}


ActivarCentroCosto(){

}

ActivarGlosa(){

}


}

