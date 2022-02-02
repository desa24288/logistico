import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { DatePipe } from '@angular/common';
import { esLocale } from 'ngx-bootstrap/locale';
import { Permisosusuario } from '../../permisos/permisosusuario';
import { InformesService } from '../../servicios/informes.service';

@Component({
  selector: 'app-infpedidoscongastoservicio',
  templateUrl: './infpedidoscongastoservicio.component.html',
  styleUrls: ['./infpedidoscongastoservicio.component.css'],
  providers: [ InformesService]
})
export class InfpedidoscongastoservicioComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public modelopermisos         : Permisosusuario = new Permisosusuario();
  public FormInfPedidosGastoServicio : FormGroup;
  public hdgcodigo              : number;
  public esacodigo              : number;
  public cmecodigo              : number;
  public usuario                = environment.privilegios.usuario;
  public servidor               = environment.URLServiciosRest.ambiente;
  public btnimprime             : boolean = false;
  private _BSModalRef           : BsModalRef;
  public bsConfig               : Partial<BsDatepickerConfig>;
  public locale                 = 'es';
  public colorTheme             = 'theme-blue';

  constructor(
    private formBuilder             : FormBuilder,
    private _imprimesolicitudService: InformesService,
    public localeService            : BsLocaleService,
    public datePipe                 : DatePipe,
  ) {

    this.FormInfPedidosGastoServicio = this.formBuilder.group({

      fechadesde: [new Date(), Validators.required],
      fechahasta: [new Date(), Validators.required],
      hdgcodigo : [{ value: null, disabled: false }, Validators.required],
      esacodigo : [{ value: null, disabled: false }, Validators.required],
      cmecodigo : [{ value: null, disabled: false }, Validators.required],

    });
  }

  ngOnInit() {

    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();

    this.setDate();

    if(this.FormInfPedidosGastoServicio.controls.fechahasta.value != null || this.FormInfPedidosGastoServicio.controls.fechahasta.value != undefined){
      this.btnimprime = true;
    }
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  Imprimir(tiporeporte: string) {
    let fecha1
    let fecha2
    let fecha3
    let fecha4

    fecha3 = this.FormInfPedidosGastoServicio.value.fechadesde
    fecha4 = this.FormInfPedidosGastoServicio.value.fechahasta

    let same = fecha3.getTime() === fecha4.getTime() || fecha3.getTime() < fecha4.getTime();

    if(fecha3 > fecha4){
      this.alertSwalAlert.title = "La fecha de inicio es mayor a la fecha final";
      this.alertSwalAlert.text = "Ingrese otra fecha de inicio";
      this.alertSwalAlert.show();
    }else{
      if(fecha3 <= fecha4){

        if(tiporeporte === 'pdf'){
          this._imprimesolicitudService.RPTImprimePedidosConGastoServicio(this.servidor,this.hdgcodigo,this.esacodigo,
            this.cmecodigo,this.usuario,"pdf",
            this.datePipe.transform(this.FormInfPedidosGastoServicio.value.fechadesde, 'yyyy-MM-dd'),
            this.datePipe.transform(this.FormInfPedidosGastoServicio.value.fechahasta, 'yyyy-MM-dd'),
            ).subscribe(
              response => {
                if (response != null) {
                  window.open(response[0].url, "", "");
                }
              },
              error => {
                console.log(error);
                this.alertSwalError.title = "Error al Imprimir Listado";
                this.alertSwalError.show();
                this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
                })
              }
            );
        }else{
          if(tiporeporte === 'xls'){

            this._imprimesolicitudService.RPTImprimePedidosConGastoServicio(this.servidor,this.hdgcodigo,this.esacodigo,
              this.cmecodigo,this.usuario,"xls",
              this.datePipe.transform(this.FormInfPedidosGastoServicio.value.fechadesde, 'yyyy-MM-dd'),
              this.datePipe.transform(this.FormInfPedidosGastoServicio.value.fechahasta, 'yyyy-MM-dd'),
              ).subscribe(
                response => {
                  if (response != null) {
                    window.open(response[0].url, "", "");
                  }
                },
                error => {
                  console.log(error);
                  this.alertSwalError.title = "Error al Imprimir Listado";
                  this.alertSwalError.show();
                  this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
                  })
                }
              );
          }
        }

      }
    }
  }

  limpiar() {
    this.FormInfPedidosGastoServicio.reset();
    this.FormInfPedidosGastoServicio.get('fechadesde').setValue(new Date());
    this.FormInfPedidosGastoServicio.get('fechahasta').setValue(new Date());
    if(this.FormInfPedidosGastoServicio.controls.fechahasta.value != null || this.FormInfPedidosGastoServicio.controls.fechahasta.value != undefined){
      this.btnimprime = true;
    }else{
      this.btnimprime = false;
    }

  }

}
