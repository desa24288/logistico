import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NotFoundPAgeComponent } from './views/not-found-page/not-found-page.component';
import { HomeComponent} from './views/home/home.component'
import { MantencionarticulosComponent } from './views/mantencionarticulos/mantencionarticulos.component'
import { ReposicionArticulosComponent } from './views/reposicion-articulos/reposicion-articulos.component'
import { SolicitudesManualesComponent } from './views/solicitudes-manuales/solicitudes-manuales.component'
import { MovimientosComponent } from './views/movimientos/movimientos.component';
import { DespachosolicitudesComponent } from './views/despachosolicitudes/despachosolicitudes.component';
import { ListadopararealizarinventarioComponent } from './views/listadopararealizarinventario/listadopararealizarinventario.component';
import { GenerainventariosistemaComponent } from './views/generainventariosistema/generainventariosistema.component';
import { DevolucionsolicitudesComponent } from './views/devolucionsolicitudes/devolucionsolicitudes.component';
import { IngresoconteomanualComponent } from './views/ingresoconteomanual/ingresoconteomanual.component';
import { GeneraajusteinventarioComponent } from './views/generaajusteinventario/generaajusteinventario.component';
import { InformeexistenciasvalorizadasComponent } from './views/informeexistenciasvalorizadas/informeexistenciasvalorizadas.component';
import { DispensarsolicitudpacienteComponent } from './views/dispensarsolicitudpaciente/dispensarsolicitudpaciente.component';
import { SolicitudpacienteComponent } from './views/solicitudpaciente/solicitudpaciente.component';
import { DevolucionsolicitudespacientesComponent } from './views/devolucionsolicitudespacientes/devolucionsolicitudespacientes.component';
import { RecepcionsolicitudesComponent } from './views/recepcionsolicitudes/recepcionsolicitudes.component';
import { DevolucionpacientesComponent } from './views/devolucionpacientes/devolucionpacientes.component';
import { DespachoRecetasAmbulatoriaComponent } from './views/despacho-recetas-ambulatoria/despacho-recetas-ambulatoria.component';
import { RecepciondevolucionentrebodegasComponent } from './views/recepciondevolucionentrebodegas/recepciondevolucionentrebodegas.component';
import { ConsultakardexComponent } from './views/consultakardex/consultakardex.component';
import { AjustestockComponent } from './views/ajustestock/ajustestock.component';
import { AjustevaloresComponent } from './views/ajustevalores/ajustevalores.component';
import { InformeajustesvalorizadosComponent } from './views/informeajustesvalorizados/informeajustesvalorizados.component';
import { InformeajustesdepreciosComponent } from './views/informeajustesdeprecios/informeajustesdeprecios.component';
import { BodegasComponent } from './views/bodegas/bodegas.component';
import { PlantillassolicitudbodegaComponent } from './views/plantillassolicitudbodega/plantillassolicitudbodega.component';
import { FraccionamientoproductosComponent } from './views/fraccionamientoproductos/fraccionamientoproductos.component';
import { MonitorEjecutivoComponent } from './views/monitor-ejecutivo/monitor-ejecutivo.component';
import { VersionesComponent } from './views/versiones/versiones.component';
import { ControlStockMinimoComponent } from './views/control-stock-minimo/control-stock-minimo.component';
import { LibrocontroladoComponent } from './views/librocontrolado/librocontrolado.component';
import { ConsultalibrocontroladoComponent } from './views/consultalibrocontrolado/consultalibrocontrolado.component';
import { ConsultarecetaambulatoriaComponent } from './views/consultarecetaambulatoria/consultarecetaambulatoria.component';
import { SolicitudConsumoComponent } from './views/solicitud-consumo/solicitud-consumo.component';
import { PlantillaConsumoComponent } from './views/plantilla-consumo/plantilla-consumo.component';
import { AdministracionRolesComponent } from './views/administracion-roles/administracion-roles.component';
import { DespachocostoservicioComponent } from './views/despachocostoservicio/despachocostoservicio.component';
import { CreadispensasolicitudpacienteComponent } from './views/creadispensasolicitudpaciente/creadispensasolicitudpaciente.component';
import { CierrekardexComponent } from './views/cierrekardex/cierrekardex.component';
import { BodegaspruebaComponent } from './views/pruebas/bodegasprueba/bodegasprueba.component';
import { PanelIntegracionCargosComponent } from './views/panel-integracion-cargos/panel-integracion-cargos.component';
import { CreadispensasolicitudpruebaComponent } from './views/pruebas/creadispensasolicitudprueba/creadispensasolicitudprueba.component';
import { PanelIntegracionERPComponent } from './views/panel-integracion-erp/panel-integracion-erp.component';


