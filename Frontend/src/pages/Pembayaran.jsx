import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Pembayaran() {
  const navigate = useNavigate();

  const [loadingQris, setLoadingQris] = useState(true);
  const [qris, setQris] = useState(null);
  const [qrisError, setQrisError] = useState("");
  const [qrisImageOverride, setQrisImageOverride] = useState("");
  const [orderDraft, setOrderDraft] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [proofFile, setProofFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [paymentOptions, setPaymentOptions] = useState([
    { value: "BRI_66400234", label: "BRI NO REK. 66400234" },
    { value: "QRIS", label: "QRIS" },
  ]);

  useEffect(() => {
    let cancelled = false;

    async function fetchQris() {
      setLoadingQris(true);
      setQrisError("");
      try {
        const res = await fetch("/api/payments/qris", {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`Gagal ambil QRIS (${res.status})`);
        const data = await res.json();
        if (!cancelled) setQris(data);
      } catch (e) {
        if (!cancelled) setQrisError(e?.message || "Gagal ambil QRIS");
      } finally {
        if (!cancelled) setLoadingQris(false);
      }
    }

    fetchQris();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const savedDraft = localStorage.getItem("order_draft");
    if (savedDraft) {
      setOrderDraft(JSON.parse(savedDraft));
    }

    const savedOptions = localStorage.getItem("payment_options");
    if (savedOptions) {
      try {
        const parsed = JSON.parse(savedOptions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPaymentOptions(parsed);
        }
      } catch {
        // ignore
      }
    }

    const savedQrisImage = localStorage.getItem("qris_image");
    if (savedQrisImage) {
      setQrisImageOverride(savedQrisImage);
    }
  }, []);

  useEffect(() => {
    if (!paymentMethod && paymentOptions.length > 0) {
      setPaymentMethod(paymentOptions[0].value);
    }
  }, [paymentMethod, paymentOptions]);

  function onFileChange(e) {
    const f = e.target.files?.[0] || null;
    setProofFile(f);
  }

  async function handleSubmit() {
    setSubmitError("");

    if (!proofFile) {
      setSubmitError("Mohon unggah bukti transfer terlebih dahulu.");
      return;
    }

    setSubmitting(true);
    try {
      if (!orderDraft) {
        throw new Error("Data pesanan belum ada. Silakan isi form pemesanan.");
      }

      const invoiceData = {
        orderNumber: orderDraft.orderNumber,
        date: new Date().toISOString(),
        layanan: orderDraft.layanan,
        jenisBordir: orderDraft.jenisBordir,
        ukuranBordir: orderDraft.ukuranBordir,
        jumlahPemesanan: orderDraft.jumlahPemesanan,
        metodeKirim: orderDraft.metodeKirim,
        paymentMethod,
        total: orderDraft.total || 0,
      };

      localStorage.setItem("invoice_data", JSON.stringify(invoiceData));
      localStorage.setItem(
        "invoice_file_name",
        `Invoice-${orderDraft.orderNumber}.html`
      );

      localStorage.setItem(
        "pesanan_aktif",
        JSON.stringify({
          ...orderDraft,
          paymentMethod,
          status: "menunggu",
        })
      );
      localStorage.removeItem("order_draft");

      navigate("/pesanan");
    } catch (e) {
      setSubmitError(e?.message || "Terjadi kesalahan saat mengirim pesanan.");
    } finally {
      setSubmitting(false);
    }
  }

  const showQris = paymentMethod === "QRIS";
  const totalToPay = orderDraft?.total || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-5xl rounded-3xl bg-orange-500 p-6 md:p-8 shadow-lg">
        <div
          className={`grid grid-cols-1 ${
            showQris ? "md:grid-cols-3" : "md:grid-cols-2"
          } gap-6 items-stretch`}
        >
          {/* LEFT: FORM */}
          <div className="md:col-span-2">
            <h2 className="text-white font-semibold text-lg mb-3">
              Pilih Metode Pembayaran
            </h2>

            <div className="bg-white rounded-2xl p-4 md:p-5">
              {/* Metode Pembayaran */}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metode Pembayaran
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {paymentOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="opacity-80"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Bukti Transfer */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bukti Transfer
                </label>

                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-gray-500 truncate">
                    {proofFile ? proofFile.name : "Unggah Bukti Transfer"}
                  </div>

                  <label className="shrink-0 cursor-pointer rounded-xl bg-sky-200 px-5 py-3 text-sky-900 font-semibold hover:bg-sky-300 active:scale-[0.99]">
                    Pilih File
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={onFileChange}
                    />
                  </label>
                </div>

                <p className="mt-2 text-xs text-gray-500">Format: JPG/PNG/PDF.</p>
              </div>

              {/* Error */}
              {submitError ? (
                <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              ) : null}

              {/* Button Pesan */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-5 w-full rounded-2xl bg-green-500 py-4 font-bold text-white hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Mengirim..." : "Pesan"}
              </button>

              <div className="mt-3 text-sm text-gray-700 font-semibold">
                Total yang harus dibayar: {" "}
                <span className="text-gray-900">{formatRupiah(totalToPay)}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: QRIS */}
          {showQris && (
            <div className="md:col-span-1">
              <div className="h-full bg-white rounded-2xl p-5 flex flex-col items-center justify-center">
                {loadingQris ? (
                  <div className="text-gray-600 text-sm">Memuat QRIS...</div>
                ) : qrisError ? (
                  <div className="text-center">
                    <div className="text-red-600 text-sm mb-3">{qrisError}</div>
                    <button
                      className="rounded-xl bg-orange-500 px-4 py-2 text-white font-semibold hover:bg-orange-600"
                      onClick={() => window.location.reload()}
                    >
                      Coba Lagi
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-gray-700 font-semibold mb-2">QRIS</div>
                    <div className="text-xs text-gray-500 mb-4 text-center">
                      Scan untuk pembayaran
                      {qris?.merchantName ? ` · ${qris.merchantName}` : ""}
                    </div>

                    <div className="rounded-2xl border border-gray-200 p-3 bg-white">
                      <img
                        src={qrisImageOverride || qris?.imageUrl}
                        alt="QRIS"
                        className="w-52 h-52 object-contain"
                      />
                    </div>

                    {qris?.amount ? (
                      <div className="mt-4 text-sm text-gray-700">
                        Total:{" "}
                        <span className="font-semibold">
                          {formatRupiah(qris.amount)}
                        </span>
                      </div>
                    ) : null}

                    {qris?.reference ? (
                      <div className="mt-1 text-xs text-gray-500">
                        Ref: {qris.reference}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatRupiah(amount) {
  const n = Number(amount);
  if (Number.isNaN(n)) return String(amount);
  return n.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
}

async function safeReadError(res) {
  try {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const j = await res.json();
      return j?.message || j?.error || "";
    }
    return await res.text();
  } catch {
    return "";
  }
}
