// enrollAdmin.js
const FabricCAClient = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function enrollAdmin(orgName) {
    try {
        // Chemins de configuration
        const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', `${orgName}.example.com`, `connection-${orgName}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Créer un wallet
        const walletPath = path.join(__dirname, `wallet-${orgName}`);
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Créer le client CA
        const caInfo = ccp.certificateAuthorities[`ca.${orgName}.example.com`];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAClient(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Enregistrer l'admin
        const adminIdentity = await wallet.get('admin');
        if (adminIdentity) {
            console.log(`Admin de ${orgName} existe déjà`);
            return;
        }

        const enrollment = await ca.enroll({ 
            enrollmentID: 'admin', 
            enrollmentSecret: 'adminpw' 
        });

        const identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `${orgName.toUpperCase()}MSP`,
            type: 'X.509',
        };

        await wallet.put('admin', identity);
        console.log(`Admin de ${orgName} inscrit avec succès`);
    } catch (error) {
        console.error(`Erreur pour ${orgName}: ${error}`);
    }
}

// Exécuter l'inscription pour les deux organisations
async function main() {
    await enrollAdmin('org1');
    await enrollAdmin('org2');
}

main();
