import type { User } from "@shared/schema";

// Storage interface
export interface IStorage {
  // Add your storage methods here
  // Example:
  // getUsers(): Promise<User[]>;
  // getUserById(id: number): Promise<User | undefined>;
  // createUser(user: Omit<User, 'id'>): Promise<User>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: User[] = [];
  private nextId = 1;

  // Example methods - implement your actual storage logic
  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const newUser: User = { ...user, id: this.nextId++ };
    this.users.push(newUser);
    return newUser;
  }
}

export const storage = new MemStorage();
