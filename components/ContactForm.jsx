import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ContactForm = ({ isFooter = false, isHe = true }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to send email would go here (e.g., via an API route)
    console.log("Sending data:", formData);
    alert(isHe ? "הודעתך נשלחה בהצלחה!" : "Message sent successfully!");
  };

  // Adjusted input class: uses a darker background and border when in footer to look better on dark themes
  const inputClass = `w-full p-3 rounded-lg border outline-none transition-all ${
    isFooter 
      ? 'bg-slate-800 border-slate-700 text-white focus:ring-blue-400 placeholder-slate-400' 
      : 'bg-white border-slate-200 text-slate-800 focus:ring-blue-500 placeholder-slate-500'
  } focus:ring-2`;

  return (
    <div className={`w-full ${isFooter ? 'bg-transparent' : 'bg-white p-6 rounded-3xl shadow-sm'}`}>
      <h3 className={`text-xl font-bold mb-6 ${isFooter ? 'text-white' : 'text-slate-800'}`}>
        {isHe ? 'יצירת קשר' : 'Contact Us'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder={isHe ? "שם מלא *" : "Full Name *"}
            className={inputClass}
            required
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="tel"
            placeholder={isHe ? "טלפון *" : "Phone *"}
            className={inputClass}
            required
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <input
            type="email"
            placeholder={isHe ? "E-mail *" : "E-mail *"}
            className={inputClass}
            required
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <textarea
            placeholder={isHe ? "הודעה" : "Message"}
            rows="3"
            className={inputClass}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Send size={18} />
          {isHe ? 'שלח הודעה' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;