const express = require('express');

const db = require('./db');

const bodyParser = require('body-parser');

const app = express();

const path = require('path');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Archivos Static (CSS,IMG,JS)
app.use(express.static(path.join(__dirname, 'public')));

//Inicializar servidor

app.listen(3000, () => {
    console.log("Se conecto al puerto");
});


app.get('/', (req, res) => {
    res.render("PaginaPrincipal.html");
});

app.get('/BatallaPokemon', (req, res) => {
    res.render("batalla_pokemon.html");
});

app.get('/CambiarPerfil', (req, res) => {
    res.render("Cambiar_perfil.html");
});

app.get('/CambiarContrasena', (req, res) => {
    res.render("cambiarContraseña.html");
});

app.get('/ElegirEquipo', (req, res) => {
    res.render("elegirEquipo.html");
});

app.get('/EquipoPokemon', (req, res) => {
    res.render("EquipoPokemon.html");
});

app.get('/GenerarReportes', (req, res) => {
    res.render("GenerarReportes.html");
});


app.get('/HistorialEquipos/:nombreUsuario', async function (request, response) {
    const {obtenerHistorialEquipo} = require('../services/ServicioHistorialEquipos');
    const datos = await obtenerHistorialEquipo(request.params.nombreUsuario);
    response.render("historial_Equipos", {datos});
});

app.get('/HistorialPartidas', (req, res) => {
    res.render("Historial_partidas.html");
});

app.get('/HistorialPokemon/:nombreUsuario', async function (request, response) {
    const {obtenerHistorialPokemon} = require('../services/ServicioHistorialPokemon');
    const datos = await obtenerHistorialPokemon(request.params.nombreUsuario);
    response.render("historialPokemon", {datos});
});

app.get('/InicioSesion', (req, res) => {
    res.render("inicioSesion.html");
});

app.get('/JugarUnaPartida', (req, res) => {
    res.render("jugar_una_partida.html");
});

app.get('/ListaPokemon', (req, res) => {
    res.render("Lista_pokemon.html");
});

app.get('/NuevoEquipo', (req, res) => {
    res.render("NuevoEquipo.html");
});

app.get('/LandingPageEquipo', (req, res) => {
    res.render("page_equipo.html");
});

app.get('/LandingPageProducto', (req, res) => {
    res.render("paginabase.html");
});

app.get('/Registro', (req, res) => {
    res.render("Registro.html");
});

//Tabla de liderazgo GET
app.get("/TablaLiderazgo", async function (request, response) {
    const { obtenerTablaLiderazgo } = require('../services/ServicioBatalla');
    const datos = await obtenerTablaLiderazgo();
    response.render('TablaLiderazgo', { datos });
});

//Victorias y Derrotas GET
app.get('/VictoriasYDerrotas/:nombreUsuario', async function (request, response) {
    const {obtenerVictoriasYDerrotas} = require('../services/ServicioVictoriasYDerrotas');
    const datos = await obtenerVictoriasYDerrotas(request.params.nombreUsuario);
    response.render('victorias_derrotas', { datos });
});

app.get('/Batalla', (req, res) => {
    res.render("batalla.html");
});



// Nuevo Equipo POST
app.post('/guardarEquipo', async function (request, response) {
    const {agregarEquipo} = require('../services/ServicioEquipo');
    const { nombreEquipo, listaPokemon, nombreUsuario } = request.body;
    const resultado = await agregarEquipo(nombreEquipo, listaPokemon, nombreUsuario);
    response.send(resultado);
});

 
//Registro POST 
app.post('/Registro', async function (request, response)  {
    const { agregarRegistro } = require('../services/ServicioUsuario');
    const { nombre, nombreUsuario, primerApellido, segundoApellido, correo, identificacion, contrasena } = request.body;
    const resultado = await agregarRegistro(nombre, nombreUsuario, primerApellido, segundoApellido, correo, identificacion, contrasena);
    response.redirect('/');
   
});


//Inicio sesion POST
app.post('/InicioSesion', async function (request, response){
    const { validarUsuario } = require('../services/ServicioUsuario')
    const { correo, contrasena } = request.body; 
    const redireccion = await validarUsuario(correo, contrasena);
    response.redirect(redireccion); 
});



app.post('/guardarbatalla', async function (request, response) {
    const {terminarBatalla} = require('./public/js/batalla');
    const {idBatalla,Usuario1,Equipo1,Usuario2,Equipo2,UsuarioVencedor} = request.body;
    const resultado = await terminarBatalla(idBatalla,Usuario1,Equipo1,Usuario2,Equipo2,UsuarioVencedor);
    response.send(resultado);
});


