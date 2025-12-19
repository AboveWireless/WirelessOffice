import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Building2,
  Plus,
  Upload,
  Image as ImageIcon,
  Filter,
  X,
  Check,
  Pin,
  FileText,
  ClipboardList,
  Camera,
  ListChecks,
  Trash2,
} from "lucide-react";

// Lightweight shadcn/ui-inspired primitives using Tailwind classes
interface PrimitiveProps {
  className?: string;
  children?: React.ReactNode;
}

const Card: React.FC<PrimitiveProps> = ({ className = "", children }) => (
  <div
    className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`.trim()}
  >
    {children}
  </div>
);

const CardHeader: React.FC<PrimitiveProps> = ({ className = "", children }) => (
  <div className={`flex flex-col gap-2 border-b border-slate-100 p-4 ${className}`.trim()}>
    {children}
  </div>
);

const CardTitle: React.FC<PrimitiveProps> = ({ className = "", children }) => (
  <h3 className={`text-lg font-semibold text-slate-900 ${className}`.trim()}>
    {children}
  </h3>
);

const CardContent: React.FC<PrimitiveProps> = ({ className = "", children }) => (
  <div className={`p-4 ${className}`.trim()}>{children}</div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md";
}

const Button: React.FC<ButtonProps> = ({
  className = "",
  children,
  variant = "default",
  size = "md",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    default:
      "bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900",
    outline:
      "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 focus-visible:outline-slate-600",
    ghost:
      "text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-500",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline-slate-700",
  };
  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  ...props
}) => (
  <input
    className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 ${className}`.trim()}
    {...props}
  />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className = "",
  ...props
}) => (
  <textarea
    className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 ${className}`.trim()}
    {...props}
  />
);

const Separator: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`h-px w-full bg-slate-200 ${className}`.trim()} />
);

const Badge: React.FC<PrimitiveProps & { variant?: "default" | "outline" }> = ({
  className = "",
  children,
  variant = "default",
}) => {
  const styles =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-700"
      : "bg-slate-900 text-white";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${styles} ${className}`.trim()}
    >
      {children}
    </span>
  );
};

// Data models
export type Photo = {
  id: number;
  label: string;
  url: string;
  fileName: string;
  takenAt: number;
  materialId: number | null;
};

export type MaterialLine = {
  id: number;
  name: string;
  qty: number;
  unit: string;
};

export type UpdatePacket = {
  id: number;
  createdAt: number;
  status: "In Progress" | "Complete";
  notes: string;
  photos: Photo[];
  materials: MaterialLine[];
};

export type Item = {
  id: number;
  label: string;
  type: string;
  serialOrTag: string;
  photoListId: number;
  updates: UpdatePacket[];
};

export type Site = {
  id: number;
  name: string;
  address: string;
  client: string;
  status: string;
  category: "Tarana Build" | "TIA Repair" | "Small Cell" | "Macro" | "Fiber" | "Other";
  scopeOfWork: string;
  scopeItems: string[];
  preferredMaterials: string[];
  lat?: number;
  lng?: number;
  items: Item[];
};

type CategoryFilter = Site["category"] | "All";

type PhotoRequirement = {
  label: string;
  min: number;
  hint?: string;
};

type PhotoList = {
  id: number;
  name: string;
  description: string;
  requirements: PhotoRequirement[];
};

type ActiveUpdate = {
  siteId: number;
  itemId: number;
  packet: UpdatePacket;
};

type TestResult = {
  name: string;
  pass: boolean;
  details: string;
};

const CATEGORY_OPTIONS: Site["category"][] = [
  "Tarana Build",
  "TIA Repair",
  "Small Cell",
  "Macro",
  "Fiber",
  "Other",
];

const SCOPE_ITEM_SEEDS: Record<Site["category"], string[]> = {
  "Tarana Build": [
    "Verify equipment mounting",
    "Inspect grounding system",
    "Pull and terminate fiber",
    "Document power connections",
  ],
  "TIA Repair": [
    "Assess damaged components",
    "Capture before/after photos",
    "Document repair materials",
  ],
  "Small Cell": [
    "Mount radio enclosure",
    "Verify pole attachments",
    "Connect power and fiber",
  ],
  Macro: [
    "Inspect cabinet interior",
    "Check weatherproofing",
    "Validate alarms",
  ],
  Fiber: [
    "Splice fiber strands",
    "Certify light levels",
    "Label enclosures",
  ],
  Other: ["Define custom scope items"],
};

