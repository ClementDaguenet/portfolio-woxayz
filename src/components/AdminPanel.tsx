"use client";

import { useCallback, useEffect, useState } from "react";

type FileMeta = { key: string; label: string };

type ImageItem = { name: string; url: string };

type ImageSpec = {
  label: string;
  size: string;
  hint: string;
  jsonField: string;
};

export function AdminPanel({
  title,
  files,
  imageSpecs,
}: {
  title: string;
  files: FileMeta[];
  imageSpecs: ImageSpec[];
}) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"content" | "images">("content");
  const [active, setActive] = useState(files[0]?.key ?? "");
  const [raw, setRaw] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void fetch("/api/admin/auth")
      .then((r) => r.json())
      .then((d: { ok: boolean }) => setAuthed(Boolean(d.ok)))
      .catch(() => setAuthed(false));
  }, []);

  const loadFile = useCallback(async (key: string) => {
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch(`/api/admin/content?key=${encodeURIComponent(key)}`);
      const data = (await res.json()) as { raw?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Chargement impossible");
      setRaw(data.raw ?? "");
      setActive(key);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }, []);

  const loadImages = useCallback(async () => {
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/images");
      const data = (await res.json()) as { images?: ImageItem[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Images impossibles à charger");
      setImages(data.images ?? []);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (authed && files[0]) void loadFile(files[0].key);
  }, [authed, files, loadFile]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Erreur");
      setAuthed(true);
      setPassword("");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthed(false);
    setRaw("");
    setImages([]);
  }

  async function save() {
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: active, raw }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Sauvegarde impossible");
      setStatus("Sauvegardé - recharge la page du site pour voir le rendu");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setStatus("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/images", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Upload impossible");
      setStatus(`Fichier uploadé : ${data.url}`);
      await loadImages();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setStatus(`Chemin copié : ${url}`);
  }

  async function renameImage(url: string, currentName: string) {
    const suggested = currentName.split("/").pop() || currentName;
    const input = window.prompt("Nouveau nom (garde l’extension .webp)", suggested);
    if (!input || input.trim() === suggested) return;
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, newName: input.trim() }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Renommage impossible");
      setStatus(`Renommé : ${data.url}`);
      await loadImages();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function deleteImage(url: string) {
    if (!window.confirm(`Supprimer ce fichier ?\n${url}`)) return;
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Suppression impossible");
      setStatus(`Supprimé : ${url}`);
      await loadImages();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  if (authed === null) {
    return (
      <div className="admin-shell min-h-screen p-8 text-sm text-slate-300">
        Chargement…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="admin-shell flex min-h-screen items-center justify-center px-4">
        <form
          onSubmit={login}
          className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 text-slate-100 shadow-xl"
        >
          <h1 className="mb-1 text-2xl font-semibold">{title}</h1>
          <p className="mb-6 text-sm text-slate-400">Connexion admin</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="mb-3 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-blue-500"
            autoFocus
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-500 disabled:opacity-60"
          >
            Entrer
          </button>
          {status ? <p className="mt-3 text-sm text-red-400">{status}</p> : null}
        </form>
      </div>
    );
  }

  return (
    <div className="admin-shell min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-sm text-slate-400">
              Textes + images WebP - les placements du site restent inchangés
            </p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
          >
            Déconnexion
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab("content")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              tab === "content"
                ? "bg-blue-600 text-white"
                : "border border-slate-600 text-slate-200 hover:bg-slate-800"
            }`}
          >
            Contenus
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("images");
              void loadImages();
            }}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              tab === "images"
                ? "bg-blue-600 text-white"
                : "border border-slate-600 text-slate-200 hover:bg-slate-800"
            }`}
          >
            Images
          </button>
        </div>

        {tab === "content" ? (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              {files.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => void loadFile(f.key)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    active === f.key
                      ? "bg-violet-600 text-white"
                      : "border border-slate-600 text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              spellCheck={false}
              className="h-[58vh] w-full rounded-xl border border-slate-700 bg-slate-900 p-3 font-mono text-sm leading-relaxed text-slate-100 outline-none focus:border-blue-500"
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void save()}
                disabled={busy}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                Sauvegarder
              </button>
              {status ? <p className="text-sm text-slate-300">{status}</p> : null}
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900 p-4">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">
                Tailles recommandées (exporte en .webp)
              </h2>
              <ul className="space-y-2 text-sm">
                {imageSpecs.map((spec) => (
                  <li
                    key={spec.label}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-slate-800 pb-2 last:border-0"
                  >
                    <span className="font-medium text-slate-100">{spec.label}</span>
                    <span className="rounded bg-blue-600/30 px-2 py-0.5 font-mono text-xs text-blue-200">
                      {spec.size}
                    </span>
                    <span className="text-slate-400">{spec.hint}</span>
                    <span className="font-mono text-xs text-violet-300">
                      JSON → {spec.jsonField}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Workflow : PNG → TinyPNG / Squoosh → WebP → upload ici → copier le chemin dans le JSON.
              </p>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
                Uploader (.webp recommandé)
                <input
                  type="file"
                  accept="image/webp,image/png,image/jpeg,image/avif,image/gif,.ico"
                  className="hidden"
                  onChange={(e) => void onUpload(e)}
                />
              </label>
              <p className="text-sm text-slate-400">
                Copier le chemin · renommer · supprimer
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img) => (
                <div
                  key={img.url}
                  className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.name}
                    className="h-36 w-full object-cover bg-slate-800"
                  />
                  <div className="space-y-2 p-2">
                    <button
                      type="button"
                      onClick={() => void copyUrl(img.url)}
                      className="block w-full truncate text-left font-mono text-xs text-slate-300 hover:text-blue-300"
                      title="Copier le chemin"
                    >
                      {img.url}
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void renameImage(img.url, img.name)}
                        className="flex-1 rounded border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 disabled:opacity-50"
                      >
                        Renommer
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void deleteImage(img.url)}
                        className="flex-1 rounded border border-red-800 px-2 py-1 text-xs text-red-300 hover:bg-red-950 disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {images.length === 0 ? (
              <p className="text-sm text-slate-400">Aucun fichier pour l’instant.</p>
            ) : null}
            {status ? <p className="mt-4 text-sm text-slate-300">{status}</p> : null}
          </>
        )}
      </div>
    </div>
  );
}
