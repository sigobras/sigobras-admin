import React, { Component } from 'react'
import readXlsxFile from 'read-excel-file'
import axios from 'axios'
import { Redondea } from '../Utils/Funciones'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner } from 'reactstrap';
import { UrlServer } from '../Utils/ServerUrlConfig'
import "babel-polyfill"
class IngresoCuardoMetrados extends Component {
    constructor(props){
        super(props)
        this.state={
            Data:[],
            mensajeConfirmacion: '',
            AvisoError:'',            
            idFicha:"",
            g_meta:"",
            partidas:"",
            fecha:"",
            MetradosEjecutados:[],
            avanceActividades:[],
            dataExcelPartidasOriginial:[],
            repetidos:[]
            
        }
        this.CargaDatosExcelComponentes = this.CargaDatosExcelComponentes.bind(this)
        
        this.guardarMetrados = this.guardarMetrados.bind(this)

    }
  
    CargaDatosExcelComponentes(){
     var listaPartidas = this.state.partidas
     
        function actividadesConMetrado(partida){
 
         
            var actividades = []
            for (let i = 0; i < listaPartidas.length; i++) {
            
                const element = listaPartidas[i];
                if(element.item == partida.item){
                    for (let j = 0; j < element.actividades.length; j++) {
                        const actividad = element.actividades[j];
                        actividades.push(
                            [
                            actividad.id_actividad,
                            partida.fecha,
                            (partida.valor * actividad.porcentaje_metrado).toFixed(3),
                            20
                            ]
                        
                        )
            
                        
                    }
                    break;
                }
            
            }
            return actividades
        }
        
        const input = document.getElementById('inputComponentes')
        input.addEventListener('change', () => {
            readXlsxFile(input.files[0], { getSheets: true }).then(async (sheets)=>{
                var count = 0;
                var avanceActividades = []
                var repetidos = []
                var MetradosEjecutados = []
                var dataExcelPartidasOriginial = []

                for (var k in sheets) {
                    await readXlsxFile(input.files[0], { sheet: k }).then((rows) => {
                        // console.log("hoja",k);

                     



                        //buscando posicion de ITEM          

             
                        var row = 0
                        var col = 0
                        loop1:
                        for (let i = 0; i < rows.length; i++) {
                            const fila = rows[i];
                            for (let j = 0; j < fila.length; j++) {
                                const celda = fila[j];                
                                
                                if( celda!=null && celda == "ITEM"){
                                    row = i+1
                                    col = j+2
                                    break loop1 ;
                                    
                                }
                            }
                        }
                        // console.log("item posicion i %s j %s",row,col);
                        var fecha = rows[row-2][col-2]
                        // console.log("fecha",fecha);


                        //verificar listadeitems
                        
                        for (let i = 0; i < listaPartidas.length; i++) {
                            const fila = rows[i+row];
                            if(fila[col-2] != listaPartidas[i].item){
                                console.log("diferente: ",fila[col-2] ,listaPartidas[i].item);
                                dataExcelPartidasOriginial.push(
                                    {
                                        "hoja":k,
                                        "excel":fila[col-2],
                                        "planilla":listaPartidas[i].item
                                    }
                                )
                            }
                            
                        }

                        //verificar items repertidos
                        console.log("listaPartidas",listaPartidas);
                        
                        var items = []
                        for (let i = row; i < rows.length; i++) {
                            const fila = rows[i];

                          
                        
                            if(items.indexOf(fila[col-2]) == -1){
                                items.push(fila[col-2])
                            }else{
                                repetidos.push(
                                    {
                                        "hoja":k,
                                        "item":fila[col-2],
                                        "fila":i-row+1
                                    }
                                )
                            }
                        }
                        // console.log("repetidos",repetidos);
                        
                        
                        // verificar datos a enviar
                        for (let i = row; i < rows.length; i++) {
                            const fila = rows[i];
                            for (let j = col; j < fila.length; j++) {
                                const celda = fila[j];
                                if(!isNaN(celda) && celda != null){
                                    MetradosEjecutados.push(
                                        {
                                            "hoja":k,
                                            "item":fila[col-2],
                                            "valor":celda,
                                            "fecha":fecha+"-"+(j-1)
                                        }
                                    )   
                                }
                            }
                        }
                        
                        
                        
                        
                    })
                    //agregando id_partida fecha y listando 
                    console.log("n datos ",MetradosEjecutados.length);
                    
                    for (let i = 0; i < MetradosEjecutados.length; i++) {
                        const fila = MetradosEjecutados[i];
                        avanceActividades = avanceActividades.concat(actividadesConMetrado(fila))
                        
                    }
                    // console.log("avanceActividades",avanceActividades);
                    
                }  
               
                console.log("total datos",MetradosEjecutados.length);
                console.log("avanceActividades",avanceActividades);
                //revision
                var avancesRepetidos = []
                var avances = []
                for (let i = 0; i < avanceActividades.length; i++) {
                    const element = avanceActividades[i]
                    if(avances.indexOf(element) == -1){
                        avances.push(element)
                    }else{
                        avancesRepetidos.push(element )
                    }
                    
                }
                console.log("avancesRepetidos",avancesRepetidos);
                
                this.setState({
                    MetradosEjecutados:MetradosEjecutados,
                    avanceActividades:avanceActividades,
                    repetidos:repetidos,
                    dataExcelPartidasOriginial:dataExcelPartidasOriginial
                    
                })
            })
          
            
        })
    }