const mi_routas: Routes = [
  { path: '', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'PanelIntegracionERPComponent', component: PanelIntegracionERPComponent },
  { path: 'PanelIntegracionCargosComponent', component: PanelIntegracionCargosComponent },
  { path: 'plantillas/:in_tipo', component: PlantillassolicitudbodegaComponent },
  { path: 'rolesusuarios', component: AdministracionRolesComponent },
  { path: 'plantillas', component: PlantillassolicitudbodegaComponent },
  { path: 'plantillaconsumo', component: PlantillaConsumoComponent },
  { path: 'solicitudconsumo', component: SolicitudConsumoComponent },
  { path: 'controlstockminimo', component: ControlStockMinimoComponent },
  { path: 'controlstockminimo/:id_suministro/:id_tipoproducto/:id_solicita/:fechadesde/:fechahasta/:id_articulo/:desc_articulo', component: ControlStockMinimoComponent },
  { path: 'mantencionarticulos', component: MantencionarticulosComponent },
  { path: 'reposicionarticulos', component: ReposicionArticulosComponent },
  { path: 'movimientos', component: MovimientosComponent },
  { path: 'creasolicitud', component: SolicitudesManualesComponent },
  { path: 'despachosolicitudes/:id_solicitud/:retorno_pagina/:id_suministro/:id_tipoproducto/:id_solicita/:fechadesde/:fechahasta/:id_articulo/:desc_articulo', component: DespachosolicitudesComponent},
  { path: 'despachosolicitudes/:id_solicitud/:retorno_pagina', component: DespachosolicitudesComponent},
  { path: 'despachosolicitudes', component: DespachosolicitudesComponent},
  { path: 'listadopararealizarinventarios', component: ListadopararealizarinventarioComponent },
  { path: 'generainventariosistema', component: GenerainventariosistemaComponent },
  { path: 'devolucionsolicitudes', component: DevolucionsolicitudesComponent },
  { path: 'ingresoconteomanual', component: IngresoconteomanualComponent},
  { path: 'generaajusteinventario', component: GeneraajusteinventarioComponent },
  { path: 'informeexistenciasvalorizado', component: InformeexistenciasvalorizadasComponent},
  { path: 'dispensarsolicitudespacientes/:id_solicitud', component: DispensarsolicitudpacienteComponent},
  { path: 'dispensarsolicitudespacientes', component: DispensarsolicitudpacienteComponent},
  { path: 'solicitudpaciente', component: SolicitudpacienteComponent },
  { path: 'devolucionsolicitudespacientes', component: DevolucionsolicitudespacientesComponent },
  { path: 'recepcionsolicitudes/:id_solicitud', component: RecepcionsolicitudesComponent },
  { path: 'recepcionsolicitudes', component: RecepcionsolicitudesComponent },
  { path: 'devolucionpacientes', component: DevolucionpacientesComponent },
  { path: 'despachorecetasambulatoria/:soliid/:id_reseta/:retorno_pagina', component: DespachoRecetasAmbulatoriaComponent },
  { path: 'despachorecetasambulatoria/:soliid/:ambito/:ambito/:retorno_pagina', component: DespachoRecetasAmbulatoriaComponent },
  { path: 'despachorecetasambulatoria', component: DespachoRecetasAmbulatoriaComponent },
  { path: 'recepciondevolucionbodegas',  component: RecepciondevolucionentrebodegasComponent},
  { path: 'consultadekardex', component: ConsultakardexComponent},
  { path: 'ajustestock', component: AjustestockComponent },
  { path: 'ajustevalores', component: AjustevaloresComponent },
  { path: 'informeajustevalorizados', component: InformeajustesvalorizadosComponent },
  { path: 'ajustedeprecios', component: InformeajustesdepreciosComponent },
  { path: 'bodegas', component: BodegasComponent },
  { path: 'fraccionamientoproductos',component: FraccionamientoproductosComponent },
  { path: 'monitorejecutivo',component: MonitorEjecutivoComponent },
  { path: 'versiones',component: VersionesComponent},
  { path: 'librocontrolado',component: LibrocontroladoComponent},
  { path: 'consultalibrocontrolado', component: ConsultalibrocontroladoComponent},
  { path: 'consultarecetasambulatoria', component: ConsultarecetaambulatoriaComponent},
  { path: 'despachocostoservicio', component: DespachocostoservicioComponent},
  { path: 'cierrekardex', component: CierrekardexComponent},
  { path: 'creadispensasolicitudpaciente', component: CreadispensasolicitudpacienteComponent},  
  //**Pruebas */
  { path: 'bodegasprueba', component: BodegaspruebaComponent},
  { path: 'creadispensasolicitudprueba', component: CreadispensasolicitudpruebaComponent},  
  { path: '**', component: NotFoundPAgeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(mi_routas)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
