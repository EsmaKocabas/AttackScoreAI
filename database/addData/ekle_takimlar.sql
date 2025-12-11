-- Takımları ekle (Premier League için LigID=1)
INSERT INTO Takimlar (TakimAdi, LigID) VALUES
('Manchester City', 1),
('Leeds United', 1),
('Burnley', 1),
('Rennes', 1),
('Fulham', 1),
('Nottingham Forest', 1),
('West Ham United', 1),
('Manchester United', 1),
('Sunderland', 1),
('Crystal Palace', 1),
('Club Brugge', 1),
('Ipswich Town', 1),
('Norwich City', 1),
('Everton', 1),
('Hoffenheim', 1),
('Bayern Münih', 1),
('Wolverhampton Wanderers', 1),
('Bayer Leverkusen', 1),
('RB Leipzig', 1),
('Brentford', 1),
('Tottenham Hotspur', 1),
('Flamengo', 1),
('Brighton & Hove Albion', 1),
('Bournemouth', 1),
('Liverpool', 1),
('Lazio', 1),
('Olympiacos', 1),
('Hellas Verona', 1),
('Chelsea', 1),
('Sporting CP', 1),
('Newcastle United', 1),
('SC Freiburg', 1),
('Wolfsburg', 1),
('Genk', 1),
('Borussia Dortmund', 1),
('Lille', 1),
('AC Milan', 1),
('PSG', 1),
('Arsenal', 1),
('Lorient', 1),
('Fluminense', 1),
('Ajax', 1),
('Lecce', 1),
('Huddersfield Town', 1),
('Nice', 1),
('Millwall', 1),
('Aston Villa', 1),
('Southampton', 1),
('Strasbourg', 1),
('Leicester City', 1),
('Palmeiras', 1),
('Villarreal', 1)
ON CONFLICT DO NOTHING;

-- Oyuncu-Takım eşleştirmelerini güncelle
-- Performans_Temel tablosundaki TakimID'leri güncelle

