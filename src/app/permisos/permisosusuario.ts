// import * as jwt_decode from 'jwt-decode';
import { Permisos } from '../models/entity/permisos';

export class Permisosusuario {
  // public permisos Array<Permisos> = [];
  public permisos = [];

  /** Menu Sidebar */
  public btnproductos = false;
  public btnmovbodega = false;
  public btnproducto = false;
  public btnmantarticulo = false;
  public btnadmbodegas = false;
  public btnbodegas = false;
  public btnplantillabod = false;
  public btnplantillaproced = true;
  public btnfraccionamiento = false;
  public btnlibcontrolado = false;
  public btnajustes = false;
  public btncierre = false;
  public btnconsulta = false;
  public btnajustestock = false;
  public btnadmsol = false;
  public btnrepoarticulos = false;
  public btndespsol = false;
  public btnrecepsol = false;
  public btndevsol = false;
  public btnrecepdevbod = false;
  public btnmovimientosb = false;
  public btnctrlstockmin = false;
  public btnmovpaciente = false;
  public btnsolpaciente = false;
  public btndispsolpac = false;
  public btnrecepdevolpac = false;
  public btndesprecetas = false;
  public btnconsulrecetas = false;
  public btnmovimientosp = false;
  public btnconsumo = false;
  public btnsolconsumo = false;
  public btnplantconsumo = false;
  public btnusroles = false;
  public btnacercade = false;
  public btnversiones = false;
  public btndepachocostoservi = false;
  public btnkardex = false;
  public btnconsultakardex = false;
  public btncierrekardex = false;
  /** pantalla Mantencion Articulos (MA) */
  public btnmodificarma = false;
  /** pantalla Bodegas */
  public btnmodificarbod = false;
  public btngrabarbod = false;
  /** pantalla Fraccionamiento */
  public btngrabafrac = false;
  public btnmodificafrac = false;
  /** pantalla Libro Controlado */
  public btngrabalibrocont = false;
  public btnimplibrocierre = false;
  public btnconsultalibcierre = false;
  /** pantalla consulta Libro Controlado */
  public btnimplibconsulta = false;
  public btnconsultalib = false;
  /** pantalla Ajuste Stock */
  public btngrabaajustestock = false;
  

  /** pantalla Plantillas Bod. (PB)*/
  public btngrabarpb = false;
  public btnmodificarpb = false;
  public btneliminarpb = false;
  /** pantalla Admin Solicitudes Bodegas. */
  public btngrabasolicbod = false;
  public btnmodificasolicbod = false;
  public btnimprsolicbod = false;
  public btneliminasolicbod = false;
  /** pantalla Reposición Artículos. */
  public btngrabasolicrepos = false;
  public btnimpsolicrepos = false;
  /** pantalla Despacho Solicitudes. */
  public btngrabadespachosolic = false;
  public btnimpdespsolicbod = false;
  /** pantalla Recepcion Solicitudes Bod. */
  public btngrabarecepsolic = false;
  public btngrabareceptotalsolic = false;
  public btnimprecepsolicbod = false;
  /** pantalla Devolucion Solicitudes Bod. */
  public btngrabadevolsolic = false;
  public btnimpdevolsolicbod = false;
  /** pantalla Recepcion Devolución Solicitudes Bod. */
  public btngrabarecepdevolsolicbod = false;
  public btnimprecepdevolsolicbod = false;
  /** pantalla Movimientos Bod. */
  public btngrabamovimbod = false;
  public btnimprimemovimbod = false;
  /** pantalla Control Stock Minimo. */
  /** pantalla Solicitud Consumo. */
  public btngrabasolicons = false;
  public btnmodifsoliccons = false;
  public btnimprimesolicons = false;
  public btneliminasolicons = false;
  /** pantalla Plantilla Consumo. */
  public btngrabaplantcons = false;
  public btnmodifplantcons = false;
  public btnimprimeplantcons = false;
  public btneliminaplantcons = false;
  /** pantalla Despacho Receta. */
  public btngrabadespachorec = false;
  public btnmodifdespachorec = false;
  /** pantalla Consulta Receta. */
  public btnimprimeconsurec = false;
  /** pantalla Devolucion Paciente. */
  public btndevolverpac = false;
  public btnimprimedevolpac = false;
  /** pantalla Dispensar Solicitud Paciente. */
  public btndispensarsolicpac = false;
  public btnimprimedisppac = false;
  /** pantalla  Solicitud Paciente. */
  public btngrabasolicpac = false;
  public btnmodifsolicpac = false;
  public btnimprimesolicpac = false;
  public btneliminasolicpac = false;
  /** pantalla Movimiento Paciente. */
  public btngrabamovimpac = false;
  public btnimprimemovimpac = false;
  /** pantalla Plantilla Procedimientos */
  public btngrabarpp = true;
  public btnmodificarpp = true;
  public btneliminarpp = true;
  /** pantalla Despacho Costo Servicio */
  public btngrabadespachocostoser = false;
  public btnimprdespcostoser = false;
  /** pantalla Cierre KArdex */
  public btngrabacierrekardex = false;
  public btnimprcierrekardex = false;
   /** pantalla Consulta KArdex */
   public btnbuscakardex = false;
   public btnimprimeconskardex = false;

