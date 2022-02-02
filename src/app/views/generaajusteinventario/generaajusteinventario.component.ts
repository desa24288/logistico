import { Component, OnInit,ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BodegasService } from '../../servicios/bodegas.service';
import { TipoRegistro } from '../../models/entity/TipoRegistro';
import { TiporegistroService } from '../../servicios/tiporegistro.service';
import { BodegaDestino } from '../../models/entity/BodegaDestino';

import { MotivoAjuste } from '../../models/entity/MotivoAjuste';
import { MotivoAjusteService } from '../../servicios/motivoajuste.service';
import { InventariosService } from '../../servicios/inventarios.service';
import { IngresoConteoManual } from '../../models/entity/IngresoConteoManual';
import { InventarioDetalle } from '../../models/entity/InventarioDetalle';
import { GrabaAjuste } from '../../models/entity/GrabaAjuste';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';


@Component({
  selector    : 'app-generaajusteinventario',
  templateUrl : './generaajusteinventario.component.html',
  styleUrls   : ['./generaajusteinventario.component.css'],
  providers   : [InventariosService]
})
export class GeneraajusteinventarioComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  public FormGeneraAjusteInventario : FormGroup;
  public tiposderegistros           : Array<TipoRegistro> = [];
  public bodegasdestino             : Array<BodegaDestino> = [];
  public motivos                    : MotivoAjuste[]=[];
  //public motivos2                   : MotivoAjuste= new MotivoAjuste();
  public periodos                   : IngresoConteoManual[]=[];
  public detallesinventarios        : InventarioDetalle[]=[];
  public detallesinventariosPaginacion: InventarioDetalle[]=[];
  public hdgcodigo                  : number;
  public esacodigo                  : number;
  public cmecodigo                  : number;
  public usuario                    = environment.privilegios.usuario;
  public servidor                   = environment.URLServiciosRest.ambiente;
  private _BSModalRef               : BsModalRef;
  editField                         : any;
  paraminvajuste                    : GrabaAjuste[]=[];

  constructor(
    private formBuilder             : FormBuilder,
    public _BodegasService          : BodegasService,
    private _inventarioService     : InventariosService,
    public _BsModalService          : BsModalService,
    private TiporegistroService     : TiporegistroService,
    private MotivoAjusteService     : MotivoAjusteService
  ) {

    this.FormGeneraAjusteInventario = this.formBuilder.group({
      tiporegistro : [null],
      boddestino   : [null],
      periodo      : [null],
      //motivoajuste : [null]
    });
  }

  ngOnInit() {

    this.TiporegistroService.list(this.usuario,this.servidor).subscribe(
      data => {
        this.tiposderegistros = data;
      }, err => {
        console.log(err.error);
      }
    );

    this.MotivoAjusteService.list(this.usuario,this.servidor).subscribe(
      data => {
        this.motivos = data;
        console.log(this.motivos);
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

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent ;

    this.detallesinventariosPaginacion[id][property] = parseInt(editField);
    this.detallesinventarios[id][property] = this.detallesinventariosPaginacion[id][property]
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;

  }

  BuscaBodegaDestino() {
    // console.log("usuario:", this.usuario,"servidor:",this.servidor);
    this._BodegasService.listaBodegaDestinoSucursal(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor).subscribe(
      response => {
        if (response != null) {
          this.bodegasdestino = response;
        }
      },
      error => {
        console.log(error);

        alert("Error al Buscar Bodegas de Destino");
      }
    );
  }

  BuscaPeriodoInventario(codigobod: number){
    this._inventarioService.BuscaPeriodo(codigobod,this.usuario,this.servidor).subscribe(
      response => {
        if (response != null) {
          this.periodos=response
        }
      },
      error => {
        console.log(error);
        alert("Error al Buscar Período");
      }
    );

  }

  Limpiar(){

    this.FormGeneraAjusteInventario.reset();
    this.detallesinventariosPaginacion =[];
    this.detallesinventarios= [];
  }

  ConfirmaBusquedaDeInventarios(){
    /*this._BSModalRef = this._BsModalService.show(ModalConfirmaGuardarComponent, this.setModalMensajeAceptar());
    this._BSModalRef.content.onClose.subscribe((Respuesta: any) => {
      if (Respuesta == 'ACEPTADO') {
        this.BusquedaDeInventarios();
      }
    })*/
    this.BusquedaDeInventarios();
  }

  setModalMensajeAceptar() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-m',
      initialState: {
        titulo: 'CONFIRMAR', // Parametro para de la otra pantalla
        mensaje: 'USTED DEBE CONFIRMAR O CANCELAR LA BÚSQUEDA DE INVENTARIO',
        informacion: '',
      }
    };
    return dtModal;
  }

  BusquedaDeInventarios(){

    this._inventarioService.BuscaDetalleInventario(this.FormGeneraAjusteInventario.value.periodo,
      this.FormGeneraAjusteInventario.value.boddestino, this.FormGeneraAjusteInventario.value.tiporegistro,this.usuario,this.servidor).subscribe(
      response => {
        if (response != null) {
          if(response.length==0){
            this.alertSwalAlert.title="Debe ingresar parametros de búsqueda";
            this.alertSwalAlert.text="Puede que no existan registros"
            this.alertSwalAlert.show();
          }else{
            this.detallesinventarios=response;
            this.detallesinventariosPaginacion = this.detallesinventarios.slice(0,8)
          }
        }
      },
      error => {
        this.alertSwalError.title="Error al Buscar Inventarios, puede que no existan";
        this.alertSwalError.show();
      }
    );
  }

  CambioMotivo(registro:InventarioDetalle){
  }

  ConfirmaGeneraInventario(){
    const Swal = require('sweetalert2');

    Swal.fire({
      title: '¿ Desea Realizar el Ajuste a Inventario ?',
      text: "Confirmar el Ajuste",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.GuardaAjusteInventario();
      }
    })
  }

  GuardaAjusteInventario(){
    var estajuste= 0;
    this.detallesinventarios.forEach(element => {
        var temporal = new GrabaAjuste;
        temporal.iddetalleinven = element.iddetalleinven;
        temporal.idinventario   = element.idinventario;
        temporal.idmeinid       = element.idmeinid;
        temporal.codigomein     = element.codigomein;
        temporal.ajusteinvent   = element.ajusteinvent;
        temporal.stockinvent    = element.stockinvent;
        temporal.conteomanual   = element.conteomanual;
        temporal.productodesc   = element.productodesc;
        temporal.valorcosto     = element.valorcosto;
        temporal.bodegainv      = this.FormGeneraAjusteInventario.value.boddestino;
        temporal.responsable    = this.usuario;
        temporal.servidor       = this.servidor;
        temporal.tipomotivoajus = element.tipomotivoajus;//this.motivos[0].tipomotivoajus;
        temporal.estadoajuste   = element.estadoajuste;
        temporal.servidor       = this.servidor;
        if(this.detallesinventarios[0].estadoajuste==""){
          estajuste= estajuste+1;
        }else{
        }
        this.paraminvajuste.push(temporal);
        }
    );
  }

}
