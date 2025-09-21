using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Asistente
    {
        [Key]
        public int asistente_id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string nombre { get; set; } = null!;
        
        [Required]
        [StringLength(50)]
        public string apellido { get; set; } = null!;
        
        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string email { get; set; } = null!;
        
        [StringLength(20)]
        public string? telefono { get; set; }
        
        // Relación con RegistroAsistencia
        public virtual ICollection<RegistroAsistencia>? RegistrosAsistencia { get; set; }
    }
}