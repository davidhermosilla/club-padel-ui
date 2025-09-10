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
	let esPartidoNoJugado = 'wpforms-3111-field_39'; // campo hidden
	let catchap = "wpforms-3111-field_34";

	// Crear e insertar el spinner dinámicamente
	const spinner = $(`
		<div id="spinner" style="display:none; text-align:center; margin-top:20px;">
			<img src="https://i.imgur.com/llF5iyg.gif" alt="Cargando..." width="40" />
			<p>Enviando resultados...</p>
		</div>
	`);
	$('body').append(spinner);

	function mostrarSpinner() {
		$('#spinner').show();
		$('#wpforms-submit-3111').prop('disabled', true);
	}

	function ocultarSpinner() {
		$('#spinner').hide();
		$('#wpforms-submit-3111').prop('disabled', false);
	}

	function verificarPartidoNoJugado(callback) {
		const s1p1 = parseInt(document.getElementById(juegosset1pareja1).value) || 0;
		const s1p2 = parseInt(document.getElementById(juegosset1pareja2).value) || 0;
		const s2p1 = parseInt(document.getElementById(juegosset2pareja1).value) || 0;
		const s2p2 = parseInt(document.getElementById(juegosset2pareja2).value) || 0;

		const es60_60 = (s1p1 === 6 && s1p2 === 0 && s2p1 === 6 && s2p2 === 0);
		const es06_06 = (s1p1 === 0 && s1p2 === 6 && s2p1 === 0 && s2p2 === 6);

		if (es60_60 || es06_06) {
			// Crear modal si no existe
			if (!document.getElementById("modalConfirmacion")) {
				const modalHtml = `
					<div id="modalConfirmacion" style="
						position: fixed;
						top: 0; left: 0; right: 0; bottom: 0;
						background: rgba(0,0,0,0.5);
						display: flex;
						align-items: center;
						justify-content: center;
						z-index: 9999;">
						<div style="background: white; padding: 20px; border-radius: 8px; max-width: 300px; text-align: center;">
							<p>¿Este resultado 6-0, 6-0 es por victoria administrativa (partido no jugado)?</p>
							<button id="btnSi">Sí</button>
							<button id="btnNo">No</button>
						</div>
					</div>`;
				document.body.insertAdjacentHTML("beforeend", modalHtml);
			}

			// Mostrar modal
			const modal = document.getElementById("modalConfirmacion");
			modal.style.display = "flex";

			document.getElementById("btnSi").onclick = () => {
				document.getElementById(esPartidoNoJugado).value = "true";
				modal.remove();
				callback();
			};
			document.getElementById("btnNo").onclick = () => {
				document.getElementById(esPartidoNoJugado).value = "false";
				modal.remove();
				callback();
			};
		} else {
			document.getElementById(esPartidoNoJugado).value = "false";
			callback();
		}
	}


	// Detectar al rellenar el captcha
	//document.getElementById(catchap).addEventListener("change", verificarPartidoNoJugado);

	function enviarDatos() {
		mostrarSpinner();

		const formData = new URLSearchParams();
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
		formData.append("esPartidoNoJugado", document.getElementById(esPartidoNoJugado).value);
		formData.append("google_sheet_id", "1ZX00c_avB5Pjguexc6CeSlqmmKWTSqHiryYZmSYKS18");

		const googlescripturl = "https://script.google.com/macros/s/AKfycbzh2-SQ-TnCXJf5g3o0xysncBChJsa7nqCkmq_fCmdydbzz14aTKM3rBtrv0JMkrShQ/exec";

		fetch(googlescripturl, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: formData.toString()
		})
		.then(response => response.text())
		.then(data => {
			console.log("Datos enviados correctamente!");
			window.location.href = "https://clubpadelandujar.com/resultados-super-liga/";
		})
		.catch(error => {
			console.error("Error al enviar los datos", error);
			ocultarSpinner();
			alert("Error al enviar los datos. Inténtalo de nuevo.");
		});
	}

	const formResultados = document.getElementById("wpforms-form-3111");
	if (formResultados) {
		formResultados.addEventListener("submit", function(e) {
			e.preventDefault();
			e.stopImmediatePropagation(); 
			verificarPartidoNoJugado(enviarDatos);
			return false;
		}, true);
	}
});
