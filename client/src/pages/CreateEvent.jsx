import { useState } from "react";
import { api } from '../utils/api';
import { Calendar, MapPin, Users, BookOpen, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import Navbar from "../components/Navbar";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { addEvent, user } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageMode, setImageMode] = useState("file"); // 'file' or 'url'

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "tech",
    capacity: "",
    date: "",
    time: "",
    location: "",
    imageFile: null,
    imageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleImageFileChange = (e) => {
    setForm((prev) => ({ ...prev, imageFile: e.target.files[0] }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (
      !form.title ||
      !form.description ||
      !form.capacity ||
      !form.date ||
      !form.time ||
      !form.location ||
      (imageMode === "file" && !form.imageFile) ||
      (imageMode === "url" && !form.imageUrl)
    ) {
      setError("Please fill all fields and provide an event image.");
      setLoading(false);
      return;
    }

    try {
      let response;

      if (imageMode === "file") {
        // multipart/form-data with file upload
        const formdata = new FormData();
        formdata.append("title", form.title);
        formdata.append("description", form.description);
        formdata.append("category", form.category);
        formdata.append("capacity", form.capacity);
        formdata.append("date", form.date);
        formdata.append("time", form.time);
        formdata.append("location", form.location);
        formdata.append("image", form.imageFile);

        response = await api.post('/event/create', formdata, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // JSON body with imageUrl (backend must support this)
        response = await api.post(
          '/event/create',
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

      const mongoId = response.data.event._id?.toString() || "";
      const eventData = {
        ...response.data.event,
        id: mongoId,
        time: form.time,
        category: form.category,
        attending: 1,
        organizer: user?.name || "Unknown Organizer",
      };

      addEvent(eventData);
      setSuccess("Event created successfully! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page) => {
    navigate(page === "dashboard" ? "/dashboard" : `/${page}`);
  };

  const handleLogout = () => {
    navigate("/login");
  };

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
              <div className="p-4 mb-4 text-green-700 transition-colors duration-500 border border-green-300 shadow-md dark:text-green-400 dark:border-green-600/50 bg-green-50 dark:bg-green-500/10 rounded-2xl">
                <p className="text-lg font-semibold">{success}</p>
              </div>
            )}

            {error && (
              <div className="p-4 mb-4 text-red-700 transition-colors duration-500 border border-red-300 shadow-md dark:text-red-400 dark:border-red-600/50 bg-red-50 dark:bg-red-500/10 rounded-2xl">
                <p className="text-lg font-semibold">{error}</p>
              </div>
            )}

            <div className="p-8 transition-colors duration-500 bg-white border shadow-xl dark:bg-neutral-900 rounded-2xl border-neutral-200 dark:border-neutral-800">
              <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold transition-colors duration-500 text-neutral-900 dark:text-white">
                  Create New Event
                </h1>
                <p className="transition-colors duration-500 text-neutral-600 dark:text-neutral-400">
                  Fill out the details to create your event
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title */}
                <div>
                  <label className="block mb-3 text-base font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Tech Conference 2025"
                    className="w-full px-5 py-4 text-lg transition-all duration-200 bg-white border-2 dark:bg-white/10 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-3 text-base font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your event in detail..."
                    rows="4"
                    className="w-full px-5 py-4 text-lg transition-all duration-200 bg-white border-2 dark:bg-white/10 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical"
                    required
                  />
                </div>

                {/* Category & Capacity */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <label className="block mb-3 text-base font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
                      Category
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-lg transition-all duration-200 bg-white border-2 dark:bg-white/10 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="tech">Tech</option>
                      <option value="music">Music</option>
                      <option value="sports">Sports</option>
                      <option value="food">Food</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-3 text-base font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
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
                        placeholder="Max attendees"
                        min="1"
                        className="w-full px-5 py-4 pl-12 text-lg transition-all duration-200 bg-white border-2 dark:bg-white/10 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <label className="block mb-3 text-base font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
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
                        className="w-full px-5 py-4 pl-12 text-lg transition-all duration-200 bg-white border-2 dark:bg-white/10 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-3 text-base font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-lg transition-all duration-200 bg-white border-2 dark:bg-white/10 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block mb-3 text-base font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      size={20}
                      className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2 text-neutral-500 dark:text-gray-400"
                    />
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g., New York Convention Center"
                      className="w-full px-5 py-4 pl-12 text-lg transition-all duration-200 bg-white border-2 dark:bg:white/10 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Image: mode toggle + input */}
                <div>
                  <label className="block mb-3 text-base font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
                    Event Image <span className="text-red-500">*</span>
                  </label>

                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setImageMode("file")}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border ${
                        imageMode === "file"
                          ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                          : "border-neutral-300 text-neutral-700 bg-white"
                      }`}
                    >
                      <ImageIcon size={16} />
                      Upload file
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border ${
                        imageMode === "url"
                          ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                          : "border-neutral-300 text-neutral-700 bg-white"
                      }`}
                    >
                      <LinkIcon size={16} />
                      Use image URL
                    </button>
                  </div>

                  {imageMode === "file" ? (
                    <div className="relative p-8 text-center transition-colors duration-300 border-2 border-dashed rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-700 hover:border-indigo-400 dark:hover:border-indigo-500">
                      <input
                        type="file"
                        onChange={handleImageFileChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-2">
                        <BookOpen
                          size={48}
                          className="mx-auto transition-colors duration-500 text-neutral-500 dark:text-gray-400"
                        />
                        <p className="text-lg font-semibold transition-colors duration-500 text-neutral-900 dark:text-white">
                          {form.imageFile
                            ? form.imageFile.name
                            : "Click to upload event image"}
                        </p>
                        <p className="text-sm transition-colors duration-500 text-neutral-600 dark:text-gray-400">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <input
                      type="url"
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/your-image.jpg"
                      className="w-full px-5 py-4 text-lg transition-all duration-200 bg-white border-2 dark:bg-white/10 border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                </div>

                {/* Actions */}
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
                    className="flex-1 px-6 py-4 text-lg font-bold transition-colors duration-300 border-2 rounded-xl border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700"
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
