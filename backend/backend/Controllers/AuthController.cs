using backend.Data;
using backend.Models;
using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(ApplicationDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDTO>> Login(LoginRequestDTO loginRequest)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.username == loginRequest.Username && u.estado);

            if (usuario == null)
            {
                return Unauthorized(new { message = "Usuario no encontrado o inactivo" });
            }

            bool passwordValid = BCrypt.Net.BCrypt.Verify(loginRequest.Password, usuario.passwordhash);

            if (!passwordValid)
            {
                return Unauthorized(new { message = "Contraseña incorrecta" });
            }

            var token = _jwtService.GenerateToken(usuario);

            return Ok(new LoginResponseDTO
            {
                Token = token,
                Username = usuario.username,
                Rol = usuario.rol
            });
        }

        [HttpPost("register")]
        public async Task<ActionResult<UsuarioDTO>> Register(RegistroUsuarioDTO registroDTO)
        {
            if (await _context.Usuarios.AnyAsync(u => u.username == registroDTO.Username))
            {
                return BadRequest(new { message = "El nombre de usuario ya está en uso" });
            }

            var nuevoUsuario = new Usuario
            {
                username = registroDTO.Username,
                passwordhash = BCrypt.Net.BCrypt.HashPassword(registroDTO.Password),
                rol = registroDTO.Rol,
                estado = true
            };

            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Register), new UsuarioDTO
            {
                usuario_id = nuevoUsuario.usuario_id,
                username = nuevoUsuario.username,
                rol = nuevoUsuario.rol,
                estado = nuevoUsuario.estado
            });
        }
    }
}