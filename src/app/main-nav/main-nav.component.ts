import { Component, HostBinding, Input, OnInit, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { VERSION } from '@angular/material/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NavService } from '../nav.service';
import { Permisosusuario } from '../permisos/permisosusuario';
import { Menu } from '../models/main-nav/menu';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainNavComponent implements AfterViewInit {
  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;
  public modelopermisos: Permisosusuario = new Permisosusuario();
  version = VERSION;
  public menu: Menu = new Menu();
  public navItems: Array<any> = [];
  /** var local que esconde menu */
  private visible = false;
  public menuVisible = true;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public router: Router,
    public navService: NavService) {
      this.navItems = this.menu.navItems;
      this.menuMonitor();
      this.menuProducto();
      this.menuAdmbodegas();
      this.menuMovbodegas();
      this.menuMovpacientes();
      this.menuReportes();
      this.menuConsumo();
      this.menuAutopedido();
      // this.menuBusqctas();
      this.menuUsrRoles();
      this.menuIntegracion();
      this.menuCambioEnlace();
      this.menuAcercade();
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  /**
   * funcion que modifica el menu Productos
   * en segundo if al final se elimina menu completo ya que solo se tiene un solo submenu
   * Author: miguel.lobos@sonda.com
   * Fecha mod: 09-02-2021
  */

  menuMonitor() {
    /** indice menu */
    const indMonitor = this.navItems.findIndex(d => d.route === 'monitorejecutivo', 1);
    if (!this.modelopermisos.monitor) {
      this.navItems.splice(indMonitor, 1);
    }
  }

  menuProducto() {
    /** indices menu */
    const indproducto = this.navItems.findIndex(d => d.route === 'producto', 1);
    if (!this.modelopermisos.btnproducto) {
      if (indproducto >= 0) {
        this.navItems.splice(indproducto, 1);
      }
    } else {
      /** submenu  mantencionarticulo */
      if (!this.modelopermisos.btnmantarticulo) {
        this.navItems[indproducto].children.shift();
      }
      /** al final verifica si menu no tiene submenu lo elimina */
      if (!this.navItems[indproducto].children.length) {
        this.navItems.splice(indproducto, 1);
      }
    }
  }

  menuAdmbodegas() {
    /** indice menu */
    const indadmbodegas = this.navItems.findIndex(d => d.route === 'admbodegas', 1);
    if (!this.modelopermisos.btnadmbodegas) {
      if (indadmbodegas >= 0) {
        this.navItems.splice(indadmbodegas, 1);
      }
    } else {
      /** submenu libro controlado */
      const indlcontrolado = this.navItems[indadmbodegas].children.findIndex(d => d.route === 'admbodegas/mainlibrocontrolado', 1);
      /** submenu Ajustes */
      const indajustes = this.navItems[indadmbodegas].children.findIndex(d => d.route === 'admbodegas/ajustes', 1);
      /** submenu Kardex */
      const indkardex = this.navItems[indadmbodegas].children.findIndex(d => d.route === 'admbodegas/mainkardex', 1);
      /** Bodegas */
      if (!this.modelopermisos.btnbodegas) {
        /** indice submenus */
        const indbodegas = this.navItems[indadmbodegas].children.findIndex(d => d.route === 'bodegas', 1);
        if (indbodegas >= 0) {
          this.navItems[indadmbodegas].children.splice(indbodegas, 1);
        }
      }
      /** Plantilla de Bodega */
      if (!this.modelopermisos.btnplantillabod) {
        const indplantbodegas = this.navItems[indadmbodegas].children.findIndex(d => d.route === 'plantillasbodegas', 1);
        if (indplantbodegas >= 0) {
          this.navItems[indadmbodegas].children.splice(indplantbodegas, 1);
        }
      }
      /** Plantilla de Procedimientos */
      if (!this.modelopermisos.btnplantillaproced) {
        const indplantproce = this.navItems[indadmbodegas].children.findIndex(d => d.route === 'plantillasprocedimientos', 1);
        if (indplantproce >= 0) {
          this.navItems[indadmbodegas].children.splice(indplantproce, 1);
        }
      }
      /** Fraccionamiento */
      if (!this.modelopermisos.btnfraccionamiento) {
        const indfraccio = this.navItems[indadmbodegas].children.findIndex(d => d.route === 'fraccionamientoproductos', 1);
        if (indfraccio >= 0) {
          this.navItems[indadmbodegas].children.splice(indfraccio, 1);
        }
      }
      /**Consulta Fraccionamiento */
      if (!this.modelopermisos.btnconsultafraccionamiento) {
        const indfraccio = this.navItems[indadmbodegas].children.findIndex(d => d.route === 'consultafraccionamiento', 1);
        if (indfraccio >= 0) {
          this.navItems[indadmbodegas].children.splice(indfraccio, 1);
        }
      }
        /** Devolución Fraccionamiento */
        if (!this.modelopermisos.btndevolfraccionamiento) {
          const inddevolfraccio = this.navItems[indadmbodegas].children.findIndex(d => d.route === 'devolucionfraccionamiento', 1);
          if (inddevolfraccio >= 0) {
            this.navItems[indadmbodegas].children.splice(inddevolfraccio, 1);
          }
        }
      /** AdmBodegas>Libro Controlado */
      if (!this.modelopermisos.btnlibcontrolado) {
        if (indlcontrolado >= 0) {
          this.navItems[indadmbodegas].children.splice(indlcontrolado, 1);
        }
      }
      /** AdmBodegas>Libro Controlado>Cierre */
      if (!this.modelopermisos.btncierre) {
        const indlibcierre = this.navItems[indadmbodegas].children[indlcontrolado].children.findIndex(
          d => d.route === 'librocontrolado', 1);
        if (indlibcierre >= 0) {
          this.navItems[indadmbodegas].children[indlcontrolado].children.splice(indlibcierre, 1);
        }
      }
      /** AdmBodegas>Kardex */
      if (!this.modelopermisos.btnkardex) {
        const indkardex = this.navItems[indadmbodegas].children[indlcontrolado].children.findIndex(
          d => d.route === 'mainkardex', 1);
        if (indkardex >= 0) {
          this.navItems[indadmbodegas].children[indkardex].children.splice(indkardex, 1);
        }
      }
      /** AdmBodegas>Ajustes */
      if (!this.visible) {
        if (indajustes >= 0) {
          this.navItems[indadmbodegas].children.splice(indajustes, 1);
        }
      }
      /** al final verifica si menu no tiene submenu lo elimina */
      if (!this.navItems[indadmbodegas].children.length) {
        this.navItems.splice(indadmbodegas, 1);
      }
    }
  }

  menuMovbodegas() {
    /** indice menu */
    const indmovbodegas = this.navItems.findIndex(d => d.route === 'movbodegas', 1);
    if (!this.modelopermisos.btnmovbodega) {
      if (indmovbodegas >= 0) {
        this.navItems.splice(indmovbodegas, 1);
      }
    } else {
      /** Adm Solicitudes */
      if (!this.modelopermisos.btnadmsol) {
        /** indice submenus */
        const indadmsol = this.navItems[indmovbodegas].children.findIndex(d => d.route === 'creasolicitud', 1);
        if (indadmsol >= 0) {
          this.navItems[indmovbodegas].children.splice(indadmsol, 1);
        }
      }
      /** Reposicion Articulo */
      if (!this.modelopermisos.btnrepoarticulos) {
        const indrepart = this.navItems[indmovbodegas].children.findIndex(d => d.route === 'reposicionarticulos', 1);
        if (indrepart >= 0) {
          this.navItems[indmovbodegas].children.splice(indrepart, 1);
        }
      }
      /** Despachar Solicitudes */
      if (!this.modelopermisos.btndespsol) {
        const indbtndespsol = this.navItems[indmovbodegas].children.findIndex(d => d.route === 'despachosolicitudes', 1);
        if (indbtndespsol >= 0) {
          this.navItems[indmovbodegas].children.splice(indbtndespsol, 1);
        }
      }
      /** Recepcion Solicitudes */
      if (!this.modelopermisos.btnrecepsol) {
        const indrecepsol = this.navItems[indmovbodegas].children.findIndex(d => d.route === 'recepcionsolicitudes', 1);
        if (indrecepsol >= 0) {
          this.navItems[indmovbodegas].children.splice(indrecepsol, 1);
        }
      }
      /** Devolucion Solicitudes */
      if (!this.modelopermisos.btndevsol) {
        const indDevsol = this.navItems[indmovbodegas].children.findIndex(d => d.route === 'devolucionsolicitudes', 1);
        if (indDevsol >= 0) {
          this.navItems[indmovbodegas].children.splice(indDevsol, 1);
        }
      }
      /** Recep Dev entre Bod */
      if (!this.modelopermisos.btnrecepdevbod) {
        const indrecepdevbod = this.navItems[indmovbodegas].children.findIndex(d => d.route === 'recepciondevolucionbodegas', 1);
        if (indrecepdevbod >= 0) {
          this.navItems[indmovbodegas].children.splice(indrecepdevbod, 1);
        }
      }
      /** Ctrl Stock Min */
      if (!this.modelopermisos.btnctrlstockmin) {
        const indctrlstockmin = this.navItems[indmovbodegas].children.findIndex(d => d.route === 'controlstockminimo', 1);
        if (indctrlstockmin >= 0) {
          this.navItems[indmovbodegas].children.splice(indctrlstockmin, 1);
        }
      }
      /** Recepción DEvolución Paciente */
      if (!this.modelopermisos.menudevolpac) {
        const indmenudevolpac = this.navItems[indmovbodegas].children.findIndex(d => d.route === 'controlstockminimo', 1);
        if (indmenudevolpac >= 0) {
          this.navItems[indmovbodegas].children.splice(indmenudevolpac, 1);
        }
      }
      /** Consulta de Saldos por Bodega */
      if (!this.modelopermisos.menuconsultasaldobodega) {
        const indconsultasaldobod = this.navItems[indmovbodegas].children.findIndex(d => d.route === 'controlstockminimo', 1);
        if (indconsultasaldobod >= 0) {
          this.navItems[indmovbodegas].children.splice(indconsultasaldobod, 1);
        }
      }
      /** Consulta De Lotes */
      if (!this.modelopermisos.menuconsultalote) {
        const indmenuconsultalote = this.navItems[indmovbodegas].children.findIndex(d => d.route === 'controlstockminimo', 1);
        if (indmenuconsultalote >= 0) {
          this.navItems[indmovbodegas].children.splice(indmenuconsultalote, 1);
        }
      }

      /** al final verifica si menu no tiene submenu lo elimina */
      if (!this.navItems[indmovbodegas].children.length) {
        this.navItems.splice(indmovbodegas, 1);
      }
    }
  }

  menuMovpacientes() {
    /** indice menu */
    const indmovpaciente = this.navItems.findIndex(d => d.route === 'movpacientes', 1);
    if (!this.modelopermisos.btnmovpaciente) {
      if (indmovpaciente >= 0) {
        this.navItems.splice(indmovpaciente, 1);
      }
    } else {
      /** Solicitudes Pacientes */
      if (!this.modelopermisos.btnsolpaciente) {
        /** indice submenus */
        const indsolpaciente = this.navItems[indmovpaciente].children.findIndex(d => d.route === 'solicitudpaciente', 1);
        if (indsolpaciente >= 0) {
          this.navItems[indmovpaciente].children.splice(indsolpaciente, 1);
        }
      }
      /** Despachar Solicitudes */
      if (!this.modelopermisos.btndispsolpac) {
        const indDispsolpac = this.navItems[indmovpaciente].children.findIndex(d => d.route === 'dispensarsolicitudespacientes', 1);
        if (indDispsolpac >= 0) {
          this.navItems[indmovpaciente].children.splice(indDispsolpac, 1);
        }
      }
      /** Crea Dispensa Solicitudes */
      if (!this.modelopermisos.btncreadispsolpac) {
        const indCreaDispsolpac = this.navItems[indmovpaciente].children.findIndex(d => d.route === 'creadispensasolicitudpaciente', 1);
        if (indCreaDispsolpac >= 0) {
          this.navItems[indmovpaciente].children.splice(indCreaDispsolpac, 1);
        }
      }
      /** Genera Devolución */
      if (!this.modelopermisos.btngeneradevolpac) {
        const indDevolsolpac = this.navItems[indmovpaciente].children.findIndex(d => d.route === 'generadevolucionpaciente', 1);
        if (indDevolsolpac >= 0) {
          this.navItems[indmovpaciente].children.splice(indDevolsolpac, 1);
        }
      }
      /** Recep Devol Pacientes */
      if (!this.modelopermisos.btnrecepdevolpac) {
        const indrecepdevolpac = this.navItems[indmovpaciente].children.findIndex(d => d.route === 'devolucionpacientes', 1);
        if (indrecepdevolpac >= 0) {
          this.navItems[indmovpaciente].children.splice(indrecepdevolpac, 1);
        }
      }
      /** Creación Recetas Ambulatorias*/
      if (!this.modelopermisos.btncreacionrecetas) {
        const indCreacionrecetas = this.navItems[indmovpaciente].children.findIndex(d => d.route === 'creacionrecetasambulatorias', 1);
        if (indCreacionrecetas >= 0) {
          this.navItems[indmovpaciente].children.splice(indCreacionrecetas, 1);
        }
      }
      /** Despacho Recetas */
      if (!this.modelopermisos.btndesprecetas) {
        const indDesprecetas = this.navItems[indmovpaciente].children.findIndex(d => d.route === 'despachorecetasambulatoria', 1);
        if (indDesprecetas >= 0) {
          this.navItems[indmovpaciente].children.splice(indDesprecetas, 1);
        }
      }
      /** Consulta Recetas Programadas */
      if (!this.modelopermisos.btnconsulrecetas) {
        const indconsulrecetas = this.navItems[indmovpaciente].children.findIndex(d => d.route === 'consultarecetasambulatoria', 1);
        if (indconsulrecetas >= 0) {
          this.navItems[indmovpaciente].children.splice(indconsulrecetas, 1);
        }
      }
       /** busqueda en Cuentas */
       if (!this.modelopermisos.btnbusquedacuentas) {
        const indbusquedacuentas = this.navItems[indmovpaciente].children.findIndex(d => d.route === 'busquedacuentas', 1);
        if (indbusquedacuentas >= 0) {
          this.navItems[indmovpaciente].children.splice(indbusquedacuentas, 1);
        }
      }
       /** Consumo paciente por bodega*/
      if (!this.modelopermisos.btnconsumopacbodega) {
        const indconsumopac = this.navItems[indmovpaciente].children.findIndex(d => d.route === 'consumopacienteporbodega', 1);
        if (indconsumopac >= 0) {
          this.navItems[indmovpaciente].children.splice(indconsumopac, 1);
        }
      }
      /** al final verifica si menu no tiene submenu lo elimina */
      if (!this.navItems[indmovpaciente].children.length) {
        this.navItems.splice(indmovpaciente, 1);
      }
    }
  }

  menuReportes(){
    const indreportes = this.navItems.findIndex(d => d.route === 'reportes', 1);
    if (!this.modelopermisos.btnreportes) {
      if (indreportes >= 0) {
        this.navItems.splice(indreportes, 1);
      }
    } else {
      /** Reimpresion Solicitudes */
      if (!this.modelopermisos.btnreimpresionsolicitud) {
        /** indice submenus */
        const indreimpsolic = this.navItems[indreportes].children.findIndex(d => d.route === 'reimpresionsolicitudes', 1);
        if (indreimpsolic >= 0) {
          this.navItems[indreportes].children.splice(indreimpsolic, 1);
        }
      }
      /** Lista Conteo Inventario */
      if (!this.modelopermisos.btnlistaconteoinventario) {
        /** indice submenus */
        const indlistaconteo = this.navItems[indreportes].children.findIndex(d => d.route === 'informeconteolistainventario', 1);
        if (indlistaconteo >= 0) {
          this.navItems[indreportes].children.splice(indlistaconteo, 1);
        }
      }
      /** Consumo por Bodegas */
      if (!this.modelopermisos.btnconsumoporbodega) {
        /** indice submenus */
        const indconsumobodega = this.navItems[indreportes].children.findIndex(d => d.route === 'inftendencias', 1);
        if (indconsumobodega >= 0) {
          this.navItems[indreportes].children.splice(indconsumobodega, 1);
        }
      }
      /** Pedidos con gasto servicio */
      if (!this.modelopermisos.menugastoservicio) {
        /** indice submenus */
        const indgastoservicio = this.navItems[indreportes].children.findIndex(d => d.route === 'infpedidosgastoservicio', 1);
        if (indgastoservicio >= 0) {
          this.navItems[indreportes].children.splice(indgastoservicio, 1);
        }
      }
     
      /** al final verifica si menu no tiene submenu lo elimina */
      if (!this.navItems[indreportes].children.length) {
        this.navItems.splice(indreportes, 1);
      }
    }
  }

  menuConsumo() {
    /** indice menu */
    const indconsumo = this.navItems.findIndex(d => d.route === 'consumo', 1);
    if (!this.modelopermisos.btnconsumo) {
      if (indconsumo >= 0) {
        this.navItems.splice(indconsumo, 1);
      }
    } else {
      /** Solicitud Consumo */
      if (!this.modelopermisos.btnsolconsumo) {
        /** indice submenus */
        const indsolconsumo = this.navItems[indconsumo].children.findIndex(d => d.route === 'solicitudconsumo', 1);
        if (indsolconsumo >= 0) {
          this.navItems[indconsumo].children.splice(indsolconsumo, 1);
        }
      }
      /** Plantilla Consumo */
      if (!this.modelopermisos.btnplantconsumo) {
        const indplantconsumo = this.navItems[indconsumo].children.findIndex(d => d.route === 'plantillaconsumo', 1);
        if (indplantconsumo >= 0) {
          this.navItems[indconsumo].children.splice(indplantconsumo, 1);
        }
      }
      /** al final verifica si menu no tiene submenu lo elimina */
      if (!this.navItems[indconsumo].children.length) {
        this.navItems.splice(indconsumo, 1);
      }
    }
  }

  menuAutopedido(){
    const indautopedido = this.navItems.findIndex(d => d.route === 'autopedido', 1);
    if (!this.modelopermisos.btnMenuAutopedido) {
      if (indautopedido >= 0) {
        this.navItems.splice(indautopedido, 1);
      }
    } else {
      /** Solicitud Autopedido */
      if (!this.modelopermisos.btnMenuSolicitudAutopedido) {
        /** indice submenus */
        const indsolautopedido = this.navItems[indautopedido].children.findIndex(d => d.route === 'despachocostoservicio', 1);
        if (indautopedido >= 0) {
          this.navItems[indautopedido].children.splice(indautopedido, 1);
        }
      }
      /** DEvolucion Autopedido */
      if (!this.modelopermisos.btnMenuDevolAutopedido) {
        const indsolicautopedido = this.navItems[indautopedido].children.findIndex(d => d.route === 'devolucionautopedido', 1);
        if (indsolicautopedido >= 0) {
          this.navItems[indautopedido].children.splice(indsolicautopedido, 1);
        }
      }
      /** al final verifica si menu no tiene submenu lo elimina */
      if (!this.navItems[indautopedido].children.length) {
        this.navItems.splice(indautopedido, 1);
      }
    }


  }

  // menuBusqctas() {
  //   /** indice menu */
  //   const indbusqctas = this.navItems.findIndex(d => d.route === 'busquedacuentas', 1);
  //   // if (!this.modelopermisos.btnxxxx) { // <- Falta asignar codigo de rol
  //   //   this.navItems.splice(indbusqctas, 1);
  //   // }
  // }

  menuUsrRoles() {
    /** indice menu */
    const indusrRoles = this.navItems.findIndex(d => d.route === 'rolesusuarios', 1);
    if (!this.modelopermisos.btnusroles) {
      this.navItems.splice(indusrRoles, 1);
    }
  }

  menuIntegracion() {
    /** indice menu */
    const indintegracion = this.navItems.findIndex(d => d.route === 'integracion', 1);
    if (!this.modelopermisos.btnMenuInterfaz) {
      if (indintegracion >= 0) {
        this.navItems.splice(indintegracion, 1);
      }
    } else {
      /** Visor Cargos / ERP */
      if (!this.modelopermisos.btnMenuInterfazCargos) {
        const indcargos = this.navItems[indintegracion].children.findIndex(d => d.route === 'PanelIntegracionCargosComponent', 1);
        if (indcargos >= 0) {
          this.navItems[indintegracion].children.splice(indcargos, 1);
        }
      }
      if (!this.modelopermisos.btnMenuInterfazErp) {
        const inderp = this.navItems[indintegracion].children.findIndex(d => d.route === 'PanelIntegracionERPComponent', 1);
        if (inderp >= 0) {
          this.navItems[indintegracion].children.splice(inderp, 1);
        }
      }
      /** al final verifica si menu no tiene submenu lo elimina */
      if (!this.navItems[indintegracion].children.length) {
        this.navItems.splice(indintegracion, 1);
      }
    }
  }

  menuCambioEnlace() {
    /** indice menu */
    const indCambiaEnlace = this.navItems.findIndex(d => d.route === 'cambiaenlacersc', 1);
    if (!this.modelopermisos.btncambioenlace) {
      this.navItems.splice(indCambiaEnlace, 1);
    }
  }

  menuAcercade() {
    /** indice menu */
    // const indacercade = this.navItems.findIndex(d => d.route === 'acercade', 1);
    // if (!this.modelopermisos.btnacercade) {
    //   if (indacercade >= 0) {
    //     this.navItems.splice(indacercade, 1);
    //   }
    // } else {
    //   /** Versiones */
    //   if (!this.modelopermisos.btnversiones) {
    //     this.navItems[indacercade].children.shift();
    //   }
    //   /** al final verifica si menu no tiene submenu lo elimina */
    //   if (!this.navItems[indacercade].children.length) {
    //     this.navItems.splice(indacercade, 1);
    //   }
    // }
  }
}
