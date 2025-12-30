async function handleResponse(res) {
  const text = await res.text();
  try {
    const json = JSON.parse(text || '{}');
    if (!res.ok) throw json;
    return json;
  } catch (err) {
    if (!res.ok) throw { error: text || res.statusText };
    return JSON.parse(text || '{}');
  }
}

export async function registerOwner(payload) {
  const url = '/api/v1/auth/register-owner';

  // Detect File objects in payload to decide multipart vs JSON
  const containsFile = Object.values(payload).some(v =>
    (typeof File !== 'undefined' && v instanceof File) || (v && v instanceof Blob)
  );

  if (containsFile) {
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (v instanceof File || (typeof Blob !== 'undefined' && v instanceof Blob)) {
        fd.append(k, v);
      } else if (typeof v === 'object') {
        fd.append(k, JSON.stringify(v));
      } else {
        fd.append(k, String(v));
      }
    });

    const res = await fetch(url, {
      method: 'POST',
      body: fd,
    });
    return handleResponse(res);
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export default { registerOwner };
