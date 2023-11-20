interface User {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  role?: "user" | "staff" | "admin";
}

export { User };
