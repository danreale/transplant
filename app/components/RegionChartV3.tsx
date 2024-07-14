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

export default function RegionChartV3({ data }) {
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
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="report_date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="heart_status_1a"
          stroke="#990000"
          activeDot={{ r: 8 }}
          name="Heart Status 1A"
        />
        <Line
          type="monotone"
          dataKey="heart_status_1b"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          name="Heart Status 1B"
        />
        <Line
          type="monotone"
          dataKey="heart_status_2"
          stroke="#008751"
          activeDot={{ r: 8 }}
          name="Heart Status 2"
        />
        <Line
          type="monotone"
          dataKey="heart_status_7"
          stroke="#3a3b3c"
          activeDot={{ r: 8 }}
          name="Heart Status 7"
        />
      </LineChart>
    </>
  );
}
