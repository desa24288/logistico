import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BusquedaproductosComponent } from '../busquedaproductos/busquedaproductos.component';
import { BusquedabodegasComponent } from '../busquedabodegas/busquedabodegas.component';
import { BodegasService } from '../../servicios/bodegas.service';
import { Servicio } from '../../models/entity/Servicio';

import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TiporegistroService } from '../../servicios/tiporegistro.service';

import { EstructuraBodega } from 'src/app/models/entity/estructura-bodega';
import { TipoParametro } from 'src/app/models/entity/tipo-parametro';

import { ProductosBodegas } from 'src/app/models/entity/productos-bodegas';
import { ServicioUnidadBodegas } from 'src/app/models/entity/servicio-unidad-bodegas';
import { UsuariosBodegas } from 'src/app/models/entity/usuarios-bodegas';
import { BusquedaServiciosComponent } from '../busqueda-servicios/busqueda-servicios.component';
import { BusquedaUsuariosComponent } from '../busqueda-usuarios/busqueda-usuarios.component';
import { EstructuraListaUsuarios } from 'src/app/models/entity/estructura-lista-usuarios';
import { EstructuraRelacionBodega } from 'src/app/models/entity/estructura-relacion-bodega';
import { TipoRelacionBodega } from 'src/app/models/entity/tipo-relacion-bodega';
import { Permisosusuario } from '../../permisos/permisosusuario';
import { InformesService } from '../../servicios/informes.service';
import { BusquedaproductosService } from 'src/app/servicios/busquedaproductos.service';

