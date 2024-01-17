import { createConfig, configureChains, sepolia } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
 
export const { chains, publicClient } = configureChains(
  [sepolia],
  [infuraProvider({ apiKey: '18faa7d5819445ff9be86d23f3c1a121' })],
)

export const config = createConfig({
  publicClient,
})

export const projectId = 'b1196758d3d12d9cfd25b738e2762e21';

export const metadata = {
  name: 'VotesChain',
  description: 'VotesChain',
  url: 'https://VotesChain.com/',
  icons: ['./assets/raise-hand.png'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
};