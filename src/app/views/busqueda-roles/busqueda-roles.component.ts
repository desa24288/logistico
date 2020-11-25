import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { BsModalRef, PageChangedEvent } from 'ngx-bootstrap';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

import { Roles } from 'src/app/models/entity/Roles';

@Component({
  selector: 'app-busqueda-roles',
  templateUrl: './busqueda-roles.component.html',
  styleUrls: ['./busqueda-roles.component.css']
})
export class BusquedaRolesComponent implements OnInit { 
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;//Componente para visualizar alertas
  @ViewChild('alertSwalAlert', { static: false }) alertSwalAlert: SwalComponent;
  @ViewChild('alertSwalError', { static: false }) alertSwalError: SwalComponent;

  @Input() hdgcodigo: number;
  @Input() esacodigo: number;
  @Input() cmecodigo: number;
  @Input() titulo: string;

  public onClose: Subject<Roles>;
  public lForm: FormGroup;
  public arregloRoles: Array<Roles> = [];
  public arregloRolesPaginacion: Array<Roles> = [];
  public loading = false;
  public servidor = environment.URLServiciosRest.ambiente;
  public usuario = environment.privilegios.usuario;
  public _Roles : Roles;

  constructor(
    public bsModalRef: BsModalRef,
    public formBuilder: FormBuilder,
    private _ServiciosUsuarios: UsuariosService,
  ) { 

    this.lForm = this.formBuilder.group({
      codigorol: [{ value: null, disabled: false }, Validators.required],
      nombrerol: [{ value: null, disabled: false }, Validators.required]
    });
  }

  ngOnInit() {
    this.onClose = new Subject();
    
    this.loading = true;
    this._Roles = new(Roles);
 


    this._Roles.servidor = this.servidor;
    this._Roles.hdgcodigo = this.hdgcodigo;
    this._Roles.esacodigo = this.esacodigo;
    this._Roles.cmecodigo = this.cmecodigo;

   

    this._ServiciosUsuarios.buscarRoles(this._Roles).subscribe(
      response => {

          this.arregloRoles = response;
          this.arregloRolesPaginacion = this.arregloRoles.slice(0, 8);
      },
      error => {
        alert("Error al Buscar Roles o no existen roles definidos");
      }

    );

    this.loading = false;

  }

  
  

limpiar() {

  this.arregloRoles = [];
  this.arregloRolesPaginacion =[];
  this.lForm.reset();
  

}


  /* Función búsqueda con paginación */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.arregloRolesPaginacion = this.arregloRoles.slice(startItem, endItem);
  }

  onCerrar(rol_seleccionado:Roles ) {

    this.onClose.next(rol_seleccionado);
    this.bsModalRef.hide();
  };

  onCerrarSalir() {

    this.onClose.next();
    this.bsModalRef.hide();
  };




}