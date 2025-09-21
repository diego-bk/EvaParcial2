namespace backend.Models.DTOs
{
    // DTOs para Usuario
    public class UsuarioDTO
    {
        public int usuario_id { get; set; }
        public string username { get; set; } = null!;
        public string rol { get; set; } = null!;
        public bool estado { get; set; }
    }

    public class UsuarioCreateDTO
    {
        public string username { get; set; } = null!;
        public string password { get; set; } = null!;
        public string rol { get; set; } = null!;
        public bool estado { get; set; } = true;
    }

    public class UsuarioUpdateDTO
    {
        public string? username { get; set; }
        public string? password { get; set; }
        public string? rol { get; set; }
        public bool? estado { get; set; }
    }

    // DTOs para Conferencia
    public class ConferenciaDTO
    {
        public int conferencia_id { get; set; }
        public string nombre { get; set; } = null!;
        public DateTime fecha { get; set; }
        public string ubicacion { get; set; } = null!;
        public string? descripcion { get; set; }
        public int usuario_id { get; set; }
        public string? username { get; set; }
    }

    public class ConferenciaCreateDTO
    {
        public string nombre { get; set; } = null!;
        public DateTime fecha { get; set; }
        public string ubicacion { get; set; } = null!;
        public string? descripcion { get; set; }
    }

    public class ConferenciaUpdateDTO
    {
        public string? nombre { get; set; }
        public DateTime? fecha { get; set; }
        public string? ubicacion { get; set; }
        public string? descripcion { get; set; }
    }

    // DTOs para Asistente
    public class AsistenteDTO
    {
        public int asistente_id { get; set; }
        public string nombre { get; set; } = null!;
        public string apellido { get; set; } = null!;
        public string email { get; set; } = null!;
        public string? telefono { get; set; }
    }

    public class AsistenteCreateDTO
    {
        public string nombre { get; set; } = null!;
        public string apellido { get; set; } = null!;
        public string email { get; set; } = null!;
        public string? telefono { get; set; }
    }

    public class AsistenteUpdateDTO
    {
        public string? nombre { get; set; }
        public string? apellido { get; set; }
        public string? email { get; set; }
        public string? telefono { get; set; }
    }

    // DTOs para RegistroAsistencia
    public class RegistroAsistenciaDTO
    {
        public int conferencia_id { get; set; }
        public int asistente_id { get; set; }
        public bool asistencia { get; set; }
        public string? nombreConferencia { get; set; }
        public string? nombreAsistente { get; set; }
        public string? apellidoAsistente { get; set; }
    }

    public class RegistroAsistenciaCreateDTO
    {
        public int conferencia_id { get; set; }
        public int asistente_id { get; set; }
        public bool asistencia { get; set; } = true;
    }

    public class RegistroAsistenciaUpdateDTO
    {
        public bool asistencia { get; set; }
    }
}