import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import DocumentUploader from '../components/DocumentUploader';
import ResultDisplay from '../components/ResultDisplay';
import { certifyDocument } from '../services/blockchainService';

function CertifyPage() {
    const [result, setResult] = useState(null);

    const handleFileUpload = async (file, organization) => {
        try {
	    console.log(file);
            const certificationResult = await certifyDocument(file, organization);
            setResult(certificationResult);
	    console.log(certificationResult);
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
                Certification de Document
            </Typography>
            <DocumentUploader onFileUpload={handleFileUpload} />
            <ResultDisplay result={result} />
        </Container>
    );
}

export default CertifyPage;
