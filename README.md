# club-padel-ui
Respositorio que contiene el codigo HTML para gestionar los usuarios, roles, reservas y pagos a traves del api club-padel-api

Al final del functions.php añadir 
```php
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
```

- Crear una carpeta js dentro de public_html/wp-content/themes/inspiro/js
- Crear el archivo public_html/wp-content/themes/inspiro/js/mi-script.js
- Añadir al archivo el siguiente contenido:
```javascript
// Asegúrate de que wpData está disponible
if (typeof wpData !== 'undefined') {
    // Obtén el campo hidden con el id "user-info"
    var userInfoField = document.getElementById('user-info');
    
    if (userInfoField) {
        // Setea el username en el campo hidden
        userInfoField.value = wpData.username;

        // Crea y lanza un evento personalizado "userReady"
        var userReadyEvent = new Event('userReady');
        userInfoField.dispatchEvent(userReadyEvent);

        console.log('Username seteado en el campo hidden y evento userReady lanzado.');
    }
}
```