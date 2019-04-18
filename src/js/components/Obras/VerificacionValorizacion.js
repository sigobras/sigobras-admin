import React, { Component } from 'react';
import axios from 'axios';
import { MdMoreVert, MdDone } from "react-icons/md";
import { Button,Nav, NavItem, NavLink, Card, CardHeader, CardBody, Row, Col, UncontrolledPopover, PopoverBody, Spinner } from 'reactstrap';
import classnames from 'classnames';
import { UrlServer } from '../Utils/ServerUrlConfig'
import readXlsxFile from 'read-excel-file'

class ValorizacionGeneral extends Component {
    constructor() {
        super();

        this.state = {
            DataAniosApi: [],
            DataMesesApi: [],
            DataComponentesApi: [],
            DataResumenApi: [],
            DataPartidasApi: [],

            activeTabAnio: '0',
            activeTabMes: '0',
            activeTabComponente: 'resumen',
            // capturamos nombre del componentes 
            IdComponente: '',
            NombreComponente: '',
            // para poder obtener las partidas 
            fecha_inicial: '',
            fecha_final: '',

            // montos en soles de componentes 
            soles_parcial: "",

            soles_anterior: "",
            soles_porcentaje_anterior: "",

            soles_actual: "",
            soles_porcentaje_actual: "",

            soles_acumulado: "",
            soles_porcentaje_acumulado: "",

            soles_saldo: "",
            soles_porcentaje_saldo: "",

            // montos de resumen de componentes
            ppto: "",
            avance_anterior: "",
            porcentaje_anterior: "",

            avance_actual: "",
            porcentaje_actual: "",

            avance_acumulado: "",
            porcentaje_acumulado: "",

            saldo: "",
            porcentaje_saldo: "",

            valorizacionExcel:[]
        };

        this.TabsAnios = this.TabsAnios.bind(this);
        this.TabsMeses = this.TabsMeses.bind(this);
        this.TabsComponentes = this.TabsComponentes.bind(this);
        this.CargarExcel = this.CargarExcel.bind(this);
        
    }

    componentWillMount() {

        axios.post(UrlServer + '/getValGeneralAnyos', {
            id_ficha: sessionStorage.getItem("idFicha")
        })
            .then((res) => {
                // console.table('data val princiapl', res.data);
                if (res.data === "vacio") {
                    console.log("no hay datos en la base datos")
                } else {
                    // console.log('data PRIMERA CARGA', res.data)
                    // console.log('data AÑOS', res.data)
                    // console.log('data PERIODOS', res.data[0].periodos)
                    // console.log('data PERIODOS >>>>>>>>>>', res.data[0].periodos[0].resumen)
                    // console.log('data COMPONENTES', res.data[0].periodos[0].componentes)
                    // console.log('data RESUMEN', res.data[0].periodos[0].resumen)

                    this.setState({
                        DataAniosApi: res.data,
                        DataMesesApi: res.data[0].periodos,
                        DataComponentesApi: res.data[0].periodos[0].componentes,
                        DataResumenApi: res.data[0].periodos[0].resumen,

                        // seteamos el nombre del componente
                        NombreComponente: 'RESUMEN DE VALORIZACION',

                        // capturamos montos de dinero en resumen
                        ppto: res.data[0].periodos[0].resumen.presupuesto,
                        monto_actual: res.data[0].periodos[0].resumen.valor_actual,

                        avance_anterior: res.data[0].periodos[0].resumen.valor_anterior,
                        porcentaje_anterior: res.data[0].periodos[0].resumen.porcentaje_anterior,

                        avance_actual: res.data[0].periodos[0].resumen.valor_actual,
                        porcentaje_actual: res.data[0].periodos[0].resumen.porcentaje_actual,

                        avance_acumulado: res.data[0].periodos[0].resumen.valor_total,
                        porcentaje_acumulado: res.data[0].periodos[0].resumen.porcentaje_total,

                        saldo: res.data[0].periodos[0].resumen.valor_saldo,
                        porcentaje_saldo: res.data[0].periodos[0].resumen.porcentaje_saldo,
                        // seteamos las fechas par ala carga por defecto
                        fecha_inicial: res.data[0].periodos[0].fecha_inicial,
                        fecha_final: res.data[0].periodos[0].fecha_final,

                    })
                }
            })
            .catch(err => {
                console.log('ERROR ANG' + err);
            });
    }

    TabsAnios(tab) {
        if (this.state.activeTabAnio !== tab) {
            this.setState({
                activeTabAnio: tab
            });
        }
    }

