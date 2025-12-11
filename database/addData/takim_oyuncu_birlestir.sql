-- 1. Oyuncular tablosuna TakimID kolonu ekle (NULL olabilir, çünkü bazı oyuncuların takımı olmayabilir)
ALTER TABLE Oyuncular 
ADD COLUMN IF NOT EXISTS TakimID INT;

-- 2. Foreign Key constraint ekle
ALTER TABLE Oyuncular
ADD CONSTRAINT fk_oyuncu_takim 
FOREIGN KEY (TakimID) REFERENCES Takimlar(TakimID);

-- 3. Mevcut oyuncuların takımlarını güncelle
-- En son sezonun takımını kullan (veya en çok oynadığı takımı)
-- Önce Performans_Temel'deki verilerden en son sezonun takımını al
WITH son_takim AS (
    SELECT DISTINCT ON (pt.OyuncuID) 
        pt.OyuncuID,
        pt.TakimID
    FROM Performans_Temel pt
    JOIN Sezonlar s ON pt.SezonID = s.SezonID
    WHERE pt.TakimID IS NOT NULL
    ORDER BY pt.OyuncuID, s.SezonID DESC
)
UPDATE Oyuncular o
SET TakimID = st.TakimID
FROM son_takim st
WHERE o.OyuncuID = st.OyuncuID
AND o.TakimID IS NULL;

-- Alternatif: Eğer en çok oynadığı takımı kullanmak isterseniz:
/*
WITH en_cok_takim AS (
    SELECT 
        pt.OyuncuID,
        pt.TakimID,
        SUM(pt.Dakika) as toplam_dakika
    FROM Performans_Temel pt
    WHERE pt.TakimID IS NOT NULL
    GROUP BY pt.OyuncuID, pt.TakimID
),
en_cok_oynanan AS (
    SELECT DISTINCT ON (OyuncuID)
        OyuncuID,
        TakimID
    FROM en_cok_takim
    ORDER BY OyuncuID, toplam_dakika DESC
)
UPDATE Oyuncular o
SET TakimID = ect.TakimID
FROM en_cok_oynanan ect
WHERE o.OyuncuID = ect.OyuncuID
AND o.TakimID IS NULL;
*/

-- 4. Kontrol: Takımı olan oyuncu sayısı
SELECT 
    COUNT(*) as toplam_oyuncu,
    COUNT(TakimID) as takimi_olan_oyuncu,
    COUNT(*) - COUNT(TakimID) as takimi_olmayan_oyuncu
FROM Oyuncular;

-- 5. Takımı olan oyuncuları listele
SELECT 
    o.OyuncuID,
    o.AdSoyad,
    t.TakimAdi,
    t.TakimID
FROM Oyuncular o
LEFT JOIN Takimlar t ON o.TakimID = t.TakimID
WHERE o.TakimID IS NOT NULL
ORDER BY t.TakimAdi, o.AdSoyad;

