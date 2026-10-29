# Membuat suara "mas Jawa" (neural) untuk lakon bawaan.  Jalankan:  pip install edge-tts  lalu  python buat_suara.py
import asyncio, json, os, re
import edge_tts
SUARA = "jv-ID-DimasNeural"        # pria Jawa. Alternatif pria Indonesia: "id-ID-ArdiNeural"
PROFIL = {                          # nama tokoh: (nada, tempo) semua dalam, dibedakan berat & kecepatan
    "narator": ("-14Hz", "-20%"), "gatotkaca": ("-8Hz", "-8%"), "semar": ("-22Hz", "-22%"),
    "rahwana": ("-30Hz", "-15%"), "dasamuka": ("-30Hz", "-15%"), "werkudara": ("-20Hz", "-12%"),
    "bima": ("-20Hz", "-12%"), "arjuna": ("-4Hz", "-8%"), "hanoman": ("-2Hz", "0%"),
}
async def main():
    ini = os.path.dirname(os.path.abspath(__file__))
    lakon = json.load(open(os.path.join(ini, "lakon.json"), encoding="utf-8"))
    for k, l in lakon.items():
        os.makedirs(os.path.join(ini, "..", "suara", k), exist_ok=True); n = 0
        for baris in l["teks"].split("\n"):
            baris = baris.strip()
            if not baris: continue
            n += 1
            m = re.match(r"^([^:：]{1,24})[:：]\s*(.+)$", baris)
            nama, teks = (m.group(1).strip().lower(), m.group(2).strip()) if m else ("narator", baris)
            nada, tempo = PROFIL.get(nama, ("-10Hz", "-10%"))
            await edge_tts.Communicate(teks, SUARA, rate=tempo, pitch=nada).save(os.path.join(ini, "..", "suara", k, f"{n}.mp3"))
            print(k, n, nama)
asyncio.run(main())
