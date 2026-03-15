import api from './api';

export const updateProfile      = (data) => api.put('/users/profile',      data);
export const changePassword     = (data) => api.put('/users/password',      data);
export const getPreferences     = ()     => api.get('/users/preferences');
export const updatePreferences  = (data) => api.put('/users/preferences',   data);

// Stripe payment methods
export const createSetupIntent       = ()     => api.post('/users/stripe/setup-intent');
export const listPaymentMethods      = ()     => api.get('/users/stripe/payment-methods');
export const removePaymentMethod     = (pmId) => api.delete(`/users/stripe/payment-methods/${pmId}`);
export const setDefaultPaymentMethod = (pmId) => api.put(`/users/stripe/payment-methods/${pmId}/default`);

// Provider services
export const getProviderStatus      = ()     => api.get('/providers/onboarding/status');
export const saveProviderServices   = (data) => api.put('/providers/onboarding/services', data);
export const deleteProviderService  = (id)   => api.delete(`/providers/onboarding/services/${id}`);
