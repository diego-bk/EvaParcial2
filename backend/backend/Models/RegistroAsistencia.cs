using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class RegistroAsistencia
    {
        [Key, Column(Order = 0)]
        public int conferencia_id { get; set; }
        
        [Key, Column(Order = 1)]
        public int asistente_id { get; set; }
        
        public bool asistencia { get; set; } = true;
        
        [ForeignKey("conferencia_id")]
        public virtual Conferencia? Conferencia { get; set; }
        
        [ForeignKey("asistente_id")]
        public virtual Asistente? Asistente { get; set; }
    }
}