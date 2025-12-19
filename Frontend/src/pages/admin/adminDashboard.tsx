import { useEffect, useState } from "react";
import { getAllPredictionsForAdmin } from "../../api/admin.prediction.api";
import AdminSidebar from "../../components/admin/adminSidebar";

interface Prediction {
  tahminid: number;
  oyuncuid: number;
  adsoyad: string;
  rating: number | string; // Backend'den string olarak gelebilir
  golkraliolasiligi?: number | string; // Backward compatibility
  tahmintarihi: string;
}

const AdminDashboard = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAllPredictionsForAdmin()
      .then((data) => {
        setPredictions(data);
        setError(null);
      })
      .catch((error) => {
        console.error("Predictions alınamadı:", error);
        setError(error?.response?.data?.error || error?.message || "Tahminler yüklenirken bir hata oluştu");
        setPredictions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">
          Admin – Rating Takibi
        </h1>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 rounded-lg p-4 text-sm">
            <div className="font-semibold text-red-800">
              Hata: {error}
            </div>
          </div>
        )}

        {!error && predictions.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            Henüz tahmin kaydı bulunmamaktadır.
          </div>
        ) : !error && predictions.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Oyuncu</th>
                  <th className="p-3 text-left">Rating</th>
                  <th className="p-3 text-left">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((p) => (
                  <tr key={p.tahminid} className="border-t">
                    <td className="p-3 font-medium">
                      {p.adsoyad}
                    </td>
                    <td className="p-3">
                      {p.rating !== null && p.rating !== undefined
                        ? Number(p.rating).toFixed(1) 
                        : (p.golkraliolasiligi !== null && p.golkraliolasiligi !== undefined
                          ? (Number(p.golkraliolasiligi) * 100).toFixed(1) 
                          : 'N/A')}/100
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(p.tahmintarihi).toLocaleString("tr-TR")}
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

export default AdminDashboard;
