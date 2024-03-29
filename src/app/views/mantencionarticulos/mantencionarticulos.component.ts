import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UnidadCompra } from '../../models/entity/UnidadCompra';
import { UnidadcompraService } from '../../servicios/unidadcompra.service';
import { UnidadDespacho } from '../../models/entity/UnidadDespacho';
import { UnidaddespachoService } from '../../servicios/unidaddespacho.service';
import { Familia } from '../../models/entity/Familia';
import { TipoMedicamento } from '../../models/entity/TipoMedicamento';
import { TipoMedicamentoService } from '../../servicios/tipomedicamento.service';
import { SubFamilia } from '../../models/entity/SubFamilia';
import { SubfamiliaService } from '../../servicios/subfamilia.service';
import { Articulos } from '../../models/entity/mantencionarticulos';
import { MantencionarticulosService } from '../../servicios/mantencionarticulos.service';
import { TipoRegistro } from '../../models/entity/TipoRegistro';
import { TiporegistroService } from '../../servicios/tiporegistro.service';
import { environment } from '../../../environments/environment';
import { FormaFar } from '../../models/entity/FormaFar'
import { FormaFarService } from 'src/app/servicios/formafar.service';
import { Presenta } from '../../models/entity/Presenta'
import { PresentaService } from 'src/app/servicios/presenta.service';
import { PrincAct } from '../../models/entity/PrincAct'
import { PrincActService } from 'src/app/servicios/PrincAct.service';
import { BusquedaproductosComponent } from '../busquedaproductos/busquedaproductos.component';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Permisosusuario } from '../../permisos/permisosusuario';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BusquedaproductosService } from 'src/app/servicios/busquedaproductos.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mantencionarticulos',
  templateUrl: './mantencionarticulos.component.html',
  styleUrls: ['./mantencionarticulos.component.css'],
  providers: [MantencionarticulosService]
})

export class MantencionarticulosComponent implements OnInit {
  public modelopermisos: Permisosusuario = new Permisosusuario();
  // @ViewChild('dangerSwal', { static: false }) private dangerSwal: SwalComponent;
  // ES6 Modules or TypeScript

  // CommonJS

  public loading = false;
  public lForm: FormGroup;
  public hdgcodigo: number;
  public esacodigo: number;
  public cmecodigo: number;
  public usuario: string;
  public servidor = environment.URLServiciosRest.ambiente;
  public unidadescompra: Array<UnidadCompra> = [];
  public unidadesdespacho: Array<UnidadDespacho> = [];
  public familias: Array<Familia> = [];
  public tiposmedicamento: Array<TipoMedicamento> = [];
  public subfamilias: Array<SubFamilia> = [];
  public tiposderegistros: Array<TipoRegistro> = [];
  public var_Articulo: Articulos;
  public FormaFar: Array<FormaFar> = [];
  public Presenta: Array<Presenta> = [];
  public PrincAct: Array<PrincAct> = [];

  public currentPage: number;

  public detalleconsultaproducto: Array<Articulos> = [];
  public detalleconsultaproductopag: Array<Articulos> = [];

  public bloqueabtnbuscar : boolean = false;
  private _BSModalRef: BsModalRef;

  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;// success
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;//warning
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;//error
  descprod: any;
  codprod: any;
  public productoselec : Articulos;

  public meinaux : number;
  public codigoaux : string;
  public descripcionaux : string;
  public tiporegistroaux : string;
  public tipomedicamentoaux : number;
  public recetaretenidaaux : string;
  public controladoaux : string;
  public solocompraaux : string;
  public valorcostoaux : number;
  public margenmedicamentoaux : number;
  public unidaddespachoaux : number;
  public unidadcompraaux : number;
  public familiaaux : number;
  public subfamiliaaux : number;
  public incobfonasaaux : string;
  public tipoincobaux : string;
  public clasificacionaux : number;
  public estadoaux : number;
  public preparadosaux : string;
  public codpactaux : number;
  public codpresaux : number;
  public codffaraux : number;
  public campoaux : string;
  public fechainivigenciaaux : string;
  public fechafinvigenciaaux : string;

