# ZamaVoting - Confidential Voting System

A privacy-preserving voting system built with FHEVM (Fully Homomorphic Encryption Virtual Machine) technology, ensuring complete vote confidentiality and voter anonymity.

## 🌟 Features

### Core Functionality
- **Confidential Voting**: All votes are encrypted using FHEVM, ensuring complete privacy
- **Multiple Voting Options**: Support for 2-4 options per voting
- **Time-based Voting**: Set start and end times for each voting
- **Access Control**: Public votings or private whitelist-only votings
- **Real-time Statistics**: Live vote counting with encrypted data
- **Result Decryption**: Secure result revelation after voting ends

### User Experience
- **Modern UI**: Beautiful, responsive interface with dark mode support
- **Bilingual Support**: Chinese (中文) and English language options
- **MetaMask Integration**: Seamless wallet connection and transaction signing
- **Real-time Updates**: Live voting status and result updates
- **Mobile Responsive**: Works perfectly on all device sizes

### Technical Features
- **FHEVM Integration**: Full support for encrypted computations
- **Mock Mode**: Local development with `@fhevm/mock-utils`
- **Production Ready**: Real relayer SDK integration for mainnet
- **Type Safety**: Full TypeScript implementation
- **Testing**: Comprehensive test suite for smart contracts

## 🏗️ Architecture

### Smart Contracts (`fhevm-hardhat-template/`)
- **VotingSystem.sol**: Main contract handling all voting logic
- **FHEVM Integration**: Uses encrypted data types (`euint8`, `euint32`, `ebool`)
- **Access Control**: Role-based permissions for admins and voters
- **Encrypted Operations**: All vote counting happens in encrypted space

### Frontend (`zama-voting-frontend/`)
- **Next.js 15**: Modern React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for styling
- **FHEVM Hooks**: Custom React hooks for blockchain interaction
- **Responsive Design**: Mobile-first responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask browser extension
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd zama_voting_001

# Install smart contract dependencies
cd fhevm-hardhat-template
npm install

# Install frontend dependencies
cd ../zama-voting-frontend
npm install
```

### 2. Development Mode (Mock)

**Terminal 1: Start Hardhat Node**
```bash
cd fhevm-hardhat-template
npx hardhat node --verbose
```

**Terminal 2: Deploy Contracts**
```bash
cd fhevm-hardhat-template
npx hardhat --network localhost deploy --tags VotingSystem
```

**Terminal 3: Start Frontend**
```bash
cd zama-voting-frontend
npm run dev:mock
```

### 3. Access the Application
- Open http://localhost:3000
- Connect your MetaMask wallet
- Switch to localhost network (Chain ID: 31337)
- Start creating and participating in votings!

## 📖 Usage Guide

### For Administrators

#### Creating a Voting
1. Click "Create Voting" tab
2. Fill in voting details:
   - **Title**: Voting name
   - **Description**: Detailed description
   - **Options**: 2-4 voting choices
   - **Time**: Start and end timestamps
   - **Type**: Public or private (whitelist)
3. Submit and wait for transaction confirmation

#### Managing Votings
- **End Voting**: Manually end active votings
- **View Results**: Decrypt and view final results
- **Whitelist Management**: Add/remove addresses for private votings

### For Voters

#### Participating in Votings
1. Browse available votings on the home page
2. Check voting status (Active/Ended/Upcoming)
3. Click "Vote" on active votings you're eligible for
4. Select your preferred option
5. Confirm the encrypted transaction

#### Viewing Results
- Results are only available after voting ends
- Click "Results" to decrypt and view vote counts
- All decryption happens client-side for privacy

## 🔧 Smart Contract Interaction

### Using Hardhat Tasks

```bash
# Get contract address
npx hardhat --network localhost task:voting-address

# Create a voting
npx hardhat --network localhost task:create-voting \
  --title "Test Vote" \
  --description "A test voting" \
  --options "Option A,Option B,Option C" \
  --duration 3600 \
  --public true

# Cast a vote
npx hardhat --network localhost task:vote \
  --voting-id 0 \
  --option 1

