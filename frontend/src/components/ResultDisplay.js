import React from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Alert 
} from '@mui/material';

function ResultDisplay({ result }) {
    if (!result) return null;

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Alert 
                    severity={result.success ? 'success' : 'error'}
                >
                    {result.message}
                </Alert>
                {result.hash && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Hash du document: {result.hash}
                    </Typography>
                )}
                {result.organization && (
                    <Typography variant="body2">
                        Organisation: {result.organization}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

export default ResultDisplay;
