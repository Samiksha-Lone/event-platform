import { useState } from "react";
import axios from "axios";
import { ArrowLeft, Sun, Moon, Calendar, MapPin, Users, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateEvent = ({ toggleTheme, isDark }) => {

  const navigate = useNavigate();

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
      formdata.append('eventImage', form.image); // Exact backend match

      await axios.post(
        "http://localhost:3000/event/create",
        formdata,
        { withCredentials: true }
      );

      setSuccess("Event created! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (error) {
      setError(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0a0e27]' : 'bg-white'
      }`}>
      {/* Header */}
      <header className={`border-b ${isDark
          ? 'bg-[#1a1a2e]/80 border-[#404050]'
          : 'bg-gray-50 border-gray-200'
        }`}>
        <div className="flex items-center justify-between max-w-4xl px-6 py-6 mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${isDark
                ? 'bg-[#1a1a2e] hover:bg-[#2d2d44] text-white border border-[#404050]'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
              }`}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* Title */}
          <div className="text-center">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Create Event
            </h1>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-lg transition-all duration-200 ${isDark
                ? 'bg-[#0f1419] border border-[#404050] hover:bg-[#1a1a2e]'
                : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
              }`}
          >
            {isDark ? (
              <Sun size={20} className="text-amber-400" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl px-6 py-12 mx-auto">
        {/* Form Card */}
        <div className={`rounded-xl border p-8 ${isDark
            ? 'bg-[#1a1a2e]/80 border-[#404050]'
            : 'bg-gray-50 border-gray-200 shadow-sm'
          }`}>
          {/* Messages */}
          {error && (
            <div className={`mb-6 p-4 rounded-lg border ${isDark
                ? 'bg-red-500/20 border-red-600 text-red-300'
                : 'bg-red-50 border-red-200 text-red-700'
              }`}>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className={`mb-6 p-4 rounded-lg border ${isDark
                ? 'bg-green-500/20 border-green-600 text-green-300'
                : 'bg-green-50 border-green-200 text-green-700'
              }`}>
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Title */}
            <div>
              <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Tech Conference 2025"
                className={`w-full px-4 py-3 text-base rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${isDark
                    ? 'bg-[#0f1419] border-[#404050] text-white placeholder:text-[#606070] focus:ring-indigo-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-indigo-500'
                  }`}
              />
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your event..."
                rows="4"
                className={`w-full px-4 py-3 text-base rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent resize-none ${isDark
                    ? 'bg-[#0f1419] border-[#404050] text-white placeholder:text-[#606070] focus:ring-indigo-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-indigo-500'
                  }`}
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Category */}
              <div>
                <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-base rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${isDark
                      ? 'bg-[#0f1419] border-[#404050] text-white focus:ring-indigo-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500'
                    }`}
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
                <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                  Capacity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users
                    size={18}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-400'
                      }`}
                  />
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="Number of attendees"
                    min="1"
                    className={`w-full pl-10 pr-4 py-3 text-base rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${isDark
                        ? 'bg-[#0f1419] border-[#404050] text-white placeholder:text-[#606070] focus:ring-indigo-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-indigo-500'
                      }`}
                  />
                </div>
              </div>
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Date */}
              <div>
                <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar
                    size={18}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-400'
                      }`}
                  />
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 text-base rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${isDark
                        ? 'bg-[#0f1419] border-[#404050] text-white focus:ring-indigo-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500'
                      }`}
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-base rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${isDark
                      ? 'bg-[#0f1419] border-[#404050] text-white focus:ring-indigo-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500'
                    }`}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-400'
                    }`}
                />
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g., New York Convention Center"
                  className={`w-full pl-10 pr-4 py-3 text-base rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${isDark
                      ? 'bg-[#0f1419] border-[#404050] text-white placeholder:text-[#606070] focus:ring-indigo-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-indigo-500'
                    }`}
                />
              </div>
            </div>

            {/* Image URL (Optional) */}
            <div>
              <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                Image URL <span className="text-xs text-gray-400">(Optional)</span>
              </label>
              <input
                type="file"
                // name="image"
                // value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                accept="image/*"
                required
                placeholder="https://example.com/image.jpg"
                className={`w-full px-4 py-3 text-base rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${isDark
                    ? 'bg-[#0f1419] border-[#404050] text-white placeholder:text-[#606070] focus:ring-indigo-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-indigo-500'
                  }`}
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-4 text-base font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isDark
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
              >
                {loading ? (
                  <>
                    <span>Creating...</span>
                    <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  </>
                ) : (
                  <>
                    <BookOpen size={18} />
                    Create Event
                  </>
                )}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className={`flex-1 py-3 px-4 text-base font-bold rounded-lg transition-all duration-200 ${isDark
                    ? 'bg-[#1a1a2e] hover:bg-[#2d2d44] text-white border border-[#404050]'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
                  }`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
