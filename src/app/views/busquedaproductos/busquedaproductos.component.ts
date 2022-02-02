import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BusquedaproductosService } from 'src/app/servicios/busquedaproductos.service';
import { Articulos } from 'src/app/models/entity/mantencionarticulos';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, PageChangedEvent } from 'ngx-bootstrap';
import { AlertComponent } from 'ngx-bootstrap/alert/public_api';
import { FormaFar } from '../../models/entity/FormaFar'
import { FormaFarService } from 'src/app/servicios/formafar.service';
import { Presenta } from '../../models/entity/Presenta'
import { PresentaService } from 'src/app/servicios/presenta.service';
import { PrincAct } from '../../models/entity/PrincAct'
import { PrincActService } from 'src/app/servicios/PrincAct.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BodegasService } from '../../servicios/bodegas.service';
import { TipoParametro } from 'src/app/models/entity/tipo-parametro';
import { ProductosBodegas } from 'src/app/models/entity/productos-bodegas';

@Component({
  selector: 'app-busquedaproductos',
  templateUrl: './busquedaproductos.component.html',
  styleUrls: ['./busquedaproductos.component.css']
})
export class BusquedaproductosComponent implements OnInit {
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalConfirmar', { static: false }) alertSwalConfirmar: SwalComponent;

  @Input() hdgcodigo: number;
  @Input() esacodigo: number;
  @Input() cmecodigo: number;
  @Input() titulo   : string;
  @Input() tipo_busqueda: string; // = "Todo","Todo-Medico","Medicamentos", "Insumos-Medicos", "Insumos_No_Medicos","Productos_Bodega","Productos_Bodega_Control_Minimo"
  @Input() id_Bodega: number;    // Búsqueda dentro de una bodega
  @Input() ambito   : number; // Recibe el ambito enviado desde solic pac
  @Input() codprod  : string; // codigo producto
  @Input() descprod : string; // descripcion producto
  @Input() bodega_productos : ProductosBodegas[];

  public onClose  : Subject<Articulos>;
  public estado   : boolean = false;
  public FormaFar : Array<FormaFar> = [];
  public Presenta : Array<Presenta> = [];
  public PrincAct : Array<PrincAct> = [];
  public detalleconsultaproducto: Array<Articulos> = [];
  public detalleconsultaproductopag: Array<Articulos> = [];
  public lForm    : FormGroup;
  public loading  = false;
  public usuario  = environment.privilegios.usuario;
  public servidor = environment.URLServiciosRest.ambiente;
  public arreglotipoproducto: TipoParametro[] = [];

  public codproducto  = null;
  public descproducto = null;

  /** mensaje y/o alertas */
  public alerts: any[] = [];

  constructor(
    public bsModalRef      : BsModalRef,
    public formBuilder     : FormBuilder,
    public _BusquedaproductosService: BusquedaproductosService,
    private FormaFarService: FormaFarService,
    private PresentaService: PresentaService,
    private PrincActService: PrincActService,
    private _buscabodegasService: BodegasService,

  ) {
    this.lForm = this.formBuilder.group({
      codigo: [{ value: null, disabled: false }, Validators.required],
      descripcion: [{ value: null, disabled: false }, Validators.required],
      codffar: [{ value: null, disabled: false }, Validators.required],
      codpres: [{ value: null, disabled: false }, Validators.required],
      codpact: [{ value: null, disabled: false }, Validators.required],
      tipoproducto:[{ value: null, disabled: false }, Validators.required],
    });
  }

  ngOnInit() {
    /**Operador ternario asigna null si var codprod/descprod desde pantalla padre vienen sin datos o Undefined */
    /* se usaron nuevas var globales ya que no es posible modificar los valores @Input() //@ML */
    if(this.codprod !== null) {
      this.codproducto = (this.codprod===undefined || this.codprod.toString().trim()==='')?null:this.codprod.toString();
    }
    if(this.descprod !== null) {
      this.descproducto = (this.descprod===undefined || this.descprod.trim()==='')?null:this.descprod;
    }
    /** */
    this.onClose = new Subject();
    this.FormaFarService.list(this.usuario, this.servidor).subscribe(
      data => {
        this.FormaFar = data;
      }, err => {
        console.log(err.error);
      }
    );

    this.PrincActService.list(this.usuario, this.servidor).subscribe(
      data => {
        this.PrincAct = data;
      }, err => {
        console.log(err.error);
      }
    );

    this.PresentaService.list(this.usuario, this.servidor).subscribe(
      data => {
        this.Presenta = data;
      }, err => {
        console.log(err.error);
      }
    );

    this._buscabodegasService.listatipoproducto(this.hdgcodigo, this.usuario, this.servidor).subscribe(
      response => {
        if (response != null){
          this.arreglotipoproducto = response;
        }
      });
  }

