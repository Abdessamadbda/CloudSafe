import React from "react"
import { Navbar, Nav } from "react-bootstrap"
import { Link } from "react-router-dom"
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function NavbarComponent() {
  return (
    <Navbar style={{ backgroundColor: "#e3f2fd" }} expand="sm"> {/* Set background color using inline style */}
      <Navbar.Brand as={Link} to="/">
        <img width="40" // Set the desired width
          height="40" // Set the desired height
          style={{ marginRight: '10px' }} src="/cloudsafe.png" alt=""/>
        CloudSafe
      </Navbar.Brand>
      <Nav className="ml-auto"> {/* Align items to the right */}
        <Nav.Link as={Link} to="/user">
          <FontAwesomeIcon
            icon={faUser}
            className="ml-4 mr-2 cursor-pointer"
          />
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
