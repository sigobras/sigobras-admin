import React, { Component } from 'react';
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import { FaPowerOff } from "react-icons/fa";
import { Redirect } from 'react-router-dom';
class UserNav extends Component {
  constructor() {
    super();
    this.cierraSesion = this.cierraSesion.bind(this)
  }
  cierraSesion() {
    if (confirm('¿Esta seguro de salir del sistema?')) {
      sessionStorage.clear()
      window.location.href = "/"
    }
  }
  render() {
    return (
      <div>
        <span id="userLogin" className="mr-1 nav-link text-white" >
          <label className="text-capitalize font-weight-bold" >{sessionStorage.getItem('cargo')}</label>:  {sessionStorage.getItem('nombre')}
        </span>
        <UncontrolledPopover trigger="legacy" placement="bottom" target="userLogin">
          <PopoverBody>
            <span className="nav-link" onClick={() => this.cierraSesion()}> <FaPowerOff color="red" className="p-0" /> Salir</span>
          </PopoverBody>
        </UncontrolledPopover>
      </div>
    );
  }
}
export default UserNav;
