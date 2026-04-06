import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { Form, Button, Card } from 'react-bootstrap';

const ExpenseForm = ({ editData, setEditData, darkMode, lang = 'en' }) => {
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [date, setDate] = useState(getTodayDate());

  const formTexts = {
    en: {
      newTitle: "New Expense 💸",
      editTitle: "Edit Expense ✏️",
      amountPh: "Amount",
      customPh: "Enter Category (e.g. Gym)",
      addBtn: "Add Expense",
      updateBtn: "Update Expense",
      futureAlert: "Future dates are not allowed! 😅",
      saveAlert: "Expense saved! ✅",
      updateAlert: "Updated successfully! ✨",
      others: "Others",
      categories: ["Medicines", "Shopping", "Junk Food", "Travel", "Stationary", "Rent"]
    },
    hi: {
      newTitle: "नया खर्चा 💸",
      editTitle: "खर्चा बदलें ✏️",
      amountPh: "राशि (Amount)",
      customPh: "अपनी कैटेगरी लिखें (जैसे: जिम)",
      addBtn: "खर्चा जोड़ें",
      updateBtn: "खर्चा अपडेट करें",
      futureAlert: "भविष्य की तारीख अनुमति नहीं है! 😅",
      saveAlert: "खर्चा सेव हो गया! ✅",
      updateAlert: "अपडेट हो गया! ✨",
      others: "अन्य (Others)",
      categories: ["दवाइयाँ", "शॉपिंग", "जंक फूड", "यात्रा", "स्टेशनरी", "किराया"]
    }
  };

  const f = formTexts[lang] || formTexts['en'];
  const allCategories = [...f.categories, f.others];

  // --- FIX 1: Initial/Language Change Reset ---
  // Yeh sirf tab chalega jab Dashboard se language change hogi
  useEffect(() => {
    if (!editData) {
      setCategory(f.categories[2]); // Default Junk Food
    }
  }, [lang]); // Sirf [lang] dependency rakhein, allCategories nahi

  // --- FIX 2: Edit Data Logic ---
  useEffect(() => {
    if (editData) {
      setAmount(editData.amount);
      setDate(editData.date);
      
      if (f.categories.includes(editData.category)) {
        setCategory(editData.category);
        setIsCustom(false);
      } else {
        setCategory(f.others);
        setCustomCategory(editData.category);
        setIsCustom(true);
      }
    }
  }, [editData]); // Dependency list ko chota rakhein

  const handleCategoryChange = (val) => {
    setCategory(val);
    if (val === f.others) {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setCustomCategory('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    if (date > getTodayDate()) {
      alert(f.futureAlert);
      return;
    }

    const finalCategory = isCustom ? (customCategory || "Uncategorized") : category;

    try {
      if (editData) {
        const expenseRef = doc(db, "expenses", editData.id);
        await updateDoc(expenseRef, {
          amount: parseFloat(amount),
          category: finalCategory,
          date: date,
        });
        setEditData(null);
        alert(f.updateAlert);
      } else {
        await addDoc(collection(db, "expenses"), {
          uid: auth.currentUser.uid,
          amount: parseFloat(amount),
          category: finalCategory,
          date: date,
          createdAt: serverTimestamp()
        });
        alert(f.saveAlert);
      }
      
      // Reset Form
      setAmount('');
      setCategory(f.categories[2]);
      setCustomCategory('');
      setIsCustom(false);
      setDate(getTodayDate());
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const inputStyle = { 
    backgroundColor: darkMode ? "#333" : "white", 
    color: darkMode ? "white" : "black", 
    border: "none" 
  };

  return (
    <Card className="shadow-sm p-3 mb-4 border-0" style={{ borderRadius: "15px", backgroundColor: darkMode ? "#1e1e1e" : "white", color: darkMode ? "white" : "black" }}>
      <Form onSubmit={handleSubmit}>
        <h6 className="fw-bold mb-3 text-center">{editData ? f.editTitle : f.newTitle}</h6>
        
        <Form.Group className="mb-2">
          <Form.Control type="number" placeholder={f.amountPh} value={amount} onChange={(e) => setAmount(e.target.value)} style={inputStyle} required />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Select value={category} onChange={(e) => handleCategoryChange(e.target.value)} style={inputStyle}>
            {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </Form.Select>
        </Form.Group>

        {isCustom && (
          <Form.Group className="mb-2">
            <Form.Control 
              type="text" 
              placeholder={f.customPh} 
              value={customCategory} 
              onChange={(e) => setCustomCategory(e.target.value)} 
              style={{ ...inputStyle, borderBottom: "2px solid #0d6efd" }}
              required 
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Control type="date" value={date} max={getTodayDate()} onChange={(e) => setDate(e.target.value)} style={inputStyle} required />
        </Form.Group>

        <Button variant={editData ? "warning" : "primary"} type="submit" className="w-100 fw-bold shadow-sm">
          {editData ? f.updateBtn : f.addBtn}
        </Button>
      </Form>
    </Card>
  );
};

export default ExpenseForm;