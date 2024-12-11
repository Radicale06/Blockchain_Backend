import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <Container maxWidth="sm">
            <Box sx={{ 
                my: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center' 
            }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Certification Blockchain
                </Typography>
                <Typography variant="body1" paragraph>
                    Certifiez et vérifiez l'intégrité de vos documents 
                    de manière sécurisée et décentralisée.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        component={Link} 
                        to="/certify"
                    >
                        Certifier un Document
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        component={Link} 
                        to="/verify"
                    >
                        Vérifier un Document
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default HomePage;
