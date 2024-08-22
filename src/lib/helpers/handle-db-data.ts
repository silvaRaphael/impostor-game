import { promises as fs } from "fs"

export async function getDbData<T>(db: string) {
  return JSON.parse(
    await fs.readFile(process.cwd() + `/src/db/${db}.json`, "utf8")
  ) as T
}

export async function setDbData<T>(db: string, data: T) {
  await fs.writeFile(
    process.cwd() + `/src/db/${db}.json`,
    JSON.stringify(data, null, 2),
    {
      encoding: "utf-8"
    }
  )
}
