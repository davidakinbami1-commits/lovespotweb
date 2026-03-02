import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF4458',
        'primary-dark': '#E03347',
        'primary-light': '#FF6B7A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF4458 0%, #FF6B7A 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 40%, #4a1942 70%, #FF4458 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