-- Önce takım isimlerinden ID'leri al
WITH takim_map AS (
    SELECT TakimID, TakimAdi FROM Takimlar
),
oyuncu_map AS (
    SELECT OyuncuID, AdSoyad FROM Oyuncular
)
UPDATE Performans_Temel pt
SET TakimID = tm.TakimID
FROM takim_map tm, oyuncu_map om
WHERE pt.OyuncuID = om.OyuncuID
AND (
    -- Manchester City
    (om.AdSoyad = 'Jack Grealish' AND tm.TakimAdi = 'Manchester City') OR
    (om.AdSoyad = 'Erling Haaland' AND tm.TakimAdi = 'Manchester City') OR
    (om.AdSoyad = 'Sávio' AND tm.TakimAdi = 'Manchester City') OR
    (om.AdSoyad = 'Oscar Bobb' AND tm.TakimAdi = 'Manchester City') OR
    (om.AdSoyad = 'Jeremy Doku' AND tm.TakimAdi = 'Manchester City') OR
    -- Leeds United
    (om.AdSoyad = 'Brenden Aaronson' AND tm.TakimAdi = 'Leeds United') OR
    (om.AdSoyad = 'Wilfried Gnonto' AND tm.TakimAdi = 'Leeds United') OR
    (om.AdSoyad = 'Joël Piroe' AND tm.TakimAdi = 'Leeds United') OR
    -- Burnley
    (om.AdSoyad = 'Lyle Foster' AND tm.TakimAdi = 'Burnley') OR
    (om.AdSoyad = 'Zian Flemming' AND tm.TakimAdi = 'Burnley') OR
    (om.AdSoyad = 'Jaidon Anthony' AND tm.TakimAdi = 'Burnley') OR
    -- Rennes
    (om.AdSoyad = 'Arnaud Kalimuendo' AND tm.TakimAdi = 'Rennes') OR
    -- Fulham
    (om.AdSoyad = 'Tom Cairney' AND tm.TakimAdi = 'Fulham') OR
    (om.AdSoyad = 'Raúl Jiménez' AND tm.TakimAdi = 'Fulham') OR
    (om.AdSoyad = 'Reiss Nelson' AND tm.TakimAdi = 'Fulham') OR
    (om.AdSoyad = 'Adama Traoré' AND tm.TakimAdi = 'Fulham') OR
    -- Nottingham Forest
    (om.AdSoyad = 'Nicolás Domínguez' AND tm.TakimAdi = 'Nottingham Forest') OR
    (om.AdSoyad = 'Taiwo Awoniyi' AND tm.TakimAdi = 'Nottingham Forest') OR
    (om.AdSoyad = 'Jota Silva' AND tm.TakimAdi = 'Nottingham Forest') OR
    (om.AdSoyad = 'Morgan Gibbs-White' AND tm.TakimAdi = 'Nottingham Forest') OR
    (om.AdSoyad = 'Callum Hudson-Odoi' AND tm.TakimAdi = 'Nottingham Forest') OR
    -- West Ham United
    (om.AdSoyad = 'Jarrod Bowen' AND tm.TakimAdi = 'West Ham United') OR
    (om.AdSoyad = 'Tomáš Souček' AND tm.TakimAdi = 'West Ham United') OR
    (om.AdSoyad = 'Crysencio Summerville' AND tm.TakimAdi = 'West Ham United') OR
    (om.AdSoyad = 'Niclas Füllkrug' AND tm.TakimAdi = 'West Ham United') OR
    -- Manchester United
    (om.AdSoyad = 'Alejandro Garnacho' AND tm.TakimAdi = 'Manchester United') OR
    -- Sunderland
    (om.AdSoyad = 'Eliezer Mayenda' AND tm.TakimAdi = 'Sunderland') OR
    (om.AdSoyad = 'Romaine Mundle' AND tm.TakimAdi = 'Sunderland') OR
    (om.AdSoyad = 'Wilson Isidor' AND tm.TakimAdi = 'Sunderland') OR
    -- Crystal Palace
    (om.AdSoyad = 'Eberechi Eze' AND tm.TakimAdi = 'Crystal Palace') OR
    (om.AdSoyad = 'Jean-Philippe Mateta' AND tm.TakimAdi = 'Crystal Palace') OR
    (om.AdSoyad = 'Justin Devenny' AND tm.TakimAdi = 'Crystal Palace') OR
    (om.AdSoyad = 'Eddie Nketiah' AND tm.TakimAdi = 'Crystal Palace') OR
    (om.AdSoyad = 'Ismaila Sarr' AND tm.TakimAdi = 'Crystal Palace') OR
    -- Club Brugge
    (om.AdSoyad = 'Maxim De Cuyper' AND tm.TakimAdi = 'Club Brugge') OR
    (om.AdSoyad = 'Chemsdine Talbi' AND tm.TakimAdi = 'Club Brugge') OR
    -- Ipswich Town
    (om.AdSoyad = 'Liam Delap' AND tm.TakimAdi = 'Ipswich Town') OR
    (om.AdSoyad = 'Omari Hutchinson' AND tm.TakimAdi = 'Ipswich Town') OR
    -- Norwich City
    (om.AdSoyad = 'Ashley Barnes' AND tm.TakimAdi = 'Norwich City') OR
    -- Everton
    (om.AdSoyad = 'Dominic Calvert-Lewin' AND tm.TakimAdi = 'Everton') OR
    (om.AdSoyad = 'Armando Broja' AND tm.TakimAdi = 'Everton') OR
    (om.AdSoyad = 'Beto' AND tm.TakimAdi = 'Everton') OR
    (om.AdSoyad = 'Harrison Armstrong' AND tm.TakimAdi = 'Everton') OR
    (om.AdSoyad = 'James Garner' AND tm.TakimAdi = 'Everton') OR
    (om.AdSoyad = 'Dwight McNeil' AND tm.TakimAdi = 'Everton') OR
    (om.AdSoyad = 'Iliman Ndiaye' AND tm.TakimAdi = 'Everton') OR
    -- Hoffenheim
    (om.AdSoyad = 'Jacob Bruun Larsen' AND tm.TakimAdi = 'Hoffenheim') OR
    -- Bayern Münih
    (om.AdSoyad = 'Mathys Tel' AND tm.TakimAdi = 'Bayern Münih') OR
    -- Wolverhampton Wanderers
    (om.AdSoyad = 'Rayan Aït-Nouri' AND tm.TakimAdi = 'Wolverhampton Wanderers') OR
    (om.AdSoyad = 'Hwang Hee-chan' AND tm.TakimAdi = 'Wolverhampton Wanderers') OR
    (om.AdSoyad = 'Jean-Ricner Bellegarde' AND tm.TakimAdi = 'Wolverhampton Wanderers') OR
    (om.AdSoyad = 'João Gomes' AND tm.TakimAdi = 'Wolverhampton Wanderers') OR
    (om.AdSoyad = 'Sasa Kalajdzic' AND tm.TakimAdi = 'Wolverhampton Wanderers') OR
    -- Bayer Leverkusen
    (om.AdSoyad = 'Florian Wirtz' AND tm.TakimAdi = 'Bayer Leverkusen') OR
    (om.AdSoyad = 'Amine Adli' AND tm.TakimAdi = 'Bayer Leverkusen') OR
    -- RB Leipzig
    (om.AdSoyad = 'Benjamin Šeško' AND tm.TakimAdi = 'RB Leipzig') OR
    (om.AdSoyad = 'Xavi Simons' AND tm.TakimAdi = 'RB Leipzig') OR
    -- Brentford
    (om.AdSoyad = 'Yoane Wissa' AND tm.TakimAdi = 'Brentford') OR
    (om.AdSoyad = 'Thiago' AND tm.TakimAdi = 'Brentford') OR
    (om.AdSoyad = 'Fabio Carvalho' AND tm.TakimAdi = 'Brentford') OR
    -- Tottenham Hotspur
    (om.AdSoyad = 'Rodrigo Bentancur' AND tm.TakimAdi = 'Tottenham Hotspur') OR
    (om.AdSoyad = 'Richarlison' AND tm.TakimAdi = 'Tottenham Hotspur') OR
    (om.AdSoyad = 'Lucas Bergvall' AND tm.TakimAdi = 'Tottenham Hotspur') OR
    (om.AdSoyad = 'Brennan Johnson' AND tm.TakimAdi = 'Tottenham Hotspur') OR
    -- Flamengo
    (om.AdSoyad = 'Carlos Alcaraz' AND tm.TakimAdi = 'Flamengo') OR
    -- Brighton & Hove Albion
    (om.AdSoyad = 'Brajan Gruda' AND tm.TakimAdi = 'Brighton & Hove Albion') OR
    (om.AdSoyad = 'Georginio Rutter' AND tm.TakimAdi = 'Brighton & Hove Albion') OR
    (om.AdSoyad = 'Kaoru Mitoma' AND tm.TakimAdi = 'Brighton & Hove Albion') OR
    (om.AdSoyad = 'Danny Welbeck' AND tm.TakimAdi = 'Brighton & Hove Albion') OR
    (om.AdSoyad = 'Yankuba Minteh' AND tm.TakimAdi = 'Brighton & Hove Albion') OR
    (om.AdSoyad = 'Ferdi Kadioglu' AND tm.TakimAdi = 'Brighton & Hove Albion') OR
    (om.AdSoyad = 'Simon Adingra' AND tm.TakimAdi = 'Brighton & Hove Albion') OR
    (om.AdSoyad = 'João Pedro' AND tm.TakimAdi = 'Brighton & Hove Albion') OR
    -- Bournemouth
    (om.AdSoyad = 'Dango Ouattara' AND tm.TakimAdi = 'Bournemouth') OR
    (om.AdSoyad = 'Antoine Semenyo' AND tm.TakimAdi = 'Bournemouth') OR
    (om.AdSoyad = 'Ryan Christie' AND tm.TakimAdi = 'Bournemouth') OR
    (om.AdSoyad = 'Evanilson' AND tm.TakimAdi = 'Bournemouth') OR
    (om.AdSoyad = 'Enes Ünal' AND tm.TakimAdi = 'Bournemouth') OR
    (om.AdSoyad = 'Tyler Adams' AND tm.TakimAdi = 'Bournemouth') OR
    -- Liverpool
    (om.AdSoyad = 'Federico Chiesa' AND tm.TakimAdi = 'Liverpool') OR
    (om.AdSoyad = 'Cody Gakpo' AND tm.TakimAdi = 'Liverpool') OR
    (om.AdSoyad = 'Mohamed Salah' AND tm.TakimAdi = 'Liverpool') OR
    -- Lazio
    (om.AdSoyad = 'Loum Tchaouna' AND tm.TakimAdi = 'Lazio') OR
    -- Olympiacos
    (om.AdSoyad = 'Charalampos Kostoulas' AND tm.TakimAdi = 'Olympiacos') OR
    -- Hellas Verona
    (om.AdSoyad = 'Diego Coppola' AND tm.TakimAdi = 'Hellas Verona') OR
    -- Chelsea
    (om.AdSoyad = 'Enzo Fernández' AND tm.TakimAdi = 'Chelsea') OR
    (om.AdSoyad = 'Noni Madueke' AND tm.TakimAdi = 'Chelsea') OR
    (om.AdSoyad = 'Jadon Sancho' AND tm.TakimAdi = 'Chelsea') OR
    (om.AdSoyad = 'Joshua Acheampong' AND tm.TakimAdi = 'Chelsea') OR
    -- Sporting CP
    (om.AdSoyad = 'Marcus Edwards' AND tm.TakimAdi = 'Sporting CP') OR
    (om.AdSoyad = 'Viktor Gyökeres' AND tm.TakimAdi = 'Sporting CP') OR
    -- Newcastle United
    (om.AdSoyad = 'Alexander Isak' AND tm.TakimAdi = 'Newcastle United') OR
    (om.AdSoyad = 'William Osula' AND tm.TakimAdi = 'Newcastle United') OR
    (om.AdSoyad = 'Harvey Barnes' AND tm.TakimAdi = 'Newcastle United') OR
    -- SC Freiburg
    (om.AdSoyad = 'Merlin Röhl' AND tm.TakimAdi = 'SC Freiburg') OR
    -- Wolfsburg
    (om.AdSoyad = 'Lukas Nmecha' AND tm.TakimAdi = 'Wolfsburg') OR
    -- Wolverhampton Wanderers (zaten yukarıda)
    -- Matheus Cunha
    (om.AdSoyad = 'Matheus Cunha' AND tm.TakimAdi = 'Wolverhampton Wanderers') OR
    -- Genk
    (om.AdSoyad = 'Tolu Arokodare' AND tm.TakimAdi = 'Genk') OR
    -- Borussia Dortmund
    (om.AdSoyad = 'Donyell Malen' AND tm.TakimAdi = 'Borussia Dortmund') OR
    -- Lille
    (om.AdSoyad = 'Gabriel Gudmundsson' AND tm.TakimAdi = 'Lille') OR
    -- AC Milan
    (om.AdSoyad = 'Samuel Chukwueze' AND tm.TakimAdi = 'AC Milan') OR
    (om.AdSoyad = 'Noah Okafor' AND tm.TakimAdi = 'AC Milan') OR
    -- PSG
    (om.AdSoyad = 'Randal Kolo Muani' AND tm.TakimAdi = 'PSG') OR
    -- Arsenal
    (om.AdSoyad = 'Mikel Merino' AND tm.TakimAdi = 'Arsenal') OR
    (om.AdSoyad = 'Kai Havertz' AND tm.TakimAdi = 'Arsenal') OR
    (om.AdSoyad = 'Leandro Trossard' AND tm.TakimAdi = 'Arsenal') OR
    (om.AdSoyad = 'Bukayo Saka' AND tm.TakimAdi = 'Arsenal') OR
    -- Lorient
    (om.AdSoyad = 'Eli Junior Kroupi' AND tm.TakimAdi = 'Lorient') OR
    -- Fluminense
    (om.AdSoyad = 'Jhon Arias' AND tm.TakimAdi = 'Fluminense') OR
    -- Ajax
    (om.AdSoyad = 'Brian Brobbey' AND tm.TakimAdi = 'Ajax') OR
    (om.AdSoyad = 'Bertrand Traoré' AND tm.TakimAdi = 'Ajax') OR
    -- Lecce
    (om.AdSoyad = 'Patrick Dorgu' AND tm.TakimAdi = 'Lecce') OR
    -- Huddersfield Town
    (om.AdSoyad = 'Callum Marshall' AND tm.TakimAdi = 'Huddersfield Town') OR
    -- Nice
    (om.AdSoyad = 'Evann Guessand' AND tm.TakimAdi = 'Nice') OR
    -- Millwall
    (om.AdSoyad = 'Romain Esse' AND tm.TakimAdi = 'Millwall') OR
    -- Aston Villa
    (om.AdSoyad = 'Emi Buendía' AND tm.TakimAdi = 'Aston Villa') OR
    (om.AdSoyad = 'Ollie Watkins' AND tm.TakimAdi = 'Aston Villa') OR
    -- Southampton
    (om.AdSoyad = 'Mateus Fernandes' AND tm.TakimAdi = 'Southampton') OR
    -- Strasbourg
    (om.AdSoyad = 'Dilane Bakwa' AND tm.TakimAdi = 'Strasbourg') OR
    -- Leicester City
    (om.AdSoyad = 'Odsonne Édouard' AND tm.TakimAdi = 'Leicester City') OR
    -- Palmeiras
    (om.AdSoyad = 'Estêvão Willian' AND tm.TakimAdi = 'Palmeiras') OR
    -- Villarreal
    (om.AdSoyad = 'Thierno Barry' AND tm.TakimAdi = 'Villarreal') OR
    (om.AdSoyad = 'Yeremi Pino' AND tm.TakimAdi = 'Villarreal') OR
    -- 1. FC Nürnberg
    (om.AdSoyad = 'Stefanos Tzimas' AND tm.TakimAdi = '1. FC Nürnberg')
);

-- Kontrol için: Kaç oyuncu güncellendi?
SELECT COUNT(*) as guncellenen_oyuncu_sayisi
FROM Performans_Temel pt
JOIN Oyuncular o ON pt.OyuncuID = o.OyuncuID
JOIN Takimlar t ON pt.TakimID = t.TakimID
WHERE t.TakimAdi != 'Genel Oyuncular';

