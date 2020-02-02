import React, { Component } from 'react'
import readXlsxFile from 'read-excel-file'
import axios from 'axios'
import { Card, CardHeader, CardBody, Spinner } from 'reactstrap';
import { UrlServer } from '../Utils/ServerUrlConfig'
class HistorialMetrados extends Component {
    constructor(props) {
        super(props);
        this.state = {
            obra: '113',
            anio: '0',
            mes: '0',
            estadoImagen: 'si',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleSubmit(event) {
        if (confirm("Estos cambios no pueden ser revertidos, Estas seguro que desea eliminar?")) {
            axios.delete(`${UrlServer}/Historial`, {
                data: this.state
            })
                .then((res) => {
                    console.log("eliminado con exito", res.data);
                    alert("eliminado con exito");
                })
                .catch((error) => {
                    console.log('ERROR', error);
                    alert('algo ha salido mal')
                });

        }
        event.preventDefault();
    }
    render() {
        const { DataComponentes } = this.state
        return (
            <div className="col-5">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Seleccione la obra</label>
                        <select className="form-control" value={this.state.obra} id="obra" onChange={this.handleChange}>
                            <option value="113">HOSPITAL 01</option>
                            <option value="115">E002</option>
                            <option value="117">E004</option>
                            <option value="118">E005</option>
                            <option value="119">MATERNO</option>
                            <option value="120">MATERNO prueba</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Seleccione el anio</label>
                        <select className="form-control" value={this.state.anio} id="anio" onChange={this.handleChange}>
                            <option value="0">todos</option>
                            <option value="2020">2020</option>
                            <option value="2019">2019</option>
                            <option value="2018">2018</option>
                            <option value="2017">2017</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Seleccione el mes</label>
                        <select className="form-control" value={this.state.mes} id="mes" onChange={this.handleChange}>
                            <option value="0">todos</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }
}
export default HistorialMetrados;
