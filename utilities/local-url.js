import { includes, replace } from 'ramda';

// Function to construct image URLs for both local and production environments
export const constructImageUrl = (bucketUrl, key) => {
  if (!bucketUrl || !key) {
    throw new Error('Both bucketUrl and key are required');
  } else if (
    process.env.NODE_ENV === 'development' &&
    includes('localstack:4566', bucketUrl)
  ) {
    return new URL(key, replace('localstack:4566', 'localhost:4566', bucketUrl)).toString();
  } else {
    return new URL(key, bucketUrl).toString();
  }
}
