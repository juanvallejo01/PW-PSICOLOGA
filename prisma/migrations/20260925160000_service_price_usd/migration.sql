-- La moneda es dólar estadounidense (USD), no canadiense.
ALTER TABLE "Service" RENAME COLUMN "priceCad" TO "priceUsd";
