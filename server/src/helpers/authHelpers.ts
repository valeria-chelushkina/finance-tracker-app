import bcrypt from 'bcrypt';

// temporarily here - when implementing auth, will move to another place.
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
}
