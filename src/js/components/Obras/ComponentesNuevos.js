import React, { Component } from 'react'
import readXlsxFile from 'read-excel-file'
import axios from 'axios'
import { Card, CardHeader, CardBody, Spinner } from 'reactstrap';
import { UrlServer } from '../Utils/ServerUrlConfig'
class ComponentesNuevos extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Data: [],
            mensajeConfirmacion: '',
            AvisoError: '',
            DataComponentes: [],
            idFicha: "",
            g_meta: ""
        }
        this.CargaDatosExcelComponentes = this.CargaDatosExcelComponentes.bind(this)
        this.enviarComponentes = this.enviarComponentes.bind(this)
    }
    CargaDatosExcelComponentes() {
        var idFicha = sessionStorage.getItem("idFicha")
        const input = document.getElementById('inputComponentes')
        readXlsxFile(input.files[0]).then((rows) => {
            var DataComponentes = []
            for (let index = 0; index < rows.length; index++) {
                rows[index].push(idFicha)
                DataComponentes.push(rows[index])
            }
            console.log("DataComponentes", DataComponentes);
            this.setState({
                DataComponentes
            })
        })
            .catch((error) => {
                alert('algo salió mal')
                console.log("ERROR", error);
            })
    }
    enviarComponentes() {
        var DataComponentes = this.state.DataComponentes
        axios.post(`${UrlServer}/postComponentes`,
            DataComponentes
        )
            .then((res) => {
                alert("exito")
            })
            .catch((error) => {
                alert("algo salio mal")
                console.error('ERROR', error);
            });
        window.location.href = "/PartidasNuevas";
    }
    componentWillMount() {
        var idFicha = sessionStorage.getItem("idFicha")
        this.setState({
            idFicha
        })
    }
    render() {
        const { DataComponentes } = this.state
        return (
            <div>
                <Card>
                    <CardHeader>{this.state.g_meta}</CardHeader>
                    <CardBody>
                        <fieldset>
                            <legend><b>Datos de componentes</b></legend>
                            <input type="file" id="inputComponentes" onChange={this.CargaDatosExcelComponentes} />
                            <table className="table table-bordered table-sm small">
                                <thead>
                                    <tr>
                                        <th> N° de componente</th>
                                        <th> Nombre de componente</th>
                                        <th> presupuesto de componente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {DataComponentes.map((Fila1, FilaIndex) =>
                                        <tr key={FilaIndex}>
                                            <td><b>{Fila1[0]}</b></td>
                                            <td>{Fila1[1]}</td>
                                            <td>{Fila1[2]}</td>
                                            {/* <td>{Fila1.idObra }</td> */}
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <button onClick={() => this.enviarComponentes()} className="btn btn-outline-success">  <Spinner color="primary" />Guardar datos</button>
                        </fieldset>
                    </CardBody>
                </Card>
            </div>
        )
    }
}
export default ComponentesNuevos;
