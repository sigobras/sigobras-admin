import React, { Component } from 'react';
import axios from 'axios'
import { Card, Button, CardHeader, CardBody, CardText, Spinner, UncontrolledTooltip, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label } from 'reactstrap';
import classNames from 'classnames'
import { UrlServer } from '../Utils/ServerUrlConfig'

import CreaAcceso from './Accesos/CreaAcceso'
import { DebounceInput } from 'react-debounce-input';

import ReactDOM from "react-dom";

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
            imagen: null,                                                                                                                                                                                                   
            message: "",
            msg: ""
        }
        this.modalA = this.modalA.bind(this)
        this.IdUser = this.IdUser.bind(this)
        this.modalNUsuario = this.modalNUsuario.bind(this)
        this.enviarDatosUsuarios = this.enviarDatosUsuarios.bind(this)
        this.handleChangeInput = this.handleChangeInput.bind(this)


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
        // this.modalNUsuario()
        var formData = new FormData();
        //datos
        formData.append('nombre', this.state.nombre);
        formData.append('apellido_paterno', this.state.apellido_Paterno);
        formData.append('apellido_materno', this.state.apellido_Materno);
        formData.append('dni', this.state.dni);
        formData.append('direccion', this.state.direccion);
        formData.append('email', this.state.email);
        formData.append('celular', this.state.celular);
        formData.append('cpt', this.state.cpt);
        
        //imagen
        formData.append('imagen', this.state.imagen);
        const config = {
            headers: {
              'content-type': 'multipart/form-data'
            }
          }
        axios.post(`${UrlServer}/nuevoUsuario`,
        formData,
        config
        )        
        .then(function (response) {
            //handle success
            console.log(response);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
        // const { nombre, apellido_Paterno, apellido_Materno, dni, direccion, email, cpt } = this.state
        // axios.post(`${UrlServer}/nuevoUsuario`,{
        //     nombre: nombre,
        //     apellido_Paterno: apellido_Paterno,
        //     apellido_Materno: apellido_Materno,
        //     dni: dni,
        //     direccion: direccion,
        //     email: email,
        //     cpt: cpt,
        // })
        // .then((res)=>{
        //     if(res.status == 400){
        //         alert('algo ha salido mal')                
        //     }else{
        //         alert('exito ')
        //     }
        // })
        // .catch((err)=>{
        //     alert('errores al ingresar el usuario')
        //     console.log(err)
        // })
    }
    handleChangeInput(event) {
        const { value, maxLength } = event.target;
        const message = value.slice(0, maxLength);
        this.setState({dni: event.target.value})
        this.setState({
                    message
                });
    }
    // handleChangeInput(e) {
    //     const { value, maxLength } = e.target;
    //     const msg  = value.slice(0, maxLength);
    //     this.setState({celular: e.target.value})
    //     this.setState({
    //                 msg 
    //             });
    // }

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
                                    <th>ultimo Usuario</th>
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
                                        <td>{usuario.usuario}</td>
                                        <td>{usuario.celular}</td>

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

                </Modal>

                <Modal isOpen={ modalNuevoUser } fade={false} toggle={this.modalNUsuario} className={this.props.className}>
                    <Form onSubmit={this.enviarDatosUsuarios}>

                        <ModalBody>
                                <FormGroup>
                                    <b for="nombre">Nombre</b>
                                    <DebounceInput  className="form-control" id="nombre" placeholder="nombre" onChange={e => this.setState({nombre: e.target.value}) } debounceTimeout={300} required/>
                                </FormGroup>

                                <FormGroup>
                                    <b for="apellido_Paterno">Apellido Paterno</b>
                                    <DebounceInput className="form-control" id="apellido_Paterno" placeholder="apellido_Paterno" onChange={e => this.setState({apellido_Paterno: e.target.value})} debounceTimeout={300} required/>
                                </FormGroup>

                                <FormGroup>
                                    <b for="apellido_Materno">Apellido Materno</b>
                                    <DebounceInput className="form-control" id="apellido_Materno" placeholder="apellido_Materno" onChange={e => this.setState({apellido_Materno: e.target.value})} debounceTimeout={300} required/>
                                </FormGroup>

                                <FormGroup>
                                    <b for="dni">DNI</b>
                                    <DebounceInput maxLength="8" className="form-control" type="number" id="dni" placeholder="dni" onChange={e =>this.handleChangeInput(e) }  value={this.state.message} debounceTimeout={300} required/>
                                </FormGroup>

                                <FormGroup>                                    
                                    <b for="direccion">Direccion</b>
                                    <DebounceInput className="form-control" id="direccion" placeholder="direccion" onChange={e => this.setState({direccion: e.target.value})} debounceTimeout={300} required/>
                                </FormGroup>

                                <FormGroup>
                                    <b for="email">Email</b>
                                    <DebounceInput className="form-control" id="email" placeholder="email" onChange={e => this.setState({email: e.target.value})} debounceTimeout={300} required/>
                                </FormGroup>

                                <FormGroup>
                                    <b for="cpt">N° Celular</b>
                                    <DebounceInput maxLength="9" type="number" className="form-control"  id="celular" placeholder="celular" onChange={e =>this.setState({celular: e.target.value}) }  debounceTimeout={300} required/>
                                </FormGroup>

                                <FormGroup>
                                    <b for="cpt">Código de colegiatura</b>
                                    <DebounceInput className="form-control"  id="cpt" placeholder="cpt" onChange={e => this.setState({cpt: e.target.value})} debounceTimeout={300} required/>
                                </FormGroup>

                                <FormGroup>
                                    <b for="imagen">Agregar foto</b>
                                    <th><input type="file" name="imagen1" onChange={e => this.setState({imagen: e.target.files[0]})} /></th>

                                </FormGroup> 
                          
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" type="submit">Guardar datos</Button>{' '}
                            <Button color="danger" onClick={this.modalNUsuario}>Cerrar </Button>
                        </ModalFooter>
                    </Form>
                </Modal>


            </div>
        );
    }
}

export default ListaUsuarios;