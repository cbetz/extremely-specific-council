import { MEMBERS, tally, type CouncilResult } from "./council";
export async function downloadCard(result: CouncilResult) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1120;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Image export is unavailable in this browser.");
  const image = new Image();
  image.src = "/art/council-atlas.png";
  await image.decode();
  ctx.fillStyle = "#fafaf7";
  ctx.fillRect(0, 0, 1200, 1120);
  ctx.fillStyle = "#202020";
  ctx.font = "900 38px Arial";
  ctx.fillText("THE COUNCIL", 48, 65);
  ctx.font = "16px Arial";
  ctx.fillText("OF EXTREMELY SPECIFIC OPINIONS", 48, 94);
  ctx.textAlign = "right";
  ctx.fillStyle = "#3348ee";
  ctx.fillText(
    result.mode === "demo" ? "SCRIPTED DEMO" : "LIVE TYPESAFE VOTE",
    1152,
    65,
  );
  ctx.textAlign = "left";
  ctx.font = "bold 29px Arial";
  ctx.fillStyle = "#202020";
  const words = result.idea.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > 1085 && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  for (let i = 0; i < Math.min(lines.length, 4); i++) {
    let text = lines[i];
    if (i === 3 && lines.length > 4) text = text.slice(0, -3) + "…";
    ctx.fillText(text, 48, 150 + i * 36, 1104);
  }
  const yStart = 305;
  const colW = 276,
    rowH = 222;
  for (let i = 0; i < MEMBERS.length; i++) {
    const m = MEMBERS[i],
      d = result.decisions.find((v) => v.id === m.id)!;
    const x = 48 + (i % 4) * colW,
      y = yStart + Math.floor(i / 4) * rowH;
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#202020";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, 260, 205, 12);
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + 130, y + 67, 52, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      image,
      (i % 4) * 362,
      Math.floor(i / 4) * 362,
      362,
      350,
      x + 73,
      y + 10,
      114,
      110,
    );
    ctx.restore();
    ctx.textAlign = "center";
    ctx.fillStyle = "#202020";
    ctx.font = "bold 18px Arial";
    ctx.fillText(m.name, x + 130, y + 139, 244);
    ctx.font = "13px Arial";
    ctx.fillStyle = "#62625e";
    ctx.fillText(m.title, x + 130, y + 160, 244);
    ctx.font = "bold 15px Arial";
    ctx.fillStyle =
      d.vote === "yes" ? "#186b44" : d.vote === "no" ? "#b73331" : "#745600";
    ctx.fillText(
      d.vote === "yes" ? "APPROVES" : d.vote === "no" ? "OPPOSES" : "BAFFLED",
      x + 130,
      y + 186,
    );
  }
  const t = tally(result.decisions);
  ctx.textAlign = "left";
  ctx.fillStyle = "#3348ee";
  ctx.font = "bold 27px Arial";
  ctx.fillText(
    `${t.yes} approve. ${t.no} oppose. ${t.confused} need a minute.`,
    48,
    1035,
  );
  ctx.fillStyle = "#62625e";
  ctx.font = "16px Arial";
  ctx.fillText(
    `cbetz/extremely-specific-council · Division: ${t.division}/100`,
    48,
    1072,
  );
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(Error("Image export failed."))),
      "image/png",
    ),
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "the-council-has-opinions.png";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
