import { defineConfig } from 'vite';
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
    plugins: [federation({
        name: 'host',
        remotes: {
            'plugin_app': 
            {
                
                external: 'http://localhost:3001/plugin_app.js',
                from: 'webpack'
            }
        }
    })]
})