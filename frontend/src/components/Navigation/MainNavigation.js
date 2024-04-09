import React from "react";
import { Link } from "react-router-dom";

import AuthContext from "../../context/auth-context";
import './MainNavigation.css';

const mainNavigation = props => (
  <AuthContext.Consumer>
    {(context) => {
      return ( 

  <header className="main-navigation">
  <div className="main-navigation__logo">
      <h1>EasyEvent</h1>
  </div>
  <nav className="main-navigation__items">
      <ul>
          { !context.token && <li><Link to="/auth">Authenticate</Link></li> }
          <li><Link to="/events">Events</Link></li>
          { context.token && <li><Link to="/bookings">Bookings</Link></li> }
          { context.token && <button onClick={context.logout}>Logout</button> }
      </ul>
  </nav>
</header> 

      );
    }}
  </AuthContext.Consumer> 
);

export default mainNavigation;