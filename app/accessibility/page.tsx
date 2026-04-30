// app/accessibility/page.tsx

export default function AccessibilityPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-xl border border-slate-200">

        <header className="mb-8 border-b-2 border-blue-600 pb-4">
          <h1 className="text-3xl font-bold text-blue-700">
            הצהרת נגישות
          </h1>
        </header>

        <div className="space-y-6 text-slate-700 leading-relaxed">

          <section>
            <p>
              ב-[שם העסק], אנו רואים חשיבות עליונה במתן שירות שוויוני, מכובד ונגיש לכלל לקוחותינו, לרבות אנשים עם מוגבלות. הושקעו מאמצים ומשאבים רבים בהנגשת האתר על מנת להקל על השימוש בו ולהפוך את שירותינו לזמינים עבור כולם.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">רמת הנגישות</h2>
            <p>
              אתר זה עומד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013. התאמות הנגישות בוצעו עפ"י המלצות התקן הישראלי (ת"י 5568) לנגישות תכנים באינטרנט ברמת AA ומסמך WCAG2.0 הבינלאומי.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">התאמות שבוצעו באתר</h2>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>האתר מותאם לדפדפנים נפוצים ולשימוש בטלפון הסלולרי.</li>
              <li>תצוגת האתר מותאמת לקוראי מסך.</li>
              <li>ניתן לנווט באתר באמצעות המקלדת (Tab ו-Shift+Tab).</li>
              <li>קיימת היררכיה נכונה של כותרות (H1, H2 וכו').</li>
              <li>התמונות באתר כוללות תיאור חלופי (Alt Text).</li>
              <li>האתר אינו כולל אלמנטים מהבהבים או נעים המפריעים לריכוז.</li>
              <li>ניגודיות הצבעים באתר עומדת בדרישות התקן.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">סייגים לנגישות</h2>
            <p>
              למרות מאמצנו להנגיש את כלל הדפים באתר, ייתכן ויתגלו חלקים או יכולות שלא הונגשו כראוי או שטרם הונגשו. אם נתקלתם בבעיה, נשמח אם תעדכנו אותנו כדי שנוכל לתקנה.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">רכז נגישות</h2>
            <p className="mb-4">לכל שאלה, הצעה לשיפור או דיווח על תקלה, ניתן לפנות לרכז הנגישות שלנו:</p>

            <div className="bg-blue-50 p-6 rounded-lg border-r-4 border-blue-600 space-y-1">
              <p><strong>טלפון:</strong>054-5665417</p>
              <p><strong>דוא"ל:</strong>yelotag@gmail.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">נגישות פיזית</h2>
            <p>
              משרדנו ממוקם בכתובת: קויפמן יחזקאל 15. <br />
              קיימת חניית נכים, דרכי גישה מונגשות, מעלית רחבה ושילוט ברור.
            </p>
          </section>

          <footer className="mt-10 pt-6 border-t border-slate-200 text-sm text-slate-500">
            הצהרה זו עודכנה לאחרונה בתאריך: 30/04/2026
          </footer>

        </div>
      </div>
    </main>
  );
}