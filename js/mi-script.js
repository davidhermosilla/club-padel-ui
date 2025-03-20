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
