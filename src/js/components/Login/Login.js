import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import axios from 'axios'
import { UrlServer } from '../Utils/ServerUrlConfig'
import LogoSigobras from '../../../images/logoSigobras.png'
import '../../../css/login.css'
class Login extends Component {
  constructor() {
    super();
    this.state = {
      user: '',
      pass: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    axios.post(UrlServer + '/login', {
      usuario: this.state.user,
      password: this.state.pass
    })
      .then(async(res) => {
        console.log(res.data)
        if (res.data) {
          await sessionStorage.setItem("cargo", res.data.nombre_cargo);
          await sessionStorage.setItem("nombre", res.data.nombre_usuario);
          await sessionStorage.setItem("idacceso", res.data.id_acceso);
          window.location.href = "/"
        }
      })
      .catch((error) => {
        console.log("ERROR", error);
      });
      
  }
  render() {
    const { } = this.state;
    return (
      <div>
        <div className="modal-dialog modal-login shadow">
          <div className="modal-content">
            <div className="modal-header">
              <div className="avatar">
                <img src={LogoSigobras} className="pt-2" alt="sigoobras sac" height="75" />
              </div>
              <h4 className="text-dark">Inicie sesión</h4>
            </div>
            <div className="modal-body">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input type="text" className="form-control" name="user" placeholder="Usuario" required="required" onChange={this.handleChange} required autoFocus />
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" name="pass" placeholder="Password" required="required" onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-lg btn-block">INGRESAR</button>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <a href="https://sigobras.com/">SISTEMA DE INFORMACIÓN GERENCIAL DE OBRAS S.A.C. Ⓒ 2018 - 2019</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
class Example extends Component {
  constructor(props) {
    super(props);
    this.onEntering = this.onEntering.bind(this);
    this.onEntered = this.onEntered.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggle1 = this.toggle1.bind(this);
    this.state = {
      collapse: false,
      status: 'cerrado'
    };
  }
  onEntering() {
    this.setState({ status: 'abriendo...' });
  }
  onEntered() {
    this.setState({ status: 'abierto' });
  }
  onExiting() {
    this.setState({ status: 'cerrando...' });
  }
  onExited() {
    this.setState({ status: 'cerrado' });
  }
  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }
  toggle1() {
    this.setState({ collapse: !this.state.collapse });
  }
  render() {
    return (
      <div>
        <Button color="primary" onClick={this.toggle} style={{ marginBottom: '1rem' }}>Toggle</Button>
        <h5>Current state: {this.state.status}</h5>
        <Collapse
          isOpen={this.state.collapse}
          onEntering={this.onEntering}
          onEntered={this.onEntered}
          onExiting={this.onExiting}
          onExited={this.onExited}
        >
          <Card>
            <CardBody>
              Anim pariatur cliche reprehenderit,
             enim eiusmod high life accusamus terry richardson ad squid. Nihil
             anim keffiyeh helvetica, craft beer labore wes anderson cred
             nesciunt sapiente ea proident.
            </CardBody>
          </Card>
        </Collapse>
        <hr />
        <Button color="primary" onClick={this.toggle1} style={{ marginBottom: '1rem' }}>Toggle1</Button>
        <h5>Current state: {this.state.status}</h5>
        <Collapse
          isOpen={this.state.collapse}
          onEntering={this.onEntering}
          onEntered={this.onEntered}
          onExiting={this.onExiting}
          onExited={this.onExited}
        >
          <Card>
            <CardBody>
              Anim pariatur cliche reprehenderit,
             enim eiusmod high life accusamus terry richardson ad squid. Nihil
             anim keffiyeh helvetica, craft beer labore wes anderson cred
             nesciunt sapiente ea proident.
            </CardBody>
          </Card>
        </Collapse>
      </div>
    );
  }
}
