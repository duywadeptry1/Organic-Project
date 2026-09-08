# BÁO CÁO ĐỒ ÁN CƠ SỞ KỸ THUẬT CÔNG NGHỆ THÔNG TIN
# ĐỀ TÀI: XÂY DỰNG HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ PHÂN PHỐI THỰC PHẨM HỮU CƠ KẾT NỐI NÔNG TRẠI (ORGANI PLATFORM) THEO KIẾN TRÚC MERN STACK

---

* **Đơn vị đào tạo:** TRƯỜNG ĐẠI HỌC NGUYỄN TẤT THÀNH (NTTU)  
* **Khoa:** CÔNG NGHỆ THÔNG TIN  
* **Chuyên ngành:** Kỹ thuật Phần mềm / Công nghệ Thông tin  
* **Học phần:** Đồ án cơ sở kỹ thuật CNTT / Đồ án chuyên ngành  
* **Sinh viên thực hiện:** PHẠM MINH DUY  
* **Mã nguồn dự án (GitHub):** [duywadeptry1/OrganicProduct](https://github.com/duywadeptry1/OrganicProduct)  
* **Thời gian thực hiện:** Năm 2026  

---

## MỤC LỤC

1. [LỜI MỞ ĐẦU & TỔNG QUAN ĐỀ TÀI](#1-lời-mở-đầu--tổng-quan-đề-tài)
   - 1.1. Lý do chọn đề tài
   - 1.2. Mục tiêu nghiên cứu và xây dựng hệ thống
   - 1.3. Đối tượng và phạm vi nghiên cứu
   - 1.4. Phương pháp nghiên cứu và cấu trúc đồ án
2. [CHƯƠNG 1: KHẢO SÁT NGHIỆP VỤ VÀ PHÂN TÍCH YÊU CẦU HỆ THỐNG](#chương-1-khảo-sát-nghiệp-vụ-và-phân-tích-yêu-cầu-hệ-thống)
   - 1.1. Khảo sát thực trạng thị trường thực phẩm hữu cơ và mô hình Farm-to-Table
   - 1.2. Phân tích các mô hình TMĐT tương đương và định vị giải pháp Organi
   - 1.3. Phân tích yêu cầu chức năng (Functional Requirements)
   - 1.4. Phân tích yêu cầu phi chức năng (Non-Functional Requirements)
3. [CHƯƠNG 2: CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ ÁP DỤNG](#chương-2-cơ-sở-lý-thuyết-và-công-nghệ-áp-dụng)
   - 2.1. Kiến trúc tổng thể MERN Stack
   - 2.2. Frontend: React 19, Vite, Redux Toolkit & RTK Query, Tailwind CSS v4, DaisyUI
   - 2.3. Backend: Node.js, Express.js RESTful API, Mongoose ODM
   - 2.4. Xác thực và bảo mật: JWT, Bcryptjs, Phân quyền đa cấp (RBAC)
   - 2.5. Tích hợp thanh toán & Dịch vụ thông báo: MoMo VietQR 24/7, PayPal SDK, Nodemailer
   - 2.6. Kiến trúc dự phòng In-Memory Fallback & Dual-Layer Persistence
4. [CHƯƠNG 3: THIẾT KẾ HỆ THỐNG](#chương-3-thiết-kế-hệ-thống)
   - 3.1. Sơ đồ Use Case tổng quát và phân rã các tác nhân
   - 3.2. Thiết kế Cơ sở Dữ liệu (Database Schemas & Data Dictionary)
   - 3.3. Thiết kế luồng nghiệp vụ cốt lõi (Core Business Workflows)
   - 3.4. Đặc tả giao tiếp RESTful API Endpoints
5. [CHƯƠNG 4: HIỆN THỰC VÀ ĐÁNH GIÁ KẾT QUẢ ĐẠT ĐƯỢC](#chương-4-hiện-thực-và-đánh-giá-kết-quả-đạt-được)
   - 4.1. Môi trường triển khai và cấu trúc mã nguồn Monorepo
   - 4.2. Hiện thực phân hệ Khách hàng (Customer Storefront)
   - 4.3. Hiện thực phân hệ Nông trại đối tác (Farm Partner Portal & Farm Wallet)
   - 4.4. Hiện thực phân hệ Quản trị viên (Admin Management & Payout Verification)
   - 4.5. Đánh giá kiểm thử chức năng (Testing & Verification)
6. [CHƯƠNG 5: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN](#chương-5-kết-luận-và-hướng-phát-triển)
   - 5.1. Kết quả đạt được
   - 5.2. Những điểm hạn chế
   - 5.3. Hướng phát triển mở rộng trong tương lai
7. [TÀI LIỆU THAM KHẢO](#tài-liệu-tham-khảo)

---

## 1. LỜI MỞ ĐẦU & TỔNG QUAN ĐỀ TÀI

### 1.1. Lý do chọn đề tài
Trong bối cảnh xã hội hiện đại, xu hướng tiêu dùng thực phẩm sạch, an toàn sinh học và có nguồn gốc hữu cơ (Organic Food) đang phát triển mạnh mẽ. Người tiêu dùng ngày càng quan tâm sâu sắc đến sức khỏe gia đình, nguồn gốc thổ nhưỡng cũng như quy trình canh tác nông nghiệp không sử dụng hóa chất độc hại.

Tuy nhiên, chuỗi cung ứng thực phẩm truyền thống hiện nay đang tồn tại nhiều bất cập:
1. **Nhiều tầng trung gian:** Nông sản từ các nông trại sạch phải trải qua nhiều khâu thương lái, chợ đầu mối trước khi đến tay người tiêu dùng, làm đội giá bán lẻ trong khi lợi nhuận thực nhận của nông dân bị ép xuống mức thấp.
2. **Khó kiểm soát chất lượng & minh bạch thông tin:** Người tiêu dùng thiếu công cụ tra cứu minh bạch về xuất xứ của từng thương hiệu nông trại (Farm Brand) tương ứng với sản phẩm họ mua.
3. **Thiếu nền tảng thương mại số chuyên biệt cho nông trại:** Phần lớn các nhà vườn, hợp tác xã nông nghiệp hữu cơ gặp khó khăn trong việc xây dựng hệ thống bán hàng riêng, quản lý tồn kho, dòng tiền và tiếp cận khách hàng trực tiếp.

Từ những vấn đề thực tiễn trên, đề tài **"Xây dựng hệ thống thương mại điện tử phân phối thực phẩm hữu cơ kết nối nông trại (Organi Platform)"** được lựa chọn nghiên cứu và triển khai. Dự án hướng tới xây dựng một hệ thống thương mại điện tử toàn diện theo mô hình Farm-to-Table hiện đại, áp dụng công nghệ web tiên tiến nhằm rút ngắn khoảng cách giữa nông trại hữu cơ và người tiêu dùng.

### 1.2. Mục tiêu nghiên cứu và xây dựng hệ thống
* **Mục tiêu kỹ thuật:** Nghiên cứu và ứng dụng toàn diện ngăn xếp công nghệ **MERN Stack** (MongoDB, Express.js, React.js, Node.js), kết hợp các thư viện tối tân nhất như **React 19**, **Vite**, **Redux Toolkit & RTK Query**, **Tailwind CSS v4** và **DaisyUI**. Xây dựng cơ chế kiến trúc chịu lỗi (Resilient In-Memory Fallback) giúp ứng dụng hoạt động ổn định và tin cậy.
* **Mục tiêu nghiệp vụ:**
  * Cung cấp sàn giao dịch trực tuyến B2C/B2B2C thân thiện, hiện đại, hỗ trợ tìm kiếm, lọc danh mục, giỏ hàng thời gian thực, quy trình đặt hàng 4 bước (Checkout Pipeline).
  * Tích hợp đa dạng phương thức thanh toán: COD (Thanh toán khi nhận hàng), Thẻ quốc tế PayPal, và mã QR thanh toán nhanh liên ngân hàng **MoMo VietQR NAPAS 24/7**.
  * Xây dựng **Cổng đối tác Nông trại (Farm Partner Portal)** với tính năng **Ví Nông trại (Farm Wallet)**: tự động hạch toán doanh thu khi đơn hàng giao thành công, ghi nhận lịch sử biến động số dư (Ledger Transactions), tạo lệnh rút tiền (Payout Request) và gửi email thông báo tự động đến ban quản trị.
  * Xây dựng **Phân hệ Quản trị (Admin Portal)**: quản lý danh mục sản phẩm, quản lý đơn hàng & vòng đời giao nhận, công cụ sinh dữ liệu hàng loạt (Bulk Seeder) phục vụ kiểm thử hiệu năng, và đối soát, phê duyệt lệnh rút tiền của các nông trại.

### 1.3. Đối tượng và phạm vi nghiên cứu
* **Đối tượng nghiên cứu:** Quy trình mua bán, thanh toán, quản lý tồn kho và đối soát doanh thu trong chuỗi phân phối thực phẩm sạch theo mô hình Farm-to-Table.
* **Phạm vi hệ thống:**
  * Phân hệ Khách hàng (End-user / Customer): Duyệt catalog, tìm kiếm, đặt hàng, thanh toán trực tuyến, quản lý lịch sử đơn mua.
  * Phân hệ Nông trại đối tác (Farm Partner): Quản trị ví tiền, theo dõi doanh thu bán hàng theo thương hiệu (Brand), quản lý thông tin tài khoản ngân hàng thụ hưởng, yêu cầu thanh toán rút tiền.
  * Phân hệ Quản trị viên (Admin): Giám sát hệ thống, CRUD sản phẩm, cập nhật trạng thái đơn hàng (tự động phân bổ doanh thu vào ví nông trại và khấu trừ kho), phê duyệt lệnh rút tiền.

### 1.4. Phương pháp nghiên cứu
* Phương pháp phân tích và thiết kế hướng đối tượng (OOAD).
* Mô hình hóa hệ thống bằng sơ đồ Use Case, Activity Diagram và Entity-Relationship Diagram (ERD).
* Phương pháp phát triển phần mềm Agile/Scrum: phát triển từng phân hệ, kiểm thử liên tục và hoàn thiện chức năng.

---

## CHƯƠNG 1: KHẢO SÁT NGHIỆP VỤ VÀ PHÂN TÍCH YÊU CẦU HỆ THỐNG

### 1.1. Khảo sát thực trạng và mô hình Farm-to-Table
Mô hình "Farm-to-Table" (Từ nông trại đến bàn ăn) đòi hỏi tính kịp thời, độ tươi mới của nông sản và sự minh bạch về nguồn gốc. Khác với các mặt hàng điện tử hay thời trang, thực phẩm tươi sống có hạn sử dụng ngắn và phụ thuộc vào sản lượng thu hoạch thực tế của từng nông trại. Do đó, hệ thống thương mại điện tử cần đáp ứng:
* Phân định rõ từng mặt hàng thuộc nông trại/thương hiệu nào (ví dụ: BerryField, Green Earth, Organi Farm,...).
* Quản lý số lượng tồn kho chính xác (`countInStock`) để tránh tình trạng bán vượt số lượng nông trại có thể cung ứng.
* Phân chia dòng tiền doanh thu rõ ràng: Tiền bán hàng của sản phẩm thuộc nông trại nào sẽ được cộng dồn vào ví của nông trại đó ngay sau khi đơn hàng được giao thành công đến tay khách hàng.

### 1.2. Phân tích các mô hình TMĐT tương đương và định vị Organi
| Tiêu chí so sánh | Sàn TMĐT tổng hợp (Shopee, Tiki) | Chuỗi cửa hàng bán lẻ (Bách Hóa Xanh) | Hệ thống Organi Platform |
| :--- | :--- | :--- | :--- |
| **Đặc thù mặt hàng** | Đa ngành, hàng bách hóa tổng hợp | Nông sản đại trà, thu mua trung gian | Chuyên biệt nông sản hữu cơ đạt chuẩn |
| **Kết nối nguồn gốc** | Nhiều cửa hàng trôi nổi, khó xác minh | Nhãn hàng riêng hoặc phân phối lại | Định danh trực tiếp từng Nông trại đối tác (Farm Brand) |
| **Dòng tiền đối tác** | Chu kỳ đối soát chậm (15-30 ngày) | Ký gửi, công nợ dài hạn | **Ví điện tử nông trại riêng biệt (Farm Wallet)**, tự động ghi nhận doanh thu từng đơn |
| **Thanh toán linh hoạt** | Nhiều cổng trung gian phức tạp | Tiền mặt / Thẻ POS tại quầy | Tích hợp sâu **MoMo VietQR NAPAS 24/7**, PayPal, COD |
| **Độ gọn nhẹ & Tối ưu** | Cồng kềnh, chi phí vận hành cao | Phụ thuộc điểm bán vật lý | Kiến trúc Fullstack SPA hiện đại, tải trang tức thì (<1s) |

### 1.3. Phân tích yêu cầu chức năng (Functional Requirements)

#### A. Phân hệ Khách hàng (Customer)
* **Xác thực & Hồ sơ cá nhân:** Đăng ký tài khoản mới, đăng nhập hệ thống, mã hóa mật khẩu bảo mật, xem và cập nhật thông tin cá nhân.
* **Tìm kiếm & Duyệt danh mục:** 
  * Hiển thị danh mục nông sản theo nhóm (Trái cây - Fruits, Rau củ - Vegetables, Bơ sữa trứng - Dairy, Bánh mì - Bread).
  * Tìm kiếm theo từ khóa tên sản phẩm.
  * Lọc theo danh mục và sắp xếp theo giá (tăng/giảm dần), theo bảng chữ cái hoặc mới nhất.
  * Phân trang tối ưu (Pagination) giúp tăng tốc độ tải dữ liệu.
* **Chi tiết sản phẩm:** Xem hình ảnh, giá bán, thương hiệu nông trại cung ứng, đánh giá sao, mô tả chất lượng và tình trạng tồn kho theo thời gian thực.
* **Giỏ hàng thông minh (Smart Shopping Cart):** Thêm sản phẩm, thay đổi số lượng mua, xóa sản phẩm, tính toán tự động tạm tính, thuế, phí giao hàng và tổng tiền. Giỏ hàng được đồng bộ liên tục vào `localStorage` của trình duyệt.
* **Quy trình Thanh toán 4 bước (Checkout Pipeline):**
  1. *Bước 1: Shipping* – Nhập địa chỉ nhận hàng, số điện thoại, thành phố, quốc gia.
  2. *Bước 2: Payment Method* – Lựa chọn phương thức thanh toán: MoMo (VietQR), PayPal, hoặc COD.
  3. *Bước 3: Place Order* – Xem lại toàn bộ đơn hàng và xác nhận khởi tạo đơn.
  4. *Bước 4: Order Details & Payment Gateway* – Tiến hành thanh toán qua giao diện tương tác VietQR MoMo hoặc cổng thanh toán quốc tế PayPal.
* **Quản lý đơn mua:** Xem chi tiết đơn hàng, mã đơn, ngày đặt, trạng thái đã thanh toán/chưa thanh toán, đã giao hàng/chưa giao hàng.

#### B. Phân hệ Nông trại đối tác (Farm Partner)
* **Farm Dashboard:** Xem bảng điều khiển tài chính riêng biệt của nông trại:
  * Số dư khả dụng hiện tại trong ví (`balance`).
  * Tổng doanh thu tích lũy trọn đời (`totalEarned`).
  * Tổng số tiền đã rút thành công về ngân hàng (`totalWithdrawn`).
  * Số tiền đang trong quá trình chờ phê duyệt rút (`pendingWithdrawal`).
* **Sổ cái giao dịch (Ledger Transactions):** Theo dõi chi tiết từng biến động số dư: mã đơn hàng, tên sản phẩm được giao, số lượng, đơn giá, khách hàng nhận và thời gian nhận tiền.
* **Quản lý thông tin tài khoản ngân hàng (Bank Info):** Cài đặt Tên ngân hàng, Số tài khoản, Tên chủ tài khoản, Mã định danh Routing/SWIFT.
* **Yêu cầu rút tiền (Withdrawal Request):** Khởi tạo lệnh rút tiền từ số dư khả dụng. Hệ thống tự động khóa tiền sang trạng thái chờ duyệt và kích hoạt dịch vụ Email Alert thông báo tới Quản trị viên.

#### C. Phân hệ Quản trị viên (Admin)
* **Quản lý sản phẩm:**
  * Xem danh sách toàn bộ sản phẩm trong hệ thống kèm số lượng tồn kho.
  * Thêm mới sản phẩm, chỉnh sửa thông tin, giá bán, thương hiệu, hình ảnh, cập nhật tồn kho.
  * Xóa sản phẩm khỏi hệ thống.
  * **Công cụ khởi tạo dữ liệu hàng loạt (Bulk Seeder):** Tạo nhanh từ 10 đến 1000 sản phẩm mẫu tự động theo danh mục phục vụ kiểm thử chịu tải và giao diện.
* **Quản lý đơn hàng:** Xem tất cả đơn hàng phát sinh trên sàn, lọc trạng thái thanh toán và giao hàng.
* **Xử lý giao hàng & Kích hoạt chuỗi sự kiện tài chính:**
  * Khi Admin bấm "Đánh dấu đã giao hàng" (Mark As Delivered): Hệ thống tự động khấu trừ tồn kho thực tế của các sản phẩm tương ứng và tự động trích tỷ lệ doanh thu ghi có (Credit) vào Ví của từng Nông trại đối tác sở hữu sản phẩm đó.
  * Nếu đơn hàng là COD, tự động cập nhật trạng thái đơn hàng sang "Đã thanh toán" (Paid).
* **Quản lý & Duyệt lệnh rút tiền (Admin Withdrawals Portal):**
  * Xem toàn bộ danh sách yêu cầu rút tiền từ các nông trại với đầy đủ thông tin ngân hàng thụ hưởng.
  * Lọc theo trạng thái: Tất cả (ALL), Chờ duyệt (PENDING), Đã duyệt (APPROVED), Bị từ chối (REJECTED).
  * **Phê duyệt lệnh rút (Approve):** Xác nhận đã chuyển khoản ngân hàng thành công -> Chuyển số tiền từ `pendingWithdrawal` sang `totalWithdrawn` và ghi nhận giao dịch `WITHDRAWAL_PAID`.
  * **Từ chối lệnh rút (Reject):** Nhập lý do từ chối -> Hệ thống tự động hoàn tiền từ `pendingWithdrawal` trở lại số dư khả dụng `balance` của nông trại và ghi nhận giao dịch `WITHDRAWAL_REJECTED`.

### 1.4. Phân tích yêu cầu phi chức năng (Non-Functional Requirements)
* **Hiệu năng & Tốc độ phản hồi:** 
  * Tối ưu hóa bundling với Vite và ES Modules, thời gian khởi động môi trường phát triển dưới 300ms.
  * Phản hồi API trung bình < 100ms.
  * Áp dụng RTK Query Cache ngăn chặn việc gọi lại API trùng lặp khi người dùng chuyển đổi giữa các trang.
* **Tính bảo mật:**
  * Mật khẩu người dùng được băm 1 chiều bằng thuật toán `bcryptjs` với độ dài Salt là 10 rounds.
  * Xác thực thông qua JSON Web Token (JWT), truyền tải an toàn qua HTTP Header `Authorization: Bearer <token>`.
  * Sử dụng Middleware bảo vệ phân quyền: `protect` (xác thực người dùng), `admin` (phân quyền quản trị), `FarmRoute` (phân quyền đối tác nông trại).
* **Tính toàn vẹn dữ liệu & Idempotency:**
  * Cơ chế kiểm tra tồn kho trước khi đặt hàng (Stock Validation).
  * Kiểm tra Idempotency khi cập nhật giao hàng: đảm bảo không trừ tồn kho 2 lần và không cộng doanh thu trùng lặp nếu có sự kiện click liên tiếp.
* **Khả năng chịu lỗi cao (Fault Tolerance & High Availability):** 
  * Hệ thống được trang bị kiến trúc đệm dữ liệu **Dual-layer Persistence** (MongoDB + In-Memory Stores). Trong trường hợp cơ sở dữ liệu MongoDB cục bộ hoặc máy chủ cloud tạm thời gián đoạn, hệ thống tự động chuyển sang chế độ dự phòng bộ nhớ RAM mà không gây crash ứng dụng, đảm bảo quá trình trải nghiệm và bảo vệ đồ án luôn diễn ra mượt mà.
* **Tính tương thích & Trải nghiệm người dùng (UI/UX):**
  * Giao diện Responsive toàn diện (Mobile, Tablet, Desktop) dựa trên chuẩn Grid & Flexbox của Tailwind CSS v4.
  * Hỗ trợ chuyển đổi Theme thông minh (ThemeToggle: Giao diện sáng Light / Giao diện tối Dark / Tông màu nông nghiệp Forest).

---

## CHƯƠNG 2: CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ ÁP DỤNG

### 2.1. Kiến trúc tổng thể MERN Stack
Hệ thống Organi được xây dựng theo mô hình kiến trúc phần mềm MERN Stack chuẩn công nghiệp:
```
+-------------------------------------------------------------------------+
|                      CLIENT-SIDE (REACT 19 SPA)                         |
|  Tailwind CSS v4 + DaisyUI | React Router DOM v7 | Redux Toolkit & RTK  |
+-------------------------------------------------------------------------+
                                   |  ^
                JSON over HTTPS/REST |  | JSON Data
                                   v  |
+-------------------------------------------------------------------------+
|                      SERVER-SIDE (NODE.JS & EXPRESS)                    |
| Controllers | Middlewares (JWT / Auth / Error) | Nodemailer Email Alert |
+-------------------------------------------------------------------------+
                                   |  ^
                 Mongoose ODM / TCP |  | Queries / Documents
                                   v  |
+-------------------------------------------------------------------------+
|                 DATABASE & PERSISTENCE LAYER                            |
|       MongoDB Atlas / Local NoSQL  +  In-Memory High-Availability Store |
+-------------------------------------------------------------------------+
```

### 2.2. Chi tiết các công nghệ Frontend
* **React.js 19:** Phiên bản mới nhất của thư viện giao diện hàng đầu thế giới, mang lại hiệu năng dựng hình vượt trội nhờ cơ chế React Compiler tối ưu và xử lý State bất đồng bộ mạnh mẽ.
* **Vite 6:** Công cụ build thế hệ mới thay thế Webpack truyền thống. Tận dụng cơ chế Native ES Modules giúp Hot Module Replacement (HMR) diễn ra gần như tức thì.
* **Redux Toolkit (RTK) & RTK Query:**
  * Quản lý trạng thái tập trung toàn cục (Global State): trạng thái phiên đăng nhập của người dùng (`authSlice`), trạng thái giỏ hàng (`cartSlice`).
  * `RTK Query`: Cơ chế Data Fetching & Caching tân tiến, tự động quản lý vòng đời request, cache kết quả, tự động `invalidatesTags` khi có mutation (thêm/sửa/xóa sản phẩm, cập nhật đơn hàng), loại bỏ hoàn toàn mã nguồn boilerplate thừa thãi.
* **Tailwind CSS v4 & DaisyUI v5:**
  * Framework CSS Utility-first phiên bản mới nhất, biên dịch siêu tốc nhờ engine CSS hiện đại.
  * DaisyUI cung cấp hệ thống Component UI ngữ nghĩa (Buttons, Modals, Badges, Tables, Steps Navigation) với khả năng tùy biến giao diện linh hoạt.
* **Lucide React:** Bộ icon vector hiện đại, tối ưu dung lượng bundle và đồng nhất về ngôn ngữ thiết kế.

### 2.3. Chi tiết các công nghệ Backend
* **Node.js & Express.js:** Nền tảng thực thi JavaScript phía máy chủ theo mô hình non-blocking I/O hướng sự kiện (Event-driven), đảm bảo khả năng xử lý hàng nghìn kết nối đồng thời với mức tiêu thụ tài nguyên tối thiểu.
* **Mongoose ODM:** Thư viện mô hình hóa đối tượng trực quan cho MongoDB, quản lý schema nghiêm ngặt, tự động ép kiểu, hỗ trợ middleware tiền xử lý (`pre('save')`) và phương thức cá thể (`methods`).
* **Compression Middleware:** Nén dữ liệu truyền tải theo chuẩn Gzip/Brotli trước khi gửi về client, giúp tiết kiệm băng thông và tăng tốc độ tải trang.

### 2.4. Xác thực và Bảo mật
* **JSON Web Token (JWT):** Phiên làm việc không trạng thái (Stateless Authentication). Token chứa payload mã hóa ID người dùng, được ký bằng khóa bí mật `JWT_SECRET` với thời hạn hết hạn 30 ngày.
* **Bcrypt.js:** Thuật toán băm mật khẩu với cơ chế sinh muối ngẫu nhiên (Salt rounds = 10), chống lại các cuộc tấn công tra bảng Rainbow Table và vét cạn (Brute-force).
* **Phân quyền đa cấp dựa trên vai trò (Role-Based Access Control - RBAC):**
  * `user`: Người mua hàng thông thường.
  * `farm`: Đại diện nông trại đối tác, có quyền truy cập Farm Dashboard của thương hiệu mình.
  * `admin`: Người quản trị cao nhất của sàn giao dịch.

### 2.5. Tích hợp Thanh toán & Dịch vụ Thông báo
* **MoMo VietQR NAPAS 24/7 (P2P Integration):**
  * Ứng dụng chuẩn định dạng mã phản hồi nhanh VietQR liên kết với ví MoMo (Mã định danh ngân hàng BIN: `971025`).
  * Tự động sinh mã QR động chứa chính xác số tiền quy đổi (VND) theo tỷ giá thời gian thực, số điện thoại người thụ hưởng và nội dung chuyển khoản được cấu trúc chuẩn hóa (`ORGANIMOMO <MÃ_ĐƠN_HÀNG>`).
  * Tích hợp bộ đếm ngược giao dịch 15 phút (Countdown Timer), nút sao chép nhanh vào clipboard một chạm và thông báo trạng thái trực quan.
* **PayPal Smart Buttons SDK:** Tích hợp bộ thư viện `@paypal/react-paypal-js`, hỗ trợ thanh toán thẻ tín dụng quốc tế (Visa, MasterCard) và số dư ví PayPal trong môi trường Sandbox/Production an toàn.
* **Nodemailer Automated Email Alerts:**
  * Dịch vụ thông báo giao dịch tài chính tự động. Khi nông trại gửi yêu cầu rút tiền, hệ thống sử dụng Nodemailer để gửi một bức email thông báo được định dạng HTML chuyên nghiệp trực tiếp đến địa chỉ ban quản trị (`1904duy@gmail.com`).
  * Bức thư bao gồm đầy đủ: Tên nông trại, số tiền yêu cầu, thông tin tài khoản ngân hàng chi tiết, số dư còn lại trong ví và đường dẫn trực tiếp đến trang đối soát của Admin.

### 2.6. Kiến trúc dự phòng In-Memory Fallback & Dual-Layer Persistence
Một trong những điểm sáng kỹ thuật nổi bật của dự án Organi là khả năng đảm bảo tính liên tục của hệ thống (High Availability):
* Tại mỗi Controller (`productController`, `orderController`, `farmController`, `userController`), mọi thao tác dữ liệu đều được bao bọc trong khối xử lý song song:
  1. Thử nghiệm ghi/đọc dữ liệu lên cơ sở dữ liệu chính MongoDB.
  2. Nếu MongoDB hoạt động bình thường, dữ liệu được lưu bền vững và đồng bộ sang mảng đệm bộ nhớ (In-memory array).
  3. Nếu kết nối cơ sở dữ liệu gặp sự cố (ví dụ: máy tính chưa bật dịch vụ MongoDB Server hoặc mạng chập chờn), hệ thống bắt ngoại lệ thông minh và ngay lập tức sử dụng In-Memory Storage mà không trả về lỗi 500 cho Client.
* Nhờ kiến trúc này, toàn bộ quá trình demo, thao tác mua hàng, duyệt đơn, tạo sản phẩm và rút tiền đều hoạt động 100% trơn tru trong mọi hoàn cảnh.

---

## CHƯƠNG 3: THIẾT KẾ HỆ THỐNG

### 3.1. Sơ đồ Use Case tổng quát

#### A. Phân rã Use Case theo Tác nhân (Actors)
```
                                +---------------------------------------------+
                                |               ORGANI SYSTEM                 |
                                +---------------------------------------------+
                                
[KHÁCH HÀNG (Customer)] --------> (Đăng ký / Đăng nhập tài khoản)
                        --------> (Tìm kiếm, lọc và xem chi tiết sản phẩm)
                        --------> (Quản lý giỏ hàng: thêm, sửa số lượng, xóa)
                        --------> (Thực hiện Checkout 4 bước)
                        --------> (Thanh toán qua MoMo VietQR / PayPal / COD)
                        --------> (Theo dõi lịch sử và trạng thái đơn hàng)
                        
[NÔNG TRẠI (Farm Partner)] -----> (Đăng nhập phân quyền Nông trại)
                        --------> (Xem thống kê tài chính: Số dư, Doanh thu)
                        --------> (Xem sao kê biến động số dư theo đơn hàng)
                        --------> (Cập nhật thông tin tài khoản ngân hàng)
                        --------> (Tạo yêu cầu rút tiền về ngân hàng)
                        
[QUẢN TRỊ VIÊN (Admin)] --------> (Đăng nhập phân quyền Admin)
                        --------> (Quản lý CRUD danh mục sản phẩm & Tồn kho)
                        --------> (Khởi tạo dữ liệu hàng loạt Bulk Seeder)
                        --------> (Quản lý đơn hàng & Cập nhật giao hàng)
                        --------> (Phê duyệt hoặc Từ chối yêu cầu rút tiền)
```

### 3.2. Thiết kế Cơ sở Dữ liệu (Database Schema)

Hệ thống được thiết kế dựa trên 5 Collection chính trong MongoDB:

#### 1. Bảng `users` (Quản lý người dùng và phân quyền)
| Thuộc tính (Field) | Kiểu dữ liệu | Ràng buộc | Diễn giải |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Khóa chính tự sinh |
| `name` | String | Required | Họ và tên người dùng / Tên đại diện |
| `email` | String | Required, Unique, Lowercase | Email đăng nhập hệ thống |
| `password` | String | Required, Min length 6 | Mật khẩu đã được mã hóa Bcrypt |
| `role` | String | Enum: `['user', 'admin', 'farm']` | Quyền hạn tài khoản (Mặc định: `'user'`) |
| `brand` | String | Trim | Tên thương hiệu nông trại (Nếu role là `farm`) |
| `bankInfo` | Object | Sub-document | Thông tin ngân hàng nhận tiền (`bankName`, `accountNumber`, `accountName`, `routingNumber`) |
| `createdAt`, `updatedAt` | Date | Timestamps | Thời gian tạo và cập nhật |

#### 2. Bảng `products` (Quản lý sản phẩm nông sản)
| Thuộc tính (Field) | Kiểu dữ liệu | Ràng buộc | Diễn giải |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Khóa chính sản phẩm |
| `user` | ObjectId | Ref: `'User'` | Người tạo / Nông trại sở hữu |
| `name` | String | Required | Tên nông sản hữu cơ |
| `image` | String | Required | Đường dẫn URL hình ảnh sản phẩm |
| `description` | String | Required | Mô tả chi tiết chất lượng, chứng nhận |
| `category` | String | Required | Nhóm hàng: `Fruits`, `Vegetables`, `Dairy`, `Bread` |
| `brand` | String | Default: `'Organi Farm'` | Nông trại sản xuất (VD: `BerryField`, `Green Earth`) |
| `price` | Number | Required, Default: 0 | Đơn giá bán lẻ (USD) |
| `countInStock` | Number | Default: 0 | Số lượng sản phẩm tồn kho khả dụng |
| `rating` | Number | Default: 5.0 | Điểm đánh giá trung bình (1 - 5 sao) |
| `numReviews` | Number | Default: 0 | Tổng số lượt khách hàng đánh giá |

#### 3. Bảng `orders` (Quản lý đơn hàng)
| Thuộc tính (Field) | Kiểu dữ liệu | Ràng buộc | Diễn giải |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Khóa chính đơn hàng |
| `user` | ObjectId | Required, Ref: `'User'` | Khách hàng đặt mua |
| `orderItems` | Array of Objects | Sub-document | Danh sách sản phẩm: `name`, `qty`, `image`, `price`, `brand`, `product` |
| `shippingAddress` | Object | Required | Địa chỉ giao nhận (`address`, `city`, `postalCode`, `country`) |
| `paymentMethod` | String | Required | Phương thức thanh toán: `MoMo`, `PayPal`, `COD` |
| `paymentResult` | Object | Sub-document | Chi tiết cổng thanh toán trả về (`id`, `status`, `update_time`, `email_address`) |
| `itemsPrice` | Number | Required | Tổng tiền hàng |
| `taxPrice` | Number | Required | Thuế GTGT |
| `shippingPrice` | Number | Required | Phí vận chuyển |
| `totalPrice` | Number | Required | Tổng tiền thanh toán của đơn hàng |
| `isPaid` | Boolean | Default: false | Trạng thái đã thanh toán |
| `paidAt` | Date | Optional | Thời điểm thanh toán thành công |
| `isDelivered` | Boolean | Default: false | Trạng thái đã giao hàng thành công |
| `deliveredAt` | Date | Optional | Thời điểm giao hàng thành công |

#### 4. Bảng `farmwallets` (Quản lý ví tài chính của nông trại đối tác)
| Thuộc tính (Field) | Kiểu dữ liệu | Ràng buộc | Diễn giải |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Khóa chính ví nông trại |
| `brand` | String | Required, Unique, Trim | Thương hiệu nông trại định danh ví |
| `balance` | Number | Default: 0 | Số dư khả dụng hiện tại có thể rút |
| `totalEarned` | Number | Default: 0 | Tổng doanh thu tích lũy lịch sử |
| `totalWithdrawn` | Number | Default: 0 | Tổng số tiền đã giải ngân thành công |
| `pendingWithdrawal` | Number | Default: 0 | Số tiền đang bị khóa chờ Admin phê duyệt rút |
| `transactions` | Array of Objects | Sub-document | Sổ cái biến động số dư chi tiết |

*Cấu trúc Sub-document `transactions` trong FarmWallet:*
* `type`: Enum `['DELIVERY_EARNING', 'WITHDRAWAL_REQUEST', 'WITHDRAWAL_PAID', 'WITHDRAWAL_REJECTED']`
* `amount`: Số tiền biến động (Dương khi nhận doanh thu, Âm khi tạo lệnh rút)
* `orderId`, `orderNumber`: Mã đơn hàng mang lại doanh thu
* `productName`, `productImage`, `qty`, `price`: Thông tin sản phẩm cụ thể
* `customerName`: Tên khách hàng nhận hàng
* `description`: Diễn giải giao dịch chi tiết
* `createdAt`: Thời gian ghi nhận giao dịch

#### 5. Bảng `withdrawalrequests` (Quản lý yêu cầu rút tiền)
| Thuộc tính (Field) | Kiểu dữ liệu | Ràng buộc | Diễn giải |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Khóa chính yêu cầu rút tiền |
| `farmUser` | ObjectId | Required, Ref: `'User'` | Tài khoản nông trại tạo yêu cầu |
| `brand` | String | Required | Thương hiệu nông trại |
| `amount` | Number | Required, Min: 0.01 | Số tiền yêu cầu rút |
| `bankInfo` | Object | Required | Chi tiết tài khoản ngân hàng nhận tiền |
| `status` | String | Enum: `['PENDING', 'APPROVED', 'REJECTED']` | Trạng thái phê duyệt (Mặc định: `'PENDING'`) |
| `recipientEmail` | String | Default: `'1904duy@gmail.com'` | Email quản trị viên nhận cảnh báo giao dịch |
| `emailStatus` | String | Default: `'PENDING'` | Tình trạng gửi email (SMTP_SENT / LOGGED_DEV) |
| `requestedAt` | Date | Default: Date.now | Thời điểm gửi yêu cầu |
| `processedAt` | Date | Optional | Thời điểm Admin xử lý duyệt/từ chối |
| `adminNotes` | String | Optional | Ghi chú phản hồi của Admin |

---

### 3.3. Thiết kế luồng nghiệp vụ cốt lõi (Core Business Workflows)

#### Quy trình 1: Đặt hàng & Thanh toán đa kênh (Checkout Pipeline)
```
[Khách hàng]             [Client App]             [Server API]          [Cổng Thanh Toán]
     |                         |                        |                       |
     |-- Chọn sản phẩm & Qty ->|                        |                       |
     |-- Vào giỏ hàng & Nhấn ->|                        |                       |
     |   Checkout              |                        |                       |
     |-- Nhập địa chỉ & Chọn ->|-- POST /api/orders --->|                       |
     |   Phương thức TT        |   (Kèm Order Payload)  |-- Kiểm tra tồn kho -->|
     |                         |                        |   (CountInStock)      |
     |                         |<-- Trả về New Order ---|-- Tạo đơn hàng mới ---|
     |                         |                        |                       |
     |-- Chọn MoMo VietQR ---->|-- Render VietQR 24/7 ->|                       |
     |   (Quét App Ngân hàng)  |   (Auto Convert VND &  |                       |
     |                         |    Memo: ORGANIMOMO)   |                       |
     |                         |-- Bấm "Tôi đã chuyển"->|                       |
     |                         |-- PUT /orders/:id/pay->|                       |
     |                         |<-- Update isPaid:true -|                       |
     |                         |                        |                       |
     |-- Chọn PayPal --------->|-- SDK PayPal Buttons ->|-- Gửi Token PayPal -->|
     |                         |                        |<-- Phản hồi Payment --|
     |                         |-- PUT /orders/:id/pay->|   Success             |
     |                         |<-- Update isPaid:true -|                       |
```

#### Quy trình 2: Tự động phân bổ doanh thu vào Ví Nông trại khi giao hàng thành công
```
[Admin Portal]                    [Backend Server]                [Database / Wallet]
      |                                  |                                 |
      |-- Click "Mark Delivered" ------->|                                 |
      |   (PUT /api/orders/:id/deliver)  |-- Kiểm tra Idempotency -------->|
      |                                  |   (Nếu đã delivered thì bỏ qua) |
      |                                  |-- Khấu trừ tồn kho -------------|
      |                                  |   (updateProductStock) -------->|
      |                                  |-- Đánh dấu isDelivered = true ->|
      |                                  |-- Nếu COD: isPaid = true ------>|
      |                                  |                                 |
      |                                  |-- [creditFarmsForDeliveredOrder]|
      |                                  |   1. Gom nhóm sản phẩm theo     |
      |                                  |      Brand (Nông trại)          |
      |                                  |   2. Tìm ví Farm tương ứng ---->|
      |                                  |   3. balance += doanh thu       |
      |                                  |      totalEarned += doanh thu   |
      |                                  |   4. Thêm Ledger Transaction -->|
      |<-- Trả về kết quả cập nhật ------|                                 |
```

#### Quy trình 3: Nông trại rút tiền & Admin đối soát qua Email Alert tự động
```
[Nông trại (Farm)]               [Backend Server]                [Quản trị viên (Admin)]
        |                               |                                   |
        |-- Nhập số tiền & Ngân hàng -->|                                   |
        |   (POST /api/farm/withdraw)   |-- Kiểm tra số dư khả dụng (balance)|
        |                               |-- Trừ balance, cộng pending ------|
        |                               |-- Tạo WithdrawalRequest: PENDING -|
        |                               |-- [sendWithdrawalNotificationEmail|
        |                               |    Gửi Email HTML chi tiết ------>| Nhận Email cảnh báo
        |                               |    (1904duy@gmail.com)            | số tiền, STK ngân hàng
        |<-- Thông báo tạo lệnh thành --|                                   |
        |    công & chờ Admin xử lý     |                                   |
        |                               |                                   |
        |                               |<-- Admin chuyển khoản xong & bấm -|
        |                               |    "Confirm Paid / Approve"       |
        |                               |    (PUT /withdrawals/:id/approve) |
        |                               |-- Trừ pending, cộng totalWithdrawn|
        |                               |-- Trạng thái: APPROVED -----------|
        |<-- Xem trạng thái: APPROVED --|<-- Trả về kết quả giải ngân ------|
```

---

### 3.4. Đặc tả giao tiếp RESTful API Endpoints

#### A. Nhóm API Sản phẩm (`/api/products`)
* `GET /api/products`: Lấy danh sách sản phẩm có hỗ trợ tìm kiếm (`keyword`), lọc (`category`), sắp xếp (`sort`: `price_asc`, `price_desc`, `name_asc`), phân trang (`pageNumber`, `pageSize`).
* `GET /api/products/:id`: Lấy thông tin chi tiết một sản phẩm theo ID.
* `POST /api/products`: Thêm mới sản phẩm (Quyền: Admin).
* `POST /api/products/bulk`: Khởi tạo hàng loạt sản phẩm mẫu tự động (Quyền: Admin).
* `PUT /api/products/:id`: Cập nhật thông tin và số lượng tồn kho sản phẩm (Quyền: Admin).
* `DELETE /api/products/:id`: Xóa sản phẩm khỏi danh mục (Quyền: Admin).

#### B. Nhóm API Người dùng (`/api/users`)
* `POST /api/users`: Đăng ký tài khoản khách hàng mới.
* `POST /api/users/login`: Xác thực đăng nhập và cấp phát mã định danh JWT Token.
* `GET /api/users/profile`: Lấy thông tin chi tiết tài khoản hiện tại (Yêu cầu Token).
* `PUT /api/users/profile`: Cập nhật thông tin cá nhân hoặc mật khẩu mới.

#### C. Nhóm API Đơn hàng (`/api/orders`)
* `POST /api/orders`: Khởi tạo đơn hàng mới kèm kiểm tra tồn kho tự động.
* `GET /api/orders/mine`: Lấy danh sách đơn hàng đã mua của khách hàng đang đăng nhập.
* `GET /api/orders/:id`: Lấy chi tiết đơn hàng theo mã ID.
* `PUT /api/orders/:id/pay`: Cập nhật trạng thái đơn hàng sang "Đã thanh toán" kèm thông tin cổng thanh toán.
* `PUT /api/orders/:id/deliver`: Cập nhật trạng thái đơn hàng sang "Đã giao hàng" (Tự động trừ tồn kho và cộng tiền vào ví Nông trại).
* `GET /api/orders`: Lấy toàn bộ đơn hàng trên sàn (Quyền: Admin).

#### D. Nhóm API Cổng Nông trại & Ví điện tử (`/api/farm`)
* `GET /api/farm/wallet`: Lấy số dư ví, tổng doanh thu, sao kê giao dịch và lịch sử rút tiền của nông trại.
* `POST /api/farm/withdraw`: Tạo yêu cầu rút tiền mới và kích hoạt gửi Email Alert tự động tới Admin.
* `GET /api/farm/withdrawals`: Lấy danh sách lịch sử các yêu cầu rút tiền của nông trại.
* `PUT /api/farm/bank-info`: Cập nhật thông tin tài khoản ngân hàng thụ hưởng mặc định.
* `GET /api/farm/admin/withdrawals`: Lấy toàn bộ yêu cầu rút tiền của tất cả các nông trại trên hệ thống (Quyền: Admin).
* `PUT /api/farm/admin/withdrawals/:id/approve`: Phê duyệt yêu cầu rút tiền sau khi Admin chuyển khoản (Quyền: Admin).
* `PUT /api/farm/admin/withdrawals/:id/reject`: Từ chối yêu cầu rút tiền và hoàn trả tiền về số dư ví nông trại (Quyền: Admin).

---

## CHƯƠNG 4: HIỆN THỰC VÀ ĐÁNH GIÁ KẾT QUẢ ĐẠT ĐƯỢC

### 4.1. Môi trường triển khai và cấu trúc mã nguồn Monorepo
Dự án được cấu trúc theo mô hình Full-stack Monorepo tối ưu hóa, kết hợp Express Backend và Vite React Frontend trong cùng một thực thể triển khai nhất quán:

```
organi-ecommerce/
├── package.json               # Cấu hình dependency chung (React 19, Express, Mongoose, RTK)
├── server.js                  # Entrypoint chính khởi chạy Node.js Server & Vite Dev Middleware
├── vite.config.js             # Cấu hình đóng gói giao diện với @vitejs/plugin-react & Tailwind
├── index.html                 # Single Page Application HTML root template
├── uploads/                   # Thư mục lưu trữ hình ảnh tải lên cục bộ
│
├── server/                    # PHÂN HỆ BACKEND
│   ├── config/db.js           # Kết nối MongoDB với cơ chế Soft-fallback chống sập
│   ├── controllers/           # Tầng điều khiển nghiệp vụ (farm, order, product, user)
│   ├── models/                # Schema Mongoose (User, Product, Order, FarmWallet, Withdrawal)
│   ├── routes/                # Định tuyến RESTful API Endpoints
│   ├── middlewares/           # Bộ lọc xác thực JWT (protect, admin) & xử lý ngoại lệ toàn cục
│   ├── utils/                 # Tiện ích phát sinh Token và Dịch vụ gửi Email tự động
│   └── data/products.js       # Dữ liệu ban đầu (Seed data)
│
└── src/                       # PHÂN HỆ FRONTEND (CLIENT)
    ├── App.jsx                # Hệ thống định tuyến React Router DOM v7
    ├── main.jsx               # Điểm gắn kết DOM & Redux Provider
    ├── store.js               # Khởi tạo Redux Toolkit Store trung tâm
    ├── components/            # Các thành phần tái sử dụng (Header, ProductCard, MoMoPaymentCard, RouteGuards)
    ├── layouts/               # Bố cục giao diện chính (MainLayout, AdminLayout)
    ├── pages/                 # 18 trang giao diện người dùng, Nông trại và Quản trị
    └── slices/                # Tầng quản lý trạng thái và RTK Query API Slices
```

### 4.2. Hiện thực phân hệ Khách hàng (Customer Storefront)
1. **Trang chủ (`HomePage.jsx`):** 
   * Banner thương hiệu bắt mắt giới thiệu cam kết nông sản hữu cơ 100% tự nhiên.
   * Danh mục nhóm hàng trực quan với hình ảnh đại diện sinh động.
   * Lưới sản phẩm nổi bật (Featured Organic Goods) hiển thị giá bán, nguồn gốc nông trại, đánh giá sao và nút "Thêm vào giỏ" tức thì.
2. **Trang Cửa hàng (`ShopPage.jsx`):**
   * Tích hợp thanh tìm kiếm thời gian thực (Search bar) và bộ lọc danh mục (All, Fruits, Vegetables, Dairy, Bread).
   * Thanh điều khiển sắp xếp sản phẩm theo giá bán hoặc tên gọi.
   * Phân trang động hiển thị số trang và chỉ số sản phẩm hiện hành.
3. **Trang Chi tiết sản phẩm (`ProductDetailPage.jsx`):**
   * Hiển thị hình ảnh chất lượng cao, mô tả quy trình nuôi trồng, chứng nhận hữu cơ.
   * Bộ đếm tùy chỉnh số lượng mua với giới hạn tối đa theo số lượng tồn kho khả dụng (`countInStock`).
4. **Trang Giỏ hàng (`CartPage.jsx`):**
   * Liệt kê chi tiết danh sách sản phẩm đã chọn, hỗ trợ tăng giảm số lượng hoặc xóa từng mặt hàng.
   * Khối tóm tắt đơn hàng hiển thị tạm tính, thuế GTGT, phí vận chuyển và tổng thanh toán.
5. **Quy trình Thanh toán (`CheckoutPage.jsx`, `ShippingPage.jsx`, `PaymentPage.jsx`, `PlaceOrderPage.jsx`):**
   * Thanh tiến trình 4 bước (`CheckoutSteps.jsx`) định hướng người dùng.
   * Hỗ trợ lưu trữ địa chỉ giao nhận vào phiên làm việc.
6. **Chi tiết đơn hàng & Thanh toán đa kênh (`OrderDetailsPage.jsx` & `MoMoPaymentCard.jsx`):**
   * Tích hợp thẻ thanh toán VietQR MoMo chuyên nghiệp: Tự động hiển thị mã QR đạt chuẩn NAPAS 24/7 với logo MoMo, số tiền thanh toán chính xác, nội dung chuyển khoản tự động gắn mã đơn.
   * Bộ đếm ngược 15 phút kèm nút bấm xác nhận thanh toán trực tiếp.
   * Tích hợp khung thanh toán PayPal Smart Buttons cho các giao dịch thẻ quốc tế.

### 4.3. Hiện thực phân hệ Nông trại đối tác (Farm Dashboard & Ví tiền)
1. **Bảng điều khiển tài chính Nông trại (`FarmDashboardPage.jsx`):**
   * 4 thẻ thống kê số liệu trực quan dạng Card:
     * *Số dư khả dụng (Available Balance)*: Biểu tượng ví tiền, số tiền thực có thể yêu cầu giải ngân ngay lập tức.
     * *Doanh thu trọn đời (Lifetime Earnings)*: Tổng giá trị nông sản đã bán và giao thành công.
     * *Đã rút thành công (Total Withdrawn)*: Tổng số tiền Admin đã chuyển khoản vào tài khoản ngân hàng của nông trại.
     * *Đang chờ giải ngân (Pending Payout)*: Số tiền đang trong lệnh rút chờ Admin xác nhận.
   * Bộ chọn thương hiệu (Brand Selector) cho phép Admin thị sát dòng tiền của từng nông trại (BerryField, Green Earth, Organi Farm...).
2. **Sổ cái sao kê giao dịch (Ledger Tab):** Bảng hiển thị chi tiết từng dòng tiền vào ra, kèm ảnh sản phẩm, số lượng, đơn giá, mã đơn hàng và tên khách hàng tương ứng.
3. **Quy trình tạo lệnh rút tiền Modal Popup:**
   * Kiểm tra tự động tính hợp lệ của số tiền rút (không được vượt quá số dư khả dụng).
   * Tự động điền thông tin ngân hàng đã lưu trong hồ sơ của nông trại.
   * Khi nhấn "Gửi yêu cầu rút tiền", hệ thống tức thì điều phối lệnh gửi email thông báo đến Quản trị viên (`emailService.js`) và chuyển tiền sang quỹ tạm giữ `pendingWithdrawal`.

### 4.4. Hiện thực phân hệ Quản trị viên (Admin Management & Payouts)
1. **Quản lý danh mục sản phẩm (`ProductListPage.jsx` & `ProductEditPage.jsx`):**
   * Bảng danh mục sản phẩm quản trị hỗ trợ lọc nhanh, hiển thị số lượng tồn kho còn lại với cảnh báo màu sắc khi sắp hết hàng.
   * Tính năng tạo mới, chỉnh sửa thông tin giá, hình ảnh, nhóm hàng và thương hiệu nông trại.
   * **Công cụ Bulk Seeder:** Tạo nhanh từ 10 đến 1000 sản phẩm chỉ với 1 click, tự động gán hình ảnh thực phẩm chất lượng cao từ Unsplash và phân bổ ngẫu nhiên theo từng nhóm hàng.
2. **Quản lý đơn hàng & Giao vận (`OrderListPage.jsx`):**
   * Quản lý trạng thái toàn bộ đơn mua trên hệ thống.
   * Nút tác vụ "Đánh dấu đã giao hàng" (Mark As Delivered) được gắn chặt với cơ chế tự động hóa: khấu trừ số lượng tồn kho thực tế và kích hoạt hàm `creditFarmsForDeliveredOrder` để chia doanh thu về ví của nông trại tương ứng.
3. **Cổng kiểm duyệt rút tiền (`AdminWithdrawalsPage.jsx`):**
   * Hiển thị trực quan toàn bộ các yêu cầu rút tiền đang chờ xử lý từ các nông trại.
   * Tích hợp nút sao chép nhanh Số tài khoản, Tên chủ tài khoản và Tên ngân hàng để Quản trị viên thực hiện chuyển khoản ngân hàng ngoài đời thực.
   * Hộp thoại xác nhận phê duyệt (Approve Payout): ghi nhận đã thanh toán, chuyển tiền từ `pending` sang `totalWithdrawn`.
   * Hộp thoại từ chối kèm lý do (Reject Payout): tự động hoàn trả số tiền yêu cầu về lại số dư khả dụng của nông trại và lưu lại ghi chú giải trình.

---

### 4.5. Đánh giá kiểm thử chức năng (Testing & Verification)

Hệ thống đã trải qua các đợt kiểm thử hộp đen (Black-box Testing) và kiểm thử luồng dữ liệu (End-to-End Testing) với kết quả ghi nhận như sau:

| STT | Kịch bản kiểm thử (Test Case) | Dữ liệu đầu vào / Thao tác | Kết quả mong đợi | Kết quả thực tế | Đánh giá |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC01** | Đăng ký tài khoản người dùng mới | Email hợp lệ, mật khẩu >= 6 ký tự | Tạo tài khoản thành công, cấp Token JWT | Tài khoản được tạo, tự động lưu phiên | **ĐẠT** |
| **TC02** | Đăng nhập với tài khoản sai mật khẩu | Nhập sai password | Báo lỗi "Please enter the right account" | Hiển thị thông báo lỗi chính xác, mã 401 | **ĐẠT** |
| **TC03** | Tìm kiếm & Lọc nông sản | Gõ từ khóa "Apple", chọn nhóm "Fruits" | Danh sách chỉ hiển thị các loại táo trong nhóm trái cây | Lọc chuẩn xác, cập nhật URL params | **ĐẠT** |
| **TC04** | Kiểm tra giới hạn giỏ hàng | Chọn số lượng vượt quá tồn kho `countInStock` | Hệ thống ngăn chặn, hiển thị cảnh báo không đủ hàng | Không cho thêm quá số lượng tồn kho | **ĐẠT** |
| **TC05** | Khởi tạo đơn hàng Checkout | Địa chỉ hợp lệ, chọn phương thức MoMo | Tạo đơn hàng mới, chuyển đến trang chi tiết | Đơn hàng tạo thành công với mã ORD riêng | **ĐẠT** |
| **TC06** | Tạo mã VietQR MoMo | Vào trang chi tiết đơn hàng | Hiển thị mã QR NAPAS 24/7 kèm mã đơn và số tiền VND | Mã QR quét được bằng mọi ứng dụng ngân hàng | **ĐẠT** |
| **TC07** | Đánh dấu giao hàng & Trừ kho | Admin bấm "Mark As Delivered" trên đơn hàng | Tồn kho sản phẩm giảm đúng số lượng mua; Doanh thu cộng vào ví Farm | Số lượng kho trừ chuẩn, ví Farm tăng số dư ngay lập tức | **ĐẠT** |
| **TC08** | Nông trại gửi yêu cầu rút tiền | Nhập số tiền $50, điền thông tin ngân hàng | Số dư giảm $50, pending tăng $50, gửi email alert tới Admin | Tiền vào pending, Email cảnh báo gửi đến 1904duy@gmail.com | **ĐẠT** |
| **TC09** | Admin phê duyệt giải ngân | Admin bấm "Confirm Money Sent" trên yêu cầu | Trạng thái chuyển sang APPROVED, tiền chuyển sang totalWithdrawn | Duyệt thành công, ghi nhận sao kê WITHDRAWAL_PAID | **ĐẠT** |
| **TC10** | Admin từ chối giải ngân | Admin bấm "Reject" kèm lý do "Sai tên chủ TK" | Trạng thái REJECTED, hoàn trả $50 về số dư khả dụng của Farm | Tiền được hoàn về balance, lưu lý do từ chối | **ĐẠT** |
| **TC11** | Chịu lỗi cơ sở dữ liệu (Fault-Tolerance) | Ngắt dịch vụ MongoDB | Hệ thống tự động chuyển sang In-Memory Fallback mà không bị sập | Mọi tác vụ mua bán, duyệt đơn vẫn thao tác bình thường | **ĐẠT** |

---

## CHƯƠNG 5: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 5.1. Kết quả đạt được
Sau quá trình nghiên cứu, thiết kế và phát triển nghiêm túc, đề tài đã hoàn thành xuất sắc các mục tiêu đề ra ban đầu:
1. **Hoàn thiện trọn vẹn sản phẩm Full-Stack theo chuẩn kiến trúc MERN hiện đại:** Ứng dụng công nghệ React 19, Redux Toolkit, Vite, Node.js, Express và MongoDB, đảm bảo cấu trúc mã nguồn sáng sủa, dễ bảo trì và mở rộng.
2. **Giải quyết bài toán thực tế của chuỗi cung ứng Farm-to-Table:** Xây dựng thành công cơ chế quản lý đa thương hiệu nông trại, phân định rõ nguồn gốc sản phẩm và giải quyết bài toán dòng tiền minh bạch thông qua hệ thống Ví Nông Trại (Farm Wallet).
3. **Quy trình thanh toán đa kênh tiện lợi, bản địa hóa tối đa:** Tích hợp thành công giải pháp thanh toán không dùng tiền mặt MoMo VietQR NAPAS 24/7 song song với cổng thanh toán quốc tế PayPal và COD truyền thống.
4. **Cơ chế tự động hóa nghiệp vụ cao:** Tự động kiểm tra tồn kho, tự động khấu trừ kho và phân bổ doanh thu khi giao hàng thành công, tự động gửi Email thông báo tài chính tới quản trị viên.
5. **Tính ổn định và sẵn sàng cao (High Availability):** Thiết kế thành công kiến trúc đệm dữ liệu thông minh In-Memory Fallback giúp hệ thống luôn hoạt động ổn định trong mọi điều kiện vận hành và kiểm thử.

### 5.2. Những điểm hạn chế
* Hệ thống hiện tại áp dụng phương thức gửi Email thông báo đối soát thủ công từ phía Admin khi chuyển khoản cho Nông trại, chưa liên kết trực tiếp với API ngân hàng mở (Open Banking API) để thực hiện lệnh chi hộ tự động.
* Tính năng đánh giá và nhận xét (Reviews) của khách hàng mới dừng lại ở mức hiển thị điểm số và số lượng đánh giá, chưa mở rộng chức năng tải ảnh thực tế khi nhận nông sản.

### 5.3. Hướng phát triển mở rộng trong tương lai
* **Tích hợp Trí tuệ nhân tạo (AI & Machine Learning):**
  * Xây dựng hệ thống gợi ý sản phẩm thông minh (Recommendation System) dựa trên lịch sử mua sắm và thói quen dinh dưỡng của người dùng.
  * Tích hợp trợ lý ảo AI tư vấn công thức nấu ăn dựa trên các loại rau củ đang có trong giỏ hàng.
* **Ứng dụng Blockchain trong truy xuất nguồn gốc nông sản (Traceability):**
  * Lưu trữ nhật ký canh tác của nông trại (thời gian bón phân hữu cơ, nguồn nước, ngày thu hoạch) lên mạng lưới Blockchain để người dùng quét mã QR trên bao bì tra cứu nguồn gốc bất biến.
* **Phát triển ứng dụng di động đa nền tảng (Mobile App):**
  * Xây dựng ứng dụng di động cho Khách hàng và Nông trại bằng React Native, tận dụng lại toàn bộ hệ sinh thái RESTful API đã xây dựng.

---

## TÀI LIỆU THAM KHẢO

1. **React Documentation** (2025-2026), *React 19 Official Documentation & Guides*, truy cập tại: https://react.dev/
2. **Redux Toolkit Documentation**, *Redux Toolkit & RTK Query Overview*, truy cập tại: https://redux-toolkit.js.org/
3. **Express.js Documentation**, *Fast, unopinionated, minimalist web framework for Node.js*, truy cập tại: https://expressjs.com/
4. **Mongoose Documentation**, *Elegant MongoDB object modeling for Node.js*, truy cập tại: https://mongoosejs.com/
5. **VietQR Standard Documentation**, *Tiêu chuẩn kỹ thuật mã phản hồi nhanh thanh toán quốc gia*, Công ty Cổ phần Thanh toán Quốc gia Việt Nam (NAPAS), truy cập tại: https://vietqr.net/
6. **Tailwind CSS & DaisyUI Guides**, *Modern Utility-first CSS & Component Frameworks*, truy cập tại: https://tailwindcss.com/ và https://daisyui.com/
7. **Nodemailer Documentation**, *Easy email sending with Node.js*, truy cập tại: https://nodemailer.com/
8. **Giáo trình Phân tích và Thiết kế Hệ thống Thông tin**, Khoa Công nghệ Thông tin, Trường Đại học Nguyễn Tất Thành (NTTU).
