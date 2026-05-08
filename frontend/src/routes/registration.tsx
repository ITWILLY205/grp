import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { User, Calendar, Mail, Phone, Home, School, Users, CheckCircle, FileText, ArrowLeft, Upload, File } from "lucide-react";

export const Route = createFileRoute("/registration")({
  component: RegistrationPage,
  head: () => ({
    meta: [
      { title: "Student Registration — SMS" },
      { name: "description", content: "Register as a new student at SMS School Management System." },
    ],
  }),
});

function RegistrationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    parentName: "",
    parentPhone: "",
    classLevel: "",
    previousSchool: "",
    address: "",
  });
  const [previousReport, setPreviousReport] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviousReport(file);
    }
  };

  const removeFile = () => {
    setPreviousReport(null);
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
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">Registration Submitted Successfully!</h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Your registration application has been submitted and is currently under review. 
                Our administration team will contact you within 2-3 business days.
              </p>
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-3">What happens next?</h3>
                <div className="space-y-2 text-sm text-muted-foreground text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Application review by administration team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Verification of submitted documents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Contact via email or phone for next steps</span>
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
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Student Registration</h1>
            <p className="text-muted-foreground">
              Complete the form below to begin your registration process
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">First Name</label>
                      <input name="firstName" type="text" value={form.firstName} onChange={handleChange} required
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="First name" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">Last Name</label>
                      <input name="lastName" type="text" value={form.lastName} onChange={handleChange} required
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Last name" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Calendar className="w-4 h-4" />
                      Date of Birth
                    </label>
                    <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} required
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Contact Information
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="student@email.com" />
                    </div>
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="+1234567890" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Parent/Guardian Information
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">Parent/Guardian Name</label>
                      <input name="parentName" type="text" value={form.parentName} onChange={handleChange} required
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Full name" />
                    </div>
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <Phone className="w-4 h-4" />
                        Parent Phone
                      </label>
                      <input name="parentPhone" type="tel" value={form.parentPhone} onChange={handleChange} required
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="+1234567890" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <School className="w-5 h-5 text-primary" />
                    Academic Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">Class / Level</label>
                      <input name="classLevel" type="text" value={form.classLevel} onChange={handleChange} required
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="e.g. Form 3, Level 200" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">Previous School</label>
                      <input name="previousSchool" type="text" value={form.previousSchool} onChange={handleChange}
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Previous school name" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Previous Academic Report (Optional)
                      </label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <input
                          type="file"
                          id="previousReport"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        {!previousReport ? (
                          <label
                            htmlFor="previousReport"
                            className="cursor-pointer flex flex-col items-center gap-3"
                          >
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Upload className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, JPG, PNG (max. 10MB)</p>
                            </div>
                          </label>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-surface/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <File className="w-5 h-5 text-primary" />
                              <div className="text-left">
                                <p className="text-sm font-medium text-foreground">{previousReport.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(previousReport.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={removeFile}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    Address Information
                  </h3>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Home Address</label>
                    <textarea name="address" value={form.address} onChange={handleChange} rows={3}
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      placeholder="Enter your complete home address" />
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <button type="submit"
                    className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Submit Registration Application
                  </button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    By submitting, you confirm that all provided information is accurate
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
