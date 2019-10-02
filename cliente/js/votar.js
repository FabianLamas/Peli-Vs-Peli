$(function() {
	var idCompetencia = getQueryParam("id");
	var competenciasController = new CompetenciasController();
	competenciasController.obtenerOpciones(idCompetencia);
	$(".pelicula").click(function() {
		var voto = $(this).find('.idPelicula').val();
	    competenciasController.votar(idCompetencia, voto);
	});
});
