import { Component, OnInit , Input, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, PageChangedEvent } from 'ngx-bootstrap';
import { environment } from '../../../environments/environment';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Bodegas } from '../../models/entity/Bodegas';
import { Subject } from 'rxjs';
import { ConsultaBodega } from 'src/app/models/entity/consulta-bodega';
import { BodegasService } from 'src/app/servicios/bodegas.service';
import { EstructuraBodega } from 'src/app/models/entity/estructura-bodega';
import { TipoParametro } from 'src/app/models/entity/tipo-parametro';
import { Servicio } from 'src/app/models/entity/Servicio';
import { EstructuraunidadesService } from 'src/app/servicios/estructuraunidades.service';





@Component({
  selector: 'app-busquedabodegas',
  templateUrl: './busquedabodegas.component.html',
  styleUrls: ['./busquedabodegas.component.css']
})
export class BusquedabodegasComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  @Input() hdgcodigo: number;
  @Input() esacodigo: number;
  @Input() cmecodigo: number;
  @Input() titulo   : string;
  @Input() codbodega: number;
  @Input() glosabodega: string;
  @Input() codigobodega: string;


  public FormBusquedaBodega: FormGroup;
  public loading        = false;
  public usuario        = environment.privilegios.usuario;
  public servidor       = environment.URLServiciosRest.ambiente
  public onClose        : Subject<Bodegas>;
  public estado         : boolean = false;
  public parametroconsultabodega : ConsultaBodega;
  public listaEstructuraBodegas  : EstructuraBodega[]= [];
  public listaEstructuraBodegasPaginacion : EstructuraBodega[]= [];
  public arreglotipobodega : TipoParametro[]=[];
  public arreglotipoproducto : TipoParametro[]=[];
  public arregloservicios : Servicio[]=[]






  constructor(
    public bsModalRef           : BsModalRef,
    public formBuilder          : FormBuilder,
    private _buscabodegasService: BodegasService,
    private _unidadesService : EstructuraunidadesService,

  ) {
    this.FormBusquedaBodega = this.formBuilder.group({
      codbodega   : [{ value: null, disabled: false }, Validators.required],
      descripcion : [{ value: null, disabled: false }, Validators.required],
      servicio    : [{ value: null, disabled: false }, Validators.required],
      servicioid  : [{ value: null, disabled: false }, Validators.required],
      unidadid    : [{ value: null, disabled: false }, Validators.required],
      estadobodega: [{ value: null, disabled: false }, Validators.required],
      tipobodega  : [{ value: null, disabled: false }, Validators.required],
      tipoproducto: [{ value: null, disabled: false }, Validators.required],
      codigobodega: [{ value: null, disabled: false }, Validators.required]
      }
    );
  }

  ngOnInit() {
    this.onClose = new Subject();

    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());

    this.FormBusquedaBodega.get("estadobodega").setValue("S");

    this._buscabodegasService.listatipobodega(this.hdgcodigo,this.usuario, this.servidor).subscribe(
      response => {
        if (response != null){
          this.arreglotipobodega = response;
        }
      });

    this._buscabodegasService.listatipoproducto(this.hdgcodigo,this.usuario, this.servidor).subscribe(
      response => {
        if (response != null){
          this.arreglotipoproducto = response;
        }
      }
    );

    this._unidadesService.BuscarServicios(this.hdgcodigo, this.esacodigo,this.cmecodigo,this.usuario, this.servidor,0,'').subscribe(
      response => {
        if (response != null){
          this.arregloservicios = response;
        }
      }
    );

    this.FormBusquedaBodega.get('codbodega').setValue(this.codbodega);
    this.FormBusquedaBodega.get('codigobodega').setValue(this.codigobodega)
    this.FormBusquedaBodega.get('descripcion').setValue(this.glosabodega);

    this._buscabodegasService.listaCabeceraBodegas(this.hdgcodigo,this.cmecodigo,this.codbodega,this.codigobodega,this.glosabodega,
      'S',null,null, sessionStorage.getItem('Usuario'),this.servidor).subscribe(
        response => {
          if (response != null){
            this.loading = false;
            this.listaEstructuraBodegas = response;
            this.listaEstructuraBodegasPaginacion = this.listaEstructuraBodegas.slice(0,10);
          } else {
            this.loading = false;
          }
        }
      );


  }

  BuscaBodegas(codbodega:string,estadobodega:string,codigotipobodega:string,servicio:number,unidad:number,descripcion:string,codtipoproducto:string)
  {
    this.loading = true;

    this._buscabodegasService.listaCabeceraBodegas(this.hdgcodigo,this.cmecodigo,0,codbodega,descripcion,
    estadobodega,codtipoproducto,codigotipobodega, sessionStorage.getItem('Usuario'),this.servidor).subscribe(
      response => {
        if (response != null){
          this.loading = false;
          this.listaEstructuraBodegas = response;
          this.listaEstructuraBodegasPaginacion = this.listaEstructuraBodegas.slice(0,10);
        } else {
          this.loading = false;
        }
      }
    );
  }




  getNombreBodega(nombrebodega: string) {

    if (nombrebodega.length > 50 ) {
      this.alertSwalError.title = "Largo descripción de bodega no puede ser mayor a 50";
      this.alertSwalError.show();
      this.FormBusquedaBodega.get('descripcion').setValue('');

    }
  }


  getBodega(codbodega: any) {


    if (codbodega > 99999 ) {
      this.alertSwalError.title = "Largo código de bodega no puede ser mayor a 5 dígitos";
      this.alertSwalError.show();
      this.FormBusquedaBodega.get('codbodega').setValue('');

    }
    this.loading = true;

    this._buscabodegasService.listaCabeceraBodegas(this.hdgcodigo,this.cmecodigo,0,codbodega,null,
    null,null,null, sessionStorage.getItem('Usuario'),this.servidor).subscribe(
      response => {
        if (response != null){
          this.loading = false;
          this.listaEstructuraBodegas = response;
          this.listaEstructuraBodegasPaginacion = this.listaEstructuraBodegas.slice(0,10);
        } else {
          this.loading = false;
        }
      }
    );
  }


  onCerrar(bodega: EstructuraBodega) {
    this.estado = true;
    this.onClose.next(bodega);
    this.bsModalRef.hide();
  };

  onCerrarSalir() {
    this.estado = true;
    this.onClose.next();
    this.bsModalRef.hide();
  };

  Limpiar(){
    this.FormBusquedaBodega.reset();
    this.listaEstructuraBodegasPaginacion  =[];
    this.listaEstructuraBodegas  =[];
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.listaEstructuraBodegasPaginacion = this.listaEstructuraBodegas.slice(startItem, endItem);
  }
}
