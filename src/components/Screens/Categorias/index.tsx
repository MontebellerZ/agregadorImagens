import styles from "./styles.module.scss";
import { useLoaderData } from "react-router";
import type { TCategoria } from "../../../types/categoria.type";
import { useContext, useMemo, useState } from "react";
import { CategoriasViewContext, FotosContext } from "../../../config/Context/createContext";
import Galeria from "../../Shared/Galeria";
import CategoriaStorage from "../../../config/Storage/Stores/Categoria.store";
import LixeiraStorage from "../../../config/Storage/Stores/Lixeira.store.ts";
import JSZip from "jszip";
import { toast } from "react-toastify";

function sanitizeName(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || "arquivo";
}

function getImageExtension(src: string) {
  const dataMatch = src.match(/^data:image\/([a-zA-Z0-9.+-]+);/);
  if (dataMatch?.[1]) {
    return dataMatch[1] === "jpeg" ? "jpg" : dataMatch[1];
  }

  try {
    const pathname = new URL(src, window.location.origin).pathname;
    const rawExtension = pathname.split(".").pop()?.toLowerCase() || "";

    if (/^[a-z0-9]{2,5}$/.test(rawExtension)) {
      return rawExtension === "jpeg" ? "jpg" : rawExtension;
    }
  } catch {
    return "jpg";
  }

  return "jpg";
}

function Categorias() {
  const allFotos = useContext(FotosContext);
  const { apenasSemCategoria, setApenasSemCategoria } = useContext(CategoriasViewContext);

  const routeCategoria: TCategoria | undefined = useLoaderData();
  const [validadoUI, setValidadoUI] = useState<{ categoriaId: string | null; value: boolean }>(() => ({
    categoriaId: routeCategoria?.id ?? null,
    value: routeCategoria?.validado ?? false,
  }));

  const isVerTudo = !routeCategoria;

  const categoriaValidada =
    validadoUI.categoriaId === (routeCategoria?.id ?? null)
      ? validadoUI.value
      : (routeCategoria?.validado ?? false);

  const fotosSemCategoria = useMemo(() => {
    const categorias = CategoriaStorage.get() || [];
    const fotosComCategoria = new Set(
      categorias.flatMap((categoria) => categoria.fotos.map((foto) => foto.src)),
    );

    return allFotos.filter((foto) => !fotosComCategoria.has(foto.src));
  }, [allFotos]);

  const mostrarSomenteSemCategoria = isVerTudo && apenasSemCategoria;
  const nome = routeCategoria?.nome || (mostrarSomenteSemCategoria ? "Fotos sem categoria" : "Todas as fotos");
  const fotos = routeCategoria?.fotos || (mostrarSomenteSemCategoria ? fotosSemCategoria : allFotos);
  const fotosAtivas = useMemo(() => fotos.filter((foto) => !LixeiraStorage.has(foto.src)), [fotos]);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleValidadoChange = (checked: boolean) => {
    if (!routeCategoria) return;

    setValidadoUI({
      categoriaId: routeCategoria.id,
      value: checked,
    });

    const categoriaPersistida = CategoriaStorage.getById(routeCategoria.id);
    if (!categoriaPersistida) return;

    CategoriaStorage.saveById({
      ...categoriaPersistida,
      validado: checked,
    });
  };

  const handleDownload = async () => {
    if (!fotosAtivas.length) {
      toast.info("Nenhuma foto ativa para baixar nesta categoria.");
      return;
    }

    setIsDownloading(true);

    try {
      const zip = new JSZip();
      const usedNames = new Map<string, number>();

      const downloadTasks = fotosAtivas.map(async (foto, index) => {
        const extension = getImageExtension(foto.src);
        const fallbackBaseName = `foto_${String(index + 1).padStart(3, "0")}`;

        let baseName = fallbackBaseName;

        try {
          const pathname = new URL(foto.src, window.location.origin).pathname;
          const rawName = pathname.split("/").pop()?.replace(/\.[^.]+$/, "") || "";
          if (rawName) {
            baseName = sanitizeName(decodeURIComponent(rawName));
          }
        } catch {
          baseName = fallbackBaseName;
        }

        const response = await fetch(foto.src);
        if (!response.ok) {
          throw new Error(`Falha ao baixar ${foto.src}`);
        }

        const blob = await response.blob();
        const fullName = `${baseName}.${extension}`;
        const occurrence = usedNames.get(fullName) ?? 0;
        usedNames.set(fullName, occurrence + 1);

        const finalName =
          occurrence === 0 ? fullName : `${baseName}_${String(occurrence + 1).padStart(2, "0")}.${extension}`;

        zip.file(finalName, blob);
      });

      const results = await Promise.allSettled(downloadTasks);
      const okCount = results.filter((result) => result.status === "fulfilled").length;
      const failCount = results.length - okCount;

      if (!okCount) {
        throw new Error("Nao foi possivel baixar as imagens desta categoria.");
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipName = sanitizeName(nome);
      const zipUrl = URL.createObjectURL(zipBlob);

      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = `${zipName}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(zipUrl);

      if (failCount > 0) {
        toast.warning(`Baixado com sucesso, mas ${failCount} foto(s) nao puderam ser adicionadas ao zip.`);
        return;
      }

      toast.success("Download do zip iniciado.");
    } catch {
      toast.error("Nao foi possivel gerar o download do zip.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={styles.categorias}>
      <div className={styles.topRow}>
        <h2>{nome}</h2>

        <div className={styles.acoes}>
          {!isVerTudo && routeCategoria && (
            <label className={styles.validadoHolder}>
              <span>Categoria validada</span>
              <input
                type="checkbox"
                checked={categoriaValidada}
                onChange={(e) => handleValidadoChange(e.target.checked)}
              />
            </label>
          )}

          {isVerTudo && (
            <label className={styles.validadoHolder}>
              <span>Apenas sem categoria</span>
              <input
                type="checkbox"
                checked={mostrarSomenteSemCategoria}
                onChange={(e) => setApenasSemCategoria(e.target.checked)}
              />
            </label>
          )}

          <button
            type="button"
            className={styles.downloadButton}
            onClick={handleDownload}
            disabled={isDownloading || !fotosAtivas.length}
          >
            {isDownloading ? "Preparando ZIP..." : "Baixar categoria (.zip)"}
          </button>
        </div>
      </div>

      <Galeria fotos={fotos} />
    </div>
  );
}

export default Categorias;
