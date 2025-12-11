from playwright.sync_api import sync_playwright
from playwright_stealth import stealth_sync
import pandas as pd
import re
import time
import random
from io import StringIO


LIG_URL = "https://fbref.com/en/comps/9/stats/Premier-League-Stats"
OUTPUT = "premier_league_sadece_FW_kariyer.csv"

def random_bekle(min_s=1.0, max_s=2.0):
    time.sleep(random.uniform(min_s, max_s))

def mouse_oynat(page):
    try:
        w = page.viewport_size['width']
        h = page.viewport_size['height']
        for _ in range(2):
            page.mouse.move(random.randint(0, w), random.randint(0, h))
            time.sleep(0.1)
    except:
        pass

def guvenli_float(deger):
    try:
        if pd.isna(deger) or str(deger).strip() == "": return 0.0
        return float(deger)
    except:
        return 0.0

def sutunlari_duzelt(df):
    if isinstance(df.columns, pd.MultiIndex):
        yeni_sutunlar = []
        for col in df.columns:
            if "Unnamed" in str(col[0]) or "level" in str(col[0]):
                yeni_sutunlar.append(str(col[1]).strip())
            else:
                yeni_sutunlar.append(f"{col[0]}_{col[1]}".strip())
        df.columns = yeni_sutunlar
    return df

def tum_tablolari_bul(html):
    tablolar = []
    tablolar.extend(re.findall(r"<table.*?</table>", html, re.DOTALL))
    yorumlar = re.findall(r"", html, re.DOTALL)
    for y in yorumlar:
        if "<table" in y:
            tablolar.extend(re.findall(r"<table.*?</table>", y, re.DOTALL))
    return tablolar

