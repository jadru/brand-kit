import {
  lemonSqueezySetup,
  createCheckout,
  getCustomer,
  getSubscription,
  updateSubscription,
  cancelSubscription,
} from '@lemonsqueezy/lemonsqueezy.js'
import { LEMONSQUEEZY_CONFIG } from './config'

let _initialized = false

function ensureSetup() {
  if (!_initialized) {
    lemonSqueezySetup({
      apiKey: LEMONSQUEEZY_CONFIG.apiKey,
      onError: (error) => console.error('LemonSqueezy Error:', error),
    })
    _initialized = true
  }
}

export function getLemonSqueezy() {
  ensureSetup()
  return {
    createCheckout,
    getCustomer,
    getSubscription,
    updateSubscription,
    cancelSubscription,
  }
}