const TARANA_MATERIALS: string[] = [
  "#10-14 Lug",
  "#2 Bare Tinned Wire",
  "Lug #4-#2 Solid",
  "Lug #4-#2 Solid",
  "Lug #4-#2 Solid",
  "#6 AWG 3/8\" 2-Hole Lug",
  "#6 Green Ground Wire",
  "Quick-Set Clear Cement",
  "1/2\" Zinc Meyers Hub",
  "1/2\" Galv Elbow",
  "1/2\" Galv Conduit",
  "Clear Heat Shrink 1/4\"",
  "Waveguide Bridge",
  "1250lb Pull String",
  "Zinckote Spray 13.5oz",
  "2\" PVC Long Radius Elbow",
  "2\" PVC 90° Elbow",
  "2\" Female Adapter",
  "2\" LB Fitting",
  "2\" PVC 45° Elbow",
  "2\" PVC LL2",
  "2\" PVC Conduit",
  "2\" Compression Connector",
  "2\" Galv Rigid Conduit",
  "2\" Meyers Hub",
  "2\" Steel Lock Nut",
  "2x3 Galv Nipple",
  "2x6 Galv Nipple",
  "2\"-3\" Hose Clamp",
  "2\"x9\" Bus Bar",
  "2/0 Black Stranded Wire",
  "20A GFCI Outlet",
  "2-3/8\" Plain Pipe",
  "2-7/8\" Galv Pipe",
  "3/0 Black Wire",
  "3/16\" Shackle",
  "3/8\" Black Heat Shrink",
  "3/8\" SS Flat Washer",
  "3/8\" SS Lock Washer",
  "3/8\" SS Nut",
  "3/8\" Spring Nut",
  "3/8\" Hex Bolt",
  "Black Heat Shrink 3/8\"",
  "3-1/2\" Pipe Cap",
  "3-1/2\" Plain Pipe",
  "10m Fiber Optic Cable",
  "Black Vinyl Tape",
  "Blue Vinyl Tape",
  "Green Vinyl Tape",
  "Red Vinyl Tape",
  "Yellow Vinyl Tape",
  "Ground Bar Kit 4x6",
  "5/8\" Copper Ground Rod",
  "7/8\" Hoist Grip",
  "Universal Pipe Mount Slider",
  "Angle Clip Assembly",
  "Universal Grommet 1/2\"",
  "Black Tape 2\"",
  "Caution Tape Yellow",
  "Clear Silicone",
  "Dual Pipe Mount Kit",
  "Cyclone 10G SFP+ Module",
  "1/2\" U-Bolt Assembly",
  "LightSaber Angle Adapter",
  "2\"-3\" Hose Clamp",
  "Lace-Up Hoist Grip L",
  "5/8\" Hoist Grip",
  "Barrel Cushion 14-36mm",
  "Barrel Cushion 14-36mm",
  "Snap-In Stand-off Adapter",
  "Snap-In Hanger 1-5/8\"",
  "Monopole Triple T-Arm",
  "No-Ox-ID Grease",
  "Outdoor Hybrid Enclosure",
  "Open Face Mount",
  "Outdoor Hybrid Fiber Trunk",
  "3-1/2\" Plain Pipe",
  "10m Power Jumper",
  "QO Plug-On Neutral LC",
  "1/2\" Seal Tight",
  "SnapStak Hanger",
  "100A Disconnect",
  "Snap-In Hanger Kit 1/2\"",
];

const MATERIALS_BY_CATEGORY: Record<Site["category"], string[]> = {
  "Tarana Build": TARANA_MATERIALS,
  "TIA Repair": [
    "Replacement breaker",
    "Weatherproof boot",
    "TIA repair kit",
    "Torque hardware set",
  ],
  "Small Cell": [
    "Small cell antenna",
    "Pole mounting kit",
    "DC power cable",
    "Fiber jumper 10m",
  ],
  Macro: [
    "Hybrid trunk cable",
    "Cabinet fan tray",
    "Breaker 100A",
    "Battery harness",
  ],
  Fiber: [
    "Splice sleeve",
    "Fiber tray",
    "LC connector",
    "OTDR launch cable",
  ],
  Other: [
    "Custom material A",
    "Custom material B",
    "Custom material C",
  ],
};

const PHOTO_LISTS: PhotoList[] = [
  {
    id: 1,
    name: "Small Cell – Basic",
    description: "Standard documentation for pole-mounted small cells.",
    requirements: [
      { label: "Overall pole", min: 1, hint: "From 20–30 ft away" },
      { label: "Serial plate", min: 1, hint: "Readable text" },
      { label: "Grounding", min: 1 },
      { label: "Power meter", min: 1 },
    ],
  },
  {
    id: 2,
    name: "Cabinet – Closeout",
    description: "Closeout package for cabinet installations.",
    requirements: [
      { label: "Overall cabinet", min: 1 },
      { label: "Door open – interior", min: 1 },
      { label: "As-built label close-up", min: 1 },
    ],
  },
];

const createId = () => Math.floor(Date.now() + Math.random() * 1000);

const createUpdatePacket = (id: number, createdAt: number): UpdatePacket => ({
  id,
  createdAt,
  status: "In Progress",
  notes: "",
  photos: [],
  materials: [],
});

const addPhotoToPacket = (packet: UpdatePacket, photo: Photo): UpdatePacket => ({
  ...packet,
  photos: [...packet.photos, photo],
});

const areRequirementsMet = (
  requirements: PhotoRequirement[],
  photos: Photo[],
): boolean =>
  requirements.every((req) => {
    const count = photos.filter(
      (photo) => photo.materialId === null && photo.label === req.label,
    ).length;
    return count >= req.min;
  });

const countPhotosForRequirement = (
  photos: Photo[],
  requirement: PhotoRequirement,
): number =>
  photos.filter(
    (photo) => photo.materialId === null && photo.label === requirement.label,
  ).length;

const removeMaterialAndLinkedPhotos = (
  packet: UpdatePacket,
  materialId: number,
): UpdatePacket => ({
  ...packet,
  materials: packet.materials.filter((m) => m.id !== materialId),
  photos: packet.photos.filter((photo) => photo.materialId !== materialId),
});

type CsvRecord = Partial<{
  name: string;
  address: string;
  client: string;
  status: string;
  lat: string;
  lng: string;
  scopeofwork: string;
  category: string;
}>;

