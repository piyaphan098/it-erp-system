# IT ERP System 🖥️

A full-featured IT Enterprise Resource Planning system built with **Next.js 16**, **Supabase (PostgreSQL)**, and deployed on **AWS EC2**.

ระบบ ERP สำหรับฝ่าย IT สร้างด้วย **Next.js 16**, **Supabase (PostgreSQL)** และ Deploy บน **AWS EC2**

---

## 🌐 Live Demo

**URL:** http://54.251.70.16:3000  
**GitHub:** https://github.com/piyaphan098/it-erp-system

---

## 🏗️ Architecture | สถาปัตยกรรมระบบ

```
┌─────────────────────────────────────────────────────────┐
│                        Internet                          │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP :3000
                      ▼
┌─────────────────────────────────────────────────────────┐
│              AWS EC2 (ap-southeast-1)                    │
│              t3.micro | Amazon Linux 2023                │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              PM2 Process Manager                  │   │
│  │                                                    │   │
│  │   ┌──────────────────────────────────────────┐   │   │
│  │   │         Next.js 16 Application            │   │   │
│  │   │                                            │   │   │
│  │   │  ┌──────────┐  ┌──────────┐  ┌────────┐  │   │   │
│  │   │  │  App     │  │   API    │  │ Auth   │  │   │   │
│  │   │  │  Router  │  │  Routes  │  │NextAuth│  │   │   │
│  │   │  └──────────┘  └──────────┘  └────────┘  │   │   │
│  │   │                                            │   │   │
│  │   │  ┌────────────────────────────────────┐   │   │   │
│  │   │  │       Prisma ORM v7                 │   │   │   │
│  │   │  │   @prisma/adapter-pg (PrismaPg)     │   │   │   │
│  │   │  └────────────────────────────────────┘   │   │   │
│  │   └──────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Security Group: Port 3000, 22 open                      │
│  Swap: 2GB | RAM: 1GB                                    │
└─────────────────────────────┬───────────────────────────┘
                              │ SSL/TLS (PostgreSQL)
                              │ Port 5432
                              ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase (ap-southeast-1)                    │
│              Session Pooler                               │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │            PostgreSQL Database                     │   │
│  │                                                    │   │
│  │  Tables: user, asset, ticket, inventory, ...      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Features | ฟีเจอร์

| Feature | Description |
|---------|-------------|
| 🎫 **Ticket Management** | สร้าง/ติดตาม IT Support tickets |
| 💻 **Asset Management** | จัดการ Hardware/Software assets |
| 📦 **Inventory** | ระบบจัดการ Inventory |
| 🌐 **Network Scan** | Scan และ monitor network (IPAM) |
| 📊 **Dashboard** | Overview พร้อม Charts |
| 👥 **User Management** | จัดการ Users และ Roles |
| 🔐 **Authentication** | Login/Register ด้วย NextAuth.js |
| 🌏 **Multi-language** | รองรับ TH / EN |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 16.2.1 (App Router, Turbopack) |
| **Language** | TypeScript 5.9 |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma 7.6.0 + @prisma/adapter-pg |
| **Auth** | NextAuth.js |
| **UI** | Tailwind CSS |
| **Charts** | Recharts / D3 |
| **Cloud** | AWS EC2 (t3.micro, ap-southeast-1) |
| **Process** | PM2 |
| **OS** | Amazon Linux 2023 |

---

## 🚀 Deployment Guide | วิธี Deploy บน AWS EC2

### Prerequisites | สิ่งที่ต้องมีก่อน

- AWS Account + EC2 instance (t3.micro ขึ้นไป)
- Supabase Project
- Node.js v20+
- Git

---

### Step 1: Launch EC2 Instance

```bash
# Instance type: t3.micro (Free Tier)
# AMI: Amazon Linux 2023
# Security Group: open port 22 (SSH), 3000 (App)
```

สร้าง EC2 Instance จาก AWS Console:
- **Region:** ap-southeast-1 (Singapore)
- **AMI:** Amazon Linux 2023
- **Instance type:** t3.micro
- **Security Group:** เปิด port 22, 3000

---

### Step 2: Connect & Setup Server

```bash
# SSH เข้า EC2
ssh -i your-key.pem ec2-user@YOUR_EC2_IP

