import React, { Component } from 'react';
import axios from 'axios'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner, UncontrolledTooltip, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import classNames from 'classnames'
import { UrlServer } from '../Utils/ServerUrlConfig'

import CreaAcceso from './Accesos/CreaAcceso'
class ListaUsuarios extends Component {
    constructor(){
        super()
        this.state = {
            listaUsuarios:[],
            modal: false,
            idUser:''
        }
        this.modalA = this.modalA.bind(this)
        this.idUser = this.idUser.bind(this)
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
   
    idUser(id){
        this.setState({
            idUser:id
        })
        this.modalA()
    }
    render() {
        const { listaUsuarios } = this.state
        return (
            <div>
                <Card>
                    <CardHeader>Lista de obras</CardHeader>
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
                                            <button className="btn btn-outline-secondary btn-xs" id={`e${index}`} onClick={this.modalA}>crear acceso </button>
                                            <UncontrolledTooltip placement="bottom" target={`e${index}`}>
                                                crear acceso- {usuario.id_usuario }
                                            </UncontrolledTooltip> 
                                        </td>
                                    </tr>
                                )}
                                
                            </tbody>
                        </table>
                    </CardBody>
                    <CardFooter>----</CardFooter>
                </Card>
                



                <Modal isOpen={this.state.modal} fade={false} toggle={this.modalA} className={this.props.className}>
                    <ModalBody>
                        <CreaAcceso idUser={this.state.idUser }/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.modalA}>Guardar cambios</Button>{' '}
                        <Button color="danger" onClick={this.modalA}>Cerrar / cancelar</Button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

export default ListaUsuarios;