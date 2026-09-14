/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,vue,ts}",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        "on-background": "#191c1e",
        "secondary": "#545f73",
        "on-surface": "#191c1e",
        "surface-container-high": "#e6e8ea",
        "outline": "#6c7a71",
        "primary-fixed": "#6ffbbe",
        "on-secondary-fixed": "#111c2d",
        "surface-bright": "#f7f9fb",
        "secondary-container": "#d5e0f8",
        "tertiary-fixed-dim": "#adc6ff",
        "secondary-fixed-dim": "#bcc7de",
        "on-primary-fixed-variant": "#005236",
        "tertiary": "#005ac2",
        "primary-container": "#10b981",
        "on-secondary-fixed-variant": "#3c475a",
        "surface-tint": "#006c49",
        "outline-variant": "#bbcabf",
        "on-secondary-container": "#586377",
        "surface": "#f7f9fb",
        "on-surface-variant": "#3c4a42",
        "surface-container": "#eceef0",
        "inverse-primary": "#4edea3",
        "surface-container-low": "#f2f4f6",
        "on-tertiary": "#ffffff",
        "on-primary-fixed": "#002113",
        "on-error-container": "#93000a",
        "error-container": "#ffdad6",
        "error": "#ba1a1a",
        "inverse-surface": "#2d3133",
        "on-tertiary-container": "#00367a",
        "surface-variant": "#e0e3e5",
        "tertiary-fixed": "#d8e2ff",
        "on-primary-container": "#00422b",
        "surface-container-highest": "#e0e3e5",
        "tertiary-container": "#71a1ff",
        "surface-dim": "#d8dadc",
        "on-error": "#ffffff",
        "secondary-fixed": "#d8e3fb",
        "on-tertiary-fixed": "#001a42",
        "primary": "#006c49",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "inverse-on-surface": "#eff1f3",
        "primary-fixed-dim": "#4edea3",
        "surface-container-lowest": "#ffffff",
        "on-tertiary-fixed-variant": "#004395",
        "background": "#f7f9fb"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "container-max": "1024px",
        "gutter": "24px",
        "2xl": "48px",
        "sm": "8px",
        "xl": "32px",
        "lg": "24px",
        "base": "4px",
        "xs": "4px",
        "3xl": "64px",
        "md": "16px"
      },
      fontFamily: {
        "headline-lg": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "title-md": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "display-xl": ["Inter", "sans-serif"]
      },
      fontSize: {
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "500" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "title-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "display-xl": ["72px", { lineHeight: "80px", letterSpacing: "-0.02em", fontWeight: "700" }]
      }
    }
  },
  plugins: []
}

