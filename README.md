# Deployment Link

https://milestone-4-dzikriyadi-production.up.railway.app/docs

# RevoBank API

REST API perbankan sederhana yang dibangun dengan `NestJS`, `Prisma`, dan `PostgreSQL` untuk kebutuhan milestone back-end development.

## Fitur

- Auth register dan login dengan `JWT`
- Hash password menggunakan `bcrypt`
- Protected route dengan `passport-jwt` dan `JwtAuthGuard`
- User profile endpoint
- CRUD bank account milik user yang login
- Deposit, withdraw, transfer, dan riwayat transaksi
- Swagger UI di `/docs`
- Unit test dan e2e test dengan `Jest`

## Tech Stack

- NestJS
- Prisma ORM
- PostgreSQL
- JWT + Passport
- bcrypt
- Swagger
- Jest

## Endpoint Utama

### Auth

- `POST /auth/register`
- `POST /auth/login`

### User

- `GET /user/profile`
- `PATCH /user/profile`

### Accounts

- `POST /accounts`
- `GET /accounts`
- `GET /accounts/:id`
- `PATCH /accounts/:id`
- `DELETE /accounts/:id`

### Transactions

- `POST /transactions/deposit`
- `POST /transactions/withdraw`
- `POST /transactions/transfer`
- `GET /transactions`
- `GET /transactions/:id`

## Menjalankan Secara Lokal

1. Install dependency

```bash
npm install
```

2. Copy environment file

```bash
cp .env.example .env
```

3. Isi `DATABASE_URL`, `JWT_SECRET`, dan env lain yang dibutuhkan.

4. Jalankan migration Prisma

```bash
npx prisma migrate dev
```

5. Jalankan server

```bash
npm run start:dev
```

API akan berjalan di `http://localhost:3000` dan Swagger UI tersedia di `http://localhost:3000/docs`.

## Script Penting

```bash
npm run build
npm run test
npm run test:e2e
```

## Environment Variables

Contoh ada di file `.env.example`:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`

## Deployment Notes

Untuk deploy sesuai requirement milestone:

- Database: buat project PostgreSQL di Supabase, lalu copy connection string ke `DATABASE_URL`
- Backend: deploy repo ini ke Railway
- Tambahkan env di Railway:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `PORT`
- Jalankan migration di environment deployment sebelum API dipakai

## Testing Status

Project saat ini sudah lolos:

- `npm run build`
- `npm run test`
- `npm run test:e2e`
