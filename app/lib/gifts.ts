export type Gift = {
  id: string;
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  badge: string;
  art: string;
  mark: string;
};

export type GiftVendor = {
  id: string;
  seller: string;
  price: string;
};

export type SharedProfile = {
  name: string;
  bio: string;
  favoriteGames: string[];
  platforms: string[];
  wishlistIds: string[];
};

export const gifts: Gift[] = [
  { id: "steam", name: "Steam — Tarjeta regalo", category: "Gaming", price: "$10.00", badge: "EL FAVORITO", art: "steam", mark: "STEAM" },
  { id: "roblox", name: "Roblox — 1,000 Robux", category: "Gaming", price: "$12.49", badge: "PARA JUGAR", art: "roblox", mark: "R" },
  { id: "playstation", name: "PlayStation Store — $20", category: "Gaming", price: "$20.00", oldPrice: "$22.00", badge: "−9%", art: "playstation", mark: "PS" },
  { id: "spotify", name: "Spotify Premium — 3 meses", category: "Suscripciones", price: "$14.99", badge: "MÚSICA PARA TI", art: "spotify", mark: "♫" },
  { id: "nintendo", name: "Nintendo eShop — $25", category: "Gaming", price: "$25.00", badge: "NUEVO", art: "nintendo", mark: "N" },
  { id: "netflix", name: "Netflix — Tarjeta digital", category: "Suscripciones", price: "$15.00", badge: "NOCHE DE PELI", art: "netflix", mark: "N" },
  { id: "xbox", name: "Xbox Game Pass — 1 mes", category: "Gaming", price: "$9.99", badge: "GAME ON", art: "xbox", mark: "X" },
  { id: "amazon", name: "Amazon — Tarjeta regalo", category: "Para todos", price: "$30.00", badge: "ACIERTO SEGURO", art: "amazon", mark: "a" },
];

export const giftVendors: Record<string, GiftVendor[]> = {
  steam: [
    { id: "steam-seller-a", seller: "Proveedor independiente A", price: "$10.00" },
    { id: "steam-seller-b", seller: "Proveedor independiente B", price: "$10.49" },
    { id: "steam-seller-c", seller: "Proveedor independiente C", price: "$10.99" },
  ],
  roblox: [
    { id: "roblox-seller-a", seller: "Proveedor independiente A", price: "$12.49" },
    { id: "roblox-seller-b", seller: "Proveedor independiente B", price: "$12.99" },
    { id: "roblox-seller-c", seller: "Proveedor independiente C", price: "$13.49" },
  ],
  playstation: [
    { id: "playstation-seller-a", seller: "Proveedor independiente A", price: "$20.00" },
    { id: "playstation-seller-b", seller: "Proveedor independiente B", price: "$20.99" },
    { id: "playstation-seller-c", seller: "Proveedor independiente C", price: "$21.49" },
  ],
  spotify: [
    { id: "spotify-seller-a", seller: "Proveedor independiente A", price: "$14.99" },
    { id: "spotify-seller-b", seller: "Proveedor independiente B", price: "$15.49" },
    { id: "spotify-seller-c", seller: "Proveedor independiente C", price: "$15.99" },
  ],
  nintendo: [
    { id: "nintendo-seller-a", seller: "Proveedor independiente A", price: "$25.00" },
    { id: "nintendo-seller-b", seller: "Proveedor independiente B", price: "$25.99" },
    { id: "nintendo-seller-c", seller: "Proveedor independiente C", price: "$26.49" },
  ],
  netflix: [
    { id: "netflix-seller-a", seller: "Proveedor independiente A", price: "$15.00" },
    { id: "netflix-seller-b", seller: "Proveedor independiente B", price: "$15.49" },
    { id: "netflix-seller-c", seller: "Proveedor independiente C", price: "$15.99" },
  ],
  xbox: [
    { id: "xbox-seller-a", seller: "Proveedor independiente A", price: "$9.99" },
    { id: "xbox-seller-b", seller: "Proveedor independiente B", price: "$10.49" },
    { id: "xbox-seller-c", seller: "Proveedor independiente C", price: "$10.99" },
  ],
  amazon: [
    { id: "amazon-seller-a", seller: "Proveedor independiente A", price: "$30.00" },
    { id: "amazon-seller-b", seller: "Proveedor independiente B", price: "$30.99" },
    { id: "amazon-seller-c", seller: "Proveedor independiente C", price: "$31.49" },
  ],
};

export const categories = ["Todo", "Gaming", "Suscripciones", "Para todos"];
export const favoriteGameOptions = [
  "Minecraft",
  "Roblox",
  "Fortnite",
  "Stardew Valley",
  "The Legend of Zelda",
  "Hollow Knight",
  "Animal Crossing",
  "Otro",
];
export const platformOptions = [
  "PC",
  "PlayStation",
  "Xbox",
  "Nintendo Switch",
  "Móvil",
];

export function encodeSharedProfile(profile: SharedProfile): string {
  const bytes = new TextEncoder().encode(JSON.stringify(profile));
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function parseSharedProfile(encodedProfile: string): SharedProfile | null {
  if (encodedProfile.length > 12000) {
    return null;
  }

  const binary = atob(encodedProfile.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const value: unknown = JSON.parse(new TextDecoder().decode(bytes));

  if (typeof value !== "object" || value === null) {
    return null;
  }

  const profile = value as Record<string, unknown>;
  const favoriteGames = Array.isArray(profile.favoriteGames)
    ? profile.favoriteGames.filter(
        (game): game is string =>
          typeof game === "string" && favoriteGameOptions.includes(game),
      )
    : null;
  const rawPlatforms = profile.platforms;
  const platforms = rawPlatforms === undefined
      ? []
      : Array.isArray(rawPlatforms)
        ? rawPlatforms.filter(
            (platform): platform is string =>
              typeof platform === "string" && platformOptions.includes(platform),
          )
        : null;
  const wishlistIds = Array.isArray(profile.wishlistIds)
    ? profile.wishlistIds.filter(
        (id): id is string =>
          typeof id === "string" && gifts.some((gift) => gift.id === id),
      )
    : null;

  if (
    typeof profile.name !== "string" ||
    profile.name.length === 0 ||
    profile.name.length > 40 ||
    typeof profile.bio !== "string" ||
    profile.bio.length > 160 ||
    !favoriteGames ||
    !platforms ||
    !wishlistIds ||
    !Array.isArray(profile.favoriteGames) ||
    favoriteGames.length !== profile.favoriteGames.length ||
    favoriteGames.length > favoriteGameOptions.length ||
    (rawPlatforms !== undefined &&
      (!Array.isArray(rawPlatforms) || platforms.length !== rawPlatforms.length)) ||
    platforms.length > platformOptions.length ||
    !Array.isArray(profile.wishlistIds) ||
    wishlistIds.length !== profile.wishlistIds.length ||
    wishlistIds.length > gifts.length
  ) {
    return null;
  }

  return { name: profile.name, bio: profile.bio, favoriteGames, platforms, wishlistIds };
}
