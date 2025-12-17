import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/auth.api";
import AdminSidebar from "../../components/admin/adminSidebar";

interface AppUser {
  appuserid: number;
  kullaniciadi: string;
  email: string;
  rol: string;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Backend'te /api/auth/users endpoint'i olduğunda burası gerçek data ile dolar
    getAllUsers()
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error("Kullanıcılar alınamadı:", error);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Kullanıcı Yönetimi</h1>

        {loading ? (
          <div>Yükleniyor...</div>
        ) : users.length === 0 ? (
          <div className="text-gray-500">
            Henüz kullanıcı listesi gösterilemiyor.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Kullanıcı Adı</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Rol</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.appuserid} className="border-t">
                    <td className="p-3">{u.appuserid}</td>
                    <td className="p-3 font-medium">{u.kullaniciadi}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3 text-gray-500">{u.rol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;

