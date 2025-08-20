<?php
/**
 * Inspiro functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Inspiro
 * @since Inspiro 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Define Constants
 */
define( 'INSPIRO_THEME_VERSION', '1.9.1' );
define( 'INSPIRO_THEME_DIR', trailingslashit( get_template_directory() ) );
define( 'INSPIRO_THEME_URI', trailingslashit( esc_url( get_template_directory_uri() ) ) );
define( 'INSPIRO_THEME_ASSETS_URI', INSPIRO_THEME_URI . 'dist' );

// This theme requires WordPress 5.3 or later.
if ( version_compare( $GLOBALS['wp_version'], '5.3', '<' ) ) {
	require INSPIRO_THEME_DIR . 'inc/back-compat.php';
}

/**
 * Recommended Plugins
 */
require INSPIRO_THEME_DIR . 'inc/classes/class-tgm-plugin-activation.php';

/**
 * Setup helper functions.
 */
require INSPIRO_THEME_DIR . 'inc/common-functions.php';

/**
 * Setup theme media.
 */
require INSPIRO_THEME_DIR . 'inc/theme-media.php';

/**
 * Enqueues scripts and styles
 */
require INSPIRO_THEME_DIR . 'inc/classes/class-inspiro-enqueue-scripts.php';

/**
 * Functions and definitions.
 */
require INSPIRO_THEME_DIR . 'inc/classes/class-inspiro-after-setup-theme.php';

/**
 * Handle SVG icons.
 */
require INSPIRO_THEME_DIR . 'inc/classes/class-inspiro-svg-icons.php';

/**
 * Implement the Custom Header feature.
 */
require INSPIRO_THEME_DIR . 'inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require INSPIRO_THEME_DIR . 'inc/template-tags.php';

/**
 * Additional features to allow styling of the templates.
 */
require INSPIRO_THEME_DIR . 'inc/template-functions.php';

/**
 * Custom template shortcode tags for this theme
 */
//require INSPIRO_THEME_DIR . 'inc/shortcodes.php';

/**
 * Customizer additions.
 */
require INSPIRO_THEME_DIR . 'inc/classes/class-inspiro-font-family-manager.php';
require INSPIRO_THEME_DIR . 'inc/classes/class-inspiro-fonts-manager.php';
require INSPIRO_THEME_DIR . 'inc/customizer-functions.php';
require INSPIRO_THEME_DIR . 'inc/customizer/class-inspiro-customizer-control-base.php';
require INSPIRO_THEME_DIR . 'inc/customizer/class-inspiro-customizer.php';

/**
 * SVG icons functions and filters.
 */
require INSPIRO_THEME_DIR . 'inc/icon-functions.php';

/**
 * Theme admin notices and info page
 */
if ( is_admin() ) {
	require INSPIRO_THEME_DIR . 'inc/admin-notice.php';
	require INSPIRO_THEME_DIR . 'inc/theme-info-page.php';

	if ( current_user_can( 'manage_options' ) ) {
		require INSPIRO_THEME_DIR . 'inc/classes/class-inspiro-notices.php';
		require INSPIRO_THEME_DIR . 'inc/classes/class-inspiro-notice-review.php';
	}
}

/**
 * Theme Upgrader
 */
require INSPIRO_THEME_DIR . 'inc/classes/class-inspiro-theme-upgrader.php';

/**
 * Inline theme css generated dynamically
 */
require INSPIRO_THEME_DIR . 'inc/dynamic-css/body.php';
require INSPIRO_THEME_DIR . 'inc/dynamic-css/logo.php';
require INSPIRO_THEME_DIR . 'inc/dynamic-css/headings.php';
require INSPIRO_THEME_DIR . 'inc/dynamic-css/hero-header-title.php';
require INSPIRO_THEME_DIR . 'inc/dynamic-css/hero-header-desc.php';
require INSPIRO_THEME_DIR . 'inc/dynamic-css/hero-header-button.php';
require INSPIRO_THEME_DIR . 'inc/dynamic-css/main-menu.php';
require INSPIRO_THEME_DIR . 'inc/dynamic-css/mobile-menu.php';

function usernametojavascript() {
    // Asegúrate de que el script de JavaScript está registrado
    wp_enqueue_script('mi-script-js', get_template_directory_uri() . '/js/mi-script.js', array(), '1.0.0', true);

    // Obtén el usuario actual de WordPress
    $current_user = wp_get_current_user();

    // Pasa el username al script JS
    wp_localize_script('mi-script-js', 'wpData', array(
        'username' => $current_user->user_login,
    ));
}
add_action('wp_enqueue_scripts', 'usernametojavascript');

