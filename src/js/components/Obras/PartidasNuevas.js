import React, { Component } from 'react'
import readXlsxFile from 'read-excel-file'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner, Row, Col, UncontrolledPopover, PopoverBody } from 'reactstrap';
import axios from 'axios'
import { UrlServer } from '../Utils/ServerUrlConfig'
import { Redondea } from '../Utils/Funciones'
import ReactJson from 'react-json-view'

class PartidasNuevas extends Component {
    constructor(){
        super()
        this.state={
            DataComponentes:[],
            Data1:[],
            Data2:[],
            Errores1:[],
            Errores2:[],
            erroresEncontrado:'',
            DataFinal:[],
            DataPlanilla:[],
            IdObra:'',
            idPresupuesto:'',
            idComponente:'',
            DataErrores:[],
            estadoPartidas:'',
            erroresSuma:[],
            itemsErroneos:[],
            erroresSecuenciaItems:[]
            
        }
        this.CostosUnitarios = this.CostosUnitarios.bind(this)
        this.PlanillaMetrados = this.PlanillaMetrados.bind(this)
        this.verificarDatos = this.verificarDatos.bind(this)
        this.EnviarDatos = this.EnviarDatos.bind(this)
        this.clickSelect = this.clickSelect.bind(this)

    }

    componentWillMount(){
        var dataObra = sessionStorage.getItem("datosObras")
        var estado = sessionStorage.getItem("estado")
        dataObra = JSON.parse(dataObra) 
        console.log('datoss>', dataObra)
        // sessionStorage.getItem("datosObras")
        
        dataObra = dataObra || {}
        this.setState({
            DataComponentes:dataObra.componentes||[],
            IdObra:dataObra.id_ficha,
            estadoPartidas:estado
        })

    }

    CostosUnitarios(){
        
        const input = document.getElementById('input1')
        input.addEventListener('change', () => {
            readXlsxFile(input.files[0]).then((rows) => {

                // console.log('> ', rows)
                var procesoBucarElemento = 1
                var dataSubmit = []
                var partida = {}
                var ObRecurso = []
                var zonaRecursos = false
                var tipoRecurso = null
                for (let index = 0; index < rows.length; index++) {
                    
                    // busca el valor de partida
                    if(rows[index][0] === "Partida"){
                        dataSubmit.push(partida)
                        partida = {}
                        partida.recursos = []
                        partida.item = rows[index][1]
                        partida.descripcion = rows[index][3]
                        procesoBucarElemento++

                    }else if (rows[index][0] === "Rendimiento") {
                        // busca unidad de medida, eq y costo unitario
                        partida.unidad_medida = rows[index][1]
                        partida.costo_unitario = rows[index][7]

                        for (let i = 0; i < rows[index].length; i++) {
                            if(rows[index][i] === "EQ."){
                                if(rows[index][i+1] === null){
                                    partida.equipo = 1
                                }else{
                                    partida.equipo = rows[index][i+1]
                                }
                            }
                        }

                        // console.log('sss>>',rows[index])

                        if(rows[index][1] === "GLB/DIA" && rows[index][2] === null){
                            partida.rendimiento = 1;

                        }else if(rows[index][2] === "MO."){
                            partida.rendimiento = rows[index][3]
                        }else{
                            partida.rendimiento = rows[index][2] 
                        }

                    }else if (rows[index][0] === "Código" ) {
                        //buscamos el nombre del recurso
                        index++
                        for (let i = 0; i < rows[index].length; i++) {
                            if(rows[index][i] !== null ){
                                tipoRecurso = rows[index][i]
                            }
                        }
                        zonaRecursos = true

                    // zona de recursos
                    }else if ( zonaRecursos === true){
                        
                        // busca el tipo de material
                        var valorExiste = 0 
                        var temp = ''
                        for (let k = 0; k < rows[index].length; k++) {
                            const element = rows[index][k];
                            if(element !== null && typeof element !== 'number' ){
                                temp = element
                                valorExiste++
                            }
                            
                        }
                        if(valorExiste === 1){
                            // console.log('dddsasasas',temp,'>>> ',rows[index]);
                            
                            tipoRecurso = temp
                        }
                        
                        
                       
                        
                        if (rows[index][0] !== null ) {
                            ObRecurso.push(tipoRecurso)
                             ObRecurso.push(rows[index][0])
                            var columnaRecurso = 2
                            // revisa toda la fila
                            for (let i = 1; i < rows[index].length; i++) {
                                if (rows[index][i] !== null ) {
                                    if(columnaRecurso === 2){
                                        ObRecurso.push(rows[index][i])
                                        columnaRecurso++
                                    }else if(columnaRecurso === 3){
                                        ObRecurso.push(rows[index][i])
                                        columnaRecurso++
                                    }else if(columnaRecurso === 4){
                                        ObRecurso.push( rows[index][i])
                                        columnaRecurso++
                                    }else if(columnaRecurso === 5){
                                        ObRecurso.push(rows[index][i])
                                        columnaRecurso++
                                    }else if(columnaRecurso === 6){
                                        ObRecurso.push(rows[index][i])
                                        columnaRecurso++
                                    }else if(columnaRecurso === 7){
                                        ObRecurso.push( rows[index][i])
                                        columnaRecurso++
                                    }
                                }
                            }
                            // 
                            if(ObRecurso.length < 8){
                                ObRecurso.splice(4,0, null)
                            }
                            
                            partida.recursos.push(ObRecurso)
                            ObRecurso = []

                        }else if(rows[index][0] === null &&  rows[index][2] !== null){
                            tipoRecurso = rows[index][2]
                        }
                    }
                }
                dataSubmit.push(partida)
                // console.log('dataSubmit > ', dataSubmit)
                dataSubmit = dataSubmit.slice(1,dataSubmit.length)

                this.setState({
                    Data1:dataSubmit
                })

            })
            .catch((error)=>{
                alert('algo salió mal')
                console.log(error);
            })
        })
    }

