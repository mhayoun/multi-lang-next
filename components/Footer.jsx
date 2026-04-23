import React, { useState } from 'react';
import { Clock, MapPin, Mail, Phone, Bus, Send, CheckCircle } from 'lucide-react';

const Footer = ({ data, isHe = true }) => {
  const [status, setStatus] = useState('idle'); // idle, sending, success

  if (!data) return null;

  const { hours, contact, form, bottomBar } = data;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate API call
    setTimeout(() => setStatus('success'), 1500);
    setTimeout(() => setStatus('idle'), 5000);
  };

  const inputStyle = "w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-6 px-4 mt-20" dir={isHe ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Section 1: Working Hours */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Clock className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-bold">{isHe ? hours.title.he : hours.title.en}</h3>
          </div>
          <div className="space-y-4 text-slate-400 text-sm">
            {hours.items.map((item, idx) => (
              <div key={idx} className="border-b border-slate-800 pb-2 last:border-0">
                <span className="block font-bold text-slate-200">
                  {isHe ? item.label.he : item.label.en}
                </span>
                <span className={item.isLink ? "text-blue-400 cursor-pointer hover:underline" : ""}>
                  {isHe ? item.value.he : item.value.en}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Contact Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <MapPin className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-bold">{isHe ? contact.title.he : contact.title.en}</h3>
          </div>
          <div className="space-y-4 text-slate-400 text-sm">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="shrink-0 text-slate-500" />
              <p>{isHe ? contact.address.he : contact.address.en}</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="shrink-0 text-slate-500" />
              <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">{contact.email}</a>
            </div>
            {contact.phones.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-slate-500" />
                <p>
                  <span className="opacity-60">{isHe ? p.label.he : p.label.en}:</span> {p.number}
                </p>
              </div>
            ))}
            <div className="flex items-start gap-3 mt-4 p-3 bg-slate-900 rounded-xl border border-slate-800">
              <Bus size={18} className="shrink-0 text-blue-400" />
              <div>
                <p className="font-bold text-slate-200 text-xs uppercase mb-1">
                  {isHe ? contact.transport.title.he : contact.transport.title.en}
                </p>
                <p>{contact.transport.lines}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Contact Form */}
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
          <h3 className="text-xl font-bold mb-6">{isHe ? form.title.he : form.title.en}</h3>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 animate-in zoom-in duration-300">
              <CheckCircle size={48} className="text-green-500" />
              <p className="font-bold">{isHe ? form.successMessage.he : form.successMessage.en}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                className={inputStyle}
                placeholder={isHe ? form.fields.name.he : form.fields.name.en}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="tel"
                  className={inputStyle}
                  placeholder={isHe ? form.fields.phone.he : form.fields.phone.en}
                />
                <input
                  required
                  type="email"
                  className={inputStyle}
                  placeholder={isHe ? form.fields.email.he : form.fields.email.en}
                />
              </div>
              <textarea
                rows="3"
                className={inputStyle}
                placeholder={isHe ? form.fields.message.he : form.fields.message.en}
              ></textarea>

              <button
                disabled={status === 'sending'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {status === 'sending' ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    <span>{isHe ? form.fields.submit.he : form.fields.submit.en}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <p>© {new Date().getFullYear()} {isHe ? bottomBar.copyright.he : bottomBar.copyright.en}</p>
        <div className="flex gap-6">
            <span className="hover:text-slate-300 cursor-pointer">{isHe ? "הצהרת נגישות" : "Accessibility"}</span>
            <span className="hover:text-slate-300 cursor-pointer">{isHe ? "מדיניות פרטיות" : "Privacy Policy"}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;