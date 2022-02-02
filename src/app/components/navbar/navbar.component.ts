import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { hesService } from 'src/app/servicios/hes.service';
import { Holding } from 'src/app/models/entity/Holding';
import { Empresas } from 'src/app/models/entity/Empresas';
import { Sucursal } from 'src/app/models/entity/Sucursal';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../servicios/login.service';
import { Privilegios } from '../../models/entity/Privilegios';
import { Privilegio1 } from '../../models/entity/Privilegio1';
import { EstructuraRolesUsuarios } from 'src/app/models/entity/estructura-roles-usuarios';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { RolesUsuarios } from 'src/app/models/entity/roles-usuario';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { interval } from 'rxjs';
import { DevuelveDatosUsuario } from 'src/app/models/entity/DevuelveDatosUsuario';
import { PaginationComponent } from 'ngx-bootstrap';
import { SolicitudService } from 'src/app/servicios/Solicitudes.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('alertSwal', { static: false }) alertSwal: SwalComponent;

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
  public servidor: string;
  public hdgcodigo: number;
  public esacodigo: number;
  public cmecodigo: number;
  public menu = true;
  public avisarSolicitud : boolean = false;
  public empresa : string = 'logoSonda.jpg';
  public icono : string = 'alarma4.gif';
  public mensaje : string = "Tiene solicitudes Pendientes \n Recepcionar"

  public fncCombo: boolean = false;
  public valInit : boolean;
  public arregloRolesUsuarioInit: Array<RolesUsuarios> = [];
  public tiempo_refresco = interval(300000);
  public login          : DevuelveDatosUsuario[];

  public Pendiente : boolean = false;

  constructor(
    private _hesService: hesService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _loginuserService: LoginService,
    private _ServiciosUsuarios: UsuariosService,
    private _buscasolicitudService: SolicitudService,

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
    this.servidor = environment.URLServiciosRest.ambiente;
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    this.usuario = sessionStorage.getItem('Usuario').toString();



    this.FormConexion.controls.f_usuario.setValue(this.usuario);

    this.lista_holdings = await this._hesService.list(this.usuario, environment.URLServiciosRest.ambiente).toPromise();

    this.FormConexion.controls.f_hdgcodigo.setValue(this.hdgcodigo);

    this.lista_empresas = await this._hesService.BuscaEmpresa(this.hdgcodigo, this.usuario, this.servidor).toPromise();
    this.FormConexion.controls.f_esacodigo.setValue(this.esacodigo);

    this.lista_sucursales = await this._hesService.BuscaSucursal(this.hdgcodigo, this.esacodigo, this.usuario, this.servidor).toPromise();

    if (this.lista_sucursales.length == 0) {
      this.cmecodigo = this.lista_sucursales[0].cmecodigo;
      console.log(this.cmecodigo);
    }
    this.FormConexion.controls.f_cmecodigo.setValue(this.cmecodigo);

    sessionStorage.setItem('cmecodigo', this.cmecodigo.toString());

    var servidor = environment.URLServiciosRest.ambiente;
    var usuario = environment.privilegios.usuario;


    this.FormConexion.controls.f_usuario.setValue(this.usuario);

    const _ListaRolUsuario = new (EstructuraRolesUsuarios);
    _ListaRolUsuario.servidor = this.servidor;
    _ListaRolUsuario.hdgcodigo = this.hdgcodigo;
    _ListaRolUsuario.cmecodigo = this.cmecodigo;
    _ListaRolUsuario.esacodigo = this.esacodigo;
    _ListaRolUsuario.idusuario = Number(sessionStorage.getItem('id_usuario').toString());

    this._ServiciosUsuarios.buscarRolesUsuarios(_ListaRolUsuario).subscribe(
      response => {
        this.arregloRolesUsuarioInit = [];
        this.arregloRolesUsuarioInit = response;
        this.valInit = true;
        this.arregloRolesUsuarioInit.forEach(element => {
          if (element.rolid === 12000) {
            this.valInit = false;
          }
        });
        if (this.valInit) {
          this.FormConexion.controls.f_esacodigo.disable();
          this.FormConexion.controls.f_cmecodigo.disable();
        }
      },error => {
        console.log("Error :", error);
      })

      switch (this.esacodigo) {
        case 1:
          this.empresa = 'logoSonda.jpg';
          break;
        case 2:
          this.empresa = 'fusat.png';
          break;
        case 3:
          this.empresa = 'intersalud.png'
          break;
        default:
          this.empresa = 'logoSonda.jpg';
          break;
      }
    // } catch (err) {
    //   alert(err.message);
    // }
    this.tiempo_refresco.subscribe((n) => {
      this.consultaSolicitudes();
      this.consultaURL();
    })
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
    const Swal = require('sweetalert2');
    //  this.esacodigo.emit({ esacodigo: esacodigo });
    var esaCodigoAux = Number(sessionStorage.getItem('esacodigo'));
    var cmeCodigoAux = Number(sessionStorage.getItem('cmecodigo'));
    var userid       = Number(sessionStorage.getItem('id_usuario'));

    sessionStorage.setItem('esacodigo', esacodigo.toString());

    var servidor = environment.URLServiciosRest.ambiente;
    var usuario = environment.privilegios.usuario;
    this._hesService.BuscaSucursal(hdgcodigo, esacodigo, usuario, servidor).subscribe(
      response => {
        this.lista_sucursales = response
        if (this.lista_sucursales.length == 1) {
          this.cmecodigo = this.lista_sucursales[0].cmecodigo;
          this.FormConexion.controls.f_cmecodigo.setValue(this.cmecodigo);
          sessionStorage.setItem('cmecodigo', this.cmecodigo.toString());
          this.cambioDatosUsuario(hdgcodigo,esacodigo,this.cmecodigo);
        }
      },
      error => {
        alert("Error al Buscar Sucursal por código")
      }
    );
    Swal.fire({
      title: 'Cambiar',
      text: "¿Seguro que desea cambiar de Empresa sin guardar?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.dismiss != "cancel") {
        this.route.paramMap.subscribe(param => {
          switch (esacodigo) {
            case 1:
              this.empresa = 'logoSonda.jpg';
              break;
            case 2:
              this.empresa = 'fusat.png';
              break;
            case 3:
              this.empresa = 'intersalud.png'
              break;
            default:
              this.empresa = 'logoSonda.jpg';
              break;
          }
          // sessionStorage.setItem('Login',JSON.stringify(this.login));
          // sessionStorage.setItem('hdgcodigo', hdgcodigo.toString());
          // sessionStorage.setItem('esacodigo', esacodigo.toString());
          // sessionStorage.setItem('cmecodigo', this.cmecodigo.toString());

          // environment.privilegios.holding= hdgcodigo;
          // environment.privilegios.empresa= esacodigo;
          // environment.privilegios.sucursal= this.cmecodigo;

          // this.obtieneprivilegio(userid, hdgcodigo,esacodigo, this.cmecodigo,
          //   JSON.stringify(this.login), environment.URLServiciosRest.ambiente);

          // location.reload();
          this.router.navigate(['home']);
      });
      }else{
        sessionStorage.setItem('esacodigo', esaCodigoAux.toString());
        sessionStorage.setItem('cmecodigo', cmeCodigoAux.toString());

        this.FormConexion.controls.f_esacodigo.setValue(esaCodigoAux);
        this._hesService.BuscaSucursal(hdgcodigo, esaCodigoAux, usuario, servidor).subscribe(
          response => {
            this.lista_sucursales = response
            if (this.lista_sucursales.length == 1) {
              this.cmecodigo = this.lista_sucursales[0].cmecodigo;
              this.FormConexion.controls.f_cmecodigo.setValue(cmeCodigoAux);
            }
          },
          error => {
            alert("Error al Buscar Sucursal por código")
          }
        );
      }
    });


  }

  sucursal(cmecodigo: number) {
    const Swal = require('sweetalert2');
    //   this.cmecodigo.emit({ cmecodigo: cmecodigo });
    var esaCodigoAux = Number(sessionStorage.getItem('esacodigo'));
    var cmeCodigoAux = Number(sessionStorage.getItem('cmecodigo'));
    var hdgCodigoAux = Number(sessionStorage.getItem('hdgcodigo'));
    var servidor = environment.URLServiciosRest.ambiente;
    var usuario = environment.privilegios.usuario;

    Swal.fire({
      title: 'Cambiar',
      text: "¿Seguro que desea cambiar de Sucursal sin guardar?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.dismiss != "cancel") {
        sessionStorage.setItem('cmecodigo', cmecodigo.toString());
        this.route.paramMap.subscribe(param => {
          this.router.navigate(['home']);
        })
      }else{
        sessionStorage.setItem('cmecodigo', cmeCodigoAux.toString());

        this.FormConexion.controls.f_esacodigo.setValue(esaCodigoAux);
        this._hesService.BuscaSucursal(hdgCodigoAux, esaCodigoAux, usuario, servidor).subscribe(
          response => {
            this.lista_sucursales = response
            if (this.lista_sucursales.length == 1) {
              this.cmecodigo = this.lista_sucursales[0].cmecodigo;
              this.FormConexion.controls.f_cmecodigo.setValue(cmeCodigoAux);
            }
          },
          error => {
            alert("Error al Buscar Sucursal por código")
          }
        );
      }
    });
  }


  CierreSesion() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  onMenubtn() {

  }

  async consultaSolicitudes(){
    this._buscasolicitudService.BuscarSolicitudesPendiente(this.servidor,this.hdgcodigo,this.esacodigo,this.cmecodigo,this.usuario).subscribe(
      async response => {
        console.log("response : ", response)
        if(response != null){
          this.Pendiente = response.mensaje.estado;
        } else {
          this.Pendiente = false;
        }
      });
  }

  async consultaURL(){
    // si url !== usoActual{
    //   actualizo las variables de session y refresco la pagina...
    // }
  }

  cambioDatosUsuario(hdgcodigo: number, esacodigo: number, cmecodigo :number){
    var datosusuario = new DevuelveDatosUsuario();
    datosusuario = JSON.parse(sessionStorage.getItem('Login'));
    datosusuario[0].hdgcodigo = hdgcodigo;
    datosusuario[0].esacodigo = esacodigo;
    datosusuario[0].cmecodigo = cmecodigo;

    sessionStorage.setItem('Login',JSON.stringify(datosusuario));
  }

  obtieneprivilegio(id_usuario:number,hdgcodigo:number, esacodigo:number, cmecodigo:number,usuario: string,servidor: string){
    this._loginuserService.Obtieneprivilegios(id_usuario,hdgcodigo,esacodigo,cmecodigo,usuario,servidor).subscribe(
      response => {
        sessionStorage.setItem('permisoslogistico',JSON.stringify(response));
        // this.router.navigate(['home']);
      },
      error => {
        console.log(error);
        alert("Error al Buscar Usuario")
      }
    );
  }
}
