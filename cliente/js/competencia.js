var server = 'http://0.0.0.0:8080';

function CompetenciasController () {

	this.obtenerCompetencias = function (){
		var self = this;
		$.getJSON(server+"/competencias", function (data) {
				self.cargarCompetencias(data);
		 });
	},

	this.cargarCompetencias = function (data){

		$(".competenciaPlantilla").hide();
		var cantidad = data.length;
		var idColor = 1;
		var idColorCrece = true;
		for (i = 0; i < cantidad; i++) {
			var divCompetencia = $(".competenciaPlantilla").clone().removeClass("competenciaPlantilla");
			$(divCompetencia).find('.link').each( function(){
				$( this ).attr("href",$( this ).attr("href")+data[i].id);
			});
			$(divCompetencia).find('.titulo').text(data[i].nombre);
			$(divCompetencia).find('.card').addClass('color'+idColor);
			
			if (idColorCrece){
				idColor++;
			} else {
				idColor--;
			}

			if (idColor > 4 || idColor < 1) {
				idColor = idColorCrece ? 4 : 1;
				idColorCrece = !idColorCrece;
			}
			$(".competencias").append(divCompetencia);
			$(divCompetencia).show();
		}
	},
	this.obtenerCompetencia =  function (id){
		var self = this;
		var opciones = $.getJSON(server+"/competencias/"+id, function(data) {
	    	self.cargarCompetencia(id, data);
	    });
	},
	this.cargarCompetencia = function (id, data){
		$(".nombre").text(data.nombre);
		$(".nombre").val(data.nombre);
		$(".genero").text(data.genero_nombre);
		$(".actor").text(data.actor_nombre);
		$(".director").text(data.director_nombre);
	},

	this.obtenerOpciones =  function (id){
		var self = this;
		var opciones = $.getJSON(server+"/competencias/"+id+"/peliculas",
	    function(data) {
	    	self.cargarOpciones(id, data);
	    });
	},
	this.cargarOpciones = function (id, opciones){
		$("#nombreCompetencia").text(opciones.competencia);
		for (var i = 0; i < opciones.peliculas.length; i++) {
			var divOpcion = "#opcion"+(i+1);
			$(divOpcion+" .idPelicula").val((opciones.peliculas)[i].id);
			$(divOpcion+" .poster").attr("src",(opciones.peliculas)[i].poster);
			$(divOpcion+" .titulo").text((opciones.peliculas)[i].titulo);
  		}
	},

	this.votar = function (idCompetencia, idPelicula){
		var data = {'idPelicula': idPelicula};
	    $.post(server+"/competencias/"+idCompetencia+"/voto", data, function(response) {
		    window.location.replace("resultados.html?id="+idCompetencia);
		}, 'json');
	},

	this.cargarGeneros = function (){
		$.getJSON(server+"/generos",
			function(data){
		    	$("#genero").empty();
		    	$("#genero").append("<option value='0'>Todos</option>");
		    	for (i = 0; i < data.length; i++) {
		    		$("#genero").append("<option value='"+data[i].id+"'>"+data[i].nombre+"</option>");
		    	}
		    });
	},

	this.cargarDirectores = function (){
		$.getJSON(server+"/directores",
			function(data){
		    	$("#director").empty();
		    	$("#director").append("<option value='0'>Todos/as</option>");
		    	for (i = 0; i < data.length; i++) {
		    		$("#director").append("<option value='"+data[i].id+"'>"+data[i].nombre+"</option>");
		    	}
		    });
	},
	this.cargarActores = function (){
		$.getJSON(server+"/actores",
			function(data){
		    	$("#actor").empty();
		    	$("#actor").append("<option value='0'>Todos/as</option>");
		    	for (i = 0; i < data.length; i++) {
		    		$("#actor").append("<option value='"+data[i].id+"'>"+data[i].nombre+"</option>");
		    	}
		    });
	},
	this.obtenerResultados =  function (id){
		var self = this;
		var opciones = $.getJSON(server+"/competencias/"+id+"/resultados",
	    function(data) {
	    	self.cargarResultados(id, data);
	    });
	},
	this.cargarResultados =  function (id, data){
		$("#nombreCompetencia").text(data.competencia);
		for (var i = 0; i < data.resultados.length; i++) {
			var divResultado = "#puesto"+(i+1);
			$(divResultado+" .idPelicula").val((data.resultados)[i].pelicula_id);
			$(divResultado+" .poster").attr("src",(data.resultados)[i].poster);
			$(divResultado+" .titulo").text((data.resultados)[i].titulo);
			var votoOVotos = ((data.resultados)[i].votos > 1 ) ? 'VOTOS' : 'VOTO';
			$(divResultado+" .votos").text((data.resultados)[i].votos + ' ' + votoOVotos);
  	}
		for(i; i < 3; i++){
			var divResultado = "#puesto"+(i+1);
			$(divResultado).hide();
		}

	}
};
