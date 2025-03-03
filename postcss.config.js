module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      darkMode: 'class',
      content: [
        './src/**/*.{js,jsx,ts,tsx,md,mdx}',
        './docs/**/*.{md,mdx}',
      ],
    },
    autoprefixer: {},
  }
}
