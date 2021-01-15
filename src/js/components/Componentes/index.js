import React, { useEffect, useState } from "react";
import axios from "axios";
import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea } from "../Utils/Funciones";
import { Button, Spinner } from "reactstrap";
import readXlsxFile from "read-excel-file";
export default () => {
  useEffect(() => {
    fetchComponentes(sessionStorage.getItem("idobra"));
  }, []);
  const [Componentes, setComponentes] = useState([]);
  const [ComponentesZone, setComponentesZone] = useState(false);
  async function fetchComponentes(id_ficha) {
    var res = await axios.post(`${UrlServer}/getComponentes`, {
      id_ficha,
    });
    setComponentes(res.data);
  }
  const [PresupuestoZone, setPresupuestoZone] = useState(false);
  const [ExcelRows, setExcelRows] = useState([]);
  async function loadPresupuesto() {
    try {
      setLoaderFile(true);
      const input = document.getElementById("presupuesto");
      var rows = await readXlsxFile(input.files[0]);
      console.log("row", rows);
      setLoaderFile(false);
      setExcelRows(rows);
      alert("seleccione el primer item con parcial");
    } catch (error) {
      console.log(error);
      alert("algo salió mal");
    }
  }
  const [ItemBasePosicion, setItemBasePosicion] = useState({ row: 0, col: 0 });
  const [SelectedParcial, setSelectedParcial] = useState(false);
  function onSelectParcial(posicion) {
    var clone = [...ExcelRows];
    var cloneSliced = clone.slice(posicion.row);
    setExcelRows(cloneSliced);
    setItemBasePosicion(posicion);
    setSelectedParcial(true);
    fetchPartidas();
  }
  const [Partidas, setPartidas] = useState([]);
  async function fetchPartidas() {
    var res = await axios.get(`${UrlServer}/partidasAll`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
      },
    });
    setPartidas(res.data);
  }
  const [ExcelRowsGrupo, setExcelRowsGrupo] = useState([]);
  const cantidadPorGrupo = 200;
  function calcularGrupo(grupo) {
    var grupo = ExcelRows.slice(
      cantidadPorGrupo * grupo,
      cantidadPorGrupo * (grupo + 1)
    );
    setExcelRowsGrupo(grupo);
  }
  function removeLeadingZeros(item) {
    item = item || "";
    if (typeof item != "string") {
      item = item.toString();
    }
    var itemArray = item.split(".");
    itemArray.forEach((item, i) => {
      itemArray[i] = Number(item);
    });
    return itemArray.join(".");
  }
  const [loaderFile, setLoaderFile] = useState(false);
  const [PartidasNoEncontradas, setPartidasNoEncontradas] = useState([]);
  const [PartidasNoEncontradasZone, setPartidasNoEncontradasZone] = useState(
    false
  );
  function analizarPartidasNoEncontradas() {
    var noEncontrados = [];
    for (let i = 0; i < Partidas.length; i++) {
      const partidaSistema = Partidas[i];
      var encontrado = ExcelRows.find(
        (row) =>
          removeLeadingZeros(row[ItemBasePosicion.col]) ==
          removeLeadingZeros(partidaSistema.item)
      );
      if (!encontrado) {
        noEncontrados.push(partidaSistema.item);
      }
    }
    console.log("noEncontrados", noEncontrados);
    setPartidasNoEncontradas(noEncontrados);
  }
  const [PartidasDuplicadas, setPartidasDuplicadas] = useState([]);
  const [PartidasDuplicadasZone, setPartidasDuplicadasZone] = useState(false);
  const analizarPartidasDuplicadas = () => {
    let sorted_arr = Partidas.slice().sort((a, b) =>
      a.item > b.item ? 1 : b.item > a.item ? -1 : 0
    );
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1].item == sorted_arr[i].item) {
        results.push(sorted_arr[i].item);
      }
    }
    setPartidasDuplicadas(results);
  };
  const [ComponenteSeleccionado, setComponenteSeleccionado] = useState({});
  const [PartidasFiltradas, setPartidasFiltradas] = useState([]);
  function PartidasFiltradasComponente() {
    const result = ExcelRows.filter((row, i) => {
      if (row[ItemBasePosicion.col] == null) return false;
      if (typeof row[ItemBasePosicion.col] == "number") {
        row[ItemBasePosicion.col] = "" + row[ItemBasePosicion.col];
      }
      var componente = row[ItemBasePosicion.col].substring(
        0,
        row[ItemBasePosicion.col].indexOf(".")
      );
      return Number(ComponenteSeleccionado.numero) == Number(componente);
    });
    setPartidasFiltradas(result);
  }

  useEffect(() => {
    if (Partidas.length) {
      analizarPartidasNoEncontradas();
      analizarPartidasDuplicadas();
    }
  }, [Partidas]);
  useEffect(() => {
    PartidasFiltradasComponente();
  }, [ComponenteSeleccionado]);
  return (
    <div>
      <Button
        color="primary"
        onClick={() => setComponentesZone(!ComponentesZone)}
      >
        ZONA COMPONENTES
      </Button>
      {ComponentesZone && (
        <table
          className="table table-bordered table-sm"
          style={{
            width: "100%",
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
          <tbody style={{ backgroundColor: "#333333" }}>
            {Componentes.map((item, i) => (
              <tr key={item.id_componente}>
                <td>{item.id_componente}</td>
                <td>{item.numero}</td>
                <td style={{ fontSize: "0.75rem", color: "#8caeda" }}>
                  {item.nombre}
                </td>
                <td> S/. {Redondea(item.presupuesto)}</td>
                <td> {item.partidas_total}</td>
                <td>{Redondea(item.presupuesto_calculado, 4)}</td>
                <td>{Redondea(item.diferencia, 4)}</td>
                <ComponentePartidasTotal
                  index={i}
                  Componentes={[...Componentes]}
                  setComponentes={setComponentes}
                />
              </tr>
            ))}
            <tr>
              <td colSpan="3">total</td>
              <td>
                {(() =>
                  "S/. " +
                  Redondea(
                    Componentes.reduce((acc, item) => acc + item.presupuesto, 0)
                  ))()}
              </td>
              <td>
                {(() =>
                  Redondea(
                    Componentes.reduce(
                      (acc, item) => acc + item.partidas_total,
                      0
                    )
                  ))()}
              </td>
              <td>
                {(() =>
                  "S/. " +
                  Redondea(
                    Componentes.reduce(
                      (acc, item) => acc + item.presupuesto_calculado,
                      0
                    )
                  ))()}
              </td>
              <td>
                {(() =>
                  "S/. " +
                  Redondea(
                    Componentes.reduce((acc, item) => acc + item.diferencia, 0)
                  ))()}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      <Button
        color="success"
        onClick={() => setPresupuestoZone(!PresupuestoZone)}
      >
        COMPROBAR PRESUPUESTO
      </Button>
      {PresupuestoZone && (
        <div>
          {ExcelRows.length == 0 && (
            <div>
              <input
                type="file"
                name="presupuesto"
                id="presupuesto"
                onChange={() => loadPresupuesto()}
              />
              {loaderFile && <Spinner type="grow" color="primary" />}
            </div>
          )}
          {ItemBasePosicion.row == 0 && ItemBasePosicion.col == 0 && (
            <table className="table table-striped table-hover">
              <tbody>
                {(() => {
                  var body = [];
                  for (let i = 0; i < 20 && i < ExcelRows.length; i++) {
                    const element = ExcelRows[i];
                    body.push(
                      <tr>
                        {(() => {
                          var tds = [];
                          element.forEach((td, j) => {
                            tds.push(
                              <td
                                onClick={() =>
                                  onSelectParcial({ row: i, col: j })
                                }
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                {typeof td === "object" ? "" : td}
                              </td>
                            );
                          });
                          return tds;
                        })()}
                      </tr>
                    );
                  }
                  return body;
                })()}
              </tbody>
            </table>
          )}
          <div>
            POSICION PRIMER ITEM PARTIDA :
            {ItemBasePosicion.row + "-" + ItemBasePosicion.col}
          </div>
        </div>
      )}

      {PartidasNoEncontradas.length && (
        <Button
          color="danger"
          onClick={() =>
            setPartidasNoEncontradasZone(!PartidasNoEncontradasZone)
          }
        >
          PARTIDAS NO ENCONTRADAS`
        </Button>
      )}

      {PartidasNoEncontradasZone && (
        <div>
          PARTIDAS NO ENCONTRADAS
          {PartidasNoEncontradas.map((item, i) => (
            <div>ITEM :{item}</div>
          ))}
        </div>
      )}
      {PartidasDuplicadas.length && (
        <Button
          color="danger"
          onClick={() => setPartidasDuplicadasZone(!PartidasDuplicadasZone)}
        >
          PARTIDAS DUPLICADAS
        </Button>
      )}
      {PartidasDuplicadasZone && (
        <div>
          PARTIDAS DUPLICADAS
          {PartidasDuplicadas.map((item, i) => (
            <div>ITEM :{item}</div>
          ))}
        </div>
      )}
      <div className="container">
        {SelectedParcial && (
          <div className="row">
            {Componentes.map((item, i) => (
              <button onClick={() => setComponenteSeleccionado(item)}>
                {item.numero}
              </button>
            ))}
          </div>
        )}
        <div className="row">
          <table className="table table-bordered table-sm table-hover">
            <thead>
              <tr>
                <th>ITEM</th>
                <th>DESCRIPCION</th>
                <th>UNIDAD</th>
                <th>METRADO</th>
                <th>CU</th>
                <th>PARCIAL</th>
                <th>METRADO EN SISTEMA</th>
                <th>CU EN SISTEMA</th>
                <th>PARCIAL EN SISTEMA</th>
                <th>
                  DIFERENCIA
                  <div>
                    {(() =>
                      Redondea(
                        PartidasFiltradas.reduce((acc, item) => {
                          // console.log(item);
                          var sum = acc + (item["diferencia"] || 0);
                          // console.log(acc,item["diferencia"]);
                          return sum;
                        }, 0),
                        7
                      ))()}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {PartidasFiltradas.map((row, i) => (
                <tr>
                  {row.map(
                    (celda, j) =>
                      j >= ItemBasePosicion.col &&
                      j <= ItemBasePosicion.col + 5 && <td>{celda}</td>
                  )}
                  <CalcularMetrado
                    key={row[ItemBasePosicion.col]}
                    row={row}
                    itemPosicion={ItemBasePosicion.col}
                    Partidas={Partidas}
                    ExcelRowsGrupo={[...PartidasFiltradas]}
                    setExcelRowsGrupo={setPartidasFiltradas}
                    rowPosicion={i}
                    removeLeadingZeros={removeLeadingZeros}
                  />
                  <td>{Redondea(row.parcial_sistema, 7)}</td>
                  <td>{Redondea(row.diferencia, 7)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
function ComponentePartidasTotal({ index, Componentes, setComponentes }) {
  useEffect(() => {
    fetchComponentesCalculados();
  }, []);
  const [ComponentesCalculados, setComponentesCalculados] = useState(0);
  async function fetchComponentesCalculados() {
    var res = await axios.post(`${UrlServer}/getComponentesPartidasTotal`, {
      id_componente: Componentes[index].id_componente,
    });
    setComponentesCalculados(res.data);
    Componentes[index].presupuesto_calculado = res.data.presupuesto;
    Componentes[index].diferencia =
      Componentes[index].presupuesto - res.data.presupuesto;
    Componentes[index].partidas_total = res.data.partidas_total;
    setComponentes(Componentes);
  }
  return "";
}
function CalcularMetrado({
  row,
  itemPosicion,
  Partidas,
  ExcelRowsGrupo,
  setExcelRowsGrupo,
  rowPosicion,
  removeLeadingZeros,
}) {
  useEffect(() => {
    EncontrarPartida();
  }, []);

  const [PartidaEncontrada, setPartidaEncontrada] = useState({ metrado: 0 });
  function EncontrarPartida() {
    var encontrado = Partidas.find(
      (element) =>
        removeLeadingZeros(element.item) ==
        removeLeadingZeros(row[itemPosicion])
    );
    setPartidaEncontrada(encontrado);
    if (encontrado) {
      setPartidaEncontrada(encontrado);
      ExcelRowsGrupo[rowPosicion].parcial_sistema = encontrado
        ? encontrado.metrado * encontrado.costo_unitario
        : 0;
      ExcelRowsGrupo[rowPosicion].diferencia =
        (row[itemPosicion + 3] > 0 ? row[itemPosicion + 5] : 0) -
        (encontrado ? encontrado.metrado * encontrado.costo_unitario : 0);
      setExcelRowsGrupo(ExcelRowsGrupo);
    }
  }
  return [
    PartidaEncontrada ? (
      <td> {PartidaEncontrada.metrado}</td>
    ) : (
      <td
        style={{
          backgroundColor: "red",
        }}
      >
        PARTIDA NO INGRESADA
      </td>
    ),
    PartidaEncontrada ? (
      <td> {PartidaEncontrada.costo_unitario}</td>
    ) : (
      <td
        style={{
          backgroundColor: "red",
        }}
      >
        PARTIDA NO INGRESADA
      </td>
    ),
  ];
}