  async ngAfterViewInit() {
    /** Si var cod y desc vienen sin datos no realiza busqueda //@ML */
    if (this.codproducto === null && this.descproducto === null){
      return;
    } else {
      this.setBusqueda();
    }
  }

  async setBusqueda() {
    /** setea campos codigo o descripcion de producto y genera busqueda */
    this.lForm.get('codigo').setValue(this.codproducto);
    this.lForm.get('descripcion').setValue(this.descproducto);
    this.Buscarproducto(this.codproducto, this.descproducto, null, null, null);
  }

  Buscarproducto(codigo: string, descripcion: string, codpact: number, codpres: number, codffar: number) {
    var tipodeproducto = '';
    this.loading = true;
    var controlado = '';
    var controlminimo = '';
    var idBodega = 0;
    var consignacion = '';

    switch (this.tipo_busqueda) {
      case "Medicamentos":
              tipodeproducto = 'M';
              idBodega= this.id_Bodega;
              break;
      case "Insumos-Medicos":
              tipodeproducto = 'I';
              idBodega = this.id_Bodega;
              break;
      case "Insumos_No_Medicos":
              tipodeproducto = 'O';
              break;
      case "Todo-Medico":
              tipodeproducto = 'MIM';
              idBodega= this.id_Bodega;
              break;

      case "Controlado-Bodega":
              tipodeproducto = 'M';
              idBodega = this.id_Bodega;
              controlado='S';
              break;
      case "Productos_Bodega_Control_Minimo":
              tipodeproducto = 'MIM';
              controlminimo = 'S';
              idBodega = this.id_Bodega;
              break;
      default:
        tipodeproducto = 'O';
    }

    if(this.lForm.value.tipoproducto == 'M'){
      tipodeproducto = 'M';
    }else{
      if(this.lForm.value.tipoproducto == 'I'){
        tipodeproducto = 'I';
      }else{
        if(this.lForm.value.tipoproducto == 'T'){
          tipodeproducto = 'MIM';
        }
      }
    }

    this._BusquedaproductosService.BuscarArticulosFiltros(this.hdgcodigo, this.esacodigo,
      this.cmecodigo, codigo, descripcion, codpact, codpres, codffar, tipodeproducto, idBodega, controlminimo, controlado, consignacion
      , this.usuario, this.bodega_productos,this.servidor).subscribe(
        response => {
          if (response.length == 0) {
            this.loading = false;
            // this.alertSwalAlert.title = "Advertencia: ";
            // this.alertSwalAlert.text = "No existe coincidencia por el criterio buscado";
            // this.alertSwalAlert.show();
            response = [];
            //<
            this.mensaje('danger', 'Código no existe o no está asociado a la bodega ingresada', 3000);
          } else {
            if (response.length > 0) {
              this.detalleconsultaproducto = response;
              this.detalleconsultaproductopag = this.detalleconsultaproducto.slice(0, 8);
              this.loading = false;
            }
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

  onCerrar(Articulos: Articulos) {
    this.estado = true;
    this.onClose.next(Articulos);
    this.bsModalRef.hide();
  };

  onCerrarSalir() {
    this.estado = true;
    this.onClose.next();
    this.bsModalRef.hide();
  };

  /* Función búsqueda con paginación */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.detalleconsultaproductopag = this.detalleconsultaproducto.slice(startItem, endItem);
  }

  Limpiar() {
    this.lForm.reset();
    this.detalleconsultaproducto = [];
    this.detalleconsultaproductopag = [];
  }

  getProducto(codigo: any) {
    this.codprod = codigo;
    console.log(this.codprod,this.descprod);
    if (this.codprod === null || this.codprod === '') {
      return;
      // this.onBuscarProducto();
    } else {
    var tipodeproducto = '';
    this.loading = true;
    var controlado = '';
    var controlminimo = '';
    var idBodega = 0;
    var consignacion = '';

    switch (this.tipo_busqueda) {
      case "Medicamentos":
              tipodeproducto = 'M';
              idBodega= this.id_Bodega;
              break;
      case "Insumos-Medicos":
              tipodeproducto = 'I';
              idBodega = this.id_Bodega;
              break;
      case "Insumos_No_Medicos":
              tipodeproducto = 'O';
              break;
      case "Todo-Medico":
              tipodeproducto = 'MIM';
              idBodega= this.id_Bodega;
              break;

      case "Controlado-Bodega":
              tipodeproducto = 'M';
              idBodega = this.id_Bodega;
              controlado='S';
              break;
      case "Productos_Bodega_Control_Minimo":
              tipodeproducto = 'MIM';
              controlminimo = 'S';
              idBodega = this.id_Bodega;
              break;
      default:
        tipodeproducto = 'O';
    }

    if(this.lForm.value.tipoproducto == 'M'){
      tipodeproducto = 'M';
    }else{
      if(this.lForm.value.tipoproducto == 'I'){
        tipodeproducto = 'I';
      }else{
        if(this.lForm.value.tipoproducto == 'T'){
          tipodeproducto = 'MIM';
        }
      }
    }
    this._BusquedaproductosService.BuscarArticulosFiltros(this.hdgcodigo, this.esacodigo,
      this.cmecodigo, codigo, null, 0, 0, 0, tipodeproducto, idBodega, controlminimo, controlado, consignacion
      , this.usuario, this.bodega_productos,this.servidor).subscribe(
        response => {
          if (response != null){
            if (response.length == 0) {
              this.loading = false;
              // this.alertSwalAlert.title = "Advertencia: ";
              // this.alertSwalAlert.text = "No existe coincidencia por el criterio buscado";
              // this.alertSwalAlert.show();
              response = [];
            } else {
              if (response.length > 0) {
                console.log("respuesta",response)
                this.detalleconsultaproducto = response;
                this.detalleconsultaproductopag = this.detalleconsultaproducto.slice(0, 8);
                this.loading = false;
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

    // console.log("bodega y periodo",this.FormConsultaKardex.value.boddestino, this.FormConsultaKardex.value.periodo)
    // if(this.FormConsultaKardex.value.boddestino !=null && this.FormConsultaKardex.value.periodo !=null){
    //   if(this.codprod === null || this.codprod === '' ){
    //     // return;
    //     this.Buscarproducto();
    //   } else{

    //     if(this.FormConsultaKardex.value.boddestino === null  && this.FormConsultaKardex.value.periodo ===null){
    //       // console.log("Debe seleccionar bodega y periodo")
    //       this.FormConsultaKardex.reset();
    //       this.alertSwalAlert.title= "Debe Seleccionar Bodega y Período";
    //       this.alertSwalAlert.show();
    //     }else{
    //       var tipodeproducto = 'MIM';
    //       this.loading = true;
    //       var controlado = '';
    //       var controlminimo = '';
    //       var idBodega = this.FormConsultaKardex.value.boddestino;
    //       var consignacion = '';

    //       this._BusquedaproductosService.BuscarArticulosFiltros(this.hdgcodigo, this.esacodigo,
    //         this.cmecodigo, codigo, this.descprod, null, null, null, tipodeproducto, idBodega, controlminimo, controlado, consignacion
    //         , this.usuario, this.servidor).subscribe(
    //           response => {
    //             if (response.length == 0) {

    //               this.loading = false;
    //               this.alertSwalError.text ="El producto buscado no pertenece a la bodega";
    //               this.alertSwalError.show();
    //               // this.BuscaProducto();
    //             }
    //             else {
    //               if (response.length > 0) {
    //                 this.loading = false;
    //                 // this.FormConsultaKardex.get('codigo').setValue(response[0].codigo);
    //                 // this.FormConsultaKardex.get('descripcion').setValue(response[0].descripcion);
    //                 this.codigoproducto = response[0].codigo;
    //                 this.descriproducto = response[0].descripcion;
    //                 this.mein           = response[0].mein
    //                 // this.BuscaDatosKardex(response[0].mein);
    //                 // this.desactivaCampos(true);
    //                 this.muestracoddes = true;

    //                 // this.setProducto(response[0]);
    //               }
    //             }
    //           }, error => {
    //             this.loading = false;
    //             console.log('error');

    //           }
    //         );
    //     }
    //   }
    // }
  }

  mensaje(status: string, texto: string, timeoutl: number = 0) {
    this.alerts = [];
    if (timeoutl !== 0) {
      this.alerts.push({
        type: status,
        msg: texto,
        timeout: timeoutl
      });
    } else {
      this.alerts.push({
        type: status,
        msg: texto
      });
    }
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

}
