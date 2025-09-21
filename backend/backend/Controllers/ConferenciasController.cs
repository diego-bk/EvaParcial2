using backend.Data;
using backend.Models;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ConferenciasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ConferenciasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Conferencias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConferenciaDTO>>> GetConferencias()
        {
            var conferencias = await _context.Conferencias
                .Include(c => c.Usuario)
                .Select(c => new ConferenciaDTO
                {
                    conferencia_id = c.conferencia_id,
                    nombre = c.nombre,
                    fecha = c.fecha,
                    ubicacion = c.ubicacion,
                    descripcion = c.descripcion,
                    usuario_id = c.usuario_id,
                    username = c.Usuario != null ? c.Usuario.username : null
                })
                .ToListAsync();

            return Ok(conferencias);
        }

        // GET: api/Conferencias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ConferenciaDTO>> GetConferencia(int id)
        {
            var conferencia = await _context.Conferencias
                .Include(c => c.Usuario)
                .FirstOrDefaultAsync(c => c.conferencia_id == id);

            if (conferencia == null)
            {
                return NotFound();
            }

            var conferenciaDTO = new ConferenciaDTO
            {
                conferencia_id = conferencia.conferencia_id,
                nombre = conferencia.nombre,
                fecha = conferencia.fecha,
                ubicacion = conferencia.ubicacion,
                descripcion = conferencia.descripcion,
                usuario_id = conferencia.usuario_id,
                username = conferencia.Usuario?.username
            };

            return Ok(conferenciaDTO);
        }

        // PUT: api/Conferencias/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConferencia(int id, ConferenciaUpdateDTO conferenciaDTO)
        {
            var conferencia = await _context.Conferencias.FindAsync(id);

            if (conferencia == null)
            {
                return NotFound();
            }

            // Verificar si el usuario actual es el creador o es administrador
            var usuarioId = GetCurrentUserId();
            var rol = User.FindFirst(ClaimTypes.Role)?.Value;

            if (conferencia.usuario_id != usuarioId && rol != "Administrador")
            {
                return Forbid();
            }

            if (conferenciaDTO.nombre != null)
            {
                conferencia.nombre = conferenciaDTO.nombre;
            }

            if (conferenciaDTO.fecha.HasValue)
            {
                conferencia.fecha = conferenciaDTO.fecha.Value;
            }

            if (conferenciaDTO.ubicacion != null)
            {
                conferencia.ubicacion = conferenciaDTO.ubicacion;
            }

            if (conferenciaDTO.descripcion != null)
            {
                conferencia.descripcion = conferenciaDTO.descripcion;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConferenciaExists(id))
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

        // POST: api/Conferencias
        [HttpPost]
        public async Task<ActionResult<ConferenciaDTO>> PostConferencia(ConferenciaCreateDTO conferenciaDTO)
        {
            // Obtener el ID del usuario actual desde el token JWT
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var conferencia = new Conferencia
            {
                nombre = conferenciaDTO.nombre,
                fecha = conferenciaDTO.fecha,
                ubicacion = conferenciaDTO.ubicacion,
                descripcion = conferenciaDTO.descripcion,
                usuario_id = usuarioId
            };

            _context.Conferencias.Add(conferencia);
            await _context.SaveChangesAsync();

            var usuario = await _context.Usuarios.FindAsync(usuarioId);

            var createdConferenciaDTO = new ConferenciaDTO
            {
                conferencia_id = conferencia.conferencia_id,
                nombre = conferencia.nombre,
                fecha = conferencia.fecha,
                ubicacion = conferencia.ubicacion,
                descripcion = conferencia.descripcion,
                usuario_id = conferencia.usuario_id,
                username = usuario?.username
            };

            return CreatedAtAction(nameof(GetConferencia), new { id = conferencia.conferencia_id }, createdConferenciaDTO);
        }

        // DELETE: api/Conferencias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConferencia(int id)
        {
            var conferencia = await _context.Conferencias.FindAsync(id);
            if (conferencia == null)
            {
                return NotFound();
            }

            // Verificar si el usuario actual es el creador o es administrador
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var rol = User.FindFirst(ClaimTypes.Role)?.Value;

            if (conferencia.usuario_id != usuarioId && rol != "Administrador")
            {
                return Forbid();
            }

            _context.Conferencias.Remove(conferencia);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConferenciaExists(int id)
        {
            return _context.Conferencias.Any(e => e.conferencia_id == id);
        }
    }
}