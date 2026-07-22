"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0a0a0f",
          color: "#f1f5f9",
        }}
      >
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 22, marginBottom: 8, color: "#d946ef" }}>
            Erreur
          </h1>
          <p style={{ color: "#94a3b8", marginBottom: 16 }}>
            Une erreur inattendue est survenue.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              border: "1px solid #d946ef",
              borderRadius: 8,
              padding: "10px 16px",
              background: "rgba(217, 70, 239, 0.2)",
              color: "#d946ef",
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
