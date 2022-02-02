import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BodegasService } from '../../servicios/bodegas.service';
import { TipoRegistro } from '../../models/entity/TipoRegistro';
import { TiporegistroService } from '../../servicios/tiporegistro.service';
import { BodegaDestino } from '../../models/entity/BodegaDestino';
import { IngresoConteoManual } from '../../models/entity/IngresoConteoManual';
import { InventarioDetalle } from '../../models/entity/InventarioDetalle';
import { BusquedaproductosComponent } from '../busquedaproductos/busquedaproductos.component';
import { PageChangedEvent } from 'ngx-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { InventariosService } from 'src/app/servicios/inventarios.service';


@Component({
  selector: 'app-ingresoconteomanual',
  templateUrl: './ingresoconteomanual.component.html',
  styleUrls: ['./ingresoconteomanual.component.css'],
  providers: [InventariosService]
})
export class IngresoconteomanualComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  public FormIngresoConteoManual: FormGroup;
  public tiposderegistros       : Array<TipoRegistro> = [];
  public bodegasdestino         : Array<BodegaDestino> = [];
  public periodos               : IngresoConteoManual[]=[];
  public detallesinventarios    : InventarioDetalle[]=[];
  public detallesinventariosPaginacion: InventarioDetalle[]=[];
  public grabaconteomanual      : InventarioDetalle[]=[];
  public usuario                = environment.privilegios.usuario;
  public servidor               = environment.URLServiciosRest.ambiente;
  public hdgcodigo              : number;
  public esacodigo              : number;
  public cmecodigo              : number;
  private _BSModalRef           : BsModalRef;
  editField                     : any;
  retornoproducto                           : any;
  stockboddestino               : any;


  constructor(
    private formBuilder         : FormBuilder,
    public _BodegasService      : BodegasService,
    public _BsModalService      : BsModalService,
    private _inventarioService : InventariosService,
    private TiporegistroService : TiporegistroService
  ) {

    this.FormIngresoConteoManual = this.formBuilder.group({

      tiporegistro: [null],
      boddestino    : [null],
      periodo       : [null]
    });
   }

  ngOnInit() {

    this.TiporegistroService.list(this.usuario,this.servidor).subscribe(
      data => {
        this.tiposderegistros = data;
        console.log(data);
      }, err => {
        console.log(err.error);
      }
    );
  }

  getHdgcodigo(event: any) {
    this.hdgcodigo = event.hdgcodigo;

  }
  getEsacodigo(event: any) {
    this.esacodigo = event.esacodigo;
  }

  getCmecodigo(event: any) {
    this.cmecodigo = event.cmecodigo;

    this.BuscaBodegaDestino();
  }

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent ;

    this.detallesinventariosPaginacion[id][property] = parseInt(editField);
    this.detallesinventarios[id][property] = this.detallesinventariosPaginacion[id][property]
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
    console.log(id, property, event);
  }

  BuscaBodegaDestino() {

    this._BodegasService.listaBodegaDestinoSucursal(this.hdgcodigo,this.esacodigo,this.cmecodigo,
      this.usuario,this.servidor).subscribe(response => {
        if (response != null) {
          this.bodegasdestino = response;
        }
      },
      error => {
        alert("Error al Buscar Bodegas de Destino");
      }
    );
  }

  BuscaPeriodoInventario(codigobod: number){
    console.log("codigo bodega y ambiente servidor:", codigobod,environment.URLServiciosRest.ambiente);

    this._inventarioService.BuscaPeriodo(codigobod,this.usuario,this.servidor).subscribe(
      response => {
        if (response != null) {
          this.periodos=response
        }
      },
      error => {
        console.log(error);
        alert("Error al Buscar Período");
      }
    );

  }

  Limpiar(){
    console.log("Limpia La Pantalla");
    this.FormIngresoConteoManual.reset();
    this.detallesinventarios =[];
    this.detallesinventariosPaginacion=[];
  }

  ConfirmaBusquedaDeInventarios(){
    this.BusquedaDeInventarios();
    /*this._BSModalRef = this._BsModalService.show(ModalConfirmaGuardarComponent, this.setModalMensajeAceptar());
    this._BSModalRef.content.onClose.subscribe((Respuesta: any) => {
      if (Respuesta == 'ACEPTADO') {
        this.BusquedaDeInventarios();
      }
    })*/

  }

  setModalMensajeAceptar() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-m',
      initialState: {
        titulo: 'CONFIRMAR', // Parametro para de la otra pantalla
        mensaje: 'USTED DEBE CONFIRMAR O CANCELAR LA BÚSQUEDA DE INVENTARIO',
        informacion: '',
      }
    };
    return dtModal;
  }

  BusquedaDeInventarios(){
    console.log("Busca Inventarios",this.FormIngresoConteoManual.value.boddestino,
    this.FormIngresoConteoManual.value.periodo,this.FormIngresoConteoManual.value.tiporegistro,
    environment.URLServiciosRest.ambiente);
    this._inventarioService.BuscaDetalleInventario(this.FormIngresoConteoManual.value.periodo,
      this.FormIngresoConteoManual.value.boddestino, this.FormIngresoConteoManual.value.tiporegistro,
      this.usuario,this.servidor).subscribe(
      response => {
        if (response != null) {
          this.detallesinventarios=response;
          this.detallesinventariosPaginacion = this.detallesinventarios.slice(0,8)
        }
      },
      error => {
        console.log(error);
        this.alertSwalError.title="Error al Buscar Inventarios";
        this.alertSwalError.show();
        //alert("Error al Buscar Inventarios");
      }
    );
  }

  addArticulosGrilla(in_bodsercodigo: number, in_boddescodigo: number) {

    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModalBusquedaProductos());
    this._BSModalRef.content.onClose.subscribe((RetornoProductos: any) => {
      if (RetornoProductos == undefined) { }
      else {
        this.retornoproducto=RetornoProductos;
        console.log(this.retornoproducto);
        //this.BuscaStockProductoOrigen(RetornoProductos.mein, this.FormCreaSolicitud.value.bodorigen);
        this.BuscaStockProductoDestino(RetornoProductos.mein, this.FormIngresoConteoManual.value.boddestino)
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
      }
    };
    return dtModal;
  }

  BuscaStockProductoDestino(mein: number, bodegadestino: number) {

    this._inventarioService.BuscaStockProd(mein, bodegadestino, this.usuario, this.servidor).subscribe(
      response => {
        if (response != null) {
          if (response.length == 0) {
            alert("No existe stock para el producto buscado, puede que el producto no exista en la bodega Solicitante");
          }
          this.stockboddestino = response[0].stockactual;
          const DetalleInventario = new (InventarioDetalle);
          DetalleInventario.codigomein     = this.retornoproducto.codigo;
          DetalleInventario.productodesc   = this.retornoproducto.descripcion;
          DetalleInventario.valorcosto     = 0;
          DetalleInventario.stockinvent    = this.stockboddestino;
          DetalleInventario.idmeinid       = this.retornoproducto.mein;
          DetalleInventario.conteomanual   = 0;
          DetalleInventario.iddetalleinven = this.retornoproducto.iddetalleinven
          DetalleInventario.idinventario   = this.detallesinventarios[0].idinventario;
          DetalleInventario.estadoajuste   = "";
          DetalleInventario.fechacierre    = "";
          DetalleInventario.ajusteinvent   = 0;
          DetalleInventario.iddetalleinven = 0;

          this.detallesinventarios.push(DetalleInventario);
          this.detallesinventariosPaginacion=this.detallesinventarios.slice(0,8);
        }
      },
      error => {
        console.log(error);
        alert("Error al Buscar el stock del Producto")
      }
    );
  }

  ConfirmaIngresoConteoManual(){
    const Swal = require('sweetalert2');

    Swal.fire({
      title: '¿Desea Realizar el Ingreso Conteo Manual?',
      text: "Confirmar Ingreso Conteo Manual",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {

        this.GrabaIngresoConteoManual();
      }
    })
  }

  GrabaIngresoConteoManual(){
    //var fecha = this.datePipe.transform(this.FormIngresoConteoManual.value.fechamostrar, 'yyyy-MM-dd');
    console.log("Genera el inventario",this.FormIngresoConteoManual.value.boddestino,
    this.FormIngresoConteoManual.value.tiporegistro,this.servidor);

   this.detallesinventarios.forEach(element=>{
     var temporal = new InventarioDetalle
     temporal.ajusteinvent  = element.ajusteinvent;
     temporal.campo         = element.campo;
     temporal.codigomein    = element.codigomein;
     temporal.conteomanual  = element.conteomanual;
     temporal.estadoajuste  = element.fechacierre;
     temporal.fechacierre   = element.fechacierre;
     temporal.iddetalleinven= element.iddetalleinven;
     temporal.idinventario  = element.idinventario;
     temporal.idmeinid      = element.idmeinid;
     temporal.productodesc  = element.productodesc;
     temporal.stockinvent   = element.stockinvent;
     temporal.valorcosto    = element.valorcosto;
     temporal.campo         = "";
     temporal.usuario       = this.usuario;
     temporal.servidor      = this.servidor;


     this.grabaconteomanual.push(temporal);
   })

    console.log("El conteo manual a grabar es:",this.grabaconteomanual);

    this._inventarioService.GrabaConteoManual(this.grabaconteomanual).subscribe(
      response => {
        if (response != null) {
          this.alertSwal.title = "Ingreso Conteo Manual se realizó con éxito".concat();
          this.alertSwal.show();
        }
      },
      error => {
        console.log(error);
        this.alertSwalError.title="Ingreso Conteo Manual";
        this.alertSwalError.text = "Conteo Manual Generado Exitosamente";
        this.alertSwalError.show();

      }
    );
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.detallesinventariosPaginacion = this.detallesinventarios.slice(startItem, endItem);
  }

}
