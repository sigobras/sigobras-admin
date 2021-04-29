import React, { useState, useEffect } from "react";
import axios from "axios";
import BigNumber from "bignumber.js";
import { MdCheck, MdCancel } from "react-icons/md";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { UrlServer } from "../../Utils/ServerUrlConfig";
import { Redondea } from "../../Utils/Funciones";
import CargarExcel from "./CargarExcel";
import CustomInput from "../../../libs/CustomInput";
import "./valorizaciones.css";
export default ({ id_partida, recargar }) => {
  //modal
  const [modal, setModal] = useState(false);
  const toggle = () => {
    if (!modal) {
      cargarAvancesMetrado();
    } else {
      recargar();
    }
    setModal(!modal);
  };
  //avances
  const [AvancesMetrado, setAvancesMetrado] = useState([]);
  async function cargarAvancesMetrado() {
    const res = await axios.get(`${UrlServer}/v1/avance/partida`, {
      params: {
        id: id_partida,
      },
    });
    setAvancesMetrado(res.data);
  }
  async function actualizarValorAvance(id, valor) {
    if (
      confirm(
        " el valor que se modifico se sobrescribira ,Esta seguro de hacer este cambio ?"
      )
    ) {
      const res = await axios.put(`${UrlServer}/v1/avance/${id}`, {
        valor,
      });
      cargarAvancesMetrado();
    }
  }
  return (
    <div>
      <Button onClick={toggle} color="info">
        Avances
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
          <table className="whiteThem-table">
            <thead>
              <tr>
                <th>fecha</th>
                <th>valor</th>
                <th>descripcion</th>
                <th>observacion</th>
                <th>fecha registro</th>
              </tr>
            </thead>
            <tbody>
              {AvancesMetrado.map((item, i) => (
                <tr>
                  <td>{item.fecha}</td>
                  <td>
                    <CustomInput
                      value={item.valor}
                      onBlur={(value) =>
                        actualizarValorAvance(item.id_AvanceActividades, value)
                      }
                    />
                    {/* {item.valor} */}
                  </td>
                  <td>{item.descripcion}</td>
                  <td>{item.observacion}</td>
                  <td>{item.fecha_registro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
