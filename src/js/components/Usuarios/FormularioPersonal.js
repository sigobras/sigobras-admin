import React, { useState, forwardRef, useImperativeHandle } from "react";
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
import axios from "axios";
import { FaSearch } from "react-icons/fa";

import { UrlServer } from "../Utils/ServerUrlConfig";
export default forwardRef(({ recargar }, ref) => {
  const [estadoFormulario, setEstadoFormulario] = useState("nuevo");
  useImperativeHandle(ref, () => ({
    openModal(item, id_ficha) {
      setEstadoFormulario("asignando");
      getCargos();
      var tempObject = {
        Accesos_id_acceso: item.id_acceso,
        Fichas_id_ficha: id_ficha,
        Cargos_id_cargo: "",
      };
      console.log(tempObject, item, id_ficha);
      setDataAsignacion(tempObject);
      setModalFormulario(true);
    },
  }));
  //formulario
  const [ModalFormulario, setModalFormulario] = useState(false);
  function toggleModalFormulario() {
    setEstadoFormulario("nuevo");
    setModalFormulario(!ModalFormulario);
    setDataFormulario({});
  }
  const [DataFormulario, setDataFormulario] = useState({});

  function onChangeInputFormulario(e) {
    setDataFormulario({ ...DataFormulario, [e.target.name]: e.target.value });
  }
  async function saveUsuario(event) {
    event.preventDefault();
    if (estadoFormulario == "nuevo") {
      if (confirm("Esta seguro que desea registrar un nuevo usuario?")) {
        try {
          var res = await axios.post(
            `${UrlServer}/v1/usuarios`,
            DataFormulario
          );
          recargar();
          alert(res.data.message);
          toggleModalFormulario();
        } catch (error) {
          if (error.response.data.message == "ER_DUP_ENTRY") {
            alert("El dni o nombre de usuario ya esta registrado");
          } else {
            alert("Ocurrio un error");
          }
        }
      }
    } else if (estadoFormulario == "asignando") {
      if (confirm("Esta seguro que desea este usuario a esa obra?")) {
        console.log("DataAsignacion", DataAsignacion);
        try {
          var res = await axios.post(
            `${UrlServer}/v1/usuarios/asignarObra`,
            DataAsignacion
          );
          recargar();
          alert(res.data.message);
          toggleModalFormulario();
        } catch (error) {
          if (error.response.data.message == "ER_DUP_ENTRY") {
            alert("El dni o nombre de usuario ya esta registrado");
          } else {
            alert("Ocurrio un error");
          }
        }
      }
    }
  }
  //asignando
  const [DataAsignacion, setDataAsignacion] = useState({});
  function onChangeInputFormularioAsignacion(e) {
    setDataAsignacion({ ...DataAsignacion, [e.target.name]: e.target.value });
  }
  const [CargosLimitados, setCargosLimitados] = useState([]);
  async function getCargos() {
    var res = await axios.get(`${UrlServer}/v1/cargos/`);
    setCargosLimitados(res.data);
  }
  return (
    <div>
      <Button outline color="primary" onClick={() => toggleModalFormulario()}>
        Agregar Personal
      </Button>
      <Modal isOpen={ModalFormulario} toggle={() => toggleModalFormulario()}>
        <ModalHeader>Ingrese los datos</ModalHeader>
        <form onSubmit={saveUsuario}>
          <ModalBody>
            {estadoFormulario == "nuevo" && (
              <>
                <Row style={{ width: "600px" }}>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Nombre">Nombre *</Label>
                      <Input
                        type="text"
                        value={DataFormulario.nombre}
                        onChange={onChangeInputFormulario}
                        name="nombre"
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Apellido Paterno">Apellido Paterno *</Label>
                      <Input
                        type="text"
                        value={DataFormulario.apellido_paterno}
                        onChange={onChangeInputFormulario}
                        name="apellido_paterno"
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row style={{ width: "600px" }}>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Apellido Materno">Apellido Materno*</Label>
                      <Input
                        type="text"
                        value={DataFormulario.apellido_materno}
                        onChange={onChangeInputFormulario}
                        name="apellido_materno"
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="DNI">DNI*</Label>
                      <Input
                        type="text"
                        value={DataFormulario.dni}
                        onChange={onChangeInputFormulario}
                        name="dni"
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row style={{ width: "600px" }}>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Direccion">Dirección*</Label>
                      <Input
                        type="text"
                        value={DataFormulario.direccion}
                        onChange={onChangeInputFormulario}
                        name="direccion"
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Email">Email</Label>
                      <Input
                        type="text"
                        value={DataFormulario.email}
                        onChange={onChangeInputFormulario}
                        name="email"
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row style={{ width: "600px" }}>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="N° Celular">N° Celular*</Label>
                      <Input
                        type="text"
                        value={DataFormulario.celular}
                        onChange={onChangeInputFormulario}
                        name="celular"
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Código de colegiatura">
                        Código de colegiatura
                      </Label>
                      <Input
                        type="text"
                        value={DataFormulario.cpt}
                        onChange={onChangeInputFormulario}
                        name="cpt"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row style={{ width: "600px" }}>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Usuario">Usuario*</Label>
                      <Input
                        type="text"
                        value={DataFormulario.usuario}
                        onChange={onChangeInputFormulario}
                        name="usuario"
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="Password">Password*</Label>
                      <Input
                        type="text"
                        value={DataFormulario.password}
                        onChange={onChangeInputFormulario}
                        name="password"
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </>
            )}
            {estadoFormulario == "asignando" && (
              <>
                <Row style={{ width: "600px" }}>
                  <Col md={6}>
                    <FormGroup>
                      <Label>CARGO *</Label>
                      <Input
                        type="select"
                        value={DataAsignacion.Cargos_id_cargo}
                        onChange={onChangeInputFormularioAsignacion}
                        name="Cargos_id_cargo"
                        required
                      >
                        <option disabled hidden value="">
                          SELECCIONE
                        </option>
                        {CargosLimitados.map((item, i) => (
                          <option key={item.id_Cargo} value={item.id_Cargo}>
                            {item.nombre}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="fecha_inicio">Fecha de inicio</Label>
                      <Input
                        type="date"
                        value={DataFormulario.fecha_inicio}
                        // onChange={onChangeInputFormulario}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary">
              Guardar Usuario
            </Button>{" "}
            <Button color="secondary" onClick={() => toggleModalFormulario()}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
});
