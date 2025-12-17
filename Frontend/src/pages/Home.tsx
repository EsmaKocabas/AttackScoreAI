function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            AttackScore AI
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Welcome to AttackScore AI - Futbol tahminleri ve oyuncu analizleri için yapay zeka platformu
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Oyuncular</h2>
              <p className="text-gray-600">Oyuncu detaylarını ve istatistiklerini görüntüleyin</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-green-800 mb-2">Maçlar</h2>
              <p className="text-gray-600">Yaklaşan maçları ve fikstürleri inceleyin</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-purple-800 mb-2">Tahminler</h2>
              <p className="text-gray-600">AI destekli gol krallığı tahminleri alın</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

