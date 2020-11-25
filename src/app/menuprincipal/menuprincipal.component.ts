import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../servicios/login.service';
import { environment } from 'src/environments/environment';
import { Privilegios } from '../models/entity/Privilegios';
import { Privilegio1 } from '../models/entity/Privilegio1';
import { Permisosusuario } from '../permisos/permisosusuario';// obtiene permisos previamente guardados
//import { Roles } from '../models/entity/Roles';

declare var $: any;

@Component({
  selector: 'app-menuprincipal',
  templateUrl: './menuprincipal.component.html',
  styleUrls: ['./menuprincipal.component.css']
})
export class MenuprincipalComponent implements OnInit {
  public modelopermisos: Permisosusuario = new Permisosusuario();
  public FormUsuario         : FormGroup;
  public permitebuscar: boolean = true;

  public priv3: Privilegio1[] = [];
  public priv: Privilegio1[] = [];
  public priv4: Array<Privilegio1> = [];
  public priv5: Privilegio1[] = [];
  public priv2: Array<Privilegios> = [];
  public menus2: boolean = false;
  public parametro: boolean = false;
  public informes: boolean = false;
  public infconsumoporbodegas: boolean = false;
  public infalfabeticoproductos: boolean = false;
  public menus: string;
  public privilegios1: Privilegios = new Privilegios();
  public variables: Array<string> = [];
  public privilegios: Privilegios[];
  public privilegiototal: Privilegio1[] = [];

  constructor(
    private router: Router,
    private formBuilder      : FormBuilder,
    private _loginuserService: LoginService,
  ) {
    this.FormUsuario = this.formBuilder.group({
       
      usuario : [null]
    });

    console.log(this.modelopermisos);

    //this.priv =JSON.parse(localStorage.getItem('Privilegios'));
    //console.log(JSON.parse(localStorage.getItem('Privilegios')));
    const priv = environment.privilegios.privilegio //JSON.parse(localStorage.getItem('Privilegios'));
    console.log("Antes de la llamada a menu", priv)
    //if(priv.pathrecurso!= null){
    //priv.forEach(element => {
    /*if(priv[0].pathrecurso=='parametro'&&priv[0].pathrecurso=='informes'&&
    priv[0].pathrecurso=='infconsumoporbodegas'&&priv[0].pathrecurso=='infalfabeticoproductos'&&
    priv[0].pathrecurso=='consultaarticulos'&&priv[0].pathrecurso=='consultadekardex'&&
    priv[0].pathrecurso=='productos'){
      this.menus="usuario1"
    }*/
    //if(priv[0].pathrecurso=='productos'){
    this.menus = 'admin';
    // }

    //});
    // console.log("menu",this.menus)
    //}
    //this.menus="1"
    console.log("el parametro es ", this.menus);


    /*priv.forEach(element => {
      if (element.pathrecurso == "parametro") {
        var temporal = new Privilegios;
        temporal = element.pathrecurso;
        this.menus=element.pathrecurso;
      }
      this.priv3.push(temporal);
      if (element.pathrecurso == "informes") {
        var temporal = new Privilegios;
        temporal = element.pathrecurso;
        this.menus=element.pathrecurso;
      }
      this.priv3.push(temporal)
    });
    console.log("const",this.menus,"priv3",this.priv3);
    //this.priv3 = priv[0].pathrecurso;
    //var priv2 = environment.privilegios.privilegio;*/
    //this.Recorremenu();
    //this.priv = environment.privilegios.privilegio;
    //console.log("priv localstorage",this.priv,"priv3:",this.priv3);

    //console.log("Valor environment",this.priv);
    //this.priv = this.priv;*/

  }

  ngOnInit() {
    var servidor = environment.URLServiciosRest.ambiente;
    var usuario = environment.privilegios.usuario;
    this.usuarios();
/*
    this.variables = JSON.parse(localStorage.getItem('Privilegios'));
    console.log("usuario", environment.privilegios.usuario, "servidor",
      environment.URLServiciosRest.ambiente, "variable localstore", this.variables);
*/
  }

  ngAfterViewInit() {

  }


  CierreSesion() {

    console.log("Cierra la sesión");
    console.log("Datos de Local Storage", sessionStorage.getItem('Privilegios'));
    console.log("priv3", this.priv3, "priv2:", this.priv, "environment", environment.privilegios.privilegio,
      "usuario:", environment.privilegios.usuario);
    //localStorage.clear();
    //localStorage.removeItem('Login');
    //localStorage.removeItem('Privilegios');
    this.router.navigate(['login']);
  }

  usuarios() {

    this.FormUsuario.get('usuario').setValue(environment.privilegios.usuario);
    console.log("El usuario es")
    if (this.permitebuscar == true) {
      console.log("El usuario puede usar el menú");

    }
  }

};