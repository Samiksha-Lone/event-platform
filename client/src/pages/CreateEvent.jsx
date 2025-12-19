import { useState } from "react";
import axios from "axios";
import { ArrowLeft, Calendar, MapPin, Users, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import Navbar from "../components/Navbar"; // Your Navbar component

const CreateEvent = () => {
  const navigate = useNavigate();
  const { addEvent, user } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Technology",
    capacity: "",
    date: "",
    time: "",
    location: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simple validation
    if (!form.title || !form.description || !form.capacity || !form.date || !form.time || !form.location || !form.image) {
      setError("Please fill all fields and select image");
      setLoading(false);
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append('title', form.title);
      formdata.append('description', form.description);
      formdata.append('category', form.category);
      formdata.append('capacity', form.capacity);
      formdata.append('date', form.date);
      formdata.append('time', form.time);
      formdata.append('location', form.location);
      formdata.append('image', form.image);

      const response = await axios.post(
        "http://localhost:3000/event/create",
        formdata,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      // Transform backend event to match frontend schema
      const mongoId = response.data.event._id?.toString() || '';
      const eventData = {
        ...response.data.event,
        id: mongoId,
        time: form.time,
        category: form.category,
        attending: 1,
        organizer: user?.name || 'Unknown Organizer'
      };
      addEvent(eventData);
      setSuccess("Event created successfully! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (error) {
      setError(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page) => {
    navigate(page === 'dashboard' ? '/dashboard' : `/${page}`);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
  <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-neutral-950">
    {/* Navbar - With theme toggle */}
    <Navbar
      user={user}
      onNavigate={handleNavigate}
      showThemeToggle={true}
      onLogout={handleLogout}
    />

    {/* Main Content */}
    <div className="container-padding">
      <div className="site-container">
        <main className="main-content">
          {/* Success Message */}
          {success && (
            <div className="p-4 mb-4 text-green-700 dark:text-green-400 border shadow-md border-green-300 dark:border-green-600/50 bg-green-50 dark:bg-green-500/10 rounded-2xl transition-colors duration-500">
              <p className="text-lg font-semibold">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 mb-4 text-red-700 dark:text-red-400 border shadow-md border-red-300 dark:border-red-600/50 bg-red-50 dark:bg-red-500/10 rounded-2xl transition-colors duration-500">
              <p className="text-lg font-semibold">{error}</p>
            </div>
          )}

          {/* Form Card */}
          <div className="p-8 shadow-xl border bg-white dark:bg-neutral-900 rounded-2xl border-neutral-200 dark:border-neutral-800 transition-colors duration-500">
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white transition-colors duration-500">Create New Event</h1>
              <p className="text-neutral-600 dark:text-neutral-400 transition-colors duration-500">
                Fill out the details to create your event
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Event Title */}
              <div>
                <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300 transition-colors duration-500">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Tech Conference 2025"
                  className="w-full px-5 py-4 text-lg transition-all duration-200 bg-white dark:bg-white/10 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300 transition-colors duration-500">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your event in detail..."
                  rows="4"
                  className="w-full px-5 py-4 text-lg transition-all duration-200 bg-white dark:bg-white/10 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical"
                  required
                />
              </div>

              {/* Two Column Layout - Category & Capacity */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Category */}
                <div>
                  <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300 transition-colors duration-500">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-lg transition-all duration-200 bg-white dark:bg-white/10 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Technology</option>
                    <option>Business</option>
                    <option>Sports</option>
                    <option>Entertainment</option>
                    <option>Education</option>
                    <option>Health</option>
                    <option>Travel</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Capacity */}
                <div>
                  <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300 transition-colors duration-500">
                    Capacity <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Users
                      size={20}
                      className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2 text-neutral-500 dark:text-gray-400 transition-colors duration-500"
                    />
                    <input
                      type="number"
                      name="capacity"
                      value={form.capacity}
                      onChange={handleChange}
                      placeholder="Max attendees"
                      min="1"
                      className="w-full px-5 py-4 pl-12 text-lg transition-all duration-200 bg-white dark:bg-white/10 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Date */}
                <div>
                  <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300 transition-colors duration-500">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar
                      size={20}
                      className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2 text-neutral-500 dark:text-gray-400 transition-colors duration-500"
                    />
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full px-5 py-4 pl-12 text-lg transition-all duration-200 bg-white dark:bg-white/10 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300 transition-colors duration-500">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-lg transition-all duration-200 bg-white dark:bg-white/10 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300 transition-colors duration-500">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin
                    size={20}
                    className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2 text-neutral-500 dark:text-gray-400 transition-colors duration-500"
                  />
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g., New York Convention Center"
                    className="w-full px-5 py-4 pl-12 text-lg transition-all duration-200 bg-white dark:bg-white/10 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block mb-3 text-base font-bold text-neutral-700 dark:text-gray-300 transition-colors duration-500">
                  Event Image <span className="text-red-500">*</span>
                </label>
                <div className="relative p-8 text-center transition-colors border-2 border-dashed rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors duration-300">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className="space-y-2">
                    <BookOpen size={48} className="mx-auto text-neutral-500 dark:text-gray-400 transition-colors duration-500" />
                    <p className="text-lg font-semibold text-neutral-900 dark:text-white transition-colors duration-500">
                      {form.image ? form.image.name : 'Click to upload event image'}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-gray-400 transition-colors duration-500">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col gap-4 pt-8 sm:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center flex-1 gap-3 px-8 py-4 text-xl font-bold text-white transition-all duration-200 bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin" />
                      <span>Creating Event...</span>
                    </>
                  ) : (
                    <>
                      <BookOpen size={24} />
                      <span>Create Event</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 px-6 py-4 text-lg font-bold rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-300"
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
};

export default CreateEvent;