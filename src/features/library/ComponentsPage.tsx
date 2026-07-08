import { useState, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TableRowsIcon from "@mui/icons-material/TableRows";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";
import { useSettings, type Difficulty } from "../../contexts/SettingsContext";
import { useTheme } from "../../contexts/ThemeContext";

const topAdventurers = [
  { name: "Tuqa", guild: "Admin", score: 9820 },
  { name: "Fake Tuqa", guild: "Admin..maybe...", score: 9410 },
  { name: "Totally Real Tuqa", guild: "Adnnin", score: 9105 }
];

const recentActivity = [
  { adventurer: "Player 1", action: "Cleared all levels", time: "2 hours ago" },
  { adventurer: "Tvqa", action: "Trivia demon", time: "5 hours ago" },
  { adventurer: "Player 3", action: "Ongoing winning streak", time: "1 day ago" },
  { adventurer: "Player 4", action: "Stuck in level 3.. yikes", time: "1 day ago" }
];

export default function ComponentsPage() {
  const { settings, updateSettings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleTabChange(_e: SyntheticEvent, value: number) {
    setActiveTab(value);
  }

  function handleSaveSettings() {
    setSnackbarOpen(true);
  }

  function handleConfirmReset() {
    updateSettings({ difficulty: "normal" });
    setDialogOpen(false);
    setSnackbarOpen(true);
  }

  return (
    <Box>
      <AppBar position="static" elevation={0} sx={{ borderRadius: 2, mb: 2 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Guild Dashboard
          </Typography>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Overview" />
            <Tab label="Activity" />
            <Tab label="Settings" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            <ListItemButton component={Link} to="/library/data-table">
              <ListItemIcon>
                <TableRowsIcon />
              </ListItemIcon>
              <ListItemText primary="Data Table" />
            </ListItemButton>
            <ListItemButton component={Link} to="/dashboard">
              <ListItemIcon>
                <EmojiEventsIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton component={Link} to="/quest">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Quest" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {activeTab === 0 && (
        <Stack spacing={2}>
          <Alert severity="info">This dashboard illustrates our top adventurers with the highest stats.</Alert>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <List>
              {topAdventurers.map((adventurer, index) => (
                <Box key={adventurer.name}>
                  <ListItemButton disableRipple>
                    <ListItemAvatar>
                      <Avatar>{adventurer.name.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={adventurer.name} secondary={`${adventurer.guild} · ${adventurer.score} pts`} />
                  </ListItemButton>
                  {index < topAdventurers.length - 1 && <Divider component="li" />}
                </Box>
              ))}
            </List>
          </Paper>
        </Stack>
      )}

      {activeTab === 1 && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Adventurer</TableCell>
                <TableCell>Action</TableCell>
                <TableCell align="right">When</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentActivity.map((row) => (
                <TableRow key={`${row.adventurer}-${row.action}`}>
                  <TableCell>{row.adventurer}</TableCell>
                  <TableCell>{row.action}</TableCell>
                  <TableCell align="right">{row.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 2 && (
        <Paper variant="outlined" sx={{ p: 3, maxWidth: 420 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <SettingsIcon fontSize="small" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Preferences
              </Typography>
            </Stack>

            <FormControl size="small" fullWidth>
              <InputLabel id="difficulty-label">Difficulty</InputLabel>
              <Select
                labelId="difficulty-label"
                label="Difficulty"
                value={settings.difficulty}
                onChange={(e) => updateSettings({ difficulty: e.target.value as Difficulty })}
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <Typography variant="body2" color="text.secondary">
                Theme
              </Typography>
              <RadioGroup
                row
                value={theme}
                onChange={(e) => {
                  if (e.target.value !== theme) {
                    toggleTheme();
                  }
                }}
              >
                <FormControlLabel value="light" control={<Radio />} label="Light" />
                <FormControlLabel value="dark" control={<Radio />} label="Dark" />
              </RadioGroup>
            </FormControl>

            <Stack direction="row" spacing={1}>
              <Button variant="contained" color="primary" onClick={handleSaveSettings}>
                Save
              </Button>
              <Button variant="outlined" color="error" onClick={() => setDialogOpen(true)}>
                Reset to defaults
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)}>
          Preferences saved.
        </Alert>
      </Snackbar>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Reset preferences?</DialogTitle>
        <DialogContent>
          <DialogContentText>This will set difficulty back to its default.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmReset} color="error" variant="contained">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
