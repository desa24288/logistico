import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../servicios/login.service';
import { environment } from '../../environments/environment';
import { Privilegios } from '../models/entity/Privilegios';
import { Privilegio1 } from '../models/entity/Privilegio1';
import { DevuelveDatosUsuario } from '../models/entity/DevuelveDatosUsuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public FormLogin      : FormGroup;
  public login          : DevuelveDatosUsuario[];
  public privilegios    : Privilegios[];
  public privilegiototal: Privilegio1[] =[];
  public priv4 : Privilegio1[]=[];
  //public privilegios  : Privilegios[];

  constructor(
    private _loginuserService      : LoginService,
    private formBuilder: FormBuilder,
    private router      : Router
  ) {

    this.FormLogin = this.formBuilder.group({
      
      usuario         : [null],
      contraseña      : [null]
      
    });
   }

  ngOnInit() {
    localStorage.clear();
    sessionStorage.clear();
  }

  autenticacion(){

    var servidor= environment.URLServiciosRest.ambiente;

    this._loginuserService.BuscaUsuario(this.FormLogin.value.usuario.toUpperCase(),this.FormLogin.value.contraseña,servidor).subscribe(
      response => {
         this.login=response;
        if(response.length == 0){
          alert("!! Usuario no existe o no autorizado !!, Favor intentar nuevamente");
        }else{

          sessionStorage.setItem('Login',JSON.stringify(this.login));
          sessionStorage.setItem('hdgcodigo', response[0].hdgcodigo.toString()); 
          sessionStorage.setItem('esacodigo', response[0].esacodigo.toString()); 
          sessionStorage.setItem('cmecodigo', response[0].cmecodigo.toString());  
          sessionStorage.setItem('Usuario', this.FormLogin.value.usuario.toUpperCase()); 
          sessionStorage.setItem('id_usuario',response[0].userid.toString());

    
          environment.privilegios.usuario= this.FormLogin.value.usuario.toUpperCase();
          environment.privilegios.holding= response[0].hdgnombre;
          environment.privilegios.empresa= response[0].esanombre;
          environment.privilegios.sucursal= response[0].cmenombre;
          
          this.obtieneprivilegio(response[0].userid, response[0].hdgcodigo,response[0].esacodigo, response[0].cmecodigo, 
            JSON.stringify(this.login), environment.URLServiciosRest.ambiente);
        }
        
      },
      error => {
        console.log(error);
        alert("Error al Buscar Usuario")
      }
    );
  }

  obtieneprivilegio(id_usuario:number,hdgcodigo:number, esacodigo:number, cmecodigo:number,usuario: string,servidor: string){
    this._loginuserService.Obtieneprivilegios(id_usuario,hdgcodigo,esacodigo,cmecodigo,usuario,servidor).subscribe(
      response => {
        sessionStorage.setItem('permisoslogistico',JSON.stringify(response));
        this.router.navigate(['home']); 
      },
      error => {
        console.log(error);
        alert("Error al Buscar Usuario")
      }
    );
  }

}