const parseCsvLine = (line: string): string[] => {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === "\"") {
      if (inQuotes && line[i + 1] === "\"") {
        current += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
};

const parseCsv = (content: string): CsvRecord[] => {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (lines.length === 0) {
    return [];
  }
  const header = parseCsvLine(lines[0]).map((cell) => cell.toLowerCase());
  const records: CsvRecord[] = [];
  for (let i = 1; i < lines.length; i += 1) {
    const row = parseCsvLine(lines[i]);
    const record: CsvRecord = {};
    header.forEach((key, index) => {
      record[key as keyof CsvRecord] = row[index] ?? "";
    });
    records.push(record);
  }
  return records;
};

const normalizeCategory = (value: string | undefined): Site["category"] => {
  if (!value) {
    return "Other";
  }
  const match = CATEGORY_OPTIONS.find(
    (option) => option.toLowerCase() === value.toLowerCase(),
  );
  return match ?? "Other";
};

const upsertSitesFromCsv = (content: string, currentSites: Site[]): Site[] => {
  const records = parseCsv(content);
  if (records.length === 0) {
    return currentSites;
  }
  const updatedSites = [...currentSites];
  records.forEach((record) => {
    const name = record.name ?? "";
    const address = record.address ?? "";
    if (!name || !address) {
      return;
    }
    const category = normalizeCategory(record.category);
    const existingIndex = updatedSites.findIndex(
      (site) =>
        site.name.toLowerCase() === name.toLowerCase() &&
        site.address.toLowerCase() === address.toLowerCase(),
    );
    const lat = record.lat ? Number.parseFloat(record.lat) : undefined;
    const lng = record.lng ? Number.parseFloat(record.lng) : undefined;
    const payload: Partial<Site> = {
      name,
      address,
      client: record.client ?? "",
      status: record.status ?? "",
      category,
      scopeOfWork: record.scopeofwork ?? "",
      lat: Number.isFinite(lat) ? lat : undefined,
      lng: Number.isFinite(lng) ? lng : undefined,
    };
    if (existingIndex >= 0) {
      updatedSites[existingIndex] = {
        ...updatedSites[existingIndex],
        ...payload,
      };
    } else {
      updatedSites.push({
        id: createId(),
        name,
        address,
        client: payload.client ?? "",
        status: payload.status ?? "",
        category,
        scopeOfWork: payload.scopeOfWork ?? "",
        scopeItems: [],
        preferredMaterials: [],
        lat: payload.lat,
        lng: payload.lng,
        items: [],
      });
    }
  });
  return updatedSites;
};

const filterSitesByCategory = (sites: Site[], filter: CategoryFilter): Site[] => {
  if (filter === "All") {
    return sites;
  }
  return sites.filter((site) => site.category === filter);
};

const runRuntimeTests = (): TestResult[] => {
  const tests: TestResult[] = [];

  const packet = createUpdatePacket(1, 123);
  tests.push({
    name: "startUpdate initializes arrays and status",
    pass:
      packet.status === "In Progress" &&
      packet.photos.length === 0 &&
      packet.materials.length === 0,
    details: `status=${packet.status}, photos=${packet.photos.length}, materials=${packet.materials.length}`,
  });

  const photo: Photo = {
    id: 10,
    label: "Overall pole",
    fileName: "test.jpg",
    takenAt: 456,
    url: "blob:test",
    materialId: null,
  };
  const packetWithPhoto = addPhotoToPacket(packet, photo);
  tests.push({
    name: "addPhoto appends photo with label",
    pass:
      packetWithPhoto.photos.length === 1 &&
      packetWithPhoto.photos[0].label === "Overall pole" &&
      packetWithPhoto.photos[0].takenAt === 456,
    details: `count=${packetWithPhoto.photos.length}`,
  });

  const requirements = PHOTO_LISTS[0]?.requirements ?? [];
  const satisfied = areRequirementsMet(requirements, packetWithPhoto.photos);
  tests.push({
    name: "Required photo counting works",
    pass: requirements.length > 0 && satisfied,
    details: satisfied ? "requirements satisfied" : "requirements not met",
  });

  const csvContent = [
    "name,address,client,status,category",
    "Alpha,123 Road,Client A,Active,Tarana Build",
    "Beta,456 Ave,Client B,Active,Unknown",
  ].join("\n");
  const csvSites = upsertSitesFromCsv(csvContent, []);
  const taranaSite = csvSites.find((site) => site.name === "Alpha");
  const unknownSite = csvSites.find((site) => site.name === "Beta");
  tests.push({
    name: "CSV parser recognizes category and fallback",
    pass:
      (taranaSite?.category ?? "") === "Tarana Build" &&
      (unknownSite?.category ?? "") === "Other",
    details: `Alpha=${taranaSite?.category}, Beta=${unknownSite?.category}`,
  });

  const filterMock: Site[] = [
    {
      id: 1,
      name: "S1",
      address: "A",
      client: "C1",
      status: "Active",
      category: "Tarana Build",
      scopeOfWork: "",
      scopeItems: [],
      preferredMaterials: [],
      items: [],
    },
    {
      id: 2,
      name: "S2",
      address: "B",
      client: "C2",
      status: "Active",
      category: "Macro",
      scopeOfWork: "",
      scopeItems: [],
      preferredMaterials: [],
      items: [],
    },
  ];
  const filtered = filterSitesByCategory(filterMock, "Tarana Build");
  tests.push({
    name: "Category filter returns expected number",
    pass: filtered.length === 1,
    details: `filtered=${filtered.length}`,
  });

  const packetWithMaterial: UpdatePacket = {
    ...packetWithPhoto,
    materials: [
      { id: 99, name: "Bolt", qty: 2, unit: "ea" },
    ],
    photos: [
      ...packetWithPhoto.photos,
      {
        id: 11,
        label: "Material: Bolt",
        fileName: "bolt.jpg",
        takenAt: 789,
        url: "blob:bolt",
        materialId: 99,
      },
    ],
  };
  const cleanedPacket = removeMaterialAndLinkedPhotos(packetWithMaterial, 99);
  tests.push({
    name: "Material removal also removes linked photos",
    pass:
      cleanedPacket.materials.length === 0 &&
      cleanedPacket.photos.every((p) => p.materialId !== 99),
    details: `materials=${cleanedPacket.materials.length}, photos=${cleanedPacket.photos.length}`,
  });

  return tests;
};

const photoListById = (id: number): PhotoList | undefined =>
  PHOTO_LISTS.find((list) => list.id === id);

const formatDateTime = (timestamp: number) =>
  new Date(timestamp).toLocaleString();

const formatLatLng = (value?: number) =>
  value !== undefined ? value.toFixed(5) : "—";

const INITIAL_SITES: Site[] = [
  {
    id: 1001,
    name: "Downtown Small Cell",
    address: "123 Market St",
    client: "Metro Wireless",
    status: "Active",
    category: "Small Cell",
    scopeOfWork:
      "Install pole-mounted radio, integrate power meter, provide closeout photos.",
    scopeItems: [
      "Mount enclosure at 20ft",
      "Pull power circuit",
      "Label equipment",
    ],
    preferredMaterials: ["Small cell antenna", "Fiber jumper 10m"],
    items: [
      {
        id: 5001,
        label: "Pole Radio Node",
        type: "Radio",
        serialOrTag: "SC-2024-001",
        photoListId: 1,
        updates: [],
      },
    ],
  },
  {
    id: 1002,
    name: "Hilltop Macro",
    address: "840 Ridge Rd",
    client: "Skyline Mobile",
    status: "Planned",
    category: "Macro",
    scopeOfWork: "Set new cabinet, integrate fiber trunk, document alarms.",
    scopeItems: [
      "Install hybrid cabinet",
      "Terminate power feeds",
      "Validate alarms",
    ],
    preferredMaterials: ["Hybrid trunk cable"],
    items: [
      {
        id: 5002,
        label: "Baseband Cabinet",
        type: "Cabinet",
        serialOrTag: "MAC-7788",
        photoListId: 2,
        updates: [],
      },
    ],
  },
];

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <Button
    variant={active ? "default" : "ghost"}
    className={`whitespace-nowrap ${active ? "shadow" : ""}`}
    onClick={onClick}
  >
    {icon}
    {label}
  </Button>
);

