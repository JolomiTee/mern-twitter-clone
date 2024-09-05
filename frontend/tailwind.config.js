/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,ts,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["dark", "cupcake"],
	},
	darkMode: ["class", '[data-theme="dark"]'],
};
