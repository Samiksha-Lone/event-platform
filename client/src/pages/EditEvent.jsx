// src/pages/EditEvent.jsx
import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Calendar, MapPin, Users, BookOpen, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';
import Navbar from '../components/Navbar';

// API base is configured in src/utils/api.js

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams(); // /edit-event/:id
  const { user, editEvent } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageMode, setImageMode] = useState('keep'); // keep | file | url

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'tech',
    capacity: '',
    date: '',
    time: '',
    location: '',
    imageFile: null,
    imageUrl: '',
    existingImage: '',
  });

  // Load event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/event/${id}`);
        const ev = res.data.event;

        setForm({
          title: ev.title || '',
          description: ev.description || '',
          category: ev.category || 'tech',
          capacity: ev.capacity || '',
          date: ev.date?.slice(0, 10) || '',
          time: ev.time || '',
          location: ev.location || '',
          imageFile: null,
          imageUrl: '',
          existingImage: ev.image || '',
        });
      } catch (err) {
        console.error('Error loading event:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageFileChange = (e) => {
    setForm((prev) => ({ ...prev, imageFile: e.target.files[0] }));
    setError('');
    setImageMode('file');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    if (!form.title || !form.description || !form.capacity || !form.date || !form.time || !form.location) {
      setError('Please fill all required fields.');
      setSaving(false);
      return;
    }

    try {
      let res;

      // If user chose new file → multipart/form-data
      if (imageMode === 'file' && form.imageFile) {
        const formdata = new FormData();
        formdata.append('title', form.title);
        formdata.append('description', form.description);
        formdata.append('category', form.category);
        formdata.append('capacity', form.capacity);
        formdata.append('date', form.date);
        formdata.append('time', form.time);
        formdata.append('location', form.location);
        formdata.append('image', form.imageFile);

        res = await api.put(`/event/${id}`, formdata, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      // If user chose URL → JSON
      else if (imageMode === 'url' && form.imageUrl) {
        res = await api.put(
          `/event/${id}`,
          {
            title: form.title,
            description: form.description,
            category: form.category,
            capacity: form.capacity,
            date: form.date,
            time: form.time,
            location: form.location,
            imageUrl: form.imageUrl,
          },
          { withCredentials: true }
        );
      }
      // Keep existing image
      else {
        res = await api.put(
          `/event/${id}`,
          {
            title: form.title,
            description: form.description,
            category: form.category,
            capacity: form.capacity,
            date: form.date,
            time: form.time,
            location: form.location,
          },
          { withCredentials: true }
        );
      }

      const updated = res.data.event;
      editEvent(updated);
      setSuccess('Event updated successfully! Redirecting...');
      setTimeout(() => navigate('/user-dashboard'), 1500);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  const handleNavigate = (page) => {
    navigate(page === 'dashboard' ? '/dashboard' : `/${page}`);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-neutral-950">
        <p className="text-lg text-neutral-600 dark:text-neutral-300">
          Loading event details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-neutral-950">
      <Navbar
        user={user}
        onNavigate={handleNavigate}
        showThemeToggle={false}
        onLogout={handleLogout}
      />

      <div className="container-padding">
        <div className="site-container">
          <main className="main-content">
            {success && (
              <div className="p-4 mb-4 text-green-700 border border-green-300 shadow-md bg-green-50 dark:bg-green-500/10 dark:text-green-400 dark:border-green-600/50 rounded-2xl">
                <p className="text-lg font-semibold">{success}</p>
              </div>
            )}

            {error && (
              <div className="p-4 mb-4 text-red-700 border border-red-300 shadow-md bg-red-50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-600/50 rounded-2xl">
                <p className="text-lg font-semibold">{error}</p>
              </div>
            )}

            <div className="p-8 bg-white border shadow-xl dark:bg-neutral-900 rounded-2xl border-neutral-200 dark:border-neutral-800">
              <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white">
                  Edit Event
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Update the details of your event
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title */}
                <div>
                  <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-lg bg-white border-2 border-neutral-300 rounded-xl dark:bg-white/10 dark:border-neutral-600 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-5 py-4 text-lg bg-white border-2 border-neutral-300 rounded-xl dark:bg:white/10 dark:border-neutral-600 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Category & Capacity */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300">
                      Category
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-lg bg-white border-2 border-neutral-300 rounded-xl dark:bg:white/10 dark:border-neutral-600 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="tech">Tech</option>
                      <option value="music">Music</option>
                      <option value="sports">Sports</option>
                      <option value="food">Food</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300">
                      Capacity <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Users
                        size={20}
                        className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2 text-neutral-500 dark:text-gray-400"
                      />
                      <input
                        type="number"
                        name="capacity"
                        value={form.capacity}
                        onChange={handleChange}
                        min="1"
                        className="w-full px-5 py-4 pl-12 text-lg bg-white border-2 border-neutral-300 rounded-xl dark:bg:white/10 dark:border-neutral-600 text-neutral-900 dark:text:white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar
                        size={20}
                        className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2 text-neutral-500 dark:text-gray-400"
                      />
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="w-full px-5 py-4 pl-12 text-lg bg-white border-2 border-neutral-300 rounded-xl dark:bg:white/10 dark:border-neutral-600 text-neutral-900 dark:text:white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-lg bg-white border-2 border-neutral-300 rounded-xl dark:bg:white/10 dark:border-neutral-600 text-neutral-900 dark:text:white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      size={20}
                      className="absolute -translate-y-1/2 pointer-events:none left-4 top-1/2 text-neutral-500 dark:text-gray-400"
                    />
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full px-5 py-4 pl-12 text-lg bg-white border-2 border-neutral-300 rounded-xl dark:bg:white/10 dark:border-neutral-600 text-neutral-900 dark:text:white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Image section */}
                <div>
                  <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300">
                    Event Image
                  </label>

                  {form.existingImage && (
                    <div className="mb-3">
                      <p className="mb-1 text-sm text-neutral-600 dark:text-neutral-400">
                        Current image:
                      </p>
                      <img
                        src={form.existingImage}
                        alt="Current"
                        className="object-cover h-32 border rounded-lg border-neutral-200 dark:border-neutral-700"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setImageMode('keep')}
                      className={`px-3 py-2 text-sm rounded-lg border ${
                        imageMode === 'keep'
                          ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                          : 'border-neutral-300 text-neutral-700 bg-white'
                      }`}
                    >
                      Keep current
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('file')}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border ${
                        imageMode === 'file'
                          ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                          : 'border-neutral-300 text-neutral-700 bg-white'
                      }`}
                    >
                      <ImageIcon size={16} />
                      Upload new file
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border ${
                        imageMode === 'url'
                          ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                          : 'border-neutral-300 text-neutral-700 bg-white'
                      }`}
                    >
                      <LinkIcon size={16} />
                      Use new URL
                    </button>
                  </div>

                  {imageMode === 'file' && (
                    <div className="relative p-6 text-center border-2 border-dashed rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-700 hover:border-indigo-400 dark:hover:border-indigo-500">
                      <input
                        type="file"
                        onChange={handleImageFileChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-2">
                        <BookOpen
                          size={40}
                          className="mx-auto text-neutral-500 dark:text-gray-400"
                        />
                        <p className="text-sm text-neutral-700 dark:text-white">
                          {form.imageFile
                            ? form.imageFile.name
                            : 'Click to upload a new image'}
                        </p>
                      </div>
                    </div>
                  )}

                  {imageMode === 'url' && (
                    <input
                      type="url"
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/new-image.jpg"
                      className="w-full px-5 py-4 text-lg bg-white border-2 border-neutral-300 rounded-xl dark:bg:white/10 dark:border-neutral-600 text-neutral-900 dark:text:white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4 pt-8 sm:flex-row">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center flex-1 gap-3 px-8 py-4 text-xl font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400"
                  >
                    {saving ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin" />
                        <span>Saving changes...</span>
                      </>
                    ) : (
                      <>
                        <BookOpen size={24} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/user-dashboard')}
                    className="flex-1 px-6 py-4 text-lg font-bold border-2 rounded-xl border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