function encolar_wpforms_dynamic_script() {
    // Encola el archivo JavaScript personalizado.
    wp_enqueue_script(
        'wpforms-dynamic-script', // Identificador único.
        get_template_directory_uri() . '/js/wpforms-dynamic.js', // Ruta al archivo JavaScript.
        array( 'jquery' ), // Dependencias (asegúrate de incluir jQuery).
        null, // Versión del script (opcional).
        true // Carga el script en el footer.
    );

    // Proporciona la URL AJAX a JavaScript.
    wp_localize_script( 'wpforms-dynamic-script', 'ajaxurl', array('ajaxurl' => admin_url( 'admin-ajax.php' ),
    ));
}
add_action( 'wp_enqueue_scripts', 'encolar_wpforms_dynamic_script' );

function encolar_inscripcion_torneo_script() {
    // Encola el archivo JavaScript personalizado.
    wp_enqueue_script(
        'inscripcion-torneo-script', // Identificador único.
        get_template_directory_uri() . '/js/inscripcion-torneo.js', // Ruta al archivo JavaScript.
        array( 'jquery' ), // Dependencias (asegúrate de incluir jQuery).
        null, // Versión del script (opcional).
        true // Carga el script en el footer.
    );

    // Proporciona la URL AJAX a JavaScript.
    wp_localize_script( 'inscripcion-torneo-script', 'ajaxurl', array('ajaxurl' => admin_url( 'admin-ajax.php' ),
    ));
}
add_action( 'wp_enqueue_scripts', 'encolar_inscripcion_torneo_script' );

function encolar_apuntar_resultados_liga_script() {
    // Encola el archivo JavaScript personalizado.
    wp_enqueue_script(
        'apuntar-resultados', // Identificador único.
        get_template_directory_uri() . '/js/apuntar-resultados.js', // Ruta al archivo JavaScript.
        array( 'jquery' ), // Dependencias (asegúrate de incluir jQuery).
        filemtime(get_template_directory() . '/js/apuntar-resultados.js'), // Versión del script (opcional).
        true // Carga el script en el footer.
    );

    // Proporciona la URL AJAX a JavaScript.
    wp_localize_script( 'apuntar-resultados', 'ajaxurl', array('ajaxurl' => admin_url( 'admin-ajax.php' ),
    ));
}
add_action( 'wp_enqueue_scripts', 'encolar_apuntar_resultados_liga_script' );

add_action('wp_head', function () {
    ?>
    <script type="text/javascript">
        const club_ajaxurl = "<?php echo admin_url('admin-ajax.php'); ?>";
    </script>
    <?php
});

