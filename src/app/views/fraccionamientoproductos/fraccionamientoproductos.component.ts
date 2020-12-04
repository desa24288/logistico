import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BusquedaproductosComponent } from '../busquedaproductos/busquedaproductos.component';
import { Articulos } from 'src/app/models/entity/mantencionarticulos';
import { BodegasService } from '../../servicios/bodegas.service';
import { BodegasDespachadoras } from 'src/app/models/entity/BodegasDespachadoras';
import { FraccionamientoProducto } from 'src/app/models/entity/FraccionamientoProducto';
import { BusquedaproductoafraccionarComponent } from '../busquedaproductoafraccionar/busquedaproductoafraccionar.component';
import { ProductoFraccionado } from 'src/app/models/entity/ProductoFraccionado';
import { GrabaProductoFraccionado } from 'src/app/models/entity/GrabaProductoFraccionado';
import { EliminaProductoFraccionado } from 'src/app/models/entity/EliminaProductoFraccionado';
import { Permisosusuario } from '../../permisos/permisosusuario';
import { CreasolicitudesService } from '../../servicios/creasolicitudes.service';
import { StockProducto } from 'src/app/models/entity/StockProducto';
import { BusquedaproductosService } from 'src/app/servicios/busquedaproductos.service';
import { ProductoFraccionamiento } from 'src/app/models/entity/ProductoFraccionamiento';

