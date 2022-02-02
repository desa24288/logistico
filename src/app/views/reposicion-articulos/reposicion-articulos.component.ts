import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { TipoRegistro } from '../../models/entity/TipoRegistro';
import { TiporegistroService } from '../../servicios/tiporegistro.service';
import { BodegasService } from '../../servicios/bodegas.service';
import { ReposicionArticulos } from '../../models/entity/ReposicionArticulos';
import { ReposicionArticulosService } from '../../servicios/reposicionarticulos.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Solicitud } from '../../models/entity/Solicitud';
import { DetalleSolicitud } from 'src/app/models/entity/DetalleSolicitud';
import { DatePipe } from '@angular/common';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BodegasTodas } from 'src/app/models/entity/BodegasTodas';
import { BodegasrelacionadaAccion } from 'src/app/models/entity/BodegasRelacionadas';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { TipoReposicion } from '../../models/entity/TipoReposicion';
import { BusquedaplantillasbodegaComponent } from '../busquedaplantillasbodega/busquedaplantillasbodega.component'
import { Plantillas } from 'src/app/models/entity/PlantillasBodegas';
import { StockCritico } from 'src/app/models/entity/StockCritico';
import { InformesService } from '../../servicios/informes.service';
import { Permisosusuario } from '../../permisos/permisosusuario';

