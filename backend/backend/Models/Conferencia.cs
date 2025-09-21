using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Conferencia
    {
        [Key]
        public int conferencia_id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string nombre { get; set; } = null!;
        
        [Required]
        public DateTime fecha { get; set; }
        
        [Required]
        [StringLength(200)]
        public string ubicacion { get; set; } = null!;
        
        [StringLength(500)]
        public string? descripcion { get; set; }
        
        [Required]
        public int usuario_id { get; set; }
        
        [ForeignKey("usuario_id")]
        public virtual Usuario? Usuario { get; set; }
        
        // Relación con RegistroAsistencia
        public virtual ICollection<RegistroAsistencia>? RegistrosAsistencia { get; set; }
    }
}