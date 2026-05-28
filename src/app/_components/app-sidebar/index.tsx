// index.ts
const modules = import.meta.glob("./*.ts", { eager: true });

let exportsObj: Record<string, any> = {};

for (const path in modules) {
  if (!path.includes("index.ts")) {
    exportsObj = { ...exportsObj, ...(modules[path] as object) };
  }
}

// Named exports wrapper
export const autoExports = exportsObj;
