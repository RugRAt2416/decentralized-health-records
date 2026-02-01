🏥 Decentralized Health Records System (DHRW)- 

A blockchain-powered medical record management system that enables patients to securely store, control, and share their health records with doctors using smart contracts and Web3 wallets.

🚨 Problem Statement- 

Traditional medical record systems are:

Centralized and vulnerable to data breaches

Fragmented across hospitals and clinics

Lacking patient control over data access

Prone to unauthorized access and manipulation

Patients have no transparency or ownership over who accesses their sensitive medical data.

💡 Solution Overview:

DHRW is a decentralized health record platform that:

Stores medical record references securely on blockchain

Uses MetaMask / Web3 wallets for authentication

Allows patients to grant or revoke access to doctors

Maintains an immutable audit trail of all access events

Encrypts files and stores them via IPFS-backed backend

Patients stay in control — always.

## How to Run
1. Start backend server
2. Deploy smart contract
3. Open frontend and connect MetaMask

🧠 Key Features- 

🔐 Wallet-Based Authentication (MetaMask / Web3)

📁 Secure Medical Record Upload

👩‍⚕️ Doctor Access Approval / Rejection

🧾 Immutable Audit Logs (Blockchain Events)

🛡️ Patient-Owned Data Control

🌐 IPFS-backed Encrypted File Storage

🎨 Modern, intuitive UI/UX

🏗️ Architecture Overview- 
User (Patient / Doctor)
        |
        | MetaMask / Web3 Wallet
        |
Frontend (HTML, CSS, JS)
        |
        | Ethers.js
        |
Smart Contract (Ethereum / Hardhat)
        |
        | Events & State
        |
Backend (Node.js + Express)
        |
        | Encrypted Files
        |
IPFS Storage

⚙️ Tech Stack- 
Frontend:

HTML5, CSS3, JavaScript

Ethers.js

MetaMask / Web3 Wallets

Blockchain

Solidity

Hardhat

Ethereum (Localhost / Testnet)

Backend:

Node.js

Express.js

IPFS (File storage)

Tools:

Git & GitHub

Devfolio

Google Docs (Documentation)

YouTube (Demo Video)

🔁 Application Flow- 

1. User connects wallet via MetaMask

2. Medical record is uploaded and encrypted

3. Backend uploads file to IPFS

4. IPFS hash is stored on blockchain

5. Doctor requests access

6. Patient approves or rejects

7. Access events are logged on-chain

8. Audit logs are displayed in real time

🧩 Challenges Faced- 

Web3 wallet integration issues across pages

Handling MetaMask session state

Smart contract event synchronization

UI consistency across multiple screens

Managing blockchain + backend coordination

📘 Learnings- 

Practical Web3 & smart contract integration

Event-driven blockchain logging

Secure file handling with IPFS

Wallet-based authentication design

End-to-end decentralized system design

🚀 Future Enhancements- 

Role-based doctor authentication

Zero-knowledge proofs for privacy

Multi-chain support

Mobile app version

Hospital onboarding dashboard

👥 Team- 

Guruyugan Karthik – Smart Contract Development

Hariharasrinivas T– Web3 Integration & Frontend 

Harishram B  – Backend & IPFS Integration

📄 License- 

This project is developed for educational and hackathon purposes

