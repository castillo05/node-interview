
Esta es una api-rest desarrollada con NODEJS, EXPRESSJS, MONGODB

- Ejecutar el comando npm install.
- Configurar el archivo .env para el uso de las varibles de entorno necesarias como las de la base de datos.

Recuerda que si estas en local la URL_BASE es http://localhost:3000/api/ , pero si la quieres probar en producción la URL_BASE es : https://node-interview-2021.herokuapp.com/api/



Estos son los endpoint disponibles:
 - https://node-interview-2021.herokuapp.com/api/getdata  : Esta ruta se encarga de importar los datos de el archivo csv que esta en la carpeta files a MongoDB.
 - https://node-interview-2021.herokuapp.com/api/getdata/distancia?longitud=-3.5884521&latitud=40.365843&distancia=0.072  : Esta ruta se encarga de mostrar datos segun la distancia especificada como parametro ademas de recibir longitud y latitud del punto de partida.
 - https://node-interview-2021.herokuapp.com/api/getdata/filter?habitaciones=2&precioMin=700&precioMax=800  : Esta ruta se encarga de mostrar data segun el filtro especificado como son precio minimo, precio maximo y numero de habitaciones.
 - https://node-interview-2021.herokuapp.com/api/getdata/report?latitud=40.365843&longitud=-3.5884521&distancia=1&tiporeporte=CSV  : Esta ruta se encarga de generar reportes en PDF y CSV segun el filtro que tenemos aplicado como son la longitud y latitud nuestra y la distancia que hay entre nuestra pocison y cada una de las propiedades.
 
## Se recomienda usar postman para testear esta api.

En el caso de ver el reporte PDF se recomienda usar google chrome.
## Desarrollada por Jorge Castillo email: jc@jorgecastillo.pro