const RequirementRow: React.FC<{
  requirement: PhotoRequirement;
  count: number;
  onUpload: (files: FileList | null) => void;
  inputId: string;
}> = ({ requirement, count, onUpload, inputId }) => (
  <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
    <div className="flex flex-col">
      <span className="font-medium text-slate-900">{requirement.label}</span>
      <span className="text-xs text-slate-600">
        Min {requirement.min}
        {requirement.hint ? ` · ${requirement.hint}` : ""}
      </span>
    </div>
    <div className="flex items-center gap-3">
      <Badge variant={count >= requirement.min ? "default" : "outline"}>
        {count} / {requirement.min}
      </Badge>
      <div>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          aria-label={`Upload photo for ${requirement.label}`}
          onChange={(event) => onUpload(event.target.files)}
        />
        <label htmlFor={inputId}>
          <Button size="sm" type="button" variant="secondary">
            <Camera className="h-4 w-4" />
            Add
          </Button>
        </label>
      </div>
    </div>
  </div>
);

const MaterialsCatalog: React.FC<{
  category: Site["category"];
  onPin: (material: string) => void;
  preferred: string[];
}> = ({ category, onPin, preferred }) => {
  const materials = MATERIALS_BY_CATEGORY[category] ?? [];
  return (
    <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1 text-sm">
      {materials.map((material) => {
        const isPinned = preferred.includes(material);
        return (
          <div
            key={material}
            className={`flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 ${
              isPinned ? "bg-slate-100" : "bg-white"
            }`}
          >
            <span className="text-slate-800">{material}</span>
            <Button
              type="button"
              size="sm"
              variant={isPinned ? "ghost" : "outline"}
              onClick={() => onPin(material)}
            >
              <Pin className="h-3.5 w-3.5" />
              {isPinned ? "Pinned" : "Add"}
            </Button>
          </div>
        );
      })}
      {materials.length === 0 && (
        <span className="text-sm text-slate-500">No catalog entries.</span>
      )}
    </div>
  );
};

