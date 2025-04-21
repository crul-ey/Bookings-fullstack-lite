// src/theme.ts
import { extendTheme, type ThemeConfig, StyleFunctionProps } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light", // KLM-stijl
  useSystemColorMode: true, // wissel automatisch op basis van systeem
};

const colors = {
  brand: {
    50: "#E5F6FF",   // lichtblauw (hover / bg)
    100: "#B3E0FF",
    200: "#80CBFF",  // KLM-achtig blauw
    300: "#4DB6FF",
    400: "#1AA1FF",  // primair blauw
    500: "#008CE6",  // donkerder blauw (buttons)
    600: "#006BB3",
    700: "#004D80",
    800: "#002E4D",
    900: "#00141F",  // donkerste tint
  },
  darkBG: "#0F1117",     // diep donker
  darkAccent: "#1A202C", // lichtgrijsblauw
  darkText: "#CBD5E0",   // lichtgrijs
};

const theme = extendTheme({
  config,
  colors,

  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },

  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: props.colorMode === "dark" ? colors.darkBG : "white",
        color: props.colorMode === "dark" ? colors.darkText : "gray.800",
      },
      input: {
        color: props.colorMode === "dark" ? "white" : "gray.800",
      },
    }),
  },

  components: {
    Button: {
      baseStyle: {
        fontWeight: "medium",
        borderRadius: "xl",
      },
      defaultProps: {
        colorScheme: "brand",
      },
    },

    Input: {
      variants: {
        filled: (props: StyleFunctionProps) => ({
          field: {
            bg: props.colorMode === "dark" ? colors.darkAccent : "gray.100",
            _hover: {
              bg: props.colorMode === "dark" ? "#2D3748" : "gray.200",
            },
            _focus: {
              bg: props.colorMode === "dark" ? "#1A202C" : "white",
              borderColor: "brand.400",
              boxShadow: "0 0 0 1px #1AA1FF",
            },
            color: props.colorMode === "dark" ? "white" : "gray.800",
          },
        }),
      },
      defaultProps: {
        variant: "filled",
      },
    },

    FormLabel: {
      baseStyle: (props: StyleFunctionProps) => ({
        color: props.colorMode === "dark" ? "gray.300" : "gray.700",
        fontWeight: "semibold",
      }),
    },

    Heading: {
      baseStyle: {
        fontWeight: "bold",
      },
    },

    Badge: {
      baseStyle: {
        textTransform: "none",
        fontSize: "0.75rem",
        px: 2,
        py: 0.5,
        borderRadius: "full",
      },
    },
  },
});

export default theme;
