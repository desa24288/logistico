import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { environment } from '../../../environments/environment';

import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Articulos } from 'src/app/models/entity/mantencionarticulos';

import { SolicitudConsumoService } from 'src/app/servicios/solicitud-consumo.service';
import { UnidadesOrganizacionalesService } from 'src/app/servicios/unidades-organizacionales.service';

import { UnidadesOrganizacionales } from 'src/app/models/entity/unidades-organizacionales';
import { BusquedaProductosConsumoComponent } from '../busqueda-productos-consumo/busqueda-productos-consumo.component';
import { ProductoConsumo } from 'src/app/models/entity/producto-consumo';
import { DetallePlantillaConsumo } from 'src/app/models/entity/detalle-plantilla-consumo';
import { PlantillaConsumo } from 'src/app/models/entity/plantilla-consumo';
import { BusquedaPlantillaConsumoComponent } from '../busqueda-plantilla-consumo/busqueda-plantilla-consumo.component';
import { Permisosusuario } from '../../permisos/permisosusuario';
import { BusquedaproductosService } from 'src/app/servicios/busquedaproductos.service';
import { SolicitudService } from '../../servicios/Solicitudes.service';

import { BodegasService } from 'src/app/servicios/bodegas.service';

@Component({
  selector: 'app-plantilla-consumo',
  templateUrl: './plantilla-consumo.component.html',
  styleUrls: ['./plantilla-consumo.component.css']
})
export class PlantillaConsumoComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public modelopermisos   : Permisosusuario = new Permisosusuario();
  public FormCreaPlantilla: FormGroup;
  public FormDatosProducto: FormGroup;
  public ccostosolicitante: Array<UnidadesOrganizacionales> = [];

  public _PlantillaConsumo              : PlantillaConsumo;
  public grabadetallePlantilla          : Array<DetallePlantillaConsumo> = [];
  public arregloDetalleProductoPlantillaPaginacion: Array<DetallePlantillaConsumo> = [];
  public arregloDetalleProductoPlantilla: Array<DetallePlantillaConsumo> = [];
  public arregloDetalleProductoPlantillaPaginacion_aux: Array<DetallePlantillaConsumo> = [];
  public arregloDetalleProductoPlantilla_aux: Array<DetallePlantillaConsumo> = [];
  public arregloDetalleProductoPlantilla_2: Array<DetallePlantillaConsumo> = [];
  public locale                         = 'es';
  public bsConfig                       : Partial<BsDatepickerConfig>;
  public colorTheme                     = 'theme-blue';
  public usuario                        = environment.privilegios.usuario;
  public servidor                       = environment.URLServiciosRest.ambiente;
  public elimininaproductogrilla        : boolean = false;
  public existeplantilla                : boolean = false;
  public hdgcodigo                      : number;
  public esacodigo                      : number;
  public cmecodigo                      : number;
  public _DetallePlantilla              : DetallePlantillaConsumo;
  public productoselec                  : Articulos;
  private _BSModalRef                   : BsModalRef;
  public loading                        = false;
  public codprod                        = null;
  onClose                               : any;
  bsModalRef                            : any;
  editField                             : any;
  /** Usado para la funcion logicavacios() */
  public verificanull                   = false;
  public vacios                         = true;
  public vacioscabecera                 = true;
  public desactivabtnelim               : boolean = false;
  public lengthdetalle                  : number;
  public vaciosprod                     : boolean = true;
  public ActivaBotonLimpiaBusca         : boolean = false;
  public ActivaBotonBuscaGrilla         : boolean = false;

  constructor(
    private formBuilder             : FormBuilder,
    public _BsModalService          : BsModalService,
    public localeService            : BsLocaleService,
    public datePipe                 : DatePipe,
    public _PlantillaConsumoService : SolicitudConsumoService,
    public _unidadesorganizacionaes : UnidadesOrganizacionalesService,
    public _BusquedaproductosService: BusquedaproductosService,
    public _SolicitudConsumoService : SolicitudConsumoService,
    public _solicitudService        : SolicitudService,
  ) {
    this.FormCreaPlantilla = this.formBuilder.group({
      id            : [{ value: null, disabled: false }, Validators.required],
      estado        : [{ value: 1, disabled: false }, Validators.required],
      hdgcodigo     : [{ value: null, disabled: false }, Validators.required],
      esacodigo     : [{ value: null, disabled: false }, Validators.required],
      cmecodigo     : [{ value: null, disabled: false }, Validators.required],
      prioridad     : [{ value: null, disabled: false }, Validators.required],
      fecha         : [{ value: new Date(), disabled: true }, Validators.required],
      centrocosto   : [{ value: null, disabled: false }, Validators.required],
      referenciaerp : [{ value: null, disabled: true }, Validators.required],
      estadoerp     : [{ value: null, disabled: true }, Validators.required],
      glosa         : [{ value: null, disabled: false }, Validators.required],
    });

    this.FormDatosProducto = this.formBuilder.group({
      codigo  : [{ value: null, disabled: false }, Validators.required],
      cantidad: [{ value: null, disabled: false }, Validators.required]
    });
  }


  ngOnInit() {
    this.setDate();

    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();
    this.FormCreaPlantilla.controls.id.disable();

    this.BuscaCentroCostoSolicitante();

  }


  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  BuscaCentroCostoSolicitante() {

    this._unidadesorganizacionaes.buscarCentroCosto("", 0, "CCOS", "", "", 0, this.cmecodigo, 0, 0, "S", this.usuario, null, this.servidor).subscribe(
      response => {
        if (response != null) {
          this.ccostosolicitante = response;
        }
      },
      error => {
        alert("Error al Cargar Centros de Costos");
      }
    );
  }


  async BuscarPlantillas() {
    this._BSModalRef = this._BsModalService.show(BusquedaPlantillaConsumoComponent, this.setModalBusquedaPlantilla());
    this._BSModalRef.content.onClose.subscribe((response: PlantillaConsumo) => {
      if (response == undefined) { }
      else {

        this._PlantillaConsumoService.buscarplantillaconsumo(response.id, this.hdgcodigo, this.esacodigo,
          this.cmecodigo, 0, 0, 0, 0, sessionStorage.getItem('Usuario'), this.servidor,'').subscribe(
            response_plantilla => {
              if (response_plantilla.length == 0) {

              } else {

                this._PlantillaConsumo = response_plantilla[0];
                console.log("plantilla buscada",this._PlantillaConsumo)
                this.FormCreaPlantilla.get('id').setValue(this._PlantillaConsumo.id);
                this.FormCreaPlantilla.get('glosa').setValue(this._PlantillaConsumo.glosa);
                this.FormCreaPlantilla.get('centrocosto').setValue(this._PlantillaConsumo.centrocosto);
                this.FormCreaPlantilla.get('estado').setValue(this._PlantillaConsumo.estado);
                this.FormCreaPlantilla.get('referenciaerp').setValue(this._PlantillaConsumo.referenciacontable);

                // this.FormCreaPlantilla.controls.glosa.disable();
                // this.FormCreaPlantilla.controls.centrocosto.disable();

                this.existeplantilla = true;
                this.verificanull = true;
                this.ActivaBotonBuscaGrilla = true;
                this.arregloDetalleProductoPlantillaPaginacion = [];
                this.arregloDetalleProductoPlantilla = [];
                this._PlantillaConsumo.detplantillaconsumo.forEach(element=>{
                  element.bloqcampogrilla = true;
                })


                if (this._PlantillaConsumo.detplantillaconsumo != null) {
                  this.arregloDetalleProductoPlantilla = this._PlantillaConsumo.detplantillaconsumo;
                  this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 20);

                  this.arregloDetalleProductoPlantilla_aux = this.arregloDetalleProductoPlantilla;
                  this.arregloDetalleProductoPlantillaPaginacion_aux = this.arregloDetalleProductoPlantillaPaginacion
                }
                this.lengthdetalle = this.arregloDetalleProductoPlantilla.length;
                this.logicaVacios();

              }
            }
            );
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

  validaCod(codigo: string) {
    /*Devuelve False si el codigo ah agregar ya existe en array arregloDetalleProductoPlantillaPaginacion//@MLobos*/
    const indx = this.arregloDetalleProductoPlantilla.findIndex(x => x.codigoproducto === codigo, 1);
    if (indx >= 0) {
      return true;
    } else {
      return false;
    }
  }

  addArticuloGrilla() {
    this.alertSwalError.title = null;
    this._BSModalRef = this._BsModalService.show(BusquedaProductosConsumoComponent, this.setModalBusquedaProductos());
    this._BSModalRef.content.onClose.subscribe(async (response: ProductoConsumo) => {
      if (response == undefined) { }
      else {
        this.codprod = response.prodcodigo;
        let codrepetido: any;
        codrepetido = this.validaCod(this.codprod);
        if (codrepetido === true) {
          this.alertSwalError.title = "Código ya existe en la grilla";
          this.alertSwalError.show();
          // return;
        } else {

          const DetalleMovimiento = new (DetallePlantillaConsumo);
          if (this.FormCreaPlantilla.value.id == null) {
            DetalleMovimiento.id = 0;
          } else {
            DetalleMovimiento.id = this.FormCreaPlantilla.value.id;
          }
          this.ActivaBotonBuscaGrilla = true;
          DetalleMovimiento.iddetalle = 0;
          DetalleMovimiento.servidor = this.servidor;
          DetalleMovimiento.usuario = this.usuario;
          DetalleMovimiento.centrocosto = this.FormCreaPlantilla.value.ccosto;
          DetalleMovimiento.codigoproducto = response.prodcodigo;
          DetalleMovimiento.cantidadsolicitada = 0;
          DetalleMovimiento.referenciacontable = 0;
          DetalleMovimiento.operacioncontable = 0;
          DetalleMovimiento.estado = 0;
          DetalleMovimiento.servidor = this.servidor;
          DetalleMovimiento.accion = "I";
          DetalleMovimiento.glosaproducto = response.proddescripcion;
          DetalleMovimiento.glosaunidadconsumo = response.glosaunidadconsumo;
          DetalleMovimiento.idproducto = response.prodid;
          DetalleMovimiento.bloqcampogrilla = true;


          this.arregloDetalleProductoPlantilla.push(DetalleMovimiento);
          this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 20);


          this.arregloDetalleProductoPlantilla_aux = this.arregloDetalleProductoPlantilla;
          this.arregloDetalleProductoPlantillaPaginacion_aux = this.arregloDetalleProductoPlantillaPaginacion;
          this.FormDatosProducto.reset();
        }
        this.logicaVacios();
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
        codprod: this.FormDatosProducto.controls.codigo.value

      }
    };
    return dtModal;
  }

  cambio_cantidad(id: number, property: string, registro: DetallePlantillaConsumo) {
    this.alertSwalAlert.title = null;
    this.alertSwalAlert.text = null;
    if(registro.cantidadsolicitada <0){
      this.alertSwalAlert.title= "Debe ingresar valores mayores a 0";
      this.alertSwalAlert.show();
      registro.cantidadsolicitada = 0;

      if (this.arregloDetalleProductoPlantillaPaginacion[id]["iddetalle"] == 0) {
        this.arregloDetalleProductoPlantillaPaginacion[id]["accion"] = "I";
      }
      if (this.arregloDetalleProductoPlantillaPaginacion[id]["iddetalle"] > 0) {
        this.arregloDetalleProductoPlantillaPaginacion[id]["accion"] = "M";
      }

      this.arregloDetalleProductoPlantilla[id][property] = this.arregloDetalleProductoPlantillaPaginacion[id][property];
    }else{
      if(registro.cantidadsolicitada ===0){
        this.alertSwalAlert.title= "Debe ingresar valores mayores a 0";
        this.alertSwalAlert.text = "No puede dejar valores en 0";
        this.alertSwalAlert.show();
        registro.cantidadsolicitada = 0;

        if (this.arregloDetalleProductoPlantillaPaginacion[id]["iddetalle"] == 0) {
          this.arregloDetalleProductoPlantillaPaginacion[id]["accion"] = "I";
        }
        if (this.arregloDetalleProductoPlantillaPaginacion[id]["iddetalle"] > 0) {
          this.arregloDetalleProductoPlantillaPaginacion[id]["accion"] = "M";
        }

        this.arregloDetalleProductoPlantilla[id][property] = this.arregloDetalleProductoPlantillaPaginacion[id][property];
      }else{
        if(registro.cantidadsolicitada >0){
          if (this.arregloDetalleProductoPlantillaPaginacion[id]["iddetalle"] == 0) {
            this.arregloDetalleProductoPlantillaPaginacion[id]["accion"] = "I";
          }
          if (this.arregloDetalleProductoPlantillaPaginacion[id]["iddetalle"] > 0) {
            this.arregloDetalleProductoPlantillaPaginacion[id]["accion"] = "M";
          }
        }
      }
    }
  }

  /**
   * @mod verifica accion y vacios en reemplazo de funct cambio_cantidad
   * @autor miguel.lobos@
   * @fecha 16-03-2021
   */
  async setCantidad(id: number, property: string, registro: DetallePlantillaConsumo) {
    this.alertSwalAlert.title = null;
    this.alertSwalAlert.text = null;
    if(registro.cantidadsolicitada <= 0){
      this.alertSwalAlert.title= "Debe ingresar valores mayores a 0";
      this.alertSwalAlert.text = "No puede dejar valores en 0";
      this.alertSwalAlert.show();
      registro.cantidadsolicitada = 0;
      if (this.arregloDetalleProductoPlantillaPaginacion[id]["iddetalle"] == 0) {
        this.arregloDetalleProductoPlantillaPaginacion[id]["accion"] = "I";
      }
      if (this.arregloDetalleProductoPlantillaPaginacion[id]["iddetalle"] > 0) {
        this.arregloDetalleProductoPlantillaPaginacion[id]["accion"] = "M";
      }
      this.arregloDetalleProductoPlantilla[id][property] = this.arregloDetalleProductoPlantillaPaginacion[id][property];
    }else{
      if(registro.cantidadsolicitada >0){
        if (this.arregloDetalleProductoPlantillaPaginacion[id]["iddetalle"] == 0) {
          this.arregloDetalleProductoPlantillaPaginacion[id]["accion"] = "I";
        }
        if (this.arregloDetalleProductoPlantillaPaginacion[id]["iddetalle"] > 0) {
          this.arregloDetalleProductoPlantillaPaginacion[id]["accion"] = "M";
        }
      }
    }
    await this.logicaVacios();
  }

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;

    this.arregloDetalleProductoPlantillaPaginacion[id][property] = parseInt(editField);
    this.arregloDetalleProductoPlantilla[id][property] = this.arregloDetalleProductoPlantillaPaginacion[id][property]

  }

  limpiar() {
    this.FormCreaPlantilla.reset();
    this.arregloDetalleProductoPlantillaPaginacion = [];
    this.arregloDetalleProductoPlantilla = [];
    this.existeplantilla = false;
    this.codprod = null;
    this.FormDatosProducto.reset();
    this.FormCreaPlantilla.get('estado').setValue(1);
    this.desactivabtnelim = false;
    this.ActivaBotonLimpiaBusca = false;
    this.ActivaBotonBuscaGrilla = false;
    this.ActivarBotonModificar();
    // this.FormCreaPlantilla.controls.glosa.enable();
    // this.FormCreaPlantilla.controls.centrocosto.enable();
  }

  ConfirmaEliminaProductoDeLaGrilla(registro: DetallePlantillaConsumo, id: number) {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirme eliminación de producto de la plantilla ?',
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

  EliminaProductoDeLaGrilla(registro: DetallePlantillaConsumo, id: number) {
    if (registro.accion == "I") {
      // Eliminar registro nuevo la grilla
      this.arregloDetalleProductoPlantilla.splice(id, 1);
      this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 20);
    } else {
      // elimina uno que ya existe
      registro.servidor = this.servidor;
      registro.usuario = this.usuario;
      this._PlantillaConsumoService.eliminardetallearticuloplantillaconsumo(registro).subscribe(
        response => {
          if (response != null) {
            this._PlantillaConsumoService.buscarplantillaconsumo(registro.id, this.hdgcodigo,
              this.esacodigo, this.cmecodigo, 0, 0, 0, 0, this.usuario, this.servidor,'').subscribe(
              respuestaplantilla => {
                this._PlantillaConsumo = respuestaplantilla[0];
                this.FormCreaPlantilla.get('id').setValue(this._PlantillaConsumo.id);
                this.FormCreaPlantilla.get('centrocosto').setValue(this._PlantillaConsumo.centrocosto);
                this.FormCreaPlantilla.get('referenciaerp').setValue(this._PlantillaConsumo.referenciacontable);
                this.FormCreaPlantilla.get('glosa').setValue(this._PlantillaConsumo.glosa);

                this.arregloDetalleProductoPlantillaPaginacion = [];
                this.arregloDetalleProductoPlantilla = [];
                this.arregloDetalleProductoPlantilla = this._PlantillaConsumo.detplantillaconsumo;
                this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 20);
              },error => { });
            this.alertSwal.title = "Plantilla Modificada:";
            this.alertSwal.show();
          }
        },
        error => {
        }
      )

    }
    this.logicaVacios();
  }

  ConfirmaGenerarPlantilla() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Genera plantilla ?',
      text: "Confirmar la creación de la Plantilla",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.generarPlantilla();
      }
    })
  }

  generarPlantilla() {
    this.alertSwalAlert.text = null;
      this._PlantillaConsumo = new PlantillaConsumo();
      this._PlantillaConsumo.id = 0;
      this._PlantillaConsumo.glosa = this.FormCreaPlantilla.value.glosa;
      this._PlantillaConsumo.hdgcodigo = this.hdgcodigo;
      this._PlantillaConsumo.esacodigo = this.esacodigo;
      this._PlantillaConsumo.cmecodigo = this.cmecodigo;
      this._PlantillaConsumo.centrocosto = this.FormCreaPlantilla.value.centrocosto;
      this._PlantillaConsumo.idpresupuesto = 0;
      this._PlantillaConsumo.referenciacontable = 0;
      this._PlantillaConsumo.operacioncontable = 0;
      this._PlantillaConsumo.estado = Number(this.FormCreaPlantilla.value.estado);
      this._PlantillaConsumo.accion = "I";
      this._PlantillaConsumo.usuario = this.usuario;
      this._PlantillaConsumo.servidor = this.servidor;

      this._PlantillaConsumo.detplantillaconsumo = this.arregloDetalleProductoPlantilla;

      this._PlantillaConsumoService.grabarplantillaconsumo(this._PlantillaConsumo).subscribe(
      response => {
        if (response != null) {
          this.alertSwal.title = "Plantilla creada N°:".concat(response.id);
          this.alertSwal.show();
          this._PlantillaConsumoService.buscarplantillaconsumo(response.id, this.hdgcodigo,
            this.esacodigo, this.cmecodigo, 0, 0, 0, 0, this.usuario, this.servidor,'').subscribe(
            respuestaplantilla => {
              this._PlantillaConsumo = respuestaplantilla[0];
              this.FormCreaPlantilla.get('id').setValue(this._PlantillaConsumo.id);
              this.FormCreaPlantilla.get('centrocosto').setValue(this._PlantillaConsumo.centrocosto);
              this.FormCreaPlantilla.get('referenciaerp').setValue(this._PlantillaConsumo.referenciacontable);
              this.FormCreaPlantilla.get('glosa').setValue(this._PlantillaConsumo.glosa);
              this._PlantillaConsumo.detplantillaconsumo.forEach(x=>{
                x.bloqcampogrilla = true;
              });

              this.arregloDetalleProductoPlantillaPaginacion = [];
              this.arregloDetalleProductoPlantilla = [];
              this.arregloDetalleProductoPlantilla = this._PlantillaConsumo.detplantillaconsumo;
              this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 20);
            });
          }
      },
      error => {
        this.alertSwalError.title = "Error al generar solictud";
        this.alertSwalError.show();
      });
  }

  ConfirmaModificarPlantilla() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Desea modificar la plantills de Consumo ?',
      text: "Confirmar modificación de plantilla",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.ModificarPlantilla("M");
      }
    })
  }

  ModificarPlantilla(Accion: String) {
    /* Si se modifica _Solictud ya contiene la información original */
    /* vienen seteadas en el ambiente */
    var fechaactual = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    /* Sólo se setean los valores posoble de actualizar de la cabecera */

    this._PlantillaConsumo.estado = Number(this.FormCreaPlantilla.value.estado);
    this._PlantillaConsumo.glosa = this.FormCreaPlantilla.value.glosa;
    this._PlantillaConsumo.centrocosto = this.FormCreaPlantilla.value.centrocosto;
    this._PlantillaConsumo.servidor = this.servidor
    this._PlantillaConsumo.usuario = this.usuario;

    if (Accion == 'M') {
      this._PlantillaConsumo.accion = "M";
    }

    /* Detalle de solicitu, solo viaja la modificada y eliminada */
    this.grabadetallePlantilla = [];

    this.arregloDetalleProductoPlantilla.forEach(element => {
      var _DetallePlantilla = new DetallePlantillaConsumo;

      _DetallePlantilla = element;

      if (element.accion == 'M') {
        _DetallePlantilla.glosaproducto = element.glosaproducto;
        _DetallePlantilla.idproducto = element.idproducto;
        _DetallePlantilla.codigoproducto = element.codigoproducto;
        _DetallePlantilla.accion = 'M';
        _DetallePlantilla.cantidadsolicitada = element.cantidadsolicitada;
        this.grabadetallePlantilla.push(_DetallePlantilla);
      }


      if (element.accion == 'I') {
        _DetallePlantilla.glosaproducto = element.glosaproducto;
        _DetallePlantilla.idproducto = element.idproducto;
        _DetallePlantilla.codigoproducto = element.codigoproducto;
        _DetallePlantilla.accion = 'I';
        _DetallePlantilla.cantidadsolicitada = element.cantidadsolicitada;
        this.grabadetallePlantilla.push(_DetallePlantilla);
      }


    });

    this._PlantillaConsumo.detplantillaconsumo = this.grabadetallePlantilla;

    this._PlantillaConsumoService.grabarplantillaconsumo(this._PlantillaConsumo).subscribe(
      response => {
        this.alertSwal.title = "Plantilla Modificada N°:".concat(response.id);
        this.alertSwal.show();
        this._PlantillaConsumoService.buscarplantillaconsumo(response.id, this.hdgcodigo,
          this.esacodigo, this.cmecodigo, 0, 0, 0, 0, this.usuario, this.servidor,'').subscribe(
          respuestaplantilla => {
            if (response != null) {
              this._PlantillaConsumo = respuestaplantilla[0];
              this.FormCreaPlantilla.get('id').setValue(this._PlantillaConsumo.id);
              this.FormCreaPlantilla.get('centrocosto').setValue(this._PlantillaConsumo.centrocosto);
              this.FormCreaPlantilla.get('referenciaerp').setValue(this._PlantillaConsumo.referenciacontable);
              this.FormCreaPlantilla.get('glosa').setValue(this._PlantillaConsumo.glosa);
              this.verificanull = true;
              this._PlantillaConsumo.detplantillaconsumo.forEach(x=>{
                x.bloqcampogrilla = true;
              });
              this.arregloDetalleProductoPlantillaPaginacion = [];
              this.arregloDetalleProductoPlantilla = [];
              if (this._PlantillaConsumo.detplantillaconsumo != null) {
                this.arregloDetalleProductoPlantilla = this._PlantillaConsumo.detplantillaconsumo;
                this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 20);
              }
            }
          }
        );
      },error => {
        this.alertSwalError.title = "Error al generar solictud";
        this.alertSwalError.show();
      });
  }



  ConfirmaEliminarPlantilla() {
    // sE CONFIRMA Eliminar Plantilla
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Desea Eliminar la Plantilla ?',
      text: "Confirmar eliminación de plantilla",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.EliminarPlantilla();
      }
    })
  }

  EliminarPlantilla() {

    this._PlantillaConsumo = new (PlantillaConsumo);
    this._PlantillaConsumo.usuario = this.usuario;
    this._PlantillaConsumo.servidor = this.servidor;
    this._PlantillaConsumo.id = this.FormCreaPlantilla.value.id;

    this._PlantillaConsumoService.eliminarplantillaconsumo(this._PlantillaConsumo).subscribe(
      response => {
        if (response != null) {
          this.alertSwal.title = "Plantilla Eliminada N°:".concat(response.id);
          this.alertSwal.show();
          this.limpiar();
        }
      },error => {
        this.alertSwal.title = "No fue posible eliminar la plantilla N°:".concat(this.FormCreaPlantilla.value.id);
        this.alertSwal.show();
      });

  }


  setModalMensajeExitoEliminar(numerotransaccion: number, titulo: string, mensaje: string) {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-m',
      initialState: {
        titulo: titulo, // Parametro para de la otra pantalla
        mensaje: mensaje,
        informacion: 'La plantilla eliminada es:',
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
        titulo: 'Eliminar Plantilla', // Parametro para de la otra pantalla
        mensaje: 'Plantilla no pudo ser eliminada',
        informacion: 'Intente nuevamente',
        estado: 'CANCELADO',
      }
    };
    return dtModal;
  }

  getHdgcodigo(event: any) {
    this.hdgcodigo = event.hdgcodigo;

  }
  getEsacodigo(event: any) {
    this.esacodigo = event.esacodigo;
  }

  getCmecodigo(event: any) {
    this.cmecodigo = event.cmecodigo;
  }

  /* Función búsqueda con paginación */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(startItem, endItem);
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  onImprimir() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Plantilla ?',
      text: "Confirmar Impresión",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.ImprimirPlantilla();
      }
    })

  }

  ImprimirPlantilla() {
  }

  getProducto() {
    this.codprod = this.FormDatosProducto.controls.codigo.value;
    this.alertSwalAlert.title = null;

    if (this.codprod === null || this.codprod === '') {
      this.addArticuloGrilla();

    } else {
      this.loading = true;
      const tipodeproducto = 'MIM';
      const controlado = '';
      const controlminimo = '';
      const idBodega = 0;
      const consignacion = '';
      this._SolicitudConsumoService.buscarproductosconsumo(0,  this.hdgcodigo, 0,0,this.codprod,null,0,0, this.usuario, this.servidor
        ).subscribe(
          response => {
            if (response != null) {
              if (!response.length) {
                this.loading = false;
              } else {
                if (response.length) {
                  if(response.length>1){
                    this.addArticuloGrilla();
                  }else{
                    if(response.length == 1){
                      const indx = this.arregloDetalleProductoPlantilla.findIndex(x => x.codigoproducto === response[0].prodcodigo, 1);
                      if (indx >= 0) {
                        this.alertSwalError.title = "Código ya existe en la grilla";
                        this.alertSwalError.show();
                      }else{
                        this.ActivaBotonBuscaGrilla = true
                        const DetalleMovimiento = new (DetallePlantillaConsumo);
                        if (this.FormCreaPlantilla.value.id == null) {
                          DetalleMovimiento.id = 0;
                        } else {
                          DetalleMovimiento.id = this.FormCreaPlantilla.value.id;
                        }

                        DetalleMovimiento.iddetalle = 0;
                        DetalleMovimiento.servidor = this.servidor;
                        DetalleMovimiento.usuario = this.usuario;
                        DetalleMovimiento.centrocosto = this.FormCreaPlantilla.value.ccosto;
                        DetalleMovimiento.codigoproducto = response[0].prodcodigo;
                        DetalleMovimiento.cantidadsolicitada = 0;
                        DetalleMovimiento.referenciacontable = 0;
                        DetalleMovimiento.operacioncontable = 0;
                        DetalleMovimiento.estado = 0;
                        DetalleMovimiento.servidor = this.servidor;
                        DetalleMovimiento.accion = "I";
                        DetalleMovimiento.glosaproducto = response[0].proddescripcion;
                        DetalleMovimiento.glosaunidadconsumo = response[0].glosaunidadconsumo;
                        DetalleMovimiento.idproducto = response[0].prodid;
                        DetalleMovimiento.bloqcampogrilla = true;

                        this.arregloDetalleProductoPlantilla.unshift(DetalleMovimiento);
                        this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 20);

                        this.arregloDetalleProductoPlantilla_aux = this.arregloDetalleProductoPlantilla;
                        this.arregloDetalleProductoPlantillaPaginacion_aux = this.arregloDetalleProductoPlantillaPaginacion;
                        this.FormDatosProducto.reset();

                        this.logicaVacios();
                      }
                    }
                  }
                }
              }
            } else {
              this.loading = false;
            }
          },
          error => {
            this.loading = false;
            this.alertSwalError.title = "Error: ";
            this.alertSwalError.text = error.message;
            this.alertSwalError.show();
          }
        );

    }
  }

  /**
   * valida si hay campos vacios grilla desactiva btn modificar
   * @miguel.lobos
   * 11-03-2021
  */
  async logicaVacios() {
    // this.vaciosProductos();
    await this.nuevoProducto();
    await this.CambiosCabecera();
    console.log("this.vaciosprod:",this.vaciosprod, "this.vacioscabecera:",this.vacioscabecera)
    if (this.vaciosprod === true && this.vacioscabecera === true) {
      this.verificanull = false;
    }
    else {
      // if(this.vacios === false && this.vaciosprod === true){
      //   this.verificanull = false;
      // }else{
        this.verificanull = true;
      // }
    }
    // this.validaExcede();
  }

  vaciosProductos() {
    if (this.arregloDetalleProductoPlantillaPaginacion.length) {
      for (var data of this.arregloDetalleProductoPlantillaPaginacion) {
        if (data.cantidadsolicitada <= 0 || data.cantidadsolicitada === null) {
          this.vacios = true;
          return;
        } else {
          this.vacios = false;
        }
      }
    }else{
      this.vacios = true;
    }
  }

  nuevoProducto(){
    console.log("this.arregloDetalleProductoPlantilla.length != this.lengthdetalle",
    this.arregloDetalleProductoPlantilla.length,this.lengthdetalle)
    if(this.arregloDetalleProductoPlantilla.length != this.lengthdetalle){
      this.vaciosprod = false;
      console.log("distintos",this.vaciosprod)
    }else{
      this.vaciosprod = true;
      console.log("iguales",this.vaciosprod)
    }
  }

  CambiosCabecera(){
    console.log("valida datos de la cabcera",this._PlantillaConsumo)

    if(this._PlantillaConsumo != undefined){
      if(this._PlantillaConsumo.estado != this.FormCreaPlantilla.controls.estado.value ||
        this._PlantillaConsumo.glosa != this.FormCreaPlantilla.controls.glosa.value ||
        this._PlantillaConsumo.centrocosto != this.FormCreaPlantilla.controls.centrocosto.value){
        console.log("valor diferente del estado o glosa o centro costo")
        this.vacioscabecera = false;
      }else{
        this.vacioscabecera = true;
      }
    }else{
      if(this.FormCreaPlantilla.controls.estado.value != null ||
        this.FormCreaPlantilla.controls.glosa.value != null ||
        this.FormCreaPlantilla.controls.centrocosto.value != null){
          this.vacioscabecera = false;
        }
    }

  }

  validaExcede() {
    if (this.arregloDetalleProductoPlantillaPaginacion.length) {
      for (var data of this.arregloDetalleProductoPlantillaPaginacion) {
        if(data.cantidadsolicitada >= 100){
          if(!data.excedecant) {
            this.alertSwalAlert.title = 'Esta ingresando cantidad de mas de 3 digitos';
            this.alertSwalAlert.show();
          }
          data.excedecant = true;
        } else {
          data.excedecant = false;
        }
      }
    }
  }

  async CambioCheck(registro: DetallePlantillaConsumo,id:number,event:any,marcacheckgrilla: boolean){
    // console.log("Selecciona el check",id,event,marcacheckgrilla,registro)
    if(event.target.checked){
      registro.marcacheckgrilla = true;
      this.desactivabtnelim = true;
      await this.isEliminaInsGrilla(registro)
      await this.arregloDetalleProductoPlantilla.forEach(d=>{
        if(d.marcacheckgrilla === true){
          this.desactivabtnelim = true;
          // console.log("recorre la grilla para ver si hay check",d.marcacheckgrilla,this.desactivabtnelim)
        }
      })

    }else{
      registro.marcacheckgrilla = false;
      this.desactivabtnelim = false;
      await this.isEliminaInsGrilla(registro);
      await this.arregloDetalleProductoPlantilla.forEach(d=>{
        if(d.marcacheckgrilla === true){
          this.desactivabtnelim = true;
          // console.log("recorre la grilla para ver si NO hay check",d.marcacheckgrilla,this.desactivabtnelim)
        }
      })

    }
    // console.log("chec modificado",registro)
  }

  isEliminaInsGrilla(registro: DetallePlantillaConsumo) {
    // console.log("entra a iseeliminagrilla",registro)
    let indice = 0;
    for (const articulo of this.arregloDetalleProductoPlantilla) {
      if (registro.codigoproducto === articulo.codigoproducto && registro.iddetalle === articulo.iddetalle) {
        articulo.marcacheckgrilla = registro.marcacheckgrilla;
        // if(articulo.marcacheckgrilla=== true){
        //   this.desactivabtnelim = true;
        // }else{
        //   if(articulo.marcacheckgrilla=== false){
        //     this.desactivabtnelim = false;
        //   }
        // }
        return indice;
      }
      indice++;
    }
    return -1;
  }

  ConfirmaEliminaProductoDeLaGrilla2() {

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
        this.EliminaProductoDeLaGrilla2();
      }
    })
  }

  EliminaProductoDeLaGrilla2() {

    // console.log("id,registro",this.arregloDetalleProductoPlantilla,this.arregloDetalleProductoPlantillaPaginacion)
    this.arregloDetalleProductoPlantillaPaginacion.forEach(dat=>{

      if (dat.accion === "I"  && dat.iddetalle === 0) {
        if(dat.marcacheckgrilla ===true){

          if(this.isEliminaMed(dat)<0){

          }else{

            this.desactivabtnelim = false;
            // console.log("elimina de la grilla",this.desactivabtnelim,this.isEliminaMed(dat), dat)
            this.arregloDetalleProductoPlantilla.splice(this.isEliminaMed(dat), 1);
            this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 20);

            this.arregloDetalleProductoPlantilla_aux = this.arregloDetalleProductoPlantilla;
            this.arregloDetalleProductoPlantillaPaginacion_aux = this.arregloDetalleProductoPlantillaPaginacion;
          }
        }else{
          // console.log("marcacheckgrilla es falso por lo que no elimina",dat.marcacheckgrilla)
        }

      }else{

        if(dat.marcacheckgrilla == true){
          // console.log("eliminará este check",dat);
          this._PlantillaConsumoService.eliminardetallearticuloplantillaconsumo(dat).subscribe(
            response => {
              this._PlantillaConsumoService.buscarplantillaconsumo(dat.id, this.hdgcodigo, this.esacodigo,
                 this.cmecodigo, 0, 0, 0, 0, this.usuario, this.servidor,'').subscribe(
                respuestaplantilla => {
                  this._PlantillaConsumo = respuestaplantilla[0];
                  this.FormCreaPlantilla.get('id').setValue(this._PlantillaConsumo.id);
                  this.FormCreaPlantilla.get('centrocosto').setValue(this._PlantillaConsumo.centrocosto);
                  this.FormCreaPlantilla.get('referenciaerp').setValue(this._PlantillaConsumo.referenciacontable);
                  this.FormCreaPlantilla.get('glosa').setValue(this._PlantillaConsumo.glosa);

                  this.verificanull = true;
                  this.desactivabtnelim = false;
                  this.arregloDetalleProductoPlantillaPaginacion = [];
                  this.arregloDetalleProductoPlantilla = [];

                  this.arregloDetalleProductoPlantilla = this._PlantillaConsumo.detplantillaconsumo;
                  this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 20);

                  this.arregloDetalleProductoPlantilla_aux = this.arregloDetalleProductoPlantilla;
                  this.arregloDetalleProductoPlantillaPaginacion_aux = this.arregloDetalleProductoPlantillaPaginacion;
                  this._PlantillaConsumo.detplantillaconsumo.forEach(x=>{
                    x.bloqcampogrilla = true;
                  })
                },
                error => {
                }
              );
              this.alertSwal.title = "Plantilla Modificada:";
              this.alertSwal.show();


            },
            error => {
            }
          )
        }




      }
    })
    this.logicaVacios();
  }

  isEliminaMed(registro: DetallePlantillaConsumo) {

    let indice = 0;
    for (const articulo of this.arregloDetalleProductoPlantilla) {
      if (registro.codigoproducto === articulo.codigoproducto) {
        // console.log("registro,codmei",articulo,indice)
        return indice;
      }
      indice++;
    }
    return -1;
  }

  // ActivaBotonBuscaGrilla() {
  //   if ( this.FormCreaPlantilla.value.glosa != null
  //     && this.FormCreaPlantilla.value.centrocosto != null
  //     // && this.FormCreaPlantilla.value.tipobodega != null
  //   ) {
  //     return true
  //   }
  //   else {
  //     return false;
  //   }
  // }

  async findArticuloGrilla() {
    this.loading = true;
    // console.log('this.FormDatosProducto.controls.codigo.value : ' , this.FormDatosProducto.controls.codigo);
    if ( this.FormDatosProducto.controls.codigo.touched &&
        this.FormDatosProducto.controls.codigo.status !== 'INVALID') {
        var codProdAux = this.FormDatosProducto.controls.codigo.value.toString();
      if(this.FormCreaPlantilla.controls.id.value >0){

        this.arregloDetalleProductoPlantilla_2 = [];

        this.arregloDetalleProductoPlantilla.forEach(x=>{

          if (x.codigoproducto === codProdAux) {

            this.arregloDetalleProductoPlantilla_2.unshift(x); //this._PlantillaConsumo.detplantillaconsumo;

          }
        })
        this.ActivaBotonBuscaGrilla = true;
        this.ActivaBotonLimpiaBusca = true;

        this.arregloDetalleProductoPlantilla = [];
        this.arregloDetalleProductoPlantillaPaginacion = [];
        this.arregloDetalleProductoPlantilla = this.arregloDetalleProductoPlantilla_2;
        this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 20);


        this.arregloDetalleProductoPlantilla = [];
        this.arregloDetalleProductoPlantillaPaginacion = [];

            // console.log("prod a buscar en la grilla",codProdAux)
        this._PlantillaConsumoService.buscarplantillaconsumo(this._PlantillaConsumo.id, this.hdgcodigo, this.esacodigo,
          this.cmecodigo, 0, 0, 0, 0, sessionStorage.getItem('Usuario'), this.servidor, codProdAux).subscribe(
            response_plantilla => {
              if (response_plantilla.length == 0) {

              } else {
                // console.log("response_palantilla",response_plantilla)
                this._PlantillaConsumo = response_plantilla[0];

                this.FormCreaPlantilla.get('id').setValue(this._PlantillaConsumo.id);
                this.FormCreaPlantilla.get('glosa').setValue(this._PlantillaConsumo.glosa);
                this.FormCreaPlantilla.get('centrocosto').setValue(this._PlantillaConsumo.centrocosto);
                this.FormCreaPlantilla.get('estado').setValue(this._PlantillaConsumo.estado);
                this.FormCreaPlantilla.get('referenciaerp').setValue(this._PlantillaConsumo.referenciacontable);

                this.existeplantilla = true;
                this.verificanull = true;
                this.arregloDetalleProductoPlantillaPaginacion = [];
                this.arregloDetalleProductoPlantilla = [];
                this._PlantillaConsumo.detplantillaconsumo.forEach(element=>{
                  element.bloqcampogrilla = true;
                })

                if (this._PlantillaConsumo.detplantillaconsumo != null) {
                  this._PlantillaConsumo.detplantillaconsumo.forEach(x=>{

                    this.arregloDetalleProductoPlantilla.unshift(x); //this._PlantillaConsumo.detplantillaconsumo;
                    this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 20);
                  })

                }
                this.ActivaBotonLimpiaBusca = true;

              }
            }
          );
        this.loading = false;
        return;
      }else{ //Cuando la plantilla aún no se crea
        this.arregloDetalleProductoPlantilla_2 = [];
        if(this.FormCreaPlantilla.controls.id.value === null){

          this._solicitudService.BuscarProductoPorLike(this.hdgcodigo, this.esacodigo,
            this.cmecodigo,codProdAux,2,this.usuario,this.servidor,null,
            this.arregloDetalleProductoPlantilla,null,null,null).subscribe(response => {

              this.arregloDetalleProductoPlantilla_2 = response;

              this.arregloDetalleProductoPlantilla = [];
              this.arregloDetalleProductoPlantillaPaginacion = [];

              this.arregloDetalleProductoPlantilla = this.arregloDetalleProductoPlantilla_2;
              this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0,20);
              this.ActivaBotonLimpiaBusca = true;

            }
          )
          this.loading = true;
        }
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

    this.arregloDetalleProductoPlantilla = [];
    this.arregloDetalleProductoPlantillaPaginacion = [];


    // Llenar Array Auxiliares
    this.arregloDetalleProductoPlantilla = this.arregloDetalleProductoPlantilla_aux;
    this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantillaPaginacion_aux;
    this.ActivaBotonLimpiaBusca = false;

    this.loading = false;
  }

  ActivarBotonGuardar() {


    if (this.FormCreaPlantilla.get('id').value == null
      && this.FormCreaPlantilla.get('glosa').value != null
      && this.FormCreaPlantilla.get('centrocosto').value != null
      // && this.FormCreaPlantilla.get('bodcodigoentrega').value != null
      && this.arregloDetalleProductoPlantilla.length > 0
    ) {
      return true;

    } else {
      return false;
    }
  }

  ActivarBotonModificar() {
    // console.log("this._Plantilla.planvigente != this.FormPlantillaSolicitudBodega.controls.estado.value",
    // this._Plantilla.planvigente, this.FormPlantillaSolicitudBodega.controls.estado.value)
    if (this.FormCreaPlantilla.get('id').value != null  ) {
      // console.log(true,"hay plantilla, estados distintos")
      return true;

    } else {console.log(false)
      // console.log("no hay plantilla ")
      return false;

    }

  }

}
