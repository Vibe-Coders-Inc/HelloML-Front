export const commonContent = {
  buttons: {
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    signUp: 'Sign Up',
    createAccount: 'Create Account',
    creatingAccount: 'Creating account...',
  },
  errors: {
    invalidCredentials: 'Invalid email or password',
    registrationFailed: 'Registration failed. Please try again.',
    genericError: 'An error occurred. Please try again.',
    socialAuthFailed: (provider: string) => `${provider} authentication failed`,
  },
} as const;
