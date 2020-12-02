import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from "react-router-dom";
import LogoSigobras from '../../images/logoSigobras.png';
import UserNav from './Otros/UserNav';
import { MdDehaze } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import { FaChevronRight, FaChevronUp } from 'react-icons/fa';
import { Collapse } from 'reactstrap';
import axios from 'axios';
import { UrlServer } from './Utils/ServerUrlConfig'

import Inicio from "./Inicio/index"
import Obra from "./Obra/index"
import Componentes from "./Componentes/index"
import Partidas from "./Partidas/index"
import Avances from "./Avances/index"
import Usuarios from "./Usuarios/index"
import ListaObras from "./Obras/ListaObras"
import PartidasNuevas from "./Partidas/PartidasNuevas"
import PartidasNuevasPorContrato from "./Partidas/PartidasNuevasPorContrato"
import ListaObrasOld from "./Obras/ListaObras"


export default () => {
    useEffect(() => {
        if (sessionStorage.getItem("idFicha") != null && sessionStorage.getItem("idFicha") != 0) {
            fetchDatosGenerales(sessionStorage.getItem("idFicha"))
        }
        if(sessionStorage.getItem("idFicha") == 0){
            setDataObra({ id_ficha: 0 ,g_meta:"TODAS LAS OBRAS",codigo:"todos"})
        }
    }, []);
    const [navbarExpland, setnavbarExpland] = useState(false);
    function ButtonToogle() {
        setnavbarExpland(!navbarExpland)
        localStorage.setItem('opcionBtnToogle', navbarExpland);
    }
    const [collapse, setcollapse] = useState(-1);
    function CollapseMenu(index) {
        setcollapse(index != collapse ? index : -1)
    }
    //datos generales
    const [DataObra, setDataObra] = useState([]);
    async function fetchDatosGenerales(id_ficha) {
        var res = await axios.post(`${UrlServer}/getDatosGenerales2`, {
            id_ficha
        })
        setDataObra(res.data)
    }
    async function recargar(ficha) {
        await sessionStorage.setItem("idFicha", ficha.id_ficha);
        await sessionStorage.setItem("codigoObra", ficha.codigo);
        if(ficha.id_ficha != 0){
            fetchDatosGenerales(sessionStorage.getItem("idFicha"))
        }
        setDataObra(ficha)
    }
    return (
        <Router>
            <div>
                <nav className="navbar fixed-top FondoBarra flex-md-nowrap p-1 border-button">
                    <div>
                        <img src={LogoSigobras} className="rounded p-0 m-0" alt="logo sigobras" width="45" height="28" />
                        <span className="textSigobras h5 ml-2"> SIGOBRAS </span>
                        <i className="small"> V. 1.0</i>
                    </div>
                    <div>
                        <span className="text-white ButtonToogleMenu" onClick={ButtonToogle}>
                            <MdDehaze size={20} />
                        </span>
                    </div>
                    <div className="ml-auto">
                        <div className="float-right"><UserNav /></div>
                    </div>
                </nav>

                <div className="container-fluid ">
                    <ToastContainer
                        position="bottom-right"
                        autoClose={1000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnVisibilityChange
                        draggable
                        pauseOnHover
                    />
                    <div className="row">
                        <nav
                            className={JSON.parse(localStorage.getItem('opcionBtnToogle')) ? 'navbarExplandLeft sidebar' : "navbarCollapseLeft sidebar"}
                        >
                            <div className="sidebar-sticky">
                                <ul className="nav flex-column ull">

                                    <li className="lii">
                                        <NavLink to="/Inicio" activeclassname="nav-link">
                                            <span> INICIO</span>
                                        </NavLink>
                                    </li>
                                    <li className="lii">
                                        <NavLink
                                            to="/Obra"
                                            activeclassname="nav-link"
                                        >
                                            OBRA
                                        </NavLink>
                                    </li>
                                    <li className="lii">
                                        <NavLink to="/Componentes" activeclassname="nav-link"> <span> COMPONENTES</span> </NavLink>
                                    </li>
                                    <li className="lii">
                                        <a
                                            className="nav-link"
                                            onClick={() => CollapseMenu("Partidas")}
                                        >
                                            PARTIDAS
                                            <div className="float-right">
                                                {collapse === 1 ? <FaChevronUp /> : <FaChevronRight />}
                                            </div>
                                        </a>
                                        <Collapse isOpen={collapse === "Partidas"}>
                                            <ul className="nav flex-column ull ">
                                                <li className="lii pl-3"

                                                >
                                                    <NavLink
                                                        to="/PartidasNuevas"
                                                        activeclassname="nav-link"
                                                    >
                                                        Partidas nuevas AD
                                                    </NavLink>
                                                </li>
                                                <li className="lii pl-3"

                                                >
                                                    <NavLink
                                                        to="/PartidasNuevasPorContrato"
                                                        activeclassname="nav-link"
                                                    >
                                                        Partidas nuevas PC
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        </Collapse>
                                    </li>
                                    <li className="lii">
                                        <NavLink to="/Avances" activeclassname="nav-link"> <span> AVANCES</span> </NavLink>
                                    </li>
                                    <li className="lii">
                                        <NavLink to="/Usuarios" activeclassname="nav-link"> <span> USUARIOS</span> </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                        <main role="main" className="col ml-sm-auto col-lg px-0">
                            <div className="d-flex mb-0 border-button pt-5 p-1 m-0">
                                <div>
                                    <b>
                                        {DataObra.g_meta &&
                                            DataObra.codigo + " - " + DataObra.g_meta.toUpperCase()}
                                    </b>
                                </div>
                            </div>
                            <div className="scroll_contenido">
                                <Switch>
                                    <Redirect exact from="/" to="Inicio" />
                                    <Route path="/ListaObras" component={ListaObras} />
                                    <Route path="/Inicio"
                                        render={(props) => (
                                            <Inicio {...props} recargar={recargar} />
                                        )}
                                    />
                                    <Route path="/Obra" component={Obra} />
                                    <Route path="/Componentes" component={Componentes} />
                                    <Route path="/Partidas" component={Partidas} />
                                    <Route path="/Avances" component={Avances} />
                                    <Route path="/Usuarios" component={Usuarios} />
                                    <Route path="/PartidasNuevas" component={PartidasNuevas} />
                                    <Route path="/PartidasNuevasPorContrato" component={PartidasNuevasPorContrato} />
                                    <Route path="/ListaObrasOld" component={ListaObrasOld} />
                                </Switch>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </Router>

    );
}
