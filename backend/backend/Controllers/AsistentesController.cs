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
    public class AsistentesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AsistentesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Asistentes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AsistenteDTO>>> GetAsistentes()
        {
            var asistentes = await _context.Asistentes
                .Select(a => new AsistenteDTO
                {
                    asistente_id = a.asistente_id,
                    nombre = a.nombre,
                    apellido = a.apellido,
                    email = a.email,
                    telefono = a.telefono
                })
                .ToListAsync();

            return Ok(asistentes);
        }

        // GET: api/Asistentes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AsistenteDTO>> GetAsistente(int id)
        {
            var asistente = await _context.Asistentes.FindAsync(id);

            if (asistente == null)
            {
                return NotFound();
            }

            var asistenteDTO = new AsistenteDTO
            {
                asistente_id = asistente.asistente_id,
                nombre = asistente.nombre,
                apellido = asistente.apellido,
                email = asistente.email,
                telefono = asistente.telefono
            };

            return Ok(asistenteDTO);
        }

        // PUT: api/Asistentes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsistente(int id, AsistenteUpdateDTO asistenteDTO)
        {
            var asistente = await _context.Asistentes.FindAsync(id);

            if (asistente == null)
            {
                return NotFound();
            }

            if (asistenteDTO.nombre != null)
            {
                asistente.nombre = asistenteDTO.nombre;
            }

            if (asistenteDTO.apellido != null)
            {
                asistente.apellido = asistenteDTO.apellido;
            }

            if (asistenteDTO.email != null)
            {
                // Verificar si el nuevo email ya existe
                if (await _context.Asistentes.AnyAsync(a => a.email == asistenteDTO.email && a.asistente_id != id))
                {
                    return BadRequest(new { message = "El email ya está registrado" });
                }
                asistente.email = asistenteDTO.email;
            }

            if (asistenteDTO.telefono != null)
            {
                asistente.telefono = asistenteDTO.telefono;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AsistenteExists(id))
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

        // POST: api/Asistentes
        [HttpPost]
        public async Task<ActionResult<AsistenteDTO>> PostAsistente(AsistenteCreateDTO asistenteDTO)
        {
            // Verificar si el email ya existe
            if (await _context.Asistentes.AnyAsync(a => a.email == asistenteDTO.email))
            {
                return BadRequest(new { message = "El email ya está registrado" });
            }

            var asistente = new Asistente
            {
                nombre = asistenteDTO.nombre,
                apellido = asistenteDTO.apellido,
                email = asistenteDTO.email,
                telefono = asistenteDTO.telefono
            };

            _context.Asistentes.Add(asistente);
            await _context.SaveChangesAsync();

            var createdAsistenteDTO = new AsistenteDTO
            {
                asistente_id = asistente.asistente_id,
                nombre = asistente.nombre,
                apellido = asistente.apellido,
                email = asistente.email,
                telefono = asistente.telefono
            };

            return CreatedAtAction(nameof(GetAsistente), new { id = asistente.asistente_id }, createdAsistenteDTO);
        }

        // DELETE: api/Asistentes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsistente(int id)
        {
            var asistente = await _context.Asistentes.FindAsync(id);
            if (asistente == null)
            {
                return NotFound();
            }

            _context.Asistentes.Remove(asistente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AsistenteExists(int id)
        {
            return _context.Asistentes.Any(e => e.asistente_id == id);
        }
    }
}