jQuery(document).ready(function ($) {
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSsSc_sZQSKWGvTChV2O-_-kgNL3i-7oz6AzMX7oXVu4eghSgFlScUQ-JrgYTJa1CyhMZUsDAaYVCE4/pub?gid=1115267949&single=true&output=csv';

    // Inicializar el objeto divisiones.
    let divisiones = {
		 "1ª División": [
			{ nombrePareja: "Ninguna", nombre1: "", nombre2: "" }
		],
		"2ª División": [
			{ nombrePareja: "Ninguna", nombre1: "", nombre2: "" }
		],
		"3ª División": [
			{ nombrePareja: "Ninguna", nombre1: "", nombre2: "" }
		],
		"4ª División": [
			{ nombrePareja: "Ninguna", nombre1: "", nombre2: "" }
		],
		"5ª División": [
			{ nombrePareja: "Ninguna", nombre1: "", nombre2: "" }
		],
		"6ª División": [
			{ nombrePareja: "Ninguna", nombre1: "", nombre2: "" }
		],
		"7ª División": [
			{ nombrePareja: "Ninguna", nombre1: "", nombre2: "" }
		],
		"8ª División": [
			{ nombrePareja: "Ninguna", nombre1: "", nombre2: "" }
		],
		"9ª División": [
			{ nombrePareja: "Ninguna", nombre1: "", nombre2: "" }
		],
		"10ª División": [
			{ nombrePareja: "Ninguna", nombre1: "", nombre2: "" }
		],
		"11ª División": [
			{ nombrePareja: "Ninguna", nombre1: "", nombre2: "" }
		],
		"12ª División": [
			{ nombrePareja: "Ninguna", nombre1: "", nombre2: "" }
		]
	};
	let wp_form_field = '#wpforms-2684-field_';
	let id_campo_division = '1';
	let id_pareja1 = '4';
	let id_jugador1pareja1 = '35'; 
	let id_jugador2pareja1 = '36'; 
	let id_pareja2 = '8';
	let id_jugador1pareja2 = '37'; 
	let id_jugador2pareja2 = '38';	
	
    // Función para cargar y procesar el CSV.
    function cargarJugadoresCSV(url) {
        $.get(url, function (data) {
            const rows = data.split('\n'); // Dividir las filas del CSV.
            const headers = rows[0].split(','); // Obtener los encabezados (primera fila).

            // Procesar las filas (omitimos la primera que contiene los encabezados).
            rows.slice(1).forEach((row) => {
                const columns = row.split(','); // Dividir columnas por comas.
                const division = columns[0].trim(); // Primera columna: División.
                const jugador1 = columns[1].trim(); // Segunda columna: Jugador1.
                const jugador2 = columns[2].trim(); // Tercera columna: Jugador2.

                // Si la división no existe en el objeto, inicialízala como un array.
                if (!divisiones[division]) {
                    divisiones[division] = [];
                }

                // Agregar la pareja al array de la división.
                divisiones[division].push({
                    nombrePareja: `${jugador1} - ${jugador2}`,
                    nombre1: jugador1,
                    nombre2: jugador2,
                });
            });

            // Comprobación: Mostrar el objeto divisiones en consola.
            console.log('Objeto divisiones:', divisiones);

            // Configurar eventos una vez que los datos estén cargados.
            configurarEventos();
        }).fail(function () {
            console.error('No se pudieron cargar los datos desde el CSV.');
        });
    }

    // Función para configurar los eventos.
    function configurarEventos() {
        // Manejar el evento de cambio en el campo de División.
        $(wp_form_field+id_campo_division).on('change', function () {
            var division = $(this).val(); // Obtén la división seleccionada.
            var pareja1 = $(wp_form_field+id_pareja1);
            var jugador1pareja1 = $(wp_form_field+id_jugador1pareja1);
            var jugador2pareja1 = $(wp_form_field+id_jugador2pareja1);
			
			var pareja2 = $(wp_form_field+id_pareja2);
            var jugador1pareja2 = $(wp_form_field+id_jugador1pareja2);
            var jugador2pareja2 = $(wp_form_field+id_jugador2pareja2);
			
            pareja1.empty(); // Limpia las opciones anteriores.
            jugador1pareja1.val('');
            jugador2pareja1.val('');

            pareja2.empty(); // Limpia las opciones anteriores.
            jugador1pareja2.val('');
            jugador2pareja2.val('');
			
            // Verificar si la división tiene parejas definidas.
            if (divisiones[division]) {
                // Recorrer el array de parejas y agregarlas como opciones.
                divisiones[division].forEach(function (pareja) {
                    const optionText = `${pareja.nombrePareja}`;
                    pareja1.append($('<option>', { value: pareja.nombrePareja, text: optionText }));
					pareja2.append($('<option>', { value: pareja.nombrePareja, text: optionText }));
                });
            } else {
                // Si no hay parejas, muestra un mensaje.
                pareja1.append($('<option>', { value: '', text: 'No hay parejas disponibles para esta división' }));
				pareja2.append($('<option>', { value: '', text: 'No hay parejas disponibles para esta división' }));
            }
        });

        // Manejar el cambio en el combo de Parejas 1.
        $(wp_form_field+id_pareja1).on('change', function () {
            var division = $(wp_form_field+id_campo_division).val(); // Obtén la división seleccionada.
            var pareja1Seleccionada = $(this).val();
            var jugador1pareja1 = $(wp_form_field+id_jugador1pareja1);
            var jugador2pareja1 = $(wp_form_field+id_jugador2pareja1);

            jugador1pareja1.val('');
            jugador2pareja1.val('');
            //jugador1pareja1.prop('readonly', true);
            //jugador2pareja1.prop('readonly', true);

            // Buscar la pareja seleccionada dentro de la división actual.
            if (divisiones[division]) {
                var pareja = divisiones[division].find(function (p) {
                    return p.nombrePareja === pareja1Seleccionada;
                });

                // Actualizar los campos de jugadores.
                if (pareja) {
                    jugador1pareja1.val(pareja.nombre1); // Campo del Jugador 1.
                    jugador2pareja1.val(pareja.nombre2); // Campo del Jugador 2.
                }
            }
        });
		
        // Manejar el cambio en el combo de Parejas 2.
        $(wp_form_field+id_pareja2).on('change', function () {
            var division = $(wp_form_field+id_campo_division).val(); // Obtén la división seleccionada.
            var pareja2Seleccionada = $(this).val();
            var jugador1pareja2 = $(wp_form_field+id_jugador1pareja2);
            var jugador2pareja2 = $(wp_form_field+id_jugador2pareja2);

            jugador1pareja2.val('');
            jugador2pareja2.val('');
            //jugador1pareja2.prop('readonly', true);
            //jugador2pareja2.prop('readonly', true);

            // Buscar la pareja seleccionada dentro de la división actual.
            if (divisiones[division]) {
                var pareja = divisiones[division].find(function (p) {
                    return p.nombrePareja === pareja2Seleccionada;
                });

                // Actualizar los campos de jugadores.
                if (pareja) {
                    jugador1pareja2.val(pareja.nombre1); // Campo del Jugador 1.
                    jugador2pareja2.val(pareja.nombre2); // Campo del Jugador 2.
                }
            }
        });
    }

    // Llamar a la función para cargar datos.
    cargarJugadoresCSV(SHEET_URL);
});
