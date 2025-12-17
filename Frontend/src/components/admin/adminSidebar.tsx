import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const baseClasses =
    "block px-4 py-2 rounded-md text-sm font-medium transition-colors";

  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="mb-8">
        <h2 className="text-lg font-bold">Admin Panel</h2>
        <p className="text-xs text-gray-400">Yönetim menüsü</p>
      </div>

      <nav className="space-y-1">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${baseClasses} ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/players"
          className={({ isActive }) =>
            `${baseClasses} ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800"
            }`
          }
        >
          Oyuncu Yönetimi
        </NavLink>

        <NavLink
          to="/admin/predictions"
          className={({ isActive }) =>
            `${baseClasses} ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800"
            }`
          }
        >
          Ratingler
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${baseClasses} ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800"
            }`
          }
        >
          Kullanıcılar
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;

