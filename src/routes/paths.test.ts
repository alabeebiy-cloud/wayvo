import { dashboardPath, postRegisterPath, safeReturnPath } from './paths';

describe('route paths', () => {
  it('maps roles to dashboards', () => {
    expect(dashboardPath('customer')).toBe('/customer/dashboard');
    expect(dashboardPath('rider')).toBe('/rider/dashboard');
  });
  it('sends new riders to their profile', () => {
    expect(postRegisterPath('rider')).toBe('/rider/profile');
    expect(postRegisterPath('customer')).toBe('/customer/dashboard');
  });
  it('only returns to paths inside the users own area', () => {
    expect(safeReturnPath('/customer/history', 'customer')).toBe('/customer/history');
    expect(safeReturnPath('/rider/earnings', 'customer')).toBe('/customer/dashboard');
    expect(safeReturnPath(undefined, 'rider')).toBe('/rider/dashboard');
    expect(safeReturnPath('//evil.com', 'rider')).toBe('/rider/dashboard');
  });
});