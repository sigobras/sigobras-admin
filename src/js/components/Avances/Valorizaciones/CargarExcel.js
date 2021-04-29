import React, { useState, useEffect } from "react";
import axios from "axios";
import BigNumber from "bignumber.js";
import { MdCheck, MdCancel } from "react-icons/md";
import { Button, CardHeader, Row, Col, Collapse } from "reactstrap";
import readXlsxFile from "read-excel-file";

import { UrlServer } from "../../Utils/ServerUrlConfig";
import { Redondea } from "../../Utils/Funciones";
export default ({ Partidas, setPartidas }) => {
  async function leerArchivo() {
    try {
      const input = document.getElementById("archivoExcel");
      var rows = await readXlsxFile(input.files[0]);
      setExcelRows(rows);
      alert("Selecciona el primer item valido");
    } catch (error) {
      alert("algo salió mal");
    }
  }
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
  const [ExcelRows, setExcelRows] = useState([]);
  function seleccionCelda(posicion) {
    var clone = [...ExcelRows];
    if (ItemBasePosicion.row == 0 && ItemBasePosicion.col == 0) {
      var cloneSliced = ExcelRows.slice(posicion.row);
      setExcelRows(cloneSliced);
      setItemBasePosicion(posicion);
      setItemBasePosicionSeleccionado(true);
      alert("ahora seleccione la columna que se quiere comparar");
    } else {
      setColumnaComparar(posicion);
      setColumnaCompararSeleccionado(true);
      ordenarEnBaseAlaDataOriginal(posicion);
      alert("Selecciona la columna en la valorizacion para comparar");
    }
  }
  function ordenarEnBaseAlaDataOriginal(posicionComparar) {
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
          ExcelRows[indexArchivo][posicionComparar.col];
      }
    }
    setPartidas(clonePartidas);
  }
  return (
    <div>
      <input type="file" id="archivoExcel" />
      <Button outline onClick={leerArchivo} color="success" size="sm">
        CargarArchivo
      </Button>
      <div>
        posicion de item fila: {ItemBasePosicion.row} columna:
        {ItemBasePosicion.col}
      </div>
      <div>columna para comparar: {ColumnaComparar.col}</div>

      {(!ItemBasePosicionSeleccionado || !ColumnaCompararSeleccionado) && (
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
                            onClick={() => seleccionCelda({ row: i, col: j })}
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
    </div>
  );
};
