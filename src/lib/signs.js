// Los ids deben coincidir con SIGN_NODE_NAME en FabLabSign/config.h de
// cada letrero (sin espacios: FirebaseClient arma la peticion HTTP
// pegando la ruta tal cual, un espacio sin escapar rompe la peticion).
// `path` es la URL propia de cada letrero (para el codigo QR de cada uno).
export const SIGNS = [
  { id: 'LETRERO_1', label: 'Letrero 1', labName: 'FabLab', path: '/letrero-1' },
  { id: 'LETRERO_2', label: 'Letrero 2', labName: 'Vinculación con la Sociedad', path: '/letrero-2' },
]
