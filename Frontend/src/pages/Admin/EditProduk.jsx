import React, { useState } from 'react';
import { Package, Download, FileCheck, Trash2, X } from 'lucide-react';

const EditProduk = () => {
  const [formData, setFormData] = useState({
    jenisBordir: '',
    ukuranBordir: ''
  });
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ jenisBordir: '', ukuranBordir: '' });
    setSelectedImage(null);
    setImagePreview(null);
    setImageData(null);
    setErrors({});
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      jenisBordir: product.jenisBordir,
      ukuranBordir: product.ukuranBordir
    });
    setSelectedImage(null);
    setImagePreview(product.imageData || null);
    setImageData(product.imageData || null);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      alert('Hanya file JPG dan PNG yang diperbolehkan');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = () => {
    setErrors({});
    const newErrors = {};

    if (!formData.jenisBordir.trim()) {
      newErrors.jenisBordir = 'Jenis Bordir tidak boleh kosong';
    }

    if (!formData.ukuranBordir.trim()) {
      newErrors.ukuranBordir = 'Ukuran Bordir tidak boleh kosong';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nextProduct = {
      id: editingId || Date.now(),
      jenisBordir: formData.jenisBordir.trim(),
      ukuranBordir: formData.ukuranBordir.trim(),
      imageName: selectedImage?.name || '',
      imageData: imageData || null
    };

    if (editingId) {
      setProducts((prev) =>
        prev.map((item) => (item.id === editingId ? nextProduct : item))
      );
    } else {
      setProducts((prev) => [nextProduct, ...prev]);
    }

    setIsModalOpen(false);
    resetForm();

    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
  };

  const handleDelete = (productId) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
    if (editingId === productId) {
      resetForm();
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Package className="text-blue-700" size={26} />
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Edit Produk</h1>
            <p className="text-sm text-slate-500 mt-1">Update Produk Anda</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <p className="text-sm text-slate-600">Kelola data produk bordir Anda di bawah ini.</p>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
          onClick={handleOpenCreate}
        >
          Tambahkan Produk
        </button>
      </div>

      {showSuccessPopup && (
        <div className="bg-green-500 text-white rounded-lg p-3 mb-5 flex items-center gap-2 max-w-xl">
          <FileCheck className="text-white" size={18} />
          <p className="font-semibold text-sm">Produk berhasil disimpan.</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Jenis Bordir</th>
              <th className="px-4 py-3 text-left font-semibold">Ukuran Bordir</th>
              <th className="px-4 py-3 text-left font-semibold">Foto</th>
              <th className="px-4 py-3 text-center font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                  Belum ada produk.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-700">{product.jenisBordir}</td>
                  <td className="px-4 py-3 text-slate-700">{product.ukuranBordir}</td>
                  <td className="px-4 py-3">
                    {product.imageData ? (
                      <img
                        src={product.imageData}
                        alt={product.imageName || 'Portofolio'}
                        className="h-10 w-14 object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="px-3 py-1.5 text-xs rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1.5 text-xs rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                {editingId ? 'Edit Produk' : 'Tambah Produk'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-500 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-slate-600 font-semibold text-sm mb-2">Tambah Jenis Bordir</label>
                <input
                  type="text"
                  value={formData.jenisBordir}
                  onChange={(e) => setFormData({ ...formData, jenisBordir: e.target.value })}
                  className={`w-full border ${errors.jenisBordir ? 'border-red-500' : 'border-slate-300'} rounded-xl px-4 py-2.5`}
                />
                {errors.jenisBordir && <p className="text-red-500 text-xs mt-1">{errors.jenisBordir}</p>}
              </div>

              <div>
                <label className="block text-slate-600 font-semibold text-sm mb-2">Tambah Ukuran Bordir</label>
                <input
                  type="text"
                  value={formData.ukuranBordir}
                  onChange={(e) => setFormData({ ...formData, ukuranBordir: e.target.value })}
                  className={`w-full border ${errors.ukuranBordir ? 'border-red-500' : 'border-slate-300'} rounded-xl px-4 py-2.5`}
                />
                {errors.ukuranBordir && <p className="text-red-500 text-xs mt-1">{errors.ukuranBordir}</p>}
              </div>

              <div>
                <label className="block text-slate-600 font-semibold text-sm mb-2">Tambah Foto Portofolio</label>
                <div className="border border-dashed border-slate-300 rounded-xl p-4 sm:p-6 text-center relative">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-56 mx-auto rounded-lg object-contain"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          setImageData(null);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center mb-2">
                        <Download className="text-blue-500" size={36} />
                      </div>
                      <p className="text-slate-700 font-semibold text-sm mb-1">Unggah Gambar Produk</p>
                      <p className="text-slate-500 text-xs mb-1">PNG, JPG maksimal 5MB</p>
                      <p className="text-slate-500 text-xs mb-3">Rekomendasi ukuran foto 800x600 pixel (4:3)</p>
                      <label className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer inline-block">
                        Pilih File
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm rounded-full border border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleSaveChanges}
                className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Simpan Perubahan' : 'Tambah Produk'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduk;
