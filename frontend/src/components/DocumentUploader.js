import React, { useState } from 'react';
import { 
    Button, 
    TextField, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Box,
    Typography
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function DocumentUploader({ onFileUpload }) {
    const [file, setFile] = useState(null);
    const [organization, setOrganization] = useState('org1');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleUpload = () => {
        if (file) {
            onFileUpload(file, organization);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <input
                accept="*/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
                <Button 
                    variant="contained" 
                    component="span" 
                    startIcon={<CloudUploadIcon />}
                >
                    Sélectionner un document
                </Button>
            </label>

            {file && (
                <Typography variant="body1">
                    Fichier sélectionné: {file.name}
                </Typography>
            )}

            <FormControl fullWidth>
                <InputLabel>Organisation</InputLabel>
                <Select
                    value={organization}
                    label="Organisation"
                    onChange={(e) => setOrganization(e.target.value)}
                >
                    <MenuItem value="org1">Organisation 1</MenuItem>
                    <MenuItem value="org2">Organisation 2</MenuItem>
                </Select>
            </FormControl>

            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleUpload}
                disabled={!file}
            >
                Certifier le document
            </Button>
        </Box>
    );
}

export default DocumentUploader;
