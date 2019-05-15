var con = require('./conexionbd');

function cargarCompetencias(req, res){
    var sql = "SELECT id, nombre from competicion";

    con.query(sql, function(error, respuesta, fields){
      if(error){
        console.log("hubo un error en la consulta 1", error.message);
        return res.status(404).send("Hubo un error en la consulta 1");
      }
      res.send(JSON.stringify(respuesta));
    });
}

function competenciaQuery(data) {
  var sql = "SELECT pelicula.id, pelicula.titulo, pelicula.poster FROM pelicula JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id JOIN actor on actor_pelicula.actor_id = actor.id JOIN director_pelicula dp ON dp.pelicula_id = pelicula.id";

  var params = false;

  if (data.genero_id) {
    sql = sql.concat(" WHERE genero_id =" + data.genero_id);
    params = true;
  }

  if (data.actor_id) {
    if (params) {
      sql = sql.concat(" AND");
    } else {
      sql = sql.concat(" WHERE");
    }
    sql = sql.concat(" actor_id =" + data.actor_id);
    params = true;
  }
  
  if (data.director) {
    if (params) {
      sql = sql.concat(" AND");
    } else {
      sql = sql.concat(" WHERE");
    }
    sql = sql.concat(" dp.director_ID =" + data.director);
    params = true;
  }
  sql = sql.concat(" ORDER BY rand() LIMIT 2;");
  return sql;
}

function cargarOpciones(id, res) {
  var sql = "SELECT * FROM competicion WHERE id =" + id + ";";

  con.query(sql, function(error, respuesta, fields) {
    if(error){
      console.log("hubo un error en la consulta 2", error.message);
      return res.status(404).send("Hubo un error en la consulta 2");
    }

    if (respuesta.length > 0) {
      var sqlOpciones = competenciaQuery(respuesta[0]);
      console.log(sqlOpciones);
      

      con.query(sqlOpciones, function(error, respuestaPelicula, fields) {
        if(error){
          console.log("hubo un error en la consulta 3", error.message);
          return res.status(404).send("Hubo un error en la consulta 3");
        }

        var response = {
          competencia: respuesta[0].nombre,
          peliculas: respuestaPelicula
        };
        res.send(JSON.stringify(response));
      });
    } else {
      return res.status(404).json("No se pudo cargar la competencia");
    }
  });
}

function cargarVotos(req, res) {
  var sqlChequearPelicula = "SELECT * FROM pelicula where id =" + req.body.idPelicula + ";";
  
  con.query(sqlChequearPelicula, function(error, respuesta, fields) {
    if(error){
      console.log("hubo un error en la consulta 4", error.message);
      return res.status(404).send("Hubo un error en la consulta 4");
    }

    if (respuesta) {
      var sqlChequearCompetencia = "SELECT * FROM competicion where id =" + req.params.id + ";";
      
      con.query(sqlChequearCompetencia, function(error, response, fields) {
        if(error){
          console.log("hubo un error en la consulta 5", error.message);
          return res.status(404).send("Hubo un error en la consulta 5");
        }

        if (response) {
          var sqlchequearVoto = "SELECT * FROM votos where competencia_id=" + req.params.id + " AND pelicula_id=" + req.body.idPelicula + ";";
          
          con.query(sqlchequearVoto, function(error, respVerifVoto, fields) {
            if(error){
              console.log("hubo un error en la consulta 6", error.message);
              return res.status(404).send("Hubo un error en la consulta 6");
            }

            if (respVerifVoto.length > 0) {
              var sqlVoto = "UPDATE votos SET cantidad = cantidad +1 where competencia_id=" + req.params.id + " AND pelicula_id=" + req.body.idPelicula + ";";
              
              con.query(sqlVoto, function(error, respuestaVoto, fields) {
                if(error){
                  console.log("hubo un error en la consulta 7", error.message);
                  return res.status(404).send("Hubo un error en la consulta 7");
                }
                console.log(respuestaVoto);
                
                res.status(200).json("Voto agregado");
              });
            } else {
              var sqlVoto = "INSERT INTO votos (competencia_id, pelicula_id, cantidad) values(+" + req.params.id + ", " + req.body.idPelicula + ", 1);";
              
              con.query(sqlVoto, function(error, respuestaVoto, fields) {
                if(error){
                  console.log("hubo un error en la consulta 8", error.message);
                  return res.status(404).send("Hubo un error en la consulta 8");
                }
                console.log(respuestaVoto);
                
                res.status(200).json("Voto contado");
              });
            }
          });
        } else {
          return res.status(404).json("No se encontro ninguna competencia");
        }
      });
    } else {
      return res.status(404).json("No se encontro ninguna pelicula");
    }
  });
}

function cargarResultados(req, res) {
  var sql = "SELECT p.*, count(*) AS votos FROM pelicula AS p INNER JOIN votos AS v ON p.id = v.pelicula_id INNER JOIN competicion AS c" +
  " ON v.competencia_id = c.id WHERE c.id = ? GROUP BY p.id ORDER BY count(*) DESC LIMIT 3;";
  
  con.query(sql, [req.params.id], (error, respuesta, fields) => {
    if(error){
      console.log("hubo un error en la consulta 9", error.message);
      return res.status(404).send("Hubo un error en la consulta 9");
    }

    if(respuesta){
      var listaPeliculas = [];

      for (var i in respuesta) {
          var pelicula = {
              id: respuesta[i].id,
              poster: respuesta[i].poster,
              titulo: respuesta[i].titulo,
              votos: respuesta[i].votos
          }
          listaPeliculas.push(pelicula);
      }

      var response = {
          resultados: listaPeliculas
      }

      res.send(JSON.stringify(response));
    }else {
      return res.status(404).json("No se encontro la competencia");
    }
  });
}

