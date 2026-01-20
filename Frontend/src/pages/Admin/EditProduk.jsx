import React, { useEffect, useMemo, useState } from "react";
import { Package, Save, Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../services/api";

const DEFAULT_RULES = {
  base_price_per_cm: 500,
  shipping_cost: 0,
  embroidery_multipliers: {
    "3d": 1.5,
    computer: 1.0,
  },
  service_multipliers: {
    seragam: 1.0,
    topi: 1.2,
    emblem: 1.1,
    jaket: 1.3,
    tas: 1.2,
  },
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const mergeRules = (incoming) => ({
  ...DEFAULT_RULES,
  ...incoming,
  embroidery_multipliers: {
    ...DEFAULT_RULES.embroidery_multipliers,
    ...(incoming?.embroidery_multipliers || {}),
  },
  service_multipliers: {
    ...DEFAULT_RULES.service_multipliers,
    ...(incoming?.service_multipliers || {}),
  },
});

const EditProduk = () => {
  const [types, setTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTypeName, setNewTypeName] = useState("");
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [editingTypeName, setEditingTypeName] = useState("");

  const [newSizeLabel, setNewSizeLabel] = useState("");
  const [newSizeCm, setNewSizeCm] = useState("");
  const [editingSizeId, setEditingSizeId] = useState(null);
  const [editingSizeLabel, setEditingSizeLabel] = useState("");
  const [editingSizeCm, setEditingSizeCm] = useState("");

  const [pricingRules, setPricingRules] = useState(DEFAULT_RULES);
  const [savingPricing, setSavingPricing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [typesRes, sizesRes, settingsRes] = await Promise.all([
        api.get("/admin/embroidery-types"),
        api.get("/admin/embroidery-sizes"),
        api.get("/admin/settings"),
      ]);
      setTypes(typesRes.data.data || []);
      setSizes(sizesRes.data.data || []);
      setPricingRules(mergeRules(settingsRes.data.pricing_rules));
    } catch (error) {
      console.error("Gagal memuat data produk:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddType = async () => {
    const name = newTypeName.trim();
    if (!name) return;
    try {
      await api.post("/admin/embroidery-types", { name });
      setNewTypeName("");
      fetchData();
    } catch (error) {
      console.error("Gagal tambah jenis bordir:", error);
    }
  };

  const handleSaveType = async () => {
    const name = editingTypeName.trim();
    if (!editingTypeId || !name) return;
    try {
      await api.put(`/admin/embroidery-types/${editingTypeId}`, { name });
      setEditingTypeId(null);
      setEditingTypeName("");
      fetchData();
    } catch (error) {
      console.error("Gagal update jenis bordir:", error);
    }
  };

  const handleDeleteType = async (id) => {
    try {
      await api.delete(`/admin/embroidery-types/${id}`);
      fetchData();
    } catch (error) {
      console.error("Gagal hapus jenis bordir:", error);
    }
  };

  const handleAddSize = async () => {
    const label = newSizeLabel.trim();
    const sizeCm = toNumber(newSizeCm, 0);
    if (!label || sizeCm <= 0) return;
    try {
      await api.post("/admin/embroidery-sizes", {
        label,
        size_cm: sizeCm,
      });
      setNewSizeLabel("");
      setNewSizeCm("");
      fetchData();
    } catch (error) {
      console.error("Gagal tambah ukuran bordir:", error);
    }
  };

  const handleSaveSize = async () => {
    const label = editingSizeLabel.trim();
    const sizeCm = toNumber(editingSizeCm, 0);
    if (!editingSizeId || !label || sizeCm <= 0) return;
    try {
      await api.put(`/admin/embroidery-sizes/${editingSizeId}`, {
        label,
        size_cm: sizeCm,
      });
      setEditingSizeId(null);
      setEditingSizeLabel("");
      setEditingSizeCm("");
      fetchData();
    } catch (error) {
      console.error("Gagal update ukuran bordir:", error);
    }
  };

  const handleDeleteSize = async (id) => {
    try {
      await api.delete(`/admin/embroidery-sizes/${id}`);
      fetchData();
    } catch (error) {
      console.error("Gagal hapus ukuran bordir:", error);
    }
  };

  const updatePricingField = (key, value) => {
    setPricingRules((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateMultiplier = (group, key, value) => {
    setPricingRules((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: value,
      },
    }));
  };

  const handleSavePricing = async () => {
    setSavingPricing(true);
    try {
      await api.put("/admin/settings", {
        pricing_rules: {
          ...pricingRules,
          base_price_per_cm: toNumber(pricingRules.base_price_per_cm, 0),
          shipping_cost: toNumber(pricingRules.shipping_cost, 0),
          embroidery_multipliers: {
            "3d": toNumber(pricingRules.embroidery_multipliers["3d"], 1),
            computer: toNumber(pricingRules.embroidery_multipliers.computer, 1),
          },
          service_multipliers: {
            seragam: toNumber(pricingRules.service_multipliers.seragam, 1),
            topi: toNumber(pricingRules.service_multipliers.topi, 1),
            emblem: toNumber(pricingRules.service_multipliers.emblem, 1),
            jaket: toNumber(pricingRules.service_multipliers.jaket, 1),
            tas: toNumber(pricingRules.service_multipliers.tas, 1),
          },
        },
      });
    } catch (error) {
      console.error("Gagal simpan harga:", error);
    } finally {
      setSavingPricing(false);
    }
  };

  const pricingPreview = useMemo(() => pricingRules, [pricingRules]);

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <Package className="text-blue-700" size={26} />
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Edit Produk</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola jenis, ukuran, dan harga bordir.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Pengaturan Harga</h2>
          <button
            onClick={handleSavePricing}
            disabled={savingPricing}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            <Save size={16} />
            Simpan Harga
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Harga dasar per cm
            </label>
            <input
              type="number"
              min={0}
              value={pricingRules.base_price_per_cm}
              onChange={(e) => updatePricingField("base_price_per_cm", e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Ongkir (0 = gratis)
            </label>
            <input
              type="number"
              min={0}
              value={pricingRules.shipping_cost}
              onChange={(e) => updatePricingField("shipping_cost", e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-xl p-4">
            <h3 className="font-semibold text-slate-700 mb-3">Multiplier Jenis Bordir</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Bordir 3D</label>
                <input
                  type="number"
                  step="0.1"
                  value={pricingRules.embroidery_multipliers["3d"]}
                  onChange={(e) => updateMultiplier("embroidery_multipliers", "3d", e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Bordir Komputer</label>
                <input
                  type="number"
                  step="0.1"
                  value={pricingRules.embroidery_multipliers.computer}
                  onChange={(e) => updateMultiplier("embroidery_multipliers", "computer", e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4">
            <h3 className="font-semibold text-slate-700 mb-3">Multiplier Layanan</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(pricingPreview.service_multipliers).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs text-slate-500 mb-1 capitalize">{key}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={value}
                    onChange={(e) => updateMultiplier("service_multipliers", key, e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Jenis Bordir</h2>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="Contoh: Bordir Timbul 3D"
              className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5"
            />
            <button
              onClick={handleAddType}
              className="bg-blue-600 text-white px-4 rounded-xl text-sm font-semibold hover:bg-blue-700"
            >
              <Plus size={16} />
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Memuat...</p>
          ) : types.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada jenis bordir.</p>
          ) : (
            <div className="space-y-2">
              {types.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2"
                >
                  {editingTypeId === item.id ? (
                    <input
                      value={editingTypeName}
                      onChange={(e) => setEditingTypeName(e.target.value)}
                      className="flex-1 border border-slate-300 rounded-md px-2 py-1 mr-2"
                    />
                  ) : (
                    <span className="text-sm text-slate-700">{item.name}</span>
                  )}
                  <div className="flex items-center gap-2">
                    {editingTypeId === item.id ? (
                      <button
                        onClick={handleSaveType}
                        className="text-xs px-3 py-1 rounded-full bg-green-500 text-white"
                      >
                        Simpan
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingTypeId(item.id);
                          setEditingTypeName(item.name);
                        }}
                        className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteType(item.id)}
                      className="text-xs px-3 py-1 rounded-full bg-red-500 text-white"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Ukuran Bordir</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <input
              type="text"
              value={newSizeLabel}
              onChange={(e) => setNewSizeLabel(e.target.value)}
              placeholder="Label (20-24 CM)"
              className="border border-slate-300 rounded-xl px-4 py-2.5"
            />
            <input
              type="number"
              min={0}
              step="0.1"
              value={newSizeCm}
              onChange={(e) => setNewSizeCm(e.target.value)}
              placeholder="Ukuran cm"
              className="border border-slate-300 rounded-xl px-4 py-2.5"
            />
            <button
              onClick={handleAddSize}
              className="bg-blue-600 text-white px-4 rounded-xl text-sm font-semibold hover:bg-blue-700"
            >
              <Plus size={16} />
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Memuat...</p>
          ) : sizes.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada ukuran bordir.</p>
          ) : (
            <div className="space-y-2">
              {sizes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2"
                >
                  {editingSizeId === item.id ? (
                    <div className="flex-1 flex gap-2 mr-2">
                      <input
                        value={editingSizeLabel}
                        onChange={(e) => setEditingSizeLabel(e.target.value)}
                        className="flex-1 border border-slate-300 rounded-md px-2 py-1"
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={editingSizeCm}
                        onChange={(e) => setEditingSizeCm(e.target.value)}
                        className="w-24 border border-slate-300 rounded-md px-2 py-1"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-slate-700">
                      {item.label} ({Number(item.size_cm).toFixed(2)} cm)
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    {editingSizeId === item.id ? (
                      <button
                        onClick={handleSaveSize}
                        className="text-xs px-3 py-1 rounded-full bg-green-500 text-white"
                      >
                        Simpan
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingSizeId(item.id);
                          setEditingSizeLabel(item.label);
                          setEditingSizeCm(item.size_cm);
                        }}
                        className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSize(item.id)}
                      className="text-xs px-3 py-1 rounded-full bg-red-500 text-white"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProduk;
