import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { getPredictionHistoryForPlayer } from "../api/prediction.api";

interface Player {
  oyuncuid: number;
  adsoyad: string;
}

interface PredictionItem {
  tahminid: number | string;
  oyuncuid: number;
  adsoyad: string;
  rating: number | string;
  golkraliolasiligi?: number | string; // Backward compatibility
  tahmintarihi: string;
}

const Prediction = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [history, setHistory] = useState<PredictionItem[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axiosInstance.get("/api/players");
        setPlayers(res.data);
      } catch (error) {
        console.error("Oyuncular alınamadı:", error);
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPlayerId(value ? Number(value) : null);
    setHistory([]);
  };

  const handleLoadHistory = async () => {
    if (!selectedPlayerId) return;
    setLoadingHistory(true);
    try {
      const res = await getPredictionHistoryForPlayer(selectedPlayerId);
      // backend: { success, count, data: [...] }
      const data = (res as any)?.data ?? [];
      setHistory(data);
    } catch (error) {
      console.error("Prediction geçmişi alınamadı:", error);
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Oyuncu Rating Geçmişi
      </h1>

      {/* Oyuncu seçimi */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Oyuncu Seç
        </label>
        {loadingPlayers ? (
          <div>Oyuncular yükleniyor...</div>
        ) : (
          <select
            value={selectedPlayerId ?? ""}
            onChange={handleSelectChange}
            className="border rounded-lg px-3 py-2 w-full max-w-md"
          >
            <option value="">Bir oyuncu seçin</option>
            {players.map((p) => (
              <option key={p.oyuncuid} value={p.oyuncuid}>
                {p.adsoyad}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Geçmişi yükle butonu */}
      <button
        onClick={handleLoadHistory}
        disabled={!selectedPlayerId || loadingHistory}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loadingHistory ? "Yükleniyor..." : "Rating Geçmişini Göster"}
      </button>

      {/* Geçmiş tablosu */}
      {history.length > 0 && (
        <div className="mt-8 overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Tahmin ID</th>
                <th className="p-3 text-left">Rating</th>
                <th className="p-3 text-left">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.tahminid} className="border-t">
                  <td className="p-3">{h.tahminid}</td>
                  <td className="p-3">
                    {h.rating ? Number(h.rating).toFixed(1) : (h.golkraliolasiligi ? (Number(h.golkraliolasiligi) * 100).toFixed(1) : 'N/A')}/100
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(h.tahmintarihi).toLocaleString(
                      "tr-TR"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loadingHistory && history.length === 0 && selectedPlayerId && (
        <div className="mt-4 text-gray-500">
          Bu oyuncu için henüz rating geçmişi bulunamadı.
        </div>
      )}
    </div>
  );
};

export default Prediction;

