# Hyperledger Fabric Fundamentals

## 📋 Objectif du Projet

Création d'une application permettant de certifier un document dans la Blockchain et de vérifier que le document n'a pas été modifié depuis son ancrage dans la Blockchain.

---

## 🌟 Overview

Hyperledger Fabric is an enterprise-grade permissioned distributed ledger framework designed for developing blockchain solutions and applications. Its modular architecture and unique features make it suitable for a wide range of use cases in the enterprise.

### 🔑 Key Characteristics:

- **Permissioned**: Ensures secure, authenticated access.
- **Highly Modular**: Supports pluggable components for consensus, ledger, membership services, endorsement, and validation.
- **Smart Contracts**: Implemented using general-purpose programming languages.
- **Privacy**: Provides mechanisms for secure private transactions.
- **Efficient Consensus**: No mining or native cryptocurrency is required.
- **Transaction Model**: Implements an execute-order-validate pattern for enhanced performance and scalability.

---

## 🏗️ Architecture

Hyperledger Fabric's architecture revolves around a permissioned blockchain network, enabling fine-grained access controls. Key components include:

### Nodes:

- **Endorsing Peers**: Simulate and endorse transactions.
- **Ordering Nodes**: Establish consensus and package transactions into blocks.
- **Committing Peers**: Validate and commit transactions to the ledger.

### Consensus:

- Supports pluggable consensus mechanisms.

### Channels:

- Enable private communication between subsets of participants.

### Transaction Lifecycle:

1. Proposal
2. Ordering
3. Validation

### Smart Contracts (Chaincode):

- Encapsulate business logic.

### Ledger:

- **Blockchain Ledger**: Immutable transaction records.
- **World State**: Current state of the ledger stored in key-value format.

---

## 🤝 Application Interaction with the Ledger

Applications interact with Hyperledger Fabric’s ledger through the following steps:

### 🔧 Application SDKs:

- SDKs (e.g., Node.js, Java, Go, Python) facilitate communication with the network.

### 🔄 Transaction Workflow:

1. **Proposal Creation**: The application submits a transaction proposal to endorsing peers.
2. **Simulation and Endorsement**: Endorsing peers simulate the transaction and generate a read-write set.
3. **Validation and Ordering**: The application collects endorsements and submits the transaction to the ordering service.
4. **Block Validation and Commitment**: Peers validate and commit the transaction to the ledger.

### 📂 Ledger Access:

- Query historical data or world state.
- Invoke smart contracts to modify the ledger.

### 📣 Events and Feedback:

- Applications receive transaction notifications via emitted events.

---

## 🔑 Node Roles

- **Endorsing Peers (Endorsers):**
  - Simulate transactions and sign endorsements.
  - Ensure compliance with endorsement policies.
- **Committing Peers (Committers):**
  - Validate and commit transactions to the ledger.
  - Maintain the world state.
- **Anchor Peers:**
  - Facilitate inter-organization communication in channels.

---

## 🔁 Transaction Flow

1. 📝 **Proposal**: Client submits a transaction proposal to endorsing peers.
2. ⚙️ **Execution**: Endorsing peers simulate the transaction without modifying the ledger.
3. 📩 **Response**: Endorsing peers send the simulated transaction results to the client.
4. 📜 **Order**: Client submits the transaction to the ordering service.
5. 📦 **Delivery**: The ordering service packages transactions into blocks and delivers them to peers.
6. ✔️ **Validation**: Peers validate transactions for compliance and conflicts.
7. ✅ **Commit**: Valid transactions are committed to the ledger.

---

## 🛠️ Hyperledger Fabric Setup

### 🐋 Installation

1. **Download Docker Images**:
   ```bash
   ./install-fabric.sh docker
   ```
2. **Install Specific Version**:
   ```bash
   ./install-fabric.sh --fabric-version 2.5.9 docker
   ```

### 🧪 Test Network

- Deploy a test network for learning and testing:
  1. Navigate to the test-network directory:
     ```bash
     cd fabric-samples/test-network
     ```
  2. Start the network and create a channel:
     ```bash
     ./network.sh up createChannel
     ```

### 📜 Chaincode Deployment

1. Deploy a chaincode:
   ```bash
   ./network.sh deployCC -ccn basic -ccp home/blockchain/chaincode -ccl go
   ```
2. Query installed chaincodes:
   ```bash
   peer lifecycle chaincode queryinstalled
   ```

---

## 💻 Application Development

### 🔧 Initial Setup

1. Install dependencies:
   ```bash
   npm install fabric-network fabric-ca-client express body-parser cors crypto
   ```
2. Configure `package.json` with necessary scripts.

### 🚀 Launch Application

1. Start the backend application:
   ```bash
   npm start
   ```

### 🌟 Core Features

#### 📑 Document Certification

- **Endpoint**: `/certify`
- **Workflow**:
  1. Compute document hash.
  2. Submit a transaction to store the hash on the blockchain.
  3. Return transaction details to the user.

#### 🔍 Document Verification

- **Endpoint**: `/verify`
- **Workflow**:
  1. Compute document hash.
  2. Query the blockchain for the hash.
  3. Return verification status to the user.

#### 🔐 Identity Management

- **Wallets**: Store administrator identities.
- **Enrollment**: Enroll admins using `enrollAdmin.js`.

---

## 🌐 Frontend Features

### 🏠 Homepage

- Provides options for:
  - Certifying documents.
  - Verifying documents.

### 📄 Certification Page

- Allows users to:
  - Select an organization.
  - Certify a document.
  - Receive a confirmation message.

### 🔍 Verification Page

- Allows users to:
  - Select an organization.
  - Upload a document for verification.
  - View verification results, including document authenticity.

---

This document outlines the essentials of setting up and using a Hyperledger Fabric network for document certification and verification. For more detailed instructions, refer to the official [Hyperledger Fabric documentation](https://hyperledger-fabric.readthedocs.io/).