function crearNuevaCompetenica(params, res){

  var sql = "SELECT * FROM competicion WHERE nombre = ?";

  con.query(sql, params.nombre, (error, respuesta, fields) => {
    if(error){
      console.log("hubo un error en la consulta 10", error.message);
      return res.status(404).send("Hubo un error en la consulta 10");
    }
    if (respuesta.length !== 0) {
        res.status(422).send("La competencia que desea cargar ya existe");
        return;
    }
  });

  var query = 'INSERT INTO competicion (nombre, genero_id, actor_id, director) VALUES ("' + params.nombre + '"';
  //var query = "INSERT INTO competicion (nombre, genero_id, actor_id, director) VALUES ('" + params.nombre + "', NULL , NULL , NULL)";
  if (params.genero != 0) {
      query += ' , ' + params.genero;
  } else{
      query += ' , NULL';
  }

  if (params.actor != 0) {
      query += ' , ' + params.actor;
  } else{
      query += ' , NULL';
  }

  if (params.director != 0) {
    query += ' , ' + params.director;
  } else{
    query += ' , NULL';
  }

  query += ')';
  
  con.query(query, (error, response) => {
    if (error) {
      console.log("hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    console.log(response);
    res.status(200).send('Competencia creada');
  });
}

function reiniciaCompetencia(req, res) {
  var sqlCompeticion = 'SELECT * FROM competicion WHERE id = ? ';

  con.query(sqlCompeticion, [req.params.id], (error, result, fields) => {
    if (error) {
      console.log("hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    if (result.length === 0) {
        res.status(404).send("Competencia no encontrada");
        return;
    }
  });
  
  var sqlVotos = "DELETE FROM votos WHERE competencia_id = ?";

  con.query(sqlVotos, [req.params.id], (error, result, fields) => {
    if (error) {
      console.log("hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    res.status(200).send('Competencia reiniciada');
  });
}

function cargarGeneros(req, res){
  var sql = "SELECT * FROM genero";
  
  con.query(sql, (error, respuesta, fields) => {
    if (error) {
      console.log("hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }

    var listaGeneros = [];

    for (var i in respuesta) {
        var genero = {
            id: respuesta[i].id,
            nombre: respuesta[i].nombre
        }
        listaGeneros.push(genero);
    }

    res.send(JSON.stringify(listaGeneros));
  });
}

function cargarDirectores(req, res) {
  var sql = "SELECT * FROM director";
  
  con.query(sql, (error, respuesta, fields) => {
    if (error) {
      console.log("hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }

    var listaDirectores = [];

    for (var i in respuesta) {
        var director = {
            id: respuesta[i].id,
            nombre: respuesta[i].nombre
        }
        listaDirectores.push(director);
    }

    res.send(JSON.stringify(listaDirectores));
  });
}

function cargarActores(req, res){
  var sql = "SELECT * FROM actor";
  
  con.query(sql, (error, respuesta, fields) => {
    if (error) {
      console.log("hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }

    var listaActores = [];

    for (var i in respuesta) {
        var actor = {
            id: respuesta[i].id,
            nombre: respuesta[i].nombre
        }
        listaActores.push(actor);
    }

    res.send(JSON.stringify(listaActores));
  });
}

function borrarCompetencia(req, res){
  var sqlVoto = "DELETE FROM votos WHERE competencia_id = ?"

  con.query(sqlVoto, [req.params.id], (error, respuesta, fields) => {
    if (error) {
      console.log("hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }

    var sqlCompeticion = "DELETE FROM competicion WHERE id = ?";
    con.query(sqlCompeticion, [req.params.id], (error, response, fields) => {
      if (error) {
        console.log("hubo un error en la consulta", error.message);
        return res.status(404).send("Hubo un error en la consulta");
      }
      res.status(200).send('Competencia eliminada');
    });
  });
}

function modificarNombreCompetencia(req, res){
  var sqlCompeticion = "SELECT * FROM competicion where id = ?";

  con.query(sqlCompeticion, req.params.id, (error, respuesta, fields) => {
    if (error) {
        console.log("hubo un error en la consulta", error.message);
        return res.status(404).send("Hubo un error en la consulta");
    }
    if (respuesta.length == 0) {
      return res.status(404).json("Competencia no encontrada");
    }
    
    var sqlUpdate = "UPDATE competicion SET nombre = ? WHERE id = ?";
    con.query(sqlUpdate, [req.body.nombre, req.params.id], function(error, response) {
      if (error) {
        console.log("hubo un error en la consulta", error.message);
        return res.status(404).send("Hubo un error en la consulta");
      }
      res.status(200).send('Nombre actualizado!');
    });
  });
}

module.exports = {
  cargarCompetencias: cargarCompetencias,
  cargarOpciones: cargarOpciones,
  cargarVotos: cargarVotos,
  cargarResultados: cargarResultados,
  crearNuevaCompetenica: crearNuevaCompetenica,
  reiniciaCompetencia: reiniciaCompetencia,
  cargarGeneros: cargarGeneros,
  cargarDirectores: cargarDirectores,
  cargarActores: cargarActores,
  borrarCompetencia: borrarCompetencia,
  modificarNombreCompetencia: modificarNombreCompetencia
};
