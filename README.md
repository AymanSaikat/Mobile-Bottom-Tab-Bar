# 📱 Mobile Bottom Tab Bar for WordPress / WooCommerce (Floating UI)

A **Mobile Bottom Navigation Bar** built exclusively with **HTML, CSS, and JavaScript**. Designed specifically for **WordPress / WooCommerce websites**, this component allows you to add native-style mobile navigation **without installing any extra plugins**.

This project provides a native app-like bottom tab bar experience for mobile shoppers and visitors, implemented directly into your theme files. By leveraging pure frontend code, it integrates seamlessly with WordPress templates and WooCommerce shop pages while keeping your site fast and bloat-free.

---

## 🔗 Live Preview

👉 https://aymansaikat.github.io/Mobile-Bottom-Tab-Bar

---

## ✨ Features

- Floating island bottom navigation (fixed to viewport)
- Mobile-only optimized design
- Clean modern "island" UI style
- 5 navigation tabs:
  - Home
  - Shop
  - Search
  - Favourite
  - Account
- Active tab highlighted with a soft pill background
- Inactive icons dimmed, active icon bold with thicker stroke
- Only visible on mobile (`max-width: 768px`) - desktop is untouched
- Bounces in on page load with a spring animation
- Hides when scrolling down, reappears when scrolling up
- Double tap **Home** tab scrolls smoothly back to top
- **Smart Shop tab** - works normally on all pages, but when already on the Shop page tapping it again opens the Mini Cart Drawer instead
- Lightweight (no frameworks)
- Easy WordPress / Elementor integration
- Smooth page transition (cream fade) when switching tabs
- Haptic feedback (vibration) on every tab tap
- Smooth interactions & active state

---
### 🚀 Highlights

-   **Pure Code:** Built entirely with HTML, CSS & JS.
-   **Responsive:** Optimized for all mobile screen sizes and orientations.
-   **Zero Dependencies:** No heavy libraries or frameworks required just copy and paste.
-   **Thumb-Friendly:** Designed for ease of use in mobile environments.
-   **Without Any Plugins**: No external JS or CSS libraries.
-   **Zero Bloat**: Optimized for lightning-fast load times.
-   **Minimalist UI**: A clean, high-contrast design that fits any modern aesthetic.
-   **Fluid Layout:** Adapts seamlessly to diverse mobile viewports.
-   **Native Feel:** Replicates the navigation patterns of high end mobile apps.
-   **Customizable:** Easy-to-edit variables for colors, icons, and sizing.

## 📸 Preview

<p align="center">

<img src="https://github.com/AymanSaikat/Mobile-Bottom-Tab-Bar/blob/main/Screenshort/Screenshot_1.png" alt="Direct Download Search Preview" width="33.33%" />
<img src="https://github.com/AymanSaikat/Mobile-Bottom-Tab-Bar/blob/main/Screenshort/Screenshot_2.png" alt="Direct Download Search Preview" width="250" />
<img src="https://github.com/AymanSaikat/Mobile-Bottom-Tab-Bar/blob/main/Screenshort/Screenshot_3.png" alt="Direct Download Search Preview" width="250" />
  
</p>

---


### 🔍 Search Popup
- Slide-up bottom sheet with blur overlay
- Swipe down to dismiss
- Long press the Search tab to open with keyboard instantly focused
- **Animated placeholder** cycles through search hints every 2.5 seconds
- **Recent searches** stored in `localStorage` - shows up to 5 recent searches as tappable chips with a clock icon
- **Trending products** loaded from WooCommerce on popup open (newest 4 products)
- **Live product suggestions** as you type (debounced 350ms)
- Each suggestion shows: thumbnail, product name, price (regular + sale), category
- **Sale badge** on thumbnails for discounted products
- **Category filter chips** - filter results by category after searching
- **Enter key** redirects to full shop search results
- **"View all results"** button links to shop with query pre-filled
- **Voice search (mic button)** - tap mic, browser asks for permission, speak to search

---

### 🛒 Mini Cart Drawer
- Long press the **Shop tab** (500ms) on any page to open
- On the Shop page, a single tap opens it
- Shows all cart items with thumbnail, name, quantity, and price
- Displays both regular and sale price when applicable
- Shows cart total
- **Proceed to Checkout** button
- Swipe down to close
- Refreshes live from WooCommerce Store API

---

### 🛍️ Cart Badge
- Live item count badge on the Shop tab
- Refreshes every **500ms** for near-instant updates
- Bounces with a spring animation when count increases
- Also refreshes when page becomes visible again

---

### 🆕 NEW Badge
- Green **NEW** badge appears on the Shop tab when a new product is added to the store
- Compares latest product ID to last seen ID stored in `localStorage`
- Automatically dismisses when the user visits the Shop tab

---

### 🎉 Confetti & Toast
- **Confetti animation** fires when a product is added to cart
- **Toast notification** ("✅ Added to cart!") pops up above the tab bar
- Toast auto-dismisses after 2.5 seconds

---

### 🌙 Dark Mode
- Automatically switches based on the device's system setting (`prefers-color-scheme: dark`)
- All colors have matching dark mode equivalents defined in CSS variables

---

### 📲 Other
- **Pull to refresh** - pull down from the top of the page to reload
- **Favourite badge** - counts items saved in `localStorage`

---

## 🎨 Customization

All colors are defined as CSS variables at the top of the `<style>` block. Every color line also has a `/* COMMENT */` explaining what it controls so you can find and change anything instantly.

