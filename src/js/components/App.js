// libraris
import React, { Component } from 'react';
import { FaAlignJustify, FaPlus, FaHouseDamage, FaPeopleCarry, FaLinode, FaSuperscript } from 'react-icons/fa';
import { UncontrolledCollapse } from 'reactstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// app assets
import LogoSigobras from '../../images/logoSigobras.png';
// app components
import UserNav from './Otros/UserNav';
import NotificacionNav from './Otros/NotificacionNav';
import MensajeNav from "./Otros/MensajesNav";
import Inicio from '../components/Inicio/Inicio'
// components
import ObraNueva from './Obras/ObraNueva'
import PartidasNuevas from '../components/Obras/PartidasNuevas'
import ComponentesNuevos from '../components/Obras/ComponentesNuevos'
import ListaObras from '../components/Obras/ListaObras'
import listaCargos from '../components/Cargos/ListaCargos'
import ListaUsuarios from '../components/Usuarios/ListaUsuarios'
import IngresoCuardoMetrados from '../components/Obras/IngresoCuardoMetrados'
import VerificacionValorizacion from '../components/Obras/VerificacionValorizacion'
import HistorialObra from '../components/Obras/HistorialObra'
import RevisarPresupuesto from '../components/Obras/RevisarPresupuesto'
import clasificadorGastos from '../components/Otros/clasificadorGastos'
import IngresoAnalitico from '../components/Obras/IngresoAnalitico'
class AppAng extends Component {
    constructor() {
        super();
        this.state = {
            navbarExpland: true
        }
        this.ButtonToogle = this.ButtonToogle.bind(this);
    }
    ButtonToogle() {
        this.setState({
            navbarExpland: !this.state.navbarExpland
        });
        localStorage.setItem('opcionBtnToogle', this.state.navbarExpland);
    }
    render() {
        return (
            <Router>
                <div>
                    <nav className="navbar navbar-dark fixed-top bg-primary flex-md-nowrap p-0 shadow">
                        <span className="navbar-brand col-sm-3 col-md-2 mr-0">
                            <img src={LogoSigobras} className="rounded p-0 m-0" alt="logo sigobras" width="30" /> ADMIN SIGOBRAS
                            <button className="btn btn-link btn-sm m-0 p-0 float-right text-white" onClick={this.ButtonToogle}>
                                <FaAlignJustify />
                            </button>
                        </span>
                        <div className="clearfix d-none d-sm-block p-0 m-0">
                            <div className="float-right"><UserNav /></div>
                            <div className="float-right"><MensajeNav /></div>
                            <div className="float-right"><NotificacionNav /></div>
                        </div>
                    </nav>
                    <div className="container-fluid">
                        <div className="row">
                            <nav className={JSON.parse(localStorage.getItem('opcionBtnToogle')) ? 'navbarExpland  bg-light sidebar' : "navbarCollapse bg-light sidebar"}>
                                <div className="sidebar-sticky">
                                    <ul className="nav flex-column ull">
                                        <li className="lii border-top">
                                            <Link to="/Inicio" className="nav-link"> <FaHouseDamage /><span> INICIO</span> </Link>
                                        </li>
                                        <li className="lii">
                                            <a className="nav-link" href="#ADMINS" id="ADMINS"><FaSuperscript /><span> OBRAS <div className="float-right"><FaPlus /></div> </span> </a>
                                            <UncontrolledCollapse toggler="#ADMINS">
                                                <ul className="nav flex-column ull">
                                                    <li className="lii">
                                                        <Link to="ListaObras" className="nav-link"><FaPeopleCarry /> ListaObras</Link>
                                                    </li>
                                                    <li className="lii">
                                                        <Link to="ObraNueva" className="nav-link"><FaLinode /> Obra nueva</Link>
                                                    </li>
                                                </ul>
                                            </UncontrolledCollapse>
                                        </li>
                                        <li className="lii">
                                            <a className="nav-link" href="#OTROS" id="OTROS"><FaSuperscript /><span> OTROS <div className="float-right"><FaPlus /></div> </span> </a>
                                            <UncontrolledCollapse toggler="#OTROS">
                                                <ul className="nav flex-column ull">
                                                    <li className="lii">
                                                        <Link to="clasificadorGastos" className="nav-link"><FaPeopleCarry /> Clasificador de gastos</Link>
                                                    </li>
                                                </ul>
                                            </UncontrolledCollapse>
                                        </li>
                                        <li className="lii">
                                            <a className="nav-link" href="#CARGOS" id="CARGOS"><FaSuperscript /><span> CARGOS <div className="float-right"><FaPlus /></div> </span> </a>
                                            <UncontrolledCollapse toggler="#CARGOS">
                                                <ul className="nav flex-column ull">
                                                    <li className="lii">
                                                        <Link to="listaCargos" className="nav-link"><FaPeopleCarry /> lista Cargos</Link>
                                                    </li>
                                                </ul>
                                            </UncontrolledCollapse>
                                        </li>
                                        <li className="lii">
                                            <a className="nav-link" href="#USUARIOS" id="USUARIOS"><FaSuperscript /><span> USUARIOS <div className="float-right"><FaPlus /></div> </span> </a>
                                            <UncontrolledCollapse toggler="#USUARIOS">
                                                <ul className="nav flex-column ull">
                                                    <li className="lii">
                                                        <Link to="ListaUsuarios" className="nav-link"><FaPeopleCarry /> Lista Usuarios</Link>
                                                    </li>
                                                </ul>
                                            </UncontrolledCollapse>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                            <main role="main" className="col px-2">
                                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                                    <div className="btn-toolbar mb-2 mb-md-0">
                                        <div className="btn-group mr-2">
                                            <button type="button" className="btn btn-sm btn-outline-secondary">Exportar</button>
                                            <button type="button" className="btn btn-sm btn-outline-secondary">PDF</button>
                                        </div>
                                        <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                                            <span data-feather="calendar"></span>
                                            OPCIONES
                                        </button>
                                    </div>
                                </div>
                                <div className="px-1 table-responsive">
                                    <Route path="/Inicio" component={Inicio} />
                                    <Route path="/ObraNueva" component={ObraNueva} />
                                    <Route path="/PartidasNuevas" component={PartidasNuevas} />
                                    <Route path="/ComponentesNuevos" component={ComponentesNuevos} />
                                    <Route path="/ListaObras" component={ListaObras} />
                                    <Route path="/listaCargos" component={listaCargos} />
                                    <Route path="/ListaUsuarios" component={ListaUsuarios} />
                                    <Route path="/IngresoCudroMetradosEjecutados" component={IngresoCuardoMetrados} />
                                    <Route path="/VerificacionValorizacion" component={VerificacionValorizacion} />
                                    <Route path="/HistorialObra" component={HistorialObra} />
                                    <Route path="/RevisarPresupuesto" component={RevisarPresupuesto} />
                                    <Route path="/clasificadorGastos" component={clasificadorGastos} />
                                    <Route path="/IngresoAnalitico" component={IngresoAnalitico} />
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}
export default AppAng;
