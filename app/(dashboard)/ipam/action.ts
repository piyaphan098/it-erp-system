"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function addDeviceToAssets(device: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const finalMac = device.macAddress && device.macAddress !== "N/A" 
      ? device.macAddress 
      : `${device.ip}-${Date.now()}`;
      
    const finalName = device.hostname && device.hostname !== "Unknown Device" 
      ? device.hostname 
      : `Device ${device.ip} (${device.category})`;

    const existingAsset = await db.asset.findUnique({
      where: { serialNumber: finalMac }
    });

    if (existingAsset) {
      return { success: false, error: "Device with this MAC/ID already exists in assets." };
    }

    const newAsset = await db.asset.create({
      data: {
        name: finalName,
        serialNumber: finalMac,
        status: "AVAILABLE"
      }
    });

    return { success: true, data: newAsset };
  } catch (error: any) {
    console.error("Failed to add device to assets:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}
