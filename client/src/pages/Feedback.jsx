import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Star,
  Send,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Bug,
  Heart,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
const URL = import.meta.env.VITE_SERVER_URL
function FeedbackPage() {
  const [isVisible, setIsVisible] = useState({});
  const [selectedType, setSelectedType] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const feedbackTypes = [
    {
      id: "general",
      title: "General Feedback",
      description: "Share your overall experience",
      icon: MessageSquare,
      gradient: "from-blue-400 to-purple-500",
    },
    {
      id: "feature",
      title: "Feature Request",
      description: "Suggest new features or improvements",
      icon: Lightbulb,
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      id: "bug",
      title: "Bug Report",
      description: "Report issues or problems",
      icon: Bug,
      gradient: "from-red-400 to-pink-500",
    },
    {
      id: "appreciation",
      title: "Appreciation",
      description: "Share what you love about BackRite",
      icon: Heart,
      gradient: "from-green-400 to-blue-500",
    },
  ];

  // IntersectionObserver effect, re-run when form reappears
  useEffect(() => {
    if (isSubmitted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isSubmitted]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !selectedType ||
      rating === 0 ||
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData = {
        type: selectedType,
        rating,
        ...formData,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(`${URL}/api/send-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      console.log("Feedback sent successfully:", result);

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error sending feedback:", error);
      alert(
        "Sorry, there was an error sending your feedback. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedType("");
    setRating(0);
    setHoveredRating(0);
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setIsVisible({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-8 mx-auto">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Thank you for your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              feedback
            </span>
            !
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            We appreciate you taking the time to help us improve BackRite. Your
            input is invaluable to making our platform better for everyone.
          </p>
          <button
            onClick={resetForm}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
          >
            <ArrowLeft className="w-5 h-5" />
            Submit more feedback
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div
            className={`transform transition-all duration-700 ${
              isVisible.header
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            id="header"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium text-sm">
                Your voice matters
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.1]">
              We'd love your{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                feedback
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Help us improve BackRite by sharing your thoughts, suggestions,
              and experiences. Every piece of feedback helps us build a better
              platform.
            </p>
          </div>
        </div>
      </section>

      {/* Feedback Form Section */}
      <section className="py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900"></div>
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="space-y-8">
            {/* Feedback Type Selection */}
            <div
              className={`transform transition-all duration-700 ${
                isVisible.types
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              id="types"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                What kind of feedback would you like to share?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {feedbackTypes.map((type, index) => (
                  <div
                    key={type.id}
                    className={`group cursor-pointer bg-gray-900/50 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 ${
                      selectedType === type.id
                        ? "border-blue-500/50 bg-blue-500/5"
                        : "border-gray-800/50 hover:border-gray-700/50"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${type.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <type.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {type.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {type.description}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-auto ${
                          selectedType === type.id
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-600"
                        }`}
                      >
                        {selectedType === type.id && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Section */}
            <div
              className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8 transform transition-all duration-700 ${
                isVisible.rating
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              id="rating"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                How would you rate your overall experience?
              </h2>
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`w-12 h-12 rounded-lg transition-all duration-200 ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400"
                        : "text-gray-600"
                    } hover:scale-110`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <Star
                      className={`w-8 h-8 mx-auto ${
                        star <= (hoveredRating || rating) ? "fill-current" : ""
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-gray-400">
                {rating === 0 && "Click to rate your experience"}
                {rating === 1 && "Poor - We'll work harder to improve"}
                {rating === 2 && "Fair - There's room for improvement"}
                {rating === 3 && "Good - We're on the right track"}
                {rating === 4 && "Very Good - We're doing great!"}
                {rating === 5 && "Excellent - Thank you for your support!"}
              </p>
            </div>

            {/* Form Fields */}
            <div
              className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8 space-y-6 transform transition-all duration-700 ${
                isVisible.form
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              id="form"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="Brief summary of your feedback"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-vertical"
                  placeholder="Share your detailed feedback, suggestions, or concerns..."
                  required
                />
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !selectedType ||
                    rating === 0 ||
                    !formData.name ||
                    !formData.email ||
                    !formData.subject ||
                    !formData.message
                  }
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg ${
                    isSubmitting ||
                    !selectedType ||
                    rating === 0 ||
                    !formData.name ||
                    !formData.email ||
                    !formData.subject ||
                    !formData.message
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl hover:shadow-blue-500/25"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div
            className={`mt-12 space-y-6 transform transition-all duration-700 ${
              isVisible.info
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            id="info"
          >
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-semibold">
                  Privacy Notice
                </span>
              </div>
              <p className="text-gray-300 text-sm">
                Your feedback is important to us. We respect your privacy and
                will only use your contact information to follow up on your
                feedback if necessary. We never share your personal information
                with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default FeedbackPage;
