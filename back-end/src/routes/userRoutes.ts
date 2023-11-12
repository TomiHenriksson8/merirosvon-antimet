import e, { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { loginUser, registerUser, getUsers, getUserById, deleteUser, updateUser } from '../controllers/userController';


const router = Router();

router.get('/', /*authenticate, authorize(['admin']),*/ getUsers);
router.post('/register', registerUser );
router.post('/login', loginUser);
router.get('/:id', /*authenticate, authorize(['admin']),*/ getUserById);
router.delete('/:id',/*authenticate, authorize(['admin']),*/ deleteUser);
router.put('/:id', /*authenticate, authorize(['admin']),*/ updateUser);

export default router;