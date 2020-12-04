import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BodegasDespachadoras } from 'src/app/models/entity/BodegasDespachadoras';
import { BodegasService } from '../../servicios/bodegas.service';
import { InformesService } from '../../servicios/informes.service';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BodegasControladas } from '../../models/entity/BodegasControladas';
import { LibrocontroladoService } from 'src/app/servicios/librocontrolado.service';
import { LibroControlado } from 'src/app/models/entity/LibroControlado';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Permisosusuario } from '../../permisos/permisosusuario';
import { BodegasTodas } from 'src/app/models/entity/BodegasTodas';
import { InventariosService } from 'src/app/servicios/inventarios.service';
import { BusquedaproductosService } from 'src/app/servicios/busquedaproductos.service';
import { Articulos } from 'src/app/models/entity/mantencionarticulos';


@Component({
  selector: 'app-cierrekardex',
  templateUrl: './cierrekardex.component.html',
  styleUrls: ['./cierrekardex.component.css'],
  providers: [LibrocontroladoService,InformesService]

})
export class CierrekardexComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public modelopermisos              : Permisosusuario = new Permisosusuario();
  public FormCierreKardex            : FormGroup;
  public bodegascontroladas          : BodegasControladas[] = [];
  public hdgcodigo                   : number;
  public esacodigo                   : number;
  public cmecodigo                   : number;
  public usuario                     = environment.privilegios.usuario;
  public servidor                    = environment.URLServiciosRest.ambiente;
  private _BSModalRef                : BsModalRef;
  public activbusqueda               : boolean = false;
  public imprimecierrekardex         : boolean = false;
  public cierrakardex                : boolean = false;
  public loading                     : boolean = false;
  public locale                      = 'es';
  public bsConfig                    : Partial<BsDatepickerConfig>;
  public colorTheme                  = 'theme-blue';
  bsModalRef                         : any;
  editField                          : any;
  public bodegasSolicitantes         : Array<BodegasTodas> = [];
  public prodsbodegaskardex          : LibroControlado[] = [];
  public prodsbodegaskardexpaginacion: LibroControlado[] = [];

  constructor(
    public formBuilder            : FormBuilder,
    public _BodegasService        : BodegasService,
    public localeService          : BsLocaleService,
    private _inventarioService: InventariosService,
    private _imprimelibroService  : InformesService,
    public _BusquedaproductosService: BusquedaproductosService,

  ) 
  {
    this.FormCierreKardex = this.formBuilder.group({
      codigo      : [{ value: null, disabled: false }, Validators.required],
      fecha       : [{ value: new Date(), disabled: false }, Validators.required],
      bodcodigo   : [{ value: null, disabled: false }, Validators.required],
      cantidad    : [{ value: null, disabled: false }, Validators.required],
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
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();
    this.BuscaBodegaDespachadora();
  }

  limpiar(){
    this.FormCierreKardex.reset();
    this.activbusqueda= false;
    this.prodsbodegaskardexpaginacion = [];
    this.prodsbodegaskardex= [];
    this.cierrakardex = false;
    this.imprimecierrekardex = false;
    this.FormCierreKardex.get('fecha').setValue(new Date());
  }

  BuscaBodegaDespachadora(){
    this._BodegasService.listaBodegaTodasSucursal(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor).subscribe(
      response => {
        this.bodegasSolicitantes = response;
      },
      error => {
        alert("Error al Buscar Bodegas de cargo");
      }
    );
    
  }

  ActivaBotonBusqueda(){
    this.activbusqueda= true;
  }

  BuscarProductos(){
    // console.log("Busca productos de la bodega",this.servidor, this.hdgcodigo,this.esacodigo,
    // this.cmecodigo,this.FormLibroControlado.value.bodcodigo);
    this.loading = true;

    this._BodegasService.BuscaProductoBodegaControl(this.servidor,this.hdgcodigo, this.esacodigo, 
    this.cmecodigo,this.FormCierreKardex.value.bodcodigo ).subscribe(
      response => {
        console.log("Busca productos en Bodegas para cierre kardex",response)
        this.prodsbodegaskardex = response;
        this.prodsbodegaskardexpaginacion = this.prodsbodegaskardex.slice(0,20);
        this.cierrakardex = true;
      },
      error => {
        alert("Error al Buscar productos en Bodegas");
      }
    );
  }

  /* Función búsqueda con paginación */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.prodsbodegaskardexpaginacion = this.prodsbodegaskardex.slice(startItem, endItem);
  }

  ConfirmaGenerarCierreKardex(){
   
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Desea Grabar el Cierre De Kardex?',
      text: "Confirmar la grabación ",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.GrabaCierreKardex();
      }
    })
  }

  GrabaCierreKardex(){
    console.log("Dato a grabar en el cierre",this.hdgcodigo, this.esacodigo, 
    this.cmecodigo,this.servidor,this.usuario,this.FormCierreKardex.value.bodcodigo);

    this._inventarioService.GrabaCierreKardex(this.hdgcodigo, this.esacodigo, 
      this.cmecodigo,this.servidor,this.usuario,this.FormCierreKardex.value.bodcodigo ).subscribe(
        response => {
          console.log("Resultado Grabacion cierre",response)
          this.alertSwal.title = "Kardex Cerrado Exitosamente";
          this.alertSwal.show();
          this.imprimecierrekardex = true;
          this.cierrakardex= false;
          // this.prodsbodegascontroladas = response;
          // this.prodsbodegascontroladaspaginacion = this.prodsbodegascontroladas.slice(0,11);
        },
        error => {
          this.alertSwalError.title = "Error al Grabar Cierre De Kardex";
          this.alertSwalError.text = error;
          this.alertSwalError.show();
        }
      );
  

  }

  onImprimir(){
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Cierre Kardex?',
      text: "Confirmar Impresión",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.ImprimirLibro();
      }
    })    

  }

  ImprimirLibro() {

    console.log("Imprime el reporte de Cierre kardex",this.servidor,this.usuario,
    this.hdgcodigo,this.esacodigo, this.cmecodigo,"pdf", this.FormCierreKardex.value.bodcodigo);

    this._imprimelibroService.RPTImprimeCierreKardex(this.servidor,this.usuario,
    this.hdgcodigo,this.esacodigo, this.cmecodigo,"pdf",this.FormCierreKardex.value.bodcodigo).subscribe(
      response => {
        console.log("Imprime Cierre", response);
        window.open(response[0].url, "", "", true);
        // this.alertSwal.title = "Reporte Impreso Correctamente";
        // this.alertSwal.show();
      },
      error => {
        console.log(error);
        this.alertSwalError.title = "Error al Imprimir Cierre";
        this.alertSwalError.show();
        // this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
        // })
      }
    );
  }
}
