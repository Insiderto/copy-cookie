import { createSignal, type Component } from 'solid-js';
import CookieTable from './components/CookieTable';
import { getCookieFromCurrentTab } from './extensionApi';


const debugCookies: Record<string, string> = {
  'cookie1': 'value1',
  'debugCookie': 'debugValue',
  'testdata': 'testvalue',
};

const getCookies = async () => {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    const { cookies } = await getCookieFromCurrentTab();

    return cookies;
  }
  return debugCookies;
}

const cookies: Record<string, string> = await getCookies();

const App: Component = () => {
  const hasCookies = Object.keys(cookies).length > 0;

  return (
    <div class='bg-gray-800'>
      {hasCookies ? <CookieTable cookies={cookies} /> : <div class='text-white'> No cookies found</div>}
    </div>
  );
};

export default App;
