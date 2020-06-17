import React, { Component } from 'react'
import readXlsxFile from 'read-excel-file'
import axios from 'axios'
import { Redondea } from '../Utils/Funciones'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner } from 'reactstrap';
import { UrlServer } from '../Utils/ServerUrlConfig'
import "babel-polyfill"
class IngresoCuardoMetrados extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Data: [],
            mensajeConfirmacion: '',
            AvisoError: '',
            idFicha: "",
            g_meta: "",
            partidas: "",
            fecha: "",
            MetradosEjecutados: [],
            avanceActividades: [],
            dataExcelPartidasOriginial: [],
            repetidos: [],
            titulosMetrados: [],
            ficha: {}
        }
        this.CargaDatosExcelComponentes = this.CargaDatosExcelComponentes.bind(this)

        this.guardarMetrados = this.guardarMetrados.bind(this)
        this.round = this.round.bind(this)

    }

    CargaDatosExcelComponentes() {
        var listaPartidas = this.state.partidas
        var titulosMetrados = []

        function actividadesConMetrado(partida) {


            var actividades = []
            for (let i = 0; i < listaPartidas.length; i++) {

                const element = listaPartidas[i];

                if (Number(partida.valor) != 0 && element.item == partida.item) {
                    if (element.tipo == "partida") {
                        for (let j = 0; j < element.actividades.length; j++) {
                            const actividad = element.actividades[j];
                            actividades.push(
                                [
                                    actividad.id_actividad,
                                    partida.fecha,
                                    (partida.valor * actividad.porcentaje_metrado).toFixed(9),
                                    20
                                ]

                            )
                        }
                    } else {
                        titulosMetrados.push(
                            {
                                partida
                            }
                        )
                    }
                    break;
                }

            }
            return actividades
        }

        const input = document.getElementById('inputComponentes')
        input.addEventListener('change', () => {
            readXlsxFile(input.files[0], { getSheets: true }).then(async (sheets) => {
                var count = 0;
                var avanceActividades = []
                var repetidos = []
                var MetradosEjecutados = []
                var dataExcelPartidasOriginial = []

                for (var k in sheets) {
                    await readXlsxFile(input.files[0], { sheet: k }).then((rows) => {
                        // console.log("hoja",k);





                        //buscando posicion de ITEM          


                        var row = 0
                        var col = 0
                        loop1:
                        for (let i = 0; i < rows.length; i++) {
                            const fila = rows[i];
                            for (let j = 0; j < fila.length; j++) {
                                const celda = fila[j];

                                if (celda != null && celda == "ITEM") {
                                    row = i + 1
                                    col = j + 2
                                    break loop1;

                                }
                            }
                        }
                        // console.log("item posicion i %s j %s",row,col);
                        var fecha = rows[row - 2][col - 2]
                        // console.log("fecha",fecha);


                        //verificar listadeitems

                        for (let i = 0; i < listaPartidas.length; i++) {
                            const fila = rows[i + row];
                            if (fila[col - 2] != listaPartidas[i].item) {
                                console.log("diferente: ", fila[col - 2], listaPartidas[i].item);
                                dataExcelPartidasOriginial.push(
                                    {
                                        "hoja": k,
                                        "excel": fila[col - 2],
                                        "planilla": listaPartidas[i].item
                                    }
                                )
                            }

                        }

                        //verificar items repertidos
                        console.log("listaPartidas", listaPartidas);

                        var items = []
                        for (let i = row; i < rows.length; i++) {
                            const fila = rows[i];



                            if (items.indexOf(fila[col - 2]) == -1) {
                                items.push(fila[col - 2])
                            } else {
                                repetidos.push(
                                    {
                                        "hoja": k,
                                        "item": fila[col - 2],
                                        "fila": i - row + 1
                                    }
                                )
                            }
                        }
                        // console.log("repetidos",repetidos);


                        // verificar datos a enviar
                        for (let i = row; i < rows.length; i++) {
                            const fila = rows[i];
                            console.log("TAMAÑO", fila.length)
                            for (let j = col; j < fila.length; j++) {
                                const celda = fila[j];
                                if (!isNaN(celda) && celda != null && celda != 0) {
                                    MetradosEjecutados.push(
                                        {
                                            "hoja": k,
                                            "item": fila[col - 2],
                                            "valor": celda,
                                            "fecha": fecha + "-" + (j - 1)
                                        }
                                    )
                                }
                            }
                        }




                    })
                    //agregando id_partida fecha y listando 
                    console.log("n datos ", MetradosEjecutados.length);
                    console.log("metrados ejecutodos!!!!! ", MetradosEjecutados);
                    console.log("redondeo!!!!", this.round(45.5555));

                    for (let i = 0; i < MetradosEjecutados.length; i++) {
                        const fila = MetradosEjecutados[i];
                        // fila.valor = this.round(fila.valor)
                        avanceActividades = avanceActividades.concat(actividadesConMetrado(fila))

                    }
                    // console.log("avanceActividades",avanceActividades);
                }
                console.log("total datos", MetradosEjecutados.length);
                console.log("avanceActividades", avanceActividades);
                //revision
                var avancesRepetidos = []
                var avances = []
                for (let i = 0; i < avanceActividades.length; i++) {
                    const element = avanceActividades[i]
                    if (avances.indexOf(element) == -1) {
                        avances.push(element)
                    } else {
                        avancesRepetidos.push(element)
                    }

                }
                console.log("avancesRepetidos", avancesRepetidos);
                console.log("titulosMetrados", titulosMetrados);

                this.setState({
                    MetradosEjecutados: MetradosEjecutados,
                    avanceActividades: avanceActividades,
                    repetidos: repetidos,
                    dataExcelPartidasOriginial: dataExcelPartidasOriginial,
                    titulosMetrados: titulosMetrados

                })
            })


        })
    }

    round(num, decimales = 2) {
        var signo = (num >= 0 ? 1 : -1);
        num = num * signo;
        if (decimales === 0) //con 0 decimales
            return signo * Math.round(num);
        // round(x * 10 ^ decimales)
        num = num.toString().split('e');
        num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimales) : decimales)));
        // x * 10 ^ (-decimales)
        num = num.toString().split('e');
        return signo * (num[0] + 'e' + (num[1] ? (+num[1] - decimales) : -decimales));
    }

    componentWillMount() {
        var idFicha = sessionStorage.getItem("idFicha")
        this.setState({
            idFicha: idFicha
        })
        axios.post(`${UrlServer}/getPartidasPorObra`, {
            "id_ficha": sessionStorage.getItem("idFicha")
        })
            .then((res) => {
                // console.log(res.data);
                this.setState({
                    partidas: res.data
                })
                // console.log("partidas",res.data);

            })
            .catch((error) => {
                console.log('algo salió mal al tratar de listar los usuarios error es: ', error);
            })
        var id_ficha = sessionStorage.getItem("idFicha")
        //cargando datos de obra
        axios.post(`${UrlServer}/getObra`,
            {
                "id_ficha": id_ficha
            }
        )
            .then((res) => {
                console.log(res.data);
                this.setState({
                    ficha: res.data
                })
            })
            .catch((error) => {
                alert("ALGO SALIO MAN AL cargar los datos  DE LA OBRA")
                console.error('ALGO SALIO MAN AL INGRESAR LOS DATOS DE LA OBRA', error);
            });
    }
    guardarMetrados(e) {
        // e.preventDefault()
        if (confirm('estas seguro de guardar los metrados de la obra?')) {
            axios.post(`${UrlServer}/postAvanceActividadPorObra`,
                this.state.avanceActividades
            )
                .then((res) => {
                    console.log(res)
                    this.setState({
                        mensajeConfirmacion: res.data.message,
                        AvisoError: res.data
                    })
                    alert("exito")
                    location.reload();
                })
                .catch((error) => {
                    console.log("ERROR", error);
                })
        }
    }

    render() {
        const { MetradosEjecutados, repetidos, dataExcelPartidasOriginial, titulosMetrados, ficha } = this.state
        return (
            <div>

                <Card>

                    <CardHeader>{this.state.idFicha + " " + this.state.ficha.g_meta}</CardHeader>
                    <CardBody>
                        <fieldset>
                            <legend><b>Cuadro de metrados ejecutados</b></legend>

                            <input type="file" id="inputComponentes" onClick={this.CargaDatosExcelComponentes} />
                            <button onClick={(e) => this.guardarMetrados()} className="btn btn-outline-success">  <Spinner color="primary" />Guardar datos</button>
                            <table className="table table-bordered table-sm small">
                                <thead>
                                    <tr>
                                        <th> HOJA</th>
                                        <th> ITEM repetido</th>
                                        <th> fila</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {repetidos.map((metrado, index) =>
                                        <tr key={index}>
                                            <td>{metrado.hoja}</td>
                                            <td>{metrado.item}</td>
                                            <td>{metrado.fila}</td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>
                            <table className="table table-bordered table-sm small">
                                <thead>
                                    <tr>
                                        <th> HOJA</th>
                                        <th> EXCEL</th>
                                        <th> planilla</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {dataExcelPartidasOriginial.map((metrado, index) =>
                                        <tr key={index}>
                                            <td>{metrado.hoja}</td>
                                            <td>{metrado.excel}</td>
                                            <td>{metrado.planilla}</td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>
                            <table className="table table-bordered table-sm small">
                                <tbody>
                                    {titulosMetrados.map((titulo, index) =>
                                        <tr key={index}>
                                            <td className="text-danger h4 text-center p-2">TITULO ->{titulo.partida.item} con metrado de {titulo.partida.valor} el {titulo.partida.fecha} </td>

                                        </tr>
                                    )}

                                </tbody>
                            </table>
                            <table className="table table-bordered table-sm small">
                                <thead>
                                    <tr>
                                        <th> HOJA</th>
                                        <th> ITEM</th>
                                        <th> FECHA</th>
                                        <th> VALOR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MetradosEjecutados.map((metrado, index) =>
                                        <tr key={index}>
                                            <td>{metrado.hoja}</td>
                                            <td>{metrado.item}</td>
                                            <td>{metrado.fecha}</td>
                                            <td>{metrado.valor}</td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>

                        </fieldset>
                    </CardBody>

                </Card>
            </div>
        )
    }
}
export default IngresoCuardoMetrados;
