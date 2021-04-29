import React, { useState, useEffect } from "react";
import axios from "axios";
import BigNumber from "bignumber.js";
import { MdCheck, MdCancel } from "react-icons/md";
import { Button, CardHeader, Row, Col, Collapse } from "reactstrap";

import { UrlServer } from "../../Utils/ServerUrlConfig";
import { Redondea } from "../../Utils/Funciones";
import CargarExcel from "./CargarExcel";
import "./valorizaciones.css";
import EdicionAvances from "./EdicionAvances";
import EdicionPartida from "./EdicionPartida";
export default ({ PeriodoSeleccionado, Componenteseleccionado }) => {
  useEffect(() => {
    fetchPartidas();
  }, []);
  //Componentes
  const [Partidas, setPartidas] = useState([]);
  const [PartidasTotales, setPartidasTotales] = useState({});
  async function fetchPartidas() {
    const res = await axios.post(`${UrlServer}/getValGeneralPartidas2`, {
      id_ficha: sessionStorage.getItem("idobra"),
      fecha_inicial: PeriodoSeleccionado.fecha_inicial,
      fecha_final: PeriodoSeleccionado.fecha_final,
      id_componente: Componenteseleccionado.id_componente,
    });
    function addLeadingZeros(num, size) {
      num = num.toString();
      while (num.length < size) num = "0" + num;
      return num;
    }
    var valor_anterior = new BigNumber(0);
    var valor_actual = new BigNumber(0);

    res.data.forEach((item, i) => {
      valor_anterior = valor_anterior.plus(item.valor_anterior || 0);
      res.data[i].porcentaje_anterior =
        (item.metrado_anterior / item.metrado) * 100;
      valor_actual = valor_actual.plus(item.valor_actual || 0);
      res.data[i].porcentaje_actual =
        (item.metrado_actual / item.metrado) * 100;
      res.data[i].metrado_total = BigNumber(item.metrado_anterior || 0)
        .plus(item.metrado_actual || 0)
        .toNumber();
      res.data[i].valor_total = BigNumber(item.valor_anterior || 0)
        .plus(item.valor_actual || 0)
        .toNumber();
      res.data[i].porcentaje_total =
        (BigNumber(item.metrado_anterior || 0)
          .plus(item.metrado_actual || 0)
          .toNumber() /
          item.metrado) *
        100;
    });
    var arr = res.data
      .map((item) => {
        item.item2 = item.item
          .split(".")
          .map((n) => addLeadingZeros(n, 10))
          .join("");
        return item;
      })
      .sort((a, b) => {
        if (a.item2 < b.item2) {
          return -1;
        }
        if (a.item2 > b.item2) {
          return 1;
        }
        return 0;
      });
    setPartidas(arr);
    valor_anterior = valor_anterior.toNumber();
    valor_actual = valor_actual.toNumber();
    setPartidasTotales({
      valor_anterior,
      porcentaje_anterior:
        (valor_anterior / Componenteseleccionado.presupuesto) * 100,
      valor_actual,
      porcentaje_actual:
        (valor_actual / Componenteseleccionado.presupuesto) * 100,
      valor_total: BigNumber(valor_anterior || 0)
        .plus(valor_actual || 0)
        .toNumber(),
      porcentaje_total:
        (BigNumber(valor_anterior || 0)
          .plus(valor_actual || 0)
          .toNumber() /
          Componenteseleccionado.presupuesto) *
        100,
      valor_saldo:
        Componenteseleccionado.presupuesto - valor_anterior - valor_actual,
      porcentaje_saldo:
        ((Componenteseleccionado.presupuesto - valor_anterior - valor_actual) /
          Componenteseleccionado.presupuesto) *
        100,
    });
  }
  const [RedondeoActivado, setRedondeoActivado] = useState(false);
  const [ColumnaComparacion, setColumnaComparacion] = useState("");
  //excel
  const [ItemBasePosicion, setItemBasePosicion] = useState({ row: 0, col: 0 });
  const [
    ItemBasePosicionSeleccionado,
    setItemBasePosicionSeleccionado,
  ] = useState(false);
  const [ColumnaComparar, setColumnaComparar] = useState({ row: 0, col: 0 });
  const [
    ColumnaCompararSeleccionado,
    setColumnaCompararSeleccionado,
  ] = useState(false);
  function seleccionCelda(posicion) {
    // var clone = [...ExcelRows];
    if (ItemBasePosicion.row == 0 && ItemBasePosicion.col == 0) {
      // var cloneSliced = ExcelRows.slice(posicion.row);
      // setExcelRows(cloneSliced);
      setItemBasePosicion(posicion);
      setItemBasePosicionSeleccionado(true);
      alert("ahora seleccione la columna que se quiere comparar");
    } else {
      setColumnaComparar(posicion);
      setColumnaCompararSeleccionado(true);
      alert("Selecciona la columna en la valorizacion para comparar");
    }
  }
  const [ExcelRows, setExcelRows] = useState([]);
  function ordenarEnBaseAlaDataOriginal() {
    var clonePartidas = [...Partidas];
    for (let index = 0; index < clonePartidas.length; index++) {
      const partida = clonePartidas[index];
      //buscamos el item en el archivo
      var indexArchivo = -1;
      for (let j = 0; j < ExcelRows.length; j++) {
        const excelRow = ExcelRows[j];
        if (excelRow[ItemBasePosicion.col] === partida.item) {
          indexArchivo = j;
          break;
        }
      }
      // si encontramos el item hacemos la comparacion
      if (indexArchivo != -1) {
        partida.columna_comparacion =
          ExcelRows[indexArchivo][ColumnaComparar.col];
      }
    }
    setPartidas(clonePartidas);
  }
  function volverSeleccionarArchivo() {
    setColumnaCompararSeleccionado(false);
    setColumnaComparar({ row: 0, col: 0 });
    alert("Selecciona la columna en la valorizacion para comparar");
  }
  useEffect(() => {
    if (
      ItemBasePosicionSeleccionado &&
      ColumnaCompararSeleccionado &&
      Partidas.length
    ) {
      ordenarEnBaseAlaDataOriginal();
    }
  }, [ItemBasePosicionSeleccionado, ColumnaCompararSeleccionado]);
  return (
    <div className="table-responsive">
      <div
        onClick={() => setRedondeoActivado(!RedondeoActivado)}
        style={{ cursor: "pointer" }}
      >
        Redondeo
        {RedondeoActivado ? (
          <MdCheck color="green" />
        ) : (
          <MdCancel color="red" />
        )}
      </div>
      <div>
        cargar archivo para comparar
        <CargarExcel
          setPartidas={setPartidas}
          Partidas={Partidas}
          seleccionCelda={seleccionCelda}
          ExcelRows={ExcelRows}
          setExcelRows={setExcelRows}
          habilitar={
            !ItemBasePosicionSeleccionado || !ColumnaCompararSeleccionado
          }
        />
      </div>
      <div>
        <div>
          posicion de item fila: {ItemBasePosicion.row} columna:
          {ItemBasePosicion.col}
        </div>
        <div>columna para comparar: {ColumnaComparar.col}</div>
        <Button onClick={() => volverSeleccionarArchivo()} color="success">
          Volver a seleccionar la columna del archivo
        </Button>
      </div>

      <table className="table table-bordered table-hover">
        <colgroup>
          <col span="5" />
          {/* anteior */}
          <col
            style={
              ColumnaComparacion == "metrado_anterior"
                ? { background: "green" }
                : {}
            }
          />
          <col
            style={
              ColumnaComparacion == "valor_anterior"
                ? { background: "green" }
                : {}
            }
          />
          <col
            style={
              ColumnaComparacion == "porcentaje_anterior"
                ? { background: "green" }
                : {}
            }
          />
          {/* actual */}
          <col
            style={
              ColumnaComparacion == "metrado_actual"
                ? { background: "green" }
                : {}
            }
          />
          <col
            style={
              ColumnaComparacion == "valor_actual"
                ? { background: "green" }
                : {}
            }
          />
          <col
            style={
              ColumnaComparacion == "porcentaje_actual"
                ? { background: "green" }
                : {}
            }
          />
          {/* total */}
          <col
            style={
              ColumnaComparacion == "metrado_total"
                ? { background: "green" }
                : {}
            }
          />
          <col
            style={
              ColumnaComparacion == "valor_total" ? { background: "green" } : {}
            }
          />
          <col
            style={
              ColumnaComparacion == "porcentaje_total"
                ? { background: "green" }
                : {}
            }
          />
        </colgroup>
        <thead className="text-center resplandPartida">
          <tr>
            <th colSpan="3" rowSpan="2" className="align-middle">
              DESCRIPCION
            </th>
            <th colSpan="2">
              S/.
              {RedondeoActivado
                ? Redondea(Componenteseleccionado.presupuesto)
                : Componenteseleccionado.presupuesto}
            </th>

            <th colSpan="2">
              S/.
              {RedondeoActivado
                ? Redondea(PartidasTotales.valor_anterior)
                : PartidasTotales.valor_anterior}
            </th>
            <th>
              {RedondeoActivado
                ? Redondea(PartidasTotales.porcentaje_anterior)
                : PartidasTotales.porcentaje_anterior}
              %
            </th>

            <th colSpan="2">
              S/.
              {RedondeoActivado
                ? Redondea(PartidasTotales.valor_actual)
                : PartidasTotales.valor_actual}
            </th>
            <th>
              {RedondeoActivado
                ? Redondea(PartidasTotales.porcentaje_actual)
                : PartidasTotales.porcentaje_actual}{" "}
              %
            </th>

            <th colSpan="2">
              S/.
              {RedondeoActivado
                ? Redondea(PartidasTotales.valor_total)
                : PartidasTotales.valor_total}
            </th>
            <th>
              {RedondeoActivado
                ? Redondea(PartidasTotales.porcentaje_total)
                : PartidasTotales.porcentaje_total}{" "}
              %
            </th>

            <th colSpan="2">
              S/.
              {RedondeoActivado
                ? Redondea(PartidasTotales.valor_saldo)
                : PartidasTotales.valor_saldo}
            </th>
            <th>
              {RedondeoActivado
                ? Redondea(PartidasTotales.porcentaje_saldo)
                : PartidasTotales.porcentaje_saldo}{" "}
              %
            </th>
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
            <th>DESCRIPCION</th>
            <th>METRADO</th>
            <th>P. U. S/.</th>
            <th>P. P S/.</th>

            <th
              onClick={() => setColumnaComparacion("metrado_anterior")}
              style={{ cursor: "pointer" }}
            >
              MET.{" "}
            </th>
            <th
              onClick={() => setColumnaComparacion("valor_anterior")}
              style={{ cursor: "pointer" }}
            >
              VAL
            </th>
            <th
              onClick={() => setColumnaComparacion("porcentaje_anterior")}
              style={{ cursor: "pointer" }}
            >
              %
            </th>

            <th
              onClick={() => setColumnaComparacion("metrado_actual")}
              style={{ cursor: "pointer" }}
            >
              MET.
            </th>
            <th
              onClick={() => setColumnaComparacion("valor_actual")}
              style={{ cursor: "pointer" }}
            >
              VAL
            </th>
            <th
              onClick={() => setColumnaComparacion("porcentaje_actual")}
              style={{ cursor: "pointer" }}
            >
              %
            </th>

            <th
              onClick={() => setColumnaComparacion("metrado_total")}
              style={{ cursor: "pointer" }}
            >
              MET.
            </th>
            <th
              onClick={() => setColumnaComparacion("valor_total")}
              style={{ cursor: "pointer" }}
            >
              VAL
            </th>
            <th
              onClick={() => setColumnaComparacion("porcentaje_total")}
              style={{ cursor: "pointer" }}
            >
              %
            </th>

            <th>MET.</th>
            <th>VAL</th>
            <th>%</th>
          </tr>
        </thead>

        <tbody>
          {Partidas.map((item) => (
            <tr
              key={item.id_partida}
              className={
                item.tipo === "titulo"
                  ? "font-weight-bold text-warning"
                  : "font-weight-light"
              }
            >
              <td>{item.item}</td>
              <td>{item.descripcion}</td>
              <td>
                {item.tipo === "partida"
                  ? (RedondeoActivado ? Redondea(item.metrado) : item.metrado) +
                    " " +
                    item.unidad_medida.replace("/DIA", "")
                  : ""}
              </td>
              <td>
                {RedondeoActivado
                  ? Redondea(item.costo_unitario)
                  : item.costo_unitario}
              </td>
              <td>
                {RedondeoActivado
                  ? Redondea(
                      BigNumber(item.metrado || 0)
                        .times(item.costo_unitario || 0)
                        .toNumber()
                    )
                  : BigNumber(item.metrado || 0)
                      .times(item.costo_unitario || 0)
                      .toNumber()}
              </td>

              <td>
                {RedondeoActivado
                  ? Redondea(item.metrado_anterior)
                  : item.metrado_anterior}
              </td>
              <td>
                {RedondeoActivado
                  ? Redondea(item.valor_anterior)
                  : item.valor_anterior}
              </td>
              <td>
                {RedondeoActivado
                  ? Redondea(item.porcentaje_anterior)
                  : item.porcentaje_anterior}
              </td>

              <td className="bg-mm">
                {RedondeoActivado
                  ? Redondea(item.metrado_actual)
                  : item.metrado_actual}
              </td>
              <td className="bg-mm">
                {RedondeoActivado
                  ? Redondea(item.valor_actual)
                  : item.valor_actual}
              </td>
              <td>
                {RedondeoActivado
                  ? Redondea(item.porcentaje_actual)
                  : item.porcentaje_actual}
              </td>

              <td>
                {RedondeoActivado
                  ? Redondea(item.metrado_total)
                  : item.metrado_total}
              </td>
              <td>
                {RedondeoActivado
                  ? Redondea(item.valor_total)
                  : item.valor_total}
              </td>
              <td>
                {RedondeoActivado
                  ? Redondea(item.porcentaje_total)
                  : item.porcentaje_total}
              </td>
              {/* saldo */}
              <td>
                {RedondeoActivado
                  ? Redondea(
                      item.metrado -
                        item.metrado_anterior -
                        item.metrado_actual,
                      2,
                      true
                    )
                  : item.metrado - item.metrado_anterior - item.metrado_actual}
              </td>
              <td>
                {RedondeoActivado
                  ? Redondea(
                      item.metrado * item.costo_unitario -
                        item.valor_anterior -
                        item.valor_actual,
                      2,
                      true
                    )
                  : item.metrado * item.costo_unitario -
                    item.valor_anterior -
                    item.valor_actual}
              </td>
              <td>
                {RedondeoActivado
                  ? Redondea(
                      ((item.metrado -
                        item.metrado_anterior -
                        item.metrado_actual) /
                        item.metrado) *
                        100,
                      2,
                      true
                    )
                  : ((item.metrado -
                      item.metrado_anterior -
                      item.metrado_actual) /
                      item.metrado) *
                    100}
              </td>
              {ColumnaComparacion && (
                <td
                  style={
                    item.columna_comparacion - item[ColumnaComparacion] != 0
                      ? { color: "red" }
                      : {}
                  }
                >
                  {item.columna_comparacion}
                </td>
              )}
              <td className="d-flex">
                <EdicionAvances
                  id_partida={item.id_partida}
                  recargar={fetchPartidas}
                />
                <EdicionPartida partida={item} recargar={fetchPartidas} />
              </td>
            </tr>
          ))}

          <tr className="resplandPartida">
            <td colSpan="3">TOTAL</td>
            <td colSpan="2">
              S/.{" "}
              {RedondeoActivado
                ? Redondea(Componenteseleccionado.presupuesto)
                : Componenteseleccionado.presupuesto}
            </td>

            <td colSpan="2">
              S/.
              {RedondeoActivado
                ? Redondea(PartidasTotales.valor_anterior)
                : PartidasTotales.valor_anterior}
            </td>
            <td>
              {RedondeoActivado
                ? Redondea(PartidasTotales.porcentaje_anterior)
                : PartidasTotales.porcentaje_anterior}{" "}
              %
            </td>

            <td colSpan="2">
              S/.
              {RedondeoActivado
                ? Redondea(PartidasTotales.valor_actual)
                : PartidasTotales.valor_actual}
            </td>
            <td>
              {RedondeoActivado
                ? Redondea(PartidasTotales.porcentaje_actual)
                : PartidasTotales.porcentaje_actual}{" "}
              %
            </td>

            <td colSpan="2">
              S/.
              {RedondeoActivado
                ? Redondea(PartidasTotales.valor_total)
                : PartidasTotales.valor_total}
            </td>
            <td>
              {RedondeoActivado
                ? Redondea(PartidasTotales.porcentaje_total)
                : PartidasTotales.porcentaje_total}{" "}
              %
            </td>

            <td colSpan="2">
              S/.
              {RedondeoActivado
                ? Redondea(PartidasTotales.valor_saldo)
                : PartidasTotales.valor_saldo}
            </td>
            <td>
              {RedondeoActivado
                ? Redondea(PartidasTotales.porcentaje_saldo)
                : PartidasTotales.porcentaje_saldo}
              %
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
