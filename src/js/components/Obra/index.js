import React, { useEffect, useState, Fragment, forwardRef, useImperativeHandle, useRef } from 'react';
import { InputGroupAddon, InputGroupText, InputGroup, Nav, NavItem, NavLink, Input, Row, Col, Form, Label, FormGroup } from 'reactstrap';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig';
import { Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1),
	},
}));

export default () => {
	
	const [Loading, setLoading] = useState(false);
	const classes = useStyles();


	useEffect(() => {
		fetchFichaData()
		return () => {

		}
	}, [])
	const [FichaData, setFichaData] = useState({})
	const [FichaDataOriginal, setFichaDataOriginal] = useState({})

	async function fetchFichaData() {
		const res = await axios.post(`${UrlServer}/getDatosGenerales2`, {
			id_ficha: sessionStorage.getItem('idobra')
		})
		setFichaData(res.data)
		setFichaDataOriginal(res.data)
		console.log("getDatosGenerales2", res.data);
	}

	// const [SaveData, setSaveData] = useState([])
	async function SaveData() {
		try {
			if (JSON.stringify(FichaData) != JSON.stringify(FichaDataOriginal)) {			
			
			const res = await axios.put(`${UrlServer}/fichas`,
				FichaData
			)
			console.log("save data", FichaData);
			if (res.status == 200) {
				
				alert("Sus datos se han actulizado correctamente")
			}
		}else{
			alert("NO se hizo ninguna modificacion en la data original")
		}
		} catch (error) {
			alert("Hubo un problema al actualizar los datos")
		}

	}

	return (

		<div>
			<Row>
				<Col xs="3"></Col>
				<Col xs="6">
					<h2>Edicion de datos de Obra</h2>
					{/* <Form>						 */}
					<Row form>
						<Col md={6}>
							<FormGroup>
								<Label>Fecha Inicial</Label>
								<Input
									type="date"
									name="Fecha Inicial"
									className="col-12"
									onChange={e => {
										var clone = { ...FichaData }
										clone.fecha_inicial = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.fecha_inicial}
								/>
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label for="exampleCity">FUENTE DE FINANCIAMIENTO</Label>
								<Input
									type="text"
									name="F_FUENTE_FINAN"
									id="exampleCity"
									onChange={e => {
										var clone = { ...FichaData }
										clone.f_fuente_finan = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.f_fuente_finan}

								/>
							</FormGroup>
						</Col>
						
					</Row>
					<Row form>
						<Col md={6}>
							<FormGroup>
								<Label>SECTOR</Label>
								<Input
									type="text"
									name="G_SECTOR"
									// className="col-12" 
									onChange={e => {
										var clone = { ...FichaData }
										clone.g_sector = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.g_sector}

								/>
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label>PLIEGO</Label>
								<Input
									type="text"
									name="G_PLIEGO"
									// className="col-12" 
									onChange={e => {
										var clone = { ...FichaData }
										clone.g_pliego = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.g_pliego}

								/>
							</FormGroup>
						</Col>
					</Row>
					<Row form>
						<Col md={4}>
							<FormGroup>
								<Label for="exampleCity">FUNCION</Label>
								<Input
									type="text"
									name="G_FUNC"
									id="exampleCity"
									onChange={e => {
										var clone = { ...FichaData }
										clone.g_func = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.g_func}

								/>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<Label for="exampleState">PROGRAMA</Label>
								<Input
									type="textarea"
									name="G_PROG"
									id="exampleState"
									onChange={e => {
										var clone = { ...FichaData }
										clone.g_pliego = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.g_prog}

								/>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<Label for="exampleZip">SUBPROGRAMA</Label>
								<Input
									type="textarea"
									name="G_SUBPROG"
									id="exampleZip"
									onChange={e => {
										var clone = { ...FichaData }
										clone.g_subprog = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.g_subprog}

								/>
							</FormGroup>
						</Col>
					</Row>
					<Row form>
						<Col md={6}>
							<FormGroup>
								<Label for="exampleEmail">ACTIVIDAD</Label>
								<Input
									type="text"
									name="G_TIPO_ACT"
									id="exampleEmail"

									onChange={e => {
										var clone = { ...FichaData }
										clone.g_tipo_act = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.g_tipo_act}

								/>
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label for="examplePassword">COMPONENTE</Label>
								<Input
									type="textarea"
									name="G_TIPO_COMP"
									id="examplePassword"

									onChange={e => {
										var clone = { ...FichaData }
										clone.g_tipo_comp = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.g_tipo_comp}

								/>
							</FormGroup>
						</Col>
					</Row>
					<FormGroup>
						<Label for="exampleAddress">META</Label>
						<Input
							type="textarea"
							name="G_META"
							id="exampleAddress"

							onChange={e => {
								var clone = { ...FichaData }
								clone.g_meta = e.target.value
								setFichaData(clone)
							}}
							value={FichaData.g_meta}

						/>
					</FormGroup>
					<Row form>

						<Col md={3}>
							<FormGroup>
								<Label for="exampleState">DISTRITO</Label>
								<Input
									type="text"
									name="G_LOCAL_DIST"
									id="exampleState"
									onChange={e => {
										var clone = { ...FichaData }
										clone.g_local_dist = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.g_local_dist}

								/>
							</FormGroup>
						</Col>
						<Col md={3}>
							<FormGroup>
								<Label for="exampleZip">PROVINCIA</Label>
								<Input
									type="text"
									name="G_LOCAL_PROV"
									id="exampleZip"
									onChange={e => {
										var clone = { ...FichaData }
										clone.g_local_prov = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.g_local_prov}

								/>
							</FormGroup>
						</Col>
						<Col md={3}>
							<FormGroup>
								<Label for="exampleZip">REGION</Label>
								<Input
									type="text"
									name="G_LOCAL_REG"
									id="exampleZip"
									onChange={e => {
										var clone = { ...FichaData }
										clone.g_local_reg = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.g_local_reg}

								/>
							</FormGroup>
						</Col>
						<Col md={3}>

							<FormGroup>
								<Label for="examplePassword">CENTRO POBLADO</Label>
								<Input
									type="text"
									name="CENTRO POBLADO"
									id="examplePassword"

									onChange={e => {
										var clone = { ...FichaData }
										clone.centropoblado_direccion = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.centropoblado_direccion || null}

								/>
							</FormGroup>
						</Col>
					</Row>
					<Row form>
						
						<Col md={6}>
							<FormGroup>
								<Label for="exampleState">ENTIDAD FINANCIERA</Label>
								<Input
									type="text"
									name="F_ENTIDAD_FINAN"
									id="exampleState"
									onChange={e => {
										var clone = { ...FichaData }
										clone.f_entidad_finan = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.f_entidad_finan}

								/>
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label for="exampleZip">ENTIDAD EJECUTORA</Label>
								<Input
									type="textarea"
									name="F_ENTIDAD_EJEC"
									id="exampleZip"
									onChange={e => {
										var clone = { ...FichaData }
										clone.f_entidad_ejec = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.f_entidad_ejec}
								/>
							</FormGroup>
						</Col>
					</Row>
					<Row form>
						<Col md={6}>
							<FormGroup>
								<Label for="exampleEmail">TIEMPO DE EJECUCION</Label>
								<Input
									type="text"
									name="TIEMPO_EJEC"
									id="exampleEmail"

									onChange={e => {
										var clone = { ...FichaData }
										clone.tiempo_ejec = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.tiempo_ejec}

								/>
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label for="examplePassword">TOTAL DE PRESUPUESTO</Label>
								<Input
									type="text"
									name="G_TOTAL_PRESU"
									id="examplePassword"

									onChange={e => {
										var clone = { ...FichaData }
										clone.g_total_presu = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.g_total_presu}

								/>
							</FormGroup>
						</Col>
					</Row>
					<Row form>
						<Col md={4}>
							<FormGroup>
								<Label for="exampleCity">LUGAR</Label>
								<Input
									type="text"
									name="LUGAR"
									id="exampleCity"
									onChange={e => {
										var clone = { ...FichaData }
										clone.lugar = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.lugar}

								/>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<Label for="exampleState">MODALIDAD EJECUTORA</Label>
								<Input
									type="text"
									name="MODALIDAD_EJECUTORA"
									id="exampleState"
									onChange={e => {
										var clone = { ...FichaData }
										clone.modalidad_ejecutora = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.modalidad_ejecutora}

								/>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<Label for="exampleZip">CONFIMACION SUPER INF</Label>
								<Input
									type="text"
									name="CONFIMACION_SUPER_INF"
									id="exampleZip"
									onChange={e => {
										var clone = { ...FichaData }
										clone.confirmacion_super_inf = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.confirmacion_super_inf}

								/>
							</FormGroup>
						</Col>
					</Row>
					<Row form>
						<Col md={6}>
							<FormGroup>
								<Label for="exampleEmail">CODIGO UNIFICADO</Label>
								<Input
									type="text"
									name="CODIGO UNIFICADO"
									id="exampleEmail"

									onChange={e => {
										var clone = { ...FichaData }
										clone.codigo_unificado = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.codigo_unificado}

								/>
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label for="exampleCity">SNIP</Label>
								<Input
									type="text"
									name="G_SINP"
									id="exampleCity"
									onChange={e => {
										var clone = { ...FichaData }
										clone.g_snip = e.target.value
										setFichaData(clone)
									}}
									value={FichaData.g_snip}

								/>
							</FormGroup>
						</Col>
					</Row>

					<FormGroup><Button
						type="submit"
						onClick={() => { 
							SaveData()
							
						}}
						variant="contained"
						color="primary"
						size="large"
						className={classes.button}

					>
						Guardar
      				</Button>
						
					</FormGroup>

				</Col>
			</Row>
		</div>

	)
}