export const ALERTAS_CONFIG = {
  beck: {
    diasAvisoProximaAccion: 3,
    diasSinSeguimiento: 7,
    diasPropuestaEnviadaSinSeguimiento: 7,
    diasCotizacionEnviadaSinSeguimiento: 7,
    diasDesarrolloPropuesta: 14,
    diasDocumentacionPendiente: 5,
    diasAvisoReactivacion: 3,
    montoAltoClp: 50000000,
    diasAltoMontoDetenida: 7,
  },
  firemat: {
    diasAvisoProximaAccion: 3,
    diasSinSeguimiento: 7,
    diasCotizacionEnviadaSinSeguimiento: 7,
    diasDesarrolloCotizacion: 14,
    diasDocumentacionPendiente: 5,
    diasAvisoReactivacion: 3,
    montoAltoClp: 5000000,
    diasAltoMontoDetenida: 7,
  },
} as const;
