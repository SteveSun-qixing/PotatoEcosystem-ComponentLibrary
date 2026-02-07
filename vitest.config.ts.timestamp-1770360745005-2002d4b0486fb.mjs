// vitest.config.ts
import { defineConfig } from "file:///Users/sevenstars/Documents/ChipsCard/Develop/Project-12/node_modules/.pnpm/vitest@1.6.1_@types+node@20.19.30_happy-dom@13.10.1_sass@1.97.3/node_modules/vitest/dist/config.js";
import vue from "file:///Users/sevenstars/Documents/ChipsCard/Develop/Project-12/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vite@5.4.21_vue@3.5.27/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "/Users/sevenstars/Documents/ChipsCard/Develop/Project-12/Chips-ComponentLibrary";
var vitest_config_default = defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["src/**/*.{test,spec}.{js,ts}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,vue}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.test.ts",
        "src/**/*.spec.ts",
        "src/**/index.ts",
        "src/types/**"
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80
      }
    },
    setupFiles: ["./src/test/setup.ts"]
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zZXZlbnN0YXJzL0RvY3VtZW50cy9DaGlwc0NhcmQvRGV2ZWxvcC9Qcm9qZWN0LTEyL0NoaXBzLUNvbXBvbmVudExpYnJhcnlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zZXZlbnN0YXJzL0RvY3VtZW50cy9DaGlwc0NhcmQvRGV2ZWxvcC9Qcm9qZWN0LTEyL0NoaXBzLUNvbXBvbmVudExpYnJhcnkvdml0ZXN0LmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc2V2ZW5zdGFycy9Eb2N1bWVudHMvQ2hpcHNDYXJkL0RldmVsb3AvUHJvamVjdC0xMi9DaGlwcy1Db21wb25lbnRMaWJyYXJ5L3ZpdGVzdC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlc3QvY29uZmlnJztcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3Z1ZSgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdoYXBweS1kb20nLFxuICAgIGluY2x1ZGU6IFsnc3JjLyoqLyoue3Rlc3Qsc3BlY30ue2pzLHRzfSddLFxuICAgIGNvdmVyYWdlOiB7XG4gICAgICBwcm92aWRlcjogJ3Y4JyxcbiAgICAgIHJlcG9ydGVyOiBbJ3RleHQnLCAnanNvbicsICdodG1sJ10sXG4gICAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnt0cyx2dWV9J10sXG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgICdzcmMvKiovKi5kLnRzJyxcbiAgICAgICAgJ3NyYy8qKi8qLnRlc3QudHMnLFxuICAgICAgICAnc3JjLyoqLyouc3BlYy50cycsXG4gICAgICAgICdzcmMvKiovaW5kZXgudHMnLFxuICAgICAgICAnc3JjL3R5cGVzLyoqJyxcbiAgICAgIF0sXG4gICAgICB0aHJlc2hvbGRzOiB7XG4gICAgICAgIHN0YXRlbWVudHM6IDgwLFxuICAgICAgICBicmFuY2hlczogNzUsXG4gICAgICAgIGZ1bmN0aW9uczogODAsXG4gICAgICAgIGxpbmVzOiA4MCxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBzZXR1cEZpbGVzOiBbJy4vc3JjL3Rlc3Qvc2V0dXAudHMnXSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtYSxTQUFTLG9CQUFvQjtBQUNoYyxPQUFPLFNBQVM7QUFDaEIsU0FBUyxlQUFlO0FBRnhCLElBQU0sbUNBQW1DO0FBSXpDLElBQU8sd0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxJQUFJLENBQUM7QUFBQSxFQUNmLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixTQUFTLENBQUMsOEJBQThCO0FBQUEsSUFDeEMsVUFBVTtBQUFBLE1BQ1IsVUFBVTtBQUFBLE1BQ1YsVUFBVSxDQUFDLFFBQVEsUUFBUSxNQUFNO0FBQUEsTUFDakMsU0FBUyxDQUFDLG1CQUFtQjtBQUFBLE1BQzdCLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFlBQVk7QUFBQSxRQUNWLFlBQVk7QUFBQSxRQUNaLFVBQVU7QUFBQSxRQUNWLFdBQVc7QUFBQSxRQUNYLE9BQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUFBLElBQ0EsWUFBWSxDQUFDLHFCQUFxQjtBQUFBLEVBQ3BDO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
