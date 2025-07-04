import { includes, replace } from 'ramda';

// Function to transform internal LocalStack URLs to external URLs (only in development)
export const transformImageUrl = (url) => {
    if (
      process.env.NODE_ENV === 'development' &&
      url &&
      includes('localstack:4566', url)
    ) {
      return replace('localstack:4566', 'localhost:4566', url);
    }
    return url;
}