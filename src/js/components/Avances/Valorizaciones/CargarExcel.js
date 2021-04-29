import React, { useState, useEffect } from "react";
import axios from "axios";
import BigNumber from "bignumber.js";
import { MdCheck, MdCancel } from "react-icons/md";
import { Button, CardHeader, Row, Col, Collapse } from "reactstrap";
import readXlsxFile from "read-excel-file";

import { UrlServer } from "../../Utils/ServerUrlConfig";
import { Redondea } from "../../Utils/Funciones";
export default ({ seleccionCelda, setExcelRows, habilitar, ExcelRows }) => {
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

  return (
    <div>
      <input type="file" id="archivoExcel" />
      <Button outline onClick={leerArchivo} color="success" size="sm">
        CargarArchivo
      </Button>

      {habilitar && (
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
