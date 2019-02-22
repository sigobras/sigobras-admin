import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, CustomInput } from 'reactstrap';
import axios from 'axios'
import {DebounceInput} from 'react-debounce-input';

import { UrlServer } from '../../Utils/ServerUrlConfig'

class CreaAcceso extends Component {
    constructor(props){
        super(props);

        this.state = {
            DataListaCargos:[],
            IdCargo:'',
            usuario:'',
            password:'',
            estado:''
        }
        this.enviarDatos = this.enviarDatos.bind(this)
    }
    componentWillMount(){
        axios.get(`${UrlServer}/listaCargos`)
        .then((res)=>{
            // console.log('sasasa',res.data)
            this.setState({
                DataListaCargos:res.data
            })
        })
        .catch((err)=>{
            console.log(err);
            
        })
    }

    enviarDatos(event){
        event.preventDefault()
        const {IdCargo, usuario, password, estado } = this.state
        axios.post(`${UrlServer}/nuevoAcceso`,{
            "usuario": usuario,
            "password": password,
            "estado": estado,
            "cargos_id_cargo":IdCargo,
            "Usuarios_id_usuario":this.props.idUsuario
        })
        .then((res)=>
            console.log('estado',res)
        )
        .catch((err)=>{
            console.error(err);
            
        })
    }
    render(){
        const { DataListaCargos } = this.state
        return (
            <div>
                <Form onSubmit={this.enviarDatos}>
                    <FormGroup>
                        <Label for="exampleEmail">Usuario</Label>
                        <DebounceInput minLength={2} debounceTimeout={300} className="form-control" placeholder="usuario" onChange={event => this.setState({usuario: event.target.value})} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="examplePassword">Password</Label>
                        <DebounceInput minLength={2} debounceTimeout={300} className="form-control" onChange={event => this.setState({password: event.target.value})}  placeholder="contraseña" />
                    </FormGroup>
                    
                    <FormGroup>
                        <Label for="cargos">Cargos {this.props.idUsuario } </Label>
                        <Input type="select" id="cargos" onChange={e=> this.setState({IdCargo: e.target.value})}>
                            <option>seleccione</option>
                            {DataListaCargos.map((cargos, i)=>
                                <option value={cargos.id_Cargo } key={i}>{cargos.nombre }</option>
                            )}

                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleCheckbox">Estado de usuario desactivado / Activo {this.state.estado }</Label>
                        <div>
                            <CustomInput type="switch" id="exampleCustomSwitch" name="customSwitch" label="Estado" onChange={event => this.setState({estado: event.target.value})} />
                        </div>
                    </FormGroup>
                    <Button>Guardar</Button>
                </Form>
            </div>
        );
    }
}

export default CreaAcceso;