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
            modalEditarUsuario: false,
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
            msg: "",
            mostrarmasdatos:[],
            id_usuario:"",
            nombre_editable:"",
            apellido_paterno_editable:"",
            apellido_materno_editable:"",
            dni_editable:"",
            direccion_editable:"",
            email_editable:"",
            celular_editable:"",
            cpt_editable:""

        }
        this.modalA = this.modalA.bind(this)
        this.IdUser = this.IdUser.bind(this)
        this.modalNUsuario = this.modalNUsuario.bind(this)
        this.enviarDatosUsuarios = this.enviarDatosUsuarios.bind(this)
        this.handleChangeInput = this.handleChangeInput.bind(this)
        this.modalEditarUsuario=this.modalEditarUsuario.bind(this)
        this.ActualizarUsuario=this.ActualizarUsuario.bind(this)
        this.SwitchmodalEditarUsuario=this.SwitchmodalEditarUsuario.bind(this)
        
        // this.delete=this.delete.bind(this)
       
        
        


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

    modalEditarUsuario(id_usuario) {
        axios.post(`${UrlServer}/getUsuarioData`,
        {
            "id_usuario":id_usuario
        }
        )
        .then(async(res)=>{
            console.log(res.data);
            await this.setState({
                id_usuario:id_usuario,
                nombre_editable:res.data.nombre,
                apellido_paterno_editable:res.data.apellido_paterno,
                apellido_materno_editable:res.data.apellido_materno,
                dni_editable:res.data.dni,
                direccion_editable:res.data.direccion,
                email_editable:res.data.email,
                celular_editable:res.data.celular,
                cpt_editable:res.data.cpt
            })
            this.SwitchmodalEditarUsuario()

            
        })
        .catch((error)=>{
            console.log('algo salió mal al tratar de listar los usuarios error es: ', error);
        })
       
    }
    SwitchmodalEditarUsuario(){
        this.setState(prevState => ({
            modalEditarUsuario: !prevState.modalEditarUsuario
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
            location.reload()

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

    elminarUsuario(i){
        console.log("Dato Eliminado");
        console.log("index",i );
        
        axios.delete(`${UrlServer}/deleteEliminarUsuario`,
            {
                data:{
                    "id_usuario":i
                }
              
            }
        )
        .then((res)=>{
            console.log("exito");
            
            console.log(res.data)
            location.reload()

            
        }).catch((error)=>{
            console.log('error al eliminar: ',error);
        })

    }
    ActualizarUsuario(event){
        event.preventDefault()
        // console.log(this.state.id_usuario);
        // console.log(this.state.nombre_editable);
        // console.log(this.state.apellido_paterno_editable);
        // console.log(this.state.apellido_materno_editable);
        // console.log(this.state.dni_editable);
        // console.log(this.state.direccion_editable);
        // console.log(this.state.email_editable);
        // console.log(this.state.celular_editable);
        // console.log(this.state.cpt_editable);
        
        var usuario=
        {
            "id_usuario": this.state.id_usuario,
            "nombre": this.state.nombre_editable,
            "apellido_paterno": this.state.apellido_paterno_editable,
            "apellido_materno": this.state.apellido_materno_editable,
            "dni": this.state.dni_editable,
            "direccion": this.state.direccion_editable,
            "email": this.state.email_editable,
            "celular": this.state.celular_editable,
            "cpt": this.state.cpt_editable
        
        }

        console.log(usuario);
        axios.put(`${UrlServer}/putActualizarUsuario`,
          usuario
        )
        .then((res)=>{
            console.log("exito");
            
            console.log(res.data)
           location.reload()

            
        }).catch((error)=>{
            
            console.log('error al eliminar: ',error);
            alert("Hubo un error al actualizar")
        })



    }


    render() {
        const { listaUsuarios, modalNuevoUser, modalEditarUsuario,nombre_editable, apellido_paterno_editable, apellido_materno_editable, dni_editable, direccion_editable, email_editable, celular_editable, cpt_editable} = this.state
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
                                    <th>Celular</th>
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
                                        <td>{usuario.celular}</td>
                                        <td>{usuario.usuario}</td>

                                        <td>
                                            <tr><button className="btn btn-outline-primary btn-xs" id={`e${index}`} onClick={ e => this.IdUser(usuario.id_usuario)}>crear acceso </button>
                                            <UncontrolledTooltip placement="bottom" target={`e${index}`}>
                                                crear acceso
                                            </UncontrolledTooltip> </tr>
                                            <buttontoolbar><button className="btn btn-success " size="lg"  id={`e${index}`} onClick={ e => this.modalEditarUsuario(usuario.id_usuario)}>Editar</button>
                                            </buttontoolbar>
                                            <tr><Button className="btn btn-danger" size="lg" onClick={ e => this.elminarUsuario(usuario.id_usuario) } >Eliminar</Button>
                                            </tr>
                                            
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
            {/* modal mostrar el editar */}
            <Modal isOpen={ modalEditarUsuario } fade={false} toggle={this.SwitchmodalEditarUsuario} className={this.props.className}>
                    <Form onSubmit={this.ActualizarUsuario}>

                        <ModalBody>
                                <FormGroup>
                                    <b for="nombre">Nombre</b>
                                    <input  className="form-control" id="nombre" defaultValue={nombre_editable} onChange={e => this.setState({nombre_editable: e.target.value}) } required/>
                                </FormGroup>

                                <FormGroup>
                                    <b for="apellido_Paterno">Apellido Paterno</b>
                                    <input className="form-control" id="apellido_Paterno" defaultValue={apellido_paterno_editable} onChange={e => this.setState({apellido_paterno_editable: e.target.value})}  required/>
                                </FormGroup>

                                <FormGroup>
                                    <b for="apellido_Materno">Apellido Materno</b>
                                    <input className="form-control" id="apellido_Materno" defaultValue={apellido_materno_editable} onChange={e => this.setState({apellido_materno_editable: e.target.value})} required/>
                                </FormGroup>

                                <FormGroup>
                                    <b for="dni">DNI</b>
                                    <input maxLength="8" className="form-control" type="number" id="dni" defaultValue={dni_editable} onChange={e => this.setState({dni_editable: e.target.value})} required/>
                                </FormGroup>

                                <FormGroup>                                    
                                    <b for="direccion">Direccion</b>
                                    <input className="form-control" id="direccion" defaultValue={direccion_editable}  onChange={e => this.setState({direccion_editable: e.target.value})}  required/>
                                </FormGroup>

                                <FormGroup>
                                    <b for="email">Email</b>
                                    <input className="form-control" id="email" defaultValue={email_editable} onChange={e => this.setState({email_editable: e.target.value})} required/>
                                </FormGroup>

                                <FormGroup>
                                    <b for="cpt">N° Celular</b>
                                    <input maxLength="9" type="number" className="form-control"  id="celular" defaultValue={celular_editable} onChange={e =>this.setState({celular_editable: e.target.value}) }  required/>
                                </FormGroup>

                                <FormGroup>
                                    <b for="cpt">Código de colegiatura</b>
                                    <input className="form-control"  id="cpt" defaultValue={cpt_editable} onChange={e => this.setState({cpt_editable: e.target.value})} required/>
                                </FormGroup>
                         
                        </ModalBody>
                        
                        <ModalFooter>
                            <Button color="info" type="submit">Guardar datos</Button>{' '}
                            
                        </ModalFooter>
                    </Form>
                </Modal>
               
             

            </div>
        );
    }
}

export default ListaUsuarios;