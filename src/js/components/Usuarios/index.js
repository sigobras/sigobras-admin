import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import axios from "axios";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";

import { UrlServer } from "../Utils/ServerUrlConfig";
import FormularioPersonal from "./FormularioPersonal";
export default () => {
  //USUARIOS
  const [Usuarios, setUsuarios] = useState([]);
  // sessionStorage.getItem("idobra") == 0;
  async function fetchUsuarios(source) {
    var request = await axios.get(
      `${UrlServer}/v1/usuarios`,
      {
        params: {
          group_by: "id_acceso",
          sort_by: "-id_acceso",
          textoBuscado: UsuarioBuscado,
          id_ficha: sessionStorage.getItem("idobra"),
        },
      },
      source ? { cancelToken: source.token } : {}
    );
    setUsuarios(request.data);
  }
  /// search box
  const [UsuarioBuscado, setUsuarioBuscado] = useState("");
  const [UsuarioSeleccionado, setUsuarioSeleccionado] = useState(-1);
  const [UsuarioObras, setUsuarioObras] = useState([]);
  async function fetchUsuarioObras() {
    var res = await axios.post(`${UrlServer}/listaObrasByIdAcceso`, {
      id_acceso: UsuarioSeleccionado,
      id_tipoObra: 0,
    });
    setUsuarioObras(res.data);
  }
  //obras
  const [Obras, setObras] = useState([]);
  async function fetchObras(source) {
    var res = await axios.get(
      `${UrlServer}/v1/obras`,
      {
        params: {
          sort_by: "id_ficha-asc",
          id_acceso: 0,
          textoBuscado: ObraBuscada,
        },
      },
      source ? { cancelToken: source.token } : {}
    );
    setObras(res.data);
  }
  const [ObraBuscada, setObraBuscada] = useState("");
  const [onHoverUsuario, setonHoverUsuario] = useState(0);
  const FormularioAsignacionRef = useRef();
  useEffect(() => {
    let source = axios.CancelToken.source();
    fetchUsuarios(source);
    return () => {
      source.cancel();
    };
  }, [UsuarioBuscado]);
  useEffect(() => {
    let source = axios.CancelToken.source();
    fetchObras(source);
    return () => {
      source.cancel();
    };
  }, [ObraBuscada]);
  useEffect(() => {
    if (UsuarioSeleccionado != -1) {
      fetchUsuarioObras();
    }
  }, [UsuarioSeleccionado]);
  return (
    <div>
      {sessionStorage.getItem("idobra") == 0 && (
        <FormularioPersonal
          recargar={fetchUsuarios}
          ref={FormularioAsignacionRef}
        />
      )}

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
                      var id_ficha = e.dataTransfer.getData("id_ficha");
                      // asignarObra(item.id_acceso, id_ficha, item.id_cargo);
                      console.log(FormularioAsignacionRef);
                      FormularioAsignacionRef.current.openModal(item, id_ficha);
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
                      onClick={() => {
                        if (UsuarioSeleccionado == item.id_acceso) {
                          setUsuarioSeleccionado(-1);
                        } else {
                          setUsuarioSeleccionado(item.id_acceso);
                        }
                      }}
                      style={{
                        cursor: "pointer",
                      }}
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
                              {UsuarioObras.map((item) => (
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
                {Obras.map((item, i) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
