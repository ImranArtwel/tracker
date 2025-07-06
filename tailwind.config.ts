// tailwind.config.js
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        expense: "url('/bg-expense.png')",
      },
    },
  },
  plugins: [],
};
