export const genProtocol = (length: number = 10): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let protocol = "";
  for (let i = 0; i < length; i++) {
    const indiceAleatorio = Math.floor(Math.random() * chars.length);
    protocol += chars.charAt(indiceAleatorio);
  }
  return protocol;
};
