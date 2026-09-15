# Couplapp 👥 :)

A small hobby full-stack networking platform designed for families and close friends to connect, share media, and communicate in real time,
without overloading and unhealthy feed-algorithms.

Live Demo: [couplapp.sebastianboczek.com](https://couplapp.sebastianboczek.com)

---

## Key Features & Architecture

* **Advanced Authentication & Security**
  * Robust authentication flow using **JWT (JSON Web Tokens)** alongside secure **Refresh Tokens** for persistent, safe sessions.
  * Secure email verification and registration guardrails.
* **Dynamic Profile Management**
  * Multi-profile creation and seamless account switching within a single user session.
  * Friend relation management and public post timelines.
* **Real-Time Capabilities**
  * Instant messaging and direct peer chats powered by **WebSockets (Socket.io)**.
  * System-wide live notifications for events, reactions, and interactions.
* **Cloud Infrastructure & Media Handling**
  * High-performance media uploads integrated directly with **Cloudflare R2** object storage.

---

## Tech Stack

* **Base:** Turborepo, pnpm
* **Frontend:** React, Vite, Tailwindcss
* **Backend:** Node.js, NestJS, TypeScript
* **Real-time:** NestJS WebSockets Gateways, Socket.io
* **Storage & Infrastructure:** Cloudflare R2 (Object Storage), PostgresDB, Docker
* **Deployment:** Automated Deployments to Vercel and a VPS over Github Workflows

---

## Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com
   cd couplapp
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up your environment variables:
   Clone the `.env.example` file in the root directories of the apps and populate it.

4. Start the development servers:
   ```bash
   pnpm run dev
   ```
