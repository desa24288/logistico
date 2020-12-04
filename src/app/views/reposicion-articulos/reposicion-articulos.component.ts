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
  public tiposderegistros: Array<TipoRegistro> = [];
  public bodegasSolicitantes: Array<BodegasTodas> = [];
  public bodegassuministro: Array<BodegasrelacionadaAccion> = [];
  public varSolicitud: Solicitud;
  public detallearticulosreposicion: Array<ReposicionArticulos> = [];
  public detallearticulosreposicionpaginacion: Array<ReposicionArticulos> = [];
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
      tiporeposicion: [{ value: null, disabled: false }, Validators.required]
    }
    );
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
      }, err => {
        console.log(err.error);
      }
    );
  }

  updateList(id: number, property: string, registro: ReposicionArticulos) {
    this.detallearticulosreposicion[id][property] = this.detallearticulosreposicionpaginacion[id][property]

  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  SeleccionaTipoRep(tipo: any) {
    if (tipo == 2) {
      this.buscaplantilla = true;
      this.detallearticulosreposicionpaginacion = [];
      this.detallearticulosreposicion = [];
    } else {
      if (tipo == 3) {
        this.buscaplantilla = false;
      } else {
        if (tipo == 1) {
          this.buscaplantilla = false;
        }
        // console.log("no entró")
      }
    }
  }

  BuscarPlantillas() {


    this._BSModalRef = this._BsModalService.show(BusquedaplantillasbodegaComponent, this.setModalBusquedaPlantilla());

    this._BSModalRef.content.onClose.subscribe((response: any) => {

   
      
      this._BodegasService.BuscaPlantillas(this.servidor, sessionStorage.getItem('Usuario'), this.hdgcodigo, this.esacodigo,
        this.cmecodigo, response.planid, '', '', '', 0, 0, '', '', 1).subscribe(
          response_plantilla=> {
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
                                    }

                    }
                    this.loading = false;   
            });

          });

          this.loading = false;     

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
          tipoplantilla: true
        }
      };
      return dtModal;
    }

  BuscarRegistros() {
      var indice: number = 0;
      this.loading = true;


      this._reposicionService.BuscaRegistros(this.hdgcodigo, this.cmecodigo, this.FormReposicion.value.bodcodigo, this.FormReposicion.value.tiporegistro, this.datePipe.transform(this.FormReposicion.value.fechadesde, 'yyyy-MM-dd'),
        this.datePipe.transform(this.FormReposicion.value.fechahasta, 'yyyy-MM-dd'), this.usuario, this.servidor, this.FormReposicion.value.tiporeposicion).subscribe(
          response => {
            this.detallearticulosreposicion = response;

            if (this.detallearticulosreposicion.length > 0) {
              this.FormReposicion.get('chequeatodo').setValue(true);

              this.detallearticulosreposicion.forEach(element => {
                this.detallearticulosreposicion[indice].marca = "S";
                this.detallearticulosreposicion[indice].meinid = element.codmeinid;
                indice++;
              }


              );

              this.detallearticulosreposicionpaginacion = this.detallearticulosreposicion.slice(0, 20);
            } else {
              this.alertSwalAlert.title = "No se encuentran registro para procesar"; //mensaje a mostrar
              this.alertSwalAlert.show();// para que aparezca
            }
            this.loading = false;
          },
          error => {
            this.loading = false;
            alert("Error al Buscar Registros")
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
      if(this.FormReposicion.value.tiporeposicion == 4) {  //Estas son urgentes
      this.varSolicitud.prioridadsoli = 2;
    } else {
      this.varSolicitud.prioridadsoli = 1;
    }
    this.varSolicitud.accion = "I";
    this.varSolicitud.tiposolicitud = 10; // Solicitud de reposición
    this.varSolicitud.origensolicitud = 10; // Reposición de Bodegas

    this.varSolicitud.solicitudesdet = [];

    this.detallearticulosreposicion.forEach(element => {
      if (element.marca == "S") {
        const detalleSolicitud = new DetalleSolicitud();

        detalleSolicitud.codmei = element.codigomein;
        detalleSolicitud.estado = 10; // Solicitado 
        detalleSolicitud.meinid = element.meinid;
        detalleSolicitud.sodeid = null;
        detalleSolicitud.soliid = null;
        detalleSolicitud.cantsoli = Number(element.cantidadareponer);
        detalleSolicitud.cantdespachada = null;
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
        this.alertSwal.title = "Solicitud creada N°:".concat(response['solbodid']);
        this.alertSwal.show();
        this.loading = false;
        this.numsolicitud = response['solbodid'];

        this.existesolicitud = true;
      },
      error => {
        this.loading = false;
        console.log(error);
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
  }

  onImprimir() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea Imprimir Solicitud ?',
      text: "Confirmar Búsqueda",
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

          window.open(response[0].url, "", "", true);
          // this.alertSwal.title = "Reporte Impreso Correctamente";
          // this.alertSwal.show();

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
}