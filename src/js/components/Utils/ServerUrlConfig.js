// const axios = require('axios')

// CUANDO SE QUIERA TRABAJAR CON EL BACKEND DEL SERVIDOR

// const UrlServer = "http://190.117.94.80:9000";

//PARA "SUBIR EL CAMBIO" SIEMPRE TIENE QUE ESTAR CON LA IP DEL SERVIDOR

// CUANDO QUIERA TRABAJAR CON EL BAKEND EN MODO LOCAL

const UrlServer = "http://localhost:9000"; 

// PARA MODO DESARROLLO CON EL BACKEND EN MODO LOCAL


// const Token = axios.defaults.headers.common['Authorization'] = `bearer ${sessionStorage.getItem('TuToken')}`;


module.exports = {
    UrlServer,
    // Token
} 

