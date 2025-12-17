import { useEffect, useState } from "react";
import { getAllPredictionsForAdmin } from "../../api/admin.prediction.api";
import AdminSidebar from "../../components/admin/adminSidebar";

interface Prediction {
  tahminid: number;
  oyuncuid: number;
  adsoyad: string;
  golkraliolasiligi: number;
  tahmintarihi: string;
}

const AdminDashboard = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPredictionsForAdmin()
      .then((data) => setPredictions(data))
      .catch((error) => {
        console.error("Predictions alınamadı:", error);
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
          Admin – Prediction Takibi
        </h1>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Oyuncu</th>
                <th className="p-3 text-left">Olasılık</th>
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
                    %{(p.golkraliolasiligi * 100).toFixed(1)}
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(p.tahmintarihi).toLocaleString("tr-TR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
