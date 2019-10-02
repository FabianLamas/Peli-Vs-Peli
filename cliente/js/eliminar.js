$(function() {
	var idCompetencia = getQueryParam("id");
	var competenciasController = new CompetenciasController();
		competenciasController.obtenerCompetencia(idCompetencia)
	$("#formCompetencia").ajaxForm({url: server + '/competencias/'+idCompetencia, type: 'delete', 
		success: function(res) {
			window.location.replace("./index.html?exito=True");
		},
		error: function(response, status, xhr) {
			$("#mensajeDeError").text(response.responseText);
		}
	});

	$(".cancelar").click(function(){
		window.location.replace("./index.html");
	});
});
