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
export default ({ partida, recargar }) => {
  //modal
  const [modal, setModal] = useState(false);
  const toggle = () => {
    if (modal) {
      recargar();
    }
    setModal(!modal);
  };
  //avances
  async function actualizar(costo_unitario) {
    try {
      if (
        confirm(
          "Este cambio es irreversible, esta seguro de realizar esta modificacion?"
        )
      ) {
        const res = await axios.put(
          `${UrlServer}/v1/partidas/${partida.id_partida}`,
          {
            costo_unitario,
          }
        );
      }
    } catch (error) {
      alert("Ocurrio un error");
    }
  }

  return (
    <div>
      <Button onClick={toggle} color="success">
        partida
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
              <td>{partida.item}</td>
              <td>{partida.descripcion}</td>
              <td>
                <CustomInput
                  value={partida.costo_unitario}
                  onBlur={(value) => actualizar(value)}
                />
              </td>
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
