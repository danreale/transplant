import { test, expect, Page } from "@playwright/test";
import { getRealisticSmartChangeDataV2 } from "~/data/change-data-smart-v2.server";
import smartBaseline2024 from "./data/baselineNovember.json" assert { type: "json" };
import smartBaseline2025 from "./data/baselineJanuary.json" assert { type: "json" };

test.describe("Unit Tests", () => {
  test("Smart Messaging 2024", async () => {
    const smartMessages = await getRealisticSmartChangeDataV2(
      "2024-11-04",
      "2024-11-03"
    );
    expect(smartMessages).toEqual(smartBaseline2024);
  });

  test("Smart Messaging 2025", async () => {
    const smartMessages = await getRealisticSmartChangeDataV2(
      "2025-01-27",
      "2025-01-26"
    );
    expect(smartMessages).toEqual(smartBaseline2025);
  });
});
