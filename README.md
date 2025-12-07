# Step Jalankan Project Express.js Backend
## 1. Jalankan MongoDB dengan Docker

### Jika belum punya MongoDB, jalankan container Docker:

docker compose up -d

MongoDB akan tersedia di mongodb://localhost:27017.

### Rename file .env.local ke .env

## 1a. Tersedia backup mongodump di folder backup/mydb

## 2. Install Dependencies
npm install

## 3. Jalankan Seeder (opsional, untuk data awal)
npm run seed


Seeder ini akan menambahkan data awal untuk artikel, project, dan user admin.

## 4. Jalankan Development Server
npm run dev


# Server akan berjalan di:

http://localhost:5000

# Tentang Backend

Backend ini digunakan untuk Admin Panel Website Company Profile dengan fitur:

Authentication untuk login admin

CRUD untuk:

Artikel

Project

Menyediakan API untuk frontend mengelola data website
