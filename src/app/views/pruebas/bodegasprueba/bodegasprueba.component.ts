import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Bodegas } from '../../../models/entity/Bodegas';
import { BusquedaproductosComponent } from '../../busquedaproductos/busquedaproductos.component';
import { BusquedabodegasComponent } from '../../busquedabodegas/busquedabodegas.component';
import { BodegasService } from '../../../servicios/bodegas.service';
import { Servicio } from '../../../models/entity/Servicio';

import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TipoRegistro } from 'src/app/models/entity/TipoRegistro';
import { TiporegistroService } from '../../../servicios/tiporegistro.service';

import { EstructuraBodega } from 'src/app/models/entity/estructura-bodega';
import { TipoParametro } from 'src/app/models/entity/tipo-parametro';

import { Unidades } from 'src/app/models/entity/Unidades';
import { ProductosBodegas } from 'src/app/models/entity/productos-bodegas';
import { ServicioUnidadBodegas } from 'src/app/models/entity/servicio-unidad-bodegas';
import { UsuariosBodegas } from 'src/app/models/entity/usuarios-bodegas';
import { BusquedaServiciosComponent } from '../../busqueda-servicios/busqueda-servicios.component';
import { BusquedaUsuariosComponent } from '../../busqueda-usuarios/busqueda-usuarios.component';
import { EstructuraListaUsuarios } from 'src/app/models/entity/estructura-lista-usuarios';
import { EstructuraRelacionBodega } from 'src/app/models/entity/estructura-relacion-bodega';
import { TipoRelacionBodega } from 'src/app/models/entity/tipo-relacion-bodega';
import { Permisosusuario } from '../../../permisos/permisosusuario';
import { InformesService } from '../../../servicios/informes.service';
import { BusquedaproductosService } from 'src/app/servicios/busquedaproductos.service';


@Component({
  selector: 'app-bodegasprueba',
  templateUrl: './bodegasprueba.component.html',
  styleUrls: ['./bodegasprueba.component.css'],
  providers: [BodegasService,InformesService]
})
export class BodegaspruebaComponent implements OnInit {
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
  public fboidbodega: number;
  public servidor = environment.URLServiciosRest.ambiente;
  public usuario = environment.privilegios.usuario;
  public bodegasselec: Bodegas;
  public _tiposrelacion: TipoRelacionBodega[];
  public activabtnimprimebod : boolean = false;

  onClose: any;
  bsModalRef: any;

  public loading = false;


  public tiposproductoamacenados: Array<TipoRegistro> = [];

  public arreglotipobodega: TipoParametro[] = [];
  public arreglotipoproducto: TipoParametro[] = [];
  public arreglounidad: Unidades[] = []

  public _bodega: EstructuraBodega;
  public _bodega_productos: ProductosBodegas[] = [];
  public _bodega_productos_paginacion: ProductosBodegas[] = [];

  public _bodega_servicios: ServicioUnidadBodegas[] = [];
  public _bodega_servicios_paginacion: ServicioUnidadBodegas[] = [];

  public _bodega_usuarios: UsuariosBodegas[] = [];
  public _bodega_usuarios_paginacion: UsuariosBodegas[] = [];

  public _bodega_relacion_bodegas: EstructuraRelacionBodega[] = [];
  public _bodega_relacion_bodegas_paginacion: EstructuraRelacionBodega[] = [];

  public codbodega = null;
  public codprod = null;

