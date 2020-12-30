import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig';
import { Redondea } from '../Utils/Funciones';
export default () => {
	useEffect(() => {
		fetchComponentes(sessionStorage.getItem('idobra'))
	}, []);
	const [Componentes, setComponentes] = useState([])
	async function fetchComponentes(id_ficha) {
		var request = await axios.post(`${UrlServer}/getComponentes`, {
			id_ficha
		})
		setComponentes(request.data)
	}
	return (
		<div>
			<table className="table table-bordered table-sm"
				style={{
					width: "100%"
				}}
			>
				<thead>
					<tr>
						<th>id</th>
						<th>N°</th>
						<th>COMPONENTE</th>
						<th>PRESUPUESTO CD</th>
						<th>PARTIDAS</th>
						<th>PRESUPUESTO CALCULADO</th>
						<th>DIFERENCIA</th>
					</tr>
				</thead>
				<tbody style={{ backgroundColor: '#333333' }}>
					{
						Componentes.map((item, i) =>

							[
								<tr key={item.id_componente} >
									<td>{item.id_componente}</td>
									<td>{item.numero}</td>
									<td style={{ fontSize: '0.75rem', color: '#8caeda' }}
									>{item.nombre}</td>
									<td> S/. {Redondea(item.presupuesto)}</td>
									<td> {item.partidas_total}</td>
									<td >{Redondea(item.presupuesto_calculado, 4)}</td>
									<td >{Redondea(item.diferencia, 4)}</td>
									<ComponentePartidasTotal
										index={i}
										Componentes={[...Componentes]}
										setComponentes={setComponentes}
									/>
								</tr>,
								// <tr key={"2-"+item.id_componente}>
								// 	<td colSpan="8">
								// 		<div style={{ width: "100%" }}>
								// 			<table>
								// 				<thead>
								// 					<tr>
								// 						<th>titulo1</th>
								// 						<th>titulo2</th>
								// 						<th>titulo3</th>
								// 						<th>titulo4</th>
								// 						<th>titulo5</th>
								// 					</tr>
								// 				</thead>
								// 				<tbody>
								// 					<tr>
								// 						<td>contenido1</td>
								// 						<td>contenido2</td>
								// 						<td>contenido3</td>
								// 						<td>contenido4</td>
								// 						<td>contenido5</td>
								// 					</tr>
								// 				</tbody>
								// 			</table>
								// 		</div>

								// 	</td>

								// </tr>

						]
						)
					}
					<tr>
						<td colSpan="3">total</td>
						<td>
							{
								(
									() => "S/. " + Redondea(Componentes.reduce((acc, item) => acc + item.presupuesto, 0))
								)()
							}
						</td>
						<td>
							{
								(
									() => Redondea(Componentes.reduce((acc, item) => acc + item.partidas_total, 0))
								)()
							}

						</td>
						<td>
							{
								(
									() => "S/. " + Redondea(Componentes.reduce((acc, item) => acc + item.presupuesto_calculado, 0))
								)()
							}
						</td>
						<td>
							{
								(
									() => "S/. " + Redondea(Componentes.reduce((acc, item) => acc + item.diferencia, 0))
								)()
							}
						</td>
					</tr>
				</tbody>
			</table>

		</div>
	);
}
function ComponentePartidasTotal({ index, Componentes, setComponentes }) {
	useEffect(() => {
		fetchComponentesCalculados()
	}, []);
	const [ComponentesCalculados, setComponentesCalculados] = useState(0)
	async function fetchComponentesCalculados() {
		var res = await axios.post(`${UrlServer}/getComponentesPartidasTotal`, {
			id_componente: Componentes[index].id_componente
		})
		setComponentesCalculados(res.data)
		Componentes[index].presupuesto_calculado = res.data.presupuesto
		Componentes[index].diferencia = Componentes[index].presupuesto - res.data.presupuesto
		Componentes[index].partidas_total = res.data.partidas_total
		setComponentes(Componentes)
	}
	return (
		""
	);
}