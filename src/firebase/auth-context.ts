interface AuthContextType {
  user: any; // You can replace 'any' with a more specific user type
}

export const useAuth = (): AuthContextType => {
  return { user: null };
};