jQuery(document).ready(function ($) {
  let division = 'wpforms-3111-field_1';
  let pareja1Select = 'wpforms-3111-field_4'; 
  let pareja2Select = 'wpforms-3111-field_8';
  let juegosset1pareja1 = 'wpforms-3111-field_27';
  let juegosset1pareja2 = 'wpforms-3111-field_28';
  let juegosset2pareja1 = 'wpforms-3111-field_29';
  let juegosset2pareja2 = 'wpforms-3111-field_30';
  let juegosset3pareja1 = 'wpforms-3111-field_31';
  let juegosset3pareja2 = 'wpforms-3111-field_32';
  let esPartidoNoJugado = 'wpforms-3111-field_39';
  let ligaHidden = 'wpforms-3111-field_19';
  let ligaSelect = $('<select id="liga-select" style="margin-bottom: 15px;"><option value="">Cargando ligas...</option></select>');
  $('#' + division).before(ligaSelect);

  const spinner = $(
    `<div id="spinner" style="display:none; text-align:center; margin-top:20px;">
      <img src="https://i.imgur.com/llF5iyg.gif" alt="Cargando..." width="40" />
      <p>Enviando resultados...</p>
    </div>`
  );
  $('body').append(spinner);

  function mostrarSpinner() {
    $('#spinner').show();
    $('#wpforms-submit-3111').prop('disabled', true);
  }

  function ocultarSpinner() {
    $('#spinner').hide();
    $('#wpforms-submit-3111').prop('disabled', false);
  }

  function cargarLigasYDivisiones() {
    ligaSelect.off('change');
    $.get({
      url: 'https://club-padel-api-12f28391bbbd.herokuapp.com/ligas',
      headers: { 'Authorization': 'Basic Y2x1YnBhZGVsdXNlcjpjbHVicGFkZWxwYXNz' },
      success: function (ligas) {
        ligaSelect.empty().append('<option value="">Selecciona Liga</option>');
        ligas.forEach(l => {
          const selected = l.current ? 'selected' : '';
          if (l.current) {
            $('#' + ligaHidden).val(l.id);
          }
          ligaSelect.append(`<option value="${l.id}" ${selected}>${l.nombre}</option>`);
        });
        cargarDivisiones();
      }
    });

    ligaSelect.on('change', function () {
      const id = $(this).val();
      $('#' + ligaHidden).val(id);
      cargarDivisiones();
    });
  }

  function cargarDivisiones() {
    const divisionSelect = $('#' + division);
    divisionSelect.off('change');
    divisionSelect.empty().append('<option value="Cargando divisiones..."></option>');

    $.get({
      url: 'https://club-padel-api-12f28391bbbd.herokuapp.com/divisiones',
      headers: { 'Authorization': 'Basic Y2x1YnBhZGVsdXNlcjpjbHVicGFkZWxwYXNz' },
      success: function (divisiones) {
        divisionSelect.empty().append('<option value="">Selecciona División</option>');
        divisiones.forEach(div => {
          divisionSelect.append(`<option value="${div.id}">${div.nombre}</option>`);
        });
      }
    });

    divisionSelect.on('change', function () {
      cargarParejas();
    });
  }

  function cargarParejas() {
    const select1 = $('#' + pareja1Select);
    const select2 = $('#' + pareja2Select);
    const divisionId = parseInt($('#' + division).val());
    const ligaId = parseInt($('#' + ligaHidden).val());

    select1.empty();
    select2.empty();

    if (!divisionId || !ligaId) return;

    $.get({
      url: `https://club-padel-api-12f28391bbbd.herokuapp.com/parejas?division=${divisionId}&liga=${ligaId}`,
      headers: { 'Authorization': 'Basic Y2x1YnBhZGVsdXNlcjpjbHVicGFkZWxwYXNz' },
      success: function (parejas) {
        select1.empty().append('<option value="">Selecciona Pareja 1</option>');
        select2.empty().append('<option value="">Selecciona Pareja 2</option>');
        parejas.forEach(p => {
          const text = `${p.jugador1.nombre} / ${p.jugador2.nombre}`;
          const option = `<option value="${p.parejaId}">${text}</option>`;
          select1.append(option);
          select2.append(option);
        });
      }
    });
  }

  function verificarPartidoNoJugado(callback) {
    const s1p1 = parseInt($('#' + juegosset1pareja1).val()) || 0;
    const s1p2 = parseInt($('#' + juegosset1pareja2).val()) || 0;
    const s2p1 = parseInt($('#' + juegosset2pareja1).val()) || 0;
    const s2p2 = parseInt($('#' + juegosset2pareja2).val()) || 0;

    const es60_60 = (s1p1 === 6 && s1p2 === 0 && s2p1 === 6 && s2p2 === 0);
    const es06_06 = (s1p1 === 0 && s1p2 === 6 && s2p1 === 0 && s2p2 === 6);

    if (es60_60 || es06_06) {
      if (!document.getElementById("modalConfirmacion")) {
        const modalHtml = `
          <div id="modalConfirmacion" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;">
            <div style="background:white;padding:20px;border-radius:8px;max-width:300px;text-align:center;">
              <p>¿Este resultado 6-0, 6-0 es por victoria administrativa (partido no jugado)?</p>
              <button id="btnSi">Sí</button>
              <button id="btnNo">No</button>
            </div>
          </div>`;
        document.body.insertAdjacentHTML("beforeend", modalHtml);
      }

      const modal = document.getElementById("modalConfirmacion");
      modal.style.display = "flex";

      document.getElementById("btnSi").onclick = () => {
        $('#' + esPartidoNoJugado).val("true");
        modal.remove();
        callback();
      };
      document.getElementById("btnNo").onclick = () => {
        $('#' + esPartidoNoJugado).val("false");
        modal.remove();
        callback();
      };
    } else {
      $('#' + esPartidoNoJugado).val("false");
      callback();
    }
  }

  function enviarDatos() {
    mostrarSpinner();
    const pareja1Id = parseInt($('#' + pareja1Select).val());
    const pareja2Id = parseInt($('#' + pareja2Select).val());
    const divisionId = parseInt($('#' + division).val());
    const ligaId = parseInt($('#' + ligaHidden).val());

    const payload = {
      divisionId,
      ligaId,
      pareja1Id,
      pareja2Id,
      set1P1: parseInt($('#' + juegosset1pareja1).val()) || 0,
      set1P2: parseInt($('#' + juegosset1pareja2).val()) || 0,
      set2P1: parseInt($('#' + juegosset2pareja1).val()) || 0,
      set2P2: parseInt($('#' + juegosset2pareja2).val()) || 0,
      set3P1: parseInt($('#' + juegosset3pareja1).val()) || 0,
      set3P2: parseInt($('#' + juegosset3pareja2).val()) || 0,
      esNoJugado: $('#' + esPartidoNoJugado).val() === "true"
    };

    fetch("https://club-padel-api-12f28391bbbd.herokuapp.com/resultados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic Y2x1YnBhZGVsdXNlcjpjbHVicGFkZWxwYXNz"
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) throw new Error("Error en el servidor");
      return response.json();
    })
    .then(data => {
      console.log("Resultado registrado:", data);
      window.location.href = "https://clubpadelandujar.com/resultados-super-liga/";
    })
    .catch(error => {
      console.error("Error al enviar resultado", error);
      ocultarSpinner();
      alert("Error al enviar el resultado. Inténtalo de nuevo.");
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

  cargarLigasYDivisiones();
});
