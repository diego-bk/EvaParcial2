using backend.Data;
using backend.Models;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsuariosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsuariosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> GetUsuarios()
        {
            var usuarios = await _context.Usuarios
                .Select(u => new UsuarioDTO
                {
                    usuario_id = u.usuario_id,
                    username = u.username,
                    rol = u.rol,
                    estado = u.estado
                })
                .ToListAsync();

            return Ok(usuarios);
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioDTO>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            var usuarioDTO = new UsuarioDTO
            {
                usuario_id = usuario.usuario_id,
                username = usuario.username,
                rol = usuario.rol,
                estado = usuario.estado
            };

            return Ok(usuarioDTO);
        }

        // PUT: api/Usuarios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, UsuarioUpdateDTO usuarioDTO)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            if (usuarioDTO.username != null)
            {
                // Verificar si el nuevo username ya existe
                if (await _context.Usuarios.AnyAsync(u => u.username == usuarioDTO.username && u.usuario_id != id))
                {
                    return BadRequest(new { message = "El nombre de usuario ya está en uso" });
                }
                usuario.username = usuarioDTO.username;
            }

            if (usuarioDTO.password != null)
            {
                usuario.passwordhash = BCrypt.Net.BCrypt.HashPassword(usuarioDTO.password);
            }

            if (usuarioDTO.rol != null)
            {
                usuario.rol = usuarioDTO.rol;
            }

            if (usuarioDTO.estado.HasValue)
            {
                usuario.estado = usuarioDTO.estado.Value;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Usuarios
        [HttpPost]
        public async Task<ActionResult<UsuarioDTO>> PostUsuario(UsuarioCreateDTO usuarioDTO)
        {
            if (await _context.Usuarios.AnyAsync(u => u.username == usuarioDTO.username))
            {
                return BadRequest(new { message = "El nombre de usuario ya está en uso" });
            }

            var usuario = new Usuario
            {
                username = usuarioDTO.username,
                passwordhash = BCrypt.Net.BCrypt.HashPassword(usuarioDTO.password),
                rol = usuarioDTO.rol,
                estado = usuarioDTO.estado
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            var createdUsuarioDTO = new UsuarioDTO
            {
                usuario_id = usuario.usuario_id,
                username = usuario.username,
                rol = usuario.rol,
                estado = usuario.estado
            };

            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.usuario_id }, createdUsuarioDTO);
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            // En lugar de eliminar, desactivamos el usuario
            usuario.estado = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.usuario_id == id);
        }
    }
}