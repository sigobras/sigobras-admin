let userModel = {};
userModel.formatoPorcentaje = function formatoSoles(data){
    // console.log("formatoSoles",data);
    
    data = Number(data)
    data = userModel.Redondear(data)
    if(isNaN(data)){
        data = 0
    }else{
        data = data.toFixed(2)
    }
       
    return Number(data)
}
userModel.formatoSoles = function formatoSoles(data){
    // console.log("formatoSoles",data);
    
    data = Number(data)
    data = userModel.Redondear(data)
    if(isNaN(data)||data ==0){
        data = "-"
    }
    if(data < 1){
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
            }
        )
    }else{
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
            }
        )
    } 
    // console.log("termina");
    
    return data
}
userModel.Redondear =(data) =>{
    data = Math.round(data * 10000000000) / 10000000000
    data = Math.round(data * 10000) / 10000
    return data
}
module.exports = userModel;
