import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { BodegasDespachadoras } from 'src/app/models/entity/BodegasDespachadoras';
import { BodegasControladas } from '../../models/entity/BodegasControladas';
import { BodegasService } from '../../servicios/bodegas.service';
import { InformesService } from '../../servicios/informes.service';
import { IngresoConteoManual } from '../../models/entity/IngresoConteoManual';
import { LibrocontroladoService } from 'src/app/servicios/librocontrolado.service';
import { PeriodoMedControlado } from 'src/app/models/entity/PeriodoMedControlado';
import { BusquedaproductosComponent } from '../busquedaproductos/busquedaproductos.component';
import { MedicamentoControlado } from 'src/app/models/entity/MedicamentoControlado';
import { ConsultaLibroControlado } from 'src/app/models/entity/ConsultaLibroControlado';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Permisosusuario } from '../../permisos/permisosusuario';
import { BusquedaproductosService } from 'src/app/servicios/busquedaproductos.service';

@Component({
  selector: 'app-consultalibrocontrolado',
  templateUrl: './consultalibrocontrolado.component.html',
  styleUrls: ['./consultalibrocontrolado.component.css'],
  providers : [InformesService, LibrocontroladoService]
})
export class ConsultalibrocontroladoComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public modelopermisos             : Permisosusuario = new Permisosusuario();
  public FormConsultaLibroControlado: FormGroup;
  public bodegascontroladas         : BodegasControladas[] = [];
  // public bodegasdespachadoras         : BodegasDespachadoras[] = [];
  public hdgcodigo                   : number;
  public esacodigo                   : number;
  public cmecodigo                   : number;
  public usuario                     = environment.privilegios.usuario;
  public servidor                    = environment.URLServiciosRest.ambiente;
  public activbusqueda               : boolean = false;
  public periodosmedcontrolados      : MedicamentoControlado[]=[];
  public periodosconsultados         : ConsultaLibroControlado[] = [];
  public periodosconsultadospaginacion: ConsultaLibroControlado[] = [];
  private _BSModalRef                : BsModalRef;
  public periodo                     : number;
  public muestracoddes               : boolean = false;
  public muestragrillacoddes         : boolean = false;
  public todoslosprod                : boolean = false;
  public btnimprime                  : boolean = false;
  public meinid                      : number = 0;
  public loading                     = false;
  descprod: any;
  codprod: any;
  public codigoproducto              = null;
  public descriproducto              = null;
  public mein                        : number = 0;


  constructor(
    private formBuilder    : FormBuilder,
    private _bodegasService: BodegasService,
    public _libroService   : LibrocontroladoService,
    public _BsModalService: BsModalService,
    private _imprimelibroService  : InformesService,
    public _BusquedaproductosService: BusquedaproductosService
  ) {

    this.FormConsultaLibroControlado = this.formBuilder.group({
      codigo      : [{ value: null, disabled: false }, Validators.required],
      periodo     : [{ value: null, disabled: false }, Validators.required],
      bodcodigo   : [{ value: null, disabled: false }, Validators.required],
      descripcion : [{ value: null, disabled: false }, Validators.required],
      marca       : [{ value: null, disabled: false }, Validators.required]
    });
   }

  ngOnInit() {
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();
    this.BuscaBodegaDespachadora();

  }

  limpiar(){
    this.FormConsultaLibroControlado.reset();
    this.activbusqueda= false;
    this.periodosconsultadospaginacion = [];
    this.periodosconsultados = [];
    this.muestracoddes = false;
    this.btnimprime =false;
    this.meinid = 0;
    this.muestragrillacoddes = false;
    this.periodosmedcontrolados = [];
    this.todoslosprod = false;
    this.desactivaCampos(false);
    this.codprod = null;
    this.descprod = null;
    this.codigoproducto = null;
    this.descriproducto = null;
    // this.FormConsultaLibroControlado.controls["marca"].setValue(10);
    // this.FormConsultaLibroControlado.controls["bodcodigo"].setValue(10);
  }

  BuscaBodegaDespachadora(){
    this._bodegasService.BuscaBodegasControlados(this.hdgcodigo, this.esacodigo, this.cmecodigo,
      this.usuario, this.servidor).subscribe(
      response => {
        if (response != null){
          this.bodegascontroladas = response;
        }
      },
      error => {
        alert("Error al Buscar Bodegas de cargo");
      }
    );
  }

  ActivaBotonBusqueda(bodcodigo: number){
    this.activbusqueda= true;

    this.BuscaPeriodoBodegaControlada(bodcodigo);
  }

  BuscaPeriodoBodegaControlada(codigobod: number){
    this._libroService.BuscaPeriodoMedControlados(this.hdgcodigo, this.esacodigo,this.cmecodigo,
      this.servidor,this.usuario,codigobod).subscribe(
      response => {
        if (response != null){
          this.periodosmedcontrolados=response;
        }
      },
      error => {
        alert("Error al Buscar Período");
      });
  }

  SeleccionaBusqueda(periodo: number){

    this.activbusqueda= true;

    this.periodosmedcontrolados.forEach(element => {
      if(element.libcid == periodo ){
        this.periodo = element.libcid;
      }
    })

    if(this.codigoproducto != null && this.descriproducto != null && this.FormConsultaLibroControlado.value.periodo>=0){
      this.ConsultaLibroControlado(this.mein)
    }else{}


  }

  BuscarLibroControlado(){
    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModalBusquedaProductos());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) { }
      else {
        this.codigoproducto = response.codigo;
        this.descriproducto = response.descripcion;
        this.mein = response.mein;

        this.ConsultaLibroControlado(response.mein);

      }
    })
  }

  setModalBusquedaProductos() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Medicamentos Controlados', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        tipo_busqueda: 'Controlado-Bodega',
        id_Bodega: this.FormConsultaLibroControlado.value.bodcodigo,
        descprod: this.descprod,//
        codprod: this.codprod
      }
    };
    return dtModal;
  }

  ConsultaLibroControlado(mein: number){
    this._libroService.ConsultaLibroControlado(this.hdgcodigo, this.esacodigo,
      this.cmecodigo,this.servidor,this.usuario,this.periodo,
      this.FormConsultaLibroControlado.value.bodcodigo,mein).subscribe(
      response => {
        if (response != null){
          if(response.length == 0){
            this.periodosconsultados = [];
            this.periodosconsultadospaginacion = [];
            this.alertSwalAlert.title = "No existen Movimientos para el Producto Seleccionado";
            this.alertSwalAlert.show();
            this.desactivaCampos(false);
          }else{
            if(response.length>0){
              this.periodosconsultados = response;
              this.periodosconsultadospaginacion = this.periodosconsultados.slice(0,20);
              this.muestracoddes = true;
              this.btnimprime =true;
              this.todoslosprod = false;
              this.FormConsultaLibroControlado.get('codigo').setValue(response[0].meincodmei );
              this.FormConsultaLibroControlado.get('descripcion').setValue(response[0].meindescri);
              this.desactivaCampos(true);
              this.meinid = response[0].meinid;
            }
          }
        }
      });
  }

  getProducto(codigo: any) {
    this.alertSwalAlert.title= null;
    this.alertSwalError.text = null;
    this.codprod = codigo;
    if(this.FormConsultaLibroControlado.value.bodcodigo !=null && this.FormConsultaLibroControlado.value.periodo !=null){
      if(this.codprod === null || this.codprod === '' ){
        this.BuscarLibroControlado();
      } else{

        if(this.FormConsultaLibroControlado.value.bodcodigo === null  && this.FormConsultaLibroControlado.value.periodo ===null){
          this.FormConsultaLibroControlado.reset();
          this.alertSwalAlert.title= "Debe Seleccionar Bodega y Período";
          this.alertSwalAlert.show();
        }else{
          var tipodeproducto = 'MIM';
          this.loading = true;
          var controlado = '';
          var controlminimo = '';
          var idBodega = this.FormConsultaLibroControlado.value.bodcodigo;
          var consignacion = '';

          this._BusquedaproductosService.BuscarArticulosFiltros(this.hdgcodigo, this.esacodigo,
            this.cmecodigo, this.codprod, this.descprod, null, null, null, tipodeproducto, idBodega, controlminimo, controlado, consignacion
            , this.usuario, null, this.servidor).subscribe(
              response => {
                if (response != null){
                  if (response.length == 0) {
                    this.loading = false;
                    this.alertSwalError.text ="El producto buscado no pertenece a la bodega";
                    this.alertSwalError.show();
                  } else {
                    if (response.length === 1) {
                      this.loading = false;
                      this.codigoproducto = response[0].codigo;
                      this.descriproducto = response[0].descripcion;
                      this.mein = response[0].mein;
                      this.muestracoddes = true;
                      this.ConsultaLibroControlado(response[0].mein)
                    }else{
                      if(response.length >1){
                        this.BuscarLibroControlado();
                        this.loading = false;
                      }
                    }
                  }
                } else {
                  this.loading = false;
                }
              }, error => {
                this.loading = false;
              });
        }
      }
    }
  }

  desactivaCampos(bool) {
    if (bool){
      this.FormConsultaLibroControlado.controls.codigo.disable();
      this.FormConsultaLibroControlado.controls.descripcion.disable();
    } else {
      this.FormConsultaLibroControlado.controls.codigo.enable();
      this.FormConsultaLibroControlado.controls.descripcion.enable();
    }
  }

  setDatabusqueda(value: any, swtch: number) {
    if (swtch === 1) {
        this.codprod = value;
    } else if (swtch === 2) {
        this.descprod = value;
    }
  }

  /* Función búsqueda con paginación */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.periodosconsultadospaginacion = this.periodosconsultados.slice(startItem, endItem);
  }

  cambio_check(tipo:string, event: any){

    this.periodosconsultadospaginacion = [];
    this.periodosconsultados = [];
    if(event.target.checked == true){
      this.todoslosprod = true;
      this.activbusqueda = false;
      this.periodosconsultadospaginacion = [];
      this.periodosconsultados = [];
      this.muestracoddes = false;
      this.meinid = 0;
      this._libroService.ConsultaLibroControlado(this.hdgcodigo, this.esacodigo,this.cmecodigo,
      this.servidor,this.usuario,this.periodo,this.FormConsultaLibroControlado.value.bodcodigo,0).subscribe(
        response => {
          if (response != null){
            if(response.length == 0){
              this.alertSwalAlert.title = "No existen Movimientos para el Producto Seleccionado";
              this.alertSwalAlert.show();

            }else{
              if(response.length>0){
                this.btnimprime =true;
                this.periodosconsultados = response;
                this.periodosconsultadospaginacion = this.periodosconsultados.slice(0,20);
                this.muestragrillacoddes = true;
                this.FormConsultaLibroControlado.get('codigo').setValue(response[0].meincodmei );
                this.FormConsultaLibroControlado.get('descripcion').setValue(response[0].meindescri);
              }
            }
          }
        }
      )

    }else{
      if(event.target.checked == false){
        this.activbusqueda = false;
        this.btnimprime = false;
        this.periodosconsultados = [];
        this.muestragrillacoddes = false;
        this.periodosconsultadospaginacion = [];
        this.FormConsultaLibroControlado.reset();
        this.periodosmedcontrolados = [];
        this.periodo = null;
      }
    }
  }

  onImprimir(tiporeporte: string){
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Libro Controlado?',
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
    });
  }

  ImprimirLibro(tiporeporte: string) {
    if(tiporeporte=="pdf"){
      if(this.todoslosprod ==false){
        this._imprimelibroService.RPTImprimeLibroControlado(this.servidor,this.usuario,
        this.hdgcodigo,this.esacodigo, this.cmecodigo,"pdf",this.periodo,
        this.FormConsultaLibroControlado.value.bodcodigo,this.meinid).subscribe(
          response => {
            if (response != null){
              window.open(response[0].url, "", "", true);
            }
          },
          error => {
            this.alertSwalError.title = "Error al Imprimir Devolución Solicitud";
            this.alertSwalError.show();
            this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
            })
          }
        );
      }else{
        if(this.todoslosprod == true){
          this._imprimelibroService.RPTImprimeLibroControlado(this.servidor,this.usuario,
          this.hdgcodigo,this.esacodigo, this.cmecodigo,"pdf",this.periodo,
          this.FormConsultaLibroControlado.value.bodcodigo,0).subscribe(
            response => {
              if (response != null){
                window.open(response[0].url, "", "", true);
              }
            },
            error => {
              this.alertSwalError.title = "Error al Imprimir Devolución Solicitud";
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
          this._imprimelibroService.RPTImprimeLibroControlado(this.servidor,this.usuario,
          this.hdgcodigo,this.esacodigo, this.cmecodigo,"xls",this.periodo,
          this.FormConsultaLibroControlado.value.bodcodigo,this.meinid).subscribe(
            response => {
              if (response != null){
                window.open(response[0].url, "", "", true);
              }
            },
            error => {
              this.alertSwalError.title = "Error al Imprimir Devolución Solicitud";
              this.alertSwalError.show();
              this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
              })
            }
          );
        }else{
          if(this.todoslosprod == true){
            this._imprimelibroService.RPTImprimeLibroControlado(this.servidor,this.usuario,
            this.hdgcodigo,this.esacodigo, this.cmecodigo,"xls",this.periodo,
            this.FormConsultaLibroControlado.value.bodcodigo,0).subscribe(
              response => {
                if (response != null){
                  window.open(response[0].url, "", "", true);
                  this.todoslosprod = false;
                }
              },
              error => {
                this.alertSwalError.title = "Error al Imprimir Devolución Solicitud";
                this.alertSwalError.show();
                this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
                });
              });
          }
        }
      }
    }
  }

}
