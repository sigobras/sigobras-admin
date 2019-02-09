import React, { Component } from 'react';
import axios from 'axios'
import { UrlServer } from '../Utils/ServerUrlConfig'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner } from 'reactstrap';
import readXlsxFile from 'read-excel-file'

class ObraNueva extends Component {
    constructor(){
        super()
        this.state = {
            DatosObras:[],
            statusRes:''
        }
        this.CargaDatosExcelObra = this.CargaDatosExcelObra.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    CargaDatosExcelObra(){
        
        const input = document.getElementById('inputDatosObra')
        input.addEventListener('change', () => {
            readXlsxFile(input.files[0]).then((rows ) => {
                console.log('><<', rows)
                var dataArray = []
                var ObrasEstructurado = {}


                // for (let index = 0; index < rows.length; index++) {
                
                    // console.log('rows[index][i]', rows[index][1]);

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
                        
                // }
                dataArray.push(ObrasEstructurado)

                console.log('ObrasEstructurado', ObrasEstructurado);
                // console.log('ObrasEstructurado', dataArray);
                
                this.setState({
                    DatosObras:dataArray
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
        console.log('funcionando')
          axios.post(`${UrlServer}/nuevaObra`,
              this.state.DatosObras
          ) 
          .then((res)=> {
              console.log('enviado con exito', res);
              if(res.data === 1){
                  alert('datos de la obra ingresados al sistema de manera existosa codigo '+res.status)
              }
              this.setState({
                  status:res.data
              })
              sessionStorage.setItem('idObra',res.data)
          })
          .catch((error)=> {
              console.log(error);
          });
    }

    render() {
        const { DatosObras } = this.state
        return (
            <div>
                
                <Card>
                    <CardHeader>Ingreso de obra Nueva</CardHeader>
                    <CardBody>
                        <fieldset>
                            <legend><b>Cargar archivo excel con datos de la obra</b></legend>
                            <input type="file" id="inputDatosObra"  onClick={this.CargaDatosExcelObra}  />
                            <code>
                                <pre> {JSON.stringify(DatosObras, null , ' ')}</pre>
                            </code>
                            <button onClick={(e)=>this.handleSubmit(e)} className="btn btn-outline-success">  <Spinner color="primary"/>Guardar datos</button>
                        </fieldset>
                    </CardBody>
                    <CardFooter>___</CardFooter>
                </Card>
            </div>
        );
    }
}

export default ObraNueva;