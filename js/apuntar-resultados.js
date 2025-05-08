jQuery(document).ready(function ($) {    
	
	let division = 'wpforms-3111-field_1';
	let pareja1jug1 = 'wpforms-3111-field_35'; 
	let pareja1jug2 = 'wpforms-3111-field_36'; 
	let pareja2jug1 = 'wpforms-3111-field_37'; 
	let pareja2jug2 = 'wpforms-3111-field_38';
	let juegosset1pareja1 = 'wpforms-3111-field_27';
	let juegosset1pareja2 = 'wpforms-3111-field_28';	
	let juegosset2pareja1 = 'wpforms-3111-field_29';
	let juegosset2pareja2 = 'wpforms-3111-field_30';	
	let juegosset3pareja1 = 'wpforms-3111-field_31';
	let juegosset3pareja2 = 'wpforms-3111-field_32';
	
    // Función para cargar y procesar el CSV.
    function enviarDatos() {       

		var formData = new URLSearchParams();
		formData.append("division", document.getElementById(division).value);
		formData.append("pareja1jug1", document.getElementById(pareja1jug1).value);
		formData.append("pareja1jug2", document.getElementById(pareja1jug2).value);
		formData.append("pareja2jug1", document.getElementById(pareja2jug1).value);
		formData.append("pareja2jug2", document.getElementById(pareja2jug2).value);
		formData.append("juegosset1pareja1", document.getElementById(juegosset1pareja1).value);
		formData.append("juegosset1pareja2", document.getElementById(juegosset1pareja2).value);
		formData.append("juegosset2pareja1", document.getElementById(juegosset2pareja1).value);
		formData.append("juegosset2pareja2", document.getElementById(juegosset2pareja2).value);
		formData.append("juegosset3pareja1", document.getElementById(juegosset3pareja1).value);
		formData.append("juegosset3pareja2", document.getElementById(juegosset3pareja2).value);
		
		formData.append("google_sheet_id", "1ZX00c_avB5Pjguexc6CeSlqmmKWTSqHiryYZmSYKS18");
		
		var googlescripturl="https://script.google.com/macros/s/AKfycbwpm8q2NpZvuO33EyLAk4ka6O6nCLgLOVzhAfowZFFLNXJ6ow1dqanMEY6p5PaH2uKF/exec"
		console.log("Payload enviado:", formData.toString());                     
		fetch(googlescripturl, { // Reemplaza con tu URL de Google Apps Script
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: formData.toString()
		})
		.then(response => response.text())
		.then(data => {
			console.log("Datos enviados correctamente!");
		})
		.catch(error => {
			console.log("Error al enviar los datos");
		});
    }
	const formResultados = document.getElementById("wpforms-form-3111");
	if (formResultados) {
		document.getElementById("wpforms-form-3111").addEventListener("submit", function(e) {
			e.preventDefault(); // Evita que la página se recargue	
			enviarDatos();
			return false;
		});
	}
    
});
