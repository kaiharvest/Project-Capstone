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
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Package className="text-slate-700" size={32} />
        <h1 className="text-3xl font-bold text-slate-900">Edit Produk</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">
        {showSuccessPopup && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6 flex items-center gap-3">
            <FileCheck className="text-green-600" size={24} />
            <p className="text-green-800 font-medium">Produk Anda Berhasil Diupdate</p>
          </div>
        )}
        <div className="space-y-6">
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Tambah Jenis Bordir</label>
            <input
              type="text"
              value={formData.jenisBordir}
              onChange={(e) => setFormData({...formData, jenisBordir: e.target.value})}
              className={`w-full border ${errors.jenisBordir ? 'border-red-500' : 'border-slate-300'} rounded-lg px-4 py-3`}
            />
            {errors.jenisBordir && <p className="text-red-500 text-sm mt-1">{errors.jenisBordir}</p>}
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Tambah Ukuran Bordir</label>
            <input
              type="text"
              value={formData.ukuranBordir}
              onChange={(e) => setFormData({...formData, ukuranBordir: e.target.value})}
              className={`w-full border ${errors.ukuranBordir ? 'border-red-500' : 'border-slate-300'} rounded-lg px-4 py-3`}
            />
            {errors.ukuranBordir && <p className="text-red-500 text-sm mt-1">{errors.ukuranBordir}</p>}
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Tambah Foto Portofolio</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center relative">
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
                  <Download className="mx-auto text-slate-400 mb-3" size={48} />
                  <p className="text-slate-700 font-medium mb-1">Unggah Gambar Produk</p>
                  <p className="text-slate-500 text-sm mb-1">PNG, JPG maksimal 5MB</p>
                  <p className="text-slate-500 text-sm mb-4">Rekomendasi ukuran foto 800x600 pixel (4:3)</p>
                  <label className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer inline-block">
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
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
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