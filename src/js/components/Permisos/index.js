import React, { useState, useEffect } from "react";
import axios from "axios";
import { UrlServer } from "../Utils/ServerUrlConfig";
import { FaMediumM, FaUpload } from "react-icons/fa";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
} from "reactstrap";
import "./Permisos.css";
export default () => {
  useEffect(() => {
    cargarCargos();
  }, []);
  const [Cargos, setCargos] = useState([]);
  async function cargarCargos() {
    var res = await axios.get(`${UrlServer}/v1/cargos`);
    setCargos(res.data);
  }
  const [Interfaces, setInterfaces] = useState([]);
  async function cargarInterfaces() {
    var id_cargos = Cargos.reduce((acc, item) => acc + item.id_Cargo + ",", "");
    id_cargos = id_cargos.slice(0, -1);
    var res = await axios.get(`${UrlServer}/v1/interfazPermisos`, {
      params: {
        id_cargos,
      },
    });
    console.log("interfaces", res.data);
    setInterfaces(res.data);
  }
  async function actualizarEstado(
    interfaz_secundarias_id,
    cargos_id_Cargo,
    activo
  ) {
    console.log("actualiazando", {
      interfaz_secundarias_id,
      cargos_id_Cargo,
      activo,
    });
    var res = await axios.put(`${UrlServer}/v1/interfazPermisos`, {
      interfaz_secundarias_id,
      cargos_id_Cargo,
      activo,
    });
    cargarInterfaces();
  }
  useEffect(() => {
    if (Cargos.length > 0) {
      cargarInterfaces();
    }
  }, [Cargos]);
  function renderCargosPermisos(indexCargo) {
    var tempRender = [];
    for (let index = 0; index < Cargos.length; index++) {
      const cargo = Cargos[index];
      tempRender.push(
        <td>
          {Interfaces[indexCargo]["cargo_" + cargo.id_Cargo] == 1 ? (
            <Button
              color="success"
              onClick={() =>
                actualizarEstado(Interfaces[indexCargo].id, cargo.id_Cargo, 0)
              }
            >
              on
            </Button>
          ) : (
            <Button
              color="danger"
              onClick={() =>
                actualizarEstado(Interfaces[indexCargo].id, cargo.id_Cargo, 1)
              }
            >
              off
            </Button>
          )}
        </td>
      );
    }
    return tempRender;
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="table-permisos">
        <thead>
          <tr>
            <th>INTERFACES</th>
            <th>FUNCIONALIDAD</th>
            {Cargos.map((item, i) => (
              <th className="rotate">
                <div>
                  <span>{item.nombre}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Interfaces.map((item, i) => (
            <tr>
              <th>{item.interfaz_nombre}</th>
              <td>{item.funcionalidad_nombre}</td>
              {renderCargosPermisos(i)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
