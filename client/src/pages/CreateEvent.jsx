import { useState } from "react";
import { api } from '../utils/api';
import { Calendar, MapPin, Users, BookOpen, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEvents } from '../hooks/useEvents';
import Navbar from "../components/Navbar";
import { useToast } from "../context/ToastContext";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addEvent } = useEvents();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [imageMode, setImageMode] = useState("file");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "tech",
    capacity: "",
    date: "",
    time: "",
    eventType: "offline",
    location: "",
    meetingPlatform: "zoom",
    meetingLink: "",
    meetingPassword: "",
    imageFile: null,
    imageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e) => {
    setForm((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !form.title ||
      !form.description ||
      !form.capacity ||
      !form.date ||
      !form.time ||
      !form.eventType ||
      (form.eventType === "offline" && !form.location) ||
      (form.eventType === "online" && (!form.meetingPlatform || !form.meetingLink)) ||
      (imageMode === "file" && !form.imageFile) ||
      (imageMode === "url" && !form.imageUrl)
    ) {
      addToast("Please fill all required fields and provide an event image.", "error");
      setLoading(false);
      return;
    }

      try {

        let response;

        if (imageMode === "file") {
          const formdata = new FormData();
          formdata.append("title", form.title);
          formdata.append("description", form.description);
          formdata.append("category", form.category);
          formdata.append("capacity", form.capacity);
          formdata.append("date", form.date);
          formdata.append("time", form.time);
          formdata.append("eventType", form.eventType);
          formdata.append("image", form.imageFile);
          
          if (form.eventType === "offline") {
            formdata.append("location", form.location);
          } else {
            formdata.append("meetingPlatform", form.meetingPlatform);
            formdata.append("meetingLink", form.meetingLink);
            if (form.meetingPassword) {
              formdata.append("meetingPassword", form.meetingPassword);
            }
          }

          response = await api.post('/event/create', formdata);
      } else {
        const eventData = {
          title: form.title,
          description: form.description,
          category: form.category,
          capacity: form.capacity,
          date: form.date,
          time: form.time,
          eventType: form.eventType,
          imageUrl: form.imageUrl,
        };

        if (form.eventType === "offline") {
          eventData.location = form.location;
        } else {
          eventData.meetingPlatform = form.meetingPlatform;
          eventData.meetingLink = form.meetingLink;
          if (form.meetingPassword) {
            eventData.meetingPassword = form.meetingPassword;
          }
        }

        response = await api.post('/event/create', eventData);
      }

      const mongoId = response.data.event._id?.toString() || "";
      const eventData = {
        ...response.data.event,
        id: mongoId,
        owner: user?.id || user?._id || response.data.event.owner,
        time: form.time,
        category: form.category,
        attending: 1,
        organizer: user?.name || "Unknown Organizer",
      };

      addEvent(eventData);
      addToast(response.data?.message || "Event created successfully!", "success");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to create event", "error");
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

            <div className="p-6 transition-colors duration-500 bg-white border shadow-xl dark:bg-neutral-900 rounded-xl border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
                <div>
                  <h1 className="mb-2 text-2xl font-bold transition-colors duration-500 text-neutral-900 dark:text-white">
                    Create New Event
                  </h1>
                  <p className="text-sm transition-colors duration-500 text-neutral-600 dark:text-neutral-400">
                    Fill out the details to create your event
                  </p>
                </div>
                
                <div className="p-3 border rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border-neutral-100 dark:border-neutral-800/50 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-neutral-500 dark:text-neutral-400">
                      Viral Potential
                    </span>
                    <span className={`text-xs font-bold ${viralScore > 70 ? 'text-green-500' : viralScore > 40 ? 'text-orange-500' : 'text-neutral-400'}`}>
                      {viralScore}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out rounded-full ${viralScore > 70 ? 'bg-green-500' : viralScore > 40 ? 'bg-orange-500' : 'bg-neutral-400'}`}
                      style={{ width: `${viralScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-1.5 text-sm font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Tech Conference 2025"
                    className="w-full px-4 py-2.5 text-base transition-all duration-200 bg-white border-2 dark:bg-white/10 border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-sm font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your event in detail..."
                    rows="4"
                    className="w-full px-4 py-2.5 text-base transition-all duration-200 bg-white border-2 dark:bg-white/10 border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                   <label className="block mb-1.5 text-sm font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
                      Category
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-base transition-all duration-200 bg-white border-2 dark:bg-white/10 border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="tech">Tech</option>
                      <option value="music">Music</option>
                      <option value="sports">Sports</option>
                      <option value="food">Food</option>
                      <option value="health">Health</option>
                      <option value="education">Education</option>
                      <option value="workshop">Workshop</option>
                      <option value="social">Social</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-sm font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
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
                        className="w-full px-4 py-2.5 pl-12 text-base transition-all duration-200 bg-white border-2 dark:bg-white/10 border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1.5 text-sm font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
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
                        className="w-full px-4 py-2.5 pl-12 text-base transition-all duration-200 bg-white border-2 dark:bg-white/10 border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
                        Time <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] font-medium text-indigo-500 dark:text-indigo-400 animate-pulse">
                        💡 {getTimeSuggestion()}
                      </span>
                    </div>
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-base transition-all duration-200 bg-white border-2 dark:bg-white/10 border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 text-sm font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, eventType: "offline" }))}
                      className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                        form.eventType === "offline"
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border-2 border-neutral-300 dark:border-neutral-700"
                      }`}
                    >
                      <MapPin size={18} className="inline mr-2" />
                      In-Person
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, eventType: "online" }))}
                      className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                        form.eventType === "online"
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border-2 border-neutral-300 dark:border-neutral-700"
                      }`}
                    >
                      <LinkIcon size={18} className="inline mr-2" />
                      Online
                    </button>
                  </div>
                </div>

                {form.eventType === "offline" ? (
                  <div>
                    <label className="block mb-1.5 text-sm font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
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
                        className="w-full px-4 py-2.5 pl-12 text-base transition-all duration-200 bg-white border-2 dark:bg:white/10 border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1.5 text-sm font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
                        Meeting Platform <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="meetingPlatform"
                        value={form.meetingPlatform}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 text-base transition-all duration-200 bg-white border-2 dark:bg-white/10 border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="zoom">Zoom</option>
                        <option value="google-meet">Google Meet</option>
                        <option value="microsoft-teams">Microsoft Teams</option>
                        <option value="webex">Webex</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1.5 text-sm font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
                        Meeting Link <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <LinkIcon
                          size={20}
                          className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2 text-neutral-500 dark:text-gray-400"
                        />
                        <input
                          type="url"
                          name="meetingLink"
                          value={form.meetingLink}
                          onChange={handleChange}
                          placeholder="e.g., https://zoom.us/j/123456789"
                          className="w-full px-4 py-2.5 pl-12 text-base transition-all duration-200 bg-white border-2 dark:bg:white/10 border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1.5 text-sm font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
                        Meeting Password <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        type="password"
                        name="meetingPassword"
                        value={form.meetingPassword}
                        onChange={handleChange}
                        placeholder="Leave empty if no password required"
                        className="w-full px-4 py-2.5 text-base transition-all duration-200 bg-white border-2 dark:bg:white/10 border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block mb-1.5 text-sm font-bold transition-colors duration-500 text-neutral-700 dark:text-gray-300">
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
                      Use URL
                    </button>
                  </div>

                  {imageMode === "file" ? (
                    <div className="relative p-6 text-center transition-colors duration-300 border-2 border-dashed rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-700 hover:border-indigo-400 dark:hover:border-indigo-500">
                      <input
                        type="file"
                        onChange={handleImageFileChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-2">
                        <BookOpen
                          size={32}
                          className="mx-auto transition-colors duration-500 text-neutral-500 dark:text-gray-400"
                        />
                        <p className="text-base font-semibold transition-colors duration-500 text-neutral-900 dark:text-white">
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
                      className="w-full px-4 py-2.5 text-base transition-all duration-200 bg-white border-2 dark:bg-white/10 border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-4 pt-8 sm:flex-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center flex-1 gap-3 px-6 py-2.5 text-base font-bold text-white transition-all duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
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
                    className="flex-1 px-5 py-2.5 text-base font-bold transition-colors duration-300 border-2 rounded-lg border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700"
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
