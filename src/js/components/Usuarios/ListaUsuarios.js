import React, { Component } from 'react';
import axios from 'axios'
import { Card, Button, CardHeader, CardBody, CardText, Spinner, UncontrolledTooltip, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label } from 'reactstrap';
import classNames from 'classnames'
import { UrlServer } from '../Utils/ServerUrlConfig'

import CreaAcceso from './Accesos/CreaAcceso'
import { DebounceInput } from 'react-debounce-input';

class ListaUsuarios extends Component {
    constructor(){
        super()
        this.state = {
            listaUsuarios:[],
            modal: false,
            modalNuevoUser: false,
            idUser:'',
            nombre:'',
            apellido_Paterno:'',
            apellido_Materno:'',
            dni:'',
            direccion:'',
            email:'',
            cpt:'',
        }
        this.modalA = this.modalA.bind(this)
        this.IdUser = this.IdUser.bind(this)
        this.modalNUsuario = this.modalNUsuario.bind(this)
        this.enviarDatosUsuarios = this.enviarDatosUsuarios.bind(this)
    }
    componentWillMount(){
        axios.get(`${UrlServer}/listaUsuarios`)
        .then((res)=>{
            // console.log(res.data);
            this.setState({
                listaUsuarios:res.data
            })
        })
        .catch((error)=>{
            console.log('algo salió mal al tratar de listar los usuarios error es: ', error);
        })
    }
    modalA() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
    }

    modalNUsuario() {
        this.setState(prevState => ({
            modalNuevoUser: !prevState.modalNuevoUser
        }));
    }
   
    IdUser(id){
        // console.log(id);
        
        this.setState({
            idUser:id
        })
        this.modalA()
    }
    enviarDatosUsuarios(event){
        event.preventDefault()
        this.modalNUsuario()
        const { nombre, apellido_Paterno, apellido_Materno, dni, direccion, email, cpt } = this.state
        axios.post(`${UrlServer}/nuevoUsuario`,{
            nombre: nombre,
            apellido_Paterno: apellido_Paterno,
            apellido_Materno: apellido_Materno,
            dni: dni,
            direccion: direccion,
            email: email,
            cpt: cpt,
        })
        .then((res)=>{
            alert('exito ')
            console.log('exito', res)
        })
        .catch((err)=>{
            alert('errores al ingresar el usuario')
            console.log(err)
        })
    }
    render() {
        const { listaUsuarios, modalNuevoUser } = this.state
        return (
            <div>
                <Card>
                    <CardHeader>
                        Lista de obras
                        <button className="btn btn-outline-primary btn-sm float-right" onClick={ this.modalNUsuario }>Nuevo Usuario</button>
                    </CardHeader>
                    <CardBody>
                        <table className="table table-bordered table-hover table-sm">
                            <thead>
                                <tr>
                                    <th>Nombre </th>
                                    <th>apellido_paterno </th>
                                    <th>apellido_materno </th>
                                    <th>dni</th>
                                    <th>direccion</th>
                                    <th>email</th>
                                    <th>cpt</th>
                                    <th>opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaUsuarios === undefined ? 'cargando': listaUsuarios.map((usuario, index)=>
                                    <tr key={ index }>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.apellido_paterno}</td>
                                        <td>{usuario.apellido_materno}</td>
                                        <td>{usuario.dni}</td>
                                        <td>{usuario.direccion}</td>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.cpt}</td>
                                        <td>
                                            <button className="btn btn-outline-secondary btn-xs" id={`e${index}`} onClick={ e => this.IdUser(usuario.id_usuario)}>crear acceso </button>
                                            <UncontrolledTooltip placement="bottom" target={`e${index}`}>
                                                crear acceso
                                            </UncontrolledTooltip> 
                                        </td>
                                    </tr>
                                )}
                                
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
                



                <Modal isOpen={this.state.modal} fade={false} toggle={this.modalA} className={this.props.className}>
                    <ModalBody>
                        <CreaAcceso idUsuario={this.state.idUser }/>
                    </ModalBody>
                    {/* <ModalFooter>
                        <Button color="primary" onClick={this.modalA}>Guardar cambios</Button>{' '}
                        <Button color="danger" onClick={this.modalA}>Cerrar / cancelar</Button>
                    </ModalFooter> */}
                </Modal>

                <Modal isOpen={ modalNuevoUser } fade={false} toggle={this.modalNUsuario} className={this.props.className}>
                    <Form onSubmit={this.enviarDatosUsuarios}>

                        <ModalBody>

                                <FormGroup>
                                    <Label for="nombre">NOMBRE</Label>
                                    <DebounceInput  className="form-control" id="nombre" placeholder="nombre" onChange={e => this.setState({nombre: e.target.value}) } debounceTimeout={300}/>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="apellido_Paterno">APELLIDO MATERNO</Label>
                                    <DebounceInput className="form-control" id="apellido_Paterno" placeholder="apellido_Paterno" onChange={e => this.setState({apellido_Paterno: e.target.value})} debounceTimeout={300}/>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="apellido_Materno">APELLIDO PATERNO</Label>
                                    <DebounceInput className="form-control" id="apellido_Materno" placeholder="apellido_Materno" onChange={e => this.setState({apellido_Materno: e.target.value})} debounceTimeout={300}/>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="dni">DNI</Label>
                                    <DebounceInput className="form-control" id="dni" placeholder="dni" onChange={e => this.setState({dni: e.target.value})} debounceTimeout={300}/>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="direccion">Direccion</Label>
                                    <DebounceInput className="form-control" id="direccion" placeholder="direccion" onChange={e => this.setState({direccion: e.target.value})} debounceTimeout={300}/>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <DebounceInput className="form-control" id="email" placeholder="email" onChange={e => this.setState({email: e.target.value})} debounceTimeout={300}/>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="cpt">Codigo de colegiatura</Label>
                                    <DebounceInput className="form-control"  id="cpt" placeholder="cpt" onChange={e => this.setState({cpt: e.target.value})} debounceTimeout={300}/>
                                </FormGroup>

                        
                            
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit">Guardar datos de usuario</Button>{' '}
                            <Button color="danger" onClick={this.modalNUsuario}>Cerrar / cancelar</Button>
                        </ModalFooter>
                    </Form>
                </Modal>


            </div>
        );
    }
}

export default ListaUsuarios;