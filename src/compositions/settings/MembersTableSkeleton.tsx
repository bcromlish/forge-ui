"use client";

import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../patterns/table";
import { Skeleton } from "../../primitives/skeleton";

/** Props for {@link MembersTableSkeleton}. */
interface MembersTableSkeletonProps {
  showActions?: boolean;
}

/** Skeleton loader for the members table -- 4 placeholder rows with matching columns. */
export function MembersTableSkeleton({ showActions = false }: MembersTableSkeletonProps) {
  const t = useTranslations("settings.members.tableHeaders");

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-64">{t("member")}</TableHead>
            <TableHead>{t("role")}</TableHead>
            <TableHead>{t("workspaces")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("joined")}</TableHead>
            {showActions && <TableHead className="w-24" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              {showActions && (
                <TableCell>
                  <Skeleton className="h-8 w-16 rounded-md" />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
