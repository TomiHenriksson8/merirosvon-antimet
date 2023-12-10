import { Request, Response } from "express";

interface User {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  role?: "user" | "staff" | "admin";
}

interface CustomRequest extends Request {
  user?: { 
      id: number;
      role: string;
  };
}
  export { User, CustomRequest };
