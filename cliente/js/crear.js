$(function() {
	var competenciasController = new CompetenciasController();
	competenciasController.cargarGeneros();
	competenciasController.cargarDirectores();
	competenciasController.cargarActores();

	$("#formCompetencia").ajaxForm({url: server + '/competencias', type: 'post',
		success: function(res) {
			window.location.replace("./index.html?exito=True");
		},
		error: function(response, status, xhr) {
			if (response.status == 422){
				$("#mensajeDeError").text(response.responseText);
			}
		}
	});
	$(".cancelar").click(function(){
		window.location.replace("./index.html");
	});
});
