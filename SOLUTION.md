<h1>Shopping App</h1>

This project is a full-stack shopping application.

<strong>Backend:</strong> NestJS (Backend-for-Frontend architecture)</br>
<strong>Frontend:</strong> React Native (Expo + TypeScript)

The system supports a complete shopping flow including product browsing, cart management, discount handling, and checkout.
## Environment

- Node.js: v22.11.0
- npm: v10.9.0

<h1> Backend (NESTJS) </h1>

This backend is implemented using NestJS as a Backend for Frontend (BFF) to support the mobile shopping application.

### How to run the backend

```bash
cd backend
npm install
npm run start
```

## By default, the backend runs locally on:

http://localhost:3000

## Backend features implemented

The backend supports the main shopping flow required for the exercise:
View the product catalogue
Retrieve a single product by id
Create a cart
Add items to a cart
Update item quantities
Remove items from a cart
Apply a discount code
Checkout a cart
Cart and stock behaviour

## Cart and stock behaviour
The cart is managed fully in memory.

When a product is added to the cart, stock is reserved immediately by reducing the available stock in the product catalogue.

Stock is restored when:

an item is removed from the cart
the quantity of an item is reduced
the cart expires after 2 minutes of inactivity

On successful checkout, the cart is cleared and the reserved stock is treated as purchased.

## Discount logic
The backend currently supports one discount code:

SAVE10 — gives 10% off
the discount is only valid when the cart subtotal is at least £100

Discount codes are validated in the backend before being applied to the cart.

## API structure

The backend is organised into separate modules/services for:

products
cart
discount

This keeps the product catalogue, cart logic, and discount rules separated and easier to maintain.


## Running backend tests

```bash
cd backend
npm run test
```

The backend test suite currently focuses on the cart service and covers key business logic such as:

cart creation
getting a cart by id
adding items to a cart
updating item quantities
removing items from a cart
applying a discount code
successful checkout
checkout failure for empty carts
cart expiry after inactivity
restoring reserved stock when a cart expires

<h1>Frontend (React Native + TypeScript)</h1> 

The frontend is a React Native application built with Expo. It provides a simple shopping experience where users can browse products, manage a cart, and complete checkout.

The app communicates with the NestJS BFF API and reflects real-time stock changes and cart behaviour.

## How to Run the App
```bash
cd mobile
npm install
npm start
```

Then run on:
```bash
iOS simulator (i)
Android emulator (a)
or web (w)
```
Make sure the backend is running locally and the API base URL is correctly configured.

## Features Implemented

## Product Listing

Displays all products with:
<ul>
    <li>name</li>
    <li>price</li>
    <li>category</li>
    <li>stock availability</li>
</ul> 
Users can:
<ul>
    <li>navigate to product detail</li> 
    <li>select quantity</li> 
    <li>add items to cart</li>
</ul>
   

## Product Detail 

Shows full product information:
<ul>
    <li>image</li>
    <li>description</li>
    <li>price</li>
    <li>stock</li>
    <li>Quantity selector with stock limit</li>
    <li>Add to cart functionality with success feedback </li>
</ul>

## Categories (Additional Feature)
Users can browse products by category
Improves navigation and product discovery
Not required but added to enhance UX

## Cart

Displays:
<ul>
    <li>cart items</li>
    <li>quantities </li>
    <li>subtotal/ discount / total</li>
</ul>

Users can:
<ul>
    <li>increase/decrease quantity</li>
    <li>remove items</li>
    <li>apply discount codes</li>
    <li>checkout</li>
</ul>
    

## Checkout 

Calls backend checkout endpoint
On success:
<ul>
    <li>navigates to Order Summary</li>
    <li>clears cart</li>
</ul>

On failure:
<ul>
    <li>shows clear error message (e.g. insufficient stock)</li>
</ul>

## Order Summary 

Displays:
<ul>
    <li>purchased items</li>
    <li>line totals</li>
</ul>
subtotal / discount / total
Handles empty state safely

## Cart & Session Handling
A cart session is created automatically when needed
Cart ID is stored in a global context
If the backend returns a session expiration:
<ul>
    <li>cart is cleared</li>
    <li>user sees a clear message</li>
</ul>
This aligns with the 2-minute cart expiration requirement

## State Management
The app uses a React Context (CartContext) for global state:

cartId → active cart session</br>
lastOrder → used for order summary</br>
helper methods:
<ul>
    <li>setCartId</li>
    <li>clearCart</li>
    <li>setLastOrder</li>
</ul>
    

Local component state is used for UI concerns such as:
<ul>
    <li>loading states</li>
    <li>error messages </li>
    <li>quantity selection </li>
</ul>

This keeps global state minimal and avoids unnecessary complexity.

## API Layer

A small API layer abstracts all backend communication:
<ul>
    <li>cart.ts</li>
    <li>create cart</li>
    <li>add/update/remove items</li>
    <li>apply discount</li>
    <li>checkout</li>
    <li>products.ts</li>
    <li>fetch products</li>
    <li>fetch product by ID</li>
</ul>

All API calls:
<ul>
    <li>handle errors consistently</li>
    <li>return typed responses</li>
    <li>surface meaningful error messages to the UI</li>
</ul>


## Error Handling

The app provides clear user feedback:
<ul>
    <li>Full-page states</li>
    <li>loading</li>
    <li>initial load errors</li>
    <li>Inline messages</li>
    <li>stock issues</li>
    <li>expired sessions</li>
    <li>API failures</li>
</ul>
This ensures users are never left with blank screens or unclear states

## UX Decisions

Some improvements were added to enhance usability:

Inline error messages instead of replacing entire screens
Quantity controls respect stock limits
Success feedback when adding to cart
Category browsing for easier navigation
Safe fallback states for missing data

## Testing

A meaningful test suite was implemented.

## Tested Areas
Context
<ul>
    <li>CartContext</li>
            <li>state updates</li>
            <li>clearing cart</li>
            <li>provider usage guard</li>
</ul>

API Layer
<ul>
    <li>cart.ts</li>
    <li>products.ts</li>
            <li>request behaviour</li>
            <li>error handling</li>
            <li>response parsing</li>
</ul>

Components
<ul>
    <li>ProductCard</li>
    <li>rendering product data</li>
    <li>quantity controls</li>
    <li>navigation</li>
    <li>add to cart behaviour</li>
    
</ul>

Screens
<ul>
    <li>OrderSummary</li>
    <li>rendering order data</li>
    <li>empty state</li>
    <li>totals display</li>
    
</ul>


## How to Run Test
```bash
npm test
```
