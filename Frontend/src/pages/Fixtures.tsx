import { useEffect, useState } from "react";
import { getUpcomingFixtures } from "../api/fixture.api";

// Backend FPL fixture response:
// { kickoff_time: string, homeTeam: string, awayTeam: string, gameweek: number }
interface Fixture {
  kickoff_time: string;
  homeTeam: string;
  awayTeam: string;
  gameweek: number;
}

const Fixtures = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUpcomingFixtures(10)
      .then(res => setFixtures(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Yükleniyor...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Yaklaşan Maçlar
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fixtures.map((match) => (
          <div
            key={`${match.gameweek}-${match.homeTeam}-${match.awayTeam}-${match.kickoff_time}`}
            className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
          >
            <span className="font-semibold">
              {match.homeTeam}
            </span>

            <span className="text-gray-500 text-sm">
              vs
            </span>

            <span className="font-semibold">
              {match.awayTeam}
            </span>

            <span className="text-sm text-gray-400">
              {new Date(match.kickoff_time).toLocaleString("tr-TR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fixtures;
