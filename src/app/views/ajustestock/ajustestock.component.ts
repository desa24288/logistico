import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BodegasService } from '../../servicios/bodegas.service';
import { BodegasTodas } from 'src/app/models/entity/BodegasTodas';
import { environment } from '../../../environments/environment';
import { BusquedaproductosComponent } from '../busquedaproductos/busquedaproductos.component';
import { Articulos } from 'src/app/models/entity/mantencionarticulos';
import { CreasolicitudesService } from '../../servicios/creasolicitudes.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MotivoAjuste } from '../../models/entity/MotivoAjuste';
import { MotivoAjusteService } from '../../servicios/motivoajuste.service';
import { Permisosusuario } from '../../permisos/permisosusuario';
import { BusquedaproductosService } from 'src/app/servicios/busquedaproductos.service';

@Component({
  selector: 'app-ajustestock',
  templateUrl: './ajustestock.component.html',
  styleUrls: ['./ajustestock.component.css'],
  providers : [CreasolicitudesService]
})
export class AjustestockComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public modelopermisos : Permisosusuario = new Permisosusuario();
  public FormAjusteStock: FormGroup;
  public hdgcodigo      : number;
  public esacodigo      : number;
  public cmecodigo      : number;
  public stockbodega    : number;
  public codbodega      : number;
  public buscaprod      : boolean = false;
  public servidor       = environment.URLServiciosRest.ambiente;
  public usuario        = environment.privilegios.usuario;
  public bodegas        : Array<BodegasTodas> = [];
  public productoselec  : Articulos;
  // public datoskardexpaginacion: Articulos;
  private _BSModalRef   : BsModalRef;
  public motivos        : MotivoAjuste[]=[];
  public loading        = false;
  public prodsel        : boolean = true;
  public activabtngrabar : boolean = false;
   descprod: any;
  codprod: any;


  constructor(
    private formBuilder   : FormBuilder,
    public _BsModalService: BsModalService,
    public _BodegasService: BodegasService,
    private MotivoAjusteService: MotivoAjusteService,
    public _creaService   : CreasolicitudesService,
    public _BusquedaproductosService: BusquedaproductosService
  ) {

    this.FormAjusteStock = this.formBuilder.group({
      boddestino  : [{ value: null, disabled: false }, Validators.required],
      codigo      : [{ value: null, disabled: false }, Validators.required],
      descripcion : [{ value: null, disabled: false }, Validators.required],
      stockactual : [{ value: null, disabled: false }, Validators.required],
      stocknuevo  : [{ value: null, disabled: false }, Validators.required],
      motivoajuste  : [{ value: null, disabled: false }, Validators.required]

    });
  }

  ngOnInit() {
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();
    this.BuscaBodegaDestino();

    this.MotivoAjusteService.list(this.usuario,this.servidor).subscribe(
      data => {
        this.motivos = data;

      }, err => {
        console.log(err.error);
      }
    );

  }



  BuscaBodegaDestino() {

    this._BodegasService.listaBodegaTodasSucursal(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor).subscribe(
      response => {
        if(response != null){
          this.bodegas = response;
        }
      },
      error => {
        alert("Error al Buscar Bodegas de cargo");
      }
    );
  }

  ActivaBotonBuscaProd(){
    this.buscaprod = true;
  }

  getProducto(codigo: any) {
    // var codproducto = this.lForm.controls.codigo.value;
    this.codprod = codigo;
    console.log(this.codprod);
    if(this.codprod === null || this.codprod === ''){
      return;
    } else{
      var tipodeproducto = 'MIM';
      this.loading = true;
      var controlado = '';
      var controlminimo = '';
      var idBodega = this.FormAjusteStock.value.boddestino;
      var consignacion = '';

      this._BusquedaproductosService.BuscarArticulosFiltros(this.hdgcodigo, this.esacodigo,
        this.cmecodigo, this.codprod, null, null, null, null, tipodeproducto, idBodega, controlminimo,
        controlado, consignacion, this.usuario, null, this.servidor).subscribe(
          response => {
            if (response != null) {
              if (response.length == 0) {
                console.log('no existe el codigo');

                this.loading = false;
                this.BuscaProducto();
              } else {
                if (response.length > 0) {
                  this.productoselec = response[0];
                  this.loading = false;
                  this.FormAjusteStock.get('codigo').setValue(response[0].codigo);
                  this.FormAjusteStock.get('descripcion').setValue(response[0].descripcion);
                  this.prodsel = true;
                  this.BuscaStockProducto(response[0].mein,this.FormAjusteStock.value.boddestino);
                  this.desactivaCampos(true);
                }
              }
            }
          }, error => {
            this.loading = false;
            console.log('error');
          }
        );
    }
  }

  setDatabusqueda(value: any, swtch: number) {

    if (swtch === 1) {
        this.codprod = value;
    } else if (swtch === 2) {
        this.descprod = value;
    }
  }

  desactivaCampos(bool) {
    if (bool){
      this.FormAjusteStock.controls.codigo.disable();
      this.FormAjusteStock.controls.descripcion.disable();
    } else {
      this.FormAjusteStock.controls.codigo.enable();
      this.FormAjusteStock.controls.descripcion.enable();
    }
  }

  BuscaProducto(){
    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModalBusquedaProductos());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) { }
      else {
        this.productoselec=response;
        this.FormAjusteStock.get('codigo').setValue(this.productoselec.codigo);
        this.FormAjusteStock.get('descripcion').setValue(this.productoselec.descripcion);
        this.prodsel = true;
        this.desactivaCampos(true);
        this.BuscaStockProducto(this.productoselec.mein, this.FormAjusteStock.value.boddestino);

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
        id_Bodega: this.FormAjusteStock.value.boddestino,
        descprod: this.descprod,//
        codprod: this.codprod
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

  BuscaStockProducto(mein,boddestino){

    this._creaService.BuscaStockProd(mein,boddestino, this.usuario, this.servidor).subscribe(
      response => {
        if (response != null) {
          if (response.length == 0) {
            this.alertSwalAlert.title = "No existe stock en bodega para el producto buscado";
            this.alertSwalAlert.text ="Puede que el producto no exista en la bodega de Suministro";
            this.alertSwalAlert.show();
          } else {
            this.stockbodega = response[0].stockactual;
            this.FormAjusteStock.get('stockactual').setValue(this.stockbodega);
            this.ActivaBotonGrabar();
          }
        }
      },
      error => {
        console.log(error);
        alert("Error al Buscar el stock del Producto")
      }
    );

  }

  Limpiar(){
    this.FormAjusteStock.reset();
    this.buscaprod = false;
    this.desactivaCampos(false);
    this.codprod = null;
    this.descprod = null;
    this.activabtngrabar = false;

  }

  validaStock(stock: number) {
    if(stock <= 0){
      this.alertSwalAlert.title ="El stock no puede ser menor que 1"
      this.alertSwalAlert.show();
    }

  }

  ActivaBotonGrabar(){
    var motivo = true;
    if(this.prodsel === true && this.FormAjusteStock.value.stocknuevo>0 && motivo ==true){
      this.activabtngrabar = true;
    }
  }

  ConfirmarAjusteStock(){
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Desea Ajustar El Stock?',
      text: "Confirmar el ajuste de stock",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.GrabaAjusteStock();
      }
    })
  }

  GrabaAjusteStock(){
      this._BodegasService.GrabarAjusteStock(this.hdgcodigo,this.esacodigo,this.cmecodigo,
      this.servidor, this.usuario,this.FormAjusteStock.value.boddestino, this.productoselec.mein,
      this.productoselec.codigo,this.FormAjusteStock.value.stockactual,
      this.FormAjusteStock.value.stocknuevo, this.FormAjusteStock.value.motivoajuste ).subscribe(
      response => {
        if (response != null){
          this.alertSwal.title = "Ajuste Grabado Exitosamente";
          this.alertSwal.show();

          this._creaService.BuscaStockProd(this.productoselec.mein, this.FormAjusteStock.value.boddestino,
            this.usuario, this.servidor).subscribe(
              response => {
                if (response != null) {
                  this.FormAjusteStock.get('stockactual').setValue(response[0].stockactual);
                  this.FormAjusteStock.get('stocknuevo').setValue(null);
                }
              }
            );
        }
      },
      error => {
        console.log(error);
        this.alertSwalError.title = "Error al Grabar el Ajuste de stock del Producto";
        this.alertSwalError.show();
      }
    );
  }

}
