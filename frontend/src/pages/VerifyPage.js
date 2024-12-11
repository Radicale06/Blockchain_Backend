import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import DocumentUploader from '../components/DocumentUploader';
import ResultDisplay from '../components/ResultDisplay';
import { verifyDocument } from '../services/blockchainService';

function VerifyPage() {
    const [result, setResult] = useState(null);

    const handleFileUpload = async (file, organization) => {
        try {
            const verificationResult = await verifyDocument(file, organization);
            setResult(verificationResult);
        } catch (error) {
            setResult({ 
                success: false, 
                message: error.message 
            });
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" sx={{ my: 2 }}>
                Vérification de Document
            </Typography>
            <DocumentUploader onFileUpload={handleFileUpload} />
            <ResultDisplay result={result} />
        </Container>
    );
}

export default VerifyPage;
