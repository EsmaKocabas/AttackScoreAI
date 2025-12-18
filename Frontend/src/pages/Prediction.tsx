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

  //rating tahmini formu için stateler
  const [playerName, setPlayerName] = useState<string>("");
  const [macDakikasi, setMacDakikasi] = useState<string>("");
  const [xg, setXg] = useState<string>("");
  const [sut90, setSut90] = useState<string>("");
  const [isabetliSut90, setIsabetliSut90] = useState<string>("");
  const [manualRating, setManualRating] = useState<number | null>(null);

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

  // Oyuncu adı için: sadece harf ve boşluk kabul et (noktalama ve sayı yok)
  const handlePlayerNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = e.target.value;
    const sanitized = raw.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, "");
    setPlayerName(sanitized);
  };

  // Tüm alanlar dolu mu kontrolü
  const isManualFormValid =
    macDakikasi.trim() !== "" &&
    xg.trim() !== "" &&
    sut90.trim() !== "" &&
    playerName.trim() !== "" &&
    isabetliSut90.trim() !== "";

  // Basit bir örnek rating hesaplama (UI odaklı, backend'e bağlanabilir)
  const handleManualPredict = () => {
    if (!isManualFormValid) return;

    const mac = Number(macDakikasi) || 0;
    const xgVal = Number(xg) || 0;
    const sut = Number(sut90) || 0;
    const isabetli = Number(isabetliSut90) || 0;

    // Örnek, çok basit ve sadece demo amaçlı formül
    let score =
      xgVal * 25 +
      sut * 10 +
      isabetli * 15 +
      (mac > 0 ? Math.min(mac, 90) * 0.2 : 0);

    // 0-100 aralığına sıkıştır
    if (score > 100) score = 100;
    if (score < 0) score = 0;

    setManualRating(Number(score.toFixed(1)));
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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tahminler</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SOL TARAF: Oyuncu rating geçmişi */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Oyuncu Rating Geçmişi</h2>

          {/* Oyuncu seçimi */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Oyuncu Seç
            </label>
            {loadingPlayers ? (
              <div>Oyuncular yükleniyor...</div>
            ) : (
              <select
                value={selectedPlayerId ?? ""}
                onChange={handleSelectChange}
                className="border rounded-lg px-3 py-2 w-full"
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
            <div className="mt-6 overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
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
                        {h.rating
                          ? Number(h.rating).toFixed(1)
                          : h.golkraliolasiligi
                          ? (Number(h.golkraliolasiligi) * 100).toFixed(1)
                          : "N/A"}
                        /100
                      </td>
                      <td className="p-3 text-gray-500">
                        {new Date(h.tahmintarihi).toLocaleString("tr-TR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loadingHistory && history.length === 0 && selectedPlayerId && (
            <div className="mt-4 text-gray-500 text-sm">
              Bu oyuncu için henüz rating geçmişi bulunamadı.
            </div>
          )}
        </div>

        {/* rating tahmini formu */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Rating Tahmini
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Oyuncu Adı
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Örn: Lionel Messi"
                value={playerName}
                onChange={handlePlayerNameChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Maç Dakikası
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Örn: 90"
                value={macDakikasi}
                onChange={(e) => setMacDakikasi(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Beklenen Gol Sayısı
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Örn: 0.85"
                value={xg}
                onChange={(e) => setXg(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Maç Boyunca Çekilen Şut Sayısı
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Örn: 3.2"
                  value={sut90}
                  onChange={(e) => setSut90(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Maç Boyunca İsabetli Şut Sayısı
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Örn: 1.4"
                  value={isabetliSut90}
                  onChange={(e) => setIsabetliSut90(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleManualPredict}
              disabled={!isManualFormValid}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 w-%50"
            >
              Rating Tahmini Yap
            </button>

            {manualRating !== null && (
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm">
                <div className="font-semibold text-blue-800">
                  Tahmini Rating: {manualRating}/100
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;

