import React, { useEffect, useState } from "react";
import axios from "axios";
import { UrlServer } from "../Utils/ServerUrlConfig";
import FinancieroBarraPorcentaje from "./FinancieroBarraPorcentaje";
import { Button } from "reactstrap";
import FisicoBarraPorcentaje from "./FisicoBarraPorcentaje";
import ModalListaPersonal from "./ModalListaPersonal";
import Curva_S from "./Curva_S";
import { FaList } from "react-icons/fa";
import { Redondea } from "../Utils/Funciones";
import ObraNueva from "./ObraNueva";
import "./inicio.css";
export default ({ recargar }) => {
  useEffect(() => {
    fetchObras();
  }, []);
  const [Obras, setObras] = useState([]);
  async function fetchObras() {
    var res = await axios.get(`${UrlServer}/v1/obras`, {
      params: {
        sort_by: "poblacion-desc",
        id_acceso: 0,
      },
    });
    setObras(res.data);
    if (!sessionStorage.getItem("idobra")) {
      recargar(res.data[0]);
    }
  }
  return (
    <div>
      <ObraNueva />
      <Button
        outline={sessionStorage.getItem("idobra") != 0}
        color={sessionStorage.getItem("idobra") != 0 ? "success" : "success"}
        onClick={() =>
          recargar({ id_ficha: 0, g_meta: "TODAS LAS OBRAS", codigo: "todos" })
        }
      >
        TODAS LAS OBRAS
      </Button>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>N°</th>
            <th
              style={{ width: "400px", minWidth: "150px", textAlign: "center" }}
            >
              OBRA
            </th>
            <th className="text-center">UDM </th>
            <th className="text-center">IR A</th>
            <th className="text-center">ESTADO</th>
          </tr>
        </thead>
        <tbody>
          {Obras.map((item, i) => (
            <tr key={item.id_ficha}>
              <td>{item.id_ficha}</td>
              <td>{item.g_meta}</td>
              <td>
                <FetchUltimoDiaMetrado id_ficha={item.id_ficha} />
              </td>
              <td>
                <Button
                  outline={sessionStorage.getItem("idobra") != item.id_ficha}
                  color={
                    sessionStorage.getItem("idobra") != item.id_ficha
                      ? "secondary"
                      : "primary"
                  }
                  onClick={() => recargar(item)}
                  className="text-white"
                >
                  {item.codigo}
                </Button>
              </td>
              <td>
                <EstadoObra id_ficha={item.id_ficha} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
//componente de ulti dia metrado
function FetchUltimoDiaMetrado({ id_ficha }) {
  useEffect(() => {
    fetchData();
  }, []);
  const [UltimoDiaEjecutado, setUltimoDiaEjecutado] = useState("");
  async function fetchData() {
    var request = await axios.post(`${UrlServer}/getUltimoDiaMetrado`, {
      id_ficha: id_ficha,
    });
    setUltimoDiaEjecutado(request.data.fecha);
  }
  function calcular_dias(fecha_inicio, fecha_final) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(fecha_inicio);
    const secondDate = new Date(fecha_final);
    var days = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    return days || 0;
  }
  return (
    <div
      style={{
        color: "#8caeda",
        background: "#242526",
        fontSize: "0.8rem",
      }}
    >
      {calcular_dias(UltimoDiaEjecutado, new Date()) - 1} días sin reportar
    </div>
  );
}
//componente de estado de obra
function EstadoObra({ id_ficha }) {
  useEffect(() => {
    fetchData();
  }, []);
  const [EstadoObra, setEstadoObra] = useState("");
  async function fetchData() {
    var request = await axios.post(`${UrlServer}/getEstadoObra`, {
      id_ficha: id_ficha,
    });
    setEstadoObra(request.data.nombre);
  }
  return (
    <div
      className={
        EstadoObra === "Ejecucion"
          ? "badge badge-success p-1"
          : EstadoObra === "Paralizado"
          ? "badge badge-warning p-1"
          : EstadoObra === "Corte"
          ? "badge badge-danger p-1"
          : EstadoObra === "Actualizacion"
          ? "badge badge-info p-1"
          : "badge badge-info p-1"
      }
    >
      {EstadoObra}
    </div>
  );
}
//avancecomponente
function ComponenteAvance({ id_componente }) {
  useEffect(() => {
    fetchData();
  }, []);
  const [ComponenteAvance, setComponenteAvance] = useState(0);
  async function fetchData() {
    var request = await axios.post(`${UrlServer}/getFisicoComponente`, {
      id_componente,
    });
    setComponenteAvance(request.data.avance);
  }
  return <div>{Redondea(ComponenteAvance)}</div>;
}
function ComponenteBarraPorcentaje({ id_componente, componente }) {
  useEffect(() => {
    fetchData();
  }, []);
  const [ComponenteAvancePorcentaje, setComponenteAvancePorcentaje] = useState(
    0
  );
  async function fetchData() {
    var request = await axios.post(`${UrlServer}/getFisicoComponente`, {
      id_componente,
    });
    setComponenteAvancePorcentaje(
      (request.data.avance / componente.presupuesto) * 100
    );
  }
  return (
    <div
      style={{
        width: "100%",
        height: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          height: "5px",
          backgroundColor: "#c3bbbb",
          borderRadius: "2px",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${
              ComponenteAvancePorcentaje <= 100
                ? ComponenteAvancePorcentaje
                : 100
            }%`,
            height: "100%",
            // boxShadow:'0 0 12px #c3bbbb',
            backgroundColor:
              ComponenteAvancePorcentaje > 95
                ? "#e6ff00"
                : ComponenteAvancePorcentaje > 50
                ? "#ffbf00"
                : "#ff2e00",
            borderRadius: "2px",
            transition: "all .9s ease-in",
            position: "absolute",
          }}
        />
        <span style={{ position: "inherit", fontSize: "0.8rem", top: "4px" }}>
          {Redondea(ComponenteAvancePorcentaje)} %
        </span>
      </div>
    </div>
  );
}
