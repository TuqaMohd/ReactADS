import { NavLink, Outlet } from "react-router-dom";
import MuiThemeBridge from "../../shared/mui/MuiThemeBridge";

const links = [
  { to: "/library/data-table", label: "Data Table" },
  { to: "/library/components", label: "Components" }
];

export default function LibraryLayout() {
  return (
    <div>
      <h2 className="font-serif font-bold text-2xl text-emeraldDark mb-1">Component Library</h2>
      <p className="text-ink/70 text-sm mb-4 font-semibold">
        Below is a library of our most famous travellers who seeked the path of knowledge.
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border text-xs sm:text-sm font-bold " +
              (isActive
                ? "bg-emerald text-parchmentDark border-emeraldDark shadow-md shadow-emerald"
                : "bg-parchmentDark border-gold text-ink transition duration-300 ease-in-out hover:scale-105 ")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <MuiThemeBridge>
        <Outlet />
      </MuiThemeBridge>
    </div>
  );
}
