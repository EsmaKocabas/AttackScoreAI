import argparse
import csv
import os
from typing import List, Dict, Any

import psycopg2
from psycopg2.extras import execute_values


def to_number(val: str) -> float:
    """Convert CSV numeric field to float, empty -> 0."""
    if val is None:
        return 0.0
    txt = str(val).strip()
    if txt == "":
        return 0.0
    return float(txt)


def read_csv(path: str) -> List[Dict[str, Any]]:
    rows = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append(
                {
                    "Oyuncu": r["Oyuncu"],
                    "Mac": to_number(r["Mac"]),
                    "Gol": to_number(r["Gol"]),
                    "Asist": to_number(r["Asist"]),
                    "Dakika": to_number(r["Dakika"]),
                    "xG": to_number(r["xG"]),
                    "Gol90": to_number(r["Gol/90"]),
                    "Asist90": to_number(r["Asist/90"]),
                    "Sut90": to_number(r["Sut/90"]),
                    "Isabetli_Sut90": to_number(r["Isabetli_Sut/90"]),
                    "Gol_Sut_Orani": to_number(r["Gol/Sut_Orani"]),
                    "Skor_Katkisi": to_number(r["Skor_Katkisi"]),
                }
            )
    return rows


def insert_players(conn, players: List[str]):
    with conn.cursor() as cur:
        # Önce mevcut oyuncuları kontrol et
        cur.execute("SELECT AdSoyad FROM Oyuncular WHERE AdSoyad = ANY(%s)", (players,))
        existing = {row[0] for row in cur.fetchall()}
        
        # Sadece yeni oyuncuları ekle
        new_players = [p for p in players if p not in existing]
        if new_players:
            execute_values(
                cur,
                """
                INSERT INTO Oyuncular (AdSoyad)
                VALUES %s
                """,
                [(p,) for p in new_players],
            )
        conn.commit()


def fetch_player_ids(conn, players: List[str]) -> Dict[str, int]:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT AdSoyad, OyuncuID
            FROM Oyuncular
            WHERE AdSoyad = ANY(%s)
            """,
            (players,),
        )
        return dict(cur.fetchall())


def upsert_performans_temel(conn, rows: List[Dict[str, Any]], sezon_id: int, takim_id: int, player_ids: Dict[str, int]):
    values = []
    for r in rows:
        pid = player_ids.get(r["Oyuncu"])
        if pid is None:
            continue
        values.append(
            (
                pid,
                sezon_id,
                takim_id,
                r["Mac"],
                r["Gol"],
                r["Asist"],
                r["Dakika"],
            )
        )
    if not values:
        return
    with conn.cursor() as cur:
        execute_values(
            cur,
            """
            INSERT INTO Performans_Temel
              (OyuncuID, SezonID, TakimID, MacSayisi, Gol, Asist, Dakika)
            VALUES %s
            ON CONFLICT ON CONSTRAINT unq_temel_oyuncu DO UPDATE
              SET MacSayisi = EXCLUDED.MacSayisi,
                  Gol       = EXCLUDED.Gol,
                  Asist     = EXCLUDED.Asist,
                  Dakika    = EXCLUDED.Dakika,
                  TakimID   = EXCLUDED.TakimID
            """,
            values,
        )
    conn.commit()


def upsert_performans_detay(conn, rows: List[Dict[str, Any]], sezon_id: int, player_ids: Dict[str, int]):
    values = []
    for r in rows:
        pid = player_ids.get(r["Oyuncu"])
        if pid is None:
            continue
        values.append(
            (
                pid,
                sezon_id,
                r["xG"],
                r["Gol90"],
                r["Asist90"],
                r["Sut90"],
                r["Isabetli_Sut90"],
                r["Gol_Sut_Orani"],
                r["Skor_Katkisi"],
            )
        )
    if not values:
        return
    with conn.cursor() as cur:
        execute_values(
            cur,
            """
            INSERT INTO Performans_Detay
              (OyuncuID, SezonID, xG, Gol_Per90, Asist_Per90, Sut_Per90,
               Isabetli_Sut_Per90, Gol_Sut_Orani, Skor_Katkisi)
            VALUES %s
            ON CONFLICT ON CONSTRAINT unq_detay_oyuncu DO UPDATE
              SET xG                 = EXCLUDED.xG,
                  Gol_Per90          = EXCLUDED.Gol_Per90,
                  Asist_Per90        = EXCLUDED.Asist_Per90,
                  Sut_Per90          = EXCLUDED.Sut_Per90,
                  Isabetli_Sut_Per90 = EXCLUDED.Isabetli_Sut_Per90,
                  Gol_Sut_Orani      = EXCLUDED.Gol_Sut_Orani,
                  Skor_Katkisi       = EXCLUDED.Skor_Katkisi
            """,
            values,
        )
    conn.commit()


def main():
    parser = argparse.ArgumentParser(description="CSV'den futbolcu verisini yükle ve upsert et.")
    parser.add_argument("--csv", required=False, default="c:/Users/Esma/Desktop/Proje/freb_veri/futbolcular_final.csv", help="CSV dosya yolu")
    parser.add_argument("--dsn", required=False, default=os.getenv("DATABASE_URL"), help="Postgres DSN veya env DATABASE_URL")
    parser.add_argument("--sezon-id", type=int, default=1, help="SezonID (varsayılan 1)")
    parser.add_argument("--takim-id", type=int, default=1, help="TakimID (varsayılan 1)")
    args = parser.parse_args()

    if not args.dsn:
        raise SystemExit("DATABASE_URL ortam değişkeni ya da --dsn parametresi gerekli.")

    rows = read_csv(args.csv)
    player_names = list({r["Oyuncu"] for r in rows})

    # Connection string'i temizle ve parse et
    dsn = args.dsn.strip().strip('"').strip("'")
    print(f"Bağlanılıyor... (host: {dsn.split('@')[1].split('/')[0] if '@' in dsn else 'bilinmiyor'})")
    
    try:
        conn = psycopg2.connect(dsn)
    except psycopg2.OperationalError as e:
        raise SystemExit(f"Bağlantı hatası: {e}\n\nConnection string kontrol edin:\n{dsn[:50]}...")
    try:
        insert_players(conn, player_names)
        player_ids = fetch_player_ids(conn, player_names)
        upsert_performans_temel(conn, rows, args.sezon_id, args.takim_id, player_ids)
        upsert_performans_detay(conn, rows, args.sezon_id, player_ids)
    finally:
        conn.close()

    print(f"Yüklendi: {len(rows)} satır, {len(player_ids)} oyuncu eşleşti.")


if __name__ == "__main__":
    main()

