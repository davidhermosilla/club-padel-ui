/**
Añadir al final del fichero
*/
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
