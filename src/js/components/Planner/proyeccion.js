import React, { Component } from "react";
import { MdSave, MdFlashOn } from "react-icons/md";
import { Table, Button, InputGroup, InputGroupAddon, InputGroupText, Input, UncontrolledCollapse, CardBody, Card, Navbar, Spinner } from 'reactstrap';
import { DebounceInput } from 'react-debounce-input';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig';
// import './val.css'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

// CHART
// import Highcharts from 'highcharts'
// import HighchartsReact from 'highcharts-react-official'

//https://reactstrap.github.io/components/tables/ para aprender reactstrap

//import { array } from "prop-types";

class Proyeccion extends Component {
    constructor() {
        super();
        this.state = {
            resumen: "",   //lista vacia: es un dato por defecto para guardar la lista de componentes por ejemplo.  
            anyosproyectados: [],      //se inicializa con el tipo de variable si la variable guarda numero se inicializa con numero si la variable fuera texto se inicia con un texto vacio entre comillas, y corchetes cuando es una lista, si es booleano se inicializa con true o false
            valMesesData: [],
            listaobrasData: [],
            cajaidficha: 0,
            componentes: [],
            cajaproyeccionexp: 0,
            cajaanyo: 0,
            cajaproyeccionvar: 0,
            debounceTimeout: 600,
            chart_data: 0,
            cajalistacomponente: [],
            activatorinput : -1


        };
        //se bindean las funciones las variables no

        this.selectObra = this.selectObra.bind(this);
        this.getComponentes = this.getComponentes.bind(this);
        this.capturaInputProyeccionExp = this.capturaInputProyeccionExp.bind(this);
        this.guardarProyeccionExp = this.guardarProyeccionExp.bind(this);

        ///////proyeccion variable
        this.capturaInputProyeccionVar = this.capturaInputProyeccionVar.bind(this);
        this.guardarProyeccionVar = this.guardarProyeccionVar.bind(this);

        this.formatmoney = this.formatmoney.bind(this);
        this.get_chart_data = this.get_chart_data.bind(this);
        this.activarEdicion = this.activarEdicion.bind(this);
        this.guardarproyeccioncomp = this.guardarproyeccioncomp.bind(this);
        this.prueba = this.prueba.bind(this);

       
    }
    componentWillMount() {
        console.log("SE CARGA COMPONENTWILLMOUNT");

        axios.post(`${UrlServer}/listaobras`,

        )          //axios es una libreria de javascript para llamar al API (poner la ruta del API)
            .then((res) => {    //que va a suceder cuando nos devuelva los resultados de forma correcta
                console.log("ESTA ES LA DATA lista obras", res.data);
                this.setState({             //setState es para alterar una variable 
                    listaobrasData: res.data
                })
            })
            .catch((error) => {    //si el api manda un error lo registra aqui
                console.log('algo salió mal al tratar de listar las obras error es: ', error);
            })
    }

    /////////FUNCIONES---------------------------------------/8///////////////////////////

