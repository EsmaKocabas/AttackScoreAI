import playerService from "../../services/player.service.js";

const playerSoapService = {
  PlayerService: {
    PlayerPort: {
      async GetPlayerById(args) {
        const { oyuncuId } = args;

        const oyuncu = await playerService.getPlayerById(oyuncuId);

        if (!oyuncu) {
          return {
            success: false,
            message: "Oyuncu bulunamadı",
          };
        }

        return {
          success: true,
          oyuncuId: oyuncu.oyuncuid,
          adsoyad: oyuncu.adsoyad,
          kayitTarihi: oyuncu.kayitTarihi,
          takimId: oyuncu.takimId,
          performansTemel: oyuncu.performansTemel,
          performansDetay: oyuncu.performansDetay,
          performansTahmin: oyuncu.performansTahmin,
        };
      },
    },
  },
};

export default playerSoapService;
