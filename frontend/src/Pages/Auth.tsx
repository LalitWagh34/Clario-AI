import { createClient } from "@/lib/client";
import { Sparkles } from "lucide-react";

const supabase = createClient();

// GitHub SVG icon
function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// Google SVG icon
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function Auth() {
  async function login(provider: "github" | "google") {
    await supabase.auth.signInWithOAuth({ provider });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0d0d; font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .fade-up-1 { animation-delay: 0.05s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.12s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.19s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.26s; opacity: 0; }

        .auth-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', system-ui, sans-serif;
          cursor: pointer;
          transition: all 0.15s ease;
          letter-spacing: 0.01em;
        }
        .auth-btn:hover { transform: translateY(-1px); }
        .auth-btn:active { transform: translateY(0); }

        .btn-github {
          background: #161616;
          border: 1px solid #2a2a2a;
          color: #d0d0d0;
        }
        .btn-github:hover {
          background: #1e1e1e;
          border-color: #363636;
          color: #fff;
        }

        .btn-google {
          background: #111;
          border: 1px solid #222;
          color: #d0d0d0;
        }
        .btn-google:hover {
          background: #181818;
          border-color: #2e2e2e;
          color: #fff;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Subtle background glow */}
        <div style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(32,178,170,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Card */}
        <div style={{
          width: "100%",
          maxWidth: "380px",
          position: "relative",
          zIndex: 1,
        }}>

          {/* Logo */}
          <div className="fade-up fade-up-1" style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "rgba(32,178,170,0.1)",
              border: "1px solid rgba(32,178,170,0.2)",
              marginBottom: "16px",
            }}>
              <Sparkles size={20} style={{ color: "#20b2aa" }} />
            </div>
            <h1 style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#f0f0f0",
              fontFamily: "'DM Serif Display', Georgia, serif",
              letterSpacing: "-0.3px",
              marginBottom: "6px",
            }}>
              Clario
            </h1>
            <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.5" }}>
              AI-powered answers from the web
            </p>
          </div>

          {/* Auth box */}
          <div className="fade-up fade-up-2" style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "20px",
            padding: "28px",
          }}>
            <p style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#444",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "16px",
              textAlign: "center",
            }}>
              Sign in to continue
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button className="auth-btn btn-google" onClick={() => login("google")}>
                <GoogleIcon />
                Continue with Google
              </button>

              <button className="auth-btn btn-github" onClick={() => login("github")}>
                <GitHubIcon />
                Continue with GitHub
              </button>
            </div>

            <div style={{
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid #1a1a1a",
              textAlign: "center",
            }}>
              <p style={{ fontSize: "11px", color: "#333", lineHeight: "1.6" }}>
                By continuing, you agree to our{" "}
                <a href="/terms" style={{ color: "#444", textDecoration: "underline" }}>Terms</a>
                {" "}and{" "}
                <a href="/privacy" style={{ color: "#444", textDecoration: "underline" }}>Privacy Policy</a>
              </p>
            </div>
          </div>

          {/* Bottom badges */}
          <div className="fade-up fade-up-4" style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            marginTop: "24px",
          }}>
            {["End-to-end secure", "No ads", "Real-time web"].map((label) => (
              <span key={label} style={{ fontSize: "11px", color: "#333", letterSpacing: "0.02em" }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}