    TabsMeses(tab, fechaInicial, fechaFinal) {
        console.log('cero', tab,'Id componente', this.state.IdComponente ,'inicio', fechaInicial, 'fin', fechaFinal);        
        if (this.state.activeTabMes !== tab) {
            this.setState({
                activeTabMes: tab,
                fecha_inicial: fechaInicial,
                fecha_final: fechaFinal,
                NombreComponente: 'RESUMEN DE VALORIZACION',
                // montos de resumen de componentes
                // ppto:"",
                // monto_actual:"",
                // avance_anterior	:"",
                // avance_actual:"",	
                // avance_acumulado:"",	
                // saldo:""
            });




            if (this.state.IdComponente !== "") {
                // llamamos al api de partidas en valarizaciones------------------------------------------------------------------------------------------------------------------------------
                axios.post(`${UrlServer}/getValGeneralPartidas`,
                    {
                        "id_componente": this.state.IdComponente,
                        "fecha_inicial": fechaInicial,
                        "fecha_final": fechaFinal
                    }
                )
                .then((res) => {
                    // console.log('res partidas val desde tab meses>', res.data)
                    this.setState({
                        DataPartidasApi: res.data.partidas
                    })
                })
                .catch((err) => {
                    console.log('hay erres al solicitar la peticion al api, ', err);
                })


            } else {
                // llamamos a resumen--------------------------------------------------------------------------------------------------------------------------------
                axios.post(`${UrlServer}/getValGeneralResumenPeriodo`,
                    {
                        "id_ficha": sessionStorage.getItem("idFicha"),
                        "fecha_inicial": fechaInicial,
                        "fecha_final": fechaFinal,
                    }
                )
                    .then((res) => {
                        // console.log('resumen', res.data)
                        this.setState({
                            DataResumenApi: res.data,
                            // montos de resumen de componentes
                            ppto: res.data.presupuesto,
                            monto_actual: res.data.valor_actual,

                            avance_anterior: res.data.valor_anterior,
                            porcentaje_anterior: res.data.porcentaje_anterior,

                            avance_actual: res.data.valor_actual,
                            porcentaje_actual: res.data.porcentaje_actual,

                            avance_acumulado: res.data.valor_total,
                            porcentaje_acumulado: res.data.porcentaje_total,

                            saldo: res.data.valor_saldo,
                            porcentaje_saldo: res.data.porcentaje_saldo,
                        })
                    })
                    .catch((err) => {
                        console.log('hay erres al solicitar la peticion al api, ', err);
                    })
            }
        }

    }

