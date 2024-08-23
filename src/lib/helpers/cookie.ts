export function setCookie(name: string, value: string, expires?: string) {
  document.cookie = `${name}=${value};expires=${
    expires ?? "Fri, 31 Dec 9999 23:59:59 GMT"
  };path=/`
}

export function getCookie(name: string, cookies?: string): string | null {
  const cookieName = name + "="
  const decodedCookie = decodeURIComponent(cookies ?? document.cookie)
  const cookieArray = decodedCookie.split(";")
  for (let i = 0; i < cookieArray?.length; i++) {
    let cookie = cookieArray[i]
    while (cookie?.charAt(0) === " ") {
      cookie = cookie.substring(1)
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length)
    }
  }
  return null
}

export function removeCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}
