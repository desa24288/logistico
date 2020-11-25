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

  public modelopermisos: Permisosusuario = new Permisosusuario();
  public FormCreaPlantilla: FormGroup;

  public ccostosolicitante: Array<UnidadesOrganizacionales> = [];

  public _PlantillaConsumo: PlantillaConsumo;
  public grabadetallePlantilla: Array<DetallePlantillaConsumo> = [];
  public arregloDetalleProductoPlantillaPaginacion: Array<DetallePlantillaConsumo> = [];
  public arregloDetalleProductoPlantilla: Array<DetallePlantillaConsumo> = [];
  public locale = 'es';
  public bsConfig: Partial<BsDatepickerConfig>;
  public colorTheme = 'theme-blue';
  public usuario = environment.privilegios.usuario;
  public servidor = environment.URLServiciosRest.ambiente;
  public elimininaproductogrilla: boolean = false;
  public existeplantilla: boolean = false;
  public hdgcodigo: number;
  public esacodigo: number;
  public cmecodigo: number;
  public _DetallePlantilla: DetallePlantillaConsumo;
  public productoselec: Articulos;
  private _BSModalRef: BsModalRef;

  onClose: any;
  bsModalRef: any;
  editField: any;

  constructor(
    private formBuilder: FormBuilder,
    public _BsModalService: BsModalService,
    public localeService: BsLocaleService,
    public datePipe: DatePipe,
    public _PlantillaConsumoService: SolicitudConsumoService,
    public _unidadesorganizacionaes: UnidadesOrganizacionalesService,
  ) {
    this.FormCreaPlantilla = this.formBuilder.group({
      id: [{ value: null, disabled: false }, Validators.required],
      estado: [{ value: null, disabled: false }, Validators.required],
      hdgcodigo: [{ value: null, disabled: false }, Validators.required],
      esacodigo: [{ value: null, disabled: false }, Validators.required],
      cmecodigo: [{ value: null, disabled: false }, Validators.required],
      prioridad: [{ value: null, disabled: false }, Validators.required],
      fecha: [{ value: new Date(), disabled: true }, Validators.required],
      centrocosto: [{ value: null, disabled: false }, Validators.required],
      referenciaerp: [{ value: null, disabled: true }, Validators.required],
      estadoerp: [{ value: null, disabled: true }, Validators.required],
      glosa: [{ value: null, disabled: false }, Validators.required],
    });
  }


  ngOnInit() {
    this.setDate();

    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());

    this.BuscaCentroCostoSolicitante();

  }


  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  BuscaCentroCostoSolicitante() {

    this._unidadesorganizacionaes.buscarCentroCosto("", 0, "CCOS", "", "", 0, this.cmecodigo, 0, 0, "S", this.usuario, this.servidor).subscribe(
      response => {
        this.ccostosolicitante = response;
      },
      error => {
        alert("Error al Buscar Bodegas de cargo");
      }
    );
  }


  async BuscarPlantillas() {
    this._BSModalRef = this._BsModalService.show(BusquedaPlantillaConsumoComponent, this.setModalBusquedaPlantilla());
    this._BSModalRef.content.onClose.subscribe((response: PlantillaConsumo) => {
      if (response == undefined) { }
      else {

        this._PlantillaConsumoService.buscarplantillaconsumo(response.id, this.hdgcodigo, this.esacodigo,
          this.cmecodigo, 0, 0, 0, 0, sessionStorage.getItem('Usuario'), this.servidor).subscribe(
            response_plantilla => {
              if (response_plantilla.length == 0) {

              } else {


                

                this._PlantillaConsumo = response_plantilla[0];

                this.FormCreaPlantilla.get('id').setValue(this._PlantillaConsumo.id);
                this.FormCreaPlantilla.get('glosa').setValue(this._PlantillaConsumo.glosa);
                this.FormCreaPlantilla.get('centrocosto').setValue(this._PlantillaConsumo.centrocosto);
                this.FormCreaPlantilla.get('estado').setValue(this._PlantillaConsumo.estado);
                this.FormCreaPlantilla.get('referenciaerp').setValue(this._PlantillaConsumo.referenciacontable);

                this.existeplantilla = true;

                this.arregloDetalleProductoPlantillaPaginacion = [];
                this.arregloDetalleProductoPlantilla = [];

                if (this._PlantillaConsumo.detplantillaconsumo != null) {
                  this.arregloDetalleProductoPlantilla = this._PlantillaConsumo.detplantillaconsumo;
                  this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 50);
                }


              }
            });





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
    const indx = this.arregloDetalleProductoPlantillaPaginacion.findIndex(x => x.codigoproducto === codigo, 1);
    if (indx >= 0) {
      return true;
    } else {
      return false;
    }
  }

  async addArticuloGrilla() {
    this._BSModalRef = this._BsModalService.show(BusquedaProductosConsumoComponent, this.setModalBusquedaProductos());
    this._BSModalRef.content.onClose.subscribe(async (response: ProductoConsumo) => {
      if (response == undefined) { }
      else {
        const codprod = response.prodcodigo;
        let codrepetido: any;
        codrepetido = this.validaCod(codprod);
        if (codrepetido === true) {
          return;
        } else {
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


          this.arregloDetalleProductoPlantilla.push(DetalleMovimiento);
          this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 50);


        }
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



  cambio_cantidad(id: number, property: string, registro: DetallePlantillaConsumo) {

    if (this.arregloDetalleProductoPlantillaPaginacion[id]["iddetalle"] == 0) {
      this.arregloDetalleProductoPlantillaPaginacion[id]["accion"] = "I";
    }
    if (this.arregloDetalleProductoPlantillaPaginacion[id]["iddetalle"] > 0) {
      this.arregloDetalleProductoPlantillaPaginacion[id]["accion"] = "M";
    }

    this.arregloDetalleProductoPlantilla[id][property] = this.arregloDetalleProductoPlantillaPaginacion[id][property];


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
      this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 50);
    } else {
      // elimina uno que ya existe
      registro.servidor = this.servidor;
      registro.usuario = this.usuario;
      this._PlantillaConsumoService.eliminardetallearticuloplantillaconsumo(registro).subscribe(
        response => {
          this._PlantillaConsumoService.buscarplantillaconsumo(registro.id, this.hdgcodigo, this.esacodigo, this.cmecodigo, 0, 0, 0, 0, this.usuario, this.servidor).subscribe(
            respuestaplantilla => {
              this._PlantillaConsumo = respuestaplantilla[0];
              this.FormCreaPlantilla.get('id').setValue(this._PlantillaConsumo.id);
              this.FormCreaPlantilla.get('centrocosto').setValue(this._PlantillaConsumo.centrocosto);
              this.FormCreaPlantilla.get('referenciaerp').setValue(this._PlantillaConsumo.referenciacontable);
              this.FormCreaPlantilla.get('glosa').setValue(this._PlantillaConsumo.glosa);


              this.arregloDetalleProductoPlantillaPaginacion = [];
              this.arregloDetalleProductoPlantilla = [];

              this.arregloDetalleProductoPlantilla = this._PlantillaConsumo.detplantillaconsumo;
              this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 50);
            },
            error => {
              console.log("Error :", error)
            }
          );
          this.alertSwal.title = "Plantilla Modificada:";
          this.alertSwal.show();


        },
        error => {
          console.log("Error :", error)
        }
      )

    }
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
        this.alertSwal.title = "Plantilla creada N°:".concat(response.id);
        this.alertSwal.show();

        this._PlantillaConsumoService.buscarplantillaconsumo(response.id, this.hdgcodigo, this.esacodigo, this.cmecodigo, 0, 0, 0, 0, this.usuario, this.servidor).subscribe(
          respuestaplantilla => {
            this._PlantillaConsumo = respuestaplantilla[0];
            this.FormCreaPlantilla.get('id').setValue(this._PlantillaConsumo.id);
            this.FormCreaPlantilla.get('centrocosto').setValue(this._PlantillaConsumo.centrocosto);
            this.FormCreaPlantilla.get('referenciaerp').setValue(this._PlantillaConsumo.referenciacontable);
            this.FormCreaPlantilla.get('glosa').setValue(this._PlantillaConsumo.glosa);


            this.arregloDetalleProductoPlantillaPaginacion = [];
            this.arregloDetalleProductoPlantilla = [];

            this.arregloDetalleProductoPlantilla = this._PlantillaConsumo.detplantillaconsumo;
            this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 50);
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

        this._PlantillaConsumoService.buscarplantillaconsumo(response.id, this.hdgcodigo, this.esacodigo, this.cmecodigo, 0, 0, 0, 0, this.usuario, this.servidor).subscribe(
          respuestaplantilla => {
            this._PlantillaConsumo = respuestaplantilla[0];
            this.FormCreaPlantilla.get('id').setValue(this._PlantillaConsumo.id);
            this.FormCreaPlantilla.get('centrocosto').setValue(this._PlantillaConsumo.centrocosto);
            this.FormCreaPlantilla.get('referenciaerp').setValue(this._PlantillaConsumo.referenciacontable);
            this.FormCreaPlantilla.get('glosa').setValue(this._PlantillaConsumo.glosa);


            this.arregloDetalleProductoPlantillaPaginacion = [];
            this.arregloDetalleProductoPlantilla = [];
            if (this._PlantillaConsumo.detplantillaconsumo != null) {
              this.arregloDetalleProductoPlantilla = this._PlantillaConsumo.detplantillaconsumo;
              this.arregloDetalleProductoPlantillaPaginacion = this.arregloDetalleProductoPlantilla.slice(0, 50);
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
        this.alertSwal.title = "Plantilla Eliminada N°:".concat(response.id);
        this.alertSwal.show();
        this.limpiar();

      },
      error => {
        this.alertSwal.title = "No fue posible eliminar la plantilla N°:".concat(this.FormCreaPlantilla.value.id);
        this.alertSwal.show();
        console.log("Error :", error)
      }
    );

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
    this.arregloDetalleProductoPlantilla = this.arregloDetalleProductoPlantillaPaginacion.slice(startItem, endItem);
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



}
