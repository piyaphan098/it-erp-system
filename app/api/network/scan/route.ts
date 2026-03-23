import { NextResponse } from "next/server";
// @ts-ignore
import * as nmap from "node-nmap";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "192.168.1.0/24";

  try {
    // PRE-CHECK: Verify if nmap is installed and accessible to prevent node-nmap from crashing the server
    try {
      await execAsync("nmap --version");
    } catch (checkError) {
      return NextResponse.json({ 
        success: false, 
        error: "Nmap is not installed or not in system PATH. Please install Nmap and restart the terminal." 
      }, { status: 500 });
    }

    // OS CHECK: Nmap OS detection (-O) requires Administrator / root privileges.
    // Without it, node-nmap throws an uncaught exception trying to parse text as XML.
    let isAdmin = true;
    if (process.platform === "win32") {
      try {
        await execAsync("net session");
      } catch (adminError) {
        isAdmin = false;
        console.warn("User is not Administrator. Falling back to non-admin Nmap scan.");
      }
    }

    const results = await new Promise<any[]>((resolve, reject) => {
      // If we are admin, we can use OsAndPortScan
      // Otherwise fallback to basic NmapScan which doesn't require admin
      let scan;
      if (isAdmin) {
        scan = new nmap.OsAndPortScan(range);
      } else {
        scan = new nmap.NmapScan(range, '-sT -F'); // fallback basic connect scan
      }
      
      scan.on('complete', (data: any[]) => {
        resolve(data || []);
      });
      
      scan.on('error', (error: any) => {
        reject(error);
      });
      
      scan.startScan();
    });

    const classifiedResults = results.map((device: any) => {
      let category = "Unknown";
      let vendor = device.macVendor || "Unknown";
      const os = device.osNmap ? device.osNmap.toLowerCase() : "";
      
      const openPorts = device.openPorts ? device.openPorts.map((p: any) => p.port) : [];
      
      // Classification Logic
      if (openPorts.includes(9100) || openPorts.includes(515) || openPorts.includes(631)) {
        category = "Printer";
      } else if (openPorts.includes(3389) || openPorts.includes(445) || openPorts.includes(139)) {
        category = "Windows PC/Workstation";
      } else if (openPorts.includes(22) || openPorts.includes(80) || openPorts.includes(443)) {
        const vendorLower = vendor.toLowerCase();
        if (vendorLower.includes("cisco") || vendorLower.includes("ubiquiti") || vendorLower.includes("mikrotik") || os.includes("cisco") || os.includes("routeros") || os.includes("switch")) {
          category = "Network Device/Switch";
        } else if (openPorts.includes(22) && os.includes("linux")) {
          category = "Server";
        } else if (category === "Unknown" && openPorts.includes(22)) {
          // Fallback if SSH is open and os wasn't detected as linux but it might be a server/device
          category = "Server / Network Device";
        }
      }

      // Default mapping for hostnames and macs
      const hostname = device.hostname || "Unknown Device";
      const macAddress = device.mac || "N/A";
      const ip = device.ip || "Unknown IP";

      return {
        ip,
        hostname,
        macAddress,
        vendor,
        os: device.osNmap || "Unknown OS",
        category,
        openPorts,
        isOnline: true,
        lastScanned: new Date().toISOString()
      };
    });

    return NextResponse.json({ success: true, data: classifiedResults });
  } catch (error: any) {
    console.error("Nmap scan error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to run Nmap scan. Ensure nmap is installed." }, { status: 500 });
  }
}
