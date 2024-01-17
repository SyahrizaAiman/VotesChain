import { createConfig, configureChains, sepolia } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
 
export const { chains, publicClient } = configureChains(
  [sepolia],
  [infuraProvider({ apiKey: 'yourAPIkey' })],
)

export const config = createConfig({
  publicClient,
})

export const projectId = 'yourProjectID';

export const metadata = {
  name: 'VotesChain',
  description: 'VotesChain',
  url: 'https://VotesChain.netlify/',
  icons: ['./assets/raise-hand.png'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
};
