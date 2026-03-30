# Shopping App

A full-stack shopping application built with NestJS (backend) and React Native with Expo (mobile).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | NestJS · TypeScript |
| Mobile | React Native · Expo · TypeScript |
| Testing | Jest · Supertest |

**Environment requirements**
- Node.js v22.11.0
- npm v10.9.0

---

## Project Structure

```
shopping-app/
├── backend/                  # NestJS BFF API
│   ├── src/
│   │   ├── cart/             # Cart management (CRUD, checkout, discount)
│   │   ├── products/         # Product catalogue and stock management
│   │   ├── discount/         # Discount code validation
│   │   └── main.ts           # App entry point
│   └── test/
│       ├── cart.service.spec.ts      # Unit tests for cart service
│       ├── discount.service.spec.ts  # Unit tests for discount service
│       ├── product.service.spec.ts   # Unit tests for product service
│       └── app.e2e-spec.ts           # End-to-end API tests
│
└── mobile/                   # React Native (Expo) app
    ├── app/
    │   ├── (tabs)/           # Tab screens: products, categories, cart
    │   ├── products/         # Product detail and category views
    │   └── order-summary.tsx # Post-checkout summary
    └── src/
        ├── api/
        │   ├── cart.ts               # Cart API calls
        │   ├── cart.test.ts          # Cart API tests
        │   ├── products.ts           # Product API calls
        │   └── products.test.ts      # Product API tests
        ├── components/
        │   ├── ProductCard.tsx
        │   └── ProductCard.test.tsx  # Component tests
        ├── context/
        │   ├── CartContext.tsx
        │   └── CartContext.test.tsx  # Context tests
        ├── constants/        # API config
        └── types/            # Shared TypeScript types
```

---

## Running the Backend

```bash
cd backend
npm install
npm run start
```

Runs on `http://localhost:3000`

---

## Running the Mobile App

```bash
cd mobile
npm install
npm start
```

Then press the key for your target platform:

| Platform | Command | Notes |
|---|---|---|
| iOS simulator | `i` | Requires Xcode |
| Android emulator | `a` | Requires Android Studio |
| Web | `w` | Opens in browser |

Or use the platform-specific scripts:

```bash
npm run ios      # iOS simulator
npm run android  # Android emulator (uses 10.0.2.2 to reach local backend)
npm run web      # Web browser
```

> **Android note:** The Android emulator cannot reach `localhost` directly. Before running on Android, set up the required port forwards:
> ```bash
> adb reverse tcp:3000 tcp:3000   # backend
> adb reverse tcp:8083 tcp:8083   # Metro bundler
> ```
> Then `npm run android` is pre-configured to use `http://10.0.2.2:3000` to reach the local backend.

---

## Running Tests

**Backend unit tests:**
```bash
cd backend
npm run test
```

**Backend e2e tests:**
```bash
cd backend
npm run test:e2e
```

**Backend coverage:**
```bash
cd backend
npm run test:cov
```

**Mobile tests:**
```bash
cd mobile
npm test
```

### Backend Test Coverage

| File | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| `cart.service.ts` | 100% | 94% | 100% | 100% |
| `discount.service.ts` | 100% | 100% | 100% | 100% |
| `product.service.ts` | 100% | 100% | 100% | 100% |
| `product.seed.ts` | 100% | 100% | 100% | 100% |
| `cart.controller.ts` | — | — | — | — |
| `product.controller.ts` | — | — | — | — |

Controllers are not unit tested directly — they are covered by the e2e test suite which tests the full request lifecycle including routing, validation pipes, and service integration.

### What the backend tests cover

**Unit tests** (`cart.service.spec.ts`, `discount.service.spec.ts`, `product.service.spec.ts`):
- Cart creation, retrieval, expiry and stock restoration
- Adding, updating, and removing cart items
- Discount code validation including boundary cases
- Product filtering by category and stock management

**End-to-end tests** (`app.e2e-spec.ts`):
- All product endpoints including category filtering and 404 handling
- Full cart lifecycle: create → add items → update → remove → checkout
- DTO validation rejection (invalid quantities, missing fields)
- Discount code rejection

### Mobile test coverage

| Area | What's tested |
|---|---|
| `CartContext` | State updates, cart clearing, provider guard |
| `cart.ts` API | Request behaviour, error handling, response parsing |
| `products.ts` API | Fetch behaviour, error handling |
| `ProductCard` | Rendering, quantity controls, navigation, add to cart |
| `OrderSummary` | Rendering order data, empty state, totals |

---

## Features

### Backend
- View product catalogue (with optional category filter)
- Retrieve a single product by ID
- Create a cart and manage items (add, update quantity, remove)
- Apply discount codes
- Checkout
- Automatic stock reservation when items are added to cart
- Stock restored when items are removed or cart expires
- Cart expires after 2 minutes of inactivity

### Mobile
- Browse all products or filter by category
- Product detail view with image, stock level, and quantity selector
- Cart management with quantity controls and item removal
- Discount code input with validation feedback
- Checkout with order summary screen
- Session expiry handling with clear user feedback

---

## Discount Logic

One discount code is supported:

| Code | Discount | Minimum order |
|---|---|---|
| `SAVE10` | 10% off | £100 |

---

## Key Design Decisions

**BFF architecture** — the NestJS backend acts as a Backend-for-Frontend, handling all business logic (stock reservation, discount validation, cart expiry) so the mobile app stays simple.

**In-memory storage** — the product catalogue and cart sessions are stored in memory. Stock is reserved immediately when items are added to a cart and restored on removal or expiry.

**Minimal global state** — the mobile app uses React Context only for `cartId` and `lastOrder`. All other state (loading, errors, quantities) is local to each screen.

**Consistent error handling** — all API calls surface meaningful error messages to the UI. Errors never leave the user with a blank screen.
