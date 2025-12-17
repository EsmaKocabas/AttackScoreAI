import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

interface Player {
  oyuncuid: number;
  adsoyad: string;
  takimid: number;
  takimadi?: string;
}

const Players = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axiosInstance.get("/api/players");
        setPlayers(res.data);
      } catch (error) {
        console.error("Oyuncular alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return <div className="p-6">Yükleniyor...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Oyuncular</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <Link
            key={player.oyuncuid}
            to={`/players/${player.oyuncuid}`}
            className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition block"
          >
            <h2 className="text-lg font-semibold mb-2">
              {player.adsoyad}
            </h2>

            <p className="text-gray-500 text-sm">
              Takım: {player.takimadi ?? `ID: ${player.takimid}`}
            </p>

            <div className="mt-4 text-blue-600 text-sm font-medium">
              Detayları Gör →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Players;
