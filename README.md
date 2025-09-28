# ZamaVoting - Confidential Voting System

A privacy-preserving voting system built with FHEVM (Fully Homomorphic Encryption Virtual Machine) technology, ensuring complete vote confidentiality and voter anonymity.

## 🌟 Features

### Core Functionality
- **Confidential Voting**: All votes are encrypted using FHEVM, ensuring complete privacy
- **Multiple Voting Options**: Support for 2-4 options per voting
- **Time-based Voting**: Set start and end times for each voting
- **Access Control**: Public votings or private whitelist-only votings
- **Real-time Statistics**: Live vote counting with encrypted data
- **Creator Privileges**: Voting creators have default decryption access
- **Result Decryption**: Secure result revelation after voting ends

### User Experience
- **Modern UI**: Beautiful, responsive interface with dark mode support
- **Bilingual Support**: Chinese (中文) and English language options
- **MetaMask Integration**: Seamless wallet connection and transaction signing
- **Real-time Updates**: Live voting status and result updates
- **Mobile Responsive**: Works perfectly on all device sizes
- **Modal Interfaces**: Intuitive voting selection and result viewing

### Technical Features
- **FHEVM Integration**: Full support for encrypted computations
- **Multi-network Support**: Localhost development and Sepolia testnet
- **Mock Mode**: Local development with `@fhevm/mock-utils`
- **Production Ready**: Real relayer SDK integration for mainnet
- **Type Safety**: Full TypeScript implementation
- **Comprehensive Testing**: Complete test suite for smart contracts

## 🏗️ Architecture

### Smart Contracts (`fhevm-hardhat-template/`)
- **VotingSystem.sol**: Main contract handling all voting logic
- **FHEVM Integration**: Uses encrypted data types (`euint8`, `euint32`, `ebool`)
- **Access Control**: Role-based permissions for admins and voters
- **Encrypted Operations**: All vote counting happens in encrypted space
- **Creator Permissions**: Automatic decryption access for voting creators

### Frontend (`zama-voting-frontend/`)
- **Next.js 15**: Modern React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for styling
- **FHEVM Hooks**: Custom React hooks for blockchain interaction
- **Responsive Design**: Mobile-first responsive design
- **Modal Components**: Vote selection and result viewing interfaces

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

### 2. Local Development Mode

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

**Access**: http://localhost:3000

### 3. Sepolia Testnet Mode

**Deploy to Sepolia**:
```bash
cd fhevm-hardhat-template
npx hardhat --network sepolia deploy --tags VotingSystem
```

**Update Frontend**:
```bash
cd zama-voting-frontend
npm run genabi
npm run dev  # Production mode
```

**Configure MetaMask**:
- Network: Sepolia Test Network
- Chain ID: 11155111
- RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY

## 📖 Usage Guide

### For Administrators

#### Creating a Voting
1. Connect your MetaMask wallet
2. Click "Create Voting" tab
3. Fill in voting details:
   - **Title**: Voting name
   - **Description**: Detailed description
   - **Options**: 2-4 voting choices
   - **Time**: Start and end timestamps
   - **Type**: Public or private (whitelist)
4. Submit and wait for transaction confirmation

#### Managing Votings
- **End Voting**: Manually end active votings
- **View Results**: Decrypt and view final results (creators have default access)
- **Whitelist Management**: Add/remove addresses for private votings
- **Make Public**: Share results with non-creators

### For Voters

#### Participating in Votings
1. Browse available votings on the home page
2. Check voting status (Active/Ended/Upcoming)
3. Click "Vote" on active votings you're eligible for
4. Select your preferred option in the modal
5. Confirm the encrypted transaction

#### Viewing Results
- Results are available after voting ends
- Click "Results" to decrypt and view vote counts
- Creators can view results immediately
- Non-creators need results to be made public first

## 🔧 Smart Contract Interaction

### Using Hardhat Tasks

