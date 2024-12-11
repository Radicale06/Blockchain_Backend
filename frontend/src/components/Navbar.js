import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Certification Blockchain
                </Typography>
                <Button color="inherit" component={Link} to="/">Accueil</Button>
                <Button color="inherit" component={Link} to="/certify">Certifier</Button>
                <Button color="inherit" component={Link} to="/verify">Vérifier</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
