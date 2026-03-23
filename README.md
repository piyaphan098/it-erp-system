# IT ERP System

A comprehensive IT Enterprise Resource Planning (ERP) web application built to streamline hardware inventory, ticketing, users, and network assets within an organization.

## 🚀 Features

*   **Dashboard Analytics**: Visual reporting charts (Tickets by Status, Assets by Status) using Recharts. Export reports to PDF, Excel, and CSV formats.
*   **Inventory Management**: Track IT hardware, manage stock levels (In/Out), categorize assets (Switch, Printers, Computers), and generate transaction logs.
*   **IP & Network Asset Management**: Map device IP addresses, MAC addresses, operating systems, and linked physical locations.
*   **Helpdesk Ticketing System**: Allow users to open IT support tickets, track resolutions, and assign technicians.
*   **Network Scanning Tool**: Uses `node-nmap` to discover active devices and open ports on the local network (requires self-hosted Linux/Windows server with `nmap` installed).
*   **Role-Based Access Control**: Different permission levels for Administrators, IT Support, and regular Users.
*   **Authentication**: Built-in login and registration system via NextAuth.

## 🛠️ Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Database**: MariaDB / MySQL
*   **ORM**: Prisma
*   **Icons**: Lucide React
*   **Authentication**: NextAuth.js
*   **Data Visualization**: Recharts

## 📦 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [MariaDB](https://mariadb.org/) or [MySQL](https://www.mysql.com/)
*   [Nmap](https://nmap.org/) (Only required if you want to use the Network Scan feature locally)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/piyaphan098/it-erp-system.git
    cd nextjs-erpit
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add the following configuration:
    ```env
    # Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
    DATABASE_URL="mysql://root@127.0.0.1:3306/Erpit_db?connection_limit=20&connect_timeout=60"
    
    # Next Auth Variables
    NEXTAUTH_SECRET="your_secure_random_string_here"
    NEXTAUTH_URL="http://localhost:3000"
    
    # Prisma Engine
    PRISMA_CLIENT_ENGINE_TYPE="library"
    ```

4.  **Database Setup:**
    
    **Option A: Import Existing Data (Recommended)**
    Import the provided `erpit_db.sql` file into your MariaDB/MySQL server to restore the database structure and sample data.
    
    **Option B: Generate from Prisma**
    If you want a fresh database without sample data, push the Prisma schema:
    ```bash
    npx prisma db push
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

6.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ⚠️ Important Note on Deployment (Vercel)

If deploying to serverless platforms like **Vercel**, the **Network Scan feature (`app/api/scan-network/route.ts`) will not work** because serverless environments do not have `nmap` installed and cannot scan your local organization's network. 

To utilize the network scanning functionality, this application must be hosted on a dedicated Linux VPS, remote Windows Server, or local Docker container where the `nmap` package can be installed at the operating system level.