    TabsComponentes(tab) {
        
        if (this.state.activeTabComponente !== tab) {
            this.setState({
                activeTabComponente: tab,   
                // montos en soles de componentes 
                soles_parcial: "",
                soles_anterior: "",
                soles_actual: "",
                soles_acumulado: "",
                soles_saldo: "",

            });

            if (tab !== "resumen") {
                // llamamos al api de partidas en valarizaciones
                axios.post(`${UrlServer}/getValGeneralTodosComponentes`,
                    {
                        "id_ficha": sessionStorage.getItem("idFicha"),
                        "fecha_inicial": this.state.fecha_inicial,
                        "fecha_final": this.state.fecha_final
                    }
                )
                .then((res) => {
                    // console.log('res partidas val', res.data)
                    this.setState({
                        DataPartidasApi: res.data.partidas,

                        // montos en soles de componentes 
                        soles_parcial: res.data.precio_parcial,

                        soles_anterior: res.data.valor_anterior,
                        soles_porcentaje_anterior: res.data.porcentaje_anterior,

                        soles_actual: res.data.valor_actual,
                        soles_porcentaje_actual: res.data.porcentaje_actual,

                        soles_acumulado: res.data.valor_total,
                        soles_porcentaje_acumulado: res.data.porcentaje_total,

                        soles_saldo: res.data.valor_saldo,
                        soles_porcentaje_saldo: res.data.porcentaje_saldo

                    })
                })
                .catch((err) => {
                    console.log('hay erres al solicitar la peticion al api, ', err);
                })
            }

        }
    }
    CargarExcel(){
        var DataPartidasApi = this.state.DataPartidasApi
        const input = document.getElementById('inputValorizacion')
        
        readXlsxFile(input.files[0]).then((rows ) => {
            //buscamos el numero 01
            var breakState = false
            var row = 0
            var col = 0
            for (let i = 0; i < rows.length; i++) {
                const fila = rows[i];
                for (let j = 0; j < fila.length; j++) {
                    const celda = fila[j];
                    if(celda=="01"){
                        row = i
                        col = j 
                        console.log("row",row,"col",col);
                        breakState =true
                        break;
                    }       
                }
                if(breakState){
                    break;
                }
            }
            //verificar igualdad de datos 
            var valorizacionIgualdad = {                
                partidas:[]
            }
            var valorizacionExcel = []

            var itemTotal = 0
     
            var metrado_actualTotal = 0
            var valor_actualTotal = 0

     

            console.log(rows[row-1][col+9]);
            // console.log(DataPartidasApi);
            
            for (let i = 0; i < DataPartidasApi.length; i++) {
                const partida = DataPartidasApi[i];
                var item = false
                var metrado_actual = false
                var valor_actual = false
                //verifica si los items son iguales
                if(partida.item !=rows[row+i][col]){
                    item = true
                    itemTotal++
                }

                //revision de metrados actuales
                if(partida.tipo == "partida" &&partida.metrado_actual.toFixed(2) !=rows[row+i][col+9].toFixed(2)){
                    metrado_actual = true
                    metrado_actualTotal++
                }
                //revision de valor de metrados actuales
                if(partida.tipo == "partida" &&partida.valor_actual.toFixed(2) !=rows[row+i][col+10].toFixed(2)){
                    valor_actual = true
                    valor_actualTotal++
                }

                //guarda la data
                valorizacionIgualdad.partidas.push(
                    {
                        item:item,
                        metrado_actual:metrado_actual.toFixed(2),
                        valor_actual:valor_actual.toFixed(2)
                    }
                )
                valorizacionExcel.push(
                    {
                        item:rows[row+i][col],
                        metrado_actual:(Number(rows[row+i][col+9])).toFixed(2),
                        valor_actual:(Number(rows[row+i][col+10])).toFixed(2),
                    }
                )

            }

            valorizacionIgualdad.itemTotal = itemTotal
            valorizacionIgualdad.metrado_actualTotal = metrado_actualTotal
            valorizacionIgualdad.valor_actualTotal = valor_actualTotal
            console.log("valorizacionExcel",valorizacionExcel);
            console.log("valorizacionIgualdad",valorizacionIgualdad);
            
            this.setState(
                {
                    valorizacionIgualdad:valorizacionIgualdad,
                    valorizacionExcel:valorizacionExcel
                }
            )
            if(itemTotal > 0 || metrado_actualTotal > 0 || valor_actualTotal > 0){
                alert("Su valorizacion tiene errores")
            }else{
                alert("Su valorizacion esta conforme al sistema")
            }

            

        })
            
    }

