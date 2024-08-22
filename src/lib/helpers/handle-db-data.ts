import { promises as fs } from "fs"

export async function getDbData<T>(db: string) {
  console.log(process.cwd())
  console.log(await fs.readdir(process.cwd()))
  return JSON.parse(
    await fs.readFile(process.cwd() + `/src/db/${db}.json`, "utf8")
    // await fs.readFile(__dirname + `/src/db/${db}.json`, "utf8")
    // await fs.readFile(`../../db/${db}.json`, "utf8")
  ) as T
}

export async function setDbData<T>(db: string, data: T) {
  await fs.writeFile(
    process.cwd() + `/src/db/${db}.json`,
    // __dirname + `/src/db/${db}.json`,
    // `../../db/${db}.json`,
    JSON.stringify(data, null, 2),
    {
      encoding: "utf-8"
    }
  )
}
