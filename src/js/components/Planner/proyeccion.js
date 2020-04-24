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
            componentes: [
                {
                    M1: 0, M2: 0, M3: 0, M4: 0, M5: 0, M6: 0, M7: 0, M8: 0, M9: 0, M10: 0, M11: 0, M12: 0,
                    MEXPT1: 0, MEXPT2: 0, MEXPT3: 0, MEXPT4: 0, MEXPT5: 0, MEXPT6: 0, MEXPT7: 0, MEXPT8: 0, MEXPT9: 0, MEXPT10: 0, MEXPT11: 0, MEXPT12: 0,
                    MPROVAR1: 0, MPROVAR2: 0, MPROVAR3: 0, MPROVAR4: 0, MPROVAR5: 0, MPROVAR6: 0, MPROVAR7: 0, MPROVAR8: 0, MPROVAR9: 0, MPROVAR10: 0, MPROVAR11: 0, MPROVAR12: 0
                }
            ],
            cajaproyeccionexp: 0,
            cajaanyo: 0,
            cajaproyeccionvar: 0,
            debounceTimeout: 600,
            chart_data: 0


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
    capturaInputProyeccionExp(evento) {
        console.log(evento.target.value, "evento");
        this.setState({
            cajaproyeccionexp: evento.target.value,
            // SE ESTA GUARDANDO EN ESTA VARIABLE cajaproyeccionexp
        })
        console.log("bien!", this.state.cajaproyeccionexp);

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


    capturaInputProyeccionVar(evento) {
        console.log(evento.target.value, "evento");
        this.setState({
            cajaproyeccionvar: evento.target.value,
            // SE ESTA GUARDANDO EN ESTA VARIABLE cajaproyeccionexp
        })
        console.log(this.state.cajaproyeccionexp);

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
            .catch((error) => { //para ver un error
                console.log('algo salió mal al tratar de listar las obras error es: ', error);
            })
    }

    render() {//es todo lo que se imprime en la pantalla render es una funcion del propio react
        var { debounceTimeout } = this.state //PARA HACER MAS RAPIDO EL IMPUT
        var {cajaanyo} = this.state //SE USO PARA PONER EL AÑO EN EL CHART TITULO
        
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
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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
                    name: 'Proyección variable',
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



                <Table bordered dark>

                    <thead>
                        <tr className = 'fixed_headers'>
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



                    {this.state.componentes.map((componente) =>
                        <tbody>
                            <tr>
                                <td rowSpan="3" >

                                    <Button color="primary" id={"toggler" + componente.numero} onClick={() => this.get_chart_data(componente.id_componente)} >
                                        {componente.numero}
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
                                <td>{this.formatmoney(componente.MEXPT1)}</td>

                                <td>{this.formatmoney(componente.MEXPT2)}</td>
                                <td>{this.formatmoney(componente.MEXPT3)}</td>
                                <td>{this.formatmoney(componente.MEXPT4)}</td>
                                <td>{this.formatmoney(componente.MEXPT5)}</td>
                                <td>{this.formatmoney(componente.MEXPT6)}</td>
                                <td>{this.formatmoney(componente.MEXPT7)}</td>
                                <td>{this.formatmoney(componente.MEXPT8)}</td>
                                <td>{this.formatmoney(componente.MEXPT9)}</td>
                                <td>{this.formatmoney(componente.MEXPT10)}</td>
                                <td>{this.formatmoney(componente.MEXPT11)}</td>
                                <td>{this.formatmoney(componente.MEXPT12)}</td>
                            </tr>
                            <tr>
                                <td>Proy. Mensual</td>
                                <td>{this.formatmoney(componente.MPROVAR1)}</td>
                                <td>{this.formatmoney(componente.MPROVAR2)}</td>
                                <td>{this.formatmoney(componente.MPROVAR3)}</td>
                                <td>{this.formatmoney(componente.MPROVAR4)}</td>
                                <td>{this.formatmoney(componente.MPROVAR5)}</td>
                                <td>{this.formatmoney(componente.MPROVAR6)}</td>
                                <td>{this.formatmoney(componente.MPROVAR7)}</td>
                                <td>{this.formatmoney(componente.MPROVAR8)}</td>
                                <td>{this.formatmoney(componente.MPROVAR9)}</td>
                                <td>{this.formatmoney(componente.MPROVAR10)}</td>
                                <td>{this.formatmoney(componente.MPROVAR11)}</td>
                                <td>{this.formatmoney(componente.MPROVAR12)}</td>
                            </tr>


                            <td colSpan="15" className="">
                                {/* se puede hacer propio el collaps con una variable de cambio como el componente.numero que es  una variable */}
                                <UncontrolledCollapse toggler={"#toggler" + componente.numero}>
                                    <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                                        <CardBody>

                                            <h8>TABLA DE INGRESO DE PROYECCIONES MENSUALES Y CRONOGRAMA VALORIZADO SEGUN EXPEDIENTE TECNICO</h8>
                                            <tr>
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


                                            <tr>
                                                <td rowSpan="2" >
                                                    {componente.numero}</td>
                                                <td rowSpan="2">{componente.nombre}</td>
                                                <td>Proy. Exp. Tec.</td>
                                                <td>
                                                    <DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" onChange={evento => this.capturaInputProyeccionExp(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionExp(componente.id_componente, 1)}> <MdSave />

                                                        </Button>
                                                    </InputGroupAddon>

                                                </td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionExp(componente.id_componente, 2)}>
                                                            <MdSave />
                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionExp(componente.id_componente, 3)}>
                                                            <MdSave />
                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionExp(componente.id_componente, 4)}>
                                                            <MdSave />
                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput min={0} max={100} type="number" debounceTimeout={debounceTimeout} placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionExp(componente.id_componente, 5)}>
                                                            <MdSave />
                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionExp(componente.id_componente, 6)}>
                                                            <MdSave />
                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionExp(componente.id_componente, 7)}>
                                                            <MdSave />
                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionExp(componente.id_componente, 8)}>
                                                            <MdSave />
                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionExp(componente.id_componente, 9)}>
                                                            <MdSave />
                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionExp(componente.id_componente, 10)}>
                                                            <MdSave />
                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionExp(componente.id_componente, 11)}>
                                                            <MdSave />
                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionExp(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionExp(componente.id_componente, 12)}>
                                                            <MdSave />
                                                        </Button>
                                                    </InputGroupAddon></td>
                                            </tr>
                                            {/* ----------------------------------------------------------- */}
                                            <tr>
                                                <td>Proy. Mensual</td>
                                                <td> <DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionVar(componente.id_componente, 1)}>
                                                            <MdSave />

                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionVar(componente.id_componente, 2)}> <MdSave />

                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionVar(componente.id_componente, 3)}> <MdSave />

                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionVar(componente.id_componente, 4)}> <MdSave />

                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionVar(componente.id_componente, 5)}> <MdSave />

                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionVar(componente.id_componente, 6)}> <MdSave />

                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionVar(componente.id_componente, 7)}> <MdSave />

                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionVar(componente.id_componente, 8)}> <MdSave />

                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionVar(componente.id_componente, 9)}> <MdSave />

                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionVar(componente.id_componente, 10)}> <MdSave />

                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionVar(componente.id_componente, 11)}> <MdSave />

                                                        </Button>
                                                    </InputGroupAddon></td>
                                                <td><DebounceInput debounceTimeout={debounceTimeout} min={0} max={100} type="number" placeholder="ET" size="sm" onChange={evento => this.capturaInputProyeccionVar(evento)} />

                                                    <InputGroupAddon addonType="append">
                                                        <Button color="danger" onClick={() => this.guardarProyeccionVar(componente.id_componente, 12)}> <MdSave />

                                                        </Button>
                                                    </InputGroupAddon></td>
                                            </tr>


                                        </CardBody>
                                    </Card>

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