@Component({
  selector: 'app-reposicion-articulos',
  templateUrl: './reposicion-articulos.component.html',
  styleUrls: ['./reposicion-articulos.component.css'],
  providers: [ReposicionArticulosService, InformesService]
})
export class ReposicionArticulosComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public modelopermisos: Permisosusuario = new Permisosusuario();
  public FormReposicion: FormGroup;
  public FormDatosProducto: FormGroup;
  public tiposderegistros: Array<TipoRegistro> = [];
  public bodegasSolicitantes: Array<BodegasTodas> = [];
  public bodegassuministro: Array<BodegasrelacionadaAccion> = [];
  public varSolicitud: Solicitud;
  public detallearticulosreposicion: Array<ReposicionArticulos> = [];
  public detallearticulosreposicionpaginacion: Array<ReposicionArticulos> = [];
  public detallearticulosreposicion_aux: Array<ReposicionArticulos> = [];
  public detallearticulosreposicionpaginacion_aux: Array<ReposicionArticulos> = [];
  public detallearticulosreposicion_2: Array<ReposicionArticulos> = [];
  public detalleplant: Array<ReposicionArticulos> = [];
  public tiposdereposicion: Array<TipoReposicion> = [];
  public Plantilla: Plantillas;
  public detallestockcritico: Array<StockCritico> = [];
  public hdgcodigo: number;
  public esacodigo: number;
  public cmecodigo: number;
  public numsolicitud: number = 0;
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
  public ActivaBotonBuscaGrilla: boolean = false;
  public ActivaBotonLimpiaBusca: boolean = false;
  public verificanull = false;
  public vacios: boolean = true;

  editField: string;

  constructor(
    private TiporegistroService: TiporegistroService,
    private _BodegasService: BodegasService,
    private _reposicionService: ReposicionArticulosService,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public localeService: BsLocaleService,
    public _BsModalService: BsModalService,
    private _imprimesolicitudService: InformesService
  ) {
    this.FormReposicion = this.formBuilder.group({
      mein: [{ value: null, disabled: false }],
      codigo: [{ value: null, disabled: false }],
      hdgcodigo: [{ value: null, disabled: false }],
      esacodigo: [{ value: null, disabled: false }],
      cmecodigo: [{ value: null, disabled: false }],
      tiporegistro: [{ value: null, disabled: false }, Validators.required],
      bodcodigo: [{ value: null, disabled: false }, Validators.required],
      codbodegasuministro: [{ value: null, disabled: false }, Validators.required],
      fechadesde: [new Date(), Validators.required],
      fechahasta: [new Date(), Validators.required],
      chequeatodo: [{ value: null, disabled: false }],
      tiporeposicion: [{ value: null, disabled: false }, Validators.required]
    }
    );
    this.FormDatosProducto = this.formBuilder.group({
      codigo: [{ value: null, disabled: false }, Validators.required]
    });
    this.detallearticulosreposicion = [];
  }

  ngOnInit() {
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();
    this.BuscaBodegasSolicitantes();
    this.setDate();

    this.TiporegistroService.list(this.usuario, this.servidor).subscribe(
      data => {
        this.tiposderegistros = data;
      }, err => {
        console.log(err.error);
      }
    );

    this.TiporegistroService.tiporeposicion(this.usuario, this.servidor).subscribe(
      data => {
        this.tiposdereposicion = data;
        // console.log("tipos de reposicion",this.tiposdereposicion)
      }, err => {
        console.log(err.error);
      }
    );
  }

  updateList(id: number, property: string, registro: ReposicionArticulos) {
    // console.log("cantidad",registro)
    if (registro.cantidadareponer <= 0) {
      this.alertSwalAlert.title = "Debe ingresar valores mayores a 0";
      this.alertSwalAlert.show();
      registro.cantidadareponer = registro.cantidadareponerresp;
      this.logicaVacios();
    } else {
      this.detallearticulosreposicion[id][property] = this.detallearticulosreposicionpaginacion[id][property]
      this.logicaVacios();
    }
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  SeleccionaTipoRep(tipo: any) {
    // console.log(tipo)
    switch (tipo) {
      case 1:
        this.buscaplantilla = false;
        break;

      case 2:
        this.buscaplantilla = true;
        this.detallearticulosreposicionpaginacion = [];
        this.detallearticulosreposicion = [];
        break;

      case 3:
        this.buscaplantilla = false;
        break;

      case 4:
        // this.buscaplantilla = false; faltadefinicion???
        break;

      default:
        break;
    }
  }

  BuscarPlantillas() {
    this.loading = true

    this._BSModalRef = this._BsModalService.show(BusquedaplantillasbodegaComponent, this.setModalBusquedaPlantilla());
    this._BSModalRef.content.onClose.subscribe((response: any) => {
      this._BodegasService.BuscaPlantillas(this.servidor, sessionStorage.getItem('Usuario'), this.hdgcodigo, this.esacodigo,
        this.cmecodigo, response.planid, '', '', '', 0, 0, '', '', 1, "").subscribe(
          response_plantilla => {
            if (response_plantilla.length !== 0) {
              this.loading = true;
              if (response_plantilla.length > 0) {
                this.Plantilla = response_plantilla[0];
                this.FormReposicion.get('bodcodigo').setValue(this.Plantilla.bodorigen);

                this.BuscaBodegasSuministro(this.Plantilla.bodorigen);

                // this.detallearticulosreposicionpaginacion = this.detallearticulosreposicion.slice(0, 20);
                this.FormReposicion.get('codbodegasuministro').setValue(this.Plantilla.boddestino);
                this.detalleplant = this.Plantilla.plantillasdet;

                this.detalleplant.forEach(element => {

                  // this.setPlantilla(element);
                  var temporal = new ReposicionArticulos;
                  const indx = this.detallearticulosreposicion.findIndex(x => x.codigomein === element.codmei, 1);

                  // console.log("recorre detalle planilla;",indx)
                  if (indx >= 0) {
                    // console.log("tiene producto repetido")
                    // this.alertSwalError.title = "Código ya existe en la grilla";
                    // this.alertSwalError.show();
                  }else{
                    console.log("No hay producto repetido y se guarda en la grilla")
                    temporal.codigomein = element.codmei;
                    temporal.meinid = element.meinid;
                    temporal.descripcionmein = element.meindescri;
                    temporal.fechamov = element.fechacreacion;
                    temporal.cantidadareponer = element.cantsoli;
                    temporal.cantidadareponerresp = temporal.cantidadareponer;
                    temporal.marca = "S";

                    this.detallearticulosreposicion.unshift(temporal);
                    this.loading = false;
                  }
                });

                this.detallearticulosreposicionpaginacion = this.detallearticulosreposicion.slice(0, 20);
                this.detallearticulosreposicion_aux = this.detallearticulosreposicion;
                this.detallearticulosreposicionpaginacion_aux = this.detallearticulosreposicionpaginacion;
                this.ActivaBotonBuscaGrilla = true;
                this.logicaVacios();
              }
            }
            this.loading = false;
          }
        );
    });

    this.loading = false;

  }

  setPlantilla(art: ReposicionArticulos) {
    console.log("art:", art)

    const indx = this.detallearticulosreposicion.findIndex(x => x.codigomein === art.codmei, 1);
    console.log("recorre detalle grilla;", indx)


    this.detallearticulosreposicion.forEach(x=>{
      console.log("X:",x)
      if(x.codmei === art.codmei){
        this.alertSwalError.title = "Código: "+ art.codmei+"  ya existe en la grilla";
          this.alertSwalError.show();
      }
    })

    if (indx >= 0) {
      console.log("tiene producto repetido")
      // this.alertSwalError.title = "Código ya existe en la grilla";
      // this.alertSwalError.show();
    }else{
      console.log("No hay producto repetido y se guarda en la grilla")
      var temporal = new ReposicionArticulos;
      temporal.codigomein = art.codmei;
      temporal.meinid = art.meinid;
      temporal.descripcionmein = art.meindescri;
      temporal.fechamov = art.fechacreacion;
      temporal.cantidadareponer = art.cantsoli;
      temporal.cantidadareponerresp = temporal.cantidadareponer;
      temporal.marca = "S";

      this.detallearticulosreposicion.unshift(temporal);
      this.detallearticulosreposicionpaginacion = this.detallearticulosreposicion.slice(0, 20);
      this.detallearticulosreposicion_aux = this.detallearticulosreposicion;
      this.detallearticulosreposicionpaginacion_aux = this.detallearticulosreposicionpaginacion;
      this.ActivaBotonBuscaGrilla = true;
      this.logicaVacios();
    }



  }

  async logicaVacios() {
    this.vaciosProductos();
    if (this.vacios === true) {
      this.verificanull = false;
    }
    else {
      this.verificanull = true;
    }
    // this.validaExcede();
  }

  vaciosProductos() {
    if (this.detallearticulosreposicionpaginacion.length) {
      for (var data of this.detallearticulosreposicionpaginacion) {
        if (data.cantidadareponer <= 0 || data.cantidadareponer === null) {
          this.vacios = true;
          return;
        } else {
          this.vacios = false;
        }
      }
    } else {
      this.vacios = true;
    }
  }

  setModalBusquedaPlantilla() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Plantillas', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        tipoplantilla: true,
        tipopedido: 1
      }
    };
    return dtModal;
  }

  BuscarRegistros() {
    var indice: number = 0;
    this.loading = true;

    this._reposicionService.BuscaRegistros(this.hdgcodigo, this.cmecodigo, this.FormReposicion.value.bodcodigo, this.FormReposicion.value.tiporegistro, this.datePipe.transform(this.FormReposicion.value.fechadesde, 'yyyy-MM-dd'),
      this.datePipe.transform(this.FormReposicion.value.fechahasta, 'yyyy-MM-dd'), this.usuario, this.servidor, this.FormReposicion.value.tiporeposicion, "").subscribe(
        response => {
          if (response != null) {
            this.detallearticulosreposicion = response;
            if (this.detallearticulosreposicion.length > 0) {
              this.FormReposicion.get('chequeatodo').setValue(true);

              this.detallearticulosreposicion.forEach(element => {
                element.cantidadareponerresp = element.cantidadareponer;
                this.detallearticulosreposicion[indice].marca = "S";
                this.detallearticulosreposicion[indice].meinid = element.codmeinid;
                indice++;
              }
              );
              this.detallearticulosreposicionpaginacion = this.detallearticulosreposicion.slice(0, 20);
              this.detallearticulosreposicion_aux = this.detallearticulosreposicion;
              this.detallearticulosreposicionpaginacion_aux = this.detallearticulosreposicionpaginacion;
              this.ActivaBotonBuscaGrilla = true;
              this.logicaVacios();
            } else {
              this.alertSwalAlert.title = "No se encuentran registro para procesar"; //mensaje a mostrar
              this.alertSwalAlert.show();// para que aparezca
              this.logicaVacios();
            }
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
          alert("Error al Buscar Registros");
          console.log(error);
        }
      );
  }

  ConfirmarGenerarSolicitud(datos: any) {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Generar Solicitud ?',
      text: "Confirmar la creación de solicitud",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.generarSolicitud(datos);
      }
    })
  }

  generarSolicitud(values: any) {
    /* vienen seteadas en el ambiente */
    this.loading = true;
    this.varSolicitud = new Solicitud(null);

    this.varSolicitud.soliid = 0;
    this.varSolicitud.hdgcodigo = this.hdgcodigo;
    this.varSolicitud.esacodigo = this.esacodigo;
    this.varSolicitud.cmecodigo = this.cmecodigo;
    this.varSolicitud.bodorigen = values.bodcodigo;
    this.varSolicitud.boddestino = values.codbodegasuministro;
    this.varSolicitud.estadosolicitud = 10;
    this.varSolicitud.usuariocreacion = this.usuario;
    this.varSolicitud.fechacreacion = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.varSolicitud.usuariomodifica = null;
    this.varSolicitud.fechamodifica = null;
    this.varSolicitud.usuarioelimina = null;
    this.varSolicitud.fechaelimina = null;
    this.varSolicitud.servidor = this.servidor;
    this.varSolicitud.cama = null;
    this.varSolicitud.cliid = 0;
    this.varSolicitud.tipodocpac = 0;
    this.varSolicitud.numdocpac  = null;
    this.varSolicitud.descidentificacion = null;
    this.varSolicitud.apepaternopac  = null;
    this.varSolicitud.apematernopac  = null;
    this.varSolicitud.nombrespac     = null;
    this.varSolicitud.codambito = 0;
    this.varSolicitud.estid = 0;
    this.varSolicitud.ctaid = 0;
    this.varSolicitud.edadpac  = 0;
    this.varSolicitud.tipoedad  = null;
    this.varSolicitud.codsexo  = 0
    this.varSolicitud.codservicioori = 0;
    this.varSolicitud.codserviciodes = 0;
    // this.varSolicitud.tipoproducto         ?: number,
    this.varSolicitud.tiporeceta  = null;
    this.varSolicitud.numeroreceta = 0;
    this.varSolicitud.tipomovim =  'C';
    // this.varSolicitud.prioridadsoli        ?: number,
    this.varSolicitud.tipodocprof = 0;
    this.varSolicitud.numdocprof = null;
    this.varSolicitud.alergias = null;
    this.varSolicitud.fechacierre = null;
    this.varSolicitud.usuariocierre = null;
    this.varSolicitud.observaciones = null;
    this.varSolicitud.ppnpaciente = 0;
    this.varSolicitud.convenio = null;
    this.varSolicitud.diagnostico = null;
    this.varSolicitud.nombremedico  = null;
    this.varSolicitud.cuentanumcuenta = '0';
    this.varSolicitud.bodorigendesc = null;
    this.varSolicitud.boddestinodesc = null;
    // estadosolicitudde    ?: string,
    // desprioridadsoli     ?: string,
    // desorigensolicitud   ?: string,
    // codpieza             ?: string,
    // camid                ?: number,
    // piezaid              ?: number,
    // glsexo               ?: string,
    // glstipidentificacion ?: string,
    // glsambito            ?: string,
    // undglosa             ?: string,
    // camglosa             ?: string,
    // pzagloza             ?: string,
    // edad                 ?: string,
    // comprobantecaja      ?: string,
    // codservicioactual    ?: string,
    // recetaentregaprog    ?: string,
    //      solicitudesdet       ?: DetalleSolicitud[]

    if (this.FormReposicion.value.tiporeposicion == 4) {  //Estas son urgentes
      this.varSolicitud.prioridadsoli = 2;
    } else {
      this.varSolicitud.prioridadsoli = 1;
    }
    this.varSolicitud.accion = "I";
    this.varSolicitud.tiposolicitud = 10; // Solicitud de reposición
    this.varSolicitud.origensolicitud = 10; // Reposición de Bodegas
    this.varSolicitud.estadocomprobantecaja = 0;

    this.varSolicitud.solicitudesdet = [];

    this.detallearticulosreposicion.forEach(element => {
      if (element.marca == "S") {
        const detalleSolicitud = new DetalleSolicitud();

        detalleSolicitud.codmei = element.codigomein;
        detalleSolicitud.estado = 10; // Solicitado
        detalleSolicitud.meinid = element.meinid;
        detalleSolicitud.sodeid = 0;
        detalleSolicitud.soliid = 0;
        detalleSolicitud.cantsoli = Number(element.cantidadareponer);
        detalleSolicitud.cantdespachada = 0;
        detalleSolicitud.usuariomodifica = null;
        detalleSolicitud.fechamodifica = null;
        detalleSolicitud.usuarioelimina = null;
        detalleSolicitud.fechaelimina = null;
        detalleSolicitud.acciond = "I";
        this.varSolicitud.solicitudesdet.unshift(detalleSolicitud);
      }
    });

    this._reposicionService.crearSolicitud(this.varSolicitud).subscribe(
      response => {
        if (response != null) {
          if(response.idpedidofin700 > 0 ){
            this.alertSwal.title = "Solicitud creada N°: ".concat(response['solbodid'] + "\n N°Pedido Fin700: ".concat(response['idpedidofin700']));
          }else{
            this.alertSwal.title = "Solicitud creada N°:".concat(response['solbodid']);
          }
          this.alertSwal.show();
          this.numsolicitud = response['solbodid'];
          this.existesolicitud = true;
          this.verificanull = false;
        }
        this.loading = false;
      }, error => {
        this.loading = false;
      }
    );
    this.loading = false;
  }

  /* llena combobox de bodegas perioféricas */
  BuscaBodegasSolicitantes() {
    this._BodegasService.listaBodegaTodasSucursal(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor).subscribe(
      data => {
        this.bodegasSolicitantes = data;
      }, err => {
        console.log(err.error);
      }
    );
  }

  BuscaBodegasSuministro(Id_bodega_orogen: number) {
    this.bodegassuministro = [];

    this._BodegasService.listaBodegaRelacionadaAccion(this.hdgcodigo, this.esacodigo, this.cmecodigo,
      this.usuario, this.servidor, Id_bodega_orogen, 1).subscribe(
        data => {
          this.bodegassuministro = data;
        }, err => {
          console.log(err.error);
        }
      );
  }

  cambio_checktodo(event: any) {
    var indice: number = 0;

    if (event.target.checked == true) {
      this.detallearticulosreposicion.forEach(element => {
        this.detallearticulosreposicion[indice].marca = "S";
        indice++;
      });
      this.detallearticulosreposicionpaginacion = this.detallearticulosreposicion.slice(0, 20);
    } else {
      this.detallearticulosreposicion.forEach(element => {
        this.detallearticulosreposicion[indice].marca = "N";
        indice++;
      });
      this.detallearticulosreposicionpaginacion = this.detallearticulosreposicion.slice(0, 20);
    }
  }

  cambio_check(id: number, property: string, event: any) {
    if (event.target.checked == false) {
      this.detallearticulosreposicionpaginacion[id][property] = "N";
      this.detallearticulosreposicion[id][property] = this.detallearticulosreposicionpaginacion[id][property]
    } else {
      this.detallearticulosreposicionpaginacion[id][property] = "S";
      this.detallearticulosreposicion[id][property] = this.detallearticulosreposicionpaginacion[id][property]
    }
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.detallearticulosreposicionpaginacion = this.detallearticulosreposicion.slice(startItem, endItem);
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  limpiar() {
    this.FormReposicion.reset();
    this.detallearticulosreposicionpaginacion = [];
    this.detallearticulosreposicion = [];
    this.FormReposicion.get('fechadesde').setValue(new Date());
    this.FormReposicion.get('fechahasta').setValue(new Date());
    this.buscaplantilla = false;
    this.ActivaBotonBuscaGrilla = false;
  }

  onImprimir() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Solicitud ?',
      text: "Confirmar Impresión",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.ImprimirSolicitud();
      }
    })

  }

  ImprimirSolicitud() {

    this._imprimesolicitudService.RPTImprimeSolicitudBodega(this.servidor, this.hdgcodigo, this.esacodigo,
      this.cmecodigo, "pdf", this.numsolicitud).subscribe(
        response => {
          if (response != null) {
            window.open(response[0].url, "", "", true);
          }
        },
        error => {
          console.log(error);
          this.alertSwalError.title = "Error al Imprimir Listado";
          this.alertSwalError.show();
          this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
          })
          alert("Error al Imprimir Listado para Inventario");
        }
      );

  }

  async findArticuloGrilla() {
    this.loading = true;
    var indice: number = 0;

    // console.log('this.FormDatosProducto.controls.codigo.value : ' , this.FormDatosProducto.controls.codigo);
    if (this.FormDatosProducto.controls.codigo.touched &&
      this.FormDatosProducto.controls.codigo.status !== 'INVALID') {
      var codProdAux = this.FormDatosProducto.controls.codigo.value.toString();
      // if(this.FormReposicion.controls.numsolicitud.value >0){

      this.detallearticulosreposicion = [];
      this.detallearticulosreposicionpaginacion = [];
      if (this.FormReposicion.value.tiporeposicion === 1 || this.FormReposicion.value.tiporeposicion === 3) {
        this._reposicionService.BuscaRegistros(this.hdgcodigo, this.cmecodigo, this.FormReposicion.value.bodcodigo, this.FormReposicion.value.tiporegistro, this.datePipe.transform(this.FormReposicion.value.fechadesde, 'yyyy-MM-dd'),
          this.datePipe.transform(this.FormReposicion.value.fechahasta, 'yyyy-MM-dd'), this.usuario, this.servidor, this.FormReposicion.value.tiporeposicion, codProdAux).subscribe(
            response => {
              if (response != null) {
                this.detallearticulosreposicion = response;
                if (this.detallearticulosreposicion.length > 0) {
                  this.FormReposicion.get('chequeatodo').setValue(true);
                  this.detallearticulosreposicion.forEach(element => {
                    this.detallearticulosreposicion[indice].marca = "S";
                    this.detallearticulosreposicion[indice].meinid = element.codmeinid;
                    indice++;
                  });
                  this.detallearticulosreposicionpaginacion = this.detallearticulosreposicion.slice(0, 20);
                  this.ActivaBotonBuscaGrilla = true;
                  this.ActivaBotonLimpiaBusca = true;
                } else {
                  this.alertSwalAlert.title = "No se encuentran registro para procesar"; //mensaje a mostrar
                  this.alertSwalAlert.show();// para que aparezca
                }
              }
              this.loading = false;
            },
            error => {
              this.loading = false;
              alert("Error al Buscar Registros");
              console.log(error);
            }
          );
      } else {
        if (this.FormReposicion.value.tiporeposicion === 2) {

          this._BodegasService.BuscaPlantillas(this.servidor, sessionStorage.getItem('Usuario'),
            this.hdgcodigo, this.esacodigo, this.cmecodigo, this.Plantilla.planid, '', '', '', 0, 0, '',
            '', 1, codProdAux).subscribe(response_plantilla => {
              if (response_plantilla.length == 0) {

              } else {
                this.loading = true;
                if (response_plantilla.length > 0) {
                  this.Plantilla = response_plantilla[0];
                  this.FormReposicion.get('bodcodigo').setValue(this.Plantilla.bodorigen);

                  this.BuscaBodegasSuministro(this.Plantilla.bodorigen);

                  this.detallearticulosreposicionpaginacion = this.detallearticulosreposicion.slice(0, 20);
                  this.FormReposicion.get('codbodegasuministro').setValue(this.Plantilla.boddestino);
                  this.detalleplant = this.Plantilla.plantillasdet;

                  this.detalleplant.forEach(element => {
                    var temporal = new ReposicionArticulos;
                    temporal.codigomein = element.codmei;
                    temporal.meinid = element.meinid;
                    temporal.descripcionmein = element.meindescri;
                    temporal.fechamov = element.fechacreacion;
                    temporal.cantidadareponer = element.cantsoli;
                    temporal.marca = "S";

                    this.detallearticulosreposicion.unshift(temporal);
                    this.loading = false;
                  });

                  this.detallearticulosreposicionpaginacion = this.detallearticulosreposicion.slice(0, 20);

                  this.ActivaBotonBuscaGrilla = true;
                  this.ActivaBotonLimpiaBusca = true;
                }

              }
              this.loading = false;
            });
        }
      }
      this.ActivaBotonBuscaGrilla = true;
      this.ActivaBotonLimpiaBusca = true;
      this.loading = false;
      return;

    } else {
      this.limpiarCodigo();
      this.loading = false;
      return;
    }
  }

  limpiarCodigo() {
    this.loading = true;

    // console.log("auxs",this.detallearticulosreposicionpaginacion_aux,this.detallearticulosreposicion_aux)
    this.FormDatosProducto.controls.codigo.reset();
    var codProdAux = '';

    this.detallearticulosreposicion = [];
    this.detallearticulosreposicionpaginacion = [];


    // Llenar Array Auxiliares
    this.detallearticulosreposicion = this.detallearticulosreposicion_aux;
    this.detallearticulosreposicionpaginacion = this.detallearticulosreposicionpaginacion_aux;
    this.ActivaBotonLimpiaBusca = false;

    this.loading = false;
  }

}
