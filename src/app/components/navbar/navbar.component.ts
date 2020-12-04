import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { hesService } from 'src/app/servicios/hes.service';
import { Holding } from 'src/app/models/entity/Holding';
import { Empresas } from 'src/app/models/entity/Empresas';
import { Sucursal } from 'src/app/models/entity/Sucursal';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../servicios/login.service';
import { Privilegios } from '../../models/entity/Privilegios';
import { Privilegio1 } from '../../models/entity/Privilegio1';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public lista_holdings: Holding[];
  public lista_empresas: Empresas[];
  public lista_sucursales: Sucursal[];
  public FormConexion: FormGroup;

  public FormUsuario: FormGroup;
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
  public usuario = environment.privilegios.usuario;
  public hdgcodigo: number;
  public esacodigo: number;
  public cmecodigo: number;
  public menu = true;


  constructor(
    private _hesService: hesService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private _loginuserService: LoginService,

  ) {

    router.events.subscribe((val) => {
      // see also 
      // this.menu = true;
      // document.getElementById('side-menu').style.display = 'block';
      // this.onMenubtn();

    });

    this.FormConexion = this._formBuilder.group({
      f_hdgcodigo: [null],
      f_esacodigo: [null],
      f_cmecodigo: [null],
      f_usuario: [null]
    });

    const priv = environment.privilegios.privilegio;
    this.menus = 'admin';
  }

  async ngOnInit() {
    // try {
    // this.onMenubtn();
    
    // document.getElementById('side-menu').style.visibility = 'visible';
    var servidor = environment.URLServiciosRest.ambiente;
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();



    this.FormConexion.controls.f_usuario.setValue(this.usuario);

    this.lista_holdings = await this._hesService.list(this.usuario, environment.URLServiciosRest.ambiente).toPromise();

    this.FormConexion.controls.f_hdgcodigo.setValue(this.hdgcodigo);

    this.lista_empresas = await this._hesService.BuscaEmpresa(this.hdgcodigo, this.usuario, servidor).toPromise();
    this.FormConexion.controls.f_esacodigo.setValue(this.esacodigo);

    this.lista_sucursales = await this._hesService.BuscaSucursal(this.hdgcodigo, this.esacodigo, this.usuario, servidor).toPromise();

    if (this.lista_sucursales.length == 0) {
      this.cmecodigo = this.lista_sucursales[0].cmecodigo;
      console.log(this.cmecodigo);
    }
    this.FormConexion.controls.f_cmecodigo.setValue(this.cmecodigo);

    sessionStorage.setItem('cmecodigo', this.cmecodigo.toString());

    var servidor = environment.URLServiciosRest.ambiente;
    var usuario = environment.privilegios.usuario;


    this.FormConexion.controls.f_usuario.setValue(this.usuario);


    // } catch (err) {
    //   alert(err.message);
    // }

  }


  BuscaEmpresa(hdgcodigo: number) {
    //  this.hdgcodigo.emit({ hdgcodigo: hdgcodigo });
    sessionStorage.setItem('hdgcodigo', hdgcodigo.toString());

    var servidor = environment.URLServiciosRest.ambiente;
    var usuario = environment.privilegios.usuario;

    this._hesService.BuscaEmpresa(hdgcodigo, usuario, servidor).subscribe(
      response => {
        this.lista_empresas = response
      },
      error => {
        alert(error.message);
      }
    );
  }

  BuscaSucursal(hdgcodigo: number, esacodigo: number) {

    //  this.esacodigo.emit({ esacodigo: esacodigo });
    sessionStorage.setItem('esacodigo', esacodigo.toString());

    var servidor = environment.URLServiciosRest.ambiente;
    var usuario = environment.privilegios.usuario;
    this._hesService.BuscaSucursal(hdgcodigo, esacodigo, usuario, servidor).subscribe(
      response => {
        this.lista_sucursales = response

        if (this.lista_sucursales.length == 1) {

          this.cmecodigo = this.lista_sucursales[0].cmecodigo;
          this.FormConexion.controls.f_cmecodigo.setValue(this.cmecodigo);
          sessionStorage.setItem('cmecodigo', this.cmecodigo.toString())

        }
      },
      error => {
        alert("Error al Buscar Sucursal por código")
      }
    );
  }

  sucursal(cmecodigo: number) {
    //   this.cmecodigo.emit({ cmecodigo: cmecodigo });
    sessionStorage.setItem('cmecodigo', cmecodigo.toString());
  }


  CierreSesion() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  onMenubtn() {
    // if(this.menu === true){
    //   this.menu = false;
    //   document.getElementById('side-menu').style.display = 'none';
      
    // } else if(this.menu === false) {
    //   this.menu = true;
      
    //   document.getElementById('side-menu').style.display = 'block';
      
    // }

  }

}