```bash
# Get contract address
npx hardhat --network <network> task:voting-address

# Create a voting
npx hardhat --network <network> task:create-voting \
  --title "Test Vote" \
  --description "A test voting" \
  --options "Option A,Option B,Option C" \
  --duration 3600 \
  --public true

# Cast a vote
npx hardhat --network <network> task:vote \
  --voting-id 0 \
  --option 1

# Get voting information
npx hardhat --network <network> task:get-voting-info \
  --voting-id 0

# View encrypted vote counts (creators can decrypt)
npx hardhat --network <network> task:get-encrypted-counts \
  --voting-id 0

# End a voting
npx hardhat --network <network> task:end-voting \
  --voting-id 0

# Make results public (for non-creators)
npx hardhat --network <network> task:make-results-public \
  --voting-id 0
```

Replace `<network>` with `localhost` or `sepolia`.

### Contract Functions

#### Admin Functions
- `createVoting()`: Create new voting with automatic creator permissions
- `addToWhitelist()`: Add addresses to private voting
- `removeFromWhitelist()`: Remove addresses from whitelist
- `endVoting()`: Manually end voting
- `makeResultsPublic()`: Make results decryptable for everyone

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
- ✅ Creator default permissions
- ✅ Access control and permissions
- ✅ Time-based voting restrictions

## 🔐 Security Features

### Encryption
- **Vote Privacy**: All votes encrypted with FHEVM
- **Anonymous Voting**: Voter identities not linked to vote choices
- **Secure Counting**: Vote tallying in encrypted space
- **Controlled Decryption**: Results only revealed when authorized

### Access Control
- **Role-based Permissions**: Owner, admin, and voter roles
- **Creator Privileges**: Voting creators have default decryption access
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

### Current Deployments
- **Localhost**: `0x34248A778Af91b582Dc4E9906a38B9F1dF6cd7AB`
- **Sepolia**: `0xDa32e98576254785c9DcacCC89337DDb20D6Fdf5`

### Environment Configuration

**For Sepolia Testnet** (`.env.local`):
```bash
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=sepolia
NEXT_PUBLIC_CONTRACT_ADDRESS=0xDa32e98576254785c9DcacCC89337DDb20D6Fdf5
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key
NEXT_PUBLIC_RELAYER_URL=https://relayer.sepolia.zama.ai
```

**For Local Development**:
```bash
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RELAYER_URL=http://localhost:8545
```

## 🛠️ Development

### Project Structure
```
zama_voting_001/
├── fhevm-hardhat-template/     # Smart contracts
│   ├── contracts/              # Solidity contracts
│   │   └── VotingSystem.sol    # Main voting contract
│   ├── deploy/                 # Deployment scripts
│   ├── test/                   # Contract tests
│   └── tasks/                  # Hardhat tasks
├── zama-voting-frontend/       # Frontend application
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   │   ├── VoteModal.tsx       # Vote selection interface
│   │   ├── ResultsModal.tsx    # Results viewing interface
│   │   └── VotingCard.tsx      # Voting display component
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

## 🎨 User Interface

### Voting Selection Modal
```
┌─────────────────────────────────┐
│ 🗳️ Vote                    ✕   │
│ Choose Your Favorite Color      │
├─────────────────────────────────┤
│ This is a color preference vote │
│                                 │
│ Options:                        │
│ ┌─────────────────────────────┐ │
│ │ Red                     ✓   │ │ ← Selected
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Blue                        │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Green                       │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Yellow                      │ │
│ └─────────────────────────────┘ │
│                                 │
│ 🔒 Your vote will be encrypted  │
│ ✅ Selected: Red                │
│                                 │
│ [Cancel]           [🗳️ Vote]   │
└─────────────────────────────────┘
```

### Results Viewing Modal
```
┌─────────────────────────────────┐
│ 📊 Results                 ✕   │
│ Choose Your Favorite Color      │
├─────────────────────────────────┤
│ Total Votes: 5    Status: Ended │
│                                 │
│ 🏆 Winning Option               │
│ Red with 2 votes                │
│                                 │
│ Detailed Results:               │
│ ┌─────────────────────────────┐ │
│ │ Red 🏆        2 votes (40%) │ │
│ │ ████████████░░░░░░░░░░░░░░░ │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Blue           1 vote (20%) │ │
│ │ ██████░░░░░░░░░░░░░░░░░░░░░ │ │
│ └─────────────────────────────┘ │
│                                 │
│                    [Back]       │
└─────────────────────────────────┘
```

## 🔄 Network Switching

### Switch to Local Development
```bash
# 1. Start Hardhat node
cd fhevm-hardhat-template
npx hardhat node --verbose

