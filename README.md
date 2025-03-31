# Binance Trading Bot

A Binance trading bot built with Node.js, Express, and TypeScript. This bot allows you to automate trading strategies, fetch market data, and place orders on Binance.

## Features

- Fetch real-time market data using Binance WebSocket.
- Calculate technical indicators like RSI.
- Place market and limit orders.
- Manage open orders and positions.
- Modular and extensible architecture.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- A Binance account with API keys

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/2025-bot-binance.git
   cd 2025-bot-binance


   src/
   ├── api/
   │   ├── config.ts         # Configuration and signature generation
   │   ├── order.ts          # Order-related API functions
   │   └── rsi.ts            # RSI calculation logic
   ├── auto-trade/
   │   └── strategy1.ts      # Example trading strategy
   ├── binance-helper/
   │   └── stream.ts         # WebSocket for real-time data
   ├── router/
   │   ├── account.ts        # Account-related routes
   │   └── order.ts          # Order-related routes
   ├── index.ts              # Main entry point
   ```
