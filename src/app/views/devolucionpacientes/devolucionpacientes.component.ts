import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../../environments/environment';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { DatePipe, JsonPipe } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { PageChangedEvent } from 'ngx-bootstrap';
/*Components */
import { ModalpacienteComponent } from '../modalpaciente/modalpaciente.component';
/*Services */
import { SolicitudService } from '../../servicios/Solicitudes.service';
import { PacientesService } from '../../servicios/pacientes.service';
/*Models */
import { Solicitudespacienteproducto } from '../../models/entity/Solicitudespacienteproducto';
import { DevuelveDatosUsuario } from 'src/app/models/entity/DevuelveDatosUsuario';
import { Solicitud } from 'src/app/models/entity/Solicitud';

import { Recepciondevolucionpaciente } from './../../models/entity/Recepciondevolucionpaciente';
import { ParamDetDevolPaciente } from '../../models/entity/ParamDetDevolPaciente';
import { InformesService } from '../../servicios/informes.service';
import { Permisosusuario } from '../../permisos/permisosusuario';
import { BusquedaproductosComponent } from '../busquedaproductos/busquedaproductos.component';

@Component({
  selector: 'app-devolucionpacientes',
  templateUrl: './devolucionpacientes.component.html',
  styleUrls: ['./devolucionpacientes.component.css'],
  providers : [InformesService]
})
export class DevolucionpacientesComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;
  @ViewChild('alertSwalConfirmar', { static: false }) alertSwalConfirmar: SwalComponent;
  @ViewChild('alertSwalGrilla', { static: false }) alertSwalGrilla: SwalComponent;

  public modelopermisos           : Permisosusuario = new Permisosusuario();
  //array
  public alerts: Array<any> = [];
  public solicitudeslista         : Array<Solicitudespacienteproducto> = [];
  public solicitudeslistapag      : Array<Solicitudespacienteproducto> = [];
  public solicitudesgrilla        : Array<Solicitudespacienteproducto> = [];
  public solicitudseleccion       : Array<Solicitudespacienteproducto> = [];
  public arrParamDetDevolPaciente : Array<ParamDetDevolPaciente> = [];
  public solicitudesgrillaPaginacion: Array<Solicitudespacienteproducto>= [];
  //obj
  public pForm                : FormGroup;
  public dForm                : FormGroup;
  private _BSModalRef         : BsModalRef;
  public dataPacienteSolicitud: Solicitud = new Solicitud();
  public bsConfig             : Partial<BsDatepickerConfig>;
  public recepciondevolucionpaciente: Recepciondevolucionpaciente = new Recepciondevolucionpaciente;
  //var
  public locale         = 'es';
  public colorTheme     = 'theme-blue';
  public hdgcodigo      : number;
  public esacodigo      : number;
  public cmecodigo      : number;
  public tipobusqueda   = 'Paciente';
  public servidor       = environment.URLServiciosRest.ambiente;
  public usuario        = environment.privilegios.usuario;
  public loading        = false;
  public solicitudexist = false;
  public vacios         = false;
  public solicituddevuelta = false;
  public descprod       = null;

  constructor(
    public datePipe         : DatePipe,
    public formBuilder      : FormBuilder,
    public _BsModalService  : BsModalService,
    public _solicitudService: SolicitudService,
    public localeService    : BsLocaleService,
    public _pacienteService : PacientesService,
    private _imprimesolicitudService: InformesService
  ) {
    this.pForm = this.formBuilder.group({
      nompaciente: [{ value: null, disabled: true }, Validators.required],
      rut: [{ value: null, disabled: true }, Validators.required]
    });

    this.dForm = this.formBuilder.group({
      codmei: [{ value: null, disabled: true }, Validators.required],
      soliid: [{ value: null, disabled: true }, Validators.required],
      fechavto: [{ value: null, disabled: true }, Validators.required],
      lote: [{ value: null, disabled: true }, Validators.required],
      cantidad: [{ value: null, disabled: true }, Validators.required],
      descripcion : [{ value: null, disabled: true }, Validators.required]
    });
  }

  ngOnInit() {
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();

    this.datosUsuario();
    this.setDate();
  }

  limpiar() {
    this.dForm.reset();
    this.pForm.reset();
    this.dataPacienteSolicitud = null;
    this.solicitudesgrilla = [];
    this.solicitudseleccion = [];
    this.arrParamDetDevolPaciente = [];
    this.dForm.get('fechavto').setValue(new Date());
    this.logicaGrabar();
    this.solicitudesgrillaPaginacion = [];
    this.solicitudesgrilla = []
    this.descprod = null;this.dForm.get('codmei').disable();
    this.dForm.get('soliid').disable();
    this.dForm.get('cantidad').disable();
    this.dForm.get('lote').disable();
    this.dForm.get('fechavto').disable();
    this.dForm.get('descripcion').disable();
  }

  datosUsuario() {
    var datosusuario = new DevuelveDatosUsuario();
    datosusuario = JSON.parse(sessionStorage.getItem('Login'));
    this.hdgcodigo = datosusuario[0].hdgcodigo;
    this.esacodigo = datosusuario[0].esacodigo;
    this.cmecodigo = datosusuario[0].cmecodigo;
  }

  buscarSolicitud() {
    if (this.dForm.controls['codmei'].invalid == false) {
      this.BuscarSolicitudesPacientes();
    }
  }

  onBuscar(tipo: string) {
    if (this.hdgcodigo == null || this.esacodigo == null || this.cmecodigo == null) {
      this.alertSwalAlert.text = "Debe agregar Holding, Empresa y Sucursal";
      this.alertSwalAlert.show();
      return;
    }

    this.tipobusqueda = tipo;
    switch (tipo) {
      case 'Pacientes':
        this._BSModalRef = this._BsModalService.show(ModalpacienteComponent, this.setModal("Busqueda de ".concat(tipo)));
        break;
    }
    this._BSModalRef.content.onClose.subscribe((Retorno: any) => {
      if (Retorno !== undefined) {
        this.limpiar();
  //console.log(">>>",Retorno);  
        this.dataPacienteSolicitud = Retorno;
        
        this.setDatos();
      } else {
      }
    }
    );
  }

  async BuscarSolicitudesPacientes() {
    this.loading = true;
    try {
      this.solicitudeslista = await this.solicitudesPaciente();
    
      this.logicaGrabar();
      this.solicitudeslistapag = this.solicitudeslista.slice(0, 20);
      this.loading = false;
      this.alertSwalGrilla.reverseButtons = true;
      this.alertSwalGrilla.title = 'Seleccione Solicitud';
      this.alertSwalGrilla.show();
    } catch (error) {
      this.loading = false;
      this.alertSwalError.title = "Error";
      this.alertSwalError.text = error.message
      this.alertSwalError.show();
    }
  }

  async solicitudesPaciente() {
    let solicitudes: Array<Solicitudespacienteproducto> = [];
    solicitudes = await this._pacienteService.BuscaSolicitudesPacienteProducto(
      this.hdgcodigo,
      this.esacodigo,
      this.cmecodigo,
      this.servidor,
      this.dataPacienteSolicitud.cliid,
      // 51234,// PRUEBA
      this.dataPacienteSolicitud.estid,
      // 14751,// PRUEBA
      this.dForm.controls['codmei'].value,
      // 'M0202168',// PRUEBA
      parseInt(this.dForm.controls['soliid'].value),
      // null,// PRUEBA
      this.dForm.controls['lote'].value,
      // null,// PRUEBA
      ""
      //this.datePipe.transform(this.dForm.controls['fechavto'].value, 'yyyy-MM-dd')
      // null//"2020-01-27"// PRUEBA
    ).toPromise();
    // console.log("datos encontrados", solicitudes);
    return solicitudes
  }

  async setGrilla() {
    let arrsoltemporal: Array<any> = [];
    let solicitudes: Array<any> = [];
    try {
      solicitudes =  await this.solicitudesPaciente();
      for (let arr of solicitudes) {
        this.solicitudesgrilla.forEach(dat => {
          if (dat.idmovimientodet == arr.idmovimientodet ) {
            arrsoltemporal.push(arr);
          }
        })
      }
      this.solicitudesgrilla = [];
      this.solicitudseleccion = [];
      this.solicitudesgrilla = arrsoltemporal;
      this.solicitudseleccion = this.solicitudesgrilla; 

      this.logicaGrabar();
    } catch (err) {
      alert(err.message);
    }
    // console.log(this.solicitudesgrilla);
  }

  /* Función búsqueda con paginación */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.solicitudeslistapag = this.solicitudeslista.slice(startItem, endItem);
  }

  pageChangedDevolucion(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.solicitudesgrillaPaginacion = this.solicitudesgrilla.slice(startItem, endItem);
  }




  
  cantdevuelta(event: any, devolucion: Solicitudespacienteproducto) {
    
    this.arrParamDetDevolPaciente=[];
    this.logicaGrabar();
   
    let index = this.inArray(0, devolucion);

    if (this.arrParamDetDevolPaciente.length == 0) {

      this.arrParamDetDevolPaciente.unshift(devolucion);
      
    } else {
      if (index >= 0) {

        this.arrParamDetDevolPaciente.slice(index, 1);
      } else if (index < 0) {

        this.arrParamDetDevolPaciente.unshift(devolucion);
      }
    }
  }

  inArray(tipo: number, seleccion: any) {
    /* devuelve index si objeto existe en array
     0= objeto a devolver
     1= objeto verificar/eliminar en seleccion */
    let arreglo: Array<any>;
    switch (tipo) {
      //isDevuelta()
      case 0:
        arreglo = this.arrParamDetDevolPaciente;
        break;
      case 1:
        //isElimina() & isSolicitud()
        arreglo = this.solicitudseleccion;
        break;
    }
    let indice = 0;
    for (const objeto of arreglo) {
      if (objeto.idmovimientodet == seleccion.idmovimientodet ) {
        return indice;
      }
      indice++;
    }
    return -1;
  }

  onDevolver() {
  

    let tempora_array:  ParamDetDevolPaciente;
    this.arrParamDetDevolPaciente = [];
// Esto es un parche poraue el arreglo llega vacio y no puede ser ... se recomienda trabajar con soo dos arreglos para una grilla
  if  (this.arrParamDetDevolPaciente.length == 0) {

        this.solicitudesgrilla.forEach(element => {
          tempora_array = new(ParamDetDevolPaciente);
          tempora_array.soliid = element.soliid;
          tempora_array.sodeid = element.sodeid;
          tempora_array.lote   = element.lote;
          tempora_array.idmovimientodet = element.idmovimientodet;
          tempora_array.fechavto = element.fechavto;
          tempora_array.cantidadadevolver = element.cantidadadevolver;
          tempora_array.cantdispensada = element.cantdispensada;
          tempora_array.cantdevuelta = element.cantdevuelta;
          this.arrParamDetDevolPaciente.push(tempora_array);
        });

  }

    this.recepciondevolucionpaciente.hdgcodigo = this.hdgcodigo;
    this.recepciondevolucionpaciente.esacodigo = this.esacodigo;
    this.recepciondevolucionpaciente.cmecodigo = this.cmecodigo;
    this.recepciondevolucionpaciente.servidor = this.servidor;
    if (this.usuario == null || this.usuario == undefined) {
      this.usuario = "FARMACIA";
    }
    this.recepciondevolucionpaciente.usuariodespacha = this.usuario;
    this.recepciondevolucionpaciente.ctaid = this.dataPacienteSolicitud.ctaid;

//console.log("this.arrParamDetDevolPaciente", this.arrParamDetDevolPaciente);

    this.recepciondevolucionpaciente.paramdetdevolpaciente = this.arrParamDetDevolPaciente;
    this.modalconfirmar("Devolucion Solicitud");
    
  }

  modalconfirmar(mensaje: string) {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿Desea realizar '.concat(mensaje).concat('?'),
      text: "Confirmar la acción",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        try {
          this.loading = true;
         
          this._pacienteService.Recepciondevolucionpaciente(this.recepciondevolucionpaciente).subscribe(
            resp => {
              // this.solicituddevuelta = true;
              this.alertSwal.title = mensaje.concat(" exitosa");
              this.alertSwal.show();
              this.alertSwal.confirm.emit(this.setGrilla());
              this.loading = false;
            });
        } catch (err) {
          this.loading = false;
          this.alertSwalError.title = "Error";
          this.alertSwalError.text = err.message;
          this.alertSwalError.show();
        }
      }
    });
  }

  onBorrar(solicitud: ParamDetDevolPaciente) {
    console.log("Elimina linea grilla",solicitud)
    this.solicitudesgrilla.splice(this.inArray(0, solicitud), 1);
    this.solicitudesgrillaPaginacion = this.solicitudesgrilla.slice(0,20);
    this.logicaGrabar();
  }

  onCheck(event: any, solicitud: Solicitudespacienteproducto) {
    if (event.target.checked) {

      if (this.inArray(1, solicitud) < 0) {
        // console.log("---------------No Existe Agregar---------------");
        this.solicitudseleccion.unshift(solicitud);
        

      } else {
        return;
      }
    } else {
      this.solicitudseleccion.splice(this.inArray(1, solicitud), 1);
    }
  }

  setCheckRow(seleccion: any) {
      for (const objeto of this.solicitudseleccion) {
        if (objeto.idmovimientodet == seleccion.idmovimientodet ) {
        // if (seleccion.soliid === objeto.soliid && objeto.idmovimientodet === objeto.idmovimientodet && 
        //   seleccion.lote === objeto.lote) {
          return true;
        } else {
          return false;
        }
      }
  }

  onConfirm() {
    
    this.solicitudesgrilla = this.solicitudseleccion;
    this.solicitudesgrilla.forEach(element =>{
      element.cantidadadevolver = element.cantdispensada- element.cantdevuelta;
    });
    this.solicitudesgrillaPaginacion = this.solicitudesgrilla.slice(0,20);
    
    this.dForm.reset();
    this.logicaGrabar();
  }

  validacantidadgrilla(despacho: Solicitudespacienteproducto){
    var idg =0;
    // console.log("Valida cantidad",despacho)
    if(despacho.sodeid>0){
      if(this.IdgrillaDevolucion(despacho)>=0){
        idg = this.IdgrillaDevolucion(despacho)
        
        if(this.solicitudesgrilla[idg].cantidadadevolver > this.solicitudesgrilla[idg].cantdispensada- this.solicitudesgrilla[idg].cantdevuelta ){
          
          this.alertSwalAlert.text = "La cantidad a recepcionar debe ser menor o igual a la diferencia entre Cantidad Dispensada y Devuelta";
          this.alertSwalAlert.show();
          // this.listaDetalleDespacho[idg].cantidadarecepcionar = this.listaDetalleDespacho[idg].cantdespachada- this.listaDetalleDespacho[idg].cantrecepcionada;
          this.solicitudesgrilla[idg].cantidadadevolver = this.solicitudesgrilla[idg].cantdispensada- this.solicitudesgrilla[idg].cantdevuelta;

        }else{
          if(this.solicitudesgrilla[idg].cantidadadevolver <=0){
            this.alertSwalAlert.text = "La cantidad a despachar debe ser mayor a 0";
            this.alertSwalAlert.show();
            this.solicitudesgrilla[idg].cantidadadevolver = this.solicitudesgrilla[idg].cantdispensada- this.solicitudesgrilla[idg].cantdevuelta;

          }else{
            if(despacho.cantidadadevolver < despacho.cantdispensada- despacho.cantdevuelta || despacho.cantidadadevolver >0){
              
            }
          }        

        }
      }
    }
  }

  IdgrillaDevolucion(registro: Solicitudespacienteproducto) {
    
    let indice = 0;
    for (const articulo of this.solicitudesgrilla) {
      if (registro.codmei === articulo.codmei) {
        
        return indice;
      }
      indice++;
    }
    return -1;
  }

  onCancel() {
    this.solicitudseleccion = [];
    this.dForm.reset();
    this.logicaGrabar();
  }

  logicaGrabar() {
    /* verifica campos faltantes y deshabilita Grabar btn */
   
    if (this.solicitudesgrilla.length == 0 ||
      this.solicitudesgrilla === []) {
      this.solicitudexist = false;
    } else {
      /* verifica si campo CANT A DEVOLVER esta vacio */
      this.logicaVacios();
      if (this.vacios == true) {
        this.solicitudexist = false;
      }
      else {
        this.solicitudexist = true;
      }
    }
  }

  logicaVacios() {
    this.solicitudesgrilla.forEach(data => {
      if (data.cantidadadevolver == 0 || data.cantidadadevolver == null) {
        this.vacios = true;
        return;
      } else {
        this.vacios = false;
      }
    });
  }

  setDatos() {
    this.pForm.controls['nompaciente'].setValue(this.dataPacienteSolicitud.apepaternopac.concat(" ")
      .concat(this.dataPacienteSolicitud.apematernopac).concat(" ")
      .concat(this.dataPacienteSolicitud.nombrespac));
    this.pForm.controls['rut'].setValue(this.dataPacienteSolicitud.numdocpac);
    this.logicaBuscarSolicitud();
  }

  setDate() {
    defineLocale(this.locale, esLocale);
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  logicaBuscarSolicitud() {
    if (this.pForm.get('nompaciente').value !== null || this.pForm.get('rut').value !== null) {
      this.dForm.get('codmei').enable();
      this.dForm.get('soliid').enable();
      this.dForm.get('cantidad').enable();
      this.dForm.get('lote').enable();
      this.dForm.get('fechavto').enable();
      this.dForm.get('descripcion').enable();
      return true;
    } else {
      return false;
    }
  }

  setModal(titulo: string) {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: titulo,
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
      }
    };
    return dtModal;
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  uimensaje(status: string, texto: string, time: number = 0) {
    this.alerts = [];
    if (time !== 0) {
      this.alerts.push({
        type: status,
        msg: texto,
        timeout: time
      });
    } else {
      this.alerts.push({
        type: status,
        msg: texto
      });
    }
  }

  onImprimir(){
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
        this._imprimesolicitudService.RPTImprimeRecepcionDevolucionPaciente(this.servidor, 
          this.hdgcodigo, this.esacodigo,this.cmecodigo, "pdf", this.dForm.value.soliid).subscribe(
            response => {
    
              window.open(response[0].url, "", "", true);
              
            },
            error => {
              console.log(error);
              this.alertSwalError.title = "Error al Imprimir Listado";
              this.alertSwalError.show();
              this._BSModalRef.content.onClose.subscribe((RetornoExito: any) => {
              })
            }
          );
        // this.ImprimirSolicitud();
      }
    })
  }

  ActivarBotonDevolver(){
    // Identificado el pacinete y con datos en la grilla
    if ( this.pForm.get('nompaciente').value != null 
    && this.solicitudesgrilla.length >0
  ) {
    return true

  } else {
    return false

  }

  }




  ActivarEliminar(){

  // Identificado el pacinete y con datos en la grilla
  if ( this.pForm.get('nompaciente').value != null 
    && this.solicitudesgrilla.length >0
    ) {
    return true

    } else {
    return false

  }


  }

  SeleccionaDescripcion(event:any,descripcion: string){
    console.log("Ingresa descripcion productp",descripcion,event)
    this.descprod = descripcion;
    if(this.descprod != null){
      this._BSModalRef = this._BsModalService.show(BusquedaproductosComponent, this.setModalBusquedaProductos());
      this._BSModalRef.content.onClose.subscribe((response: any) => {
        if (response == undefined) { }
        else {
          console.log("respon del ´rpd buscado",response)
          // this.productoselec = response;
          this.dForm.controls['codmei'].setValue(response.codigo);
          this.dForm.controls['descripcion'].setValue(response.descripcion);
          
          // this.StockProducto(this.productoselec.mein);
          this.loading = false;
         
        }
      },
      error => {
        this.loading = false;
        this.alertSwalError.title = "Error: ";
        this.alertSwalError.text = "No se encontró producto";
        this.alertSwalError.show();
      }
      )
    }
    
  }

  setModalBusquedaProductos() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Productos', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
        tipo_busqueda: 'Todo-Medico',
        id_Bodega: 0,
        descprod: this.descprod,//
        codprod: null
      }
    };
    return dtModal;
  }

}



