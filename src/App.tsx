import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Briefcase, 
  Users, 
  Compass, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import BookCallForm from './components/BookCallForm';
import ContactForm from './components/ContactForm';
import DiagnosticsInspector from './components/DiagnosticsInspector';

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Trigger diagnostic log refresh on form success
  const handleSubmissionSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-cream selection:bg-sage-light text-[#1c2b24] font-sans relative">
      {/* HEADER & MOBILE NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-md border-b border-sage/10 py-4 px-6 md:px-12 flex items-center justify-between transition-all">
        <a href="#" className="flex items-center gap-2" id="nav-logo-link">
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-sage-dark">
            Nistaran <span className="text-warm">Counselling</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-muted" id="desktop-nav-list">
          <li>
            <a href="#services" className="hover:text-sage transition-colors duration-200 uppercase text-[11px] tracking-widest">
              Services
            </a>
          </li>
          <li>
            <a href="#process" className="hover:text-sage transition-colors duration-200 uppercase text-[11px] tracking-widest">
              How It Works
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-sage transition-colors duration-200 uppercase text-[11px] tracking-widest">
              About
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-sage transition-colors duration-200 uppercase text-[11px] tracking-widest">
              Contact
            </a>
          </li>
        </ul>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <a
            href="#book-call-card"
            className="bg-sage text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-sage-dark shadow-sm hover:shadow transition-all uppercase tracking-wider"
            id="nav-desktop-cta"
          >
            Book Free Call
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded-full bg-sage-light/50 text-sage-dark hover:bg-sage-light transition-all cursor-pointer"
          aria-label="Toggle navigation menu"
          id="mobile-menu-toggle-btn"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div 
            className="absolute top-full left-0 right-0 bg-white border-b border-sage/10 p-6 flex flex-col gap-4 shadow-xl md:hidden animate-in fade-in slide-in-from-top-4 duration-200"
            id="mobile-nav-panel"
          >
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sage-dark font-medium hover:text-sage text-sm py-2 border-b border-cream"
            >
              Services Offered
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sage-dark font-medium hover:text-sage text-sm py-2 border-b border-cream"
            >
              Our 3-Step Process
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sage-dark font-medium hover:text-sage text-sm py-2 border-b border-cream"
            >
              About the Therapist
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sage-dark font-medium hover:text-sage text-sm py-2 border-b border-cream"
            >
              Contact Us & Email
            </a>
            <a
              href="#book-call-card"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-sage text-white font-semibold text-center py-3 rounded-full hover:bg-sage-dark transition-all text-sm mt-2 shadow-sm"
            >
              Book Free Call Now
            </a>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="pt-28 pb-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="hero-section">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-sage-light text-sage-dark px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
            <span className="inline-block w-2 h-2 rounded-full bg-warm animate-ping"></span>
            ✦ Professional Online Counselling &bull; Online & Offline
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-sage-dark font-bold leading-[1.12]">
            Healing begins with <br />
            <em className="font-serif italic text-warm font-normal">one honest</em> conversation.
          </h1>
          
          <p className="text-muted text-base md:text-lg max-w-xl leading-relaxed">
            Safe, virtual, and strictly confidential counseling for mental health, career direction, relationship issues, and spiritual healing — right from the comfort and privacy of your home.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <a
              href="#book-call-card"
              className="bg-sage-dark text-white rounded-full text-center font-semibold px-8 py-3.5 hover:bg-sage shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              id="hero-cta-book"
            >
              <Calendar size={18} />
              Book Free 15-min Call
            </a>
            <a
              href="#services"
              className="text-sage font-semibold text-sm hover:text-sage-dark flex items-center justify-center gap-1 group py-3"
              id="hero-cta-services"
            >
              See all services
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Interactive Highlight Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-4" id="hero-mini-cards">
          <div className="bg-white border border-sage/10 rounded-2xl p-5 hover:translate-y-[-2px] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-sage-light/80 text-sage-dark flex items-center justify-center font-medium mb-3">
              <Heart size={20} className="stroke-2" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-sage-dark mb-1">
              Mental Health Support
            </h3>
            <p className="text-muted text-xs leading-relaxed">
              Find clarity and relieve stress, anxiety, panic, depression, or burnout. Private sessions structured around your goals.
            </p>
          </div>

          <div className="bg-sage-dark text-white border border-sage-dark rounded-2xl p-5 lg:ml-6 hover:translate-y-[-2px] transition-all shadow-md">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-warm-light flex items-center justify-center font-medium mb-3">
              <Briefcase size={20} className="stroke-2" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-white mb-1">
              Career & Student Guidance
            </h3>
            <p className="text-white/80 text-xs leading-relaxed">
              Navigate decisions with psychological assessments, mapping, and mentorship for career transitions or academic struggles.
            </p>
          </div>

          <div className="bg-warm-light border border-warm/15 rounded-2xl p-5 lg:mr-6 hover:translate-y-[-2px] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-warm/20 text-warm flex items-center justify-center font-medium mb-3">
              <Users size={20} className="stroke-2" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-sage-dark mb-1">
              Couples & Marriage Support
            </h3>
            <p className="text-muted text-xs leading-relaxed">
              Resolve gridlocked conflicts, re-discover mutual respect, align expectations, and strengthen foundational bonds.
            </p>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-sage-dark text-white" id="stats-section">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="font-serif text-4xl font-bold text-warm">500+</div>
            <p className="text-white/70 text-xs uppercase tracking-wide">Clients Guided</p>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-4xl font-bold text-warm">5+</div>
            <p className="text-white/70 text-xs uppercase tracking-wide">Counselling Spheres</p>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-4xl font-bold text-warm">98%</div>
            <p className="text-white/70 text-xs uppercase tracking-wide">Client Satisfaction</p>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-4xl font-bold text-warm">M.A.</div>
            <p className="text-white/70 text-xs uppercase tracking-wide">Psychology Certified</p>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto" id="services">
        <div className="text-center md:text-left space-y-2 mb-12">
          <span className="text-warm font-semibold text-xs tracking-widest uppercase">What We Offer</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-sage-dark font-bold">
            Every mind deserves <em className="font-serif font-normal italic text-warm">dedicated care</em>
          </h2>
          <p className="text-muted text-sm sm:text-base max-w-xl">
            No judgment, no assumptions, just structured evidence-based care geared to heal, strengthen, and support your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="services-grid">
          {/* Service 1 */}
          <div className="bg-white border border-sage/10 rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all shadow-sm">
            <div className="font-serif text-4xl font-extralight text-sage-light/80 mb-2">01</div>
            <h3 className="font-serif text-xl font-semibold text-sage-dark mb-2">Mental Health Support</h3>
            <p className="text-muted text-xs leading-relaxed mb-4">
              Explore safe therapy options for anxiety, panic attacks, clinical depression, complex trauma, and psychological burnout.
            </p>
            <span className="inline-block bg-sage-light text-sage-dark text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
              CBT &bull; Mindfulness
            </span>
          </div>

          {/* Service 2 */}
          <div className="bg-white border border-sage/10 rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all shadow-sm">
            <div className="font-serif text-4xl font-extralight text-sage-light/80 mb-2">02</div>
            <h3 className="font-serif text-xl font-semibold text-sage-dark mb-2">Career & Student Counselling</h3>
            <p className="text-muted text-xs leading-relaxed mb-4">
              Unpack motivational blockages, identify ideal trajectories via validated psychology scales, and plan education choices.
            </p>
            <span className="inline-block bg-sage-light text-sage-dark text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
              Assessments &bull; Coaching
            </span>
          </div>

          {/* Service 3 */}
          <div className="bg-white border border-sage/10 rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all shadow-sm">
            <div className="font-serif text-4xl font-extralight text-sage-light/80 mb-2">03</div>
            <h3 className="font-serif text-xl font-semibold text-sage-dark mb-2">Marriage & Relationship</h3>
            <p className="text-muted text-xs leading-relaxed mb-4">
              Construct high-fidelity communication habits, handle pre-marital exploration, and break toxic repetitive conflicts.
            </p>
            <span className="inline-block bg-sage-light text-sage-dark text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
              Couples &bull; Families
            </span>
          </div>

          {/* Service 4 */}
          <div className="bg-white border border-sage/10 rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all shadow-sm">
            <div className="font-serif text-4xl font-extralight text-sage-light/80 mb-2">04</div>
            <h3 className="font-serif text-xl font-semibold text-sage-dark mb-2">Life Coaching & Purpose</h3>
            <p className="text-muted text-xs leading-relaxed mb-4">
              Dismantle long-term procrastination cycles, design concrete habits, discover purpose, and raise life focus levels.
            </p>
            <span className="inline-block bg-sage-light text-sage-dark text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
              Motivation &bull; Habits
            </span>
          </div>

          {/* Service 5 */}
          <div className="bg-white border border-sage/10 rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all shadow-sm">
            <div className="font-serif text-4xl font-extralight text-sage-light/80 mb-2">05</div>
            <h3 className="font-serif text-xl font-semibold text-sage-dark mb-2">Emotional & Spiritual Support</h3>
            <p className="text-muted text-xs leading-relaxed mb-4">
              Establish core inner alignment, handle unresolved emotional grief, discover hope, and heal interior blockages.
            </p>
            <span className="inline-block bg-sage-light text-sage-dark text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
              Integrative Counselling
            </span>
          </div>

          {/* Prompting CTA block */}
          <div className="bg-warm-light/60 border border-warm/15 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <Sparkles className="text-warm mb-3 stroke-1.5" size={28} />
              <h3 className="font-serif text-lg font-semibold text-sage-dark mb-1">Unsure where to begin?</h3>
              <p className="text-muted text-xs leading-relaxed">
                Take our introductory session callback to consult on your concerns and plan your roadmap.
              </p>
            </div>
            <a 
              href="#book-call-card"
              className="text-[#1c2b24] hover:text-sage text-xs font-bold flex items-center gap-1 group mt-4"
            >
              Get started for free
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-warm-light py-20 px-6 md:px-12 lg:px-24" id="process">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-16">
            <span className="text-warm font-semibold text-xs tracking-widest uppercase">How It Works</span>
            <h2 className="font-serif text-3xl md:text-4xl text-sage-dark font-bold">
              Your path to healing in <em className="font-serif font-normal italic text-warm">3 simple steps</em>
            </h2>
            <p className="text-muted text-sm sm:text-base max-w-lg mx-auto">
              Initiating counselling should be helpful, not tedious. We have configured a safe path to begin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white border border-warm/10 rounded-2xl p-8 relative shadow-sm">
              <div className="w-12 h-12 rounded-full bg-warm text-white flex items-center justify-center font-serif text-lg font-bold mb-6">
                1
              </div>
              <h3 className="font-serif text-xl font-semibold text-sage-dark mb-2">Book a Free Intro Call</h3>
              <p className="text-muted text-xs leading-relaxed">
                Arrange a quick, 15-minute no-obligation WhatsApp voice/video or Zoom call to lay out your concerns.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-warm/10 rounded-2xl p-8 relative shadow-sm">
              <div className="w-12 h-12 rounded-full bg-warm text-white flex items-center justify-center font-serif text-lg font-bold mb-6">
                2
              </div>
              <h3 className="font-serif text-xl font-semibold text-sage-dark mb-2">Initial Assessment</h3>
              <p className="text-muted text-xs leading-relaxed">
                Explore context deep-dives. We analyze background layers, design parameters, and tailor actionable goals.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-warm/10 rounded-2xl p-8 relative shadow-sm">
              <div className="w-12 h-12 rounded-full bg-warm text-white flex items-center justify-center font-serif text-lg font-bold mb-6">
                3
              </div>
              <h3 className="font-serif text-xl font-semibold text-sage-dark mb-2">Support & Active Actions</h3>
              <p className="text-muted text-xs leading-relaxed">
                Engage in periodic virtual consultations, track updates with safe tracking milestones, and change at your pace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-sage-dark text-white py-20 px-6 md:px-12 lg:px-24 text-center relative overflow-hidden" id="about">
        <div className="absolute inset-0 bg-radial-gradient from-sage/10 to-transparent pointer-events-none opacity-40"></div>
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="text-warm text-base tracking-widest uppercase font-medium">Therapeutic Experience</div>
          <div className="text-3xl font-serif text-amber-100">&ldquo;</div>
          <blockquote className="font-serif text-xl md:text-2xl italic leading-relaxed text-slate-100">
            "I had never consulted a psychologist or counselor before. The sessions helped me navigate life transitions, view myself objectively, and regain healthy, positive agency over my career and mental wellness."
          </blockquote>
          <div className="text-warm text-sm font-semibold">&mdash; Career & Mentoring Client, Chhattisgarh</div>
          
          <div className="border-t border-white/10 pt-8 mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-xl mx-auto">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <h4 className="font-serif text-white font-semibold text-sm mb-1">M.A. in Psychology</h4>
              <p className="text-[11px] text-white/70">Certified Therapist delivering evidence-grounded counseling and assessment methodologies.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <h4 className="font-serif text-white font-semibold text-sm mb-1">Safe Consultation Policies</h4>
              <p className="text-[11px] text-white/70">Strict adherence to HIPAA-aligned confidentiality frameworks protecting client identifiers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN ENHANCED CONTACT & BOOK FREE CALL CONTAINER */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-cream/70" id="contact">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Information Column (Contact Us Info & Guidelines) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-warm font-semibold text-xs tracking-widest uppercase">Get in touch</span>
              <h2 className="font-serif text-3xl md:text-4xl text-sage-dark font-bold mt-1">
                Let&apos;s start with <em className="font-serif text-warm font-normal italic">a conversation</em>
              </h2>
              <p className="text-muted text-sm mt-3 leading-relaxed">
                We are reachable via phone, WhatsApp, email, or simple inquiries. Submit either of our forms to receive instant callback.
              </p>
            </div>

            {/* Direct Contact Details: Strictly using requested email & numbers */}
            <div className="space-y-4 bg-white p-6 rounded-3xl border border-sage/10 shadow-sm" id="contact-info-card">
              <h4 className="font-serif text-lg font-bold text-sage-dark mb-4 border-b border-cream pb-2">
                Connect Directly
              </h4>
              
              {/* Telephone Links */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-sage-light/80 text-sage-dark rounded-full mt-1">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-sage">Phone Contacts</p>
                  <p className="text-sm font-semibold text-[#1c2b24] mt-0.5">
                    <a href="tel:+917828689161" className="hover:text-warm transition-colors" id="contact-phone-1">
                      +91 7828689161
                    </a>
                  </p>
                  <p className="text-sm font-semibold text-[#1c2b24] mt-0.5">
                    <a href="tel:+917014364370" className="hover:text-warm transition-colors" id="contact-phone-2">
                      +91 7014364370
                    </a>
                  </p>
                </div>
              </div>

              {/* Email Link */}
              <div className="flex items-start gap-4 pt-2">
                <div className="p-2.5 bg-sage-light/80 text-sage-dark rounded-full mt-1">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-sage">Email Inquiry</p>
                  <p className="text-sm font-semibold text-[#1c2b24] mt-0.5">
                    <a href="mailto:nistaran3@gmail.com" className="hover:text-warm transition-colors underline decoration-warm/40" id="contact-email-link">
                      nistaran3@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Location Badge */}
              <div className="flex items-start gap-4 pt-2">
                <div className="p-2.5 bg-sage-light/80 text-sage-dark rounded-full mt-1">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-sage">Support Modes</p>
                  <p className="text-sm text-muted mt-0.5">
                    Online & Offline
                  </p>
                </div>
              </div>
            </div>

            {/* Safe Space Guarantee */}
            <div className="p-5 bg-sage-light/40 rounded-2xl space-y-2 border border-sage/10 text-xs">
              <span className="font-semibold text-sage-dark flex items-center gap-1.5">
                <CheckCircle size={16} className="text-sage" />
                Guaranteed Safe & Private Space
              </span>
              <p className="text-[#3b4c42] leading-relaxed">
                Your data is never parsed or sold. Every conversation held during introductory triage calls and active counselling is governed under strict client-therapist privilege frameworks.
              </p>
            </div>
          </div>

          {/* Interactive Form Components Grid Area */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* COMPONENT 1: FIX & ENHANCED FREE INTRO COUPLING */}
            <div id="enhanced-booking-call-section" className="scroll-mt-24">
              <BookCallForm onSuccessTriggered={handleSubmissionSuccess} />
            </div>

            {/* COMPONENT 2: DEEP INTAKE MESSAGE INQUIRY */}
            <div id="enhanced-contact-form-section">
              <ContactForm onSuccessTriggered={handleSubmissionSuccess} />
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-sage-dark text-warm-light/80 border-t border-sage/20 py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-xs">
          <div className="space-y-2">
            <h4 className="font-serif text-lg font-bold text-white tracking-widest uppercase">
              Nistaran Counselling
            </h4>
            <p className="text-warm-light/60 max-w-sm">
              Providing holistic virtual therapy across India & globally. Mental Health &bull; Careers &bull; Relationships.
            </p>
          </div>
          <div className="space-y-1.5 md:text-right">
            <p className="font-semibold text-white">M.A. Psychology &bull; Online & Offline</p>
            <p>Direct: +91 7828689161 &nbsp;|&nbsp; nistaran3@gmail.com</p>
            <p className="text-warm-light/50">&copy; {new Date().getFullYear()} Nistaran Counselling. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Developers Diagnostic Utility Tool Pane */}
      <DiagnosticsInspector refreshTrigger={refreshTrigger} />
    </div>
  );
}