    componentWillMount(){
        var idFicha  = sessionStorage.getItem("idFicha")
        console.log("idficha",idFicha);
        
        var g_meta  = sessionStorage.getItem("g_meta")
        this.setState({
            idFicha:idFicha,
            g_meta:g_meta
        })

        axios.post(`${UrlServer}/getPartidasPorObra`,{
         "id_ficha":sessionStorage.getItem("idFicha")
        })
        .then((res)=>{
            // console.log(res.data);
            this.setState({
                partidas:res.data
            })
            // console.log("partidas",res.data);
            
        })
        .catch((error)=>{
            console.log('algo salió mal al tratar de listar los usuarios error es: ', error);
        })


    }

    guardarMetrados(e){
        // e.preventDefault()
        
                                   
        if (confirm('estas seguro de guardar los metrados de la obra?')) {
            axios.post(`${UrlServer}/postAvanceActividadPorObra`,
               this.state.avanceActividades
            )
            .then((res)=>{
                console.log(res)
                this.setState({
                    mensajeConfirmacion: res.data.message,
                    AvisoError: res.data
                })
            })
            .catch((error)=>{
                console.log(error);
                
            })
        }
    }

    render() {
        const { MetradosEjecutados,repetidos,dataExcelPartidasOriginial} = this.state
        return (
            <div>
             
                <Card>
                  
                    <CardHeader>{this.state.idFicha+" "+this.state.g_meta}</CardHeader>
                        <CardBody>
                            <fieldset>
                                <legend><b>Cuadro de metrados ejecutados</b></legend>
                               
                                <input type="file" id="inputComponentes" onClick={this.CargaDatosExcelComponentes} />
                                <button onClick={(e)=>this.guardarMetrados()} className="btn btn-outline-success">  <Spinner color="primary"/>Guardar datos</button>
                                <table className="table table-bordered table-sm small">
                                    <thead>
                                        <tr>
                                        <th> HOJA</th>
                                        <th> ITEM repetido</th>
                                        <th> fila</th>                                        
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { repetidos.map((metrado, index)=>
                                    <tr key={ index }>
                                        <td>{ metrado.hoja }</td>
                                        <td>{ metrado.item }</td>
                                        <td>{ metrado.fila }</td>
                                    </tr>
                                )}
                                    
                                    </tbody>
                                </table>
                                <table className="table table-bordered table-sm small">
                                    <thead>
                                        <tr>
                                        <th> HOJA</th>
                                        <th> EXCEL</th>
                                        <th> planilla</th>
                                        
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { dataExcelPartidasOriginial.map((metrado, index)=>
                                    <tr key={ index }>
                                        <td>{ metrado.hoja }</td>
                                        <td>{ metrado.excel }</td>
                                        <td>{ metrado.planilla }</td>
                                    </tr>
                                )}
                                    
                                    </tbody>
                                </table>
                                <table className="table table-bordered table-sm small">
                                    <thead>
                                        <tr>
                                        <th> HOJA</th>
                                        <th> ITEM</th>
                                        <th> FECHA</th>
                                        <th> VALOR</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { MetradosEjecutados.map((metrado, index)=>
                                    <tr key={ index }>
                                        <td>{ metrado.hoja }</td>
                                        <td>{ metrado.item }</td>
                                        <td>{ metrado.fecha }</td>
                                        <td>{ metrado.valor }</td>
                                    </tr>
                                )}
                                    
                                    </tbody>
                                </table>
                                
                            </fieldset>
                    </CardBody>
                    
                </Card>
            </div>
        )
    }
}
export default IngresoCuardoMetrados;