def main():
    tum_veriler = []

    print("Islem baslatiliyor")
    with sync_playwright() as p:
        args = ["--disable-blink-features=AutomationControlled", "--start-maximized"]
        browser = p.chromium.launch(headless=False, args=args)
        context = browser.new_context(
            viewport={"width": 1366, "height": 768},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
        )
        context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        page = context.new_page()
        stealth_sync(page)

        print(f"Liste kaynagi: {LIG_URL}")
        try:
            page.goto(LIG_URL, timeout=90000, wait_until="domcontentloaded")
            mouse_oynat(page)
            page.keyboard.press("PageDown")
            time.sleep(1)
            page.keyboard.press("PageDown")
        except:
            print("Sayfa yuklenirken zaman asimi ")

        content = page.content()
        html_tablolar = tum_tablolari_bul(content)
        
        hedef_df = None
        for tbl in html_tablolar:
            try:
                df = pd.read_html(StringIO(tbl))[0]
                df = sutunlari_duzelt(df)
                cols = [c.lower() for c in df.columns]
                if any("player" in c for c in cols) and any("pos" in c for c in cols):
                    hedef_df = df
                    break
            except:
                continue

        if hedef_df is None:
            print("Tablo bulunamadi")
            browser.close()
            return

        print("Sadece FW  seciliyor ")
        forvet_linkleri = []
        
        pos_col = next((c for c in hedef_df.columns if "Pos" in c), "Pos")
        player_col = next((c for c in hedef_df.columns if "Player" in c), "Player")

        for i, row in hedef_df.iterrows():
            pos = str(row.get(pos_col, ""))
            player = str(row.get(player_col, ""))
            
            
            if "FW" in pos:
                try:
                    safe_player = re.escape(player.split(" ")[0]) 
                    pattern = r'<a href="(/en/players/[^"]+)"[^>]*>.*?' + safe_player
                    m = re.search(pattern, content)
                    if m:
                        link = "https://fbref.com" + m.group(1)
                        if link not in forvet_linkleri:
                            forvet_linkleri.append(link)
                except:
                    continue

        print(f"Toplam {len(forvet_linkleri)} oyuncu bulundu.")
        
        limit = 200 
        
        for i, link in enumerate(forvet_linkleri[:limit]):
            
            stats = {
                "Oyuncu": "Bilinmiyor",
                "Mac": 0, "Gol": 0, "Asist": 0, "Yas": 0, "Dakika": 0, "xG": 0.0,
                "Gol/90": 0.0, "Asist/90": 0.0, 
                "Sut/90": 0.0, "Isabetli_Sut/90": 0.0, "Gol/Sut_Orani": 0.0
            }

            try:
                random_bekle(1.0, 2.0)
                page.goto(link, timeout=60000, wait_until="domcontentloaded")
                
                try: stats["Oyuncu"] = page.locator("h1").first.inner_text().strip()
                except: pass

                detay_html = page.content()
                detay_tablolar = tum_tablolari_bul(detay_html)
                
                
                def kariyer_bul(df):
                    if df.empty: return None
                    col_season = next((c for c in df.columns if "Season" in c), None)
                    if col_season:
                       
                        hedef = df[df[col_season].astype(str).str.contains("Seasons|Career", case=False, na=False)]
                        if not hedef.empty:
                            return hedef.iloc[0]
                   
                    return df.iloc[-1]
                
                
                def yas_bul(df):
                    if df.empty: return 0
                    try:
                       
                        return df.iloc[-2].get("Age", 0) 
                    except:
                        return 0

                veri_bulundu = False
                
         
                for tbl in detay_tablolar:
                    if "stats_standard_dom_lg" in tbl or "Standard Stats" in tbl:
                        try:
                            df_std = pd.read_html(StringIO(tbl))[0]
                            df_std = sutunlari_duzelt(df_std)
                            
                         
                            age_raw = str(yas_bul(df_std))
                            stats["Yas"] = int(age_raw.split("-")[0]) if "-" in age_raw else guvenli_float(age_raw)

                          
                            son = kariyer_bul(df_std)
                            if son is not None:
                                stats["Mac"] = guvenli_float(son.get("Playing Time_MP", son.get("MP", 0)))
                                stats["Dakika"] = guvenli_float(son.get("Playing Time_Min", son.get("Min", 0)))
                                stats["Gol"] = guvenli_float(son.get("Performance_Gls", son.get("Gls", 0)))
                                stats["Asist"] = guvenli_float(son.get("Performance_Ast", son.get("Ast", 0)))
                                stats["xG"] = guvenli_float(son.get("Expected_xG", son.get("xG", 0)))
                                stats["Gol/90"] = guvenli_float(son.get("Per 90 Minutes_Gls", 0))
                                stats["Asist/90"] = guvenli_float(son.get("Per 90 Minutes_Ast", 0))
                                veri_bulundu = True
                        except: continue

                
                for tbl in detay_tablolar:
                    if "stats_shooting" in tbl:
                        try:
                            df_shoot = pd.read_html(StringIO(tbl))[0]
                            df_shoot = sutunlari_duzelt(df_shoot)
                            
                            son = kariyer_bul(df_shoot)
                            if son is not None:
                                stats["Sut/90"] = guvenli_float(son.get("Standard_Sh/90", 0))
                                stats["Isabetli_Sut/90"] = guvenli_float(son.get("Standard_SoT/90", 0))
                                stats["Gol/Sut_Orani"] = guvenli_float(son.get("Standard_G/Sh", 0))
                        except: continue

                if veri_bulundu:
                    print(f"[{i+1}] {stats['Oyuncu']}")
                    print(f"   Mac:{int(stats['Mac'])} | Gol:{int(stats['Gol'])} | Asist:{int(stats['Asist'])} | xG:{stats['xG']}")
                    print(f"   Oranlar -> G/90:{stats['Gol/90']} | Sut/90:{stats['Sut/90']}")
                    print("-" * 30)
                    tum_veriler.append(stats)
                else:
                    print(f"[{i+1}] {stats['Oyuncu']} -> Veri yok.")

            except Exception as e:
                print(f"Hata: {e}")

        browser.close()

    if tum_veriler:
        df_final = pd.DataFrame(tum_veriler)
        
        sutunlar = [
            "Oyuncu", "Mac", "Gol", "Asist", "Yas", "Dakika", "xG",
            "Gol/90", "Asist/90", "Sut/90", "Isabetli_Sut/90", "Gol/Sut_Orani"
        ]
        
        mevcut = [c for c in sutunlar if c in df_final.columns]
        df_final = df_final[mevcut]
        
        df_final.to_csv(OUTPUT, index=False, encoding="utf-8-sig")
        print(f"\nIslem bitti. Dosya: {OUTPUT}")
    else:
        print("Veri cekilemedi.")

if __name__ == "__main__":
    main()