@Component({
  selector: 'app-fraccionamientoproductos',
  templateUrl: './fraccionamientoproductos.component.html',
  styleUrls: ['./fraccionamientoproductos.component.css'],
  providers : [BodegasService, CreasolicitudesService]
})
export class FraccionamientoproductosComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public modelopermisos              : Permisosusuario = new Permisosusuario();
  public FormFraccionamiento         : FormGroup;
  public _PageChangedEvent           : PageChangedEvent;
  private _BSModalRef                : BsModalRef;
  public productoselec               : Articulos;
  public hdgcodigo                   : number;
  public esacodigo                   : number;
  public cmecodigo                   : number;
  public meinidorig                  : number = 0;
  public usuario                     = environment.privilegios.usuario;
  public servidor                    = environment.URLServiciosRest.ambiente;
  public bodegasdespachadoras         : BodegasDespachadoras[] = [];
  public detallefraccionamiento       : FraccionamientoProducto[]=[];
  public detallefraccionamientopaginacion : FraccionamientoProducto[] =[];
  public prodfraccionado              : ProductoFraccionado[]=[];
  public productoafrac                : ProductoFraccionamiento;
  public datosparagrabar              : GrabaProductoFraccionado[]=[];
  public datosparaeliminar            : EliminaProductoFraccionado[]=[];
  editField                           : string;
  editField2                          : number;
  public codigoproducto               : string = null;
  agregaprod                          : boolean = false;
  public activbusqueda                : boolean = false;
  public codexiste                    : boolean = false;
  public stockprodorigen              : number = null;
  public descriporigen                : string = null;
  public activabtngraba               : boolean = false;
  public loading                      = false;
  descprod: any;
  codprod: any;

  constructor(
    private formBuilder    : FormBuilder,
    private _bodegasService: BodegasService,
    public _creaService    : CreasolicitudesService,
    public _BsModalService : BsModalService,
    public _BusquedaproductosService: BusquedaproductosService
  ) {

    this.FormFraccionamiento = this.formBuilder.group({
      codigo      : [{ value: null, disabled: false }, Validators.required],
      descripcion : [{ value: null, disabled: false }, Validators.required],
      bodcodigo   : [{ value: null, disabled: false }, Validators.required],
      cantidad    : [{ value: null, disabled: false }, Validators.required],
    });
  }

  ngOnInit() {
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();
    this.BuscaBodegaDespachadora();
  }

  BuscaBodegaDespachadora(){
    this._bodegasService.BuscaBodegasDespachadora(this.hdgcodigo, this.esacodigo, this.cmecodigo, 
      this.usuario, this.servidor).subscribe(
      response => {
        // console.log("BuscaBodegasDespachadora",response)
        this.bodegasdespachadoras = response;
      },
      error => {
        alert("Error al Buscar Bodegas de cargo");
      }
    );
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.detallefraccionamientopaginacion = this.detallefraccionamiento.slice(startItem, endItem);
  }

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.detallefraccionamientopaginacion[id][property] = (editField);
    this.detallefraccionamiento[id][property] = this.detallefraccionamientopaginacion[id][property]
    // console.log("actualiza ",editField,this.detallefraccionamiento,event)
  }

  cambio_cantidad(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
    // console.log("cambiocantidad",this.editField);
  }

  updateList2(id: number, property: string, event: any,registro: FraccionamientoProducto) {
    this.alertSwalAlert.text = null;
    
    const editField2 = (event.target.textContent);
  
    if(registro.cantidad> this.stockprodorigen){
      this.alertSwalAlert.text = "El valor a fraccionar no debe ser mayor al stock del Producto a fraccionar";
      this.alertSwalAlert.show();
    }else{
      if (registro.cantidad<0){
        this.alertSwalAlert.text = "El valor a fraccionar debe ser mayor a 0";
        this.alertSwalAlert.show();
      }else{
        if(editField2<= this.stockprodorigen){
          this.detallefraccionamientopaginacion[id][property] = (editField2);
          this.detallefraccionamiento[id][property] = this.detallefraccionamientopaginacion[id][property]
          
        }
      }
     
     
    }
    
  }

  cambio_cantidad2(id: number, property: string, event: any) {
    this.editField2 = parseInt(event.target.textContent);
    // console.log("cambiocantidad2",this.editField2);
  }

  limpiar() {
    this.FormFraccionamiento.reset();
    this.detallefraccionamientopaginacion = [];
    this.detallefraccionamiento = [];
    this.agregaprod = false;
    this.activbusqueda = false;
    this.FormFraccionamiento.controls.codigo.enable();
    this.FormFraccionamiento.controls.descripcion.enable();
    this.FormFraccionamiento.controls.cantidad.enable();
    this.codexiste = false;
    this.stockprodorigen = null;
    this.activabtngraba = false;
    this.descprod = null;
    this.codprod = null;
    this.descriporigen = null;
    this.codigoproducto = null;
    
  }

  ActivaBotonBusqueda(){
    this.activbusqueda= true;
  }

  getProducto(codigo: any) {
    // var codproducto = this.lForm.controls.codigo.value;
    this.alertSwalAlert.title= null;
    this.alertSwalAlert.text = null;
    this.codprod = codigo;
 
    if(this.codprod === null || this.codprod === ''){
      return;
    } else{
      var tipodeproducto = 'MIM';
      this.loading = true;
      var controlado = '';
      var controlminimo = '';
      var idBodega = 0;
      var consignacion = '';
      
      this._bodegasService.BuscaProductoenlaBodega(this.hdgcodigo,this.esacodigo,this.cmecodigo,
        this.FormFraccionamiento.value.bodcodigo, this.codprod,null,this.usuario,this.servidor).subscribe(
          response => {
            if (response.length == 0) {

              this.loading = false;
              this.BuscarProductosParaFraccionar();
            }
            else {
              if (response.length > 0) {
               
                this.productoafrac = response[0];
                
                this.meinidorig = this.productoafrac.meinidprod;
                this.stockprodorigen = this.productoafrac.stockactual;
                this.codigoproducto = this.productoafrac.meincodprod;
                this.descriporigen = this.productoafrac.meindesprod;
                if(this.stockprodorigen>0){
                  this.BuscaProductosFraacionados(this.productoafrac.meinidprod)
                }else{
                  if(this.stockprodorigen<0){
                    this.alertSwalAlert.title= "El stock del producto seleccionado es menor 0"
                    this.alertSwalAlert.text ="No puede fraccionar este producto";
                    this.alertSwalAlert.show();
                  }
                }
                
                this.loading = false;
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

  setDatabusqueda(value: any, swtch: number) {

    if (swtch === 1) {
        this.codprod = value;
    } else if (swtch === 2) {
        this.descprod = value;
    }
  }

  BuscarProductosParaFraccionar(){
    this.alertSwalAlert.title =null;
    this.alertSwalAlert.text = null;
    this.detallefraccionamiento = [];
    this.detallefraccionamientopaginacion = [];
    this.loading = true;
   
    this._BSModalRef = this._BsModalService.show(BusquedaproductoafraccionarComponent, this.setModalBusquedaProductosAFraccionar());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      // console.log("producto a fraccionae",response)
      if(response != undefined){
        // if(response.length >0){
          this.meinidorig = response.meinidprod;
          this.stockprodorigen = response.stockactual;
          this.codigoproducto = response.meincodprod;
          this.descriporigen = response.meindesprod;
          
          if(this.stockprodorigen>0){
            this.BuscaProductosFraacionados(response.meinidprod)
          }else{
            if(this.stockprodorigen<1){
              this.alertSwalAlert.title= "El stock del producto seleccionado es menor a 1"
              this.alertSwalAlert.text ="No puede fraccionar este producto";
              this.alertSwalAlert.show();
              this.BuscaProductosFraacionados(response.meinidprod)
            }
          }
        // }else
        
      }//{ console.log("no etra lengt")}
    });
  }

  BuscaProductosFraacionados(meinidprod: number){

    this._bodegasService.BuscaProductosFraccionados(meinidprod,this.usuario,this.servidor,
      this.FormFraccionamiento.value.bodcodigo).subscribe(
      response => {  

        this.prodfraccionado = response;
        
        this.prodfraccionado.forEach(element=>{
          var temporal = new FraccionamientoProducto
          temporal.codmei     = element.meincodprod;
          temporal.meindescri = element.meindesprod;
          temporal.stockactual= element.stockactual;
          temporal.factordist = element.factorconv;
          temporal.cantidad   = 0;
          temporal.meiniddest = element.meiniddest;
          // temporal.cantidaddest= +(element.stockactual * element.factorconv)

          this.detallefraccionamiento.push(temporal);
        })

        this.detallefraccionamientopaginacion = this.detallefraccionamiento.slice(0,20);
        // console.log("codigos",this.codigoproducto,this.descriporigen,this.stockprodorigen)
        this.FormFraccionamiento.get('codigo').setValue(this.codigoproducto);
        this.FormFraccionamiento.get('descripcion').setValue(this.descriporigen);
        this.FormFraccionamiento.get('cantidad').setValue(this.stockprodorigen);
        this.FormFraccionamiento.controls.codigo.disable();
        this.FormFraccionamiento.controls.descripcion.disable();
        this.FormFraccionamiento.controls.cantidad.disable();

        this.agregaprod = true;
        this.loading = false;
        if(this.prodfraccionado.length>0 && this.stockprodorigen>0){
          this.activabtngraba = true
        }
        
        console.log("Datos a la grilla",this.detallefraccionamiento)
        
      },
      error => {
        console.log(error);
        this.alertSwalError.title = "Error al Buscar Producto Fraccionado";
        this.alertSwalError.show();
      }
    );

  }

  setModalBusquedaProductosAFraccionar() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Productos a Fraccionar', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        bodcodigo: this.FormFraccionamiento.value.bodcodigo,
        codigo   : this.codprod,
        descripcion: this.descprod  
      }
    };
    return dtModal;
  }

  

  addArticuloGrilla() {
    var stock1 :StockProducto[]
    this.alertSwalError.title = null;
    this.codexiste = false;
    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModalBusquedaProductos());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      if (response == undefined) { }
      else {
        this.productoselec=response;
        
        if(this.productoselec.mein != this.meinidorig){
         
          const indx = this.detallefraccionamiento.findIndex(x => x.codmei === this.productoselec.codigo, 1);
          if (indx >= 0) {
            this.alertSwalError.title = "Código ya existe en la grilla";
            this.alertSwalError.show();
            // this.FormDispensaDetalle.reset();
            // this.FormDispensaDetalle.controls.cantidad.setValue(null);
            this.codexiste = true;
          }else{
            if (this.codexiste == false){
              
              const DetalleFraccion = new FraccionamientoProducto;
              DetalleFraccion.codmei     = this.productoselec.codigo;
              DetalleFraccion.meindescri = this.productoselec.descripcion;
              DetalleFraccion.meiniddest = this.productoselec.mein;
              DetalleFraccion.factordist = 100;
              DetalleFraccion.cantidad   = 0;
              // stock1=  await 
              this._creaService.BuscaStockProd(this.productoselec.mein, this.FormFraccionamiento.value.bodcodigo,
               this.usuario, this.servidor).subscribe(
                response => {  
                  DetalleFraccion.stockactual = response[0].stockactual;
                },
              )
              this.detallefraccionamiento.unshift(DetalleFraccion);
              this.detallefraccionamientopaginacion = this.detallefraccionamiento.slice(0,20);
              this.activabtngraba = true;
              
            }
          }

          
          
        }else{
          if(this.productoselec.mein === this.meinidorig){
            this.alertSwalError.title ="El producto ingresado no debe ser el mismo que va a fraccionar";
            this.alertSwalError.show();
          }
        }
        
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
        id_Bodega: this.FormFraccionamiento.value.bodcodigo,
        
      }
    };
    return dtModal;
  }

  ConfirmaEliminaProductoDeLaGrilla(registro,id){
    // console.log("Elimina producto de la grilla",registro,id)
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
        registro.pldevigente ="N";
        this.EliminaProductoDeLaGrilla(registro,id);
      }
    })
  }
  
  EliminaProductoDeLaGrilla(registro,id){
    // console.log("producto a eliminar",registro,id)
    this.alertSwal.title = null;
    this.alertSwalError.title = null;
    this.datosparaeliminar = [];
    if(registro.pldevigente == "N" && registro.factordist ==null){
      // console.log("Entra a grabar producto sin grabar",registro);
      this.detallefraccionamiento.splice(id, 1);
      this.detallefraccionamientopaginacion = this.detallefraccionamiento.slice(0, 20);
      this.alertSwal.title = "Producto Eliminado";
      this.alertSwal.show();
      // console.log("Grilla sin producto eliminado", this.detallefraccionamiento);
    }else{
      this.detallefraccionamiento.forEach(element=>{
        if(element.meiniddest== registro.meiniddest && id >=0){
          var temporal = new EliminaProductoFraccionado
          temporal.meinidorig = this.meinidorig;
          temporal.meiniddest = element.meiniddest;
          temporal.usuario    = this.usuario;
          temporal.servidor   = this.servidor;
  
          this.datosparaeliminar.unshift(temporal);
  
        }
      })
      // console.log("Elimina producto",this.datosparaeliminar);
      this._bodegasService.EliminaProductoFraccionadoDeGrilla(this.datosparaeliminar).subscribe(
        response => {  
          this.detallefraccionamiento.splice(id, 1);
          this.detallefraccionamientopaginacion = this.detallefraccionamiento.slice(0, 20);
          this.alertSwal.title ="Eliminación Producto realizado con éxito";
          this.alertSwal.show();
        },
        error => {
          console.log(error);
          this.alertSwalError.title = "Error al Eliminar Producto";
          this.alertSwalError.show();
        }
      );

    }    
  }

  ConfirmaGenerarFraccionamiento(){
   
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Desea Grabar Fraccionamiento del Producto?',
      text: "Confirmar el fraccionamiento del producto ",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.GrabaFraccionamientoProducto();
      }
    })
  }

  GrabaFraccionamientoProducto(){
    this.datosparagrabar=[];
    this.detallefraccionamiento.forEach(element=>{
      var temporal = new GrabaProductoFraccionado
      temporal.meinidorig = this.meinidorig;
      temporal.meiniddest = element.meiniddest;
      temporal.factorconv = +element.factordist; //elsimbolo +  lo deja como numérico
      temporal.cantidorig = +element.cantidad;
      temporal.cantiddest = (element.factordist*element.cantidad);
      temporal.codbodega  = this.FormFraccionamiento.value.bodcodigo;
      temporal.usuario    = this.usuario;
      temporal.servidor   = this.servidor;
      temporal.hdgcodigo  = this.hdgcodigo;
      temporal.esacodigo  = this.esacodigo;
      temporal.cmecodigo  = this.cmecodigo;

      this.datosparagrabar.unshift(temporal);
    })
    // console.log("datos a grabar",this.datosparagrabar)
    this._bodegasService.GrabaFraccionamiento(this.datosparagrabar).subscribe(
      response => {  
        this.alertSwal.title ="Fraccionamiento realizado con éxito";
        this.alertSwal.show();

        this._bodegasService.BuscaProductoenlaBodega(this.hdgcodigo,this.esacodigo,this.cmecodigo,
        this.FormFraccionamiento.value.bodcodigo, this.codigoproducto,null,this.usuario,this.servidor).subscribe(
          response => { 
      
            this.FormFraccionamiento.get('cantidad').setValue(response[0].stockactual);
              
            this.detallefraccionamiento.forEach(element=>{
              // var temporal = new FraccionamientoProducto
              element.codmei = element.codmei;
              element.meindescri = element.meindescri;
              element.stockactual= element.stockactual+(element.factordist*element.cantidad) ;
              element.factordist = element.factordist;
              element.cantidad   = 0;
              element.meiniddest = element.meiniddest;
              element.cantidaddest= 0//+(element.stockactual * element.factordist)
      
                // this.detallefraccionamiento.unshift(temporal);
            })
            this.detallefraccionamientopaginacion = this.detallefraccionamiento.slice(0,20);
            // console.log("nueva grilla",this.detallefraccionamiento,this.detallefraccionamientopaginacion)
              // this.BuscaProductosFraacionados(response[0].meinidprod)
          }, error => {
            // this.loading = false;
            console.log('error');
          }
        );
        this.datosparagrabar=[];
      },
      error => {
        console.log(error);
        this.alertSwalError.title = "Error al Fraccionar Producto";
        this.alertSwalError.show();
      }
    );

  }

}
