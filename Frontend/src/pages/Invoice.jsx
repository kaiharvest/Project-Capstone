// src/pages/Invoice.jsx
// NOTE: Sesuaikan path logo.png & sumber data order (API/state) sesuai project kamu.

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // <- ubah path kalau logo kamu beda

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    Number(n || 0)
  );

const formatDateID = (date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date instanceof Date ? date : new Date(date));

export default function Invoice() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Sumber data invoice:
   * 1) Ideal: kirim order via state saat navigate(`/invoice/${id}`, { state: { order } })
   * 2) Alternatif: fetch dari API GET /api/orders/:id
   */
  const [order, setOrder] = useState(location.state?.order ?? null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState("");

  useEffect(() => {
    // Kalau order sudah dikirim via state, tidak perlu fetch
    if (order) return;

    // Kalau kamu belum punya API, kamu bisa hapus blok fetch ini dan pakai dummy data di bawah.
    const controller = new AbortController();

    async function fetchOrder() {
      try {
        setLoading(true);
        setError("");

        // TODO: ganti endpoint sesuai backend kamu
        const res = await fetch(`/api/orders/${orderId}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Gagal ambil data pesanan (${res.status})`);
        }

        const data = await res.json();
        setOrder(data);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
    return () => controller.abort();
  }, [order, orderId]);

  // Dummy data (kalau belum ada API) — hapus kalau sudah pakai backend
  const demoOrder = useMemo(
    () => ({
      orderNumber: orderId || "20252812REG11097554333333",
      createdAt: new Date().toISOString(),
      customer: {
        name: "Lisa",
        email: "lisa@email.com",
        phone: "08xxxxxxxxxx",
      },
      items: [
        { name: "Bordir Logo", qty: 2, price: 75000 },
        { name: "Bordir Nama", qty: 1, price: 25000 },
      ],
      shippingLabel: "Gratis Ongkir",
      shippingCost: 0,
      paymentMethod: "BRI NO REK. 66400234",
      paymentStatus: "TERBAYAR",
    }),
    [orderId]
  );

  const invoiceData = order ?? demoOrder;

  const items = Array.isArray(invoiceData.items) ? invoiceData.items : [];

  const totalItems = items.reduce(
    (acc, it) => acc + Number(it.qty || 0) * Number(it.price || 0),
    0
  );

  const shippingCost = Number(invoiceData.shippingCost ?? 0);
  const total = totalItems + shippingCost;

  // Invoice No ambil dari nomor pemesanan
  const invoiceNo =
    invoiceData.orderNumber ||
    invoiceData.orderId ||
    invoiceData.id ||
    orderId ||
    "-";

  const customer = invoiceData.customer || {};
  const customerName = customer.name || invoiceData.customerName || "-";
  const customerEmail = customer.email || invoiceData.customerEmail || "-";
  const customerPhone = customer.phone || invoiceData.customerPhone || "-";

  const paymentMethod =
    invoiceData.paymentMethod ||
    invoiceData.method ||
    invoiceData.payment?.method ||
    "-";

  const paymentStatus =
    invoiceData.paymentStatus ||
    invoiceData.payment?.status ||
    "TERBAYAR";

  const createdAt = invoiceData.createdAt || new Date().toISOString();

  return (
    <div style={styles.page}>
      {/* Print styles */}
      <style>{printCss}</style>

      <div style={styles.toolbar} className="no-print">
        <button style={styles.btnSecondary} onClick={() => navigate(-1)}>
          Kembali
        </button>
        <button style={styles.btnPrimary} onClick={() => window.print()}>
          Unduh / Cetak Invoice
        </button>
      </div>

      {loading ? (
        <div style={styles.card}>Memuat invoice…</div>
      ) : error ? (
        <div style={styles.card}>
          <div style={{ marginBottom: 10, color: "#b00020" }}>{error}</div>
          <button
            style={styles.btnSecondary}
            onClick={() => window.location.reload()}
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <div style={styles.invoice}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.brand}>
              <img src={logo} alt="Logo" style={styles.logo} />
              <div>
                <div style={styles.companyName}>JA Bordir</div>
                <div style={styles.smallMuted}>
                  Invoice untuk pesanan kamu
                </div>
              </div>
            </div>

            <div style={styles.headerRight}>
              <div style={styles.invoiceTitle}>INVOICE</div>
              <div style={styles.kv}>
                <span style={styles.k}>Invoice No</span>
                <span style={styles.v}>{invoiceNo}</span>
              </div>
              <div style={styles.kv}>
                <span style={styles.k}>Tanggal</span>
                <span style={styles.v}>{formatDateID(createdAt)}</span>
              </div>
            </div>
          </div>

          <div style={styles.hr} />

          {/* Customer & Payment */}
          <div style={styles.grid2}>
            <div style={styles.block}>
              <div style={styles.blockTitle}>Data Pelanggan</div>
              <div style={styles.kv}>
                <span style={styles.k}>Nama</span>
                <span style={styles.v}>{customerName}</span>
              </div>
              <div style={styles.kv}>
                <span style={styles.k}>Email</span>
                <span style={styles.v}>{customerEmail}</span>
              </div>
              <div style={styles.kv}>
                <span style={styles.k}>Telepon</span>
                <span style={styles.v}>{customerPhone}</span>
              </div>
            </div>

            <div style={styles.block}>
              <div style={styles.blockTitle}>Pembayaran</div>
              <div style={styles.kv}>
                <span style={styles.k}>Metode Pembayaran</span>
                <span style={styles.v}>{paymentMethod}</span>
              </div>
              <div style={styles.kv}>
                <span style={styles.k}>Status Pembayaran</span>
                <span style={{ ...styles.v, ...styles.paidBadge }}>
                  {String(paymentStatus).toUpperCase()}
                </span>
              </div>
              <div style={styles.kv}>
                <span style={styles.k}>Ongkir</span>
                <span style={styles.v}>
                  {invoiceData.shippingLabel || "Gratis Ongkir"}
                </span>
              </div>
            </div>
          </div>

          <div style={styles.hr} />

          {/* Items table */}
          <div style={styles.tableWrap}>
            <div style={styles.tableTitle}>Detail Item</div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: "44%" }}>Nama Produk</th>
                  <th style={{ ...styles.th, width: "12%", textAlign: "center" }}>
                    Qty
                  </th>
                  <th style={{ ...styles.th, width: "22%", textAlign: "right" }}>
                    Harga
                  </th>
                  <th style={{ ...styles.th, width: "22%", textAlign: "right" }}>
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td style={styles.td} colSpan={4}>
                      Tidak ada item.
                    </td>
                  </tr>
                ) : (
                  items.map((it, idx) => {
                    const qty = Number(it.qty || 0);
                    const price = Number(it.price || 0);
                    const subtotal = qty * price;
                    return (
                      <tr key={idx}>
                        <td style={styles.td}>{it.name || "-"}</td>
                        <td style={{ ...styles.td, textAlign: "center" }}>
                          {qty}
                        </td>
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          {formatRupiah(price)}
                        </td>
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          {formatRupiah(subtotal)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={styles.totals}>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Subtotal</span>
              <span style={styles.totalValue}>{formatRupiah(totalItems)}</span>
            </div>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Ongkir</span>
              <span style={styles.totalValue}>
                {shippingCost === 0 ? "Gratis Ongkir" : formatRupiah(shippingCost)}
              </span>
            </div>
            <div style={styles.hrThin} />
            <div style={styles.totalRowBig}>
              <span style={styles.totalLabelBig}>Total</span>
              <span style={styles.totalValueBig}>{formatRupiah(total)}</span>
            </div>
          </div>

          <div style={styles.footerNote}>
            Terima kasih telah memesan di JA Bordir.
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px 16px",
    background: "#f6f7fb",
    display: "flex",
    justifyContent: "center",
  },
  toolbar: {
    position: "fixed",
    top: 16,
    right: 16,
    display: "flex",
    gap: 10,
    zIndex: 50,
  },
  btnPrimary: {
    border: "none",
    padding: "10px 14px",
    borderRadius: 10,
    background: "#0ea65b",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  btnSecondary: {
    border: "1px solid #d8dbe5",
    padding: "10px 14px",
    borderRadius: 10,
    background: "white",
    color: "#1f2a44",
    fontWeight: 700,
    cursor: "pointer",
  },
  card: {
    width: "920px",
    maxWidth: "100%",
    background: "white",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    marginTop: 64,
  },
  invoice: {
    width: "920px",
    maxWidth: "100%",
    background: "white",
    borderRadius: 18,
    padding: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    marginTop: 64,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "flex-start",
  },
  brand: { display: "flex", gap: 14, alignItems: "center" },
  logo: { width: 56, height: 56, objectFit: "contain" },
  companyName: { fontSize: 18, fontWeight: 800, color: "#0f172a" },
  smallMuted: { fontSize: 12, color: "#64748b", marginTop: 2 },
  headerRight: { textAlign: "right" },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 900,
    letterSpacing: 1,
    color: "#0f172a",
    marginBottom: 6,
  },
  hr: { height: 1, background: "#eef0f6", margin: "16px 0" },
  hrThin: { height: 1, background: "#eef0f6", margin: "10px 0" },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  block: {
    border: "1px solid #eef0f6",
    borderRadius: 14,
    padding: 14,
    background: "#fbfcff",
  },
  blockTitle: { fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 10 },
  kv: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    padding: "6px 0",
    fontSize: 13,
  },
  k: { color: "#64748b" },
  v: { color: "#0f172a", fontWeight: 700 },
  paidBadge: {
    padding: "2px 10px",
    borderRadius: 999,
    background: "#eafaf1",
    color: "#0ea65b",
    border: "1px solid #bde8cf",
    fontSize: 12,
    fontWeight: 900,
    alignSelf: "center",
  },
  tableWrap: { marginTop: 4 },
  tableTitle: { fontSize: 13, fontWeight: 900, color: "#0f172a", marginBottom: 10 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: "#64748b",
    borderBottom: "1px solid #eef0f6",
    padding: "10px 8px",
    textAlign: "left",
  },
  td: {
    borderBottom: "1px solid #f1f3f9",
    padding: "10px 8px",
    fontSize: 13,
    color: "#0f172a",
  },
  totals: {
    marginTop: 16,
    marginLeft: "auto",
    maxWidth: 360,
    border: "1px solid #eef0f6",
    borderRadius: 14,
    padding: 14,
    background: "#fbfcff",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    padding: "6px 0",
  },
  totalLabel: { color: "#64748b", fontWeight: 700 },
  totalValue: { color: "#0f172a", fontWeight: 900 },
  totalRowBig: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 15,
    padding: "6px 0",
  },
  totalLabelBig: { color: "#0f172a", fontWeight: 900 },
  totalValueBig: { color: "#0f172a", fontWeight: 900 },
  footerNote: { marginTop: 18, fontSize: 12, color: "#64748b" },
};

const printCss = `
@media print {
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    background: white !important;
  }
  .no-print { display: none !important; }
}
`;
