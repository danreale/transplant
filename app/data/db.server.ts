import { TimeBreakdown } from "~/utils";
import { getSupabaseAdmin } from "./supabase.server";

const TRANSPLANT_COLUMNS =
  "region,report_date,wait_list_type,wait_list_time,blood_type_a,blood_type_b,blood_type_ab,blood_type_o,blood_type_all";

export async function getTransplantDates() {
  const supabase = getSupabaseAdmin();
  // one row per date at this filter combination, so no DISTINCT needed
  const { data, error } = await supabase
    .from("transplant_data")
    .select("report_date")
    .eq("region", "All Regions")
    .eq("wait_list_type", "All Types")
    .eq("wait_list_time", "All Time")
    .order("report_date", { ascending: false })
    .limit(365);
  if (error) throw error;
  return data ?? [];
}

export async function bloodTypeTotalsChart(region: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("transplant_data")
    .select("blood_type_a,blood_type_ab,blood_type_b,blood_type_o,report_date")
    .eq("wait_list_time", "All Time")
    .eq("wait_list_type", "All Types")
    .eq("region", region)
    .order("report_date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getTransplantCountDates() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("transplant_data")
    .select("report_date,blood_type_a,blood_type_b,blood_type_o,blood_type_ab")
    .eq("wait_list_time", "All Time")
    .eq("wait_list_type", "All Types")
    .eq("region", "All Regions")
    .order("report_date", { ascending: false })
    .limit(365);
  if (error) throw error;
  return data ?? [];
}

export async function getTransplantStatusCountDates(
  heart_status:
    | "Heart Status 1A"
    | "Heart Status 1B"
    | "Heart Status 2"
    | "Heart Status 7 (Inactive)"
) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("transplant_data")
    .select("report_date,blood_type_all")
    .eq("wait_list_time", "All Time")
    .eq("wait_list_type", heart_status)
    .eq("region", "All Regions")
    .order("report_date", { ascending: false })
    .limit(365);
  if (error) throw error;
  return data ?? [];
}

export async function getTransplantStatusCountDatesForRegion(
  heart_status:
    | "Heart Status 1A"
    | "Heart Status 1B"
    | "Heart Status 2"
    | "Heart Status 7 (Inactive)",
  region: string
) {
  const usRegion = `Region  ${region}`;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("transplant_data")
    .select("report_date,blood_type_all")
    .eq("wait_list_time", "All Time")
    .eq("wait_list_type", heart_status)
    .eq("region", usRegion)
    .order("report_date", { ascending: false })
    .limit(365);
  if (error) throw error;
  return data ?? [];
}

export async function getCenterData(date: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("center_data")
    .select("heart,report_date")
    .eq("report_date", date)
    .order("report_date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function centerDataTotalsChart() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("center_data")
    .select("heart,report_date")
    .order("report_date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getDonorCountDatesB() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("donor_data")
    .select("report_date,blood_type_b,blood_type_o")
    .eq("ethnicity", "All Ethnicities")
    .order("report_date", { ascending: true })
    .limit(365);
  if (error) throw error;

  // source rows can carry more than one record per date (e.g. split by
  // gender) under the "All Ethnicities" filter, so sum client-side
  const totalsByDate = new Map<
    string,
    { report_date: string; blood_type_b: number; blood_type_o: number }
  >();
  for (const row of data ?? []) {
    const existing = totalsByDate.get(row.report_date) ?? {
      report_date: row.report_date,
      blood_type_b: 0,
      blood_type_o: 0,
    };
    existing.blood_type_b += row.blood_type_b ?? 0;
    existing.blood_type_o += row.blood_type_o ?? 0;
    totalsByDate.set(row.report_date, existing);
  }
  return [...totalsByDate.values()];
}

export async function getSettingsDates() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("transplant_settings")
    .select(
      "from_data_refresh_date,last_data_refresh_date,yesterday_from_data_refresh_date,yesterday_last_data_refresh_date"
    )
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAllTransplantDataWithWaitListTime(
  date: string,
  waitListType: string
) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("transplant_data")
    .select(TRANSPLANT_COLUMNS)
    .eq("report_date", date)
    .neq("region", "All Regions")
    .eq("wait_list_type", waitListType);
  if (error) throw error;

  const filteredRecords: TimeBreakdown[] = (data ?? []).map((rec) => ({
    region: rec.region,
    report_date: rec.report_date,
    wait_list_type: rec.wait_list_type,
    wait_list_time: rec.wait_list_time,
    blood_type_a: rec.blood_type_a,
    blood_type_ab: rec.blood_type_ab,
    blood_type_all: rec.blood_type_all,
    blood_type_b: rec.blood_type_b,
    blood_type_o: rec.blood_type_o,
  }));
  return filteredRecords;
}
