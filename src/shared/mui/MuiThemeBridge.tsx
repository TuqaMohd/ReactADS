import { useMemo, type ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { useTheme } from "../../contexts/ThemeContext";
import { getMuiTheme } from "./muiTheme";

export default function MuiThemeBridge({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const muiTheme = useMemo(() => getMuiTheme(theme), [theme]);

  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
