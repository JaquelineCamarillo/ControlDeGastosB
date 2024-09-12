import { Request, Response } from 'express';
import pool from "../database";

class UsuarioController {
    public async list(req: Request, res: Response): Promise<void> {
        const usuarios = await pool.query('SELECT * FROM Usuario');
        res.json({ usuarios });
    }

    private async isCorreoExists(correo: string): Promise<boolean> {
        const result = await pool.query('SELECT * FROM Usuario WHERE Correo = ?', [correo]);
        return result.length > 0;
    }

    private async isUsuarioExists(usuario: string): Promise<boolean> {
        const result = await pool.query('SELECT * FROM Usuario WHERE Usuario = ?', [usuario]);
        return result.length > 0;
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const { Correo, Usuario } = req.body;

            // Verificar si el correo ya está registrado
            if (await this.isCorreoExists(Correo)) {
                res.status(400).json({ error: 'Correo electrónico ya registrado' });
                return;
            }

            // Verificar si el nombre de usuario ya está registrado
            if (await this.isUsuarioExists(Usuario)) {
                res.status(400).json({ error: 'Nombre de usuario ya registrado' });
                return;
            }

            // Si las verificaciones pasan, insertar el nuevo usuario
            await pool.query('INSERT INTO Usuario SET ?', [req.body]);
            res.json({ message: 'Usuario guardado' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al crear usuario' });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { idUser } = req.params;
        await pool.query('DELETE FROM Usuario WHERE IdUsuario = ?', [idUser]);
        res.json({ message: 'Usuario eliminado' });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { idUser } = req.params;
        await pool.query('UPDATE Usuario SET ? WHERE IdUsuario = ?', [req.body, idUser]);
        res.json({ message: 'Usuario actualizado' });
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        const { idUser } = req.params;
        const usuario = await pool.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);
        if (usuario.length > 0) {
            res.json(usuario[0]);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    }
}

export const usuarioController = new UsuarioController();
export default usuarioController;
    