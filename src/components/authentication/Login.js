import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import CenteredContainer from "./CenteredContainer"
import { signInWithPopup,browserPopupRedirectResolver } from "firebase/auth"
import {auth1,facebookProvider,provider} from "../../firebase"
import { FaFacebook, FaGoogle } from "react-icons/fa"; 

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory( )

   async function handleFacebookLogin() {
    signInWithPopup(auth1, facebookProvider,browserPopupRedirectResolver).then((result) => {
      setError("");
      setLoading(true);
      history.push("/");
    }).catch((error) => {
        setError("Failed to log in");
      });
  }
  
  async function handleGoogleLogin() {
    signInWithPopup(auth1, provider,browserPopupRedirectResolver).then((result) => {
      setError("");
      setLoading(true);
      history.push("/");
    }).catch((error) => {
        setError("Failed to log in");
      });
  }
  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      history.push("/")
    } catch {
      setError("Failed to log in")
    }

    setLoading(false)
  }

  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
      <Button
        style={{ backgroundColor: "rgba(11, 127, 171)" ,marginTop: "20px",alignItems: "center",width: "100%"}}
        onClick={handleFacebookLogin}
      >
        <FaFacebook className="mr-2" /> Sign In With Facebook
      </Button>
      <br />
      <Button
        style={{ backgroundColor: "#DB4437", marginTop: "10px",alignItems: "center",width: "100%"}}
        onClick={handleGoogleLogin}
      >
        <FaGoogle className="mr-2" /> Sign In With Google
      </Button>
    </CenteredContainer>
  )
}
