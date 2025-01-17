import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function RegionChart({ data }) {
  let data01 = [...data];
  return (
    <>
      <LineChart
        width={500}
        height={300}
        data={data01}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        id="chart-blood-type"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="report_date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="blood_type_a"
          stroke="#990000"
          activeDot={{ r: 8 }}
          name="A"
        />
        <Line
          type="monotone"
          dataKey="blood_type_b"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          name="B"
        />
        <Line
          type="monotone"
          dataKey="blood_type_o"
          stroke="#008751"
          activeDot={{ r: 8 }}
          name="O"
        />
        <Line
          type="monotone"
          dataKey="blood_type_ab"
          stroke="#3a3b3c"
          activeDot={{ r: 8 }}
          name="AB"
        />
      </LineChart>
    </>
  );
}
