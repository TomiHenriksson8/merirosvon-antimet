import e, { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { loginUser, registerUser, getUsers, getUserById, handleDeleteUserRequest, handleUpdateUserRequest, getLatestUserId } from '../controllers/userController';


const router = Router();

router.get('/', /*authenticate, authorize(['admin']),*/ getUsers);
router.post('/register', registerUser );
router.post('/login', loginUser);
router.get('/:id', /*authenticate, authorize(['admin']),*/ getUserById);
router.get('/latest/id', /*authenticate, authorize(['admin']),*/ getLatestUserId);
router.delete('/:id',/*authenticate, authorize(['admin']),*/  handleDeleteUserRequest);
router.put('/:id', /*authenticate, authorize(['admin']),*/ handleUpdateUserRequest);

export default router;