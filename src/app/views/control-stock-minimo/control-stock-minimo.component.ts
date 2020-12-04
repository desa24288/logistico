import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { TipoRegistro } from '../../models/entity/TipoRegistro';
import { TiporegistroService } from '../../servicios/tiporegistro.service';
import { BodegasService } from '../../servicios/bodegas.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { DatePipe } from '@angular/common';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BodegasTodas } from 'src/app/models/entity/BodegasTodas';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BodegaSolicitante } from 'src/app/models/entity/bodega-solicitante';
import { BusquedaproductosComponent } from '../busquedaproductos/busquedaproductos.component';
import { ControlStockMinimo } from 'src/app/models/entity/control-stock-minimo';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-control-stock-minimo',
  templateUrl: './control-stock-minimo.component.html',
  styleUrls: ['./control-stock-minimo.component.css'],
  providers: []
})
export class ControlStockMinimoComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;


  public FormControlMinimo: FormGroup;

  public tiposderegistros: Array<TipoRegistro> = [];
  public bodegasSolicitantes: Array<BodegaSolicitante> = [];
  public bodegassuministro: Array<BodegasTodas> = [];
  public arreglomovimientos: Array<ControlStockMinimo> = [];
  public arreglomovimientosPaginacion: Array<ControlStockMinimo> = [];

  public hdgcodigo: number;
  public esacodigo: number;
  public cmecodigo: number;

  public servidor = environment.URLServiciosRest.ambiente;
  public usuario = environment.privilegios.usuario;
  private _BSModalRef: BsModalRef;
  public _PageChangedEvent: PageChangedEvent;

  public locale = 'es';
  public bsConfig: Partial<BsDatepickerConfig>;
  public colorTheme = 'theme-blue';

  public loading = false;
  public buscaplantilla = false;
  public existesolicitud: boolean = false;

  editField: string;

  constructor(
    private TiporegistroService: TiporegistroService,
    private _BodegasService: BodegasService,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public localeService: BsLocaleService,
    public _BsModalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,) {
    this.FormControlMinimo = this.formBuilder.group({
      mein: [{ value: null, disabled: false }, Validators.required],
      codigo: [{ value: null, disabled: false }, Validators.required],
      hdgcodigo: [{ value: null, disabled: false }, Validators.required],
      esacodigo: [{ value: null, disabled: false }, Validators.required],
      cmecodigo: [{ value: null, disabled: false }, Validators.required],
      tiporegistro: [{ value: null, disabled: false }, Validators.required],
      bodcodigo: [{ value: null, disabled: false }, Validators.required],
      codbodegasuministro: [{ value: null, disabled: false }, Validators.required],
      fechadesde: [new Date(), Validators.required],
      fechahasta: [new Date(), Validators.required],
      chequeatodo: [{ value: null, disabled: false }, Validators.required],
      tiporeposicion: [{ value: null, disabled: false }, Validators.required],
      nombrearticulo: [{ value: null, disabled: false }, Validators.required],
      id_articulo: [{ value: null, disabled: false }, Validators.required]
    }
    );
  }

  ngOnInit() {

    this.setDate();
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();

   

    this.TiporegistroService.list(this.usuario, this.servidor).subscribe(
      data => {
        this.tiposderegistros = data;
      }, err => {
        console.log(err.error);
      }
    );


    // Cargamos la combobox de Bodegas de suministro

    this.BuscaBodegasSuministro();


    this.route.paramMap.subscribe(param => {
      if (param.has("id_suministro")) {
        this.FormControlMinimo.get('codbodegasuministro').setValue(parseInt(param.get("id_suministro"), 10));
        this.BuscaBodegasSolicitantes(parseInt(param.get("id_suministro"), 10));
      }
      if (param.has("id_tipoproducto")) {
        this.FormControlMinimo.get('tiporegistro').setValue(param.get("id_tipoproducto"));
      }

      if (param.has("id_solicita")) {
        this.FormControlMinimo.get('bodcodigo').setValue(parseInt(param.get("id_solicita"), 10));
      }

      if (param.has("fechadesde")) {
        this.FormControlMinimo.get('fechadesde').setValue(new Date(param.get("fechadesde")));


      }
      if (param.has("fechahasta")) {
        this.FormControlMinimo.get('fechahasta').setValue(new Date(param.get("fechahasta")));

      }
      if (param.has("id_articulo")) {
        this.FormControlMinimo.get('id_articulo').setValue(parseInt(param.get("id_articulo"), 10));
      }
      if (param.has("desc_articulo")) {
        this.FormControlMinimo.get('nombrearticulo').setValue(param.get("desc_articulo"));
      }
      if (param.has("id_suministro")) {
        this._BodegasService.buscabodegacontrolstockminimo(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor,
          this.datePipe.transform(this.FormControlMinimo.value.fechadesde, 'yyyy-MM-dd'), this.datePipe.transform(this.FormControlMinimo.value.fechahasta, 'yyyy-MM-dd')
          , this.FormControlMinimo.value.bodcodigo, this.FormControlMinimo.value.codbodegasuministro, this.FormControlMinimo.value.id_articulo).subscribe(
            data => {
              this.arreglomovimientos = data;
              this.arreglomovimientosPaginacion = this.arreglomovimientos.slice(0,20);
            }, err => {
              console.log(err.error);
            }
          )
      }

    })




  }



  setModalProductos() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Productos Controlados Por Bodega', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        tipo_busqueda: 'Productos_Bodega_Control_Minimo',
        id_Bodega: this.FormControlMinimo.value.bodcodigo
      }
    };
    return dtModal;
  }


  BuscarProducto() {


    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModalProductos());
    this._BSModalRef.content.onClose.subscribe((RetornoProductos: any) => {
      if (RetornoProductos == undefined) { }
      else {

        this.FormControlMinimo.get("nombrearticulo").setValue(RetornoProductos.descripcion);
        this.FormControlMinimo.get("id_articulo").setValue(RetornoProductos.mein);


        this._BodegasService.buscabodegacontrolstockminimo(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor,
          this.datePipe.transform(this.FormControlMinimo.value.fechadesde, 'yyyy-MM-dd'), this.datePipe.transform(this.FormControlMinimo.value.fechahasta, 'yyyy-MM-dd')
          , this.FormControlMinimo.value.bodcodigo, this.FormControlMinimo.value.codbodegasuministro, RetornoProductos.mein).subscribe(
            data => {
              this.arreglomovimientos = data;
              this.arreglomovimientosPaginacion = this.arreglomovimientos.slice(0, 20);
            }, err => {
              console.log(err.error);
            }
          )


      }


    }
    );


  }



  
  Buscar_General() {

        this._BodegasService.buscabodegacontrolstockminimo(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor,
          this.datePipe.transform(this.FormControlMinimo.value.fechadesde, 'yyyy-MM-dd'), this.datePipe.transform(this.FormControlMinimo.value.fechahasta, 'yyyy-MM-dd')
          , this.FormControlMinimo.value.bodcodigo, this.FormControlMinimo.value.codbodegasuministro,0).subscribe(
            data => {
              this.arreglomovimientos = data;
              this.arreglomovimientosPaginacion = this.arreglomovimientos.slice(0, 20);
            }, err => {
              console.log(err.error);
            }
          );


      }

  /* llena combobox de bodegas perioféricas */
  BuscaBodegasSolicitantes(id_bodega_suministro: number) {


    this.bodegasSolicitantes = [];

    this._BodegasService.listaBodegaOrigenAccion(this.hdgcodigo, this.esacodigo, this.cmecodigo,
      this.usuario, this.servidor, id_bodega_suministro, 1).subscribe(
        data => {
          this.bodegasSolicitantes = data;

        }, err => {
          console.log(err.error);
        }
      );
  }


  BuscaBodegasSuministro() {

    this._BodegasService.listaBodegaTodasSucursal(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor).subscribe(
      data => {
        this.bodegassuministro = data;
      }, err => {
        console.log(err.error);
      }
    );
  }


  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.arreglomovimientosPaginacion = this.arreglomovimientos.slice(startItem, endItem);
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }


  limpiar() {
    this.FormControlMinimo.reset();
    this.FormControlMinimo.get('fechadesde').setValue(new Date());
    this.FormControlMinimo.get('fechahasta').setValue(new Date());
    this.arreglomovimientosPaginacion=[];
    this.arreglomovimientos= [];
    this.buscaplantilla = false;
  }


  EditarDespacho(id_solicitud: number) {




    var fecha_inicio= new Date();
    var fecha_termino= new Date();

    fecha_inicio =  this.FormControlMinimo.value.fechadesde;
    fecha_termino = this.FormControlMinimo.value.fechahasta;

    
    this.router.navigate(['despachosolicitudes', id_solicitud, 'controlstockminimo', this.FormControlMinimo.value.codbodegasuministro,
      this.FormControlMinimo.value.tiporegistro, this.FormControlMinimo.value.bodcodigo, 
      fecha_inicio.toString(), fecha_termino.toString(),
      0, '*']);
  }



salir() {
  this.router.navigate(['home']);
}

}
