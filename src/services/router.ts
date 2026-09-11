export type AppRoute = '/' | '/marketplace' | '/artisan-studio' | '/login';

const INTENDED_ROUTE_KEY = 'desi_craft_intended_route';
const INTENDED_MODE_KEY = 'desi_craft_intended_mode';

export function normalizePath(path: string): AppRoute {
  const clean = path.toLowerCase().split('?')[0].replace(/\/+$/, '') || '/';
  if (clean === '/marketplace') return '/marketplace';
  if (clean === '/artisan-studio' || clean === '/studio') return '/artisan-studio';
  if (clean === '/login') return '/login';
  return '/';
}

export function getCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') return '/';
  return normalizePath(window.location.pathname);
}

export function navigate(route: AppRoute | string, replace = false): void {
  if (typeof window === 'undefined') return;
  const target = normalizePath(route);
  if (window.location.pathname !== target) {
    if (replace) {
      window.history.replaceState({ route: target }, '', target);
    } else {
      window.history.pushState({ route: target }, '', target);
    }
    // Dispatch popstate so all listeners update synchronously
    window.dispatchEvent(new PopStateEvent('popstate', { state: { route: target } }));
  }
}

export function setIntendedDestination(route: string, mode?: 'CUSTOMER' | 'ARTISAN'): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(INTENDED_ROUTE_KEY, route);
    if (mode) {
      sessionStorage.setItem(INTENDED_MODE_KEY, mode);
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function getIntendedDestination(): { route: AppRoute; mode: 'CUSTOMER' | 'ARTISAN' | null } {
  if (typeof window === 'undefined') {
    return { route: '/marketplace', mode: null };
  }
  try {
    const rawRoute = sessionStorage.getItem(INTENDED_ROUTE_KEY);
    const rawMode = sessionStorage.getItem(INTENDED_MODE_KEY) as 'CUSTOMER' | 'ARTISAN' | null;
    return {
      route: rawRoute ? normalizePath(rawRoute) : '/marketplace',
      mode: rawMode || null,
    };
  } catch {
    return { route: '/marketplace', mode: null };
  }
}

export function clearIntendedDestination(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(INTENDED_ROUTE_KEY);
    sessionStorage.removeItem(INTENDED_MODE_KEY);
  } catch {
    // Ignore
  }
}
