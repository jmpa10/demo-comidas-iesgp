"use client";

import { useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Upload, Link as LinkIcon, X, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export function ImageUpload({ label, value, onChange, folder = "dishes" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [firebaseError, setFirebaseError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verificar si Firebase está configurado
  const isFirebaseConfigured = () => {
    return storage && process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar configuración de Firebase
    if (!isFirebaseConfigured()) {
      setFirebaseError(true);
      alert("Firebase Storage no está configurado. Por favor usa la opción de URL o configura Firebase.");
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no puede superar los 5MB");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setFirebaseError(false);

      // Crear nombre único para el archivo
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      // Subir archivo con seguimiento de progreso
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error("Error al subir imagen:", error);
          alert("Error al subir la imagen. Por favor intenta de nuevo.");
          setUploading(false);
        },
        async () => {
          // Obtener URL de descarga
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadURL);
          setUploading(false);
          setUploadProgress(0);
        }
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar la imagen");
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
    }
  };

  const handleRemoveImage = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {/* Vista previa de imagen */}
      {value && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
          <Image
            src={value}
            alt="Vista previa"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-2">
        {/* Botón de subir archivo */}
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subiendo {uploadProgress}%
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Subir Imagen
            </>
          )}
        </Button>

        {/* Botón de URL */}
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowUrlInput(!showUrlInput)}
          disabled={uploading}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        {/* Input de archivo oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Input de URL */}
      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleUrlSubmit();
              }
            }}
          />
          <Button type="button" onClick={handleUrlSubmit} size="sm">
            Añadir
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowUrlInput(false);
              setUrlInput("");
            }}
            size="sm"
          >
            Cancelar
          </Button>
        </div>
      )}

      {/* Barra de progreso */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-600 h-2 transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Mensaje de Firebase no configurado */}
      {firebaseError && !isFirebaseConfigured() && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Firebase Storage no configurado</p>
            <p className="text-xs mt-1">
              Usa la opción de URL o consulta FIREBASE_SETUP.md para configurar la subida de archivos.
            </p>
          </div>
        </div>
      )}

      {/* Sugerencia de URLs */}
      {!value && !showUrlInput && (
        <p className="text-xs text-muted-foreground">
          💡 Puedes subir una imagen desde tu dispositivo o usar una URL externa (ej: Unsplash)
        </p>
      )}
    </div>
  );
}
