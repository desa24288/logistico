import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { environment } from 'src/environments/environment';

import { DatePipe } from '@angular/common';

import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap';

import { Receta } from 'src/app/models/entity/receta';
import { MovimientoInterfaz } from 'src/app/models/entity/movimiento-interfaz';
import { InterfacesService } from 'src/app/servicios/interfaces.service';


import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { element } from 'protractor';



@Component({
  selector: 'app-panel-integracion-cargos',
  templateUrl: './panel-integracion-cargos.component.html',
  styleUrls: ['./panel-integracion-cargos.component.css']
})
export class PanelIntegracionCargosComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  
  public locale = 'es';
  public bsConfig: Partial<BsDatepickerConfig>;
  public colorTheme = 'theme-blue';

  public hdgcodigo: number;
  public esacodigo: number;
  public cmecodigo: number;
  public loading = false;
  public lForm: FormGroup;
  public servidor = environment.URLServiciosRest.ambiente;
  public usuario = environment.privilegios.usuario;



  public listahospitalizados: Array<MovimientoInterfaz> = [];
  public listahospitalizadosPaginacion: Array<MovimientoInterfaz> = [];

  public listaambulatorio: Array<MovimientoInterfaz> = [];
  public listaambulatorioPaginacion: Array<MovimientoInterfaz> = [];

  public listaurgencia: Array<MovimientoInterfaz> = [];
  public listaurgenciaPaginacion: Array<MovimientoInterfaz> = [];

  

  public _PageChangedEvent: PageChangedEvent;


  public canidad_movimiento_hospitalizados: number;
  public canidad_movimiento_ambulatorio: number;
  public canidad_movimiento_urgencia: number;


  public opcion_hospitalizado: boolean;
  public opcion_ambulatorio: boolean;
  public opcion_urgencia: boolean;
 
  //public tiempo_refresco = interval(120000);
  
  public _MovimientoInterfaz: MovimientoInterfaz;

  constructor(
    private _interfacesService : InterfacesService,
    public datePipe: DatePipe,
    public localeService            : BsLocaleService,
    public formBuilder: FormBuilder,
    ) 
    
    {
      this.lForm = this.formBuilder.group({
        fechadesde: [new Date(), Validators.required],
        fechahasta: [new Date(), Validators.required],
        cuenta: [{ value: null, disabled: false }, Validators.required],
      });
    }

    ngOnInit() {

      this.setDate();
    
      this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
      this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
      this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
      this.usuario = sessionStorage.getItem('Usuario').toString();
  
      this.canidad_movimiento_hospitalizados = 0;
      this.canidad_movimiento_ambulatorio = 0;
      this.canidad_movimiento_urgencia = 0;
   
      this.opcion_hospitalizado = false;
      this.opcion_ambulatorio = false;
      this.opcion_urgencia = false;

      this.BuscarMovimientoInterfazCargos();
  
  
  
      //this.tiempo_refresco.subscribe((n) => {
      //  this.BuscarSolicitudesFiltro()
      //  this.BuscarRecetasFiltro();
      //})
  
  
    }
    setDate() {
      defineLocale(this.locale, esLocale);
      this.localeService.use(this.locale);
      this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
    }
  
  BuscarMovimientoInterfazCargos() {
    
          this.listaambulatorio = [];
          this.listaambulatorioPaginacion = [];
          this.canidad_movimiento_ambulatorio = 0;

          this.listaurgencia = [];
          this.listaurgenciaPaginacion = [];
          this.canidad_movimiento_urgencia = 0;

          this.listahospitalizados = [];
          this.listahospitalizadosPaginacion = [];
          this.canidad_movimiento_hospitalizados =0;
          
          if (this.lForm.value.numerosolicitud != null && this.lForm.value.numerosolicitud  >0 ) {
            var fechadesde = '';
            var fechahasta = '';
          } else {
            var fechadesde = this.datePipe.transform(this.lForm.value.fechadesde, 'yyyy-MM-dd');
            var fechahasta = this.datePipe.transform(this.lForm.value.fechahasta, 'yyyy-MM-dd');
          
          }
          this.loading = true;

          this._MovimientoInterfaz = new(MovimientoInterfaz)

          this._MovimientoInterfaz.hdgcodigo =  Number(sessionStorage.getItem('hdgcodigo').toString())
          this._MovimientoInterfaz.esacodigo = Number(sessionStorage.getItem('cmecodigo').toString())
          this._MovimientoInterfaz.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString())
          this._MovimientoInterfaz.fechainicio = fechadesde
          this._MovimientoInterfaz.fechatermino = fechahasta
          this._MovimientoInterfaz.servidor     = this.servidor
          this._MovimientoInterfaz.ctanumcuenta = this.lForm.value.cuenta

          this._interfacesService.listamovimientointerfaz(this._MovimientoInterfaz).subscribe(
          response => {
 
                  if (response.length == 0) {
                    } else {
                            this.listahospitalizados = [];
                            this.listahospitalizadosPaginacion = [];
                            this.listaambulatorioPaginacion = [];
                            this.listaambulatorio  = [];
                            this.listaambulatorioPaginacion  = [];
                            this.canidad_movimiento_ambulatorio = 0;
                            this.listaurgencia =  [];
                            this.listaurgenciaPaginacion =  [];
                            this.canidad_movimiento_urgencia = 0;
      

                            response.forEach(element => {

                                          switch (element.codambito) {
                                            case 1: {
                                              this.listaambulatorio.unshift(element);
                                              break;
                                            }
                                            case 2: {
                                              this.listaurgencia.unshift(element);
                                              break;
                                            }
                                            case 3: {
                                              this.listahospitalizados.unshift(element);
                                              break;
                                            }
                                            default: {
                                              this.listaambulatorio.unshift(element);
                                              break;
                                            }
                                          }
                                        })
                      }
            

                      this.listaambulatorioPaginacion = this.listaambulatorio.slice(0, 10);
                      this.canidad_movimiento_ambulatorio = this.listaambulatorio.length;

                      this.listaurgenciaPaginacion = this.listaurgencia.slice(0, 10);
                      this.canidad_movimiento_urgencia = this.listaurgencia.length;

                      this.listahospitalizadosPaginacion = this.listahospitalizados.slice(0, 10);
                      this.canidad_movimiento_hospitalizados = this.listahospitalizados.length;
                      

                      this.loading = false;    
                      
                      
                      // aplicando filtros dentro de arreglos

                     // const result = this.listahospitalizados.filter(element => element.ctanumcuenta == 12964);

                      //console.log("Result>><", result);
          
          } )


          this.loading = false
        }



        
          refrescar() {


       
            this.BuscarMovimientoInterfazCargos()
     
          }
        
          eleccionopcion(opcion: string) {
            switch (opcion) {
              case 'HOSPITALIZADOS': {
                this.opcion_hospitalizado = true;
                this.opcion_ambulatorio = false;
                this.opcion_urgencia = false;
                break;
              }
              case 'AMBULATORIOS': {
                this.opcion_hospitalizado = false;
                this.opcion_ambulatorio = true;
                this.opcion_urgencia = false;
  
                break;
              }
              case 'URGENCIAS': {
                this.opcion_hospitalizado = false;
                this.opcion_ambulatorio = false;
                this.opcion_urgencia = true;
      
                break;
              }
            
              default: {
                this.opcion_hospitalizado = false;
                this.opcion_ambulatorio = false;
                this.opcion_urgencia = false;
      
                break;
              }
            }
    }
  
  
  
  
    Enviar(registro: MovimientoInterfaz) {

      registro.usuario = sessionStorage.getItem('Usuario').toString();
      registro.servidor = this.servidor;



      this._interfacesService.enviacargossisalud(registro).subscribe(
        response => {
            //recupero registro actualizado
            this.loading = true;

            this._MovimientoInterfaz = new(MovimientoInterfaz)
            this._MovimientoInterfaz = registro
            this._MovimientoInterfaz.hdgcodigo =  Number(sessionStorage.getItem('hdgcodigo').toString())
            this._MovimientoInterfaz.esacodigo = Number(sessionStorage.getItem('cmecodigo').toString())
            this._MovimientoInterfaz.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString())
            this._MovimientoInterfaz.servidor     = this.servidor
            if (this.lForm.value.numerosolicitud != null && this.lForm.value.numerosolicitud  >0 ) {
              var fechadesde = '';
              var fechahasta = '';
            } else {
              var fechadesde = this.datePipe.transform(this.lForm.value.fechadesde, 'yyyy-MM-dd');
              var fechahasta = this.datePipe.transform(this.lForm.value.fechahasta, 'yyyy-MM-dd');
            
            }
            this._MovimientoInterfaz.hdgcodigo =  Number(sessionStorage.getItem('hdgcodigo').toString())
            this._MovimientoInterfaz.esacodigo = Number(sessionStorage.getItem('cmecodigo').toString())
            this._MovimientoInterfaz.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString())
            this._MovimientoInterfaz.fechainicio = fechadesde
            this._MovimientoInterfaz.fechatermino = fechahasta
            this._MovimientoInterfaz.servidor     = this.servidor
            this._MovimientoInterfaz.ctanumcuenta = this.lForm.value.cuenta
            this._interfacesService.listamovimientointerfaz(this._MovimientoInterfaz).subscribe(
              response => {
                    //debería recuperar un solo movimiento dado que viaja el ID del detalle de movimiento
                    this.alertSwal.title = "Resultado envío de cargo:".concat(response[0].intcargoerror);
                    this.alertSwal.show();
              })




        }
      )

    }
  
  
    pageChangedCargosHospitalizados(event: PageChangedEvent): void {
      const startItem = (event.page - 1) * event.itemsPerPage;
      const endItem = event.page * event.itemsPerPage;
      this.listahospitalizadosPaginacion = this.listahospitalizados.slice(startItem, endItem);
    }




    paginacionAmbulatorio(event: PageChangedEvent): void {
      const startItem = (event.page - 1) * event.itemsPerPage;
      const endItem = event.page * event.itemsPerPage;
      this.listaambulatorioPaginacion = this.listaambulatorio.slice(startItem, endItem);
    }
  
    pageChangedCargosUrgencia(event: PageChangedEvent): void {
      const startItem = (event.page - 1) * event.itemsPerPage;
      const endItem = event.page * event.itemsPerPage;
      this.listaurgenciaPaginacion = this.listaurgencia.slice(startItem, endItem);
    }
    
  
    
  }
  