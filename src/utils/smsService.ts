import { AuditLog, getLogs, addLog } from "./auditLog";

/**
 * A mock SMS Service that pretends to send SMS notifications
 * by logging them to a local list and creating an audit record.
 */

export interface SMSNotification {
  id: string;
  phone: string;
  message: string;
  timestamp: string;
  recipientName: string;
}

export const SMS_STORAGE_KEY = "scholar_sphere_sms_logs";

export function getSMSLogs(): SMSNotification[] {
  try {
    const logs = localStorage.getItem(SMS_STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    return [];
  }
}

export function sendSMSNotification(phone: string, recipientName: string, message: string): boolean {
  try {
    const logs = getSMSLogs();
    const newSms: SMSNotification = {
      id: `SMS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      phone,
      recipientName,
      message,
      timestamp: new Date().toISOString()
    };
    
    // Save to SMS system
    logs.push(newSms);
    localStorage.setItem(SMS_STORAGE_KEY, JSON.stringify(logs));

    // Let's also log this in the main audit log
    addLog({
      user: "System",
      role: "admin",
      action: "CREATE",
      module: "NOTIFICATIONS" as any, 
      target: `SMS to ${recipientName}`,
      status: "SUCCESS",
      details: {
        phone,
        message
      }
    });

    console.log(`[SMS SENT] To: ${recipientName} (${phone}) - Message: ${message}`);
    
    // Visually simulate the SMS hitting the parent's phone
    alert(`📱 [SIMULATED SMS to ${phone} - ${recipientName}]\n\n${message}`);

    // Simulate real-time toast alert by firing a custom event
    window.dispatchEvent(new CustomEvent('sms-sent', { detail: newSms }));
    return true;
  } catch (error) {
    console.error("Failed to send SMS", error);
    return false;
  }
}
