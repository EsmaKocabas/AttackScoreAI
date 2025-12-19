import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/auth.api";
import AdminSidebar from "../../components/admin/adminSidebar";

interface AppUser {
  appuserid: number;
  kullaniciadi: string;
  email: string;
  rol: string;
  sifredurumu?: string;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAllUsers()
      .then((data) => {
        setUsers(data);
        setError(null);
      })
      .catch((error) => {
        console.error("Kullanıcılar alınamadı:", error);
        setError(error?.response?.data?.error || error?.message || "Kullanıcılar yüklenirken bir hata oluştu");
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Kullanıcı Yönetimi</h1>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 rounded-lg p-4 text-sm">
            <div className="font-semibold text-red-800">
              Hata: {error}
            </div>
          </div>
        )}

        {loading ? (
          <div>Yükleniyor...</div>
        ) : !error && users.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            Henüz kullanıcı kaydı bulunmamaktadır.
          </div>
        ) : !error ? (
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Kullanıcı Adı</th>
                  <th className="p-3 text-left">Email (Maskelenmiş)</th>
                  <th className="p-3 text-left">Rol</th>
                  <th className="p-3 text-left">Şifre Durumu</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.appuserid} className="border-t">
                    <td className="p-3">{u.appuserid}</td>
                    <td className="p-3 font-medium">{u.kullaniciadi}</td>
                    <td className="p-3 text-gray-600">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        u.rol === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 font-mono text-xs">
                      {u.sifredurumu || '********'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ManageUsers;

