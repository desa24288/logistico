import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { esLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../../environments/environment';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { DatePipe } from '@angular/common';

import { Articulos } from '../../models/entity/mantencionarticulos';
import { ConsultaConsumoLote } from 'src/app/models/entity/ConsultaConsumoLote';
import { DetalleConsultaConsumoLote } from 'src/app/models/entity/DetalleConsultaConsumoLote';
import { ModalBuscaProductoConsultaLotes } from 'src/app/models/entity/ModalBuscaProductoConsultaLotes';

import { BusquedaproductosComponent } from '../busquedaproductos/busquedaproductos.component';
import { ModalbusquedadosComponent } from './modalbusquedados/modalbusquedados.component';

import { BusquedaproductosService } from 'src/app/servicios/busquedaproductos.service';
import { BuscaLotesSistema } from 'src/app/models/entity/BuscaLotesSistema';
import { BodegasService } from 'src/app/servicios/bodegas.service';

@Component({
  selector: 'app-consultalotes',
  templateUrl: './consultalotes.component.html',
  styleUrls: ['./consultalotes.component.css']
})
export class ConsultalotesComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public FormConsultaLotes              : FormGroup;
  public detalleconsultalotesPaginacion : Array<DetalleConsultaConsumoLote>=[];
  public detalleconsultalotes           : Array<DetalleConsultaConsumoLote> = [];
  public detalleconsultalotesbod        : Array<DetalleConsultaConsumoLote> = [];
  public detalleconsultalotesbodPaginacion : Array<DetalleConsultaConsumoLote>=[];
  public datos                : ModalBuscaProductoConsultaLotes = new ModalBuscaProductoConsultaLotes;
  public locale                         = 'es';
  public bsConfig                       : Partial<BsDatepickerConfig>;
  public colorTheme                     = 'theme-blue';
  private _BSModalRef                   : BsModalRef;
  public servidor                       = environment.URLServiciosRest.ambiente;
  public usuario                        = environment.privilegios.usuario;
  public hdgcodigo                      : number;
  public esacodigo                      : number;
  public cmecodigo                      : number;
  public loading                        = false;
  public codprod                        = null;
  public meinid                         : number;
  public tipo                           : number;
  public producto                     : ConsultaConsumoLote;

  public datoslotesPaginacion : Array<BuscaLotesSistema>=[];
  public lote = null;
  public fechahasta = null;
  public fechadesde = null;
  public meinidpantprincipal: number;
  public codigo: string;
  public descrip: string;
  public datoslotes           : Array<BuscaLotesSistema>=[];


  constructor(
    private formBuilder             : FormBuilder,
    public localeService            : BsLocaleService,
    public _BsModalService          : BsModalService,
    public _BusquedaproductosService: BusquedaproductosService,
    private _buscabodegasService: BodegasService,
    public datePipe: DatePipe,

  ) {
    this.FormConsultaLotes = this.formBuilder.group({
      lote        : [{ value: null, disabled: false }, Validators.required],
      fechadesde  : [{ value: null, disabled: false }, Validators.required],
      fechahasta  : [{ value: new Date(), disabled: false }, Validators.required],
      codigo      : [{ value: null, disabled: false }, Validators.required],
      descripcion : [{ value: null, disabled: false }, Validators.required],
    });
  }

  ngOnInit() {

    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();

    this.setDate();
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  async getProducto() {

    var noexisteprod: boolean = false;
    if (this.FormConsultaLotes.controls.codigo.value !== null) {
      var codProdAux = this.FormConsultaLotes.controls.codigo.value.toString();
    }

    this.codprod = this.FormConsultaLotes.controls.codigo.value;
    if (this.codprod === null || this.codprod === '') {
      this.onBuscarProducto();
    } else {
      var tipodeproducto = 'MIM';
      this.loading = true;
      var controlado = '';
      var controlminimo = '';
      var idBodega = 0;
      var consignacion = '';

      this._BusquedaproductosService.BuscarArticulosFiltros(this.hdgcodigo, this.esacodigo,
      this.cmecodigo, this.codprod, null, null, null, null, tipodeproducto, idBodega, controlminimo, controlado, consignacion
      , this.usuario, null, this.servidor).subscribe(response => {
        if( response === null || response === undefined ){
          this.loading = false; return;
        } else {
          if (!response.length) {
            this.loading = false;
            this.onBuscarProducto();
          } else if (response.length) {
            if (response.length > 1) {
              if (noexisteprod === false) {
                this.onBuscarProducto();
              }
            } else {
              this.loading = false;
              this.FormConsultaLotes.get('codigo').setValue(response[0].codigo);
              this.FormConsultaLotes.get('descripcion').setValue(response[0].descripcion);
              this.meinid = response[0].mein;

            }
          }
        }
      }, error => {
        this.loading = false;
      });
    }
  }

  onBuscarProducto() {
    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModalBusquedaProducto("Busqueda de Productos"));
    this._BSModalRef.content.onClose.subscribe((RetornoProductos: Articulos) => {
      if (RetornoProductos !== undefined) {
        this.loading = false;
        this.FormConsultaLotes.get('codigo').setValue(RetornoProductos.codigo);
        this.FormConsultaLotes.get('descripcion').setValue(RetornoProductos.descripcion);
        this.meinid = RetornoProductos.mein;
      }else{
        this.loading = false;
      }
    });this.loading = false;
  }

  setModalBusquedaProducto(titulo: string) {

    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: titulo,
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        tipo_busqueda: 'Todo-Medico',
        id_Bodega: 0,
        codprod: this.codprod
      }
    };
    return dtModal;
  }

  ConsultaLotes(){
    this.detalleconsultalotesbodPaginacion = [];
    this.detalleconsultalotesbod = [];
    this.detalleconsultalotesPaginacion = [];
    this.detalleconsultalotes = [];

    let codigo = this.FormConsultaLotes.controls.codigo.value;
    codigo = codigo===null?'':codigo;
    let lote = this.FormConsultaLotes.controls.lote.value;
    lote = lote===null?'':lote;
    let descprod = this.FormConsultaLotes.controls.descripcion.value;
    descprod = descprod===null?'':descprod;

    if( codigo === '' && lote === '' ){
      /** busqueda masiva lote */
      this.tipo = 0;
      this.BusquedaDeLotesSistema();

    }else{
      if( codigo === '' && lote !== '' ){
        /** busqueda por lote */
        this.tipo = 1;
        this._BSModalRef = this._BsModalService.show(ModalbusquedadosComponent, this.setModalBusqueda("Busqueda de Producto"));
        this._BSModalRef.content.onClose.subscribe( Retorno => {


          if(Retorno !== undefined) {
            this.producto = Retorno;

            this.setGrillas();

          }
        });

      } else if( codigo !== '' && lote === ''  && descprod !== ''  ){
        /** busqueda por cod producto */
        this.tipo = 2;

        this.BusquedaDeLotesSistema();

      } else if( codigo !== '' && lote !== '' && descprod !== ''  ){
        /** busqueda por cod producto y lote */
        this.tipo = 3;

        this.BusquedaDeLotesSistema();

      }
    }
  }

  setModalBusqueda(titulo: string) {
    let prefechad = this.FormConsultaLotes.controls.fechadesde.value;
    let prefechah = this.FormConsultaLotes.controls.fechahasta.value===null?new Date():this.FormConsultaLotes.controls.fechahasta.value;
    let fechad = this.datePipe.transform(prefechad, 'dd-MM-yyyy');
    let fechah = this.datePipe.transform(prefechah, 'dd-MM-yyyy');

    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-ml',
      initialState: {
        titulo    : titulo,
        hdgcodigo : this.hdgcodigo,
        esacodigo : this.esacodigo,
        cmecodigo : this.cmecodigo,
        lote      : this.FormConsultaLotes.controls.lote.value,
        servidor  : this.servidor,
        fechadesde: fechad,
        fechahasta: fechah,
        tipo      : this.tipo,
        meinidpantprincipal: this.meinid,
        usuario   : this.usuario,
      }
    };
    return dtModal;
  }

  setModalBusquedaProductoLote(titulo: string, dato: any) {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-ml',
      initialState: {
        titulo: titulo,
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        lote     : dato.nombre,
        fechavencimiento : dato.fechavencimiento,
        servidor : this.servidor,
        fechadesde: this.datos.fechadesde,
        fechahasta: this.datos.fechahasta,
        tipo  : this.tipo,
        meinid1 : this.meinid,
        usuario: this.usuario,
      }
    };
    return dtModal;
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.detalleconsultalotesPaginacion = this.detalleconsultalotes.slice(startItem, endItem);
  }

  pageChangedBod(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.detalleconsultalotesbodPaginacion = this.detalleconsultalotesbod.slice(startItem, endItem);
  }

  pageChangedLotes(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.datoslotesPaginacion = this.datoslotes.slice(startItem, endItem);
  }

  limpiar(){
    this.FormConsultaLotes.reset();
    this.meinid = 0;
    this.tipo = 0;
    this.detalleconsultalotes = [];
    this.detalleconsultalotesbod = [];
    this.detalleconsultalotesbodPaginacion = [];
    this.detalleconsultalotesPaginacion = [];
    this.FormConsultaLotes.get('fechahasta').setValue(new Date());

    this.datoslotes = [];
    this.datoslotesPaginacion = [];
    this.lote = null;
    this.meinidpantprincipal = null;

  }

  SeleccionLote(dato: BuscaLotesSistema){

    this.FormConsultaLotes.controls.lote.setValue(dato.nombre);
    this.lote = this.FormConsultaLotes.controls.lote.value;

    let fechadesde = this.datePipe.transform(this.FormConsultaLotes.controls.fechadesde.value, 'dd-MM-yyyy');
    let fechahasta =  this.datePipe.transform(this.FormConsultaLotes.controls.fechahasta.value, 'dd-MM-yyyy');
    this.fechadesde = fechadesde;
    this.fechahasta = fechahasta;

    this.meinidpantprincipal = this.meinid;

    switch (this.tipo) {
      case 0:
        this.meinid = dato.meinid;
        this.lote = dato.nombre;
        this.datos.cmecodigo = this.cmecodigo;
        this.datos.esacodigo = this.esacodigo;
        this.datos.fechadesde = this.fechadesde;
        this.datos.fechahasta = this.fechahasta;
        this.datos.hdgcodigo = this.hdgcodigo;
        this.datos.lote = this.lote;
        this.datos.meinid1 = this.meinid;
        this.datos.servidor = this.servidor;
        this.datos.tipo = 0;
        this.datos.titulo = "Busqueda de Productos";
        this.datos.usuario = this.usuario;
        /** modal busqueda producto */
        this._BSModalRef = this._BsModalService.show(ModalbusquedadosComponent , this.setModalBusquedaProductoLote("Busqueda de Productos",dato));
        this._BSModalRef.content.onClose.subscribe((Retorno: any) => {
          this.producto = Retorno;
          this.setGrillas();
        });
        break;
      case 2:
        this.meinid = this.meinidpantprincipal;
        this.lote = dato.nombre;
        this.codigo = dato.codmei;
        this.descrip = dato.meindescri;
        this.getDataproducto();
        break;
      default:
        break;
    }
  }

  getDataproducto() {
    this._buscabodegasService.ConsumoLotes(this.servidor,this.usuario,this.hdgcodigo,
      this.esacodigo,this.cmecodigo,this.lote,this.meinid,this.fechadesde,this.fechahasta,
        0).subscribe(response => {

          this.producto = new ConsultaConsumoLote();
          this.producto.codigo = this.codigo;
          this.producto.descripcion = this.descrip;
          this.producto.lote = this.lote;
          this.producto.detalleconsulta = response;
          this.setGrillas();

      })

  }

  /**
   * tipo busqueda
   * 0 = masiva
   * 1 = lote
   * 2 = producto
   * 3 = lote y producto
   */
  BusquedaDeLotesSistema(){

    if( this.tipo === 0 ){
      this.lote = null;
      this.meinidpantprincipal = null;

    }else if( this.tipo === 1 ){
      this.lote = this.FormConsultaLotes.controls.lote.value;
      this.meinidpantprincipal = null;

    }else if( this.tipo === 2 ){
      this.meinidpantprincipal = this.meinid;
      this.lote = null;

    }else if( this.tipo === 3 ){
      this.meinidpantprincipal = this.meinid;
      this.lote = this.FormConsultaLotes.controls.lote.value;
      this.codigo = this.FormConsultaLotes.controls.codigo.value;
      this.descrip = this.FormConsultaLotes.controls.descripcion.value;
      let fechadesde = this.datePipe.transform(this.FormConsultaLotes.controls.fechadesde.value, 'dd-MM-yyyy');
      let fechahasta =  this.datePipe.transform(this.FormConsultaLotes.controls.fechahasta.value, 'dd-MM-yyyy');
      this.fechadesde = fechadesde;
      this.fechahasta = fechahasta;
      this.getDataproducto();
      return;


    }else { return; }

    this._buscabodegasService.BuscaLotesDelSistema(this.servidor,this.hdgcodigo,this.esacodigo,
    this.cmecodigo, this.lote,this.meinidpantprincipal, "", "", "",-1).subscribe(response => {
      this.datoslotes = response;
      this.datoslotesPaginacion = this.datoslotes.slice(0,20);
      }
    )
  }

  setGrillas() {
    let sindatos = false;

    /** limpia grillas */
    this.detalleconsultalotesbodPaginacion = [];
    this.detalleconsultalotesPaginacion = [];
    this.datoslotesPaginacion = [];

    /** setea campos producto */
    this.FormConsultaLotes.controls.codigo.setValue(this.producto.codigo);
    this.FormConsultaLotes.controls.descripcion.setValue(this.producto.descripcion);
    this.FormConsultaLotes.controls.lote.setValue(this.producto.lote);

    /** completa grilla bodega */
    this.producto.detalleconsulta.forEach(x=>{
      if(x.mensaje === "Sin Datos" ){
        sindatos = true;

      } else{
        if(x.clinumidentificacion === " "){
          this.detalleconsultalotesbod.push(x);
        }else{
          this.detalleconsultalotes.push(x);
        }
      }
    })

    /** controla si no trae datos */
    if( sindatos ){
      this.alertSwalAlert.title = "No existe información para el producto seleccionado";
      this.alertSwalAlert.show();
      return;

    }else {
      /** pedir producto con datos bodega  */
      this.detalleconsultalotesbodPaginacion = this.detalleconsultalotesbod.slice(0,20);
      this.detalleconsultalotesPaginacion = this.detalleconsultalotes.slice(0,20)

    }

  }

}
