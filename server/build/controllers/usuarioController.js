"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioController = void 0;
const database_1 = __importDefault(require("../database"));
class UsuarioController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuarios = yield database_1.default.query('SELECT * FROM Usuario');
            res.json({ usuarios });
        });
    }
    isCorreoExists(correo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.default.query('SELECT * FROM Usuario WHERE Correo = ?', [correo]);
            return result.length > 0;
        });
    }
    isUsuarioExists(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.default.query('SELECT * FROM Usuario WHERE Usuario = ?', [usuario]);
            return result.length > 0;
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { Correo, Usuario } = req.body;
                // Verificar si el correo ya está registrado
                if (yield this.isCorreoExists(Correo)) {
                    res.status(400).json({ error: 'Correo electrónico ya registrado' });
                    return;
                }
                // Verificar si el nombre de usuario ya está registrado
                if (yield this.isUsuarioExists(Usuario)) {
                    res.status(400).json({ error: 'Nombre de usuario ya registrado' });
                    return;
                }
                // Si las verificaciones pasan, insertar el nuevo usuario
                yield database_1.default.query('INSERT INTO Usuario SET ?', [req.body]);
                res.json({ message: 'Usuario guardado' });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al crear usuario' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idUser } = req.params;
            yield database_1.default.query('DELETE FROM Usuario WHERE IdUsuario = ?', [idUser]);
            res.json({ message: 'Usuario eliminado' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idUser } = req.params;
            yield database_1.default.query('UPDATE Usuario SET ? WHERE IdUsuario = ?', [req.body, idUser]);
            res.json({ message: 'Usuario actualizado' });
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idUser } = req.params;
            const usuario = yield database_1.default.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);
            if (usuario.length > 0) {
                res.json(usuario[0]);
            }
            else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        });
    }
}
exports.usuarioController = new UsuarioController();
exports.default = exports.usuarioController;
