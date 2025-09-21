using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Usuario
    {
        [Key]
        public int usuario_id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string username { get; set; } = null!;
        
        [Required]
        public string passwordhash { get; set; } = null!;
        
        [Required]
        [StringLength(20)]
        public string rol { get; set; } = null!;
        
        public bool estado { get; set; } = true;
        
        // Relación con Conferencias
        public virtual ICollection<Conferencia>? Conferencias { get; set; }
    }
}