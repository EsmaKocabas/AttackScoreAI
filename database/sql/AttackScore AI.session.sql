
GRANT ALL ON SCHEMA public TO CURRENT_USER;
GRANT ALL ON SCHEMA public TO public;

-- 1. TABLOLAR (Entities & Constraints)
-- =====================================================

-- 1. Ligler
CREATE TABLE Ligler (
    LigID SERIAL PRIMARY KEY,
    LigAdi VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Sezonlar
CREATE TABLE Sezonlar (
    SezonID SERIAL PRIMARY KEY,
    SezonAdi VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Takimlar
CREATE TABLE Takimlar (
    TakimID SERIAL PRIMARY KEY,
    TakimAdi VARCHAR(100) DEFAULT 'Genel',
    LigID INT REFERENCES Ligler(LigID) -- FK Var
);

-- 4. Oyuncular
CREATE TABLE Oyuncular (
    OyuncuID SERIAL PRIMARY KEY,
    AdSoyad VARCHAR(150) NOT NULL,
    KayitTarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Temel Performans (Düzeltildi: Sondaki virgül kalktı, Unique eklendi)
CREATE TABLE Performans_Temel (
    TemelID BIGSERIAL PRIMARY KEY,
    OyuncuID INT REFERENCES Oyuncular(OyuncuID) ON DELETE CASCADE, -- FK Var
    SezonID INT REFERENCES Sezonlar(SezonID), -- FK Var
    TakimID INT REFERENCES Takimlar(TakimID), -- FK Var
    MacSayisi DECIMAL(5,1) DEFAULT 0, 
    Dakika DECIMAL(10,1) CHECK (Dakika >= 0), 
    Gol DECIMAL(5,1) DEFAULT 0 CHECK (Gol >= 0),
    Asist DECIMAL(5,1) DEFAULT 0,
    -- EKSİK OLAN CONSTRAINT EKLENDİ:
    CONSTRAINT unq_temel_oyuncu UNIQUE (OyuncuID, SezonID)
);

-- 6. Detaylı Analiz (Düzeltildi: Sondaki virgül kalktı)
CREATE TABLE Performans_Detay (
    DetayID BIGSERIAL PRIMARY KEY,
    OyuncuID INT REFERENCES Oyuncular(OyuncuID) ON DELETE CASCADE, -- FK Var
    SezonID INT REFERENCES Sezonlar(SezonID), -- FK Var
    xG DECIMAL(6,2),          
    Gol_Per90 DECIMAL(6,2),   
    Asist_Per90 DECIMAL(6,2), 
    Sut_Per90 DECIMAL(6,2),
    Isabetli_Sut_Per90 DECIMAL(6,2),
    Gol_Sut_Orani DECIMAL(6,2),
    Skor_Katkisi DECIMAL(6,2),
    CONSTRAINT unq_detay_oyuncu UNIQUE (OyuncuID, SezonID)
);

-- 7. Tahminler
CREATE TABLE Tahminler (
    TahminID BIGSERIAL PRIMARY KEY,
    OyuncuID INT REFERENCES Oyuncular(OyuncuID), -- FK Var
    TahminTarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    GolKraliOlasiligi DECIMAL(5,4),
    CONSTRAINT unq_tahmin_gun UNIQUE (OyuncuID, TahminTarihi) 
);

-- 8. App Kullanıcılar
CREATE TABLE AppKullanicilar (
    AppUserID SERIAL PRIMARY KEY,
    KullaniciAdi VARCHAR(50) NOT NULL UNIQUE, 
    SifreHash VARCHAR(255) NOT NULL, 
    Rol VARCHAR(20) NOT NULL CHECK (Rol IN ('admin', 'user')), 
    Email VARCHAR(100),
    KayitTarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. SORGU PERFORMANSI STRATEJİLERİ
-- =====================================================

-- İsimle aramaları hızlandırır (Oyuncu ararken)
CREATE INDEX idx_oyuncu_adsoyad ON Oyuncular(AdSoyad);

-- Gol krallığı sıralamasını anında getirir
CREATE INDEX idx_performans_gol ON Performans_Temel(Gol DESC);

-- Analiz tablolarındaki birleştirmeleri (JOIN) hızlandırır
CREATE INDEX idx_detay_oyuncu ON Performans_Detay(OyuncuID);

-- =====================================================
--3. KULLANICI TANIMLI FONKSİYONLAR
-- =====================================================
-- 1. Verimlilik Hesaplama Fonksiyonu
CREATE OR REPLACE FUNCTION fn_VerimlilikHesapla(gol DECIMAL, asist DECIMAL, dakika DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    IF dakika = 0 THEN RETURN 0; END IF;
    -- Formül: (Gol + Asist) / (Dakika / 90) -> 90 dakikadaki skor katkısı
    RETURN ((gol + asist) / (dakika / 90.0));
END;
$$ LANGUAGE plpgsql;

-- 2. Bitiricilik Oranı (Gol / Şut yüzdesi)
CREATE OR REPLACE FUNCTION fn_BitiricilikOrani(gol DECIMAL, sut_macbasi DECIMAL, mac_sayisi DECIMAL)
RETURNS DECIMAL AS $$
DECLARE
    toplam_sut DECIMAL;
BEGIN
    toplam_sut := sut_macbasi * mac_sayisi;
    IF toplam_sut = 0 THEN RETURN 0; END IF;
    RETURN (gol / toplam_sut) * 100;
END;
$$ LANGUAGE plpgsql;
-- =====================================================
-- 4. VIEWS 
-- =====================================================

-- View 1: Tüm Verilerin Birleşmiş Hali 

CREATE OR REPLACE VIEW vw_TumVeriler AS
SELECT 
    o.OyuncuID, o.AdSoyad, 
    t.MacSayisi, t.Dakika, t.Gol, t.Asist,
    d.xG, d.Gol_Per90, d.Asist_Per90, d.Sut_Per90, 
    d.Isabetli_Sut_Per90, d.Gol_Sut_Orani, d.Skor_Katkisi
FROM Oyuncular o
JOIN Performans_Temel t ON o.OyuncuID = t.OyuncuID
JOIN Performans_Detay d ON o.OyuncuID = d.OyuncuID;

-- View 2: Gol Krallığı Sıralaması (Basit Rapor)
CREATE OR REPLACE VIEW vw_GolKralligi AS
SELECT o.AdSoyad, t.Gol, t.MacSayisi, t.Dakika
FROM Performans_Temel t
JOIN Oyuncular o ON t.OyuncuID = o.OyuncuID
ORDER BY t.Gol DESC;

-- View 3: Verimsiz Golcüler (xG'si yüksek ama Golü düşük olanlar)
CREATE OR REPLACE VIEW vw_VerimsizGolculer AS
SELECT o.AdSoyad, t.Gol, d.xG, (d.xG - t.Gol) as KacirilanGolBeklentisi
FROM Performans_Temel t
JOIN Performans_Detay d ON t.OyuncuID = d.OyuncuID
JOIN Oyuncular o ON t.OyuncuID = o.OyuncuID
WHERE d.xG > t.Gol;

-- View 4: Genç Yetenek Analizi (Dakikası az ama skoru yüksek)
-- Burada yazdığımız 'fn_VerimlilikHesapla' fonksiyonunu kullanıyoruz!
CREATE OR REPLACE VIEW vw_GizliYetenekler AS
SELECT o.AdSoyad, t.Dakika, 
       fn_VerimlilikHesapla(t.Gol, t.Asist, t.Dakika) as Per90Skor
FROM Performans_Temel t
JOIN Oyuncular o ON t.OyuncuID = o.OyuncuID
WHERE t.Dakika < 1000 AND t.Dakika > 100; -- Filtre

-- View 5: Şut Kalitesi Analizi
CREATE OR REPLACE VIEW vw_SutKalitesi AS
SELECT o.AdSoyad, d.Sut_Per90, d.Isabetli_Sut_Per90, d.Gol_Sut_Orani
FROM Performans_Detay d
JOIN Oyuncular o ON d.OyuncuID = o.OyuncuID
ORDER BY d.Gol_Sut_Orani DESC;

-- =====================================================
-- 5. STORED PROCEDURES 
-- =====================================================
-- SP 1: Mevcut oyuncu performansını CSV'den gelen ID/Sezon/Takım ile upsert eder
CREATE OR REPLACE PROCEDURE sp_PerformansKaydet(
    p_OyuncuID INT,
    p_SezonID INT,
    p_TakimID INT,
    p_Mac DECIMAL, p_Gol DECIMAL, p_Asist DECIMAL, p_Dakika DECIMAL,
    p_xG DECIMAL, p_Gol90 DECIMAL, p_Asist90 DECIMAL, p_Sut90 DECIMAL, 
    p_IsabetSut90 DECIMAL, p_GolSutOran DECIMAL, p_SkorKatki DECIMAL
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
            Gol = EXCLUDED.Gol,
            Asist = EXCLUDED.Asist,
            Dakika = EXCLUDED.Dakika,
            TakimID = EXCLUDED.TakimID;

    INSERT INTO Performans_Detay (OyuncuID, SezonID, xG, Gol_Per90, Asist_Per90, Sut_Per90, Isabetli_Sut_Per90, Gol_Sut_Orani, Skor_Katkisi)
    VALUES (p_OyuncuID, p_SezonID, p_xG, p_Gol90, p_Asist90, p_Sut90, p_IsabetSut90, p_GolSutOran, p_SkorKatki)
    ON CONFLICT (OyuncuID, SezonID) DO UPDATE
        SET xG = EXCLUDED.xG,
            Gol_Per90 = EXCLUDED.Gol_Per90,
            Asist_Per90 = EXCLUDED.Asist_Per90,
            Sut_Per90 = EXCLUDED.Sut_Per90,
            Isabetli_Sut_Per90 = EXCLUDED.Isabetli_Sut_Per90,
            Gol_Sut_Orani = EXCLUDED.Gol_Sut_Orani,
            Skor_Katkisi = EXCLUDED.SkorKatkisi;

END;
$$;


-- SP 2: Tahmin Sonucu Yazma (doğrulama + upsert)
CREATE OR REPLACE PROCEDURE sp_TahminKaydet(
    p_OyuncuID INT,
    p_Olasilik DECIMAL,
    p_Tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Basit doğrulama
    IF p_OyuncuID IS NULL THEN
        RAISE EXCEPTION 'OyuncuID zorunludur';
    END IF;
    IF p_Olasilik < 0 OR p_Olasilik > 1 THEN
        RAISE EXCEPTION 'Olasilik 0-1 araliginda olmalidir';
    END IF;

    -- Oyuncu var mi kontrolü
    IF NOT EXISTS (SELECT 1 FROM Oyuncular WHERE OyuncuID = p_OyuncuID) THEN
        RAISE EXCEPTION 'Oyuncu bulunamadi: %', p_OyuncuID;
    END IF;

    INSERT INTO Tahminler (OyuncuID, TahminTarihi, GolKraliOlasiligi)
    VALUES (p_OyuncuID, p_Tarih, p_Olasilik)
    ON CONFLICT (OyuncuID, TahminTarihi) DO UPDATE
        SET GolKraliOlasiligi = EXCLUDED.GolKraliOlasiligi;

END;
$$;


INSERT INTO Ligler (LigAdi) VALUES ('Premier League');
INSERT INTO Sezonlar (SezonAdi) VALUES ('2025-2026');
INSERT INTO Takimlar (TakimAdi, LigID) VALUES ('Genel Oyuncular', 1);
-- =====================================================
-- 6. YETKİLENDİRME VE MASKELEME
-- =====================================================
-- A) MASKELEME (Data Masking)

CREATE OR REPLACE VIEW vw_GuvenliKullaniciListesi AS
SELECT 
    AppUserID,
    KullaniciAdi,
    Rol,
    CONCAT(
        LEFT(Email, 2), 
        '***', 
        SUBSTRING(Email FROM POSITION('@' IN Email))
    ) AS MaskeliEmail,
    -- Şifre alanı güvenlik gereği hiç gösterilmez (Maskeleme yerine gizleme)
    '********' AS SifreDurumu
FROM AppKullanicilar; --email alanını kullanıcıların göremeyeceği şekilde maskeleriz.

-- B) YETKİLENDİRME (Authorization)
-- Uygulama için iki rol: 'rol_admin' (yönetici) ve 'rol_user' (uygulama kullanıcısı)

-- 1. Rolleri Güvenli Şekilde Oluştur
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'rol_admin') THEN
    CREATE ROLE rol_admin WITH NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'rol_user') THEN
    CREATE ROLE rol_user WITH NOLOGIN;
  END IF;
END
$$;

-- 2. Yetkileri Dağıt

-- YÖNETİCİ (Admin): 
-- Her şeyi yapabilir ama kullanıcı tablosunu okurken maskeli veriyi kullanmalıdır.
GRANT CONNECT ON DATABASE neondb TO rol_admin;
GRANT USAGE ON SCHEMA public TO rol_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO rol_admin;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO rol_admin;
GRANT EXECUTE ON ALL PROCEDURES IN SCHEMA public TO rol_admin;

-- Yönetici bile olsa, AppKullanicilar tablosuna direkt erişimi kapatıp, maskeli View'ı açıyoruz.
REVOKE SELECT ON AppKullanicilar FROM rol_admin;
GRANT SELECT ON vw_GuvenliKullaniciListesi TO rol_admin;


-- UYGULAMA KULLANICISI (User):
-- Arayüzde gördüğü kadar kısıtlı okuma: futbolcu adları ve temel görünür view'lar
GRANT CONNECT ON DATABASE neondb TO rol_user;
GRANT USAGE ON SCHEMA public TO rol_user;
GRANT SELECT ON Oyuncular TO rol_user;
GRANT SELECT ON vw_GolKralligi, vw_TumVeriler TO rol_user;
-- Prosedür/fonksiyon çalıştırmayacak: EXECUTE verilmedi.

-- Kullanıcı rolünün hassas tablolara erişimini engelliyoruz.
REVOKE ALL ON AppKullanicilar FROM rol_user;
REVOKE ALL ON vw_GuvenliKullaniciListesi FROM rol_user;
REVOKE ALL ON Ligler, Sezonlar, Takimlar, Performans_Temel, Performans_Detay FROM rol_user;