     /** pantallas Visor de interfaces  */
     public btnMenuInterfaz = false;
     public btnMenuInterfazCargos = false
     public btnMenuInterfazErp = false

  constructor() {
    this.loadpermisos();
  }

  private loadpermisos() {
    const arrpermisos:  Array<Permisos> = JSON.parse(sessionStorage.getItem('permisoslogistico'));
    if (arrpermisos.length || arrpermisos !== null){
      this.permisos = arrpermisos.map(x => x.idaccion);
      this.validaSidebar();
      this.validaMantenarticulo();
      this.validaBodegas();
  
      this.validaPlantillasbd();
      this.validaFraccionamiento();
      this.validaCierreLibroCont();
      this.validaConsultaLibroCont();
      this.validaAjusteStock();
      this.validaSolicBod();
      this.validaReposArti();
      this.validaDespachoSolicBod();
      this.validaRecepcionSolicBod();
      this.validaDevolSolicBod();
      this.validaRecepDevolSolicBod();
      this.validaMovimientosBod();
      this.validaSolicitudConsumo();
      this.validaPlantillaConsumo();
      this.validaDespachoReceta();
      this.validaConsultaReceta();
      this.validaDevolucionPaciente();
      this.validaDispensarPaciente();
      this.validaSolicitudPaciente();
      this.validaMovimientosPac();
      this.validaPlantillaProced();
      this.validaPantallaDespachoCostoServi();
      this.validaPantallaCierreKardex();
      this.validaMenuIterfaces();
    }
  }


  validaMenuIterfaces(){
    this.permisos.forEach(x => {
      if (x === 626000){
        this.btnMenuInterfaz = true;
      }
      if (x === 626100){
        this.btnMenuInterfazCargos = true;
      }
      if (x === 626200){
        this.btnMenuInterfazErp = true;
      }
      
    });
  }
  validaPantallaConsultaKardex(){
    this.permisos.forEach(x => {
      if (x === 371100){
        this.btnbuscakardex = true;
      }
      if (x === 372100){
        this.btnimprimeconskardex = true;
      }
      
    });
  }

  validaPantallaCierreKardex(){
    this.permisos.forEach(x => {
      if (x === 371100){
        this.btngrabacierrekardex = true;
      }
      if (x === 371200){
        this.btnimprcierrekardex = true;
      }
      
    });
  }

  validaPantallaDespachoCostoServi() {
    this.permisos.forEach(x => {
      if (x === 492000){
        this.btngrabadespachocostoser = true;
      }
      if (x === 493000){
        this.btnimprdespcostoser = true;
      }
     
    });
  }

  validaPlantillaProced() {
    this.permisos.forEach(x => {
      if (x === 361000){
        this.btngrabarpp = true;
      }
      if (x === 362000){
        this.btnmodificarpp = true;
      }
      if (x === 363000){
        this.btneliminarpp = true;
      }
    });
  }

  validaMovimientosPac(){
    this.permisos.forEach(x => {
      if (x === 562000){
        this.btngrabamovimpac = true;
      }
      if (x === 563000){
        this.btnimprimemovimpac = true;
      }
    });
  }

  validaSolicitudPaciente(){
    this.permisos.forEach(x => {
      if (x === 512000){
        this.btngrabasolicpac = true;
      }
      if (x === 513000){
        this.btnmodifsolicpac = true;
      }
      if (x === 514000){
        this.btneliminasolicpac = true;
      }
      if (x === 515000){
        this.btnimprimesolicpac = true;
      }
    });
  }

