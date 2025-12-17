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
  golkraliolasiligi: number;
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
      try {
        const res = await axiosInstance.get(`/api/players/${id}`);
        setPlayer(res.data);
      } catch (err) {
        setError("Oyuncu bilgisi alınamadı");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPlayer();
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
      setHistory(res.data.data);
    } catch (err) {
      console.error("Prediction geçmişi alınamadı");
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
      setPrediction(res.data.data);

      // 🔥 yeni prediction sonrası geçmişi yenile
      await fetchPredictionHistory();
    } catch (err) {
      setError("Prediction alınamadı");
    } finally {
      setPredicting(false);
    }
  };

  /* ===============================
     STATES
  =============================== */
  if (loading) {
    return <div className="p-6 text-center">Yükleniyor...</div>;
  }

  if (!player) {
    return <div className="p-6 text-center">Oyuncu bulunamadı</div>;
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
          {predicting ? "Tahmin Yapılıyor..." : "Prediction Gör"}
        </button>

        {/* LAST PREDICTION */}
        {prediction && (
          <div className="mt-6 bg-gray-50 border rounded-lg p-4">
            <h3 className="font-semibold mb-2">
              Son Tahmin
            </h3>

            <p>
              <strong>Gol Krallığı Olasılığı:</strong>{" "}
              %{(prediction.golkraliolasiligi * 100).toFixed(1)}
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
              Prediction Geçmişi
            </h3>

            <div className="space-y-2">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between bg-gray-50 border rounded p-2 text-sm"
                >
                  <span>
                    %{(item.golkraliolasiligi * 100).toFixed(1)}
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
