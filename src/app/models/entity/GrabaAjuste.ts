export class GrabaAjuste{
    constructor (

      public iddetalleinven ?: number,
      public idinventario   ?: number, //campo numero oc
      public idmeinid       ?: number,
      public codigomein     ?: string,
      public ajusteinvent   ?: number, //campo docto a ingresar
      public stockinvent    ?: number,
      public conteomanual   ?: number, // precio docto ( valor de la grlla)
      public productodesc   ?: string,
      public valorcosto     ?: number,
      public bodegainv      ?: number,
      public responsable    ?: string,
      public tipomotivoajus ?: number,
      public estadoajuste   ?: string,
      public servidor       ?: string
    ) {}
}