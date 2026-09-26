# 🥒 New Brother Pickle Bar - Premium E-commerce Platform

A modern, full-stack e-commerce website for authentic Bangladeshi pickles (আচার), built with React, TypeScript, and Node.js.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)

## ✨ Features

### 🛒 Customer Features
- **Modern Product Catalog** - Browse 15+ varieties of handcrafted pickles
- **Smart Filtering** - Filter by taste profile, spice level, and price
- **Hero Slider** - Video + image carousel on home page
- **Shopping Cart** - Real-time cart with quantity management
- **Checkout System** - Multi-step checkout with Bangladesh address support
- **Order Tracking** - Real-time order status updates
- **WhatsApp Integration** - Direct customer support via WhatsApp
- **Mobile Responsive** - Optimized for all devices
- **Bengali/English** - Bilingual interface

### 👨‍💼 Admin Panel
- **Dashboard** - Sales stats, revenue tracking, pending orders
- **Product Management** - Add, edit, delete products
- **Order Management** - Update order status, track deliveries
- **Coupon System** - Create discount coupons
- **Slider Settings** - Customize hero slider (title, video, images)
- **Store Settings** - Configure delivery charges, contact info
- **PIN Protected** - Secure admin access

### 🔒 Security Features
- Helmet.js security headers
- CORS protection
- Rate limiting
- JWT authentication
- Input validation & sanitization
- CSRF protection
- Request size limits
- File lock mechanism
- Login attempt limiting

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ or Bun
- npm/yarn/bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/new-brother-picklebar.git
cd new-brother-picklebar

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The application will be available at **http://localhost:3000**

### Admin Access
- URL: **http://localhost:3000/admin**
- Default PIN: **1234** (change this immediately!)

## 📁 Project Structure

```
new-brother-picklebar/
├── src/
│   ├── components/         # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── AllProductsPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   └── TrackingPage.tsx
│   ├── context/            # React Context (State Management)
│   │   ├── StoreContext.tsx
│   │   └── LanguageContext.tsx
│   ├── data/               # Initial data
│   │   └── initialData.ts
│   ├── utils/              # Utility functions
│   │   ├── router.ts
│   │   ├── whatsapp.ts
│   │   └── youtube.ts
│   ├── types.ts            # TypeScript types
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── data/
│   └── store.json          # Persistent data storage
├── public/
│   └── images/             # Product images
├── server.ts               # Express backend server
├── package.json
└── README.md
```

## 🎨 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing

### Backend
- **Node.js/Express** - Server framework
- **TypeScript** - Type safety
- **Helmet.js** - Security middleware
- **Express Validator** - Input validation
- **JSON File Storage** - Lightweight data persistence

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file:

```env
PORT=3000
NODE_ENV=production
ADMIN_PIN=your-secure-pin
```

### Customization

#### Change Colors
Edit `src/index.css`:
```css
/* Primary: Dark Green */
--color-primary: #0F392B;

/* Secondary: Luxury Gold */
--color-secondary: #D4AF37;
```

#### Change Logo
Replace `/public/images/pickles/logo.png`

#### Update Store Info
Edit settings in Admin Panel or directly in `data/store.json`

## 📦 Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview

# Start production server
npm start
```

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Deploy to Railway/Render
- Connect your GitHub repository
- Set build command: `npm run build`
- Set start command: `npm start`

## 🔐 Security

**Important**: Before deploying to production:

1. ✅ Change admin PIN in settings
2. ✅ Review `data/store.json` for sensitive data
3. ✅ Set up proper HTTPS
4. ✅ Configure CORS for your domain
5. ✅ Enable rate limiting
6. ✅ Regular security updates

See [SECURITY-FIXES-APPLIED.md](SECURITY-FIXES-APPLIED.md) for details.

## 📱 Features by Page

### Home Page
- Hero slider with video/images
- Featured products
- Category filters
- Ingredients carousel
- Trust badges

### Products Page
- All products with filters
- Taste profile filtering
- Price range filtering
- Quick view modal
- Add to cart

### Checkout Page
- Cart review
- Delivery address (Bangladesh districts)
- Payment method selection
- Coupon application
- Order summary

### Admin Panel
- Dashboard with analytics
- Product CRUD operations
- Order management
- Coupon management
- Slider customization
- Settings configuration

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Developed with ❤️ for New Brother Pickle Bar

## 📞 Support

For support, email: order@newbrotherpicklebar.com

## 🎯 Roadmap

- [ ] Payment gateway integration (bKash, Nagad)
- [ ] Customer accounts & order history
- [ ] Product reviews & ratings
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Multi-language support (more languages)
- [ ] Image upload in admin panel
- [ ] Inventory management
- [ ] Sales reports
- [ ] Customer loyalty program

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Fonts: Google Sans, Noto Sans Bengali, Tiro Bangla
- UI inspiration from modern e-commerce platforms

---

**Made in Bangladesh 🇧🇩 | For the love of authentic pickles 🥒**
