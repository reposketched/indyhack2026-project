import { NextRequest, NextResponse } from "next/server";

// Hardcoded venue coords — 12120 Brookshire Pkwy, Carmel, IN 46033
const DEST_LAT = 39.9738;
const DEST_LON = -86.1258;

type Mode = "driving" | "cycling" | "walking";
interface LegResult {
  mode: Mode;
  durationText: string;
  durationSeconds: number;
}

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs} hr ${mins} min`;
  return `${mins} min`;
}

// routing.openstreetmap.de hosts genuinely separate routing engines per mode
const OSRM_HOSTS: Record<Mode, { host: string; profile: string }> = {
  driving: { host: "https://routing.openstreetmap.de/routed-car",  profile: "driving" },
  cycling: { host: "https://routing.openstreetmap.de/routed-bike", profile: "cycling" },
  walking: { host: "https://routing.openstreetmap.de/routed-foot", profile: "foot"    },
};

async function fetchOSRM(originLat: number, originLon: number, mode: Mode): Promise<number | null> {
  const { host, profile } = OSRM_HOSTS[mode];
  const url = `${host}/route/v1/${profile}/${originLon},${originLat};${DEST_LON},${DEST_LAT}?overview=false`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.code === "Ok" && data.routes?.[0]) {
      return Math.round(data.routes[0].duration);
    }
    return null;
  } catch {
    return null;
  }
}

// Pick the most practical "best" mode:
// - Walking only best if ≤ 12 min
// - Cycling only best if ≤ 20 min OR saves > 5 min over driving
// - Otherwise default to driving
function pickBest(results: LegResult[]): LegResult {
  const driving = results.find((r) => r.mode === "driving");
  const cycling = results.find((r) => r.mode === "cycling");
  const walking = results.find((r) => r.mode === "walking");

  if (walking && walking.durationSeconds <= 720) return walking;
  if (cycling && cycling.durationSeconds <= 1200) return cycling;
  if (cycling && driving && driving.durationSeconds - cycling.durationSeconds > 300) return cycling;
  if (driving) return driving;
  return results[0];
}

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.searchParams.get("origin");
  if (!origin) {
    return NextResponse.json({ error: "origin is required" }, { status: 400 });
  }

  const [latStr, lonStr] = origin.split(",");
  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);
  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({ error: "Invalid origin coordinates" }, { status: 400 });
  }

  const modes: Mode[] = ["driving", "cycling", "walking"];
  const results: LegResult[] = [];

  await Promise.all(
    modes.map(async (mode) => {
      const seconds = await fetchOSRM(lat, lon, mode);
      if (seconds !== null && seconds < 43200) {
        results.push({ mode, durationText: formatDuration(seconds), durationSeconds: seconds });
      }
    })
  );

  if (results.length === 0) {
    return NextResponse.json({ error: "No routes found" }, { status: 404 });
  }

  results.sort((a, b) => a.durationSeconds - b.durationSeconds);
  const best = pickBest(results);

  return NextResponse.json({
    best,
    all: results,
    destination: "12120 Brookshire Pkwy, Carmel, IN 46033",
  });
}
