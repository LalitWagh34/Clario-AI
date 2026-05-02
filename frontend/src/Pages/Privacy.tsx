export default function Privacy() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0d0d; font-family: 'DM Sans', system-ui, sans-serif; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0d0d0d", padding: "60px 24px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>

          {/* Back */}
          <a href="/auth" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#555", textDecoration: "none", marginBottom: "48px" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#888")}
            onMouseLeave={e => (e.currentTarget.style.color = "#555")}
          >
            ← Back
          </a>

          {/* Header */}
          <div style={{ marginBottom: "48px", paddingBottom: "24px", borderBottom: "1px solid #1a1a1a" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Legal</p>
            <h1 style={{ fontSize: "36px", fontWeight: 600, color: "#f0f0f0", fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: "-0.5px", marginBottom: "12px" }}>
              Privacy Policy
            </h1>
            <p style={{ fontSize: "13px", color: "#444" }}>Last updated: May 2, 2026</p>
          </div>

          {/* Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {[
              {
                title: "1. Information We Collect",
                body: "We collect information you provide when creating an account, including your name and email address via OAuth providers (Google, GitHub). We also collect usage data such as queries submitted, conversations created, and interaction patterns to improve our service.",
              },
              {
                title: "2. How We Use Your Information",
                body: "Your information is used to provide and improve Clario's services, authenticate your identity, store your conversation history, and communicate important updates. We do not sell your personal data to third parties. Query data may be used in aggregate, anonymized form to improve AI response quality.",
              },
              {
                title: "3. Data Storage",
                body: "Your conversations and account data are stored securely in our database hosted on Supabase infrastructure. We implement industry-standard security measures including encryption at rest and in transit. We retain your data for as long as your account is active or as needed to provide services.",
              },
              {
                title: "4. Third-Party Services",
                body: "Clario integrates with third-party services including Supabase (authentication and database), Groq (AI language models), and Tavily (web search). Each of these services has their own privacy policies governing how they handle data. We encourage you to review their respective policies.",
              },
              {
                title: "5. Cookies and Tracking",
                body: "We use session cookies strictly necessary for authentication and maintaining your logged-in state. We do not use tracking cookies, advertising pixels, or third-party analytics that monitor your behavior across other websites. Clario is ad-free.",
              },
              {
                title: "6. Your Rights",
                body: "You have the right to access, correct, or delete your personal data at any time. You can delete your conversation history directly within the app. To request full account deletion or a copy of your data, contact us at privacy@clario.ai. We will respond within 30 days.",
              },
              {
                title: "7. Children's Privacy",
                body: "Clario is not directed to children under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information promptly.",
              },
              {
                title: "8. Changes to This Policy",
                body: "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our service or sending an email. Your continued use of Clario after changes are posted constitutes your acceptance of the updated policy.",
              },
              {
                title: "9. Contact Us",
                body: "If you have questions or concerns about this Privacy Policy or our data practices, please contact us at privacy@clario.ai. We take privacy seriously and will respond to all inquiries promptly.",
              },
            ].map((section) => (
              <div key={section.title}>
                <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#e0e0e0", marginBottom: "12px", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                  {section.title}
                </h2>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.8" }}>
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ marginTop: "64px", paddingTop: "24px", borderTop: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#333" }}>© 2026 Clario</span>
            <a href="/terms" style={{ fontSize: "12px", color: "#444", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#888")}
              onMouseLeave={e => (e.currentTarget.style.color = "#444")}
            >
              Terms of Service →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}