# 2. Deploy contracts
npx hardhat --network localhost deploy --tags VotingSystem

# 3. Update environment
# Edit .env.local:
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RELAYER_URL=http://localhost:8545

# 4. Start frontend
cd zama-voting-frontend
npm run dev:mock
```

### Switch to Sepolia Testnet
```bash
# 1. Stop local node
pkill -f "hardhat node"

# 2. Deploy to Sepolia
cd fhevm-hardhat-template
npx hardhat --network sepolia deploy --tags VotingSystem

# 3. Update environment
# Edit .env.local:
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RELAYER_URL=https://relayer.sepolia.zama.ai

# 4. Start frontend
cd zama-voting-frontend
npm run dev
```

## 👑 Creator Privileges

### Default Decryption Access
- **Automatic Authorization**: Creators receive decryption permissions when creating votings
- **Real-time Monitoring**: View voting progress without waiting for completion
- **No Additional Steps**: No need to call `makeResultsPublic` for own votings
- **Persistent Access**: Permissions maintained throughout voting lifecycle

### Permission Model
1. **Creator**: Default access to all vote counts, can end voting, can make results public
2. **Voters**: Access to vote counts they have permissions for
3. **Public**: Access only after creator makes results public

## 🧪 Testing & Verification

### Automated Tests
```bash
cd fhevm-hardhat-template
npm test
```

**Test Results**: 23/23 tests passing, including:
- Contract deployment and initialization
- Admin and creator permission management
- Encrypted voting and counting
- Access control validation
- Creator default decryption access

### Manual Testing
```bash
# Create test voting
npx hardhat --network localhost task:create-voting \
  --title "Test Voting" \
  --description "Testing the system" \
  --options "Yes,No,Maybe" \
  --duration 3600 \
  --public true

# Vote on the proposal
npx hardhat --network localhost task:vote --voting-id 0 --option 1

# Check results (creator can decrypt immediately)
npx hardhat --network localhost task:get-encrypted-counts --voting-id 0
```

## 🔐 Privacy & Security

### Encryption Features
- **Vote Confidentiality**: Individual votes are completely encrypted
- **Anonymous Voting**: Voter identities separated from vote choices
- **Secure Aggregation**: Vote counting in encrypted space
- **Selective Disclosure**: Results revealed only when authorized

### Access Control
- **Multi-level Permissions**: Owner > Admin > Creator > Voter > Public
- **Time-based Restrictions**: Voting only within specified periods
- **Whitelist Support**: Private votings with controlled access
- **Creator Privileges**: Default decryption access for voting creators

### Smart Contract Security
- **Input Validation**: Comprehensive validation of all inputs
- **Overflow Protection**: Safe arithmetic operations
- **Reentrancy Guards**: Protection against reentrancy attacks
- **Access Modifiers**: Strict function access control

## 🌍 Deployment Information

### Current Deployments

**Localhost Development**:
- **Contract**: `0x34248A778Af91b582Dc4E9906a38B9F1dF6cd7AB`
- **Network**: Hardhat Local (31337)
- **Purpose**: Development and testing

**Sepolia Testnet**:
- **Contract**: `0xDa32e98576254785c9DcacCC89337DDb20D6Fdf5`
- **Network**: Sepolia (11155111)
- **Explorer**: https://sepolia.etherscan.io/address/0xDa32e98576254785c9DcacCC89337DDb20D6Fdf5#code
- **Purpose**: Public testing and demonstration

### Deployment Commands

**Redeploy with New Wallet**:
```bash
# Update mnemonic
npx hardhat vars set MNEMONIC

