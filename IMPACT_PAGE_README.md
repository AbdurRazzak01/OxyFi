# My Impact Page Documentation

## Overview

The `my-impact.tsx` page provides a comprehensive dashboard for users to track their environmental impact and contributions to sustainability projects. It integrates with Solana wallet adapter to fetch user-specific data based on their connected wallet address.

## Features

### 1. **Total CO₂ Offset Tracking**
- Displays the total amount of CO₂ offset by the user's contributions
- Shows data in an easy-to-read metric format (kg CO₂)

### 2. **Impact Token Balance**
- Shows the total number of environmental impact tokens (ECO tokens) owned by the user
- Tokens are earned through contributions to various environmental projects

### 3. **Contribution Timeline Chart**
- Interactive area chart showing contribution history over the past 12 months
- Displays both CO₂ offset and tokens earned over time
- Uses Recharts library for responsive and interactive visualization

### 4. **Forest Visualizer**
- Visual representation of trees planted through user contributions
- Shows different tree species with color-coded icons
- Displays total forest area in hectares
- Species distribution breakdown

### 5. **Top Projects Display**
- Lists the environmental projects the user has contributed to
- Shows contribution amount, CO₂ impact, and tokens earned for each project
- Categorized by project type (Reforestation, Renewable Energy, etc.)

## Technical Architecture

### Components Structure

```
src/pages/my-impact.tsx          # Main page component
src/hooks/useImpactData.ts       # Custom hook for data fetching
src/components/AppBar.tsx        # Updated with navigation link
```

### Custom Hook: `useImpactData`

The `useImpactData` hook provides:
- **Data fetching** from smart contracts (currently mocked)
- **Loading states** management
- **Error handling**
- **Refetch functionality**

```typescript
const { data, loading, error, refetch } = useImpactData(walletAddress, connection);
```

## Smart Contract Integration

### Current Implementation (Mock Data)

The page currently uses mock data generation based on the wallet address to provide consistent, demo-ready functionality. The mock data generator creates realistic environmental impact metrics.

### Integrating with Real Smart Contracts

To integrate with actual Solana smart contracts, update the `fetchImpactDataFromContract` function in `src/hooks/useImpactData.ts`:

```typescript
const fetchImpactDataFromContract = async (
  walletAddress: PublicKey,
  connection: Connection
): Promise<ImpactData> => {
  // 1. Define your program ID
  const programId = new PublicKey('YourEnvironmentalProgramId');
  
  // 2. Find user impact account
  const [userImpactAccount] = await PublicKey.findProgramAddress(
    [Buffer.from('user_impact'), walletAddress.toBuffer()],
    programId
  );
  
  // 3. Fetch account data
  const accountInfo = await connection.getAccountInfo(userImpactAccount);
  if (!accountInfo) {
    throw new Error('User impact account not found');
  }
  
  // 4. Deserialize impact data
  const impactData = YourImpactDataStruct.deserialize(accountInfo.data);
  
  // 5. Fetch additional data (projects, timeline, etc.)
  // ... implement additional account fetching logic
  
  return transformToImpactData(impactData);
};
```

### Required Smart Contract Accounts

For full functionality, your Solana program should maintain:

1. **User Impact Account**: Stores individual user metrics
   - Total CO₂ offset
   - Total tokens earned
   - Projects contributed to

2. **Project Accounts**: Store project information
   - Project details (name, type, description)
   - CO₂ impact per contribution
   - Token rewards

3. **Contribution History**: Timeline of user contributions
   - Timestamp
   - Project ID
   - Contribution amount
   - CO₂ impact
   - Tokens earned

## Styling and UI

The page uses:
- **Tailwind CSS** for styling
- **Gradient backgrounds** for visual appeal
- **Lucide React** icons for consistent iconography
- **Responsive design** for mobile and desktop
- **DaisyUI** components (inherited from the base project)

## Data Types

### Core Interfaces

```typescript
interface ImpactData {
  totalCO2Offset: number;
  totalTokens: number;
  contributionTimeline: TimelineData[];
  forestData: ForestData;
  topProjects: ProjectData[];
}

interface TimelineData {
  date: string;
  co2Offset: number;
  tokensEarned: number;
  projects: number;
}

interface ForestData {
  treesPlanted: number;
  forestArea: number;
  species: { name: string; count: number; color: string }[];
}

interface ProjectData {
  id: string;
  name: string;
  type: string;
  contribution: number;
  co2Impact: number;
  tokensEarned: number;
}
```

## Navigation

The page is accessible via:
- **URL**: `/my-impact`
- **Navigation**: Added to the main AppBar with "My Impact" link
- **Wallet Required**: Users must connect their Solana wallet to view impact data

## Dependencies

- `@solana/wallet-adapter-react`: Wallet integration
- `@solana/web3.js`: Solana blockchain interaction
- `recharts`: Chart visualization
- `lucide-react`: Icons
- `next`: React framework
- `tailwindcss`: Styling

## Future Enhancements

1. **Real-time data updates** via WebSocket connections
2. **Export functionality** for impact reports
3. **Social sharing** of environmental achievements
4. **Gamification elements** (badges, leaderboards)
5. **Carbon footprint calculator** integration
6. **Project marketplace** for direct contributions

## Testing

The page includes:
- **Wallet connection states** (connected, loading, error)
- **Data loading states** with proper loading indicators
- **Error handling** with user-friendly error messages
- **Responsive design** testing across devices

## Performance Considerations

- **Memoized components** to prevent unnecessary re-renders
- **Optimized chart rendering** with ResponsiveContainer
- **Efficient data fetching** with custom hook
- **Tree visualization limits** (max 96 trees displayed) for performance