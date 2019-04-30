import React, { Component } from 'react'
import axios from 'axios'
import { Redondea } from '../Utils/Funciones'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner, Input } from 'reactstrap';
import { UrlServer } from '../Utils/ServerUrlConfig'
class HistorialObra extends Component {
    constructor(props){
        super(props)
        this.state={
            idFicha:"",
			g_meta:"",
			estados:[],
            dataHistorial:[],
            HistorialEstados:[]
          
                }
        this.agregarHistorial = this.agregarHistorial.bind(this)
        this.actualizarFecha = this.actualizarFecha.bind(this)
        this.actualizarEstado = this.actualizarEstado.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        
        
    }
  
    componentWillMount(){
        var idFicha  = sessionStorage.getItem("idFicha")
        console.log("idficha",idFicha);
        
        var g_meta  = sessionStorage.getItem("g_meta")
        this.setState({
            idFicha:idFicha,
            g_meta:g_meta
        })
         /*** Cargar listaEstados */
		axios.get(`${UrlServer}/listaEstados`)
		.then((res)=>{
			console.log(res.data)
			this.setState({
				estados:res.data
			})

		}).catch((error)=>{
			console.log('Algo salió mal al tratar de listar los estados, error es: ',error);
		})
        /******Cargando Historial de Estados */
        axios.post(`${UrlServer}/getHistorialEstados`,
                    {
                        id_ficha:sessionStorage.getItem("idFicha")
                    }
        )
		.then((res)=>{
			console.log(res.data)
			this.setState({
				dataHistorial:res.data,
			})

		}).catch((error)=>{
			console.log('Algo salió mal al tratar de listar los estados, error es: ',error);
		})
    }
    agregarHistorial(){
        var dataHistorial=this.state.dataHistorial
        console.log(dataHistorial)
        dataHistorial.push(
            [null,this.state.idFicha,"","","" ]
        )
        this.setState({
            dataHistorial:dataHistorial
        })

    }
    actualizarFecha(index,valor){
        console.log("Guardado",index,valor)

        var dataHistorial=this.state.dataHistorial

        dataHistorial[index][2] = valor
        console.log(dataHistorial);
        

        this.setState({
            dataHistorial:dataHistorial
        })
    }

	actualizarEstado(index,valor){
        console.log("Almacenado",index,valor)
        
        var dataHistorial=this.state.dataHistorial
        
        dataHistorial[index][4]=valor
        console.log(dataHistorial);
        
        this.setState({
            dataHistorial:dataHistorial
        })

      
    }

  
     handleSubmit(event) {
        event.preventDefault();
        var dataHistorial=this.state.dataHistorial
     
        dataHistorial[dataHistorial.length-1][3] = "2030-12-01"
            for(var i=0;i<dataHistorial.length-1;i++){
                
                    dataHistorial[i][3] =  dataHistorial[i+1][2]
            }

        console.log(dataHistorial);     
        console.log("Dato Almacenado");
        axios.post(`${UrlServer}/postHistorialEstadosObra`,
                    
                        dataHistorial
                    
        )
		.then((res)=>{
			console.log(res.data)
			
		}).catch((error)=>{
			console.log('Algo salió mal al tratar de listar los estados, error es: ',error);
		})

      }
      

    render() {
        const { estados,dataHistorial} = this.state
        return (
            <div>
                <Card>
                    <CardHeader>{this.state.idFicha+" "+this.state.g_meta}</CardHeader>
					<CardBody>
                        <Button onClick={this.agregarHistorial}>
                           +
                        </Button> 
                        <form onSubmit={this.handleSubmit} >
                            {
                                dataHistorial.map((data,index)=>
                                <div>
                                    <select onChange={event => this.actualizarEstado(index,event.target.value)} required value={data[4]}>
                                    <option>Seleccionar los estados</option>  

                                        {estados.map((estado,estados)=>
                                            <option value={estado.id_Estado}>{estado.nombre}</option>
                                        )}
                                    </select>
                                    <Input type="date" onChange={event => this.actualizarFecha(index,event.target.value)} required value={data[2]}
                                    />
                                </div>
                                )
                            }
                            <br/>
                            <Button type="submit" >
                            Guardar Datos
                            </Button> 

                        </form>     
                   
				 	</CardBody>
                       
                </Card>
            </div>
        )
    }
}
export default HistorialObra;
