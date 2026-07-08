import { useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel
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
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [status, setStatus] = useState<AdventurerStatus | "all">("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 300);
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
      <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
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
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }
          }}
          sx={{ minWidth: 240 }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
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
          paginationMode="server"
          sortingMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          sx={gridSx}
        />
      </Box>
    </Box>
  );
}
