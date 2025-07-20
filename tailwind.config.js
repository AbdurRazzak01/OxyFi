module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 1s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [
    require('daisyui'),
    require("@tailwindcss/typography")
  ],
  daisyui: {
    styled: true,
    // TODO: Theme needs works
    themes: [
      {
        'solana': { 
          fontFamily: {
            display: ['PT Mono, monospace'],
            body: ['Inter, sans-serif'],
          },
          'primary': '#000000',           /* Primary color */
          'primary-focus': '#9945FF',     /* Primary color - focused */
          'primary-content': '#ffffff',   /* Foreground content color to use on primary color */

          'secondary': '#808080',         /* Secondary color */
          'secondary-focus': '#f3cc30',   /* Secondary color - focused */
          'secondary-content': '#ffffff', /* Foreground content color to use on secondary color */

          'accent': '#33a382',            /* Accent color */
          'accent-focus': '#2aa79b',      /* Accent color - focused */
          'accent-content': '#ffffff',    /* Foreground content color to use on accent color */

          'neutral': '#2b2b2b',           /* Neutral color */
          'neutral-focus': '#2a2e37',     /* Neutral color - focused */
          'neutral-content': '#ffffff',   /* Foreground content color to use on neutral color */

          'base-100': '#000000',          /* Base color of page, used for blank backgrounds */
          'base-200': '#35363a',          /* Base color, a little darker */
          'base-300': '#222222',          /* Base color, even more darker */
          'base-content': '#f9fafb',      /* Foreground content color to use on base color */

          'info': '#2094f3',              /* Info */
          'success': '#009485',           /* Success */
          'warning': '#ff9900',           /* Warning */
          'error': '#ff5724',             /* Error */
        },
      },
      'light',
      'dark',
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
}