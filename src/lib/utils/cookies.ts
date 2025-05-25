import Cookies from "js-cookie";

export const setAuthCookies = (accessToken: string, refreshToken: string, userDetails?: undefined) => {
  Cookies.set("accessToken", accessToken, {
    expires: 0.0104, // 15 min = 0.0104 days
    sameSite: "Lax",
  });

  Cookies.set("refresh_token", refreshToken, {
    expires: 7,
    sameSite: "Lax",
  });

  Cookies.set("userDetails", JSON.stringify(userDetails), { expires: 7 }); 
};

export const clearAuthCookies = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("userDetails");
};