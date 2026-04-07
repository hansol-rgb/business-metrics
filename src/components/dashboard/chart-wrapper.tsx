"use client";

import { ResponsiveContainer } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface ChartWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  height?: number;
}

export function ChartWrapper({
  title,
  description,
  children,
  height = 350,
}: ChartWrapperProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div role="img" aria-label={title}>
          <ResponsiveContainer width="100%" height={height}>
            {children as React.ReactElement}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
