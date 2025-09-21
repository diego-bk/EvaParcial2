using backend.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Services
{
    public class JwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(Usuario usuario)
        {
            // Validación del usuario
            if (usuario == null)
            {
                throw new ArgumentNullException(nameof(usuario), "El usuario no puede ser nulo");
            }

            if (usuario.usuario_id <= 0)
            {
                throw new ArgumentException($"El usuario_id debe ser un número positivo. Valor recibido: {usuario.usuario_id}", nameof(usuario));
            }

            if (string.IsNullOrEmpty(usuario.username))
            {
                throw new ArgumentException("El username no puede estar vacío", nameof(usuario));
            }

            if (string.IsNullOrEmpty(usuario.rol))
            {
                throw new ArgumentException("El rol no puede estar vacío", nameof(usuario));
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "DefaultSecretKeyWith32Characters123456"));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            Console.WriteLine($"JwtService - Generando token para usuario: ID={usuario.usuario_id}, Username={usuario.username}, Rol={usuario.rol}");
            
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuario.username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, usuario.usuario_id.ToString()),
                new Claim(ClaimTypes.Role, usuario.rol)
            };
            
            Console.WriteLine($"JwtService - Claims creados: NameIdentifier={usuario.usuario_id.ToString()}, Role={usuario.rol}");

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "ConferenciasAPI",
                audience: _configuration["Jwt:Audience"] ?? "ConferenciasAPIClients",
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}