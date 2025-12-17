import { useEffect, useState } from "react";
import { getPlayers } from "../../api/player.api";
import AdminSidebar from "../../components/admin/adminSidebar";

interface Player {
  oyuncuid: number;
  adsoyad: string;
  takimid: number;
}

const ManagePlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlayers()
      .then((data) => setPlayers(data))
      .catch((error) => {
        console.error("Oyuncular alınamadı:", error);
        setPlayers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Oyuncu Yönetimi</h1>

        {loading ? (
          <div>Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Oyuncu</th>
                  <th className="p-3 text-left">Takım ID</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p.oyuncuid} className="border-t">
                    <td className="p-3">{p.oyuncuid}</td>
                    <td className="p-3 font-medium">{p.adsoyad}</td>
                    <td className="p-3 text-gray-500">{p.takimid}</td>
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

export default ManagePlayers;

