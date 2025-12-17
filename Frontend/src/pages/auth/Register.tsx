import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.tsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [kullaniciadi, setKullaniciadi] = useState("");
  const [email, setEmail] = useState("");
  const [sifrehash, setSifrehash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(kullaniciadi, email, sifrehash);
      navigate("/"); // kayıt sonrası ana sayfa
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Kayıt sırasında bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Kayıt Ol
        </h1>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kullaniciadi}
              onChange={(e) => setKullaniciadi(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Şifre
            </label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sifrehash}
              onChange={(e) => setSifrehash(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Zaten hesabın var mı?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
