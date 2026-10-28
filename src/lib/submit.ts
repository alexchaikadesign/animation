/** Отправка формы: JSON-полезная нагрузка + файлы одним multipart-запросом. */
export async function submitForm(
  url: string,
  data: unknown,
  files: File[] = [],
): Promise<{ ok: boolean; errors?: Record<string, string> }> {
  const body = new FormData();
  body.set("data", JSON.stringify(data));
  files.forEach((f) => body.append("files", f, f.name));
  try {
    const res = await fetch(url, { method: "POST", body });
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: Record<string, string> };
    return { ok: res.ok && json.ok !== false, errors: json.errors };
  } catch {
    return { ok: false };
  }
}
