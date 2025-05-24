/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  defaults: {
    global: {
      flat: true,
      ripple: false,
      rounded: "lg",
    },
    VCard: {
      border: true,
    },
    VAppBar: {
      border: false,
      rounded: false,
    },
    VFooter: {
      border: false,
      rounded: false,
    },
    VExpansionPanels: {
      border: true,
      rounded: false,
    },
    VBtn: {
      rounded: "md",
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#006A71",
          secondary: "#48A6A7",
          background: "#f3f3f3",
          surface: "#f3f3f3",
          "secondary-text": "#003a3d",
          error: "#dc2626",
          border: "#e5e7eb",
          panels: "#f6f6f6",
        },
      },
      dark: {
        colors: {
          primary: "#1f2937",
          secondary: "#374151",
          background: "#111827",
          surface: "#111827",
          "secondary-text": "#b3b4b7",
          error: "#dc2626",
          border: "#374151",
          panels: "#1a212f",
        },
      },
    },
  },
});
