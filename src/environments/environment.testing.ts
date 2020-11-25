// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false, /*el código de firebaseConfig se copia de la página de firebase según 
    los datos que se crean cuando se crea un nuevo proyecto en dicha página */
  
    URLServiciosRest:{
      URLConexionSolicitudConsumo: "http://198.41.33.191:8093",
      URLConexion:  "http://198.41.33.191:8091",   
      URLConexionInformes: "http://198.41.33.191:8092",
      ambiente:"TESTING",
   },

  };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.
  