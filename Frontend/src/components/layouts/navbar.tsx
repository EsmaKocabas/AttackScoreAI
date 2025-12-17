import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.tsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* LOGO / TITLE */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        AttackScore
      </Link>

      {/* MENU */}
      <div className="flex items-center gap-4">
        <Link to="/fixtures" className="hover:text-blue-600">
          Maçlar
        </Link>

        <Link to="/players" className="hover:text-blue-600">
          Oyuncular
        </Link>

        {user ? (
          <>
            {/* ADMIN LINK */}
            {user.rol === "admin" && (
              <Link
                to="/admin"
                className="text-red-600 font-semibold hover:underline"
              >
                Admin Panel
              </Link>
            )}

            {/* USER INFO */}
            <span className="text-sm text-gray-600">
              {user.kullaniciadi}
            </span>

            <button
              onClick={handleLogout}
              className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
            >
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-blue-600 hover:underline"
            >
              Giriş
            </Link>
            <Link
              to="/register"
              className="text-green-600 hover:underline"
            >
              Kayıt Ol
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
