#!/bin/bash
# Flask uygulamasını başlatmak için script

cd "$(dirname "$0")"

# Port 5000'de çalışan process'i kontrol et
if lsof -ti:5000 > /dev/null 2>&1; then
    echo "⚠️  Port 5000 kullanımda!"
    echo "Lütfen AirPlay Receiver'ı kapatın:"
    echo "Sistem Ayarları > Genel > AirDrop ve AirPlay > AirPlay Receiver'ı kapatın"
    echo ""
    echo "Veya Flask'ı farklı bir portta çalıştırmak için:"
    echo "export ATTACK_SCORE_API_PORT=5001"
    echo "python3 app.py"
    exit 1
fi

echo "🚀 Flask uygulaması başlatılıyor..."
python3 app.py