# ติดตั้ง Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs git

# เพิ่ม Swap memory (สำคัญมากสำหรับ t3.micro!)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
```

---

### Step 3: Clone Project

```bash
cd /home/ec2-user
git clone https://github.com/piyaphan098/it-erp-system.git
cd YOUR_REPO
npm install
```

---

### Step 4: Setup Supabase

1. สร้าง Project ใน [supabase.com](https://supabase.com)
2. ไปที่ **Settings → Database → Connect**
3. เลือก **Session Pooler** (IPv4 compatible, ฟรี)
4. Copy connection string

> ⚠️ **สำคัญ:** ต้องใช้ username ในรูปแบบ `postgres.[project-ref]`  
> เช่น `postgres.xpriwqhqtdvtnphlaivn`

---

### Step 5: Configure Environment

```bash
nano .env
```

```env
DATABASE_URL="postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-X-ap-southeast-1.pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="YOUR_SECRET_KEY"
NEXTAUTH_URL="http://54.251.70.16:3000"
```

```bash
# สร้าง NEXTAUTH_SECRET
openssl rand -base64 32
```

---

### Step 6: Configure Prisma v7

> Prisma 7 ต้องการ `prisma.config.ts` และ `@prisma/adapter-pg`

```bash
# ติดตั้ง PostgreSQL adapter
npm install @prisma/adapter-pg pg
npm install --save-dev @types/pg
```

สร้าง `prisma.config.ts`:
```typescript
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    url: "postgresql://...",  // hardcode หรือ process.env.DATABASE_URL
  },
});
```

แก้ `lib/db.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL || "your-connection-string"
  });
  return new PrismaClient({ adapter });
};

declare const globalThis: { prismaGlobal?: PrismaClient } & typeof global;
export const db = globalThis.prismaGlobal ?? prismaClientSingleton();
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db;
```

---

### Step 7: Push Database Schema & Build

```bash
# Push schema ไป Supabase
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Build production
npm run build
```

---

### Step 8: Run with PM2

```bash
# ติดตั้ง PM2
sudo npm install -g pm2

# Start app
pm2 start npm --name "erp-system" -- start

# Auto-start เมื่อ reboot
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user
pm2 save
```

---

### Step 9: Verify

```bash
pm2 status
# เปิด browser: http://YOUR_EC2_IP:3000
```

---

## ⚙️ Common Issues | ปัญหาที่พบบ่อย

| ปัญหา | สาเหตุ | วิธีแก้ |
|--------|--------|---------|
| `Tenant or user not found` | Username ผิด format | ใช้ `postgres.[project-ref]` |
| `P1012: url no longer supported` | Prisma v7 API เปลี่ยน | ย้าย url ไป `prisma.config.ts` |
| Build ค้าง / OOM | RAM ไม่พอ | เพิ่ม Swap 2GB |
| `PrismaClient no adapter` | Prisma v7 ต้องการ adapter | ติดตั้ง `@prisma/adapter-pg` |

---

## 📁 Project Structure

```
it-erp-system/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Dashboard pages
│   ├── api/                # API routes
│   ├── login/              # Auth pages
│   └── register/
├── lib/
│   ├── db.ts               # Prisma client
│   └── auth.ts             # NextAuth config
├── prisma/
│   └── schema.prisma       # Database schema
├── prisma.config.ts        # Prisma v7 config
└── .env                    # Environment variables
```

---

## 👤 Author

**Piyaphan098** — Cloud Engineer Portfolio Project

- GitHub: [piyaphan098/it-erp-system](https://github.com/piyaphan098/it-erp-system)
- Deploy: AWS EC2 (t3.micro) — `54.251.70.16`
- Database: Supabase PostgreSQL
- Region: ap-southeast-1 (Singapore)
