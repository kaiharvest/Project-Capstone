import React, { useEffect, useMemo, useState } from 'react';
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

  const [portfolioPhotos, setPortfolioPhotos] = useState([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [portfolioForm, setPortfolioForm] = useState({
    imageFile: null,
    imagePreview: null,
  });

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

  const storageBaseUrl = useMemo(() => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    return base.replace(/\/api$/, '');
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchPortfolio = async () => {
      try {
        const response = await api.get('/admin/portfolio-photos');
        if (!isMounted) return;
        setPortfolioPhotos(response.data.data || []);
      } catch (error) {
        console.error('Gagal memuat portofolio:', error);
      } finally {
        if (isMounted) setPortfolioLoading(false);
      }
    };

    fetchPortfolio();
    return () => {
      isMounted = false;
    };
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

  const handlePortfolioImageChange = (file) => {
    if (!file) return;
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      alert('Hanya file JPG dan PNG yang diperbolehkan');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }
    setPortfolioForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleAddPortfolio = async () => {
    if (!portfolioForm.imageFile) {
      alert('Foto portofolio wajib diunggah.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', portfolioForm.imageFile);

      const response = await api.post('/admin/portfolio-photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPortfolioPhotos((prev) => [response.data, ...prev]);
      setPortfolioForm({
        imageFile: null,
        imagePreview: null,
      });
    } catch (error) {
      console.error('Gagal menambah portofolio:', error);
      alert('Gagal menambah portofolio.');
    }
  };

  const handleDeletePortfolio = async (photoId) => {
    if (!window.confirm('Hapus foto portofolio ini?')) return;
    try {
      await api.delete(`/admin/portfolio-photos/${photoId}`);
      setPortfolioPhotos((prev) => prev.filter((item) => item.id !== photoId));
    } catch (error) {
      console.error('Gagal hapus portofolio:', error);
      alert('Gagal hapus portofolio.');
    }
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
            Upload foto portofolio.
          </p>
        </div>

        {portfolioLoading ? (
          <p className="text-sm text-slate-500">Memuat...</p>
        ) : portfolioPhotos.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada foto portofolio.</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-600">Daftar Foto</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {portfolioPhotos.map((item) => {
                const imageUrl = item.image_path
                  ? `${storageBaseUrl}/storage/${encodeURI(item.image_path)}`
                  : '';
                return (
                  <div
                    key={item.id}
                    className="relative rounded-xl overflow-hidden border border-slate-200"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Portofolio"
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-slate-100" />
                    )}
                    <button
                      onClick={() => handleDeletePortfolio(item.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600"
                      title="Hapus"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="space-y-4">
          <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center">
            {portfolioForm.imagePreview ? (
              <div className="relative">
                <img
                  src={portfolioForm.imagePreview}
                  alt="Preview"
                  className="max-h-52 mx-auto rounded-lg object-contain"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  onClick={() =>
                    setPortfolioForm((prev) => ({
                      ...prev,
                      imageFile: null,
                      imagePreview: null,
                    }))
                  }
                >
                  x
                </button>
              </div>
            ) : (
              <>
                <p className="text-slate-700 font-semibold text-sm mb-2">Tambah Foto</p>
                <label className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer inline-block">
                  Pilih File
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handlePortfolioImageChange(event.target.files[0])}
                  />
                </label>
              </>
            )}
          </div>
          <button
            onClick={handleAddPortfolio}
            className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Upload Foto
          </button>
        </div>
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
