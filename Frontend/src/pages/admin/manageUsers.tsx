import { useEffect, useState } from "react";
import { getAllUsers, updateUser, deleteUser } from "../../api/auth.api";
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
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    kullaniciadi: "",
    email: "",
    rol: "user",
    sifrehash: "",
  });

  const loadUsers = () => {
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
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (user: AppUser) => {
    setEditingUser(user);
    setEditForm({
      kullaniciadi: user.kullaniciadi,
      email: user.email, // Maskelenmiş email olabilir, ama yine de gösteriyoruz
      rol: user.rol,
      sifrehash: "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const updateData: any = {};
      if (editForm.kullaniciadi !== editingUser.kullaniciadi) {
        updateData.kullaniciadi = editForm.kullaniciadi;
      }
      if (editForm.email && editForm.email !== editingUser.email) {
        updateData.email = editForm.email;
      }
      if (editForm.rol !== editingUser.rol) {
        updateData.rol = editForm.rol;
      }
      if (editForm.sifrehash && editForm.sifrehash.length > 0) {
        updateData.sifrehash = editForm.sifrehash;
      }

      if (Object.keys(updateData).length === 0) {
        setEditingUser(null);
        return;
      }

      await updateUser(editingUser.appuserid, updateData);
      setEditingUser(null);
      setEditForm({ kullaniciadi: "", email: "", rol: "user", sifrehash: "" });
      loadUsers();
    } catch (err: any) {
      setError(err || "Kullanıcı güncellenirken bir hata oluştu");
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId);
      setDeleteConfirm(null);
      loadUsers();
    } catch (err: any) {
      setError(err || "Kullanıcı silinirken bir hata oluştu");
      setDeleteConfirm(null);
    }
  };

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
                  <th className="p-3 text-left">İşlemler</th>
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
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(u)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(u.appuserid)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Kullanıcı Düzenle</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={editForm.kullaniciadi}
                    onChange={(e) => setEditForm({ ...editForm, kullaniciadi: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rol</label>
                  <select
                    value={editForm.rol}
                    onChange={(e) => setEditForm({ ...editForm, rol: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Yeni Şifre (Opsiyonel)</label>
                  <input
                    type="password"
                    value={editForm.sifrehash}
                    onChange={(e) => setEditForm({ ...editForm, sifrehash: e.target.value })}
                    placeholder="Değiştirmek istemiyorsanız boş bırakın"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Kaydet
                </button>
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setEditForm({ kullaniciadi: "", email: "", rol: "user", sifrehash: "" });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Kullanıcıyı Sil</h2>
              <p className="mb-6">
                Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Sil
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;

