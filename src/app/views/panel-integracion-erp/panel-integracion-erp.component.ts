import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { environment } from 'src/environments/environment';

import { DatePipe } from '@angular/common';

import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap';


import { MovimientoInterfaz } from 'src/app/models/entity/movimiento-interfaz';
import { InterfacesService } from 'src/app/servicios/interfaces.service';


import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';



@Component({
  selector: 'app-panel-integracion-erp',
  templateUrl: './panel-integracion-erp.component.html',
  styleUrls: ['./panel-integracion-erp.component.css']
})
export class PanelIntegracionERPComponent implements OnInit {
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



  public listabodegas: Array<MovimientoInterfaz> = [];
  public listabodegasPaginacion: Array<MovimientoInterfaz> = [];

  public listapacientes: Array<MovimientoInterfaz> = [];
  public listapacientesPaginacion: Array<MovimientoInterfaz> = [];



  

  public _PageChangedEvent: PageChangedEvent;


  public canidad_movimiento_bodegas: number;
  public canidad_movimiento_pacientes: number;



  public opcion_bodegas: boolean;
  public opcion_pacientes: boolean;

 
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
  
      this.canidad_movimiento_bodegas= 0;
      this.canidad_movimiento_pacientes = 0;
   
   
      this.opcion_bodegas = false;
      this.opcion_pacientes = false;

      this.BuscarMovimientoInterfazERP();

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
  
  BuscarMovimientoInterfazERP() {
    
          this.listapacientes = [];
          this.listapacientesPaginacion = [];
          this.canidad_movimiento_pacientes = 0;

          this.listabodegas = [];
          this.listabodegasPaginacion = [];
          this.canidad_movimiento_bodegas =0;
          
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
                           
                          
                            this.listapacientes = response
      
                      }

                      this.listapacientesPaginacion = this.listapacientes.slice(0, 10);
                      this.canidad_movimiento_pacientes= this.listapacientes.length;

          } )


          this._interfacesService.listarmovimientointerfazbodegas(this._MovimientoInterfaz).subscribe(
            response => {
   
                    if (response.length == 0) {
                      } else {

                              this.listabodegas = response;


                        }
  
                        this.listabodegasPaginacion = this.listabodegas.slice(0, 10);
                        this.canidad_movimiento_bodegas = this.listabodegas.length; 
                
            
            } )

          this.loading = false
        }



        
          refrescar() {


       
            this.BuscarMovimientoInterfazERP()
     
          }
        
          eleccionopcion(opcion: string) {
            switch (opcion) {
              case 'BODEGAS': {
                this.opcion_bodegas = true;
                this.opcion_pacientes = false;
                break;
              }
              case 'PACIENTES': {
                this.opcion_bodegas = false;
                this.opcion_pacientes = true;
  
                break;
              }
                     
              default: {
                this.opcion_bodegas = false;
                this.opcion_pacientes = true;
      
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
  
  
    pageChangedMovimientosBodegas(event: PageChangedEvent): void {
      const startItem = (event.page - 1) * event.itemsPerPage;
      const endItem = event.page * event.itemsPerPage;
      this.listabodegasPaginacion = this.listabodegas.slice(startItem, endItem);
    }




    pageChangedMovimientosPacientes(event: PageChangedEvent): void {
      const startItem = (event.page - 1) * event.itemsPerPage;
      const endItem = event.page * event.itemsPerPage;
      this.listapacientesPaginacion = this.listapacientes.slice(startItem, endItem);
    }
  

  
    
  }
  
