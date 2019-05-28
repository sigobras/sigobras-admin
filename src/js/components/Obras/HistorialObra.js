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
        this.elminarHistorial = this.elminarHistorial.bind(this)

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
        // event.preventDefault();
        var dataHistorial=this.state.dataHistorial
        dataHistorial[dataHistorial.length-1][3] = "2030-12-01"
        for(var i=0;i<dataHistorial.length-1;i++){
            dataHistorial[i][3] =  dataHistorial[i+1][2]
        }
        var id_actualizacion = 0
        //encontrar el id estado de obra actualizacion
        for (let i = 0; i < this.state.estados.length; i++) {
            if(this.state.estados[i].nombre =="Actualizacion"){
                id_actualizacion = this.state.estados[i].id_Estado;
                break;
            }
        }
        console.log("id_actualizacion",id_actualizacion);
        
        //resion de estado actualizacion
        var fecha_final = "2030-12-01"
        console.log(dataHistorial);
        var act  = false
        for(var i= dataHistorial.length-1; i>=0;i--){
            if(dataHistorial[i][4] != id_actualizacion && act){
                console.log(1,act);
                dataHistorial[i][3] = fecha_final
                act = false
            }else if(dataHistorial[i][4] == id_actualizacion && !act ){
                console.log(2,act);
                fecha_final = dataHistorial[i][3]
                act = true

            }else if(dataHistorial[i][4] == id_actualizacion && act ){
                console.log(3,act);
                dataHistorial[i][3] = fecha_final
                act = true

            }else{
                console.log(4,act);
                // dataHistorial[i][3] = fecha_final

            }
        }
        console.log(dataHistorial);
        axios.post(`${UrlServer}/postHistorialEstadosObra`,
            dataHistorial
        )
		.then((res)=>{
			
		}).catch((error)=>{
			console.log('Algo salió mal al tratar de listar los estados, error es: ',error);
		})
    }
    elminarHistorial(i){
        console.log("index",i );
        
        var dataHistorial=this.state.dataHistorial
        console.log(dataHistorial)

        console.log("idHistorial",dataHistorial[i][0]);
        if(dataHistorial[i][0]!=null)
        {
            axios.delete(`${UrlServer}/deleteEliminarHistorial`,

                {
                    data:{
                        id_historialEstado:dataHistorial[i][0]
                    }
                   
                }
            )
            .then((res)=>{
                console.log("exito");
                
                console.log(res.data)

                
            }).catch((error)=>{
                console.log('error al eliminar: ',error);
            })
            
        }


        dataHistorial.splice(i, 1);
        this.setState({
            dataHistorial:dataHistorial
        })
       

        console.log("Dato Eliminado");

    }
        //  actualizarUsuario = (req, res) => {
    //     const { id } = req.params;
    //     const newCustomer = req.body;
    //     req.getConnection((err, conn) => {
      
    //     conn.query('UPDATE customer set ? where id = ?', [newCustomer, id], (err, rows) => {
    //       res.redirect('/');
    //     });
    //     });
    //   };

    render() {
        const { estados,dataHistorial} = this.state
        return (
            <div>
                <Card>
                    <CardHeader>{this.state.idFicha+" "+this.state.g_meta}</CardHeader>
					<CardBody>
                        <Button color="primary"onClick={this.agregarHistorial}>
                          Agregar Estados
                        </Button> 
                        
                        <form onSubmit={this.handleSubmit} >
                        <table>
                            
                            <thead>
                                <tr>
                                    <th>
                                        Estados de Obra
                                    </th>
                                    <th>
                                        Fecha de Inicio
                                    </th>
                                    <th>
                                        Eliminar Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                dataHistorial.map((data,index)=>
                                
                                    <tr>
                                        <td>
                                            <select onChange={event => this.actualizarEstado(index,event.target.value)} required value={data[4]}>
                                                <option>Seleccionar los estados</option>  

                                                {estados.map((estado,estados)=>
                                                    <option value={estado.id_Estado}>{estado.nombre}</option>
                                                )}
                                            </select>
                                        </td>
                                        <td>
                                            <Input type="date" onChange={event => this.actualizarFecha(index,event.target.value)} required value={data[2]}
                                        />      
                                        </td>
                                        <td>
                                            <Button color="danger" onClick={()=>this.elminarHistorial(index)} > 
                                                Eliminar
                                            </Button>  
                                        </td>
                                    </tr>
                                
                               
                                )
                            }
                            </tbody>
                       
                        </table>
                            <br/>
                            <Button color="success" type="submit" >
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
