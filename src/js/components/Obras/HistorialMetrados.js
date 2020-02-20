import React, { Component } from 'react'
import readXlsxFile from 'read-excel-file'
import axios from 'axios'
import { Card, CardHeader, CardBody, Spinner } from 'reactstrap';
import { UrlServer } from '../Utils/ServerUrlConfig'
class HistorialMetrados extends Component {
    constructor(props) {
        super(props);
        this.state = {
            obras: [],
            componentes: [],
            id_componente: '',
            fecha_ini: "",
            fecha_fin: "",
            avanceActividades: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.actualizarCompontenes = this.actualizarCompontenes.bind(this);
        this.getHistorial = this.getHistorial.bind(this);

    }
    async componentWillMount() {
        await axios.get(`${UrlServer}/listaObras`)
            .then((res) => {
                console.log(res.data);
                this.setState({
                    obras: res.data
                })
            })
            .catch((error) =>
                console.error('falló al obtener los datos del servidor', error)
            )
        this.actualizarCompontenes(this.state.obras[0].id_ficha)
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleSubmit(event) {
        if (confirm("Estos cambios no pueden ser revertidos, Estas seguro que desea eliminar?")) {
            // axios.delete(`${UrlServer}/Historial`, {
            //     data: this.state
            // })
            //     .then((res) => {
            //         console.log("eliminado con exito", res.data);
            //         alert("eliminado con exito");
            //     })
            //     .catch((error) => {
            //         console.log('ERROR', error);
            //         alert('algo ha salido mal')
            //     });

        }
        event.preventDefault();
    }
    actualizarCompontenes(id_ficha) {
        this.setState({
            componentes: []
        })
        axios.post(`${UrlServer}/listaComponentesPorId`,
            {
                "id_ficha": id_ficha
            }
        )
            .then((res) => {
                console.log("componentes", res.data);
                this.setState({
                    componentes: res.data
                })
            })
            .catch((error) =>
                console.error('falló al obtener los datos del servidor', error)
            )

    }
    getHistorial() {
        axios.post(`${UrlServer}/getHistorialByFechas`,
            {
                "id_componente": this.state.id_componente,
                "fecha_ini": this.state.fecha_ini,
                "fecha_fin": this.state.fecha_fin
            }
        )
            .then((res) => {
                console.log("avancede actividadtes", res.data);
                this.setState({
                    avanceActividades: res.data
                })
            })
            .catch((error) =>
                console.error('falló al obtener los datos del servidor', error)
            )
    }
    elminarHistorial(id_AvanceActividades) {
        if (confirm("Estos cambios no pueden ser revertidos, Estas seguro que desea eliminar?")) {
            console.log("eliminando");
            axios.delete(`${UrlServer}/deleteHistorialById`,
                {
                    data: {
                        id_AvanceActividades: id_AvanceActividades
                    }

                }
            )
                .then((res) => {
                    console.log("exito");
                    console.log(res.data)
                    this.getHistorial()
                }).catch((error) => {
                    console.log('error al eliminar: ', error);
                })
        }
    }
    render() {
        const { DataComponentes, obras, componentes, avanceActividades } = this.state
        return (
            <div className="col-10">
                <div className="form-group">
                    <label>Seleccione la obra</label>
                    <select className="form-control form-control-sm m-0" onChange={event => this.actualizarCompontenes(event.target.value)}>
                        <option>Selecione</option>
                        {obras.map((obra, i) =>
                            <option key={i} value={obra.id_ficha}>{obra.codigo}</option>
                        )}
                    </select>
                </div>
                <div className="form-group">
                    <label>Seleccione el componente</label>
                    <select className="form-control form-control-sm m-0" onChange={e => this.setState({ id_componente: e.target.value })}>
                        <option>Selecione</option>
                        {componentes.map((componente, i) =>
                            <option key={i} value={componente.id_componente}>{componente.numero + "-" + componente.nombre}</option>
                        )}
                    </select>
                </div>
                <div className="form-inline">
                    <label>fecha inicial</label>
                    <div className="form-group">
                        <input type="date" onChange={e => this.setState({ fecha_ini: e.target.value })}></input>
                    </div>
                    <label>fecha final</label>
                    <div className="form-group">
                        <input type="date" onChange={e => this.setState({ fecha_fin: e.target.value })}></input>
                    </div>

                </div>
                <button type="text" className="btn btn-success" onClick={this.getHistorial}>historial</button>
                <table className="table table-bordered table-hover table-sm">
                    <thead>
                        <tr>
                            <th></th>
                            <th>fecha</th>
                            <th>valor</th>
                            <th>descripcion</th>
                            <th>observacion</th>
                        </tr>
                    </thead>
                    <tbody >
                        {avanceActividades === undefined ? 'cargando' : avanceActividades.map((avance, index) =>
                            <tr key={index}>
                                <td>
                                    <button className="btn btn-danger" onClick={() => this.elminarHistorial(avance.id_AvanceActividades)} >
                                        Eliminar
                                    </button>
                                </td>
                                <td>{avance.fecha}</td>
                                <td>{avance.valor}</td>
                                <td>{avance.descripcion}</td>
                                <td>{avance.observacion}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}
export default HistorialMetrados;
