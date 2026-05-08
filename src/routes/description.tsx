import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { MessageSquare, User, Mail, Send, CheckCircle, ArrowLeft, Phone, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/description")({
  component: DescriptionPage,
  head: () => ({
    meta: [
      { title: "Contact Us — SMS" },
      { name: "description", content: "Get in touch with SMS School Management System administration." },
    ],
  }),
});

function DescriptionPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-20">
          <div className="mx-auto max-w-2xl px-6 py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">Message Sent Successfully!</h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Thank you for contacting us. Your message has been received and our team will get back to you within 24-48 hours.
              </p>
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-3">What happens next?</h3>
                <div className="space-y-2 text-sm text-muted-foreground text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Your message is reviewed by our administration team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>We prepare a response to your inquiry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>You'll receive a reply via email or phone</span>
                  </div>
                </div>
              </div>
              <Link to="/" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Contact Us</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get in touch with our administration team. We're here to help answer your questions and provide support.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-foreground mb-6">Send us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <User className="w-4 h-4" />
                        Full Name
                      </label>
                      <input name="name" type="text" value={form.name} onChange={handleChange} required
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Enter your full name" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">I am a</label>
                      <select name="role" value={form.role} onChange={handleChange} required
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                        <option value="">Select your role</option>
                        <option value="student">Student</option>
                        <option value="parent">Parent</option>
                        <option value="teacher">Teacher</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="your@email.com" />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <MessageSquare className="w-4 h-4" />
                      Your Message
                    </label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5} required
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      placeholder="Tell us how we can help you..." />
                  </div>

                  <button type="submit"
                    className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Phone</h4>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                      <p className="text-xs text-muted-foreground mt-1">Mon-Fri: 8:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Email</h4>
                      <p className="text-sm text-muted-foreground">info@sms-school.edu</p>
                      <p className="text-xs text-muted-foreground mt-1">24/7 Support</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Address</h4>
                      <p className="text-sm text-muted-foreground">123 Education Street</p>
                      <p className="text-sm text-muted-foreground">Learning City, LC 12345</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Office Hours</h4>
                      <p className="text-sm text-muted-foreground">Monday - Friday</p>
                      <p className="text-sm text-muted-foreground">8:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Quick Response</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team typically responds to inquiries within 24 hours during business days.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-muted-foreground">Email: Within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-muted-foreground">Phone: Immediate during office hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-muted-foreground">In-person: By appointment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
