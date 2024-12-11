// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CertifyPage from './pages/CertifyPage';
import VerifyPage from './pages/VerifyPage';

function App() {
    return (
        <Router>
            <CssBaseline />
            <Navbar />
            <Container>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/certify" element={<CertifyPage />} />
                    <Route path="/verify" element={<VerifyPage />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