  constructor(
    public _BsModalService: BsModalService,
    private formBuilder: FormBuilder,
    private _bodegasService: BodegasService,
    public TiporegistroService: TiporegistroService,
    private _buscabodegasService: BodegasService,
    private _imprimesolicitudService  : InformesService,
    public _BusquedaproductosService: BusquedaproductosService,
  ) {
    this.FormBodegas = this.formBuilder.group({
      boddestino: [{ value: null, disabled: false }, Validators.required],
      codigo: [{ value: null, disabled: false }, Validators.required],
      nombrebodega: [{ value: null, disabled: false }, Validators.required],
      estado: [{ value: null, disabled: false }, Validators.required],
      servicio: [{ value: null, disabled: false }, Validators.required],
      tipobodega: [{ value: null, disabled: false }, Validators.required],
      tipoproducto: [{ value: null, disabled: false }, Validators.required],
      nuevabodega: [{ value: null, disabled: false }, Validators.required],
      controlminimo: [{ value: null, disabled: false }, Validators.required],
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


    this._buscabodegasService.listatipobodega(this.hdgcodigo, this.usuario, this.servidor).subscribe(
      response => {

        this.arreglotipobodega = response;

      }
    );

    this._buscabodegasService.listarTipoRelacionBodegas(this.hdgcodigo, this.cmecodigo, this.servidor, this.usuario).subscribe(
      response => {
        this._tiposrelacion = response;
      }
    )



    this._buscabodegasService.listatipoproducto(this.hdgcodigo, this.usuario, this.servidor).subscribe(
      response => {

        this.arreglotipoproducto = response;

      }
    );



    this.FormBodegas.get('nuevabodega').setValue(1);


  }



  pageChanged(event: PageChangedEvent, tipo: number): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    switch(tipo) {
      case 1://Producto
        this._bodega_productos_paginacion = this._bodega_productos.slice(startItem, endItem);
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
    this._BSModalRef = this._BsModalService.show(BusquedabodegasComponent, this.setModalBusquedaBodega());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) {
        this.FormBodegas.get('nuevabodega').setValue(1);
      }
      else {
        this._bodega = response;
        this.FormBodegas.get('codigo').setValue(this._bodega.codbodega);
        this.FormBodegas.get('nombrebodega').setValue(this._bodega.desbodega);
        this.FormBodegas.get('estado').setValue(this._bodega.estado);
        this.FormBodegas.get('tipoproducto').setValue(this._bodega.tipoproducto);
        this.FormBodegas.get('tipobodega').setValue(this._bodega.tipobodega);
        this.FormBodegas.get('nuevabodega').setValue(0);
        this.activabtnimprimebod = true;
        this._bodega_productos = response.productosbodega;
        this._bodega_productos_paginacion = this._bodega_productos.slice(0, 8);

        this._bodega_servicios = response.serviciosunidadbodega;
        this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 8);

        this._bodega_usuarios = response.usuariosbodega;
        this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 8);

        this._bodega_relacion_bodegas = response.relacionbodegas;
        this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 8);


      }
    });
  }



  addBodegaGrilla() {
    var nueva_bodega_asociada = new (EstructuraRelacionBodega);

    this._BSModalRef = this._BsModalService.show(BusquedabodegasComponent, this.setModalBusquedaBodega());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      console.log(this._bodega_relacion_bodegas_paginacion);
      console.log(response);
      if (response == undefined) {
      }
      else {
        if (this.validaCod(response.codbodega, 4) === true){
          return;
        } else {
          nueva_bodega_asociada.hdgcodigo = this.hdgcodigo;
          nueva_bodega_asociada.esacodigo = this.esacodigo;
          nueva_bodega_asociada.cmecodigo = this.cmecodigo;
          nueva_bodega_asociada.codbodegaorigen = response.codbodega;
          nueva_bodega_asociada.codbodegarelacion = this.FormBodegas.value.codigo;
          nueva_bodega_asociada.tiporelacion = 1;
          nueva_bodega_asociada.nombodega = response.desbodega;
  
          nueva_bodega_asociada.servidor = this.servidor;
          nueva_bodega_asociada.usuario = this.usuario;
          nueva_bodega_asociada.accion = 'I';
          nueva_bodega_asociada.glosatiporelacion = 'None'
  
          this._tiposrelacion.forEach(element => {
            if (element.idRealcion == nueva_bodega_asociada.tiporelacion) {
              nueva_bodega_asociada.glosatiporelacion = element.descripcionrelacion;
            }
          });
          this._bodega_relacion_bodegas.unshift(nueva_bodega_asociada);
          this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 8);  
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
      }
    };
    return dtModal;
  }



  addUsauriosGrilla() {

    const usuario_nuevo = new (UsuariosBodegas);

    this._BSModalRef = this._BsModalService.show(BusquedaUsuariosComponent, this.setModalBusquedaUsuarios());
    this._BSModalRef.content.onClose.subscribe((response: EstructuraListaUsuarios) => {
      console.log(response);
      console.log(this._bodega_usuarios_paginacion);
      if (response == undefined) { }
      else {
        if (this.validaCod(response.userid, 3) === true){
          return;
        } else {
          usuario_nuevo.accion = "I";
          usuario_nuevo.bouid = 0;
          usuario_nuevo.userid = response.userid;
          usuario_nuevo.glosausuario = response.username;
          usuario_nuevo.bodegacodigo = this.FormBodegas.value.codigo;
          this._bodega_usuarios.unshift(usuario_nuevo);
          this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 8); 
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
          return;
        } else{
          servicio_nuevo.accion = "I";
          servicio_nuevo.hdgcodigo = this.hdgcodigo;
          servicio_nuevo.cmecodigo = this.cmecodigo;
          servicio_nuevo.idservicio = response.servicioid;
          servicio_nuevo.codservicio = response.serviciocod;
          servicio_nuevo.descservicio = response.serviciodesc;
          servicio_nuevo.codbodega = this.FormBodegas.value.codigo;
          this._bodega_servicios.unshift(servicio_nuevo);
          this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 8); 
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
    switch (tipo){
      case 1:
        indx = this._bodega_productos_paginacion.findIndex(x => x.mameincodmei === codigo, 1);
        if (indx >= 0) {
          return true;
        } else {
          return false;
        }
      case 2:
        indx = this._bodega_servicios_paginacion.findIndex(x => x.codservicio === codigo, 1);
        if (indx >= 0) {
          return true;
        } else {
          return false;
        }
      case 3:
        indx = this._bodega_usuarios_paginacion.findIndex(x => x.userid === codigo, 1);
        if (indx >= 0) {
          return true;
        } else {
          return false;
        }
      case 4:
        indx = this._bodega_relacion_bodegas_paginacion.findIndex(x => x.codbodegaorigen === codigo, 1);
        if (indx >= 0) {
          return true;
        } else {
          return false;
        }
    }

  }

  addArticuloGrilla() {

    // const producto_nuevo = new (ProductosBodegas);

    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModalBusquedaProductos());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) { }
      else {
        if (this.validaCod(response.codigo, 1) === true) {
          return;
        } else {
          this.setArticulogrilla(response);
          // producto_nuevo.accion = "I";
          // producto_nuevo.bodid = this._bodega.codbodega;
          // producto_nuevo.controlminimo = "N";
          // producto_nuevo.glosaproducto = response.descripcion;
          // producto_nuevo.hdgcodigo = this._bodega.hdgcodigo;
          // producto_nuevo.meinid = response.mein;
          // producto_nuevo.mameincodmei = response.codigo;
          // producto_nuevo.nivelreposicion = 0;
          // producto_nuevo.ptoasignacion = 0;
          // producto_nuevo.ptoreposicion = 0;
          // producto_nuevo.stockactual = 0;
          // producto_nuevo.stockcritico = 0;
          // producto_nuevo.principioactivo = response.principioactivo;
          // producto_nuevo.presentacion    = response.presentacion;
          // producto_nuevo.formafarma      = response.formafarma;
          // producto_nuevo.glosaunidad = response.glosaunidaddespacho ;
          // producto_nuevo.glosatipoproducto = response.desctiporegistro;
  
  
          // this._bodega_productos.unshift(producto_nuevo);
          // this._bodega_productos_paginacion = this._bodega_productos.slice(0, 8);
        }
      }
    });
  }

  setArticulogrilla(producto: any) {
    console.log('desde setArticulogrilla()')
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
    producto_nuevo.presentacion    = producto.presentacion;
    producto_nuevo.formafarma      = producto.formafarma;
    producto_nuevo.glosaunidad = producto.glosaunidaddespacho ;
    producto_nuevo.glosatipoproducto = producto.desctiporegistro;


    this._bodega_productos.unshift(producto_nuevo);
    this._bodega_productos_paginacion = this._bodega_productos.slice(0, 8);
  }

  setModalBusquedaProductos() {
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
        codprod: this.codprod
      }
    };
    return dtModal;
  }

  Limpiar() {
    this.FormBodegas.reset();
    this.FormBodegas.get('nuevabodega').setValue(1);
    this._bodega_productos = [];
    this._bodega_productos_paginacion = [];
    this._bodega_servicios = [];
    this._bodega_servicios_paginacion = [];
    this._bodega_usuarios = [];
    this._bodega_usuarios_paginacion = [];
    this._bodega_relacion_bodegas = [];
    this._bodega_relacion_bodegas_paginacion = [];


  }


  ConfirmaEliminaBodegaDeLaGrilla(bodegaAsociada:EstructuraRelacionBodega, id:number){
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
      this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 8);
      this.alertSwal.title = "Relación Bodega No Asociado ";
      this.alertSwal.show();
    }
    else {

      this._bodegasService.desasociaBodegaEstructuraBodegas(this.hdgcodigo, this.cmecodigo, bodegaAsociada.codbodegaorigen, bodegaAsociada.codbodegarelacion,  this.servidor, this.usuario).subscribe(
        response => {
          this._bodega_relacion_bodegas.splice(id, 1);
          this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 8);
          this.alertSwal.title = "Realción Entre Bodegas Eliminada";
          this.alertSwal.show();

        },
        error => {
          console.log(error);
          this.alertSwalError.text = "Error al Desasociar Relación Entre Bodegas";
          this.alertSwalError.show();

        }
      );
    }
  }


  EliminaUsuarioDeLaGrilla(usuario: UsuariosBodegas, id: number) {

    if (usuario.accion == "I" && id >= 0) {
      this._bodega_usuarios.splice(id, 1);
      this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 8);
      this.alertSwal.title = "Usuario No Asociado ";
      this.alertSwal.show();
    }
    else {

      this._bodegasService.desasociaUsuarioEstructuraBodegas(this.hdgcodigo, this.cmecodigo, usuario.bodegacodigo, usuario.userid, usuario.bouid, this.servidor, this.usuario).subscribe(
        response => {
          this._bodega_usuarios.splice(id, 1);
          this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 8);
          this.alertSwal.title = "Usaurio Desasociado de la Bodega";
          this.alertSwal.show();

        },
        error => {
          console.log(error);
          this.alertSwalError.text = "Error al Desasociar Usuario de la Bodega";
          this.alertSwalError.show();

        }
      );
    }
  }


  EliminaServicioDeLaGrilla(servicio: ServicioUnidadBodegas, id: number) {

    if (servicio.accion == "I" && id >= 0) {
      this._bodega_servicios.splice(id, 1);
      this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 8);
      this.alertSwal.title = "Servicio No Asociado ";
      this.alertSwal.show();
    }
    else {

      this._bodegasService.desasociaServicioEstructuraBodegas(this.hdgcodigo, this.cmecodigo, servicio.codbodega, servicio.idservicio, this.servidor, this.usuario).subscribe(
        response => {
          this._bodega_servicios.splice(id, 1);
          this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 8);
          this.alertSwal.title = "Servicio Desasociado de la Bodega";
          this.alertSwal.show();

        },
        error => {
          console.log(error);
          this.alertSwalError.text = "Error al Desasociar Servicio de la Bodega";
          this.alertSwalError.show();

        }
      );
    }
  }


  EliminaProductoDeLaGrilla(registro: ProductosBodegas, id: number) {

    this.loading = true;

    if (registro.accion == 'I' && id >= 0) {

      this.alertSwal.title = "Producto Eliminado";
      this.alertSwal.show();
      this._bodega_productos_paginacion.splice(id, 1);
      //this._bodega_productos.splice( id, 1 );
      this.loading = false;
    }
    else {
      registro.servidor = this.servidor;
      registro.usuario = this.usuario;

      this._bodegasService.EliminaProductodeBodega(registro).subscribe(
        response => {
          this.alertSwal.title = "Producto Desasociado de la Bodega";
          this.alertSwal.show();


          this._buscabodegasService.listaEstructuraBodegas(this.hdgcodigo, this.cmecodigo, this._bodega.codbodega, null, null, null, null,this.usuario,this.servidor
          ).subscribe(
            respuesta => {

              this._bodega = respuesta[0];
              this.FormBodegas.get('codigo').setValue(this._bodega.codbodega);
              this.FormBodegas.get('nombrebodega').setValue(this._bodega.desbodega);
              this.FormBodegas.get('estado').setValue(this._bodega.estado);
              this.FormBodegas.get('tipoproducto').setValue(this._bodega.tipoproducto);
              this.FormBodegas.get('tipobodega').setValue(this._bodega.tipobodega);
              this.FormBodegas.get('nuevabodega').setValue(0);

              this._bodega_productos = respuesta[0].productosbodega;
              this._bodega_productos_paginacion = this._bodega_productos.slice(0, 8);

              this._bodega_servicios = respuesta[0].serviciosunidadbodega;
              this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 8);

              this._bodega_usuarios = respuesta[0].usuariosbodega;
              this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 8);

              this._bodega_relacion_bodegas = respuesta[0].relacionbodegas;
              this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 8);

            }
          );

          this.loading = false;
          this.alertSwal.title = "Bodega modificada";
          this.alertSwal.show();
        },
        error => {
          console.log(error);
          this.alertSwalError.text = "Error al Desasociar Producto de la Bodega";
          this.alertSwalError.show();
        }
      );
      this.loading = false;
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
          this.alertSwal.title = "Bodega Creada Exitosamente N°:";

        },
        error => {
          console.log(error);
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
          console.log(error);
          alert("Error al Asociar bodega")
        }
      );
  }





  ModificarBodega(valores: any) {

    const Swal = require('sweetalert2');

    if (this.FormBodegas.value.codigo != 0 || this.FormBodegas.value.codigo != null) {
      Swal.fire({
        title: '¿ Confirma Modificar Datos Bodega?',
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

  }


  ModificarInformacionBodega(valores: any) {
    var _bodega_guardar = new (EstructuraBodega);
    var _bodega_productos_guardar: ProductosBodegas[] = [];
    var _bodega_servicio_guardar: ServicioUnidadBodegas[] = [];
    var _bodega_usuarios_guardar: UsuariosBodegas[] = [];
    var _bodega_relacion_guardar: EstructuraRelacionBodega[] = [];

    this.loading = true;

    _bodega_guardar.accion = "M";

    _bodega_guardar.hdgcodigo = this._bodega.hdgcodigo;
    _bodega_guardar.esacodigo = this._bodega.esacodigo;
    _bodega_guardar.cmecodigo = this._bodega.cmecodigo;
    _bodega_guardar.codbodega = this._bodega.codbodega;
    _bodega_guardar.desbodega = valores.nombrebodega;
    _bodega_guardar.estado = valores.estado;
    _bodega_guardar.modificable = this._bodega.modificable;
    _bodega_guardar.tipoproducto = valores.tipoproducto;
    _bodega_guardar.tipobodega = valores.tipobodega;
    _bodega_guardar.glosatipobodega = null;
    _bodega_guardar.glosatiproducto = null;
    _bodega_guardar.servidor = this.servidor


    this._bodega_productos.forEach(element => {
      if (element.accion == "I" || element.accion == "M")
        _bodega_productos_guardar.unshift(element);

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

        this._buscabodegasService.listaEstructuraBodegas(this.hdgcodigo, this.cmecodigo, this._bodega.codbodega, null, null, null, null,this.usuario, this.servidor
        ).subscribe(
          respuesta => {

            this._bodega = respuesta[0];
            this.FormBodegas.get('codigo').setValue(this._bodega.codbodega);
            this.FormBodegas.get('nombrebodega').setValue(this._bodega.desbodega);
            this.FormBodegas.get('estado').setValue(this._bodega.estado);
            this.FormBodegas.get('tipoproducto').setValue(this._bodega.tipoproducto);
            this.FormBodegas.get('tipobodega').setValue(this._bodega.tipobodega);
            this.FormBodegas.get('nuevabodega').setValue(0);

            this._bodega_productos = respuesta[0].productosbodega;
            this._bodega_productos_paginacion = this._bodega_productos.slice(0, 8);

            this._bodega_servicios = respuesta[0].serviciosunidadbodega;
            this._bodega_servicios_paginacion = this._bodega_servicios.slice(0, 8);

            this._bodega_usuarios = respuesta[0].usuariosbodega;
            this._bodega_usuarios_paginacion = this._bodega_usuarios.slice(0, 8);

            this._bodega_relacion_bodegas = respuesta[0].relacionbodegas;
            this._bodega_relacion_bodegas_paginacion = this._bodega_relacion_bodegas.slice(0, 8);

          }
        );

        this.loading = false;
        this.alertSwal.title = "Bodega modificada";
        this.alertSwal.show();
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    );



  }



  cambio_check_minimo(id: number, property: string, event: any) {
    if (event.target.checked == false) {
      this._bodega_productos_paginacion[id][property] = "N";
      this._bodega_productos[id][property] = this._bodega_productos_paginacion[id][property]
    } else {
      this._bodega_productos_paginacion[id][property] = "S";
      this._bodega_productos[id][property] = this._bodega_productos_paginacion[id][property]

    }

    if (this._bodega_productos[id]['accion'] != "I") {
      this._bodega_productos[id]['accion'] = "M";
      this._bodega_productos_paginacion[id]['accion'] = "M";
    }


  }

  cambio_cantidad(id: number, property: string, event: any) {

    if (this._bodega_productos[id]['accion'] != "I") {
      this._bodega_productos[id]['accion'] = "M";
      this._bodega_productos_paginacion[id]['accion'] = "M";
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

  ImprimirStockBodega(){
    console.log("Imprime Stock Bodega",this.servidor,this.usuario,this.hdgcodigo,
    this.esacodigo,this.cmecodigo, "pdf",this._bodega.codbodega, this._bodega,null) // modificar el contenido de la funcion segun requiera el servicio
    this._imprimesolicitudService.RPTImprimeStockBodega(this.servidor,this.usuario,this.hdgcodigo,
    this.esacodigo,this.cmecodigo, "pdf",this._bodega.codbodega,null).subscribe(
      response => {

        window.open(response[0].url, "", "", true);
          // this.alertSwal.title = "Reporte Impreso Correctamente";
          // this.alertSwal.show();
      },
      error => {
        console.log(error);
        this.alertSwalError.title = "Error al Imprimir Stock Bodega";
        this.alertSwalError.show();
        this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
        })
      }
    );
    
  }
  
  getBodega(codigobodega: any) {
    this.codbodega = codigobodega
    console.log(this.codbodega);
    // if(this.codbodega === null || this.codbodega === ''){
    //   return;
    // } else{
      
    //   this.loading = true;
    //   const descripcion = null;
    
    //   this._buscabodegasService.listaEstructuraBodegas(this.hdgcodigo,this.cmecodigo, this.codbodega, descripcion,
    //   estadobodega,codtipoproducto,codigotipobodega, sessionStorage.getItem('Usuario'),this.servidor).subscribe(
    //     response => {
    //       this.loading = false;
    //       this.listaEstructuraBodegas = response; 
    //       this.listaEstructuraBodegasPaginacion = this.listaEstructuraBodegas.slice(0,8);
           
    //     }
    //   );
    // }
  }

  getProducto() {
    this.codprod = this.FormDatosProducto.controls.codigo.value;
    console.log(this.codprod);
    if(this.codprod === null || this.codprod === ''){
      this.addArticuloGrilla();
    } else{
      var tipodeproducto = 'MIM';
      this.loading = true;
      var controlado = '';
      var controlminimo = '';
      var idBodega = 0;
      var consignacion = '';
      
      this._BusquedaproductosService.BuscarArituculosFiltros(this.hdgcodigo, this.esacodigo,
        this.cmecodigo, this.codprod, null, null, null, null, tipodeproducto, idBodega, controlminimo, controlado, consignacion
        , this.usuario, this.servidor).subscribe(
          response => {
            if (response.length == 0) {
              console.log('no existe el codigo');
              this.loading = false;
              this.addArticuloGrilla();
            }
            else {
              if (response.length > 0) {
                this.loading = false;
                this.setArticulogrilla(response[0]);
                this.FormDatosProducto.reset();
                // this.logicaVacios()
              }
            }
          }, error => {
            this.loading = false;
            console.log('error');
          }
        );
    }
  }

  limpiarGrillaproducto() {
    this._bodega_productos_paginacion = [];
    this._bodega_productos = [];
  }


}
