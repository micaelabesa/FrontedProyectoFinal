Para efectuar esta API paso a paso documentaremos los steps:

1. Verificar congiguracion en app.config.ts es decir providerHttpClient()
   WithComponentInputBinding() ✅
2. Bootstrap instalado correctamente✅
3. Enlazamos backend y comenzamos a "traer" la informacion.:
   1- Haremos primero rutas que no requieran autenticacion :

   ## Base_url = https://upgradehubfinalproject-production.up.railway.app/docs

   ## Metodo GET PLATOS : https://upgradehubfinalproject-production.up.railway.app/platos/platos

   ## RESPONSE = array de objetos platos

   -creo el servicio = $ ng generate service services/Platos --skip-tests✅
   -Creo la interfaz de Iplatos✅
   -En el servicio ejecuto el metodo GET con la ruta indicada .✅
   -creo la pagina platos que es donde se veran todos mis platos ng g component pages/Lista plaatos --skip-tests✅
   -voy a routes y agrego el path✅
   -injecTo el servicio en el ts del listplatos y la funcion en ng on init para que se cargue siempre.✅
   -cojo de bootstrap un carousel de imagenes y la adapto para que podamos ver los platos.y agrego un boton de ver plato para que se pueda ver debajo el clicado.✅
   -aplico la funcion al carusel para que si se acaban las imagenes vuelva a la 1✅
   -voy al boton de la navbar y engncho mi pagina con routerlink al boton .✅

   -crear grid para que se vea cada imagen y que se abra la descripcion abajo de la card completa con todo lo que tiene :
   id: number;
   categoria: string // "entrante" | "sashimi" | "nigiri" | "maki" | "bao" |"postre"
   nombre: string;
   descripcion: string;
   precio: number;
   ingredientes: string;
   alergenos: string;
   info_nutricional: string;
   imagen_url: string;
   activo: number;✅ ( se podria complicar mas haciendo un componente y que cuando se clique la imagen vayan apareciendo las cards? o lo dejamos asi ? )

   ## METODO GET MENUES : https://upgradehubfinalproject-production.up.railway.app/menus-semanales/

   ## RESPONSE = array de objetos type IMenu

   -creo el servicio = $ng generate service Services/Menus --skip-tests ✅
   -Creo la interfaz de IMenus ✅
   -En el servicio ejecuto el metodo GET con la ruta indicada .✅
   -creo la pagina platos que es donde se veran todos mis MNUES ng g component pages/MENU --skip-tests✅
   -voy a routes y agrego el path✅
   -Injecto el servicio en el ts de menu y los coloco dentro de la OnInit, conecto el boton de la home con esto  ✅
   -creo un componente para que cuando clique cada card vaya a ver el menu con mas especificaciones : 
   $ng g c Components/card-menu --skip-tests✅
   -creo la interfa imenudetalle - aprovecho la de platos que ya tenia.
   -creo un signal de tipo i menu detalle en el componente
   -itero en el htm con @if
   - en el compoente padre (mi pagina menus) tengo que poner el menuSeleccionado = signal<IMenuDetalle | null>(null); Y LA FUNCION
     -En el servive menu grego el :

## METODO GET MENUES por id pra ver detalle - 'https://upgradehubfinalproject-production.up.railway.app/menus-semanales/1' \✅

## RESPONSE = type IMenuDetale

-Formulario de Regstro :
-html ✅ ts con validaciones ✅
-servicio usuarios inhecto la ruta post de auth register :

### METODO POST https://upgradehubfinalproject-production.up.railway.app/docs#/auth/register_auth_register_post

### RESPONSE : {

"nombre": "string",
"apellido": "string",
"dni": "string",
"email": "user@example.com",
"password": "string",
"telefono": "string",
"edad": 0,
"alergias": "string",
"rol": "cliente"
}
OBJETO DE TIPO IUsuario ( lo creo)

- he comentado lo de fecha de nacimiento porque no pusimos ese campo en el backend y en cambi si pusimo edad

### METODO LOGIN /auth/login

### RESPONSE : TYPE = LoginResponse

{
"msg": "Login correcto",
"Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwibm9tYnJlIjoiTWF0aWFzIiwicm9sIjoiY2xpZW50ZSIsImV4cCI6MTc3MDY0NDg2Mn0.Cum8K6MqzLlDJ5cAaT_4iI3EMNOHLACcHDJLk8COJ0k",
"user": {
"id": 6,
"nombre": "Matias",
"apellido": "Haro",
"email": "user@example.com",
"telefono": "630726647",
"edad": 38,
"alergias": "nada",
"rol": "cliente"
}
}

Creamos en IUsuarios las interfaces de Loginregistro y response
export interface ILogin {
email: string;
password: string;
}

export interface LoginResponse {
msg: string;
token: string;
item: IUsuario;
}

creamos la pagina de login y creamos $ ng generate interceptor interceptors/Auth --skip-tests
-En el app.config.ts hay que onfigurar el interceptor:
export const authInterceptor: HttpInterceptorFn = (req, next) => {

const token = localStorage.getItem('token');

if (token) {
const reqClone = req.clone({
setHeaders: {
Authorization: token,
},
});
return next(reqClone);
}

return next(req);
};

### CREAMOS LOS GUARD// BLOUEAN EL ACCESO A CIERTAS PAGINAS SI NO SE CUMPPLEN CIERTAS CONDCIONES

ng generate guard guards/Auth --skip-tests y les ponemos los guards a las rutas pedidos/admin/reservas

## resumen conexiones con backend:

### GET ALL MENUES ( MENU_SEMANAL ) PUBLIC ✅

### GET MENUBYID ( MENU_SEMANAL ) PUBLIC ✅

### GET ALL PLATOS (PLATOS) PUBLIC- SIRVE PARA HACER PEDIDOS SI QUEREMOS PEOR NO ES LO QUE PIDE EL ENUNCIADO - EL ENUNCIADO ES UE VEAMOS 7 OPCIONES DE MENU✅

### POST REGISTER - OK FUNCIONA EL FORMULARIO ✅

## FALTA:

### POST CREAR MENU == LOGUEADO COMO ADMIN ❌

### PUT MODIFICAR MENU == LOGUEADO COMO ADMIN❌

### DELETE MENU == LOGUEADO COMO ADMIN❌

### RESERVAS LOGUEADO COMO CLIENTE✅

### LOGIN -OK ✅

Realice varios cambios a todos los <a href="#"> que me fui encontrando, más que nada para usar los routerLink!. En angular nos han dicho que no los usemos así, sustituirlos por button. En todo el nav-bar por ejemplo.
Preguntar si es correcto usarlo al menos para redes sociales ?
