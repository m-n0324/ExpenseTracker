import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebaseConfig';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Navigation from '../components/Navbar';
import ExpenseForm from '../components/ExpenseForm';
import { Container, Row, Col, Table, Card, Button, ProgressBar, Form, Modal } from 'react-bootstrap';
import { FaTrash, FaEdit, FaDownload, FaMoon, FaSun, FaLanguage, FaMobileAlt } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(10000); 
  const [editData, setEditData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState('en'); 
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  // --- Translations Object ---
  const texts = {
    en: {
      title: "My Dashboard",
      total: "Total Monthly",
      budget: "Budget Progress",
      left: "remaining",
      over: "Over Budget!",
      recent: "Recent Transactions",
      analysis: "Spending Analysis",
      noData: "No data found.",
      download: "Excel",
      langBtn: "हिंदी",
      deleteMsg: "Are you sure you want to delete this?",
      installBtn: "App Guide 📲",
      guideTitle: "How to Install as App",
      guideStep1: "1. Click on the 3 dots (Chrome) or Share button (Safari).",
      guideStep2: "2. Select 'Add to Home Screen'.",
      guideStep3: "3. Now use it like a real App! 🚀"
    },
    hi: {
      title: "मेरा डैशबोर्ड",
      total: "कुल मासिक खर्च",
      budget: "बजट प्रगति",
      left: "बचे हैं",
      over: "बजट से बाहर!",
      recent: "हाल के लेनदेन",
      analysis: "खर्च का विश्लेषण",
      noData: "कोई डेटा नहीं मिला।",
      download: "एक्सेल",
      langBtn: "English",
      deleteMsg: "क्या आप इसे हटाना चाहते हैं?",
      installBtn: "App गाइड 📲",
      guideTitle: "App कैसे इंस्टॉल करें",
      guideStep1: "1. ब्राउज़र के 3 डॉट्स (Chrome) या Share बटन (Safari) पर क्लिक करें।",
      guideStep2: "2. 'Add to Home Screen' को चुनें।",
      guideStep3: "3. अब इसे असली App की तरह इस्तेमाल करें! 🚀"
    }
  };

  const t = texts[lang] || texts['en'];

  const currentMonthYear = new Date().toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  useEffect(() => {
    // PWA Install Prompt Logic
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(collection(db, "expenses"), where("uid", "==", user.uid));
        const unsubscribeSnap = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setExpenses(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        });
        return () => unsubscribeSnap();
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') setInstallPrompt(null);
      });
    } else {
      setShowGuide(true);
    }
  };

  const totalMonthly = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const progressPercent = Math.min((totalMonthly / budget) * 100, 100);
  const variant = progressPercent > 90 ? 'danger' : progressPercent > 70 ? 'warning' : 'success';

  // --- UPDATED CATEGORY LOGIC ---
  const categoryTotals = expenses.reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    const amt = Number(curr.amount) || 0;
    if (amt > 0) {
      acc[cat] = (acc[cat] || 0) + amt;
    }
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      // Expanded color palette for more categories
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
        '#FF9F40', '#4BC0C0', '#FF6384', '#C9CBCF', '#36A2EB'
      ],
    }]
  };

  const exportToCSV = () => {
    if (expenses.length === 0) return alert("No data to export!");
    const headers = ["Date,Category,Amount\n"];
    const rows = expenses.map(exp => `${exp.date},${exp.category},${exp.amount}\n`);
    const csvContent = headers.concat(rows).join("");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `My_Expenses_${new Date().toLocaleDateString()}.csv`);
    link.click();
  };

  const bgStyle = darkMode ? "#121212" : "#f8f9fa";
  const cardStyle = darkMode ? { backgroundColor: "#1e1e1e", color: "white", border: "1px solid #333", borderRadius: '15px' } : { borderRadius: '15px' };

  return (
    <div style={{ backgroundColor: bgStyle, minHeight: "100vh", paddingBottom: "50px", transition: "0.3s" }}>
      <Navigation />
      <Container className="mt-4">
        {/* Top Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <div>
            <h4 className={`fw-bold mb-0 ${darkMode ? "text-white" : "text-dark"}`}>{t.title} 📊</h4>
            <p className={`${darkMode ? "text-light opacity-50" : "text-muted"} mb-0`} style={{ fontSize: '14px' }}>
               {currentMonthYear}
            </p>
          </div>
          
          <div className="d-flex gap-2 mt-2 mt-md-0 align-items-center">
            <Button variant="warning" size="sm" onClick={handleInstallClick} style={{ borderRadius: "20px", fontWeight: 'bold' }}>
              <FaMobileAlt className="me-1" /> {t.installBtn}
            </Button>

            <Button variant="outline-primary" size="sm" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} style={{ borderRadius: "20px", fontWeight: 'bold' }}>
              <FaLanguage className="me-1" /> {t.langBtn}
            </Button>

            <Button variant={darkMode ? "light" : "dark"} size="sm" onClick={() => setDarkMode(!darkMode)} style={{ borderRadius: "20px" }}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </Button>
          </div>
        </div>

        <Row>
          {/* Left Column */}
          <Col lg={4}>
            <Card className="bg-primary text-white p-4 mb-3 text-center shadow border-0" style={{ borderRadius: '15px' }}>
              <h6 className="opacity-75 small text-uppercase">{t.total}</h6>
              <h1 className="fw-bold mb-0">₹{totalMonthly}</h1>
            </Card>

            <Card className="p-3 mb-4 shadow-sm border-0" style={cardStyle}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold small">{t.budget}</span>
                <Form.Control 
                  type="number" 
                  size="sm" 
                  style={{ width: '90px', backgroundColor: darkMode ? "#333" : "white", color: darkMode ? "white" : "black", border: "none" }} 
                  value={budget} 
                  onChange={(e) => setBudget(e.target.value)} 
                />
              </div>
              <ProgressBar now={progressPercent} variant={variant} label={`${Math.round(progressPercent)}%`} animated />
              <p className={`small mt-2 mb-0 ${darkMode ? "text-light opacity-50" : "text-muted"}`}>
                 {totalMonthly > budget ? `⚠️ ${t.over}` : `₹${budget - totalMonthly} ${t.left}`}
              </p>
            </Card>

            <ExpenseForm editData={editData} setEditData={setEditData} darkMode={darkMode} lang={lang} />
          </Col>
          
          {/* Right Column */}
          <Col lg={8}>
            <div className={`p-4 rounded shadow-sm border mb-4 ${darkMode ? "bg-dark text-white border-secondary" : "bg-white"}`} style={{ borderRadius: '15px' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">{t.recent} 📋</h5>
                <Button variant="outline-success" size="sm" onClick={exportToCSV} className="fw-bold">
                  <FaDownload className="me-1" /> {t.download}
                </Button>
              </div>

              <Table hover responsive variant={darkMode ? "dark" : "light"} borderless className="align-middle">
                <thead>
                  <tr className={darkMode ? "border-bottom border-secondary" : "border-bottom"}>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 opacity-50">{t.noData}</td></tr>
                  ) : (
                    expenses.map(exp => (
                      <tr key={exp.id}>
                        <td className="small">{exp.date}</td>
                        <td>
                          <span className={`badge rounded-pill ${darkMode ? "bg-secondary text-white" : "bg-info text-dark"} px-3`}>
                            {exp.category}
                          </span>
                        </td>
                        <td className="fw-bold text-danger">₹{exp.amount}</td>
                        <td className="text-center">
                          <Button variant="link" className="me-2 p-0 text-primary" onClick={() => setEditData(exp)}>
                            <FaEdit />
                          </Button>
                          <Button variant="link" className="p-0 text-danger" onClick={async () => { 
                            if(window.confirm(t.deleteMsg)) await deleteDoc(doc(db, "expenses", exp.id)); 
                          }}>
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>

            {expenses.length > 0 && (
              <Card className="p-4 shadow-sm border-0 text-center" style={cardStyle}>
                <h5 className="fw-bold mb-4">{t.analysis} </h5>
                <div style={{ maxWidth: '320px', margin: '0 auto' }}>
                  <Pie data={chartData} options={{ maintainAspectRatio: true }} />
                </div>
              </Card>
            )}
          </Col>
        </Row>

        <Modal show={showGuide} onHide={() => setShowGuide(false)} centered>
          <Modal.Header closeButton className={darkMode ? "bg-dark text-white border-secondary" : ""}>
            <Modal.Title className="fs-6 fw-bold">{t.guideTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body className={darkMode ? "bg-dark text-white" : ""}>
            <p className="small mb-2 text-warning fw-bold">Note: Only works on Mobile Browsers!</p>
            <p className="small mb-2">{t.guideStep1}</p>
            <p className="small mb-2">{t.guideStep2}</p>
            <p className="small mb-0 fw-bold text-success">{t.guideStep3}</p>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Dashboard;