const WorkDocsApp: React.FC = () => {
  const [tab, setTab] = useState<"sites" | "import" | "templates" | "tests">(
    "sites",
  );
  const [sites, setSites] = useState<Site[]>(INITIAL_SITES);
  const [selectedSiteId, setSelectedSiteId] = useState<number>(
    INITIAL_SITES[0]?.id ?? 0,
  );
  const [selectedItemId, setSelectedItemId] = useState<number | null>(
    INITIAL_SITES[0]?.items[0]?.id ?? null,
  );
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [scopeItemInput, setScopeItemInput] = useState("");
  const [newItemForm, setNewItemForm] = useState({
    label: "",
    type: "",
    serial: "",
    photoListId: PHOTO_LISTS[0]?.id ?? 1,
  });
  const [activeUpdate, setActiveUpdate] = useState<ActiveUpdate | null>(null);
  const [testCounter, setTestCounter] = useState(0);

  useEffect(() => {
    const site = sites.find((s) => s.id === selectedSiteId);
    if (!site) {
      setSelectedSiteId(sites[0]?.id ?? 0);
      setSelectedItemId(sites[0]?.items[0]?.id ?? null);
      return;
    }
    if (!site.items.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(site.items[0]?.id ?? null);
    }
  }, [sites, selectedSiteId, selectedItemId]);

  useEffect(() => {
    if (!activeUpdate) {
      return;
    }
    const exists = sites.some(
      (site) =>
        site.id === activeUpdate.siteId &&
        site.items.some((item) => item.id === activeUpdate.itemId),
    );
    if (!exists) {
      setActiveUpdate(null);
    }
  }, [sites, activeUpdate?.siteId, activeUpdate?.itemId]);

  const selectedSite = useMemo(
    () => sites.find((site) => site.id === selectedSiteId) ?? null,
    [sites, selectedSiteId],
  );

  const selectedItem = useMemo(() => {
    if (!selectedSite || selectedItemId == null) {
      return null;
    }
    return selectedSite.items.find((item) => item.id === selectedItemId) ?? null;
  }, [selectedSite, selectedItemId]);

  const filteredSites = useMemo(
    () => filterSitesByCategory(sites, categoryFilter),
    [sites, categoryFilter],
  );

  const tests = useMemo(() => runRuntimeTests(), [testCounter]);

  const handleScopeItemAdd = () => {
    const value = scopeItemInput.trim();
    if (!value || !selectedSite) {
      return;
    }
    setSites((prev) =>
      prev.map((site) =>
        site.id === selectedSite.id
          ? { ...site, scopeItems: [...site.scopeItems, value] }
          : site,
      ),
    );
    setScopeItemInput("");
  };

  const handleScopeItemRemove = (item: string) => {
    if (!selectedSite) {
      return;
    }
    setSites((prev) =>
      prev.map((site) =>
        site.id === selectedSite.id
          ? {
              ...site,
              scopeItems: site.scopeItems.filter((scope) => scope !== item),
            }
          : site,
      ),
    );
  };

  const handleScopeItemsLoad = () => {
    if (!selectedSite) {
      return;
    }
    const defaults = SCOPE_ITEM_SEEDS[selectedSite.category] ?? [];
    setSites((prev) =>
      prev.map((site) =>
        site.id === selectedSite.id
          ? {
              ...site,
              scopeItems: Array.from(
                new Set([...site.scopeItems, ...defaults]),
              ),
            }
          : site,
      ),
    );
  };

  const handleScopeItemsClear = () => {
    if (!selectedSite) {
      return;
    }
    setSites((prev) =>
      prev.map((site) =>
        site.id === selectedSite.id
          ? {
              ...site,
              scopeItems: [],
            }
          : site,
      ),
    );
  };

  const handlePreferredMaterialToggle = (material: string) => {
    if (!selectedSite) {
      return;
    }
    setSites((prev) =>
      prev.map((site) => {
        if (site.id !== selectedSite.id) {
          return site;
        }
        const exists = site.preferredMaterials.includes(material);
        return {
          ...site,
          preferredMaterials: exists
            ? site.preferredMaterials.filter((mat) => mat !== material)
            : [...site.preferredMaterials, material],
        };
      }),
    );
  };

  const handlePreferredMaterialRemove = (material: string) => {
    if (!selectedSite) {
      return;
    }
    setSites((prev) =>
      prev.map((site) =>
        site.id === selectedSite.id
          ? {
              ...site,
              preferredMaterials: site.preferredMaterials.filter(
                (mat) => mat !== material,
              ),
            }
          : site,
      ),
    );
  };

  const handleSiteFieldChange = <K extends keyof Site>(
    key: K,
    value: Site[K],
  ) => {
    if (!selectedSite) {
      return;
    }
    setSites((prev) =>
      prev.map((site) =>
        site.id === selectedSite.id
          ? {
              ...site,
              [key]: value,
            }
          : site,
      ),
    );
  };

  const handleAddItem = () => {
    if (!selectedSite || !newItemForm.label.trim()) {
      return;
    }
    const item: Item = {
      id: createId(),
      label: newItemForm.label.trim(),
      type: newItemForm.type.trim(),
      serialOrTag: newItemForm.serial.trim(),
      photoListId: newItemForm.photoListId ?? PHOTO_LISTS[0]?.id ?? 1,
      updates: [],
    };
    setSites((prev) =>
      prev.map((site) =>
        site.id === selectedSite.id
          ? {
              ...site,
              items: [...site.items, item],
            }
          : site,
      ),
    );
    setSelectedItemId(item.id);
    setNewItemForm({
      label: "",
      type: "",
      serial: "",
      photoListId: item.photoListId,
    });
  };

  const handleStartUpdate = () => {
    if (!selectedSite || !selectedItem) {
      return;
    }
    setActiveUpdate({
      siteId: selectedSite.id,
      itemId: selectedItem.id,
      packet: createUpdatePacket(createId(), Date.now()),
    });
  };

  const updateActivePacket = (updater: (packet: UpdatePacket) => UpdatePacket) => {
    setActiveUpdate((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, packet: updater(prev.packet) };
    });
  };

  const handleRequiredPhotoUpload = (
    requirement: PhotoRequirement,
    files: FileList | null,
  ) => {
    if (!activeUpdate || !files || files.length === 0) {
      return;
    }
    const file = files[0];
    const photo: Photo = {
      id: createId(),
      label: requirement.label,
      fileName: file.name,
      takenAt: Date.now(),
      url: URL.createObjectURL(file),
      materialId: null,
    };
    updateActivePacket((packet) => addPhotoToPacket(packet, photo));
  };

  const handleMaterialPhotoUpload = (
    material: MaterialLine,
    files: FileList | null,
  ) => {
    if (!activeUpdate || !files || files.length === 0) {
      return;
    }
    const file = files[0];
    const photo: Photo = {
      id: createId(),
      label: `Material: ${material.name || material.id}`,
      fileName: file.name,
      takenAt: Date.now(),
      url: URL.createObjectURL(file),
      materialId: material.id,
    };
    updateActivePacket((packet) => addPhotoToPacket(packet, photo));
  };

  const handleMaterialAdd = () => {
    if (!activeUpdate) {
      return;
    }
    const newMaterial: MaterialLine = {
      id: createId(),
      name: "",
      qty: 1,
      unit: "ea",
    };
    updateActivePacket((packet) => ({
      ...packet,
      materials: [...packet.materials, newMaterial],
    }));
  };

  const handleMaterialFieldChange = (
    materialId: number,
    field: keyof MaterialLine,
    value: string,
  ) => {
    updateActivePacket((packet) => ({
      ...packet,
      materials: packet.materials.map((material) =>
        material.id === materialId
          ? {
              ...material,
              [field]:
                field === "qty"
                  ? Number(value) || 0
                  : (value as MaterialLine[typeof field]),
            }
          : material,
      ),
    }));
  };

  const handleMaterialRemove = (materialId: number) => {
    updateActivePacket((packet) => removeMaterialAndLinkedPhotos(packet, materialId));
  };

  const handlePhotoDelete = (photoId: number) => {
    updateActivePacket((packet) => ({
      ...packet,
      photos: packet.photos.filter((photoEntry) => photoEntry.id !== photoId),
    }));
  };

  const handleCompleteUpdate = () => {
    if (!activeUpdate) {
      return;
    }
    const siteId = activeUpdate.siteId;
    const itemId = activeUpdate.itemId;
    const packetToSave: UpdatePacket = {
      ...activeUpdate.packet,
      status: "Complete",
    };
    setSites((prev) =>
      prev.map((site) => {
        if (site.id !== siteId) {
          return site;
        }
        return {
          ...site,
          items: site.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  updates: [...item.updates, packetToSave],
                }
              : item,
          ),
        };
      }),
    );
    setActiveUpdate(null);
  };

  const selectedPhotoList = selectedItem
    ? photoListById(selectedItem.photoListId)
    : undefined;

  const canComplete = activeUpdate
    ? selectedPhotoList
      ? areRequirementsMet(selectedPhotoList.requirements, activeUpdate.packet.photos)
      : true
    : false;

  const handleCsvUpload = (file: File | null) => {
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setSites((prev) => upsertSitesFromCsv(text, prev));
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <header className="flex flex-col gap-2 border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900">
            Telecom Work Documentation
          </h1>
          <p className="text-sm text-slate-600">
            Coordinate scope, field updates, and material usage for construction
            projects.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <TabButton
              active={tab === "sites"}
              onClick={() => setTab("sites")}
              icon={<Building2 className="h-4 w-4" />}
              label="Sites"
            />
            <TabButton
              active={tab === "import"}
              onClick={() => setTab("import")}
              icon={<Upload className="h-4 w-4" />}
              label="Import"
            />
            <TabButton
              active={tab === "templates"}
              onClick={() => setTab("templates")}
              icon={<ImageIcon className="h-4 w-4" />}
              label="Templates"
            />
            <TabButton
              active={tab === "tests"}
              onClick={() => setTab("tests")}
              icon={<ListChecks className="h-4 w-4" />}
              label="Tests"
            />
          </div>
        </header>

        {tab === "sites" && (
          <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Filter className="h-4 w-4" /> Filter by Category
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  {["All", ...CATEGORY_OPTIONS].map((option) => (
                    <Button
                      key={option}
                      variant={categoryFilter === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryFilter(option as CategoryFilter)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {filteredSites.length === 0 && (
                  <div className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                    No sites found.
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  {filteredSites.map((site) => (
                    <motion.button
                      key={site.id}
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      onClick={() => {
                        setSelectedSiteId(site.id);
                        setSelectedItemId(site.items[0]?.id ?? null);
                      }}
                      className={`flex flex-col gap-2 rounded-lg border p-3 text-left shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500 ${
                        site.id === selectedSiteId
                          ? "border-slate-800 bg-slate-900/5"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900">
                            {site.name}
                          </span>
                          <span className="text-xs text-slate-500">{site.client}</span>
                        </div>
                        <Badge variant="outline">{site.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {site.status}
                        </span>
                        <span>
                          {formatLatLng(site.lat)}, {formatLatLng(site.lng)}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              {selectedSite ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Building2 className="h-4 w-4" /> Site Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="text-sm font-medium text-slate-700">
                          Client
                          <Input
                            value={selectedSite.client}
                            onChange={(event) =>
                              handleSiteFieldChange("client", event.target.value)
                            }
                          />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                          Status
                          <Input
                            value={selectedSite.status}
                            onChange={(event) =>
                              handleSiteFieldChange("status", event.target.value)
                            }
                          />
                        </label>
                      </div>
                      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                        Category
                        <select
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                          value={selectedSite.category}
                          onChange={(event) =>
                            handleSiteFieldChange(
                              "category",
                              event.target.value as Site["category"],
                            )
                          }
                        >
                          {CATEGORY_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                        Scope of Work
                        <Textarea
                          rows={3}
                          value={selectedSite.scopeOfWork}
                          onChange={(event) =>
                            handleSiteFieldChange(
                              "scopeOfWork",
                              event.target.value,
                            )
                          }
                        />
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={handleScopeItemsLoad}
                        >
                          <ClipboardList className="h-4 w-4" /> Load from Category
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleScopeItemsClear}
                        >
                          <X className="h-4 w-4" /> Clear
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedSite.scopeItems.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-800"
                          >
                            {item}
                            <button
                              type="button"
                              aria-label={`Remove ${item}`}
                              className="text-slate-600 hover:text-slate-900"
                              onClick={() => handleScopeItemRemove(item)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add scope item"
                          value={scopeItemInput}
                          onChange={(event) => setScopeItemInput(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleScopeItemAdd();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleScopeItemAdd}>
                          <Plus className="h-4 w-4" /> Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <FileText className="h-4 w-4" /> Materials Catalog – {" "}
                        {selectedSite.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <MaterialsCatalog
                        category={selectedSite.category}
                        onPin={handlePreferredMaterialToggle}
                        preferred={selectedSite.preferredMaterials}
                      />
                      <Separator />
                      <div className="flex flex-wrap gap-2">
                        {selectedSite.preferredMaterials.map((material) => (
                          <span
                            key={material}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs text-white"
                          >
                            {material}
                            <button
                              type="button"
                              aria-label={`Remove ${material} from preferred`}
                              onClick={() => handlePreferredMaterialRemove(material)}
                              className="text-white/80 hover:text-white"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                        {selectedSite.preferredMaterials.length === 0 && (
                          <span className="text-xs text-slate-500">
                            Preferred list empty – pin catalog entries to store.
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <ClipboardList className="h-4 w-4" /> Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedSite.items.map((item) => (
                          <Button
                            key={item.id}
                            variant={selectedItem?.id === item.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedItemId(item.id)}
                          >
                            {item.label}
                          </Button>
                        ))}
                        {selectedSite.items.length === 0 && (
                          <span className="text-sm text-slate-500">
                            No items yet.
                          </span>
                        )}
                      </div>
                      <div className="grid gap-3 border-t border-slate-200 pt-3 md:grid-cols-4">
                        <label className="text-sm font-medium text-slate-700">
                          Label
                          <Input
                            value={newItemForm.label}
                            onChange={(event) =>
                              setNewItemForm((prev) => ({
                                ...prev,
                                label: event.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                          Type
                          <Input
                            value={newItemForm.type}
                            onChange={(event) =>
                              setNewItemForm((prev) => ({
                                ...prev,
                                type: event.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                          Serial / Tag
                          <Input
                            value={newItemForm.serial}
                            onChange={(event) =>
                              setNewItemForm((prev) => ({
                                ...prev,
                                serial: event.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                          Photo List
                          <select
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            value={newItemForm.photoListId ?? undefined}
                            onChange={(event) =>
                              setNewItemForm((prev) => ({
                                ...prev,
                                photoListId: Number(event.target.value),
                              }))
                            }
                          >
                            {PHOTO_LISTS.map((list) => (
                              <option key={list.id} value={list.id}>
                                {list.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <Button type="button" onClick={handleAddItem}>
                        <Plus className="h-4 w-4" /> Add Item
                      </Button>
                      {selectedItem && (
                        <div className="space-y-4 rounded-lg border border-slate-200 p-4">
                          <div className="flex flex-col gap-1">
                            <h4 className="text-base font-semibold text-slate-900">
                              {selectedItem.label}
                            </h4>
                            <span className="text-xs text-slate-500">
                              {selectedItem.type} · {selectedItem.serialOrTag}
                            </span>
                            {selectedPhotoList && (
                              <span className="text-xs text-slate-500">
                                Photo List: {selectedPhotoList.name}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button type="button" onClick={handleStartUpdate}>
                              <Plus className="h-4 w-4" /> Start Update
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-slate-800">
                              Previous Packets
                            </h5>
                            {selectedItem.updates.length === 0 && (
                              <span className="text-xs text-slate-500">
                                No updates submitted yet.
                              </span>
                            )}
                            <div className="flex flex-col gap-2">
                              {selectedItem.updates.map((update) => (
                                <div
                                  key={update.id}
                                  className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-slate-700">
                                      {formatDateTime(update.createdAt)}
                                    </span>
                                    <Badge variant={update.status === "Complete" ? "default" : "outline"}>
                                      {update.status}
                                    </Badge>
                                  </div>
                                  <p className="mt-2 text-slate-600">
                                    {update.notes || "No notes provided."}
                                  </p>
                                  {update.photos.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {update.photos.map((photoEntry) => (
                                        <span
                                          key={photoEntry.id}
                                          className="rounded-full bg-white px-3 py-1 text-[10px] text-slate-700"
                                        >
                                          {photoEntry.label}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {activeUpdate &&
                            activeUpdate.siteId === selectedSite.id &&
                            activeUpdate.itemId === selectedItem.id && (
                              <div className="space-y-4 rounded-lg border border-slate-300 bg-white p-4">
                                <h5 className="text-sm font-semibold text-slate-900">
                                  Update Runner
                                </h5>
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="flex flex-col gap-3">
                                    <h6 className="text-xs font-semibold uppercase text-slate-500">
                                      Required Photos
                                    </h6>
                                    {selectedPhotoList?.requirements.map((requirement, index) => (
                                      <RequirementRow
                                        key={requirement.label}
                                        requirement={requirement}
                                        count={countPhotosForRequirement(
                                          activeUpdate.packet.photos,
                                          requirement,
                                        )}
                                        onUpload={(files) =>
                                          handleRequiredPhotoUpload(requirement, files)
                                        }
                                        inputId={`req-${requirement.label.replace(/\s+/g, "-")}-${index}`}
                                      />
                                    ))}
                                    {(!selectedPhotoList ||
                                      selectedPhotoList.requirements.length === 0) && (
                                      <span className="text-xs text-slate-500">
                                        No required photos configured for this item.
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-3">
                                    <label className="text-sm font-medium text-slate-700">
                                      Notes
                                      <Textarea
                                        rows={4}
                                        value={activeUpdate.packet.notes}
                                        onChange={(event) =>
                                          updateActivePacket((packet) => ({
                                            ...packet,
                                            notes: event.target.value,
                                          }))
                                        }
                                      />
                                    </label>
                                    <div className="space-y-2">
                                      <h6 className="text-xs font-semibold uppercase text-slate-500">
                                        Materials Used
                                      </h6>
                                      <div className="flex flex-col gap-3">
                                        {activeUpdate.packet.materials.map((material) => (
                                          <div
                                            key={material.id}
                                            className="rounded-md border border-slate-200 p-3"
                                          >
                                            <div className="grid gap-2 text-sm md:grid-cols-[1fr,120px,80px,auto] md:items-center md:gap-3">
                                              <Input
                                                placeholder="Material name"
                                                value={material.name}
                                                onChange={(event) =>
                                                  handleMaterialFieldChange(
                                                    material.id,
                                                    "name",
                                                    event.target.value,
                                                  )
                                                }
                                              />
                                              <Input
                                                type="number"
                                                min={0}
                                                value={material.qty}
                                                onChange={(event) =>
                                                  handleMaterialFieldChange(
                                                    material.id,
                                                    "qty",
                                                    event.target.value,
                                                  )
                                                }
                                              />
                                              <Input
                                                placeholder="Unit"
                                                value={material.unit}
                                                onChange={(event) =>
                                                  handleMaterialFieldChange(
                                                    material.id,
                                                    "unit",
                                                    event.target.value,
                                                  )
                                                }
                                              />
                                              <div className="flex items-center gap-2">
                                                <div>
                                                  <input
                                                    id={`mat-${material.id}`}
                                                    type="file"
                                                    accept="image/*"
                                                    capture="environment"
                                                    className="hidden"
                                                    aria-label={`Upload photo for material ${material.name}`}
                                                    onChange={(event) =>
                                                      handleMaterialPhotoUpload(
                                                        material,
                                                        event.target.files,
                                                      )
                                                    }
                                                  />
                                                  <label htmlFor={`mat-${material.id}`}>
                                                    <Button type="button" size="sm" variant="secondary">
                                                      <Camera className="h-4 w-4" />
                                                      Add Photo
                                                    </Button>
                                                  </label>
                                                </div>
                                                <Button
                                                  type="button"
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() => handleMaterialRemove(material.id)}
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <Button type="button" variant="secondary" onClick={handleMaterialAdd}>
                                        <Plus className="h-4 w-4" /> Add Material
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h6 className="text-xs font-semibold uppercase text-slate-500">
                                    Photos in Packet
                                  </h6>
                                  {activeUpdate.packet.photos.length === 0 && (
                                    <span className="text-xs text-slate-500">
                                      No photos captured yet.
                                    </span>
                                  )}
                                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {activeUpdate.packet.photos.map((photoEntry) => (
                                      <div
                                        key={photoEntry.id}
                                        className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs"
                                      >
                                        <div className="flex flex-col">
                                          <span className="font-semibold text-slate-800">
                                            {photoEntry.label}
                                          </span>
                                          <span className="text-[10px] text-slate-500">
                                            {formatDateTime(photoEntry.takenAt)}
                                          </span>
                                        </div>
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handlePhotoDelete(photoEntry.id)}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  className="w-full"
                                  onClick={handleCompleteUpdate}
                                  disabled={!canComplete}
                                >
                                  <Check className="h-4 w-4" /> Complete Packet
                                </Button>
                                {!canComplete && (
                                  <p className="text-xs text-red-600">
                                    Complete Packet is disabled until all required photos are
                                    captured.
                                  </p>
                                )}
                              </div>
                            )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent>
                    <p className="text-sm text-slate-500">
                      Select a site to view details.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {tab === "import" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Upload className="h-4 w-4" /> Import Sites via CSV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-slate-600">
                Upload a CSV with headers: <code>name</code>, <code>address</code>,
                <code>client</code>, <code>status</code>, <code>lat</code>, <code>lng</code>,
                <code>scopeOfWork</code>, <code>category</code>. Existing sites with the same
                name and address will be updated.
              </p>
              <div className="flex items-center gap-3">
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  aria-label="Upload CSV of sites"
                  onChange={(event) => handleCsvUpload(event.target.files?.[0] ?? null)}
                />
                <label htmlFor="csv-upload">
                  <Button type="button">
                    <Upload className="h-4 w-4" /> Choose CSV
                  </Button>
                </label>
                <span className="text-xs text-slate-500">
                  Category defaults to "Other" if not recognized.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {tab === "templates" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ImageIcon className="h-4 w-4" /> Photo List Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {PHOTO_LISTS.map((list) => (
                <div key={list.id} className="space-y-2 rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold text-slate-900">
                      {list.name}
                    </h3>
                    <p className="text-sm text-slate-600">{list.description}</p>
                  </div>
                  <ul className="list-inside list-disc text-sm text-slate-700">
                    {list.requirements.map((req) => (
                      <li key={req.label}>
                        <span className="font-medium">{req.label}</span> – Min {req.min}
                        {req.hint ? ` (${req.hint})` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {tab === "tests" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ListChecks className="h-4 w-4" /> In-App Checks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setTestCounter((counter) => counter + 1)}
              >
                <RefreshIcon /> Run Tests
              </Button>
              <ul className="space-y-2 text-sm">
                {tests.map((test) => (
                  <li
                    key={test.name}
                    className={`flex flex-col rounded-md border p-3 ${
                      test.pass
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    <span className="font-medium">
                      {test.pass ? "PASS" : "FAIL"} – {test.name}
                    </span>
                    <span className="text-xs">{test.details}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const RefreshIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M21 12a9 9 0 1 1-3-6.708" />
    <polyline points="21 3 21 9 15 9" />
  </svg>
);

export default WorkDocsApp;

