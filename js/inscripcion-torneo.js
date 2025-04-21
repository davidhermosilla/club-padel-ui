jQuery(document).ready(function ($) {    
	let id_pareja1 = 'wpforms-3087-field_1';
	let value_pareja1 = '';
	let id_pareja2 = 'wpforms-3087-field_2';
	let value_pareja2 = '';
	let id_categoria = 'wpforms-3087-field_3';
	let value_categoria = '';
	let id_tipojugador1 = 'wpforms-3087-field_4';
	let value_tipojugador1 = '';
	let id_tipojugador2 = 'wpforms-3087-field_5';
	let value_tipojugador2 = '';
	let id_check_viernes_tarde ='wpforms-3087-field_11_1';
	let value_check_viernes_tarde = '';
	let id_check_viernes_noche ='wpforms-3087-field_11_2';
	let value_check_viernes_noche = '';
	let id_check_sabado_manana ='wpforms-3087-field_11_3';
	let value_check_sabado_manana = '';
	let id_check_sabado_tarde ='wpforms-3087-field_11_4';
	let value_check_sabado_tarde = '';
	let id_check_sabado_noche ='wpforms-3087-field_11_5';	
	let value_check_sabado_noche = '';
	let id_correo ='wpforms-3087-field_7';	
	let value_correo = '';
	let id_telefono ='wpforms-3087-field_8';	
	let value_telefono = '';
	
    // Función para cargar y procesar el CSV.
    function enviarDatos() {       

		var formData = new URLSearchParams();
		formData.append("pareja1", document.getElementById(id_pareja1).value);
		formData.append("pareja2", document.getElementById(id_pareja2).value);
		formData.append("categoria", document.getElementById(id_categoria).value);
		formData.append("tipojugador1", document.getElementById(id_tipojugador1).value);
		formData.append("tipojugador2", document.getElementById(id_tipojugador2).value);
		
		let incidencias_concat = [];

		if (document.getElementById(id_check_viernes_tarde).checked) {
			incidencias_concat.push(document.getElementById(id_check_viernes_tarde).value);
		}
		if (document.getElementById(id_check_viernes_noche).checked) {
			incidencias_concat.push(document.getElementById(id_check_viernes_noche).value);
		}
		if (document.getElementById(id_check_sabado_manana).checked) {
			incidencias_concat.push(document.getElementById(id_check_sabado_manana).value);
		}
		if (document.getElementById(id_check_sabado_tarde).checked) {
			incidencias_concat.push(document.getElementById(id_check_sabado_tarde).value);
		}
		if (document.getElementById(id_check_sabado_noche).checked) {
			incidencias_concat.push(document.getElementById(id_check_sabado_noche).value);
		}

		if (incidencias_concat.length > 0) {
			formData.append("incidencias", incidencias_concat.join(","));
		}
		formData.append("correo", document.getElementById(id_correo).value);
		formData.append("telefono", document.getElementById(id_telefono).value);
		formData.append("google_sheet_id", "1vJeQycrbLbe3BgeIN2JII91bIkCQ21pmZ7e5BEwxnLU");
		
		var googlescripturl="https://script.google.com/macros/s/AKfycbz_MmzfrphqE93oG13dhczQoK5GUCGTaZM7vFnQO-2ma1FQGF9OqmAHoZNcXvSlKxoE/exec"
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

	document.getElementById("wpforms-form-3087").addEventListener("submit", function(e) {
        e.preventDefault(); // Evita que la página se recargue	
		enviarDatos();
	});
    
});