    PlanillaMetrados(){        
        const input = document.getElementById('input2')
        var temp = 0
        var data2 = []
        var tipo = ""
        var obPlanilla = {}
        input.addEventListener('change', () => {
            console.log('input', input.files[0].type)
            if(input.files[0].type ==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
                readXlsxFile(input.files[0]).then((rows ) => {
                    // console.log('rows>> ', rows)
                    var fila = 0
                    var columna = 0
                    // UBICANDO LA POSICION DE LA PALABRA ITEM
                    for (let index = 0; index < rows.length; index++) {

                        for (let i = 0; i < rows[index].length; i++) {
                            // console.log(rows[index][i])

                            var item = rows[index][i]
                            if (typeof item === 'string') {
                        
                            item = item.toLowerCase()  
                            }

                            // console.log('item', item)
                            
                            if(item === 'item' || item === 'Partida'){
                                fila = index
                                columna = i
                                console.log('plabra item fila : %s columna %s', fila+1 ,columna+1)

                                break
                            }
                        }
                        
                    }

                    //revisando items bien estructurados y secuencia de items
                    function itemStructure(data){		
                        var regla =/^\d{2}(\.\d{2})*$/
                        return data.match(regla)
                    }
                    function predecirItem (data){
                        var listaNumeros = data.split(".")	
                        var opciones = []
                        var numTemp = ""
                        for (let i = 0; i < listaNumeros.length; i++) {
                            const numero = listaNumeros[i];
                            if(i == 0){
                                numTemp += numero
                            }else{
                                numTemp += "."+numero
                            }
                            var last2 = numTemp.slice(-2)
                            last2 = Number(last2)
                            last2++
                            last2 = "0"+last2
                            var numTemp2 =  numTemp.slice(0,numTemp.length-2)+last2.slice(-2)
                            opciones.push(numTemp2)
                        }
                        numTemp += ".01"
                        opciones.push(numTemp)

                        return opciones                
                    }
                    var itemsErroneos = []
                    var erroresSecuenciaItems = []
                    var opciones = ["01"]
                    var itemPrevio = "01"
                    for (let index = fila+2; index < rows.length; index++) {
                        const row = rows[index];
                        if(row[columna] && !itemStructure(row[columna])){
                            itemsErroneos.push(row[columna])
                        }
                       
                        
                        if(row[columna]){
                            if(opciones.indexOf(row[columna]) == -1){
                                console.log("opciones",opciones);
                                console.log("item",row[columna]);
                                console.log("indexof",opciones.indexOf(row[columna]));
                                erroresSecuenciaItems.push(
                                    {
                                        itemPrevio:itemPrevio,
                                        itemActual:row[columna]
                                    }
                                )
                            }
                            
                            opciones = predecirItem(row[columna])
                            itemPrevio = row[columna]

                        }                        
                      
                    }
                    // console.log("itemsErroneos",itemsErroneos);
                    // console.log("erroresSecuenciaItems",erroresSecuenciaItems);
                    this.setState({
                        itemsErroneos:itemsErroneos,
                        erroresSecuenciaItems:erroresSecuenciaItems                       
                    })
                    //--------------------------------------------------------//
                                   

                    // CREAMOS EL DATA DE PLANILLA DE METRADOS
                    
                    for (let index = fila+2; index < rows.length; index++) {
                        temp = rows[index]
                        var cantcols = 0
                        
                        for (let l = 0; l < rows[index].length; l++) {
                            const celda = rows[index][l];
                            if(celda !== null ){
                                cantcols++
                            }
                        }
                        
                        if((rows[index][columna+6] !== null ||rows[index][columna+7] !== null) && rows[index][columna] !== null ){
                            tipo = "partida"
                            // si la columna total tiene un valor
                            data2.push(obPlanilla)
                            obPlanilla = {}
                            obPlanilla.tipo = "partida"
                            obPlanilla.item =  rows[index][columna]
                            obPlanilla.descripcion =  rows[index][columna+1]
                            obPlanilla.actividades = []
                            obPlanilla.veces = rows[index][columna+2]
                            obPlanilla.largo = rows[index][columna+3]
                            obPlanilla.ancho = rows[index][columna+4]
                            obPlanilla.alto = rows[index][columna+5]
                            obPlanilla.parcial = rows[index][columna+6]
                            obPlanilla.metrado = Number(rows[index][columna+7].toFixed(2))
                        }else if(rows[index][columna] === null && (rows[index][columna+6] !== null)||(rows[index][columna+7] !== null)){
                            tipo = "actividad subtitulo"
                            var obActividades = []
                            // titulo                            
                            obActividades.push("subtitulo")
                            // nombre                            
                            obActividades.push(rows[index][columna+1])
                            // veces
                            obActividades.push(rows[index][columna+2])
                            // largo
                            obActividades.push(rows[index][columna+3])
                            // ancho
                            obActividades.push(rows[index][columna+4])
                            // alto
                            obActividades.push(rows[index][columna+5])
                            // parcial
                            if(rows[index][columna+7] !== null){
                                obActividades.push(Number(rows[index][columna+7].toFixed(2)))
                            }else{
                                obActividades.push(Number(rows[index][columna+6].toFixed(2)))
                            }               
     
                            obPlanilla.actividades.push(obActividades)
                        }else if(rows[index][columna] !== null&&rows[index][columna+1] !== null){
                            // TITULOS
                            tipo = "titulo"
                            data2.push(obPlanilla)
                            obPlanilla = {}
                            obPlanilla.tipo = "titulo"
                            obPlanilla.item =  rows[index][columna]
                            obPlanilla.descripcion =  rows[index][columna+1]
                            obPlanilla.veces = null
                            obPlanilla.largo = null
                            obPlanilla.ancho = null
                            obPlanilla.alto = null
                            obPlanilla.parcial = null
                            obPlanilla.metrado = null
                            obPlanilla.unidad_medida = null
                            obPlanilla.costo_unitario = null
                            obPlanilla.equipo = null
                            obPlanilla.rendimiento = null
                            // obPlanilla.actividades = []
                        }else if(rows[index][columna+1] !== null){
                            tipo = "actividad titulo"
                            var obActividades = []
                            // titulo                            
                            obActividades.push("titulo")
                            // nombre                            
                            obActividades.push(rows[index][columna+1])
                            // veces
                            obActividades.push(null)
                            // largo
                            obActividades.push(null)
                            // ancho
                            obActividades.push(null)
                            // alto
                            obActividades.push(null)
                            // parcial
                            obActividades.push(null)
     
                            obPlanilla.actividades.push(obActividades)
                        }
                        
                    }
                    data2.push(obPlanilla)
                    data2 = data2.slice(1,data2.length)


                        // insertando actividades unicas
                    for (let j = 0; j < data2.length; j++) {
                        tipo = "actividades unicas"
                        if(typeof data2[j].actividades !== 'undefined' && data2[j].actividades.length === 0 ){
                            var obActividades = []
                            // convertimos variable si no es null
                            var veces = data2[j].veces
                            var largo = data2[j].largo
                            var alto = data2[j].alto
                            var ancho = data2[j].ancho
                            var metrado = data2[j].metrado

                            veces = (veces === null) ? veces  : Number( veces).toFixed(2)
                            largo = (largo === null )? largo : Number( largo).toFixed(2)
                            alto = (alto === null )? alto : Number( alto).toFixed(2)
                            ancho = (ancho === null )? ancho : Number( ancho).toFixed(2)
                            metrado = (metrado === null )? metrado : Number( metrado.toFixed(2))

                            // console.log('verifica >', typeof veces ,'>' , veces)

                            
                            obActividades.push("subtitulo")
                            obActividades.push("Actividad unica")
                            obActividades.push(veces)
                            obActividades.push(largo)
                            obActividades.push(alto)
                            obActividades.push(ancho)
                            obActividades.push(metrado)

                            data2[j].actividades.push(obActividades)
                        }
                    }
                    //revisando sumatorias de actividades
                    var erroresSuma = []
                    for (let index = 20; index < data2.length; index++) {
                        const partida = data2[index];
                        var suma = 0; 
                        
                        if(partida.tipo == "partida"){
                            
                            for(let j = 0; j < partida.actividades.length; j++) {
                                
                                
                                const parcial = partida.actividades[j][6];
                                suma+= parcial    
                                
                                
                            }
                            
                                
                            if (data2[index].metrado !=suma.toFixed(2)) {
                                
                                erroresSuma.push(
                                    {
                                        "item":data2[index].item,
                                        "total":Number(data2[index].metrado),
                                        "suma":suma.toFixed(2)
                                    }
                                )
                            }
                            
                        }
                        
                        
                    }
          
                    this.setState({
                        Data2:data2,
                        DataPlanilla:[...data2],
                        erroresSuma:erroresSuma
                    })
                

                })
                .catch((error)=>{
                     var DataErrores = []
                        DataErrores.push(data2[data2.length-1].tipo+ " ? => "+data2[data2.length-1].item +" "+data2[data2.length-1].descripcion, 
                        obPlanilla.tipo+" ? =>  "+obPlanilla.item+" "+obPlanilla.descripcion, tipo+" ? => "+temp[0]+" ?"+temp[1]+" ? "+temp[2]+" ? "+temp[3])
               

                    alert('algo salió mal')
                    this.setState({DataErrores})
                    console.log(DataErrores);
                    
                })
            }else{
                alert('tipo de archivo no admitido cargue solo archivos con extension .xlsx')
            }
        })
    }
    verificarDatos(){
        const { Data1, Data2, idComponente, DataPlanilla, idPresupuesto } = this.state
        
        var Errores = 0
        var ErroresArray1 = []
        var ErroresArray2 = []


        // eliminamos los titulo del  array 
        for (let i = 0; i < Data2.length; i++) {
            const tipo = Data2[i].tipo;
            if (tipo === 'titulo') {
                Data2.splice(i,1)
                i--
            }
        }
        
        // verifica que sean del mismo tamaño los datas de Costos unitarios y Planilla de metrados

        if(Data1.length !== Data2.length){

            for (let i = 0; i < Data1.length; i++) {
                var data = Data1[i]
                 var encontrado = false
                for (let j = 0; j < Data2.length; j++) {
                    if(data.item === Data2[j].item){
                        console.log('<>>', data[0] === Data2[j][0])
                        encontrado = true
                        break
                    }                   
                }
                if (!encontrado){
                    ErroresArray1.push(data)
                }
            }
            Errores = 'tamaños diferentes'
        }else{

            for (let index = 0; index < Data1.length; index++) {
                
                if(Data1[index].item === Data2[index].item){
                    // console.log('coincide')
                }else{
                    // console.log('algo no coincide')
                    Errores++
                    // console.log(Data1[index] ,  Data2[index])
                    // alert("ACU" +Data1[index].item+" - planilla "+Data2[index].item)
                    ErroresArray1.push(Data1[index])
                    ErroresArray2.push(Data2[index])

                    
                }
                
            }
        }
        // console.log('errores encontrados', Errores)
        // uniendo planilla de datos y acu

        if(Errores === 0){
            
            var indexData1 = 0
            for (let i = 0; i < DataPlanilla.length; i++) {
                if(DataPlanilla[i].tipo === 'partida'){
                    delete DataPlanilla[i]['nombre']
                    DataPlanilla[i].item = Data1[indexData1].item
                    DataPlanilla[i].descripcion = Data1[indexData1].descripcion
                    DataPlanilla[i].unidad_medida = Data1[indexData1].unidad_medida
                    DataPlanilla[i].costo_unitario = Data1[indexData1].costo_unitario
                    DataPlanilla[i].equipo = Data1[indexData1].equipo
                    DataPlanilla[i].rendimiento = Data1[indexData1].rendimiento
                    DataPlanilla[i].recursos = Data1[indexData1].recursos
                    
                    indexData1++
                }
                DataPlanilla[i].componentes_id_componente = idComponente
                // DataPlanilla[i].presupuestos_id_presupuesto = idPresupuesto
                

            }
        }
        // console.log('data modificada DataPlanilla', DataPlanilla)
        
        this.setState(
            {
                Errores1: ErroresArray1,
                Errores2: ErroresArray2,
                erroresEncontrado:'Errores encontrados : '+Errores,
                DataFinal: (Errores =='tamaños diferentes'||Errores > 0 )? ErroresArray1:DataPlanilla 

            }
        )
    }


