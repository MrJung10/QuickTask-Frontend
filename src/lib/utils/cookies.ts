import Cookies from "js-cookie";

export const setAuthCookies = (accessToken: string, refreshToken: string) => {
  Cookies.set("accessToken", accessToken, {
    expires: 0.0104, // 15 min = 0.0104 days
    sameSite: "Lax",
  });

  Cookies.set("refresh_token", refreshToken, {
    expires: 7,
    sameSite: "Lax",
  });
};

export const clearAuthCookies = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};