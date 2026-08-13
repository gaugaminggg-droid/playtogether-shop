import Link from "next/link";

const services = [
  ["Cày tiền sao", "Cày tiền sao nhanh, nhận đơn theo gói.", "Từ 10K"],
  ["Dắt thẻ", "Hỗ trợ dắt thẻ theo yêu cầu.", "Liên hệ"],
  ["Làm cần quái vật", "Nhận làm cần quái vật.", "Liên hệ"],
  ["Kim Cương Xanh", "Nhận kiếm KCX.", "Liên hệ"],
  ["Kim Cương Đỏ", "Nhận kiếm KCD.", "Liên hệ"],
  ["Câu bóng 6", "Nhận câu bóng 6.", "Liên hệ"],
  ["Câu bóng 7", "Nhận câu bóng 7.", "Liên hệ"],
  ["Cho thuê map trống", "Cho thuê map trống theo thời gian.", "Liên hệ"]
];

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <div className="brand">PT<span>SHOP</span></div>
        <div className="navlinks">
          <Link href="/">Trang chủ</Link>
          <a href="#services">Dịch vụ</a>
          <a href="#contact">Liên hệ</a>
          <Link href="/login">Đăng nhập</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="heroText">
          <div className="badge">PLAY TOGETHER SERVICES</div>
          <h1>SHOP <span>PLAY TOGETHER</span></h1>
          <p>Cày thuê nhanh • Uy tín • Giá hợp lý</p>
          <div className="actions">
            <a className="btn primary" href="#services">ĐẶT DỊCH VỤ</a>
            <a className="btn ghost" href="https://zalo.me/0849414809">ZALO 0849414809</a>
          </div>
        </div>
        <div className="heroCard">
          <div className="orb">PT</div>
          <h3>ĐẶT ĐƠN NHANH</h3>
          <p>Chọn dịch vụ → gửi thông tin → theo dõi trạng thái đơn.</p>
        </div>
      </section>

      <section id="services" className="section">
        <div className="sectionHead">
          <div>
            <div className="eyebrow">DỊCH VỤ</div>
            <h2>Dịch vụ nổi bật</h2>
          </div>
          <span className="count">{services.length} dịch vụ</span>
        </div>

        <div className="grid">
          {services.map(([name, desc, price]) => (
            <article className="service" key={name}>
              <div className="serviceIcon">★</div>
              <h3>{name}</h3>
              <p>{desc}</p>
              <div className="serviceBottom">
                <strong>{price}</strong>
                <Link href={`/order?service=${encodeURIComponent(name)}`}>Đặt ngay →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="steps">
        <div><b>01</b><span>Chọn dịch vụ</span></div>
        <div><b>02</b><span>Gửi thông tin</span></div>
        <div><b>03</b><span>Shop xử lý</span></div>
        <div><b>04</b><span>Hoàn thành</span></div>
      </section>

      <section id="contact" className="contact">
        <div>
          <div className="eyebrow">HỖ TRỢ</div>
          <h2>Cần tư vấn?</h2>
          <p>Nhắn Zalo để kiểm tra giá và đặt slot.</p>
        </div>
        <a className="btn primary" href="https://zalo.me/0849414809">ZALO 0849414809</a>
      </section>

      <footer>© 2026 PTShop • Play Together Services</footer>
    </main>
  );
}