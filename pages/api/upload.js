export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido" });

  const { base64 } = req.body;
  if (!base64)
    return res.status(400).json({ error: "Falta base64" });

  try {
    const fileName = `${Date.now()}.pdf`;
    const buffer = Buffer.from(base64, "base64");

    const response = await fetch(
      `https://yefqctzggxbbjrwmbiyf.supabase.co/storage/v1/object/pdfs/${fileName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/pdf",
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE}`,
        },
        body: buffer,
      }
    );
    
    console.log("STATUS:", response.status);
    if (!response.ok) {
      const text = await response.text();
      console.log("TEXT:", text);
      return res.status(500).json({ error: "Error al subir PDF" });
    }

    const publicUrl = `https://yefqctzggxbbjrwmbiyf.supabase.co/storage/v1/object/public/pdfs/${fileName}`;
    res.status(200).json({ url: publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
}