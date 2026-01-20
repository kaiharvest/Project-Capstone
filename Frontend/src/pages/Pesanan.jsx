// Pesanan.jsx
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import logo from "../assets/logo.png";

export default function Pesanan() {
  const [orders, setOrders] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const savedList = JSON.parse(localStorage.getItem("pesanan_list")) || [];
    const savedOrder = JSON.parse(localStorage.getItem("pesanan_aktif") || "null");
    const savedInvoice = JSON.parse(localStorage.getItem("invoice_data") || "null");

    let nextList = Array.isArray(savedList) ? [...savedList] : [];
    let currentOrder = null;

    const normalizeInvoice = (source) => ({
      orderNumber: source?.orderNumber || "",
      date: source?.createdAt || source?.date || new Date().toISOString(),
      layanan: source?.layanan || "",
      jenisBordir: source?.jenisBordir || "",
      ukuranBordir: source?.ukuranBordir || "",
      jumlahPemesanan: source?.jumlahPemesanan || "",
      paymentMethod: source?.paymentMethod || "",
      total: source?.total || 0,
    });

    if (savedOrder) {
      const normalized = normalizeInvoice(savedOrder);
      const fallbackItem = {
        name: normalized.layanan || "Layanan",
        qty: Number(normalized.jumlahPemesanan) || 0,
        price: 0,
      };
      const invoiceItems = Array.isArray(savedOrder.items)
        ? savedOrder.items.map((it) => ({
            name: it.name || it.title || "Item",
            qty: Number(it.qty ?? it.jumlahPemesanan ?? 0),
            price: Number(it.price ?? it.pricePerItem ?? 0),
          }))
        : [fallbackItem];
      const directFileUrl = savedOrder.designPreviewUrl || savedOrder.items?.[0]?.fileUrl || "";
      const directFileName = savedOrder.designFileName || savedOrder.items?.[0]?.fileName || "";
      currentOrder = {
        orderNumber: normalized.orderNumber || "",
        fileName: directFileName || "File Pesanan",
        fileUrl: directFileUrl,
        invoiceData: {
          ...normalized,
          items: invoiceItems,
          createdAt: normalized.date,
        },
      };
    }

    if (!currentOrder && savedInvoice) {
      const normalized = normalizeInvoice(savedInvoice);
      currentOrder = {
        orderNumber: normalized.orderNumber || "",
        fileName: "File Pesanan",
        fileUrl: "",
        invoiceData: {
          ...normalized,
          items: Array.isArray(savedInvoice.items) ? savedInvoice.items : [],
          createdAt: normalized.date,
        },
      };
    }

    if (currentOrder?.orderNumber) {
      if (!nextList.some((it) => it.orderNumber === currentOrder.orderNumber)) {
        nextList = [currentOrder, ...nextList];
      }
    }

    setOrders(nextList);
    localStorage.setItem("pesanan_list", JSON.stringify(nextList));
  }, []);

  const openInvoice = async (order) => {
    if (!order?.invoiceData) {
      setErrorMsg("Invoice belum tersedia.");
      return;
    }
    setErrorMsg("");
    await generateInvoicePdf(order);
  };

  const openFile = (order) => {
    if (!order?.fileUrl) {
      setErrorMsg("File pesanan belum tersedia.");
      return;
    }
    setErrorMsg("");
    window.open(order.fileUrl, "_blank", "noopener,noreferrer");
  };

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
      Number(value || 0)
    );

  const formatDateID = (date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date instanceof Date ? date : new Date(date));

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const generateInvoicePdf = async (order) => {
    const data = order.invoiceData || {};
    const invoiceNo = data.orderNumber || "-";
    const createdAt = data.createdAt || new Date().toISOString();
    const paymentMethod = data.paymentMethod || "-";
    const total = Number(data.total || 0);

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    try {
      const img = await loadImage(logo);
      doc.addImage(img, "PNG", margin, 42, 52, 52);
    } catch {
      // ignore logo if it fails to load
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("JA Bordir", margin + 72, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Invoice untuk pesanan kamu", margin + 72, 78);

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("INVOICE", pageWidth - margin, 58, { align: "right" });
    const labelX = pageWidth - margin - 210;
    const valueX = pageWidth - margin;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Invoice No", labelX, 82);
    doc.setTextColor(15, 23, 42);
    doc.text(invoiceNo, valueX, 82, { align: "right" });
    doc.setTextColor(100, 116, 139);
    doc.text("Tanggal", labelX, 102);
    doc.setTextColor(15, 23, 42);
    doc.text(formatDateID(createdAt), valueX, 102, { align: "right" });

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.line(margin, 130, pageWidth - margin, 130);

    const cardX = margin;
    const cardY = 160;
    const cardW = pageWidth - margin * 2;
    const rows = [
      { label: "Jenis Produk", value: data.layanan || "-" },
      { label: "Jenis Bordir", value: data.jenisBordir || "-" },
      { label: "Ukuran Bordir", value: data.ukuranBordir || "-" },
      { label: "Jumlah", value: String(data.jumlahPemesanan || "-") },
      { label: "Metode Pembayaran", value: paymentMethod || "-" },
    ];
    const rowHeight = 26;
    const totalSection = 36;
    const cardH = rows.length * rowHeight + totalSection + 28;

    doc.setFillColor(250, 251, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(cardX, cardY, cardW, cardH, 12, 12, "FD");

    let y = cardY + 28;
    rows.forEach((row) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text(row.label, cardX + 18, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(String(row.value), cardX + cardW - 18, y, { align: "right" });
      y += rowHeight;
    });

    doc.setDrawColor(226, 232, 240);
    doc.line(cardX + 18, y - 8, cardX + cardW - 18, y - 8);
    y += 14;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Total", cardX + 18, y);
    doc.text(formatRupiah(total), cardX + cardW - 18, y, { align: "right" });

    doc.save(`Invoice-${invoiceNo}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-6">
          {orders.length === 0 && (
            <div className="text-center text-slate-500 py-16">
              Belum ada pesanan.
            </div>
          )}

          {orders.map((order) => {
            const hasInvoice = Boolean(order.invoiceData);
            const hasFile = Boolean(order.fileUrl);
            return (
              <div
                key={order.orderNumber}
                className="rounded-3xl p-4 sm:p-6 shadow-lg"
                style={{ backgroundColor: "#F17300" }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <label className="text-white font-semibold block mb-2">
                        Nomor Pemesanan
                      </label>
                      <input
                        readOnly
                        value={order.orderNumber || ""}
                        className="w-full rounded-full px-5 py-2.5 bg-white shadow-sm border border-white/60 text-sm text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="text-white font-semibold block mb-2">
                        Invoice
                      </label>

                      <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <div className="flex-1 rounded-full px-5 py-2.5 bg-white shadow-sm border border-white/60 text-sm text-slate-500 truncate">
                          {order.orderNumber ? `Invoice ${order.orderNumber}` : "Invoice belum tersedia"}
                        </div>

                        {hasInvoice ? (
                          <button
                            onClick={() => openInvoice(order)}
                            className="px-6 py-2 rounded-full text-white w-full sm:w-auto transition bg-slate-900 hover:bg-slate-800"
                          >
                            Unduh
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="px-6 py-2 rounded-full w-full sm:w-auto bg-slate-300 text-slate-600"
                          >
                            Unduh
                          </button>
                        )}
                      </div>

                      {errorMsg && (
                        <p className="text-white mt-2 text-sm">{errorMsg}</p>
                      )}
                    </div>
                  </div>

                  <div className="h-32 sm:h-36 rounded-xl bg-white flex flex-col items-center justify-center px-4 text-center gap-2">
                    <div className="text-xs text-slate-500">File Pesanan</div>
                    <div className="text-sm font-semibold text-gray-700 truncate w-full">
                      {order.fileName || "Belum ada file"}
                    </div>
                    <button
                      onClick={() => openFile(order)}
                      disabled={!hasFile}
                      className={`px-4 py-1.5 rounded-full text-white text-sm font-semibold ${
                        hasFile ? "bg-slate-900 hover:bg-slate-800" : "bg-slate-300 text-slate-600"
                      }`}
                    >
                      Lihat File
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function buildInvoiceHtml(data) {
  const safe = (value) => String(value || "");
  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <title>Invoice ${safe(data.orderNumber)}</title>
    <style>
      body{font-family:Arial,Helvetica,sans-serif;margin:32px;color:#0f172a}
      .card{border:1px solid #e2e8f0;border-radius:12px;padding:24px;max-width:720px;margin:0 auto}
      h1{font-size:22px;margin:0 0 8px}
      .meta{font-size:12px;color:#64748b;margin-bottom:16px}
      .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e2e8f0}
      .row:last-child{border-bottom:none}
      .label{font-weight:600}
      .total{font-size:18px;font-weight:700;margin-top:12px}
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Invoice Pemesanan</h1>
      <div class="meta">Nomor: ${safe(data.orderNumber)} | Tanggal: ${new Date(data.date).toLocaleString("id-ID")}</div>
      <div class="row"><span class="label">Layanan</span><span>${safe(data.layanan)}</span></div>
      <div class="row"><span class="label">Jenis Bordir</span><span>${safe(data.jenisBordir)}</span></div>
      <div class="row"><span class="label">Ukuran Bordir</span><span>${safe(data.ukuranBordir)}</span></div>
      <div class="row"><span class="label">Jumlah</span><span>${safe(data.jumlahPemesanan)}</span></div>
      <div class="row"><span class="label">Metode Pengiriman</span><span>${safe(data.metodeKirim)}</span></div>
      <div class="row"><span class="label">Metode Pembayaran</span><span>${safe(data.paymentMethod)}</span></div>
      <div class="total">Total: Rp ${Number(data.total || 0).toLocaleString("id-ID")}</div>
    </div>
  </body>
</html>`;
}