  validaDispensarPaciente(){
    this.permisos.forEach(x => {
      if (x === 522000){
        this.btndispensarsolicpac = true;
      }
      if (x === 523000){
        this.btnimprimedisppac = true;
      }
    });
  }

  validaDevolucionPaciente(){
    this.permisos.forEach(x => {
      if (x === 532000){
        this.btndevolverpac = true;
      }
      if (x === 532000){
        this.btnimprimedevolpac = true;
      }
    });
  }

  validaConsultaReceta(){
    this.permisos.forEach(x => {
      if (x === 552000){
        this.btnimprimeconsurec = true;
      }
    });
  }  

  validaDespachoReceta(){
    this.permisos.forEach(x => {
      if (x === 542000){
        this.btngrabadespachorec = true;
      }
      if (x === 543000){
        this.btnmodifdespachorec = true;
      }
    });
  }  

  validaPlantillaConsumo(){
    this.permisos.forEach(x => {
      if (x === 622000){
        this.btngrabaplantcons = true;
      }
      if (x === 623000){
        this.btnmodifplantcons = true;
      }
      if (x === 624000){
        this.btnimprimeplantcons = true;
      }
      if (x === 625000){
        this.btneliminaplantcons = true;
      }
    });
  }

  validaSolicitudConsumo(){
    this.permisos.forEach(x => {
      if (x === 612000){
        this.btngrabasolicons = true;
      }
      if (x === 613000){
        this.btnmodifsoliccons = true;
      }
      if (x === 614000){
        this.btnimprimesolicons = true;
      }
      if (x === 615000){
        this.btneliminasolicons = true;
      }
    });
  }

  validaMovimientosBod(){
    this.permisos.forEach(x => {
      if (x === 472000){
        this.btngrabamovimbod = true;
      }
      if (x === 473000){
        this.btnimprimemovimbod = true;
      }
    });
  }

  validaRecepDevolSolicBod(){
    this.permisos.forEach(x => {
      if (x === 462000){
        this.btngrabarecepdevolsolicbod = true;
      }
      if (x === 463000){
        this.btnimprecepdevolsolicbod = true;
      }
      
    });
  }

  validaDevolSolicBod(){
    this.permisos.forEach(x => {
      if (x === 452000){
        this.btngrabadevolsolic = true;
      }
      if (x === 453000){
        this.btnimpdevolsolicbod = true;
      }
      
    });
  }

  validaRecepcionSolicBod(){
    this.permisos.forEach(x => {
      if (x === 443000){
        this.btngrabarecepsolic = true;
      }
      if (x === 442000){
        this.btngrabareceptotalsolic = true;
      }
      if (x === 444000){
        this.btnimprecepsolicbod = true;
      }
      
    });
  }

  validaDespachoSolicBod(){
    this.permisos.forEach(x => {
      if (x === 431000){
        this.btngrabadespachosolic = true;
      }
      if (x === 432000){
        this.btnimpdespsolicbod = true;
      }
      
    });
  }

  validaReposArti(){
    this.permisos.forEach(x => {
      if (x === 351100){
        this.btngrabasolicrepos = true;
      }
      if (x === 351100){
        this.btnimpsolicrepos = true;
      }
      
    });
  }
  
  validaSolicBod(){
    this.permisos.forEach(x => {
      if (x === 412000){
        this.btngrabasolicbod = true;
      }
      if (x === 413000){
        this.btnmodificasolicbod = true;
      }
      if (x === 414000){
        this.btnimprsolicbod = true;
      }
      if (x === 415000){
        this.btneliminasolicbod = true;
      }
      
    });
  }

  validaAjusteStock(){
    this.permisos.forEach(x => {
      if (x === 351100){
        this.btngrabaajustestock = true;
      }
      
    });
  }

  validaConsultaLibroCont(){
    this.permisos.forEach(x => {
      if (x === 342100){
        this.btnimplibconsulta = true;
      }
      if (x === 342200){
        this.btnconsultalib = true;
      }
     
    });
  }

  validaCierreLibroCont(){
    this.permisos.forEach(x => {
      if (x === 341100){
        this.btngrabalibrocont = true;
      }
      if (x === 341200){
        this.btnimplibrocierre = true;
      }
      if (x === 342300){
        this.btnconsultalibcierre = true;
      }
    });
  }