  constructor(private UnidadcompraService: UnidadcompraService,
    private UnidaddespachoService: UnidaddespachoService,
    private TiposmedicamentoService: TipoMedicamentoService,
    private SubfamiliasService: SubfamiliaService,
    private TiporegistroService: TiporegistroService,
    private _mantencionarticulosService: MantencionarticulosService,
    private formBuilder: FormBuilder,
    private FormaFarService: FormaFarService,
    private PresentaService: PresentaService,
    private PrincActService: PrincActService,
    public _BsModalService: BsModalService,
    public _BusquedaproductosService: BusquedaproductosService,
    public datePipe                 : DatePipe,
    private router: Router,
    private route: ActivatedRoute,
  ) {

    this.lForm = this.formBuilder.group({
      mein: [null],
      codigo: [null],
      descripcion: [null],
      tiporegistro: [{value:null, disabled:true}],
      tipomedicamento: [null],
      solocompra: [{value:null, disabled:false}],
      recetaretenida: [{value:null, disabled:true}],
      valorcosto: [{value:null, disabled:true}],
      margenmedicamento: [{value:null, disabled:true}],
      valorventa: [{value:null, disabled:true}],
      unidadcompra: [{value:null, disabled:true}],
      unidaddespacho: [{value:null, disabled:true}],
      familia: [{value:null, disabled:true}],
      subfamilia: [{value:null, disabled:true}],
      incobfonasa: [null],
      tipoincob: [null],
      clasificacion: [null],
      estado: [{value:null, disabled:true}],
      preparados: [null],
      campo: [null],
      codpact: [null],
      codpres: [null],
      codffar: [null],
      controlado: [null],
      fechainivigencia : [{ value: null, disabled : true}],
      fechafinvigencia : [{ value: null, disabled : true}]
    }
    );
    this.detalleconsultaproducto = [];
  }

  ngOnInit() {

    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();
    this.route.paramMap.subscribe(param => {
      if (param.has("codigo")) {
        this.getProducto(param.get("codigo"));
      }
      })

    // var usuario = environment.privilegios.usuario;


    this.TiporegistroService.list(this.usuario, environment.URLServiciosRest.ambiente).subscribe(
      data => {
        this.tiposderegistros = data;

      }, err => {
        console.log(err.error);
      }
    );

    this.UnidadcompraService.list(this.usuario, environment.URLServiciosRest.ambiente).subscribe(
      data => {
        this.unidadescompra = data;

      }, err => {
        console.log(err.error);
      }
    );

    this.UnidaddespachoService.list(this.usuario, environment.URLServiciosRest.ambiente).subscribe(
      data => {
        this.unidadesdespacho = data;

      }, err => {
        console.log(err.error);
      }
    );

    this.FormaFarService.list(this.usuario, environment.URLServiciosRest.ambiente).subscribe(
      data => {
        this.FormaFar = data;
      }, err => {
        console.log(err.error);
      }
    );

    this.PrincActService.list(this.usuario, environment.URLServiciosRest.ambiente).subscribe(
      data => {
        this.PrincAct = data;
      }, err => {
        console.log(err.error);
      }
    );

    this.PresentaService.list(this.usuario, environment.URLServiciosRest.ambiente).subscribe(
      data => {
        this.Presenta = data;
      }, err => {
        console.log(err.error);
      }
    );

    this.TiposmedicamentoService.list(this.usuario, environment.URLServiciosRest.ambiente).subscribe(
      data => {
        this.tiposmedicamento = data;
      }, err => {
        console.log(err.error);
      }
    );

    this.SubfamiliasService.list(this.usuario, environment.URLServiciosRest.ambiente).subscribe(
      data => {
        this.subfamilias = data;
      }, err => {
        console.log(err.error);
      }
    );
  }

