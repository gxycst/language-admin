import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue2';
async function setupPostcssPlugins() {
    const mobileForever = await import("postcss-mobile-forever");
    return [
        mobileForever.default({ // Access the default export
            viewportWidth: 1920,
            appSelector: "#app",
            maxDisplayWidth: 2000,
            experimental: {
                minDisplayWidth: 1366,
            },
            //  include:[/\/src\/views\/demo/]
        }),
    ];
}
export default defineConfig(async () => ({ // Make the defineConfig callback async
    plugins: [vue()],
    base: "language-admin",
    css: {
        postcss: {
            plugins: await setupPostcssPlugins(), // Await the plugin setup
        },
    },
}));