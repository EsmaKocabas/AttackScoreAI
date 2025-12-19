import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
// 🆕 YENİ: predictManual eklendi
import { getPredictionHistoryForPlayer, predictManual } from "../api/prediction.api";

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
  // 🆕 YENİ: mac ve dakika ayrı state'ler olarak eklendi
  const [mac, setMac] = useState<string>("");
  const [dakika, setDakika] = useState<string>("");
  // ❌ ESKİ: const [macDakikasi, setMacDakikasi] = useState<string>(""); // Silindi - mac ve dakika ayrıldı
  const [xg, setXg] = useState<string>("");
  const [sut90, setSut90] = useState<string>("");
  const [isabetliSut90, setIsabetliSut90] = useState<string>("");
  const [manualRating, setManualRating] = useState<number | null>(null);
  // 🆕 YENİ: Loading ve error state'leri eklendi
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  // 🆕 YENİ: Tahmin kaydedilme durumu
  const [predictionSaved, setPredictionSaved] = useState<boolean | null>(null);

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
    const playerId = value ? Number(value) : null;
    setSelectedPlayerId(playerId);
    setHistory([]);
    // Seçilen oyuncunun adını bul
    if (playerId) {
      const selectedPlayer = players.find(p => p.oyuncuid === playerId);
      setPlayerName(selectedPlayer?.adsoyad || "");
    } else {
      setPlayerName("");
    }
  };

  // Tüm alanlar dolu mu kontrolü
  const isManualFormValid =
    mac.trim() !== "" &&
    dakika.trim() !== "" &&
    xg.trim() !== "" &&
    sut90.trim() !== "" &&
    selectedPlayerId !== null &&
    isabetliSut90.trim() !== "";

  const handleManualPredict = async () => {
    if (!isManualFormValid) return;

    setLoadingPrediction(true);
    setPredictionError(null);
    setManualRating(null);
    setPredictionSaved(null);

    try {
      const response = await predictManual({
        mac: Number(mac) || 0,
        dakika: Number(dakika) || 0,
        xg: Number(xg) || 0,
        sut90: Number(sut90) || 0,
        isabetliSut90: Number(isabetliSut90) || 0,
        oyuncuId: selectedPlayerId || undefined, // Seçilen oyuncu ID'si
        oyuncuAdi: playerName.trim() || undefined, // Oyuncu adı (opsiyonel)
      });

      if (response.success && response.data) {
        setManualRating(response.data.rating);
        setPredictionError(null);
        setPredictionSaved(response.data.saved || false);
      } else {
        setPredictionError("Tahmin yapılamadı");
        setPredictionSaved(null);
      }
    } catch (error: any) {
      console.error("Rating tahmini hatası:", error);
      const errorMessage = 
        error?.response?.data?.error || 
        error?.message || 
        error?.toString() || 
        "Rating tahmini yapılırken bir hata oluştu";
      setPredictionError(errorMessage);
      setManualRating(null);
    } finally {
      setLoadingPrediction(false);
    }
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
        {/* SOL TARAF: Rating tahmini formu */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Rating Tahmini
          </h2>

          <div className="space-y-4">
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
            {/* 🔄 DEĞİŞTİRİLDİ: Eski tek alan yerine mac ve dakika ayrı alanlar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Maç Sayısı
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Örn: 38"
                  value={mac}
                  onChange={(e) => setMac(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Toplam Dakika
                </label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Örn: 3420"
                  value={dakika}
                  onChange={(e) => setDakika(e.target.value)}
                />
              </div>
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

            {/* 🔄 DEĞİŞTİRİLDİ: Buton loading state ve disabled durumu eklendi */}
            <button
              onClick={handleManualPredict}
              disabled={!isManualFormValid || loadingPrediction}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 w-full"
            >
              {loadingPrediction ? "Hesaplanıyor..." : "Rating Tahmini Yap"}
            </button>
            {/* ❌ ESKİ: className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 w-%50" */}

            {/* 🆕 YENİ: Error gösterimi eklendi */}
            {predictionError && (
              <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-3 text-sm">
                <div className="font-semibold text-red-800">
                  Hata: {predictionError}
                </div>
              </div>
            )}

            {/* 🔄 DEĞİŞTİRİLDİ: Model bilgisi eklendi */}
            {manualRating !== null && !predictionError && (
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm">
                <div className="font-semibold text-blue-800">
                  Tahmini Rating: {manualRating}/100
                </div>
                {/* 🆕 YENİ: Model bilgisi eklendi */}
                <div className="text-xs text-blue-600 mt-1">
                  Attack Score Model V1 ile hesaplandı
                </div>
                {/* 🆕 YENİ: Kaydedilme durumu gösteriliyor */}
                {playerName.trim() && predictionSaved !== null && (
                  <div className={`text-xs mt-1 ${predictionSaved ? 'text-green-600' : 'text-orange-600'}`}>
                    {predictionSaved 
                      ? `✓ ${playerName} için tahmin veritabanına kaydedildi`
                      : `⚠ ${playerName} için oyuncu bulunamadı, tahmin kaydedilmedi`}
                  </div>
                )}
              </div>
            )}
           
          </div>
        </div>

        {/* SAĞ TARAF: Oyuncu rating geçmişi */}
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
      </div>
    </div>
  );
};

export default Prediction;

