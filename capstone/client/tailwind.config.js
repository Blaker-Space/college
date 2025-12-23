/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  safelist: [
    // overlay
    "fixed","inset-0","z-[1000]","bg-black/50","backdrop-blur-sm",
    "flex","items-center","justify-center","p-6",
    // panel
    "relative","w-[92vw]","max-w-3xl","max-h-[85vh]","overflow-y-auto",
    "rounded-2xl","border","border-indigo-100","bg-white","text-slate-900","shadow-2xl","p-6",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1", // primary accent
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
      },
      boxShadow: {
        card: "0 2px 4px rgba(0,0,0,0.08)",
        cardHover: "0 12px 24px rgba(99,102,241,0.25)",
      },
      borderRadius: {
        xl: "0.75rem",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
