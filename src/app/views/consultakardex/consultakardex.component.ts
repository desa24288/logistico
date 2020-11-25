import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { environment } from '../../../environments/environment';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BodegasService } from '../../servicios/bodegas.service';
import { BodegaDestino } from '../../models/entity/BodegaDestino';
import { BusquedaproductosComponent } from '../busquedaproductos/busquedaproductos.component';
import { Periodo } from '../../models/entity/Periodo';
import { PeriodoService } from '../../servicios/Periodo.service';
import { ConsultaKardex } from '../../models/entity/ConsultaKardex';
import { ConsultakardexService} from '../../servicios/consultakardex.service';
import { InventariosService } from 'src/app/servicios/inventarios.service';
import { PeriodoCierreKardex } from '../../models/entity/PeriodoCierreKardex';
import { InformesService } from '../../servicios/informes.service';
import { BusquedaproductosService } from 'src/app/servicios/busquedaproductos.service';

@Component({
  selector: 'app-consultakardex',
  templateUrl: './consultakardex.component.html',
  styleUrls: ['./consultakardex.component.css'],
  providers : [ConsultakardexService,InformesService]
})
export class ConsultakardexComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  // @ViewChild('alertSwalGrilla', { static: false }) alertSwalGrilla: SwalComponent;
  public FormConsultaKardex  : FormGroup;
  public FormDetalleKardex   : FormGroup;
  public bodegasdestino      : Array<BodegaDestino> = [];
  public hdgcodigo           : number;
  public esacodigo           : number;
  public cmecodigo           : number;
  public saldo               : number = 0;
  public locale              = 'es';
  public bsConfig            : Partial<BsDatepickerConfig>;
  public colorTheme          = 'theme-blue';
  private _BSModalRef        : BsModalRef;
  public servidor            = environment.URLServiciosRest.ambiente;
  public usuario             = environment.privilegios.usuario;
  public periodos            : Periodo[];
  public datoskardex         :Array<ConsultaKardex>=[];
  public datoskardexpaginacion: Array<ConsultaKardex>=[];
  public _PageChangedEvent   : PageChangedEvent;
  public activbusqueda       : boolean = false;
  public periodosmedskardex  : PeriodoCierreKardex[] = [];
  public muestracoddes       : boolean = false;
  public periodo             : number;
  public btnimprime          : boolean = false;
  public muestragrillacoddes : boolean = false;
  public meinid              : number = 0;
  public todoslosprod        : boolean = false;
  public loading             = false;
  descprod: any;
  codprod: any;
  public codigoproducto      = null;
  public descriproducto      = null;
  public mein                : number = 0;

  constructor(
    private formBuilder       : FormBuilder,
    public datePipe           : DatePipe,
    public localeService      : BsLocaleService,
    public _BodegasService    : BodegasService,
    public _BsModalService    : BsModalService,
    private PeriodoService    : PeriodoService,
    private _inventarioService: InventariosService,
    private _imprimelibroService  : InformesService,
    private _consultakardexService: ConsultakardexService,
    public _BusquedaproductosService: BusquedaproductosService,

  ) {

    this.FormConsultaKardex = this.formBuilder.group({
      
      hdgcodigo   : [{ value: null, disabled: false }, Validators.required],
      esacodigo   : [{ value: null, disabled: false }, Validators.required],
      cmecodigo   : [{ value: null, disabled: false }, Validators.required],
      periodo     : [{ value: null, disabled: false }, Validators.required],      
      codigo      : [{ value: null, disabled: false }, Validators.required],
      descripcion : [{ value: null, disabled: false }, Validators.required],
      boddestino  : [{ value: null, disabled: false }, Validators.required],
      saldoperant : [{ value: null, disabled: true }, Validators.required],
      marca       : [{ value: null, disabled: false }, Validators.required]
    });
    this.FormDetalleKardex = this.formBuilder.group({
      
      fecha            : [{ value: null, disabled: true }, Validators.required],
      hora             : [{ value: null, disabled: true }, Validators.required],
      usuario          : [{ value: null, disabled: true }, Validators.required],
      bodorigen        : [{ value: null, disabled: true }, Validators.required],      
      boddestino       : [{ value: null, disabled: true }, Validators.required],
      rutproveedor     : [{ value: null, disabled: true }, Validators.required],
      proveedordesc    : [{ value: null, disabled: true }, Validators.required],
      tipodocumentodes : [{ value: null, disabled: true }, Validators.required],
      idsolicitud      : [{ value: null, disabled: true }, Validators.required],
      numerodocumento  : [{ value: null, disabled: true }, Validators.required],
      numeroreceta     : [{ value: null, disabled: true }, Validators.required],
      numeroboleta     : [{ value: null, disabled: true }, Validators.required],
      rutpaciente      : [{ value: null, disabled: true }, Validators.required],
      nombrepaciente   : [{ value: null, disabled: true }, Validators.required],
      tipomovimdes     : [{ value: null, disabled: true }, Validators.required],
      stockanterior    : [{ value: null, disabled: true }, Validators.required],
      stocknuevo       : [{ value: null, disabled: true }, Validators.required],
      valcosanterior   : [{ value: null, disabled: true }, Validators.required],
      valcosnuevo      : [{ value: null, disabled: true }, Validators.required],
      valventanterior  : [{ value: null, disabled: true }, Validators.required],
      valventnuevo     : [{ value: null, disabled: true }, Validators.required],
      bodexteriororig  : [{ value: null, disabled: true }, Validators.required],
      bodexteriordest  : [{ value: null, disabled: true }, Validators.required],
      observaciones    : [{ value: null, disabled: true }, Validators.required],
      tipoprestamo     : [{ value: null, disabled: true }, Validators.required]
      
    });

  }

  ngOnInit() {

    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();
    this.BuscaBodegaDestino();
    this.setDate();

    // this.PeriodoService.list(this.usuario,this.servidor).subscribe(
    //   data => {
    //     this.periodos = data;
    //     console.log("periodod",this.periodos);
    //   }, err => {
    //     console.log(err.error);
    //   }
    // );

  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  onCancel() {
    this.FormDetalleKardex.reset();
  }

  BuscaBodegaDestino() {
    
    this._BodegasService.listaBodegaDestinoSucursal(this.hdgcodigo, this.esacodigo, this.cmecodigo,this.usuario, this.servidor).subscribe(
      response => {
       
        this.bodegasdestino = response;
      },
      error => {
        alert("Error al Buscar Bodegas de Destino");
      }
    );
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.datoskardexpaginacion = this.datoskardex.slice(startItem, endItem);
  }

  ActivaBotonBusqueda(bodcodigo: number,periodo:number){
    this.activbusqueda= true;
    console.log("Activa btn",this.FormConsultaKardex.value.periodo,periodo,this.codigoproducto,this.descriproducto,this.mein, this.FormConsultaKardex.value.periodo)

    this.periodosmedskardex.forEach(element => {
      if(element.ckarid == periodo ){
        this.periodo = element.ckarid;
       
      }
    })
    if(this.codigoproducto != null && this.descriproducto != null && this.FormConsultaKardex.value.periodo>=0){
      console.log("Hay productos en pantalla para buscar",this.codigoproducto,this.descriproducto,this.mein, this.FormConsultaKardex.value.periodo);
      this.BuscaDatosKardex(this.mein)
    }else{}
    
  }

  BuscaPeriodoBodega(codigobod: number){
    
    this._inventarioService.BuscaPeriodoMedBodegas(this.hdgcodigo, this.esacodigo,this.cmecodigo,
      this.servidor,this.usuario,codigobod).subscribe(
      response => {
        
        // this.activbusqueda= true;
        this.periodosmedskardex=response
        console.log("periodos",this.periodosmedskardex)
      },
      error => {
        console.log(error);
        alert("Error al Buscar Período");
      }
    );

    if(this.codigoproducto != null && this.descriproducto != null && this.FormConsultaKardex.value.boddestino >0){
      console.log("Hay productos en pantalla para buscar",this.codigoproducto,this.descriproducto,this.mein,this.FormConsultaKardex.value.boddestino);
      this.BuscaDatosKardex(this.mein)
    }else{}
  }

  BuscaProducto(){
    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModalBusquedaProductos());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) { }
      else {
       
        this.codigoproducto = response.codigo;
        this.descriproducto = response.descripcion;
        this.mein = response.mein;
        // this.FormConsultaKardex.get('codigo').setValue(response.codigo);
        // this.FormConsultaKardex.get('descripcion').setValue(response.descripcion);

        this.muestracoddes = true;
        // this.desactivaCampos(true);
        this.BuscaDatosKardex(response.mein)

      }
    });
  }

 

  setModalBusquedaProductos() {
    console.log("cod y desc",this.codprod, this.descprod)
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
        id_Bodega: this.FormConsultaKardex.value.boddestino,
        descprod: this.descprod,//
        codprod: this.codprod
      }
    };
    return dtModal;
  }
 
  BuscaDatosKardex(meinid: number){
    // console.log("dAts a buscar kardex",this.hdgcodigo,this.esacodigo,this.cmecodigo,this.servidor,
    // this.usuario,this.periodo, this.FormConsultaKardex.value.boddestino,meinid)

    this._inventarioService.ConsultaKardex(this.hdgcodigo, this.esacodigo,
      this.cmecodigo,this.servidor,this.usuario,this.periodo,
      this.FormConsultaKardex.value.boddestino,meinid).subscribe(
      response => {
        if(response.length == 0){
          this.datoskardex = [];
          this.datoskardexpaginacion = [];
          this.alertSwalAlert.title = "No existen Movimientos para el Producto Seleccionado";
          this.alertSwalAlert.show();
          this.FormConsultaKardex.get('codigo').setValue(response[0].meincodmei);
          this.FormConsultaKardex.get('descripcion').setValue(response[0].meincodmei);
          this.FormConsultaKardex.get('periodo').setValue(-1);
          
          // this.descriproducto = null;
          // this.codigoproducto = null;
          // this.periodosmedskardex = [];
          this.desactivaCampos(false);
          
        }else{
          if(response.length>0){
            // console.log("response 1 producto",response);
            this.meinid = meinid;
            this.datoskardex = response;
            this.datoskardexpaginacion = this.datoskardex.slice(0,50);
            this.muestracoddes = true;
            this.btnimprime =true;
            this.todoslosprod = false;
            this.FormConsultaKardex.get('codigo').setValue(response[0].meincodmei );
            this.FormConsultaKardex.get('descripcion').setValue(response[0].meindescri);
            
            this.desactivaCampos(true);
          }              
        }            
      }
    )

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
      var idBodega = this.FormConsultaKardex.value.boddestino;
      var consignacion = '';
      
      this._BusquedaproductosService.BuscarArituculosFiltros(this.hdgcodigo, this.esacodigo,
        this.cmecodigo, codigo, this.descprod, null, null, null, tipodeproducto, idBodega, controlminimo, controlado, consignacion
        , this.usuario, this.servidor).subscribe(
          response => {
            if (response.length == 0) {
              
              this.loading = false;
              this.BuscaProducto();
            }
            else {
              if (response.length > 0) {
                this.loading = false;
                // this.FormConsultaKardex.get('codigo').setValue(response[0].codigo);
                // this.FormConsultaKardex.get('descripcion').setValue(response[0].descripcion);
                this.codigoproducto = response[0].codigo;
                this.descriproducto = response[0].descripcion;
                this.mein           = response[0].mein
                this.BuscaDatosKardex(response[0].mein);
                // this.desactivaCampos(true);
                this.muestracoddes = true;

                // this.setProducto(response[0]);
              }
            }
          }, error => {
            this.loading = false;
            console.log('error');
          }
        );
    }
  }

  desactivaCampos(bool) {
    if (bool){
      this.FormConsultaKardex.controls.codigo.disable();
      this.FormConsultaKardex.controls.descripcion.disable();
    } else {
      this.FormConsultaKardex.controls.codigo.enable();
      this.FormConsultaKardex.controls.descripcion.enable();
    }
  }

  setDatabusqueda(value: any, swtch: number) {
    console.log(value);
    if (swtch === 1) {
        this.codprod = value;
    } else if (swtch === 2) {
        this.descprod = value;
    }
  }

  Limpiar(){
    this.FormConsultaKardex.reset();
    this.datoskardexpaginacion= [];
    this.datoskardex=[];
    this.activbusqueda = false;
    this.muestracoddes = false;
    this.muestragrillacoddes = false;
    this.btnimprime = false;
    this.periodosmedskardex = [];
    this.todoslosprod = false;
    this.desactivaCampos(false);
    this.codprod = null;
    this.descprod = null;
    this.codigoproducto = null;
    this.descriproducto = null;
  }

  cambio_check(tipo:string, event: any){
    // console.log("selecciona el check",this.periodo,tipo,event, event.target.checked)
    if(event.target.checked == true){
      this.todoslosprod = true;
      this.activbusqueda = false;
      this.datoskardexpaginacion = [];
      this.datoskardex = [];
      this.muestracoddes = false;
      this.meinid = 0;
      // console.log("buscará todos los productos", this.hdgcodigo, this.esacodigo,
      // this.cmecodigo,this.servidor,this.usuario,this.periodo,
      // this.FormConsultaKardex.value.boddestino,0)

      this.btnimprime =true;
      this.ImprimirLibro('pdf');
      // this._inventarioService.ConsultaKardex(this.hdgcodigo, this.esacodigo,
      //   this.cmecodigo,this.servidor,this.usuario,this.periodo,
      //   this.FormConsultaKardex.value.boddestino,0).subscribe(
      //     response => {
      //       if(response.length == 0){
      //         console.log("resultado busqueda",response)
      //         this.alertSwalAlert.title = "No existen Movimientos para el Producto Seleccionado";
      //         this.alertSwalAlert.show();
    
      //       }else{
      //         if(response.length>0){
      //           console.log("PErido todos los productos:", response)
      //           this.btnimprime =true;
      //           this.datoskardex = response;
      //           this.datoskardexpaginacion = this.datoskardex.slice(0,50);
      //           this.muestragrillacoddes = true;
      //           this.FormConsultaKardex.get('codigo').setValue(response[0].meincodmei );
      //           this.FormConsultaKardex.get('descripcion').setValue(response[0].meindescri);
      //           this.meinid = response[0].meinid;
      //         }          
      //       }        
      //     }
      //   )

    }else{
      if(event.target.checked == false){
        // console.log("falso",event.target.checked)
        // this.todoslosprod = false;
        this.activbusqueda = false;
        this.btnimprime = false;
        this.datoskardex = [];
        this.muestragrillacoddes = false;
        this.datoskardexpaginacion = [];
        this.FormConsultaKardex.reset();
        this.periodosmedskardex = [];
        // console.log("check desactivado",this.FormConsultaKardex,this.datoskardex,this.datoskardexpaginacion,this.periodosmedskardex)
      }
    }
  } 

  onConfirm(){
    this.FormDetalleKardex.reset();
  }

  onImprimir(tiporeporte: string){
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Kardex?',
      text: "Confirmar Impresión",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.ImprimirLibro(tiporeporte);
      }
    })    

  }

  ImprimirLibro(tiporeporte: string) {

    // console.log("Imprime el reporte de consulta de kardex",this.servidor,this.usuario,
    // this.hdgcodigo,this.esacodigo, this.cmecodigo,this.periodo,
    // this.FormConsultaKardex.value.boddestino,this.meinid, tiporeporte,this.todoslosprod);
    if(tiporeporte=="pdf"){
      if(this.todoslosprod ==false){
        // console.log("imprime un solo producto",this.meinid)
        this._imprimelibroService.RPTImprimeConsultaKardex(this.servidor,this.usuario,
        this.hdgcodigo,this.esacodigo, this.cmecodigo,"pdf",this.periodo,
        this.FormConsultaKardex.value.boddestino,this.meinid).subscribe(
          response => {
            console.log("Imprime Solicitud producto", response);
            window.open(response[0].url, "", "", true);
            // this.alertSwal.title = "Reporte Impreso Correctamente";
            // this.alertSwal.show();
          },
          error => {
            console.log(error);
            this.alertSwalError.title = "Error al Imprimir Consulta de Kardex";
            this.alertSwalError.show();
            this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
            })
          }
        );
      }else{
        if(this.todoslosprod == true){
          // console.log("imprime todos los productos",this.servidor,this.usuario,
          // this.hdgcodigo,this.esacodigo, this.cmecodigo,"pdf",this.periodo,
          // this.FormConsultaKardex.value.boddestino,0)
          this._imprimelibroService.RPTImprimeConsultaKardex(this.servidor,this.usuario,
          this.hdgcodigo,this.esacodigo, this.cmecodigo,"pdf",this.periodo,
          this.FormConsultaKardex.value.boddestino,0).subscribe(
            response => {
              // console.log("Imprime Solicitud", response);
              window.open(response[0].url, "", "", true);
              // this.alertSwal.title = "Reporte Impreso Correctamente";
              // this.alertSwal.show();
            },
            error => {
              console.log(error);
              this.alertSwalError.title = "Error al Imprimir Consulta de Kardex";
              this.alertSwalError.show();
              this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
              })
            }
          );
        }
      }
      
    }else{
      if(tiporeporte == "xls"){
        if(this.todoslosprod ==false){
          // console.log("Imprime reporte en excel",tiporeporte)
          this._imprimelibroService.RPTImprimeConsultaKardex(this.servidor,this.usuario,
          this.hdgcodigo,this.esacodigo, this.cmecodigo,"xls",this.periodo,
          this.FormConsultaKardex.value.boddestino,this.meinid).subscribe(
            response => {
              // console.log("Imprime Solicitud", response);
              window.open(response[0].url, "", "", true);
              // this.alertSwal.title = "Reporte Impreso Correctamente";
              // this.alertSwal.show();
            },
            error => {
              console.log(error);
              this.alertSwalError.title = "Error al Imprimir Consulta de Kardex";
              this.alertSwalError.show();
              this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
              })
            }
          );
        }else{
          if(this.todoslosprod == true){
            // console.log("imprime todos los productos")
            this._imprimelibroService.RPTImprimeConsultaKardex(this.servidor,this.usuario,
            this.hdgcodigo,this.esacodigo, this.cmecodigo,"xls",this.periodo,
            this.FormConsultaKardex.value.bodcodigo,0).subscribe(
              response => {
                console.log("Imprime Solicitud", response);
                window.open(response[0].url, "", "", true);
                this.todoslosprod = false;
                // this.alertSwal.title = "Reporte Impreso Correctamente";
                // this.alertSwal.show();
              },
              error => {
                console.log(error);
                this.alertSwalError.title = "Error al Imprimir Devolución Solicitud";
                this.alertSwalError.show();
                this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
                })
              }
            );
          }
        }
      }
    }    
  }
}