function mi_funcion_enviar_correo() {
    $para = sanitize_email($_POST['para']);
    $asunto = sanitize_text_field($_POST['asunto']);
    $pista = sanitize_text_field($_POST['pista'] ?? 'No especificada');
    $fecha = sanitize_text_field($_POST['fecha'] ?? 'No especificada');
    $hora = sanitize_text_field($_POST['hora'] ?? 'No especificada');
    $tipo = sanitize_text_field($_POST['tipo'] ?? 'reserva');

    $logo_url = 'https://clubpadelandujar.com/wp-content/uploads/2024/04/116427407_923408374806546_5151967727359459574_n.jpg';

    $titulo = $tipo === 'cancelacion' ? 'Reserva Cancelada' : 'Reserva Confirmada';
    $mensaje_principal = $tipo === 'cancelacion'
        ? "Lamentamos informarte que tu reserva ha sido cancelada:"
        : "Tu reserva ha sido confirmada con los siguientes detalles:";
    $color_fondo = $tipo === 'cancelacion' ? '#b30000' : '#003f7f';

    // Separar hora de inicio y fin
    list($hora_inicio, $hora_fin) = array_map('trim', explode('-', $hora));
    $inicio = DateTime::createFromFormat('d/m/Y H:i', "$fecha $hora_inicio");
    $fin = DateTime::createFromFormat('d/m/Y H:i', "$fecha $hora_fin");
	
	$inicio_str = $inicio->format('Ymd\THis'); // sin la Z
	$fin_str = $fin->format('Ymd\THis');       // sin la Z

    $calendar_url = '';
    $ics_file = '';
    $attachments = [];

    if ($tipo !== 'cancelacion' && $inicio && $fin) {
        // Generar enlace Google Calendar
		$inicio_str = $inicio->format('Ymd\THis'); // sin la Z
		$fin_str = $fin->format('Ymd\THis');       // sin la 
        $calendar_url = 'https://www.google.com/calendar/render?action=TEMPLATE'
            . '&text=' . rawurlencode("Reserva en Club Pádel Andújar")
            . '&dates=' . $inicio_str . '/' . $fin_str
            . '&details=' . rawurlencode("Reserva de pista $pista el $fecha a las $hora")
            . '&location=' . rawurlencode("Club Pádel Andújar, Andújar");

        // Crear archivo ICS y adjuntar
        $ics_content = "BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Club Padel Andújar//Reservas//ES
BEGIN:VEVENT
UID:" . uniqid() . "
DTSTAMP:" . gmdate("Ymd\THis\Z") . "
DTSTART:" . $inicio_str . "
DTEND:" . $fin_str . "
SUMMARY:Reserva en Club Pádel Andújar
DESCRIPTION:Reserva pista $pista el $fecha de $hora
LOCATION:Club Pádel Andújar
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT15M
DESCRIPTION:Recordatorio de pista
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR";

        $upload_dir = wp_upload_dir();
        $ics_file = $upload_dir['basedir'] . '/reserva_' . uniqid() . '.ics';
        file_put_contents($ics_file, $ics_content);
        $attachments[] = $ics_file;
    }

    // Construir HTML del mensaje
    $mensaje_html = "
    <html>
    <head>
      <style>
        .reserva-container {
            font-family: Arial, sans-serif;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #ddd;
            border-radius: 10px;
            overflow: hidden;
        }
        .reserva-header {
            background-color: $color_fondo;
            padding: 20px;
            text-align: center;
            color: white;
        }
        .reserva-header img {
            max-height: 80px;
            border-radius: 8px;
            margin-bottom: 10px;
        }
        .reserva-body {
            padding: 20px;
            background-color: #f9f9f9;
        }
        .reserva-body p {
            font-size: 16px;
        }
        .reserva-table {
            width: 100%;
            margin-top: 15px;
            border-collapse: collapse;
        }
        .reserva-table th, .reserva-table td {
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
        .reserva-footer {
            padding: 15px;
            background-color: #eee;
            text-align: center;
            font-size: 13px;
            color: #666;
        }
      </style>
    </head>
    <body>
      <div class='reserva-container'>
        <div class='reserva-header'>
          <img src='$logo_url' alt='Club Pádel Andújar'>
          <h2>$titulo</h2>
        </div>
        <div class='reserva-body'>
          <p>Hola,</p>
          <p>$mensaje_principal</p>
          <table class='reserva-table'>
            <tr><th>Pista</th><td>$pista</td></tr>
            <tr><th>Fecha</th><td>$fecha</td></tr>
            <tr><th>Hora</th><td>$hora</td></tr>
          </table>";

    if ($calendar_url) {
        $mensaje_html .= "<p><a href='$calendar_url' target='_blank' style='padding:10px 15px; background-color:#007BFF; color:white; text-decoration:none; border-radius:5px;'>Añadir al Google Calendar</a></p>";
    }

    $mensaje_html .= "
        </div>
        <div class='reserva-footer'>
          Club Pádel Andújar – <a href='https://clubpadelandujar.com'>clubpadelandujar.com</a>
        </div>
      </div>
    </body>
    </html>
    ";

    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: Club Padel Andújar <contacto@clubpadelandujar.com>',
        'Reply-To: contacto@clubpadelandujar.com'
    ];

    $enviado = wp_mail($para, $asunto, $mensaje_html, $headers, $attachments);

    // Borrar archivo temporal si se usó
    if (!empty($ics_file) && file_exists($ics_file)) {
        unlink($ics_file);
    }

    wp_send_json_success(['enviado' => $enviado]);
}

add_action('wp_ajax_enviar_correo_custom', 'mi_funcion_enviar_correo');
add_action('wp_ajax_nopriv_enviar_correo_custom', 'mi_funcion_enviar_correo');

add_action('wp_ajax_obtener_email_usuario', 'obtener_email_usuario');

function obtener_email_usuario() {
    if (!isset($_POST['username'])) {
        wp_send_json_error('Username no enviado');
    }

    $username = sanitize_text_field($_POST['username']);
    $user = get_user_by('login', $username);

    if (!$user) {
        wp_send_json_error('Usuario no encontrado');
    }

    wp_send_json_success(['email' => $user->user_email, 'nombre' => $user->display_name, 'telefono' => get_user_meta( $user->ID, 'first_name', true )]);
}
