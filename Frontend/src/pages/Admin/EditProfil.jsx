import React, { useState } from 'react';
import { UserCircle, FileCheck } from 'lucide-react';

const EditProfil = () => {
  const [profile, setProfile] = useState({
    description: 'JA Bordir adalah usaha bordir yang mengutamakan kualitas, ketelitian, dan hasil akhir yang rap. Kami melayani berbagai kebutuhan bordir mulai dari seragam, logo, nama, hingga desain custom sesuai permintaan. Dengan didukung oleh tenaga profesional dan berpengalaman dan teknologi tinggi, JA Bordir berkomitmen memberikan hasil bordir yang kuat, detail, dan bernilai estetik tinggi. Kami juga bahwa setiap jahitan memiliki makna, dan setiap pesanan adalah kepercayaan. Karena itu, kami selalu mengutamakan kepuasan pelanggan melalui layanan cepat, ramah, dan hasil terbaik di setiap produk yang kami kerjakan.',
    address: 'Purwodadi, Jawa Tengah',
    mapsLink: 'https://googlemaps.com',
    phone: '082010203020'
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errors, setErrors] = useState({});

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
      const profileData = new FormData();
      profileData.append('description', profile.description);
      profileData.append('address', profile.address);
      profileData.append('mapsLink', profile.mapsLink);
      profileData.append('phone', profile.phone);

      // Here you would typically send the data to your backend
      // Example API call:
      // const response = await fetch('http://localhost:8000/api/profile/update', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`, // if authentication is required
      //   },
      //   body: profileData,
      // });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const result = await response.json();
      // console.log('Profile updated successfully:', result);

      // For demonstration purposes, I'm using a mock API call
      console.log('Sending profile data to API:', profile);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

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

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <UserCircle className="text-slate-700" size={32} />
        <h1 className="text-3xl font-bold text-slate-900">Edit Profil Perusahaan</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">
        {showSuccessPopup && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6 flex items-center gap-3">
            <FileCheck className="text-green-600" size={24} />
            <p className="text-green-800 font-medium">Profil Perusahaan Anda Berhasil Diupdate</p>
          </div>
        )}
        
        <div className="space-y-6">
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Deskripsi Perusahaan</label>
            <textarea
              value={profile.description}
              onChange={(e) => setProfile({...profile, description: e.target.value})}
              className={`w-full border ${errors.description ? 'border-red-500' : 'border-slate-300'} rounded-lg px-4 py-3 h-48`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Alamat</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({...profile, address: e.target.value})}
              className={`w-full border ${errors.address ? 'border-red-500' : 'border-slate-300'} rounded-lg px-4 py-3`}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Link Google Maps</label>
            <input
              type="text"
              value={profile.mapsLink}
              onChange={(e) => setProfile({...profile, mapsLink: e.target.value})}
              className={`w-full border ${errors.mapsLink ? 'border-red-500' : 'border-slate-300'} rounded-lg px-4 py-3`}
            />
            {errors.mapsLink && <p className="text-red-500 text-sm mt-1">{errors.mapsLink}</p>}
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Nomor Telepon</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className={`w-full border ${errors.phone ? 'border-red-500' : 'border-slate-300'} rounded-lg px-4 py-3`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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

export default EditProfil;