    EnviarDatos(){  
       console.log(
        {
            "estado":this.state.estadoPartidas,
            "data": this.state.DataFinal                
        }
       );
       
        if(confirm('Estas seguro de enviar las partidas !este proceso es irreversible')){
            axios.post(`${UrlServer}/nuevasPartidas`,
            {
                "estado":this.state.estadoPartidas,
                "data": this.state.DataFinal                
            }            
            )
            .then((res)=>{
                console.log('partidas ', res);
                alert('todo okey se ingresaron las partidas')
            })
            .catch((error)=>{
                console.log('algo salio mal ERROR',error);
                alert('Algo salio mal')

                
            })
        }
    }

    clickSelect(idComponente, idPresupuesto){
        console.log('idComponente>', idComponente, 'idPresupuesto>', idPresupuesto);
        this.setState({
            idComponente:idComponente,
            idPresupuesto:idPresupuesto
        })
    }
    render() {
        const { Data1, Data2, DataErrores,erroresSuma, DataFinal, DataComponentes, idComponente, IdObra, idPresupuesto,itemsErroneos,erroresSecuenciaItems } = this.state
        return (
            <div>
                <Card>
                    <CardHeader className="p-2">
                            Ingreso de Partidas a la obra con id:  <strong>{ `${IdObra} ID PRESUPUESTO :${ idPresupuesto }`}</strong>
                            <label className="float-right  mb-0">
                                
                                <Button id="PopoverClick" type="button">selecione </Button>
                                <UncontrolledPopover trigger="legacy" placement="bottom" target="PopoverClick">
                                    <PopoverBody>
                                        {DataComponentes.length === undefined ? '': DataComponentes.map((componete,i)=>
                                            <div key={i}>
                                                <a href="#" onClick={e=>this.clickSelect(componete.idComponente, componete.idPresupuesto)}>N° Comp( {componete.numero} )</a>
                                                <div className="divider"></div>
                                            </div>
                                        )}
                                    </PopoverBody>
                                </UncontrolledPopover>
                            </label>
                    </CardHeader>
                    {idComponente === '' ? <h1 className="text-center ">Seleccione Un compomente</h1>:
                        <CardBody>
                            <label> Numero de componete selecionado: { idComponente }</label>
                            <Row>
                                <Col sm="4">
                                    <fieldset>
                                        <legend><b>cargar datos de Costos unitarios</b></legend>
                                        <input type="file" id="input1" onClick={this.CostosUnitarios} />
                                            <code>
                                                <ReactJson src={Data1}  name="Data1" theme="monokai" collapsed={2} displayDataTypes={false}/>
                                            </code>
                                        
                                    </fieldset>
                                </Col>
                                <Col sm="4">
                                    <fieldset>
                                        <legend><b>cargar datos de Planilla de metrados</b></legend>
                                        
                                        <input type="file" id="input2" onClick={this.PlanillaMetrados} />
                                        <hr/>
                                        {DataErrores.map((err, i)=>
                                            <label className="text-danger">{ err}</label>
                                        )}
                                        <hr/>
                                        {itemsErroneos.map((err, i)=>
                                            <label className="text-danger">Item mal escrito {err}</label>
                                        )}
                                         <hr/>
                                        {erroresSecuenciaItems.map((err, i)=>
                                            <label className="text-danger"> {"item previo "+err.itemPrevio+" item actual "+err.itemActual} </label>
                                        )}
                                        {erroresSuma.map((err, i)=>
                                        <div>
                                            <label className="text-danger">{ err.item +" total partida: "+ err.total+" suma actividades: "+err.suma}</label><br/>
                                        </div>
                                            
                                        )}
                                        <code className="small">
                                            <ReactJson src={Data2} name="Data2"  theme="monokai" collapsed={2} displayDataTypes={false}/>
                                        </code>
                                    </fieldset>
                                </Col>
                                <Col sm="4">
                                    <fieldset>
                                        <legend><b>Opciones de manejo de los datos cargados</b></legend>
                                        <button className="btn btn-outline-warning" onClick={this.verificarDatos}> verificar datos</button>
                                        <i>{this.state.erroresEncontrado}</i>             
                                        <button className="btn btn-outline-success" onClick={this.EnviarDatos}> Guardar datos </button>               
                                        
                                        <code>
                                            <ReactJson src={DataFinal}  name="DataFinal"  theme="monokai" collapsed={2} displayDataTypes={false}/>
                                        </code>
                                      
                                        

                                    </fieldset>
                                </Col>
                            </Row>
                                        
                        </CardBody>
                    }
                    <CardFooter>___</CardFooter>
                </Card>
            </div>
        )
    }
}
export default PartidasNuevas;
