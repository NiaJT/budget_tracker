// components/BasicPages/SavingsProgressChart.tsx
"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#888888", "#000000"];

interface SavingsProgressChartProps {
  current: number;
  target: number;
}

export default function SavingsProgressChart({
  current,
  target,
}: SavingsProgressChartProps) {
  const data = [
    { name: "Remaining", value: Math.max(0, target - current) },
    { name: "Saved", value: current },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#888888"
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`$${value}`, name]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}