export default function Terms() {
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
              Terms of Service
            </h1>
            <p style={{ fontSize: "13px", color: "#444" }}>Last updated: May 2, 2026</p>
          </div>

          {/* Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {[
              {
                title: "1. Acceptance of Terms",
                body: "By accessing or using Clario, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service. We reserve the right to update these terms at any time, and continued use of the service constitutes acceptance of any changes.",
              },
              {
                title: "2. Use of Service",
                body: "Clario provides AI-powered research assistance using web search and language models. You agree to use the service only for lawful purposes and in a manner that does not infringe the rights of others. You must not use Clario to generate harmful, misleading, or illegal content.",
              },
              {
                title: "3. User Accounts",
                body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts that violate these terms.",
              },
              {
                title: "4. Intellectual Property",
                body: "All content, trademarks, and intellectual property on Clario are owned by or licensed to us. You may not reproduce, distribute, or create derivative works from our content without explicit written permission. Content generated through Clario's AI is provided for personal, non-commercial use.",
              },
              {
                title: "5. Disclaimers",
                body: "Clario is provided 'as is' without warranties of any kind. AI-generated answers may contain errors or inaccuracies. We do not guarantee the accuracy, completeness, or reliability of any information provided. Always verify important information from authoritative sources.",
              },
              {
                title: "6. Limitation of Liability",
                body: "To the fullest extent permitted by law, Clario and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid us in the past twelve months.",
              },
              {
                title: "7. Termination",
                body: "We reserve the right to suspend or terminate your access to Clario at any time, with or without cause. Upon termination, your right to use the service will immediately cease. Provisions that by their nature should survive termination will remain in effect.",
              },
              {
                title: "8. Contact",
                body: "If you have any questions about these Terms of Service, please contact us at legal@clario.ai.",
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
            <a href="/privacy" style={{ fontSize: "12px", color: "#444", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#888")}
              onMouseLeave={e => (e.currentTarget.style.color = "#444")}
            >
              Privacy Policy →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}