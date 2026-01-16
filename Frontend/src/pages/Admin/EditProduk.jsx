import React, { useState } from 'react';
import { Package, Download, FileCheck, Trash2 } from 'lucide-react';

const EditProduk = () => {
  const [formData, setFormData] = useState({
    jenisBordir: 'Bordir 10 warna, Bordir biasa, Bordir 5 warna',
    ukuranBordir: '25-30 CM'
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        alert('Hanya file JPG dan PNG yang diperbolehkan');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    // Reset errors
    setErrors({});
    
    // Form validation
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
    
    try {
      // Prepare form data for API submission
      const productData = new FormData();
      productData.append('jenisBordir', formData.jenisBordir);
      productData.append('ukuranBordir', formData.ukuranBordir);
      
      if (selectedImage) {
        productData.append('image', selectedImage);
      }
      
      // Here you would typically send the data to your backend
      console.log('Sending product data to API:', {
        jenisBordir: formData.jenisBordir,
        ukuranBordir: formData.ukuranBordir,
        image: selectedImage
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success popup
      setShowSuccessPopup(true);
      
      // Optional: Hide the popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Terjadi kesalahan saat menyimpan produk. Silakan coba lagi.');
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Package className="text-blue-700" size={26} />
          <h1 className="text-2xl font-bold text-blue-900">Edit Produk</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">Update Produk Anda</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 max-w-4xl w-full">
        {showSuccessPopup && (
          <div className="bg-green-500 text-white rounded-lg p-3 mb-5 flex items-center gap-2">
            <FileCheck className="text-white" size={18} />
            <p className="font-semibold text-sm">Produk Anda Berhasil Diupdate</p>
          </div>
        )}
        <div className="space-y-5">
          <div>
            <label className="block text-slate-600 font-semibold text-sm mb-2">Tambah Jenis Bordir</label>
            <input
              type="text"
              value={formData.jenisBordir}
              onChange={(e) => setFormData({...formData, jenisBordir: e.target.value})}
              className={`w-full border ${errors.jenisBordir ? 'border-red-500' : 'border-slate-300'} rounded-xl px-4 py-2.5`}
            />
            {errors.jenisBordir && <p className="text-red-500 text-xs mt-1">{errors.jenisBordir}</p>}
          </div>

          <div>
            <label className="block text-slate-600 font-semibold text-sm mb-2">Tambah Ukuran Bordir</label>
            <input
              type="text"
              value={formData.ukuranBordir}
              onChange={(e) => setFormData({...formData, ukuranBordir: e.target.value})}
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
                    className="max-h-64 mx-auto rounded-lg object-contain"
                  />
                  <button 
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
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

          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
            onClick={handleSaveChanges}
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProduk;
