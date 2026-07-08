import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

interface SignupForm {
  name: string;
  email: string;
}

interface SignupErrors {
  name?: string;
  email?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: SignupForm): SignupErrors {
  const errors: SignupErrors = {};

  if (!form.name.trim()) {
    errors.name = "Kindly enter your name.";
  }

  if (!form.email.trim()) {
    errors.email = "An email is required to sign up.";
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = "That doesn't look like a valid email.";
  }

  return errors;
}

export default function Footer() {
  const { theme } = useTheme();
  const [form, setForm] = useState<SignupForm>({ name: "", email: "" });
  const [errors, setErrors] = useState<SignupErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const onPageBgText = theme === "dark" ? "text-parchmentDark" : "text-emeraldDark";
  const onPageBgLink = theme === "dark" ? "text-parchment" : "text-emeraldDark";
  const onPageBgMuted = theme === "dark" ? "text-parchmentDark/30" : "text-emeraldDark/40";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof SignupErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);

    const hasErrors = Object.keys(validationErrors).length > 0;
    if (hasErrors) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
  }

  function handleReset() {
    setForm({ name: "", email: "" });
    setErrors({});
    setSubmitted(false);
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-bronzeBright/40 pt-6">

      <div className="grid gap-8 sm:grid-cols-3 sm:items-start">
        <div className="text-center sm:text-left">
          <Link to="/dashboard" className="inline-flex items-center gap-2 mb-2">
            <img
              src="/images/cat.jpg"
              alt="TQuest logo"
              className="w-8 h-8 rounded-full border-2 border-gold object-cover"
            />
            <span className="font-serif font-bold text-goldBright text-lg">TQuest</span>
          </Link>
          <p className={`${onPageBgText} text-xs sm:text-sm mb-3 font-semibold`}>
            TQuest is built by using pure TypeScript and React. I have developed this website to make learning fun. 
          </p>
          <p className={`${onPageBgText} text-xs sm:text-sm mb-3 font-semibold`}>Join our community to unlock more fun challenges!</p>
          <hr className = "border-gold"></hr><br></br>
          <a
            href="https://github.com/TuqaMohd"
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1.5 ${onPageBgLink} hover:text-goldBright text-xs sm:text-sm font-semibold transition-colors`}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07
                -1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82
                a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15
                0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2
                0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            My GitHub
          </a>
        </div>

        <div className="h-64 sm:h-72">
          <img
            className="w-full h-full object-cover border-2 border-bronzeBright rounded-lg"
            src="https://i.pinimg.com/originals/54/04/86/54048625ce70e4041840822971749a0f.gif"
            alt="Pixel-art quest character"
          />
        </div>

        <div className="h-64 sm:h-72 w-full bg-orange-950 border-2 border-bronzeBright rounded-lg p-3 text-left flex flex-col justify-center overflow-y-auto">
          {submitted ? (
            <div className="text-center py-2">
              <p className="text-goldBright font-semibold mb-3 text-sm">
                Thanks, {form.name}! You're on the list! :D
              </p>
              <button
                onClick={handleReset}
                className="bg-gold text-ink px-4 py-1.5 rounded text-xs font-semibold hover:bg-goldBright"
              >
                Sign up with another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-parchmentDark mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={
                    "w-full px-3 py-1.5 rounded bg-parchment text-ink text-sm outline-none border-2 " +
                    (errors.name ? "border-danger" : "border-gold")
                  }
                />
                {errors.name && (
                  <p className="text-danger text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-parchmentDark mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={
                    "w-full px-3 py-1.5 rounded bg-parchment text-ink text-sm outline-none border-2 " +
                    (errors.email ? "border-danger" : "border-gold")
                  }
                />
                {errors.email && (
                  <p className="text-danger text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gold text-ink font-semibold px-4 py-2 rounded text-sm hover:bg-goldBright"
              >
                Join TQuest's Community
              </button>
            </form>
          )}
        </div>
      </div>


      <div className="mt-8 pt-4 border-t border-bronzeBright/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className={`${onPageBgLink} text-xs text-center sm:text-left font-semibold`}>
          TQuest - Built for the best learning experience
        </p>
        <nav className="flex items-center gap-3 text-xs">
          <Link to="/dashboard" className={`${onPageBgLink} hover:text-goldBright transition-colors font-semibold`}>
            Dashboard
          </Link>
          <span className={onPageBgMuted}>•</span>
          <Link to="/quest" className={`${onPageBgLink} hover:text-goldBright transition-colors font-semibold`}>
            Official Quest
          </Link>        
        </nav>
      </div>
    </footer>
  );
}
