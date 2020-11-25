import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TipoRegistro } from '../../models/entity/TipoRegistro';
import { TiporegistroService } from '../../servicios/tiporegistro.service';
import { BodegaDestino } from '../../models/entity/BodegaDestino';
import { BodegasService } from '../../servicios/bodegas.service';
import { InformesService } from '../../servicios/informes.service'
import { DatePipe } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-informeexistenciasvalorizadas',
  templateUrl: './informeexistenciasvalorizadas.component.html',
  styleUrls: ['./informeexistenciasvalorizadas.component.css'],
  providers : [InformesService]
})
export class InformeexistenciasvalorizadasComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public FormListadoInventario: FormGroup;
  public hdgcodigo            : number;
  public esacodigo            : number;
  public cmecodigo            : number;
  public servidor             = environment.URLServiciosRest.ambiente;
  public usuario              = environment.privilegios.usuario;
  public tiposderegistros     : Array<TipoRegistro> = [];
  public bodegasdestino       : Array<BodegaDestino> = [];
  private _BSModalRef         : BsModalRef;

  constructor(
    private TiporegistroService       : TiporegistroService,
    public _BodegasService            : BodegasService,
    private formBuilder               : FormBuilder,
    private _informeexistenciasService: InformesService,
    public _BsModalService            : BsModalService,
    public datePipe                   : DatePipe,
  ) {

    this.FormListadoInventario = this.formBuilder.group({         
      tiporegistro : [null],
      boddestino   : [null],
      fecha      : [null],      
    });
   }

  ngOnInit() {

    this.TiporegistroService.list(this.usuario,this.servidor).subscribe(
      data => {
        this.tiposderegistros = data;
        console.log(data);
      }, err => {
        console.log(err.error);
      }
    );
  }

  getHdgcodigo(event: any) {
    this.hdgcodigo = event.hdgcodigo;

  }
  getEsacodigo(event: any) {
    this.esacodigo = event.esacodigo;
  }

  getCmecodigo(event: any) {
    this.cmecodigo = event.cmecodigo;
  
    this.BuscaBodegaDestino();
  }

  LimpiaPantalla(){
    this.FormListadoInventario.reset();
  }

  BuscaBodegaDestino() {    

    this._BodegasService.listaBodegaDestinoSucursal(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor).subscribe(
      response => {
        this.bodegasdestino = response;
        console.log("bod dest", this.bodegasdestino)
      },
      error => {
        console.log(error);        
        alert("Error al Buscar Bodegas de Destino");
      }
    );
  }

  ConfirmaImprimirReporte(tiporeport: string){
    const Swal = require('sweetalert2');

    Swal.fire({
      title: '¿Desea Imprimir Existencias Valorizadas ?',
      text: "Confirmar Impresión de Existencias",
      //icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {

        this.LlamaReporte(tiporeport);
      }
    })    
  }

  LlamaReporte(tiporeport: string){
    var fecha=this.datePipe.transform(this.FormListadoInventario.value.fecha, 'yyyy-MM-dd');
    if(tiporeport=="pdf"){
      this._informeexistenciasService.RPTInformeExistencias(tiporeport,this.FormListadoInventario.value.boddestino,
      this.FormListadoInventario.value.tiporegistro, fecha,this.hdgcodigo,
      this.esacodigo,this.cmecodigo).subscribe(
        response => {
          
          window.open(response[0].url,"","",true);    
          // this.alertSwal.title = "Reporte Impreso Correctamente".concat();
          // this.alertSwal.show();
        },
        error => {
          console.log(error);
          this.alertSwalError.title="Error al Imprimir Reporte  Informe Existencias Valorizadas".concat(error);
          //this.alertSwalError.text="No encuentra , puede que no existan. Favor intenar nuevamente";
          this.alertSwalError.show();
          
        }
      );
    }else{
      if(tiporeport == "xls"){
        this._informeexistenciasService.RPTInformeExistencias("xls",this.FormListadoInventario.value.boddestino,
        this.FormListadoInventario.value.tiporegistro, fecha,this.hdgcodigo,
        this.esacodigo,this.cmecodigo).subscribe(
          response => {
              
            window.open(response[0].url,"","",true);
            // this.alertSwal.title = "Reporte Impreso Correctamente".concat();
            // this.alertSwal.show();
          },
          error => {
            console.log(error);
            this.alertSwalError.title="Error al Imprimir Reporte  Informe Existencias Valorizadas".concat(error);
            //this.alertSwalError.text="No encuentra , puede que no existan. Favor intenar nuevamente";
            this.alertSwalError.show();
          }
        );  
      }
    }
  }

  
 
}