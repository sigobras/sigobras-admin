import React, { Component } from 'react';
import axios from 'axios'
import { Card, Button, CardHeader, FormGroup, CardBody, Input, Label, CardText, Spinner,  Modal, Form, ModalBody, ModalFooter  } from 'reactstrap';
import { UrlServer } from '../Utils/ServerUrlConfig'

class ListaObras extends Component {
    constructor(){
        super()
        this.state = {
            listaObras:[],
            DataUsuarios:[],
            modal: false,
            modal2:false,
            modal3:false,
            IdObra:'',
            idUser:'',
            Componentes:[]
        }
        this.Modal = this.Modal.bind(this)
        this.CapturarIdObra = this.CapturarIdObra.bind(this)
        this.GuardarDatos = this.GuardarDatos.bind(this)

        //componentes
        this.ModalComponentes = this.ModalComponentes.bind(this)
        this.ListarComponentesPorId = this.ListarComponentesPorId.bind(this)        
        this.apiComponentes = this.apiComponentes.bind(this)
        this.RedirectPN = this.RedirectPN.bind(this)
        this.VerificacionValorizacion = this.VerificacionValorizacion.bind(this)
        
    }
    componentWillMount(){
        axios.get(`${UrlServer}/listaObras`)
        .then((res)=>{
            // console.log(res.data);
            this.setState({
                listaObras:res.data
            })
        })
        .catch((error)=>{
            console.log('algo salió mal al tratar de listar las obras error es: ', error);
        })

        // LISTA DE USUARIOS

        axios.get(`${UrlServer}/listaUsuarios`)
        .then((res)=>{
            // console.log(res.data);
            this.setState({
                DataUsuarios:res.data
            })
        })
        .catch((error)=>{
            console.log('algo salió mal al tratar de listar los usuarios error es: ', error);
        })

       

    }
    
