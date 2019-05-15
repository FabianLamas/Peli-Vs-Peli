var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controlador = require('./controlador');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get("/competencias", controlador.cargarCompetencias);
app.get("/competencias/:id/peliculas", function(req, res) {
  var id = req.params.id;
  controlador.cargarOpciones(id, res);
});
app.get("/generos", controlador.cargarGeneros);
app.get("/directores", controlador.cargarDirectores);
app.get("/actores", controlador.cargarActores);
app.post("/competencias/:id/voto", function(req, res) {
  controlador.cargarVotos(req, res);
});
app.get("/competencias/:id/resultados", controlador.cargarResultados);
app.post("/competencias", function(req, res) {
  controlador.crearNuevaCompetenica(req.body, res);
});
app.put("/competencias/:id", controlador.modificarNombreCompetencia);
app.delete("/competencias/:id/votos", controlador.reiniciaCompetencia);
app.delete("/competencias/:id/", controlador.borrarCompetencia);


var puerto = "8080";

app.listen(puerto, function (){
    console.log("Escuchando en el puerto: " + puerto);
});