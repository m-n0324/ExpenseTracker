import React from 'react';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { Navbar, Container, Button } from 'react-bootstrap';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" className="mb-4">
      <Container>
        <Navbar.Brand href="#home">Pocket Tracker 💸</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="me-3 text-light d-none d-sm-block">
            Hi, {auth.currentUser?.displayName}
          </Navbar.Text>
          <Button variant="outline-danger" size="sm" onClick={() => signOut(auth)}>Logout</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;