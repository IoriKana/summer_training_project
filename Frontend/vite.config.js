import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		allowedHosts: ["8ec798d6fb37.ngrok-free.app"],
		port: 5173,
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
