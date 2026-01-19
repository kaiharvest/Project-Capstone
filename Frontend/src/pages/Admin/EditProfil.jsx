import React, { useEffect, useRef, useState } from 'react';
import { UserCircle, FileCheck } from 'lucide-react';
import api from '../../services/api';

const EditProfil = () => {
  const [profile, setProfile] = useState({
    description: '',
    address: '',
    mapsLink: '',
    phone: ''
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const editInputRef = useRef(null);

  const [customImages, setCustomImages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [paymentOptions, setPaymentOptions] = useState([
    { value: 'BRI_66400234', label: 'BRI NO REK. 66400234' },
    { value: 'QRIS', label: 'QRIS' }
  ]);
  const [newMethodLabel, setNewMethodLabel] = useState('');
  const [newMethodValue, setNewMethodValue] = useState('');
  const [qrisImagePreview, setQrisImagePreview] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const response = await api.get('/admin/company-profile');
        if (!isMounted) return;
        setProfile({
          description: response.data.description || '',
          address: response.data.address || '',
          mapsLink: response.data.google_maps_link || '',
          phone: response.data.phone || ''
        });
      } catch (error) {
        console.error('Gagal memuat profil perusahaan:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const savedImages = localStorage.getItem('portofolio_custom_images');
    if (savedImages) {
      try {
        setCustomImages(JSON.parse(savedImages));
      } catch {
        setCustomImages([]);
      }
    }

    const savedOptions = localStorage.getItem('payment_options');
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

    const savedQris = localStorage.getItem('qris_image');
    if (savedQris) {
      setQrisImagePreview(savedQris);
    }
  }, []);

  const handleSaveChanges = async () => {
    // Reset errors
    setErrors({});

    // Form validation
    const newErrors = {};

    if (!profile.description.trim()) {
      newErrors.description = 'Deskripsi Perusahaan tidak boleh kosong';
    }

    if (!profile.address.trim()) {
      newErrors.address = 'Alamat tidak boleh kosong';
    }

    if (!profile.phone.trim()) {
      newErrors.phone = 'Nomor Telepon tidak boleh kosong';
    }

    if (!profile.mapsLink.trim()) {
      newErrors.mapsLink = 'Link Google Maps tidak boleh kosong';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Prepare form data for API submission
      await api.put('/admin/company-profile', {
        description: profile.description,
        address: profile.address,
        google_maps_link: profile.mapsLink,
        phone: profile.phone
      });

      // Show success popup
      setShowSuccessPopup(true);

      // Optional: Hide the popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Terjadi kesalahan saat menyimpan profil. Silakan coba lagi.');
    }
  };

  const persistImages = (items) => {
    setCustomImages(items);
    localStorage.setItem('portofolio_custom_images', JSON.stringify(items));
    window.dispatchEvent(new Event('portofolio-updated'));
  };

  const handleAddImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const next = [
        {
          id: `PF-${Date.now()}`,
          name: file.name,
          dataUrl: reader.result
        },
        ...customImages
      ];
      persistImages(next);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleAddImage(file);
    event.target.value = '';
  };

  const handleEditChange = (event) => {
    const file = event.target.files?.[0];
    if (!file || !editingId) return;
    const reader = new FileReader();
    reader.onload = () => {
      const next = customImages.map((item) =>
        item.id === editingId ? { ...item, name: file.name, dataUrl: reader.result } : item
      );
      persistImages(next);
      setEditingId(null);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleDeleteImage = (id) => {
    persistImages(customImages.filter((item) => item.id !== id));
  };

  const handleAddMethod = () => {
    if (!newMethodLabel.trim()) return;
    const value = newMethodValue.trim() || newMethodLabel.trim();
    const next = [...paymentOptions, { value, label: newMethodLabel.trim() }];
    setPaymentOptions(next);
    localStorage.setItem('payment_options', JSON.stringify(next));
    setNewMethodLabel('');
    setNewMethodValue('');
  };

  const handleRemoveMethod = (value) => {
    const next = paymentOptions.filter((opt) => opt.value !== value);
    setPaymentOptions(next);
    localStorage.setItem('payment_options', JSON.stringify(next));
  };

  const handleQrisImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setQrisImagePreview(result);
      localStorage.setItem('qris_image', result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <UserCircle className="text-blue-700" size={26} />
          <h1 className="text-2xl font-bold text-blue-900">Edit Profil Perusahaan</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">Update Profil Anda</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 max-w-4xl w-full">
        {showSuccessPopup && (
          <div className="bg-green-500 text-white rounded-lg p-3 mb-5 flex items-center gap-2">
            <FileCheck className="text-white" size={18} />
            <p className="font-semibold text-sm">Profil Perusahaan Anda Berhasil Diupdate</p>
          </div>
        )}
        
        <div className="space-y-5">
          <div>
            <label className="block text-slate-600 font-semibold text-sm mb-2">Deskripsi Perusahaan</label>
            <textarea
              value={profile.description}
              onChange={(e) => setProfile({...profile, description: e.target.value})}
              className={`w-full border ${errors.description ? 'border-red-500' : 'border-slate-300'} rounded-xl px-4 py-3 h-40`}
              disabled={loading}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-slate-600 font-semibold text-sm mb-2">Alamat</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({...profile, address: e.target.value})}
              className={`w-full border ${errors.address ? 'border-red-500' : 'border-slate-300'} rounded-xl px-4 py-2.5`}
              disabled={loading}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-slate-600 font-semibold text-sm mb-2">Link Google Maps</label>
            <input
              type="text"
              value={profile.mapsLink}
              onChange={(e) => setProfile({...profile, mapsLink: e.target.value})}
              className={`w-full border ${errors.mapsLink ? 'border-red-500' : 'border-slate-300'} rounded-xl px-4 py-2.5`}
              disabled={loading}
            />
            {errors.mapsLink && <p className="text-red-500 text-xs mt-1">{errors.mapsLink}</p>}
          </div>

          <div>
            <label className="block text-slate-600 font-semibold text-sm mb-2">Nomor Telepon</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className={`w-full border ${errors.phone ? 'border-red-500' : 'border-slate-300'} rounded-xl px-4 py-2.5`}
              disabled={loading}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
            onClick={handleSaveChanges}
            disabled={loading}
          >
            Simpan Perubahan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 max-w-4xl w-full mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Edit Portofolio</h2>
          <p className="text-xs text-slate-500">
            Tambahkan, ganti, atau hapus foto portofolio.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Tambah Foto
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={editInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleEditChange}
          />
        </div>

        {customImages.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada foto portofolio.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {customImages.map((item) => (
              <div key={item.id} className="relative rounded-xl overflow-hidden">
                <img
                  src={item.dataUrl}
                  alt={item.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      editInputRef.current?.click();
                    }}
                    className="px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-semibold"
                  >
                    Ganti
                  </button>
                  <button
                    onClick={() => handleDeleteImage(item.id)}
                    className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 max-w-4xl w-full mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Edit Metode Pembayaran</h2>
          <p className="text-xs text-slate-500">
            Tambahkan metode pembayaran dan atur gambar QRIS.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="Label metode (contoh: BCA 123456)"
            className="rounded-xl border border-slate-200 px-4 py-2"
            value={newMethodLabel}
            onChange={(e) => setNewMethodLabel(e.target.value)}
          />
          <input
            type="text"
            placeholder="Value (opsional)"
            className="rounded-xl border border-slate-200 px-4 py-2"
            value={newMethodValue}
            onChange={(e) => setNewMethodValue(e.target.value)}
          />
        </div>
        <button
          onClick={handleAddMethod}
          className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800"
        >
          Tambah Metode
        </button>

        <div className="mt-4 flex flex-wrap gap-2">
          {paymentOptions.map((opt) => (
            <div
              key={opt.value}
              className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs"
            >
              <span>{opt.label}</span>
              <button
                onClick={() => handleRemoveMethod(opt.value)}
                className="text-red-500 font-semibold"
              >
                x
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            Ganti Gambar QRIS
          </label>
          <input type="file" accept="image/*" onChange={handleQrisImageChange} />
          {qrisImagePreview && (
            <div className="mt-3">
              <img
                src={qrisImagePreview}
                alt="QRIS"
                className="w-40 h-40 object-contain rounded-xl border border-slate-200 bg-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfil;
