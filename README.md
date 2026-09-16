# 🛒 Organi - Organic Food E-Commerce & Farm Marketplace

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI_v5-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![PayPal](https://img.shields.io/badge/PayPal_SDK-00457C?style=for-the-badge&logo=paypal&logoColor=white)

> **Organi** là nền tảng thương mại điện tử chuyên cung cấp thực phẩm hữu cơ sạch, kết hợp mô hình chợ nông trại đối tác (**Farm Partner Marketplace**) kết nối trực tiếp các nhà vườn hữu cơ với người tiêu dùng. Dự án được xây dựng toàn diện với kiến trúc Full-Stack MERN hiện đại, tích hợp quản lý trạng thái tập trung với Redux Toolkit, cổng thanh toán trực tuyến PayPal và cổng đối tác nông trại chuyên sâu.

Dự án được phát triển trong học phần **"Đồ án cơ sở kỹ thuật CNTT"** - **Trường Đại học Nguyễn Tất Thành (NTTU)**.

---

## 🌟 Điểm nổi bật & Tính năng chính

Hệ thống hỗ trợ phân quyền người dùng theo 3 vai trò (**Role-based Access Control**): **Khách hàng (Customer)**, **Nông trại đối tác (Farm Partner)**, và **Quản trị viên (Admin)**.

### 1. 🛍️ Dành cho Khách hàng (Customer)
* **Khám phá sản phẩm:** Xem danh mục nông sản sạch, thực phẩm tươi sống; tìm kiếm, phân trang và lọc theo danh mục, mức giá.
* **Chi tiết sản phẩm:** Thông tin xuất xứ, thương hiệu/nông trại cung cấp, số lượng tồn kho thời gian thực và đánh giá của khách hàng.
* **Giỏ hàng thông minh (Smart Cart):** Quản lý trạng thái giỏ hàng qua **Redux Toolkit**, tự động đồng bộ hóa với `LocalStorage` giúp lưu trữ giỏ hàng ngay cả khi tải lại trang.
* **Quy trình thanh toán đa bước (Checkout Pipeline):** Giao diện từng bước tiện lợi: *Địa chỉ giao hàng (Shipping) ➔ Phương thức thanh toán (Payment) ➔ Xác nhận đơn hàng (Place Order)*.
* **Thanh toán linh hoạt:** Hỗ trợ thanh toán tiền mặt khi nhận hàng (**COD**) và thanh toán trực tuyến qua cổng **PayPal SDK** (`@paypal/react-paypal-js`).
* **Theo dõi đơn hàng & Trang cá nhân:** Quản lý lịch sử mua hàng, trạng thái thanh toán, trạng thái giao hàng và cập nhật hồ sơ cá nhân.

### 2. 🌾 Dành cho Nông trại đối tác (Farm Partner Portal)
* **Farm Dashboard chuyên biệt (`/farm/dashboard`):** Giao diện quản lý riêng cho các chủ nông trại, đối tác cung cấp nông sản.
* **Thống kê kinh doanh nông trại:** Theo dõi doanh thu thực tế, số dư khả dụng, tổng lượt bán và sản phẩm đang phân phối.
* **Quản lý sản phẩm nông trại:** Tự do thêm mới nông sản, sửa đổi thông tin, giá bán, số lượng tồn và tải ảnh sản phẩm trực tiếp (Multer).
* **Ví nông trại & Rút tiền doanh thu (Payout Withdrawals):** Yêu cầu rút tiền về tài khoản ngân hàng đã liên kết.
* **Thông báo tự động:** Tự động gửi email thông báo chi tiết qua **Nodemailer** tới Admin khi có yêu cầu thanh toán mới.

### 3. 🛡️ Dành cho Quản trị viên (Admin Portal)
* **Quản lý danh mục sản phẩm (`/admin/productlist`):** Xem, chỉnh sửa, xóa và kiểm soát nguồn gốc sản phẩm trên toàn hệ thống.
* **Quản lý đơn hàng (`/admin/orderlist`):** Theo dõi danh sách đơn hàng toàn sàn, xác nhận trạng thái thanh toán và cập nhật giao hàng thành công.
* **Duyệt yêu cầu rút tiền (`/admin/withdrawals`):** Kiểm tra số dư và xét duyệt (Approve/Reject) lệnh rút tiền của các nông trại đối tác kèm mã đối soát ngân hàng.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### Frontend (Giao diện)
* **Core:** [React 19](https://react.dev/) + [Vite 6](https://vite.dev/) (Build tool siêu tốc với HMR)
* **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & RTK Query
* **Routing:** [React Router DOM v7](https://reactrouter.com/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [DaisyUI v5](https://daisyui.com/)
* **Icons & UI Elements:** [Lucide React](https://lucide.dev/)
* **Payment Integration:** [@paypal/react-paypal-js](https://www.npmjs.com/package/@paypal/react-paypal-js)

### Backend (Máy chủ & Dịch vụ)
* **Runtime:** [Node.js](https://nodejs.org/) (ES Modules)
* **Framework:** [Express.js](https://expressjs.com/) (Tích hợp Vite Dev Server Middleware chạy thống nhất trên một cổng duy nhất)
* **Database:** [MongoDB](https://www.mongodb.com/) & [Mongoose ODM 8](https://mongoosejs.com/)
* **Authentication:** JSON Web Tokens (JWT) & `bcryptjs`
* **File Uploads:** [Multer](https://github.com/expressjs/multer) (Lưu trữ ảnh tải lên tại `/uploads`)
* **Email Service:** [Nodemailer](https://nodemailer.com/) (Gửi thông báo đối soát rút tiền cho Admin)
* **Performance:** [Compression](https://github.com/expressjs/compression) (Gzip compression cho API & static assets)

---

## 📂 Cấu trúc thư mục dự án (Project Structure)

Dự án được tổ chức theo cấu trúc Full-Stack tích hợp (Unified Architecture), giúp việc cài đặt và chạy ứng dụng cực kỳ đơn giản mà không cần mở song song nhiều terminal:

```bash
Organic-Project/
├── server/                         # Mã nguồn Backend (API, Database, Logic)
│   ├── config/                     # Cấu hình kết nối MongoDB (db.js)
│   ├── controllers/                # Bộ điều khiển xử lý logic (User, Product, Order, Farm)
│   ├── data/                       # Dữ liệu mẫu khởi tạo (products.js)
│   ├── middlewares/                # Middleware xác thực (Auth, Farm, Admin) & xử lý lỗi
│   ├── models/                     # Mongoose Schemas (User, Product, Order, FarmWallet, WithdrawalRequest)
│   ├── routes/                     # Định tuyến API (/api/products, /api/users, /api/orders, /api/farm, /api/upload)
│   ├── seeder.js                   # Script nạp/xóa dữ liệu mẫu vào cơ sở dữ liệu
│   └── utils/                      # Tiện ích phát sinh Token (JWT), Email Service
│
├── src/                            # Mã nguồn Frontend (React 19)
│   ├── components/                 # Các component dùng chung (Navbar, Footer, ProtectedRoute, ProductCard...)
│   ├── layouts/                    # Layout hệ thống (MainLayout, AdminLayout)
│   ├── pages/                      # Các trang giao diện (HomePage, ShopPage, ProductDetailPage, CartPage...)
│   ├── slices/                     # Redux Slices & RTK Query API endpoints (cartSlice, authSlice, apiSlice...)
│   ├── store.js                    # Cấu hình Redux Store trung tâm
│   ├── App.jsx                     # Định tuyến ứng dụng (React Router v7)
│   ├── main.jsx                    # Điểm khởi chạy React DOM
│   └── index.css                   # Thiết lập Tailwind CSS & Style toàn cục
│
├── uploads/                        # Thư mục lưu trữ hình ảnh sản phẩm được tải lên
├── .env.example                    # Tệp mẫu cấu hình các biến môi trường
├── package.json                    # Khai báo dependencies và scripts thực thi
├── render.yaml                     # Cấu hình triển khai tự động lên Render Cloud
├── server.js                       # Entry point máy chủ: kết nối Express + Vite Dev Middleware
└── vite.config.js                  # Cấu hình Vite bundler
```

---

## 🚀 Hướng dẫn cài đặt & Chạy dự án

### Điều kiện tiên quyết
* [Node.js](https://nodejs.org/en/) phiên bản **18.x** hoặc cao hơn
* [MongoDB](https://www.mongodb.com/) (chạy cục bộ trên máy hoặc dùng chuỗi kết nối từ MongoDB Atlas)

---

### Bước 1: Sao chép repository
```bash
git clone https://github.com/duywadeptry1/Organic-Project.git
cd Organic-Project
```

### Bước 2: Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

### Bước 3: Cấu hình biến môi trường
Tạo tệp `.env` tại thư mục gốc bằng cách sao chép từ `.env.example`:

```bash
# Trên Windows PowerShell
copy .env.example .env

# Hoặc trên Linux/macOS
cp .env.example .env
```

Mở file `.env` và điền thông tin phù hợp:
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/organi
JWT_SECRET=super_secret_jwt_key_organi_12345
PAYPAL_CLIENT_ID=sb
```
> *(Tùy chọn: Có thể cấu hình thêm `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` nếu muốn nhận email thực tế thay vì Ethereal test mailer).*

### Bước 4: Khởi tạo dữ liệu mẫu (Seed Data)
Để nạp sẵn danh mục sản phẩm, người dùng mẫu, tài khoản đối tác nông trại và quản trị viên:

```bash
npm run data:import
```
> 💡 *Khi cần dọn sạch toàn bộ dữ liệu mẫu trong CSDL, chạy lệnh:* `npm run data:destroy`

### Bước 5: Khởi chạy ứng dụng
Chạy một lệnh duy nhất:

```bash
npm run dev
```

* Ứng dụng sẽ được khởi chạy tại: **http://localhost:3000**
* Cả giao diện Frontend (hỗ trợ Hot Module Replacement - HMR từ Vite) và hệ thống API Backend đều hoạt động đồng bộ trên cổng này.

---

## 👥 Tài khoản mẫu để kiểm thử (Demo Credentials)

Sau khi nạp dữ liệu bằng lệnh `npm run data:import`, bạn có thể đăng nhập bằng các tài khoản mẫu sau:

| Vai trò (Role) | Email | Mật khẩu mặc định | Ghi chú quyền hạn |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@organi.com` | `password123` | Quản lý sản phẩm, duyệt đơn hàng, duyệt rút tiền (`/admin`) |
| **Nông trại (Farm)** | `berryfield@organi.com` | `password123` | Quản lý nông trại BerryField Organic, rút tiền (`/farm/dashboard`) |
| **Nông trại (Farm)** | `greenearth@organi.com` | `password123` | Quản lý nông trại Green Earth Produce (`/farm/dashboard`) |
| **Khách hàng (User)** | `user@organi.com` | `password123` | Mua hàng, thanh toán, quản lý đơn hàng cá nhân |

---

## 📡 Danh sách API Endpoints chính

| Nhóm API | Phương thức | Endpoint | Mô tả | Quyền hạn |
| :--- | :---: | :--- | :--- | :--- |
| **Auth & Users** | `POST` | `/api/users/login` | Đăng nhập hệ thống & nhận JWT | Công khai |
| | `POST` | `/api/users/register` | Đăng ký tài khoản mới | Công khai |
| | `GET` | `/api/users/profile` | Xem thông tin tài khoản hiện tại | Đã đăng nhập |
| | `PUT` | `/api/users/profile` | Cập nhật hồ sơ tài khoản | Đã đăng nhập |
| **Products** | `GET` | `/api/products` | Lấy danh sách sản phẩm (hỗ trợ tìm kiếm, lọc) | Công khai |
| | `GET` | `/api/products/:id` | Xem chi tiết 1 sản phẩm | Công khai |
| | `POST` | `/api/products` | Thêm sản phẩm mới | Farm / Admin |
| | `PUT` | `/api/products/:id` | Cập nhật thông tin sản phẩm | Farm / Admin |
| | `DELETE`| `/api/products/:id` | Xóa sản phẩm | Farm / Admin |
| **Orders** | `POST` | `/api/orders` | Tạo đơn hàng mới | Đã đăng nhập |
| | `GET` | `/api/orders/myorders` | Lấy lịch sử đơn hàng của người dùng | Đã đăng nhập |
| | `GET` | `/api/orders/:id` | Xem chi tiết đơn hàng | Đã đăng nhập |
| | `PUT` | `/api/orders/:id/pay` | Cập nhật đơn hàng thành đã thanh toán (PayPal/COD)| Đã đăng nhập |
| | `GET` | `/api/orders` | Lấy toàn bộ đơn hàng hệ thống | Admin |
| | `PUT` | `/api/orders/:id/deliver`| Cập nhật trạng thái đã giao hàng | Admin |
| **Farm Portal** | `GET` | `/api/farm/dashboard` | Lấy số liệu thống kê & ví của nông trại | Farm |
| | `POST` | `/api/farm/withdrawals`| Tạo yêu cầu rút tiền từ số dư nông trại | Farm |
| | `GET` | `/api/farm/withdrawals`| Xem danh sách tất cả yêu cầu rút tiền | Admin |
| | `PUT` | `/api/farm/withdrawals/:id`| Phê duyệt / Từ chối yêu cầu rút tiền | Admin |
| **Uploads** | `POST` | `/api/upload` | Tải ảnh lên máy chủ (Multer) | Đã đăng nhập |
| **Health** | `GET` | `/api/health` | Kiểm tra trạng thái hoạt động của hệ thống | Công khai |

---

## ☁️ Hướng dẫn Triển khai (Deployment)

Dự án đã được cấu hình sẵn cho việc triển khai trên dịch vụ đám mây [Render](https://render.com/) thông qua tệp `render.yaml`:

1. Đẩy mã nguồn lên kho lưu trữ GitHub của bạn.
2. Đăng nhập vào Render và chọn **New ➔ Blueprint**, sau đó liên kết với kho lưu trữ `Organic-Project`.
3. Điền các giá trị biến môi trường bí mật trên bảng điều khiển Render:
   - `MONGO_URI`: Chuỗi kết nối MongoDB Atlas của bạn.
   - `JWT_SECRET`: Chuỗi khóa bảo mật token.
   - `PAYPAL_CLIENT_ID`: Mã Client ID từ PayPal Developer Dashboard.
4. Lệnh Build và Start tự động:
   - **Build Command:** `npm install --include=dev && npm run build`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`

---

## 👨‍💻 Thông tin tác giả & Lời cảm ơn

* **Tác giả:** Phạm Minh Duy
* **Trường:** Đại học Nguyễn Tất Thành (NTTU)
* **Chuyên ngành:** Công nghệ Thông tin (Information Technology)
* **Kho lưu trữ GitHub:** [duywadeptry1/Organic-Project](https://github.com/duywadeptry1/Organic-Project)
* **Liên hệ:** [Facebook](https://www.facebook.com/Dyneahihi612)

Xin chân thành gửi lời cảm ơn đến quý Thầy/Cô Khoa Công nghệ Thông tin - Trường Đại học Nguyễn Tất Thành đã hướng dẫn và hỗ trợ em hoàn thành đồ án này!
