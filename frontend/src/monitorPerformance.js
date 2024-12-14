const monitorPerformance = onPerformanceMetric => {
  if (onPerformanceMetric && typeof onPerformanceMetric === 'function') {
    // Dynamically import the web-vitals library and destructure necessary methods
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Log the various performance metrics to the provided callback function
      getCLS(onPerformanceMetric); // Cumulative Layout Shift
      getFID(onPerformanceMetric); // First Input Delay
      getFCP(onPerformanceMetric); // First Contentful Paint
      getLCP(onPerformanceMetric); // Largest Contentful Paint
      getTTFB(onPerformanceMetric); // Time to First Byte
    });
  }
};

export default monitorPerformance;
