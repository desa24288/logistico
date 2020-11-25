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

@Component({
  selector: 'app-librocontrolado',
  templateUrl: './librocontrolado.component.html',
  styleUrls: ['./librocontrolado.component.css'],
  providers : [InformesService,LibrocontroladoService]
})
export class LibrocontroladoComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  
  public modelopermisos              : Permisosusuario = new Permisosusuario();
  public FormLibroControlado         : FormGroup;
  public bodegascontroladas          : BodegasControladas[] = [];
  public prodsbodegascontroladas     : LibroControlado[] = [];
  public prodsbodegascontroladaspaginacion : LibroControlado[] = [];
  public hdgcodigo                   : number;
  public esacodigo                   : number;
  public cmecodigo                   : number;
  public usuario                     = environment.privilegios.usuario;
  public servidor                    = environment.URLServiciosRest.ambiente;
  private _BSModalRef                : BsModalRef;
  public activbusqueda               : boolean = false;
  public imprimelibro                : boolean = false;
  public cierralibro                 : boolean = false;
  public locale                      = 'es';
  public bsConfig                    : Partial<BsDatepickerConfig>;
  public colorTheme                  = 'theme-blue';
  bsModalRef                         : any;
  editField                          : any;

  constructor(
    private formBuilder    : FormBuilder,
    private _bodegasService: BodegasService,
    public localeService   : BsLocaleService,
    public _libroService   : LibrocontroladoService,
    private _imprimelibroService  : InformesService

  ) {

    this.FormLibroControlado = this.formBuilder.group({
      codigo      : [{ value: null, disabled: false }, Validators.required],
      fecha       : [{ value: new Date(), disabled: false }, Validators.required],
      bodcodigo   : [{ value: null, disabled: false }, Validators.required],
      cantidad    : [{ value: null, disabled: false }, Validators.required],
    });
   }

  ngOnInit() {

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
    this.FormLibroControlado.reset();
    this.activbusqueda= false;
    this.prodsbodegascontroladaspaginacion = [];
    this.prodsbodegascontroladas= [];
    this.cierralibro = false;
    this.imprimelibro = false;
  }

  BuscaBodegaDespachadora(){
    this._bodegasService.BuscaBodegasControlados(this.hdgcodigo, this.esacodigo, this.cmecodigo, 
      this.usuario, this.servidor).subscribe(
      response => {
        // console.log("BuscaBodegas controlada",response)
        this.bodegascontroladas = response;
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
    this._libroService.BuscaProductoBodegaControl(this.servidor,this.hdgcodigo, this.esacodigo, 
    this.cmecodigo,this.FormLibroControlado.value.bodcodigo ).subscribe(
      response => {
        // console.log("Busca productos en Bodegas controlada",response)
        this.prodsbodegascontroladas = response;
        this.prodsbodegascontroladaspaginacion = this.prodsbodegascontroladas.slice(0,50);
        this.cierralibro = true;
        // this.imprimelibro = true;
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
    this.prodsbodegascontroladaspaginacion = this.prodsbodegascontroladas.slice(startItem, endItem);
  }

  ConfirmaGenerarLibroFraccionado(){
   
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Desea Grabar Libro Controlado?',
      text: "Confirmar la grabación ",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.GrabaCierreLibro();
      }
    })
  }

  GrabaCierreLibro(){
    // console.log("Dato a grabar en el cierre", this.servidor, this.cmecodigo,this.usuario,
    // this.FormLibroControlado.value.bodcodigo, this.FormLibroControlado.value.fecha);

    this._libroService.GrabaCierreLibroControlado(this.hdgcodigo, this.esacodigo, 
      this.cmecodigo,this.servidor,this.usuario,this.FormLibroControlado.value.bodcodigo ).subscribe(
        response => {
          console.log("Resultado Grabacion cierre",response)
          this.alertSwal.title = "Libro Cerrado Exitosamente";
          this.alertSwal.show();
          this.imprimelibro = true;
          this.cierralibro = false;
          // this.prodsbodegascontroladas = response;
          // this.prodsbodegascontroladaspaginacion = this.prodsbodegascontroladas.slice(0,11);
        },
        error => {
          this.alertSwalError.title = "Error al Grabar Cierre De Libro Controlado";
          this.alertSwalError.text = error;
          this.alertSwalError.show();
          // alert("Error al Buscar productos en Bodegas");
        }
      );
  

  }

  onImprimir(){
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Cierre Libro Controlado?',
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

    // console.log("Imprime el reporte de Libro controlado",this.servidor,this.usuario,
    // this.hdgcodigo,this.esacodigo, this.cmecodigo,"pdf", this.FormLibroControlado.value.bodcodigo);

    this._imprimelibroService.RPTImprimeCierreLibroControlado(this.servidor,this.usuario,
    this.hdgcodigo,this.esacodigo, this.cmecodigo,"pdf",this.FormLibroControlado.value.bodcodigo).subscribe(
      response => {
        console.log("Imprime Solicitud", response);
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
