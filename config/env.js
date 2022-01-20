
export const currentEnv = 'dev';
export default {
  dev: {
    baseURL: 'http://collecting-api.timingbio.com/client'
  },
  test: {
    baseURL: 'http://collecting-api.timingbio.com/sampleReceiving/dev'
  },
  prod: {
    baseURL: 'http://collecting-api.timingbio.com/sampleReceiving/pro'
  }
}