const AuthenticationType = {
  FINGERPRINT: 1,
  FACIAL_RECOGNITION: 2,
  IRIS: 3,
};

let hasHardware = true;
let isEnrolled = true;
let supportedTypes = [AuthenticationType.FINGERPRINT];
let authResult = { success: true };

module.exports = {
  AuthenticationType,
  hasHardwareAsync: jest.fn(async () => hasHardware),
  isEnrolledAsync: jest.fn(async () => isEnrolled),
  supportedAuthenticationTypesAsync: jest.fn(async () => supportedTypes),
  authenticateAsync: jest.fn(async () => authResult),

  // Test helpers to configure mock behaviors
  __setMockCapabilities: ({ hardware = true, enrolled = true, types = [1] } = {}) => {
    hasHardware = hardware;
    isEnrolled = enrolled;
    supportedTypes = types;
  },
  __setMockAuthResult: (result) => {
    authResult = result;
  },
  __resetMock: () => {
    hasHardware = true;
    isEnrolled = true;
    supportedTypes = [AuthenticationType.FINGERPRINT];
    authResult = { success: true };
  },
};

