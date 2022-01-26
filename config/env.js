
export const currentEnv = 'test';
export default {
  dev: {
    baseURL: 'http://collecting-api.timingbio.com/client'
  },
  test: {
    baseURL: 'https://collecting-api.timingbio.com/client'
  },
  prod: {
    baseURL: 'http://collecting-api.timingbio.com/sampleReceiving/pro'
  }
}