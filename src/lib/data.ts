export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  rating: number;
  reviewCount: number;
  sold: number;
  condition: 'Mint' | 'Near Mint' | 'Excellent' | 'Good' | 'Played' | 'Damaged';
  verified: boolean;
  seller: Seller;
  badges: string[];
  description: string;
  brand: string;
  series?: string;
  itemType?: string;
  language?: string;
  year?: number;
  stock: number;
  tradeAvailable?: boolean;
}

export interface Seller {
  id: string;
  name: string;
  rating: number;
  totalSales: number;
  trades: number;
  positiveRate: number;
  verified: boolean;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

export interface Notification {
  id: string;
  type: 'order' | 'price' | 'wishlist' | 'trade' | 'message' | 'community';
  icon: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export interface Message {
  id: string;
  user: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export interface CommunityPost {
  id: string;
  user: string;
  title: string;
  preview: string;
  replies: number;
  likes: number;
  time: string;
  tags: string[];
}

export const sellers: Seller[] = [
  { id: 's1', name: 'HobiVault', rating: 4.9, totalSales: 1240, trades: 127, positiveRate: 98, verified: true },
  { id: 's2', name: 'CardStation', rating: 4.8, totalSales: 890, trades: 85, positiveRate: 97, verified: true },
  { id: 's3', name: 'GundamHub', rating: 4.7, totalSales: 650, trades: 42, positiveRate: 96, verified: true },
  { id: 's4', name: 'FigureHouse', rating: 4.9, totalSales: 540, trades: 30, positiveRate: 99, verified: true },
  { id: 's5', name: 'RareCardID', rating: 4.8, totalSales: 320, trades: 95, positiveRate: 97, verified: true },
  { id: 's6', name: 'HobbyCorner', rating: 4.6, totalSales: 210, trades: 18, positiveRate: 95, verified: false },
];

export const products: Product[] = [
  { id: 'p1', name: 'Charizard EX', category: 'Trading Cards', subcategory: 'Pokémon', price: 1250000, originalPrice: 1500000, discount: 17, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f2c4c93618f1.jpg', rating: 4.9, reviewCount: 128, sold: 234, condition: 'Near Mint', verified: true, seller: sellers[0], badges: ['BEST SELLER', 'VERIFIED'], description: 'Charizard EX from Scarlet & Violet series. Japanese edition, near mint condition with excellent corners and surface. Comes with protective sleeve and toploader.', brand: 'Pokémon', series: 'Scarlet & Violet', itemType: 'Trading Card', language: 'Japanese', year: 2025, stock: 12, tradeAvailable: true },
  { id: 'p2', name: 'Gundam MGEX Unicorn', category: 'Gundam & Gunpla', subcategory: 'Master Grade', price: 2500000, originalPrice: 2800000, discount: 11, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b8281af7a2f3.jpg', rating: 4.9, reviewCount: 89, sold: 156, condition: 'Mint', verified: true, seller: sellers[2], badges: ['RARE', 'LIMITED', 'VERIFIED'], description: 'MGEX 1/100 Unicorn Gundam Ver. Ka. Premium Bandai exclusive with special finish and LED unit included. Brand new, unopened box.', brand: 'Bandai', series: 'Mobile Suit Gundam Unicorn', itemType: 'Gunpla Model Kit', year: 2024, stock: 5 },
  { id: 'p3', name: 'Gundam RG Nu Gundam', category: 'Gundam & Gunpla', subcategory: 'Real Grade', price: 680000, originalPrice: 850000, discount: 20, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/36818cda6f4e.jpg', rating: 4.8, reviewCount: 96, sold: 320, condition: 'Near Mint', verified: true, seller: sellers[2], badges: ['SALE', 'VERIFIED'], description: 'RG 1/144 Nu Gundam with funnel missiles. High detail real grade kit with water slide decals included.', brand: 'Bandai', series: 'Char\'s Counterattack', itemType: 'Gunpla Model Kit', year: 2024, stock: 28 },
  { id: 'p4', name: 'Pikachu Illustration Rare', category: 'Trading Cards', subcategory: 'Pokémon', price: 450000, originalPrice: 520000, discount: 13, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/262c97f8c9c7.jpg', rating: 4.7, reviewCount: 67, sold: 189, condition: 'Excellent', verified: true, seller: sellers[1], badges: ['NEW', 'VERIFIED'], description: 'Pikachu Illustration Rare from Pokémon 151 set. Beautiful artwork in excellent condition.', brand: 'Pokémon', series: 'Pokémon 151', itemType: 'Trading Card', language: 'Japanese', year: 2025, stock: 35 },
  { id: 'p5', name: 'Iron Man Mark 46 Figure', category: 'Figures', subcategory: 'Marvel', price: 1800000, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7ff0579f0838.jpg', rating: 4.9, reviewCount: 54, sold: 87, condition: 'Mint', verified: true, seller: sellers[3], badges: ['RARE', 'VERIFIED'], description: 'Hot Toys 1/6 scale Iron Man Mark 46 from Captain America: Civil War. Die-cast with LED features.', brand: 'Hot Toys', series: 'MCU', itemType: 'Collectible Figure', year: 2023, stock: 8, tradeAvailable: true },
  { id: 'p6', name: 'Blue-Eyes White Dragon', category: 'Trading Cards', subcategory: 'Yu-Gi-Oh!', price: 980000, originalPrice: 1200000, discount: 18, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a93e13adc706.jpg', rating: 4.8, reviewCount: 112, sold: 267, condition: 'Near Mint', verified: true, seller: sellers[4], badges: ['BEST SELLER', 'SALE', 'VERIFIED'], description: 'Blue-Eyes White Dragon 1st Edition from Legend of Blue Eyes. Iconic card in near mint condition.', brand: 'Yu-Gi-Oh!', series: 'Legend of Blue Eyes', itemType: 'Trading Card', language: 'English', year: 2002, stock: 15, tradeAvailable: true },
  { id: 'p7', name: 'One Piece Luffy Card', category: 'Trading Cards', subcategory: 'One Piece', price: 320000, originalPrice: 400000, discount: 20, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9bcda0b6faf0.jpg', rating: 4.6, reviewCount: 78, sold: 145, condition: 'Good', verified: false, seller: sellers[1], badges: ['SALE'], description: 'Monkey D. Luffy Secret Rare from One Piece Card Game. Romance Dawn set.', brand: 'One Piece Card Game', series: 'Romance Dawn', itemType: 'Trading Card', language: 'Japanese', year: 2024, stock: 42 },
  { id: 'p8', name: 'Spider-Man Figure', category: 'Figures', subcategory: 'Marvel', price: 750000, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8c529be8d348.jpg', rating: 4.7, reviewCount: 43, sold: 92, condition: 'Excellent', verified: true, seller: sellers[3], badges: ['VERIFIED'], description: 'SH Figuarts Spider-Man No Way Home version. Highly articulated with multiple hand parts and web effects.', brand: 'Bandai', series: 'MCU', itemType: 'Action Figure', year: 2024, stock: 20 },
  { id: 'p9', name: 'Gundam HG Aerial', category: 'Gundam & Gunpla', subcategory: 'High Grade', price: 285000, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d582d2395dff.png', rating: 4.5, reviewCount: 34, sold: 210, condition: 'Mint', verified: true, seller: sellers[2], badges: ['NEW', 'VERIFIED'], description: 'HG 1/144 Gundam Aerial from Mobile Suit Gundam: The Witch from Mercury. Easy build for beginners.', brand: 'Bandai', series: 'The Witch from Mercury', itemType: 'Gunpla Model Kit', year: 2025, stock: 55 },
  { id: 'p10', name: 'Naruto Sage Mode Figure', category: 'Figures', subcategory: 'Anime', price: 550000, originalPrice: 650000, discount: 15, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/efe453eb855a.jpg', rating: 4.8, reviewCount: 61, sold: 134, condition: 'Near Mint', verified: true, seller: sellers[3], badges: ['SALE', 'VERIFIED'], description: 'Megahouse Naruto Sage Mode Excellent Model. Highly detailed PVC figure with special effects parts.', brand: 'Megahouse', series: 'Naruto Shippuden', itemType: 'PVC Figure', year: 2023, stock: 18, tradeAvailable: true },
  { id: 'p11', name: 'Charizard VMAX Rainbow', category: 'Trading Cards', subcategory: 'Pokémon', price: 2100000, originalPrice: 2500000, discount: 16, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c6f3f7546825.jpg', rating: 5.0, reviewCount: 45, sold: 67, condition: 'Mint', verified: true, seller: sellers[4], badges: ['RARE', 'LIMITED', 'VERIFIED'], description: 'Charizard VMAX Rainbow Rare from Shining Fates. One of the most sought-after modern Pokémon cards.', brand: 'Pokémon', series: 'Shining Fates', itemType: 'Trading Card', language: 'English', year: 2021, stock: 3 },
  { id: 'p12', name: 'Gundam PG Strike Freedom', category: 'Gundam & Gunpla', subcategory: 'Perfect Grade', price: 3500000, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/23b7c3115b13.jpg', rating: 4.9, reviewCount: 28, sold: 42, condition: 'Mint', verified: true, seller: sellers[2], badges: ['RARE', 'LIMITED', 'VERIFIED'], description: 'PG 1/60 Strike Freedom Gundam. The ultimate Gunpla experience with full inner frame and LED system.', brand: 'Bandai', series: 'SEED Destiny', itemType: 'Gunpla Model Kit', year: 2024, stock: 2 },
];

export const reviews: Review[] = [
  { id: 'r1', user: 'KevinCollector', rating: 5, date: '2 days ago', text: 'Barang sesuai deskripsi dan packing sangat aman. Kondisi kartunya benar-benar sesuai dengan grade yang ditulis. Recommended seller!', verified: true },
  { id: 'r2', user: 'GundamFanID', rating: 5, date: '5 days ago', text: 'Gundam datang lengkap dan tidak ada part yang rusak. Runner masih bagus, manual lengkap. Seller terpercaya!', verified: true },
  { id: 'r3', user: 'CardMaster99', rating: 4, date: '1 week ago', text: 'Kartu bagus, pengiriman cepat. Hanya sedikit markup di sleeve tapi tidak mengurangi nilai kartu.', verified: true },
  { id: 'r4', user: 'AnimeFigureLover', rating: 5, date: '1 week ago', text: 'Figure detail luar biasa! Worth every penny. Box condition perfect, no dents at all.', verified: true },
  { id: 'r5', user: 'HobbyBeginner', rating: 5, date: '2 weeks ago', text: 'Pertama kali beli di HobiMart dan pengalaman pertama sangat memuaskan. Pasti beli lagi!', verified: true },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'order', icon: 'package', title: 'Your order has shipped', description: 'Order #HM-10294 is on its way', time: '2 hours ago', read: false },
  { id: 'n2', type: 'wishlist', icon: 'heart', title: 'Charizard EX is back in stock', description: 'Limited quantity available', time: '5 hours ago', read: false },
  { id: 'n3', type: 'price', icon: 'tag', title: 'Gundam RG Nu is now 15% off', description: 'Was Rp850.000, now Rp680.000', time: '1 day ago', read: false },
  { id: 'n4', type: 'trade', icon: 'repeat', title: 'You received a Trade Offer', description: 'CardStation wants to trade with you', time: '1 day ago', read: true },
  { id: 'n5', type: 'message', icon: 'message-circle', title: 'New message from GundamHub', description: 'Re: Item availability inquiry', time: '2 days ago', read: true },
  { id: 'n6', type: 'community', icon: 'users', title: 'Someone replied to your post', description: '"Great tips for storing cards"', time: '3 days ago', read: true },
];

export const messages: Message[] = [
  { id: 'm1', user: 'GundamHub', lastMessage: 'Sure! The PG Strike Freedom is still available. Would you like to proceed?', time: '2h ago', unread: 1 },
  { id: 'm2', user: 'CardStation', lastMessage: 'We can do a trade for the Charizard. What do you have in mind?', time: '1d ago', unread: 0 },
  { id: 'm3', user: 'HobiVault', lastMessage: 'Your order has been shipped! Tracking number: JNE-123456789', time: '2d ago', unread: 0 },
];

export const communityPosts: CommunityPost[] = [
  { id: 'c1', user: 'CardNewbie', title: 'Is this card authentic?', preview: 'I just bought this Charizard from a local shop. The holographic pattern looks a bit different from what I see online...', replies: 24, likes: 15, time: '3 hours ago', tags: ['Trading Cards', 'Authentication'] },
  { id: 'c2', user: 'GundamBuilderID', title: 'Best Gunpla under 1 million?', preview: 'Looking for recommendations for a beginner-friendly Gunpla kit that still looks great on display. Budget around Rp500K-Rp1M...', replies: 45, likes: 32, time: '6 hours ago', tags: ['Gundam', 'Recommendation'] },
  { id: 'c3', user: 'ProCollector', title: 'How do you store your cards?', preview: 'Just built a new shelving system for my collection. Want to share some tips on long-term card storage and display...', replies: 18, likes: 28, time: '1 day ago', tags: ['Storage', 'Tips'] },
  { id: 'c4', user: 'FigureFanatic', title: 'Hot Toys vs SH Figuarts for display?', preview: 'I have limited display space and budget. Which line gives better value for Marvel figures?', replies: 31, likes: 19, time: '2 days ago', tags: ['Figures', 'Comparison'] },
];

export const categories = [
  { name: 'Trading Cards', icon: 'Heart', count: 1240, color: 'from-orange-500 to-red-500' },
  { name: 'Gundam & Gunpla', icon: 'Bot', count: 856, color: 'from-blue-500 to-indigo-500' },
  { name: 'Figures', icon: 'Gem', count: 632, color: 'from-purple-500 to-pink-500' },
  { name: 'Collectibles', icon: 'Diamond', count: 428, color: 'from-amber-500 to-yellow-500' },
  { name: 'Accessories', icon: 'Wrench', count: 312, color: 'from-green-500 to-emerald-500' },
];

export function formatPrice(price: number | null | undefined): string {
  if (price == null || isNaN(price)) return 'Rp0';
  return 'Rp' + price.toLocaleString('id-ID');
}

export function getConditionColor(condition: string): string {
  switch (condition) {
    case 'Mint': return 'text-green-600 bg-green-50';
    case 'Near Mint': return 'text-emerald-600 bg-emerald-50';
    case 'Excellent': return 'text-blue-600 bg-blue-50';
    case 'Good': return 'text-amber-600 bg-amber-50';
    case 'Played': return 'text-orange-600 bg-orange-50';
    case 'Damaged': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}

export function getBadgeColor(badge: string): string {
  switch (badge) {
    case 'SALE': return 'bg-red-500 text-white';
    case 'NEW': return 'bg-green-500 text-white';
    case 'RARE': return 'bg-purple-500 text-white';
    case 'LIMITED': return 'bg-amber-500 text-white';
    case 'BEST SELLER': return 'bg-orange-500 text-white';
    case 'LOW STOCK': return 'bg-yellow-500 text-black';
    case 'SOLD OUT': return 'bg-gray-400 text-white';
    case 'VERIFIED': return 'bg-blue-500 text-white';
    case 'TRADE AVAILABLE': return 'bg-teal-500 text-white';
    default: return 'bg-gray-200 text-gray-700';
  }
}
