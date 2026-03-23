import { NextResponse } from "next/server";
// @ts-ignore
import * as nmap from "node-nmap";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

// In-memory cache for 5 minutes
let scanCache: {
  range: string;
  data: any[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "192.168.1.0/24";

  // Check cache
  if (scanCache && scanCache.range === range && (Date.now() - scanCache.timestamp < CACHE_DURATION)) {
    return NextResponse.json({ success: true, data: scanCache.data, cached: true });
  }

  try {
    // PRE-CHECK: Verify nmap is installed
    try {
      await execAsync("nmap --version");
    } catch (checkError) {
      return NextResponse.json({ 
        success: false, 
        error: "Nmap is not installed or not in system PATH." 
      }, { status: 500 });
    }

    // Windows Admin Check (required for -sS and -O)
    if (process.platform === "win32") {
      try {
        await execAsync("net session");
      } catch (adminError) {
        return NextResponse.json({ 
          success: false, 
          error: "Optimized Nmap Scan (-sS/-O) requires Administrator privileges on Windows. Please restart VS Code / Terminal as Administrator." 
        }, { status: 500 });
      }
    }

    // Run optimized scan with specific ports, aggressive timing, and OS detection
    // Added 3389 to -p because of Windows PC classification logic
    const customArgs = '-sS -p 22,80,443,139,445,3389,9100,515,631 --open -T4 -O';
    
    const results = await new Promise<any[]>((resolve, reject) => {
      const scan = new nmap.NmapScan(range, customArgs);
      
      scan.on('complete', (data: any[]) => {
        resolve(data || []);
      });
      
      scan.on('error', (error: any) => {
        reject(error);
      });
      
      scan.startScan();
    });

    const classifiedResults = results.map((device: any) => {
      let category = "Unknown Device";
      let icon = "❓";
      let vendor = device.macVendor || "Unknown Vendor";
      const os = device.osNmap ? device.osNmap.toLowerCase() : "";
      
      const openPorts = device.openPorts ? device.openPorts.map((p: any) => p.port) : [];
      
      // Classification Logic
      if (openPorts.includes(9100) || openPorts.includes(515) || openPorts.includes(631)) {
        category = "Printer";
        icon = "🖨️";
      } else if (openPorts.includes(445) || openPorts.includes(139) || openPorts.includes(3389)) {
        category = "Windows PC";
        icon = "💻";
      } else if (openPorts.includes(22)) {
        const vendorLower = vendor.toLowerCase();
        if (vendorLower.includes("cisco") || vendorLower.includes("mikrotik") || vendorLower.includes("ubiquiti") || os.includes("cisco") || os.includes("routeros") || os.includes("switch")) {
          category = "Network Device";
          icon = "🌐";
        } else if (os.includes("linux")) {
          category = "Server";
          icon = "🖥️";
        }
      }

      return {
        ip: device.ip || "Unknown IP",
        hostname: device.hostname || "Unknown Device",
        macAddress: device.mac || "N/A",
        vendor: vendor,
        os: device.osNmap || "Unknown OS",
        category,
        icon,
        openPorts,
        isOnline: true, // Only open ports are shown so they are online
        lastScanned: new Date().toISOString()
      };
    });

    // Save to Cache
    scanCache = {
      range,
      data: classifiedResults,
      timestamp: Date.now()
    };

    return NextResponse.json({ success: true, data: classifiedResults, cached: false });
  } catch (error: any) {
    console.error("Nmap scan error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to run Nmap scan." }, { status: 500 });
  }
}
