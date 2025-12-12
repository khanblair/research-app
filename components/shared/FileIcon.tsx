import { FileText, FileImage, File } from "lucide-react";

interface FileIconProps {
  type: "pdf" | "epub" | "txt" | string;
  className?: string;
}

export function FileIcon({ type, className = "h-5 w-5" }: FileIconProps) {
  const iconMap = {
    pdf: FileText,
    epub: FileImage,
    txt: File,
  };

  const Icon = iconMap[type as keyof typeof iconMap] || File;

  return <Icon className={className} />;
}
