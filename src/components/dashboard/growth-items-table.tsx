import type { GrowthItem } from "@/lib/growth";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface GrowthItemsTableProps {
  items: GrowthItem[];
}

const statusLabels: Record<GrowthItem["status"], string> = {
  planned: "계획",
  in_progress: "진행 중",
  completed: "완료",
};

const statusColors: Record<GrowthItem["status"], string> = {
  planned: "bg-muted text-muted-foreground",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

export function GrowthItemsTable({ items }: GrowthItemsTableProps) {
  const completedHours = items
    .filter((i) => i.status === "completed")
    .reduce((sum, i) => sum + i.estimatedHoursSaved, 0);

  const totalPlannedHours = items.reduce((sum, i) => sum + i.estimatedHoursSaved, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>효율화 아이템</CardTitle>
        <CardDescription>
          완료 시 절감: {completedHours}시간 / 전체 계획: {totalPlannedHours}시간
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>아이템</TableHead>
              <TableHead>담당</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead className="text-right">절감 시간</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.owner}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">{item.estimatedHoursSaved}h</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusColors[item.status]}>
                    {statusLabels[item.status]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  등록된 효율화 아이템이 없습니다
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
