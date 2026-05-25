import { Badge } from "@/components/ui/badge";
import {
  PHOTO_LAB_STATUS_LABEL,
  type PhotoLabStatus,
} from "@/types/photoLab";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<PhotoLabStatus, string> = {
  ACTIVE: "bg-primary/15 text-primary border-primary/30",
  PENDING: "bg-muted text-muted-foreground border-border",
  SUSPENDED: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  CLOSED: "bg-red-500/15 text-red-400 border-red-500/30",
};

export function StatusBadge({ status }: { status: PhotoLabStatus }) {
  return (
    <Badge variant="outline" className={cn("border", STATUS_STYLES[status])}>
      {PHOTO_LAB_STATUS_LABEL[status]}
    </Badge>
  );
}
