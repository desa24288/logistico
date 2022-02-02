
export const environment = {
  production: false, /*el código de firebaseConfig se copia de la página de firebase según
  los datos que se crean cuando se crea un nuevo proyecto en dicha página */

  URLServiciosRest: {
    fechaVersion: "21.08.29.1",
    fechaVersionGo: "21.08.20.1",
    fechaVersionAngular: "21.08.29.1",
       // ambiente: "DESARROLLO",
    ambiente: "TESTING",
    // ambiente: "PRODUCCION",

    //IP.  logistico ambiente LOCALHOST
    // URLConexionPublica : "http://localhost:8091",
    // URLValidatePublica : "http://localhost:8092", //TOKEN
    // URLConexionPrivada : "http://localhost:8091",
    // URLValidatePrivada : "http://localhost:8092", //TOKEN

    //IP.  logistico ambiente DESARROLLO
    //  URLConexionPublica : "http://10.153.106.88:8091",
    //  URLValidatePublica : "http://10.153.106.88:8092", //TOKEN
    //  URLConexionPrivada : "http://10.153.106.88:8091",
    //  URLValidatePrivada : "http://10.153.106.88:8092", //TOKEN

    // // IP. logisticoQA ambiente QA-SONDASALUD
    URLConexionPublica : "http://198.41.33.200:8091",
    URLValidatePublica : "http://198.41.33.200:8092", //TOKEN
    URLConexionPrivada : "http://10.188.182.77:8091",
    URLValidatePrivada : "http://10.188.182.77:8092", //TOKEN

    // ****************  PRODUCCION **********************
    //IP.  logistico-publica ambiente PRODUCCIÓN-FUSAT / http://198.41.33.191/
    // URLConexionPublica : "http://198.41.33.191:8091",
    // URLValidatePublica : "http://198.41.33.191:8092", //TOKEN
    // URLConexionPrivada : "http://10.188.185.10:8091",
    // URLValidatePrivada : "http://10.188.185.10:8092", //TOKEN
 
    },
  privilegios: {
    privilegio: null,
    usuario: null,
    holding: null,
    empresa: null,
    sucursal: null
  },

};


