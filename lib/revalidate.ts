/**
 * Revalidates a user's profile page using Next ISR
 * @param hostname The host to revalidate
 * @param studentId The user ID to revalidate
 */
export async function revalidate(
  hostname: string, studentId: string, groupId: string
) {
  const urlPaths = [`/student/${studentId}`, `/sting/${groupId}`];

  
  await Promise.all(urlPaths.map((urlPath) =>
    fetch(`${hostname}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urlPath,
      })
    })));
}