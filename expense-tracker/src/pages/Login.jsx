import React from 'react';
import { auth, googleProvider } from '../firebase/firebaseConfig';
import { signInWithPopup } from "firebase/auth";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FcGoogle } from 'react-icons/fc';
import { FaChartLine, FaShieldAlt, FaWallet } from 'react-icons/fa';

const Login = () => {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login Error:", err.message);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', // Deep Dark Navy
      color: '#f8fafc',
      fontFamily: "'Inter', sans-serif",
      overflowX: 'hidden'
    }}>
      <Row className="g-0 min-vh-100">
        
        {/* --- LEFT SIDE: Landing / Motivational --- */}
        <Col lg={7} className="d-none d-lg-flex align-items-center position-relative" style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)'
        }}>
          {/* Subtle Background Pattern */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%',
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            zIndex: 0
          }}></div>

          <Container className="p-5 position-relative" style={{ zIndex: 1 }}>
            <div className="mb-5">
              <h1 className="display-3 fw-bold mb-4" style={{ letterSpacing: '-2px' }}>
                Master Your <span style={{ color: '#38bdf8' }}>Wealth.</span>
              </h1>
              <p className="lead opacity-75 mb-5" style={{ maxWidth: '500px', lineHeight: '1.8' }}>
                "Do not save what is left after spending, but spend what is left after saving." 
                Track every penny and watch your dreams grow.
              </p>
            </div>

            {/* Feature Icons / Motivation */}
            <Row className="g-4">
              <Col md={4}>
                <div className="p-3 rounded-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <FaChartLine className="fs-3 mb-3 text-info" />
                  <h6 className="fw-bold">Smart Analysis</h6>
                  <p className="small opacity-50 mb-0">Visualize your spending patterns instantly.</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="p-3 rounded-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <FaWallet className="fs-3 mb-3 text-success" />
                  <h6 className="fw-bold">Budget Control</h6>
                  <p className="small opacity-50 mb-0">Set limits and save more every month.</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="p-3 rounded-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <FaShieldAlt className="fs-3 mb-3 text-warning" />
                  <h6 className="fw-bold">100% Secure</h6>
                  <p className="small opacity-50 mb-0">Your data is encrypted with Firebase security.</p>
                </div>
              </Col>
            </Row>
          </Container>
        </Col>

        {/* --- RIGHT SIDE: Login Card --- */}
        <Col lg={5} className="d-flex align-items-center justify-content-center p-4">
          <Card className="border-0 shadow-lg" style={{
            width: '100%',
            maxWidth: '420px',
            borderRadius: '30px',
            backgroundColor: '#1e293b', // Slightly lighter dark for card
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Card.Body className="p-5 text-center">
              {/* App Logo Image */}
              <div className="mb-4 d-inline-flex align-items-center justify-content-center shadow-lg" style={{
                backgroundColor: '#0f172a',
                borderRadius: '22px',
                width: '80px',
                height: '80px',
                padding: '15px',
                border: '1px solid #38bdf8'
              }}>
                <img 
                  src="/logo192.png" 
                  alt="App Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  onError={(e) => e.target.style.display = 'none'} // Fallback if image fails
                />
              </div>

              <h2 className="fw-bold mb-2">Welcome Back</h2>
             <p className="mb-5" style={{ fontSize: '14px', color: '#cbd5e1' }}>
  Ready to level up? <span style={{ color: '#38bdf8', fontWeight: '600' }}>Join thousands</span> of users managing their finances professionally.
</p>

              <div className="d-grid">
                <Button 
                  onClick={signInWithGoogle}
                  variant="light" 
                  className="py-3 d-flex align-items-center justify-content-center shadow-sm"
                  style={{ borderRadius: '15px', fontWeight: '600', fontSize: '15px' }}
                >
                  <FcGoogle className="me-3 fs-4" />
                  Continue with Google
                </Button>
              </div>

              <div className="mt-5 pt-4 border-top border-secondary">
                <p className="mb-0" style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '400' }}>
  New here? Just sign in and we'll set up your account instantly.
</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;