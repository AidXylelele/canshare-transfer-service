export const ValidationRegExps = {
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  uri: /^https:\/\/(?:www\.[\w-]+\.[a-z]+|[\w-]+\.wixsite\.com|[\w-]+\.editorx\.io)\/.*\/_functions\/.*$/,
};
