import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { environment } from '../../../environments/environment';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Articulos } from 'src/app/models/entity/mantencionarticulos';
import { DetalleSolicitudConsumo } from 'src/app/models/entity/detalle-solicitud-consumo';
import { UnidadesOrganizacionalesService } from 'src/app/servicios/unidades-organizacionales.service';
import { UnidadesOrganizacionales } from 'src/app/models/entity/unidades-organizacionales';
import { EstructuraListaUsuarios } from 'src/app/models/entity/estructura-lista-usuarios';
import { BusquedaUsuariosComponent } from '../busqueda-usuarios/busqueda-usuarios.component';
import { BusquedaRolesComponent } from '../busqueda-roles/busqueda-roles.component';
import { Roles } from 'src/app/models/entity/Roles';
import { RolesUsuarios } from 'src/app/models/entity/roles-usuario';
import { EstructuraRolesUsuarios } from 'src/app/models/entity/estructura-roles-usuarios';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { CentroCostoUsuario } from 'src/app/models/entity/centro-costo-usuario';
import { BusquedaCentrosCostosComponent } from '../busqueda-centros-costos/busqueda-centros-costos.component';
import { EstructuraCentroCostoUsuario } from 'src/app/models/entity/estructura-centro-costo-usuario';

@Component({
  selector: 'app-administracion-roles',
  templateUrl: './administracion-roles.component.html',
  styleUrls: ['./administracion-roles.component.css']
})
export class AdministracionRolesComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  public FormUsuarioRoles: FormGroup;
  public ccostosolicitante: Array<UnidadesOrganizacionales> = [];

  public _RolUsuario: RolesUsuarios;   /* Solictud de creación y modificaicíón */
  public grabadetallesolicitud: Array<DetalleSolicitudConsumo> = [];
  public arregloRolesUsuario: Array<RolesUsuarios> = [];
  public arregloRolesUsuarioPaginacion: Array<RolesUsuarios> = [];
  public arregloCentroCosto: Array<CentroCostoUsuario> = [];
  public arregloCentroCostoPaginacion: Array<CentroCostoUsuario> = [];
  public locale = 'es';
  public bsConfig: Partial<BsDatepickerConfig>;
  public colorTheme = 'theme-blue';
  public usuario = environment.privilegios.usuario;
  public servidor = environment.URLServiciosRest.ambiente;
  public id_usuario: number = 0;

  public activaagregar: boolean = false;
  public hdgcodigo: number;
  public esacodigo: number;
  public cmecodigo: number;

  public productoselec: Articulos;
  private _BSModalRef: BsModalRef;
  public BtnSolConsumoGenerSolictud_activado: boolean;
  public _CentroCostoUsuario: CentroCostoUsuario;


  onClose: any;
  bsModalRef: any;
  editField: any;

  constructor(
    private formBuilder: FormBuilder,
    public _BsModalService: BsModalService,
    public localeService: BsLocaleService,
    public datePipe: DatePipe,
    private _ServiciosUsuarios: UsuariosService,
    public _unidadesorganizacionaes: UnidadesOrganizacionalesService,
  ) {
    this.FormUsuarioRoles = this.formBuilder.group({
      id_usuario: [{ value: null, disabled: true }, Validators.required],
      rut: [{ value: null, disabled: true }, Validators.required],
      login: [{ value: null, disabled: true }, Validators.required],
      nombre: [{ value: null, disabled: true }, Validators.required],
      numsolicitud: [{ value: null, disabled: true }, Validators.required],
      esticod: [{ value: 10, disabled: false }, Validators.required],
      hdgcodigo: [{ value: null, disabled: false }, Validators.required],
      esacodigo: [{ value: null, disabled: false }, Validators.required],
      cmecodigo: [{ value: null, disabled: false }, Validators.required],
      prioridad: [{ value: null, disabled: false }, Validators.required],
      fecha: [{ value: new Date(), disabled: true }, Validators.required],
      centrocosto: [{ value: null, disabled: false }, Validators.required],
      referenciaerp: [{ value: null, disabled: true }, Validators.required],
      estadoerp: [{ value: null, disabled: true }, Validators.required],
      glosa: [{ value: null, disabled: false }, Validators.required],
    });
  }

  ngOnInit() {


    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());

  }


  async addCentroCosto() {

    this._CentroCostoUsuario = new (CentroCostoUsuario);

    this._BSModalRef = this._BsModalService.show(BusquedaCentrosCostosComponent, this.setModalCentroCosto());
    this._BSModalRef.content.onClose.subscribe((response: UnidadesOrganizacionales) => {
      if (response == undefined) { }
      else {

            //Validaomos que el Rol no esté repetido
            const resultado = this.arregloCentroCosto.find( registro => registro.idcentrocosto === response.unorcorrelativo );
            if  ( resultado != undefined )
            {
              this.alertSwalError.title = "Rol no se puede repetir";
              this.alertSwalError.show();
              return
            }
    
        this._CentroCostoUsuario.servidor = this.servidor;
        this._CentroCostoUsuario.idcentrocosto = response.unorcorrelativo;
        this._CentroCostoUsuario.idusuario = this.id_usuario;
        this._CentroCostoUsuario.hdgcodigo = this.hdgcodigo;
        this._CentroCostoUsuario.esacodigo = this.esacodigo;
        this._CentroCostoUsuario.cmecodigo = this.cmecodigo;
        this._CentroCostoUsuario.glounidadesorganizacionales = response.descripcion;
        this._CentroCostoUsuario.accion = 'I';


        this.arregloCentroCosto.unshift(this._CentroCostoUsuario);
        this.arregloCentroCostoPaginacion = this.arregloCentroCosto.slice(0, 8);

      }
    });


  }


  setModalCentroCosto() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda Centro Costo', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
      }
    };
    return dtModal;
  }




  async addRol() {

   let existe = 0

    this._RolUsuario = new (RolesUsuarios);

    this._BSModalRef = this._BsModalService.show(BusquedaRolesComponent, this.setModalRoles());
    this._BSModalRef.content.onClose.subscribe((response: Roles) => {
      if (response == undefined) { }
      else {

         //Validaomos que el Rol no esté repetido
     const resultado = this.arregloRolesUsuario.find( registro => registro.rolid === response.rolid );
      if  ( resultado != undefined )
      {
        this.alertSwalError.title = "Rol no se puede repetir";
        this.alertSwalError.show();
        return
      }
        this._RolUsuario.servidor = this.servidor;
        this._RolUsuario.rolid = response.rolid;
        this._RolUsuario.hdgcodigo = response.hdgcodigo;
        this._RolUsuario.esacodigo = response.esacodigo;
        this._RolUsuario.cmecodigo = response.cmecodigo;
        this._RolUsuario.codigorol = response.codigorol;
        this._RolUsuario.nombrerol = response.nombrerol;
        this._RolUsuario.descripcionrol = response.descripcionrol;
        this._RolUsuario.idusuario = this.id_usuario;
        this._RolUsuario.accion = 'I';


        this.arregloRolesUsuario.unshift(this._RolUsuario);
        this.arregloRolesUsuarioPaginacion = this.arregloRolesUsuario.slice(0, 8);
      }
    });


  }


  setModalRoles() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda Roles', // Parametro para de la otra pantalla
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
      }
    };
    return dtModal;
  }



  ConfirmaEliminarCentroCostoGrilla(registro: CentroCostoUsuario, id: number) {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirme eliminación Centro Costo ?',
      text: "Confirmar Eliminación",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.EliminCentroCostolDeLaGrilla(registro, id);
      }
    })
  }

  EliminCentroCostolDeLaGrilla(registro: CentroCostoUsuario, id: number) {

    const _ECentroCostoUsuario = new (EstructuraCentroCostoUsuario);

    if (registro.accion == "I" && id >= 0) {
      // Eliminar registro nuevo la grilla
      this.arregloCentroCosto.splice(id, 1);
      this.arregloCentroCostoPaginacion = this.arregloCentroCosto.slice(0, 8);
      this.alertSwal.title = "Centro Costo Eliminado Para Este Usuario";
      this.alertSwal.show();
    } else {

      _ECentroCostoUsuario.servidor = this.servidor;
      _ECentroCostoUsuario.hdgcodigo = this.hdgcodigo;
      _ECentroCostoUsuario.cmecodigo = this.cmecodigo;
      _ECentroCostoUsuario.idusuario = this.id_usuario;
      _ECentroCostoUsuario.detalle = [];
      registro.accion = "E";
      registro.idusuario = this.id_usuario;
      _ECentroCostoUsuario.detalle.push(registro);

      this._ServiciosUsuarios.guardarCentroCostoUsuarios(_ECentroCostoUsuario).subscribe(response => {
        this.alertSwal.title = "Centro de Costo Eliminado";
        this.alertSwal.show();
        this._ServiciosUsuarios.buscarCentroCostoUsuarios(_ECentroCostoUsuario).subscribe(
          response => {
            this.arregloCentroCosto = [];
            this.arregloCentroCostoPaginacion = [];
            this.arregloCentroCosto = response;
            this.arregloCentroCostoPaginacion = this.arregloCentroCosto.slice(0, 8);
          },
          error => {
            console.log("Error :", error)
          }
        )
      },
        error => {
          console.log("Error :", error)
        }
      )
    }

  }



  ConfirmaEliminarRolGrilla(registro: RolesUsuarios, id: number) {
    console.log("registro", registro.accion);

    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Confirme eliminación rol del usuario ?',
      text: "Confirmar Eliminación",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.EliminRolDeLaGrilla(registro, id);
      }
    })
  }


  EliminRolDeLaGrilla(registro: RolesUsuarios, id: number) {

    const _ListaRolUsuario = new (EstructuraRolesUsuarios);

    if (registro.accion == "I" && id >= 0) {
      // Eliminar registro nuevo la grilla
      this.arregloRolesUsuario.splice(id, 1);
      this.arregloRolesUsuarioPaginacion = this.arregloRolesUsuario.slice(0, 8);
      this.alertSwal.title = "Rol Eliminado";
      this.alertSwal.show();
    } else {


      _ListaRolUsuario.servidor = this.servidor;
      _ListaRolUsuario.hdgcodigo = this.hdgcodigo;
      _ListaRolUsuario.cmecodigo = this.cmecodigo;
      _ListaRolUsuario.idusuario = this.id_usuario;
      registro.accion = "E";
      registro.idusuario = this.id_usuario;
      _ListaRolUsuario.detalle = [];
      _ListaRolUsuario.detalle.push(registro);

      this._ServiciosUsuarios.guardarRolesUsuarios(_ListaRolUsuario).subscribe(
        response => {
          this.alertSwal.title = "Rol Eliminado";
          this.alertSwal.show();
          this._ServiciosUsuarios.buscarRolesUsuarios(_ListaRolUsuario).subscribe(
            response => {
              this.arregloRolesUsuario = [];
              this.arregloRolesUsuarioPaginacion = [];
              this.arregloRolesUsuario = response;
              this.arregloRolesUsuarioPaginacion = this.arregloRolesUsuario.slice(0, 8);
            },
            error => {
              console.log("Error :", error)
            }
          )
        },
        error => {
          console.log("Error :", error)
        }

      )


    }



  }



  setModalMensajeExitoEliminar(numerotransaccion: number, titulo: string, mensaje: string) {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-m',
      initialState: {
        titulo: 'titulo', // Parametro para de la otra pantalla
        mensaje: 'mensaje',
        informacion: 'La solicitud eliminada es:',
        mostrarnumero: numerotransaccion,
        estado: 'CANCELADO',
      }
    };
    return dtModal;
  }






  ConfirmaModificar() {
    const Swal = require('sweetalert2');
    Swal.fire({
      title: '¿ Modifica usuario ?',
      text: "Confirmar Modificación Usuario",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.Modificar();
      }
    })
  }




  Modificar() {

    const _ListaRolUsuario = new (EstructuraRolesUsuarios);
    const _ECentroCostoUsuario = new (EstructuraCentroCostoUsuario);
    var modificado: boolean = false;

    _ListaRolUsuario.servidor = this.servidor;
    _ListaRolUsuario.hdgcodigo = this.hdgcodigo;
    _ListaRolUsuario.cmecodigo = this.cmecodigo;
    _ListaRolUsuario.idusuario = this.id_usuario;
    _ListaRolUsuario.detalle = [];

    this.arregloRolesUsuario.forEach(element => {
      if (element.accion == 'I') {

        _ListaRolUsuario.detalle.push(element);
      }
    });

    if (_ListaRolUsuario.detalle.length > 0) {

      this._ServiciosUsuarios.guardarRolesUsuarios(_ListaRolUsuario).subscribe(
        response => {
          modificado = true;
          this.despelgar_informacion_usuario(this.id_usuario);

        },
        error => {
          console.log("Error :", error)
          modificado = false;

        }

      )


    }

    _ECentroCostoUsuario.servidor = this.servidor;
    _ECentroCostoUsuario.hdgcodigo = this.hdgcodigo;
    _ECentroCostoUsuario.cmecodigo = this.cmecodigo;
    _ECentroCostoUsuario.idusuario = this.id_usuario;
    _ECentroCostoUsuario.detalle = [];
    this.arregloCentroCosto.forEach(element => {
      if (element.accion == "I") {
        _ECentroCostoUsuario.detalle.push(element);
      }
    });

    if (_ECentroCostoUsuario.detalle.length > 0) {
      this._ServiciosUsuarios.guardarCentroCostoUsuarios(_ECentroCostoUsuario).subscribe(response => {
        modificado = true;
        this.despelgar_informacion_usuario(this.id_usuario);
      },
        error => {
          console.log("Error :", error)
        }
      )
    }




    if (modificado = true) {

      this.alertSwal.title = "Usuario Modificado";
      this.alertSwal.show();
    }


  }


  pageChangedCCosto(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.arregloCentroCostoPaginacion = this.arregloCentroCosto.slice(startItem, endItem);
  }

  /* Función búsqueda con paginación */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.arregloRolesUsuarioPaginacion = this.arregloRolesUsuario.slice(startItem, endItem);
  }

  BuscarUsuarios() {

    const _ListaRolUsuario = new (EstructuraRolesUsuarios);

    const _ECentroCostoUsuario = new (EstructuraCentroCostoUsuario);

    this._BSModalRef = this._BsModalService.show(BusquedaUsuariosComponent, this.setModalBusquedaUsuarios());

    this._BSModalRef.content.onClose.subscribe((response: EstructuraListaUsuarios) => {
      if (response == undefined) { }
      else {
        this.FormUsuarioRoles.get('id_usuario').setValue(response.userid);
        this.FormUsuarioRoles.get('rut').setValue(response.userrut);
        this.FormUsuarioRoles.get('login').setValue(response.usercode);
        this.FormUsuarioRoles.get('nombre').setValue(response.username);
        this.activaagregar = true;
        this.id_usuario = response.userid;

        this.despelgar_informacion_usuario(response.userid)



      }
    });


  }


  despelgar_informacion_usuario(id_usaurio: number) {
    const _ListaRolUsuario = new (EstructuraRolesUsuarios);

    const _ECentroCostoUsuario = new (EstructuraCentroCostoUsuario);

    _ListaRolUsuario.servidor = this.servidor;
    _ListaRolUsuario.hdgcodigo = this.hdgcodigo;
    _ListaRolUsuario.cmecodigo = this.cmecodigo;
    _ListaRolUsuario.esacodigo = this.esacodigo;
    _ListaRolUsuario.idusuario = id_usaurio;


    this._ServiciosUsuarios.buscarRolesUsuarios(_ListaRolUsuario).subscribe(
      response => {

        this.arregloRolesUsuario = [];
        this.arregloRolesUsuarioPaginacion = [];
        this.arregloRolesUsuario = response;
        this.arregloRolesUsuarioPaginacion = this.arregloRolesUsuario.slice(0, 8);
      },
      error => {
        console.log("Error :", error)
      }
    )

    _ECentroCostoUsuario.servidor = this.servidor;
    _ECentroCostoUsuario.hdgcodigo = this.hdgcodigo;
    _ECentroCostoUsuario.cmecodigo = this.cmecodigo;
    _ECentroCostoUsuario.idusuario = id_usaurio;
    _ECentroCostoUsuario.detalle = [];

    this._ServiciosUsuarios.buscarCentroCostoUsuarios(_ECentroCostoUsuario).subscribe(
      response => {
        this.arregloCentroCosto = [];
        this.arregloCentroCostoPaginacion = [];
        this.arregloCentroCosto = response;
        this.arregloCentroCostoPaginacion = this.arregloCentroCosto.slice(0, 8);
      },
      error => {
        console.log("Error :", error)
      }
    )
  }



  setModalBusquedaUsuarios() {
    let dtModal: any = {};
    dtModal = {
      keyboard: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-xl',
      initialState: {
        titulo: 'Búsqueda de Usuarios',
        hdgcodigo: this.hdgcodigo,
        esacodigo: this.esacodigo,
        cmecodigo: this.cmecodigo,
      }
    };
    return dtModal;
  }

  limpiar() {
    this.FormUsuarioRoles.reset();
    this.arregloRolesUsuario = [];
    this.arregloRolesUsuarioPaginacion = [];
    this.arregloCentroCosto = [];
    this.arregloCentroCostoPaginacion = [];
    this.id_usuario = 0;

  }

  ActivaBotonModificar()
  {

      
      if (this.FormUsuarioRoles.get('id_usuario').value != null) {
      return true
    
    } else {
      return false
    }
}

}