import {Sort} from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bodegas',
  templateUrl: './bodegas.component.html',
  styleUrls: ['./bodegas.component.css'],
  providers: [BodegasService, InformesService]
})
export class BodegasComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  @ViewChild('alertSwalConfirmar', { static: false }) alertSwalConfirmar: SwalComponent;

  public modelopermisos: Permisosusuario = new Permisosusuario();
  public FormBodegas: FormGroup;
  public FormDatosProducto: FormGroup;

  private _BSModalRef: BsModalRef;
  public hdgcodigo: number;
  public esacodigo: number;
  public cmecodigo: number;
  public servicios: Servicio[];
  public servidor = environment.URLServiciosRest.ambiente;
  public usuario = environment.privilegios.usuario;
  public _tiposrelacion: TipoRelacionBodega[];
  public activabtnimprimebod: boolean = false;
  public desactivabtnelimbod : boolean = false;
  public desactivabtnelimserv: boolean = false;
  public desactivabtnelimusu: boolean = false;
  public desactivabtnelimprod: boolean = true;
  public boddestinoaux : string = null;
  public codigoaux : number = null;
  public nombrebodegaaux : string = null;
  public estadoaux : string = null;
  public servicioaux : string = null;
  public tipobodegaaux : string = null;
  public tipoproductoaux : string = null;
  public nuevabodegaaux : number = null;
  public controlminimoaux : string = null;
  public codigobodegaaux : string = null;
  public estado_aux: string  = null;
  public fraccionable_aux: string = null;
  public codbodegaRelacionAux : number;

  public activaBotonbtnmodificar : boolean = false;

  onClose: any;
  bsModalRef: any;

  public loading = false;

  public arreglotipobodega: TipoParametro[] = [];
  public arreglotipoproducto: TipoParametro[] = [];
  public _bodega: EstructuraBodega;
  public _bodega_productos: ProductosBodegas[] = [];
  public _bodega_productos_paginacion: ProductosBodegas[] = [];
  public _bodega_servicios: ServicioUnidadBodegas[] = [];
  public _bodega_servicios_paginacion: ServicioUnidadBodegas[] = [];
  public _bodega_usuarios: UsuariosBodegas[] = [];
  public _bodega_usuarios_paginacion: UsuariosBodegas[] = [];
  public _bodega_relacion_bodegas: EstructuraRelacionBodega[] = [];
  public _bodega_relacion_bodegas_paginacion: EstructuraRelacionBodega[] = [];

  // Array auxiliares
  public _bodega_productos_aux: ProductosBodegas[] = [];
  public _bodega_productos_paginacion_aux: ProductosBodegas[] = [];
  public _bodega_servicios_aux: ServicioUnidadBodegas[] = [];
  public _bodega_servicios_paginacion_aux: ServicioUnidadBodegas[] = [];
  public _bodega_usuarios_aux: UsuariosBodegas[] = [];
  public _bodega_usuarios_paginacion_aux: UsuariosBodegas[] = [];
  public _bodega_relacion_bodegas_aux: EstructuraRelacionBodega[] = [];
  public _bodega_relacion_bodegas_paginacion_aux: EstructuraRelacionBodega[] = [];
  public codbodega = null;
  public codprod = null;
  public activamodal = true;

  // Array control de stock critico

  public _bodega_productos_critico: ProductosBodegas[] = [];
  public _bodega_productos_paginacion_critico: ProductosBodegas[] = [];

  public checkCritico: boolean = true;
  public checkboxcritico: boolean = false;

  public msj = true;

  public vaciosservicios  = true;
  public vaciosusuarios  = true;
  public vaciosbodegas  = true;
  public vaciosproductos  = true;
  public vacioscabecera = true

  public lengthservicios: number;
  public lengthusuarios: number;
  public lengthbodegas: number;
  public lengthproductos: number;
  public verificanull = false;

  public startItem = null;
  public endItem = null;

  constructor(
    public _BsModalService: BsModalService,
    private formBuilder: FormBuilder,
    private _bodegasService: BodegasService,
    public TiporegistroService: TiporegistroService,
    private _buscabodegasService: BodegasService,
    private _imprimesolicitudService: InformesService,
    public _BusquedaproductosService: BusquedaproductosService,
    private router: Router,
    private route: ActivatedRoute,

  ) {
    this.FormBodegas = this.formBuilder.group({
      boddestino: [{ value: null, disabled: false }, Validators.required],
      codigo: [{ value: null, disabled: false }, [Validators.required, Validators.maxLength(9)]],
      nombrebodega: [{ value: null, disabled: false }, Validators.required],
      estado: [{ value: null, disabled: false }, Validators.required],
      servicio: [{ value: null, disabled: false }, Validators.required],
      tipobodega: [{ value: null, disabled: false }, Validators.required],
      tipoproducto: [{ value: null, disabled: false }, Validators.required],
      nuevabodega: [{ value: null, disabled: false }, Validators.required],
      controlminimo: [{ value: null, disabled: false }, Validators.required],
      codigobodega: [{ value: null, disabled: false }, Validators.required],
      fraccionable: [{ value: null, disabled: false }, Validators.required]
    });
    this.FormDatosProducto = this.formBuilder.group({
      codigo: [{ value: null, disabled: false }, Validators.required]
    });

  }

  ngOnInit() {
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();
    this.route.paramMap.subscribe(param => {
      if (param.has("codigo")) {
        this.getBodega(param.get("codigo"));
      }
      })

    this._buscabodegasService.listatipobodega(this.hdgcodigo, this.usuario, this.servidor).subscribe(
      response => {
        if (response != null){
         this.arreglotipobodega = response;
        }
      }
    );

    this._buscabodegasService.listarTipoRelacionBodegas(this.hdgcodigo, this.cmecodigo, this.servidor, this.usuario).subscribe(
      response => {
        if (response != null){
          this._tiposrelacion = response;
        }
      }
    )
    this._buscabodegasService.listatipoproducto(this.hdgcodigo, this.usuario, this.servidor).subscribe(
      response => {
        if (response != null){
          this.arreglotipoproducto = response;
        }
      }
    );
    this.FormBodegas.get('nuevabodega').setValue(1);
    this.nuevabodegaaux = 1;
  }

  pageChanged(event: PageChangedEvent, tipo: number): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    switch (tipo) {
      case 1://Producto
        this._bodega_productos_paginacion = this._bodega_productos.slice(startItem, endItem);
        this.startItem = startItem;
        this.endItem = endItem;
        break;
      case 2://Servicio
        this._bodega_servicios_paginacion = this._bodega_servicios.slice(startItem, endItem);
        break;
      case 3://Usuario
        this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(startItem, endItem);
        break;
      case 4://Bodega
        this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(startItem, endItem);
        break;
    }
  }

  BuscaBodega() {
    this.FormDatosProducto.controls.codigo.reset();
    this._BSModalRef = this._BsModalService.show(BusquedabodegasComponent, this.setModalBusquedaBodega());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) {

      }
      else {
        this.loading = true;
        this._bodega_productos = [];
        this._bodega_productos_paginacion = [];
        this._bodega_servicios = [];
        this._bodega_servicios_paginacion = [];
        this._bodega_usuarios = [];
        this._bodega_usuarios_paginacion = [];
        this._bodega_relacion_bodegas = [];
        this._bodega_relacion_bodegas_paginacion = [];

        this.boddestinoaux = "";
        this.codigoaux = 0;
        this.nombrebodegaaux = "";
        this.estadoaux = "";
        this.servicioaux = "";
        this.tipobodegaaux = "";
        this.tipoproductoaux = "";
        this.nuevabodegaaux = 0;
        this.controlminimoaux = "";
        this.codigobodegaaux = "";
        this.codbodegaRelacionAux = response.codbodega;

        this._bodega_productos_aux = [];
        this._bodega_productos_paginacion_aux = [];
        this._bodega_servicios_aux = [];
        this._bodega_servicios_paginacion_aux = [];
        this._bodega_usuarios_aux = [];
        this._bodega_usuarios_paginacion_aux = [];
        this._bodega_relacion_bodegas_aux = [];
        this._bodega_relacion_bodegas_paginacion_aux = [];

        this._bodega_productos_critico = [];
        this._bodega_productos_paginacion_critico = [];

        this._buscabodegasService.listaEstructuraBodegas(this.hdgcodigo, this.cmecodigo, response.codbodega,response.fbocodigobodega, null,
          'S', null, null, sessionStorage.getItem('Usuario'), this.servidor, '').subscribe(
            response_bodega => {
              this._bodega = response_bodega[0];

              this.FormBodegas.get('codigobodega').setValue(this._bodega.fbocodigobodega);
              this.FormBodegas.get('nombrebodega').setValue(this._bodega.desbodega);
              this.FormBodegas.get('estado').setValue(this._bodega.estado);
              this.FormBodegas.get('tipoproducto').setValue(this._bodega.tipoproducto);
              this.FormBodegas.get('tipobodega').setValue(this._bodega.tipobodega);
              this.FormBodegas.get('nuevabodega').setValue(0);
              this.FormBodegas.get('fraccionable').setValue(this._bodega.fbodfraccionable);
              this.activabtnimprimebod = true;
              this.FormBodegas.controls.codigobodega.disable();
              if(this._bodega.productosbodega.length>0){this.FormBodegas.controls.tipoproducto.disable();}

              this._bodega_servicios = response_bodega[0].serviciosunidadbodega;
              this._bodega_servicios.forEach(x=>{
                x.bloqcampogrilla = true;
              })
              this.lengthservicios = this._bodega_servicios.length;
              this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 20);

              this._bodega_usuarios = response_bodega[0].usuariosbodega;
              this._bodega_usuarios.forEach(x=>{
                x.bloqcampogrilla = true;
              })
              this.lengthusuarios = this._bodega_usuarios.length;
              this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 20);

              this._bodega_relacion_bodegas = response_bodega[0].relacionbodegas;
              this._bodega_relacion_bodegas.forEach(x=>{
                x.bloqcampogrilla = true;
              })
              this.lengthbodegas = this._bodega_relacion_bodegas.length;
              this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 20);

              this._bodega_productos = response_bodega[0].productosbodega;
              this._bodega_productos.forEach(x=>{
                x.bloqcampogrilla = true;
                x.stockcriticoresp = x.stockcritico;
                x.nivelreposicionresp = x.nivelreposicion;
              })
              this.lengthproductos = this._bodega_productos.length;
              this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);

              // Llenar Variables Auxiliares
              this.boddestinoaux = this.FormBodegas.controls.codigobodega.value;
              this.codigoaux = this.FormBodegas.get('codigo').value;
              this.nombrebodegaaux = this.FormBodegas.get('nombrebodega').value;
              this.estadoaux = this.FormBodegas.get('estado').value;
              this.servicioaux = this.FormBodegas.get('nuevabodega').value;
              this.tipobodegaaux = this.FormBodegas.get('tipobodega').value;
              this.tipoproductoaux = this.FormBodegas.get('tipoproducto').value;
              this.nuevabodegaaux = this.FormBodegas.get('nuevabodega').value;
              this.controlminimoaux = this.FormBodegas.get('controlminimo').value;
              this.codigobodegaaux = this.FormBodegas.get('codigobodega').value;
              this.fraccionable_aux = this.FormBodegas.get('fraccionable').value;

              // Llenar Array Auxiliares
              this._bodega_productos_aux = this._bodega_productos;
              this._bodega_productos_paginacion_aux = this._bodega_productos_paginacion;
              this._bodega_servicios_aux = this._bodega_servicios;
              this._bodega_servicios_paginacion_aux = this._bodega_servicios_paginacion;
              this._bodega_usuarios_aux = this._bodega_usuarios;
              this._bodega_usuarios_paginacion_aux = this._bodega_usuarios_paginacion;
              this._bodega_relacion_bodegas_aux = this._bodega_relacion_bodegas;
              this._bodega_relacion_bodegas_paginacion_aux = this._bodega_relacion_bodegas_paginacion;


              // Llenar Array de control stock critico
              this._bodega_productos_aux.forEach(element => {
                if(element.stockactual <= element.stockcritico) {
                  this._bodega_productos_critico.push(element);
                }
              });
              this._bodega_productos_paginacion_critico = this._bodega_productos_critico.slice(0, 20);

              this.loading = false;
              this.checkCritico = false;
              this.logicalength();

            }
          );
      }
    });
  }

  addBodegaGrilla() {
    var nueva_bodega_asociada = new (EstructuraRelacionBodega);
    this._BSModalRef = this._BsModalService.show(BusquedabodegasComponent, this.setModalBusquedaBodega());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) {
      }
      else {
        if (this.validaCod(response.codbodega, 4) === true) {
          this.alertSwalError.title = "Bodega ya está asociado";
          this.alertSwalError.show();
          this.loading = false;
          return;
        } else {
          nueva_bodega_asociada.hdgcodigo = this.hdgcodigo;
          nueva_bodega_asociada.esacodigo = this.esacodigo;
          nueva_bodega_asociada.cmecodigo = this.cmecodigo;
          nueva_bodega_asociada.codbodegaorigen = response.codbodega;
          nueva_bodega_asociada.codbodegarelacion = this.codbodegaRelacionAux;
          nueva_bodega_asociada.tiporelacion = 1;
          nueva_bodega_asociada.nombodega = response.desbodega;
          nueva_bodega_asociada.servidor = this.servidor;
          nueva_bodega_asociada.usuario = this.usuario;
          nueva_bodega_asociada.accion = 'I';
          nueva_bodega_asociada.glosatiporelacion = 'None'
          nueva_bodega_asociada.bloqcampogrilla = true;

          this._tiposrelacion.forEach(element => {
            if (element.idRealcion == nueva_bodega_asociada.tiporelacion) {
              nueva_bodega_asociada.glosatiporelacion = element.descripcionrelacion;
            }
          });
          this._bodega_relacion_bodegas.unshift(nueva_bodega_asociada);
          this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 20);
          this.logicalength();
        }
      }
    });
  }

  setModalBusquedaBodega() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Bodegas', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        codigobodega:  this.FormBodegas.value.codigobodega,
        glosabodega: this.FormBodegas.value.nombrebodega
      }
    };
    return dtModal;
  }

  addUsauriosGrilla() {
    const usuario_nuevo = new (UsuariosBodegas);
    this._BSModalRef = this._BsModalService.show(BusquedaUsuariosComponent, this.setModalBusquedaUsuarios());
    this._BSModalRef.content.onClose.subscribe((response: EstructuraListaUsuarios) => {
      if (response == undefined) { }
      else {
        if (this.validaCod(response.userid, 3) === true) {
          this.alertSwalError.title = "Usuario ya existe asociado a la bodega";
          this.alertSwalError.show();
          this.loading = false;
          return;
        } else {
          usuario_nuevo.accion = "I";
          usuario_nuevo.bouid = 0;
          usuario_nuevo.userid = response.userid;
          usuario_nuevo.glosausuario = response.username;
          usuario_nuevo.bodegacodigo = this.FormBodegas.value.codigo;
          usuario_nuevo.bloqcampogrilla = true;
          this._bodega_usuarios.unshift(usuario_nuevo);
          this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 20);
          this.logicalength();
        }
      }
    });
  }

  setModalBusquedaUsuarios() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Usuarios',
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
      }
    };
    return dtModal;
  }

  addServicioGrilla() {
    const servicio_nuevo = new (ServicioUnidadBodegas);
    this._BSModalRef = this._BsModalService.show(BusquedaServiciosComponent, this.setModalBusquedaServicios());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) { }
      else {
        if (this.validaCod(response.serviciocod, 2) === true) {
          this.alertSwalError.title = "Servicio ya está asociado a la bodega";
          this.alertSwalError.show();
          this.loading = false;
          return;
        } else {
          servicio_nuevo.accion = "I";
          servicio_nuevo.hdgcodigo = this.hdgcodigo;
          servicio_nuevo.cmecodigo = this.cmecodigo;
          servicio_nuevo.idservicio = response.servicioid;
          servicio_nuevo.codservicio = response.serviciocod;
          servicio_nuevo.descservicio = response.serviciodesc;
          servicio_nuevo.codbodega = this._bodega.codbodega;
          servicio_nuevo.bloqcampogrilla = true;
          this._bodega_servicios.unshift(servicio_nuevo);
          this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 20);
          this.logicalength();
        }
      }
    });
  }

  setModalBusquedaServicios() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Servicios', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
      }
    };
    return dtModal;
  }

  validaCod(codigo: any, tipo: number) {
    /*Devuelve False si el codigo ah agregar ya existe en array*/
    let indx: any;
    switch (tipo) {
      case 1:
        indx = this._bodega_productos_aux.findIndex(x => x.mameincodmei === codigo, 1);
        if (indx >= 0) {
          return true;
        } else {
          return false;
        }
      case 2:
        indx = this._bodega_servicios_aux.findIndex(x => x.codservicio === codigo, 1);
        if (indx >= 0) {
          return true;
        } else {
          return false;
        }
      case 3:
        indx = this._bodega_usuarios_aux.findIndex(x => x.userid === codigo, 1);
        if (indx >= 0) {
          return true;
        } else {
          return false;
        }
      case 4:
        indx = this._bodega_relacion_bodegas_aux.findIndex(x => x.codbodegaorigen === codigo, 1);
        if (indx >= 0) {
          return true;
        } else {
          return false;
        }
    }
  }

  async addArticuloGrilla(boton: boolean) {
    this.activamodal = true;
    const producto_nuevo = new (ProductosBodegas);
    this.alertSwalError.title = null;
    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModalBusquedaProductos());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response != undefined) {
        if (this.validaCod(response.codigo, 1) === true) {
          if(boton){
            this.alertSwalAlert.title ="Este Articulo ya se encuentra registrado";
            this.alertSwalAlert.show();
          }else{
            this.FormDatosProducto.controls.codigo.setValue(response.codigo);
            this.buscaProductoGrilla()
            return;
          }
        } else {
          producto_nuevo.accion = "I";
          producto_nuevo.bodid = this._bodega.codbodega;
          producto_nuevo.controlminimo = "N";
          producto_nuevo.glosaproducto = response.descripcion;
          producto_nuevo.hdgcodigo = this._bodega.hdgcodigo;
          producto_nuevo.meinid = response.mein;
          producto_nuevo.mameincodmei = response.codigo;
          producto_nuevo.nivelreposicion = 0;
          producto_nuevo.ptoasignacion = 0;
          producto_nuevo.ptoreposicion = 0;
          producto_nuevo.stockactual = 0;
          producto_nuevo.stockcritico = 0;
          producto_nuevo.principioactivo = response.principioactivo;
          producto_nuevo.presentacion = response.presentacion;
          producto_nuevo.formafarma = response.formafarma;
          producto_nuevo.glosaunidad = response.glosaunidaddespacho;
          producto_nuevo.glosatipoproducto = response.desctiporegistro;
          producto_nuevo.stockcriticoresp = producto_nuevo.stockcritico;
          producto_nuevo.nivelreposicionresp = producto_nuevo.nivelreposicion;
          producto_nuevo.controlminimoresp = producto_nuevo.controlminimo;
          producto_nuevo.bloqcampogrilla = true;
          switch (this._bodega.tipoproducto) {
            case 'M': //tipoporducto bodega medicamento
              if(response.tiporegistro =="M"){ //el producto es medicamento
                this._bodega_productos.unshift(producto_nuevo);
                this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);
              }else{
                this.alertSwalAlert.title ="Esta bodega permite ingresar solo medicamentos";
                this.alertSwalAlert.show();
              }
            break;
            case 'I'://tipoporducto bodega insumo
              if( response.tiporegistro =="I"){
                this._bodega_productos.unshift(producto_nuevo);
                this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);
                this.logicalength();
              }else{
                  this.alertSwalAlert.title ="Esta bodega permite ingresar solo insumos";
                  this.alertSwalAlert.show();
                }
              break;
            case 'T':// tipo producto bodega rs todos
              if( response.tiporegistro == "I" || response.tiporegistro =="M"){
                this._bodega_productos.unshift(producto_nuevo);
                this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);
                this.logicalength();
              }
            break;
          }
        }
      }
    });
  }

  async findArticuloGrilla() {
    this.loading = true;

    this.alertSwalAlert.title = null;
    if ( this.FormDatosProducto.controls.codigo.touched &&
        this.FormDatosProducto.controls.codigo.status !== 'INVALID') {
      var codBodegaAux = this._bodega.codbodega;
      var fcodBodegaAux = this.codbodega;
      var codProdAux = this.FormDatosProducto.controls.codigo.value.toString();

      this._buscabodegasService.listaEstructuraBodegas(this.hdgcodigo, this.cmecodigo, codBodegaAux, fcodBodegaAux, null,
      'S', null, null, sessionStorage.getItem('Usuario'), this.servidor, codProdAux).subscribe(
        response_bodega => {

          this._bodega = response_bodega[0];

          if(this._bodega.productosbodega.length === 0){
            this.alertSwalAlert.title ="El producto buscado no está asociado a la bodega";
            this.alertSwalAlert.show();
          }else{
            this._bodega_productos = [];
            this._bodega_productos_paginacion = [];
            this._bodega_servicios = [];
            this._bodega_servicios_paginacion = [];
            this._bodega_usuarios = [];
            this._bodega_usuarios_paginacion = [];
            this._bodega_relacion_bodegas = [];
            this._bodega_relacion_bodegas_paginacion = [];

            this.FormBodegas.get('codigobodega').setValue(this._bodega.fbocodigobodega);
            this.FormBodegas.get('nombrebodega').setValue(this._bodega.desbodega);
            this.FormBodegas.get('estado').setValue(this._bodega.estado);
            this.FormBodegas.get('tipoproducto').setValue(this._bodega.tipoproducto);
            this.FormBodegas.get('tipobodega').setValue(this._bodega.tipobodega);
            this.FormBodegas.get('nuevabodega').setValue(0);
            this.activabtnimprimebod = true;
            this.FormBodegas.controls.codigobodega.disable();

            if(this._bodega.productosbodega.length>0){
              this.FormBodegas.controls.tipoproducto.disable();
            }
            this._bodega_servicios = response_bodega[0].serviciosunidadbodega;
            this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 20);
            this._bodega_usuarios = response_bodega[0].usuariosbodega;
            this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 20);
            this._bodega_relacion_bodegas = response_bodega[0].relacionbodegas;
            this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 20);

            response_bodega[0].productosbodega.forEach(x=>{
              x.bloqcampogrilla = true;
            })
            this._bodega_productos = response_bodega[0].productosbodega;
            this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);
            this.FormDatosProducto.controls.codigo.setValue(codProdAux);
            this.codprod = codProdAux;
            this.FormDatosProducto.controls.codigo.reset();
            this.checkCritico = false;
          }
        }
      );
      this.loading = false;
      return;
    }else{
      this.limpiarCodigo();
      this.loading = false;
      return;
    }
  }

  setModalBusquedaProductos() {
    this.codprod = this.FormDatosProducto.controls.codigo.value;
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Productos', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        tipo_busqueda: 'Todo-Medico',
        codprod: this.codprod,
        bodega_productos: this._bodega_productos
      }
    };
    return dtModal;
  }

  setArticulogrilla(producto: any) {
    const producto_nuevo = new (ProductosBodegas);
    producto_nuevo.accion = "I";
    producto_nuevo.bodid = this._bodega.codbodega;
    producto_nuevo.controlminimo = "N";
    producto_nuevo.glosaproducto = producto.descripcion;
    producto_nuevo.hdgcodigo = this._bodega.hdgcodigo;
    producto_nuevo.meinid = producto.mein;
    producto_nuevo.mameincodmei = producto.codigo;
    producto_nuevo.nivelreposicion = 0;
    producto_nuevo.ptoasignacion = 0;
    producto_nuevo.ptoreposicion = 0;
    producto_nuevo.stockactual = 0;
    producto_nuevo.stockcritico = 0;
    producto_nuevo.principioactivo = producto.principioactivo;
    producto_nuevo.presentacion = producto.presentacion;
    producto_nuevo.formafarma = producto.formafarma;
    producto_nuevo.glosaunidad = producto.glosaunidaddespacho;
    producto_nuevo.glosatipoproducto = producto.desctiporegistro;
    producto_nuevo.stockcriticoresp = producto_nuevo.stockcritico;
    producto_nuevo.nivelreposicionresp = producto_nuevo.nivelreposicion;
    producto_nuevo.controlminimoresp = producto_nuevo.controlminimo;
    producto_nuevo.bloqcampogrilla = true;
    switch (this._bodega.tipoproducto) {
      case 'M': //tipoporducto bodega medicamento
        if(producto.tiporegistro =="M"){ //el producto es medicamento
          this._bodega_productos.unshift(producto_nuevo);
          this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);
          this.logicalength();
        }else{
          this.alertSwalAlert.title ="Esta bodega permite ingresar solo medicamentos";
          this.alertSwalAlert.show();
        }
      break;
      case 'I'://tipoporducto bodega insumo
        if( producto.tiporegistro =="I"){
          this._bodega_productos.unshift(producto_nuevo);
          this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);
          this.logicalength();
        }else{
            this.alertSwalAlert.title ="Esta bodega permite ingresar solo insumos";
            this.alertSwalAlert.show();
          }
        break;
      case 'T':// tipo producto bodega rs todos
        if( producto.tiporegistro == "I" || producto.tiporegistro =="M"){
          this._bodega_productos.unshift(producto_nuevo);
          this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);
          this.logicalength();
        }
      break;
    }
  }

  Limpiar() {
    var opt = '';
    this.msj = false;
    const Swal = require('sweetalert2');
    if( this.boddestinoaux !== this.FormBodegas.get('boddestino').value ||
        this.codigoaux !== this.FormBodegas.get('codigo').value ||
        this.nombrebodegaaux !== this.FormBodegas.get('nombrebodega').value ||
        this.estadoaux !== this.FormBodegas.get('estado').value ||
        this.servicioaux !== this.FormBodegas.get('servicio').value ||
        this.tipobodegaaux !== this.FormBodegas.get('tipobodega').value ||
        this.tipoproductoaux !== this.FormBodegas.get('tipoproducto').value ||
        this.nuevabodegaaux !== this.FormBodegas.get('nuevabodega').value ||
        this.controlminimoaux !== this.FormBodegas.get('controlminimo').value ||
        this.codigobodegaaux !== this.FormBodegas.get('codigobodega').value ) {
          this.msj = true;
          opt = opt +  'head';
    }

    this._bodega_productos_paginacion_aux.forEach(element => {
      this._bodega_productos_paginacion.forEach(producto => {
        if(element.mameincodmei == producto.mameincodmei){
          if( element.stockactual !== producto.stockactual ||
              element.nivelreposicion !== producto.nivelreposicion ||
              element.controlminimo !== producto.controlminimo ){
            this.msj = true;
            opt = opt +  'body 1';
          }
        }
      });
    });

    if( this._bodega_servicios_paginacion_aux.length !== this._bodega_servicios_paginacion.length ){
        this.msj = true;
        opt = opt +  'body 2';
    }

    if( this._bodega_usuarios_paginacion_aux.length !== this._bodega_usuarios_paginacion.length ){
      this.msj = true;
      opt = opt +  'body 3';
    }

    if( this._bodega_relacion_bodegas_paginacion_aux.length !== this._bodega_relacion_bodegas_paginacion.length ){
      this.msj = true;
      opt = opt + 'body 4';
    }

    if(this.msj){
      Swal.fire({
        title: 'Limpiar',
        text: "¿Seguro que desea Limpiar los campos?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si'
      }).then((result) => {
        if (result.dismiss != "cancel") {
          this.desactivabtnelimbod = false;
          this.desactivabtnelimserv = false;
          this.desactivabtnelimusu = false;
          this.desactivabtnelimprod = true;
          this.activaBotonbtnmodificar = true;
          this.verificanull = false;
          this.FormBodegas.reset();
          this.FormDatosProducto.reset();
          this.FormBodegas.get('nuevabodega').setValue(1);
          this._bodega = null;
          this._bodega_productos = [];
          this._bodega_productos_paginacion = [];
          this._bodega_servicios = [];
          this._bodega_servicios_paginacion = [];
          this._bodega_usuarios = [];
          this._bodega_usuarios_paginacion = [];
          this._bodega_relacion_bodegas = [];
          this._bodega_relacion_bodegas_paginacion = [];
          this._bodega_productos_aux = [];
          this._bodega_productos_paginacion_aux = [];
          this._bodega_servicios_aux = [];
          this._bodega_servicios_paginacion_aux = [];
          this._bodega_usuarios_aux = [];
          this._bodega_usuarios_paginacion_aux = [];
          this._bodega_relacion_bodegas_aux = [];
          this._bodega_relacion_bodegas_paginacion_aux = [];
          this.FormBodegas.controls.codigobodega.enable();
          this.FormBodegas.controls.tipoproducto.enable();
          this.codprod = '';
          this.checkCritico = true;
          this.checkboxcritico = false;
          this.boddestinoaux = "";
          this.nombrebodegaaux = "";
          this.estado_aux = "";
          this.tipobodegaaux = "";
          this.fraccionable_aux = "";

        }
      });
    } else {

      this.desactivabtnelimbod = false;
      this.desactivabtnelimserv = false;
      this.desactivabtnelimusu = false;
      this.desactivabtnelimprod = true;
      this.activaBotonbtnmodificar = true;
      this.verificanull = false;
      this.FormBodegas.reset();
      this.FormDatosProducto.reset();
      this.FormBodegas.get('nuevabodega').setValue(1);
      this._bodega_productos = [];
      this._bodega_productos_paginacion = [];
      this._bodega_servicios = [];
      this._bodega_servicios_paginacion = [];
      this._bodega_usuarios = [];
      this._bodega_usuarios_paginacion = [];
      this._bodega_relacion_bodegas = [];
      this._bodega_relacion_bodegas_paginacion = [];
      this._bodega_productos_aux = [];
      this._bodega_productos_paginacion_aux = [];
      this._bodega_servicios_aux = [];
      this._bodega_servicios_paginacion_aux = [];
      this._bodega_usuarios_aux = [];
      this._bodega_usuarios_paginacion_aux = [];
      this._bodega_relacion_bodegas_aux = [];
      this._bodega_relacion_bodegas_paginacion_aux = [];
      this.FormBodegas.controls.codigobodega.enable();
      this.FormBodegas.controls.tipoproducto.enable();
      this.codprod = '';
      this.checkCritico = true;
      this.checkboxcritico = false;
      this.boddestinoaux = "";
      this.nombrebodegaaux = "";
      this.estado_aux = "";
      this.tipobodegaaux = "";
      this.fraccionable_aux = "";
    }

    this.startItem = null;
    this.endItem = null;

  }

  ConfirmaEliminaBodegaDeLaGrilla(bodegaAsociada: EstructuraRelacionBodega, id: number) {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirma eliminación relación entre bodegas ?',
      text: "Confirmar la eliminación",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.EliminaBodegaDeLaGrilla(bodegaAsociada, id);
      }
    })
  }

  ConfirmaEliminaUsuarioDeLaGrilla(usuario: UsuariosBodegas, id: number) {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirma eliminación del Usuario Asociado a la Bodega ?',
      text: "Confirmar la eliminación",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.EliminaUsuarioDeLaGrilla(usuario, id);
      }
    })
  }

  ConfirmaEliminaServicioDeLaGrilla(servicio: ServicioUnidadBodegas, id: number) {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirma eliminación del Servicio ?',
      text: "Confirmar la eliminación",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.EliminaServicioDeLaGrilla(servicio, id);
      }
    })
  }

  ConfirmaEliminaProductoDeLaGrilla(producto: ProductosBodegas, id: number) {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirma eliminación del Producto ?',
      text: "Confirmar la eliminación",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.EliminaProductoDeLaGrilla(producto, id);
      }
    })
  }

  EliminaBodegaDeLaGrilla(bodegaAsociada: EstructuraRelacionBodega, id: number) {
    if (bodegaAsociada.accion == "I" && id >= 0) {
      this._bodega_relacion_bodegas.splice(id, 1);
      this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0,20);
      this.alertSwal.title = "Relación Bodega No Asociado ";
      this.alertSwal.show();
    }
    else {
      this._bodegasService.desasociaBodegaEstructuraBodegas(this.hdgcodigo, this.cmecodigo, bodegaAsociada.codbodegaorigen, bodegaAsociada.codbodegarelacion, this.servidor, this.usuario).subscribe(
        response => {
          if (response != null){
            this._bodega_relacion_bodegas.splice(id, 1);
            this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 20);
            this.alertSwal.title = "Relación Entre Bodegas Eliminada";
            this.alertSwal.show();
          }
        },
        error => {
          this.alertSwalError.text = "Error al Desasociar Relación Entre Bodegas";
          this.alertSwalError.show();
        }
      );
    }
  }

  EliminaUsuarioDeLaGrilla(usuario: UsuariosBodegas, id: number) {
    if (usuario.accion == "I" && id >= 0) {
      this._bodega_usuarios.splice(id, 1);
      this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 20);
      this.alertSwal.title = "Usuario No Asociado ";
      this.alertSwal.show();
    }
    else {
      this._bodegasService.desasociaUsuarioEstructuraBodegas(this.hdgcodigo, this.cmecodigo, usuario.bodegacodigo, usuario.userid, usuario.bouid, this.servidor, this.usuario).subscribe(
        response => {
          if (response != null){
            this._bodega_usuarios.splice(id, 1);
            this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 20);
            this.alertSwal.title = "Usaurio Desasociado de la Bodega";
            this.alertSwal.show();
          }
        },
        error => {
          this.alertSwalError.text = "Error al Desasociar Usuario de la Bodega";
          this.alertSwalError.show();
        }
      );
    }
  }


  EliminaServicioDeLaGrilla(servicio: ServicioUnidadBodegas, id: number) {
    if (servicio.accion == "I" && id >= 0) {
      this._bodega_servicios.splice(id, 1);
      this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 20);
      this.alertSwal.title = "Servicio No Asociado ";
      this.alertSwal.show();
    } else {
      this._bodegasService.desasociaServicioEstructuraBodegas(this.hdgcodigo, this.cmecodigo, servicio.codbodega, servicio.idservicio, this.servidor, this.usuario).subscribe(
        response => {
          if (response != null){
            this._bodega_servicios.splice(id, 1);
            this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 20);
            this.alertSwal.title = "Servicio Desasociado de la Bodega";
            this.alertSwal.show();
          }
        },
        error => {
          this.alertSwalError.text = "Error al Desasociar Servicio de la Bodega";
          this.alertSwalError.show();
        }
      );
    }
  }

  EliminaProductoDeLaGrilla(registro: ProductosBodegas, id: number) {
    if(registro.stockactual >0){
      this.alertSwalAlert.title = "No puede eliminar producto con saldo";
      this.alertSwalAlert.show();
    }else{
      this.loading = true;
      if (registro.accion == 'I' && id >= 0) {
        this.alertSwal.title = "Producto Eliminado";
        this.alertSwal.show();
        this._bodega_productos_paginacion.splice(id, 1);
        this.loading = false;
      }
      else {
        registro.servidor = this.servidor;
        registro.usuario = this.usuario;
        this._bodegasService.EliminaProductodeBodega(registro).subscribe(
          response => {
            if (response != null){
              this.alertSwal.title = "Producto Desasociado de la Bodega";
              this.alertSwal.show();
              this._buscabodegasService.listaEstructuraBodegas(this.hdgcodigo, this.cmecodigo, this._bodega.codbodega,
                this._bodega.fbocodigobodega, null, null, null, null, this.usuario, this.servidor, ''
              ).subscribe(
                respuesta => {

                  this._bodega = respuesta[0];
                  this.FormBodegas.get('codigobodega').setValue(this._bodega.fbocodigobodega);
                  this.FormBodegas.get('nombrebodega').setValue(this._bodega.desbodega);
                  this.FormBodegas.get('estado').setValue(this._bodega.estado);
                  this.FormBodegas.get('tipoproducto').setValue(this._bodega.tipoproducto);
                  this.FormBodegas.get('tipobodega').setValue(this._bodega.tipobodega);
                  this.FormBodegas.get('nuevabodega').setValue(0);

                  this._bodega_productos = respuesta[0].productosbodega;
                  this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);
                  this._bodega_servicios = respuesta[0].serviciosunidadbodega;
                  this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 20);
                  this._bodega_usuarios = respuesta[0].usuariosbodega;
                  this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 20);
                  this._bodega_relacion_bodegas = respuesta[0].relacionbodegas;
                  this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 20);
                }
              );
              this.loading = false;
              this.alertSwal.title = "Bodega modificada";
              this.alertSwal.show();
            }else{
              this.loading = false;
            }
          },
          error => {
            this.alertSwalError.text = "Error al Desasociar Producto de la Bodega";
            this.alertSwalError.show();
          }
        );
        this.loading = false;
      }
    }
  }

  CreaBodegaNueva() {
    const Swal = require('sweetalert2');
    if (this.FormBodegas.value.codigo == 0 || this.FormBodegas.value.codigo == null) {
      Swal.fire({
        title: '¿ Confirma Crear nueva Bodega?',
        text: "Confirmar creación de nueva bodega",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.GrabaNuevaBodega();
        }
      })
    }
  }

  async GrabaNuevaBodega() {
    this._bodegasService.CreaBodegaNueva(this.hdgcodigo, this.esacodigo, this.cmecodigo,
      this.FormBodegas.value.codigo, this.FormBodegas.value.nombrebodega,
      "N", this.usuario, this.servidor).subscribe(
        response => {
          if (response != null){
            this.alertSwal.title = "Bodega Creada Exitosamente N°:";
          }
        },
        error => {
          this.alertSwalError.text = "Error al crear nueva Bodega";
          this.alertSwalError.show();
        }
      );
  }

  async AsociaServicio(codigo: number) {
    await this._bodegasService.AsociaBodegaServicio(this.hdgcodigo, this.esacodigo, this.cmecodigo,
      codigo, this.FormBodegas.value.servicio, this.usuario, this.servidor).subscribe(
        response => {
        },
        error => {
          alert("Error al Asociar bodega")
        }
      );
  }

  ModificarBodega(valores: any) {
    const Swal = require('sweetalert2');
    var _validaStock: Boolean = true;
    this._bodega_productos.forEach(element => {
      if ( element.stockactual > 0 && valores.estado != this._bodega.estado ){
        _validaStock = false;
      }else{
        if ( _validaStock != false )
          _validaStock = true;
      }
    });

    if (_validaStock) {
      if (this.FormBodegas.value.codigo != 0 || this.FormBodegas.value.codigo != null) {
        Swal.fire({
          title: '¿ Confirma Modificar Datos Bodega ?',
          text: "Confirmar Modificación Datos Bodega",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          if (result.value) {
            this.ModificarInformacionBodega(valores);
          }
        })
      }
    } else {
      this.loading = false;
      this.alertSwalAlert.title = "Bodega con saldos, NO puede cambiar la Vigencia";
      this.alertSwalAlert.show();
    }
  }

  ModificarInformacionBodega(valores: any) {
    var _bodega_guardar = new (EstructuraBodega);
    var _bodega_productos_guardar: ProductosBodegas[] = [];
    var _bodega_servicio_guardar: ServicioUnidadBodegas[] = [];
    var _bodega_usuarios_guardar: UsuariosBodegas[] = [];
    var _bodega_relacion_guardar: EstructuraRelacionBodega[] = [];
    this.loading = true;

    _bodega_guardar.accion = "M";
    if (this._bodega != null) {
      _bodega_guardar.hdgcodigo = this._bodega.hdgcodigo;
      _bodega_guardar.esacodigo = this._bodega.esacodigo;
      _bodega_guardar.cmecodigo = this._bodega.cmecodigo;
      _bodega_guardar.codbodega = this._bodega.codbodega;
      _bodega_guardar.desbodega = valores.nombrebodega;
      _bodega_guardar.estado = valores.estado;
      _bodega_guardar.modificable = this._bodega.modificable;
      _bodega_guardar.tipoproducto = this._bodega.tipoproducto;
      _bodega_guardar.tipobodega = valores.tipobodega;
      _bodega_guardar.glosatipobodega = null;
      _bodega_guardar.glosatiproducto = null;
      _bodega_guardar.servidor = this.servidor;
      _bodega_guardar.fbodfraccionable = valores.fraccionable;

      this._bodega_productos.forEach(element => {
        if (element.accion == "I" || element.accion == "M"){
          var producto : ProductosBodegas = new ProductosBodegas;
          producto = element;
          producto.stockcritico = Number(element.stockcritico);
          producto.nivelreposicion = Number(element.nivelreposicion)
          _bodega_productos_guardar.unshift(producto);
        }
      });

      _bodega_guardar.productosbodega = _bodega_productos_guardar;

      this._bodega_servicios.forEach(element => {
        if (element.accion == "I" || element.accion == "M")
          _bodega_servicio_guardar.unshift(element);
      });

      _bodega_guardar.serviciosunidadbodega = _bodega_servicio_guardar;

      this._bodega_usuarios.forEach(element => {
        if (element.accion == "I" || element.accion == "M")
          _bodega_usuarios_guardar.unshift(element);
      });

      _bodega_guardar.usuariosbodega = _bodega_usuarios_guardar;

      this._bodega_relacion_bodegas.forEach(element => {
        if (element.accion == "I" || element.accion == "M")
          _bodega_relacion_guardar.unshift(element);
      });

      _bodega_guardar.relacionbodegas = _bodega_relacion_guardar;

      this._bodegasService.guardarEstructuraBodegas(_bodega_guardar).subscribe(
        response => {
          if (response != null){
            this.getBodega(this._bodega.fbocodigobodega);
          }
        });

        this.loading = false;
        this.alertSwal.title = "Bodega modificada";
        this.alertSwal.show();

    } else {
      this.loading = false;
        this.alertSwal.title = "Debe seleccionar una Bodega";
        this.alertSwal.show();
    }

  }

  cambio_check_minimo(id: number, property: string, event: any) {
    if (event.target.checked == false) {
      this._bodega_productos_paginacion[id][property] = "N";
      this._bodega_productos[id][property] = this._bodega_productos_paginacion[id][property];
      this.logicalength();
    } else {
      this._bodega_productos_paginacion[id][property] = "S";
      this._bodega_productos[id][property] = this._bodega_productos_paginacion[id][property];
      this.logicalength();
    }
    if (this._bodega_productos[id]['accion'] != "I") {
      this._bodega_productos[id]['accion'] = "M";
      this._bodega_productos_paginacion[id]['accion'] = "M";
      this.logicalength();
    }
  }

  cambio_cantidad(id: number, property: string, event: any,detalle:ProductosBodegas) {
    if(event.target.value <0){
      this.alertSwalAlert.title = "Debe ingresar valores mayores a 0";
      this.alertSwalAlert.show();

      if(property == 'stockcritico'){
        detalle.stockcritico = 0
        this._bodega_productos[id]['stockcritico'] = 0;
        this.logicalength();
      }
      if(property == 'nivelreposicion'){
        detalle.nivelreposicion = 0;
        this._bodega_productos[id]['nivelreposicion'] = 0;
        this.logicalength();
      }

      if (this._bodega_productos[id]['accion'] != "I") {
        this._bodega_productos[id]['accion'] = "M";
        this._bodega_productos_paginacion[id]['accion'] = "M";
      }
    }else{
      if(event.target.value >=0){
        if (this._bodega_productos[id]['accion'] != "I") {
          this._bodega_productos[id]['accion'] = "M";
          this._bodega_productos_paginacion[id]['accion'] = "M";
          this.logicalength();
        }
        if(property == 'stockcritico'){
          detalle.stockcritico = event.target.value;
          this._bodega_productos[id]['stockcritico'] = event.target.value;
          this.logicalength();
        }
        if(property == 'nivelreposicion'){
          detalle.nivelreposicion = event.target.value;
          this._bodega_productos[id]['nivelreposicion'] = event.target.value;
          this.logicalength();
        }

      }
    }
  }

  onImprimir() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Stock Bodega ?',
      text: "Confirmar Impresión",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.ImprimirStockBodega();
      }
    })
  }

  ImprimirStockBodega() {
    this._imprimesolicitudService.RPTImprimeStockBodega(this.servidor, this.usuario, this.hdgcodigo,
      this.esacodigo, this.cmecodigo, "pdf", this._bodega.codbodega, null).subscribe(
        response => {
          if (response != null){
            window.open(response[0].url, "", "", true);
          }
        },
        error => {
          this.alertSwalError.title = "Error al Imprimir Stock Bodega";
          this.alertSwalError.show();
          this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
          })
        }
      );
  }

  getNombreBodega(nombrebodega: string) {
    if (nombrebodega.length > 50) {
      this.alertSwalError.title = "Largo descripción de bodega no puede ser mayor a 50";
      this.alertSwalError.show();
      this.FormBodegas.get('nombrebodega').setValue('');
      this.logicalength();
      return
    }else{
      this.logicalength();
    }
  }

  ActivaBtnModifica(){
    this.logicalength();
  }


  getBodega(codigobodega: string) {
    this.codbodega =codigobodega;
    this.FormDatosProducto.controls.codigo.reset();
    if (this.codbodega > 99999) {
      this.alertSwalError.title = "Largo del código debe ser menor a 5 dígitos";
      this.alertSwalError.show();
      this.FormBodegas.get('codigo').setValue(null);
      return
    }

    if (this.codbodega === null || this.codbodega === '') {
      return;
    } else {

      this.loading = true;

      this._buscabodegasService.listaEstructuraBodegas(this.hdgcodigo, this.cmecodigo,0,codigobodega, '',
        '', '', '', sessionStorage.getItem('Usuario'), this.servidor, '').subscribe(
          response => {
            if (response != null){
              if (response == undefined || response == [] || response.length == 0) {
                this.loading = false;
                this.alertSwalError.title = "Código bodega no existe"; //mensaje a mostrar
                this.alertSwalError.show();// para que aparezca
                this.loading = false;
                return
              } else {
                this.loading = true;
                this._bodega_productos = [];
                this._bodega_productos_paginacion = [];
                this._bodega_servicios = [];
                this._bodega_servicios_paginacion = [];
                this._bodega_usuarios = [];
                this._bodega_usuarios_paginacion = [];
                this._bodega_relacion_bodegas = [];
                this._bodega_relacion_bodegas_paginacion = [];

                this.boddestinoaux = "";
                this.codigoaux = 0;
                this.nombrebodegaaux = "";
                this.estadoaux = "";
                this.servicioaux = "";
                this.tipobodegaaux = "";
                this.tipoproductoaux = "";
                this.nuevabodegaaux = 0;
                this.controlminimoaux = "";
                this.codigobodegaaux = "";
                this._bodega_productos_aux = [];
                this._bodega_productos_paginacion_aux = [];
                this._bodega_servicios_aux = [];
                this._bodega_servicios_paginacion_aux = [];
                this._bodega_usuarios_aux = [];
                this._bodega_usuarios_paginacion_aux = [];
                this._bodega_relacion_bodegas_aux = [];
                this._bodega_relacion_bodegas_paginacion_aux = [];
                this._bodega = response[0];

                this._bodega_productos_paginacion_critico = [];
                this._bodega_productos_paginacion_critico = [];

                this.FormBodegas.get('codigobodega').setValue(this._bodega.fbocodigobodega);
                this.FormBodegas.get('nombrebodega').setValue(this._bodega.desbodega);
                this.FormBodegas.get('estado').setValue(this._bodega.estado);
                this.FormBodegas.get('tipoproducto').setValue(this._bodega.tipoproducto);
                this.FormBodegas.get('tipobodega').setValue(this._bodega.tipobodega);
                this.FormBodegas.get('nuevabodega').setValue(0);
                this.FormBodegas.get('fraccionable').setValue(this._bodega.fbodfraccionable);
                this.FormBodegas.controls.codigobodega.disable();
                this.activabtnimprimebod = true;

                this._bodega_productos = response[0].productosbodega;
                this.estado_aux = response[0].estado;
                this.tipobodegaaux = response[0].tipobodega;
                this.fraccionable_aux = response[0].fbodfraccionable;
                if(this._bodega_productos.length>0){
                  this.FormBodegas.controls.tipoproducto.disable();
                }
                this._bodega_productos.forEach(x=>{
                  x.bloqcampogrilla = true;
                  x.stockcriticoresp = x.stockcritico;
                  x.nivelreposicionresp = x.nivelreposicion;
                  x.controlminimoresp = x.controlminimo;
                })
                this.lengthproductos = this._bodega_productos.length;
                this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);

                this._bodega_servicios = response[0].serviciosunidadbodega;
                this._bodega_servicios.forEach(x=>{
                  x.bloqcampogrilla = true;
                })
                this.lengthservicios = this._bodega_servicios.length;
                this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 20);

                this._bodega_usuarios = response[0].usuariosbodega;
                this._bodega_usuarios.forEach(x=>{
                  x.bloqcampogrilla = true;
                })
                this.lengthusuarios = this._bodega_usuarios.length;
                this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 20);

                this._bodega_relacion_bodegas = response[0].relacionbodegas;
                this._bodega_relacion_bodegas.forEach(x=>{
                  x.bloqcampogrilla = true;
                })
                this.lengthbodegas = this._bodega_relacion_bodegas.length
                this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 20);

                // Llenar Variables Auxiliares
                this.boddestinoaux = this.FormBodegas.controls.codigobodega.value;
                this.codigoaux = this.FormBodegas.get('codigo').value;
                this.nombrebodegaaux = this.FormBodegas.get('nombrebodega').value;
                this.estadoaux = this.FormBodegas.get('estado').value;
                this.servicioaux = this.FormBodegas.get('servicio').value;
                this.tipobodegaaux = this.FormBodegas.get('tipobodega').value;
                this.tipoproductoaux = this.FormBodegas.get('tipoproducto').value;
                this.nuevabodegaaux = this.FormBodegas.get('nuevabodega').value;
                this.controlminimoaux = this.FormBodegas.get('controlminimo').value;
                this.codigobodegaaux = this.FormBodegas.get('codigobodega').value;
                this.fraccionable_aux = this.FormBodegas.get('fraccionable').value;

                // Llenar Array Auxiliares
                this._bodega_productos_aux = this._bodega_productos;
                this._bodega_productos_paginacion_aux = this._bodega_productos_paginacion;
                this._bodega_servicios_aux = this._bodega_servicios;
                this._bodega_servicios_paginacion_aux = this._bodega_servicios_paginacion;
                this._bodega_usuarios_aux = this._bodega_usuarios;
                this._bodega_usuarios_paginacion_aux = this._bodega_usuarios_paginacion;
                this._bodega_relacion_bodegas_aux = this._bodega_relacion_bodegas;
                this._bodega_relacion_bodegas_paginacion_aux = this._bodega_relacion_bodegas_paginacion;

                this.loading = false;
                this.checkCritico = false;
                this.logicalength();
              }
            } else {
              this.loading = false;
            }
          },
          error => {
            this.loading = false;
            this.alertSwalError.title = "Código bodega no existe"; //mensaje a mostrar
            this.alertSwalError.show();// para que aparezca
          }
        );
    }
  }

  async getProducto() {
    this.loading = true;
    // this.codprod = this.FormDatosProducto.controls.codigo.value;
    //this.activamodal = false;
    if (this.FormDatosProducto.controls.codigo.value === null || this.FormDatosProducto.controls.codigo.value === '' ) {
      this.loading = false;
      this.addArticuloGrilla(false);
      return;
    } else {
      // this.buscaProductoGrilla().then(response => {
        // if(!response) {
          var tipodeproducto = '';
          this.loading = true;
          var controlado = '';
          var controlminimo = '';
          var idBodega = 0;
          var consignacion = '';

          this.codprod = this.FormDatosProducto.controls.codigo.value.toString();

          this._BusquedaproductosService.BuscarArticulosFiltros(this.hdgcodigo, this.esacodigo,
            this.cmecodigo, this.codprod, null, null, null, null, tipodeproducto, idBodega, controlminimo, controlado, consignacion
            , this.usuario, this._bodega_productos,this.servidor).subscribe(
              response => {
                if (response.length > 1) {
                  this.loading = false;
                  this.addArticuloGrilla(false);
                  // this.findArticuloGrilla();
                } else {
                  if (response.length === 1) {
                    this.loading = false;
                    if (this.validaCod(this.codprod, 1) === true) {
                      this.alertSwalAlert.title ="Artículo ya existe asociado a la bodega";
                      this.alertSwalAlert.show();
                      // this.buscaProductoGrilla()
                      return;
                    }
                    this.setArticulogrilla(response[0]);
                    this.activamodal = false;
                    this.FormDatosProducto.reset();
                  } else {
                    this.alertSwalError.title = "Artículo no existe ";
                    this.alertSwalError.show();
                    this.loading = false;
                  }
                }
              }, error => {
                this.loading = false;
              }
            );
    }
  }

  /**Funcion que busca codigo dentro del arreglo previamente guardado //@ML */
  async buscaProductoGrilla() {
    let indx = 0;
    let codigoproductobuscar = "";

    if (this.FormDatosProducto.controls.codigo.value === null || this.FormDatosProducto.controls.codigo.value === '') {
      this._bodega_productos_paginacion = this._bodega_productos_aux.slice(0, 20);
    } else {

      codigoproductobuscar = this.FormDatosProducto.controls.codigo.value.toString();
      indx = this._bodega_productos_aux.findIndex(x => x.mameincodmei === codigoproductobuscar, 1);
      if (indx >= 0) {
        this._bodega_productos_paginacion = [];
        this._bodega_productos_paginacion[0] = this._bodega_productos_aux[indx];
        this._bodega_productos = [];
      } else {
        this.loading = false;
        this.addArticuloGrilla(false);
      }
    }
  }

  limpiarCodigo() {
    this.loading = true;

    this.FormDatosProducto.controls.codigo.reset();

    this._bodega_productos = [];
    this._bodega_productos_paginacion = [];

    // Llenar Array Auxiliares
    this._bodega_productos = this._bodega_productos_aux;
    this._bodega_productos_paginacion = this._bodega_productos_paginacion_aux;

    this.loading = false;
  }

  onBuscarprod() { //BoRRAR //@ML
    let indx = 0;
    let encuentraprod: boolean = false;
    let codigoproductobuscar = this.FormDatosProducto.controls.codigo.value;
    if (codigoproductobuscar === null || codigoproductobuscar === '') {
      this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);
      encuentraprod = false;
    } else {
      indx = this._bodega_productos.findIndex(x => x.mameincodmei === codigoproductobuscar, 1);
      if (indx >= 0) {
        this._bodega_productos_paginacion = [];
        this._bodega_productos_paginacion[0] = this._bodega_productos[indx];
        encuentraprod = true;
      } else {
        this.alertSwalError.title = "Artículo no existe o no está asociado a esta bodega ";
        this.alertSwalError.show();
        this.loading = false;
        encuentraprod = false;
      }
    }
    return encuentraprod;
  }

  ActivaBotonCrear() {
    if (this.FormBodegas.value.codigoproducto == null && this.FormBodegas.value.nombrebodega != null
      && this.FormBodegas.value.estado != null && this.FormBodegas.value.tipobodega != null && this.FormBodegas.value.tipoproducto != null) {
      return true
    }
    else {
      return false
    }
  }

  // ActivaBotonbtnmodificar() {
  //   if ( this.FormBodegas.value.nombrebodega != null
  //     && this.FormBodegas.value.estado != null && this.FormBodegas.value.tipobodega != null ) {
  //     return true
  //   }
  //   else {
  //     return false
  //   }
  // }

  ActivaBotonAgregarArticulo() {
    if ( this.FormBodegas.value.nombrebodega != null
      && this.FormBodegas.value.estado != null
      && this.FormBodegas.value.tipobodega != null
      && this.FormBodegas.value.fraccionable !=null
    ) {
      return true
    }
    else {
      return false
    }
  }

  ActivaBotonImprimir() {
    if (this._bodega_productos_paginacion.length > 0) {
      return true
    }
    else {
      return false
    }
  }

  ActivaBotonBuscaGrilla() {
    if ( this.FormBodegas.value.nombrebodega != null
      && this.FormBodegas.value.estado != null
      && this.FormBodegas.value.tipobodega != null
    ) {
      return true
    }
    else {
      return false;
    }
  }

  limpiarGrillaproducto() {
    this._bodega_productos_paginacion = [];
    this._bodega_productos = [];
  }

  Bucar_Filtrado_Arreglo() {
    let busqueda = "000098501";
    let expresion = new RegExp(`${busqueda}*`, "i");
    let resultado_busqueda = this._bodega_productos.filter(busqueda => expresion.test(this._bodega_productos[0].mameincodmei));
  }

  sortData(sort: Sort) {
    const data = this._bodega_productos_paginacion_aux.slice();
    if (!sort.active || sort.direction === '') {
      this._bodega_productos_paginacion = data;
      return;
    }
    this._bodega_productos_paginacion = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'stockactual': return this.compare(a.stockactual, b.stockactual, isAsc);
        default: return 0;
      }
    });
  }

  async CambioCheckBodegas(registro: EstructuraRelacionBodega,id:number,event:any,marcacheckgrilla: boolean){
    if(event.target.checked){
      registro.marcacheckgrilla = true;
      this.desactivabtnelimbod = true;
      await this.isEliminaIdGrilla(registro)
      await this._bodega_relacion_bodegas.forEach(d=>{
        if(d.marcacheckgrilla === true){
          this.desactivabtnelimbod = true;
        }
      })
     }else{
      registro.marcacheckgrilla = false;
      this.desactivabtnelimbod = false;
      await this.isEliminaIdGrilla(registro);
      await this._bodega_relacion_bodegas.forEach(d=>{
        if(d.marcacheckgrilla === true){
          this.desactivabtnelimbod = true;
        }
      })
    }
  }

  isEliminaIdGrilla(registro: EstructuraRelacionBodega) {

    let indice = 0;
    for (const articulo of this._bodega_relacion_bodegas) {
      if (registro.codbodegaorigen === articulo.codbodegaorigen) {
        articulo.marcacheckgrilla = registro.marcacheckgrilla;

        return indice;
      }
      indice++;
    }
    return -1;
  }

  ConfirmaEliminaBodegaDeLaGrilla2() {

    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirme eliminación de bodega asociada?',
      text: "Confirmar la eliminación",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.EliminaBodegaDeLaGrilla2();
      }
    })
  }

  EliminaBodegaDeLaGrilla2() {
    this._bodega_relacion_bodegas_paginacion.forEach(registro=>{
      if (registro.accion == "I" && this.IdgrillaBodegas(registro) >= 0) {
        if(registro.marcacheckgrilla === true){
          this.desactivabtnelimbod = false;
          this._bodega_relacion_bodegas.splice(this.IdgrillaBodegas(registro), 1);
          this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0,20);
          this.alertSwal.title = "Relación Bodega No Asociado ";
          this.alertSwal.show();
          this.logicalength();
        }
      }
      else {
        if(registro.marcacheckgrilla === true){
          this._bodegasService.desasociaBodegaEstructuraBodegas(this.hdgcodigo, this.cmecodigo, registro.codbodegaorigen,
            registro.codbodegarelacion, this.servidor, this.usuario).subscribe(
            response => {
              this.desactivabtnelimbod = false;
              this._bodega_relacion_bodegas.splice(this.IdgrillaBodegas(registro), 1);
              this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 20);
              this.alertSwal.title = "Relación Entre Bodegas Eliminada";
              this.alertSwal.show();

              this._buscabodegasService.listaEstructuraBodegas(this.hdgcodigo, this.cmecodigo, this._bodega.codbodega,
                this._bodega.fbocodigobodega, null, null, null, null, this.usuario, this.servidor, ''
              ).subscribe(
                respuesta => {

                  this._bodega = respuesta[0];
                  // this.FormBodegas.get('codigo').setValue(this._bodega.codbodega);
                  this.FormBodegas.get('codigobodega').setValue(this._bodega.fbocodigobodega);
                  this.FormBodegas.get('nombrebodega').setValue(this._bodega.desbodega);
                  this.FormBodegas.get('estado').setValue(this._bodega.estado);
                  this.FormBodegas.get('tipoproducto').setValue(this._bodega.tipoproducto);
                  this.FormBodegas.get('tipobodega').setValue(this._bodega.tipobodega);
                  this.FormBodegas.get('nuevabodega').setValue(0);

                  this._bodega_productos = respuesta[0].productosbodega;
                  this._bodega_productos.forEach(x=>{
                    x.bloqcampogrilla = true;
                  })
                  this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);

                  this._bodega_servicios = respuesta[0].serviciosunidadbodega;
                  this._bodega_servicios.forEach(x=>{
                    x.bloqcampogrilla = true;
                  })
                  this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 20);

                  this._bodega_usuarios = respuesta[0].usuariosbodega;
                  this._bodega_usuarios.forEach(x=>{
                    x.bloqcampogrilla = true;
                  })
                  this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 20);

                  this._bodega_relacion_bodegas = respuesta[0].relacionbodegas;
                  this._bodega_relacion_bodegas.forEach(x=>{
                    x.bloqcampogrilla = true;
                  })
                  this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 20);

                  // Llenar Array Auxiliares
                  this._bodega_productos_aux = this._bodega_productos;
                  this._bodega_productos_paginacion_aux = this._bodega_productos_paginacion;

                  this._bodega_servicios_aux = this._bodega_servicios;
                  this._bodega_servicios_paginacion_aux = this._bodega_servicios_paginacion;
                  this._bodega_usuarios_aux = this._bodega_usuarios;
                  this._bodega_usuarios_paginacion_aux = this._bodega_usuarios_paginacion;
                  this._bodega_relacion_bodegas_aux = this._bodega_relacion_bodegas;
                  this._bodega_relacion_bodegas_paginacion_aux = this._bodega_relacion_bodegas_paginacion;
                  this.logicalength();
                }
              );
            },
            error => {
              this.alertSwalError.text = "Error al Desasociar Relación Entre Bodegas";
              this.alertSwalError.show();

            }
          );
        }
      }
    })

  }

  IdgrillaBodegas(registro: EstructuraRelacionBodega) {

    let indice = 0;
    for (const articulo of this._bodega_relacion_bodegas) {
      if (registro.codbodegaorigen === articulo.codbodegaorigen) {

        return indice;

      }
      indice++;
    }
    return -1;
  }

  async CambioCheckServicios(registro: ServicioUnidadBodegas,id:number,event:any,marcacheckgrilla: boolean){
    if(event.target.checked){
      registro.marcacheckgrilla = true;
      this.desactivabtnelimserv = true;
      await this.isEliminaIdGrillaServicios(registro)
      await this._bodega_servicios.forEach(d=>{
        if(d.marcacheckgrilla === true){
          this.desactivabtnelimserv = true;
        }
      })
     }else{
      registro.marcacheckgrilla = false;
      this.desactivabtnelimserv = false;
      await this.isEliminaIdGrillaServicios(registro);
      await this._bodega_relacion_bodegas.forEach(d=>{
        if(d.marcacheckgrilla === true){
          this.desactivabtnelimserv = true;

        }
      })

    }
  }

  isEliminaIdGrillaServicios(registro: ServicioUnidadBodegas) {
    let indice = 0;
    for (const articulo of this._bodega_servicios) {
      if (registro.idservicio === articulo.idservicio) {
        articulo.marcacheckgrilla = registro.marcacheckgrilla;

        return indice;
      }
      indice++;
    }
    return -1;
  }

  ConfirmaEliminaServicioDeLaGrilla2() {

    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirme eliminación de servicio de la bodega ?',
      text: "Confirmar la eliminación del servicio",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.EliminaServicioDeLaGrilla2();
      }
    })
  }

  EliminaServicioDeLaGrilla2() {
    this._bodega_servicios_paginacion.forEach(servicio=>{
      if (servicio.accion == "I" && this.IdgrillaServicios(servicio) >= 0) {
        if(servicio.marcacheckgrilla === true){
          this.desactivabtnelimserv= false;
          this._bodega_servicios.splice(this.IdgrillaServicios(servicio), 1);
          this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 20);
          this.alertSwal.title = "Servicio No Asociado ";
          this.alertSwal.show();
          this.logicalength();
        }
      }
      else {
        if(servicio.marcacheckgrilla === true){
          this.desactivabtnelimserv= false;
          this._bodegasService.desasociaServicioEstructuraBodegas(this.hdgcodigo, this.cmecodigo, servicio.codbodega, servicio.idservicio, this.servidor, this.usuario).subscribe(
            response => {
              this.alertSwal.title = "Servicio Desasociado de la Bodega";
              this.alertSwal.show();
              this.desactivabtnelimserv = false;


              this._buscabodegasService.listaEstructuraBodegas(this.hdgcodigo, this.cmecodigo, this._bodega.codbodega,
                this._bodega.fbocodigobodega, null, null, null, null, this.usuario, this.servidor, ''
              ).subscribe(
                respuesta => {

                  this._bodega = respuesta[0];
                  // this.FormBodegas.get('codigo').setValue(this._bodega.codbodega);
                  this.FormBodegas.get('codigobodega').setValue(this._bodega.fbocodigobodega);
                  this.FormBodegas.get('nombrebodega').setValue(this._bodega.desbodega);
                  this.FormBodegas.get('estado').setValue(this._bodega.estado);
                  this.FormBodegas.get('tipoproducto').setValue(this._bodega.tipoproducto);
                  this.FormBodegas.get('tipobodega').setValue(this._bodega.tipobodega);
                  this.FormBodegas.get('nuevabodega').setValue(0);

                  this._bodega_productos = respuesta[0].productosbodega;
                  this._bodega_productos.forEach(x=>{
                    x.bloqcampogrilla = true;
                  })
                  this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);

                  this._bodega_servicios = respuesta[0].serviciosunidadbodega;
                  this._bodega_servicios.forEach(x=>{
                    x.bloqcampogrilla = true;
                  })
                  this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 20);

                  this._bodega_usuarios = respuesta[0].usuariosbodega;
                  this._bodega_usuarios.forEach(x=>{
                    x.bloqcampogrilla = true;
                  })
                  this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 20);

                  this._bodega_relacion_bodegas = respuesta[0].relacionbodegas;
                  this._bodega_relacion_bodegas.forEach(x=>{
                    x.bloqcampogrilla = true;
                  })
                  this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 20);

                  // Llenar Array Auxiliares
                  this._bodega_productos_aux = this._bodega_productos;
                  this._bodega_productos_paginacion_aux = this._bodega_productos_paginacion;

                  this._bodega_servicios_aux = this._bodega_servicios;
                  this._bodega_servicios_paginacion_aux = this._bodega_servicios_paginacion;
                  this._bodega_usuarios_aux = this._bodega_usuarios;
                  this._bodega_usuarios_paginacion_aux = this._bodega_usuarios_paginacion;
                  this._bodega_relacion_bodegas_aux = this._bodega_relacion_bodegas;
                  this._bodega_relacion_bodegas_paginacion_aux = this._bodega_relacion_bodegas_paginacion;
                  this.logicalength();
                }
              );


            },
            error => {
              this.alertSwalError.text = "Error al Desasociar Servicio de la Bodega";
              this.alertSwalError.show();

            }
          );
        }
      }
    })

  }

  IdgrillaServicios(registro: ServicioUnidadBodegas) {

    let indice = 0;
    for (const articulo of this._bodega_servicios) {
      if (registro.idservicio === articulo.idservicio) {
        return indice;
      }
      indice++;
    }
    return -1;
  }

  async CambioCheckUsuarios(registro: UsuariosBodegas,id:number,event:any,marcacheckgrilla: boolean){
    if(event.target.checked){
      registro.marcacheckgrilla = true;
      this.desactivabtnelimusu = true;
      await this.isEliminaIdGrillaUsuarios(registro)
      await this._bodega_usuarios.forEach(d=>{
        if(d.marcacheckgrilla === true){
          this.desactivabtnelimusu = true;
        }
      })
     }else{
      registro.marcacheckgrilla = false;
      this.desactivabtnelimusu = false;
      await this.isEliminaIdGrillaUsuarios(registro);
      await this._bodega_usuarios.forEach(d=>{
        if(d.marcacheckgrilla === true){
          this.desactivabtnelimusu = true;

        }
      })

    }
  }

  isEliminaIdGrillaUsuarios(registro: UsuariosBodegas) {
    let indice = 0;
    for (const articulo of this._bodega_usuarios) {
      if (registro.userid === articulo.userid) {
        articulo.marcacheckgrilla = registro.marcacheckgrilla;

        return indice;
      }
      indice++;
    }
    return -1;
  }

  ConfirmaEliminaUsuarioDeLaGrilla2() {

    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirme eliminación de usuario de la bodega ?',
      text: "Confirmar la eliminación de usuario",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.EliminaUsuarioDeLaGrilla2();
      }
    })
  }

  EliminaUsuarioDeLaGrilla2() {
    this._bodega_usuarios_paginacion.forEach(usuario=>{
      if (usuario.accion == "I" && this.IdgrillaUsuarios(usuario) >= 0) {
        if(usuario.marcacheckgrilla === true){
          this.desactivabtnelimusu = false;
          this._bodega_usuarios.splice(this.IdgrillaUsuarios(usuario), 1);
          this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 20);
          this.alertSwal.title = "Usuario No Asociado ";
          this.alertSwal.show();
          this.logicalength();
        }
      }
      else {
        if(usuario.marcacheckgrilla === true){
          this._bodegasService.desasociaUsuarioEstructuraBodegas(this.hdgcodigo, this.cmecodigo, usuario.bodegacodigo, usuario.userid, usuario.bouid, this.servidor, this.usuario).subscribe(
            response => {
              this.desactivabtnelimusu = false;
              this._bodega_usuarios.splice(this.IdgrillaUsuarios(usuario), 1);
              this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 20);
              this.alertSwal.title = "Usaurio Desasociado de la Bodega";
              this.alertSwal.show();

              this._buscabodegasService.listaEstructuraBodegas(this.hdgcodigo, this.cmecodigo, this._bodega.codbodega,
                this._bodega.fbocodigobodega, null, null, null, null, this.usuario, this.servidor, ''
              ).subscribe(
                respuesta => {

                  this._bodega = respuesta[0];
                  // this.FormBodegas.get('codigo').setValue(this._bodega.codbodega);
                  this.FormBodegas.get('codigobodega').setValue(this._bodega.fbocodigobodega);
                  this.FormBodegas.get('nombrebodega').setValue(this._bodega.desbodega);
                  this.FormBodegas.get('estado').setValue(this._bodega.estado);
                  this.FormBodegas.get('tipoproducto').setValue(this._bodega.tipoproducto);
                  this.FormBodegas.get('tipobodega').setValue(this._bodega.tipobodega);
                  this.FormBodegas.get('nuevabodega').setValue(0);

                  this._bodega_productos = respuesta[0].productosbodega;
                  this._bodega_productos.forEach(x=>{
                    x.bloqcampogrilla = true;
                  })
                  this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);

                  this._bodega_servicios = respuesta[0].serviciosunidadbodega;
                  this._bodega_servicios.forEach(x=>{
                    x.bloqcampogrilla = true;
                  })
                  this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 20);

                  this._bodega_usuarios = respuesta[0].usuariosbodega;
                  this._bodega_usuarios.forEach(x=>{
                    x.bloqcampogrilla = true;
                  })
                  this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 20);

                  this._bodega_relacion_bodegas = respuesta[0].relacionbodegas;
                  this._bodega_relacion_bodegas.forEach(x=>{
                    x.bloqcampogrilla = true;
                  })
                  this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 20);

                   // Llenar Array Auxiliares
                  this._bodega_productos_aux = this._bodega_productos;
                  this._bodega_productos_paginacion_aux = this._bodega_productos_paginacion;

                  this._bodega_servicios_aux = this._bodega_servicios;
                  this._bodega_servicios_paginacion_aux = this._bodega_servicios_paginacion;
                  this._bodega_usuarios_aux = this._bodega_usuarios;
                  this._bodega_usuarios_paginacion_aux = this._bodega_usuarios_paginacion;
                  this._bodega_relacion_bodegas_aux = this._bodega_relacion_bodegas;
                  this._bodega_relacion_bodegas_paginacion_aux = this._bodega_relacion_bodegas_paginacion;
                  this.logicalength();
                }
              );
            },
            error => {
              this.alertSwalError.text = "Error al Desasociar Usuario de la Bodega";
              this.alertSwalError.show();
            }
          );
        }
      }
    })
  }

  IdgrillaUsuarios(registro: UsuariosBodegas) {

    let indice = 0;
    for (const articulo of this._bodega_usuarios) {
      if (registro.userid === articulo.userid) {

        return indice;

      }
      indice++;
    }
    return -1;
  }

  async CambioCheckProductos(registro: ProductosBodegas,id:number,event:any,marcacheckgrilla: boolean){

    if(event.target.checked){
      registro.marcacheckgrilla = true;
      this.desactivabtnelimprod = false;
      this.activaBotonbtnmodificar = true;
      await this.isEliminaIdGrillaProductos(registro)
      await this._bodega_productos.forEach(d=>{
        if(d.marcacheckgrilla === true){
          this.desactivabtnelimprod = false;
        }
      })
     }else{
      registro.marcacheckgrilla = false;
      this.desactivabtnelimprod = true;
      this.activaBotonbtnmodificar = false;
      await this.isEliminaIdGrillaProductos(registro);
      await this._bodega_productos.forEach(d=>{
        if(d.marcacheckgrilla === true){
          this.desactivabtnelimprod = false;

        }
      })

    }

  }

  isEliminaIdGrillaProductos(registro: ProductosBodegas) {

    let indice = 0;
    for (const articulo of this._bodega_productos) {
      if (registro.meinid === articulo.meinid ) {
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
      title: '¿ Confirme eliminación de artículos de la bodega ?',
      text: "Confirmar la eliminación de artículos",
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
    this._bodega_productos_paginacion.forEach(registro=>{
      if(registro.marcacheckgrilla === true){
        if(registro.stockactual >0){
          this.alertSwalAlert.title = "No puede eliminar producto con saldo";
          this.alertSwalAlert.show();
        }else{
          this.loading = true;


          if (registro.accion == 'I' && this.IdgrillaProductos(registro) >= 0) {
            if(registro.marcacheckgrilla === true){

              this._bodega_productos_paginacion.splice(this.IdgrillaProductos(registro), 1);
              this._bodega_productos.splice(this.IdgrillaProductos(registro), 1);
              this.alertSwal.title = "Producto Eliminado";
              this.alertSwal.show();
              //this._bodega_productos.splice( id, 1 );
              this.loading = false;
              this.logicalength();
            }
          }
          else {
            if(registro.marcacheckgrilla === true){
              registro.servidor = this.servidor;
              registro.usuario = this.usuario;

              this._bodegasService.EliminaProductodeBodega(registro).subscribe(
                response => {
                  this.alertSwal.title = "Producto Desasociado de la Bodega";
                  this.alertSwal.show();


                  this._buscabodegasService.listaEstructuraBodegas(this.hdgcodigo, this.cmecodigo, this._bodega.codbodega,
                    this._bodega.fbocodigobodega, null, null, null, null, this.usuario, this.servidor, ''
                  ).subscribe(
                    respuesta => {

                      this.boddestinoaux = "";
                      this.codigoaux = 0;
                      this.nombrebodegaaux = "";
                      this.estadoaux = "";
                      this.servicioaux = "";
                      this.tipobodegaaux = "";
                      this.tipoproductoaux = "";
                      this.nuevabodegaaux = 0;
                      this.controlminimoaux = "";
                      this.codigobodegaaux = "";

                      this._bodega_productos_aux = [];
                      this._bodega_productos_paginacion_aux = [];
                      this._bodega_servicios_aux = [];
                      this._bodega_servicios_paginacion_aux = [];
                      this._bodega_usuarios_aux = [];
                      this._bodega_usuarios_paginacion_aux = [];
                      this._bodega_relacion_bodegas_aux = [];
                      this._bodega_relacion_bodegas_paginacion_aux = [];

                      this._bodega = respuesta[0];
                      this.FormBodegas.get('codigobodega').setValue(this._bodega.fbocodigobodega);
                      this.FormBodegas.get('nombrebodega').setValue(this._bodega.desbodega);
                      this.FormBodegas.get('estado').setValue(this._bodega.estado);
                      this.FormBodegas.get('tipoproducto').setValue(this._bodega.tipoproducto);
                      this.FormBodegas.get('tipobodega').setValue(this._bodega.tipobodega);
                      this.FormBodegas.get('nuevabodega').setValue(0);

                      this._bodega_productos = respuesta[0].productosbodega;
                      this._bodega_productos.forEach(x=>{
                        x.bloqcampogrilla = true;
                      })
                      this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);

                      this._bodega_servicios = respuesta[0].serviciosunidadbodega;
                      this._bodega_servicios.forEach(x=>{
                        x.bloqcampogrilla = true;
                      })
                      this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 20);

                      this._bodega_usuarios = respuesta[0].usuariosbodega;
                      this._bodega_usuarios.forEach(x=>{
                        x.bloqcampogrilla = true;
                      })
                      this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 20);

                      this._bodega_relacion_bodegas = respuesta[0].relacionbodegas;
                      this._bodega_relacion_bodegas.forEach(x=>{
                        x.bloqcampogrilla = true;
                      })
                      this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 20);
                      this.logicalength();
                      // Llenar Variables Auxiliares
                      this.boddestinoaux = this.FormBodegas.get('codigobodega').value;
                      this.codigoaux = this.FormBodegas.get('codigo').value;
                      this.nombrebodegaaux = this.FormBodegas.get('nombrebodega').value;
                      this.estadoaux = this.FormBodegas.get('estado').value;
                      this.servicioaux = this.FormBodegas.get('nuevabodega').value;
                      this.tipobodegaaux = this.FormBodegas.get('tipobodega').value;
                      this.tipoproductoaux = this.FormBodegas.get('tipoproducto').value;
                      this.nuevabodegaaux = this.FormBodegas.get('nuevabodega').value;
                      this.controlminimoaux = this.FormBodegas.get('controlminimo').value;
                      this.codigobodegaaux = this.FormBodegas.get('codigobodega').value;

                      // Llenar Array Auxiliares
                      this._bodega_productos_aux = this._bodega_productos;
                      this._bodega_productos_paginacion_aux = this._bodega_productos_paginacion;
                      this._bodega_servicios_aux = this._bodega_servicios;
                      this._bodega_servicios_paginacion_aux = this._bodega_servicios_paginacion;
                      this._bodega_usuarios_aux = this._bodega_usuarios;
                      this._bodega_usuarios_paginacion_aux = this._bodega_usuarios_paginacion;
                      this._bodega_relacion_bodegas_aux = this._bodega_relacion_bodegas;
                      this._bodega_relacion_bodegas_paginacion_aux = this._bodega_relacion_bodegas_paginacion;

                    }
                  );
                  this.loading = false;
                  this.alertSwal.title = "Bodega modificada";
                  this.alertSwal.show();
                },
                error => {
                  this.alertSwalError.text = "Error al Desasociar Producto de la Bodega";
                  this.alertSwalError.show();
                }
              );
              this.loading = false;
            }
          }
        }
      }
    })

  }

  IdgrillaProductos(registro: ProductosBodegas) {
    let indice = 0;
    for (const articulo of this._bodega_productos) {
      if (registro.meinid === articulo.meinid) {

        return indice;

      }
      indice++;
    }
    return -1;
  }

  Salir(){
    this.msj = false;
    const Swal = require('sweetalert2');
    if( this.boddestinoaux !== this.FormBodegas.get('boddestino').value ||
        this.codigoaux !== this.FormBodegas.get('codigo').value ||
        this.nombrebodegaaux !== this.FormBodegas.get('nombrebodega').value ||
        this.estadoaux !== this.FormBodegas.get('estado').value ||
        this.servicioaux !== this.FormBodegas.get('servicio').value ||
        this.tipobodegaaux !== this.FormBodegas.get('tipobodega').value ||
        this.tipoproductoaux !== this.FormBodegas.get('tipoproducto').value ||
        this.nuevabodegaaux !== this.FormBodegas.get('nuevabodega').value ||
        this.controlminimoaux !== this.FormBodegas.get('controlminimo').value ||
        this.codigobodegaaux !== this.FormBodegas.get('codigobodega').value ) {
          this.msj = true;
    }

    this._bodega_productos_paginacion_aux.forEach(element => {
      this._bodega_productos_paginacion.forEach(producto => {
        if(element.mameincodmei == producto.mameincodmei){
          if( element.stockactual !== producto.stockactual ||
              element.nivelreposicion !== producto.nivelreposicion ||
              element.controlminimo !== producto.controlminimo ){
            this.msj = true;
          }
        }
      });
    });

    if( this._bodega_servicios_paginacion_aux.length !== this._bodega_servicios_paginacion.length ){
        this.msj = true;
    }

    if( this._bodega_usuarios_paginacion_aux.length !== this._bodega_usuarios_paginacion.length ){
      this.msj = true;
    }

    if( this._bodega_relacion_bodegas_paginacion_aux.length !== this._bodega_relacion_bodegas_paginacion.length ){
      this.msj = true;
    }

    if(this.msj){
      Swal.fire({
        title: 'Salir',
        text: "¿Seguro que desea Salir sin guardar?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si'
      }).then((result) => {
        if (result.dismiss != "cancel") {
          this.route.paramMap.subscribe(param => {
            this.router.navigate(['home']);
        })
        }
      });
    } else {
      this.route.paramMap.subscribe(param => {
        this.router.navigate(['home']);
      })
    }
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  async logicalength(){

    await this.ModificaCabecera();
    await this.NuevosRegistrosServicios();
    await this.NuevosRegistrosUsarios();
    await this.NuevosRegistrosBodegas();
    await this.NuevosRegistrosProductos();

    if(this.vaciosservicios === true && this.vaciosusuarios === true && this.vaciosbodegas
      && this.vaciosproductos === true && this.vacioscabecera === true){
        this.verificanull = false;
    }else{
      if (this.vaciosservicios === true && this.vaciosusuarios === false &&
        this.vaciosbodegas === false && this.vacioscabecera === false){
          this.verificanull = true;
      }else {
        if(this.vaciosservicios === false && this.vaciosusuarios === true &&
          this.vaciosbodegas === true && this.vacioscabecera === true){
            this.verificanull = true;
        }else{
          this.verificanull = true;
        }
      }
    }
  }

  ModificaCabecera(){
    if(this.FormBodegas.controls.codigobodega.value != null &&
      this.FormBodegas.controls.nombrebodega.value != null &&
      this.FormBodegas.controls.estado.value != null &&
      this.FormBodegas.controls.tipobodega.value != null &&
      this.FormBodegas.controls.fraccionable.value != null &&
      this.FormBodegas.controls.codigobodega.value != "" &&
      this.FormBodegas.controls.nombrebodega.value != "" &&
      this.FormBodegas.controls.estado.value != "" &&
      this.FormBodegas.controls.tipobodega.value != "" &&
      this.FormBodegas.controls.fraccionable.value != ""){
        if(this.FormBodegas.controls.codigobodega.value != this.boddestinoaux ||
          this.FormBodegas.controls.nombrebodega.value != this.nombrebodegaaux ||
          this.FormBodegas.controls.estado.value != this.estado_aux ||
          this.FormBodegas.controls.tipobodega.value != this.tipobodegaaux ||
          this.FormBodegas.controls.fraccionable.value != this.fraccionable_aux){
            this.vacioscabecera = false;
        }else{
            this.vacioscabecera = true;
        }
      } else {
        this.vacioscabecera = true;
      }

  }

  NuevosRegistrosServicios(){
    if(this._bodega_servicios.length){
      if(this._bodega_servicios.length === this.lengthservicios ){
        this.vaciosservicios = true;
        return
      }else{
        this.vaciosservicios = false;
      }
    } else {
      this.vaciosservicios = true;
    }
  }

  NuevosRegistrosUsarios(){
    if(this._bodega_usuarios.length) {
      if(this._bodega_usuarios.length === this.lengthusuarios){
        this.vaciosusuarios = true;
        return;
      }else{
        this.vaciosusuarios = false;
      }
    } else {
      this.vaciosusuarios = true;
    }
  }

  NuevosRegistrosBodegas(){
    if(this._bodega_relacion_bodegas.length){
      if(this._bodega_relacion_bodegas.length === this.lengthbodegas){
        this.vaciosbodegas = true;
        return;
      }else{
        this.vaciosbodegas = false;
      }
    } else {
      this.vaciosbodegas = true;
    }
  }

  NuevosRegistrosProductos(){
    if (this._bodega_productos_paginacion.length) {

      if(this.lengthproductos != this._bodega_productos.length){
        this.vaciosproductos = false;

      }else{
        for (var data of this._bodega_productos_paginacion) {
          if (data.stockcritico != data.stockcriticoresp ||  data.nivelreposicion != data.nivelreposicionresp ||
            data.controlminimo != data.controlminimoresp || data.stockcritico === null ||
            data.nivelreposicion === null) {

            this.vaciosproductos = false;
            return;
          } else {
            this.vaciosproductos = true;
          }
        }
      }
    } else {
      this.vaciosproductos = true;
    }
  }

  CambioStockCritico(event:any){
    if(event.target.checked){
      // Llenar Array de control stock critico
      this._bodega_productos_critico = [];
      this._bodega_productos.forEach(element => {
        if(element.stockactual <= element.stockcritico) {
          this._bodega_productos_critico.push(element);
        }
      });
      this._bodega_productos_paginacion_critico = this._bodega_productos_critico.slice(0, 20);
      this._bodega_productos = [];
      this._bodega_productos_paginacion = [];

      // Llenar Array Auxiliares
      this._bodega_productos = this._bodega_productos_critico;
      this._bodega_productos_paginacion = this._bodega_productos_paginacion_critico;
     }else{
      this._bodega_productos = [];
      this._bodega_productos_paginacion = [];

      // Llenar Array Auxiliares
      this._bodega_productos = this._bodega_productos_aux;
      this._bodega_productos_paginacion = this._bodega_productos_paginacion_aux;
    }
  }

  onControlminimo(event:any){

    this._bodega_productos.forEach(element => {
        if(event.target.checked){
          element.controlminimo = 'S';

        }else {
          element.controlminimo = 'N';

        }

        if( element.accion !== "I") {
          element.accion = "M";
          this.logicalength();
        }

      });

    if( this.startItem === null ){
      this._bodega_productos_paginacion = this._bodega_productos.slice(0, 20);

    }else {
      this._bodega_productos_paginacion = this._bodega_productos.slice(this.startItem, this.endItem);

    }

  }

}
