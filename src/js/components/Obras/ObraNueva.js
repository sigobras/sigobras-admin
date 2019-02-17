import React, { Component } from 'react';
import axios from 'axios'
import { UrlServer } from '../Utils/ServerUrlConfig'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner } from 'reactstrap';
import readXlsxFile from 'read-excel-file'

class ObraNueva extends Component {
    constructor(){
        super()
        this.state = {
            DatosObras:{},
            statusRes:'',
            DataListaEstados:[],
            IdEstadoObra:'',
            DataComponentes:[]
        }
        this.CargaDatosExcelObra = this.CargaDatosExcelObra.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.CargaDatosExcelComponentes = this.CargaDatosExcelComponentes.bind(this)

    }

    componentWillMount(){
        axios.get(`${UrlServer}/listaEstados`)
        .then((res)=>{
            // console.info('dataEstados',res.data)
            this.setState({
                DataListaEstados:res.data
            })
        })
        .catch((error)=>
            console.error('falló al obtener los datos del servidor', error)
        )
    }

    CargaDatosExcelObra(){
        
        const input = document.getElementById('inputDatosObra')
        input.addEventListener('change', () => {
            readXlsxFile(input.files[0]).then((rows ) => {
                // console.log('><<', rows)
                var ObrasEstructurado = {}

                    ObrasEstructurado.codigo = rows[0][1]
                    ObrasEstructurado.fecha_inicial = rows[1][1]
                    ObrasEstructurado.fecha_final = rows[2][1]
                    ObrasEstructurado.g_sector = rows[3][1]
                    ObrasEstructurado.g_pliego = rows[4][1]
                    ObrasEstructurado.g_uni_ejec = rows[5][1]
                    ObrasEstructurado.g_func = rows[6][1]
                    ObrasEstructurado.g_prog = rows[7][1]
                    ObrasEstructurado.g_subprog = rows[8][1]
                    ObrasEstructurado.g_tipo_act = rows[9][1]
                    ObrasEstructurado.g_tipo_comp = rows[10][1]
                    ObrasEstructurado.g_meta = rows[11][1]
                    ObrasEstructurado.g_snip = rows[12][1]
                    ObrasEstructurado.g_total_presu = rows[13][1]
                    ObrasEstructurado.g_local_dist = rows[14][1]
                    ObrasEstructurado.g_local_reg = rows[15][1]
                    ObrasEstructurado.g_local_prov = rows[16][1]
                    ObrasEstructurado.f_fuente_finan = rows[17][1]
                    ObrasEstructurado.f_entidad_finan = rows[18][1]
                    ObrasEstructurado.f_entidad_ejec = rows[19][1]
                    ObrasEstructurado.tiempo_ejec = rows[20][1]
                    ObrasEstructurado.modalidad_ejec = rows[21][1]
                    ObrasEstructurado.id_estado = this.state.IdEstadoObra
                    ObrasEstructurado.componentes = this.state.DataComponentes

                        
                // }

                // console.log('ObrasEstructurado', ObrasEstructurado);
                // console.log('ObrasEstructurado', dataArray);
                
                this.setState({
                    DatosObras:ObrasEstructurado
                })
            })
            .catch((error)=>{
                alert('algo salió mal')
                console.log(error);
            })
        })
    }
    handleSubmit(e){
        e.preventDefault()
          axios.post(`${UrlServer}/nuevaObra`,
              this.state.DatosObras
          ) 
          .then((res)=> {
              if(res.data){
                alert('datos de la obra ingresados al sistema de manera existosa codigo '+res.status)
                console.info('enviado con exito', res.data);
              }
              this.setState({
                statusRes:res.data
              })
              sessionStorage.setItem('datosObras', JSON.stringify(res.data))
          })
          .catch((error)=> {
              console.error('ALGO SALIO MAN AL INGRESAR LOS DATOS DE LA OBRA',error);
          });
    }

    CargaDatosExcelComponentes(){
        
        const input = document.getElementById('inputComponentes')
        input.addEventListener('change', () => {
            readXlsxFile(input.files[0]).then((rows ) => {
                var dataArray = []
                for (let index = 0; index < rows.length; index++) {
                    var datos = Object.assign({},rows[index])
                    dataArray.push(datos)
                }
                this.setState({
                    DataComponentes:dataArray
                })
            })
            .catch((error)=>{
                alert('algo salió mal')
                
                console.log(error);
                
            })
        })
    }
    render() {
        const { DatosObras, DataListaEstados,IdEstadoObra, DataComponentes } = this.state
        return (
            <div>
                
                <Card>
                    <CardHeader>
                        Ingreso de obra Nueva 
                        <div className="float-right">
                            <select className="form-control form-control-sm m-0" onChange={e =>this.setState({IdEstadoObra:e.target.value })}>
                                <option>Selecione</option>
                                {DataListaEstados.map((EstadosObra, i)=>
                                    <option key={ i } value={ EstadosObra.id_Estado }>{ EstadosObra.nombre}</option>
                                )}
                            </select>
                        </div>
                    </CardHeader>
                    {IdEstadoObra === ''?<span className="text-danger h4 text-center p-2">Selecione el estado actual de la obra</span>:
                        <CardBody>

                            <fieldset>
                                <legend><b>Datos de comonentes</b></legend>
                                <input type="file" id="inputComponentes" onClick={this.CargaDatosExcelComponentes} />
                                <code>
                                    <pre> {JSON.stringify(DataComponentes, null , ' ')}</pre>
                                </code>
                            </fieldset>

                            <fieldset>
                                <legend><b>Cargar archivo excel con datos de la obra</b></legend>
                                <input type="file" id="inputDatosObra"  onClick={this.CargaDatosExcelObra}  />
                                <b>{IdEstadoObra}</b>
                                <code>
                                    <pre> {JSON.stringify(DatosObras, null , ' ')}</pre>
                                </code>
                                <button onClick={(e)=>this.handleSubmit(e)} className="btn btn-outline-success">  <Spinner color="primary"/>Guardar datos</button>
                            </fieldset>
                        </CardBody>
                    }
                </Card>
            </div>
        );
    }
}

export default ObraNueva;