export const validationMessages = {
  email: {
    invalid: 'Invalid email address',
  },
  password: {
    tooShort: 'Password must be at least 6 characters',
  },
  name: {
    tooShort: 'Name must be at least 2 characters',
  },
  confirmPassword: {
    noMatch: "Passwords don't match",
  },
} as const;
