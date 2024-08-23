export function compareArraysByProps(
  arr1: any[],
  arr2: any[],
  props: { [key: string]: any },
  sortKeys: { [key: string]: string }
): boolean {
  if (arr1.length !== arr2.length) return false
  if (!arr1.length && !arr2.length) return true // Both arrays are empty
  if (!arr1.length || !arr2.length) return false // One array is empty, the other is not

  if (arr1.length !== arr2.length) return false

  const sortArray = (arr: any[], key: string) => {
    return [...arr].sort((a, b) =>
      a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0
    )
  }

  const compareObjects = (
    obj1: any,
    obj2: any,
    props: { [key: string]: any }
  ): boolean => {
    return Object.keys(props).every((key) => {
      if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        // Recursively compare nested arrays using the properties defined for this key
        return compareArraysByProps(
          obj1[key],
          obj2[key],
          props[key] as { [key: string]: any },
          sortKeys
        )
      } else {
        // Compare primitive properties
        return obj1[key] === obj2[key]
      }
    })
  }

  const sortKey = sortKeys.main // Primary sort key for the top level
  const sortedArr1 = sortArray([...arr1], sortKey)
  const sortedArr2 = sortArray([...arr2], sortKey)

  return sortedArr1.every((obj, index) => {
    const correspondingObj2 = sortedArr2[index]

    // Check if corresponding object in arr2 exists
    if (!correspondingObj2) return false

    // Sort nested arrays before comparison
    Object.keys(props).forEach((key) => {
      if (Array.isArray(obj[key]) && Array.isArray(correspondingObj2[key])) {
        obj[key] = sortArray([...obj[key]], sortKeys[key] || "id")
        correspondingObj2[key] = sortArray(
          [...correspondingObj2[key]],
          sortKeys[key] || "id"
        )
      }
    })
    return compareObjects(obj, correspondingObj2, props)
  })
}