# Get voting information
npx hardhat --network localhost task:get-voting-info \
  --voting-id 0

# View encrypted vote counts
npx hardhat --network localhost task:get-encrypted-counts \
  --voting-id 0

# End a voting
npx hardhat --network localhost task:end-voting \
  --voting-id 0
```

### Contract Functions

#### Admin Functions
- `createVoting()`: Create new voting
- `addToWhitelist()`: Add addresses to private voting
- `removeFromWhitelist()`: Remove addresses from whitelist
- `endVoting()`: Manually end voting

#### User Functions
- `vote()`: Cast encrypted vote
- `getVotingInfo()`: Get voting details
- `hasVoted()`: Check if address has voted
- `canVoteInVoting()`: Check voting eligibility

#### View Functions
- `getTotalVotings()`: Get total number of votings
- `getEncryptedVoteCount()`: Get encrypted vote counts
- `getVotingResults()`: Get decrypted results (after decryption)

## 🧪 Testing

### Smart Contract Tests
```bash
cd fhevm-hardhat-template
npm test
```

### Test Coverage
- ✅ Contract deployment and initialization
- ✅ Admin management (add/remove admins)
- ✅ Voting creation with validation
- ✅ Whitelist management for private votings
- ✅ Encrypted vote casting
- ✅ Vote counting and result decryption
- ✅ Access control and permissions
- ✅ Time-based voting restrictions

## 🔐 Security Features

### Encryption
- **Vote Privacy**: All votes encrypted with FHEVM
- **Anonymous Voting**: Voter identities not linked to vote choices
- **Secure Counting**: Vote tallying in encrypted space
- **Controlled Decryption**: Results only revealed after voting ends

### Access Control
- **Role-based Permissions**: Owner, admin, and voter roles
- **Whitelist Support**: Private votings with address whitelisting
- **Time Restrictions**: Voting only allowed within specified timeframes
- **Double-vote Prevention**: Each address can only vote once per voting

### Smart Contract Security
- **Input Validation**: All inputs validated before processing
- **Reentrancy Protection**: Safe external calls
- **Integer Overflow Protection**: Safe math operations
- **Access Modifiers**: Proper function access restrictions

## 🌐 Network Support

### Supported Networks
- **Localhost (31337)**: Development with Hardhat node
- **Sepolia Testnet (11155111)**: Ethereum testnet deployment
- **Custom Networks**: Configurable for other FHEVM-compatible chains

### Environment Configuration
```bash
# Set up environment variables
cp .env.example .env

# Configure for different networks
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RELAYER_URL=http://localhost:8545
```

## 🛠️ Development

### Project Structure
```
zama_voting_001/
├── fhevm-hardhat-template/     # Smart contracts
│   ├── contracts/              # Solidity contracts
│   ├── deploy/                 # Deployment scripts
│   ├── test/                   # Contract tests
│   └── tasks/                  # Hardhat tasks
├── zama-voting-frontend/       # Frontend application
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   ├── hooks/                  # Custom React hooks
│   ├── fhevm/                  # FHEVM integration
│   └── lib/                    # Utility functions
└── frontend/                   # Reference implementation (read-only)
```

### Key Technologies
- **Solidity 0.8.27**: Smart contract language
- **FHEVM**: Fully homomorphic encryption
- **Next.js 15**: React framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS
- **Ethers.js**: Ethereum library
- **Hardhat**: Development environment

### Adding New Features
1. **Smart Contract**: Add functions to `VotingSystem.sol`
2. **Frontend Hooks**: Update `useVotingSystem.tsx`
3. **UI Components**: Create new components in `components/`
4. **Translations**: Add strings to `app/providers.tsx`
5. **Tests**: Add tests in `test/VotingSystem.ts`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama**: For FHEVM technology and development tools
- **Ethereum Foundation**: For the underlying blockchain infrastructure
- **Next.js Team**: For the excellent React framework
- **Tailwind CSS**: For the utility-first CSS framework

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `docs/` folder
- Review the test files for usage examples

---

**Built with ❤️ using FHEVM technology for a more private and secure voting future.**
