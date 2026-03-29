
## Backend Setup

This backend is implemented using NestJS as a Backend for Frontend (BFF) to support the mobile shopping application.

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

## Frontend (React Native + TypeScript)
## Overview

The frontend is a React Native application built with Expo. It provides a simple shopping experience where users can browse products, manage a cart, and complete checkout.

The app communicates with the NestJS BFF API and reflects real-time stock changes and cart behaviour.

## How to Run the App
cd mobile
npm install
npm start

Then run on:

iOS simulator (i)
Android emulator (a)
or web (w)

Make sure the backend is running locally and the API base URL is correctly configured.

## Features Implemented

## Product Listing

Displays all products with:
    name
    price
    category
    stock availability

Users can:
    navigate to product detail
    select quantity 
    add items to cart

## Product Detail 

Shows full product information:
    -image
    -description
    -price
    -stock
    -Quantity selector with stock limit
    -Add to cart functionality with success feedback 

## Categories (Additional Feature)
Users can browse products by category
Improves navigation and product discovery
Not required but added to enhance UX

## Cart

Displays:
    -cart items
    -quantities
    -subtotal / discount / total
Users can:
    -increase/decrease quantity
    -remove items
    -apply discount codes
    -checkout

## Checkout 

Calls backend checkout endpoint
On success:
    -navigates to Order Summary
    -clears cart
On failure:
    -shows clear error message (e.g. insufficient stock)

## Order Summary 

Displays:
    -purchased items
    -line totals
subtotal / discount / total
Handles empty state safely

## Cart & Session Handling
A cart session is created automatically when needed
Cart ID is stored in a global context
If the backend returns a session expiration:
    -cart is cleared
    -user sees a clear message
This aligns with the 2-minute cart expiration requirement

## State Management
The app uses a React Context (CartContext) for global state:

cartId → active cart session
lastOrder → used for order summary
helper methods:
    -setCartId
    -clearCart
    -setLastOrder

Local component state is used for UI concerns such as:
    -loading states
    -error messages
    -quantity selection

This keeps global state minimal and avoids unnecessary complexity.

## API Layer

A small API layer abstracts all backend communication:

cart.ts
create cart
add/update/remove items
apply discount
checkout
products.ts
fetch products
fetch product by ID

All API calls:
handle errors consistently
return typed responses
surface meaningful error messages to the UI



## Error Handling

The app provides clear user feedback:

Full-page states:
loading
initial load errors
Inline messages:
stock issues
expired sessions
API failures

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
        CartContext
            -state updates
            -clearing cart
            -provider usage guard

API Layer
cart.ts
products.ts
    -request behaviour
    -error handling
    -response parsing

Components
    ProductCard
        -rendering product data
        -quantity controls
        -navigation
        -add to cart behaviour

Screens
    OrderSummary
        -rendering order data
        -empty state
        -totals display

## How to Run Test
npm test