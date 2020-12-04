import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PageChangedEvent } from 'ngx-bootstrap';
import { EstadoSolicitudBodega } from '../../models/entity/EstadoSolicitudBodega';
import { EstadosolicitudbodegaService } from '../../servicios/estadosolicitudbodega.service';
import { Prioridades } from '../../models/entity/Prioridades';
import { PrioridadesService } from '../../servicios/prioridades.service';
import { BodegasService } from '../../servicios/bodegas.service';
import { Solicitud } from 'src/app/models/entity/Solicitud';

//Manejo de fechas 
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { SolicitudService } from 'src/app/servicios/Solicitudes.service';
import { OrigenSolicitud } from 'src/app/models/entity/OrigenSolicitud';
import { BodegasTodas } from 'src/app/models/entity/BodegasTodas';
import { BodegasrelacionadaAccion } from 'src/app/models/entity/BodegasRelacionadas';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { element } from 'protractor';

@Component({
  selector: 'app-busquedasolicitudes',
  templateUrl: './busquedasolicitudes.component.html',
  styleUrls: ['./busquedasolicitudes.component.css']
})
export class BusquedasolicitudesComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  @Input() hdgcodigo: number;
  @Input() esacodigo: number;
  @Input() cmecodigo: number;
  @Input() titulo   : string;
  @Input() filtrodenegocio   : string;
  @Input() origen : string;
  @Input() numerosolic : number;

  public onClose                      : Subject<Solicitud>;
  public estado                       : boolean = false;
  public lForm                        : FormGroup;
  public prioridades                  : Array<Prioridades> = [];
  public ListaOrigenSolicitud         : Array<OrigenSolicitud> = [];
  public estadossolbods               : Array<EstadoSolicitudBodega> = [];
  public listasolicitudes             : Array<Solicitud> = [];
  public listasolicitudespaginacion   : Array<Solicitud> = [];
  public solicitud                    : Array<Solicitud> = [];
  public bodegasSolicitantes          : Array<BodegasTodas> = [];
  public bodegassuministro            : Array<BodegasrelacionadaAccion> = [];
  public loading                      = false;
  public servidor                     = environment.URLServiciosRest.ambiente;
  public usuario                      = environment.privilegios.usuario;
  //fechas
  public locale     = 'es';
  public bsConfig   : Partial<BsDatepickerConfig>;
  public colorTheme = 'theme-blue';

  constructor(
    public bsModalRef                   : BsModalRef,
    public formBuilder                  : FormBuilder,
    private _buscasolicitudService      : SolicitudService,
    private EstadoSolicitudBodegaService: EstadosolicitudbodegaService,
    private PrioridadesService          : PrioridadesService,
    public _BodegasService              : BodegasService,
    public datePipe                     : DatePipe,
    public localeService                : BsLocaleService,
  ) {

    this.lForm = this.formBuilder.group({
      numerosolicitud     : [{ value: null, disabled: false }, Validators.required],
      codorigensolicitud  : [{ value: null, disabled: false }, Validators.required],
      prioridad           : [{ value: null, disabled: false }, Validators.required],
      bodsercodigo        : [{ value: null, disabled: false }, Validators.required],
      estado              : [{ value: null, disabled: false }, Validators.required],
      fechadesde          : [new Date(),Validators.required ],
      fechahasta          : [new Date(),Validators.required ],
      tiposolicitud       : [{ value: null, disabled: false }, Validators.required],
      bodcodigo           : [{ value: null, disabled: false }, Validators.required],
      codbodegasuministro : [{ value: null, disabled: false }, Validators.required],
    });

  }

  ngOnInit() {
    this.usuario = sessionStorage.getItem('Usuario').toString();
    this.setDate();
    this.onClose = new Subject();
    if(this.origen == "Autopedido" || this.origen =="DevolucionAutopedido"){
      this._buscasolicitudService.ListaOrigenSolicitud(this.usuario,this.servidor,60).subscribe(
        response => {
          this.ListaOrigenSolicitud = response;      
        },
        err => {
          console.log(err.error);
        }
      );
    }
    if(this.origen == "Otros"){
      this._buscasolicitudService.ListaOrigenSolicitud(this.usuario,this.servidor,30).subscribe(
        response => {
          this.ListaOrigenSolicitud = response;      
        },
        err => {
          console.log(err.error);
        }
      );
    }
    
    if(this.origen == "DevolucionAutopedido"){
      this.lForm.get('numerosolicitud').setValue(this.numerosolic);    
    }

    this.PrioridadesService.list(this.usuario,this.servidor).subscribe(
      data => {
        this.prioridades = data;
      }, err => {
        console.log(err.error);
      }
    );

    this.EstadoSolicitudBodegaService.list(this.usuario,this.servidor).subscribe(
      data => {
        this.estadossolbods = data;
      }, err => {
        console.log(err.error);
      }
    );

    
  
    this._BodegasService.listaBodegaTodasSucursal(this.hdgcodigo, this.esacodigo, this.cmecodigo,this.usuario,this.servidor).subscribe(
      response => {
        this.bodegasSolicitantes = response;
      },
      error => {
        alert("Error al Buscar Bodegas de cargo");
      }
    );
  }




  ngAfterViewInit() {
    this.BuscarSolicitudesFiltro();
  }

  onCerrar(SolicitudSeleccionada: Solicitud) {
    this.estado = true;
    this.onClose.next(SolicitudSeleccionada);
    this.bsModalRef.hide();
  };

  onCerrarSalir() {
    this.estado = true;
    this.onClose.next();
    this.bsModalRef.hide();
  };

  BuscarSolicitudesFiltro()
   {
    this.solicitud= [];
    var servidor = environment.URLServiciosRest.ambiente;
    var idOrigen = 0;
    console.log("this.origen",this.origen)

    switch (this.origen) {
      case "Autopedido": 
              idOrigen = 60;
             console.log("Entra a caso Autopedido", idOrigen)      
              break;
      case "Otros":  
              idOrigen = 0;
              console.log("entra a otros",idOrigen)
              break;
      case "DevolucionAutopedido": 
              idOrigen = 60;
              this.lForm.controls.estado.disable();
              this.lForm.controls.bodcodigo.disable();
              this.lForm.controls.codbodegasuministro.disable(); 
               
              break;
      // case "Todo-Medico":   
      //         tipodeproducto = 'MIM'; 
      //         idBodega= this.id_Bodega;         
      //         break;

     
      // default:
      //   idOrigen = 0;
    }
   
    if(this.lForm.value.codorigensolicitud >0){
      idOrigen = this.lForm.value.codorigensolicitud;
      console.log("revisa si el origen tiene dato",idOrigen, this.lForm.value.codorigensolicitud)
    }
    console.log("Datos busqueda", this.lForm.value.numerosolicitud, this.hdgcodigo,
    this.esacodigo, this.cmecodigo, this.lForm.value.tiposolicitud,
    this.datePipe.transform(this.lForm.value.fechadesde, 'yyyy-MM-dd'),
    this.datePipe.transform(this.lForm.value.fechahasta, 'yyyy-MM-dd'), 
    this.lForm.value.bodsercodigo,this.lForm.value.boddescodigo,
    this.lForm.value.estado,servidor, this.lForm.value.prioridad,0,0,0,0,0,"",this.filtrodenegocio,
    idOrigen)


    this.loading = true;
    this._buscasolicitudService.BuscaSolicitudCabecera(this.lForm.value.numerosolicitud, this.hdgcodigo,
    this.esacodigo, this.cmecodigo, this.lForm.value.tiposolicitud,
    this.datePipe.transform(this.lForm.value.fechadesde, 'yyyy-MM-dd'),
    this.datePipe.transform(this.lForm.value.fechahasta, 'yyyy-MM-dd'), 
    this.lForm.value.bodsercodigo,this.lForm.value.boddescodigo,
    this.lForm.value.estado,servidor, this.lForm.value.prioridad,0,0,0,0,0,"",this.filtrodenegocio,
    idOrigen,this.usuario).subscribe(
    response => {
      if(response.length==0){
        this.alertSwalError.title="No encuentra la Solicitud buscada";
        this.alertSwalError.text="Puede que la solicitud no exista dentro del período indicado, favor intentar nuevamente";
        this.alertSwalError.show();
        this.loading = false;
      }else{
        if(response.length>0){
          console.log("solic ",response)
          response.forEach(element =>{
            if( element.origensolicitud !=60 && this.origen == "Otros"){
              console.log("Verifica que no cargue solic de autopedido",element)

              // var solicitud = new Solicitud()
              this.solicitud.push(element);
              this.listasolicitudes = this.solicitud;
              this.listasolicitudespaginacion = this.listasolicitudes.slice(0, 8);
            }else{
              if(element.origensolicitud ==60 && this.origen == "Autopedido" || this.origen == "DevolucionAutopedido"){
                console.log("Carga las solic autopedidos")
                this.listasolicitudes = response;
              this.listasolicitudespaginacion = this.listasolicitudes.slice(0, 8);
              }
            }
          })
          
          this.loading= false;
        }        
      }
      
      },
      error => {
        console.log(error);
        this.alertSwalError.title="Error al Buscar Solicitudes";
        this.alertSwalError.text ="No encuentra Solicitud, puede que no exista, intentar nuevamente";
        this.alertSwalError.show();
        this.loading=false;
      }
    )
  }

  /* Función búsqueda con paginación */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listasolicitudespaginacion = this.listasolicitudes.slice(startItem, endItem);
  }

  setDate() { 
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  BuscaBodegasSuministro(codbodega_solicitante: number) {
    this._BodegasService.listaBodegaRelacionadaAccion(this.hdgcodigo, this.esacodigo, this.cmecodigo,
    this.usuario,this.servidor, codbodega_solicitante,1).subscribe(
      response => {
        this.bodegassuministro = response;
      },
      error => {
        alert("Error al Buscar Bodegas de Destino");
      }
    );
  }

  Limpiar(){
    this.lForm.reset();
    this.lForm.get('fechadesde').setValue(new Date());    
    this.lForm.get('fechahasta').setValue(new Date());
    this.listasolicitudespaginacion=[];
    this.listasolicitudes = [];
    this.solicitud = [];
  }

}