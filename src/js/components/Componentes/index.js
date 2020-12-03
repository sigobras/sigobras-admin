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
						<th>N°</th>
						<th>COMPONENTE</th>
						<th>PRESUPUESTO CD</th>
						<th>PARTIDAS</th>
					</tr>
				</thead>
				<tbody style={{ backgroundColor: '#333333' }}>
					{
						Componentes.map((item) =>

							<tr key={item.id_componente} >
								<td>{item.numero}</td>

								<td style={{ fontSize: '0.75rem', color: '#8caeda' }}
								>{item.nombre}</td>

								<td> S/. {Redondea(item.presupuesto)}</td>
								<td>
									<ComponentePartidasTotal Id_componente={item.id_componente} />
								</td>
							</tr>
						)}
				</tbody>
			</table>

		</div>
	);
}
function ComponentePartidasTotal({ Id_componente }) {
	useEffect(() => {
		fetchComponentesPartidasTotal()
	}, []);
	const [ComponentesPartidasTotal, setComponentesPartidasTotal] = useState(0)
	async function fetchComponentesPartidasTotal() {
		var request = await axios.post(`${UrlServer}/getComponentesPartidasTotal`, {
			id_componente: Id_componente
		})
		setComponentesPartidasTotal(request.data.partidas_total)
	}
	return (
		<div>
			{ComponentesPartidasTotal}
		</div>
	);
}