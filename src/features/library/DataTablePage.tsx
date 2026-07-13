import { useEffect, useMemo, useState } from "react";
import {
  DataGrid, //the table component itself.
  type GridColDef, //types the column definitions
  type GridPaginationModel, 
  type GridSortModel //type the pagination and sorting state that get passed back and forth with the grid.
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import { fetchAdventurers } from "./api/adventurersApi";
import type { Adventurer, AdventurerStatus } from "./types";

const statusLabels: Record<AdventurerStatus, string> = {
  hero: "Hero",
  villain: "Villain",
  ally: "Ally"
};

const statusColors: Record<AdventurerStatus, "secondary" | "error" | "warning"> = {
  hero: "secondary",
  villain: "error",
  ally: "warning"
};

const columns: GridColDef<Adventurer>[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", flex: 1, minWidth: 160 },
  { field: "adventurerClass", headerName: "Class", width: 140 },
  { field: "game", headerName: "Game", width: 100 },
  { field: "level", headerName: "Level", width: 90, type: "number" },
  { field: "score", headerName: "Score", width: 110, type: "number" },
  { field: "joinedDate", headerName: "Released", width: 120 },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <Chip
        label={statusLabels[params.value as AdventurerStatus]}
        color={statusColors[params.value as AdventurerStatus]}
        size="small"
        variant="filled"
      />
    )
  }
];

export default function DataTablePage() {
  const [rows, setRows] = useState<Adventurer[]>([]); 
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]); //Sorting and filtering implementation
  const [status, setStatus] = useState<AdventurerStatus | "all">("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 300); //debounce for search- performance optimization technique that that limits how often a function executes, and delays the execution until some time has passed.
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchAdventurers({
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
      sortField: sortModel[0]?.field as keyof Adventurer | undefined,
      sortDirection: sortModel[0]?.sort ?? undefined,
      status,
      search
    }).then((result) => {
      if (cancelled) return;
      setRows(result.rows);
      setRowCount(result.totalCount);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [paginationModel, sortModel, status, search]);

  const gridSx = useMemo(
    () => ({
      backgroundColor: "background.paper",
      borderRadius: 2
    }),
    []
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: "#2c241b" }}>
        Our Remarkable Learners
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search name or game"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "#5c3a1e" }}/>
                </InputAdornment>
              )
            }
          }}
          sx={{ minWidth: 240,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#adb8be",
              "& input": {
                color: "#2c241b",
                fontWeight: 500
              },
              "& input::placeholder": {
                color: "#6b5637",
                opacity: 1
              },
              "& fieldset": {
                borderColor: "#8a651f",
                borderWidth: 1.5
              },
              "&:hover fieldset": {
                borderColor: "#3d2712"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1f4d3b",
                borderWidth: 2
              }
            }
          }}
        />

        <FormControl size="small"
        sx={{ 
          minWidth: 160,
            "& .MuiInputLabel-root": {
              color: "#5c3a1e",
              fontWeight: 500,
              "&.Mui-focused": {
                color: "#1f4d3b"
              }
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#adb8be",
              color: "#2c241b",
              "& fieldset": {
                borderColor: "#8a651f",
                borderWidth: 1.5
              },
              "&:hover fieldset": {
                borderColor: "#3d2712"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1f4d3b",
                borderWidth: 2
              }
            },
            "& .MuiSelect-icon": {
              color: "#5c3a1e"
            }
          }}
        >
          <InputLabel className = "font-bold p-3" id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as AdventurerStatus | "all")}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="hero">Hero</MenuItem>
            <MenuItem value="villain">Villain</MenuItem>
            <MenuItem value="ally">Ally</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ height: 560 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={rowCount}
          loading={loading}
          paginationMode="server" //req3 - tells DataGrid to not paginate the data itself. This will provide the rows for the current page, and DG will render them+ show the page controls.
          sortingMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          pageSizeOptions={[10, 15, 20]} //rows per page
          disableRowSelectionOnClick
          sx={gridSx}
        />
      </Box>
    </Box>
  );
}
