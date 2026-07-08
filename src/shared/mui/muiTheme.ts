import { createTheme, type Theme } from "@mui/material/styles";
import type { Theme as AppTheme } from "../../contexts/ThemeContext";

const palette = {
  parchment: "#f1e6c9",
  parchmentDark: "#e3d3a4",
  ink: "#2c241b",
  emerald: "#1f4d3b",
  emeraldDark: "#143329",
  emeraldBright: "#3fae7f",
  gold: "#8a651f",
  goldBright: "#d9a93a",
  bronze: "#5c3a1e",
  bronzeDark: "#3d2712",
  danger: "#7a2c2c"
};

export function getMuiTheme(mode: AppTheme): Theme {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: { main: palette.gold, light: palette.goldBright, dark: palette.bronze },
      secondary: { main: palette.emerald, light: palette.emeraldBright, dark: palette.emeraldDark },
      error: { main: palette.danger },
      background: {
        default: isDark ? palette.emeraldDark : palette.parchment,
        paper: isDark ? "#1c3128" : palette.parchment
      },
      text: {
        primary: isDark ? palette.parchment : palette.ink,
        secondary: isDark ? palette.parchmentDark : palette.bronzeDark
      },
      action: {
        active: isDark ? palette.parchmentDark : palette.bronzeDark
      },
      divider: isDark ? "rgba(217, 169, 58, 0.3)" : "rgba(138, 101, 31, 0.45)"
    },
    shape: {
      borderRadius: 8
    },
    typography: {
      fontFamily: "inherit",
      button: { textTransform: "none", fontWeight: 600 }
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${isDark ? "rgba(217, 169, 58, 0.35)" : palette.gold}`
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "#1c3128" : palette.emerald,
            color: palette.parchment
          }
        }
      },
      MuiButton: {
        variants: [
          {
            props: { variant: "contained", color: "primary" },
            style: { color: palette.ink }
          }
        ]
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottomColor: isDark ? "rgba(217, 169, 58, 0.2)" : "rgba(181, 135, 47, 0.25)"
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: isDark ? palette.parchmentDark : palette.bronzeDark,
            "&.Mui-focused": {
              color: isDark ? palette.goldBright : palette.gold
            }
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: isDark ? palette.parchment : palette.ink,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? "rgba(217, 169, 58, 0.45)" : palette.gold,
              borderWidth: 1.5
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? palette.goldBright : palette.bronzeDark
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? palette.goldBright : palette.emerald,
              borderWidth: 2
            }
          }
        }
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            color: isDark ? palette.parchmentDark : palette.bronzeDark
          }
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: isDark ? palette.parchmentDark : palette.bronzeDark
          }
        }
      }
    }
  });
}