    Modal() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
    }

    CapturarIdObra(id){
        this.setState({
            IdObra:id
        })
        this.Modal()
    }
    //listar componentes
    ModalComponentes() {
        this.setState(prevState => ({
            modal2: !prevState.modal2
        }));
    }
    ListarComponentesPorId(id_ficha){
      
        this.apiComponentes(id_ficha)
        this.ModalComponentes()
    }

    apiComponentes(id_ficha){
         //lista de componentes
         axios.post(`${UrlServer}/listaComponentesPorId`,{
            "id_ficha":id_ficha
        })
        .then((res)=>{
            // console.log(res.data);
            this.setState({
                Componentes:res.data
            })
            console.log("componentes",res.data);
            
        })
        .catch((error)=>{
            console.log('algo salió mal al tratar de listar los usuarios error es: ', error);
        })
    }
    RedirectPN(id_componente,id_presupuesto){
        alert(id_componente+" "+id_presupuesto)
        var json=
        {            
            "componentes": [
                {
                    "numero": 1,
                    "idComponente": id_componente,
                    "idPresupuesto": id_presupuesto
                }                
            ]
        }
        sessionStorage.setItem('datosObras', JSON.stringify(json))
        sessionStorage.setItem('estado', 'PartidaNueva')
        window.location.href = "/PartidasNuevas";

    }
    ingresarComponentes(id_ficha,g_meta){
        
        sessionStorage.setItem('idFicha', id_ficha)
        console.log("idficha",id_ficha);
        
        sessionStorage.setItem('g_meta', g_meta)
        window.location.href = "/ComponentesNuevos";

    }
    IngresarCuadroMetrados(id_ficha,g_meta){
        
        sessionStorage.setItem('idFicha', id_ficha)
        console.log("idficha",id_ficha);
        
        sessionStorage.setItem('g_meta', g_meta)
        
       
        window.location.href = "/IngresoCudroMetradosEjecutados";

    }
    VerificacionValorizacion(id_ficha,g_meta){
        
        sessionStorage.setItem('idFicha', id_ficha)
        console.log("idficha",id_ficha);
        
        sessionStorage.setItem('g_meta', g_meta)
        
       
        window.location.href = "/VerificacionValorizacion";

    }
    HistorialObra(id_ficha,g_meta){
        sessionStorage.setItem('idFicha',id_ficha)

        sessionStorage.setItem('g_meta',g_meta)

        window.location.href = "/HistorialObra";

    }
    ///////////////////////////////////////
    GuardarDatos(event){
        event.preventDefault()

        axios.post(`${UrlServer}/asignarObra`,{
            id_usuario:  this.state.idUser,
            id_ficha: this.state.IdObra
        })
        .then((res)=>{
            console.log(res)
           alert('ok estoy en proceso de desarrollo')
        })
        .catch((error)=>{
            console.log('algo salió mal al tratar de listar los usuarios error es: ', error);
        })

        this.Modal()
    }

    render() {
        const { listaObras, DataUsuarios,Componentes } = this.state
        return (
            <div>
                <Card>
                    <CardHeader>Lista de obras</CardHeader>
                    <CardBody>
                        <table className="table table-bordered table-hover table-sm">
                            <thead>
                                <tr>
                                    <th>Codigo</th>
                                    <th>Nombre </th>
                                    <th>Presupuesto </th>
                                    <th>g_local_dist </th>
                                    <th>Asignar Acceso a usuario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaObras === undefined ? 'cargando': listaObras.map((obra, index)=>
                                    <tr key={ index }>
                                        <td>{ obra.codigo }</td>
                                        <td>{ obra.g_sector }</td>
                                        <td>{ obra.g_total_presu }</td>
                                        <td>{ obra.g_local_dist }</td>
                                        <td>
                                            <button className="btn btn-outline-success" onClick={(e) => this.CapturarIdObra(obra.id_ficha)}> Dar acceso</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-outline-success" onClick={(e) => this.ListarComponentesPorId(obra.id_ficha)}> P. nuevas</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-outline-success" onClick={(e) => this.ingresarComponentes(obra.id_ficha,obra.g_meta)}> C. nuevos</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-outline-success" onClick={(e) => this.IngresarCuadroMetrados(obra.id_ficha,obra.g_meta)}>Metrados</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-outline-success" onClick={(e) => this.VerificacionValorizacion(obra.id_ficha,obra.g_meta)}>valorizacion</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-outline-success" onClick={(e) => this.HistorialObra(obra.id_ficha,obra.g_meta)}>Crear Historial</button>
                                        </td>
                                    </tr>
                                )}
                                
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
                <Modal isOpen={this.state.modal}
                //  modalTransition={{ timeout: 700 }} backdropTransition={{ timeout: 1300 }}
                    toggle={this.Modal} className={this.props.className}>
                    <Form onSubmit={this.GuardarDatos}>
                        <ModalBody>
                        
                            <FormGroup>
                                <Label for="exampleSelect">SELECCIONE EL USUARIO { this.state.idUser }</Label>
                                <Input type="select" onChange={(e) => this.setState({idUser: e.target.value})}>
                                    <option>SELECCIONE</option>
                                    {DataUsuarios.map((usuarios, iusuers)=>
                                        <option key={ iusuers } value={ usuarios.id_usuario }>DNI : { usuarios.dni }  Nombre: { usuarios.nombre } { usuarios.apellido_paterno } { usuarios.apellido_materno } </option>                                
                                    )}
                                </Input>
                            </FormGroup>
                        
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit">Guardar</Button>{' '}
                            <Button color="secondary" onClick={this.Modal}>Cancelar</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
                <Modal isOpen={this.state.modal2} 
                //  modalTransition={{ timeout: 700 }} backdropTransition={{ timeout: 1300 }}
                    toggle={this.ModalComponentes} className={this.props.className} size="lg">
                    <Form onSubmit={this.GuardarDatos}>
                        <ModalBody>
                        
                            <FormGroup>
                                <Label for="exampleSelect">SELECCIONE EL COMPONENTE { this.state.idUser }</Label>                             
                                
                                
                                {Componentes.map((componente, iusuers)=>
                                    
                                    <div key={ iusuers } value={ componente.id_componente } > 
                                    { componente.numero+" "+ componente.nombre } 
                                    <Button color="secondary" onClick={e=>this.RedirectPN(componente.id_componente,componente.id_Presupuesto)}>NuevaPartida</Button>
                                    {/* <Button color="secondary" >NuevaPartida</Button>  */}
                                    </div>                                                             
                                )}
                                
                            </FormGroup>
                        
                        </ModalBody>
                        <ModalFooter>                            
                            <Button color="secondary" onClick={this.ModalComponentes}>Cancelar</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default ListaObras;