    formatmoney(numero) {
        return (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }


    selectObra(idObra) {    //(EN SELECT OBRA FUNCION SE PUEDE TRABAJAR CON CUALQUIER NOMBRE)  

        this.setState({
            cajaidficha: idObra  //es una variable (debe de estar definida en el constructor)

        })
        console.log("cargando data", idObra); //PARA QUE NOS AYUDE A SABER SI FUNCIONA

        axios.post(`${UrlServer}/AnyoInicial`, //RUTA DEL API
            {
                "id_ficha": idObra,

            }
        )
            .then((respuesta) => {  //respuesta del api año inicial
                var listaanyos = [respuesta.data.anyo_inicial]
                console.log(listaanyos);
                for (let i = 1; i < 11; i++) {
                    console.log("i", i + respuesta.data.anyo_inicial);
                    listaanyos.push(i + respuesta.data.anyo_inicial);  //push para insertar un valor a la lista que creamos en la fila 116   
                    //el for tiene tres partes I-inicializar variable II- condicion III-lo que se va ejecutar en cada giro del bucle

                }
                console.log(listaanyos);


                console.log("AÑO INICIAL", respuesta.data.anyo_inicial);
                this.setState({    //sirve para modificar el valor de una variable
                    anyosproyectados: listaanyos     // se declara en el constructor "es cualquier nombre"    (sabemmos que se esta guardando numero anyo inicial)
                })
            })
            .catch((error) => { //para ver un error
                console.log('algo salió mal al tratar de listar las obras error es: ', error);
            })

    }

    getComponentes(anyo) {    //(EN SELECT OBRA FUNCION SE PUEDE TRABAJAR CON CUALQUIER NOMBRE)  

        this.setState({
            cajaanyo: anyo
        })

        axios.post(`${UrlServer}/ComponentesProyeccion`, //RUTA DEL API
            {
                "id_ficha": this.state.cajaidficha,
                "anyo": anyo

            }
        )
            .then((respuesta) => {  //respuesta del api año inicial
                console.log("componentes proyeccion", respuesta.data);
                this.setState({    //sirve para modificar el valor de una variable
                    componentes: respuesta.data     // se declara en el constructor "es cualquier nombre"    (sabemmos que se esta guardando numero anyo inicial)
                })
            })
            .catch((error) => { //para ver un error
                console.log('algo salió mal al tratar de listar las obras error es: ', error);
            })

    }
    //setState es una funcion asincrona
    async capturaInputProyeccionExp(evento, mes, index_comp) {

        var value_temp = parseFloat(evento.target.value)   //parseFloat se convierte el texto a numero
        var componentes_temp = this.state.componentes

        // componentes_temp[0].MEXPT1 = evento.target.value

        componentes_temp[index_comp]["MEXPT" + mes] = value_temp

        await this.setState({
            cajaproyeccionexp: evento.target.value,
            componentes: componentes_temp

            // SE ESTA GUARDANDO EN ESTA VARIABLE cajaproyeccionexp
        })
        //ACTUALIZANDO componente de edicion
        var componentecopia = this.state.cajalistacomponente
        //modificación a la copia el primer cero accede a la fila el segundo al primer elemento
        componentecopia[mes - 1][0] = evento.target.value
        console.log('componente copia', componentecopia);

        await this.setState({
            //se esta guardando la copia ya modificada lo esta reemplazando al original
            cajalistacomponente: componentecopia,

        })

    }

    async guardarProyeccionExp(id_componente, mes) {
        console.log("se hizo clic");

        //async para decir que termine la ejecucion en un determinado punto....revisar


        await axios.post(`${UrlServer}/postproyeccion`,

            //await: para decir que este axios espere mientras termina las consultas .... revisar
            {

                "proyeccion_exptec": this.state.cajaproyeccionexp,    //aqui cambiar la variable del imput
                "mes_anyo": this.state.cajaanyo + "-" + mes + "-" + "01",
                "id_componente": id_componente

            }
        )
            .then((respuesta) => {  //respuesta del api año inicial   //"data" es propio detransferencia de la datos 
                console.log("respuesta", respuesta.data);
            })
            .catch((error) => {
                console.log('algo salió mal al tratar de listar las obras error es: ', error);
            })

        this.getComponentes(this.state.cajaanyo)
        this.get_chart_data(id_componente)  // PARA CAMBIAR LAS BARRAS DEL CHART EN TIEMPO REAL


    }


    async capturaInputProyeccionVar(evento, mes, index_comp) {
        var value_temp = parseFloat(evento.target.value)   //parseFloat se convierte el texto a numero
        var componentes_temp = this.state.componentes

        // componentes_temp[0].MEXPT1 = evento.target.value

        componentes_temp[index_comp]["MPROVAR" + mes] = value_temp

        await this.setState({
            componentes: componentes_temp

            // SE ESTA GUARDANDO EN ESTA VARIABLE cajaproyeccionexp
        })

        //ACTUALIZANDO componente de edicion
        var componentecopia = this.state.cajalistacomponente
        //modificación a la copia el primer cero accede a la fila el segundo al primer elemento
        componentecopia[mes - 1][1] = evento.target.value
        console.log('componente copia', componentecopia);

        await this.setState({
            //se esta guardando la copia ya modificada lo esta reemplazando al original
            cajalistacomponente: componentecopia,

        })
    }

    async guardarProyeccionVar(id_componente, mes) {
        console.log("se hizo clic");

        //async para decir que termine la ejecucion en un determinado punto....revisar


        await axios.post(`${UrlServer}/postProyeccionVar`,   //ruta del api

            //await: para decir que este axios espere mientras termina las consultas .... revisar
            {

                "proyeccion_variable": this.state.cajaproyeccionvar,    //aqui cambiar la variable del imput
                "mes_anyo": this.state.cajaanyo + "-" + mes + "-" + "01",
                "id_componente": id_componente

            }
        )
            .then((respuesta) => {  //respuesta del api año inicial   //"data" es propio detransferencia de la datos 
                console.log("respuesta", respuesta.data);
            })
            .catch((error) => { //para ver un error
                console.log('algo salió mal al tratar de listar las obras error es: ', error);
            })

        this.getComponentes(this.state.cajaanyo)
        this.get_chart_data(id_componente)   // PARA QUE CAMBIE EN TIEMPO REAL LAS BARRAS

    }
    //creando funcion de chart
    get_chart_data(id_componente) {
        console.log("se hizo clic chart");
        axios.post(`${UrlServer}/chartproyeccion`, //RUTA DEL API
            {
                "id_ficha": this.state.cajaidficha,
                "anyo": this.state.cajaanyo,
                "id_componente": id_componente

            }
        )
            .then((respuesta) => {  //respuesta del api año inicial
                console.log("chart_data", respuesta.data);
                this.setState({    //sirve para modificar el valor de una variable
                    chart_data: respuesta.data     // se declara en el constructor "es cualquier nombre"    (sabemmos que se esta guardando numero anyo inicial)
                })
            })
            .catch((error) => {
                console.log('algo salió mal al tratar de listar las obras error es: ', error);
            })
    }

    activarEdicion(index) { //index de componentes - solo se puede mandar los datos que esten en la interfaz dentro de la tabla, son datos que se pueden pasar de la tabla hacia esta funcion activarrEdicion


        var componenteTemp = this.state.componentes[index]
        //preparación del componente para formato lista
        var componenteslista = [
            // [
            //     respuesta.data[0].MEXPT1,
            //     respuesta.data[0].MPROVAR1,
            //     anyo + '-' + '01' + '-' + '01',
            //     respuesta.data[0].id_componente
            // ],
            // [
            //     respuesta.data[0].MEXPT2,
            //     respuesta.data[0].MPROVAR2,
            //     anyo + '-' + '02' + '-' + '01',
            //     respuesta.data[0].id_componente
            // ]

        ]
        // componenteslista.push(
        // [
        //     respuesta.data[0].MEXPT3,
        //     respuesta.data[0].MPROVAR3,
        //     anyo + '-' + '03' + '-' + '01',
        //     respuesta.data[0].id_componente
        // ]

        // )
        for (let i = 1; i <= 12; i++) {
            componenteslista.push(
                [
                    componenteTemp['MEXPT' + i],
                    componenteTemp['MPROVAR' + i],
                    this.state.cajaanyo + '-' + i + '-' + '01',
                    componenteTemp.id_componente
                ]

            )

        }
        console.log('componentes lista', componenteslista);
        this.setState(
            {
                cajalistacomponente: componenteslista,
                activatorinput: index
            }
        )

    }

    guardarproyeccioncomp() {

        axios.post(`${UrlServer}/putproyecciones`,

            this.state.cajalistacomponente
        )
            .then((respuesta) => {
                console.log("guardado", respuesta.data);

            })
            .catch((error) => {
                console.log('algo salió mal al tratar de listar las obras error es: ', error);
            })

            this.setState(
            {
                activatorinput: -1
            }
        )
    }



    prueba (){

        console.log("PRUEBA!!!!");
        
    }


    render() {//es todo lo que se imprime en la pantalla render es una funcion del propio react
        var { debounceTimeout } = this.state //PARA HACER MAS RAPIDO EL IMPUT
        var { cajaanyo } = this.state //SE USO PARA PONER EL AÑO EN EL CHART TITULO

        const options = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'PROGRAMADO' + ' ' + cajaanyo
            },
            subtitle: {
                text: 'Obra: Materno Infantil'  //codigo nombre de la obra
            },
            xAxis: {
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ],
                crosshair: true,
                title: {
                    text: 'Proyecciones'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Soles (S/.)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:20px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} soles</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            },
            series: [
                {
                    name: 'Avance Mensual',
                    data: this.state.chart_data.avance

                }, {
                    name: 'Proyección Expediente',
                    data: this.state.chart_data.exptec

                }, {
                    name: 'Proyección Mensual',
                    data: this.state.chart_data.proyvar

                }]

        }

        console.log("componentes", this.state.componentes);


        // arriba del return es netamente javascritp
        return (
            // dentro del render solo puede haber un elemento (div)
            // dentro del return solo va JSX 

            <div className="container-fluid  mt-5"> <MdFlashOn size={20} className="text-warning" />




                <select onChange={event => this.selectObra(event.target.value)}>
                    <option>Seleccione la obra</option>
                    {this.state.listaobrasData.map((lista, index) =>     //HACE INTERACCION CON UN SOLO ELEMENTO

                        <option key={index} value={lista.id_ficha}>{lista.g_meta + "-" + lista.id_ficha}</option>

                    )}
                    {/* implementar una funcion, get componentes, la funcion debe de llamar al api get componentes, guardar esos componentes en una variable, y mostrarlos en el render */}
                </select>

                <select onChange={event => this.getComponentes(event.target.value)}>
                    <option>Seleccione el año</option>
                    {this.state.anyosproyectados.map((anyo, index) =>     //HACE INTERACCION CON UN SOLO ELEMENTO

                        <option key={index} value={anyo}>{anyo}</option>

                    )}
                </select>



                <Table bordered>

                    <thead>
                        <tr className='fixed_headers'>
                            <th>N°</th>
                            <th>COMPONENTE</th>
                            <th>DESCRIPCION</th>
                            <th>ENERO</th>
                            <th>FEBRERO</th>
                            <th>MARZO</th>
                            <th>ABRIL</th>
                            <th>MAYO</th>
                            <th>JUNIO</th>
                            <th>JULIO</th>
                            <th>AGOSTO</th>
                            <th>SETIEMBRE</th>
                            <th>OCTUBRE</th>
                            <th>NOVIEMBRE</th>
                            <th>DICIEMBRE</th>
                        </tr>
                    </thead>



                    {this.state.componentes.map((componente, index) =>

                        <tbody>
                            <tr>
                                <td rowSpan="3" >

                                    <Button color="primary" id={"toggler" + componente.numero} onClick={() => this.get_chart_data(componente.id_componente)} >
                                        {componente.numero}
                                    </Button>
                                    <Button color="success" onClick={() => this.activarEdicion(index)} >
                                        Editar
                                    </Button>
                                    <Button color="primary" onClick={() => this.guardarproyeccioncomp(index)} >
                                        guardar
                                    </Button>

                                </td>
                                <td rowSpan="3">{componente.nombre}</td>
                                <td>Avance Del Mes</td>
                                <td>{this.formatmoney(componente.M1)}</td>
                                <td>{this.formatmoney(componente.M2)}</td>
                                <td>{this.formatmoney(componente.M3)}</td>
                                <td>{this.formatmoney(componente.M4)}</td>
                                <td>{this.formatmoney(componente.M5)}</td>
                                <td>{this.formatmoney(componente.M6)}</td>
                                <td>{this.formatmoney(componente.M7)}</td>
                                <td>{this.formatmoney(componente.M8)}</td>
                                <td>{this.formatmoney(componente.M9)}</td>
                                <td>{this.formatmoney(componente.M10)}</td>
                                <td>{this.formatmoney(componente.M11)}</td>
                                <td>{this.formatmoney(componente.M12)}</td>
                            </tr>


                            <tr>
                                <td>Proy. Exp. Tec.</td>
                                <td> 
                                {/* <input onBlur={evento => this.prueba()}/> */}

                                <DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento, 1, index)} value={componente.MEXPT1} disabled = {(this.state.activatorinput == index)? "" : "disabled"}  /></td>

                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento, 2, index)} value={componente.MEXPT2} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento, 3, index)} value={componente.MEXPT3} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento, 4, index)} value={componente.MEXPT4} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento, 5, index)} value={componente.MEXPT5} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento, 6, index)} value={componente.MEXPT6} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento, 7, index)} value={componente.MEXPT7} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento, 8, index)} value={componente.MEXPT8} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento, 9, index)} value={componente.MEXPT9} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento, 10, index)} value={componente.MEXPT10} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento, 11, index)} value={componente.MEXPT11} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento, 12, index)} value={componente.MEXPT12} /></td>
                            </tr>
                            <tr>
                                <td>Proy. Mensual</td>
                                <td><DebounceInput placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento, 1, index)} value={componente.MPROVAR1} disabled = {(this.state.activatorinput == index)? "" : "disabled"} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento, 2, index)} value={componente.MPROVAR2} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento, 3, index)} value={componente.MPROVAR3} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento, 4, index)} value={componente.MPROVAR4} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento, 5, index)} value={componente.MPROVAR5} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento, 6, index)} value={componente.MPROVAR6} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento, 7, index)} value={componente.MPROVAR7} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento, 8, index)} value={componente.MPROVAR8} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento, 9, index)} value={componente.MPROVAR9} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento, 10, index)} value={componente.MPROVAR10} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento, 11, index)} value={componente.MPROVAR11} /></td>
                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento, 12, index)} value={componente.MPROVAR12} /></td>
                            </tr>


                            <td colSpan="15" className="">
                                {/* se puede hacer propio el collaps con una variable de cambio como el componente.numero que es  una variable */}
                                <UncontrolledCollapse toggler={"#toggler" + componente.numero}>

                                    <HighchartsReact

                                        highcharts={Highcharts}
                                        options={options}
                                    />
                                </UncontrolledCollapse>
                            </td>
                        </tbody>
                    )}
                </Table>

            </div>




        );
    }

}
export default Proyeccion;