    render() {
        const { DataAniosApi, DataMesesApi, DataComponentesApi, DataResumenApi, DataPartidasApi, activeTabAnio, activeTabMes, activeTabComponente, NombreComponente,valorizacionIgualdad,valorizacionExcel } = this.state
        return (
            <div>
                {/* {DataAniosApi.length <= 0 ? <label className="text-center" >  <Spinner color="primary" size="sm" /></label>: */}
                {/* AÑOS */}
                <Nav tabs>
                    {DataAniosApi.map((anio, IA) =>
                        <NavItem key={IA}>
                            <NavLink className={classnames({ active: activeTabAnio === IA.toString() })} onClick={() => { this.TabsAnios(IA.toString()); }} >
                                {anio.anyo}
                            </NavLink>
                        </NavItem>
                    )}

                </Nav>

                {/* MESES */}
                <Nav tabs>

                    {DataMesesApi.map((mes, IMes) =>
                        <NavItem key={IMes}>
                            <NavLink className={classnames({ active: activeTabMes === IMes.toString() })} onClick={() => { this.TabsMeses(IMes.toString(), mes.fecha_inicial, mes.fecha_final) }} >
                                {mes.codigo}
                            </NavLink>
                        </NavItem>
                    )}

                </Nav>
                <Card className="m-1">
                    {/* COMPONENTES */}
                    <Nav tabs>
                        <NavItem >
                            <NavLink className={classnames({ active: activeTabComponente === "resumen" })} onClick={() => { this.TabsComponentes("resumen", "", "RESUMEN DE VALORIZACION") }} >
                                RESUMEN
                            </NavLink>
                        </NavItem>
                        <NavItem >
                    
                                <NavLink className={classnames({ active: activeTabComponente === "componentes" })} onClick={() => { this.TabsComponentes("componentes") }} >
                                componentes 
                            </NavLink>
                        </NavItem>
                     
                        

                    </Nav>

                    <Card className="m-1" >
                        <CardHeader>{NombreComponente}</CardHeader>
                       
                        <CardBody>
                            {
                                activeTabComponente === "resumen" 
                                    ?
                                    <div className="table-responsive">
                                        <table className="table table-bordered small table-sm mb-0">
                                            <thead className="resplandPartida">
                                                <tr className="text-center">
                                                    <th className="align-middle" rowSpan="3">N°</th>
                                                    <th className="align-middle" rowSpan="3">NOMBRE DEL COMPONENTE</th>
                                                    <th>S/. {this.state.ppto}</th>

                                                    <th>S/. {this.state.avance_anterior}</th>
                                                    <th>{this.state.porcentaje_anterior} %</th>

                                                    <th>S/. {this.state.avance_actual}</th>
                                                    <th>{this.state.porcentaje_actual} %</th>

                                                    <th>S/. {this.state.avance_acumulado}</th>
                                                    <th>{this.state.porcentaje_acumulado} %</th>

                                                    <th>S/. {this.state.saldo}</th>
                                                    <th>{this.state.porcentaje_saldo} %</th>
                                                </tr>
                                                <tr className="text-center">
                                                    <th>MONTO ACT.</th>
                                                    <th colSpan="2">AVANCE ANTERIOR</th>
                                                    <th colSpan="2" >AVANCE ACTUAL</th>
                                                    <th colSpan="2">AVANCE ACUMULADO</th>
                                                    <th colSpan="2">SALDO</th>
                                                </tr>
                                                <tr className="text-center">
                                                    <th>PPTO</th>
                                                    <th>MONTO</th>
                                                    <th>%</th>
                                                    <th >MONTO</th>
                                                    <th >%</th>
                                                    <th>MONTO</th>
                                                    <th>%</th>
                                                    <th>MONTO</th>
                                                    <th>%</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {DataResumenApi.length <= 0 ? <tr><td colSpan="11"></td></tr> :
                                                    DataResumenApi.componentes.map((ResumenC, iC) =>
                                                        <tr key={iC} >
                                                            <td>{ResumenC.numero}</td>
                                                            <td>{ResumenC.nombre} </td>
                                                            <td>{ResumenC.presupuesto}</td>

                                                            <td>{ResumenC.valor_anterior}</td>
                                                            <td>{ResumenC.porcentaje_anterior}</td>
                                                            <td className="bg-mm">{ResumenC.valor_actual}</td>
                                                            <td className="bg-mm">{ResumenC.porcentaje_actual}</td>
                                                            <td >{ResumenC.valor_total}</td>
                                                            <td>{ResumenC.porcentaje_total}</td>
                                                            <td>{ResumenC.valor_saldo}</td>
                                                            <td>{ResumenC.porcentaje_saldo}</td>
                                                        </tr>
                                                    )
                                                }

                                                <tr className="resplandPartida font-weight-bolder">
                                                    <td colSpan="2">TOTAL</td>
                                                    <td>S/. {this.state.ppto}</td>

                                                    <td>S/. {this.state.avance_anterior}</td>
                                                    <td>{this.state.porcentaje_anterior} %</td>

                                                    <td>S/. {this.state.avance_actual}</td>
                                                    <td>{this.state.porcentaje_actual} %</td>

                                                    <td>S/. {this.state.avance_acumulado}</td>
                                                    <td>{this.state.porcentaje_acumulado} %</td>

                                                    <td>S/. {this.state.saldo}</td>
                                                    <td>{this.state.porcentaje_saldo} %</td>

                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    :
                                   
                                    <div className="table-responsive">
                                     <input type="file" id="inputValorizacion" onChange={this.CargarExcel} />
                                    <Button onClick={this.CargarExcel} color="success" size="sm">RECARGAR</Button>
                                        <table className="table table-bordered table-sm small mb-0">
                                            <thead className="text-center resplandPartida">
                                                <tr>
                                                    <th colSpan="3" rowSpan="2" className="align-middle">DESCRIPCION</th>
                                                    <th colSpan="2" className="align-middle">S/. {this.state.soles_parcial}</th>
                                                    <th colSpan="3">S/. {this.state.soles_anterior}</th>
                                                    <th colSpan="3" >S/. {this.state.soles_actual}</th>
                                                    <th colSpan="3">S/. {this.state.soles_acumulado}</th>
                                                    <th colSpan="3">S/. {this.state.soles_saldo}</th>
                                                </tr>
                                                <tr>
                                                    <th colSpan="2">PRESUPUESTO</th>
                                                    <th colSpan="3">ANTERIOR</th>
                                                    <th colSpan="3">ACTUAL</th>
                                                    <th colSpan="3">ACUMULADO</th>
                                                    <th colSpan="3">SALDO</th>
                                                </tr>
                                                <tr>
                                                    <th>ITEM</th>
                                                    {valorizacionIgualdad && valorizacionIgualdad.itemTotal ?
                                                    <th>{valorizacionIgualdad.itemTotal} err</th>
                                                    :""}
                                                    <th>DESCRIPCION</th>
                                                    <th>METRADO</th>
                                                    <th>P. U. S/.</th>
                                                    <th>P. P S/.</th>

                                                    <th>MET. </th>
                                                    <th>VAL</th>
                                                    <th>%</th>

                                                    <th>MET.</th>
                                                    {valorizacionIgualdad && valorizacionIgualdad.metrado_actualTotal ?
                                                    <th>{valorizacionIgualdad.metrado_actualTotal} err</th>
                                                    :""}    
                                                    <th>VAL</th>
                                                    {valorizacionIgualdad && valorizacionIgualdad.valor_actualTotal ?
                                                    <th>{valorizacionIgualdad.valor_actualTotal} err</th>
                                                    :""}
                                                    <th>%</th>

                                                    <th>MET.</th>
                                                    <th>VAL</th>
                                                    <th>%</th>

                                                    <th>MET.</th>
                                                    <th>VAL</th>
                                                    <th>%</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {
                                                    DataPartidasApi.map((partidas, Ipart) =>
                                                        <tr key={Ipart} className={partidas.tipo === "titulo" ? "font-weight-bold text-warning" : "font-weight-light"}>
                                                            <td>{partidas.item}</td>
                                                          {valorizacionIgualdad && valorizacionIgualdad.itemTotal ?
                                                            <td className={valorizacionIgualdad&&valorizacionIgualdad.partidas[Ipart].item?"bg-danger text-white":""} >{valorizacionExcel[Ipart].item}</td>
                                                          :""}
                                                            <td>{partidas.descripcion}</td>
                                                            <td>{partidas.metrado}</td>
                                                            <td>{partidas.costo_unitario}</td>
                                                            <td>{partidas.precio_parcial}</td>

                                                            <td>{partidas.metrado_anterior}</td>
                                                            <td>{partidas.valor_anterior}</td>
                                                            <td>{partidas.porcentaje_anterior}</td>

                                                            <td className="bg-mm">{partidas.metrado_actual}</td>

                                                            {valorizacionIgualdad && valorizacionIgualdad.itemTotal ?
                                                            <td className={valorizacionIgualdad&&valorizacionIgualdad.partidas[Ipart].metrado_actual?"bg-danger text-white":"bg-metrado_actual"} >{valorizacionExcel[Ipart].metrado_actual}</td>
                                                          :""}
                                                            <td className="bg-mm">{partidas.valor_actual}</td>
                                                            {valorizacionIgualdad && valorizacionIgualdad.itemTotal ?
                                                            <td className={valorizacionIgualdad&&valorizacionIgualdad.partidas[Ipart].valor_actual?"bg-danger text-white":"bg-valor_actual"} >{valorizacionExcel[Ipart].valor_actual}</td>
                                                          :""}
                                                            <td className="bg-mm">{partidas.porcentaje_actual}</td>

                                                            <td>{partidas.metrado_total}</td>
                                                            <td>{partidas.valor_total}</td>
                                                            <td>{partidas.porcentaje_total}</td>

                                                            <td>
                                                                {partidas.metrado_saldo === 0 ? <div className="text-success text-center"><MdDone size={20} /></div> :
                                                                    partidas.metrado_saldo
                                                                }
                                                            </td>
                                                            <td>
                                                                {partidas.valor_saldo === 0 ? "" :
                                                                    partidas.valor_saldo
                                                                }
                                                            </td>
                                                            <td>
                                                                {partidas.porcentaje_saldo === 0 ? "" :
                                                                    partidas.porcentaje_saldo
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                }

                                                <tr className="resplandPartida">
                                                    <td colSpan="3">TOTAL</td>
                                                    <td colSpan="2">S/. {this.state.soles_parcial}</td>

                                                    <td colSpan="2">S/. {this.state.soles_anterior}</td>
                                                    <td>{this.state.soles_porcentaje_anterior} %</td>

                                                    <td colSpan="2" >S/. {this.state.soles_actual}</td>
                                                    <td>{this.state.soles_porcentaje_actual} %</td>

                                                    <td colSpan="2">S/. {this.state.soles_acumulado}</td>
                                                    <td>{this.state.soles_porcentaje_acumulado} %</td>

                                                    <td colSpan="2">S/. {this.state.soles_saldo}</td>
                                                    <td>{this.state.soles_porcentaje_saldo} %</td>

                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                            }

                        </CardBody>
                       
                        <Button onClick={this.CargarExcel} color="success" size="sm">RECARGAR</Button>
                        
                    </Card>
                
                </Card>
            </div>
        );
    }
}

export default ValorizacionGeneral;