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
export default () => {
  useEffect(() => {
    fetchUsuarios();
    fetchObras();
  }, []);

  //USUARIOS
  const [Usuarios, setUsuarios] = useState([]);
  async function fetchUsuarios() {
    var request = await axios.post(`${UrlServer}/getUsuariosByCargoAdmin`, {
      id_ficha: sessionStorage.getItem("idobra"),
      id_cargo: 0,
      estado: "",
      cargos_tipo_id: 0,
      textoBuscado: UsuarioBuscado,
    });
    console.log("cargando usuarios", request.data);
    setUsuarios(request.data);
  }
  /// search box
  const [UsuarioBuscado, setUsuarioBuscado] = useState("");
  const [UsuarioSeleccionado, setUsuarioSeleccionado] = useState(-1);
  function onChangeUsuarioSeleccionado(id_acceso) {
    if (UsuarioSeleccionado == id_acceso) {
      setUsuarioSeleccionado(-1);
    } else {
      setUsuarioObras([]);
      setUsuarioSeleccionado(id_acceso);
      fetchUsuarioObras(id_acceso);
    }
  }

  const [UsuarioObras, setUsuarioObras] = useState([]);
  async function fetchUsuarioObras(id_acceso) {
    var res = await axios.post(`${UrlServer}/listaObrasByIdAcceso`, {
      id_acceso: id_acceso,
      id_tipoObra: 0,
    });
    setUsuarioObras(res.data);
  }

  useEffect(() => {
    fetchUsuarios();
  }, [UsuarioBuscado]);
  //obras
  const [Obras, setObras] = useState([]);
  async function fetchObras() {
    var request = await axios.post(`${UrlServer}/listaObras`, {
      id_tipoObra: 0,
      textoBuscado: ObraBuscada,
    });
    setObras(request.data);
  }
  const [ObraBuscada, setObraBuscada] = useState("");
  useEffect(() => {
    console.log("CARGANDO OBRAS");
    fetchObras();
  }, [ObraBuscada]);
  //formulario
  const [ModalFormulario, setModalFormulario] = useState(false);
  function toggleModalFormulario() {
    if (!ModalFormulario) {
      getCargos();
    }
    setModalFormulario(!ModalFormulario);
  }
  const [DataFormulario, setDataFormulario] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    dni: "",
    direccion: "",
    email: "",
    celular: "",
    cpt: "",
    id_cargo: "SELECCIONE",
    id_ficha: sessionStorage.getItem("idobra"),
    usuario: "",
    password: "",
  });
  const [Cargos, setCargos] = useState([]);
  async function getCargos() {
    var request = await axios.get(`${UrlServer}/listaCargos`);
    setCargos(request.data);
  }
  function onChangeInputFormulario(name, value) {
    var dataFormularioClone = { ...DataFormulario };
    dataFormularioClone[name] = value;
    setDataFormulario(dataFormularioClone);
  }
  function validacionFormulario(data) {
    var errores = "";
    if (data.nombre == "") errores += "nombre,";
    if (data.apellido_paterno == "") errores += "apellido_paterno,";
    if (data.apellido_materno == "") errores += "apellido_materno,";
    if (data.dni.length != 8) errores += "dni,";
    if (data.direccion == "") errores += "direccion,";
    if (data.celular.length != 9) errores += "celular,";
    if (data.id_cargo == "SELECCIONE") errores += "cargo,";
    errores = errores.slice(0, -1);
    return errores;
  }
  const [Verificador, setVerificador] = useState(false);
  async function saveUsuario() {
    console.log("DataFormulario", DataFormulario);
    setVerificador(true);
    var errores = validacionFormulario(DataFormulario);
    if (errores != "") {
      alert("Falta llenar los siguientes campos " + errores);
    } else {
      if (confirm("Esta seguro que desea registrar un nuevo usuario?")) {
        var request = await axios.post(
          `${UrlServer}/postUsuarioObra`,
          DataFormulario
        );
        alert(request.data.message);
        toggleModalFormulario();
        fetchUsuarios();
      }
    }
  }
  const [onHoverUsuario, setonHoverUsuario] = useState(0);
  //asignar obra
  async function asignarObra(id_acceso, id_ficha, id_cargo) {
    try {
      var request = await axios.post(`${UrlServer}/asignarObra`, {
        Accesos_id_acceso: id_acceso,
        Fichas_id_ficha: id_ficha,
        cargos_id_cargo: id_cargo,
      });
      alert(request.data.message);
    } catch (error) {
      console.log("ERROR", error.response);
      alert(error.response.data.message);
    }
  }

  return (
    <div>
      <Button outline color="primary" onClick={() => toggleModalFormulario()}>
        Agregar Personal
      </Button>
      <Row form>
        <Col md={6}>
          <FormGroup>
            <Label for="exampleSearch">Search</Label>
            <Input
              type="search"
              name="search"
              id="exampleSearch"
              placeholder="buscar personal"
              onChange={(e) => setUsuarioBuscado(e.target.value)}
            />
          </FormGroup>
        </Col>
        {sessionStorage.getItem("idobra") == 0 && (
          <Col md={6}>
            <FormGroup>
              <Label for="exampleSearch">Search</Label>
              <Input
                type="search"
                name="search"
                id="exampleSearch"
                placeholder="buscar OBRAS"
                onChange={(e) => setObraBuscada(e.target.value)}
              />
            </FormGroup>
          </Col>
        )}
      </Row>
      <div className="row">
        <div
          className={sessionStorage.getItem("idobra") == 0 ? "col-6" : "col-12"}
          style={{
            overflowY: "auto",
            height: "500px",
          }}
        >
          <table className="table table-sm small">
            <thead>
              <tr>
                <th>ID ACCESO</th>
                <th>PERSONAL</th>
                <th>CARGO</th>
                <th>CELULAR</th>
                <th>DNI</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(Usuarios) &&
                Usuarios.map((item, i) => [
                  <tr
                    key={i}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setonHoverUsuario(item.id_acceso);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      setonHoverUsuario(0);
                      console.log("onDrop");
                      var id_ficha = e.dataTransfer.getData("id_ficha");
                      console.log("id_ficha es ", id_ficha);
                      asignarObra(item.id_acceso, id_ficha, item.id_cargo);
                    }}
                    style={
                      onHoverUsuario == item.id_acceso
                        ? {
                            backgroundColor: "blue",
                          }
                        : {
                            backgroundColor: "#242526",
                          }
                    }
                  >
                    <td
                      onClick={() =>
                        onChangeUsuarioSeleccionado(item.id_acceso)
                      }
                    >
                      {item.id_acceso}
                    </td>
                    <td>{item.nombre_usuario}</td>
                    <td>{item.cargo_nombre}</td>
                    <td>{item.celular}</td>
                    <td>{item.dni}</td>
                  </tr>,
                  UsuarioSeleccionado == item.id_acceso && (
                    <tr>
                      <td colSpan="8">
                        <div>
                          <table
                            class="table-light"
                            style={{
                              fontSize: "9px",
                              width: "100%",
                            }}
                          >
                            <thead class="thead-light">
                              <tr>
                                <th>ID FICHA</th>
                                <th>CODIGO</th>
                                <th>META</th>
                              </tr>
                            </thead>
                            <tbody
                              style={{
                                color: "black",
                              }}
                            >
                              {UsuarioObras.map((item, i) => (
                                <tr>
                                  <td>{item.id_ficha}</td>
                                  <td>{item.codigo}</td>
                                  <td>{item.g_meta}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  ),
                ])}
            </tbody>
          </table>
        </div>
        {sessionStorage.getItem("idobra") == 0 && (
          <div
            className="col-6"
            style={{
              overflowY: "auto",
              height: "500px",
            }}
          >
            <table className="table table-sm small">
              <thead>
                <tr>
                  <th>ID FICHA</th>
                  <th>CODIGO</th>
                  <th>META</th>
                </tr>
              </thead>
              <tbody>
                {Obras.map((item, i) => [
                  <tr
                    key={i}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("id_ficha", item.id_ficha);
                    }}
                  >
                    <td>{item.id_ficha}</td>
                    <td>{item.codigo}</td>
                    <td>{item.g_meta}</td>
                  </tr>,
                ])}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={ModalFormulario} toggle={() => toggleModalFormulario()}>
        <ModalHeader>Ingrese los datos</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <FormGroup>
                <Label>CARGO *</Label>
                <Input
                  type="select"
                  value={DataFormulario.id_cargo}
                  onChange={(e) =>
                    onChangeInputFormulario("id_cargo", e.target.value)
                  }
                  className="form-control"
                  invalid={
                    Verificador && DataFormulario.id_cargo == "SELECCIONE"
                  }
                >
                  <option disabled hidden>
                    SELECCIONE
                  </option>
                  {Cargos.map((item, i) => (
                    <option key={i} value={item.id_Cargo}>
                      {item.nombre}
                    </option>
                  ))}
                </Input>

                <FormFeedback>Seleccione un cargo</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row style={{ width: "600px" }}>
            <Col md={6}>
              <FormGroup>
                <Label for="Nombre">Nombre *</Label>
                <Input
                  type="text"
                  value={DataFormulario.nombre}
                  onChange={(e) =>
                    onChangeInputFormulario("nombre", e.target.value)
                  }
                  className="form-control"
                  invalid={Verificador && !DataFormulario.nombre}
                />
                <FormFeedback>El nombre es requerido</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="Apellido Paterno">Apellido Paterno *</Label>
                <Input
                  type="text"
                  value={DataFormulario.apellido_paterno}
                  onChange={(e) =>
                    onChangeInputFormulario("apellido_paterno", e.target.value)
                  }
                  className="form-control"
                  invalid={Verificador && !DataFormulario.apellido_paterno}
                />
                <FormFeedback>El apellido paterno es requerido</FormFeedback>
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
                  onChange={(e) =>
                    onChangeInputFormulario("apellido_materno", e.target.value)
                  }
                  className="form-control"
                  invalid={Verificador && !DataFormulario.apellido_materno}
                />
                <FormFeedback>El apellido materno es requerido</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="DNI">DNI*</Label>
                <Input
                  type="number"
                  value={DataFormulario.dni}
                  onChange={(e) =>
                    onChangeInputFormulario("dni", e.target.value)
                  }
                  className="form-control"
                  min="8"
                  max="8"
                  invalid={Verificador && DataFormulario.dni.length != 8}
                />
                <FormFeedback>El dni debe tener 8 digitos</FormFeedback>
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
                  onChange={(e) =>
                    onChangeInputFormulario("direccion", e.target.value)
                  }
                  className="form-control"
                  invalid={Verificador && !DataFormulario.direccion}
                />
                <FormFeedback>La direccion es requerida</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="Email">Email</Label>
                <Input
                  type="text"
                  value={DataFormulario.email}
                  onChange={(e) =>
                    onChangeInputFormulario("email", e.target.value)
                  }
                  className="form-control"
                  invalid={Verificador && !DataFormulario.apellido_paterno}
                />
                <FormFeedback>El apellido paterno es requerido</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row style={{ width: "600px" }}>
            <Col md={6}>
              <FormGroup>
                <Label for="N° Celular">N° Celular*</Label>
                <Input
                  type="number"
                  value={DataFormulario.celular}
                  onChange={(e) =>
                    onChangeInputFormulario("celular", e.target.value)
                  }
                  className="form-control"
                  invalid={Verificador && DataFormulario.celular.length != 9}
                />
                <FormFeedback>El celular debe tener 9 digitos</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="Código de colegiatura">Código de colegiatura</Label>
                <Input
                  type="text"
                  value={DataFormulario.cpt}
                  onChange={(e) =>
                    onChangeInputFormulario("cpt", e.target.value)
                  }
                  className="form-control"
                  invalid={Verificador && !DataFormulario.apellido_paterno}
                />
                <FormFeedback>El apellido paterno es requerido</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row style={{ width: "600px" }}>
            <Col md={6}>
              <FormGroup>
                <Label for="USUARIO">USUARIO*</Label>
                <Input
                  type="text"
                  value={DataFormulario.usuario}
                  onChange={(e) =>
                    onChangeInputFormulario("usuario", e.target.value)
                  }
                  className="form-control"
                  // invalid={Verificador && DataFormulario.usuario.length != 9}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="PASSWORD">PASSWORD</Label>
                <Input
                  type="text"
                  value={DataFormulario.password}
                  onChange={(e) =>
                    onChangeInputFormulario("password", e.target.value)
                  }
                  className="form-control"
                  // invalid={Verificador && !DataFormulario.apellido_paterno}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => saveUsuario()}>
            Guardar Usuario
          </Button>{" "}
          <Button color="secondary" onClick={() => toggleModalFormulario()}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
