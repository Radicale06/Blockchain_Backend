const FabricCAServices = require('fabric-ca-client');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: '*',  // Allows access from all IP addresses
    methods: ['GET', 'POST'], // Allowing all HTTP methods
}));


//Chemins de configuration pour les deux organisations
const org1CcpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
const org2CcpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');

// Fonction pour obtenir le wallet
async function getWallet(orgName) {
    const walletPath = path.join(__dirname, `wallet-${orgName}`);
    return await Wallets.newFileSystemWallet(walletPath);
}

// Fonction générique pour se connecter au réseau
async function connectToNetwork(orgName, userName) {
    // Sélectionner le profil de connexion approprié
    const ccpPath = orgName === 'org1' ? org1CcpPath : org2CcpPath;
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Mettre à jour les IP des CAs dans le ccp en utilisant les IPs des containers
    if (orgName === 'org1') {
        ccp.certificateAuthorities['ca.org1.example.com'].url = 'https://172.18.0.8:7054';
    } else {
        ccp.certificateAuthorities['ca.org2.example.com'].url = 'https://172.18.0.9:7054';
    }

    // Créer la passerelle
    const gateway = new Gateway();
    const wallet = await getWallet(orgName);

    await gateway.connect(ccp, {
        wallet,
        identity: userName,
        discovery: { enabled: true, asLocalhost: false } // asLocalhost: false because we're using container IPs
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('chaincode');

    return { gateway, contract };
}

// Script d'inscription pour chaque organisation
async function enrollAdmin(orgName) {
    try {
        // Load connection profile
        const ccpPath = orgName === 'org1' ? org1CcpPath : org2CcpPath;
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a wallet
        const walletPath = path.join(__dirname, `wallet-${orgName}`);
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if the admin identity already exists
        const adminIdentity = await wallet.get('admin');
        if (adminIdentity) {
            console.log(`Admin for ${orgName} already exists`);
            return;
        }

        // Create a new CA client with the updated URL for the CA container
        const caInfo = ccp.certificateAuthorities[`ca.${orgName}.example.com`];
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caInfo.tlsCACerts.pem, verify: false });

        // Enroll the admin
        const enrollment = await ca.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw'
        });

        // Create the admin identity
        const identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `${orgName.toUpperCase()}MSP`,
            type: 'X.509',
        };

        // Store the admin identity in the wallet
        await wallet.put('admin', identity);
        console.log(`Successfully enrolled admin for ${orgName}`);
    } catch (error) {
        console.error(`Failed to enroll admin for ${orgName}: ${error}`);
    }
}

// Routes pour chaque organisation
app.post('/certify', async (req, res) => {
    try {
        // Choisir dynamiquement l'organisation (par exemple, org1)
        const { documentPath, org = 'org1' } = req.body;

        // Calculer le hash du document
        const fileBuffer = fs.readFileSync(documentPath);
        const hashSum = crypto.createHash('sha256');
        const documentHash = hashSum.update(fileBuffer).digest('hex');
	console.log(contract);
	console.log(documentPath);
        if (!documentPath) {
            return res.status(400).json({ success: false, error: 'Document path is required' });
        }

        // Connexion au réseau
        const { gateway, contract } = await connectToNetwork(org, 'admin');

        // Soumettre la transaction
        await contract.submitTransaction('CertifyDocument', documentHash);

        res.json({
            success: true,
            hash: documentHash,
            message: 'Document certifié avec succès',
            organization: org
        });

        gateway.disconnect();
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/certify', (req, res) => {
     console.log("getting ");
});





app.post('/verify', async (req, res) => {
    try {
        // Choisir dynamiquement l'organisation (par exemple, org2)
        const { documentPath, org = 'org2' } = req.body;

        // Calculer le hash du document
        const fileBuffer = fs.readFileSync(documentPath);
        const hashSum = crypto.createHash('sha256');
        const documentHash = hashSum.update(fileBuffer).digest('hex');

        // Connexion au réseau
        const { gateway, contract } = await connectToNetwork(org, 'admin');

        // Vérifier le document
        const result = await contract.evaluateTransaction('VerifyDocument', documentHash);

        res.json({
            success: true,
            hash: documentHash,
            certified: result.toString() === 'true',
            message: result.toString() === 'true'
                ? 'Document certifié dans la blockchain'
                : 'Document non certifié',
            organization: org
        });

        gateway.disconnect();
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Script d'initialisation
async function initializeNetwork() {
    await enrollAdmin('org1');
    await enrollAdmin('org2');
}

initializeNetwork();

// Démarrer le serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
