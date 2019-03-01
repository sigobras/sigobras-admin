import React, { Component } from 'react'
import readXlsxFile from 'read-excel-file'
import axios from 'axios'
import { Redondea } from '../Utils/Funciones'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner } from 'reactstrap';
import { UrlServer } from '../Utils/ServerUrlConfig'

class ComponentesNuevos extends Component {
    constructor(props){
        super(props)
        this.state={
            Data:[],
            mensajeConfirmacion: '',
            AvisoError:'',
            DataComponentes:[],
            idFicha:"",
            g_meta:""
            
        }
        this.CargaDatosExcelComponentes = this.CargaDatosExcelComponentes.bind(this)
        this.GuardarComponentes = this.GuardarComponentes.bind(this)
        this.enviarComponentes = this.enviarComponentes.bind(this)

    }

    CargaDatosExcelComponentes(){
        
        const input = document.getElementById('inputComponentes')
        input.addEventListener('change', () => {
            readXlsxFile(input.files[0]).then((rows) => {

                var dataArray = []
                for (let index = 0; index < rows.length; index++) {
                    // console.log(rows[index][0]);

                    dataArray.numero = rows[index]
                    var datos = Object.assign({},rows[index])
                    datos[0] = datos[0]
                    datos[1] = datos[1]
                    datos[2] = Redondea(datos[2])                    
                    dataArray.push(datos)
                }
                this.setState({
                    DataComponentes:dataArray
                })
            })
            .catch((error)=>{
                alert('algo salió mal')
                
                console.log(error);
                
            })
        })
    }
    enviarComponentes(){
        var ObrasEstructurado = {}

        ObrasEstructurado.id_ficha = this.state.idFicha
        ObrasEstructurado.componentes = this.state.DataComponentes
        console.log(ObrasEstructurado);
        
        axios.post(`${UrlServer}/postComponentes`,
            ObrasEstructurado
        ) 
        .then((res)=> {
            if(res.data){
            alert('datos de la obra ingresados al sistema de manera existosa codigo '+res.status)
            console.info('enviado con exito', res.data);
            }
            this.setState({
            statusRes:res.data
            })
            sessionStorage.setItem('datosObras', JSON.stringify(res.data))
            sessionStorage.setItem('estado', 'PartidaNueva')
        
        })
        .catch((error)=> {
            console.error('ALGO SALIO MAN AL INGRESAR LOS DATOS DE LA OBRA',error);
        });
        window.location.href = "/PartidasNuevas";
        
        
    }

    componentWillMount(){
        var idFicha  = sessionStorage.getItem("idFicha")
        console.log("idficha",idFicha);
        
        var g_meta  = sessionStorage.getItem("g_meta")
        this.setState({
            idFicha:idFicha,
            g_meta:g_meta
        })

    }

    GuardarComponentes(e){
        e.preventDefault()
        console.log(this.state.Data);
        
        if (confirm('estas seguro de guardar los componetes de la obra?')) {
            axios.post(`${UrlServer}/nuevosComponentes`,
               this.state.Data
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
        const { DataComponentes} = this.state
        return (
            <div>
                <Card>
                  
                    <CardHeader>{this.state.g_meta}</CardHeader>
                        <CardBody>
                            <fieldset>
                                <legend><b>Datos de componentes</b></legend>
                                <input type="file" id="inputComponentes" onClick={this.CargaDatosExcelComponentes} />
                                <table className="table table-bordered table-sm small">
                                    <thead>
                                        <tr>
                                        <th> N° de componente</th>
                                        <th> Nombre de componente</th>
                                        <th> presupuesto de componente</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { DataComponentes.map((Fila1, FilaIndex)=>
                                            <tr key={FilaIndex}>
                                                <td><b>{ Fila1[0] }</b></td>
                                                <td>{Fila1[1] }</td>
                                                <td>{Fila1[2] }</td>
                                                {/* <td>{Fila1.idObra }</td> */}
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <button onClick={(e)=>this.enviarComponentes()} className="btn btn-outline-success">  <Spinner color="primary"/>Guardar datos</button>
                            </fieldset>
                    </CardBody>
                    
                </Card>
            </div>
        )
    }
}
export default ComponentesNuevos;
