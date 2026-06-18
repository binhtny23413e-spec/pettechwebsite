# PetTech Care Center

Website full-stack tiếng Việt cho hệ sinh thái chăm sóc thú cưng công nghệ cao: website giới thiệu, booking nhiều bước, hồ sơ sức khỏe điện tử, QR khẩn cấp, theo dõi lưu trú/camera mô phỏng và dashboard theo 3 vai trò.

## Công nghệ

- Client: React 19, Vite, TypeScript, React Router, Recharts, Lucide
- Server: Node.js, Express 5, TypeScript, REST API, JWT, bcrypt
- Database: SQLite + Prisma ORM

## Cài đặt và chạy

Yêu cầu Node.js 20 trở lên.

```bash
npm run install:all
copy .env.example server\.env
npm --prefix server run db:push
npm run seed
npm run dev
```

Mở `http://localhost:5173`. API chạy tại `http://localhost:4000/api`.

Nếu chạy riêng:

```bash
npm --prefix server run dev
npm --prefix client run dev
```

## Tài khoản demo

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | admin@pettech.vn | 123456 |
| Staff | staff@pettech.vn | 123456 |
| Customer | customer@pettech.vn | 123456 |

## REST API

Các nhóm endpoint: `/api/auth`, `/api/pets`, `/api/health-records`, `/api/bookings`, `/api/payments`, `/api/care-journals`, `/api/hotel-stays`, `/api/memberships`, `/api/admin/analytics` và `/api/articles`.

Camera và thanh toán là mô phỏng đúng phạm vi demo; không thực hiện giao dịch hoặc truyền video thật.
