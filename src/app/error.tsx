"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="font-title text-2xl font-semibold text-[var(--accent)]">
        Une erreur est survenue
      </h1>
      <p className="text-sm text-[var(--text-muted)]">
        Réessayez dans un instant. Si le problème continue, contactez-moi.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md border border-[var(--accent)] bg-[var(--accent)]/20 px-4 py-2 text-sm text-[var(--accent)]"
      >
        Réessayer
      </button>
    </div>
  );
}
