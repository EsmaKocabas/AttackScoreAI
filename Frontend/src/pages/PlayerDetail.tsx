import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

interface Player {
  oyuncuid: number;
  adsoyad: string;
  takimid: number;
  takimadi?: string;
  kayittarihi?: string;
}

interface Prediction {
  rating?: number | string;
  golkraliolasiligi?: number | string;
  tahmintarihi?: string;
  source?: string;
}

const PlayerDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [player, setPlayer] = useState<Player | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [history, setHistory] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ===============================
     PLAYER DETAIL
  =============================== */
  useEffect(() => {
    const fetchPlayer = async () => {
      if (!id) {
        setLoading(false);
        setError("Oyuncu ID bulunamadı");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching player with ID:", id);
        const res = await axiosInstance.get(`/api/players/${id}`);
        console.log("Player response:", res.data);
        
        if (res.data) {
          setPlayer(res.data);
          setError(null);
        } else {
          setError("Oyuncu bulunamadı");
          setPlayer(null);
        }
      } catch (err) {
        console.error("Oyuncu bilgisi alınamadı:", err);
        const errorMessage = (err as any)?.response?.data?.error || "Oyuncu bilgisi alınamadı";
        setError(errorMessage);
        setPlayer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  /* ===============================
     PREDICTION HISTORY
  =============================== */
  const fetchPredictionHistory = async () => {
    if (!id) return;

    try {
      const res = await axiosInstance.get(
        `/api/predictions/history/player/${id}`
      );
      if (res.data && res.data.data) {
        setHistory(res.data.data);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("Prediction geçmişi alınamadı:", err);
      setHistory([]); // Hata durumunda boş array
    }
  };

  /* ===============================
     INITIAL HISTORY LOAD
  =============================== */
  useEffect(() => {
    if (id) {
      fetchPredictionHistory();
    }
  }, [id]);

  /* ===============================
     CREATE PREDICTION
  =============================== */
  const handlePrediction = async () => {
    if (!id) return;

    setPredicting(true);
    setError(null);

    try {
      const res = await axiosInstance.get(
        `/api/predictions/player/${id}`
      );
      
      if (res.data.success && res.data.data) {
        setPrediction(res.data.data);
        setError(null);
        // 🔥 yeni prediction sonrası geçmişi yenile
        await fetchPredictionHistory();
      } else {
        setError("Rating hesaplanamadı");
      }
    } catch (err) {
      console.error("Rating hesaplama hatası:", err);
      const errorMessage = (err as any)?.response?.data?.error || "Rating hesaplanamadı";
      setError(errorMessage);
    } finally {
      setPredicting(false);
    }
  };

  /* ===============================
     STATES
  =============================== */
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div>Yükleniyor...</div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Hata</h2>
          <p className="text-gray-600 mb-4">{error || "Oyuncu bulunamadı"}</p>
          <p className="text-sm text-gray-500">
            Oyuncu ID: {id}
          </p>
          <a 
            href="/players" 
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            ← Oyuncular listesine dön
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="bg-white rounded-xl shadow p-6">
        {/* PLAYER INFO */}
        <h1 className="text-2xl font-bold mb-4">
          {player.adsoyad}
        </h1>

        <p className="text-gray-600">
          Takım: {player.takimadi ?? `ID: ${player.takimid}`}
        </p>

        {player.kayittarihi && (
          <p className="text-sm text-gray-500 mt-1">
            Kayıt Tarihi:{" "}
            {new Date(player.kayittarihi).toLocaleDateString("tr-TR")}
          </p>
        )}

        {/* PREDICTION BUTTON */}
        <button
          onClick={handlePrediction}
          disabled={predicting}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {predicting ? "Rating Hesaplanıyor..." : "Rating Hesapla"}
        </button>

        {/* LAST PREDICTION */}
        {prediction && (
          <div className="mt-6 bg-gray-50 border rounded-lg p-4">
            <h3 className="font-semibold mb-2">
              Son Rating
            </h3>

            <p>
              <strong>Oyuncu Rating:</strong>{" "}
              {prediction.rating 
                ? Number(prediction.rating).toFixed(1) 
                : (prediction.golkraliolasiligi 
                  ? (Number(prediction.golkraliolasiligi) * 100).toFixed(1) 
                  : 'N/A')}/100
            </p>

            {prediction.source && (
              <p className="text-xs text-gray-500 mt-2">
                Kaynak: {prediction.source}
              </p>
            )}
          </div>
        )}

        {/* PREDICTION HISTORY */}
        {history.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold mb-3">
              Rating Geçmişi
            </h3>

            <div className="space-y-2">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between bg-gray-50 border rounded p-2 text-sm"
                >
                  <span>
                    {item.rating 
                      ? Number(item.rating).toFixed(1) 
                      : (item.golkraliolasiligi 
                        ? (Number(item.golkraliolasiligi) * 100).toFixed(1) 
                        : 'N/A')}/100
                  </span>
                  <span className="text-gray-500">
                    {item.tahmintarihi
                      ? new Date(item.tahmintarihi).toLocaleString("tr-TR")
                      : "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 text-red-600 text-sm">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default PlayerDetail;
