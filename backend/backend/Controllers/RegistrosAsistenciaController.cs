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
    public class RegistrosAsistenciaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RegistrosAsistenciaController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/RegistrosAsistencia
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RegistroAsistenciaDTO>>> GetRegistrosAsistencia()
        {
            var registros = await _context.RegistrosAsistencia
                .Include(r => r.Conferencia)
                .Include(r => r.Asistente)
                .Select(r => new RegistroAsistenciaDTO
                {
                    conferencia_id = r.conferencia_id,
                    asistente_id = r.asistente_id,
                    asistencia = r.asistencia,
                    nombreConferencia = r.Conferencia != null ? r.Conferencia.nombre : null,
                    nombreAsistente = r.Asistente != null ? r.Asistente.nombre : null,
                    apellidoAsistente = r.Asistente != null ? r.Asistente.apellido : null
                })
                .ToListAsync();

            return Ok(registros);
        }

        // GET: api/RegistrosAsistencia/Conferencia/5
        [HttpGet("Conferencia/{conferenciaId}")]
        public async Task<ActionResult<IEnumerable<RegistroAsistenciaDTO>>> GetRegistrosPorConferencia(int conferenciaId)
        {
            var registros = await _context.RegistrosAsistencia
                .Include(r => r.Conferencia)
                .Include(r => r.Asistente)
                .Where(r => r.conferencia_id == conferenciaId)
                .Select(r => new RegistroAsistenciaDTO
                {
                    conferencia_id = r.conferencia_id,
                    asistente_id = r.asistente_id,
                    asistencia = r.asistencia,
                    nombreConferencia = r.Conferencia != null ? r.Conferencia.nombre : null,
                    nombreAsistente = r.Asistente != null ? r.Asistente.nombre : null,
                    apellidoAsistente = r.Asistente != null ? r.Asistente.apellido : null
                })
                .ToListAsync();

            return Ok(registros);
        }

        // GET: api/RegistrosAsistencia/Asistente/5
        [HttpGet("Asistente/{asistenteId}")]
        public async Task<ActionResult<IEnumerable<RegistroAsistenciaDTO>>> GetRegistrosPorAsistente(int asistenteId)
        {
            var registros = await _context.RegistrosAsistencia
                .Include(r => r.Conferencia)
                .Include(r => r.Asistente)
                .Where(r => r.asistente_id == asistenteId)
                .Select(r => new RegistroAsistenciaDTO
                {
                    conferencia_id = r.conferencia_id,
                    asistente_id = r.asistente_id,
                    asistencia = r.asistencia,
                    nombreConferencia = r.Conferencia != null ? r.Conferencia.nombre : null,
                    nombreAsistente = r.Asistente != null ? r.Asistente.nombre : null,
                    apellidoAsistente = r.Asistente != null ? r.Asistente.apellido : null
                })
                .ToListAsync();

            return Ok(registros);
        }

        // GET: api/RegistrosAsistencia/5/3
        [HttpGet("{conferenciaId}/{asistenteId}")]
        public async Task<ActionResult<RegistroAsistenciaDTO>> GetRegistroAsistencia(int conferenciaId, int asistenteId)
        {
            var registro = await _context.RegistrosAsistencia
                .Include(r => r.Conferencia)
                .Include(r => r.Asistente)
                .FirstOrDefaultAsync(r => r.conferencia_id == conferenciaId && r.asistente_id == asistenteId);

            if (registro == null)
            {
                return NotFound();
            }

            var registroDTO = new RegistroAsistenciaDTO
            {
                conferencia_id = registro.conferencia_id,
                asistente_id = registro.asistente_id,
                asistencia = registro.asistencia,
                nombreConferencia = registro.Conferencia?.nombre,
                nombreAsistente = registro.Asistente?.nombre,
                apellidoAsistente = registro.Asistente?.apellido
            };

            return Ok(registroDTO);
        }

        // PUT: api/RegistrosAsistencia/5/3
        [HttpPut("{conferenciaId}/{asistenteId}")]
        public async Task<IActionResult> PutRegistroAsistencia(int conferenciaId, int asistenteId, RegistroAsistenciaUpdateDTO registroDTO)
        {
            var registro = await _context.RegistrosAsistencia
                .FirstOrDefaultAsync(r => r.conferencia_id == conferenciaId && r.asistente_id == asistenteId);

            if (registro == null)
            {
                return NotFound();
            }

            registro.asistencia = registroDTO.asistencia;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RegistroAsistenciaExists(conferenciaId, asistenteId))
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

        // POST: api/RegistrosAsistencia
        [HttpPost]
        public async Task<ActionResult<RegistroAsistenciaDTO>> PostRegistroAsistencia(RegistroAsistenciaCreateDTO registroDTO)
        {
            // Verificar si la conferencia existe
            var conferencia = await _context.Conferencias.FindAsync(registroDTO.conferencia_id);
            if (conferencia == null)
            {
                return BadRequest(new { message = "La conferencia no existe" });
            }

            // Verificar si el asistente existe
            var asistente = await _context.Asistentes.FindAsync(registroDTO.asistente_id);
            if (asistente == null)
            {
                return BadRequest(new { message = "El asistente no existe" });
            }

            // Verificar si ya existe un registro para esta conferencia y asistente
            if (await _context.RegistrosAsistencia.AnyAsync(r => 
                r.conferencia_id == registroDTO.conferencia_id && 
                r.asistente_id == registroDTO.asistente_id))
            {
                return BadRequest(new { message = "Ya existe un registro para este asistente en esta conferencia" });
            }

            var registro = new RegistroAsistencia
            {
                conferencia_id = registroDTO.conferencia_id,
                asistente_id = registroDTO.asistente_id,
                asistencia = registroDTO.asistencia
            };

            _context.RegistrosAsistencia.Add(registro);
            await _context.SaveChangesAsync();

            var createdRegistroDTO = new RegistroAsistenciaDTO
            {
                conferencia_id = registro.conferencia_id,
                asistente_id = registro.asistente_id,
                asistencia = registro.asistencia,
                nombreConferencia = conferencia.nombre,
                nombreAsistente = asistente.nombre,
                apellidoAsistente = asistente.apellido
            };

            return CreatedAtAction(
                nameof(GetRegistroAsistencia), 
                new { conferenciaId = registro.conferencia_id, asistenteId = registro.asistente_id }, 
                createdRegistroDTO);
        }

        // DELETE: api/RegistrosAsistencia/5/3
        [HttpDelete("{conferenciaId}/{asistenteId}")]
        public async Task<IActionResult> DeleteRegistroAsistencia(int conferenciaId, int asistenteId)
        {
            var registro = await _context.RegistrosAsistencia
                .FirstOrDefaultAsync(r => r.conferencia_id == conferenciaId && r.asistente_id == asistenteId);
                
            if (registro == null)
            {
                return NotFound();
            }

            _context.RegistrosAsistencia.Remove(registro);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RegistroAsistenciaExists(int conferenciaId, int asistenteId)
        {
            return _context.RegistrosAsistencia.Any(e => 
                e.conferencia_id == conferenciaId && 
                e.asistente_id == asistenteId);
        }
    }
}