# Force redeploy
npx hardhat --network sepolia deploy --tags VotingSystem --reset

# Update frontend
cd ../zama-voting-frontend
npm run genabi
```

## 🎯 Key Features Implemented

### ✅ Completed Features
1. **Encrypted Voting System**: Full FHEVM implementation
2. **Multi-option Support**: 2-4 options per voting
3. **Creator Privileges**: Default decryption access
4. **Access Control**: Public/private voting modes
5. **Time Management**: Start/end time controls
6. **Whitelist Support**: Private voting with address control
7. **Result Visualization**: Beautiful charts and statistics
8. **Bilingual Interface**: English/Chinese support
9. **Mobile Responsive**: Works on all devices
10. **Network Flexibility**: Localhost and Sepolia support

### 🎨 UI Components
- **VotingCard**: Display voting information and actions
- **VoteModal**: Interactive voting selection interface
- **ResultsModal**: Comprehensive results viewing with charts
- **CreateVotingForm**: Intuitive voting creation interface

### 🔧 Technical Implementation
- **FHEVM Integration**: Complete encrypted computation support
- **TypeScript**: Full type safety and IntelliSense
- **Error Handling**: Comprehensive error management
- **State Management**: Optimized React state handling
- **Performance**: No infinite re-rendering issues

## 📊 Project Statistics

- **Smart Contracts**: 1 main contract, 500+ lines of Solidity
- **Frontend Code**: 25+ components, 3000+ lines of TypeScript
- **Test Coverage**: 23 test cases covering all major functionality
- **Documentation**: Complete README + inline code comments
- **Internationalization**: 60+ translation strings for bilingual support

## 🚀 Getting Started

### Quick Demo
1. **Visit**: http://localhost:3000/test
2. **Test Voting**: Try the voting selection interface
3. **Test Results**: View the results modal interface

### Full Application
1. **Visit**: http://localhost:3000
2. **Connect Wallet**: Click "Connect Wallet" button
3. **Switch Network**: Ensure MetaMask is on the correct network
4. **Start Voting**: Create votings, participate, and view results

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
- Check the test files for usage examples
- Review the Hardhat tasks for CLI interaction patterns

## 🔮 Future Enhancements

### Short-term
- [ ] Advanced result visualization with charts
- [ ] Batch voting functionality
- [ ] Voting history and analytics
- [ ] PWA support for mobile

### Long-term
- [ ] Multi-chain deployment support
- [ ] DAO governance integration
- [ ] NFT-based voting rights
- [ ] Advanced statistical analysis

---

**Built with ❤️ using FHEVM technology for a more private and secure voting future.**

## 🎯 Quick Reference

### Essential Commands
```bash
# Local Development
npm run dev:mock          # Start with local Hardhat node

# Sepolia Testnet
npm run dev              # Start with Sepolia network

# Contract Deployment
npx hardhat --network <network> deploy --tags VotingSystem

# Create Voting
npx hardhat --network <network> task:create-voting --title "Title" --options "A,B,C"

# Vote
npx hardhat --network <network> task:vote --voting-id 0 --option 1

# View Results
npx hardhat --network <network> task:get-encrypted-counts --voting-id 0
```

### Network Information
- **Localhost**: Chain ID 31337, RPC http://localhost:8545
- **Sepolia**: Chain ID 11155111, RPC https://sepolia.infura.io/v3/YOUR_KEY

### Contract Addresses
- **Localhost**: `0x34248A778Af91b582Dc4E9906a38B9F1dF6cd7AB`
- **Sepolia**: `0xDa32e98576254785c9DcacCC89337DDb20D6Fdf5`

**Ready to use! Start your confidential voting experience today! 🎊**


