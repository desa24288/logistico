import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Permisosusuario } from '../../permisos/permisosusuario';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BodegasTodas } from 'src/app/models/entity/BodegasTodas';
import { BodegasService } from '../../servicios/bodegas.service';
import { InformesService } from '../../servicios/informes.service';

@Component({
  selector: 'app-inflistaconteoinventario',
  templateUrl: './inflistaconteoinventario.component.html',
  styleUrls: ['./inflistaconteoinventario.component.css'],
  providers: [InformesService]
})
export class InflistaconteoinventarioComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public modelopermisos         : Permisosusuario = new Permisosusuario();
  public FormInfListaConteoInventario      : FormGroup;
  public hdgcodigo              : number;
  public esacodigo              : number;
  public cmecodigo              : number;
  public usuario                = environment.privilegios.usuario;
  public servidor               = environment.URLServiciosRest.ambiente;
  public bodegasSolicitantes    : Array<BodegasTodas> = [];
  private _BSModalRef           : BsModalRef;
  public btnimprime             : boolean = false;

  constructor(
    private formBuilder             : FormBuilder,
    public _BodegasService          : BodegasService,
    private _imprimesolicitudService: InformesService,
  ) {

    this.FormInfListaConteoInventario = this.formBuilder.group({
      bodcodigo : [{ value: null, disabled: false }, Validators.required],
      tiporeg   : [{ value: null, disabled: false }, Validators.required],
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
    this.FormInfListaConteoInventario.controls.tiporeg.disable();
    this.BuscaBodegaSolicitante();
  }

  BuscaBodegaSolicitante() {
    this._BodegasService.listaBodegaTodasSucursal(this.hdgcodigo, this.esacodigo, this.cmecodigo, this.usuario, this.servidor).subscribe(
      response => {
        if (response != null) {
          this.bodegasSolicitantes = response;
        }
      },
      error => {
        alert("Error al Buscar Bodegas de cargo");
      }
    );
  }

  ActivaTipoRegistro(){
    this.FormInfListaConteoInventario.controls.tiporeg.enable();
  }

  ActivaBtnImprmir(){
    this.btnimprime = true;
  }

  Imprimir(tiporeporte: string) {

    // console.log("Imprime datos",this.servidor,this.usuario,tiporeporte, this.FormInfListaConteoInventario.value.bodcodigo,
    // this.FormInfListaConteoInventario.value.tiporeg,this.hdgcodigo,this.esacodigo,this.cmecodigo)
    if(tiporeporte === 'pdf'){
      this._imprimesolicitudService.RPTImprimeListaConteoInventario(this.servidor,this.usuario,
        "pdf",this.FormInfListaConteoInventario.value.bodcodigo,
        this.FormInfListaConteoInventario.value.tiporeg,this.hdgcodigo,this.esacodigo,this.cmecodigo).subscribe(
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
          }
        );
    }else{
      if(tiporeporte === 'xls'){
        // console.log("Imprime datos",this.servidor,this.usuario,tiporeporte, this.FormInfListaConteoInventario.value.bodcodigo,
        // this.FormInfListaConteoInventario.value.tiporeg,this.hdgcodigo,this.esacodigo,this.cmecodigo)

        this._imprimesolicitudService.RPTImprimeListaConteoInventario(this.servidor,this.usuario,
          "xls",this.FormInfListaConteoInventario.value.bodcodigo,
          this.FormInfListaConteoInventario.value.tiporeg,this.hdgcodigo,this.esacodigo,this.cmecodigo).subscribe(
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
            }
          );
      }
    }

  }

  limpiar() {
    this.FormInfListaConteoInventario.reset();
    this.FormInfListaConteoInventario.controls.tiporeg.disable();
    this.btnimprime = false;
  }

}