```css
:root {
  --bh-island-bg        : rgba(251, 249, 245, 0.92); /* ISLAND BACKGROUND COLOR */
  --bh-island-border    : rgba(115, 92, 0, 0.10);    /* ISLAND BORDER COLOR */
  --bh-icon-inactive    : rgba(115, 92, 0, 0.38);    /* INACTIVE TAB ICON + LABEL COLOR */
  --bh-icon-active      : #735C00;                   /* ACTIVE TAB ICON + LABEL COLOR */
  --bh-pill-bg          : rgba(115, 92, 0, 0.11);    /* ACTIVE TAB PILL BACKGROUND */
  --bh-badge-bg         : #735C00;                   /* BADGE BACKGROUND COLOR */
  --bh-sale-bg          : #C0392B;                   /* SALE BADGE / PRICE COLOR */
  /* ... and many more */
}
```

Dark mode colors are defined separately inside `@media (prefers-color-scheme: dark)`.

---

## ⚙️ How It Works

### Search API
Uses the **WooCommerce Store API** - public, no authentication required:
```
/wp-json/wc/store/v1/products?search=QUERY&per_page=8
```
This returns product name, price, images, and categories in one call - no duplicates.

### Cart API
```
/wp-json/wc/store/v1/cart
```
Fetches live cart data with `credentials: include` so it reads the user's session.

### Voice Search
Uses the browser's native **Web Speech API** (`SpeechRecognition`). Works on:
- ✅ Chrome for Android
- ✅ Safari on iPhone (iOS 14.5+)
- ❌ Firefox (not supported)

The mic permission popup appears automatically when the mic button is tapped - `rec.start()` is called synchronously inside the click handler which is the only way browsers grant permission.

### Recent Searches & Favourites
Stored in `localStorage` - persists across sessions on the same device and browser.

### New Product Badge
Compares the latest product ID from the API to the last seen ID stored in `localStorage`. If the latest is higher, the NEW badge appears.

---

### : ⚙️ Configuration
To get this script working with your site, you need to replace the placeholder `Your Website Name` with your actual domain URL (e.g., [`https://example.com`](` https://example.com`)). This change is required in 5 places:
### 1. HTML
```html
<a class="bh-tab" href="Your Website Name/" aria-label="Home">
<a class="bh-tab" href="Your Website Name/shop/" aria-label="Shop">
<a class="bh-tab" href="Your Website Name/saved/" aria-label="Favourites">
<a class="bh-tab" href="Your Website Name/my-account/" aria-label="Account">
```
### 2. JAVASCRIPT
```js
var siteUrl   = 'Your Website Name';
```

---

## 🚀 Installation

```bash
git clone https://github.com/AymanSaikat/Mobile-Bottom-Tab-Bar.git
```

Open:
```bash
MobileBottomTabBarCode.txt
```

---
## 📲 Use Cases

- 🛒 WooCommerce Stores
- 📱 Progressive Web Apps (PWA)
- 🧩 Mobile dashboards
- 🧭 Custom navigation systems UI

---

## 🌐 WordPress Integration

1. Install the **Insert Headers and Footers** plugin in WordPress (or use Elementor Custom Code)
2. Go to **Settings → Insert Headers and Footers → Footer** / Just Paste code in Footer
3. Paste the entire contents of `MobileBottomTabBarCode.txt`
4. Save and visit your site on mobile

---
## 🔗 Tab Links

| Tab | URL |
|---|---|
| Home | `/ayman/` |
| Shop | `/ayman/shop/` |
| Search | Opens popup |
| Favourite | `/ayman/saved/` |
| Account | `/ayman/my-account/` |
| Checkout (cart drawer) | `/ayman/checkout/` |

---

## 📁 File

| File | Description |
|---|---|
| `MobileBottomTabBarCode.txt` | Complete production code - paste into WordPress footer |
| `README.md` | This file |

---

## 🧱 Project Structure

```
MobileBottomTabBarCode.txt
│
├── HTML  → Structure
├── CSS   → Styling & Layout
└── JS    → Interactions
```
## 🛠️ Built With

- Pure HTML, CSS, JavaScript - zero dependencies
- WooCommerce Store REST API
- Web Speech API (voice search)
- CSS custom properties (variables) for easy theming
- `localStorage` for recent searches, favourites, new badge state
- `navigator.vibrate` for haptic feedback
- `prefers-color-scheme` for automatic dark mode

---
## 📱 Browser Support

| Browser | Support |
|---|---|
| Chrome Android | ✅ Full |
| Safari iPhone | ✅ Full (iOS 14.5+ for voice) |
| Samsung Internet | ✅ Full |
| Firefox Android | ✅ Partial (no voice search) |
| Desktop browsers | ❌ Hidden (mobile only) |
---
- 🎨 Colors
- 🔗 Navigation links
- 🧭 Icons (Emoji / SVG / Font Awesome)
- 📱 Mobile visibility
- 📳 Vibration strength

---


## 🤝 Contributing

Contributions are welcome!

1. Fork the repo  
2. Create your feature branch  
3. Commit your changes  
4. Push to the branch  
5. Open a Pull Request  

---

## 📄 License

This project is licensed under the **MIT License** - free to use, modify, and distribute.

---

## 👤 Author

**Ayman Saikat**  
🔗 https://github.com/AymanSaikat

---

## ⭐ Support

If you like this project:



- ⭐ Star the repo
- 🔁 Share it
- 👨‍💻 Follow for more UI components



<div align="center">
  <h3>No frameworks. No plugins. Just pure code.</h3>
</div>
