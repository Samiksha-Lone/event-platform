import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Navbar from '../components/Navbar';
import AiDescriptionModal from '../components/AiDescriptionModal';
import AiPosterModal from '../components/AiPosterModal';
import { Calendar, MapPin, Users, BookOpen, Link as LinkIcon, Image as ImageIcon, Sparkles, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../hooks/useEvents';
import { useToast } from '../context/ToastContext';

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { editEvent } = useEvents();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageMode, setImageMode] = useState('keep');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [isDetectingCategory, setIsDetectingCategory] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'tech',
    capacity: '',
    date: '',
    time: '',
    eventType: 'offline',
    location: '',
    meetingPlatform: 'zoom',
    meetingLink: '',
    meetingPassword: '',
    imageFile: null,
    imageUrl: '',
    existingImage: '',
  });

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
          eventType: ev.eventType || 'offline',
          location: ev.location || '',
          meetingPlatform: ev.meetingPlatform || 'zoom',
          meetingLink: ev.meetingLink || '',
          meetingPassword: ev.meetingPassword || '',
          imageFile: null,
          imageUrl: '',
          existingImage: ev.image || '',
        });
      } catch {
        addToast('Failed to load event details.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, addToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e) => {
    setForm((prev) => ({ ...prev, imageFile: e.target.files[0] }));
    setImageMode('file');
  };

  const detectCategory = () => {
    setIsDetectingCategory(true);
    setTimeout(() => {
      const text = (form.title + " " + form.description).toLowerCase();
      let suggested = "other";
      if (text.match(/code|tech|software|dev|ai|data|web|app|react|python|js/)) suggested = "tech";
      else if (text.match(/music|concert|band|dj|song|dance/)) suggested = "music";
      else if (text.match(/sports|football|soccer|gym|fitness|match/)) suggested = "sports";
      else if (text.match(/food|eat|cook|chef|dinner|restaurant/)) suggested = "food";
      else if (text.match(/health|gym|yoga|fitness|medical|doctor|wellness|mental/)) suggested = "health";
      else if (text.match(/learn|school|college|workshop|study|class|course|training/)) suggested = "education";
      else if (text.match(/workshop|hands-on|build|create|seminar/)) suggested = "workshop";
      else if (text.match(/party|meet|social|hangout|gathering|friends/)) suggested = "social";
      
      setForm(prev => ({ ...prev, category: suggested }));
      setIsDetectingCategory(false);
      addToast(`Suggested category: ${suggested.toUpperCase()}`, "info");
    }, 1200);
  };

  const calculateViralScore = () => {
    let score = 0;
    if (form.title.length > 15) score += 20;
    if (form.description.length > 150) score += 30;
    if (form.imageUrl || form.imageFile || form.existingImage) score += 30;
    if (form.capacity > 50) score += 10;
    if (form.location.length > 10) score += 10;
    return score;
  };

  const viralScore = calculateViralScore();

  const getTimeSuggestion = () => {
    const suggestions = {
      tech: "Mid-morning (10:00 AM) is best for focus.",
      music: "Evening (7:00 PM) creates the best vibe.",
      sports: "Weekend mornings (9:00 AM) are peak energy.",
      food: "Lunchtime (12:30 PM) or Dinner (7:30 PM) is ideal.",
      health: "Morning (8:00 AM) is best for health activities.",
      education: "Morning (9:00 AM) is ideal for learning.",
      workshop: "Morning (10:00 AM) provides great focus for workshops.",
      social: "Evening (6:00 PM) is the best time for social events.",
      other: "Afternoons (2:00 PM) usually work for most."
    };
    return suggestions[form.category] || suggestions.other;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!form.title || !form.description || !form.capacity || !form.date || !form.time || !form.eventType) {
      addToast('Please fill all required fields.', 'error');
      setSaving(false);
      return;
    }

    if (form.eventType === "offline" && !form.location) {
      addToast('Location is required for in-person events.', 'error');
      setSaving(false);
      return;
    }

    if (form.eventType === "online" && (!form.meetingPlatform || !form.meetingLink)) {
      addToast('Meeting platform and link are required for online events.', 'error');
      setSaving(false);
      return;
    }

    try {
      let res;

      const baseData = {
        title: form.title,
        description: form.description,
        category: form.category,
        capacity: form.capacity,
        date: form.date,
        time: form.time,
        eventType: form.eventType,
      };

      const eventData = form.eventType === "offline" 
        ? { ...baseData, location: form.location }
        : { 
            ...baseData, 
            meetingPlatform: form.meetingPlatform,
            meetingLink: form.meetingLink,
            meetingPassword: form.meetingPassword || undefined
          };

      if (imageMode === 'file' && form.imageFile) {
        const formdata = new FormData();
        Object.keys(eventData).forEach(key => {
          if (eventData[key] !== undefined) {
            formdata.append(key, eventData[key]);
          }
        });
        formdata.append('image', form.imageFile);

        res = await api.put(`/event/${id}`, formdata);
      }
      else if (imageMode === 'url' && form.imageUrl) {
        res = await api.put(
          `/event/${id}`,
          { ...eventData, imageUrl: form.imageUrl }
        );
      }
      else {
        res = await api.put(
          `/event/${id}`,
          eventData
        );
      }

      const updated = {
        ...res.data.event,
        owner: user?.id || user?._id || res.data.event.owner
      };
      editEvent(updated);
      addToast(res.data?.message || 'Event updated successfully!', 'success');
      setTimeout(() => navigate('/user-dashboard'), 1500);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update event', 'error');
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

            <div className="p-6 bg-white border shadow-xl dark:bg-neutral-900 rounded-xl border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
                <div>
                  <h1 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">
                    Edit Event
                  </h1>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Update the details of your event
                  </p>
                </div>

                <div className="p-3 border rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border-neutral-100 dark:border-neutral-800/50 min-w-50">
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
                  <label className="block mb-1.5 text-sm font-bold text-neutral-700 dark:text-gray-300">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-base bg-white border-2 border-neutral-300 rounded-lg dark:bg-white/10 dark:border-neutral-600 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-bold text-neutral-700 dark:text-gray-300">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAiModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-indigo-600 transition-all border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
                    >
                      <Sparkles size={12} />
                      ✨ Generate with AI
                    </button>
                  </div>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2.5 text-base bg-white border-2 border-neutral-300 rounded-lg dark:bg:white/10 dark:border-neutral-600 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                   <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-bold text-neutral-700 dark:text-gray-300">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={detectCategory}
                      disabled={isDetectingCategory}
                      className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 transition-all border border-indigo-200 rounded-full bg-white hover:bg-indigo-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-indigo-400"
                    >
                      {isDetectingCategory ? (
                        <div className="w-2.5 h-2.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles size={10} />
                      )}
                      AI Suggest
                    </button>
                  </div>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-base bg-white border-2 border-neutral-300 rounded-lg dark:bg:white/10 dark:border-neutral-600 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    <label className="block mb-1.5 text-sm font-bold text-neutral-700 dark:text-gray-300">
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1.5 text-sm font-bold text-neutral-700 dark:text-gray-300">
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
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-bold text-neutral-700 dark:text-gray-300">
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
                      className="w-full px-5 py-4 text-lg bg-white border-2 border-neutral-300 rounded-xl dark:bg:white/10 dark:border-neutral-600 text-neutral-900 dark:text:white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    <label className="block mb-1.5 text-sm font-bold text-neutral-700 dark:text-gray-300">
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
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1.5 text-sm font-bold text-neutral-700 dark:text-gray-300">
                        Meeting Platform <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="meetingPlatform"
                        value={form.meetingPlatform}
                        onChange={handleChange}
                        className="w-full px-5 py-4 text-lg bg-white border-2 border-neutral-300 rounded-xl dark:bg:white/10 dark:border-neutral-600 text-neutral-900 dark:text:white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="zoom">Zoom</option>
                        <option value="google-meet">Google Meet</option>
                        <option value="microsoft-teams">Microsoft Teams</option>
                        <option value="webex">Webex</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1.5 text-sm font-bold text-neutral-700 dark:text-gray-300">
                        Meeting Link <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <LinkIcon
                          size={20}
                          className="absolute -translate-y-1/2 pointer-events:none left-4 top-1/2 text-neutral-500 dark:text-gray-400"
                        />
                        <input
                          type="url"
                          name="meetingLink"
                          value={form.meetingLink}
                          onChange={handleChange}
                          className="w-full px-5 py-4 pl-12 text-lg bg-white border-2 border-neutral-300 rounded-xl dark:bg:white/10 dark:border-neutral-600 text-neutral-900 dark:text:white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1.5 text-sm font-bold text-neutral-700 dark:text-gray-300">
                        Meeting Password <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        type="password"
                        name="meetingPassword"
                        value={form.meetingPassword}
                        onChange={handleChange}
                        className="w-full px-5 py-4 text-lg bg-white border-2 border-neutral-300 rounded-xl dark:bg:white/10 dark:border-neutral-600 text-neutral-900 dark:text:white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block mb-1.5 text-sm font-bold text-neutral-700 dark:text-gray-300">
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
                      Use URL
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageMode('url');
                        setIsPosterModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-indigo-600 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
                    >
                      <Palette size={16} />
                      ✨ AI Poster
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

                <div className="flex flex-col gap-4 pt-8 sm:flex-row">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center flex-1 gap-3 px-6 py-2.5 text-base font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
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
                    className="flex-1 px-5 py-2.5 text-base font-bold border-2 rounded-lg border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>

      <AiDescriptionModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApply={(text) => {
          setForm(prev => ({ ...prev, description: text }));
        }}
      />
      <AiPosterModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        onApply={(url) => {
          setForm(prev => ({ ...prev, imageUrl: url }));
          setImageMode('url');
        }}
        title={form.title}
        description={form.description}
      />
    </div>
  );
}
