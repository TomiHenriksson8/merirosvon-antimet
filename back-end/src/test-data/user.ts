import { User } from '../models/User';

const users: User[] = [
    {
        id: 1,
        username: 'testuser1',
        email: 'test1@test.com',
        password: 'testpassword',
        role: 'user'
    },
    {
        id: 2,
        username: 'testuser2',
        email: 'test2@test.com',
        password: 'testpassword',
        role: 'user'
    },
    {
        id: 3,
        username: 'testuser3',
        email: 'test3@test.com',
        password: 'testpassword',
        role: 'user'
    },
    {
        id: 4,
        username: 'testAdmin',
        email: 'admin@test.com',
        password: 'testpassword',
        role: 'admin'
    }    
]; 

export {users};