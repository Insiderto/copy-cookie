const getCookieFromCurrentTab = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const cookies = await chrome.cookies.getAll({ url: tab.url });
    const cookiesTable: Record<string, string> = {};
    cookies.forEach((cookie) => {
        cookiesTable[cookie.name] = cookie.value;
    });
    return {
        cookies: cookiesTable,
        origin: new URL(tab.url).origin,
    };
};

export { getCookieFromCurrentTab };