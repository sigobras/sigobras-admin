// para desarrollo con el backend local
// const UrlServer = "http://localhost:9000";
// //para git pull cambiar a este modo
const UrlServer = "https://brzhxn1b16.execute-api.us-east-1.amazonaws.com/";
const Id_Acceso = sessionStorage.getItem("idacceso");
module.exports = {
  UrlServer,
};
