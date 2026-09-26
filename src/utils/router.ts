import { useState, useEffect } from 'react';

// Client-side lightweight routing helper

export type Route = 
  | { page: 'home' }
  | { page: 'products' }
  | { page: 'product'; productId: string }
  | { page: 'checkout' }
  | { page: 'track'; orderId?: string }
  | { page: 'admin' };

export function parseRoute(): Route {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  // Admin route check
  if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || search.includes('page=admin')) {
    return { page: 'admin' };
  }

  // Checkout route check
  if (path === '/checkout' || path.startsWith('/checkout/') || hash === '#checkout' || search.includes('page=checkout')) {
    return { page: 'checkout' };
  }

  // Tracking route check (Standalone Page)
  if (
    path === '/track' || 
    path.startsWith('/track/') || 
    path === '/track-order' || 
    hash === '#track' || 
    hash === '#track-order' ||
    hash.startsWith('#track-') ||
    search.includes('page=track') ||
    search.includes('track=')
  ) {
    let orderId: string | undefined = undefined;
    if (path.startsWith('/track/')) {
      orderId = path.replace('/track/', '').replace(/\/$/, '').trim();
    } else if (hash.startsWith('#track-')) {
      orderId = hash.replace('#track-', '').trim();
    } else if (search.includes('track=')) {
      const params = new URLSearchParams(window.location.search);
      orderId = params.get('track') || undefined;
    } else if (search.includes('id=')) {
      const params = new URLSearchParams(window.location.search);
      orderId = params.get('id') || undefined;
    }
    return { page: 'track', orderId };
  }

  // All Products route check
  if (path === '/products' || path === '/all-products' || path === '/shop' || hash === '#products' || search.includes('page=products')) {
    return { page: 'products' };
  }

  // Product detail route check
  if (path.startsWith('/product/')) {
    const productId = path.replace('/product/', '').replace(/\/$/, '').trim();
    if (productId) {
      return { page: 'product', productId };
    }
  }

  if (hash.startsWith('#product-')) {
    const productId = hash.replace('#product-', '').trim();
    if (productId) {
      return { page: 'product', productId };
    }
  }

  if (search.includes('product=')) {
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('product');
    if (prodId) {
      return { page: 'product', productId: prodId };
    }
  }

  return { page: 'home' };
}

export function navigateTo(path: string) {
  if (window.location.pathname + window.location.hash !== path) {
    window.history.pushState({}, '', path);
  }
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseRoute());

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRoute());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return route;
}

