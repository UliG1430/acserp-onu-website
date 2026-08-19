const fbq = (...args) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(...args);
  }
};

export const initPixel = () => {
  // El pixel ya se inicializa en index.html
};

export const trackPageView = () => {
  fbq("track", "PageView");
};

export const trackEvent = (event, data = {}) => {
  fbq("track", event, data);
};
