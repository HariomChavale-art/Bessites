export interface Website {
  id: string;
  name: string;
  developer: string;
  description: string;
  longDescription: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  imageUrl: string;
  screenshots: string[];
  isSponsored?: boolean;
  url: string;
  size: string;
  version: string;
  updatedAt: string;
}

export const MOCK_WEBSITES: Website[] = [
  {
    id: "1",
    name: "DesignFlow",
    developer: "Creative Labs",
    description: "The ultimate vector design tool for web.",
    longDescription: "DesignFlow brings professional-grade vector editing to the browser with real-time collaboration features and advanced path manipulation tools. Perfect for UI/UX designers and illustrators looking for a lightweight, cloud-native solution.",
    rating: 4.8,
    reviewCount: 1250,
    categories: ["Design", "Productivity", "Collaboration"],
    imageUrl: "https://picsum.photos/seed/app2/600/400",
    screenshots: [
      "https://picsum.photos/seed/ss1/800/600",
      "https://picsum.photos/seed/ss2/800/600",
      "https://picsum.photos/seed/ss3/800/600"
    ],
    url: "https://example.com/designflow",
    size: "12MB",
    version: "2.4.0",
    updatedAt: "Oct 12, 2023",
    isSponsored: true
  },
  {
    id: "2",
    name: "PulseSync",
    developer: "DataOps",
    description: "Real-time analytics for your microservices.",
    longDescription: "PulseSync monitors every heartbeat of your backend infrastructure. With instant alerting and beautiful 3D visualizations, you can see your data come to life and pinpoint bottlenecks before they affect your users.",
    rating: 4.5,
    reviewCount: 890,
    categories: ["Tech", "Analytics", "Development"],
    imageUrl: "https://picsum.photos/seed/app1/600/800",
    screenshots: [
      "https://picsum.photos/seed/ss4/800/600",
      "https://picsum.photos/seed/ss5/800/600"
    ],
    url: "https://example.com/pulsesync",
    size: "4.5MB",
    version: "1.1.2",
    updatedAt: "Jan 05, 2024"
  },
  {
    id: "3",
    name: "AetherSocial",
    developer: "Lumina Networks",
    description: "A decentralized social layer for the modern web.",
    longDescription: "AetherSocial redefines how we connect online. No centralized servers, no invasive tracking—just peer-to-peer interactions built on top of the latest cryptographic protocols. Share your thoughts, own your data.",
    rating: 4.9,
    reviewCount: 4500,
    categories: ["Social", "Web3", "Privacy"],
    imageUrl: "https://picsum.photos/seed/app3/600/900",
    screenshots: [
      "https://picsum.photos/seed/ss6/800/600",
      "https://picsum.photos/seed/ss7/800/600"
    ],
    url: "https://example.com/aether",
    size: "15MB",
    version: "0.9.8-beta",
    updatedAt: "Feb 14, 2024"
  },
  {
    id: "4",
    name: "ShopSphere",
    developer: "NextGen Commerce",
    description: "The VR-enabled marketplace for digital assets.",
    longDescription: "Explore high-quality 3D assets in a virtual environment. ShopSphere allows artists to sell their creations directly to developers with instant licensing and fair commission rates.",
    rating: 4.2,
    reviewCount: 320,
    categories: ["E-commerce", "VR", "Art"],
    imageUrl: "https://picsum.photos/seed/app4/600/600",
    screenshots: [
      "https://picsum.photos/seed/ss8/800/600"
    ],
    url: "https://example.com/shopsphere",
    size: "28MB",
    version: "3.1.0",
    updatedAt: "Dec 20, 2023",
    isSponsored: true
  },
  {
    id: "5",
    name: "NomadGuide",
    developer: "Global Traversal",
    description: "Your AI-powered companion for slow travel.",
    longDescription: "NomadGuide uses machine learning to suggest the perfect destination based on your work schedule, internet speed requirements, and personal interests. Connect with other digital nomads worldwide.",
    rating: 4.7,
    reviewCount: 2100,
    categories: ["Travel", "AI", "Lifestyle"],
    imageUrl: "https://picsum.photos/seed/app5/600/750",
    screenshots: [
      "https://picsum.photos/seed/ss9/800/600"
    ],
    url: "https://example.com/nomad",
    size: "8MB",
    version: "2.0.1",
    updatedAt: "Mar 01, 2024"
  },
  {
    id: "6",
    name: "ZenLedger",
    developer: "Stable FinTech",
    description: "Simplified crypto tax reporting and portfolio management.",
    longDescription: "ZenLedger connects to all your exchanges and wallets to provide a comprehensive view of your crypto journey. Generate tax reports in seconds and stay compliant with local regulations effortlessly.",
    rating: 4.4,
    reviewCount: 1100,
    categories: ["Finance", "Crypto", "Tools"],
    imageUrl: "https://picsum.photos/seed/app6/600/500",
    screenshots: [
      "https://picsum.photos/seed/ss10/800/600"
    ],
    url: "https://example.com/zenledger",
    size: "11MB",
    version: "4.5.2",
    updatedAt: "Apr 10, 2024"
  }
];