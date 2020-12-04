import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BodegasService } from '../../servicios/bodegas.service';
import { BodegasTodas } from 'src/app/models/entity/BodegasTodas';
import { BodegasrelacionadaAccion } from 'src/app/models/entity/BodegasRelacionadas';
import { environment } from '../../../environments/environment';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { Articulos } from 'src/app/models/entity/mantencionarticulos';
import { BusquedaproductosComponent } from '../busquedaproductos/busquedaproductos.component';

import { BusquedaplantillasbodegaComponent } from '../busquedaplantillasbodega/busquedaplantillasbodega.component'
import { Plantillas } from 'src/app/models/entity/PlantillasBodegas';
import { DetallePlantillaBodega } from 'src/app/models/entity/DetallePlantillaBodega';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Router, ActivatedRoute } from '@angular/router';
import { EstructuraunidadesService } from 'src/app/servicios/estructuraunidades.service';
import { Servicio } from 'src/app/models/entity/Servicio';
import { Permisosusuario } from '../../permisos/permisosusuario';

@Component({
  selector: 'app-plantillassolicitudbodega',
  templateUrl: './plantillassolicitudbodega.component.html',
  styleUrls: ['./plantillassolicitudbodega.component.css']
})
export class PlantillassolicitudbodegaComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public modelopermisos: Permisosusuario = new Permisosusuario();
  public FormPlantillaSolicitudBodega: FormGroup;
  public bodegasSolicitantes: Array<BodegasTodas> = [];
  public bodegassuministro: Array<BodegasrelacionadaAccion> = [];
  public hdgcodigo: number;
  public esacodigo: number;
  public cmecodigo: number;
  public usuario = environment.privilegios.usuario;
  public servidor = environment.URLServiciosRest.ambiente;
  private _BSModalRef: BsModalRef;
  public detalleplantilla: Array<DetallePlantillaBodega> = [];
  public detalleplantillapaginacion: Array<DetallePlantillaBodega> = [];
  public _Plantilla: Plantillas;
  public bsConfig: Partial<BsDatepickerConfig>
  public grabadetalleplantilla: DetallePlantillaBodega[] = [];
  public _PageChangedEvent: PageChangedEvent;
  onClose: any;
  bsModalRef: any;
  editField: any;
  public productoselec: Articulos;
  public arregloservicios: Servicio[] = [];
  public tipoplantilla: boolean = true;
  public activabtncreaplant: boolean = false;
  public plantilla: number = 0;
  public titulo: string;
  public activabtnagregar: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public _BodegasService: BodegasService,
    public _BsModalService: BsModalService,
    public datePipe: DatePipe,
    private _bodegasService: BodegasService,
    private route: ActivatedRoute,
    private _unidadesService: EstructuraunidadesService,
    private router: Router,
  ) {

    this.FormPlantillaSolicitudBodega = this.formBuilder.group({
      numplantilla: [{ value: null, disabled: true }, Validators.required],
      descripcion: [{ value: null, disabled: false }, Validators.required],
      fechacreacion: [new Date(), Validators.required],
      bodcodigo: [{ value: null, disabled: false }, Validators.required],
      bodcodigoentrega: [{ value: null, disabled: false }, Validators.required],
      estado: [{ value: null, disabled: false }, Validators.required],
      serviciocod: [{ value: null, disabled: false }, Validators.required],
      numplantilla2: [{ value: null, disabled: false }, Validators.required],
      descripcion2: [{ value: null, disabled: false }, Validators.required],
    });
  }

  ngOnInit() {
    this.FormPlantillaSolicitudBodega.get('estado').setValue("S");
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();
    this.BuscaBodegaSolicitante();
    this.route.paramMap.subscribe(param => {
      if (param.has("in_tipo")) {
        this.SeleccionaPantallaPlantilla(parseInt(param.get("in_tipo"), 10));
      }
    })

    this._unidadesService.BuscarServicios(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor, 0, '').subscribe(
      response => {
        this.arregloservicios = response;
      }
    );
  }

  SeleccionaPantallaPlantilla(id_tipo: number) {
    this.limpiar();
    if (id_tipo == 1) {
      this.tipoplantilla = true;
      this.titulo = "Bodegas"
      this.plantilla = 1
      this.activabtnagregar = false;
    } else {
      if (id_tipo == 2) {
        this.tipoplantilla = false;
        this.titulo = "Procedimientos"
        this.plantilla = 2;
        this.activabtnagregar = false;
      }
    }
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.detalleplantillapaginacion = this.detalleplantilla.slice(startItem, endItem);
  }

  limpiar() {
    this.FormPlantillaSolicitudBodega.reset();
    this.detalleplantillapaginacion = [];
    this.detalleplantilla = [];
    this._Plantilla = new Plantillas();
    this.FormPlantillaSolicitudBodega.get('fechacreacion').setValue(new Date());
    this.activabtncreaplant = false;
    this.FormPlantillaSolicitudBodega.get('estado').setValue("S");
    this.activabtnagregar = false;
  }

  BuscaBodegaSolicitante() {

    this._BodegasService.listaBodegaTodasSucursal(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor).subscribe(
      response => {
        this.bodegasSolicitantes = response;

      },
      error => {
        console.log(error)
        alert("Error al Buscar Bodegas de cargo");
      }
    );
  }

  BuscaBodegasSuministro(codigobodegasolicitante: number) {

    this.bodegassuministro = [];

    this._BodegasService.listaBodegaRelacionadaAccion(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor, codigobodegasolicitante, 1).subscribe(
      data => {
        this.bodegassuministro = data;

      }, err => {
        console.log(err.error);
      }
    );
  }

  BuscarPlantillas(tipoplantilla: boolean) {
    var valor_tipo_plantilla = 0;


    this._BSModalRef = this._BsModalService.show(BusquedaplantillasbodegaComponent, this.setModalBusquedaPlantilla());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) { }
      else {
        if (tipoplantilla == false) {
          valor_tipo_plantilla = 2;
        } else {
          valor_tipo_plantilla = 1;
        }


        this._BodegasService.BuscaPlantillas(this.servidor, sessionStorage.getItem('Usuario'), this.hdgcodigo, this.esacodigo,
          this.cmecodigo, response.planid, '', '', '', 0, 0, '', '', valor_tipo_plantilla).subscribe(
            response_plantilla => {
              if (response_plantilla.length == 0) {

              } else {


                this._Plantilla = response_plantilla[0];
                console.log("Plantilla seleccionada",this._Plantilla)
                this.activabtncreaplant = false;
                if (valor_tipo_plantilla == 2) {

                  this.tipoplantilla = false;
                  this.activabtnagregar = true;
                  this.activabtncreaplant = false;
                } else {
                  if (valor_tipo_plantilla == 1) {
                    this.tipoplantilla = true;
                    this.activabtnagregar = true;
                    this.activabtncreaplant = false;
                  }

                }
                if(this._Plantilla.planvigente== "N"){
                  this.activabtnagregar = false;
                }
                

                this.FormPlantillaSolicitudBodega.get('descripcion').setValue(this._Plantilla.plandescrip);
                this.FormPlantillaSolicitudBodega.get('numplantilla').setValue(this._Plantilla.planid);
                this.FormPlantillaSolicitudBodega.get('serviciocod').setValue(this._Plantilla.serviciocod);
                this.FormPlantillaSolicitudBodega.get('estado').setValue(this._Plantilla.planvigente);
                this.FormPlantillaSolicitudBodega.get('bodcodigo').setValue(this._Plantilla.bodorigen);
                this.BuscaBodegasSuministro(this._Plantilla.bodorigen);
                this.FormPlantillaSolicitudBodega.get('bodcodigoentrega').setValue(this._Plantilla.boddestino);
                this.FormPlantillaSolicitudBodega.get('fechacreacion').setValue(this.datePipe.transform(this._Plantilla.fechacreacion, 'dd-MM-yyyy'));

                this.detalleplantillapaginacion = [];
                this.detalleplantilla = [];

                this.detalleplantilla = this._Plantilla.plantillasdet;
                this.detalleplantillapaginacion = this.detalleplantilla.slice(0, 20);

                console.log("Plantilla seleccionada",this._Plantilla)
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
        titulo: 'Búsqueda de Plantillas', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        tipoplantilla:   this.tipoplantilla,
        descripcion:     this.FormPlantillaSolicitudBodega.get('descripcion').value,
        codservicio:     this.FormPlantillaSolicitudBodega.get('serviciocod').value,
        codsolicitante:  this.FormPlantillaSolicitudBodega.get('bodcodigo').value,
        codsuministro:   this.FormPlantillaSolicitudBodega.get('bodcodigoentrega').value,
        vigencia:   this.FormPlantillaSolicitudBodega.get('estado').value
      } 
    };
    return dtModal;
  }

  addArticuloGrilla() {
    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModalBusquedaProductos());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) { }
      else {
        this.productoselec = response;
        if (this._Plantilla.planid > 0) {
          this.activabtncreaplant = false;
        } else {
          if (this._Plantilla.planid == 0 || this._Plantilla.planid == null) {
            this.activabtncreaplant = true
          }
        }
        const DetallePantilla = new DetallePlantillaBodega;
        DetallePantilla.codmei = this.productoselec.codigo;
        DetallePantilla.meindescri = this.productoselec.descripcion;
        DetallePantilla.meinid = this.productoselec.mein;
        DetallePantilla.pldeid = 0;
        DetallePantilla.acciond = "I";
        DetallePantilla.usuariocreacion = this.usuario;
        if (this._Plantilla.planid > 0) {
          DetallePantilla.planid = this._Plantilla.planid;
        }
        this.detalleplantilla.unshift(DetallePantilla);
        this.detalleplantillapaginacion = this.detalleplantilla.slice(0, 20);

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
        titulo: 'Búsqueda de Productos', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        tipo_busqueda: 'Todo-Medico',
        id_Bodega: this.FormPlantillaSolicitudBodega.value.bodcodigoentrega
      }
    };
    return dtModal;
  }

  // setModalBusquedaProductos() {
  //   let dtModal: any = {};
  //   dtModal = {
  //     keyboard: true,
  //     backdrop: 'static',
  //     class: 'modal-dialog-centered modal-xl',
  //     initialState: {
  //       titulo: 'Búsqueda de Productos', // Parametro para de la otra pantalla
  //       hdgcodigo: this.hdgcodigo,
  //       esacodigo: this.esacodigo,
  //       cmecodigo: this.cmecodigo,
  //     }
  //   };
  //   return dtModal;
  // }

  cambio_cantidad(id: number, property: string, event: any) {
    if (this.detalleplantillapaginacion[id]["pldeid"] == 0) {
      this.detalleplantillapaginacion[id]["acciond"] = "I";
    }

    if (this.detalleplantillapaginacion[id]["pldeid"] > 0) {
      this.detalleplantillapaginacion[id]["acciond"] = "M";
    }
    this.detalleplantilla[id][property] = this.detalleplantillapaginacion[id][property]
  }
  a

  ConfirmaGenerarPlantilla() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Desea Generar Plantilla ?',
      text: "Confirmar la creación de la plantilla",
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
    this.grabadetalleplantilla = [];
    var fechaactual = this.datePipe.transform(this.FormPlantillaSolicitudBodega.value.fechacreacion, 'yyyy-MM-dd');
    this.detalleplantilla.forEach(element => {

      var temporal = new DetallePlantillaBodega();
      temporal.planid = 0;
      temporal.pldeid = 0;
      temporal.cantsoli = element.cantsoli;
      temporal.codmei = element.codmei;
      temporal.meindescri = element.meindescri;
      temporal.meinid = element.meinid;
      temporal.pldevigente = null;
      temporal.usuariocreacion = this.usuario;
      temporal.fechacreacion = fechaactual;
      temporal.fechamodifica = null;
      temporal.usuariomodifica = null;
      temporal.fechaelimina = null;
      temporal.usuarioelimina = null;
      temporal.acciond = 'I';

      this.grabadetalleplantilla.unshift(temporal);
    })

    this._Plantilla = new Plantillas();
    this._Plantilla.planid = 0;
    this._Plantilla.hdgcodigo = this.hdgcodigo;
    this._Plantilla.esacodigo = this.esacodigo;
    this._Plantilla.cmecodigo = this.cmecodigo;
    if (this.tipoplantilla == false) {
      this._Plantilla.serviciocod = this.FormPlantillaSolicitudBodega.value.serviciocod;
      this._Plantilla.bodorigen = 0;
      this._Plantilla.boddestino = 0;
      this._Plantilla.plantipo = 2 //Acá se ingresa 1 o 2 según sea la pantalla de bod o serv
    } else {
      if (this.tipoplantilla == true) {

        this._Plantilla.bodorigen = this.FormPlantillaSolicitudBodega.value.bodcodigo;
        this._Plantilla.boddestino = this.FormPlantillaSolicitudBodega.value.bodcodigoentrega;
        this._Plantilla.serviciocod = null;
        this._Plantilla.plantipo = 1 //Acá se ingresa 1 o 2 según sea la pantalla de bod o serv
      }

    }
    this._Plantilla.plandescrip = this.FormPlantillaSolicitudBodega.value.descripcion;
    this._Plantilla.planvigente = this.FormPlantillaSolicitudBodega.value.estado;
    this._Plantilla.usuariocreacion = this.usuario;
    this._Plantilla.fechacreacion = fechaactual;
    this._Plantilla.fechamodifica = null;
    this._Plantilla.usuariomodifica = null;
    this._Plantilla.fechaelimina = null;
    this._Plantilla.usuarioelimina = null;
    this._Plantilla.servidor = this.servidor;
    this._Plantilla.accion = 'I';

    this._Plantilla.plantillasdet = this.grabadetalleplantilla;

    var numplant
    this._bodegasService.crearPlantilla(this._Plantilla).subscribe(
      response => {
        numplant = response.plantillaid;
        this.FormPlantillaSolicitudBodega.get('numplantilla').setValue(response['plantillaid']);
        this.alertSwal.title = "Plantilla creada N°:".concat(response['plantillaid']);
        this.alertSwal.show();
        this._bodegasService.BuscaPlantillas(this.servidor, this.usuario, this.hdgcodigo, this.esacodigo,
          this.cmecodigo, numplant, null, null, null, null, null, null, null, this.plantilla).subscribe(
            response => {
              this._Plantilla = response[0];
              if (this._Plantilla.plantipo == 2) {
                this.tipoplantilla = false;
                this.activabtncreaplant = false;
              } else {
                if (this._Plantilla.plantipo == 1) {
                  this.tipoplantilla = true;
                  this.activabtncreaplant = false;
                }
              }
              this.FormPlantillaSolicitudBodega.get('numplantilla').setValue(this._Plantilla.planid);
              this.FormPlantillaSolicitudBodega.get('estado').setValue(this._Plantilla.planvigente);
              this.FormPlantillaSolicitudBodega.get('bodcodigo').setValue(this._Plantilla.bodorigen);
              this.FormPlantillaSolicitudBodega.get('descripcion').setValue(this._Plantilla.plandescrip);
              this.FormPlantillaSolicitudBodega.get('bodcodigoentrega').setValue(this._Plantilla.boddestino);
              this.FormPlantillaSolicitudBodega.get('fechacreacion').setValue(this.datePipe.transform(this._Plantilla.fechacreacion, 'dd-MM-yyyy'));
              this.FormPlantillaSolicitudBodega.get('serviciocod').setValue(this._Plantilla.serviciocod);

              this.detalleplantillapaginacion = [];
              this.detalleplantilla = [];

              this.detalleplantilla = this._Plantilla.plantillasdet;
              this.detalleplantillapaginacion = this.detalleplantilla.slice(0, 20);
            }),
          error => {
            console.log("Error :", error)
          }
        this.FormPlantillaSolicitudBodega.get('numplantilla').setValue(this._Plantilla.planid);
        this.FormPlantillaSolicitudBodega.get('estado').setValue(this._Plantilla.planvigente);
        this.FormPlantillaSolicitudBodega.get('bodcodigo').setValue(this._Plantilla.bodorigen);
        this.FormPlantillaSolicitudBodega.get('descripcion').setValue(this._Plantilla.plandescrip);
        this.FormPlantillaSolicitudBodega.get('bodcodigoentrega').setValue(this._Plantilla.boddestino);
        this.FormPlantillaSolicitudBodega.get('fechacreacion').setValue(this.datePipe.transform(this._Plantilla.fechacreacion, 'dd-MM-yyyy'));
        this.FormPlantillaSolicitudBodega.get('serviciocod').setValue(this._Plantilla.serviciocod);

        this.detalleplantillapaginacion = [];
        this.detalleplantilla = [];

        this.detalleplantilla = this._Plantilla.plantillasdet;
        this.detalleplantillapaginacion = this.detalleplantilla.slice(0, 20);
      },
      error => {
        console.log("Error :", error)
      }
    );
    // },
    error => {
      console.log(error);
      this.alertSwalError.title = "Error al generar plantilla";
      this.alertSwalError.show();
    }
    // );
  }

  ConfirmaEliminarPlantilla() {
    // sE CONFIRMA Eliminar Solicitud    
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
        this.ModificarPlantilla("E");
      }
    })
  }

  ConfirmaEliminaProductoDeLaGrilla(registro, id) {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Desea Eliminar Producto de la Plantilla ?',
      text: "Confirmar la eliminación del producto la plantilla",
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

  EliminaProductoDeLaGrilla(registro: DetallePlantillaBodega, id: number) {
    if (registro.acciond == "I" && id >= 0 && registro.pldeid == 0) {
      // Eliminar registro nuevo la grilla
      this.detalleplantilla.splice(id, 1);
      this.detalleplantillapaginacion = this.detalleplantilla.slice(0, 20);
      // nthis.activabtncreaplant = false; //DESACTIVA BTN CREAR?? //@MLobos
      this.alertSwal.title = "Producto Eliminado de la Plantilla";//.concat(response['solbodid']);
      this.alertSwal.show();
    } else {
      // elimina uno que ya existe

      this.detalleplantilla[id].acciond = 'E';
      this.ModificarPlantilla("M");
    }
  }

  ConfirmaModificarPlantilla() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Desea Modificar Plantilla ?',
      text: "Confirmar la modificación de la plantilla",
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

  /** Verifica si existe valor negativo y devuelve bool */
  checkNegativo() {
    let exist: boolean = false;
    for (let item of this.detalleplantilla) {
      if (item.cantsoli < 0) {
        return exist = true;
      }
    }
    return exist;
  }

  ModificarPlantilla(Accion: string) {
    console.log("detalley accion", Accion, this.detalleplantilla)
    if (this.checkNegativo()) {
      this.alertSwalAlert.title = 'No debe ingresar cantidad(es) negativas';
      this.alertSwalAlert.show();
      return;
    } else {
      var fechaactual = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

      if (this.tipoplantilla == true) {

        this._Plantilla.serviciocod = null;
        this._Plantilla.bodorigen = this.FormPlantillaSolicitudBodega.value.bodcodigo;
        this._Plantilla.boddestino = this.FormPlantillaSolicitudBodega.value.bodcodigoentrega;
        this._Plantilla.plantipo = 1;
      } else {
        if (this.tipoplantilla == false)

          this._Plantilla.serviciocod = this.FormPlantillaSolicitudBodega.value.serviciocod;
        this._Plantilla.bodorigen = 0;
        this._Plantilla.boddestino = 0;
        this._Plantilla.plantipo = 2;
      }
      this._Plantilla.plandescrip = this.FormPlantillaSolicitudBodega.value.descripcion;
      this._Plantilla.planvigente = this.FormPlantillaSolicitudBodega.value.estado;
      this._Plantilla.fechamodifica = fechaactual;
      this._Plantilla.usuariomodifica = this.usuario;
      if (Accion == "E") {
        this._Plantilla.fechaelimina = fechaactual;
        this._Plantilla.usuarioelimina = this.usuario;
        this._Plantilla.fechamodifica = null;
        this._Plantilla.usuariomodifica = null;
        this._Plantilla.accion = "E";
      }
      if (Accion == "M") {
        this._Plantilla.accion = "M";
        this._Plantilla.fechamodifica = fechaactual;
        this._Plantilla.usuariomodifica = this.usuario;
        this._Plantilla.fechaelimina = null;
        this._Plantilla.usuarioelimina = null;
      }
      this._Plantilla.servidor = this.servidor;
      /* Detalle de solicitu, solo viaja la modificada y eliminada */
      this.grabadetalleplantilla = [];

      this.detalleplantilla.forEach(element => {
        var _detallePlantilla = new DetallePlantillaBodega;
        _detallePlantilla = element;

        if (element.acciond == 'M') {
          _detallePlantilla.codmei = element.codmei;
          _detallePlantilla.meinid = element.meinid;
          _detallePlantilla.cantsoli = element.cantsoli; //cantidad solicitada
          _detallePlantilla.fechamodifica = fechaactual;
          _detallePlantilla.usuariomodifica = this.usuario;
          _detallePlantilla.acciond = "M";
        }

        if (element.acciond == 'E') {
          _detallePlantilla.fechamodifica = null;
          _detallePlantilla.usuariomodifica = null;
          _detallePlantilla.fechaelimina = fechaactual;
          _detallePlantilla.usuarioelimina = this.usuario;
          _detallePlantilla.acciond = "E";
        }
        // if (Accion == 'E') {
        //   _detallePlantilla.fechamodifica = null;
        //   _detallePlantilla.usuariomodifica = null;
        //   _detallePlantilla.fechaelimina = fechaactual;
        //   _detallePlantilla.usuarioelimina = this.usuario;
        //   _detallePlantilla.acciond = "E";
        // }
        this.grabadetalleplantilla.unshift(_detallePlantilla);
      });

      this._Plantilla.plantillasdet = this.grabadetalleplantilla;
      console.log("plantilla  a elimiiinjsdkfnd", this._Plantilla)

      var numplant;
      this._bodegasService.ModificaPlantilla(this._Plantilla).subscribe(
        response => {
          numplant = response.plantillaid;
          if (Accion == "M") {
            this.alertSwal.title = "Plantilla modificada";
            this.alertSwal.show();

            /* Recarga  */
            this._bodegasService.BuscaPlantillas(this.servidor, this.usuario, this.hdgcodigo, this.esacodigo,
              this.cmecodigo, numplant, null, null, null, null, null, null, null, this.plantilla).subscribe(
                response => {
                  this._Plantilla = response[0];

                  if (this._Plantilla.plantipo == 2) {
                    this.tipoplantilla = false;
                    this.activabtncreaplant = false;
                  } else {
                    if (this._Plantilla.plantipo == 1) {
                      this.tipoplantilla = true;
                      this.activabtncreaplant = false;
                    }
                  }
                  if(this._Plantilla.planvigente== "S"){
                    this.activabtnagregar = true;
                    console.log("no vigente",this.activabtnagregar)
                  }
                  this.FormPlantillaSolicitudBodega.get('numplantilla').setValue(this._Plantilla.planid);
                  this.FormPlantillaSolicitudBodega.get('bodcodigo').setValue(this._Plantilla.bodorigen);
                  this.FormPlantillaSolicitudBodega.get('descripcion').setValue(this._Plantilla.plandescrip);
                  this.FormPlantillaSolicitudBodega.get('estado').setValue(this._Plantilla.planvigente);
                  this.FormPlantillaSolicitudBodega.get('bodcodigoentrega').setValue(this._Plantilla.boddestino);
                  this.FormPlantillaSolicitudBodega.get('fechacreacion').setValue(this.datePipe.transform(this._Plantilla.fechacreacion, 'dd-MM-yyyy'));

                  this.detalleplantillapaginacion = [];
                  this.detalleplantilla = [];

                  this.detalleplantilla = this._Plantilla.plantillasdet;
                  this.detalleplantillapaginacion = this.detalleplantilla.slice(0, 20);
                },
                error => {
                  console.log("Error :", error)
                });
            this.FormPlantillaSolicitudBodega.get('numplantilla').setValue(this._Plantilla.planid);
            this.FormPlantillaSolicitudBodega.get('bodcodigo').setValue(this._Plantilla.bodorigen);
            this.FormPlantillaSolicitudBodega.get('descripcion').setValue(this._Plantilla.plandescrip);
            this.FormPlantillaSolicitudBodega.get('estado').setValue(this._Plantilla.planvigente);
            this.FormPlantillaSolicitudBodega.get('bodcodigoentrega').setValue(this._Plantilla.boddestino);
            this.FormPlantillaSolicitudBodega.get('fechacreacion').setValue(this.datePipe.transform(this._Plantilla.fechacreacion, 'dd-MM-yyyy'));

            this.detalleplantillapaginacion = [];
            this.detalleplantilla = [];

            this.detalleplantilla = this._Plantilla.plantillasdet;
            this.detalleplantillapaginacion = this.detalleplantilla.slice(0, 20);
            // },
            error => {
              console.log("Error :", error)
            }
            // );
          }
          if (Accion == "E") {
            this.alertSwal.title = "Plantilla Eliminada";
            this.alertSwal.show();
            this._bodegasService.BuscaPlantillas(this.servidor, this.usuario, this.hdgcodigo, this.esacodigo,
              this.cmecodigo, numplant, null, null, null, null, null, null, null, this.plantilla).subscribe(
                data => {
                  console.log("plantillabusca desp de elim", data);
                  this._Plantilla = data[0];
                  console.log("plantillabusca desp de elim", this._Plantilla)
                  if (this._Plantilla.plantipo == 2) {
                    this.tipoplantilla = false;
                    this.activabtncreaplant = false;
                  } else {
                    if (this._Plantilla.plantipo == 1) {
                      this.tipoplantilla = true;
                      this.activabtncreaplant = false;
                    }
                  }
                  if(this._Plantilla.planvigente== "N"){
                    this.activabtnagregar = false;
                    console.log("no vigente",this.activabtnagregar)
                  }
                  this.FormPlantillaSolicitudBodega.get('numplantilla').setValue(this._Plantilla.planid);
                  this.FormPlantillaSolicitudBodega.get('bodcodigo').setValue(this._Plantilla.bodorigen);
                  this.FormPlantillaSolicitudBodega.get('descripcion').setValue(this._Plantilla.plandescrip);
                  this.FormPlantillaSolicitudBodega.get('estado').setValue(this._Plantilla.planvigente);
                  this.FormPlantillaSolicitudBodega.get('bodcodigoentrega').setValue(this._Plantilla.boddestino);
                  this.FormPlantillaSolicitudBodega.get('fechacreacion').setValue(this.datePipe.transform(this._Plantilla.fechacreacion, 'dd-MM-yyyy'));
                  
                  this.detalleplantillapaginacion = [];
                  this.detalleplantilla = [];

                  this.detalleplantilla = this._Plantilla.plantillasdet;
                  this.detalleplantillapaginacion = this.detalleplantilla.slice(0, 20);
                },
                error => {
                  console.log("Error :", error)
                });
            this.FormPlantillaSolicitudBodega.get('numplantilla').setValue(this._Plantilla.planid);
            this.FormPlantillaSolicitudBodega.get('bodcodigo').setValue(this._Plantilla.bodorigen);
            this.FormPlantillaSolicitudBodega.get('descripcion').setValue(this._Plantilla.plandescrip);
            this.FormPlantillaSolicitudBodega.get('estado').setValue(this._Plantilla.planvigente);
            this.FormPlantillaSolicitudBodega.get('bodcodigoentrega').setValue(this._Plantilla.boddestino);
            this.FormPlantillaSolicitudBodega.get('fechacreacion').setValue(this.datePipe.transform(this._Plantilla.fechacreacion, 'dd-MM-yyyy'));

            this.detalleplantillapaginacion = [];
            this.detalleplantilla = [];

            this.detalleplantilla = this._Plantilla.plantillasdet;
            this.detalleplantillapaginacion = this.detalleplantilla.slice(0, 20);
            
            // },
            error => {
              console.log("Error :", error)
            }

          }
          this.FormPlantillaSolicitudBodega.get('numplantilla').setValue(numplant);
        }),
        error => {
          console.log(error);
          this.alertSwalError.title = "Error al modificar solictud";
          this.alertSwalError.show();
        }
      // );
    }
  }

  salir() {
    this.router.navigate(['home']);
  }

  SeleccionaBodegaServicio() {
    this.activabtnagregar = true;
  }


  ActivarBotonModificar() {

    //console.log(this.FormPlantillaSolicitudBodega.get('numplantilla').value);
    if (this.FormPlantillaSolicitudBodega.get('numplantilla').value != null) {
      return true

    } else {
      return false
    }

  }


  ActivarBotonGuardar() {

    //console.log(this.FormPlantillaSolicitudBodega.get('numplantilla').value);
    if (this.plantilla == 1) {
      if (this.FormPlantillaSolicitudBodega.get('numplantilla').value == null
        && this.FormPlantillaSolicitudBodega.get('descripcion').value != null
        && this.FormPlantillaSolicitudBodega.get('bodcodigo').value != null
        && this.FormPlantillaSolicitudBodega.get('bodcodigoentrega').value != null
        && this.detalleplantilla.length>0
      ) {
        return true

      } else {
        return false
      }
    } else {  // Procedimientos
      if (this.FormPlantillaSolicitudBodega.get('numplantilla').value == null
        && this.FormPlantillaSolicitudBodega.get('descripcion').value != null
        && this.FormPlantillaSolicitudBodega.get('serviciocod').value != null
        && this.detalleplantilla.length>0
      ) {
        return true

      } else {
        return false
      }


    }

  }

}