// Central settings store using localStorage for persistence

const SETTINGS_KEY = "scholar_sphere_settings";

export interface AppSettings {
  school: {
    schoolName: string;
    address: string;
    phone: string;
    email: string;
    motto: string;
    schoolCode: string;
  };
  academic: {
    academicYear: string;
    termStructure: string;
    gradingSystem: string;
    passMark: string;
    catWeight: string;
    examWeight: string;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    triggers: {
      newReport: boolean;
      discipline: boolean;
      feeReminder: boolean;
    };
  };
  timetable: {
    periodsPerDay: string;
    periodDuration: string;
    breakTime: string;
    breakDuration: string;
    workingDays: string[];
  };
  discipline: {
    warningThreshold: string;
    suspensionThreshold: string;
    behaviorScoring: boolean;
  };
  reports: {
    templateStyle: string;
    logoPlacement: string;
    sections: {
      attendance: boolean;
      discipline: boolean;
      rankings: boolean;
    };
  };
  system: {
    theme: string;
    language: string;
    timezone: string;
    sessionTimeout: string;
    systemClosed: boolean;
    maintenanceMessage: string;
  };
  blockedUsers: string[];
  blockedRoles: string[];
}

export const defaultSettings: AppSettings = {
  school: {
    schoolName: "",
    address: "",
    phone: "",
    email: "",
    motto: "",
    schoolCode: "",
  },
  academic: {
    academicYear: "",
    termStructure: "2",
    gradingSystem: "standard",
    passMark: "50",
    catWeight: "30",
    examWeight: "70",
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    triggers: {
      newReport: true,
      discipline: true,
      feeReminder: false,
    },
  },
  timetable: {
    periodsPerDay: "8",
    periodDuration: "40",
    breakTime: "10:30",
    breakDuration: "30",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  discipline: {
    warningThreshold: "3",
    suspensionThreshold: "5",
    behaviorScoring: false,
  },
  reports: {
    templateStyle: "Classic",
    logoPlacement: "Top Left",
    sections: {
      attendance: true,
      discipline: true,
      rankings: true,
    },
  },
  system: {
    theme: "Light",
    language: "English",
    timezone: "UTC+2",
    sessionTimeout: "30",
    systemClosed: false,
    maintenanceMessage: "The system is currently under maintenance. Please try again later.",
  },
  blockedUsers: [],
  blockedRoles: [],
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Deep merge with defaults so new keys are always present
      return deepMerge(defaultSettings, parsed) as AppSettings;
    }
  } catch (e) {
    console.error("Failed to load settings", e);
  }
  return { ...defaultSettings };
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Dispatch a global event so other components can react
    window.dispatchEvent(new CustomEvent("settings-changed", { detail: settings }));
  } catch (e) {
    console.error("Failed to save settings", e);
  }
}

export function updateSettingsSection<K extends keyof AppSettings>(
  section: K,
  data: AppSettings[K]
): AppSettings {
  const current = loadSettings();
  const updated = { ...current, [section]: data };
  saveSettings(updated);
  return updated;
}

export function toggleUserBlock(userIdOrName: string): boolean {
  const current = loadSettings();
  const isBlocked = current.blockedUsers.includes(userIdOrName);
  let updatedUsers: string[];
  
  if (isBlocked) {
    updatedUsers = current.blockedUsers.filter(u => u !== userIdOrName);
  } else {
    updatedUsers = [...current.blockedUsers, userIdOrName];
  }
  
  saveSettings({ ...current, blockedUsers: updatedUsers });
  return !isBlocked;
}

export function toggleRoleBlock(role: string): boolean {
  const current = loadSettings();
  const isBlocked = current.blockedRoles.includes(role);
  let updatedRoles: string[];
  
  if (isBlocked) {
    updatedRoles = current.blockedRoles.filter(r => r !== role);
  } else {
    updatedRoles = [...current.blockedRoles, role];
  }
  
  saveSettings({ ...current, blockedRoles: updatedRoles });
  return !isBlocked;
}

// Deep merge utility
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  for (const key of Object.keys(target)) {
    if (key in source) {
      if (
        typeof target[key] === "object" &&
        target[key] !== null &&
        !Array.isArray(target[key]) &&
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }
  return output;
}
