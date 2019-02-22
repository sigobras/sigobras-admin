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
            IdObra:'',
            idUser:''
        }
        this.Modal = this.Modal.bind(this)
        this.CapturarIdObra = this.CapturarIdObra.bind(this)
        this.GuardarDatos = this.GuardarDatos.bind(this)
        
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
        const { listaObras, DataUsuarios } = this.state
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
                                    <th>% Ejecución </th>
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
                                        <td>-</td>
                                        <td>{ obra.g_local_dist }</td>
                                        <td>
                                            <button className="btn btn-outline-success" onClick={(e) => this.CapturarIdObra(obra.id_ficha)}><Spinner /> Dar acceso</button>
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
            </div>
        );
    }
}

export default ListaObras;