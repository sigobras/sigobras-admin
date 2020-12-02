let userModel = {};
userModel.formatoPorcentaje = function formatoSoles(data) {
    // console.log("formatoSoles",data);

    data = Number(data)
    data = userModel.Redondear(data)
    if (isNaN(data)) {
        data = 0
    } else {
        data = data.toFixed(2)
    }

    return Number(data)
}
userModel.formatoSoles = function formatoSoles(data) {
    // console.log("formatoSoles",data);

    data = Number(data)
    data = userModel.Redondear(data)
    if (isNaN(data) || data == 0) {
        data = "-"
    }
    if (data < 1) {
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        }
        )
    } else {
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
        )
    }
    // console.log("termina");

    return data
}
userModel.Redondear = (data) => {
    data = Math.round(data * 10000000000) / 10000000000
    data = Math.round(data * 10000) / 10000
    return data
}
userModel.fechaLargaCorta = (MyDate) => {
    var MyDateString;
    MyDateString = (MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2))
    return MyDateString
}
userModel.Redondea = (x) => {
    // console.log("x =>>", x)
    if (x == null) {
        return "-"
    }
    else if (x == 0 || isNaN(x)) {
        return "-"
    }
    return Number.parseFloat(x).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

}
module.exports = userModel;
