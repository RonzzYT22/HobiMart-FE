import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
        extend: {
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        },
                        // HOBBYCO Brand Colors
                        hobbyco: {
                                green: '#0F3D34',
                                'green-light': '#1a5247',
                                'green-dark': '#092822',
                                orange: '#FF6B1A',
                                'orange-light': '#FF8A47',
                                'orange-dark': '#E55A0A',
                                cream: '#FFF3E0',
                                'cream-dark': '#FFE4B5',
                                purple: '#7E3FF2',
                                'purple-light': '#9B6FFF',
                                dark: '#1A1A1A'
                        }
                },
                fontFamily: {
                        sans: ['Nunito', 'Plus Jakarta Sans', 'sans-serif'],
                        display: ['Poppins', 'Nunito', 'sans-serif']
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)',
                        xl: 'calc(var(--radius) + 4px)',
                        '2xl': 'calc(var(--radius) + 8px)'
                },
                boxShadow: {
                        'brand': '0 4px 20px -4px rgba(15, 61, 52, 0.15)',
                        'orange-glow': '0 4px 25px -4px rgba(255, 107, 26, 0.35)',
                        'card-hover': '0 12px 35px -12px rgba(15, 61, 52, 0.2)'
                }
        }
  },
  plugins: [tailwindcssAnimate],
};
export default config;
