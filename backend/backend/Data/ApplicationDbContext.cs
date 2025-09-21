using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Conferencia> Conferencias { get; set; }
        public DbSet<Asistente> Asistentes { get; set; }
        public DbSet<RegistroAsistencia> RegistrosAsistencia { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar la clave primaria compuesta para RegistroAsistencia
            modelBuilder.Entity<RegistroAsistencia>()
                .HasKey(r => new { r.conferencia_id, r.asistente_id });

            // Configurar relaciones
            modelBuilder.Entity<Conferencia>()
                .HasOne(c => c.Usuario)
                .WithMany(u => u.Conferencias)
                .HasForeignKey(c => c.usuario_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RegistroAsistencia>()
                .HasOne(r => r.Conferencia)
                .WithMany(c => c.RegistrosAsistencia)
                .HasForeignKey(r => r.conferencia_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RegistroAsistencia>()
                .HasOne(r => r.Asistente)
                .WithMany(a => a.RegistrosAsistencia)
                .HasForeignKey(r => r.asistente_id)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}