-- 1) Verimlilik Hesaplama Fonksiyonu
CREATE OR REPLACE FUNCTION fn_VerimlilikHesapla(
  gol DECIMAL,
  asist DECIMAL,
  dakika DECIMAL
)
RETURNS DECIMAL AS $$
BEGIN
  IF dakika = 0 THEN
    RETURN 0;
  END IF;
  RETURN ((gol + asist) / (dakika / 90.0));
END;
$$ LANGUAGE plpgsql;

-- 2) Bitiricilik Oranı (Gol / Şut yüzdesi)
CREATE OR REPLACE FUNCTION fn_BitiricilikOrani(
  gol DECIMAL,
  sut_macbasi DECIMAL,
  mac_sayisi DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
  toplam_sut DECIMAL;
BEGIN
  toplam_sut := sut_macbasi * mac_sayisi;
  IF toplam_sut = 0 THEN
    RETURN 0;
  END IF;
  RETURN (gol / toplam_sut) * 100;
END;
$$ LANGUAGE plpgsql;

-- 3) Performans Kaydetme Prosedürü
CREATE OR REPLACE PROCEDURE sp_PerformansKaydet(
  p_OyuncuID INT,
  p_SezonID INT,
  p_TakimID INT,
  p_Mac DECIMAL,
  p_Gol DECIMAL,
  p_Asist DECIMAL,
  p_Dakika DECIMAL,
  p_xG DECIMAL,
  p_Gol90 DECIMAL,
  p_Asist90 DECIMAL,
  p_Sut90 DECIMAL,
  p_IsabetSut90 DECIMAL,
  p_GolSutOran DECIMAL,
  p_SkorKatki DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_OyuncuID IS NULL THEN RAISE EXCEPTION 'OyuncuID zorunludur'; END IF;
  IF p_SezonID IS NULL THEN RAISE EXCEPTION 'SezonID zorunludur'; END IF;
  IF p_TakimID IS NULL THEN RAISE EXCEPTION 'TakimID zorunludur'; END IF;

  IF p_Mac < 0 OR p_Gol < 0 OR p_Asist < 0 OR p_Dakika < 0 THEN
    RAISE EXCEPTION 'Mac/Gol/Asist/Dakika negatif olamaz';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM Oyuncular WHERE OyuncuID = p_OyuncuID) THEN
    RAISE EXCEPTION 'Oyuncu bulunamadı: %', p_OyuncuID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM Sezonlar WHERE SezonID = p_SezonID) THEN
    RAISE EXCEPTION 'Sezon bulunamadı: %', p_SezonID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM Takimlar WHERE TakimID = p_TakimID) THEN
    RAISE EXCEPTION 'Takım bulunamadı: %', p_TakimID;
  END IF;

  INSERT INTO Performans_Temel (OyuncuID, SezonID, TakimID, MacSayisi, Gol, Asist, Dakika)
  VALUES (p_OyuncuID, p_SezonID, p_TakimID, p_Mac, p_Gol, p_Asist, p_Dakika)
  ON CONFLICT (OyuncuID, SezonID) DO UPDATE
    SET MacSayisi = EXCLUDED.MacSayisi,
        Gol       = EXCLUDED.Gol,
        Asist     = EXCLUDED.Asist,
        Dakika    = EXCLUDED.Dakika,
        TakimID   = EXCLUDED.TakimID;

  INSERT INTO Performans_Detay (
    OyuncuID, SezonID, xG, Gol_Per90, Asist_Per90,
    Sut_Per90, Isabetli_Sut_Per90, Gol_Sut_Orani, Skor_Katkisi
  )
  VALUES (
    p_OyuncuID, p_SezonID, p_xG, p_Gol90, p_Asist90,
    p_Sut90, p_IsabetSut90, p_GolSutOran, p_SkorKatki
  )
  ON CONFLICT (OyuncuID, SezonID) DO UPDATE
    SET xG                 = EXCLUDED.xG,
        Gol_Per90          = EXCLUDED.Gol_Per90,
        Asist_Per90        = EXCLUDED.Asist_Per90,
        Sut_Per90          = EXCLUDED.Sut_Per90,
        Isabetli_Sut_Per90 = EXCLUDED.Isabetli_Sut_Per90,
        Gol_Sut_Orani      = EXCLUDED.Gol_Sut_Orani,
        Skor_Katkisi       = EXCLUDED.SkorKatkisi;
END;
$$;

-- 4) Tahmin Kaydetme Prosedürü
CREATE OR REPLACE PROCEDURE sp_TahminKaydet(
  p_OyuncuID INT,
  p_Olasilik DECIMAL,
  p_Tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_OyuncuID IS NULL THEN
    RAISE EXCEPTION 'OyuncuID zorunludur';
  END IF;
  IF p_Olasilik < 0 OR p_Olasilik > 1 THEN
    RAISE EXCEPTION 'Olasilik 0-1 araliginda olmalidir';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM Oyuncular WHERE OyuncuID = p_OyuncuID) THEN
    RAISE EXCEPTION 'Oyuncu bulunamadi: %', p_OyuncuID;
  END IF;

  INSERT INTO Tahminler (OyuncuID, TahminTarihi, GolKraliOlasiligi)
  VALUES (p_OyuncuID, p_Tarih, p_Olasilik)
  ON CONFLICT (OyuncuID, TahminTarihi) DO UPDATE
    SET GolKraliOlasiligi = EXCLUDED.GolKraliOlasiligi;
END;
$$;