  validaFraccionamiento() {
    this.permisos.forEach(x => {
      if (x === 332000){
        this.btngrabafrac = true;
      }
      if (x === 333000){
        this.btnmodificafrac = true;
      }
    });
  }

  validaBodegas() {
    this.permisos.forEach(x => {
      if (x === 313000){
        this.btnmodificarbod = true;
      }
      if (x === 312000){
        this.btngrabarbod = true;
      }
    });
  }

  validaMantenarticulo() {
    this.permisos.forEach(x => {
      if (x === 212000){
        this.btnmodificarma = true;
      }
    });
  }

  validaSidebar() {
    this.permisos.forEach(x => {
      //-- Producto --
      if (x === 200000){
        this.btnproducto = true;
      }
      if (x === 210000){
        this.btnmantarticulo = true;
      }
      //-- End Producto --
      //-- Adm Bodega --
      if (x === 300000){
        this.btnadmbodegas = true;
      }
      if (x === 310000){
        this.btnbodegas = true;
      }
      if (x === 320000){
        this.btnplantillabod = true;
      }
      if (x === 330000){
        this.btnfraccionamiento = true;
      }
      if (x === 340000){
        this.btnlibcontrolado = true;
      }
      if (x === 350000){
        this.btnajustes = true;
      }
      if (x === 360000){
        this.btnplantillaproced = true;
      }
      if (x === 341000){
        this.btncierre = true;
      }
      if (x === 342000){
        this.btnconsulta = true;
      }
      if (x === 351000){
        this.btnajustestock = true;
      }
      if (x === 370000 ){
        this.btnkardex = true;
      }
      // if( x === 371000){
      //   this.btnconsultakardex = true;
      // }
      // if( x === 372000){
      //   this.btncierrekardex = true;
      // }

      //-- End Adm Bodega --

      //-- MovBodegas --
      if (x === 400000){
        this.btnmovbodega = true;
      }
      if (x === 410000){
        this.btnadmsol = true;
      }
      if (x === 420000){
        this.btnrepoarticulos = true;
      }
      if (x === 430000){
        this.btndespsol = true;
      }
      if (x === 440000){
        this.btnrecepsol = true;
      }
      if (x === 450000){
        this.btndevsol = true;
      }
      if (x === 460000){
        this.btnrecepdevbod = true;
      }
      if (x === 470000){
        this.btnmovimientosb = true;
      }
      if (x === 480000){
        this.btnctrlstockmin = true;
      }
      if(x === 490000){
        this.btndepachocostoservi = true;
      }
      //-- End MovBodegas --

      //-- MovPaciente --
      if (x === 500000){
        this.btnmovpaciente = true;
      }
      if (x === 510000){
        this.btnsolpaciente = true;
      }
      if (x === 520000){
        this.btndispsolpac = true;
      }
      if (x === 530000){
        this.btnrecepdevolpac = true;
      }
      if (x === 540000){
        this.btndesprecetas = true;
      }
      if (x === 550000){
        this.btnconsulrecetas = true;
      }
      if (x === 560000){
        this.btnmovimientosp = true;
      }
      //-- End MovPaciente --

      //-- Consumo --
      if (x === 600000){
        this.btnconsumo = true;
      }
      if (x === 610000){
        this.btnsolconsumo = true;
      }
      if (x === 620000){
        this.btnplantconsumo = true;
      }
      //-- End Consumo --

      //-- Usr roles --
      if (x === 1000000){
        this.btnusroles = true;
      }
      //-- End Consumo --
      
      //-- Acerca de --
      if (x === 2000000){
        this.btnacercade = true;
      }
      if (x === 2100000){
        this.btnversiones = true;
      }
      //-- End Acerca de --
    });
  }

  validaPlantillasbd() {
    this.permisos.forEach(x => {
      if (x === 322000){
        this.btngrabarpb = true;
      }
      if (x === 323000){
        this.btnmodificarpb = true;
      }
      if (x === 324000){
        this.btneliminarpb = true;
      }
    });
  }

  /** Usar con Token //@MLobos */
  private getDecodedAccessToken(token: string): any {
    try {
    //   return jwt_decode(token);
    } catch (err) {
    }
  }
}