  BuscaFamilia(tiporegistro: string) {
    var servidor = environment.URLServiciosRest.ambiente;
    var usuario = environment.privilegios.usuario;
    this._mantencionarticulosService.BuscaFamilias(tiporegistro, usuario, servidor).subscribe(
      response => {
        if (response != null) {
          this.familias = response;
        }
      },
      error => {
        alert("Error al Buscar Familias")
      }
    );
  }

  setModalMensajeAceptar(mensaje) {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-m',
      initialState: {
        titulo: 'CONFIRMAR', // Parametro para de la otra pantalla
        mensaje: mensaje,
        informacion: '',
      }
    };
    return dtModal;
  }

  ConfirmarGuradadoArticulo(datos: any, tipo: String) {

    const Swal = require('sweetalert2');

    if (tipo == "CREAR") {

      Swal.fire({
        title: '¿ Crear artículo ?',
        text: "Confirmar la creación del artículo",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {

          this.GuardarArticulos(datos);
        }
      })
    } else {  //Modificar
      Swal.fire({
        title: '¿ Actualiza el artículo ?',
        text: "Confirmar actualización del artículo",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {

          this.ActualizaArticulos(datos);

        }
      })
    }
  }

  setModalMensajeExitoSinNumero(mensaje: string) {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-m',
      initialState: {
        titulo: 'Datos Guardados Exitosamente', // Parametro para de la otra pantalla
        mensaje: mensaje,
        informacion: '',
      }
    };
    return dtModal;
  }

  GuardarArticulos(value: any) {

    /* vienen seteadas en el ambiente */
    var servidor = environment.URLServiciosRest.ambiente;
    var usuario = environment.privilegios.usuario;

    var estado = 0;

    this.var_Articulo = new Articulos(null);

    this.var_Articulo.hdgcodigo = this.hdgcodigo;
    this.var_Articulo.esacodigo = this.esacodigo;
    this.var_Articulo.cmecodigo = this.cmecodigo;
    this.var_Articulo.codigo = value.codigo;
    this.var_Articulo.descripcion = value.descripcion;
    this.var_Articulo.tiporegistro = value.tiporegistro;
    this.var_Articulo.tipomedicamento = value.tipomedicamento;
    this.var_Articulo.valorcosto = parseFloat(value.valorcosto);
    this.var_Articulo.margenmedicamento = parseFloat(value.margenmedicamento);
    this.var_Articulo.valorventa = parseFloat(value.valorventa);
    this.var_Articulo.unidadcompra = value.unidadcompra;
    this.var_Articulo.unidaddespacho = value.unidaddespacho;
    this.var_Articulo.incobfonasa = value.incobfonasa;
    this.var_Articulo.tipoincob = value.tipoincob;
    this.var_Articulo.usuario = usuario;
    this.var_Articulo.servidor = servidor;
    this.var_Articulo.codffar = value.codffar;
    this.var_Articulo.codpres = value.codpres;
    this.var_Articulo.codpact = value.codpact;

    if (value.estado == 0) {
      estado = 0;
      this.var_Articulo.estado = 0;
    } else {
      if (value.estado == 1) {
        estado = 1;
        this.var_Articulo.estado = 1;
      }
    }

    this.var_Articulo.clasificacion = value.clasificacion;
    this.var_Articulo.recetaretenida = value.recetaretenida;
    this.var_Articulo.controlado = value.controlado;
    this.var_Articulo.solocompra = value.solocompra;
    this.var_Articulo.familia = value.familia;
    this.var_Articulo.subfamilia = value.subfamilia;

    this._mantencionarticulosService.AddArticulos(this.var_Articulo).subscribe(
      response => {
        if (response != null) {
          this.alertSwal.title = "Artículo Creado Exitosamente"; //mensaje a mostrar
          this.alertSwal.show();// para que aparezca
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  ValidarCampos(codigo: string) {
    var listadoErrores = [];

    var texto = document.getElementById('codigo');
    var valInDecimals = document.getElementById('myPercent');

    if (texto == null) {
      listadoErrores.push('El texto es obligatorio');
    }

    var regex = new RegExp(/^[A-Za-zÑñ,. ]+$/);

    if (this.lForm.value.margenmedicamento < 1 || this.lForm.value.margenmedicamento > 100) {
      listadoErrores.push('El numero debe estar entre 1 y 100');
    }

    return listadoErrores;
  }

  Limpiar(value: any) {
    const Swal = require('sweetalert2');
    if( this.meinaux != this.lForm.get('mein').value ||
        this.codigoaux != this.lForm.get('codigo').value ||
        this.descripcionaux != this.lForm.get('descripcion').value ||
        this.tiporegistroaux != this.lForm.get('tiporegistro').value ||
        this.tipomedicamentoaux != this.lForm.get('tipomedicamento').value ||
        this.recetaretenidaaux != this.lForm.get('recetaretenida').value ||
        this.controladoaux != this.lForm.get('controlado').value ||
        this.solocompraaux != this.lForm.get('solocompra').value ||
        this.valorcostoaux != this.lForm.get('valorcosto').value ||
        this.margenmedicamentoaux != this.lForm.get('margenmedicamento').value ||
        this.unidaddespachoaux != this.lForm.get('unidaddespacho').value ||
        this.unidadcompraaux != this.lForm.get('unidadcompra').value ||
        this.familiaaux != this.lForm.get('familia').value ||
        this.subfamiliaaux != this.lForm.get('subfamilia').value ||
        this.incobfonasaaux != this.lForm.get('incobfonasa').value ||
        this.tipoincobaux != this.lForm.get('tipoincob').value ||
        this.clasificacionaux != this.lForm.get('clasificacion').value ||
        this.estadoaux != this.lForm.get('estado').value ||
        this.preparadosaux != this.lForm.get('preparados').value ||
        this.codpactaux != this.lForm.get('codpact').value ||
        this.codpresaux != this.lForm.get('codpres').value ||
        this.codffaraux != this.lForm.get('codffar').value ||
        this.campoaux != this.lForm.get('campo').value ||
        this.fechainivigenciaaux != this.lForm.get('fechainivigencia').value ||
        this.fechafinvigenciaaux != this.lForm.get('fechafinvigencia').value ) {
          Swal.fire({
            title: 'Limpiar',
            text: "¿Seguro que desea Limpiar los campos?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
          }).then((result) => {
            if (result.dismiss != "cancel") {
              this.lForm.reset(Articulos);
              this.limpiar_Grilla();
              this.descprod = null
              this.codprod = null;
              this.desactivaCampos(false);
              this.lForm.controls.codpact.enable();
              this.lForm.controls.codpres.enable();
              this.lForm.controls.codffar.enable();
              this.lForm.controls.controlado.enable();
              this.bloqueabtnbuscar = false;
              this.familias = [];
            }
          });

    }else{
      this.lForm.reset(Articulos);
      this.limpiar_Grilla();
      this.descprod = null
      this.codprod = null;
      this.desactivaCampos(false);
      this.lForm.controls.codpact.enable();
      this.lForm.controls.codpres.enable();
      this.lForm.controls.codffar.enable();
      this.lForm.controls.controlado.enable();
      this.bloqueabtnbuscar = false;
      this.familias = [];
    }
  }

  limpiar_Grilla() {
    this.detalleconsultaproducto= [];
    this.detalleconsultaproductopag = [];
  }

  EliminarProducto(mein: number) {
    var servidor = environment.URLServiciosRest.ambiente;
    var usuario = environment.privilegios.usuario;
    this._mantencionarticulosService.EliminaArticulos(mein, usuario, servidor).subscribe(
      response => {
        if (response != null) {
          this.lForm.reset(response);
        }
      },
      error => {
        console.log(error);
        alert("Error al Eliminar Producto")
      }
    );
  }

  ActualizaArticulos(value: any) {

    var servidor = environment.URLServiciosRest.ambiente;
    var usuario = environment.privilegios.usuario;
    this.var_Articulo = new Articulos(null);
    this.var_Articulo.hdgcodigo = this.hdgcodigo;
    this.var_Articulo.esacodigo = this.esacodigo;
    this.var_Articulo.cmecodigo = this.cmecodigo;
    this.var_Articulo.mein = this.productoselec.mein;
    this.var_Articulo.codigo = this.productoselec.codigo;
    this.var_Articulo.descripcion = this.productoselec.descripcion;
    this.var_Articulo.tiporegistro = this.productoselec.tiporegistro;
    this.var_Articulo.tipomedicamento = this.productoselec.tipomedicamento;
    this.var_Articulo.valorcosto = parseFloat(value.valorcosto);
    this.var_Articulo.margenmedicamento = parseFloat(value.margenmedicamento);
    this.var_Articulo.valorventa = parseFloat(value.valorventa);
    this.var_Articulo.unidadcompra = this.productoselec.unidadcompra;
    this.var_Articulo.unidaddespacho = this.productoselec.unidaddespacho;
    this.var_Articulo.incobfonasa = this.productoselec.incobfonasa;
    this.var_Articulo.tipoincob = this.productoselec.tipoincob;
    if (value.estado == '1') {
      this.var_Articulo.estado = 1;
    } else {
      this.var_Articulo.estado = 0;

    }
    this.var_Articulo.clasificacion = this.productoselec.clasificacion;
    this.var_Articulo.recetaretenida = value.recetaretenida;
    this.var_Articulo.controlado = value.controlado;
    this.var_Articulo.solocompra = value.solocompra;
    this.var_Articulo.preparados = value.preparados;
    this.var_Articulo.familia = value.familia;
    this.var_Articulo.subfamilia = value.subfamilia;
    this.var_Articulo.usuario = usuario;
    this.var_Articulo.servidor = servidor;
    this.var_Articulo.codffar = value.codffar;
    this.var_Articulo.codpres = value.codpres;
    this.var_Articulo.codpact = value.codpact;
    this.var_Articulo.fechainiciovigencia = value.fechainivigencia;
    this.var_Articulo.fechafinvigencia = value.fechafinvigencia;

    this._mantencionarticulosService.UpdateArticulos(this.var_Articulo).subscribe(
      response => {
        if (response != null) {
          this.alertSwal.title = "Artículo Modificado Exitosamente"; //mensaje a mostrar
          this.alertSwal.show();// para que aparezca
          this.meinaux = this.lForm.get('mein').value;
          this.codigoaux = this.lForm.get('codigo').value;
          this.descripcionaux = this.lForm.get('descripcion').value;
          this.tiporegistroaux = this.lForm.get('tiporegistro').value;
          this.tipomedicamentoaux = this.lForm.get('tipomedicamento').value;
          this.recetaretenidaaux = this.lForm.get('recetaretenida').value;
          this.controladoaux = this.lForm.get('controlado').value;
          this.solocompraaux = this.lForm.get('solocompra').value;
          this.valorcostoaux = this.lForm.get('valorcosto').value;
          this.margenmedicamentoaux = this.lForm.get('margenmedicamento').value;
          this.unidaddespachoaux = this.lForm.get('unidaddespacho').value;
          this.unidadcompraaux = this.lForm.get('unidadcompra').value;
          this.familiaaux = this.lForm.get('familia').value;
          this.subfamiliaaux = this.lForm.get('subfamilia').value;
          this.incobfonasaaux = this.lForm.get('incobfonasa').value;
          this.tipoincobaux = this.lForm.get('tipoincob').value;
          this.clasificacionaux = this.lForm.get('clasificacion').value;
          this.estadoaux = this.lForm.get('estado').value;
          this.preparadosaux = this.lForm.get('preparados').value;
          this.codpactaux = this.lForm.get('codpact').value;
          this.codpresaux = this.lForm.get('codpres').value;
          this.codffaraux = this.lForm.get('codffar').value;
          this.campoaux = this.lForm.get('campo').value;
          this.fechainivigenciaaux = this.lForm.get('fechainivigencia').value;
          this.fechafinvigenciaaux = this.lForm.get('fechafinvigencia').value;
        }
      },
      error => {
        console.log(error);
        this.alertSwalError.title = "Artículo No pudo ser Modificado"; //mensaje a mostrar
        this.alertSwalError.show();// para que aparezca
      }
    );
  }

  BuscarProducto() {

    this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModalProductos());
    this._BSModalRef.content.onClose.subscribe((producto: any) => {
      if (producto == undefined) { }
      else {
        this.productoselec = producto;
        console.log("prod buscado con fecha",this.productoselec);
        this.bloqueabtnbuscar = true;
        this.setProducto(producto);
      }
    });

    this.bloqueabtnbuscar = false;
  }

  setModalProductos() {
    // console.log('desde setModalProductos()');
    // console.log(this.codprod);
    // console.log(this.descprod);
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
        id_Bodega: 0,
        descprod: this.descprod,//
        codprod: this.codprod
      }
    };
    return dtModal;
  }

  setProducto(producto: any) {
    console.log("producto", producto)
    this.lForm.get('mein').setValue(producto.mein);
    this.lForm.get('codigo').setValue(producto.codigo);
    this.lForm.get('descripcion').setValue(producto.descripcion);
    this.lForm.get('tiporegistro').setValue(producto.tiporegistro);
    this.lForm.get('tipomedicamento').setValue(producto.tipomedicamento);
    this.lForm.get('recetaretenida').setValue(producto.recetaretenida);
    this.lForm.get('controlado').setValue(producto.controlado);
    this.lForm.get('solocompra').setValue(producto.solocompra);
    this.lForm.get('valorcosto').setValue(producto.valorcosto);
    this.lForm.get('margenmedicamento').setValue(producto.margenmedicamento);
    this.lForm.get('unidaddespacho').setValue(producto.unidaddespacho);
    this.lForm.get('unidadcompra').setValue(producto.unidadcompra);
    this.BuscaFamilia(producto.tiporegistro);
    this.lForm.get('familia').setValue(producto.familia);
    this.lForm.get('subfamilia').setValue(producto.subfamilia);
    this.lForm.get('incobfonasa').setValue(producto.incobfonasa);
    this.lForm.get('tipoincob').setValue(producto.tipoincob);
    this.lForm.get('clasificacion').setValue(producto.clasificacion);
    this.lForm.get('estado').setValue(producto.estado);
    this.lForm.get('preparados').setValue(producto.preparados);
    this.lForm.get('codpact').setValue(producto.codpact);
    this.lForm.get('codpres').setValue(producto.codpres);
    this.lForm.get('codffar').setValue(producto.codffar);
    this.lForm.get('campo').setValue(producto.campo);
    this.lForm.get('fechainivigencia').setValue(this.datePipe.transform(producto.fechainiciovigencia, 'dd-MM-yyyy'));
    this.lForm.get('fechafinvigencia').setValue(this.datePipe.transform(producto.fechafinvigencia, 'dd-MM-yyyy'));
    if(producto.tiporegistro == "I"){
      this.lForm.controls.codpact.disable();
      this.lForm.controls.codpres.disable();
      this.lForm.controls.codffar.disable();
      this.lForm.controls.controlado.disable();
    }else{
      if(producto.tiporegistro == "M"){
        this.lForm.controls.codpact.enable();
        this.lForm.controls.codpres.enable();
        this.lForm.controls.codffar.enable();
      }
    }

    this.codprod = null;
    this.descprod = null;

    this.meinaux = this.lForm.get('mein').value;
    this.codigoaux = this.lForm.get('codigo').value;
    this.descripcionaux = this.lForm.get('descripcion').value;
    this.tiporegistroaux = this.lForm.get('tiporegistro').value;
    this.tipomedicamentoaux = this.lForm.get('tipomedicamento').value;
    this.recetaretenidaaux = this.lForm.get('recetaretenida').value;
    this.controladoaux = this.lForm.get('controlado').value;
    this.solocompraaux = this.lForm.get('solocompra').value;
    this.valorcostoaux = this.lForm.get('valorcosto').value;
    this.margenmedicamentoaux = this.lForm.get('margenmedicamento').value;
    this.unidaddespachoaux = this.lForm.get('unidaddespacho').value;
    this.unidadcompraaux = this.lForm.get('unidadcompra').value;
    this.familiaaux = this.lForm.get('familia').value;
    this.subfamiliaaux = this.lForm.get('subfamilia').value;
    this.incobfonasaaux = this.lForm.get('incobfonasa').value;
    this.tipoincobaux = this.lForm.get('tipoincob').value;
    this.clasificacionaux = this.lForm.get('clasificacion').value;
    this.estadoaux = this.lForm.get('estado').value;
    this.preparadosaux = this.lForm.get('preparados').value;
    this.codpactaux = this.lForm.get('codpact').value;
    this.codpresaux = this.lForm.get('codpres').value;
    this.codffaraux = this.lForm.get('codffar').value;
    this.campoaux = this.lForm.get('campo').value;
    this.fechainivigenciaaux = this.lForm.get('fechainivigencia').value;
    this.fechafinvigenciaaux = this.lForm.get('fechafinvigencia').value;

    /**Desactiva campo codigo y descripcion //@ML */
    this.desactivaCampos(true);
  }

  getProducto(codigo: any) {
    // var codproducto = this.lForm.controls.codigo.value;
    this.codprod = codigo;
    this.bloqueabtnbuscar= true;
    if(this.codprod === null || this.codprod === ''){
      this.bloqueabtnbuscar =false;
      return;
    } else{
      var tipodeproducto = 'MIM';
      this.loading = true;
      var controlado = '';
      var controlminimo = '';
      var idBodega = 0;
      var consignacion = '';

      this._BusquedaproductosService.BuscarArticulosFiltros(this.hdgcodigo, this.esacodigo,
        this.cmecodigo, codigo, this.descprod, null, null, null, tipodeproducto, idBodega, controlminimo, controlado, consignacion
        , this.usuario, null, this.servidor).subscribe(
          response => {
            if (response != null) {
              if (response.length == 0) {
                this.loading = false;
                this.BuscarProducto();
              }
              else {
                if (response.length > 0) {
                  if(response.length > 1){
                    // console.log("Tiene varios productos levanta modal busqueda productos")
                    this.BuscarProducto();
                    this.loading = false;
                  }else{
                    if(response.length == 1){

                      this.productoselec = response[0];
                      this.loading = false;
                      this.setProducto(response[0]);
                    }
                  }
                }
              }
            } else {
              this.loading = false;
              this.BuscarProducto();
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
      this.lForm.controls.codigo.disable();
      this.lForm.controls.descripcion.disable();
    } else {
      this.lForm.controls.codigo.enable();
      this.lForm.controls.descripcion.enable();
    }
  }

  setDatabusqueda(value: any, swtch: number) {
    if (swtch === 1) {
        this.codprod = value;
    } else if (swtch === 2) {
        this.descprod = value;
    }
  }

  Salir(){
    const Swal = require('sweetalert2');
    if( this.meinaux != this.lForm.get('mein').value ||
        this.codigoaux != this.lForm.get('codigo').value ||
        this.descripcionaux != this.lForm.get('descripcion').value ||
        this.tiporegistroaux != this.lForm.get('tiporegistro').value ||
        this.tipomedicamentoaux != this.lForm.get('tipomedicamento').value ||
        this.recetaretenidaaux != this.lForm.get('recetaretenida').value ||
        this.controladoaux != this.lForm.get('controlado').value ||
        this.solocompraaux != this.lForm.get('solocompra').value ||
        this.valorcostoaux != this.lForm.get('valorcosto').value ||
        this.margenmedicamentoaux != this.lForm.get('margenmedicamento').value ||
        this.unidaddespachoaux != this.lForm.get('unidaddespacho').value ||
        this.unidadcompraaux != this.lForm.get('unidadcompra').value ||
        this.familiaaux != this.lForm.get('familia').value ||
        this.subfamiliaaux != this.lForm.get('subfamilia').value ||
        this.incobfonasaaux != this.lForm.get('incobfonasa').value ||
        this.tipoincobaux != this.lForm.get('tipoincob').value ||
        this.clasificacionaux != this.lForm.get('clasificacion').value ||
        this.estadoaux != this.lForm.get('estado').value ||
        this.preparadosaux != this.lForm.get('preparados').value ||
        this.codpactaux != this.lForm.get('codpact').value ||
        this.codpresaux != this.lForm.get('codpres').value ||
        this.codffaraux != this.lForm.get('codffar').value ||
        this.campoaux != this.lForm.get('campo').value ||
        this.fechainivigenciaaux != this.lForm.get('fechainivigencia').value ||
        this.fechafinvigenciaaux != this.lForm.get('fechafinvigencia').value ) {

          Swal.fire({
            title: 'Salir',
            text: "¿Seguro que desea Salir sin Guardar?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
          }).then((result) => {
            if (result.dismiss != "cancel") {
              this.route.paramMap.subscribe(param => {
                this.router.navigate(['home']);
            })
            }
          });
    }else{
      this.route.paramMap.subscribe(param => {
        this.router.navigate(['home']);
    })
    }
  }

  // ngOnDestroy(){
  //   const Swal = require('sweetalert2');
  //   var codigo = this.codigoaux;
  //   if( this.meinaux != this.lForm.get('mein').value ||
  //       this.codigoaux != this.lForm.get('codigo').value ||
  //       this.descripcionaux != this.lForm.get('descripcion').value ||
  //       this.tiporegistroaux != this.lForm.get('tiporegistro').value ||
  //       this.tipomedicamentoaux != this.lForm.get('tipomedicamento').value ||
  //       this.recetaretenidaaux != this.lForm.get('recetaretenida').value ||
  //       this.controladoaux != this.lForm.get('controlado').value ||
  //       this.solocompraaux != this.lForm.get('solocompra').value ||
  //       this.valorcostoaux != this.lForm.get('valorcosto').value ||
  //       this.margenmedicamentoaux != this.lForm.get('margenmedicamento').value ||
  //       this.unidaddespachoaux != this.lForm.get('unidaddespacho').value ||
  //       this.unidadcompraaux != this.lForm.get('unidadcompra').value ||
  //       this.familiaaux != this.lForm.get('familia').value ||
  //       this.subfamiliaaux != this.lForm.get('subfamilia').value ||
  //       this.incobfonasaaux != this.lForm.get('incobfonasa').value ||
  //       this.tipoincobaux != this.lForm.get('tipoincob').value ||
  //       this.clasificacionaux != this.lForm.get('clasificacion').value ||
  //       this.estadoaux != this.lForm.get('estado').value ||
  //       this.preparadosaux != this.lForm.get('preparados').value ||
  //       this.codpactaux != this.lForm.get('codpact').value ||
  //       this.codpresaux != this.lForm.get('codpres').value ||
  //       this.codffaraux != this.lForm.get('codffar').value ||
  //       this.campoaux != this.lForm.get('campo').value ||
  //       this.fechainivigenciaaux != this.lForm.get('fechainivigencia').value ||
  //       this.fechafinvigenciaaux != this.lForm.get('fechafinvigencia').value ) {
  //         Swal.fire({
  //           title: 'Salir',
  //           text: "¿Seguro que desea Salir sin Guardar?",
  //           icon: 'question',
  //           showCancelButton: true,
  //           confirmButtonColor: '#3085d6',
  //           cancelButtonColor: '#d33',
  //           confirmButtonText: 'Si'
  //         }).then((result) => {
  //           if (result.dismiss === "cancel") {
  //             this.route.paramMap.subscribe(param => {
  //               this.router.navigate(['mantencionarticulos',codigo]);
  //           })
  //           }
  //         });
  //   }
  // }
}
